import Controller from '@ember/controller';
import EmberResolver from 'ember-resolver';
import Config from '../config/environment';
import { inject as service } from '@ember/service';

export default Controller.extend({
  session: service('session'),
  parentRoute: 'account',
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
      typeName: 'name',
      headerText: 'Аккаунт',
    },
    {
      typeName: 'employee.fio',
      headerText: 'ФИО сотрудника',
    },
    {
      typeName: 'employee.house.name',
      headerText: 'Точка',
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

  account: {
    name: undefined,
    employee: undefined,
  },

  dataChanged: function () {
    this.set('refreshTrigger', !this.refreshTrigger);
  }.observes('model.firstObject.user.isPending'),

  actions: {
    newAccountOpenModal() {
      this.set('modalOpenAccount', true);
    },

    addNewAccount() {
      let account = this.account;
      if (Ember.isEmpty(account.name) || Ember.isEmpty(account.employee)) {
        return M.toast({ html: 'Заполните необходимые данные' });
      }
      let self = this;
      let accountNew = this.store.createRecord('account', {
        name: account.name,
        employee: account.employee,
      });
      accountNew.save().then((employeeSaved) => {
        self.set('modalOpenAccount', false);
        self.reload();
      });
    },
  },
});
