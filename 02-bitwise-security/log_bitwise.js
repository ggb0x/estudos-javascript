const rawData = "  PKT_HEAD::[ID_9924]  |  STREAM_CFG::11001011  |  ERR_COUNT::4  |  CHK::7  ";
//log tratada | início. 
let logFiltrado = rawData.trim();
//Decisão: mapear posição de todas as ocorrências de ":" e "|" para pesquisa na string.
//Objetivo: evitar uso de indexOf dentro de indexOf como abaixo:
let id = parseInt(logFiltrado.slice(logFiltrado.indexOf("_" , logFiltrado.indexOf("_") + 1) + 1, logFiltrado.indexOf("]")));
const pontosDuplos1 = logFiltrado.indexOf(":");
const pontosDuplos2 = logFiltrado.indexOf(":", pontosDuplos1+1);
const pontosDuplos3 = logFiltrado.indexOf(":", pontosDuplos2+1);
const pontosDuplos4 = logFiltrado.indexOf(":", pontosDuplos3+1);
const pontosDuplos5 = logFiltrado.indexOf(":", pontosDuplos4+1);
const pontosDuplos6 = logFiltrado.indexOf(":", pontosDuplos5+1);
const pontosDuplos7 = logFiltrado.indexOf(":", pontosDuplos6+1);
const pontosDuplos8 = logFiltrado.indexOf(":", pontosDuplos7+1);
const pipe1 = logFiltrado.indexOf("|");
const pipe2 = logFiltrado.indexOf("|", pipe1+1);
const pipe3 = logFiltrado.indexOf("|", pipe2+1);
const pipe4 = logFiltrado.indexOf("|", pipe3+1);
//Fim do rastreamento.
const configByte = parseInt(logFiltrado.slice(pontosDuplos4+1, pipe2), 2);
const errCount = parseInt(logFiltrado.slice(pontosDuplos6+1, pipe3));
const chk = parseInt(logFiltrado.slice(pontosDuplos8+1));
//Definição das configurações
const isBinaryMode = configByte & 1 ? true : false;
const binaryName = isBinaryMode ? "SIM" : "NÃO";
let priorityLevel;
if (configByte & 1<<2) {
    priorityLevel = 3;
} else if (configByte & 1<<1) {
    priorityLevel = 2;
} else if (configByte & 1<<0) {
    priorityLevel = 1;
} else {
    priorityLevel = 0;
}
let resposta = configByte ^ 1<<3;
resposta = configByte | 1<<4;
let idProcessado = isBinaryMode ? id+1 : id-1;
const isIntegrityOk = id%chk != 0 ? false : true;
const energyLevel = Math.pow(priorityLevel, 2) + errCount;
let msg;
let integrityStatus;
if (isIntegrityOk == false) {
    integrityStatus = "OFUSCADO";
} else if (isIntegrityOk == true) {
    integrityStatus = "VÁLIDO";
} else {
    integrityStatus = "INVÁLIDO";
}
switch (priorityLevel) {
    case 3:
        msg = "CRÍTICA"
        break;
    case 2:
        msg = "Alta"
        break;
    case 1:
        msg = "Média"
        break;
    case 0:
        msg = "Baixa"
    default:
        msg = "ERRO"
        break;
}
const isDefensive = configByte & 1<<4 ? "SIM" : "NÃO";
idProcessado = !isIntegrityOk || energyLevel>10 ? idProcessado = ~id : idProcessado = id ;
console.log(`> --- DECODIFICADOR DE TELEMETRIA ---
    > ID Original: ${id} | ID Processado: ${idProcessado}
    > Configuração Decimal Original: ${configByte.toString(10)}
    > Configuração Atualizada (Reator Invertido + Defesa ON): ${resposta.toString(10)} 
    >
    > --- ANÁLISE DE STATUS ---
    > Modo Binário: ${binaryName}
    > Nível de Prioridade: ${priorityLevel} (${msg})
    > Defesa Ativa: ${isDefensive} (Baseado no dado original)
    > Integridade dos Dados: ${isIntegrityOk ? "OK" : "FALHA"}
    >
    > --- RELATÓRIO FINAL ---
    > O sistema opera com nível de energia ${energyLevel}.
    > Status do código: ${integrityStatus}`);
/* Código feito em 06.01.2026
teste de lógica bitwise e Math
*/