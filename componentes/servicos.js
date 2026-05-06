export function Servicos() {
    return `
        <section class="secao-servicos">
            <h3>DESCRIÇÃO DOS SERVIÇOS E PEÇAS</h3>

            <div id="lista-servicos">

                <div class="item-servico">
                    <input type="text" placeholder="Ex: Pintura da porta dianteira esquerda">
                    <input type="number" placeholder="0,00">
                </div>

                <div class="item-servico">
                    <input type="text" placeholder="Ex: Mão de obra funilaria">
                    <input type="number" placeholder="0,00">
                </div>

            </div>

            <button id="add-item">+ Adicionar item</button>
        </section>
    `;
}