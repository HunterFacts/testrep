import Controller from './base-controller';
import Config from '../config/environment';
import { inject as service } from '@ember/service';
import moment from 'moment-timezone';

export default Controller.extend({
  session: service('session'),
  store: service('store'),
  modalOpenLoan: false,
  routing: service('-routing'),

  loadRaiting: true,
  raiting: undefined,

  raitingLoad() {
    let self = this;
    Ember.$.ajax({
      url: Config.APP.host + '/api/onlyread/raiting',
      type: 'GET',
      headers: {
        Authorization:
          'Bearer ' + self.get('session.data.authenticated.access_token'),
      },
      data: {
        house: self.get('session.data.authenticated.house'),
      },
      contentType: 'application/json',
      success: function (data) {
        var sorddata = data.sort(function (a, b) {
          return a.token - b.token;
        });

        self.set('raiting', sorddata.reverse());
      },
      error: function (xhr, status, e) {
        console.error(e);
      },
    });
  },

  achievementsLoad() {
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
        self.getAchievementsEmployee(data);
      },
      error: function (xhr, status, e) {
        console.error(e);
      },
    });
  },
  getAchievementsEmployee(_data) {
    let self = this,
      employeeId = self.get('session.data.authenticated.employee');
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

  reload() {
    let currentRouteName = this.get('routing.currentRouteName');
    let currentRouteInstance = Ember.getOwner(this).lookup(
      `route:${currentRouteName}`
    );
    currentRouteInstance.refresh();
  },

  loadRaitingMonth: true,
  raitingMonth: undefined,

  raitingMonthLoad() {
    let self = this;
    Ember.$.ajax({
      url: Config.APP.host + '/api/onlyread/raitingmonth',
      type: 'GET',
      headers: {
        Authorization:
          'Bearer ' + self.get('session.data.authenticated.access_token'),
      },
      contentType: 'application/json',
      data: {
        house: self.get('session.data.authenticated.house'),
      },
      success: function (data) {
        var sorddata = data.sort(function (a, b) {
          return a.token - b.token;
        });

        self.set('raitingMonth', sorddata.reverse());
      },
      error: function (xhr, status, e) {
        console.error(e);
      },
    });
  },

  actions: {
    openAchievement(achievement) {
      this.set('modalAchievementObject', achievement);
      this.set('modalAchievement', true);
    },
    openModalLoan() {
      this.set('modalOpenLoan', true);
    },
    openProblem(penalty) {
      this.set('modalOpenNewPetition', true);
      this.set('penaltyOnPetition', penalty);
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
    petitionCreate() {
      let commentPetition = this.commentPetition;

      if (Ember.isEmpty(commentPetition))
        return M.toast({ html: 'Нельзя отправлять пустой обращение' });
      let self = this;
      let date = new moment();
      let penaltyOnPetition = this.penaltyOnPetition;

      this.store
        .findRecord('employee', self.get('session.data.authenticated.employee'))
        .then(function (employee) {
          let petition = self.store.createRecord('petition', {
            type: 'Спор',
            message:
              commentPetition +
              '. Штраф на ' +
              penaltyOnPetition.amount +
              'руб.',
            date: date,
            status: 'Отправлено',
            actuality: 1,
            workshift: penaltyOnPetition.workshift,
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
  },
});
