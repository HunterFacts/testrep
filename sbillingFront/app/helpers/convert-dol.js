import { helper } from '@ember/component/helper';
import moment from 'moment';

export default helper(function convertDol(object) {
  let counts = object[0];
  return (counts/20);
});
