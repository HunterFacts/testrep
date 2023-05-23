import EmberObject from '@ember/object';
import UseragentMixin from 'sbilling-front/mixins/useragent';
import { module, test } from 'qunit';

module('Unit | Mixin | useragent', function () {
  // TODO: Replace this with your real tests.
  test('it works', function (assert) {
    let UseragentObject = EmberObject.extend(UseragentMixin);
    let subject = UseragentObject.create();
    assert.ok(subject);
  });
});
