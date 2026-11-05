const boardData = [
    { type: 'start', title: 'Ponto de Partida', desc: 'Comece sua jornada sustentável rumo ao conhecimento!' },
    
    { 
        type: 'info', 
        topic: 'Pegada de Carbono',
        title: 'Entendendo as Emissões', 
        desc: 'A pegada de carbono mede os gases estufa que jogamos na atmosfera através de nossas rotinas diárias.',
        source: '🔬 IPCC Report: Pequenas mudanças logísticas e de consumo diário reduzem pegadas individuais em até 40%.',
        effect: 20
    },
    
    { 
        type: 'quiz', 
        topic: 'Plástico Verde',
        title: 'Desafio da Biomassa', 
        question: 'O plástico verde é benéfico ao meio ambiente principalmente por qual motivo?',
        options: [
            'Ele se dissolve na água da chuva instantaneamente.',
            'É feito de cana-de-açúcar, capturando CO₂ da atmosfera durante seu crescimento.',
            'É um material que não pode ser reciclado, virando adubo.'
        ],
        answer: 1,
        explanation: 'Por usar fontes renováveis como a biomassa, ele reduz a dependência de combustíveis fósseis.',
        reward: 30, penalty: 15
    },

    { 
        type: 'info', 
        topic: 'Logística Reversa',
        title: 'O Retorno das Embalagens', 
        desc: 'Empresas são responsáveis por recolher seus produtos pós-consumo, garantindo que pilhas ou eletrônicos não parem na natureza.',
        source: '🔬 Política Nacional de Resíduos Sólidos (PNRS): A logística integrada reduz o descarte incorreto industrial.',
        effect: 20
    },

    { 
        type: 'quiz', 
        topic: 'Pilhas e Baterias',
        title: 'Ameaça Química', 
        question: 'O que acontece quando descartamos pilhas comuns junto com o lixo orgânico da cozinha?',
        options: [
            'Elas aceleram a decomposição dos alimentos de forma segura.',
            'A blindagem externa se rompe, liberando metais pesados altamente tóxicos que contaminam o solo.',
            'Elas evaporam naturalmente sem deixar resíduos poluentes.'
        ],
        answer: 1,
        explanation: 'Metais pesados como cádmio, chumbo e mercúrio infiltram-se no lençol freático por décadas.',
        reward: 40, penalty: 20
    },

    { 
        type: 'info', 
        topic: 'Economia Circular',
        title: 'O Ciclo sem Fim', 
        desc: 'Diferente do modelo linear de "extrair, produzir e descartar", a economia circular planeja produtos para serem infinitamente reutilizados.',
        source: '🔬 Ellen MacArthur Foundation: Manter materiais em circulação elimina resíduos e economiza até 90% de energia industrial.',
        effect: 25
    },

    { 
        type: 'quiz', 
        topic: 'Economia Circular',
        title: 'Reciclagem Eficiente', 
        question: 'Qual a vantagem da reciclagem do alumínio dentro do ecossistema de economia circular?',
        options: [
            'Nenhuma, o processo gasta mais recursos que extrair metal novo.',
            'O alumínio reciclado fica frágil e perde o valor de mercado.',
            'Economiza 95% da energia que seria necessária para produzir alumínio primário direto da extração.'
        ],
        answer: 2,
        explanation: 'Reciclar o metal já processado reduz as emissões de carbono brutas e poupa mineração severa.',
        reward: 35, penalty: 15
    },

    { type: 'end', title: 'Chegada Sustentável', desc: 'Fim da trilha! Vamos consolidar o seu impacto ecológico mundial.' }
];

let playerPosition = 0;
let score = 100;

// Referências globais dos elementos
let boardEl, diceBtn, diceResultEl, scoreValEl;
let startScreen, cardScreen, endScreen;
let cardTitle, cardContent, quizOptions, cardFeedback, actionBtn;

function createBoard() {
    if (!boardEl) return;
    boardEl.innerHTML = '';
    boardData.forEach((tile, index) => {
        const tileEl = document.createElement('div');
        tileEl.classList.add('tile');
        if (tile.type === 'start') tileEl.classList.add('start-tile');
        if (tile.type === 'end') tileEl.classList.add('end-tile');
        
        tileEl.innerHTML = `<div>${index}. ${tile.title}</div>`;
        
        if (index === playerPosition) {
            const pawn = document.createElement('div');
            pawn.classList.add('player-pawn');
            tileEl.appendChild(pawn);
        }
        boardEl.appendChild(tileEl);
    });
}

function loadTileEvent() {
    const currentTile = boardData[playerPosition];
    cardScreen.classList.remove('hidden');
    quizOptions.classList.add('hidden');
    cardFeedback.classList.add('hidden');
    actionBtn.classList.add('hidden');
    
    document.querySelectorAll('.tile').forEach((t, idx) => {
        if(idx === playerPosition) t.classList.add('active-theme');
        else t.classList.remove('active-theme');
    });

    if (currentTile.type === 'start') {
        cardTitle.innerText = currentTile.title;
        cardContent.innerHTML = `<p>${currentTile.desc}</p>`;
        diceBtn.disabled = false;
    } 
    else if (currentTile.type === 'info') {
        diceBtn.disabled = true;
        cardTitle.innerText = currentTile.title;
        cardContent.innerHTML = `
            <span class="topic-tag">${currentTile.topic}</span>
            <p>${currentTile.desc}</p>
            <div class="scientific-source">${currentTile.source}</div>
            <p style="margin-top:1rem; color: #2e7d32;"><strong>+${currentTile.effect} ECO obtidos por leitura científica!</strong></p>
        `;
        score += currentTile.effect;
        scoreValEl.innerText = score;
        actionBtn.innerText = "Continuar Trilha";
        actionBtn.classList.remove('hidden');
    } 
    else if (currentTile.type === 'quiz') {
        diceBtn.disabled = true;
        cardTitle.innerText = currentTile.title;
        cardContent.innerHTML = `
            <span class="topic-tag">${currentTile.topic}</span>
            <p><strong>Desafio Técnico:</strong> ${currentTile.question}</p>
        `;
        
        quizOptions.innerHTML = '';
        quizOptions.classList.remove('hidden');
        
        currentTile.options.forEach((option, idx) => {
            const btn = document.createElement('button');
            btn.classList.add('option-btn');
            btn.innerText = option;
            btn.addEventListener('click', () => checkQuizAnswer(idx, currentTile));
            quizOptions.appendChild(btn);
        });
    } 
    else if (currentTile.type === 'end') {
        cardScreen.classList.add('hidden');
        endScreen.classList.remove('hidden');
        document.getElementById('final-score-text').innerText = `Sua pontuação final: ${score} ECO`;
        
        const badgeEl = document.getElementById('badge-result');
        if (score >= 180) {
            badgeEl.innerHTML = "🏅 <br><strong>Estrategista Ecológico Supremo</strong><br>Excelente aproveitamento dos conceitos científicos!";
            badgeEl.style.color = "#1b5e20";
        } else {
            badgeEl.innerHTML = "🌱 <br><strong>Cidadão Sustentável Promissor</strong><br>Ótimo esforço, tente jogar de novo para maximizar a sua pontuação.";
            badgeEl.style.color = "#8d6e63";
        }
    }
}

function checkQuizAnswer(selectedIdx, tile) {
    const buttons = quizOptions.querySelectorAll('.option-btn');
    buttons.forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === tile.answer) btn.classList.add('correct');
    });

    cardFeedback.classList.remove('hidden');
    actionBtn.classList.remove('hidden');
    actionBtn.innerText = "Avançar";

    if (selectedIdx === tile.answer) {
        score += tile.reward;
        cardFeedback.innerText = `Correto! 🎉 +${tile.reward} ECO. ${tile.explanation}`;
        cardFeedback.style.color = "#1b5e20";
        cardFeedback.style.background = "#e8f5e9";
    } else {
        buttons[selectedIdx].classList.add('wrong');
        score -= tile.penalty;
        cardFeedback.innerText = `Incorreto. ❌ -${tile.penalty} ECO. ${tile.explanation}`;
        cardFeedback.style.color = "#b71c1c";
        cardFeedback.style.background = "#ffebee";
    }
    scoreValEl.innerText = score;
}

// Inicialização segura amarrada ao ciclo do navegador
document.addEventListener("DOMContentLoaded", () => {
    boardEl = document.getElementById('board');
    diceBtn = document.getElementById('dice-btn');
    diceResultEl = document.getElementById('dice-result');
    scoreValEl = document.getElementById('score-val');
    startScreen = document.getElementById('start-screen');
    cardScreen = document.getElementById('card-screen');
    endScreen = document.getElementById('end-screen');
    cardTitle = document.getElementById('card-title');
    cardContent = document.getElementById('card-content');
    quizOptions = document.getElementById('quiz-options');
    cardFeedback = document.getElementById('card-feedback');
    actionBtn = document.getElementById('action-btn');

    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            startScreen.classList.add('hidden');
            cardScreen.classList.remove('hidden');
            diceBtn.disabled = false;
            loadTileEvent();
        });
    }

    if (diceBtn) {
        diceBtn.addEventListener('click', () => {
            const steps = Math.floor(Math.random() * 2) + 1;
            diceResultEl.innerText = `🎲 ${steps}`;
            playerPosition += steps;
            
            if (playerPosition >= boardData.length - 1) {
                playerPosition = boardData.length - 1;
                diceBtn.disabled = true;
            }
            createBoard();
            loadTileEvent();
        });
    }

    if (actionBtn) {
        actionBtn.addEventListener('click', () => {
            diceBtn.disabled = false;
            cardFeedback.classList.add('hidden');
            actionBtn.classList.add('hidden');
