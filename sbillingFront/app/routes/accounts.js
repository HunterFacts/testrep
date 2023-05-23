import Route from './base-route';
import { inject as service } from '@ember/service';
import Config from '../config/environment';

export default Route.extend({
  routeTitle: 'Аккаунты',
  store: service('store'),
  session: service('session'),

  model() {
    let self = this;
    if (Ember.isEmpty(self.get('session.data.authenticated.workplace')))
      return null;

    if (this.roleOnlyManager()) {
      return this.store.query(
        'account',
        {
          workplace: self.get('session.data.authenticated.workplace'),
        },
        { reload: true }
      );
    } else if (this.roleOnlyAdministrator()) {
      return this.store.query(
        'account',
        {
          house: self.get('session.data.authenticated.house'),
        },
        { reload: true }
      );
    }
  },

  afterModel(models) {
    this._super(...arguments);
    models.forEach((model) => {
      model.employee.then(function (employee) {
        model.employee = employee;
        model.get('employee.house').then(function (house) {
          model.set('employee.house', house);
        });
      });
    });
    return models;
  },
  setupController: function (controller, model) {
    this._super(...arguments);
    if (Ember.isEmpty(model)) {
      controller.set('isModelEmpty', true);
    }
  },
});
