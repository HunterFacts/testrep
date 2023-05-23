import Route from './base-route';
import Config from '../config/environment';
import { inject as service } from '@ember/service';

export default Route.extend({
  routeTitle: 'Карточка сотрудника',
  async model(params) {
    let self = this;
    if (Ember.isEmpty(self.get('session.data.authenticated.workplace')))
      return null;
    return await Ember.$.ajax({
      url: Config.APP.host + '/api/analytics/IncomeEmployee',
      type: 'GET',
      headers: {
        Authorization:
          'Bearer ' + self.get('session.data.authenticated.access_token'),
      },
      data: {
        employee: params.id,
      },
      contentType: 'application/json',
    });
  },

  setupController: function (controller, model) {
    this._super(...arguments);
  },
});
