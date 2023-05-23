import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | role-manager', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let service = this.owner.lookup('service:role-manager');
    assert.ok(service);
  });
});
