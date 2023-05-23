import EmberObject from '@ember/object';
import RolesMixin from 'sbilling-front/mixins/roles';
import { module, test } from 'qunit';

module('Unit | Mixin | roles', function () {
  // TODO: Replace this with your real tests.
  test('it works', function (assert) {
    let RolesObject = EmberObject.extend(RolesMixin);
    let subject = RolesObject.create();
    assert.ok(subject);
  });
});
