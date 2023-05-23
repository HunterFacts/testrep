import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import moment from 'moment';
import Config from '../config/environment';
import Roles from '../mixins/roles';

export default Controller.extend(Roles, {
  modalEmployeeStatus: false,
  store: service('store'),
  session: service('session'),
  routing: service('-routing'),
  modalAddToken: false,
  employeeModal: false,
  modelEmployee: undefined,
  modelEmployeePenalty: undefined,
  newPenaltyAmount: undefined,
  newPenaltyReason: undefined,
  currentRoom: undefined,
  queryParams: ['room'],
  sortPropertiesEmployee: ['fio:asc'],
  sortedModelMeta: Ember.computed.sort('modelMeta', 'sortPropertiesEmployee'),
  rows: [
    {
      typeName: 'employee.fio',
      headerText: 'ФИО',
    },
    {
      typeName: 'account.name',
      headerText: 'Аккаунт',
    },
    {
      typeName: 'token',
      headerText: 'Токены',
    },
  ],

  rowsAccount: [
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

  rowsPenalty: [
    {
      typeName: 'amount',
      headerText: 'Сумма штрафа',
    },
    {
      typeName: 'reason',
      headerText: 'Штраф',
    },
  ],

  rowsPenalty: [
    {
      typeName: 'amount',
      headerText: 'Сумма штрафа',
    },
    {
      typeName: 'reason',
      headerText: 'Штраф',
    },
    {
      typeName: 'employee.fio',
      headerText: 'Сотрудник',
    },
  ],

  sortProperties: ['room.numberRoom'],
  sortedModel: Ember.computed.sort('model.roomOnWorkshift', 'sortProperties'),

  totalTokens: undefined,

  currentRoomOnWorkshift: undefined,

  roomOnWorkshiftObserver: Ember.observer(
    'model.roomOnWorkshift.@each',
    'room',
    function () {
      this._changeCurrentRoomOnWorkshift();
    }
  ),

  modelMeta: undefined,

  search: undefined,

  searchObserver: Ember.observer('search', function () {
    this._search();
  }),

  _search() {
    let searchValue = this.search;
    let modelMeta = this.employeeList;
    let filterModelMeta;

    if (Ember.isEmpty(searchValue)) {
      filterModelMeta = modelMeta;
    } else {
      filterModelMeta = modelMeta.filter(
        (modelIsMeta) => modelIsMeta.get('fio').indexOf(searchValue) != -1
      );
    }

    this.set('modelMeta', filterModelMeta);
  },

  _changeCurrentRoomOnWorkshift() {
    let total = 0;
    this.get('model.roomOnWorkshift').map((element) => {
      total = Number(total) + Number(element.get('token'));
    });
    this.set('totalTokens', total);
    this.set(
      'currentRoomOnWorkshift',
      this.get('model.roomOnWorkshift').filter(
        (x) => x.get('room.id') == this.room
      ).firstObject
    );
  },

  getCurrentRoomOnWorkshift() {
    return this.get('model.roomOnWorkshift').filter(
      (x) => x.get('room.id') == this.room
    ).firstObject;
  },

  _getPenaltyAll(model) {
    let self = this,
      workshiftId = model.id;

    this.store
      .query('penalty-on-shift', {
        workshift: workshiftId,
      })
      .then(function (list) {
        self.set('penaltyReadOnly', list);
      });
  },

  reload() {
    let currentRouteName = this.get('routing.currentRouteName');
    let currentRouteInstance = Ember.getOwner(this).lookup(
      `route:${currentRouteName}`
    );
    currentRouteInstance.refresh();
  },

  employeeWorkshiftObserver: Ember.observer(
    'model.employeeOnWorkshift.@each',
    function () {
      let self = this,
        ids = self
          .get('model.employeeOnWorkshift')
          .map((x) => x.get('employee.id'))
          .join(',');
      /*this.store.query('employeeOnWorkshift', {workshift: modelWorkshift.id}, {reload: true}).then((employeeOnWorkshift) => {
      ids = employeeOnWorkshift.map((x) => x.get('employee.id')).join(',');
    });*/
      this.store
        .query('employee', {
          house: self.get('session.data.authenticated.house'),
          role: 'model',
          notIds: ids,
        })
        .then(function (list) {
          list.forEach((element) => {
            element.get('user').then(function (user) {
              element.set('user', user);
            });
          });
          self.set('employeeList', list);
          self._search();
        });
    }
  ),

  _getPenalty() {
    let employeeId = this.get('modelEmployee.employee.id');
    let workshiftId = this.get('model.id');

    let self = this;
    this.store
      .query('penalty-on-shift', {
        employee: employeeId,
        workshift: workshiftId,
      })
      .then(function (list) {
        self.set('modelEmployeePenalty', list);
      });
  },

  employeeList: undefined,

  sortEmployeeArray(x, y) {
    if (x.get('fio') < y.get('fio')) {
      return -1;
    }
    if (x.get('fio') > y.get('fio')) {
      return 1;
    }
    return 0;
  },

  actions: {
    addEmployeeOpenModal() {
      this.set('modalEmployeeStatus', true);
    },

    saveEmployees() {
      let self = this;
      let countEmployeesSelected =
        this.employeeList.filter((employee) => employee.get('colorSelect'))
          .length +
        this.model
          .get('employeeOnWorkshift')
          .filter((employeeOnWorkshift) =>
            employeeOnWorkshift.get('colorSelect')
          ).length;
      let checker = 0;
      this.employeeList.forEach((employee) => {
        if (employee.get('colorSelect')) {
          employee.set('colorSelect', false);
          let employeeOnWorkshift = self.store.createRecord(
            'employeeOnWorkshift',
            {
              token: 0,
              workshift: self.model,
              roomOnWorkshift: self.getCurrentRoomOnWorkshift(),
              employee: employee,
            }
          );
          employeeOnWorkshift.save().then(function () {
            M.toast({ html: employee.get('fio') + ' добавлен(а)' });
          });
          checker++;
        }
      });
      this.model.get('employeeOnWorkshift').forEach((employeeOnWorkshift) => {
        if (employeeOnWorkshift.get('colorSelect')) {
          employeeOnWorkshift.deleteRecord();
          employeeOnWorkshift.save().catch((ex) => {
            let i = 0;
          });
          checker++;
        }
      });
      if (countEmployeesSelected == checker) {
        self.model.reload();
        self.set('modalEmployeeStatus', false);
      }
    },

    employeeTRClick(employeeId) {
      let self = this;
      this.employeeList.forEach((employee) => {
        if (employee.id == employeeId)
          employee.set(
            'colorSelect',
            Ember.isEmpty(employee.get('colorSelect')) ||
              !employee.get('colorSelect')
          );
      });
    },

    employeeWorkshiftTRClick(employeeOnWorkshiftId) {
      let self = this;
      this.model.employeeOnWorkshift.forEach((employeeOnWorkshift) => {
        if (employeeOnWorkshift.id == employeeOnWorkshiftId) {
          employeeOnWorkshift.set(
            'colorSelect',
            Ember.isEmpty(employeeOnWorkshift.get('colorSelect')) ||
              !employeeOnWorkshift.get('colorSelect')
          );
        }
      });
    },

    closedWorkshift() {
      let self = this;
      let appController = Ember.getOwner(this).lookup('controller:application');
      return appController.confirm(
        'Закрыть текущую смену?',
        'Это действие необратимо. Будет проставлено время закрытия смены. Данные о токенах и сотрудниках больше нельзя будет изменить. Продолжить?',
        function () {
          let allRoomOnWorkshift = self.get('model.roomOnWorkshift').length;
          let roomChecker = 0;
          self.get('model.roomOnWorkshift').forEach((model) => {
            let allTokens = Number(model.get('token'));
            let checker = 0;
            let zeroTokenEmployee = Ember.A();
            model.get('employeeOnWorkshift').forEach((employeeOnWorkshift) => {
              let employeeToken = employeeOnWorkshift.get('token');
              if (Ember.isEmpty(employeeToken) || employeeToken == 0) {
                zeroTokenEmployee.push(employeeOnWorkshift);
              } else {
                if (Number(allTokens) < Number(employeeToken)) {
                  return M.toast({
                    html: 'У сотрудника больше токенов, чем в общем у смены',
                  });
                } else {
                  allTokens = allTokens - Number(employeeToken);
                }
              }
            });
            let tokenbyEmployee = 0;
            roomChecker++;
            if (zeroTokenEmployee.length != 0) {
              let isAllEmployeeOnWorkshiftCount = zeroTokenEmployee.length;
              tokenbyEmployee = allTokens / zeroTokenEmployee.length;
              zeroTokenEmployee.forEach((employeeOnWorkshift) => {
                employeeOnWorkshift.set('token', Math.floor(tokenbyEmployee));
                employeeOnWorkshift.save().finally(function () {
                  checker++;
                  if (
                    checker == isAllEmployeeOnWorkshiftCount &&
                    allRoomOnWorkshift == roomChecker
                  ) {
                    let dateClosed = new moment();
                    self.model.set('timeend', dateClosed);
                    self.model.set('token', self.get('totalTokens'));
                    self.model.save().then(() => {
                      M.toast({ html: 'Смена успешно закрыта' });
                      self.set('onlyread', false);
                      self._getPenaltyAll(self.get('model'));
                      self.reload();
                    });
                  }
                });
              });
            } else {
              if (allRoomOnWorkshift == roomChecker) {
                let dateClosed = new moment();
                self.model.set('timeend', dateClosed);
                self.model.set('token', self.get('totalTokens'));
                self.model.save().then(() => {
                  M.toast({ html: 'Смена успешно закрыта' });
                  self.set('onlyread', false);
                  self.reload();
                });
              }
            }
          });
        }
      );
    },

    openWorkshift() {
      let self = this;
      self.model.set('timeend', null);
      self.model.save().then(() => {
        M.toast({ html: 'Смена успешно открыта' });
        self.set('onlyread', true);
        self.reload();
      });
    },

    openModalToken() {
      this.set('tokenNew', undefined);
      this.set('modalAddToken', true);
    },

    addToken() {
      let self = this;
      let token = self.get('tokenNew');

      if (!/^\d+$/.test(token)) {
        return M.toast({
          html: 'Вы должны указать количество токенов в цифрах',
        });
      }
      self.set('currentRoomOnWorkshift.token', token);
      self
        .get('currentRoomOnWorkshift')
        .save()
        .then(() => {
          M.toast({ html: 'Количество токенов успешно изменено' });
          self._changeCurrentRoomOnWorkshift();
          self.set('modalAddToken', false);
        });
    },

    saveEmployeeOnWorkshift() {
      let self = this;
      self
        .get('modelEmployee')
        .save()
        .then(function () {
          M.toast({ html: 'Данные успешно применены' });
          self.set('employeeModal', false);
        });
    },

    clickEmployeeOnWorkshift(id, record) {
      if (this.onlyread) {
        this.set('modelEmployee', record);
        this._getPenalty();
        this.set('employeeModal', true);
      } else {
        this.set('employeeModal', false);
      }
    },

    changeRoom(room) {
      this.set('room', room.get('id'));
      this.set('currentRoom', room.get('numberRoom'));
      this.reload();
    },

    addPenalty() {
      let newPenaltyReason = this.newPenaltyReason;
      let newPenaltyAmount = this.newPenaltyAmount;

      if (Ember.isEmpty(newPenaltyReason) || Ember.isEmpty(newPenaltyAmount))
        return M.toast({
          html: 'Сумма или причина штрафа не могут быть пустыми',
        });
      if (newPenaltyAmount <= 0)
        return M.toast({ html: 'Сумма указана неверно' });

      let self = this;
      let employee = self.get('modelEmployee.employee');
      let penaltyNew = self.store.createRecord('penalty-on-shift', {
        reason: newPenaltyReason,
        amount: newPenaltyAmount,
        actuality: 1,
        employee: employee,
        workshift: self.get('model'),
      });
      penaltyNew.save().then(function () {
        self._getPenalty();
        self.set('newPenaltyReason', undefined);
        self.set('newPenaltyAmount', undefined);
        M.toast({ html: 'Штраф записан' });
      });
    },
  },
});
