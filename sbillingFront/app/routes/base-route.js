import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import Roles from '../mixins/roles';

export default Route.extend(Roles, {
  session: service(),
  routeTitle: null,
  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');
  },

  reload: function () {
    this.refresh();
  },

  afterModel(models) {
    this._super(...arguments);
    let appController = Ember.getOwner(this).lookup('controller:application');
    appController.preloaderStop();
  },

  setupController: function (controller, model) {
    this._super(...arguments);
    let appController = Ember.getOwner(this).lookup('controller:application');
    appController.set('routeTitle', this.routeTitle);
  },

  actions: {
    willTransition(transition) {
      this._super(...arguments);
      let appController = Ember.getOwner(this).lookup('controller:application');
      appController.set('sidenavTrigger', !appController.get('sidenavTrigger'));
      appController.preloaderStart();
    },
  },
});
