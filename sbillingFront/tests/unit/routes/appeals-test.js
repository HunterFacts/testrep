import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | appeals', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:appeals');
    assert.ok(route);
  });
});
