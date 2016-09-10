// Import the component function
import construct, {render} from '../../../src/component/component';

// Choose a tag and create a function which constructs the construct
const title = construct('h1', function({name}) {
    this.textContent = 'Hello world, this is ' + name;
}, {
    // As you can see you can also provide default properties
    name: 'Kompo'
});

// Create an instance of the construct
// No properties here, so the default will be used
const h1 = title();

// Render construct ...
// (TIP: use app(...).start() to kick of more complex apps)
render(h1);

// .. and append to body
document.body.appendChild(h1);

