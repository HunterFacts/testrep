import Controller from './base-controller';
import Config from '../config/environment';
import { inject as service } from '@ember/service';
import EmberResolver from 'ember-resolver';
import moment from 'moment';

export default Controller.extend({
  session: service('session'),
  typeChart: 'line',
  charts: undefined,
  chartYear: undefined,
  isYearGraphic: false,

  chartData: Ember.computed('model', function () {
    let self = this;
    return {
      labels: self.get('model').map((x) => new moment(x.date).format('DD.MM')),
      datasets: [
        {
          label: 'Заработано токенов',
          data: self.get('model').map((x) => x.tokens),
          backgroundColor: self
            .get('model')
            .map((x) => 'rgba(255, 99, 132, 0.6)'),
        },
      ],
    };
  }),

  chartsData: Ember.observer('model', function () {
    let self = this;
    var dateStart = new moment().subtract(7, 'days');
    var dateEnd = new moment().add(7, 'days');
    var charts = [];
    Ember.$.ajax({
      url: Config.APP.host + '/api/Analytics/incomeByRangeHouses',
      type: 'GET',
      headers: {
        Authorization:
          'Bearer ' + self.get('session.data.authenticated.access_token'),
      },
      data: {
        workplace: self.get('session.data.authenticated.workplace'),
        DateStart: dateStart.format('DD.MM.YYYY'),
        DateEnd: dateEnd.format('DD.MM.YYYY'),
      },
      success: function (data) {
        data.forEach((element) => {
          let incomeByRange = element.incomeByRangeItem;
          let chart = {
            labels: incomeByRange.map((x) =>
              new moment(x.date).format('DD.MM')
            ),
            datasets: [
              {
                label: 'Заработано токенов',
                data: incomeByRange.map((x) => x.tokens),
                backgroundColor: self
                  .get('model')
                  .map((x) => 'rgba(255, 99, 132, 0.6)'),
              },
            ],
          };
          charts.push({
            chart: chart,
            house: element.house,
          });
        });
        self.set('charts', charts);
      },
      contentType: 'application/json',
      error: function (xhr, status, e) {
        console.error(e);
      },
    });
  }),

  options: {
    /*tooltips: {
      callbacks: {
        label: function(tooltipItem, data) {
          var label = data.datasets[tooltipItem.datasetIndex].label || '';

          if (label) {
            label += ': ';
          }
          label += Math.round(tooltipItem.yLabel * 100) / 100;
          return label;
        }
      }
    }*/
  },

  actions: {
    loadYearGraphic() {
      let self = this;
      let appController = Ember.getOwner(this).lookup('controller:application');
      appController.confirm(
        'Загрузить график за год?',
        'Эта процедура может занять некоторое время',
        function () {
          Ember.$.ajax({
            url: Config.APP.host + '/api/Analytics/incomeByRangeYear',
            type: 'GET',
            headers: {
              Authorization:
                'Bearer ' + self.get('session.data.authenticated.access_token'),
            },
            data: {
              workplace: self.get('session.data.authenticated.workplace'),
            },
            success: function (data) {
              let incomeByRange = data;
              let chart = {
                labels: incomeByRange.map((x) =>
                  new moment(x.date).format('MM.YYYY')
                ),
                datasets: [
                  {
                    label: 'Заработано токенов',
                    data: incomeByRange.map((x) => x.tokens),
                    backgroundColor: self
                      .get('model')
                      .map((x) => 'rgba(255, 99, 132, 0.6)'),
                  },
                ],
              };
              self.set('chartYear', chart);
              self.set('isYearGraphic', true);
            },
            contentType: 'application/json',
            error: function (xhr, status, e) {
              console.error(e);
            },
          });
        }
      );
    },
  },
});
