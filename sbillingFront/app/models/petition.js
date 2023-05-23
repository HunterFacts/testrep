import DS from 'ember-data';
import moment from 'moment';

export default DS.Model.extend({
  type: DS.attr(),
  message: DS.attr(),
  date: DS.attr(),
  status: DS.attr(),
  actuality: DS.attr(),

  workshift: DS.belongsTo('workshift'),
  employee: DS.belongsTo('employee'),

  answerPetition: DS.hasMany('answer-petition'),

  numberPetition: Ember.computed('date', function () {
    let dateMoment = new moment(this.date);
    return (
      dateMoment.month() +
      '' +
      dateMoment.date() +
      '' +
      dateMoment.hour() +
      '' +
      dateMoment.minute() +
      '' +
      dateMoment.second()
    );
  }),
});
