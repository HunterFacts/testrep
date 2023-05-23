import Controller from './base-controller';
import Config from '../config/environment';
import { inject as service } from '@ember/service';

export default Controller.extend({
  session: service('session'),
  routing: service('-routing'),
  modelMeta: undefined,

  dolToRu: 78,

  dolToRuObserver: Ember.observer('dolToRu', function() {
    let dolToRu = this.get('dolToRu');
    localStorage.setItem('dolToRu', dolToRu);
  }),

  search: undefined,

  searchObserver: Ember.observer('search', function () {
    this._search();
  }),
  isSort: true,

  _search() {
    let searchValue = this.search;
    let modelMeta = this.model;
    let filterModelMeta;

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

    sortStatus: false,
    sort(sortname, twoSortName) {
      let modelMeta = this.modelMeta,
        filterModelMeta,
        sortStatus = this.get('sortStatus');
        
      if (Ember.isEmpty(twoSortName)) {
        if (sortStatus) {
          filterModelMeta = modelMeta.sort(function (a, b) {
            if (a[sortname] < b[sortname]) {
              return -1;
            }
            if (a[sortname] > b[sortname]) {
              return 1;
            }
            return 0;
          });
        }
        else {
          filterModelMeta = modelMeta.sort(function (a, b) {
            if (a[sortname] > b[sortname]) {
              return -1;
            }
            if (a[sortname] < b[sortname]) {
              return 1;
            }
            return 0;
          });
        }
      }
      else {
        if (sortStatus) {
          filterModelMeta = modelMeta.sort(function (a, b) {
            if (a[sortname][twoSortName] < b[sortname][twoSortName]) {
              return -1;
            }
            if (a[sortname][twoSortName] > b[sortname][twoSortName]) {
              return 1;
            }
            return 0;
          });
        }
        else {
          filterModelMeta = modelMeta.sort(function (a, b) {
            if (a[sortname][twoSortName] > b[sortname][twoSortName]) {
              return -1;
            }
            if (a[sortname][twoSortName] < b[sortname][twoSortName]) {
              return 1;
            }
            return 0;
          });
        }
      }

      this.set('sortStatus', !sortStatus);
      this.set('modelMeta', null);
      this.set('modelMeta', filterModelMeta);
    },

    sortWeek() {
      let modelMeta = this.modelMeta;
      let filterModelMeta;

      filterModelMeta = modelMeta.sort(function (a, b) {
        if (a.tokenWeekly > b.tokenWeekly) {
          return -1;
        }
        if (a.tokenWeekly < b.tokenWeekly) {
          return 1;
        }
        return 0;
      });
      this.set('modelMeta', null);
      this.set('modelMeta', filterModelMeta);
    },

    sortMonth() {
      let modelMeta = this.modelMeta;
      let filterModelMeta;
      filterModelMeta = modelMeta.sort(function (a, b) {
        if (a.tokenMonth > b.tokenMonth) {
          return -1;
        }
        if (a.tokenMonth < b.tokenMonth) {
          return 1;
        }
        return 0;
      });
      this.set('modelMeta', null);
      this.set('modelMeta', filterModelMeta);
    },
    
    chartEmployee(id) {
      this.transitionToRoute('chart-employee', id);
    },
  },
});
