// main.js — Preloader, modal, tecnologias, filtros, busca, FAQ,
// diagnóstico "Descobrir" e pré-seleção de planos.
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // ===== PRELOADER =====
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

  // ===== DADOS DOS PROJETOS =====
  const allProjects = (typeof projectsData !== 'undefined' && projectsData.length > 0)
    ? projectsData
    : [];

  // ===== MODAL =====
  const modalOverlay = document.getElementById('modalOverlay');
  const modalContent = document.getElementById('modalContent');
  const modalClose = document.getElementById('modalClose');
  let currentModalIndex = 0;

  function openModal(index) {
    if (!allProjects.length || !modalOverlay || !modalContent) return;
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
        <button class="prev-btn" id="modalPrev"><i class="fas fa-chevron-left"></i></button>
        <button class="next-btn" id="modalNext"><i class="fas fa-chevron-right"></i></button>
      </div>
    `;

    const prevBtn = document.getElementById('modalPrev');
    const nextBtn = document.getElementById('modalNext');
    if (prevBtn) {
      prevBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        openModal(currentModalIndex - 1);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        openModal(currentModalIndex + 1);
      });
    }

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', function (e) {
      if (e.target === modalOverlay) closeModal();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  // ===== TECNOLOGIAS =====
  function renderTech() {
    const techIcons = {
      'HTML5': 'fab fa-html5',
      'CSS3': 'fab fa-css3-alt',
      'JavaScript': 'fab fa-js',
      'TypeScript': 'fab fa-js',
      'React': 'fab fa-react',
      'Next.js': 'fab fa-react',
      'Tailwind CSS': 'fas fa-wind',
      'Bootstrap': 'fab fa-bootstrap',
      'Node.js': 'fab fa-node-js',
      'Python': 'fab fa-python',
      'Django': 'fab fa-python',
      'MySQL': 'fas fa-database',
      'PostgreSQL': 'fas fa-database',
      'MongoDB': 'fas fa-database',
      'Firebase': 'fas fa-fire',
      'Git': 'fab fa-git-alt',
      'GitHub': 'fab fa-github',
      'Docker': 'fab fa-docker',
      'Figma': 'fab fa-figma'
    };

    const techData = {
      'FRONTEND': ['HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Tailwind CSS', 'Bootstrap'],
      'BACKEND': ['Node.js', 'Python', 'Django'],
      'DATABASE': ['MySQL', 'PostgreSQL', 'MongoDB', 'Firebase'],
      'TOOLS': ['Git', 'GitHub', 'Docker', 'Figma']
    };

    const techGrid = document.getElementById('techGrid');
    if (!techGrid) return;
    techGrid.innerHTML = '';

    Object.keys(techData).forEach(cat => {
      const div = document.createElement('div');
      div.className = 'tech-category';

      let html = `<h3>${cat}</h3><div class="tech-items">`;
      techData[cat].forEach(item => {
        const icon = techIcons[item] || 'fas fa-code';
        html += `
          <div class="tech-badge">
            <i class="${icon}"></i>
            <span>${item}</span>
          </div>
        `;
      });
      html += '</div>';
      div.innerHTML = html;
      techGrid.appendChild(div);
    });
  }

  // ===== PROJETOS =====
  let currentGenero = 'todos';
  let currentSearch = '';

  function renderProjects() {
    const projetosGrid = document.getElementById('projetosGrid');
    if (!projetosGrid) return;

    const filtered = allProjects.filter(p => {
      const matchGenero = currentGenero === 'todos' || p.genero === currentGenero;
      const matchSearch = p.title.toLowerCase().includes(currentSearch.toLowerCase()) ||
                          p.description.toLowerCase().includes(currentSearch.toLowerCase());
      return matchGenero && matchSearch;
    });

    if (filtered.length === 0) {
      projetosGrid.innerHTML =
        '<p style="grid-column:1/-1;text-align:center;color:var(--text-secondary)">Nenhum projeto encontrado.</p>';
      return;
    }

    projetosGrid.innerHTML = filtered.map((proj, i) => {
      const idx = allProjects.indexOf(proj);
      return `
        <div class="projeto-card" data-index="${idx}" style="transition-delay:${i * 0.05}s">
          <div class="projeto-card-image" style="background-image:url('${proj.image}'); background-color:#1a1a1a;">
            <span class="status-badge ${proj.status}">${proj.status === 'online' ? '● ONLINE' : '● EM DEV'}</span>
          </div>
          <div class="projeto-card-body">
            <div class="card-number">${String(idx + 1).padStart(2, '0')}</div>
            <h4>${proj.title.toUpperCase()}</h4>
            <div class="category">${proj.category.toUpperCase()}</div>
            <p>${proj.description}</p>
            <div class="tech-tags">${proj.technologies.map(t => `<span>${t}</span>`).join('')}</div>
            <div class="card-links">
              <a href="${proj.url}" target="_blank">VIEW PROJECT →</a>
            </div>
          </div>
        </div>
      `;
    }).join('');

    document.querySelectorAll('.projeto-card').forEach(card => {
      card.addEventListener('click', function (e) {
        if (e.target.closest('a')) return;
        const index = parseInt(this.dataset.index, 10);
        if (!isNaN(index)) openModal(index);
      });
    });
  }

  // ===== FILTROS POR GÊNERO =====
  function renderFiltrosGenero() {
    const container = document.getElementById('filtrosGenero');
    if (!container) return;

    const generos = new Set();
    allProjects.forEach(p => { if (p.genero) generos.add(p.genero); });
    const generosList = Array.from(generos);

    let html = `<button class="filtro-genero-btn active" data-genero="todos">TODOS</button>`;
    generosList.forEach(g => {
      const label = g.charAt(0).toUpperCase() + g.slice(1);
      html += `<button class="filtro-genero-btn" data-genero="${g}">${label}</button>`;
    });
    container.innerHTML = html;

    container.querySelectorAll('.filtro-genero-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        container.querySelectorAll('.filtro-genero-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentGenero = this.dataset.genero;
        renderProjects();
      });
    });
  }

  // ===== HEADER =====
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

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

  // ===== BUSCA =====
  const buscaInput = document.getElementById('buscaInput');
  if (buscaInput) {
    buscaInput.addEventListener('input', function (e) {
      currentSearch = e.target.value.trim();
      renderProjects();
    });
  }

  // ===== FAQ =====
  document.querySelectorAll('.faq-pergunta').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const item = this.closest('.faq-item');
      if (!item) return;
      const resposta = item.querySelector('.faq-resposta');
      const icon = this.querySelector('i');
      item.classList.toggle('open');
      if (item.classList.contains('open')) {
        if (resposta) resposta.style.display = 'block';
        if (icon) icon.style.transform = 'rotate(180deg)';
      } else {
        if (resposta) resposta.style.display = 'none';
        if (icon) icon.style.transform = 'rotate(0deg)';
      }
    });
  });

  // ===== DESCOBRIR / DIAGNÓSTICO =====
  (function initDescobrir() {
    const buttons = document.querySelectorAll('#descobrirOptions .descobrir-btn');
    const cta = document.getElementById('descobrirCta');
    const hint = document.getElementById('descobrirHint');
    if (!buttons.length || !cta) return;

    const selecionadas = new Set();

    buttons.forEach(btn => {
      btn.addEventListener('click', function () {
        const val = this.dataset.value;
        if (selecionadas.has(val)) {
          selecionadas.delete(val);
          this.classList.remove('selected');
        } else {
          selecionadas.add(val);
          this.classList.add('selected');
        }
        if (hint) {
          hint.style.color = '';
          hint.textContent = selecionadas.size === 0
            ? 'Selecione uma ou mais opções acima.'
            : `${selecionadas.size} opção(ões) selecionada(s).`;
        }
      });
    });

    cta.addEventListener('click', function () {
      if (selecionadas.size === 0) {
        if (hint) {
          hint.textContent = 'Selecione ao menos uma opção para personalizar sua mensagem.';
          hint.style.color = '#f87171';
        }
        return;
      }

      // Injeta escolhas na descrição (se vazia)
      const descricao = document.getElementById('descricao');
      if (descricao && !descricao.value.trim()) {
        const lista = Array.from(selecionadas).join(', ');
        descricao.value = `Necessidades identificadas: ${lista}.`;
      }

      // Marca tipo de projeto correspondente
      const mapa = {
        'Criar um sistema próprio': 'Sistema Web',
        'Automatizar processos': 'Automação',
        'Acompanhar meus dados': 'Dashboard',
        'Organizar meus clientes': 'CRM',
        'Controlar meu estoque': 'Controle de Estoque',
        'Receber pedidos': 'Sistema de Pedidos',
        'Apresentar minha empresa': 'Site Profissional'
      };

      selecionadas.forEach(val => {
        const alvo = mapa[val];
        if (!alvo) return;
        const card = document.querySelector(`#tipoProjeto .option-card[data-value="${alvo}"]`);
        if (card && !card.classList.contains('selected')) {
          const cb = card.querySelector('input[type="checkbox"]');
          if (cb) cb.checked = true;
          card.classList.add('selected');
        }
      });

      const contato = document.getElementById('contato');
      if (contato) contato.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  })();

  // ===== PRÉ-SELEÇÃO DE PLANO VIA CTA =====
  (function initPlanoCtas() {
   const ctas = document.querySelectorAll('.plano-cta');
    if (!ctas.length) return;

    ctas.forEach(btn => {
      btn.addEventListener('click', function () {
        const plano = this.dataset.plano || this.textContent.trim();
        const descricao = document.getElementById('descricao');

        if (descricao && !descricao.value.trim()) {
          descricao.value = `Tenho interesse no plano ${plano}. `;
        }

        // Destaque visual no briefing
        const briefing = document.getElementById('briefingContainer');
        if (briefing) {
          briefing.style.transition = 'box-shadow 0.6s';
          setTimeout(() => {
            briefing.style.boxShadow = '0 0 0 2px rgba(179,0,0,0.4), 0 20px 60px rgba(0,0,0,0.6)';
            setTimeout(() => {
              briefing.style.boxShadow = '';
            }, 1800);
          }, 600);
        }
      });
    });
  })();

  // ===== INICIALIZAÇÃO =====
  renderTech();
  renderFiltrosGenero();
  renderProjects();
});