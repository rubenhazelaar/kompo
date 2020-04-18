import construct from '../../../../src/component/construct';

export default construct('div', function({defaultClass, addCallback}) {
    const input = document.createElement('input'),
        add = document.createElement('a');

    input.setAttribute('autofocus', 'true');
    add.setAttribute('href', 'javascript:void(0);');
    add.textContent = 'Add';
    
    this.classList.add(defaultClass);

    input.addEventListener('keyup', (e: KeyboardEvent) => {
        e.preventDefault();
        if(input.value && e.key === 'Enter') {
            addCallback(input.value);
            input.value = '';
        }
    });
    add.addEventListener('click', (e: Event) => {
        e.preventDefault();
        if(input.value) {
            addCallback(input.value);
            input.value = '';
        }
    });

    this.appendChild(input);
    this.appendChild(add);
},{
    defaultClass: '',
    addCallback: () => {
        throw new Error('Configure addCallback to implement behavior');
    }
});