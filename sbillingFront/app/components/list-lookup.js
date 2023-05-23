import Ember from 'ember';
import { inject as service } from '@ember/service';

export default Ember.Component.extend({
  session: service('session'),
  store: service('store'),
  router: service(),
  rows: undefined,
  modelTable: undefined,
  parentRoute: undefined,
  refreshTrigger: false,
  showContent: false,
  lookupModel: undefined,
  visibleValue: undefined,
  modelname: undefined,
  filterName: undefined,
  filterId: undefined,
  openTrigger: false,

  openTriggerObserver: Ember.observer('openTrigger', function () {
    let openTrigger = this.openTrigger;
    if (openTrigger) {
      this.getData();
    }
  }),

  getData() {
    let modelName = this.modelname,
      filterName = this.filterName,
      filterId = this.filterId,
      self = this,
      object = this.filters;
    if (Ember.isEmpty(object)) {
      object = {};
      object[filterName] = filterId;
    }
    
    return this.store.query(modelName, object).then((elements) => {
      self.set('lookupModel', elements);
      self.set('showContent', true);
    });
  },

  refreshObserver: function () {}.observes('refreshTrigger'),

  modelRender: undefined,

  didInsertElement() {
    this._super(...arguments);
    this.$('.tooltipped').tooltip();
  },

  actions: {
    trClick(element) {
      this.set('lookupObject', element);
      this.set('showContent', false);
      this.set('modalOpenLookup', false);
    },
  },
});
