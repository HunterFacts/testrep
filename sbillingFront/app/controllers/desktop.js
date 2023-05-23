import Controller from './base-controller';

export default Controller.extend({
  actions: {
    check() {
      return alert(this.roleManagerModel());
    },
  },
});
