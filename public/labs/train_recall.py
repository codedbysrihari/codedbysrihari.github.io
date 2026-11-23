"""Train the paged cross-attention memory reader.
Install torch==2.2.2 and numpy==1.26.4, then run python train_recall.py.
The exported JSON is both the browser checkpoint and the benchmark report.
"""
import json
import math
from pathlib import Path

import torch
from torch import nn
from torch.nn import functional as F

KEYS, VALUES, DIM, ROUTE_DIM, PAGE = 96, 10, 24, 12, 4
STEPS, BATCH, TRAIN_SEED, TEST_SEED = 700, 96, 17, 9013


def batch(rng, count, length):
    keys = torch.rand(count, KEYS, generator=rng).argsort(dim=1)[:, :length]
    values = torch.randint(VALUES, (count, length), generator=rng)
    pos = torch.randint(length, (count,), generator=rng)
    row = torch.arange(count)
    return keys, values, keys[row, pos], pos, values[row, pos]


class PagedReader(nn.Module):
    def __init__(self):
        super().__init__()
        self.key = nn.Embedding(KEYS, DIM)
        self.query = nn.Embedding(KEYS, DIM)
        self.value = nn.Embedding(VALUES, DIM)
        self.route_key = nn.Embedding(KEYS, ROUTE_DIM)
        self.route_query = nn.Embedding(KEYS, ROUTE_DIM)
        self.expand = nn.Linear(DIM, 2 * DIM)
        self.contract = nn.Linear(2 * DIM, DIM)
        self.classify = nn.Linear(DIM, VALUES)
        with torch.no_grad():
            self.query.weight.copy_(self.key.weight)
            self.route_query.weight.copy_(self.route_key.weight)

    def index(self, keys):
        signatures = F.normalize(self.route_key(keys), dim=-1)
        return signatures.reshape(len(keys), -1, PAGE, ROUTE_DIM).sum(2)

    def route(self, pages, query):
        return 6 * torch.einsum('bpd,bd->bp', pages, F.normalize(self.route_query(query), dim=-1))

    def read(self, keys, values, query):
        q = self.query(query)
        scores = torch.einsum('btd,bd->bt', self.key(keys), q) / math.sqrt(DIM)
        context = torch.einsum('bt,btd->bd', scores.softmax(1), self.value(values))
        h = F.layer_norm(q + context, (DIM,))
        h = F.layer_norm(h + self.contract(torch.tanh(self.expand(h))), (DIM,))
        return self.classify(h), scores

    def retrieve(self, keys, values, query, routes, budget):
        pages = routes.topk(budget, dim=1).indices
        offsets = (pages[:, :, None] * PAGE + torch.arange(PAGE)).flatten(1)
        return self.read(keys.gather(1, offsets), values.gather(1, offsets), query)[0], pages


def calibrate(model):
    # Score each true page by the probability mass ranked ahead of it.
    rng = torch.Generator().manual_seed(4021)
    thresholds = {}
    with torch.no_grad():
        for length in (16, 32, 64):
            keys, _, query, pos, _ = batch(rng, 512, length)
            routes = model.route(model.index(keys), query)
            ahead = routes > routes.gather(1, (pos // PAGE)[:, None])
            scores = (routes.softmax(1) * ahead).sum(1)
            rank = math.ceil((len(scores) + 1) * .95)
            thresholds[str(length)] = scores.kthvalue(rank).values.item()
    return thresholds


def evaluate(model, thresholds):
    rng = torch.Generator().manual_seed(TEST_SEED)
    report = []
    with torch.no_grad():
        for length in (16, 32, 64):
            totals = {m: {'correct': 0, 'included': 0, 'scores': 0}
                      for m in ('1', '2', 'adaptive', 'dense')}
            for _ in range(16):
                keys, values, query, pos, target = batch(rng, 128, length)
                routes = model.route(model.index(keys), query)
                probs = routes.softmax(1).sort(1, descending=True).values
                preceding_mass = probs.cumsum(1) - probs
                adaptive = (preceding_mass <= thresholds[str(length)]).sum(1)
                dense, _ = model.read(keys, values, query)
                totals['dense']['correct'] += (dense.argmax(1) == target).sum().item()
                totals['dense']['included'] += len(keys)
                totals['dense']['scores'] += len(keys) * length
                for mode in ('1', '2', 'adaptive'):
                    budgets = adaptive if mode == 'adaptive' else torch.full_like(pos, int(mode))
                    for budget in budgets.unique().tolist():
                        ids = budgets == budget
                        logits, pages = model.retrieve(keys[ids], values[ids], query[ids], routes[ids], budget)
                        covered = (pages == (pos[ids] // PAGE)[:, None]).any(1)
                        totals[mode]['included'] += covered.sum().item()
                        totals[mode]['correct'] += (logits.argmax(1) == target[ids]).sum().item()
                        totals[mode]['scores'] += len(logits) * (length // PAGE + budget * PAGE)
            report.append({'length': length, 'examples': 2048, 'modes': totals})
    return report


def main():
    torch.set_num_threads(2)
    torch.manual_seed(TRAIN_SEED)
    rng = torch.Generator().manual_seed(TRAIN_SEED + 1)
    model = PagedReader()
    optimizer = torch.optim.AdamW(model.parameters(), lr=.005)
    for _ in range(STEPS):
        keys, values, query, pos, target = batch(rng, BATCH, 32)
        routes = model.route(model.index(keys), query)
        prediction, address = model.read(keys, values, query)
        loss = F.cross_entropy(prediction, target) + .6 * F.cross_entropy(routes, pos // PAGE)
        loss = loss + .15 * F.cross_entropy(address, pos)
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
    thresholds = calibrate(model)
    report = evaluate(model, thresholds)
    artifact = {'pageSize': PAGE, 'keys': KEYS, 'trainingLength': 32, 'steps': STEPS,
                'batch': BATCH, 'trainSeed': TRAIN_SEED, 'testSeed': TEST_SEED,
                'parameters': sum(p.numel() for p in model.parameters()), 'benchmark': report,
                'thresholds': thresholds, 'calibrationSeed': 4021, 'calibrationSize': 512,
                'weights': {name: tensor.tolist() for name, tensor in model.state_dict().items()}}
    Path(__file__).with_name('recall.json').write_text(json.dumps(artifact, separators=(',', ':')))
    print(report)


if __name__ == '__main__':
    main()
