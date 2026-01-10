const rawLog = "  ERROR: [404] - Sistema:   LiNUX_SeRvEr_01  - Detalhes: Falha na Conexão do Usuário [admin_root]   ";
/* lógica exigida:
1. manipulação direta de logFiltrado
2. padronizar exibição do erro, sistema e ocultar usuário admin
---
início dos tratamentos. retirar espaços do início e fim.
*/
let logFiltrado = rawLog.trim();
const errorFind = logFiltrado.indexOf(":");
let error = logFiltrado.slice(0, errorFind).trim();
error = error.replace("ERROR", "ERRO").toUpperCase();
const startErrorCode = logFiltrado.indexOf("[");
const endErrorCode = logFiltrado.indexOf("]");
const errorCode = logFiltrado.slice(startErrorCode+1, endErrorCode);
const systemStart = logFiltrado.indexOf(":", errorFind+1);
const firstHypen = logFiltrado.indexOf("-");
const systemEnd = logFiltrado.indexOf("-", firstHypen+1);
const system = logFiltrado.slice(systemStart+1, systemEnd).trim().toUpperCase();
const user = "HIDDEN_USER"
logFiltrado = `RELATÓRIO DE ${error}:
O sistema ${system} registrou um erro ${errorCode}.
Status do usuario ${user}: bloqueado.`
console.log(logFiltrado);
