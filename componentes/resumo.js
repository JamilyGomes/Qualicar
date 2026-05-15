export function Resumo() {
    return `
        <section class="secao-resumo">

            <div>
                <p>Subtotal</p>
                <span id="subtotal">R$ 0,00</span>
            </div>

            <div>
                <p>Desconto Especial</p>
                <input type="text" id="desconto">
            </div>

            <div>
                <strong>TOTAL GERAL</strong>
                <h2 id="total-geral">R$ 0,00</h2>
            </div>

        </section>
    `;
}