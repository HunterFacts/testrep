import DS from 'ember-data';

export default DS.Model.extend({
  fio: DS.attr(),
  age: DS.attr(),
  phone: DS.attr(),
  datebirth: DS.attr(),
  telegram: DS.attr(),
  actuality: DS.attr(),
  studying: DS.attr(),
  procent: DS.attr(),

  user: DS.belongsTo('people'),
  workplace: DS.belongsTo('workplace'),
  house: DS.belongsTo('house'),

  employeeOnWorkshift: DS.hasMany('employee-on-workshift'),
  account: DS.hasMany('account'),
  answerPetition: DS.hasMany('answer-petition'),
  loan: DS.hasMany('loan'),
  penaltyOnShift: DS.hasMany('penalty-on-shift'),
  petition: DS.hasMany('petition'),
  workshift: DS.hasMany('workshift'),
  achievementOnEmployee: DS.hasMany('achievement-on-employee'),

  hasLoadingUser: Ember.observer('user.isLoading', function () {
    return this.set('user', this.get('user.content'));
  }),
});
