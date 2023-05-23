import Controller from '@ember/controller';
import EmberResolver from 'ember-resolver';
import Config from '../config/environment';
import { inject as service } from '@ember/service';

export default Controller.extend({
  session: service('session'),
  parentRoute: 'house',
  modalOpenTochka: false,
  refreshTrigger: false,
  routing: service('-routing'),

  rows: [
    {
      typeName: 'name',
      headerText: 'Наименование',
    },
    {
      typeName: 'city',
      headerText: 'Город',
    },
    {
      typeName: 'street',
      headerText: 'Улица',
    },
    {
      typeName: 'houseNumber',
      headerText: 'Номер дома',
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
    newHouseOpenModal() {
      this.set('modalOpenTochka', true);
    },
    addNewHouse() {
      let store = this.store,
        self = this,
        housename = this.housename,
        housestreet = this.housestreet,
        housenum = this.housenum,
        housecity = this.housecity;
      if (Ember.isEmpty(housecity)) {
        return M.toast({ html: 'Город не должен быть пустым' });
      }

      if (Ember.isEmpty(housename)) {
        return M.toast({ html: 'Наименование не должно быть пустым' });
      }

      this.store
        .findRecord(
          'workplace',
          self.get('session.data.authenticated.workplace')
        )
        .then(function (workplace) {
          let house = store.createRecord('house', {
            houseNumber: housenum,
            street: housestreet,
            city: housecity,
            name: housename,
            workplace: workplace,
          });
          house.save().then(function () {
            self.reload();
            self.set('modalOpenTochka', false);
            M.toast({ html: 'Точка успешна добавлена' });
          });
        });
    },
  },
});
