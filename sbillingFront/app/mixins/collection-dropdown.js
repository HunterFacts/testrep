import Mixin from '@ember/object/mixin';

export default Mixin.create({
  collections: {
    roles: ['manager', 'administrator', 'model'],
    typePetition: ['Вопрос', 'Помощь', 'Жалоба'],
    loanType: ['Наличные', 'Перевод'],
  },
});
