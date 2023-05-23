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
    openLoan() {
      this.set('modalOpenLoan', true);
    },
    saveLoan() {
      let loanAmount = this.loanAmount;
      let loanComment = this.loanComment;
      let loanType = this.loanType;
      let loanRequisite = this.loanRequisite;
      let self = this;
      let date = new moment();

      if (
        Ember.isEmpty(loanComment) ||
        Ember.isEmpty(loanType) ||
        Ember.isEmpty(loanAmount)
      ) {
        return M.toast({ html: 'Заполните необходимые поля' });
      }
      if (loanType == 'Перевод') {
        if (Ember.isEmpty(loanRequisite)) {
          return M.toast({ html: 'Укажите ваши реквизиты для перевода' });
        }
      }

      this.store
        .findRecord('employee', self.get('session.data.authenticated.employee'))
        .then(function (employee) {
          let loan = self.store.createRecord('loan', {
            amount: loanAmount,
            date: date,
            status: 'Запрошен',
            reason: loanComment,
            receivingOption: loanType,
            requisite: loanRequisite,
            actuality: 1,
            employee: employee,
          });
          loan.save().then(function () {
            self.reload();
            self.set('loanAmount', undefined);
            self.set('loanComment', undefined);
            self.set('loanType', undefined);
            self.set('loanRequisite', undefined);
            self.set('modalOpenLoan', false);
            M.toast({ html: 'Запрос средств отправлен' });
          });
        });
    },

    deleteLoan(loan) {
      self = this;
      let appController = Ember.getOwner(this).lookup('controller:application');
      appController.confirm(
        'Удалить займ',
        'Вы действительно хотите удалить займ?',
        function () {
          loan.deleteRecord();
          loan.save().then(function () {
            self.reload();
            M.toast({ html: 'Займ успешно удален' });
          });
        }
      );
    },
  },
});
