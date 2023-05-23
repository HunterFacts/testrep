import Route from './base-route';
import { inject as service } from '@ember/service';
import Config from '../config/environment';

export default Route.extend({
  routeTitle: 'Обращения',
  store: service('store'),
  session: service('session'),

  model() {
    let self = this;
    if (Ember.isEmpty(self.get('session.data.authenticated.workplace')))
      return null;
    if (this.roleOnlyManager()) {
      return this.store.query(
        'petition',
        { workplace: self.get('session.data.authenticated.workplace') },
        { reload: true }
      );
    } else if (this.roleOnlyAdministrator()) {
      return this.store.query(
        'petition',
        {
          house: self.get('session.data.authenticated.house'),
          ismanager: false,
        },
        { reload: true }
      );
    }
  },

  async afterModel(models) {
    this._super(...arguments);
    await Promise.all(
      models.map((model) => {
        model.employee.then(function (employee) {
          model.employee = employee;
        });
      })
    );
    return models;
  },
  setupController: function (controller, model) {
    this._super(...arguments);
    if (Ember.isEmpty(model)) {
      controller.set('isModelEmpty', true);
    }
  },
});
