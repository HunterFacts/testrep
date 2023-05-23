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
    week: 1,
  },

  model(params) {
    let self = this;
    let week = Ember.isEmpty(params.week) ? 0 : params.week;
    this.set('localWeek', week);
    return Ember.$.ajax({
      url: Config.APP.host + '/api/analytics/productionWorkshift',
      type: 'GET',
      headers: {
        Authorization:
          'Bearer ' + self.get('session.data.authenticated.access_token'),
      },
      data: {
        workplace: self.get('session.data.authenticated.workplace'),
        week: week,
      },
      contentType: 'application/json',
    });
  },

  setupController: function (controller, model) {
    this._super(...arguments);
    let dolToRu = localStorage.getItem('dolToRu');

    let date = new moment();
    date.add(this.localWeek, 'weeks');
    let dayINeed = 1,
      today = date.isoWeekday();

    if (today > dayINeed) {
      date = date.isoWeekday(dayINeed);
    }

    controller.set('dolToRu', dolToRu);
    controller.set('weekDate', date);
    controller.set('modelMeta', Object.assign(model));
  },
});
