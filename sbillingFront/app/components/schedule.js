import Ember from 'ember';
import { inject as service } from '@ember/service';
import Roles from '../mixins/roles';
import moment from 'moment';
import Config from '../config/environment';

export default Ember.Component.extend(Roles, {
  session: service('session'),
  parentRoute: undefined,
  router: service(),
  store: service('store'),
  isLoaded: false,
  activeRoom: undefined,
  rooms: undefined,
  refreshTrigger: false,
  houses: undefined,
  workshiftTypes: undefined,

  sortPropertiesWorkshiftType: ['position:asc'],
  sortedWorkshiftType: Ember.computed.sort('workshiftTypes', 'sortPropertiesWorkshiftType'),

  refreshTriggerObserver: Ember.observer('refreshTrigger', function () {
    this.updateData();
  }),

  didInsertElement() {
    if (!Ember.isEmpty(this.get('session.data.authenticated.house'))) {
      this.updateData();
    } else {
      if (this.roleOnlyManager()) {
        let self = this;
        this.store
          .query('house', {
            workplace: self.get('session.data.authenticated.workplace'),
          })
          .then((houses) => {
            self.set('house', houses.firstObject.id);
            self.set('houses', houses);
            M.toast({
              html: 'Выбрана точка "' + houses.firstObject.name + '"',
            });
            self.updateData();
          });
      }
    }

    this._super(...arguments);
  },

  updateData(date = null) {
    var self = this;
    let appController = Ember.getOwner(this).lookup('controller:application');
    appController.preloaderStart();
    date = Ember.isEmpty(date)
      ? new moment().format('YYYY-MM-DD 00:00:00')
      : date;
    var house = !Ember.isEmpty(self.get('house'))
      ? self.get('house')
      : self.get('session.data.authenticated.house');
    Ember.$.ajax({
      url: Config.APP.host + '/api/schedule/schedule/rooms',
      type: 'GET',
      headers: {
        Authorization:
          'Bearer ' + self.get('session.data.authenticated.access_token'),
      },
      contentType: 'application/json',
      data: {
        house: house,
      },
      success: function (data) {
        Ember.$.ajax({
          url: Config.APP.host + '/api/schedule/schedule/workshifttypes',
          type: 'GET',
          headers: {
            Authorization:
              'Bearer ' + self.get('session.data.authenticated.access_token'),
          },
          contentType: 'application/json',
          data: {
            house: house
          },
          success: function (workshiftTypes) {
            self.set('activeRoom', data[0]);
            self.set('rooms', data);
            Ember.$.ajax({
              url: Config.APP.host + '/api/schedule/schedule',
              type: 'GET',
              headers: {
                Authorization:
                  'Bearer ' + self.get('session.data.authenticated.access_token'),
              },
              contentType: 'application/json',
              data: {
                house: house,
                date: date,
              },
              success: function (dataSchedule) {
                Ember.$.ajax({
                  url: Config.APP.host + '/api/schedule/schedule/employee',
                  type: 'GET',
                  headers: {
                    Authorization:
                      'Bearer ' +
                      self.get('session.data.authenticated.access_token'),
                  },
                  contentType: 'application/json',
                  data: {
                    house: house,
                  },
                  success: function (data) {
                    self.constructionData(dataSchedule, data, date, workshiftTypes);
                    self.set('date', date);
                    self.set('scheduleData', dataSchedule);
                    self.set('employees', data);
                    self.set('workshiftTypes', workshiftTypes);
                    self.set('isLoaded', true);
                    appController.preloaderStop();
                  },
                  error: function (xhr, status, e) {
                    console.error(e);
                    appController.preloaderStop();
                    M.toast({ html: 'Произошла ошибка при загрузке сотрудников' });
                  },
                });
              },
              error: function (xhr, status, e) {
                console.error(e);
                appController.preloaderStop();
                M.toast({ html: 'Произошла ошибка при загрузке расписания' });
              },
            });
          }
        }) 
      },
      error: function (xhr, status, e) {
        console.error(e);
        appController.preloaderStop();
        M.toast({ html: 'Произошла ошибка при загрузке комнат' });
      },
    });
  },

  constructionData(data, employees, date, workshiftTypes) {
    var self = this;
    var filterData = [];
    var checkData;
    var groupArray;
    data = structuredClone(data);

    let startDate = new moment(date).subtract(7, 'days');
    let endDate = new moment(date).add(7, 'days');

    startDate.hours(12);
    workshiftTypes.sort((a, b) => a.position - b.position);
    while (!startDate.isSame(endDate, 'day')) {
      groupArray = {
        date: startDate.format(),
        worktypes: []
      };

      
      
      workshiftTypes.forEach(workshiftTypeElem => {
        var copyData = data.slice();
        
        var elements = copyData.filter((x) =>
          startDate.isSame(new moment(x.date), 'day')
        );
        
        let newWorktypeElement = {
          worktype: workshiftTypeElem,
          workshift: undefined,
          workshiftcheck: false
        }
        elements.forEach((element) => {
          if (
            !Ember.isEmpty(element.roomOnWorkshift) &&
            element.roomOnWorkshift.length != 0
          ) {
            
            checkData = new moment.utc(element.date);
            if (workshiftTypeElem.id == element.wtype) {
              var roomOnWorkshift = element.roomOnWorkshift.find(
                (x) => x.room == self.get('activeRoom').id
              );
              element.roomOnWorkshift = roomOnWorkshift;
              element.roomOnWorkshift.employeeOnWorkshift.forEach((employee) => {
                let empl = employees.find((x) => x.id == employee.employee);
                employee.employee = empl;
              });
              newWorktypeElement.workshiftcheck = true;
              newWorktypeElement.workshift = element;
            }
          }
        });
        groupArray.worktypes.push(newWorktypeElement);
      });
      
      filterData.push(groupArray);
      startDate.add(1, 'days');
    }

    this.set('filterData', filterData);
  },

  actions: {
    addNewRow(workshiftType, date) {
      if (this.roleOnlyAdministrator()) {
        let newClick = this.newClick;
        if (!Ember.isEmpty(newClick)) {
          newClick(workshiftType, date);
        }
      }
    },

    boubleHouseClick(house) {
      this.set('house', house.id);
      M.toast({
        html: 'Выбрана точка "' + house.name + '"',
      });
      this.updateData();
    },

    checkRow(scheduleData) {
      let parentRoute = this.parentRoute;
      localStorage.setItem('roomId', this.get('activeRoom.id'));
      localStorage.setItem('roomNumber', this.get('activeRoom.numberRoom'));
      this.router.transitionTo(parentRoute, scheduleData.id);
    },

    changeDate(date) {
      let _moment = new moment(date).format('YYYY-MM-DD 00:00:00');
      this.updateData(_moment);
    },

    changeRoom(room) {
      this.set('activeRoom', room);
      let scheduleData = this.scheduleData;
      let employees = this.employees;
      let date = this.date;
      let workshiftTypes = this.workshiftTypes;

      this.constructionData(scheduleData, employees, date, workshiftTypes);
    },
  },
});
