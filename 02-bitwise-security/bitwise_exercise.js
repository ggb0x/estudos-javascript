
// Teste 1 (Padrão):
const input1 = "USER:admin_m;ID:0xA5;ACCESS:51;";

// Teste 2 (Espaçamento caótico e valores baixos):
const input2 = "  USER:  guest_user  ; ID: 0xB  ;   ACCESS: 13  ;";

// Teste 3 (Usuário Bloqueado e Nível Alto):
const input3 = "USER:root_toor;ID:0xFF;ACCESS:143;";

// Caso 1: Usuário Remoto, sem 2FA (Perigo!). ID Hex minúsculo. Tem lixo no bit 8 (valor 309).
// 309 em binário é 100110101. O bit 8 é 1. O byte baixo é 00110101 (53).
const input4 = "USER:admin_remoto;ID:0xabc;ACCESS:309;"; 

// Caso 2: Usuário Local, Nível alto, mas Bloqueado manualmente.
const input5 = " ACCESS: 143; ID: 0xF2; USER: local_admin ;"; 

// Caso 3: Usuário Padrão, tudo certo.
const input6 = "ID:0x01;USER:guest;ACCESS:7;";

let currentInput = input4;

currentInput = currentInput.trim();
const user = currentInput.slice(currentInput.indexOf("USER:")+5, currentInput.indexOf(";", currentInput.indexOf("USER:")+5)).toUpperCase();
const idHex = currentInput.slice(currentInput.indexOf("ID:")+3, currentInput.indexOf(";", currentInput.indexOf("ID:")));
const idDec = parseInt(idHex);
const dirtyPerm = parseInt(currentInput.slice(currentInput.indexOf("ACCESS:")+7, currentInput.indexOf(";", currentInput.indexOf("ACCESS:"))));
const isExtended = dirtyPerm>=256 ? true : false;
const permNotProcess = isExtended ? dirtyPerm & 255 : dirtyPerm;
let permProcess = permNotProcess
const isRemoteAccess = permNotProcess & 32 ? true : false;
const statusRemoteAccess = isRemoteAccess ? "SIM" : "NÃO";
const is2FA = permNotProcess & 64 ? true : false;
const status2FA = is2FA ? "SIM" : "NÃO";
const accessLevel = permNotProcess>>2 & 7;
const isBlockedBit7 = (permNotProcess & 1<<7) ? true : false;
const statusBlockedBit7 = isBlockedBit7 ? "Bit 7 detectado." : "";
const isBlockedForNo2FA = isRemoteAccess && !is2FA ? true : false;
const local = isRemoteAccess ? "remoto" : "local";
const autenticação = is2FA ? "com 2FA" : "sem 2FA";
const statusBlockedForNo2FA = isBlockedForNo2FA ? `Acesso ${local} ${autenticação}` : "";
const isBlocked = isBlockedBit7 || isBlockedForNo2FA ? "SIM" : "NÃO"
const hasReadPerm = permNotProcess & 1<<0 ? true : false;
const readPermStatus = hasReadPerm ? "SIM" : "NÃO";
const hasWritePerm = permNotProcess & 1<<1 && accessLevel>=4 ? true : false;
const writePermStatus = hasWritePerm ? "SIM" : "NÃO (nível baixo detectado)";
permProcess = accessLevel<4 ? permNotProcess & ~2 : permProcess;
permProcess = isBlockedForNo2FA ? permProcess | 1<<7 : permProcess;
const idDecProccess = isBlockedBit7 || (permProcess & 1<<7) ? ~idDec : idDec;
const areIdValid = idDecProccess===idDec ? "Válido" : "Inválido. Id invertido devido ao bloqueio";
const areRemovedWrite = hasWritePerm ? "Permissão mantida" : "Permissão revogada"
let serverAccess
switch (true) {
    case (accessLevel>=4):
        serverAccess = "PERMITIDO"
        break;
    case (accessLevel<4):
        serverAccess = "NEGADO"
        break
    default:
        serverAccess = "Erro ao definir o acesso"
        break;
}
console.log(`> === AUDITORIA DE SEGURANÇA ===
> USUÁRIO: ${user}
> ID HEX: ${idHex} | DECIMAL: ${idDec}
> Acesso remoto: ${statusRemoteAccess} | 2FA: ${status2FA}
>
> --- ANÁLISE DE PERMISSÕES ---
> Nível de Acesso (0-7): ${accessLevel}
> Permissões Originais: LEITURA: ${readPermStatus} | ESCRITA: ${writePermStatus} 
> Bloqueado: ${isBlocked}. ${statusBlockedBit7} ${statusBlockedForNo2FA}
>
> --- APLICAÇÃO DE REGRAS ---
> Acesso a servidor restrito? ${serverAccess}
> Estado Final do ID: ${idDecProccess} (${areIdValid})
> Máscara de Permissão Final: ${permProcess} (${areRemovedWrite})`);
