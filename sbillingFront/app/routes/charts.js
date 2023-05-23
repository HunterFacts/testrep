import Route from './base-route';
import { inject as service } from '@ember/service';
import Config from '../config/environment';

export default Route.extend({
  routeTitle: 'Аналитика',
  router: service(),
  store: service('store'),
  session: service('session'),
});
