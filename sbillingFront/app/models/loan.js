import DS from 'ember-data';

export default DS.Model.extend({
  amount: DS.attr(),
  date: DS.attr(),
  status: DS.attr(),
  reason: DS.attr(),
  requisite: DS.attr(),
  actuality: DS.attr(),

  employee: DS.belongsTo('employee'),

  numberLoan: Ember.computed('date', function () {
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
