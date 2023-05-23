import Route from './base-route';
import { inject as service } from '@ember/service';
import Config from '../config/environment';

export default Route.extend({
  routeTitle: 'Мои авансы',
  router: service(),
  session: service('session'),

  model() {
    let self = this;
    return this.store.query(
      'loan',
      { employee: self.get('session.data.authenticated.employee') },
      { reload: true }
    );
  },

  setupController: function (controller, model) {
    this._super(...arguments);
  },
});
