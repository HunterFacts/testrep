import Ember from 'ember';
import { inject as service } from '@ember/service';
import moment from 'moment';

export default Ember.Component.extend({
  value: undefined,
  textOn: undefined,
  textOff: undefined,
  localObject: undefined,
  callbackChange: undefined,

  valueObserver: Ember.observer('value', function() {
    var callbackChange = this.get('callbackChange');
    if (!Ember.isEmpty(callbackChange)) {
      var localObject = this.get('localObject');
      callbackChange(localObject);
    }
  }),

  didInsertElement() {
    this._super(...arguments);
  },
})