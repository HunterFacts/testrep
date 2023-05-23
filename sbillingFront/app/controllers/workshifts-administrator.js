import Controller from './base-controller';
import moment from 'moment';
import { inject as service } from '@ember/service';
import room from '../models/room';

export default Controller.extend({
  session: service('session'),
  router: service(),
  parentRoute: 'workshift-administrator',
  queryParams: ['room'],
  refreshTrigger: false,

  rows: [
    {
      typeName: 'date',
      headerText: 'Дата',
      isDate: true,
    },
    {
      typeName: 'timestart',
      headerText: 'Начало',
      isTime: true,
    },
    {
      typeName: 'timeend',
      headerText: 'Конец',
      isTime: true,
    },
    {
      typeName: 'token',
      headerText: 'Токены',
    },
    {
      typeName: 'house.name',
      headerText: 'Точка',
    },
  ],

  actions: {
    newWorkshift(workshiftType, date) {
      let appController = Ember.getOwner(this).lookup('controller:application'),
        self = this;
      date = new moment(date);
      date.hours(workshiftType.timestart.substring(0, workshiftType.timestart.length - 6));
      date.minutes(0);
      appController.confirm(
        'Создать новую смену на ' +
          date.format('DD.MM.YYYY') +
          ' на ' +
          workshiftType.timestart.substring(0, workshiftType.timestart.length - 3) +
          '?',
        'Начать новую смену?',
        function () {
          self.store
            .findRecord('house', self.get('session.data.authenticated.house'))
            .then((house) => {
              self.store
                .findRecord(
                  'employee',
                  self.get('session.data.authenticated.employee')
                )
                .then((employee) => {
                  self.store
                  .findRecord(
                    'workshift-type',
                    workshiftType.id
                  )
                  .then((wtype) => {
                    let workshift = self.store.createRecord('workshift', {
                      date: date,
                      timestart: date,
                      house: house,
                      wtype: wtype,
                      responsible: employee,
                      isfull: !workshiftType.shiftchange,
                    });
                    workshift.save().then((_workshift) => {
                      self.store
                        .query('room', { house: house.id })
                        .then((rooms) => {
                          let maxChecker = rooms.length;
                          let checker = 0;
                          rooms.forEach((room) => {
                            let roomOnWorkshift = self.store.createRecord(
                              'room-on-workshift',
                              {
                                token: 0,
                                workshift: workshift,
                                room: room,
                              }
                            );
                            roomOnWorkshift.save().finally(function () {
                              checker++;
                              if (maxChecker == checker) {
                                let parentRoute = self.get('parentRoute');
                                self.router.transitionTo(
                                  parentRoute,
                                  _workshift.id
                                );
                              }
                            });
                          });
                        });
                    });
                  })
                });
            });
        }
      );
    },
  },
});
