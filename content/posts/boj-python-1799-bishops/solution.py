from functools import lru_cache


def max_bishops(board):
    n = len(board)
    diagonals = [0] * (2 * n - 1)
    for row in range(n):
        for column in range(n):
            if board[row][column]:
                diagonals[row + column] |= 1 << (row - column + n - 1)

    def solve_color(choices):
        @lru_cache(maxsize=None)
        def dfs(index, used):
            if index == len(choices):
                return 0

            best = dfs(index + 1, used)  # Skip this diagonal.
            available = choices[index] & ~used
            while available:
                bit = available & -available
                available ^= bit
                best = max(best, 1 + dfs(index + 1, used | bit))
            return best

        return dfs(0, 0)

    return solve_color(diagonals[::2]) + solve_color(diagonals[1::2])


if __name__ == "__main__":
    size = int(input())
    grid = [list(map(int, input().split())) for _ in range(size)]
    print(max_bishops(grid))
