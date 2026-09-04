// main.js — com filtros de gênero embutidos e tecnologias em badges
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
  const allProjects = (typeof projectsData !== 'undefined' && projectsData.length > 0) ? projectsData : [];

  // ===== MODAL =====
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
        <button class="prev-btn" id="modalPrev"><i class="fas fa-chevron-left"></i></button>
        <button class="next-btn" id="modalNext"><i class="fas fa-chevron-right"></i></button>
      </div>
    `;
    document.getElementById('modalPrev')?.addEventListener('click', function(e) {
      e.stopPropagation();
      openModal(currentModalIndex - 1);
    });
    document.getElementById('modalNext')?.addEventListener('click', function(e) {
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
  modalOverlay?.addEventListener('click', function(e) {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) closeModal();
  });

  // ===== TECNOLOGIAS — VERSÃO COM BADGES HARMÔNICOS =====
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
      projetosGrid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--text-secondary)">Nenhum projeto encontrado.</p>';
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
      card.addEventListener('click', function(e) {
        if (e.target.closest('a')) return;
        const index = parseInt(this.dataset.index);
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
      btn.addEventListener('click', function() {
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
    window.addEventListener('scroll', function() {
      header.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      hamburger.classList.toggle('active');
    });
    navMenu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
      });
    });
  }

  // ===== BUSCA =====
  const buscaInput = document.getElementById('buscaInput');
  if (buscaInput) {
    buscaInput.addEventListener('input', function(e) {
      currentSearch = e.target.value.trim();
      renderProjects();
    });
  }

  // ===== FAQ (toggle) =====
  document.querySelectorAll('.faq-pergunta').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const item = this.closest('.faq-item');
      const resposta = item.querySelector('.faq-resposta');
      const icon = this.querySelector('i');
      item.classList.toggle('open');
      if (item.classList.contains('open')) {
        resposta.style.display = 'block';
        icon.style.transform = 'rotate(180deg)';
      } else {
        resposta.style.display = 'none';
        icon.style.transform = 'rotate(0deg)';
      }
    });
  });

  // ===== INICIALIZAÇÃO =====
  renderTech();
  renderFiltrosGenero();
  renderProjects();
});