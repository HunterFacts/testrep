import Ember from 'ember';
import { inject as service } from '@ember/service';
import moment from 'moment';

export default Ember.Component.extend({
  session: service('session'),
  router: service(),
  dateValue: undefined,

  didInsertElement() {
    this._super(...arguments);
    let dateMoment = new moment(this.value);
    this.set('dateValue', dateMoment.format('YYYY.MM.DD'));
    let self = this;
    this.$('.datepicker').datepicker(
      {
        format: 'yyyy.mm.dd',
        onClose: function () {
          let value = self.$('.datepicker').val();
          self.set('value', new Date(value));
        },
        i18n: {
          months: [
            'Январь',
            'Февраль',
            'Март',
            'Апрель',
            'Май',
            'Июнь',
            'Июль',
            'Август',
            'Сентябрь',
            'Октябрь',
            'Ноябрь',
            'Декабрь',
          ],
          monthsShort: [
            'Янв',
            'Фев',
            'Марn',
            'Апр',
            'Май',
            'Июнь',
            'Июль',
            'Авг',
            'Сен',
            'Окт',
            'Ноя',
            'Дек',
          ],
          weekdays: [
            'Воскресенье',
            'Понедельник,',
            'Вторник',
            'Среда',
            'Четверг',
            'Пятница',
            'Суббота',
          ],
          weekdaysShort: ['Воскр', 'Пон', 'Вт', 'Ср', 'Чт', 'Пят', 'Суб'],
          weekdaysAbbrev: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        },
      },
      this.value
    );
  },

  actions: {
    clearData() {
      this.set('value', null);
    },
  },
});
