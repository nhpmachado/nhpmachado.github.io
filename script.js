class Museu {
    constructor() {
        this.total = 101;
        this.pasta = 'cartoes_web';
        this.isPaused = false;
        this.cartoesIniciais = [];
        this.tracks = [];
        this.init();
    }

    async init() {
        this.tracks = [
            document.getElementById('track1'),
            document.getElementById('track2'),
            document.getElementById('track3')
        ];

        await this.carregarDados();
        this.render('todos');
        this.setupEventListeners();
    }

    async carregarDados() {
        try {
            const resposta = await fetch('database.json');
            const dadosJson = await resposta.json();
            this.cartoesIniciais = [];

            for (let i = 1; i <= this.total; i++) {
                const id = String(i).padStart(3, '0');
                const info = dadosJson[id];

                if (info) {
                    this.cartoesIniciais.push({
                        id: id,
                        nome: info.nome,
                        categoria: info.cat,
                        local: info.local,
                        rank: info.rank || 0
                    });
                }
            }
        } catch (erro) {
            console.error("Erro ao carregar o JSON:", erro);
        }
    }

    render(filtro) {
        const filtrados = this.cartoesIniciais.filter(c => filtro === 'todos' || c.categoria === filtro);
        const umTerco = Math.ceil(filtrados.length / 3);

        const f1 = filtrados.slice(0, umTerco);
        const f2 = filtrados.slice(umTerco, umTerco * 2);
        const f3 = filtrados.slice(umTerco * 2);

        this.fillTrack(this.tracks[0], f1, 4.0);
        this.fillTrack(this.tracks[1], f2, 3.2);
        this.fillTrack(this.tracks[2], f3, 3.6);
    }

    fillTrack(el, lista, ritmo) {
        if (!el) return;
        if (lista.length === 0) {
            el.innerHTML = "";
            return;
        }

        const content = lista.map(c => `
            <div class="card-item" onclick="museu.open('${c.id}', '${c.nome.replace(/'/g, "\\'")}', '${c.categoria}', '${c.local.replace(/'/g, "\\'")}', ${c.rank})">
                <img src="${this.pasta}/${c.id}.jpg" loading="lazy">
            </div>
        `).join('');

        el.innerHTML = content + content;

        const tempoTotal = lista.length * ritmo;
        el.style.setProperty('--speed', `${tempoTotal}s`);
    }

    setupEventListeners() {
        const btn = document.getElementById('pauseBtn');
        const modal = document.getElementById('card-modal');

        // Botão de Pausa
        if (btn) {
            btn.onclick = () => {
                this.isPaused = !this.isPaused;
                this.tracks.forEach(t => {
                    if (t) t.classList.toggle('paused', this.isPaused);
                });
                btn.innerHTML = this.isPaused ? "&#9654;" : "ll";
            };
        }

        // Filtros do Menu
        document.querySelectorAll('[data-filter]').forEach(link => {
            link.onclick = (e) => {
                e.preventDefault();
                this.render(link.dataset.filter);
            };
        });

        // 1. Fechar Modal: Botão X
        document.querySelector('.close-modal').onclick = () => {
            modal.classList.remove('active');
        };

        // 2. Fechar Modal: Clicar na área escura (fora da imagem/texto)
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        };

        // 3. Fechar Modal: Tecla ESC
        window.addEventListener('keydown', (e) => {
            if (e.key === "Escape" && modal.classList.contains('active')) {
                modal.classList.remove('active');
            }
        });
    }

    open(id, nome, cat, loc, rank) {
    const modalImg = document.getElementById('modal-img');

    // 1. Removemos a classe 'loaded' para que a imagem anterior não apareça "num piscar de olhos"
    modalImg.classList.remove('loaded');

    // 2. Definimos o novo SRC
    modalImg.src = `${this.pasta}/${id}.jpg`;

    // 3. Quando a imagem terminar de carregar, adicionamos o Fade In
    modalImg.onload = () => {
        modalImg.classList.add('loaded');
        img.loading = "lazy";
    };

    // Preenchimento dos textos (igual ao anterior)
    document.getElementById('modal-nome').innerText = nome;
    document.getElementById('modal-categoria').innerText = cat;
    document.getElementById('modal-localidade').innerText = loc;

    const cheio = "●";
    const vazio = "○";
    const classificacao = cheio.repeat(rank) + vazio.repeat(Math.max(0, 5 - rank));

    const rankElement = document.getElementById('modal-rank');
    rankElement.innerText = classificacao;
    rankElement.style.letterSpacing = "5px";

    document.getElementById('card-modal').classList.add('active');
    }
}


const museu = new Museu();
