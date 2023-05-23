import Controller from '@ember/controller';
import EmberResolver from 'ember-resolver';
import Config from '../config/environment';
import { inject as service } from '@ember/service';

export default Controller.extend({
  session: service('session'),
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

  actions: {
    saveModel() {
      this.model.save().then(function () {
        M.toast({ html: 'Данные успешно изменены' });
      });
    },
  },
});
