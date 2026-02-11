/**
**Preço base:** R$ 100,00
- **Custo por aluno:**
	-  >200 alunos = R$ 1,00 por aluno
	-  >50 alunos = R$ 1,50 p/aluno
	-  >1 aluno(s) = R$ 2,00 p/ aluno
- **Módulos:**
	-  `if (useAiVision) { += R$50,00 }`
	- `if (usePersonalTrainerAi) { += R$80,00 }
- **Descontos:**
	- `if (anualPlan) { total = total * 0.8 }
	- `if (semestralPlan) { total = total * 0.9 }`
**Requisitos:**
- type ou interface no input e output
- output deve ter valor base, custo por estudantes, custo por módulos, total sem desconto e total final.
**Consideração de entrada:**
json:

{
	"alunos": number,
	"modulos" {
		"aiVision": boolean,
		"personalTrainerAi": boolean,
	},
	"planType": "mensal" | "semestral" | "anual",
}

 
*/

const calculateGymPrice = (alunos: number, modulos: { aiVision: boolean, personalTrainerAi: boolean }, planType: "mensal" | "semestral" | "anual") => {
    const basePrice = 100;


    let costPerStudent = 0;
    if (alunos > 200) {
        costPerStudent = 1;
    } else if (alunos > 50) {
        costPerStudent = 1.5;
    } else {
        costPerStudent = 2;
    }


    let costPerModule = 0;
    if (modulos.aiVision) {
        costPerModule += 50;
    }
    if (modulos.personalTrainerAi) {
        costPerModule += 80;
    }

    
    const total = basePrice + costPerStudent * alunos + costPerModule;
    const totalWithDiscount = planType === "anual" ? total * 0.8 : planType === "semestral" ? total * 0.9 : total;
    return {
        basePrice,
        costPerStudent,
        costPerModule,
        total,
        totalWithDiscount
    };
}