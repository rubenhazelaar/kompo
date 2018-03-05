import construct, {react, render, _debug_update, setState} from '../../../src/component/component';
import observe from '../../../src/state/observe';

const testArray = observe([1,2,3,4,5]),
    testElementComponent = construct('div', function() {
        console.log('Construct test element');
        react(this, state => {
            console.log('React test element');
            console.log(state);
        })
    }),
    testElement = testElementComponent();

// To get it working
testElement['__kompo__'] = {root: testElement};

setState(testElement, () => {
    return shuffle(testArray);
});

render(testElement);

_debug_update(testElement);
_debug_update(testElement);
_debug_update(testElement);

/**
 * Util functions
 */
function shuffle(o) {
    // for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}