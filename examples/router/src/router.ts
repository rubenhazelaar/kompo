// Component and content creation classes and functions
import construct from '../../../src/component/construct';
import react from '../../../src/component/react';
import getRouter from '../../../src/component/getRouter';
import {getState} from '../../../src/component/state';
import app from '../../../src/component/app';

// Router classes and components
import router, {route, indexRoute, swap} from '../../../src/router/router';

// Example components with self-explanatory name
import leaf from './components/leaf';
import branch from './components/branch';
import {KompoElement} from "../../../src/types";

// Create root construct for navigation
const root = construct('div', function () {
    const h1 = document.createElement('h1'),
        nav = document.createElement('nav'),
        links = [
            '',
            'simple',
            'param/123',
            'branch',
            'branch/leaf',
            'branch/branch',
            'branch/branch/leaf',
            'rooted_nested',
            'nonexisting'
        ],
        r = getRouter(this);

    h1.textContent = 'Router example';

    for (let i = 0, l = links.length; i < l; ++i) {
        const a = document.createElement('a');
        a.addEventListener('click', () => {
            r.goTo(links[i]);

            // Dispatch change to state
            const state = getState(this);
            state.url = links[i];
        });
        a.setAttribute('href', 'javascript:void(0);');
        a.textContent = links[i];
        nav.appendChild(a);
    }

    this.appendChild(h1);
    this.appendChild(nav);

    // On update swap the new 
    // routed construct
    react(this, () => {
        // console.log("SWAP ONE --------------------------------------");
        swap(this, r);
    });
});

// Create routeType structure
const routes = route('/', root(), [
    // Each routeType array needs a IndexRoute
    indexRoute(leaf({
        heading: 'Index construct'
    }))
    , route('simple', leaf({
        heading: 'Simple construct'
    }))
    , route('param/:param', leaf({
        heading: 'Route with a param, shown in Component'
    }))
    , route('branch', branch()
        // To dynamically load a component
        // IMPORTANT: does not work as intended with the setup in examples.webpack.js
        // require.ensure([], require => require('./components/branch').default({heading: "Dynamically imported"}), 'branch')
    , [
        indexRoute(leaf({
            heading: 'Nested index construct',
            input: true
        }))
        , route('leaf', leaf({
            heading: 'Nested simple construct'
        }))
        , route('branch', branch()
            // To dynamically load a component
            // IMPORTANT: does not work as intended with the setup in examples.webpack.js
            // require.ensure([], require => require('./components/branch').default({heading: "Nested dynamically imported"}), 'branch')
        , [
            indexRoute(leaf({
                heading: 'Double nested index construct',
                input: true
            }))
            , route('leaf', leaf({
                heading: 'Double nested simple construct'
            }))
        ])
        // Url is very simple, although it is a nested construct
        , route('/rooted_nested', leaf({
            heading: 'Rooted nested construct'
        }))
    ])
]);

// An empty state for this example.
// A state is needed because it contains the router
const state = {url: '/'};

// Create router and set a not found Callback
const r = router({
    routes,
    base: 'router',
    notFoundCallback: function (url: string) {
        alert('Url: ' + url + ' not found');
        // Always throw an error to interrupt the update cycle
        throw new Error('Url: ' + url + ' not found');
    }
});

// Get the root construct from the router
const ro = <KompoElement>r.get();

if(!ro) {
    throw new Error('cannot determine root');
}

// Set the state (including the router) to the root construct and append to document body
document.body.appendChild(app(ro, state, r).start());

// Listen to popstate event to make sure the page render when the
// user goes through it's history
window.addEventListener('popstate', ()=>{
    // Just update the whole tree from the root up.
    if (r.setTo(window.location.pathname)) {
        const state = getState(ro);
        state.url = r.getUrl();
    }
});