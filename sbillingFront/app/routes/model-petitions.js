import Route from './base-route';
import { inject as service } from '@ember/service';
import Config from '../config/environment';

export default Route.extend({
  routeTitle: 'Мои обращения',
  router: service(),
  session: service('session'),

  model() {
    let self = this;
    return this.store.query(
      'petition',
      { employee: self.get('session.data.authenticated.employee') },
      { reload: true }
    );
  },

  async afterModel(models) {
    this._super(...arguments);
    await Promise.all(
      models.map((model) => {
        var answersPetition = model.get('answerPetition');
        answersPetition.map((answerPetition) => {
          answerPetition.employee.then(function (employee) {
            answerPetition.employee = employee;
          });
        });
      })
    );
    return models;
  },

  setupController: function (controller, model) {
    this._super(...arguments);
  },
});
