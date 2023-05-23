import JSONSerializer from '@ember-data/serializer/json';
import { EmbeddedRecordsMixin } from '@ember-data/serializer/rest';

export default class LoanSerializer extends JSONSerializer.extend(
  EmbeddedRecordsMixin
) {
  attrs = {
    workshift: {
      serialize: 'id',
      deserialize: 'record',
    },
    room: {
      serialize: 'id',
      deserialize: 'record',
    },
    employeeOnWorkshift: {
      serialize: 'records',
      deserialize: 'records',
    },
  };
}
