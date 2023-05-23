import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  router: service(),
  session: service(),
  beforeModel() {
    if (this.session.isAuthenticated) {
      this.router.transitionTo('desktop');
    }
  },
});
