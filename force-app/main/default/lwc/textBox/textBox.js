import { LightningElement } from "lwc";
import getMessage from "@salesforce/apex/TwilioController.getMessage";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class TextBox extends LightningElement {
  userName = "";
  message;
  userAge = 0;

  handleOnChange(event) {
    this.userName = event.detail.value;
  }

  handleAgeOnChange(event) {
    this.userAge = event.detail.value;
  }

  handleClick() {
    if (!this.userName) {
      this.showToast("Error", "Please enter a name", "warning");
      return;
    }
    //llamando imperativamente al TwilioController
    getMessage({ name: this.userName, age: this.userAge })
      .then((resp) => {
        this.message = resp;
        this.userName = "";
        this.userAge = 0;
        this.showToast("Success", "Message received!", "success");
      })
      .catch((error) => {
        console.error(error);
        this.showToast("Error", "Something went wrong", "error");
      });
  }

  // metodo para mostrar un toast con mensaje informativo (error, success, warning, etc)
  showToast(title, message, variant) {
    const event = new ShowToastEvent({
      title: title,
      message: message,
      variant: variant
    });
    this.dispatchEvent(event);
  }
}
