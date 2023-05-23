import Controller from '@ember/controller';
import notificationApplication from '../mixins/notification-application';
import { inject as service } from '@ember/service';

export default Controller.extend(notificationApplication, {
  session: service('session'),
  sidenavTrigger: false,
  routeTitle: undefined,
  preloader: false,

  preloaderStart() {
    this.set('preloader', true);
  },

  preloaderStop() {
    this.set('preloader', false);
  },
});
