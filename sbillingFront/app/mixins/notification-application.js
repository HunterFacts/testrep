import Mixin from '@ember/object/mixin';

export default Mixin.create({
  alertStatus: false,
  alertText: undefined,

  confirmStatus: false,
  confirmTitle: undefined,
  confirmText: undefined,
  confirmYesCallback: undefined,
  confirmNoCallback: undefined,

  alert(text) {
    this.set('alertStatus', true);
    this.set('alertText', text);
  },
  closeAlert() {
    this.set('alertStatus', false);
  },

  confirm(title, text, callbackYes, callbackNo = undefined) {
    this.set('confirmTitle', title);
    this.set('confirmText', text);
    this.set('confirmYesCallback', callbackYes);
    this.set('confirmNoCallback', callbackNo);
    this.set('confirmStatus', true);
  },
});
