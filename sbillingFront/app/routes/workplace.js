import Route from './base-route';
import { inject as service } from '@ember/service';
import Config from '../config/environment';

export default Route.extend({
  routeTitle: 'Компания',
  store: service('store'),
  session: service('session'),

  model() {
    let self = this;
    if (Ember.isEmpty(self.get('session.data.authenticated.workplace')))
      return null;
    return this.store.findRecord(
      'workplace',
      self.get('session.data.authenticated.workplace')
    );

    return new Ember.RSVP.Promise(function (resolve, reject) {
      Ember.$.ajax({
        url: Config.APP.host + '/api/Workplaces/getWorkplaceByUser',
        type: 'GET',
        headers: {
          Authorization:
            'Bearer ' + self.get('session.data.authenticated.access_token'),
        },
        data: {
          id: self.get('session.data.authenticated.employee'),
        },
        success: function (data) {
          if (Ember.isEmpty(data)) {
            resolve(null);
          } else {
            resolve(data);
          }
        },
        error: function (xhr, status, e) {
          reject(e);
        },
      });
    });
  },
  setupController: function (controller, model) {
    this._super(...arguments);
    if (Ember.isEmpty(model)) {
      controller.set('isModelEmpty', true);
    }
  },
});
