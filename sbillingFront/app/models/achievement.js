import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  message: DS.attr(),
  image: DS.attr(),

  achievementOnEmployee: DS.hasMany('achievement-on-employee'),
});
