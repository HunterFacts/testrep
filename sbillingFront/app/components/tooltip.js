import Component from '@glimmer/component';

export default Ember.Component.extend({
  customClass: 'tooltipped',

  didInsertElement() {
    this._super(...arguments);
    this.$('.' + this.customClass).tooltip();
  },
});
