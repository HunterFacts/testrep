import Ember from 'ember';
import { inject as service } from '@ember/service';

export default Ember.Component.extend({
  session: service('session'),
  router: service(),
  modelname: undefined,
  modalOpenLookup: false,
  openTrigger: false,

  didInsertElement() {
    this._super(...arguments);
    let visibleValue = this.visibleValue;
    this.set('lookupValue', this.get('value.' + visibleValue));
  },

  modalOpenLookupObserver: Ember.observer('modalOpenLookup', function () {
    let openTrigger = this.openTrigger ? 0 : 1;
    this.set('openTrigger', openTrigger);
  }),

  valueTrigger: Ember.observer('value', function () {
    let visibleValue = this.visibleValue;
    this.set('lookupValue', this.get('value.' + visibleValue));
  }),

  actions: {
    clickInput() {
      this.set('modalOpenLookup', true);
    },

    clearData() {
      this.set('value', null);
    },

    closeLookupModal() {
      this.set('modalOpenLookup', false);
    },
  },
});
