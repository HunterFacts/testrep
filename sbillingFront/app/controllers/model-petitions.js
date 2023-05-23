import Controller from './base-controller';
import Config from '../config/environment';
import { inject as service } from '@ember/service';
import moment from 'moment';

export default Controller.extend({
  modalOpenNewPetition: false,
  routing: service('-routing'),
  session: service('session'),
  store: service('store'),

  reload() {
    let currentRouteName = this.get('routing.currentRouteName');
    let currentRouteInstance = Ember.getOwner(this).lookup(
      `route:${currentRouteName}`
    );
    currentRouteInstance.refresh();
  },

  actions: {
    openPetition() {
      this.set('modalOpenNewPetition', true);
    },
    petitionCreate() {
      let typePetition = this.typePetition;
      let commentPetition = this.commentPetition;

      if (Ember.isEmpty(typePetition) || Ember.isEmpty(commentPetition))
        return M.toast({ html: 'Нельзя отправлять пустой обращение' });

      let self = this;
      let date = new moment();

      this.store
        .findRecord('employee', self.get('session.data.authenticated.employee'))
        .then(function (employee) {
          let petition = self.store.createRecord('petition', {
            type: typePetition,
            message: commentPetition,
            date: date,
            status: 'Отправлено',
            actuality: 1,
            workshift: null,
            employee: employee,
          });
          petition.save().then(function () {
            self.reload();
            self.set('typePetition', undefined);
            self.set('commentPetition', undefined);
            self.set('modalOpenNewPetition', false);
            M.toast({ html: 'Сообщение успешно отправлено' });
          });
        });
    },

    deletePetition(petition) {
      let self = this;
      let appController = Ember.getOwner(this).lookup('controller:application');
      appController.confirm(
        'Удалить обращение',
        'Вы действительно хотите удалить обращение?',
        function () {
          petition.deleteRecord();
          petition.save().then(function () {
            self.reload();
            M.toast({ html: 'Обращение успешно удалено' });
          });
        }
      );
    },
  },
});
