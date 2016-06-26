// Component and content creation classes and functions
import Component from '../../../src/component/Component.js';
import c, { createText } from '../../../src/dom/create.js';
import init from '../../../src/component/init';
import addExtensions from '../../../src/dom/extension.js';
addExtensions(); // Could add with prefix

// Router classes and components
import Router, { Route, IndexRoute } from '../../../src/router/Router.js';
import Link from '../../../src/router/Link.js';

// Example components with self-explanatory name
import Leaf from './components/Leaf.js';
import Branch from './components/Branch.js';

// Setup root component
class App extends Component {
    create() {
        // Create needed Elements
        const root = c(),
            heading = c('h1').txt('Router example - Kompo'),
            nav = c('nav'),
            content = c('div');
        content.classList.add('content');

        // Create Link Components for the navigation
        // and mount directly to root component
        const index = this.mount(new Link('','Index')),
            simple = this.mount(new Link('simple','Simple')),
            // Feel free to change 123 part of the url to something else
            param = this.mount(new Link('param/123','Param')),
            branch = this.mount(new Link('branch','Nested index')),
            branchSimple = this.mount(new Link('branch/simple','Nested simple')),
            branchRooted = this.mount(new Link('rooted_nested','Rooted nested simple')),
            // This link will fire the notFoundCallback, see below
            nonExisting = this.mount(new Link('nonexisting','Non existing route'));

        // Append links to the navigation
        nav
            .append(index, false)
            .append(simple, false)
            .append(param, false)
            .append(branch, false)
            .append(branchSimple, false)
            .append(branchRooted, false)
            .append(nonExisting, false);

        // Attach the routed Component to the content div
        this.mountRoutedComponent(content);

        // Append children
        root
            .append(heading, false)
            .append(nav, false)
            .append(content, false);

        // Return root
        return root;
    }
}

// Create route structure
const routes = new Route('/', new App, [
    // Each route array needs a IndexRoute
    new IndexRoute(new Leaf({
        heading: 'Index component'
    }))
    ,new Route('simple', new Leaf({
        heading: 'Simple component'
    }))
    ,new Route('param/:param', new Leaf({
        heading: 'Route with a param, shown in Component'
    }))
    ,new Route('branch', new Branch, [
        new IndexRoute(new Leaf({
            heading: 'Nested index component',
            input: true
        }))
        ,new Route('simple', new Leaf({
            heading: 'Nested simple component'
        }))
        // Url is very simple, although it is a nested component
        ,new Route('/rooted_nested', new Leaf({
            heading: 'Rooted nested component'
        }))
    ])
]);

// An empty state for this example.
// A state is needed because it contains the router
const state = {};

// Create router and set a not found Callback
const router = new Router(state, routes, '/examples/router', {
    notFoundCallback: function(url) {
        alert('Url: ' + url + ' not found');
    }
});

// Get the root component by passing null as parameter
const app = router.getComponent(null);
// Set the state (including the router) to the root component
app.setState(state);
// And append to body
init(document.body, app);
