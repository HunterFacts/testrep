import JSONSerializer from '@ember-data/serializer/json';
import { EmbeddedRecordsMixin } from '@ember-data/serializer/rest';

export default class WorkplaceSerializer extends JSONSerializer.extend(
  EmbeddedRecordsMixin
) {
  attrs = {
    workplace: {
      serialize: 'id',
      deserialize: 'record',
    },
    employee: {
      serialize: 'records',
      deserialize: 'records',
    },
    workshift: {
      serialize: 'records',
      deserialize: 'records',
    },
    room: {
      serialize: 'records',
      deserialize: 'records',
    },
    workshiftType: {
      serialize: 'records',
      deserialize: 'records',
    },
  };
}
