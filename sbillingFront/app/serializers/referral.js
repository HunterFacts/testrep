import JSONSerializer from '@ember-data/serializer/json';
import { EmbeddedRecordsMixin } from '@ember-data/serializer/rest';

export default class ReferralSerializer extends JSONSerializer.extend(
  EmbeddedRecordsMixin
) {
  attrs = {
    receive: {
      serialize: 'id',
      deserialize: 'record',
    },
    give: {
      serialize: 'id',
      deserialize: 'record',
    },
  };
}
