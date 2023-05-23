import JSONSerializer from '@ember-data/serializer/json';
import { EmbeddedRecordsMixin } from '@ember-data/serializer/rest';

export default class WorkshiftTypeSerializer extends JSONSerializer.extend(
  EmbeddedRecordsMixin
) {
  attrs = {
    house: {
      serialize: 'id',
      deserialize: 'record',
    },
    workshift: {
      serialize: 'records',
      deserialize: 'records',
    }
  };
}