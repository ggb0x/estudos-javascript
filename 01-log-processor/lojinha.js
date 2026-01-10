const item1 = "Batata";
const item2 = "Abacate";
const item3 = "Banana";
const preco1 = 15.99;
const preco2 = 12.99;
const preco3 = 8.99;
const nomeCliente = "Ricardo";
const clienteNoRecibo = (nomeCliente.toUpperCase());
const nomeAtendente = "Osvaldo";
console.log("Ola, " + nomeCliente + ". Minha loja tem banana, abacate e batata para compra. O que deseja hoje? :D");
console.log("Ola, " + nomeAtendente + ". Desejo comprar uma banana e um abacate! :)");
console.log("Ok, " + nomeCliente + ". (Calculando total, por favor aguarde...)");
let valorTotal = preco2+preco3 ;
console.log(nomeCliente + ", sua compra foi de R$" + valorTotal + ".");
console.log("Ei, " + nomeAtendente + ". Eu quero meu desconto!");
console.log("Perdão, " + nomeCliente + ". Irei aplicar o desconto! (Calculando valor final...)");
let valorFinal = valorTotal - valorTotal*0.1 ;
console.log("O valor final foi de R$" + valorFinal.toFixed(2) + ". Aqui está seu recibo:");
let recibo = `Lojinha do Osvaldo
Cliente: ${clienteNoRecibo}
Produtos:
  ${item2}
  ${item3}
Subtotal: R$${valorTotal}
Desconto: 10%
Valor total: R$${valorFinal.toFixed(2)}
---
Obrigado pela visita ${nomeCliente}, volte sempre!`;
console.log(recibo);