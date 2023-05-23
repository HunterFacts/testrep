import EmberObject from '@ember/object';
import RoleEnumMixin from 'sbilling-front/mixins/role-enum';
import { module, test } from 'qunit';

module('Unit | Mixin | role-enum', function () {
  // TODO: Replace this with your real tests.
  test('it works', function (assert) {
    let RoleEnumObject = EmberObject.extend(RoleEnumMixin);
    let subject = RoleEnumObject.create();
    assert.ok(subject);
  });
});
