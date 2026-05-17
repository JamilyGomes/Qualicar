import { Header } from '../componentes/header.js';
import { DadosCliente } from '../componentes/dadosClientes.js';
import { Servicos } from '../componentes/servicos.js';
import { Resumo } from '../componentes/resumo.js';
import { Observacoes } from '../componentes/observacoes.js';
import { Acoes } from '../componentes/acoes.js';
import { Assinaturas } from '../componentes/assinaturas.js';

const app = document.getElementById('app');

// data 
function formatarData() {
    const hoje = new Date();
    return hoje.toLocaleDateString('pt-BR');
}

// valores
function formatarMoeda(valor) {
    valor = valor.replace(/\D/g, '');

    valor = (Number(valor) / 100).toFixed(2) + '';
    valor = valor.replace('.', ',');

    valor = valor.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return 'R$ ' + valor;
}

function calcularSubtotal() {
    const valores = document.querySelectorAll('.valor-servico');

    let soma = 0;

    valores.forEach(input => {
        const valor = parseFloat(
            input.value
                .replace('R$', '')
                .replace(/\./g, '')
                .replace(',', '.')
        ) || 0;

        soma += valor;
    });

    const subtotalEl = document.getElementById('subtotal');
    if (subtotalEl) {
        subtotalEl.textContent = "R$ " + soma.toFixed(2).replace('.', ',');
    }

    const descontoInput = document.getElementById('desconto');
    const desconto = parseFloat(
        descontoInput?.value
            ?.replace('R$', '')
            .replace(/\./g, '')
            .replace(',', '.')
    ) || 0;

    const total = soma - desconto;

    const totalEl = document.getElementById('total-geral');
    if (totalEl) {
        totalEl.textContent = "R$ " + total.toFixed(2).replace('.', ',');
    }
}

function ativarCalculo() {
    const inputs = document.querySelectorAll('.valor-servico');

    inputs.forEach(input => {
        input.addEventListener('input', (e) => {
            e.target.value = formatarMoeda(e.target.value);
            calcularSubtotal();
        });
    });

    const descontoInput = document.getElementById('desconto');

    if (descontoInput) {
        descontoInput.addEventListener('input', (e) => {
            e.target.value = formatarMoeda(e.target.value);
            calcularSubtotal();
        });
    }
}

// add item 
function adicionarItem() {
    const lista = document.getElementById('lista-servicos');

    if (!lista) return;

    const novoItem = document.createElement('div');
    novoItem.classList.add('item-servico');

    novoItem.innerHTML = `
        <input type="text" placeholder="Descrição do serviço">
        <input type="text" class="valor-servico" placeholder="R$ 0,00">
    `;

    lista.appendChild(novoItem);

    const novoInput = novoItem.querySelector('.valor-servico');

    novoInput.addEventListener('input', (e) => {
        e.target.value = formatarMoeda(e.target.value);
        calcularSubtotal();
    });
}

function ativarAdicionarItem() {
    const botao = document.getElementById('add-item');

    if (botao) {
        botao.addEventListener('click', adicionarItem);
    }
}

// tell 
function mascararTelefone(valor) {
    const numeros = valor.replace(/\D/g, '').slice(0, 11);

    if (numeros.length <= 10) {
        return numeros.replace(
            /(\d{0,2})(\d{0,4})(\d{0,4})/,
            (m, ddd, parte1, parte2) => {
                let r = '';
                if (ddd) r += '(' + ddd;
                if (ddd.length === 2) r += ') ';
                if (parte1) r += parte1;
                if (parte2) r += '-' + parte2;
                return r;
            }
        );
    }

    return numeros.replace(
        /(\d{0,2})(\d{0,5})(\d{0,4})/,
        (m, ddd, parte1, parte2) => {
            let r = '';
            if (ddd) r += '(' + ddd;
            if (ddd.length === 2) r += ') ';
            if (parte1) r += parte1;
            if (parte2) r += '-' + parte2;
            return r;
        }
    );
}

function ativarMascaraTelefone() {
    const input = document.getElementById('telefone');

    if (!input) return;

    let ultimoValor = '';

    input.addEventListener('input', (e) => {
        const cursor = e.target.selectionStart;

        const apenasNumeros = e.target.value.replace(/\D/g, '').slice(0, 11);
        const formatado = mascararTelefone(apenasNumeros);

        ultimoValor = formatado;
        e.target.value = formatado;

        const diff = formatado.length - apenasNumeros.length;
        e.target.setSelectionRange(cursor + diff, cursor + diff);
    });

    input.addEventListener('paste', (e) => {
        e.preventDefault();

        const texto = (e.clipboardData || window.clipboardData)
            .getData('text')
            .replace(/\D/g, '')
            .slice(0, 11);

        const formatado = mascararTelefone(texto);

        input.value = formatado;
    });
}

// placa 
function ativarPlacaMaiuscula() {
    const input = document.getElementById('placa');

    if (!input) return;

    input.addEventListener('input', (e) => {
        e.target.value = e.target.value
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, '')
            .slice(0, 7);
    });
}

// ano 
function ativarAnoQuatroDigitos() {
    const input = document.getElementById('ano');
    const erro = document.getElementById('erro-ano');

    if (!input) return;

    input.addEventListener('input', (e) => {

        let valor = e.target.value
            .replace(/\D/g, '')
            .slice(0, 4);

        e.target.value = valor;

        const anoAtual = new Date().getFullYear() + 1;

        if (valor.length === 4) {

            const anoNumero = parseInt(valor);

            if (anoNumero < 1900 || anoNumero > anoAtual) {

                input.classList.add('input-invalido');

                erro.textContent = 'Ano inválido';

            } else {

                input.classList.remove('input-invalido');

                erro.textContent = '';
            }

        } else {

            input.classList.remove('input-invalido');

            erro.textContent = '';
        }
    });
}

// nome cliente 
function ativarNomeSemNumero() {
    const input = document.getElementById('nome-cliente');

    if (!input) return;

    input.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[0-9]/g, '');
    });
}

// pdf 
function gerarPDF() {
    const elemento = document.getElementById('app');
    const botaoPDF = document.getElementById('btn-pdf');
    const botaoAdd = document.getElementById('add-item');

    if (botaoPDF) botaoPDF.style.display = 'none';
    if (botaoAdd) botaoAdd.style.display = 'none';

    const inputs = elemento.querySelectorAll('input, textarea');
    const substituicoes = [];

    inputs.forEach(input => {
        const valor = input.value || ' ';

        const span = document.createElement('span');
        span.textContent = valor;

        span.style.display = 'inline-block';
        span.style.minHeight = '18px';
        span.style.fontSize = '14px';
        span.style.width = '100%';
        span.style.padding = '8px';
        span.style.border = '1px solid #ccc';
        span.style.borderRadius = '4px';
        span.style.background = '#fff';

        if (input.id === 'data-exibicao') {
            span.style.color = '#fff';
            span.style.background = 'transparent';
            span.style.border = 'none';
            span.style.padding = '0';
        }

        if (input.tagName === 'TEXTAREA') {
            span.style.whiteSpace = 'pre-wrap';
            span.style.display = 'block';
        }

        input.style.display = 'none';
        input.parentNode.insertBefore(span, input.nextSibling);

        substituicoes.push({ input, span });
    });

    html2canvas(elemento, {
        scale: 2,
        useCORS: true,
        windowWidth: 1200
    }).then(canvas => {
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

        const nomeCliente = document.getElementById('nome-cliente')?.value || 'cliente';

        const nomeArquivo = `orcamento-${nomeCliente
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '-')}.pdf`;

        doc.save(nomeArquivo);
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
    ativarMascaraTelefone();
    ativarPlacaMaiuscula();
    ativarAnoQuatroDigitos();
    ativarNomeSemNumero();
}