import Route from './base-route';
import { inject as service } from '@ember/service';
import Config from '../config/environment';

export default Route.extend({
  routeTitle: 'Сотрудники',
  store: service('store'),
  session: service('session'),

  model() {
    let self = this;
    if (Ember.isEmpty(self.get('session.data.authenticated.workplace')))
      return null;
    if (this.roleOnlyManager()) {
      return this.store.query(
        'employee',
        { workplace: self.get('session.data.authenticated.workplace') },
        { reload: true }
      );
    } else if (this.roleOnlyAdministrator()) {
      return this.store.query(
        'employee',
        { house: self.get('session.data.authenticated.house'), role: 'model' },
        { reload: true }
      );
    }
  },

  async afterModel(models) {
    this._super(...arguments);
    await Promise.all(
      models.map((model) => {
        model.user.then(function (user) {
          model.user = user;
        });
        model.workplace.then(function (workplace) {
          model.workplace = workplace;
        });
        model.house.then(function (house) {
          model.house = house;
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
