import Controller from './base-controller';
import Config from '../config/environment';
import { inject as service } from '@ember/service';

export default Controller.extend({
  session: service('session'),
  read: false,
  modalAnswer: false,
  routing: service('-routing'),
  sortProperties: ['date:desc'],
  sortedModel: Ember.computed.sort('model.answerPetition', 'sortProperties'),

  reload() {
    let currentRouteName = this.get('routing.currentRouteName');
    let currentRouteInstance = Ember.getOwner(this).lookup(
      `route:${currentRouteName}`
    );
    currentRouteInstance.refresh();
  },

  rowsAnswerPetition: [
    {
      typeName: 'employee.fio',
      headerText: 'Сотрудник',
    },
    {
      typeName: 'message',
      headerText: 'Ответ',
    },
    {
      typeName: 'date',
      headerText: 'Дата ответа',
    },
  ],

  actions: {
    openModalAnswer() {
      this.set('modalAnswer', true);
    },

    answerCreate() {
      let commentPetition = this.commentPetition;
      let solveAppeal = this.solveAppeal;
      if (Ember.isEmpty(solveAppeal)) solveAppeal = false;

      if (Ember.isEmpty(commentPetition))
        return M.toast({ html: 'Нельзя отправлять пустой обращение' });

      let self = this;
      let date = new moment();

      this.store
        .findRecord('employee', self.get('session.data.authenticated.employee'))
        .then(function (employee) {
          let answerPetition = self.store.createRecord('answer-petition', {
            message: commentPetition,
            date: date,
            petition: self.get('model'),
            employee: employee,
          });
          answerPetition.save().then(function () {
            if (solveAppeal) {
              self.set('model.status', 'Решено');
              return self.model.save().then(function () {
                self.reload();
                self.set('modalAnswer', false);
              });
            }
            self.set('modalAnswer', false);
            return self.reload();
          });
        });
    },
    deleteAnswer(answer) {
      let self = this;
      let appController = Ember.getOwner(this).lookup('controller:application');
      appController.confirm(
        'Удалить ответ',
        'Вы действительно хотите удалить ответ на обращение?',
        function () {
          answer.deleteRecord();
          answer.save().then(function () {
            self.reload();
            M.toast({ html: 'Ответ успешно удален' });
          });
        }
      );
    },
  },
});
