export default Ember.Component.extend({
  alertStatus: true,
  alertText: undefined,
  modalConfirmStatus: false,
  confirmYesCallback: undefined,
  confirmNoCallback: undefined,
  confirmTitle: undefined,
  confirmText: undefined,

  alertStatusObserver: Ember.observer('alertStatus', function () {}),

  actions: {
    closeAlert() {
      this.set('alertStatus', false);
    },

    _confirmYesCallbackAction() {
      this.set('modalConfirmStatus', false);
      let confirmYesCallback = this.confirmYesCallback;
      if (!Ember.isEmpty(confirmYesCallback)) confirmYesCallback();
    },

    _confirmNoCallbackAction() {
      let confirmNoCallback = this.confirmNoCallback;
      if (!Ember.isEmpty(confirmNoCallback)) confirmNoCallback();
    },
  },
});
