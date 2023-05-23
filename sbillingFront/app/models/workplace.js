import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  actuality: DS.attr(),

  employee: DS.hasMany('employee'),
  house: DS.hasMany('house'),
});
