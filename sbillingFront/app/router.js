import EmberRouter from '@ember/routing/router';
import config from 'sbilling-front/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('desktop', { path: '/' });
  this.route('desktop', { path: '/index' });
  this.route('login');
  this.route('dictionary');
  this.route('workplace');
  this.route('houses');
  this.route('house', { path: '/house/:id' });
  this.route('employees');
  this.route('employee', { path: '/employee/:id' });
  this.route('accounts');
  this.route('account', { path: '/account/:id' });
  this.route('workshifts-administrator');
  this.route('workshift-administrator', {
    path: '/workshifts-administrator/:id',
  });
  this.route('model-desktop');
  this.route('model-loans');
  this.route('model-petitions');
  this.route('charts');
  this.route('chart-all');
  this.route('chart-models');
  this.route('appeals');
  this.route('appeal', {
    path: '/appeal/:id',
  });
  this.route('loans');
  this.route('loan', {
    path: '/loan/:id',
  });
  this.route('production-workshifts');
  this.route('production-employee');
  this.route('chart-account');
  this.route('employee-analytics');
  this.route('chart-employees');
  this.route('chart-employee', {
    path: '/chart-employee/:id',
  });
  this.route('model-transactions');
});
