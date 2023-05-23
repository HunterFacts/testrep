import DS from 'ember-data';
import ENV from '../config/environment';
import { inject as service } from '@ember/service';
import Config from '../config/environment';
import AdaptersUuidMixin from 'ember-cli-uuid/mixins/adapters/uuid';

export default DS.RESTAdapter.extend(AdaptersUuidMixin, {
  namespace: ENV.APP.namespace,
  host: ENV.APP.host,
  session: service('session'),

  headers: Ember.computed(
    'session.{data.authenticated.access_token,isAuthenticated}',
    function () {
      let self = this;
      let headers = {};
      if (this.get('session.isAuthenticated')) {
        headers['Authorization'] = `Bearer ${self.get('session.data.authenticated.access_token')}`;
      }

      return headers;
    }
  ),

  findRecord: function (store, type, id, snapshot) {
    if (Ember.isEmpty(snapshot.adapterOptions)) {
      return this._super(...arguments);
    }
    if (Ember.get(snapshot.adapterOptions, 'include')) {
      let url = this.buildURL(type.modelName, id, snapshot, 'findRecord');
      let query = {
        include: Ember.get(snapshot.adapterOptions, 'include'),
      };
      return this.ajax(url, 'GET', { data: query });
    } else {
      this._super(...arguments);
    }
  },

  /*queryRecord(store, type, query) {
    let modelName = type.modelName;
    return fetch(Config.APP.host +'/api/'+modelName+'s'+'/'+query);
  },*/

  handleResponse(status) {
    if (status === 401 && this.get('session.isAuthenticated')) {
      this.session.invalidate();
    }
    return this._super(...arguments);
  },
});
