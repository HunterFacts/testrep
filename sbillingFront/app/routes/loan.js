import Route from './base-route';

export default Route.extend({
  routeTitle: 'Займ',
  async model(params) {
    let self = this;
    if (Ember.isEmpty(self.get('session.data.authenticated.workplace')))
      return null;
    let model = await this.store.findRecord('loan', params.id);
    await model.employee.then(function (employee) {
      model.employee = employee;
    });
    return model;
  },

  setupController: function (controller, model) {
    this._super(...arguments);
  },
});
