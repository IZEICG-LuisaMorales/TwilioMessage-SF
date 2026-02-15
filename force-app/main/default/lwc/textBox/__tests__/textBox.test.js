import { createElement } from '@lwc/engine-dom';
import TextBox from 'c/textBox';
import getMessage from '@salesforce/apex/TwilioController.getMessage';

jest.mock(
    '@salesforce/apex/TwilioController.getMessage',
     () => {
        return {
            default: jest.fn()
        };
    },
    { virtual: true }
);

// Helper function to wait until the microtask queue is empty. This is needed for promise
// timing when calling imperative Apex.
async function flushPromises() {
    return Promise.resolve();
}

describe('c-text-box', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        jest.clearAllMocks();
    });

    it('llama a Apex y muestra el mensaje cuando el usuario da clic', async () => {
        const element = createElement('c-text-box', {
            is: TextBox
        });
        document.body.appendChild(element);

        const RESPUESTA_ESPERADA = 'Hola, Pedro';
        getMessage.mockResolvedValue(RESPUESTA_ESPERADA);

        const input = element.shadowRoot.querySelector('lightning-input');
        input.dispatchEvent(new CustomEvent('change', { detail: { value: 'Pedro' } }));
        
        await flushPromises();

        const button = element.shadowRoot.querySelector('lightning-button');
        button.click();

        await flushPromises();
        await flushPromises();
        
        expect(getMessage).toHaveBeenCalledWith({ name: 'Pedro' });
        const textElements = element.shadowRoot.querySelectorAll('lightning-formatted-text');
        
        const responseText = textElements[textElements.length - 1];
        expect(responseText.value).toBe(RESPUESTA_ESPERADA);

        const inputElement = element.shadowRoot.querySelector('lightning-input');
        expect(inputElement.value).toBe('');
    });

    it('muestra un error si el input está vacío y NO llama a Apex', async () => {
        const element = createElement('c-text-box', {
            is: TextBox
        });
        document.body.appendChild(element);

        const toastHandler = jest.fn();
        element.addEventListener('lightning__showtoast', toastHandler);

        const button = element.shadowRoot.querySelector('lightning-button');
        button.click();

        await flushPromises();

        expect(getMessage).not.toHaveBeenCalled();
        expect(toastHandler).toHaveBeenCalled();
    });
});