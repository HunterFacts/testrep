import EmberObject from '@ember/object';
import CollectionDropdownMixin from 'sbilling-front/mixins/collection-dropdown';
import { module, test } from 'qunit';

module('Unit | Mixin | collection-dropdown', function () {
  // TODO: Replace this with your real tests.
  test('it works', function (assert) {
    let CollectionDropdownObject = EmberObject.extend(CollectionDropdownMixin);
    let subject = CollectionDropdownObject.create();
    assert.ok(subject);
  });
});
