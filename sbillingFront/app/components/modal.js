import Component from '@glimmer/component';
import { v4 as uuidv4 } from 'uuid';

export default Ember.Component.extend({
  componentId: undefined,
  modalOpen: false,
  closeCallback: undefined,

  modalOpenObserver: Ember.observer('modalOpen', function () {
    let modalOpen = this.modalOpen,
      componentId = this.componentId;
    if (modalOpen) return this.$('#' + componentId).modal('open');
    else return this.$('#' + componentId).modal('close');
  }),

  init() {
    this._super(...arguments);
    let randomId = uuidv4();
    this.set('componentId', randomId);
  },

  didInsertElement() {
    this._super(...arguments);
    let self = this;
    let componentId = this.componentId;
    this.$('#' + componentId).modal({
      onCloseEnd: function () {
        self.set('modalOpen', false);
        let closeCallback = self.get('closeCallback');
        if (!Ember.isEmpty(closeCallback)) closeCallback();
      },
      opacity: 0.8,
    });
  },
});
