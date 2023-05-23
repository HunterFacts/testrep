import Route from '@ember/routing/route';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Route.extend(ApplicationRouteMixin, {
  sessionAuthenticated() {
    M.toast({ html: 'Авторизация успешна' });
  },

  actions: {
    willTransition: function (transition) {
      let controller = this.controller;
      controller.set('sidenavTrigger', !controller.get('sidenavTrigger'));
    },
  },
});
