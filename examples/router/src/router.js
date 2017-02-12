// Component and content creation classes and functions
import construct, {react, getRouter} from '../../../src/component/component';
import dispatch from '../../../src/state/dispatch';
import app from '../../../src/state/app';

// Router classes and components
import router, {route, indexRoute, swap, loadComponent} from '../../../src/router/router';
// import link from '../../../src/router/link';

// Example components with self-explanatory name
import leaf from './components/leaf';
import branch from './components/branch';

// Create root construct for navigation
const root = construct('div', function () {
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
    // routed construct
    react(this, () => {
        console.log("LEVEL ONE SWAP");
        swap(this, r);
    });
});

// Create route structure
const routes = route('/', root(), [
    // Each route array needs a IndexRoute
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
        , route('simple', leaf({
            heading: 'Nested simple construct'
        }))
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
    notFoundCallback: function (url) {
        alert('Url: ' + url + ' not found');
        // Always throw an error to interrupt the update cycle
        throw new Error('Url: ' + url + ' not found');
    }
});

// Get the root construct from the router
const ro = r.get();

// Append to body
document.body.appendChild(ro);

// Set the state (including the router) to the root construct
app(ro, state, r).start();
