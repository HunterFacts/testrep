import DS from 'ember-data';

export default DS.Model.extend({
  date: DS.attr(),
  timestart: DS.attr(),
  timeend: DS.attr(),
  token: DS.attr(),
  actuality: DS.attr(),
  isfull: DS.attr(),

  house: DS.belongsTo('house'),
  wtype: DS.belongsTo('workshift-type'),
  responsible: DS.belongsTo('employee'),

  employeeOnWorkshift: DS.hasMany('employee-on-workshift'),
  penaltyOnShift: DS.hasMany('penalty-on-shift'),
  petition: DS.hasMany('petition'),
  roomOnWorkshift: DS.hasMany('room-on-workshift'),

  status: Ember.computed('timestart', 'timeend', function () {
    if (Ember.isEmpty(this.timeend)) {
      return 'Открыта';
    } else {
      return 'Закрыта';
    }
  }),
});
