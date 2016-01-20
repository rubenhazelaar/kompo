import Component from '../../../../src/component/Component.js';
import c from '../../../../src/dom/create.js';
import Fetch from '../../../../src/xhr/Fetch.js';
import AsyncAction from '../../../../src/action/AsyncAction.js';

export default class Profile extends Component {
    create() {
        /**
         * Statefull elements
         */
        const a = c('a')
            .h('javascript:void(0);')
            .txt('FETCH');


        const asyncAction = new AsyncAction('http://localhost/SFM/public_html/api/transactionodometadata.json?key=MeanName&partition=Week&dataLevels%5B%5D=Week&dataLevels%5B%5D=MeanName&dataTypes%5B%5D=Odo&dataTypes%5B%5D=Volume&startDate=2015-09-03&endDate=2015-12-03');
        asyncAction
            .before(asyncAction.do((asyncAction, state, Component) => {
                console.log('BEFORE');
                return true;
            }));

        this.on(a, 'click', asyncAction.when((e, asyncAction, state, Component) => {
            e.preventDefault();

            asyncAction.promise()
                .then(asyncAction.do((asyncAction, state) => {
                    console.log('SUCCESS');
                    console.log(state);
                    console.log(asyncAction.jsonResponse());
                    return true;
                }))
                .catch(asyncAction.do((asyncAction) => {
                    console.log('FAILURE');
                    return true;
                }))
                .then(asyncAction.do((asyncAction) => {
                    console.log('FINALLY');
                    return true;
                }));
            
            console.log('ACTION');
            return true; // Always send
        }));

        //this.on(a, 'click', (e, state, C) => {
        //    e.preventDefault();
        //    new Fetch(
        //        //'http://localhost/SFM/public_html/api/transactionlist.json?%00%00%00=&startDate=2015-09-01&endDate=2015-12-30&columns%5BId%5D=Id&columns%5BDate%5D=Date&columns%5BTime%5D=Time&columns%5BProduct%5D=ProductName&columns%5BPrice%5D=Price&columns%5BPPU%5D=PricePerVolume&columns%5BVolume%5D=Volume&columns%5BGroup%5D=DepartmentName&columns%5BDevice%5D=DeviceName&columns%5BOdo%5D=Odo&columns%5BPreviousOdo%5D=PreviousOdo&columns%5BDriver%5D=DriverName&columns%5BStation%5D=StationName&page=1'
        //        'http://localhost/SFM/public_html/api/transactionodometadat.json?key=MeanName&partition=Week&dataLevels%5B%5D=Week&dataLevels%5B%5D=MeanName&dataTypes%5B%5D=Odo&dataTypes%5B%5D=Volume&startDate=2015-09-03&endDate=2015-12-03'
        //        ).before((Fetch)=>{
        //            console.log('BEFORE');
        //        })
        //        .send()
        //        .then((Fetch) => {
        //            console.log('SUCCESS');
        //            console.log(Fetch.jsonResponse());
        //        })
        //        .catch((Fetch) => {
        //            console.log('FAILURE');
        //        })
        //        .then((Fetch) => {
        //            console.log('FINALLY');
        //        });
        //});
        /**
         * Structure elements
         */
        // Create root of component
        const fragment = c(),
            heading = c('h2').txt('Profile'),
            content = c('div');
        content.classList.add('content');

        // Append children
        fragment
            .append(heading, false)
            .append(a)
            .append(content);

        // Return root
        return fragment;
    }
}
