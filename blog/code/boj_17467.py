def factorial_mod_prime(n, prime):
    tail = prime - n - 1
    count = min(n, tail)
    factorial = 1
    for value in range(1, count + 1):
        factorial = factorial * value % prime

    if n <= tail:
        return factorial

    # n! = (-1)^(tail + 1) / tail!  (mod prime)
    inverse = pow(factorial, prime - 2, prime)
    sign = 1 if tail % 2 else -1
    return sign * inverse % prime


if __name__ == "__main__":
    n, prime = map(int, input().split())
    print(factorial_mod_prime(n, prime))
