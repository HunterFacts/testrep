import JSONSerializer from '@ember-data/serializer/json';
import { EmbeddedRecordsMixin } from '@ember-data/serializer/rest';

export default class EmployeeSerializer extends JSONSerializer.extend(
  EmbeddedRecordsMixin
) {
  attrs = {
    id: {
      serialize: 'id',
      deserialize: 'id',
    },
    user: {
      serialize: 'id',
      deserialize: 'record',
    },
    workplace: {
      serialize: 'id',
      deserialize: 'record',
    },
    house: {
      serialize: 'id',
      deserialize: 'record',
    },
    employeeOnWorkshift: {
      serialize: 'records',
      deserialize: 'records',
    },
    account: {
      serialize: 'records',
      deserialize: 'records',
    },
    answerPetition: {
      serialize: 'records',
      deserialize: 'records',
    },
    loan: {
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
    workshift: {
      serialize: 'records',
      deserialize: 'records',
    },
  };
}
