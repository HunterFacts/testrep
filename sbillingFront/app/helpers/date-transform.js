import { helper } from '@ember/component/helper';
import moment from 'moment';

export default helper(function dateTransform(object) {
  let dateFormat = object[1];
  let date = object[0];
  if (Ember.isEmpty(date)) return;
  switch (dateFormat) {
    case 'date':
      return new moment(date).add(5, 'hour').format('DD.MM.YYYY');
    case 'time':
      return new moment(date).add(5, 'hour').format('HH:mm');
    case 'onlytime':
      return date.substring(0, date.length - 3);
  }
});
