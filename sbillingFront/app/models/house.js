import DS from 'ember-data';

export default DS.Model.extend({
  addressString: DS.attr(),
  houseNumber: DS.attr(),
  street: DS.attr(),
  city: DS.attr(),
  name: DS.attr(),
  actuality: DS.attr(),

  workplace: DS.belongsTo('workplace'),

  employee: DS.hasMany('employee'),
  workshift: DS.hasMany('workshift'),
  room: DS.hasMany('room'),
  workshiftType: DS.hasMany('workshift-type'),
});
