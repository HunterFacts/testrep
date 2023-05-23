import JSONSerializer from '@ember-data/serializer/json';
import { EmbeddedRecordsMixin } from '@ember-data/serializer/rest';

export default class Workshift extends JSONSerializer.extend(
  EmbeddedRecordsMixin
) {
  attrs = {
    house: {
      serialize: 'id',
      deserialize: 'record',
    },
    responsible: {
      serialize: 'id',
      deserialize: 'record',
    },
    employeeOnWorkshift: {
      serialize: 'records',
      deserialize: 'records',
    },
    roomOnWorkshift: {
      serialize: 'records',
      deserialize: 'records',
    },
    penaltyOnShift: {
      serialize: 'records',
      deserialize: 'records',
    },
    petition: {
      serialize: 'records',
      deserialize: 'records',
    },
    wtype: {
      serialize: 'id',
      deserialize: 'record',
    },
  };
}
