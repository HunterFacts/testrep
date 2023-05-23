import Route from './base-route';
import RSVP from 'rsvp';

export default Route.extend({
  routeTitle: 'Смена',
  queryParams: {
    room: null,
  },
  async model(params) {
    let self = this;
    if (Ember.isEmpty(self.get('session.data.authenticated.workplace')))
      return null;

    return await this.store.findRecord('workshift', params.id, {
      reload: true,
    });
  },

  async afterModel(models) {
    this._super(...arguments);
    const roomOnWorkshift = await models.get('roomOnWorkshift');
    await models.get('house').then(function (house) {
      models.house = house;
    });
    await Promise.all(
      await roomOnWorkshift.map(async (model) => {
        await model.get('room').then(function (room) {
          model.set('room', room);
        });
        let employeesOnWorkshift = model.get('employeeOnWorkshift');
        employeesOnWorkshift.map((employeeOnWorkshift) => {
          employeeOnWorkshift.get('employee').then(function (employee) {
            models.reload();
            employee.get('user');
          });
          employeeOnWorkshift.get('account').then(function (account) {});
        });
      })
    );
    return models;
  },

  setupController(controller, model) {
    let readonly =
      Ember.isEmpty(model.get('timeend')) && !this.roleOnlyManager();
    controller.set('onlyread', readonly);
    if (!readonly) controller._getPenaltyAll(model);
    var roomId = localStorage.getItem('roomId');
    var roomNumber = localStorage.getItem('roomNumber');
    if (!Ember.isEmpty(roomId) && !Ember.isEmpty(roomNumber)) {
      controller.set('currentRoom', roomNumber);
      controller.set('room', roomId);
    } else if (Ember.isEmpty(controller.get('room'))) {
      controller.set(
        'currentRoom',
        model.get('roomOnWorkshift').firstObject.get('room.numberRoom')
      );
      controller.set(
        'room',
        model.get('roomOnWorkshift').firstObject.get('room.id')
      );
    } else {
      controller.set(
        'currentRoom',
        model
          .get('roomOnWorkshift')
          .filter((x) => x.get('room.id') == controller.get('room'))
          .firstObject.get('room.numberRoom')
      );
    }

    this._super(...arguments);
  },
});
