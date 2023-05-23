import JSONSerializer from '@ember-data/serializer/json';
import { EmbeddedRecordsMixin } from '@ember-data/serializer/rest';

export default class AnswerPetitionSerializer extends JSONSerializer.extend(
  EmbeddedRecordsMixin
) {
  attrs = {
    petition: {
      serialize: 'id',
      deserialize: 'record',
    },
    employee: {
      serialize: 'id',
      deserialize: 'record',
    },
  };
}
