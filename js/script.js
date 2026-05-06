import { Header } from '../componentes/header.js';
import { DadosCliente } from '../componentes/dadosClientes.js';
import { Servicos } from '../componentes/servicos.js';
import { Resumo } from '../componentes/resumo.js';
import { Observacoes } from '../componentes/observacoes.js';
import { Acoes } from '../componentes/acoes.js';
import { Assinaturas } from '../componentes/assinaturas.js';

const app = document.getElementById('app');

function formatarData() {
    const hoje = new Date();
    return hoje.toLocaleDateString('pt-BR');
}

function calcularSubtotal() {
    const valores = document.querySelectorAll('.valor-servico');

    let soma = 0;

    valores.forEach(input => {
        const valor = parseFloat(input.value) || 0;
        soma += valor;
    });

    const subtotalEl = document.getElementById('subtotal');
    if (subtotalEl) {
        subtotalEl.textContent = "R$ " + soma.toFixed(2).replace('.', ',');
    }

    const descontoInput = document.getElementById('desconto');
    const desconto = parseFloat(descontoInput?.value) || 0;

    const total = soma - desconto;

    const totalEl = document.getElementById('total-geral');
    if (totalEl) {
        totalEl.textContent = "R$ " + total.toFixed(2).replace('.', ',');
    }
}

function ativarCalculo() {
    const inputs = document.querySelectorAll('.valor-servico');

    inputs.forEach(input => {
        input.addEventListener('input', calcularSubtotal);
    });

    const descontoInput = document.getElementById('desconto');

    if (descontoInput) {
        descontoInput.addEventListener('input', calcularSubtotal);
    }
}

function adicionarItem() {
    const lista = document.getElementById('lista-servicos');

    if (!lista) return;

    const novoItem = document.createElement('div');
    novoItem.classList.add('item-servico');

    novoItem.innerHTML = `
        <input type="text" placeholder="Descrição do serviço">
        <input type="number" class="valor-servico" placeholder="0,00">
    `;

    lista.appendChild(novoItem);

    const novoInput = novoItem.querySelector('.valor-servico');
    novoInput.addEventListener('input', calcularSubtotal);
}

function ativarAdicionarItem() {
    const botao = document.getElementById('add-item');

    if (botao) {
        botao.addEventListener('click', adicionarItem);
    }
}

function gerarPDF() {
    const elemento = document.getElementById('app');
    const botaoPDF = document.getElementById('btn-pdf');
    const botaoAdd = document.getElementById('add-item');

    if (botaoPDF) botaoPDF.style.display = 'none';
    if (botaoAdd) botaoAdd.style.display = 'none';

    const inputs = elemento.querySelectorAll('input, textarea');
    const substituicoes = [];

    inputs.forEach(input => {
        const valor = input.value || '';

        const span = document.createElement('span');
        span.textContent = valor;

        span.style.display = 'inline-block';
        span.style.minHeight = '18px';
        span.style.fontSize = '12px';

        if (input.tagName === 'TEXTAREA') {
            span.style.whiteSpace = 'pre-wrap';
            span.style.display = 'block';
        }

        input.style.display = 'none';
        input.parentNode.insertBefore(span, input.nextSibling);

        substituicoes.push({ input, span });
    });

    html2canvas(elemento).then(canvas => {
        const imgData = canvas.toDataURL('image/png');

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');

        const larguraPDF = 210;
        const alturaPDF = 297;

        const larguraImg = larguraPDF;
        const alturaImg = (canvas.height * larguraImg) / canvas.width;

        let alturaRestante = alturaImg;
        let posicao = 0;

        doc.addImage(imgData, 'PNG', 0, posicao, larguraImg, alturaImg);
        alturaRestante -= alturaPDF;

        while (alturaRestante > 0) {
            posicao = alturaRestante - alturaImg;

            doc.addPage();
            doc.addImage(imgData, 'PNG', 0, posicao, larguraImg, alturaImg);

            alturaRestante -= alturaPDF;
        }

        doc.save('orcamento.pdf');

        // restaurar
        substituicoes.forEach(({ input, span }) => {
            input.style.display = 'inline-block';
            span.remove();
        });

        if (botaoPDF) botaoPDF.style.display = 'block';
        if (botaoAdd) botaoAdd.style.display = 'block';
    });
}

function ativarPDF() {
    const botao = document.getElementById('btn-pdf');

    if (botao) {
        botao.addEventListener('click', gerarPDF);
    }
}

if (app) {
    app.innerHTML = `
        ${Header()}
        ${DadosCliente()}
        ${Servicos()}
        ${Resumo()}
        ${Observacoes()}
        ${Assinaturas()}
        ${Acoes()}
    `;

    const campoData = document.getElementById('data-exibicao');
    if (campoData) {
        campoData.value = formatarData();
    }

    ativarCalculo();
    ativarAdicionarItem();
    ativarPDF();
}