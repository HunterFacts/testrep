import Route from './base-route';
import { inject as service } from '@ember/service';
import Config from '../config/environment';
import moment from 'moment';

export default Route.extend({
  routeTitle: 'Доход по компании',
  router: service(),

  beforeModel(transition) {},

  model() {
    var dateStart = new moment().subtract(7, 'days');
    var dateEnd = new moment().add(7, 'days');

    let self = this;
    return Ember.$.ajax({
      url: Config.APP.host + '/api/Analytics/incomeByRange',
      type: 'GET',
      headers: {
        Authorization:
          'Bearer ' + self.get('session.data.authenticated.access_token'),
      },
      data: {
        workplace: self.get('session.data.authenticated.workplace'),
        DateStart: dateStart.format('DD.MM.YYYY'),
        DateEnd: dateEnd.format('DD.MM.YYYY'),
      },
      contentType: 'application/json',
      error: function (xhr, status, e) {
        console.error(e);
      },
    });
  },

  setupController: function (controller, model) {
    var dateStart = new moment().subtract(7, 'days');
    var dateEnd = new moment().add(7, 'days');
    controller.set('dateStart', dateStart.format('DD.MM.YYYY'));
    controller.set('dateEnd', dateEnd.format('DD.MM.YYYY'));
    this._super(...arguments);
  },
});
