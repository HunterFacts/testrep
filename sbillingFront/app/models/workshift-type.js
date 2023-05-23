import DS from 'ember-data';

export default DS.Model.extend({
  timestart: DS.attr(),
  timeend: DS.attr(),
  timename: DS.attr(),
  position: DS.attr(),
  shiftchange: DS.attr(),

  house: DS.belongsTo('house'),

  workshift: DS.hasMany('workshift'),
});
