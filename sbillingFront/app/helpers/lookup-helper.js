import { helper } from '@ember/component/helper';

export default helper(function lookup(object) {
  return object[0].get(object[1]);
});
