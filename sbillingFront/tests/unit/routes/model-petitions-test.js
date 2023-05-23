import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | model-petitions', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:model-petitions');
    assert.ok(route);
  });
});
