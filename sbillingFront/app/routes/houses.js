import Route from './base-route';
import { inject as service } from '@ember/service';
import Config from '../config/environment';

export default Route.extend({
  routeTitle: 'Точки',
  store: service('store'),
  session: service('session'),

  model() {
    let self = this;
    if (Ember.isEmpty(self.get('session.data.authenticated.workplace')))
      return null;
    return this.store.query('house', {
      workplace: self.get('session.data.authenticated.workplace'),
    });
  },
  setupController: function (controller, model) {
    this._super(...arguments);
    if (Ember.isEmpty(model)) {
      controller.set('isModelEmpty', true);
    }
  },
});
