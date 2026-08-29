// main.js (VERSÃO CORRIGIDA)
document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // =============================================================
    // PRELOADER (Visual apenas)
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
            // Esconde o preloader e mostra o site
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
    // INICIALIZAÇÃO DO SITE (Garante que os projetos apareçam)
    // =============================================================
    function initSite() {
        // --- Header Scroll ---
        const header = document.getElementById('header');
        if (header) {
            window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 50));
        }

        // --- Menu Mobile ---
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                hamburger.classList.toggle('active');
            });
            navMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                });
            });
        }

        // --- Renderizar TECNOLOGIAS ---
        const techData = [
            { name: 'HTML5', icon: 'fab fa-html5', desc: 'Estrutura' },
            { name: 'CSS3', icon: 'fab fa-css3-alt', desc: 'Estilização' },
            { name: 'JavaScript', icon: 'fab fa-js', desc: 'Interatividade' },
            { name: 'React', icon: 'fab fa-react', desc: 'UI Components' },
            { name: 'Node.js', icon: 'fab fa-node-js', desc: 'Backend' },
            { name: 'Python', icon: 'fab fa-python', desc: 'Scripts' },
            { name: 'Git', icon: 'fab fa-git-alt', desc: 'Controle de versão' },
            { name: 'GitHub', icon: 'fab fa-github', desc: 'Repositórios' },
            { name: 'Bootstrap', icon: 'fab fa-bootstrap', desc: 'Framework' }
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

        // --- RENDERIZAR PROJETOS (AQUI ESTÁ A CORREÇÃO PRINCIPAL) ---
        const projetosGrid = document.getElementById('projetosGrid');
        const destaqueContainer = document.getElementById('projetoDestaque');
        const filtros = document.getElementById('filtros');
        const buscaInput = document.getElementById('buscaInput');

        let currentFilter = 'todos';
        let currentSearch = '';

        // Garante que projectsData exista (mesmo que o arquivo falhe)
        const allProjects = (typeof projectsData !== 'undefined' && projectsData.length > 0) ? projectsData : [];
        
        function renderDestaque() {
            if (!destaqueContainer) return;
            if (allProjects.length === 0) {
                destaqueContainer.innerHTML = '<p style="color:var(--text-secondary)">Nenhum projeto em destaque.</p>';
                return;
            }
            const proj = allProjects[destaqueIndex] || allProjects[0];
            destaqueContainer.innerHTML = `
                <div class="destaque-image" style="background-image: url('${proj.image}');"></div>
                <div class="destaque-info">
                    <div class="destaque-badge">★ PROJETO EM DESTAQUE</div>
                    <h3>${proj.title}</h3>
                    <p>${proj.description}</p>
                    <div class="destaque-tech">${proj.technologies.map(t => `<span>${t}</span>`).join('')}</div>
                    <a href="${proj.url}" target="_blank" class="btn btn-primary">VISUALIZAR PROJETO →</a>
                </div>
            `;
        }

        function renderProjects(filter, search) {
            if (!projetosGrid) return;
            
            const filtered = allProjects.filter(p => {
                const matchCat = filter === 'todos' || p.category === filter;
                const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                                    p.description.toLowerCase().includes(search.toLowerCase());
                return matchCat && matchSearch;
            });

            if (filtered.length === 0) {
                projetosGrid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--text-secondary)">Nenhum projeto encontrado.</p>';
                return;
            }

            projetosGrid.innerHTML = filtered.map((proj, i) => `
                <div class="projeto-card" style="transition-delay:${i * 0.05}s">
                    <div class="projeto-card-image" style="background-image:url('${proj.image}');">
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
        }

        // Inicializa
        renderDestaque();
        renderProjects('todos', '');

        // Eventos
        if (filtros) {
            filtros.querySelectorAll('.filtro-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    filtros.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    currentFilter = btn.dataset.filter;
                    renderProjects(currentFilter, currentSearch);
                });
            });
        }

        if (buscaInput) {
            buscaInput.addEventListener('input', (e) => {
                currentSearch = e.target.value.trim();
                renderProjects(currentFilter, currentSearch);
            });
        }
    }

    // Chama a inicialização assim que o DOM carrega (sem esperar o preloader)
    initSite();

    // Se quiser que os projetos apareçam apenas após o preloader, mantenha a chamada dentro do setTimeout
    // Mas para garantir que apareça, chamamos imediatamente acima.
});