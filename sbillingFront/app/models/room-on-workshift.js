import DS from 'ember-data';

export default DS.Model.extend({
  token: DS.attr(),

  workshift: DS.belongsTo('workshift'),
  room: DS.belongsTo('room'),

  employeeOnWorkshift: DS.hasMany('employee-on-workshift'),
});
