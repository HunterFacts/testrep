import Controller from './base-controller';
import EmberResolver from 'ember-resolver';
import Config from '../config/environment';
import { inject as service } from '@ember/service';

export default Controller.extend({
  session: service('session'),
  parentRoute: 'appeal',
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
      typeName: 'message',
      headerText: 'Сообщение',
    },
    {
      typeName: 'status',
      headerText: 'Статус',
    },
    {
      typeName: 'date',
      headerText: 'Дата',
      isDate: true,
    },
    {
      typeName: 'type',
      headerText: 'Тип',
    },
  ],
});
