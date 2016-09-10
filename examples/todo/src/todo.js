// Component and content creation classes and functions
import component, {react, getRouter} from '../../../src/component/component';
import dispatch from '../../../src/state/dispatch';
import app from '../../../src/state/app';

// Router classes and components
import router, {route, indexRoute, swap} from '../../../src/router/router';
// import link from '../../../src/router/link';

// Example components with self-explanatory name
import leaf from './components/leaf';
import branch from './components/branch';

// Create root component for navigation
const root = component('div', function () {
    const h1 = document.createElement('h1'),
        nav = document.createElement('nav'),
        links = [
            '',
            'simple',
            'param/123',
            'branch',
            'branch/simple',
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
            dispatch(this, state => {
                state.url = links[i];
            });
        });
        a.setAttribute('href', 'javascript:void(0);');
        a.textContent = links[i];
        nav.appendChild(a);
    }

    this.appendChild(h1);
    this.appendChild(nav);

    // On update swap the new 
    // routed component
    react(this, () => {
        swap(this, r);
    });
});

// Create route structure
const routes = route('/', root(), [
    // Each route array needs a IndexRoute
    indexRoute(leaf({
        heading: 'Index component'
    }))
    , route('simple', leaf({
        heading: 'Simple component'
    }))
    , route('param/:param', leaf({
        heading: 'Route with a param, shown in Component'
    }))
    , route('branch', branch(), [
        indexRoute(leaf({
            heading: 'Nested index component',
            input: true
        }))
        , route('simple', leaf({
            heading: 'Nested simple component'
        }))
        // Url is very simple, although it is a nested component
        , route('/rooted_nested', leaf({
            heading: 'Rooted nested component'
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
    notFoundCallback: function (url) {
        alert('Url: ' + url + ' not found');
    }
});

// Get the root component from the router
const ro = r.get();

// Append to body
document.body.appendChild(ro);

// Set the state (including the router) to the root component
app(ro, state, r).start();
