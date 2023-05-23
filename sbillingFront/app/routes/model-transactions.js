import Route from './base-route';
import { inject as service } from '@ember/service';
import Config from '../config/environment';

export default Route.extend({
  routeTitle: 'История',

  model(params) {
    let self = this;
    return Ember.$.ajax({
      url: Config.APP.host + '/api/onlyread/getModelTransactions',
      type: 'GET',
      headers: {
        Authorization:
          'Bearer ' + self.get('session.data.authenticated.access_token'),
      },
      data: {
        employee: self.get('session.data.authenticated.employee'),
      },
      contentType: 'application/json',
    });
  },

  setupController: function (controller, model) {
    this._super(...arguments);
    controller.set('modelMeta', Object.assign(model));
  },
});
