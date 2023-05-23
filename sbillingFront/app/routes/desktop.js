import Route from './base-route';
import { inject as service } from '@ember/service';
import Config from '../config/environment';

export default Route.extend({
  routeTitle: 'Рабочий стол',
  router: service(),
  store: service('store'),
  session: service('session'),

  beforeModel(transition) {
    if (this.get('session.isAuthenticated')) {
      if (this.roleOnlyModel()) {
        this.router.transitionTo('model-desktop');
      }
    } else {
      this.router.transitionTo('login');
    }
  },
});
