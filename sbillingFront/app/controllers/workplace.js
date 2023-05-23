import Controller from '@ember/controller';
import EmberResolver from 'ember-resolver';
import Config from '../config/environment';
import { inject as service } from '@ember/service';

export default Controller.extend({
  isModelEmpty: false,
  isOpenWriteName: false,
  workplaceName: undefined,
  session: service('session'),
  store: service('store'),
  routing: service('-routing'),
  modalOpenUsers: false,
  modalOpenTochka: false,
  userLogin: undefined,

  reload() {
    let currentRouteName = this.get('routing.currentRouteName');
    let currentRouteInstance = Ember.getOwner(this).lookup(
      `route:${currentRouteName}`
    );
    currentRouteInstance.refresh();
  },

  actions: {
    createWorkplace() {
      let self = this;
      if (!Ember.isEmpty(this.workplaceName)) {
        let appController = Ember.getOwner(this).lookup(
          'controller:application'
        );
        return appController.confirm(
          'Создать новую компанию?',
          'При создании компании ваша учетная запись связывается с ней. После создания компании вам придётся снова авторизоваться в системе. Продолжить?',
          function () {
            Ember.$.ajax({
              url: Config.APP.host + '/api/Workplaces/createWorkplace',
              type: 'POST',
              headers: {
                Authorization:
                  'Bearer ' +
                  self.get('session.data.authenticated.access_token'),
              },
              contentType: 'application/json',
              data: JSON.stringify({
                name: self.get('workplaceName'),
                idEmployee: self.get('session.data.authenticated.employee'),
              }),
              success: function (data) {
                self.session.invalidate();
                self.reload();
              },
              error: function (xhr, status, e) {
                console.error(e);
                M.toast({ html: 'Произошла ошибка при создании' });
              },
            });
          }
        );
      } else {
        let appController = Ember.getOwner(this).lookup(
          'controller:application'
        );
        appController.alert(
          'В названии франшизы не может быть указано пусто имя'
        );
      }
    },

    deleteUser(id) {
      let youId = this.get('session.data.authenticated.employee');
      if (youId == id) {
        return M.toast({ html: 'Вы не можете убрать сами себя' });
      }

      let self = this;

      let appController = Ember.getOwner(this).lookup('controller:application');
      appController.confirm(
        'Убрать совладельца?',
        'Вы действительно хотите удалить совладельца? Доступ к компании для него будет заблокирован',
        function () {
          self.store
            .findRecord('employee', id, { reload: true })
            .then(function (employee) {
              employee.set('workplace', null);
              employee.save().then(function () {
                self.reload();
              });
            });
        }
      );
    },

    deleteHouse(id) {
      let self = this;
      let appController = Ember.getOwner(this).lookup('controller:application');
      appController.confirm(
        'Убрать точку?',
        'Вы действительно хотите удалить рабочую точку?',
        function () {
          self.store
            .findRecord('house', id, { reload: true })
            .then(function (house) {
              house.deleteRecord();
              house.save().then(function () {
                self.reload();
              });
            });
        }
      );
    },

    addNewUserOpenModal() {
      this.set('modalOpenUsers', true);
    },

    addNewTochkaOpenModal() {
      this.set('housename', null);
      this.set('housestreet', null);
      this.set('housenum', null);
      this.set('housecity', null);
      this.set('modalOpenTochka', true);
    },

    addUser() {
      let self = this;
      if (!Ember.isEmpty(self.get('userLogin'))) {
        Ember.$.ajax({
          url: Config.APP.host + '/api/Employees/addEmployeeToWorkplace',
          type: 'POST',
          headers: {
            Authorization:
              'Bearer ' + self.get('session.data.authenticated.access_token'),
          },
          contentType: 'application/json',
          data: JSON.stringify({
            login: self.get('userLogin'),
            workplace: self.get('session.data.authenticated.workplace'),
          }),
          success: function (data) {
            self.set('modalOpenUsers', false);
            self.reload();
          },
          error: function (xhr, status, e) {
            console.error(e);
            M.toast({ html: 'Сотрудник не найден' });
          },
        });
      } else {
        M.toast({ html: 'Логин не может быть пустым' });
      }
    },

    addNewHouse() {
      let store = this.store,
        self = this,
        housename = this.housename,
        housestreet = this.housestreet,
        housenum = this.housenum,
        housecity = this.housecity;
      if (Ember.isEmpty(housecity)) {
        return M.toast({ html: 'Город не должен быть пустым' });
      }

      if (Ember.isEmpty(housename)) {
        return M.toast({ html: 'Наименование не должно быть пустым' });
      }

      let house = store.createRecord('house', {
        houseNumber: housenum,
        street: housestreet,
        city: housecity,
        name: housename,
        workplace: self.get('model'),
      });
      house.save().then(function () {
        self.set('modalOpenTochka', false);
        M.toast({ html: 'Точка успешна добавлена' });
      });
    },

    saveObject() {
      let self = this;
      if (Ember.isEmpty(self.get('workplaceName')))
        return M.toast({ html: 'Наименование не может быть пустым' });
      let model = self.get('model');
      self.set('model.name', self.get('workplaceName'));
      model.save().then(function () {
        M.toast({ html: 'Название изменено' });
        self.set('workplaceName', undefined);
      });
    },

    deleteObject() {
      let employees = this.get('model.employee'),
        houses = this.get('model.house');

      if (employees.length > 1 || !Ember.isEmpty(houses)) {
        let appController = Ember.getOwner(this).lookup(
          'controller:application'
        );
        return appController.alert(
          'Вы не можете удалить компанию, пока в ней есть совладельцы кроме вас, а также пока есть хотя бы одна точка!'
        );
      }

      let self = this;
      let appController = Ember.getOwner(this).lookup('controller:application');
      return appController.confirm(
        'Удалить текущую компанию?',
        'При удалении компании ваша учетная запись отвязывается от неё. После удаления компании вам придётся снова авторизоваться в системе. Продолжить?',
        function () {
          self.get('model.employee').forEach(function (employee) {
            employee.set('workplace', null);
            employee.save().then(function () {
              self.set('session.data.authenticated.workplace', null);
              self.reload();
            });
          });
        }
      );
    },
  },
});
