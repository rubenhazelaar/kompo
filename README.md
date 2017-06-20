# Kompo

Kompo is a React js like library which tries to stay as simple as possible. No virtual DOM or JSX. 
Kompo loves the DOM & makes it possible to build interfaces through components.

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/rubenhazelaar/kompo/master/LICENSE)
[![Build Status](https://travis-ci.org/rubenhazelaar/kompo.svg?branch=master)](https://travis-ci.org/rubenhazelaar/kompo)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)](http://commitizen.github.io/cz-cli/)
[![Dependency Status](https://david-dm.org/rubenhazelaar/kompo.svg?style=flat-square)](https://david-dm.org/rubenhazelaar/kompo)
[![devDependency Status](https://david-dm.org/rubenhazelaar/kompo/dev-status.svg?style=flat-square)](https://david-dm.org/rubenhazelaar/kompo#info=devDependencies)

It's lightweight (3KB minified & gzipped), easy to understand & use. 
 
Kompo's core concept is that of components. Together with a simple Router (inspired by Ember & React routers)
 and some helpers Kompo helps to build interfaces, which load fast and stay fast.
 
IMPORTANT: This document describes v1 of the Kompo library which has a very different API from older versions
 
## Install

```bash
npm install --save kompo
```

## Build

```bash
npm run build
```

Need the UMD or minified build? Use:

```bash
npm run build:umd
```

```bash 
npm run build:min
```

Build the examples with the following command:

```bash
npm run examples:build

```
Or use the one below if you want to experiment.

```bash
npm run examples:watch
```

## Test

```bash
npm test
```

Please note: testing is still a work-in-progress and you can help out! Please check out the 'Contribute' section below.

## How to use

The following example covers the basic functionalities of Kompo:
  
```javascript 
import construct, {react} from '../../../src/component/component';
import dispatch from '../../../src/state/dispatch';
import app from '../../../src/state/app';

// Create a component from a div element
const hello = construct('div', function({name}) {
    // Create its children
    const h1 = document.createElement('h1'),
        input = document.createElement('input');

    // Add some even listeners in which
    // the dispatch function dispatches
    // changes to the state
    input.addEventListener('keyup', () => {
        dispatch(this, state => {
            state.name = input.value;
        });
    });

    // React to a state change (triggered by dispatch())
    react(this, state => {
        h1.textContent = 'Hello world, this is ' + (state.name? state.name: name);
    });

    // Last, but not least. Attach the children
    this.appendChild(h1);
    this.appendChild(input);
},{
    // Some default properties
    name: 'Kompo'
});

// Setup state
const state = {
    name: ''
};

// Create instance of the component
// and initialize application with state
const a = app(hello(), state);

// Kick-off app and append to body
document.body.appendChild(a.start());
```

The example above is taken from the extendedHelloWorld example in the `./examples` folder.
For more details look at the section 'Concepts' below or at the examples.

## Concepts

Kompo is inspired by a few key ideas:

* An interface library should be simple and easy to use. No JSX, special debugging tools or a lot of boilerplate. 
Just the tools you are used to work with.
* Stand on the shoulders of giants, and this giant is called the DOM. Rather than moving away from the DOM, it should be 
made accessible and usable in a way that helps users create, render en re-render interfaces efficiently.
* Small footprint
* As 'vanilla' as possible, with some optional enhancements
* The developer knows best
* Future facing (supports all modern browsers and IE10+)

In order to make it possible to work with components in a efficient manner in the DOM, 
Kompo uses some concepts to help the user. These should not sound too unfamiliar:
 
* Composable & Reusable Components
* State versus Properties
* Action & Reaction
* Imperative versus Declarative

### Components

A component in Kompo forms the main building block in Kompo. A component contains all the logic, actions and reactions involving that 
 specific component. Some key features:
 
* All interfaces start with a root component (comparable with React), and from this root, all children 
 components are rendered and re-rendered.  
* A component can be statefull or not. Good indications of when a component uses state are the usage of functions such as `mount()`, `getState()` or `react`).
* A component can have properties, however properties should not be confused with the state of a component. 

Defining and using a component is easy:

```javascript
// Component class
import component from 'kompo';
import childComponent from 'your/code/childComponent.js';

// Create a component based on a div element
export default component.construct('div', function({name}) {
    const child = childComponent(/* Some properties here */);
    
    // Do your magic (events, etc.)
    
    // Append the child component through mount.
    // The selector function passes the child
    // the state it needs.
    component.mount(this, child, state => {
        return state.some.part;
    });
});
```

Going on ...

### State versus Properties

Properties of components are those that you as creator define and remain unchanged throughout the run time of your application.

State is that which is influenced by user actions (such as clicks) or calls going to or coming in from a server. State in a Kompo
 application can be defined by an object literal (POJO). This object can be as simple or complex as it needs to be.
 A special function to help you to react to changes in your state is called `react()` and it looks like this:
  
```javascript
// In a construct function of some component ...

react(this, (state, component) => { // component === this
    // Work with state here
    
    // TIP: 
    //
    // TL;DR: Return ASAP if state has not changed
    //
    // To re-render the application efficiently it's important to
    // determine if re-rendering is really needed by performing 
    // checks (and returning) as soon as possible. 
    // More on this in the section 'Action & Reaction'.
});

// ... some more stateless work
```

All state is made observable by Kompo and `react()` callbacks are only called when something in the state of the component
has changed.

Of course it is not only necessary to react to changes in the state. It is also necessary to make those changes.
A prime example is of course that of handling events:

```javascript
// In a construct function of some component ...

const button = document.createElement('a');

button.addEventListener('click', e => {
    // Perform some action
    // and if it is necessary to change the state
    // Do so with the dispatch function:
    dispatch(this, state => {
         // some change in the state
    });
});
```

For more complex situations events can also be delegated. Use the delegate function in the komp-util repo for this. 

### API Reference

WIP

## Changelog

- Version 1.2.1: Added code splitting functionality in router functions 
- Version 1.3.0: Change to rendering from bottom-up to top-down. Can break components considerably 

## Todo

- Props for routes (like title, page, etc.)

- Util function for chaining selectors?

- Observe only certain props, how?

- Implement babel babili and compile using https://github.com/babel/babel-preset-env 

- Can Kompo component by extended by a class for custom elements?
- Change order of appendChild and render() in mount and append functions?
    >>> NO, in order to prevent multiple reflows, YES in component.mount()
- Inline documentation
- API Reference
- AJAX example (using Fetch API)

## Contribute

Would you like to contribute? Great!

Please keep the following in mind:

* Please follow the existing code style.  You can also use `npm run lint` to help.
* Write your code in a fashion which is easy to read and understand.
* Commit your changes by using `npm run commit`.
* Create pull requests for proposals or possible additions to the code base.
* Testing, testing, testing. Still a lot of work here. However each feature should come with a test.
