import Route from './base-route';

export default Route.extend({
  routeTitle: 'Аккаунт',
  model(params) {
    let self = this;
    if (Ember.isEmpty(self.get('session.data.authenticated.workplace')))
      return null;
    return this.store.findRecord('account', params.id);
  },

  async afterModel(model) {
    this._super(...arguments);
    await model.employee.then(function (employee) {
      model.set('employee', employee);
    });
    return model;
  },
});
