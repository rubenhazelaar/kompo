# TODO

- Adjust README.md to reflect changes
    - Typescript
    - Simplify
- Implement read-only mode of state from store.
    - Lock for writing when reacting
    - OR lock ALWAYS except for inside dispatch function
        - Throw Error an attempt to modify is done?
- Testing
    - Tests to prove the store
- A generic appendChildren() function?
    - See `link.ts`
- Create build & publish strategy
    - At the moment an index.ts exists which has an opinioned export structure. 
    But perhaps import straight from the `./src` directory structure is better/feasible? 