let carrinho = [];


// PESQUISA

const campoPesquisa = document.getElementById("campoPesquisa");

campoPesquisa.addEventListener("input", function () {

    const pesquisa = this.value
        .toLowerCase()
        .trim();

    const produtos = document.querySelectorAll(".produto");

    produtos.forEach(function (produto) {

        const nome = produto
            .querySelector("h3")
            .textContent
            .toLowerCase();

        if (nome.includes(pesquisa)) {

            produto.style.display = "";

        } else {

            produto.style.display = "none";

        }

    });
});


// ADICIONAR AO CARRINHO

function adicionarProduto(nome, preco) {

    carrinho.push({
        nome: nome,
        preco: preco
    });

    alert(
        nome +
        " foi adicionado ao carrinho!"
    );
}


// ABRIR CARRINHO

function abrirCarrinho() {

    if (carrinho.length === 0) {

        alert("Seu carrinho está vazio.");

        return;
    }

    let mensagem = "🛒 SEU CARRINHO\n\n";

    let total = 0;

    carrinho.forEach(function (produto, indice) {

        mensagem +=
            (indice + 1) +
            ". " +
            produto.nome +
            " - R$ " +
            produto.preco.toFixed(2) +
            "\n";

        total += produto.preco;

    });

    mensagem +=
        "\nTOTAL: R$ " +
        total.toFixed(2);

    alert(mensagem);
}


// MENU

function mostrarMenu() {

    alert(
        "🍣 HARU CAIÇARA\n\n" +
        "Escolha uma categoria no menu acima."
    );
}