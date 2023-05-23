import Route from './base-route';
import { inject as service } from '@ember/service';
import Config from '../config/environment';
import moment from 'moment';

export default Route.extend({
  routeTitle: 'Список смен',
  store: service('store'),
  session: service('session'),
  queryParams: {
    room: null,
    date: null,
  },

  model(params) {
    let self = this;
    if (Ember.isEmpty(self.get('session.data.authenticated.workplace')))
      return null;
    if (this.roleOnlyManager()) {
      return this.store.query(
        'workshift',
        {
          workplace: self.get('session.data.authenticated.workplace'),
          employee: self.get('session.data.authenticated.employee'),
        },
        { reload: true }
      );
    }
    let date = Ember.isEmpty(params.date)
      ? new moment()
      : new moment(params.date);
    return this.store.query(
      'workshift',
      {
        house: self.get('session.data.authenticated.house'),
        date: date.format(),
      },
      { reload: true }
    );
  },

  async afterModel(models) {
    this._super(...arguments);
    await Promise.all(
      models.map((model) => {
        model.house.then(function (house) {
          model.house = house;
        });
      })
    );
    return models;
  },

  setupController: function (controller, model) {
    this._super(...arguments);
    if (this.roleOnlyManager()) {
      controller.set('isModelEmpty', true);
    }
  },
});
