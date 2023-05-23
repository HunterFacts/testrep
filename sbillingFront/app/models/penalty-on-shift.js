import DS from 'ember-data';

export default DS.Model.extend({
  reason: DS.attr(),
  amount: DS.attr(),
  actuality: DS.attr(),

  employee: DS.belongsTo('employee'),
  workshift: DS.belongsTo('workshift'),
});
