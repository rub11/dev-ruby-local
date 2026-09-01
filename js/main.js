// main.js — VERSÃO SEM CARROSSEL + FILTROS POR GÊNERO
document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    // =============================================================
    // PRELOADER
    // =============================================================
    const preloader = document.getElementById('preloader');
    const mainContent = document.getElementById('main-content');
    const percentText = document.getElementById('preloaderPercent');
    const progressBar = document.getElementById('preloaderBar');

    let progress = 0;
    let isComplete = false;
    const stepTime = 40;

    function updateProgress() {
        if (isComplete) return;
        const inc = Math.floor(Math.random() * 3) + 1;
        progress = Math.min(progress + inc, 100);

        if (percentText) percentText.textContent = progress + '%';
        if (progressBar) progressBar.style.width = progress + '%';

        if (progress >= 100) {
            isComplete = true;
            if (preloader) preloader.classList.add('hide');
            if (mainContent) {
                mainContent.style.display = 'block';
                mainContent.classList.add('visible');
            }
        } else {
            setTimeout(updateProgress, stepTime);
        }
    }
    setTimeout(updateProgress, 300);

    // =============================================================
    // DADOS DOS PROJETOS (vindo do projects.js)
    // =============================================================
    const allProjects = (typeof projectsData !== 'undefined' && projectsData.length > 0) ? projectsData : [];

    // =============================================================
    // MODAL DE VISUALIZAÇÃO DOS PROJETOS
    // =============================================================

    const modalOverlay = document.getElementById('modalOverlay');
    const modalContent = document.getElementById('modalContent');
    const modalClose = document.getElementById('modalClose');
    let currentModalIndex = 0;

    function openModal(index) {
        if (!allProjects.length) return;
        if (index < 0) index = allProjects.length - 1;
        if (index >= allProjects.length) index = 0;
        currentModalIndex = index;

        const proj = allProjects[index];
        const total = allProjects.length;

        modalContent.innerHTML = `
    <div class="modal-preview">
        <img src="${proj.image}" alt="${proj.title}" loading="lazy">
    </div>
    <div class="modal-info">
        <div class="modal-badge">★ PROJETO ${index + 1} de ${total}</div>
        <h2>${proj.title}</h2>
        <div class="modal-category">${proj.category.toUpperCase()}</div>
        <p class="modal-desc">${proj.description}</p>
        <div class="modal-tech">${proj.technologies.map(t => `<span>${t}</span>`).join('')}</div>
        <div class="modal-status"><span class="${proj.status}">● ${proj.status.toUpperCase()}</span></div>
        <div class="modal-actions">
            <a href="${proj.url}" target="_blank" class="btn btn-primary">VISUALIZAR PROJETO →</a>
        </div>
    </div>
    <div class="modal-nav">
    <button class="prev-btn" id="modalPrev" aria-label="Projeto anterior">
        <i class="fas fa-chevron-left"></i>
    </button>
    <button class="next-btn" id="modalNext" aria-label="Próximo projeto">
        <i class="fas fa-chevron-right"></i>
    </button>
</div>
`;

        document.getElementById('modalPrev')?.addEventListener('click', function (e) {
            e.stopPropagation();
            openModal(currentModalIndex - 1);
        });
        document.getElementById('modalNext')?.addEventListener('click', function (e) {
            e.stopPropagation();
            openModal(currentModalIndex + 1);
        });

        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    modalClose?.addEventListener('click', closeModal);
    modalOverlay?.addEventListener('click', function (e) {
        if (e.target === modalOverlay) closeModal();
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) closeModal();
    });

    // =============================================================
    // RENDERIZAR TECNOLOGIAS (EXPANDIDA)
    // =============================================================
    function renderTech() {
        const techData = [
            // Front-end
            { name: 'HTML5', icon: 'fab fa-html5', desc: 'Estrutura' },
            { name: 'CSS3', icon: 'fab fa-css3-alt', desc: 'Estilização' },
            { name: 'JavaScript', icon: 'fab fa-js', desc: 'Interatividade' },
            { name: 'TypeScript', icon: 'fab fa-js', desc: 'Tipagem estática' },
            { name: 'React', icon: 'fab fa-react', desc: 'UI Components' },
            { name: 'Next.js', icon: 'fab fa-react', desc: 'Framework React' },
            { name: 'Tailwind CSS', icon: 'fab fa-css3-alt', desc: 'CSS utilitário' },
            { name: 'Bootstrap', icon: 'fab fa-bootstrap', desc: 'Framework CSS' },
            // Back-end
            { name: 'Node.js', icon: 'fab fa-node-js', desc: 'Backend JS' },
            { name: 'Python', icon: 'fab fa-python', desc: 'Scripts & Backend' },
            { name: 'Django', icon: 'fab fa-python', desc: 'Framework Python' },
            // Bancos de dados
            { name: 'MySQL', icon: 'fas fa-database', desc: 'SQL relacional' },
            { name: 'PostgreSQL', icon: 'fas fa-database', desc: 'SQL avançado' },
            { name: 'MongoDB', icon: 'fas fa-database', desc: 'NoSQL documental' },
            { name: 'Firebase', icon: 'fas fa-fire', desc: 'Backend as a Service' },
            // Ferramentas
            { name: 'Git', icon: 'fab fa-git-alt', desc: 'Controle de versão' },
            { name: 'GitHub', icon: 'fab fa-github', desc: 'Repositórios' },
            { name: 'Docker', icon: 'fab fa-docker', desc: 'Containerização' },
            { name: 'Figma', icon: 'fab fa-figma', desc: 'Design UI/UX' }
        ];

        const techGrid = document.getElementById('techGrid');
        if (techGrid) {
            techGrid.innerHTML = techData.map(tech => `
                <div class="tech-card">
                    <i class="${tech.icon}"></i>
                    <h4>${tech.name}</h4>
                    <p>${tech.desc}</p>
                </div>
            `).join('');
        }
    }

    // =============================================================
    // RENDERIZAR GRADE DE PROJETOS (com filtros: categoria + gênero + busca)
    // =============================================================
    let currentFilter = 'todos';      // categoria (website, landing, etc)
    let currentGenero = 'todos';      // gênero (adegas, seguros, saude, etc)
    let currentSearch = '';

    function renderProjects() {
        const projetosGrid = document.getElementById('projetosGrid');
        if (!projetosGrid) return;

        const filtered = allProjects.filter(p => {
            const matchCat = currentFilter === 'todos' || p.category === currentFilter;
            const matchGenero = currentGenero === 'todos' || p.genero === currentGenero;
            const matchSearch = p.title.toLowerCase().includes(currentSearch.toLowerCase()) ||
                p.description.toLowerCase().includes(currentSearch.toLowerCase());
            return matchCat && matchGenero && matchSearch;
        });

        if (filtered.length === 0) {
            projetosGrid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--text-secondary)">Nenhum projeto encontrado.</p>';
            return;
        }

        projetosGrid.innerHTML = filtered.map((proj, i) => `
            <div class="projeto-card" data-index="${allProjects.indexOf(proj)}" style="transition-delay:${i * 0.05}s">
                <div class="projeto-card-image" style="background-image:url('${proj.image}'); background-color:#1a1a1a;">
                    <span class="status-badge ${proj.status}">${proj.status === 'online' ? '● ONLINE' : '● EM DEV'}</span>
                </div>
                <div class="projeto-card-body">
                    <h4>${proj.title}</h4>
                    <div class="category">${proj.category.toUpperCase()}</div>
                    <p>${proj.description}</p>
                    <div class="tech-tags">${proj.technologies.map(t => `<span>${t}</span>`).join('')}</div>
                    <div class="card-links">
                        <a href="${proj.url}" target="_blank">ACESSAR <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
            </div>
        `).join('');

        // Adiciona evento de clique nos cards para abrir o modal
        document.querySelectorAll('.projeto-card').forEach(card => {
            card.addEventListener('click', function (e) {
                if (e.target.closest('a')) return;
                const index = parseInt(this.dataset.index);
                if (!isNaN(index)) openModal(index);
            });
        });
    }

    // Função para atualizar filtros e re-renderizar
    function updateFilters() {
        renderProjects();
    }

    // =============================================================
    // INICIALIZAÇÃO DO SITE
    // =============================================================
    function initSite() {
        // --- Header Scroll ---
        const header = document.getElementById('header');
        if (header) {
            window.addEventListener('scroll', function () {
                header.classList.toggle('scrolled', window.scrollY > 50);
            });
        }

        // --- Menu Mobile ---
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', function () {
                navMenu.classList.toggle('active');
                hamburger.classList.toggle('active');
            });
            navMenu.querySelectorAll('a').forEach(function (link) {
                link.addEventListener('click', function () {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                });
            });
        }

        // --- Renderizar Tecnologias ---
        renderTech();

        // --- Renderizar Grade inicial ---
        renderProjects();

        // --- Renderizar filtros por gênero (usando o módulo externo) ---
        if (typeof renderFiltrosGenero === 'function') {
            renderFiltrosGenero('filtrosGenero', allProjects, function (genero) {
                currentGenero = genero;
                updateFilters();
            });
        } else {
            console.warn('Função renderFiltrosGenero não encontrada. Verifique se filtros-genero.js está carregado.');
        }

        // --- Eventos de Filtro (categoria) ---
        const filtros = document.getElementById('filtros');
        if (filtros) {
            filtros.querySelectorAll('.filtro-btn').forEach(function (btn) {
                btn.addEventListener('click', function () {
                    filtros.querySelectorAll('.filtro-btn').forEach(function (b) {
                        b.classList.remove('active');
                    });
                    this.classList.add('active');
                    currentFilter = this.dataset.filter;
                    updateFilters();
                });
            });
        }

        // --- Eventos de Busca ---
        const buscaInput = document.getElementById('buscaInput');
        if (buscaInput) {
            buscaInput.addEventListener('input', function (e) {
                currentSearch = e.target.value.trim();
                updateFilters();
            });
        }
    }

    // Inicia o site
    initSite();
});