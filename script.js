let carrinho = [];

let pagamentoSelecionado = "";


/* =========================
   ADICIONAR PRODUTO
========================= */

function adicionarProduto(nome, preco) {

    const produto = carrinho.find(
        item => item.nome === nome
    );

    if (produto) {

        produto.quantidade++;

    } else {

        carrinho.push({
            nome: nome,
            preco: preco,
            quantidade: 1
        });

    }

    atualizarCarrinho();

}


/* =========================
   ATUALIZAR CARRINHO
========================= */

function atualizarCarrinho() {

    const container =
        document.getElementById("itensCarrinho");

    const totalElemento =
        document.getElementById("totalCarrinho");

    if (!container || !totalElemento)
        return;

    container.innerHTML = "";

    let total = 0;

    carrinho.forEach((produto, index) => {

        const subtotal =
            produto.preco * produto.quantidade;

        total += subtotal;

        const item =
            document.createElement("div");

        item.className = "item-carrinho";

        item.innerHTML = `

            <div>

                <h4>${produto.nome}</h4>

                ${produto.detalhes ? `<small style="display:block;color:#aaa397;margin-bottom:6px;line-height:1.4;">${produto.detalhes}</small>` : ""}

                <p>
                    R$ ${subtotal.toFixed(2).replace(".", ",")}
                </p>

            </div>

            <div class="quantidade">

                <button onclick="alterarQuantidade(${index}, -1)">
                    −
                </button>

                <span>
                    ${produto.quantidade}
                </span>

                <button onclick="alterarQuantidade(${index}, 1)">
                    +
                </button>

            </div>
        `;

        container.appendChild(item);

    });

    totalElemento.textContent =
        "R$ " + total.toFixed(2).replace(".", ",");

}


/* =========================
   ALTERAR QUANTIDADE
========================= */

function alterarQuantidade(index, valor) {

    carrinho[index].quantidade += valor;

    if (carrinho[index].quantidade <= 0) {

        carrinho.splice(index, 1);

    }

    atualizarCarrinho();

}


/* =========================
   ABRIR CARRINHO
========================= */

function abrirCarrinho() {

    const modal =
        document.getElementById("carrinhoModal");

    modal.classList.add("aberto");

    atualizarCarrinho();

}


/* =========================
   FECHAR CARRINHO
========================= */

function fecharCarrinho() {

    document
        .getElementById("carrinhoModal")
        .classList.remove("aberto");

}


/* =========================
   PAGAMENTO
========================= */

function selecionarPagamento(tipo) {

    pagamentoSelecionado = tipo;

    const troco =
        document.getElementById("trocoArea");

    if (tipo === "Dinheiro") {

        troco.classList.add("visivel");

    } else {

        troco.classList.remove("visivel");

        document.getElementById("valorDinheiro").value = "";

        document.getElementById("valorTroco").textContent = "";

    }

}


/* =========================
   CALCULAR TROCO
========================= */

function calcularTroco() {

    const valor =
        parseFloat(
            document.getElementById("valorDinheiro").value
        );

    const total =
        carrinho.reduce(
            (soma, produto) =>
                soma + produto.preco * produto.quantidade,
            0
        );

    const resultado =
        document.getElementById("valorTroco");

    if (isNaN(valor)) {

        resultado.textContent = "";

        return;

    }

    const troco = valor - total;

    if (troco < 0) {

        resultado.textContent =
            "⚠️ O valor informado é menor que o pedido.";

    } else {

        resultado.textContent =
            "Troco: R$ " +
            troco.toFixed(2).replace(".", ",");

    }

}


/* =========================
   FINALIZAR PEDIDO
========================= */

function finalizarPedido() {

    if (carrinho.length === 0) {

        alert("Seu carrinho está vazio!");

        return;

    }

    if (!pagamentoSelecionado) {

        alert("Escolha uma forma de pagamento.");

        return;

    }

    const total =
        carrinho.reduce(
            (soma, produto) =>
                soma + produto.preco * produto.quantidade,
            0
        );

    let mensagem =
        "🍣 *NOVO PEDIDO - HARU CAIÇARA*%0A%0A";

    carrinho.forEach(produto => {

        const subtotal =
            produto.preco * produto.quantidade;

        mensagem +=
            `${produto.quantidade}x ${produto.nome} - R$ ${subtotal.toFixed(2).replace(".", ",")}%0A`;

        if (produto.detalhes) {
            mensagem += `   Ingredientes: ${produto.detalhes}%0A`;
        }

    });

    mensagem +=
        `%0A💰 *Total: R$ ${total.toFixed(2).replace(".", ",")}*`;

    mensagem +=
        `%0A💳 Pagamento: ${pagamentoSelecionado}`;

    if (pagamentoSelecionado === "Dinheiro") {

        const valor =
            parseFloat(
                document.getElementById("valorDinheiro").value
            );

        if (isNaN(valor) || valor < total) {

            alert("Informe um valor válido para o troco.");

            return;

        }

        const troco = valor - total;

        mensagem +=
            `%0A💵 Troco para: R$ ${valor.toFixed(2).replace(".", ",")}`;

        mensagem +=
            `%0A💵 Troco: R$ ${troco.toFixed(2).replace(".", ",")}`;

    }

    const numero =
        "5522998168216";

    const url =
        `https://wa.me/${numero}?text=${mensagem}`;

    window.open(url, "_blank");

}
// ===============================
// PESQUISA DE PRODUTOS
// ===============================

const campoPesquisa = document.getElementById("campoPesquisa");

campoPesquisa.addEventListener("input", function () {

    const pesquisa = campoPesquisa.value
        .toLowerCase()
        .trim();

    const produtos = document.querySelectorAll(".produto");

    produtos.forEach(function (produto) {

        const nome = produto
            .querySelector("h3")
            .textContent
            .toLowerCase();

        const descricao = produto
            .querySelector("p");

        const textoDescricao = descricao
            ? descricao.textContent.toLowerCase()
            : "";

        if (
            nome.includes(pesquisa) ||
            textoDescricao.includes(pesquisa)
        ) {
            produto.style.display = "";
        } else {
            produto.style.display = "none";
        }

    });

});

/* =====================================================
   MONTE SEU POKE
===================================================== */

const pokeItens = {
    "Salmão": { preco: 10, quantidade: 0 },
    "Camarão": { preco: 12, quantidade: 0 },
    "Cream Cheese": { preco: 5, quantidade: 0 }
};

function alterarPoke(nome, preco, valor) {
    if (!pokeItens[nome]) {
        pokeItens[nome] = { preco: preco, quantidade: 0 };
    }

    pokeItens[nome].quantidade += valor;

    if (pokeItens[nome].quantidade < 0) {
        pokeItens[nome].quantidade = 0;
    }

    const elemento = document.getElementById("qtd-" + nome);
    if (elemento) {
        elemento.textContent = pokeItens[nome].quantidade;
    }

    atualizarTotalPoke();
}

function calcularTotalPoke() {
    return Object.values(pokeItens).reduce((total, item) => {
        return total + (item.preco * item.quantidade);
    }, 0);
}

function atualizarTotalPoke() {
    const total = calcularTotalPoke();
    const elemento = document.getElementById("totalPoke");

    if (elemento) {
        elemento.textContent = "R$ " + total.toFixed(2).replace(".", ",");
    }
}

function adicionarPokeAoCarrinho() {
    const total = calcularTotalPoke();

    if (total <= 0) {
        alert("Escolha pelo menos um ingrediente para montar seu Poke.");
        return;
    }

    const itens = Object.entries(pokeItens)
        .filter(([nome, item]) => item.quantidade > 0)
        .map(([nome, item]) => `${item.quantidade}x ${nome}`)
        .join(", ");

    const nomePoke = "Poke Personalizado";
    const existente = carrinho.find(item => item.nome === nomePoke && item.tipo === "poke");

    // Cada configuração é adicionada como um item próprio para não misturar ingredientes.
    carrinho.push({
        nome: nomePoke,
        preco: total,
        quantidade: 1,
        tipo: "poke",
        detalhes: itens
    });

    atualizarCarrinho();

    alert("Poke adicionado ao carrinho!");

    Object.values(pokeItens).forEach(item => item.quantidade = 0);
    Object.keys(pokeItens).forEach(nome => {
        const elemento = document.getElementById("qtd-" + nome);
        if (elemento) elemento.textContent = "0";
    });
    atualizarTotalPoke();
}
