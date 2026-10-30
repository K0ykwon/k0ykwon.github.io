MOD = 1_000_000_000


def polygon_partitions(n):
    triangles = [0] * (n + 1)
    triangles[2] = 1  # An empty subproblem along a single edge.
    for size in range(3, n + 1):
        triangles[size] = sum(
            triangles[left] * triangles[size + 1 - left]
            for left in range(2, size)
        ) % MOD

    if n % 2:
        return triangles[n], 0

    faces = (n - 2) // 2
    quadrangles = [0] * (faces + 1)
    pairs = [0] * (faces + 1)
    quadrangles[0] = pairs[0] = 1
    for count in range(1, faces + 1):
        quadrangles[count] = sum(
            pairs[left] * quadrangles[count - 1 - left]
            for left in range(count)
        ) % MOD
        pairs[count] = sum(
            quadrangles[left] * quadrangles[count - left]
            for left in range(count + 1)
        ) % MOD

    return triangles[n], quadrangles[faces]


if __name__ == "__main__":
    triangular, quadrilateral = polygon_partitions(int(input()))
    print(triangular)
    print(quadrilateral)
