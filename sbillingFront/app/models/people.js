import DS from 'ember-data';

export default DS.Model.extend({
  login: DS.attr(),
  password: DS.attr(),
  role: DS.attr(),
  actuality: DS.attr(),

  employee: DS.hasMany('employee'),
});
