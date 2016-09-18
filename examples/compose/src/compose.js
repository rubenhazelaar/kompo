// Component and content creation classes and functions
import construct, {mount} from '../../../src/component/component';
import app from '../../../src/state/app';
// import dispatch from '../../../src/state/dispatch';

// Example components with self-explanatory name
import table from './components/table';
import accordionTable from './components/accordionTable'

// From the kompo-util library
function capitalize(str) {
    if (typeof str === "string") {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// Create root component
const root = construct('div', function({}) {
    const t1 = table(),
        t2 = table({
            columnFilter(data) {
                return {
                    Firstname: capitalize(data.firstname),
                    Lastname: capitalize(data.lastname)
                }
            }
        }),
        t3 = accordionTable({
            columnFilter(data) {
                return {
                    Firstname: capitalize(data.firstname),
                    Lastname: capitalize(data.lastname)
                }
            },
            rowSlot(columnElement, filtered, raw) {
                const h1 = document.createElement('h1');
                h1.textContent = capitalize(raw.movie);
                columnElement.appendChild(h1)
            }
        });

    mount(this, [t1, t2, t3]);
});

// An state with some table rows
const state = [
    {
        firstname: 'rick',
        lastname: 'deckard',
        movie: 'blade runner'
    }, {
        firstname: 'mia',
        lastname: 'wallace',
        movie: 'pulp fiction'
    },{
        firstname: 'rocky',
        lastname: 'balboa',
        movie: 'rocky'
    }
];

// Create instance of root and
// append table to body
document.body.appendChild(app(root(), state).start());

