import JSONSerializer from '@ember-data/serializer/json';
import { EmbeddedRecordsMixin } from '@ember-data/serializer/rest';

export default class AccountSerializer extends JSONSerializer.extend(
  EmbeddedRecordsMixin
) {
  attrs = {
    employee: {
      serialize: 'id',
      deserialize: 'record',
    },
    employeeOnWorkshift: {
      serialize: 'records',
      deserialize: 'records',
    },
  };
}
