import Controller from './base-controller';
import Config from '../config/environment';
import { inject as service } from '@ember/service';

export default Controller.extend({
  session: service('session'),
  read: false,
  routing: service('-routing'),
  reload() {
    let currentRouteName = this.get('routing.currentRouteName');
    let currentRouteInstance = Ember.getOwner(this).lookup(
      `route:${currentRouteName}`
    );
    currentRouteInstance.refresh();
  },
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

  rowsReferral: [
    {
      typeName: 'give.fio',
      headerText: 'Реферал',
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

  achievementsAll: [],
  achievementEmployee: [],
  rebootAchievement: true,

  modelComputed: Ember.observer('model', function () {
    
    this.getAchievementsAll();
    let filters = {
      workplace: this.get('session.data.authenticated.workplace'),
      nonEmployee: this.get('model.id')
    }
    this.set('filtersReferral', filters);
    this._reloadListReferral();
  }),

  _reloadListReferral() {
    let self = this;
    return this.store.query('referral', {employee: self.model.id}).then((elements) => {
      self.set('sortedReferral', elements);
    });
  },

  getAchievementsAll() {
    let self = this;
    Ember.$.ajax({
      url: Config.APP.host + '/api/Achievement/GetAll',
      type: 'GET',
      headers: {
        Authorization:
          'Bearer ' +
          self.get('session.data.authenticated.access_token'),
      },
      contentType: 'application/json',
      success: function (data) {
        //self.set('achievementsAll', data);
        self.getAchievementsEmployee(data);
      },
      error: function (xhr, status, e) {
        console.error(e);
      },
    });
  },
  getAchievementsEmployee(_data) {
    let self = this,
      employeeId = this.get('model.id');
    Ember.$.ajax({
      url: Config.APP.host + '/api/Achievement/GetEmployeeAchievement',
      type: 'GET',
      data: {
        employee: employeeId
      },
      headers: {
        Authorization:
          'Bearer ' +
          self.get('session.data.authenticated.access_token'),
      },
      contentType: 'application/json',
      success: function (data) {
        self.set('achievementEmployee', data);
        _data.forEach(achievementElement => {
          var achieventEmployee = data.find(x => x.achievement == achievementElement.id);
          if (!Ember.isEmpty(achieventEmployee)) {
            achievementElement.active = true;
          }
        });
        self.set('achievementsAll', _data);
      },
      error: function (xhr, status, e) {
        console.error(e);
      },
    });
  },

  actions: {
    achievementTRClick(_achievement) {
      var achievement = this.get('achievementsAll').find(x=>x.id == _achievement.id)
      let self = this,
        employeeId = this.get('model.id');
      if (!achievement.active) {
        var achievementEmployees = self.get('achievementEmployee'),
        achievementEmployee = achievementEmployees.find(x => x.achievement == achievement.id);
        Ember.$.ajax({
          url: Config.APP.host + '/api/Achievement/deleteAchievementEmployee',
          type: 'GET',
          data: {
            achievementEmployee: achievementEmployee.id,
          },
          headers: {
            Authorization:
              'Bearer ' +
              self.get('session.data.authenticated.access_token'),
          },
          contentType: 'application/json',
          success: function () {
            var filtered = achievementEmployees.filter(function(el) { return el.id != achievementEmployee.id; });
            self.set('achievementEmployee', filtered);
            achievement.active = false;
          },
          error: function (xhr, status, e) {
            console.error(e);
          },
        });
      }
      else {
        Ember.$.ajax({
          url: Config.APP.host + '/api/Achievement/saveAchievementEmployee',
          type: 'GET',
          data: {
            employee: employeeId,
            achievement: achievement.id
          },
          headers: {
            Authorization:
              'Bearer ' +
              self.get('session.data.authenticated.access_token'),
          },
          contentType: 'application/json',
          success: function (data) {
            self.get('achievementEmployee').push(data);
            achievement.active = true;
          },
          error: function (xhr, status, e) {
            console.error(e);
          },
        });
      }
    },

    saveModel() {
      if (
        Ember.isEmpty(this.get('model.house.id')) ||
        Ember.isEmpty(this.get('model.fio'))
      ) {
        return M.toast({ html: 'Заполните необходимые поля' });
      }
      this.model.save().then(function () {
        M.toast({ html: 'Данные успешно изменены' });
      });
    },

    changePassword() {
      let password = this.localPassword,
        self = this,
        role = this.get('model.user.role');
      if (Ember.isEmpty(password))
        return M.toast({ html: 'Нельзя изменить пароль на пустой' });
      if (role == 'manager' || role == 'admin') {
        self.set('localPassword', null);
        return M.toast({ html: 'Нельзя изменять пароли управляющему' });
      }

      Ember.$.ajax({
        url: Config.APP.host + '/api/change-password',
        type: 'POST',
        headers: {
          Authorization:
            'Bearer ' + self.get('session.data.authenticated.access_token'),
        },
        contentType: 'application/json',
        data: JSON.stringify({
          password: password,
          employee: self.model.id,
        }),
        success: function (data) {
          self.set('localPassword', null);
          M.toast({ html: 'Пароль пользователя успешно изменен' });
        },
        error: function (xhr, status, e) {
          console.error(e);
          M.toast({ html: 'Произошла ошибка при смене пароля' });
        },
      });
    },

    openAchievement(achievement) {
      this.set('modalAchievementObject', achievement);
      this.set('modalAchievement', true);
    },

    newReferralModal() {
      this.set('modalReferralNew', true);
    },

    addNewReferral() {
      let self = this;
      let newReferral = this.newReferral;
      if (Ember.isEmpty(newReferral))
        return M.toast({ html: 'Укажите реферала' });
      let referral = self.store.createRecord('referral', {
        receive: this.model,
        give: newReferral,
      });
      referral.save().then(function () {
        self.reload();
        self.set('modalReferralNew', false);
        self._reloadListReferral();
        self.set('newReferral', undefined);
        M.toast({ html: 'Реферал успешно добавлен' });
      });
    },
  },
});
