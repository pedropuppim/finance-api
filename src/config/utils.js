
const money = function (number) {
  return Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(number);
};


module.exports = money;
