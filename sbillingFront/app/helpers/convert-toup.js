import { helper } from '@ember/component/helper';
import moment from 'moment';

export default helper(function convertToup(object) {
  let counts = object[0];
  let procent = object[1];
  return (counts*procent);
});
