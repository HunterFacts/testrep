import JSONSerializer from '@ember-data/serializer/json';
import { EmbeddedRecordsMixin } from '@ember-data/serializer/rest';

export default class EmployeeOnWorkshiftSerializer extends JSONSerializer.extend(
  EmbeddedRecordsMixin
) {
  attrs = {
    workshift: {
      serialize: 'id',
      deserialize: 'record',
    },
    account: {
      serialize: 'id',
      deserialize: 'record',
    },
    employee: {
      serialize: 'id',
      deserialize: 'record',
    },
  };
}
