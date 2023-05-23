import Route from './base-route';

export default Route.extend({
  routeTitle: 'Обращение',
  async model(params) {
    let self = this;
    if (Ember.isEmpty(self.get('session.data.authenticated.workplace')))
      return null;
    let model = await this.store.findRecord('petition', params.id);
    await model.get('answerPetition');
    await model.employee.then(function (employee) {
      model.employee = employee;
    });
    return model;
  },

  async afterModel(models) {
    this._super(...arguments);
    var answers = await models.get('answerPetition');
    await Promise.all(
      await answers.map((model) => {
        model.get('employee').then((employee) => {
          model.set('employee', employee);
        });
      })
    );
    return models;
  },

  setupController: function (controller, model) {
    this._super(...arguments);
  },
});
