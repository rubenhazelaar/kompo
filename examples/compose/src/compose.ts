// Component and content creation classes and functions
import construct from '../../../src/component/construct';
import mount from '../../../src/component/mount';
import app from '../../../src/component/app';
// import dispatch from '../../../src/state/dispatch';

// Example components with self-explanatory name
import table from './components/table';
import accordionTable from './components/accordionTable'
import {KompoElement} from "../../../src/types";

// From the kompo-util library
function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Create root component
const root = construct('div', function({}) {
    const t1 = table(),
        t2 = table({
            columnFilter(data: MovieCharacter) {
                return {
                    Firstname: capitalize(data.firstname),
                    Lastname: capitalize(data.lastname)
                }
            }
        }),
        t3 = accordionTable({
            columnFilter(data: MovieCharacter) {
                return {
                    Firstname: capitalize(data.firstname),
                    Lastname: capitalize(data.lastname)
                }
            },
            rowSlot(columnElement: KompoElement, filtered: Object, raw: Object) {
                const h1 = document.createElement('h1');
                h1.textContent = capitalize((<MovieCharacter>raw).movie);
                columnElement.appendChild(h1)
            }
        });

    mount(this, [t1, t2, t3]);

    this.appendChild(t1);
    this.appendChild(t2);
    this.appendChild(t3);
});


const state: MovieCharacter[] = [
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

// An state with some table rows
type MovieCharacter = {
    firstname: string,
    lastname: string,
    movie: string
}
