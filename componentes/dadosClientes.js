export function DadosCliente() {
    return `
        <section class="secao-dados">

            <div class="bloco-dados">

                <div class="lado">
                    <h4>PROPRIETÁRIO</h4>

                    <div class="grid-veiculo">
                        <input type="text" placeholder="Nome Completo do Cliente">
                        <input type="text" id="telefone" placeholder="Telefone de Contato">
                    </div>
                </div>

            <div class="lado">
                <h4>VEÍCULO</h4>

                <div class="grid-veiculo">
                    <input type="text" placeholder="Modelo">
                    <input type="text" id="placa" placeholder="Placa">
                    <input type="text" placeholder="Cor">
                    <input type="text" id="ano" placeholder="Ano">
                </div>
            </div>

            </div>

        </section>
    `;
}