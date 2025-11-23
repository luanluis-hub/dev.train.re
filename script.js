let container = document.querySelector(".card-container");
let caixaBusca = document.querySelector("#caixa-busca");
let botaoBusca = document.querySelector("#botao-busca");
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

// Função que renderiza APENAS OS NOMES dos jogos
function renderizarApenasNomes(jogos) {
    container.innerHTML = "";
    jogos.forEach(jogo => {
        const card = document.createElement('article');
        card.className = 'card';
        card.innerHTML = `<h2>${jogo.nome}</h2>`; // Mostra apenas o nome
        container.appendChild(card);

        // --- MUDANÇA ADICIONADA ---
        // Adiciona um evento de clique a cada card de nome.
        card.addEventListener('click', () => {
            // 1. Encontra o jogo completo no array 'dados' usando o nome do jogo clicado.
            const jogoCompleto = dados.find(j => j.nome === jogo.nome);
            // 2. Chama a função para renderizar os detalhes, passando o jogo encontrado dentro de um array.
            //    Colocamos dentro de um array [jogoCompleto] porque a função renderizarDetalhesCompletos espera receber uma lista de jogos.
            renderizarDetalhesCompletos([jogoCompleto]);
        });
    });
}

// Função que renderiza os cards com DETALHES COMPLETOS
function renderizarDetalhesCompletos(jogos) {
    container.innerHTML = "";

    // Se a busca não encontrar nenhum jogo, exibe uma mensagem
    if (jogos.length === 0) {
        container.innerHTML = "<p>Nenhum jogo encontrado com este nome.</p>";
        return;
    }

    jogos.forEach(jogo => {
        const card = document.createElement('article');
        card.className = 'card';

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
 
    // --- MUDANÇA ADICIONADA ---
    // Se o campo de busca estiver vazio, o botão não faz nada.
    // A responsabilidade de voltar para a lista inicial é apenas do botão "VOLTAR".
    if (!termoBusca) {
        return;
    }
    const jogosFiltrados = dados.filter(jogo => jogo.nome.toLowerCase().includes(termoBusca));
    renderizarDetalhesCompletos(jogosFiltrados);
});

// --- MUDANÇA ADICIONADA ---
// Adiciona um "escutador" de eventos de CLIQUE no botão "VOLTAR".
botaoVoltar.addEventListener('click', () => {
    // 1. Limpa o texto que estiver dentro da caixa de busca.
    caixaBusca.value = "";
    // 2. Chama a função para renderizar a lista inicial, mostrando apenas os nomes de todos os jogos.
    renderizarApenasNomes(dados);
});


// Inicia o processo ao carregar o script
iniciarBusca();