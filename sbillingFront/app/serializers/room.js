import JSONSerializer from '@ember-data/serializer/json';
import { EmbeddedRecordsMixin } from '@ember-data/serializer/rest';

export default class LoanSerializer extends JSONSerializer.extend(
  EmbeddedRecordsMixin
) {
  attrs = {
    house: {
      serialize: 'id',
      deserialize: 'record',
    },
    roomOnWorkshift: {
      serialize: 'records',
      deserialize: 'records',
    },
  };
}
