import Controller from './base-controller';
import Config from '../config/environment';
import { inject as service } from '@ember/service';

export default Controller.extend({
  session: service('session'),
  routing: service('-routing'),
  chartWeek: undefined,
  chartMonth: undefined,
  typeChart: 'line',
  isLoadData: false,

  modelObserver: Ember.observer('model', function () {
    let incomeWeek = this.model.incomeByRangeWeek;
    let chartWeek = {
      labels: incomeWeek.map((x) => new moment(x.date).format('DD.MM')),
      datasets: [
        {
          label: 'Заработано токенов',
          data: incomeWeek.map((x) => x.tokens),
          backgroundColor: incomeWeek.map((x) => 'rgba(255, 215, 0, 0.6)'),
        },
      ],
    };
    this.set('chartWeek', chartWeek);

    let incomeMonth = this.model.incomeByRangeMonth;
    let chartMoonth = {
      labels: incomeMonth.map((x) => new moment(x.date).format('DD')),
      datasets: [
        {
          label: 'Заработано токенов',
          data: incomeMonth.map((x) => x.tokens),
          backgroundColor: incomeMonth.map((x) => 'rgba(50, 205, 50, 0.6)'),
        },
      ],
    };
    this.set('chartMonth', chartMoonth);
    this.set('isLoadData', true);
  }),

  actions: {},
});
