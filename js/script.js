import { Header } from '../componentes/header.js';
import { DadosCliente } from '../componentes/dadosClientes.js';
import { Servicos } from '../componentes/servicos.js'
import { Observacoes } from '../componentes/observacoes.js';
import { Acoes } from '../componentes/acoes.js';
import { Resumo } from '../componentes/resumo.js';

const app = document.getElementById('app');

function formatarData() {
    const hoje = new Date();
    return hoje.toLocaleDateString('pt-BR');
}

if (app) {
    app.innerHTML = `
        ${Header()}
        ${DadosCliente()}
        ${Servicos()}
        ${Observacoes()}
        ${Resumo()}
        ${Acoes()}
    `;

    const campoData = document.getElementById('data-exibicao');
    if (campoData) {
        campoData.value = formatarData();
    }
}