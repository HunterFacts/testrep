import Route from './base-route';
import { inject as service } from '@ember/service';
import Config from '../config/environment';

export default Route.extend({
  routeTitle: 'Главная страница',
  router: service(),

  beforeModel(transition) {},

  model() {
    let self = this;
    return Ember.$.ajax({
      url: Config.APP.host + '/api/onlyread/modeldata',
      type: 'GET',
      headers: {
        Authorization:
          'Bearer ' + self.get('session.data.authenticated.access_token'),
      },
      data: {
        employee: self.get('session.data.authenticated.employee'),
      },
      contentType: 'application/json',
      error: function (xhr, status, e) {
        console.error(e);
      },
    });
  },

  setupController: function (controller, model) {
    this._super(...arguments);
    controller.raitingLoad();
    controller.raitingMonthLoad();
    controller.achievementsLoad();
  },
});
