//Objetivo:fazer print em uma grade 8x8 de '# # # # # # # # "
let tabuleiro = '\n';
const size = 8
for (let linha = 0; linha < size; linha += 1) {
    for (let i = 0; i < size; i += 1) {
    (i + linha) % 2 === 0 ? tabuleiro += '#' : tabuleiro += ' '
    }
    tabuleiro += '\n';
}
console.log(`tabuleiro = "${tabuleiro}"`)
