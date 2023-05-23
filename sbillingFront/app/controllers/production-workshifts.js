import Controller from './base-controller';
import Config from '../config/environment';
import { inject as service } from '@ember/service';
import moment from 'moment';

export default Controller.extend({
  session: service('session'),
  routing: service('-routing'),
  modelMeta: undefined,
  search: undefined,

  searchObserver: Ember.observer('search', function () {
    this._search();
  }),

  _search() {
    let searchValue = this.search;
    let modelMeta = this.model;
    var filterModelMeta;

    if (Ember.isEmpty(searchValue)) {
      filterModelMeta = modelMeta;
    } else {
      filterModelMeta = modelMeta.filter(
        (modelIsMeta) => modelIsMeta.employee.fio.indexOf(searchValue) != -1
      );
    }

    this.set('modelMeta', filterModelMeta);
  },

  regenerateModel() {
    let appController = Ember.getOwner(this).lookup('controller:application');
    appController.preloaderStart();
    let self = this;
    let week = Ember.isEmpty(this.week) ? 0 : this.week;
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
      success: function (data) {
        let date = new moment();
        date.add(week, 'weeks');
        let dayINeed = 1,
          today = date.isoWeekday();

        if (today > dayINeed) {
          date = date.isoWeekday(dayINeed);
        }
        self.set('weekDate', date);

        self.set('model', data);
        self._search();
      },
      complete: function () {
        appController.preloaderStop();
      },
    });
  },

  actions: {
    plusWeek() {
      let week = Ember.isEmpty(this.week) ? 0 : this.week;
      let weekCount = parseInt(week, 10);
      weekCount++;

      this.set('week', weekCount);
      this.regenerateModel();
    },

    minusWeek() {
      let week = Ember.isEmpty(this.week) ? 0 : this.week;
      let weekCount = parseInt(week, 10);
      weekCount--;

      this.set('week', weekCount);
      this.regenerateModel();
    },
  },
});
