import DS from 'ember-data';

export default DS.Model.extend({
  active: DS.attr(),
  date: DS.attr(),
  employee: DS.belongsTo('employee'),
  achievement: DS.belongsTo('achievement'),
});
