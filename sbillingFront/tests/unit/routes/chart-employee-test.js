import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | chart-employee', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:chart-employee');
    assert.ok(route);
  });
});
