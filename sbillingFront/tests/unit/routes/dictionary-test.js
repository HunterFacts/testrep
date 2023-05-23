import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | dictionary', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:dictionary');
    assert.ok(route);
  });
});
