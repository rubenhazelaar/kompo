# Kompo

Kompo is a react js like library which tries to stay simple as possible. No virtual DOM or JSX. 
Kompo loves the DOM & makes it possible to build interfaces through components.

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/rubenhazelaar/kompo/master/LICENSE)
[![Travis](https://img.shields.io/travis/rust-lang/rust.svg?style=flat-square)]()


It's lightweight (6KB minified & gzipped), easy to understand & use and has no dependencies. The only buildtool you'll need is a bundler 
like browserify or webpack.
 
Kompo's core concept is that of components. Together with a simple Router (inspired by Ember & React routers)
 and some helpers Kompo helps to build interfaces, which load fast and stay fast.
 
## Install

```bash
npm install --save kompo
```

## Build

```bash
npm run build
```

All sources come prebuilt, so no initial build necessary. However if you make some changes, note there is also:

```bash
npm run watch
```

## Test

```bash
npm test
```

Please note: testing is still a work-in-progress and you can help out! Please check the 'Contribute' section below.

## How to use

The following example covers the basic functionalities of Kompo:
  
```javascript 
// Component and content creation classes and functions
import Component from '../../../src/component/Component.js';
import c, { createText } from '../../../src/dom/create.js';
import addExtensions from '../../../src/dom/extension.js';
addExtensions(); // Initialize without prefix

// Setup root component
class App extends Component {
    create() {
        // Create elements
        const root = c(),
            h1 = c('h1', {
                id: 'Primary heading' // Set attributes through an object
            }),
            input = c('input');

        // Event listener, trigger update on keyup
        this.on(input, 'keyup', (e, state) => {
            if(state.name != e.target.value) {
                state.name = e.target.value;
                return true; // If value has changed return true
            }
            return false; // This could be omitted
        });

        // Statefull element, changes when an update is triggered by the event listener above
        this.react((state) => {
            const name = typeof state.name !== 'undefined' && state.name !== ''? state.name: this.props.name;
            h1.replace(createText('Hello world, this is ' + name));
        });

        // Append children to root
        root
            .append(h1, {
               'data-heading': 'Primary heading' // Add more attributes on append
            }, false)
            .append('p').txt('Type your name to say "Hello world": ')
                .append(input);

        // Return the root
        return root;
    }
}

// Set a name as default property
App.defaultProps = {
    name: 'Kompo'
};

// Append component to body; notice the empty state
// and how it is used together with a default property
// in the react callback above
document.body.append(new App().setState({}));
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
* Future facing (supports all modern browsers and IE9+)

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
* Each component must return a single Node or Element that links it with the DOM through the `Component.create()` function. 
Its possible to do all your work in the `create()` function. However perhaps sometimes it's easier to split things up. 
It's all up to you as developer, as long as a components `create()` function returns the root Node or Element.   
* A component can be statefull or not. (State can be set through `Component.mount()` or `Component.setState()`).
* A component can have properties, however properties should not be confused with the state of a component. 
(Properties are usually set through the constructor, however you are free to apply them any way you see fit)

Defining and using a component is easy:

```javascript
// Component class
import Component from 'kompo';
import ChildComponent from 'your/code/ChildComponent.js';

class MyComponent extends Component {
    create() {
        // Create a root Element (or Node)
        const root = document.createElement('div');
        
        // Mount your child component to register it in the update tree
        // Stateless components do not need to be mounted.
        const child = this.mount(new ChildComponent);
        
        // Do your magic
        
        // Append the child component
        root.append(child);
        
        // Finally return a root Element (or Node)
        return root;
    }
}
```

Going on ...

### State versus Properties

Properties of components are those that you as creator define and remain unchanged throughout the run time of your application.

State is that which is influenced by user actions (such as clicks) or calls going to or coming in from a server. State in a Kompo
 application can be defined by an object literal (POJO). This object can be as simple or complex as it needs to be.
 Each component has a special function to help to react to elements which are statefull and it looks like this:
  
```javascript
// In a create function of some component ...

this.react((state, Component) => { // Component === this
    // Work with state here
    
    // TIP: 
    //
    // TL;DR: Return ASAP if state has not changed
    //
    // To re-render the application efficiently it's important to
    // determine if re-rendering is really needed by performing 
    // checks as (and returning) as soon as possible. 
    // More on this in the section 'Action & Reaction'.
});

// ... some more stateless work
```

Of course it is not only necessary to react to changes in the state. It is also necessary to make those changes.
A prime example is of course that of handling events:

```javascript
// In a create function of some component ...

const button = document.createElement('a');

this.on(button, 'click', function(e, state){
    // Perform some action
    
    // If the state has changed
    return true;
    
    // If the state has NOT changed
    return false; // or do not explicitly return at all
});
```

For more complex situations events can also be delegated:

```javascript
this.on(button, 'selector' ,'click', function(e, state, Component){  // etc...  
```

Notice in this example that we have an extra parameter to the callback, namely the child component to which the
matched element from the selector belongs to. With the child component available it is possible to directly deal 
with the component and NOT individual elements. This should preferably be handled inside the (child) component 
in order to enhance containment.

More advanced handling of actions & reactions with some helpers are available, more on that now ...

### Action & Reaction

Every application should be able to trigger an action and react accordingly. To achieve efficient re-rendering of an
 application Kompo provides some helpers. These helpers are called `action`, `AsyncAction`, `Do` and `reaction`. Let's
 start with the last one:
 
```javascript
import reaction from 'kompo'

// In a create function of some component ...

this.react(reaction((state, previous, Component) => {
    // Work with state here
    if(state.some.variable !== previous) {
        // Do the heavy lifting here
    }
    
    // Finally return the part of the the state you 
    // use to compare the parameter previous with.
    return state.some.variable; 
}));

// ... some more stateless work
```

As you can see in the example above the callback for the `Component.react()` function is wrapped in the helper. 
This helper exposes the `previous` parameter. With this parameter you can compare with a part of the state.
 
This works great with some data, however when comparing objects you have to beware that an object of
the same reference can have different data internally. Simply comparing wont cut it. To make it easier to compare
objects you can use the `action` and `Do` helpers. This looks something like this:

```javascript
import action from 'kompo'

// In a create function of some component ...

const button = document.createElement('a');

this.on(button, 'click', action((e, state) => {
    // Perform some action
    
    // If the state has changed
    return new Do(true, state.some.object);
    
    // If the state has NOT changed
    return new Do(false, state.some.object);
}));
``` 

Just like the `reaction` helper we wrap the event callback in the `action` helper and in this case also return the `Do`
helper. This flags if the object has changed or not. The `reaction` helper will then use this flag to determine if the object
is the same as the previous object. So simple comparing the object in the state against the `previous` parameter will suffice.

As you can see, helpers will help you as developer. However you are free to do as you please, which bring us to the 
following section:

### Imperative vs Declarative

Because Kompo strives to stick as close to the DOM as possible it does not implement something like JSX. And because
Nodes & Elements are created through the DOM API (or helpers extended on the DOM API) it is NOT declarative as 
HTML (templates) or JSX would be. Although the extension for the DOM API tries to make declaring and appending elements as
 simple as possible, it is strictly described only as imperative code. More examples
 are found in the `./examples` folder of this repository. The following example is created with help of the DOM API extensions,
  however you can also just use normal DOM API functions such as `appendChild`. 
 
```javascript
import create from 'kompo';

// In a create function of some component ...

// Create elements
const root = create(),
    h1 = create('h1', {
        id: 'Primary heading' // Set attributes through an object
    }).txt('Hello World'),
    input = create('input');

// Structure elements
root
    .append(h1, false)
    .append('p').txt('Type your name to say "Hello world": ')
        .append(input);
        
// Finally return root Element
return root;
```

To register a Component in the component tree it should be mounted in its parent Component using the `Component.mount()`
function. With this function the state is passed to the child Component.

```javascript
import TodoList from './examples/todo/src/component/TodoList'

// In a create function of some component ...

const list = this.mount(new TodoList({
    className: 'TodoList'
}));

// Structure elements
root.append(list);

// Finally return root Element
return root;
```

To compose Components in a more flexible way the `Component.nest()` function can be used. This function serves two purposes. 
The first is to provide inside access to the Component on which the `nest()` function is called through a callback. The 
second is to call the given callback inside the component (for example in the `Component.create()` function)
at the desired location. This enables the developer to determine (a part of) the implementation of a given component. 
Consider the following example:

```javascript
import create from 'kompo';
import MyNestableComponent from 'your/code/MyNestableComponent.js';

// In a create function of some component ...
const myNestableComponent = new MyNestableComponent;

myNestableComponent.nest((state, MyNestableComponent) => {
    // A nest callback should always return a root Node or Element, just like a Component.
    // What happens to this Node or Element is determined by the Component. 
    // In this case MyNestableComponent (see below).
    return create('div').txt('This Element will be used in MyNestableComponent');
});
```

```javascript
// Inside the create function of MyNestableComponent

const root = create('div').txt('This element will hold the nested Element given by the nest callback'),
    nestedElement = this.nest(); // Called without callback

root.append(nestedElement) 

return root;
```

These examples are taken from the examples in the `./examples` folder.

## Contribute

Would you like to contribute? Great!

Please keep the following in mind:

* Please follow the existing code style.  You can also use `npm run lint` to help.
* Write your code in a fashion which is easy to read and understand.
* Commit your changes by using `npm run commit`.
* Create pull requests for proposals or possible additions to the code base.
* Testing, testing, testing. Still a lot of work here. However each feature should come with a test.
