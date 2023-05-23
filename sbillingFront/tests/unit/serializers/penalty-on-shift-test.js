import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Serializer | penalty on shift', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    let store = this.owner.lookup('service:store');
    let serializer = store.serializerFor('penalty-on-shift');

    assert.ok(serializer);
  });

  test('it serializes records', function (assert) {
    let store = this.owner.lookup('service:store');
    let record = store.createRecord('penalty-on-shift', {});

    let serializedRecord = record.serialize();

    assert.ok(serializedRecord);
  });
});
