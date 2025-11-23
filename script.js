let container = document.querySelector(".card-container");
let caixaBusca = document.querySelector("#caixa-busca");
let botaoBusca = document.querySelector("#botao-busca"); // Re-adicionado
// --- MUDANÇA ADICIONADA ---
// Seleciona o botão "VOLTAR" do HTML para que possamos adicionar uma funcionalidade a ele.
let botaoVoltar = document.querySelector("#botao-voltar");

// Array que irá armazenar os dados dos jogos carregados do data.json
let dados = [];

// Função principal que busca os dados e inicia a aplicação
async function iniciarBusca() {
    try {
        let resposta = await fetch("data.json");
        dados = await resposta.json();
        renderizarApenasNomes(dados); // Exibe apenas os nomes inicialmente
    } catch (error) {
        console.error("Erro ao buscar os dados:", error);
        container.innerHTML = "<p>Não foi possível carregar os dados dos jogos.</p>";
    }
}

// --- FUNÇÃO ADICIONADA PARA O EFEITO DE FADE ---
// Esta função gerencia a animação de fade out e fade in.
function renderizarComFade(funcaoDeRenderizacao, dados) {
    // 1. Inicia o fade out (torna o container transparente)
    container.style.opacity = 0;

    // 2. Aguarda a animação de fade out terminar (300ms, mesmo tempo da transição no CSS)
    setTimeout(() => {
        funcaoDeRenderizacao(dados); // 3. Executa a troca de conteúdo (com o container ainda transparente)
        container.style.opacity = 1; // 4. Inicia o fade in (torna o container visível novamente)
    }, 300);
}

// Função que renderiza os nomes e as capas dos jogos na lista inicial
function renderizarApenasNomes(jogos) {
    container.innerHTML = "";
    jogos.forEach(jogo => {
        const card = document.createElement('article');
        // Adicionamos uma classe nova 'card-lista' para poder estilizar
        // apenas os cards da visualização em lista.
        card.className = 'card card-lista';
        card.innerHTML = `
            <h2>${jogo.nome}</h2>
            <img src="${jogo.imagem}" alt="Capa do jogo ${jogo.nome}" class="card-imagem-lista">`; // Mostra o nome e a imagem
        container.appendChild(card);

        // --- MUDANÇA ADICIONADA ---
        // Seleciona o nome (h2) e a imagem (img) que acabamos de criar dentro do card.
        const nomeDoJogo = card.querySelector('h2');
        const imagemDoJogo = card.querySelector('img');

        // Cria uma função que será executada ao clicar.
        const aoClicar = () => {
            const jogoCompleto = dados.find(j => j.nome === jogo.nome);
            // --- MUDANÇA ---
            // Chama a nova função de fade para renderizar os detalhes
            renderizarComFade(renderizarDetalhesCompletos, [jogoCompleto]);
        };

        // Adiciona o evento de clique APENAS ao nome e à imagem.
        nomeDoJogo.addEventListener('click', aoClicar);
        imagemDoJogo.addEventListener('click', aoClicar);
    });
}

// Função que renderiza os cards com DETALHES COMPLETOS
function renderizarDetalhesCompletos(jogos) {
    container.innerHTML = "";
    if (jogos.length === 0) {
        container.innerHTML = "<p>Nenhum jogo encontrado com este nome.</p>";
        return;
    }

    jogos.forEach(jogo => {
        const card = document.createElement('article');

        card.innerHTML = `
            <h2>${jogo.nome}</h2>
            <p><strong>Data de Lançamento:</strong> ${jogo.data}</p>
            <p><strong>Steam:</strong> <a href="${jogo.steam_link}" target="_blank" rel="noopener noreferrer">Ver na Loja</a></p>
            <p>${jogo.resumo}</p>
            <iframe 
                width="100%" 
                height="615" 
                src="${jogo.trailer}" 
                title="YouTube video player" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        `;
        container.appendChild(card);
    });
}

// Adiciona um "escutador" de eventos de CLIQUE no botão
botaoBusca.addEventListener('click', () => {
    const termoBusca = caixaBusca.value.toLowerCase();
 
    // Se o campo de busca estiver vazio, o botão não faz nada.
    // A responsabilidade de voltar para a lista inicial é apenas do botão "VOLTAR".
    if (!termoBusca) {
        return;
    }
    const jogosFiltrados = dados.filter(jogo => jogo.nome.toLowerCase().includes(termoBusca));
    // --- MUDANÇA ---
    renderizarComFade(renderizarDetalhesCompletos, jogosFiltrados);
});

// Adiciona um "escutador" de eventos de CLIQUE no botão "VOLTAR".
botaoVoltar.addEventListener('click', () => {
    // 1. Limpa o texto que estiver dentro da caixa de busca.
    caixaBusca.value = "";
    // --- MUDANÇA ---
    // Usa a função de fade para voltar à lista inicial
    renderizarComFade(renderizarApenasNomes, dados);
});


iniciarBusca();