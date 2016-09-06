# TODO

- Examples

- Async function?
    >>> In util repo
    >>> YES, but how (with promise, etc.)
       
- Router 
    ~~- Router with branches duplicates logic~~
    ~~- Going back from branched to root route triggers error~~
    - With focus on also animations not just tree swaps
       
- Collections
    - use generators and iterators?

- integrate with custom elements
    >>> in separate repo
    - ~~Basic~~
    - Implement polyfill? 
        >>> NO
    - Shadow DOM 
        >>> perhaps separate repo 
    - Helpers for coupling attributes to props
    
- Tighter relation state and props (props not just static)
    >>> Renew props on update as well

## DONE
- Start rerender from root element, how?
    >>> Take root up into ElementPrototype & included dispatch function to ElementPrototype
- Create state store function
    - How to set data in store?
    >>> through callback
- How to introduce new object or array to state?
    >>> Only option: use observe()
- Do slots (like shadow dom)
- Do some kinda of getter/setter / proxy / mutationobserver to check if a value object is changed
    - How to handle array's?
        >>> Handled by Proxy
    - Can objects from state be iterate safely?
        >>> YES
- Observe fallback not correct when setting same value again it is flagged as clean
    >>> Now done with an array
- When state selector makes use of return a new object this object should look at it's children to define if it dirty out not
- InheritObserved
    - Implement aliases
- Marking as clean is only done when root is reached
    , so we should mark whole state as clean (with recursive function)
- mount/append component to normal element
- Use create method of class in component() as well
- In separate repos:
    - event delegation
        >>> in util repo
    - Syntax sugar
        - append in separate repo
            >>> append do no use this name
        - syntax sugar for mount function by extending ElementPrototype
    - Util functions
            >>> In util repo
- Separate extended function in to normal functions
    - Good for testing as well
    - OR Prefix for extended props
- Implement flow
    
## NO
- Do event registering for triggering rerender
    >>> Handled by dispatch function
- Work with template string as well??
    - http://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro
    - http://stackoverflow.com/questions/1763479/how-to-get-the-html-for-a-dom-element-in-javascript
  
## MAYBE
- Make components observable???
- Web worker state store (also for AJAX?)
    - Problem is that state is no accesible through ElementPrototype, not possible in webworker
- prefix create function (must be together with render function
