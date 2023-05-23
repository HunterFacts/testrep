import Route from './base-route';

export default Route.extend({
  routeTitle: 'Сотрудник',
  async model(params) {
    let self = this;
    if (Ember.isEmpty(self.get('session.data.authenticated.workplace')))
      return null;
    let model = await this.store.findRecord('employee', params.id);
    await model.user.then(function (user) {
      model.user = user;
    });
    await model.workplace.then(function (workplace) {
      model.workplace = workplace;
    });
    await model.house.then(function (house) {
      model.house = house;
    });
    return model;
  },

  setupController: function (controller, model) {
    this._super(...arguments);
    let role = model.get('user.role');
    if (role == 'manager' || role == 'admin') {
      controller.set('read', true);
    } else {
      controller.set('read', false);
    }
  },
});
