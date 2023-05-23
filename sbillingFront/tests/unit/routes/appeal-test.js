import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | appeal', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:appeal');
    assert.ok(route);
  });
});
