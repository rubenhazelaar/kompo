import construct from '../../../../src/component/component';

export default construct('div', function({defaultClass, addCallback}) {
    const input = document.createElement('input'),
        add = document.createElement('a');

    input.setAttribute('autofocus', true);
    add.setAttribute('href', 'javascript:void(0);');
    add.textContent = 'Add';
    
    this.classList.add(defaultClass);

    const addFn = e => {
        e.preventDefault();
        const code = e.which || e.keyCode;
        if(input.value && (code === 13 || e.type === 'click')) {
            addCallback(input.value);
            input.value = '';
        }
    };

    input.addEventListener('keyup', addFn);
    add.addEventListener('click', addFn);

    this.appendChild(input);
    this.appendChild(add);
},{
    defaultClass: '',
    addCallback: () => {
        throw new Error('Configure addCallback to implement behavior');
    }
});