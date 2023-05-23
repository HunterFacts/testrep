import RESTSerializer from '@ember-data/serializer/rest';
import JSONSerializer from '@ember-data/serializer/json';

export default class ApplicationSerializer extends JSONSerializer {
  /*normalize(model, hash, prop) {
    if (prop === 'comments') {
      hash.id = hash._id;
      delete hash._id;
    }

    return super.normalize(...arguments);
  }

  normalizeFindAllResponse(store, primaryModelClass, payload, id, requestType) {
    let objects = {data: []};

    payload.forEach(pay => {
      let newObject = {
        attributes: {},
        id: pay.id,
        type: primaryModelClass.modelName
      }

      for (var key in pay) {
        if (key != 'id') {
          newObject.attributes[key] = pay[key];
        }
      }
      objects.data.push(newObject);
    });

    return objects;
  }
*/
  /*serialize(snapshot, options) {
    let json = {};
    json.id = snapshot.id;
    snapshot.eachAttribute(function (name) {
      json[name] = snapshot.attr(name);
    });

    return json;
  }*/
  /*
  normalizeFindRecordResponse(store, primaryModelClass, payload, id, requestType) {
    let objects = {};

    let newObject = {
      attributes: {},
      id: payload.id,
      type: primaryModelClass.modelName
    }

    for (var key in payload) {
      if (key != 'id') {
        newObject.attributes[key] = payload[key];
      }
    }
    objects.data = newObject;

    return objects;
  }*/
}
