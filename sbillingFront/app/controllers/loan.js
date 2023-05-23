import Controller from './base-controller';
import Config from '../config/environment';
import { inject as service } from '@ember/service';

export default Controller.extend({
  session: service('session'),
  read: false,
  modalAnswer: false,
  routing: service('-routing'),

  actions: {
    accept() {
      this.set('model.status', 'Получен');
      this.model.save().then(function () {
        M.toast({ html: 'Средства выданы в долг' });
      });
    },

    decline() {
      this.set('model.status', 'Отклонен');
      this.model.save().then(function () {
        M.toast({ html: 'Займ отклонён' });
      });
    },

    veryGood() {
      this.set('model.status', 'Отдан');
      this.model.save().then(function () {
        M.toast({ html: 'Долг отдан' });
      });
    },

    bad() {
      this.set('model.status', 'Получен');
      this.model.save().then(function () {
        M.toast({ html: 'Требование выплаты долга возвращено' });
      });
    },
  },
});
