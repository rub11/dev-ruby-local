// filtros-genero.js — Gerencia os filtros por gênero
(function() {
    'use strict';

    // Lista de gêneros únicos (extraída dos projetos)
    function getGeneros(projetos) {
        const generos = new Set();
        projetos.forEach(p => {
            if (p.genero) generos.add(p.genero);
        });
        return Array.from(generos);
    }

    // Renderiza os botões de filtro por gênero
    function renderFiltrosGenero(containerId, projetos, onFilterChange) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const generos = getGeneros(projetos);
        if (generos.length === 0) {
            container.innerHTML = '';
            return;
        }

        let html = `<button class="filtro-genero-btn active" data-genero="todos">TODOS</button>`;
        generos.forEach(g => {
            // Capitaliza a primeira letra
            const label = g.charAt(0).toUpperCase() + g.slice(1);
            html += `<button class="filtro-genero-btn" data-genero="${g}">${label}</button>`;
        });

        container.innerHTML = html;

        // Adiciona eventos
        container.querySelectorAll('.filtro-genero-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                container.querySelectorAll('.filtro-genero-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                const genero = this.dataset.genero;
                if (typeof onFilterChange === 'function') {
                    onFilterChange(genero);
                }
            });
        });
    }

    // Expõe a função globalmente
    window.renderFiltrosGenero = renderFiltrosGenero;
    window.getGeneros = getGeneros;
})();