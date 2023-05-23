import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  session: service('session'),

  identification: '',
  password: '',

  actions: {
    async auth() {
      let appController = Ember.getOwner(this).lookup('controller:application');
      appController.preloaderStart();
      self = this;
      try {
        let credentials = this.getProperties('identification', 'password');
        let authenticator = 'authenticator:token'; // or 'authenticator:jwt'
        await this.session
          .authenticate(authenticator, credentials)
          .then(function (data) {
            self.transitionToRoute('desktop');
            appController.preloaderStop();
            location.reload();
          })
          .catch(function (data) {
            M.toast({ html: 'Неверный логин или пароль' });
            appController.preloaderStop();
          })
          .finally(function () {});
      } catch (response) {}
    },

    updateIdentification(e) {
      this.set('identification', e.target.value);
    },

    updatePassword(e) {
      this.set('password', e.target.value);
    },
  },
});
