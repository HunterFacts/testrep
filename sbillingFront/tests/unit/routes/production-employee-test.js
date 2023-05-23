import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | production-employee', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:production-employee');
    assert.ok(route);
  });
});
