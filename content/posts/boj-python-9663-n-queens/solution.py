def count_queens(n):
    full = (1 << n) - 1

    def dfs(row, columns, diagonal_left, diagonal_right):
        if row == n:
            return 1

        available = full & ~(columns | diagonal_left | diagonal_right)
        count = 0
        while available:
            bit = available & -available
            available ^= bit
            count += dfs(
                row + 1,
                columns | bit,
                ((diagonal_left | bit) << 1) & full,
                (diagonal_right | bit) >> 1,
            )
        return count

    return dfs(0, 0, 0, 0)


if __name__ == "__main__":
    print(count_queens(int(input())))
