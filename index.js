import express from "express";

const porta = 3000;

const app = express();

app.get("/", (requisicao, resposta) => {
    resposta.send(`
        <html>
            <head>
                <title>Reajuste Salarial</title>
            </head>
            <body>
                <h1>Bem-vindo ao sistema de cálculo de reajuste salarial</h1>
                <p>Para calcular, informe na URL os seguintes dados:</p>
                <code>reajuste-salarial-rho.vercel.app/calc?idade=18&sexo=F&salario_base=1700&anoContratacao=2014&matricula=12345</code>
                <button onclick="window.location.href='/calc?idade=18&sexo=F&salario_base=1700&anoContratacao=2014&matricula=12345'">Calcular</button>
            </body>
            
        </html>
    `);
});

function calcularReajuste(idade, sexo, salario_base, anoContratacao) {
    const anoAtual = new Date().getFullYear();
    const tempoEmpresa = anoAtual - anoContratacao;

    let reajuste = 0;
    let valorExtra = 0;

    if (idade >= 18 && idade <= 39) {
        reajuste = sexo === "M" ? 0.10 : 0.08;
        valorExtra = tempoEmpresa > 10 ? (sexo === "M" ? 17 : 16) : (sexo === "M" ? -10 : -11);
    } else if (idade >= 40 && idade <= 69) {
        reajuste = sexo === "M" ? 0.09 : 0.10;
        valorExtra = tempoEmpresa > 10 ? (sexo === "M" ? 15 : 14) : (sexo === "M" ? -5 : -7);
    } else if (idade >= 70 && idade <= 99) {
        reajuste = sexo === "M" ? 0.15 : 0.17;
        valorExtra = tempoEmpresa > 10 ? (sexo === "M" ? 13 : 12) : (sexo === "M" ? -15 : -17);
    }

    const novoSalario = salario_base + (salario_base * reajuste) + valorExtra;
    return novoSalario.toFixed(2);
}

app.get("/calc", (req, res) => {
    const { idade, sexo, salario_base, anoContratacao, matricula } = req.query;

    // Validação
    if (
        !idade || parseInt(idade) < 16 ||
        !sexo || (sexo !== "M" && sexo !== "F") ||
        !salario_base || isNaN(parseFloat(salario_base)) ||
        !anoContratacao || parseInt(anoContratacao) <= 1960 ||
        !matricula || isNaN(parseInt(matricula))
    ) {
        return res.send("<h1>Dados inválidos! Verifique os parâmetros informados.</h1>");
    }

    const novoSalario = calcularReajuste(
        parseInt(idade),
        sexo,
        parseFloat(salario_base),
        parseInt(anoContratacao)
    );

    res.send(`
        <html>
            <head>
                <title>Resultado do Reajuste Salarial</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f9;
                        color: #333;
                        margin: 0;
                        padding: 20px;
                    }
                    h1 {
                        color: #4CAF50;
                    }
                    p {
                        font-size: 16px;
                        line-height: 1.5;
                    }
                    .result {
                        font-size: 20px;
                        font-weight: bold;
                        color: green;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        background: #fff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Resultado do Reajuste Salarial</h1>
                    <p><strong>Idade:</strong> ${idade}</p>
                    <p><strong>Sexo:</strong> ${sexo}</p>
                    <p><strong>Salário Base:</strong> R$${parseFloat(salario_base).toFixed(2)}</p>
                    <p><strong>Ano de Contratação:</strong> ${anoContratacao}</p>
                    <p><strong>Matrícula:</strong> ${matricula}</p>
                    <h2>Salário Reajustado: <span class="result">R$${novoSalario}</span></h2>
                </div>
            </body>
        </html>
    `);
});

app.listen(porta, () => {
    console.log(`Servidor rodando na porta ${porta}`);
});