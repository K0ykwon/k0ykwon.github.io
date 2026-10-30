from pathlib import Path
import itertools
import math
import random
import runpy

ROOT = Path(__file__).resolve().parents[1] / "blog" / "code"
queens = runpy.run_path(str(ROOT / "boj_9663.py"))["count_queens"]
bishops = runpy.run_path(str(ROOT / "boj_1799.py"))["max_bishops"]
towers = runpy.run_path(str(ROOT / "boj_1126.py"))["tallest_equal_towers"]
polygons = runpy.run_path(str(ROOT / "boj_2392.py"))["polygon_partitions"]
factorial = runpy.run_path(str(ROOT / "boj_17467.py"))["factorial_mod_prime"]

for n, expected in enumerate([1, 0, 0, 2, 10, 4, 40, 92], start=1):
    assert queens(n) == expected

for prime in [2, 3, 5, 7, 11, 17, 31, 97]:
    for n in range(prime):
        assert factorial(n, prime) == math.factorial(n) % prime
assert factorial(999999936, 999999937) == 999999936

for n in [*range(3, 61), 1000]:
    k = n - 2
    triangular = math.comb(2 * k, k) // (k + 1)
    m = (n - 2) // 2
    quadrilateral = 0 if n % 2 else math.comb(3 * m, m) // (2 * m + 1)
    assert polygons(n) == (triangular % 1_000_000_000, quadrilateral % 1_000_000_000)

rng = random.Random(20261030)
for _ in range(35):
    blocks = [rng.randint(1, 9) for _ in range(rng.randint(1, 7))]
    expected = 0
    for assignment in itertools.product(range(3), repeat=len(blocks)):
        left = sum(h for h, side in zip(blocks, assignment) if side == 1)
        right = sum(h for h, side in zip(blocks, assignment) if side == 2)
        if left == right:
            expected = max(expected, left)
    assert towers(blocks) == (expected or -1)
assert towers([14, 3, 20, 15, 15, 14, 24, 23, 15]) == 64

for allowed in range(512):
    board = [[(allowed >> (r * 3 + c)) & 1 for c in range(3)] for r in range(3)]
    cells = [(r, c) for r in range(3) for c in range(3) if board[r][c]]
    expected = 0
    for subset in range(1 << len(cells)):
        chosen = [cell for i, cell in enumerate(cells) if subset >> i & 1]
        if len({r + c for r, c in chosen}) == len(chosen) == len({r - c for r, c in chosen}):
            expected = max(expected, len(chosen))
    assert bishops(board) == expected

print("Python solution checks passed: samples, edge cases, 3x3 bishop exhaustion, tower oracles, polygon closed forms")
