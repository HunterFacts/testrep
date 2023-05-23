import DS from 'ember-data';

export default DS.Model.extend({
  numberRoom: DS.attr(),

  house: DS.belongsTo('house'),

  roomOnWorkshift: DS.hasMany('room-on-workshift'),
});
