import Controller from './base-controller';
import EmberResolver from 'ember-resolver';
import Config from '../config/environment';
import { inject as service } from '@ember/service';

export default Controller.extend({
  session: service('session'),
  parentRoute: 'employee',
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
      isDate: true,
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

  rowsHouse: [
    {
      typeName: 'name',
      headerText: 'Наименование',
    },
    {
      typeName: 'city',
      headerText: 'Город',
    },
    {
      typeName: 'street',
      headerText: 'Улица',
    },
    {
      typeName: 'houseNumber',
      headerText: 'Номер дома',
    },
  ],

  employee: {
    fio: undefined,
    age: undefined,
    phone: undefined,
    datebirth: undefined,
    telegram: undefined,

    user: {
      login: undefined,
      role: undefined,
    },
    workplace: undefined,
    house: undefined,
  },

  saveEmployee(employee) {
    let self = this;
    let people = self.store.createRecord('people', {
      login: employee.user.login,
      role: employee.user.role,
    });
    people.save().then((people) => {
      let employeeNew = self.store.createRecord('employee', {
        fio: employee.fio,
        age: employee.age,
        phone: employee.phone,
        datebirth: new Date(employee.datebirth),
        telegram: employee.telegram,

        user: people,
        workplace: employee.workplace,
        house: employee.house,
      });
      employeeNew.save().then((employeeSaved) => {
        self.set('modalOpenEmployee', false);
        self.reload();
      });
    });
  },

  dataChanged: function () {
    this.set('refreshTrigger', !this.refreshTrigger);
  }.observes('model.firstObject.user.isPending'),

  actions: {
    newEmployeeOpenModal() {
      if (this.roleOnlyAdministrator()) {
        this.set('employee.user.role', 'model');
        this.set(
          'employee.house',
          this.get('session.data.authenticated.house')
        );
      }
      this.set('modalOpenEmployee', true);
    },

    addNewEmployee() {
      let employee = this.employee;
      if (
        Ember.isEmpty(employee.fio) ||
        Ember.isEmpty(employee.age) ||
        Ember.isEmpty(employee.datebirth) ||
        Ember.isEmpty(employee.user.login) ||
        Ember.isEmpty(employee.user.role) ||
        Ember.isEmpty(employee.house)
      ) {
        return M.toast({ html: 'Заполните необходимые данные' });
      }
      let self = this;
      self.store
        .findRecord(
          'workplace',
          self.get('session.data.authenticated.workplace')
        )
        .then(function (workplace) {
          employee.workplace = workplace;
          if (self.roleOnlyAdministrator()) {
            self.store
              .findRecord('house', self.get('session.data.authenticated.house'))
              .then(function (house) {
                employee.house = house;
                self.saveEmployee(employee);
              });
          } else {
            self.saveEmployee(employee);
          }
        });
    },
  },
});
