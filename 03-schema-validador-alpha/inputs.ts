// Caso 1: Sucesso Absoluto
export const inputSuccess = {
  username: "alice_dev",
  age: 28,
  isActive: true
};
// Caso 2: Tipos Errados (O pesadelo do Frontend enviando string no lugar de number)
export const inputWrongTypes = {
  username: 12345,       // Erro: Esperava string, veio number
  age: "30",             // Erro: Esperava number, veio string
  isActive: "yes"        // Erro: Esperava boolean, veio string
};
// Caso 3: Campos Faltando (O pesadelo do undefined)
export const inputMissing = {
  username: "bob_hacker"
  // age e isActive faltam
};
// Caso 4: Campos Extras (Injeção de dados não solicitados)
export const inputExtra = {
  username: "charlie",
  age: 20,
  isActive: false,
  isAdmin: true // PERIGO: Esse campo não está no schema e deve ser ignorado ou alertado.
};
