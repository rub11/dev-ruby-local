// =============================================================
// MAIN — FOX RUBY DIGITAL LAB (COM PRELOADER AVANÇADO)
// =============================================================
document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // =============================================================
    // PRELOADER — LÓGICA COMPLETA
    // =============================================================

    // Elementos
    const preloader = document.getElementById('preloader');
    const canvas = document.getElementById('preloaderCanvas');
    const terminal = document.getElementById('preloaderTerminal');
    const statusText = document.getElementById('preloaderStatus');
    const percentText = document.getElementById('preloaderPercent');
    const progressBar = document.getElementById('preloaderBar');
    const hudStatus = document.getElementById('hudStatus');
    const readyMessage = document.getElementById('preloaderReady');
    const mainContent = document.getElementById('main-content');

    // Mensagens de status
    const statusMessages = [
        'Inicializando Fox Ruby Digital Core...',
        'Verificando ambiente digital...',
        'Conectando ao servidor...',
        'Estabelecendo conexão segura...',
        'Buscando projetos desenvolvidos...',
        'Localizando websites...',
        'Carregando sistemas...',
        'Sincronizando dashboards...',
        'Indexando projetos digitais...',
        'Carregando stack tecnológica...',
        'Verificando módulos HTML...',
        'Verificando módulos CSS...',
        'Inicializando JavaScript Engine...',
        'Carregando interface digital...',
        'Sincronizando Project Database...',
        'Organizando projetos...',
        'Preparando experiência do usuário...',
        'Otimizando interface...',
        'Todos os sistemas operacionais.',
        'FOX RUBY DIGITAL LAB READY.'
    ];

    // Logs com prefixos
    const logEntries = [
        { text: 'DIGITAL CORE INITIALIZED', prefix: 'OK' },
        { text: 'PROJECT DATABASE CONNECTED', prefix: 'OK' },
        { text: 'WEBSITES INDEXED', prefix: 'OK' },
        { text: 'SYSTEMS LOADED', prefix: 'OK' },
        { text: 'INTERFACE READY', prefix: 'READY' },
        { text: 'SECURE CONNECTION ESTABLISHED', prefix: 'SYNC' },
        { text: 'ASSETS CACHED', prefix: 'LOAD' },
        { text: 'USER EXPERIENCE OPTIMIZED', prefix: 'OK' },
        { text: 'FOX RUBY DIGITAL LAB ONLINE', prefix: 'READY' }
    ];

    // Estado
    let progress = 0;
    let msgIndex = 0;
    let logIndex = 0;
    let isComplete = false;
    let stepTime = 60; // ms por incremento

    // ---------- PARTÍCULAS ----------
    function initParticles() {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let w, h;
        const particles = [];
        const count = 80;

        function resize() {
            const rect = canvas.parentElement.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
            w = canvas.width;
            h = canvas.height;
        }

        function createParticles() {
            particles.length = 0;
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    r: Math.random() * 1.2 + 0.3,
                    vx: (Math.random() - 0.5) * 0.15,
                    vy: (Math.random() - 0.5) * 0.15,
                    o: Math.random() * 0.4 + 0.1,
                    isRed: Math.random() < 0.08
                });
            }
        }

        function draw() {
            ctx.clearRect(0, 0, w, h);
            particles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = p.isRed ? `rgba(255,51,51,${p.o * 0.8})` : `rgba(255,255,255,${p.o})`;
                ctx.fill();
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > w) p.vx *= -1;
                if (p.y < 0 || p.y > h) p.vy *= -1;
            });
            requestAnimationFrame(draw);
        }

        resize();
        createParticles();
        draw();

        window.addEventListener('resize', () => {
            resize();
            createParticles();
        });
    }

    initParticles();

    // ---------- TERMINAL ----------
    function addLog(text, prefix = 'OK') {
        if (!terminal) return;
        const line = document.createElement('div');
        line.className = 'log-line';
        const prefixMap = {
            'OK': 'ok',
            'SYNC': 'sync',
            'LOAD': 'load',
            'READY': 'ready'
        };
        const cls = prefixMap[prefix] || 'ok';
        line.innerHTML = `<span class="${cls}">[${prefix}]</span> ${text}`;
        terminal.appendChild(line);
        terminal.scrollTop = terminal.scrollHeight;
    }

    // Adiciona logs iniciais (alguns já aparecem)
    setTimeout(() => addLog('DIGITAL CORE INITIALIZED', 'OK'), 300);
    setTimeout(() => addLog('PROJECT DATABASE CONNECTED', 'OK'), 800);

    // ---------- PROGRESSO ----------
    function updateProgress() {
        if (isComplete) return;

        // Incremento aleatório entre 1 e 3
        const inc = Math.floor(Math.random() * 3) + 1;
        progress = Math.min(progress + inc, 100);

        // Atualizar UI
        percentText.textContent = String(progress).padStart(2, '0') + '%';
        progressBar.style.width = progress + '%';

        // Atualizar status principal (a cada ~5%)
        const newMsgIndex = Math.floor(progress / 5);
        if (newMsgIndex < statusMessages.length && newMsgIndex > msgIndex) {
            msgIndex = newMsgIndex;
            statusText.textContent = statusMessages[msgIndex];
        }

        // Atualizar HUD
        if (progress < 30) hudStatus.textContent = 'INITIALIZING...';
        else if (progress < 70) hudStatus.textContent = 'LOADING ASSETS...';
        else if (progress < 95) hudStatus.textContent = 'SYNCHRONIZING...';
        else hudStatus.textContent = 'FINALIZING...';

        // Adicionar logs em momentos estratégicos
        if (progress >= 15 && logIndex === 0) { addLog('WEBSITES INDEXED', 'OK'); logIndex++; }
        if (progress >= 30 && logIndex === 1) { addLog('SYSTEMS LOADED', 'OK'); logIndex++; }
        if (progress >= 45 && logIndex === 2) { addLog('SECURE CONNECTION ESTABLISHED', 'SYNC'); logIndex++; }
        if (progress >= 60 && logIndex === 3) { addLog('ASSETS CACHED', 'LOAD'); logIndex++; }
        if (progress >= 75 && logIndex === 4) { addLog('INTERFACE READY', 'READY'); logIndex++; }
        if (progress >= 90 && logIndex === 5) { addLog('USER EXPERIENCE OPTIMIZED', 'OK'); logIndex++; }

        // Quando chegar a 100%
        if (progress >= 100) {
            isComplete = true;
            percentText.textContent = '100%';
            progressBar.style.width = '100%';
            statusText.textContent = 'SYSTEM READY';
            hudStatus.textContent = 'ONLINE';

            // Último log
            addLog('FOX RUBY DIGITAL LAB ONLINE', 'READY');

            // Mostrar mensagem de ready
            readyMessage.classList.add('show');

            // Pequeno delay para a transição
            setTimeout(() => {
                // Fade-out do preloader
                preloader.classList.add('hide');

                // Mostrar a landing page
                mainContent.style.display = 'block';
                // Forçar reflow
                void mainContent.offsetWidth;
                mainContent.classList.add('visible');

                // =============================================================
                // CORREÇÃO DEFINITIVA: garantir que TODOS os elementos com
                // animação fiquem visíveis imediatamente.
                // =============================================================
                document.querySelectorAll('.fade-in, .fade-up, .slide-in').forEach(el => {
                    el.classList.add('visible');
                });

                // Inicializar o restante do site (a mesma lógica que estava antes)
                initSite();

                console.log('🚀 FOX RUBY — DIGITAL LAB carregado com sucesso!');
            }, 700);
            return;
        }

        // Continua o loop
        setTimeout(updateProgress, stepTime);
    }

    // Inicia o progresso
    setTimeout(updateProgress, 500);

    // =============================================================
    // FUNÇÃO DE INICIALIZAÇÃO DO SITE (executada após o preloader)
    // =============================================================
    function initSite() {
        // ---- HEADER SCROLL ----
        const header = document.getElementById('header');
        if (header) {
            window.addEventListener('scroll', function() {
                const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
                header.classList.toggle('scrolled', currentScroll > 50);
            });
        }

        // ---- HAMBURGER ----
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', function() {
                this.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
            navMenu.querySelectorAll('.nav-link').forEach(function(link) {
                link.addEventListener('click', function() {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
        }

        // ---- NAVEGAÇÃO ATIVA ----
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        if (sections.length && navLinks.length) {
            window.addEventListener('scroll', function() {
                let current = '';
                sections.forEach(function(section) {
                    const sectionTop = section.offsetTop - 100;
                    if (window.pageYOffset >= sectionTop) {
                        current = section.id;
                    }
                });
                navLinks.forEach(function(link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + current) {
                        link.classList.add('active');
                    }
                });
            });
        }

        // ---- TECNOLOGIAS ----
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
            techData.forEach(function(tech) {
                const card = document.createElement('div');
                card.className = 'tech-card fade-up visible';
                card.innerHTML = '<i class="' + tech.icon + '"></i><h4>' + tech.name + '</h4><p>' + tech.desc + '</p>';
                techGrid.appendChild(card);
            });
        }

        // ---- PROJETOS ----
        if (typeof projectsData === 'undefined') {
            console.error('❌ projectsData não definido');
            var projectsData = [];
            var destaqueIndex = 0;
        } else {
            if (typeof destaqueIndex === 'undefined') {
                var destaqueIndex = 0;
            }
        }

        const projetosGrid = document.getElementById('projetosGrid');
        const filtrosContainer = document.getElementById('filtros');
        const buscaInput = document.getElementById('buscaInput');
        const destaqueContainer = document.getElementById('projetoDestaque');

        let currentFilter = 'todos';
        let currentSearch = '';

        function renderProjects(filter, search) {
            if (!projetosGrid) return;
            filter = filter || 'todos';
            search = search || '';

            if (!projectsData || projectsData.length === 0) {
                projetosGrid.innerHTML = '<p style="grid-column:1/-1; text-align:center; color:var(--text-secondary); padding:40px 0;">Nenhum projeto disponível.</p>';
                return;
            }

            var filtered = projectsData.filter(function(proj) {
                var matchCategory = filter === 'todos' || proj.category === filter;
                var matchSearch = proj.title.toLowerCase().includes(search.toLowerCase()) ||
                                  proj.description.toLowerCase().includes(search.toLowerCase()) ||
                                  proj.technologies.some(function(t) { return t.toLowerCase().includes(search.toLowerCase()); });
                return matchCategory && matchSearch;
            });

            projetosGrid.innerHTML = '';

            if (filtered.length === 0) {
                projetosGrid.innerHTML = '<p style="grid-column:1/-1; text-align:center; color:var(--text-secondary); padding:40px 0;">Nenhum projeto encontrado.</p>';
                return;
            }

            filtered.forEach(function(proj, index) {
                var card = document.createElement('div');
                card.className = 'projeto-card fade-up visible';
                card.style.transitionDelay = (index * 0.05) + 's';
                card.dataset.index = index;

                var statusClass = proj.status === 'online' ? 'online' : 'dev';
                var statusLabel = proj.status === 'online' ? '● ONLINE' : '● EM DESENVOLVIMENTO';

                card.innerHTML = `
                    <div class="projeto-card-image" style="background-image: url('${proj.image}');">
                        <div class="overlay"><span>VISUALIZAR PROJETO →</span></div>
                        <span class="status-badge ${statusClass}">${statusLabel}</span>
                    </div>
                    <div class="projeto-card-body">
                        <h4>${proj.title}</h4>
                        <div class="category">${proj.category.toUpperCase()}</div>
                        <p>${proj.description}</p>
                        <div class="tech-tags">
                            ${proj.technologies.map(function(t) { return '<span>' + t + '</span>'; }).join('')}
                        </div>
                        <div class="card-links">
                            <a href="${proj.url}" target="_blank" rel="noopener noreferrer">ACESSAR <i class="fas fa-arrow-right"></i></a>
                            ${proj.github ? '<a href="' + proj.github + '" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i></a>' : ''}
                        </div>
                    </div>
                `;

                card.addEventListener('click', function(e) {
                    if (e.target.closest('a')) return;
                    var originalProj = projectsData.find(function(p) { return p.title === proj.title; });
                    if (originalProj) openModal(originalProj);
                });

                projetosGrid.appendChild(card);
            });
        }

        function renderDestaque() {
            if (!destaqueContainer) return;
            if (!projectsData || projectsData.length === 0) {
                destaqueContainer.innerHTML = '<p style="color:var(--text-secondary); padding:20px;">Nenhum projeto em destaque.</p>';
                return;
            }
            var proj = projectsData[destaqueIndex] || projectsData[0];
            if (!proj) {
                destaqueContainer.innerHTML = '<p style="color:var(--text-secondary); padding:20px;">Nenhum projeto em destaque.</p>';
                return;
            }

            var statusClass = proj.status === 'online' ? 'online' : 'dev';
            var statusLabel = proj.status === 'online' ? '● ONLINE' : '● EM DESENVOLVIMENTO';

            destaqueContainer.innerHTML = `
                <div class="destaque-image" style="background-image: url('${proj.image}');">
                    <div class="placeholder-img" style="display:none;"></div>
                </div>
                <div class="destaque-info">
                    <div class="destaque-badge">★ PROJETO EM DESTAQUE</div>
                    <h3>${proj.title}</h3>
                    <p>${proj.description}</p>
                    <div class="destaque-tech">
                        ${proj.technologies.map(function(t) { return '<span>' + t + '</span>'; }).join('')}
                    </div>
                    <div class="destaque-status"><span class="${statusClass}">${statusLabel}</span></div>
                    <a href="${proj.url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="align-self:flex-start;">
                        VISUALIZAR PROJETO <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            `;
        }

        // Filtros
        if (filtrosContainer) {
            var filtroBtns = filtrosContainer.querySelectorAll('.filtro-btn');
            filtroBtns.forEach(function(btn) {
                btn.addEventListener('click', function() {
                    filtroBtns.forEach(function(b) { b.classList.remove('active'); });
                    this.classList.add('active');
                    currentFilter = this.dataset.filter;
                    renderProjects(currentFilter, currentSearch);
                });
            });
        }

        // Busca
        if (buscaInput) {
            buscaInput.addEventListener('input', function() {
                currentSearch = this.value.trim();
                renderProjects(currentFilter, currentSearch);
            });
        }

        // ---- MODAL ----
        var modalOverlay = document.getElementById('modalOverlay');
        var modalClose = document.getElementById('modalClose');
        var modalContent = document.getElementById('modalContent');

        function openModal(proj) {
            if (!modalOverlay || !modalContent) return;
            var statusClass = proj.status === 'online' ? 'online' : 'dev';
            var statusLabel = proj.status === 'online' ? '● ONLINE' : '● EM DESENVOLVIMENTO';

            modalContent.innerHTML = `
                <img src="${proj.image}" alt="${proj.title}" loading="lazy">
                <h2>${proj.title}</h2>
                <div class="modal-category">${proj.category.toUpperCase()}</div>
                <p class="modal-desc">${proj.description}</p>
                <div class="modal-tech">
                    ${proj.technologies.map(function(t) { return '<span>' + t + '</span>'; }).join('')}
                </div>
                <div class="modal-status"><span class="${statusClass}">${statusLabel}</span></div>
                <div class="modal-actions">
                    <a href="${proj.url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">ACESSAR PROJETO <i class="fas fa-arrow-right"></i></a>
                    ${proj.github ? '<a href="' + proj.github + '" target="_blank" rel="noopener noreferrer" class="btn btn-secondary"><i class="fab fa-github"></i> GITHUB</a>' : ''}
                </div>
            `;
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            if (modalOverlay) {
                modalOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
        if (modalClose) modalClose.addEventListener('click', closeModal);
        if (modalOverlay) modalOverlay.addEventListener('click', function(e) {
            if (e.target === this) closeModal();
        });
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') closeModal();
        });

        // ---- ORBITAL ----
        function initOrbital() {
            var orbital = document.getElementById('orbitalSystem');
            if (!orbital) return;
            orbital.querySelectorAll('.orbit-ring, .orbit-item').forEach(function(el) { el.remove(); });
            for (var i = 1; i <= 3; i++) {
                var ring = document.createElement('div');
                ring.className = 'orbit-ring';
                orbital.appendChild(ring);
            }
            var techs = ['HTML', 'CSS', 'JS', 'REACT', 'NODE', 'PYTHON', 'GIT', 'GITHUB'];
            var radiuses = [110, 150, 190];
            var counts = [3, 3, 2];
            var techIndex = 0;
            for (var ringIdx = 0; ringIdx < 3; ringIdx++) {
                var count = counts[ringIdx];
                var radius = radiuses[ringIdx];
                var angleStep = (Math.PI * 2) / count;
                var startAngle = ringIdx * 0.5;
                for (var j = 0; j < count; j++) {
                    var angle = startAngle + j * angleStep;
                    var x = radius * Math.cos(angle);
                    var y = radius * Math.sin(angle);
                    var tech = techs[techIndex % techs.length];
                    techIndex++;
                    var item = document.createElement('div');
                    item.className = 'orbit-item';
                    item.textContent = tech;
                    item.style.transform = 'translate(' + x + 'px, ' + y + 'px) translate(-50%, -50%)';
                    item.style.animationDelay = (j * 0.2) + 's';
                    orbital.appendChild(item);
                }
            }
        }
        initOrbital();

        // ---- RENDER ----
        renderDestaque();
        renderProjects('todos', '');

        // ---- CURSOR GLOW ----
        if (window.innerWidth > 768) {
            var cursorGlow = document.createElement('div');
            cursorGlow.style.cssText = `
                position: fixed;
                width: 300px;
                height: 300px;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(179,0,0,0.06) 0%, transparent 70%);
                pointer-events: none;
                z-index: 9999;
                transform: translate(-50%, -50%);
                transition: opacity 0.3s;
                opacity: 0;
            `;
            document.body.appendChild(cursorGlow);

            document.addEventListener('mousemove', function(e) {
                cursorGlow.style.left = e.clientX + 'px';
                cursorGlow.style.top = e.clientY + 'px';
                cursorGlow.style.opacity = '1';
            });

            document.addEventListener('mouseleave', function() {
                cursorGlow.style.opacity = '0';
            });
        }
    } // fim initSite
});