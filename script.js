/* =========================================================
   HOUSE DELIVERY - JAVASCRIPT
   ---------------------------------------------------------
   Este arquivo controla:
   1. Carrinho
   2. Quantidades dos produtos
   3. Pagamento e troco
   4. Monte seu Poke
   5. Navegação por categorias
   6. Busca de produtos
========================================================= */

let carrinho = [];
let pagamentoSelecionado = "";
let categoriaAtual = null;
let modoPesquisa = false;

const poke = {
    "Salmão": { preco: 10, quantidade: 0 },
    "Camarão": { preco: 12, quantidade: 0 },
    "Cream Cheese": { preco: 5, quantidade: 0 }
};

function formatarMoeda(valor) {
    return "R$ " + Number(valor).toFixed(2).replace(".", ",");
}

function quantidadeNoCarrinho(nome) {
    const item = carrinho.find(produto => produto.nome === nome);
    return item ? item.quantidade : 0;
}

function adicionarProduto(nome, preco) {
    const produto = carrinho.find(item => item.nome === nome && !item.detalhes);

    if (produto) {
        produto.quantidade++;
    } else {
        carrinho.push({ nome, preco: Number(preco), quantidade: 1 });
    }

    atualizarCarrinho();
}

function alterarProdutoCard(nome, valor) {
    const produto = carrinho.find(item => item.nome === nome && !item.detalhes);

    if (valor > 0) {
        adicionarProduto(nome, obterPrecoDoCard(nome));
        return;
    }

    if (!produto) return;

    produto.quantidade--;

    if (produto.quantidade <= 0) {
        const index = carrinho.indexOf(produto);
        carrinho.splice(index, 1);
    }

    atualizarCarrinho();
}

function obterPrecoDoCard(nome) {
    const controle = [...document.querySelectorAll('.controle-produto')]
        .find(el => el.dataset.produto === nome);

    return controle ? Number(controle.dataset.preco) : 0;
}

function atualizarControlesProdutos() {
    document.querySelectorAll('.controle-produto').forEach(controle => {
        const nome = controle.dataset.produto;
        const quantidade = quantidadeNoCarrinho(nome);
        const contador = controle.querySelector('.qtd-produto');
        const menos = controle.querySelector('.btn-menos');

        if (contador) contador.textContent = quantidade;
        if (menos) menos.disabled = quantidade === 0;

        controle.classList.toggle('tem-item', quantidade > 0);
    });
}

function atualizarContadorCarrinho() {
    const contador = document.getElementById('contadorCarrinho');
    if (!contador) return;

    const quantidadeTotal = carrinho.reduce(
        (soma, produto) => soma + produto.quantidade,
        0
    );

    contador.textContent = quantidadeTotal;
    contador.classList.toggle('visivel', quantidadeTotal > 0);
}

function atualizarCarrinho() {
    const container = document.getElementById("itensCarrinho");
    const totalElemento = document.getElementById("totalCarrinho");

    if (!container || !totalElemento) return;

    container.innerHTML = "";
    let total = 0;

    carrinho.forEach((produto, index) => {
        const subtotal = produto.preco * produto.quantidade;
        total += subtotal;

        const item = document.createElement("div");
        item.className = "item-carrinho";

        item.innerHTML = `
            <div class="item-carrinho-info">
                <h4>${produto.nome}</h4>
                ${produto.detalhes ? `<small class="detalhes-carrinho">${produto.detalhes}</small>` : ""}
                <p>${formatarMoeda(subtotal)}</p>
            </div>

            <div class="quantidade">
                <button type="button" onclick="alterarQuantidade(${index}, -1)" aria-label="Diminuir">−</button>
                <span>${produto.quantidade}</span>
                <button type="button" onclick="alterarQuantidade(${index}, 1)" aria-label="Aumentar">+</button>
            </div>
        `;

        container.appendChild(item);
    });

    totalElemento.textContent = formatarMoeda(total);
    atualizarControlesProdutos();
    atualizarContadorCarrinho();
}

function alterarQuantidade(index, valor) {
    if (!carrinho[index]) return;

    carrinho[index].quantidade += valor;

    if (carrinho[index].quantidade <= 0) {
        carrinho.splice(index, 1);
    }

    atualizarCarrinho();
}

function abrirCarrinho() {
    const modal = document.getElementById("carrinhoModal");

    if (!modal) {
        console.error("Elemento #carrinhoModal não encontrado.");
        return;
    }

    atualizarCarrinho();

    modal.classList.add("aberto");
    document.body.classList.add("carrinho-aberto");
}

function fecharCarrinho() {
    const modal = document.getElementById("carrinhoModal");

    if (!modal) return;

    modal.classList.remove("aberto");
    document.body.classList.remove("carrinho-aberto");
}

function selecionarPagamento(tipo) {
    pagamentoSelecionado = tipo;

    const troco = document.getElementById("trocoArea");
    if (!troco) return;

    if (tipo === "Dinheiro") {
        troco.classList.add("visivel");
    } else {
        troco.classList.remove("visivel");
        document.getElementById("valorDinheiro").value = "";
        document.getElementById("valorTroco").textContent = "";
    }
}

function calcularTroco() {
    const campo = document.getElementById("valorDinheiro");
    const resultado = document.getElementById("valorTroco");
    if (!campo || !resultado) return;

    const valor = parseFloat(campo.value);
    const total = carrinho.reduce((soma, produto) => soma + produto.preco * produto.quantidade, 0);

    if (isNaN(valor)) {
        resultado.textContent = "";
        return;
    }

    const troco = valor - total;
    resultado.textContent = troco < 0
        ? "⚠️ O valor informado é menor que o pedido."
        : "Troco: " + formatarMoeda(troco);
}

function finalizarPedido() {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    if (!pagamentoSelecionado) {
        alert("Escolha uma forma de pagamento.");
        return;
    }

    const campoEndereco = document.getElementById("enderecoCliente");
    const endereco = campoEndereco ? campoEndereco.value.trim() : "";

    if (!endereco) {
        alert("Informe o endereço de entrega.");
        if (campoEndereco) campoEndereco.focus();
        return;
    }

    const total = carrinho.reduce(
        (soma, produto) => soma + produto.preco * produto.quantidade,
        0
    );

    const linhasPedido = [];

    linhasPedido.push("🍣 *NOVO PEDIDO - HOUSE DELIVERY*");
    linhasPedido.push("");

    carrinho.forEach(produto => {
        const subtotal = produto.preco * produto.quantidade;

        linhasPedido.push(
            `${produto.quantidade}x ${produto.nome} - ${formatarMoeda(subtotal)}`
        );

        if (produto.detalhes) {
            linhasPedido.push(`   Ingredientes: ${produto.detalhes}`);
        }
    });

    linhasPedido.push("");
    linhasPedido.push(`💰 *Total: ${formatarMoeda(total)}*`);
    linhasPedido.push(`💳 Pagamento: ${pagamentoSelecionado}`);
    linhasPedido.push(`📍 *Endereço:* ${endereco}`);

    if (pagamentoSelecionado === "Dinheiro") {
        const campoDinheiro = document.getElementById("valorDinheiro");
        const valor = parseFloat(campoDinheiro?.value);

        if (isNaN(valor) || valor < total) {
            alert("Informe um valor válido para o troco.");
            return;
        }

        const troco = valor - total;

        linhasPedido.push(`💵 Troco para: ${formatarMoeda(valor)}`);
        linhasPedido.push(`💵 Troco: ${formatarMoeda(troco)}`);
    }

    const numero = "5522998953298";
    const mensagem = encodeURIComponent(linhasPedido.join("\n"));

    window.open(
        `https://wa.me/${numero}?text=${mensagem}`,
        "_blank"
    );
}

// ===============================
// MONTE SEU POKE
// ===============================

function alterarPoke(nome, preco, valor) {
    if (!poke[nome]) {
        poke[nome] = { preco: Number(preco), quantidade: 0 };
    }

    poke[nome].quantidade += valor;
    if (poke[nome].quantidade < 0) {
        poke[nome].quantidade = 0;
    }

    const id = "qtd-" + nome;
    const elemento = document.getElementById(id);
    if (elemento) {
        elemento.textContent = poke[nome].quantidade;
    }

    calcularPoke();
}

function calcularPoke() {
    let total = 0;
    let detalhes = [];

    Object.entries(poke).forEach(([nome, item]) => {
        total += item.preco * item.quantidade;
        if (item.quantidade > 0) detalhes.push(`${item.quantidade}x ${nome}`);
    });

    const totalElemento = document.getElementById("totalPoke");
    if (totalElemento) totalElemento.textContent = formatarMoeda(total);

    return { total, detalhes: detalhes.join(", ") };
}

function adicionarPokeAoCarrinho() {
    const resultado = calcularPoke();

    if (resultado.total <= 0) {
        alert("Escolha pelo menos um ingrediente para montar seu Poke.");
        return;
    }

    const nome = "Poke Personalizado";
    const existente = carrinho.find(
        item => item.nome === nome && item.detalhes === resultado.detalhes
    );

    if (existente) {
        existente.quantidade++;
    } else {
        carrinho.push({
            nome,
            preco: resultado.total,
            quantidade: 1,
            detalhes: resultado.detalhes
        });
    }

    atualizarCarrinho();
    alert("🥗 Poke adicionado ao carrinho!");
}

// ===============================
// NAVEGAÇÃO POR CATEGORIAS
// ===============================

function mostrarApenasSecao(id) {
    const secoes = document.querySelectorAll('.secao');
    secoes.forEach(secao => {
        secao.classList.remove('secao-ativa', 'pesquisa-ativa');
        if (secao.id === id) secao.classList.add('secao-ativa');
    });
}

function abrirCategoria(id) {
    const alvo = document.getElementById(id);
    const home = document.getElementById('paginaCategorias');
    const voltar = document.getElementById('voltarCategorias');

    if (!alvo) return;

    modoPesquisa = false;
    categoriaAtual = id;
    mostrarApenasSecao(id);
    document.body.classList.add('categoria-aberta');

    if (home) home.style.display = 'none';
    if (voltar) voltar.classList.add('visivel');

    const campo = document.getElementById('campoPesquisa');
    if (campo) campo.value = '';

}

function voltarCategorias() {
    document.querySelectorAll('.secao').forEach(secao => {
        secao.classList.remove('secao-ativa', 'pesquisa-ativa');
        secao.querySelectorAll('.produto').forEach(produto => produto.style.display = '');
    });

    categoriaAtual = null;
    modoPesquisa = false;
    document.body.classList.remove('categoria-aberta');

    const home = document.getElementById('paginaCategorias');
    const voltar = document.getElementById('voltarCategorias');
    const campo = document.getElementById('campoPesquisa');

    if (home) home.style.display = '';
    if (voltar) voltar.classList.remove('visivel');
    if (campo) campo.value = '';

}

function pesquisarProdutos(valor) {
    const pesquisa = valor.toLowerCase().trim();
    const home = document.getElementById('paginaCategorias');
    const voltar = document.getElementById('voltarCategorias');
    const secoes = document.querySelectorAll('.secao');

    if (!pesquisa) {
        if (categoriaAtual) {
            modoPesquisa = false;
            mostrarApenasSecao(categoriaAtual);
            secoes.forEach(secao => secao.querySelectorAll('.produto').forEach(p => p.style.display = ''));
            if (home) home.style.display = 'none';
            if (voltar) voltar.classList.add('visivel');
        } else {
            voltarCategorias();
        }
        return;
    }

    modoPesquisa = true;
    document.body.classList.add('categoria-aberta');
    if (home) home.style.display = 'none';
    if (voltar) voltar.classList.add('visivel');

    let encontrou = false;

    secoes.forEach(secao => {
        if (secao.id === 'montar-poke') {
            secao.classList.remove('pesquisa-ativa');
            secao.classList.remove('secao-ativa');
            return;
        }

        let encontrouNaSecao = false;

        secao.querySelectorAll('.produto').forEach(produto => {
            const titulo = produto.querySelector('h3');
            const descricao = produto.querySelector('p');
            const texto = `${titulo?.textContent || ''} ${descricao?.textContent || ''}`.toLowerCase();
            const corresponde = texto.includes(pesquisa);

            produto.style.display = corresponde ? '' : 'none';
            if (corresponde) encontrouNaSecao = encontrou = true;
        });

        secao.classList.toggle('pesquisa-ativa', encontrouNaSecao);
        secao.classList.remove('secao-ativa');
    });

    categoriaAtual = null;

    const aviso = document.getElementById('avisoPesquisa');
    if (aviso) {
        aviso.textContent = encontrou
            ? 'Resultados encontrados para: ' + valor
            : 'Nenhum produto encontrado para: ' + valor;
    }
}

function mostrarMenu() {
    if (categoriaAtual || modoPesquisa) {
        voltarCategorias();
        return;
    }
    const campo = document.getElementById('campoPesquisa');
    if (campo) campo.focus();
}

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.secao').forEach(secao => {
        secao.classList.remove('secao-ativa', 'pesquisa-ativa');
    });

    const campo = document.getElementById('campoPesquisa');
    if (campo) campo.addEventListener('input', () => pesquisarProdutos(campo.value));

    atualizarCarrinho();
});

document.addEventListener('click', function (event) {
    const modal = document.getElementById('carrinhoModal');

    if (modal && event.target === modal) {
        fecharCarrinho();
    }
});

document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        const modal = document.getElementById('carrinhoModal');
        if (modal?.classList.contains('aberto')) {
            fecharCarrinho();
        } else if (categoriaAtual || modoPesquisa) {
            voltarCategorias();
        }
    }
});
