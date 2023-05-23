import EmberObject from '@ember/object';
import NotificationApplicationMixin from 'sbilling-front/mixins/notification-application';
import { module, test } from 'qunit';

module('Unit | Mixin | notification-application', function () {
  // TODO: Replace this with your real tests.
  test('it works', function (assert) {
    let NotificationApplicationObject = EmberObject.extend(
      NotificationApplicationMixin
    );
    let subject = NotificationApplicationObject.create();
    assert.ok(subject);
  });
});
