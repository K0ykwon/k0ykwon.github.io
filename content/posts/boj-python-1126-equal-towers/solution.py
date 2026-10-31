def tallest_equal_towers(blocks):
    limit = sum(blocks) // 2
    states = {0: 0}  # height difference -> tallest possible higher tower

    for block in sorted(blocks):
        next_states = states.copy()  # Not using this block.
        for difference, higher in states.items():
            candidates = (
                (difference + block, higher + block),
                (abs(difference - block), higher + max(block - difference, 0)),
            )
            for new_difference, new_higher in candidates:
                if new_higher <= limit:
                    next_states[new_difference] = max(
                        next_states.get(new_difference, -1), new_higher
                    )
        states = next_states

    answer = states.get(0, 0)
    return answer if answer > 0 else -1


if __name__ == "__main__":
    _ = int(input())
    heights = list(map(int, input().split()))
    print(tallest_equal_towers(heights))
