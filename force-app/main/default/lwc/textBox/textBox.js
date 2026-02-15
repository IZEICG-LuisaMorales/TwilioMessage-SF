import { LightningElement } from 'lwc';
import getMessage from '@salesforce/apex/TwilioController.getMessage';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class TextBox extends LightningElement {
    userName='';
    message;

    handleOnChange(event) {
        this.userName = event.detail.value;
    }

    handleClick(){
        if (!this.userName) {
            this.showToast('Error', 'Please enter a name', 'warning');
            return;
        }
        getMessage({name:this.userName})
            .then(resp=>{
                this.message = resp;
                this.userName='';
                this.showToast('Success', 'Message received!', 'success');
            })
            .catch(error=>{
                console.error(error);
                this.showToast('Error', 'Something went wrong', 'error');
            });
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(event);
    }
}