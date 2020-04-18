// Import the component function
import app from '../../../src/component/app';
import construct from '../../../src/component/construct';
import {KompoElement} from "../../../src/types";

// Choose a tag and create a function which constructs the construct
const title = construct('h1', function(this: KompoElement, {name}) {
    this.textContent = 'Hello world, this is ' + name;
}, {
    // As you can see you can also provide default properties
    name: 'Kompo'
});

// Create an instance of the construct
// No properties here, so the default will be used
const h1 = title();

// Render construct ...
// (TIP: use app(...).start() to kick of kompo)
app(h1, {}).start();

// Append root element h1 to body
document.body.appendChild(h1);