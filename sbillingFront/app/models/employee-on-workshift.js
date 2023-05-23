import DS from 'ember-data';

export default DS.Model.extend({
  token: DS.attr(),
  actuality: DS.attr(),

  workshift: DS.belongsTo('workshift'),
  account: DS.belongsTo('account'),
  employee: DS.belongsTo('employee'),
  roomOnWorkshift: DS.belongsTo('room-on-workshift'),

  hasLoadingEmployee: Ember.observer('employee.isPending', function () {
    return this.set('employee', this.get('employee.content'));
  }),
  hasLoadingUserEmployee: Ember.observer('employee.user.isLoaded', function () {
    if (this.get('employee.user.isLoaded') == true)
      return this.set('employee.user', this.get('employee.user.content'));
  }),
  hasLoadingWorkshift: Ember.observer('workshift.isLoaded', function () {
    return this.set('workshift', this.get('workshift.content'));
  }),
  hasLoadingAccount: Ember.observer('account.isLoaded', function () {
    return this.set('account', this.get('account.content'));
  }),
});
