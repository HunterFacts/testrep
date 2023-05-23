import Ember from 'ember';
import { inject as service } from '@ember/service';

export default Ember.Component.extend({
  session: service('session'),
  router: service(),
  rows: undefined,
  modelTable: undefined,
  parentRoute: undefined,
  refreshTrigger: false,
  btnAddVisible: true,
  bntDeleteOnRowVisible: true,
  rowClick: undefined,
  modelMeta: undefined,
  search: undefined,
  searchParameter: undefined,
  visibleSearch: true,

  searchObserver: Ember.observer('search', function () {
    this._search();
  }),

  modelObserver: Ember.observer('modelTable.@each', 'modelTable', function () {
    this.set('search', undefined);
    this._search();
  }),

  _search() {
    let searchValue = this.search,
      modelMeta = this.modelTable,
      searchParameter = this.searchParameter,
      filterModelMeta;

    if (!Ember.isEmpty(this.searchParameter) && !Ember.isEmpty(searchValue)) {
      filterModelMeta = modelMeta.filter(
        (modelIsMeta) =>
          modelIsMeta.get(searchParameter).indexOf(searchValue) != -1
      );
    } else {
      filterModelMeta = modelMeta;
    }

    this.set('modelMeta', filterModelMeta);
  },

  didInsertElement() {
    this._super(...arguments);
    this.$('.tooltipped').tooltip();
    this._search();
    if (Ember.isEmpty(this.searchParameter)) {
      this.set('visibleSearch', false);
    } else {
      this.set('visibleSearch', true);
    }
  },

  actions: {
    trClick(id, record) {
      if (!Ember.isEmpty(this.rowClick)) {
        let rowClickHandler = this.rowClick;
        rowClickHandler(id, record);
      }
      let parentRoute = this.parentRoute;
      if (!Ember.isEmpty(parentRoute)) {
        this.router.transitionTo(parentRoute, id);
      }
    },

    btnDeleteClick(id) {
      let model = this.modelTable,
        self = this;

      model.forEach((element) => {
        if (element.id == id) {
          let appController = Ember.getOwner(this).lookup(
            'controller:application'
          );
          appController.confirm(
            'Удалить объект "' + self.get('modelTitle') + '"?',
            'Вы действительно хотите удалить объект "' +
              self.get('modelTitle') +
              '"?',
            function () {
              element.deleteRecord();
              element
                .save()
                .then(function () {
                  M.toast({ html: 'Успешно удалено' });
                  self.set('refreshTrigger', !self.get('refreshTrigger'));
                })
                .catch((err) => {
                  M.toast({ html: 'При удалении произошла ошибка' });
                });
            }
          );
        }
      });
    },

    _newItemAction() {
      let newItemAction = this.newItemAction;
      if (!Ember.isEmpty(newItemAction)) newItemAction();
    },
  },
});
