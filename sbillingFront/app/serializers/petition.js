import JSONSerializer from '@ember-data/serializer/json';
import { EmbeddedRecordsMixin } from '@ember-data/serializer/rest';

export default class LoanSerializer extends JSONSerializer.extend(
  EmbeddedRecordsMixin
) {
  attrs = {
    employee: {
      serialize: 'id',
      deserialize: 'record',
    },
    workshift: {
      serialize: 'id',
      deserialize: 'record',
    },
    answerPetition: {
      serialize: 'records',
      deserialize: 'records',
    },
  };
}
