import Route from './base-route';

export default Route.extend({
  routeTitle: 'Точка',
  async model(params) {
    let self = this;
    if (Ember.isEmpty(self.get('session.data.authenticated.workplace')))
      return null;
    return await this.store.findRecord('house', params.id, {
      adapterOptions: { include: 'room_workshifttype' },
    });
  },
});
