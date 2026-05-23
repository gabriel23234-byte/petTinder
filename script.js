let bancoDePets = [
    { 
        id: 101, 
        nome: "Thor", 
        idade: 3, 
        especie: "Cachorro", 
        raca: "Pastor Alemão Mix", 
        porte: "Grande", 
        localizacao: "ONG Centro", 
        vacinado: true,
        racaoRecomendada: "Ração Premium Especial para Cães de Porte Grande (Fórmula Alta Energia / Proteína Ativa)",
        saude: "Vacinado Antirrábica e V10, Vermifugado recentemente", 
        energia: "Alta", 
        socializacao: "Sociável com cães, arredio com gatos", 
        bio: "Resgatado próximo à Orla de Santarém. Muito protetor, excelente resposta a comandos básicos e ama nadar.", 
        foto: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400" 
    },
    { 
        id: 102, 
        nome: "Natasha", 
        idade: 2, 
        especie: "Gato", 
        raca: "Siamês", 
        porte: "Pequeno", 
        localizacao: "ONG Alter do Chão", 
        vacinado: true,
        racaoRecomendada: "Ração Super Premium para Gatos Castrados (Controle de Peso e Trato Urinário)",
        saude: "Castrada, Testada FIV/FELV Negativo", 
        energia: "Baixa", 
        socializacao: "Extremamente dócil com humanos e outros felinos", 
        bio: "Encontrada na região de mata em Alter. Muito carinhosa, dócil com crianças e prefere ambientes silenciosos.", 
        foto: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400" 
    },
    { 
        id: 103, 
        nome: "Pipoca", 
        idade: 1, 
        especie: "Cachorro", 
        raca: "Vira-Lata (SRD)", 
        porte: "Médio", 
        localizacao: "ONG Diamantino", 
        vacinado: false,
        racaoRecomendada: "Ração para Filhotes e Cães Jovens até 12 meses (Rica em Cálcio e Vitaminas)",
        saude: "Primeira dose da V10 aplicada, ciclo de vacinas incompleto. Castração agendada.", 
        energia: "Alta", 
        socializacao: "Excelente com crianças e outros animais", 
        bio: "Resgatada de um terreno baldio no Diamantino. Brincalhona, cheia de vida e excelente para casas com quintal.", 
        foto: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400" 
    },
    { 
        id: 104, 
        nome: "Barão", 
        idade: 4, 
        especie: "Cachorro", 
        raca: "Pitbull Mix", 
        porte: "Grande", 
        localizacao: "ONG Prainha", 
        vacinado: true,
        racaoRecomendada: "Ração Linha Cardápio Sensível ou Hipoalergênica (Ideal para reforço de pele e pelagem)",
        saude: "Tratamento de Leishmaniose Negativado/Controlado, Vacinado completo.", 
        energia: "Moderada", 
        socializacao: "Amigável, prefere ser o único cão da casa", 
        bio: "Resgatado na Prainha. Um gigante gentil que adora dormir na sombra e passear no fim da tarde.", 
        foto: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400" 
    }
];

const ongsSantarem = [
    { nome: "ONG Centro - Resgate Urbano", lat: -2.417242, lng: -54.711832, local: "Av. Tapajós, Centro (Próximo à Orla)" },
    { nome: "ONG Alter do Chão - Protetores da Vila", lat: -2.484210, lng: -54.896750, local: "Rodovia Fernando Guilhon, KM 18 (Acesso a Alter)" },
    { nome: "ONG Diamantino - Abrigo Patas Amigas", lat: -2.449635, lng: -54.718420, local: "Av. Moaçara, Bairro Diamantino" },
    { nome: "ONG Prainha - Lar de Passagem", lat: -2.427310, lng: -54.693150, local: "Av. Marechal Rondon, Bairro Prainha" }
];

let filtrados = [...bancoDePets];
let logsDeAuditoria = {};
let usuarioAtivo = null;
let indexAtual = 0;
let mapaInstanciado = null;

// Alternador de Tema Escuro e Branco
function alternarTemaGlobal() {
    const body = document.body;
    if (body.getAttribute('data-theme') === 'dark') {
        body.setAttribute('data-theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
    }
    if (mapaInstanciado) {
        setTimeout(() => { mapaInstanciado.invalidateSize(); }, 100);
    }
}

// Controle de Abas
function alternarFormularioAutenticacao(modo) {
    document.getElementById('tabLogin').classList.remove('active');
    document.getElementById('tabCadastro').classList.remove('active');
    document.getElementById('formLogin').classList.remove('active');
    document.getElementById('formCadastro').classList.remove('active');

    if (modo === 'login') {
        document.getElementById('tabLogin').classList.add('active');
        document.getElementById('formLogin').classList.add('active');
    } else {
        document.getElementById('tabCadastro').classList.add('active');
        document.getElementById('formCadastro').classList.add('active');
    }
}

// Transição de Telas
function navegarComTransicao(destinoId) {
    const loader = document.getElementById('cinemaLoader');
    const ativa = document.querySelector('.screen.active');
    const alvo = document.getElementById(destinoId);
    
    if(ativa && ativa.id === destinoId) return;

    loader.classList.add('show');

    setTimeout(() => {
        if(ativa) ativa.classList.remove('active');
        alvo.classList.add('active');

        if(destinoId === 'feedScreen') renderizarCardDoPet();
        if(destinoId === 'scheduleScreen') montarSeletorMúltiploEQuiz();
        if(destinoId === 'matchesScreen') montarListaMatchesTutor();
        if(destinoId === 'ongsScreen') carregarEstruturaGeografica();
        if(destinoId === 'profileScreen') carregarLogsDeAuditoriaDoUsuario();

        document.querySelectorAll('.nav-icon-btn').forEach(b => b.classList.remove('active'));
        const mapeamentoBotoes = {
            'feedScreen': 'navFeed', 'matchesScreen': 'navMatches', 'scheduleScreen': 'navAgenda',
            'ongsScreen': 'navMap', 'profileScreen': 'navProfile'
        };
        if(mapeamentoBotoes[destinoId]) document.getElementById(mapeamentoBotoes[destinoId]).classList.add('active');

        loader.classList.remove('show');
    }, 180); 
}

// Autenticação
function autenticarTutor(fluxo) {
    let email, nome;
    if (fluxo === 'login') {
        email = document.getElementById('tutorEmail').value;
        nome = "Adotante Responsável";
    } else {
        email = document.getElementById('cadEmail').value;
        nome = document.getElementById('cadNome').value.trim() || "Novo Adotante";
        if (!email || !nome) { alert("Por favor, preencha todos os campos para o cadastro."); return; }
    }

    usuarioAtivo = { nome: nome, email: email, matches: [] };
    if(!logsDeAuditoria[email]) logsDeAuditoria[email] = [];
    
    if (fluxo === 'login') {
        registrarLog(email, "Login efetuado com sucesso na rede PetTinder Santarém.");
    } else {
        registrarLog(email, `Perfil criado com sucesso sob o nome institucional de [${nome}].`);
    }
    
    document.getElementById('appNavbar').style.display = "flex";
    limparFiltrosDeBusca();
    navegarComTransicao('feedScreen');
}

function sairDoSistema() {
    registrarLog(usuarioAtivo.email, "Sessão encerrada voluntariamente.");
    usuarioAtivo = null;
    document.getElementById('appNavbar').style.display = "none";
    alternarFormularioAutenticacao('login');
    navegarComTransicao('loginScreen');
}

function registrarLog(email, textoAcao) {
    const dataStr = new Date().toLocaleString('pt-BR');
    if(!logsDeAuditoria[email]) logsDeAuditoria[email] = [];
    logsDeAuditoria[email].unshift({ time: dataStr, acao: textoAcao });
}

// Renderizar Card Principal do Feed
function renderizarCardDoPet() {
    const card = document.getElementById('petCard');
    if (filtrados.length === 0) {
        card.style.backgroundImage = "none";
        document.getElementById('petNomeIdade').innerText = "Nenhum animal nesta busca";
        document.getElementById('petTagsContainer').innerHTML = "";
        document.getElementById('petTechBox').innerHTML = "Modifique a localização ou filtros de porte.";
        document.querySelector('.btn-more-details').style.display = "none";
        return;
    }
    document.querySelector('.btn-more-details').style.display = "block";
    const pet = filtrados[indexAtual];
    card.style.backgroundImage = `url('${pet.foto}')`;
    document.getElementById('petNomeIdade').innerText = `${pet.nome}, ${pet.idade} ${pet.idade == 1 ? 'ano' : 'anos'}`;
    
    // Define a pílula de vacinação rápida com base no booleano
    const vacinaTag = pet.vacinado ? 
        `<span class="tag-pill vac-sim">💉 Vacinado</span>` : 
        `<span class="tag-pill vac-nao">⚠️ Não Vacinado</span>`;

    document.getElementById('petTagsContainer').innerHTML = `
        <span class="tag-pill">${pet.especie}</span>
        <span class="tag-pill">🧬 ${pet.raca}</span>
        <span class="tag-pill">⚖️ Porte ${pet.porte}</span>
        <span class="tag-pill loc-pill">🏢 ${pet.localizacao}</span>
        ${vacinaTag}
    `;

    document.getElementById('petTechBox').innerHTML = `
        <div class="tech-line"><strong>Alimentação:</strong> ${pet.racaoRecomendada}.</div>
        <div class="tech-line" style="margin-top:2px;"><strong>Comportamento:</strong> Energia ${pet.energia}.</div>
    `;
}

// MODAL DE DETALHES GESTÃO E REDIRECIONAMENTO AUTOMÁTICO
function abrirModalDetalhes() {
    if (filtrados.length === 0) return;
    const pet = filtrados[indexAtual];
    
    document.getElementById('modalPetNome').innerText = pet.nome;
    document.getElementById('modalPetFoto').src = pet.foto;
    document.getElementById('modalPetFicha').innerText = `Espécie: ${pet.especie} | Raça: ${pet.raca} | Porte: ${pet.porte} | Idade: ${pet.idade} ano(s).`;
    document.getElementById('modalPetVacinaStatus').innerText = pet.vacinado ? "✅ Sim, o pet possui a carteira de vacinação principal atualizada." : "❌ Não totalmente vacinado. O plano vacinal precisa ser continuado ou iniciado pelo novo tutor.";
    document.getElementById('modalPetRacao').innerText = pet.racaoRecomendada;
    document.getElementById('modalPetBio').innerText = pet.bio;
    document.getElementById('modalPetSaude').innerText = pet.saude;

    document.getElementById('modalBtnAdotar').onclick = function() {
        fluxoDiretoAdocao(pet);
    };

    document.getElementById('petDetailsModal').classList.add('active');
}

function fecharModalDetalhes() {
    document.getElementById('petDetailsModal').classList.remove('active');
}

function fluxoDiretoAdocao(pet) {
    if(!usuarioAtivo.matches.some(m => m.id === pet.id)) {
        usuarioAtivo.matches.push(pet);
        registrarLog(usuarioAtivo.email, `Demonstrou interesse direto via ficha técnica no pet ${pet.nome} (ID: ${pet.id}).`);
    }
    
    fecharModalDetalhes();
    navegarComTransicao('scheduleScreen');

    setTimeout(() => {
        const checkboxes = document.querySelectorAll('input[name="selectedPets"]');
        checkboxes.forEach(cb => {
            if(parseInt(cb.getAttribute('data-id')) === pet.id) {
                cb.checked = true;
            }
        });
    }, 250);
}

function filtrarCatalogoDePets() {
    const raca = document.getElementById('filterRaca').value.toLowerCase();
    const idade = document.getElementById('filterIdade').value;
    const porte = document.getElementById('filterPorte').value;
    const local = document.getElementById('filterLocalizacao').value;

    filtrados = bancoDePets.filter(p => {
        const matchRaca = p.raca.toLowerCase().includes(raca);
        const matchIdade = !idade || p.idade <= parseInt(idade);
        const matchPorte = !porte || p.porte === porte;
        const matchLocal = !local || p.localizacao === local;
        return matchRaca && matchIdade && matchPorte && matchLocal;
    });
    indexAtual = 0;
    renderizarCardDoPet();
}

function limparFiltrosDeBusca() {
    document.getElementById('filterRaca').value = "";
    document.getElementById('filterIdade').value = "";
    document.getElementById('filterPorte').value = "";
    document.getElementById('filterLocalizacao').value = "";
    filtrados = [...bancoDePets];
    indexAtual = 0;
    renderizarCardDoPet();
}

function rotacionarPetNoFeed() {
    if(filtrados.length === 0) return;
    indexAtual = (indexAtual + 1) % filtrados.length;
    renderizarCardDoPet();
}

function vincularMatchDoTutor() {
    if(filtrados.length === 0) return;
    const pet = filtrados[indexAtual];
    if(!usuarioAtivo.matches.some(m => m.id === pet.id)) {
        usuarioAtivo.matches.push(pet);
        registrarLog(usuarioAtivo.email, `Demonstrou interesse (Match) no pet ${pet.nome} (ID: ${pet.id}).`);
    }
    alert(`❤️ Você deu um Match em ${pet.nome}! Ele foi adicionado à sua lista.`);
    rotacionarPetNoFeed();
}

function montarSeletorMúltiploEQuiz() {
    const container = document.getElementById('agendaMultiPetContainer');
    container.innerHTML = "";
    
    if(usuarioAtivo.matches.length === 0) {
        container.innerHTML = "<p style='color:#666; font-size:0.75rem; text-align:center; padding:10px;'>Dê Match ou clique em Adotar na descrição do pet primeiro.</p>";
        return;
    }

    usuarioAtivo.matches.forEach(pet => {
        container.innerHTML += `
            <label class="checkbox-item">
                <input type="checkbox" name="selectedPets" value="${pet.nome}" data-id="${pet.id}">
                <span>${pet.nome} (${pet.raca} • ${pet.localizacao})</span>
            </label>
        `;
    });
}

function processarAgendamentoDoTutor() {
    const checkboxes = document.querySelectorAll('input[name="selectedPets"]:checked');
    const data = document.getElementById('agendaData').value;
    const hora = document.getElementById('agendaHorario').value;
    
    const quizCasa = document.getElementById('quizCasa').value;
    const quizOutrosPets = document.getElementById('quizOutrosPets').value;
    const quizTempo = document.getElementById('quizTempo').value;

    if(checkboxes.length === 0) { alert("Por favor, selecione pelo menos um Pet para adoção."); return; }
    if(!data) { alert("Insira uma data válida para a visita."); return; }

    let nomesPets = [];
    checkboxes.forEach(cb => nomesPets.push(cb.value));

    const ticketId = "TK-" + Math.floor(1000 + Math.random() * 9000);
    
    registrarLog(usuarioAtivo.email, `Protocolou o agendamento ${ticketId} para os pets: [${nomesPets.join(', ')}]. Visita em: ${data} às ${hora}h.`);
    registrarLog(usuarioAtivo.email, `Respondido Questionário de Triagem: Vive em [${quizCasa}] | Outros Animais: [${quizOutrosPets}] | Disponibilidade: [${quizTempo}].`);

    alert(`🎉 Solicitação Coletiva enviada com sucesso!\nTicket: ${ticketId}\nPets vinculados: ${nomesPets.join(', ')}`);
    navegarComTransicao('profileScreen');
}

function montarListaMatchesTutor() {
    const container = document.getElementById('listaMatchesContainer');
    container.innerHTML = "";
    
    if(usuarioAtivo.matches.length === 0) {
        container.innerHTML = "<p style='color:#666; text-align:center; margin-top:20px;'>Nenhum pet favoritado até o momento.</p>";
        return;
    }
    usuarioAtivo.matches.forEach(m => {
        container.innerHTML += `
            <div style="display:flex; align-items:center; gap:12px; background:rgba(255,255,255,0.02); padding:10px; border-radius:12px; margin-bottom:8px; border:1px solid var(--border-color);">
                <img src="${m.foto}" style="width:50px; height:50px; border-radius:50%; object-fit:cover;">
                <div>
                    <strong style="color:var(--text-main);">${m.nome}</strong><br>
                    <span style="font-size:0.7rem; color:var(--text-muted);">Unidade: ${m.localizacao} • ${m.raca}</span>
                </div>
            </div>
        `;
    });
}

function carregarEstruturaGeografica() {
    const containerList = document.getElementById('ongsListContainer');
    containerList.innerHTML = "";

    if (!mapaInstanciado) {
        mapaInstanciado = L.map('map').setView([-2.4330, -54.7150], 12);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(mapaInstanciado);
        
        ongsSantarem.forEach(ong => {
            L.marker([ong.lat, ong.lng]).addTo(mapaInstanciado).bindPopup(`<b>${ong.nome}</b><br>${ong.local}`);
        });
    } else { 
        setTimeout(() => { mapaInstanciado.invalidateSize(); }, 100); 
    }

    ongsSantarem.forEach(ong => {
        containerList.innerHTML += `
            <div class="ong-list-item">
                <div style="font-weight:bold; color:#248eff;">📍 ${ong.nome}</div>
                <div style="font-size:0.72rem; color:var(--text-muted); margin-top:2px;">${ong.local}</div>
            </div>
        `;
    });
}

function carregarLogsDeAuditoriaDoUsuario() {
    document.getElementById('perfilNomeTutor').innerText = usuarioAtivo.nome;
    document.getElementById('perfilEmailTutor').innerText = `${usuarioAtivo.email} • Perfil Verificado`;
    
    const container = document.getElementById('auditoriaContainer');
    container.innerHTML = "";

    const meusLogs = logsDeAuditoria[usuarioAtivo.email] || [];
    if(meusLogs.length === 0) {
        container.innerHTML = "<p style='color:#6b7280; font-size:0.75rem;'>Nenhuma atividade registrada.</p>";
        return;
    }

    meusLogs.forEach(log => {
        container.innerHTML += `
            <div class="audit-trail-card">
                <div class="audit-timestamp">🕒 ${log.time}</div>
                <div style="color:var(--text-main);">${log.acao}</div>
            </div>
        `;
    });
}