import { inputSuccess, inputWrongTypes, inputMissing, inputExtra } from "./inputs.ts";



//==============================================================================================

//tipos que a chave pode ter
type SupportedTypes = 'string' | 'number' | 'boolean';

//interface do schema
interface ValidationSchema {
  [key: string]: SupportedTypes;
}
interface ValidationResult {
  valid: boolean;
  errors: string[];
}

// Campos esperados, seguindo a regra de ValidationSchema.
const userSchema: ValidationSchema = {
  username: "string",
  age: "number",
  isActive: "boolean"
}

//==============================================================================================

const inputAtual = inputMissing;

//==============================================================================================

// Verificar se tem campos extras
function validateObject(data: Record<string, unknown>, schema: ValidationSchema): ValidationResult {

  // 1. Estado Inicial (Sempre comece assumindo sucesso e lista vazia)
  let isValid = true;
  const errors: string[] = [];

  // Variáveis auxiliares de chaves
  const inputKeys = Object.keys(data);
  const schemaKeys = Object.keys(schema);

  // --- BLOCO 1: CAMPO MINADO (Detectar Extras) ---
  // Estratégia: Percorrer o INPUT. Se não tá no schema, é intruso.
  for (const key of inputKeys) {
    if (!schemaKeys.includes(key)) {
      isValid = false;
      errors.push(`Aviso: Campo '${key}' não reconhecido no schema.`);
    }
  }

  // --- BLOCO 2: CHECKLIST DE REGRAS (Faltantes e Tipos) ---
  for (const key of schemaKeys) {
    if (!inputKeys.includes(key)) {
      isValid = false;
      errors.push(`Erro: campo ${key} é obrigatório.`);
    } else {
      if (typeof data[key] !== schema[key]) {
        isValid = false;
        errors.push(`Erro: campo ${key} esperava ${schema[key]}, mas recebeu ${typeof data[key]}.`);
      }
    }
  }
  if (errors.length > 0) {
    isValid = false;
  }

  return {
    valid: isValid,
    errors: errors
  };
}
const result = validateObject(inputAtual, userSchema);
//==============================================================================================

console.log(result);
