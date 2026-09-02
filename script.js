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
        "🍣 *NOVO PEDIDO - SUSHI HOUSE DELIVERY*%0A%0A";

    carrinho.forEach(produto => {

        const subtotal =
            produto.preco * produto.quantidade;

        mensagem +=
            `${produto.quantidade}x ${produto.nome} - R$ ${subtotal.toFixed(2).replace(".", ",")}%0A`;

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
        "5522998953298";

    const url =
        `https://wa.me/${numero}?text=${mensagem}`;

    window.open(url, "_blank");

}
// ===============================
// PESQUISA DE PRODUTOS
// ===============================

const campoPesquisa = document.getElementById("campoPesquisa");

// Cria mensagem de produto não encontrado
const mensagemPesquisa = document.createElement("div");

mensagemPesquisa.id = "mensagemPesquisa";
mensagemPesquisa.textContent = "Nenhum produto encontrado 😕";

mensagemPesquisa.style.display = "none";
mensagemPesquisa.style.textAlign = "center";
mensagemPesquisa.style.padding = "50px 20px";
mensagemPesquisa.style.fontSize = "20px";
mensagemPesquisa.style.fontWeight = "600";
mensagemPesquisa.style.color = "#d4af37";

// Coloca a mensagem antes das seções
document.querySelector("main").prepend(mensagemPesquisa);


campoPesquisa.addEventListener("input", function () {

    const pesquisa = campoPesquisa.value
        .toLowerCase()
        .trim();

    const secoes = document.querySelectorAll(".secao");

    // Se o campo estiver vazio
    if (pesquisa === "") {

        secoes.forEach(function (secao) {
            secao.style.display = "";
        });

        document.querySelectorAll(".produto").forEach(function (produto) {
            produto.style.display = "";
        });

        mensagemPesquisa.style.display = "none";

        return;
    }


    let encontrouProduto = false;
    let primeiroProduto = null;


    // Percorre cada seção
    secoes.forEach(function (secao) {

        const produtos = secao.querySelectorAll(".produto");

        let encontrouNaSecao = false;


        produtos.forEach(function (produto) {

            const nomeElemento = produto.querySelector("h3");
            const descricaoElemento = produto.querySelector("p");

            const nome = nomeElemento
                ? nomeElemento.textContent.toLowerCase()
                : "";

            const descricao = descricaoElemento
                ? descricaoElemento.textContent.toLowerCase()
                : "";


            if (
                nome.includes(pesquisa) ||
                descricao.includes(pesquisa)
            ) {

                produto.style.display = "";

                encontrouNaSecao = true;
                encontrouProduto = true;

                if (!primeiroProduto) {
                    primeiroProduto = produto;
                }

            } else {

                produto.style.display = "none";

            }

        });


        // Se essa categoria não tiver nenhum resultado,
        // esconde a categoria inteira
        if (encontrouNaSecao) {
            secao.style.display = "";
        } else {
            secao.style.display = "none";
        }

    });


    // Se não encontrou nenhum produto
    if (!encontrouProduto) {

        mensagemPesquisa.style.display = "block";

    } else {

        mensagemPesquisa.style.display = "none";

        // Vai automaticamente para o primeiro produto encontrado
        setTimeout(function () {

            primeiroProduto.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }, 100);

    }

});