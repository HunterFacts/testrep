import JSONSerializer from '@ember-data/serializer/json';
import { EmbeddedRecordsMixin } from '@ember-data/serializer/rest';

export default class WorkplaceSerializer extends JSONSerializer.extend(
  EmbeddedRecordsMixin
) {
  attrs = {
    employee: {
      serialize: 'records',
      deserialize: 'records',
    },
    house: {
      serialize: 'records',
      deserialize: 'records',
    },
  };

  /*serialize(snapshot, options) {
    let json = {};
    json.id = snapshot.id;
    snapshot.eachAttribute(function (name) {
      json[name] = snapshot.attr(name);
    });

    return json;
  }*/
}
