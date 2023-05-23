import Ember from 'ember';
import { inject as service } from '@ember/service';
import Roles from '../mixins/roles';

export default Ember.Component.extend(Roles, {
  session: service('session'),
  router: service(),
  navbar: undefined,
  navbarCloseTrigger: false,
  routeTitle: undefined,

  navbarCloseTriggerObserver: Ember.observer('navbarCloseTrigger', function () {
    this.$('#slide-out').sidenav('close');
  }),

  username: Ember.computed.reads('session.data.authenticated.username'),

  didInsertElement() {
    this._super(...arguments);
    this.set('navbar', this.$('#slide-out').sidenav());
  },

  actions: {
    exitApp() {
      this.session.invalidate();
      this.router.transitionTo('login');
    },

    backHistory() {
      history.back();
    },
  },
});
