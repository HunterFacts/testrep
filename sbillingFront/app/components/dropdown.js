import Ember from 'ember';
import { inject as service } from '@ember/service';
import CollectionDropdown from '../mixins/collection-dropdown';

export default Ember.Component.extend(CollectionDropdown, {
  collection: undefined,
  values: undefined,

  didInsertElement() {
    this._super(...arguments);
    this.addValues();
    self = this;
    this._updateSelect();
    Ember.run.later(() => this._updateSelect(), 200);
    this.set('postRender', false);
  },

  _updateSelect() {
    let self = this;
    this.$('select').formSelect();
    this.$('select').change((val) => {
      self.set('value', this.$('select').val());
    });
  },

  valuesObserver: Ember.observer('values', 'value', function () {
    this._updateSelect();
  }),

  addValues() {
    let collectionName = this.collection;
    let collections = this.get('collections.' + collectionName);
    this.set('values', collections);
  },
});
