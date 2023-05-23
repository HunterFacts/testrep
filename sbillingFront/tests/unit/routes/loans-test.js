import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | loans', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:loans');
    assert.ok(route);
  });
});
