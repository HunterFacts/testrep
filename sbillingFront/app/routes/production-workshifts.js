import Route from './base-route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';
import Config from '../config/environment';
import moment from 'moment';

export default Route.extend({
  routeTitle: 'Выработка смен',
  store: service('store'),
  session: service('session'),
  localWeek: undefined,
  queryParams: {
    week: 0,
  },

  model(params) {
    let self = this;
    let week = Ember.isEmpty(params.week) ? 0 : params.week;
    this.set('localWeek', week);
    return Ember.$.ajax({
      url: Config.APP.host + '/api/analytics/productionWorkshiftLight',
      type: 'GET',
      headers: {
        Authorization:
          'Bearer ' + self.get('session.data.authenticated.access_token'),
      },
      data: {
        house: self.get('session.data.authenticated.house'),
        week: week,
      },
      contentType: 'application/json',
    });
  },

  setupController: function (controller, model) {
    this._super(...arguments);

    let date = new moment();
    date.add(this.localWeek, 'weeks');
    let dayINeed = 1,
      today = date.isoWeekday();

    if (today > dayINeed) {
      date = date.isoWeekday(dayINeed);
    }

    controller.set('weekDate', date);
    controller.set('modelMeta', Object.assign(model));
  },
});
