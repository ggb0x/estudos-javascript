/*
Decisão: daqui em diante vou usar o TypeScript para implementar os códigos com o objetivo de aprender e praticar, já me preparando para futuras aplicações. (Melhor coisa que já fiz na vida)
Tabela de bits e seus valores:

    Bit 0 (1): IsDead (0 = Vivo, 1 = Morto).
    Bit 1 (2): IsParalyzed (0 = Pode agir, 1 = Turno pulado).
    Bit 2 (4): IsInvisible (0 = Visível, 1 = Invisível).
    Bits 3, 4, 5: WeaponID (Um número de 0 a 7 que define a arma equipada).
        Atenção: Você precisa isolar esses 3 bits e deslocá-los para ler o ID da arma.
    Bit 6 (64): DoubleDamage (Buff temporário: 0 = Normal, 1 = Dano Dobrado).
    Bit 7 (128): HasReflect (Escudo reflexivo, irrelevante para este cálculo de ataque, mas deve ser preservado).

Tabela de IDs:
    ID 0: Mãos Nuas (Dano: 5)
    ID 1: Adaga (Dano: 10)
    ID 2: Espada (Dano: 20)
    ID 3: Machado (Dano: 30)
    ID 4+: Cajado Mágico (Dano: 45)

REGRAS DE NEGÓCIO (A Lógica do Turno):
    1. Verificação de Vida: Se o Bit 0 (IsDead) estiver ligado, qualquer comando vira "CMD_IGNORED" e o HP zera.
    2. Paralisia: Se o Bit 1 (IsParalyzed) estiver ligado, o comando vira "TURN_SKIPPED". Nenhuma mana é gasta, nenhum dano é causado.
    3. Ataque Furtivo (A Regra Bitwise Write):
        Se o jogador atacar (CMD:ATTACK) E estiver Invisível (Bit 2):
            O ataque causa CRÍTICO (Dano Base * 4).
            IMPORTANTE: Ao atacar invisível, o jogador PERDE A INVISIBILIDADE. Você deve desligar o Bit 2 no estado final.
    4. Cálculo de Dano Normal:
        Se não for crítico, o Dano = Dano Base da Arma.
        Se o Bit 6 (DoubleDamage) estiver ativo, multiplique o resultado final por 2.
    5. Custo de Mana (Magia):
        Se o comando for CMD:FIREBALL, o custo é 30 MP.
        Dano da Fireball é fixo: 50.
        Se não tiver Mana suficiente, o comando falha ("NO_MANA") e nada acontece.
    6. Comando Desconhecido: Se vier algo bizarro, retorne "INVALID_CMD".
*/
// Caso 1: Guerreiro com Machado (ID 3), DoubleDamage (Bit 6), Invisível (Bit 2). Atacando.
// Binary State: 01011100 (92 decimal) -> Reflect(0), Double(1), Wpn(3 -> 011), Inv(1), Para(0), Dead(0)
const packet1: string = "ID:Hero_01|HP:100|MP:50|STATE:92|CMD:ATTACK";

// Caso 2: Mago paralisado tentando soltar magia.
// State: 2 (Apenas Bit 1 ligado)
const packet2: string = "ID:Mage_X|HP:40|MP:100|STATE:2|CMD:FIREBALL";

// Caso 3: Assassino sem mana tentando Fireball com Adaga (ID 1).
// State: 8 (Weapon ID 1 no lugar certo -> ...001000)
const packet3: string = "ID:Thief_99|HP:80|MP:5|STATE:8|CMD:FIREBALL";

// Caso 4 (Extra): Jogador morto tentando atacar. State: 1 (Bit 0).
const packet4: string = "ID:Zombie|HP:0|MP:0|STATE:1|CMD:ATTACK";

//Caso atual:
const pacoteAtual: string = packet3;

/*===============================================================================================

======================
Primeira função: limpeza de pacote.
======================

*/
const pacoteFiltrado = function separadorDoPacote(pacoteAtual: string) {
    const dadosSeparados = pacoteAtual.split("|");
    const dadosLimpos = {
        id: (dadosSeparados[0].split(":")[1]),
        hp: parseInt(dadosSeparados[1].split(":")[1]),
        mp: parseInt(dadosSeparados[2].split(":")[1]),
        state: parseInt(dadosSeparados[3].split(":")[1]),
        cmd: dadosSeparados[4].split(":")[1]
    }
    return dadosLimpos;
}

interface DadosLimpos {
    id: string;
    hp: number;
    mp: number;
    state: number;
    cmd: string;
}
const dadosLimpos: DadosLimpos = pacoteFiltrado(pacoteAtual);

/*===============================================================================================

======================
Segunda função: decifragem do state.
======================

*/
const estadoDecifrado = function decifragemDoState(dadosLimpos: DadosLimpos) {
    const state = dadosLimpos.state;
    const estadoDecodificado = {
        isDead: state & 1 ? true : false,
        isParalyzed: state & 2 ? true : false,
        isInvisible: state & 4 ? true : false,
        weaponID: state >> 3 & 7,
        areDoubleDamage: state & 64 ? true : false,
        hasReflect: state & 128 ? true : false
    }

    return estadoDecodificado;
}

interface EstadoDecodificado {
    isDead: boolean;
    isParalyzed: boolean;
    isInvisible: boolean;
    weaponID: number;
    areDoubleDamage: boolean;
    hasReflect: boolean;
}

const estadoDecodificado: EstadoDecodificado = estadoDecifrado(dadosLimpos);

/*===============================================================================================

======================
Terceira função: cálculo do turno.
======================
*/
const turno = function calculadorDeTurno(estadoDecodificado: EstadoDecodificado, dadosLimpos: DadosLimpos) {

    //Definir a arma atual e seu dano base.
    let resultado = {
        cmd: dadosLimpos.cmd,
        hp: dadosLimpos.hp,
        mp: dadosLimpos.mp,
        state: dadosLimpos.state,
        mensagem: "Erro",
        dano: 0,
        buff: "Nenhum",
        newState: dadosLimpos.state,
        custo: 0,
        saida: "SUCESSO",
    };

    const danosBaseDasArmas: { [key: number]: number } = {
        //Isto diz ao TypeScript que a chave de entrada é um numero e que o valor de saida é um numero.
        0: 5,
        1: 10,
        2: 20,
        3: 30,
        4: 45,
    }

    //Define se chegou um cmd invalido:
    if (dadosLimpos.cmd !== "ATTACK" && dadosLimpos.cmd !== "FIREBALL") {
        resultado.cmd = "CMD_INVALIDO";
        resultado.mensagem = "Comando inválido.";
        resultado.saida = "ERRO";
    }

    //Lógica de casos isolados:
    if (estadoDecodificado.isDead) {
        return {
            ...resultado,
            cmd: dadosLimpos.cmd = "CMD_IGNORED",
            hp: dadosLimpos.hp = 0,
            mensagem: "O jogador está morto."
        };
    };
    if (estadoDecodificado.isParalyzed) {
        return {
            ...resultado,
            cmd: dadosLimpos.cmd = "TURN_SKIPPED",
            mensagem: "O jogador está paralisado."
        };
    };

    //Lógica de ataques:
    if (dadosLimpos.cmd === "ATTACK") {
        if (estadoDecodificado.areDoubleDamage && estadoDecodificado.isInvisible) {
            resultado.dano = (danosBaseDasArmas[estadoDecodificado.weaponID] * 2 * 4);
            resultado.buff = "Ataque crítico dobrado";
            resultado.newState = dadosLimpos.state & ~(1 << 2);
            resultado.mensagem = "Ataque realizado com sucesso.";
        } else if (estadoDecodificado.isInvisible) {
            resultado.dano = danosBaseDasArmas[estadoDecodificado.weaponID] * 4;
            resultado.buff = "Ataque crítico";
            resultado.newState = dadosLimpos.state & ~(1 << 2);
            resultado.mensagem = "Ataque realizado com sucesso.";
        } else if (estadoDecodificado.areDoubleDamage) {
            resultado.dano = danosBaseDasArmas[estadoDecodificado.weaponID] * 2;
            resultado.buff = "Dano dobrado";
            resultado.mensagem = "Ataque realizado com sucesso.";
        } else {
            resultado.dano = danosBaseDasArmas[estadoDecodificado.weaponID];
            resultado.buff = "Nenhum";
            resultado.mensagem = "Ataque realizado com sucesso.";
        }
    }

    //Lógica de magia:
    if (dadosLimpos.cmd === "FIREBALL") {
        if (estadoDecodificado.areDoubleDamage && estadoDecodificado.isInvisible && dadosLimpos.mp >= 30) {
            resultado.dano = 50 * 2 * 4;
            resultado.buff = "Ataque crítico dobrado";
            resultado.newState = dadosLimpos.state & ~(1 << 2);
            resultado.mensagem = "Ataque realizado com sucesso.";
            resultado.custo = 30;
        } else if (estadoDecodificado.isInvisible && dadosLimpos.mp >= 30) {
            resultado.dano = 50 * 4;
            resultado.buff = "Ataque crítico";
            resultado.newState = dadosLimpos.state & ~(1 << 2);
            resultado.mensagem = "Ataque realizado com sucesso.";
            resultado.custo = 30;
        } else if (estadoDecodificado.areDoubleDamage && dadosLimpos.mp >= 30) {
            resultado.dano = 50 * 2;
            resultado.buff = "Dano dobrado";
            resultado.mensagem = "Ataque realizado com sucesso.";
            resultado.custo = 30;
        } else if (dadosLimpos.mp >= 30) {
            resultado.dano = 50;
            resultado.buff = "Nenhum";
            resultado.mensagem = "Ataque realizado com sucesso.";
            resultado.custo = 30;
        } else {
            resultado.dano = 0;
            resultado.mensagem = "Sem mana.";
            resultado.cmd = "NO_MANA";
            resultado.saida = "SEM MANA";
        }
    }



    return resultado;
};
interface Resultado {
    cmd: string;
    hp: number;
    mensagem: string;
    dano: number;
    buff: string;
    custo: number;
    mp: number;
    newState: number;
    saida: string;

};
const resultadoTurno: Resultado = turno(estadoDecodificado, dadosLimpos);

/*================================================================================================
======================
Saída final: (nova função)
======================
*/
const finalOutput = function finalOutput(estadoDecodificado: EstadoDecodificado, dadosLimpos: DadosLimpos, turno: Resultado) {
    return `> --- TURNO DO JOGADOR ${dadosLimpos.id} ---
> Estado Inicial: HP ${dadosLimpos.hp} | MP ${dadosLimpos.mp} | WeaponID: ${estadoDecodificado.weaponID} | Invisível: ${estadoDecodificado.isInvisible ? "SIM" : "NAO"}
> Ação: ${dadosLimpos.cmd}
>
> --- PROCESSAMENTO ---
> Evento: ${turno.mensagem}
> Buff Ativo: ${turno.buff}
> Dano Calculado: ${turno.dano}
>
> --- ESTADO FINAL ---
> HP: ${turno.hp} | MP: ${dadosLimpos.mp - turno.custo}
> Novo Byte de Estado: ${turno.newState}
> Resultado: ${turno.saida}
> Saída: ${turno.cmd}`
}
console.log(finalOutput(estadoDecodificado, dadosLimpos, resultadoTurno))

/*================================================================================================
======================
CONSIDERAÇÔES FINAIS:
======================
1. O  código foi construindo assumindo apenas 2 possibilidades de cmd (ATTACK e FIREBALL).
2. Como solicitado na tarefa, o bit 7+ do byte de estado foi ignorado e não tem
3. Esse foi o meu primeiro contato com o TypeScript e foi uma experiência muito boa. Pode haver erros relacionados a isso.
4. O codigo foi construido assumindo que sempre haveria uma entrada válida, onde não teríamos que nos preocupar com entradas inválidas.
5. esse código tem o unico objetivo de aprendizagem e fixação de conceitos.
*/