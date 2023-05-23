import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';
import EmberResolver from 'ember-resolver';
import RoleEnum from '../mixins/role-enum';

export default Mixin.create(RoleEnum, {
  roleManager: service('role-manager'),
  session: service('session'),

  onlyAdministrator: Ember.computed('session', function () {
    return this.roleOnlyAdministrator();
  }),

  onlyManager: Ember.computed('session', function () {
    return this.roleOnlyManager();
  }),

  onlyModel: Ember.computed('session', function () {
    return this.roleOnlyModel();
  }),

  roleAll() {
    let role = this.get('session.data.authenticated.role');
    return this.roleManager.checkRoles(
      [this.Admin, this.Manager, this.Administrator, this.Model],
      role
    );
  },

  roleManagerModel() {
    let role = this.get('session.data.authenticated.role');
    return this.roleManager.checkRoles(
      [this.Admin, this.Manager, this.Model],
      role
    );
  },

  roleManagerAdministrator() {
    let role = this.get('session.data.authenticated.role');
    return this.roleManager.checkRoles(
      [this.Admin, this.Manager, this.Administrator],
      role
    );
  },

  roleOnlyManager() {
    let role = this.get('session.data.authenticated.role');
    return (
      this.roleManager.checkRole(this.Manager, role) ||
      this.roleManager.checkRole(this.Admin, role)
    );
  },

  roleOnlyAdministrator() {
    let role = this.get('session.data.authenticated.role');
    return this.roleManager.checkRole(this.Administrator, role);
  },

  roleOnlyModel() {
    let role = this.get('session.data.authenticated.role');
    return this.roleManager.checkRole(this.Model, role);
  },
});
