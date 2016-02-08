import assert from 'assert';

import Component from '../../src/component/Component.js';

describe('Component', function () {
    describe('#constructor()', function () {
        Component.defaultProps = {
            zero: 0,
            one: 2
        };

        const component = new Component({
            one: 1,
            two: 2
        });

        it('should write defaultProps to Component.props', function () {
            assert.equal(0, component.props.zero);
        });

        it('should overwrite defaultProps with the props parameter to Component.props', function () {
            assert.equal(1, component.props.one);
        });

        it('should write new keys of props parameter to Component.props', function () {
            assert.equal(2, component.props.two);
        });

        it('should set Component.statefulls to an empty array', function () {
            assert.deepEqual([],component.statefulls);
        });

        it('should set Component.mounts to an empty array', function () {
            assert.deepEqual([],component.mounts);
        });

        it('should set Component.stateless to true', function () {
            assert.equal(true, component.stateless);
        });

        it('should set Component.isolated to false', function () {
            assert.equal(false, component.isolated);
        });

        it('should set Component.initial to true', function () {
            assert.equal(true, component.initial);
        });
    });

    describe('#create()', function () {
        it('should throw an error when not overloaded', function () {
            const component = new Component;
            assert.throws(component.create, Error, 'Component must override the create method and return an Element object.');
        });

        const component = new Component,
            element = document.createElement('div');

        component.create = function(){ return element };
        const result = component.render();

        it('should always return the root element of the component', function(){
            assert.equal(element, result);
        });
    });

    describe('#render()', function () {
        it('should throw an error when create() is not overloaded', function () {
            const component = new Component;
            assert.throws(component.render, Error, 'Component must override the create method and return an Element object.');
        });

        const component = new Component,
            spy = sinon.spy(component, 'render'),
            element = document.createElement('div');

        component.create = function(){ return element };
        const result = component.render();
        it('should set Component.initial to false on first call', function(){
            assert(spy.calledOnce);
            assert.equal(false, component.initial);
        });

        it('should always return the root element of the component', function(){
            assert.equal(element, result);
        });
    });

    describe('#mount()', function () {
        it('should return the Component that is mounted', function () {
            const parent = new Component,
                child = new Component;
            assert.equal(child, parent.mount(child));
        });
    });

    describe('#unmount()', function () {
        it('should return the Component which is unmounted on', function () {
            const parent = new Component,
                child = new Component;
            parent.mount(child);
            assert.equal(parent, parent.unmount(child));
        });
    });

    describe('#unmountByIndex()', function () {
        it('should return the Component that is unmounted', function () {
            const parent = new Component,
                child = new Component;
            parent.mount(child);
            assert.equal(child, parent.unmountByIndex(0));
        });
    });

    describe('#setParent()', function () {
        const parent = new Component,
            child = new Component,
            result = child.setParent(parent);

        it('should set parent Component of Component', function () {
            assert.equal(parent, child.parent);
        });

        it('should return itself', function () {
            assert.equal(child, result);
        });
    });

    describe('#react()', function () {
        const state = {
                counter: 0
            },
            component = new Component,
            callback = function (state) {
                state.counter++;
            };

        it('should throw an error when no state is set', function(){
            assert.throws(function(){
                component.react(callback);
            }, Error, 'Set state (through mount() or setState()) before registering a react function.');
        });

        it('callback should be called once when set', function(){
            component.setState(state);
            component.react(callback);
            assert.equal(1, state.counter);
        });

        it('when Component.update() is called callback should be called again', function(){
            component.update();
            assert.equal(2, state.counter);
        });
    });

    describe('#mountRoutedComponent()', function () {
        const component = new Component,
            routeComponent = new Component,
            // Router fake
            state = {
                Router: {
                    getComponent(self) {
                        return routeComponent;
                    }
                }
            },
            otherThanFunctionOrNode = [
                [],
                {},
                0,
                'string'
            ],
            callbackOrNode = [
                function() {
                    return 1;
                },
                document.createElement('div')
            ];
        component.setState(state);
        routeComponent.create = function() {
            return document.createElement('div');
        };

        it('should throw an Error when anything else then a function or a Node as argument is given', function () {
            for(let i in otherThanFunctionOrNode) {
                assert.throws(function(){
                    component.mountRoutedComponent(otherThanFunctionOrNode[i]);
                }, Error, 'Routed Component cannot be assigned. Please make sure parent is a Node or a closure.')
            }
        });

        it('should accept a callback function or a Node and return routed component', function(){
            let result;
            for(let i in callbackOrNode) {
                result = component.mountRoutedComponent(callbackOrNode[i]);
                assert.equal(routeComponent, result);
            }
        });
    });

    describe('#setState()', function () {
        const component = new Component,
            state = {
                one: 1,
                two: 2,
                three: 3
            },
            result = component.setState(state);

        it('should set state of Component', function () {
            assert.equal(state, component.state);
        });

        it('should return itself', function () {
            assert.equal(result, component);
        });
    });

    describe('#setIsolatedState()', function () {
        const component = new Component,
            state = {
                one: 1,
                two: 2,
                three: 3
            },
            result = component.setIsolatedState(state);

        it('should set state of Component', function () {
            assert.equal(state, component.state);
        });

        it('should set Component.isolated to true', function () {
            assert.equal(true, component.isolated);
        });

        it('should return itself', function () {
            assert.equal(result, component);
        });
    });

    describe('#nest()', function () {
        const component = new Component,
            element = document.createElement('div'),
            callback = function(){ return element },
            result = component.nest(callback);

        it('should return itself', function () {
            assert.equal(result, component);
        });

        it('should return an element when a callback has been previously set', function(){
            assert.equal(element, component.nest());
        })
    });

    describe('#on()', function(){
        // TODO: Implement
    });

    describe('#off()', function(){
        // TODO: Implement
    });

    describe('#getRoot()', function(){
        const parent = new Component,
            child = new Component,
            grandChild = new Component;

        parent.mount(child);
        child.mount(grandChild);

        it('should return the parent component', function(){
            assert.equal(parent, grandChild.getRoot());
        });

        it('should return the child, because it is isolated', function(){
            child.setIsolatedState({});
            assert.equal(child, grandChild.getRoot());
        });
    });
});

describe('eventListenerCallback()', function(){
    // TODO: Implement
});