import { createElement } from "@lwc/engine-dom";
import TextBox from "c/textBox";
import getMessage from "@salesforce/apex/TwilioController.getMessage";

jest.mock(
  "@salesforce/apex/TwilioController.getMessage",
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

describe("c-text-box", () => {
  //limpiar el DOM y los mocks despues de cada test
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
    jest.clearAllMocks();
  });

  it("llama a Apex y muestra el mensaje con el nombre cuando el usuario da clic", async () => {
    const element = createElement("c-text-box", {
      is: TextBox
    });
    document.body.appendChild(element);

    //obtiene los inputs del nombre y edad
    const input = element.shadowRoot.querySelectorAll("lightning-input")[0];

    //mock de la respuesta esperada del TwilioController
    const RESPUESTA_ESPERADA = "Hola, Pedro";
    getMessage.mockResolvedValue(RESPUESTA_ESPERADA);

    //dispara el evento de cambio en el input de 
    // nombre para actualizar el valor del componente
    input.dispatchEvent(
      new CustomEvent("change", { detail: { value: "Pedro" } })
    );

    // espera a que se actualice el valor del componente
    await flushPromises();

    //se obtiene el boton y se simula el click
    const button = element.shadowRoot.querySelector("lightning-button");
    button.click();

    //espera a que se resuelvan las promesas de la llamada al controller y la actualizacion del DOM
    await flushPromises();
    await flushPromises();

    //assert que el metodo getMessage se llamo con el parametro de nombre y edad esperados
    expect(getMessage).toHaveBeenCalledWith({ name: "Pedro", age: 0 });
    
    const textElements = element.shadowRoot.querySelectorAll(
      "lightning-formatted-text"
    );
    //se obtiene el ultimo elemento de texto (el que muestra el mensaje de Twilio)
    const responseText = textElements[textElements.length - 1];
    //asser que el valor del texto es igual a la respuesta esperada
    expect(responseText.value).toBe(RESPUESTA_ESPERADA);

    //assert que se limpio el input depues de llamar al controller
    expect(input.value).toBe("");
  });
  it("llama a Apex y muestra el mensaje con el nombre y la edad cuando el usuario da clic", async () => {
    const element = createElement("c-text-box", {
      is: TextBox
    });
    document.body.appendChild(element);
    //obtener los inputs de nombre y edad
    const nameInput = element.shadowRoot.querySelectorAll("lightning-input")[0];
    const ageInput = element.shadowRoot.querySelectorAll("lightning-input")[1];

    //diparar eventos de cambio de valor en cada input
    nameInput.dispatchEvent(
      new CustomEvent("change", { detail: { value: "Pedro" } })
    );
    ageInput.dispatchEvent(
      new CustomEvent("change", { detail: { value: 20 } })
    );

    //mock de la respuesta esperada del controller 
    const RESPUESTA_ESPERADA =
      "Hola, Pedro, te recuerdo que ya casi tienes 21 años!";
    getMessage.mockResolvedValue(RESPUESTA_ESPERADA);

    await flushPromises();

    //obtener el boton y simular el click
    const button = element.shadowRoot.querySelector("lightning-button");
    button.click();

    //espera para actualizar el DOM
    await flushPromises();
    await flushPromises();

    //assert de que el metodo getMessage se llamo con los parametros esperados
    expect(getMessage).toHaveBeenCalledWith({ name: "Pedro", age: 20 });
    const textElements = element.shadowRoot.querySelectorAll(
      "lightning-formatted-text"
    );

    //se obtiene el ultimo elemento de texto (el que muestra el mensaje de Twilio)
    const responseText = textElements[textElements.length - 1];
    //asser que el valor del texto es igual a la respuesta esperada
    expect(responseText.value).toBe(RESPUESTA_ESPERADA);

    //assert que se limpiaron los input depues de llamar al controller
    expect(nameInput.value).toBe("");
    expect(ageInput.value).toBe(0);
  });

  it("muestra un error si el input está vacío y NO llama a Apex", async () => {
    const element = createElement("c-text-box", {
      is: TextBox
    });
    document.body.appendChild(element);

    //mock del handler del evento de toast para validar que se dispare el evento de error
    const toastHandler = jest.fn();
    element.addEventListener("lightning__showtoast", toastHandler);

    //simular el click sin ingresar nombre ni edad
    const button = element.shadowRoot.querySelector("lightning-button");
    button.click();

    await flushPromises();
    //assert de que no se llamo al metodo getMessage
    expect(getMessage).not.toHaveBeenCalled();
    //assert de que se disparo el evento del toast para mostrar el error
    expect(toastHandler).toHaveBeenCalled();
  });

  it("muestra un error si el nombre está vacío pero la edad no y NO llama a Apex", async () => {
    const element = createElement("c-text-box", {
      is: TextBox
    });
    document.body.appendChild(element);
    //obtener el input de edad
    const input = element.shadowRoot.querySelectorAll("lightning-input")[1];

    //mock del handler del evento de toast para validar que se dispare el evento de error
    const toastHandler = jest.fn();
    element.addEventListener("lightning__showtoast", toastHandler);

    //disparar el evento de cambio en el input de edad,
    input.dispatchEvent(new CustomEvent("change", { detail: { value: 20 } }));
    
    //simular el click
    const button = element.shadowRoot.querySelector("lightning-button");
    button.click();
    
    await flushPromises();
    //assert de que no se llamo al metodo getMesage,
    // sin el nombre no se debe llamar al controller
    expect(getMessage).not.toHaveBeenCalled();
    //assert de que se disparo el evento del toast para mostrar el error
    expect(toastHandler).toHaveBeenCalled();
  });
});
