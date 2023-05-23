import Controller from '@ember/controller';
import EmberResolver from 'ember-resolver';
import Config from '../config/environment';
import { inject as service } from '@ember/service';

export default Controller.extend({
  session: service('session'),
  routing: service('-routing'),
  roomModal: false,
  typeModal: false,
  typeNewModel: {
    timename: undefined,
    timestart: undefined,
    timeend: undefined,
    position: undefined,
    shiftchange: undefined
  },

  sortPropertiesWorkshiftType: ['position:asc'],
  sortedWorkshiftType: Ember.computed.sort('model.workshiftType', 'sortPropertiesWorkshiftType'),

  sortPropertiesRooms: ['numberRoom:asc'],
  sortedRooms: Ember.computed.sort('model.room', 'sortPropertiesRooms'),

  rows: [
    {
      typeName: 'numberRoom',
      headerText: 'Номер комнаты',
    },
  ],

  rowsType: [
    {
      typeName: 'timename',
      headerText: 'Наименование',
    },
    {
      typeName: 'timestart',
      headerText: 'Начало',
      onlyTime: true,
    },
    {
      typeName: 'timeend',
      headerText: 'Конец',
      onlyTime: true,
    },
    {
      typeName: 'shiftchange',
      headerText: 'Пересменка',
    },
    {
      typeName: 'position',
      headerText: 'Позиция',
    },
  ],

  reload() {
    let currentRouteName = this.get('routing.currentRouteName');
    let currentRouteInstance = Ember.getOwner(this).lookup(
      `route:${currentRouteName}`
    );
    currentRouteInstance.refresh();
  },

  actions: {
    saveModel() {
      this.model.save().then(function () {
        M.toast({ html: 'Данные успешно изменены' });
      });
    },

    newRoomModal() {
      this.set('roomModal', true);
    },

    newWTypeModal() {
      this.set('typeModal', true);
    },

    addNewRoom() {
      let self = this;
      let roomNumber = this.roomNumber;
      if (Ember.isEmpty(roomNumber))
        return M.toast({ html: 'Укажите номер комнаты' });
      let house = self.store.createRecord('room', {
        numberRoom: roomNumber,
        house: this.model,
      });
      house.save().then(function () {
        self.reload();
        self.set('roomNumber', undefined);
        self.set('roomModal', false);
        M.toast({ html: 'Комната успешна добавлена' });
      });
    },

    addNewWtype() {
      let self = this;
      let wTypeNew = this.get('typeNewModel');
      if (Ember.isEmpty(wTypeNew.timeend) || Ember.isEmpty(wTypeNew.timestart) || Ember.isEmpty(wTypeNew.position) || Ember.isEmpty(wTypeNew.timename)) {
        return M.toast({ html: 'Заполните все поля для сохранения типа' });
      }

      let wtype = self.store.createRecord('workshift-type', {
        timestart: wTypeNew.timestart,
        timeend: wTypeNew.timeend,
        timename: wTypeNew.timename,
        position: wTypeNew.position,
        shiftchange: wTypeNew.shiftchange ? true : false,
        house: self.model,

      });
      wtype.save().then(function () {
        self.reload();
        self.set('typeModal', false);
        self.set('typeNewModel', {
          timename: undefined,
          timestart: undefined,
          timeend: undefined,
          position: undefined,
          shiftchange: undefined
        }),
        M.toast({ html: 'Тип смены на точке успешна добавлено' });
      });
    },
  },
});
