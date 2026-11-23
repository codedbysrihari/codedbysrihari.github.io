"""Train a small Fourier neural operator on periodic viscous Burgers trajectories.
Install torch==2.2.2 and numpy==1.26.4, then run python train_waves.py.
Produces waves.json alongside this script. All training and test data are generated.
"""
import json
from pathlib import Path

import numpy as np
import torch
from torch import nn

FINE, COARSE, WIDTH, MODES = 128, 64, 12, 10
NU, HORIZON, ROLLOUT = .035, .1, 8
STEPS, BATCH, TRAIN_SEED, TEST_SEED = 800, 32, 41, 1901


def initial_fields(seed, count):
    rng = np.random.default_rng(seed)
    x = 2 * np.pi * (np.arange(FINE) + .5) / FINE
    fields = np.zeros((count, FINE))
    for k in range(1, 6):
        a, b = rng.standard_normal((2, count, 1)) / k
        fields += a * np.cos(k * x) + b * np.sin(k * x)
    fields *= rng.uniform(.7, 1.7, (count, 1)) / np.abs(fields).max(1, keepdims=True)
    return fields


def step(fields, substeps):
    dx = 2 * np.pi / fields.shape[-1]
    dt = HORIZON / substeps

    def rhs(u):
        right = np.roll(u, -1, axis=-1)
        flux = (u*u + right*right) / 4 - .5 * np.maximum(abs(u), abs(right)) * (right - u)
        return (np.roll(flux, 1, axis=-1) - flux) / dx + NU * (right - 2*u + np.roll(u, 1, axis=-1)) / dx**2

    for _ in range(substeps):
        first = rhs(fields)
        fields = fields + .5 * dt * (first + rhs(fields + dt * first))
    return fields


def trajectories(seed, count):
    fields = initial_fields(seed, count)
    frames = []
    for t in range(ROLLOUT + 1):
        frames.append(fields.reshape(count, COARSE, 2).mean(2))
        if t < ROLLOUT:
            fields = step(fields, 25)
    return np.stack(frames, axis=1).astype('float32')


class FourierLayer(nn.Module):
    def __init__(self):
        super().__init__()
        self.local = nn.Linear(WIDTH, WIDTH)
        self.real = nn.Parameter(torch.randn(MODES, WIDTH, WIDTH) * .08)
        self.imag = nn.Parameter(torch.randn(MODES, WIDTH, WIDTH) * .08)

    def forward(self, h):
        spectrum = torch.fft.rfft(h, dim=1)
        mixed = torch.zeros_like(spectrum)
        mixed[:, :MODES] = torch.einsum('bmi,mio->bmo', spectrum[:, :MODES], torch.complex(self.real, self.imag))
        return torch.tanh(self.local(h) + torch.fft.irfft(mixed, n=h.shape[1], dim=1))


class WaveOperator(nn.Module):
    def __init__(self):
        super().__init__()
        self.lift = nn.Linear(1, WIDTH)
        self.layers = nn.Sequential(FourierLayer(), FourierLayer())
        self.project = nn.Linear(WIDTH, 1)

    def forward(self, u):
        increment = self.project(self.layers(self.lift(u.unsqueeze(-1)))).squeeze(-1)
        return u + HORIZON * (increment - increment.mean(1, keepdim=True))


def evaluate(model):
    test = trajectories(TEST_SEED, 128)
    start = test[:, 0].copy()
    coarse = start.copy()
    learned = torch.tensor(start)
    rows = []
    with torch.no_grad():
        for t in range(1, ROLLOUT + 1):
            learned = model(learned)
            coarse = step(coarse, 5)
            truth = test[:, t]
            def error(u):
                return float(np.mean(np.linalg.norm(u-truth, axis=1) / np.linalg.norm(truth, axis=1)))
            rows.append({'steps': t, 'operator': error(learned.numpy()), 'coarse': error(coarse), 'persistence': error(start)})
    return rows


def main():
    torch.set_num_threads(2)
    torch.manual_seed(TRAIN_SEED)
    data = trajectories(TRAIN_SEED, 320)
    inputs = torch.tensor(data[:, :-1].reshape(-1, COARSE))
    targets = torch.tensor(data[:, 1:].reshape(-1, COARSE))
    model = WaveOperator()
    optimizer = torch.optim.Adam(model.parameters(), lr=.003)
    for i in range(STEPS):
        if i == 600:
            for group in optimizer.param_groups:
                group['lr'] = .001
        ids = torch.randint(len(inputs), (BATCH,))
        loss = ((model(inputs[ids]) - targets[ids]) / HORIZON).square().mean()
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
    rows = evaluate(model)
    artifact = {'grid': COARSE, 'fine': FINE, 'modes': MODES, 'nu': NU, 'dt': HORIZON,
                'trainSeed': TRAIN_SEED, 'testSeed': TEST_SEED, 'trainFields': 320, 'testFields': 128,
                'steps': STEPS, 'batch': BATCH, 'benchmark': rows,
                'parameters': sum(p.numel() for p in model.parameters()),
                'weights': {name: tensor.tolist() for name, tensor in model.state_dict().items()}}
    Path(__file__).with_name('waves.json').write_text(json.dumps(artifact, separators=(',', ':')))
    print(rows)


if __name__ == '__main__':
    main()
