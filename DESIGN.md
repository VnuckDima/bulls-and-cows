# DESIGN.md

## Data structures and algorithms

Game state is a plain immutable object (`GameState`): `secret`, `length`, `base`, `history`, `status`, `attempts`, `startTime`. History is an array of `GuessEntry` (`{ guess, bulls, cows }`). Every update creates a new object/array instead of mutating: `addGuess` returns `{ ...state, history: [...state.history, entry], ... }`.

`generateSecret(length, base, random)` builds a string of unique digits by recursively picking a random index from the remaining digit pool and removing it.

`evaluateGuess(secret, guess)` lowercases both inputs, counts bulls with `reduce`, then computes cows by filtering unmatched positions and reducing the unmatched secret pool immutably.

`countPossibleSecrets(length, base)` computes permutations P(base, length) = base!/(base-length)! recursively: `count = base * count(length-1, base-1)`, memoized in a `Map`.

## Complexity

- `generateSecret`: O(length * base) — each pick filters the remaining pool.
- `evaluateGuess`: O(n^2) worst case due to `indexOf` in reduce over unmatched arrays, where n = length.
- `isValidGuess`: O(n) — single pass validation plus Set size check.
- `countPossibleSecrets`: O(length) with memoization (O(1) on cache hit).

## Clean Code principles

- Single Responsibility: each function in `src/game.ts` does one thing.
- Pure functions: game logic has no DOM or global mutation except explicit storage helpers.
- Immutability: state updates use spread and new arrays.
- Higher-order functions: `evaluateGuess` and `isValidGuess` use `map/filter/reduce`.
- Currying: `createDigitValidator(base)` returns a predicate.
- Memoization: `countPossibleSecrets` caches results.
- No classes for game logic.