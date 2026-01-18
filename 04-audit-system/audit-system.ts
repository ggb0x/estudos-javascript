interface Item {
    name: string;
    qty: number;
    price: number;
}

interface Transaction {
    id: number;
    buyer: string;
    items: Item[]; // Array dentro de objeto dentro de Array. O pesadelo do iniciante.
    status: "completed" | "pending" | "fraud";
}

// O BANCO DE DADOS
const transactions: Transaction[] = [
    {
        id: 101,
        buyer: "Spectre",
        items: [
            { name: "GPS Jammer", qty: 1, price: 500 },
            { name: "Fake ID", qty: 2, price: 150 }
        ],
        status: "completed"
    },
    {
        id: 102,
        buyer: "Rookie_Dev",
        items: [
            { name: "Tutorial", qty: 50, price: 10 }, // Item barato, mas quantidade alta
        ],
        status: "fraud"
    },
    {
        id: 103,
        buyer: "Spectre", // Ele comprou de novo
        items: [
            { name: "Server Key", qty: 1, price: 1200 },
            { name: "VPN Sub", qty: 10, price: 20 }
        ],
        status: "completed"
    },
    {
        id: 104,
        buyer: "Anon_99",
        items: [
            { name: "Fake ID", qty: 1, price: 150 },
            { name: "Server Key", qty: 2, price: 1100 }
        ],
        status: "pending"
    }
];

//==============================================================================================


const calcularReceitaTotal = function (Data: Transaction[]): number {
    let totalPrice: number = 0;
    for (const json of Data) {
        for (const item of json.items) {
           if (json.status === "completed") {
            totalPrice += item.qty * item.price;
           }
        }
    }
    return totalPrice;
}
const total = calcularReceitaTotal(transactions);
/*
Para minha fixação: Porque isso acima funciona?
Recebemos um "json" onde contem um array de objetos, onde cada objeto contem um array de objetos.
Para a funçao acima, definimos: entre em loop em "Data" (json). 
Dentro deste loop, entre em mais um loop para cada "itens" dentro do objeto.
Como estamos em loop, nos definimos que o price total é o price vezes a quantidade, dentro de todos os itens em Data, dentro de todos os itens "items", porém, apenas se json.status for === aproved.
*/
console.log(total);

//==============================================================================================

const quantosItensVendidos = function (Data: Transaction[]) {
    //Primeiro eu tenho que definir quais são os produtos:
    let produtos: Record<string, number> = {};
    for (const json of Data) {
        for (const item of json.items) {
            if (produtos[item.name]) {
                produtos[item.name] += item.qty;
            } else {
                produtos[item.name] = item.qty;
            }
        }
    }
    return produtos;
}
const produtos = quantosItensVendidos(transactions);
console.log(produtos);

//==============================================================================================

const encontrarMelhorCliente = function (Data: Transaction[]) {
    //Primeiro, eu preciso de rastrear todos os clientes, seus gastos, status e quantidade de compras.
    let clientes: Record<string, { gastos: number, compras: number, status: string }> = {};
    
    for (const json of Data) {
        if (!clientes[json.buyer]) {
            clientes[json.buyer] = {
                gastos: 0,
                compras: 0,
                status: json.status
            }
        }

        for (const item of json.items) {
            if (json.status === "completed") {
                clientes[json.buyer].gastos += item.qty * item.price;
                clientes[json.buyer].compras += item.qty;
            }
        }
    }
    //Depois, eu preciso de um loop para encontrar o melhor cliente.
    let melhorCliente: string = ``;
    for (let cliente in clientes) {
       if (melhorCliente === ``) {
           melhorCliente = cliente;
       } else if (clientes[cliente].gastos > clientes[melhorCliente].gastos) {
           melhorCliente = cliente;
       }
    }
    return {clientes, melhorCliente};
}
const melhorCliente = encontrarMelhorCliente(transactions);
console.log(melhorCliente);

//==============================================================================================

const filtragemDeFraudes = function (Data: Transaction[]) {
    //primeiro, vamos rastrear novamente todos os preços para comparação de valor (>5000).
    let fraudes: string[] = [];
    for (const json of Data) {
        let preço: number = 0;
        for (const item of json.items) {
            preço += item.qty * item.price;
        }
        if (json.status === "fraud" || preço > 5000) {
            fraudes.push(`Alerta de Segurança: Transação ${json.id} suspeita.`);
        }
    }
    return fraudes;
}
const fraudes = filtragemDeFraudes(transactions);
console.log(fraudes);