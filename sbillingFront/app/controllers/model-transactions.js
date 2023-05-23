import Controller from './base-controller';
import Config from '../config/environment';
import { inject as service } from '@ember/service';

export default Controller.extend({
  session: service('session'),
  routing: service('-routing'),
  modelMeta: undefined,

  search: undefined,

  searchObserver: Ember.observer('search', function () {
    this._search();
  }),

  modelObserver: Ember.observer('model', function () {
    this._search();
  }),

  _search() {
    let searchValue = this.search;
    let modelMeta = this.model;
    var filterModelMeta;
    filterModelMeta = modelMeta;
    filterModelMeta = filterModelMeta.sort(function (a, b) {
      return new Date(b.workshift.timestart) - new Date(a.workshift.timestart);
    });

    this.set('modelMeta', filterModelMeta);
  },

  actions: {
    toWorkshift(id) {
      this.transitionToRoute('workshift-administrator', id);
    },
  },
});
