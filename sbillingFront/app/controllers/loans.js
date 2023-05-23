import Controller from './base-controller';
import EmberResolver from 'ember-resolver';
import Config from '../config/environment';
import { inject as service } from '@ember/service';

export default Controller.extend({
  session: service('session'),
  parentRoute: 'loan',
  modalOpenTochka: false,
  refreshTrigger: false,
  routing: service('-routing'),

  reload() {
    let currentRouteName = this.get('routing.currentRouteName');
    let currentRouteInstance = Ember.getOwner(this).lookup(
      `route:${currentRouteName}`
    );
    currentRouteInstance.refresh();
  },

  rows: [
    {
      typeName: 'employee.fio',
      headerText: 'ФИО сотрудника',
    },
    {
      typeName: 'amount',
      headerText: 'Сумма',
    },
    {
      typeName: 'reason',
      headerText: 'Причина',
    },
    {
      typeName: 'requisite',
      headerText: 'Реквизиты',
    },
    {
      typeName: 'date',
      headerText: 'Дата',
      isDate: true,
    },
  ],

  rowsEmployee: [
    {
      typeName: 'fio',
      headerText: 'ФИО',
    },
    {
      typeName: 'user.login',
      headerText: 'Логин',
    },
    {
      typeName: 'age',
      headerText: 'Возвраст',
    },
    {
      typeName: 'datebirth',
      headerText: 'Дата рождения',
    },
    {
      typeName: 'user.role',
      headerText: 'Роль',
    },
    {
      typeName: 'phone',
      headerText: 'Телефон',
    },
    {
      typeName: 'telegram',
      headerText: 'Телеграм',
    },
    {
      typeName: 'house.name',
      headerText: 'Точка',
    },
  ],

  loan: {
    amount: undefined,
    date: undefined,
    reason: undefined,
    requisite: undefined,
    employee: undefined
  },

  actions: {
    openModalNewLoan() {
      this.set('modalOpenLoan', true);
    },

    addNewLoan() {
      let loan = this.loan;
      if (Ember.isEmpty(loan.amount) || Ember.isEmpty(loan.employee)) {
        return M.toast({ html: 'Заполните необходимые данные' });
      }

      let self = this;
      loan.date = new moment();
      let newLoan = self.store.createRecord('loan', {
        amount: loan.amount,
        date: loan.date,
        reason: loan.reason,
        requisite: loan.requisite,
        actuality: 1,
        employee: loan.employee,
      });
      newLoan.save().then(function () {
        self.reload();
        self.set('loan', {
          amount: undefined,
          date: undefined,
          reason: undefined,
          requisite: undefined,
          employee: undefined
        });
        M.toast({ html: 'Аванс успешно внесён' });
        self.set('modalOpenLoan', false);
      });
    },
  }
});
