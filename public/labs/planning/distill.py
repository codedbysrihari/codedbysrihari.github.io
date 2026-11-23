"""python distill.py demonstrations.jsonl (NumPy 1.26.4, PyTorch 2.2.2).
Initialise from the exported PPO actor and distil 32-simulation search policies.
"""
import json
from pathlib import Path
import sys
import numpy as np
import torch
from torch import nn

HERE = Path(__file__).resolve().parent
SEED, UPDATES, BATCH = 7361, 1400, 192


def build_data(path):
    positions, masks, targets = [], [], []
    with open(path) as data:
        for line in data:
            row = json.loads(line)
            board = np.zeros((10, 10, 4), dtype=np.uint8)
            flat = board.reshape(100, 4)
            flat[row['body'][1:], 0] = 1
            flat[row['body'][0], 1] = 1
            flat[row['food'], 2] = 1
            flat[row['walls'], 3] = 1
            legal = np.isin(np.arange(4), row['legal'])
            visits = np.square(np.array(row['visits'], dtype=np.float32))
            target = visits / visits.sum()
            positions.append(board)
            masks.append(legal)
            targets.append(target)
    board = np.stack(positions)
    # Clockwise rotation also sends Up to Right, Right to Down, etc.
    augmented = []
    for k in range(4):
        r = np.rot90(board, -k, axes=(1, 2)).reshape(-1, 100, 4)
        augmented.append(np.concatenate([r[:, :, :3].reshape(-1, 300), r[:, :, 3]], axis=1))
    return (torch.from_numpy(np.concatenate(augmented)),
            torch.from_numpy(np.concatenate([np.roll(masks, k, axis=1) for k in range(4)])),
            torch.from_numpy(np.concatenate([np.roll(targets, k, axis=1) for k in range(4)])))


def train(path):
    torch.set_num_threads(2)
    torch.manual_seed(SEED)
    X, legal, soft_target = build_data(path)
    net = nn.Sequential(nn.Linear(400, 64), nn.Tanh(), nn.Linear(64, 64), nn.Tanh(), nn.Linear(64, 4))
    actor = np.fromfile(HERE/'ppo.bin', dtype='<f4')
    cursor = 0
    with torch.no_grad():
        for layer, n in [(net[0], 300), (net[2], 64), (net[4], 64)]:
            width = layer.out_features
            matrix = actor[cursor:cursor+n*width].reshape(n, width)
            layer.weight.zero_()
            layer.weight[:, :n].copy_(torch.from_numpy(matrix.T.copy()))
            cursor += n * width
            layer.bias.copy_(torch.from_numpy(actor[cursor:cursor+width].copy()))
            cursor += width
    opt = torch.optim.AdamW(net.parameters(), lr=.0015)
    for step in range(UPDATES):
        if step == 1000:
            opt.param_groups[0]['lr'] = .0005
        ids = torch.randint(len(X), (BATCH,))
        logits = net(X[ids].float()).masked_fill(~legal[ids], -1e9)
        loss = -(soft_target[ids] * logits.log_softmax(dim=1)).sum(1).mean()
        opt.zero_grad()
        loss.backward()
        opt.step()
    with open(HERE/'student.bin', 'wb') as output:
        for layer in [net[0], net[2], net[4]]:
            for param in [layer.weight.T, layer.bias]:
                output.write(param.detach().contiguous().numpy().astype('<f4').tobytes())
    print('Distilled', len(X)//4, 'positions;', len(X), 'with rotations;', UPDATES, 'optimizer updates.')


if __name__ == '__main__':
    train(sys.argv[1])
