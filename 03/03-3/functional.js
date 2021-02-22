const AnimalKingdom = {};

AnimalKingdom.marsupial = function (name, nocturnal) {
  return {
    getName() {
      return name;
    },
    getIsNocturnal() {
      return nocturnal;
    },
  };
};

AnimalKingdom.kangaroo = function (name) {
  const baseMarsupial = AnimalKingdom.marsupial(name, false);

  baseMarsupial.hop = function () {
    return `${baseMarsupial.getName()} 가 껑충 뛰었어요!`;
  };

  return baseMarsupial;
};
