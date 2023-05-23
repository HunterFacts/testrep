import DS from 'ember-data';

export default DS.Model.extend({
  receive: DS.belongsTo('employee'),
  give: DS.belongsTo('employee'),
});
