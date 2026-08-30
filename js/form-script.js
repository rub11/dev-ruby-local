// ============================================================
// FORMULÁRIO DE BRIEFING - DEV RUBY
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    const steps = document.querySelectorAll('.form-step');
    const progressFill = document.getElementById('progressFill');
    const stepCounter = document.getElementById('stepCounter');
    const btnVoltar = document.getElementById('btnVoltar');
    const btnContinuar = document.getElementById('btnContinuar');
    const form = document.getElementById('briefingForm');
    const reviewContent = document.getElementById('reviewContent');
    const btnEnviar = document.getElementById('enviarWhatsApp');

    let currentStep = 0;
    const totalSteps = steps.length; // inclui a revisão

    // ============================================================
    // INICIALIZAÇÃO
    // ============================================================
    function init() {
        // Eventos para cards
        document.querySelectorAll('.options-grid').forEach(grid => {
            grid.querySelectorAll('.option-card').forEach(card => {
                card.addEventListener('click', function(e) {
                    const checkbox = this.querySelector('input[type="checkbox"]');
                    if (checkbox) {
                        checkbox.checked = !checkbox.checked;
                        this.classList.toggle('selected', checkbox.checked);
                    } else {
                        // Para seleção única (estilo, prazo, investimento)
                        const parent = this.closest('.options-grid');
                        parent.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
                        this.classList.add('selected');
                    }
                });
            });
        });

        // Radio condicional (possui site)
        document.querySelectorAll('input[name="possuiSite"]').forEach(radio => {
            radio.addEventListener('change', function() {
                const group = document.getElementById('siteAtualGroup');
                if (this.value === 'Sim') {
                    group.classList.add('show');
                } else {
                    group.classList.remove('show');
                }
            });
        });

        // Navegação
        btnContinuar.addEventListener('click', nextStep);
        btnVoltar.addEventListener('click', prevStep);

        // Envio
        btnEnviar.addEventListener('click', enviarBriefing);

        // Teclado
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                const target = e.target;
                if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
                    e.preventDefault();
                    if (currentStep === totalSteps - 1) {
                        enviarBriefing();
                    } else {
                        nextStep();
                    }
                }
            }
            if (e.key === 'Escape') {
                // Fechar modal se houver
            }
        });

        // Mostrar primeira etapa
        showStep(0);
    }

    // ============================================================
    // NAVEGAÇÃO
    // ============================================================
    function showStep(index) {
        steps.forEach((step, i) => {
            step.classList.toggle('active', i === index);
        });

        // Atualizar indicadores
        const indicators = document.querySelectorAll('.step-indicator');
        indicators.forEach((ind, i) => {
            ind.classList.remove('active', 'done');
            if (i === index) ind.classList.add('active');
            else if (i < index) ind.classList.add('done');
        });

        // Progresso
        const progress = ((index + 1) / totalSteps) * 100;
        progressFill.style.width = Math.min(progress, 100) + '%';
        stepCounter.textContent = (index + 1) + ' de ' + totalSteps;

        // Botões
        btnVoltar.style.display = index === 0 ? 'none' : 'inline-flex';
        if (index === totalSteps - 1) {
            btnContinuar.style.display = 'none';
            btnEnviar.style.display = 'block';
            gerarRevisao();
        } else {
            btnContinuar.style.display = 'inline-flex';
            btnEnviar.style.display = 'none';
        }

        // Scroll para o topo do formulário
        document.getElementById('briefingContainer').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function nextStep() {
        if (currentStep < totalSteps - 1) {
            currentStep++;
            showStep(currentStep);
        }
    }

    function prevStep() {
        if (currentStep > 0) {
            currentStep--;
            showStep(currentStep);
        }
    }

    // ============================================================
    // COLETA DE DADOS
    // ============================================================
    function getFormData() {
        const data = {};

        // Campos textuais
        data.nome = document.getElementById('nome')?.value?.trim() || '';
        data.email = document.getElementById('email')?.value?.trim() || '';
        data.whatsapp = document.getElementById('whatsapp')?.value?.trim() || '';
        data.empresa = document.getElementById('empresa')?.value?.trim() || '';
        data.instagram = document.getElementById('instagram')?.value?.trim() || '';
        data.descricao = document.getElementById('descricao')?.value?.trim() || '';
        data.siteAtual = document.getElementById('siteAtual')?.value?.trim() || '';
        data.outroProjeto = document.getElementById('outroProjeto')?.value?.trim() || '';
        data.outroObjetivo = document.getElementById('outroObjetivo')?.value?.trim() || '';
        data.outraFuncionalidade = document.getElementById('outraFuncionalidade')?.value?.trim() || '';
        data.referencia = document.getElementById('referencia')?.value?.trim() || '';
        data.cores = document.getElementById('cores')?.value?.trim() || '';
        data.observacoes = document.getElementById('observacoes')?.value?.trim() || '';

        // Radios
        data.possuiSite = document.querySelector('input[name="possuiSite"]:checked')?.value || '';
        data.possuiIdentidade = document.querySelector('input[name="possuiIdentidade"]:checked')?.value || '';
        data.dominio = document.querySelector('input[name="dominio"]:checked')?.value || '';
        data.hospedagem = document.querySelector('input[name="hospedagem"]:checked')?.value || '';

        // Multi-select (cards com checkbox)
        data.tipoProjeto = getSelectedValues('tipoProjeto', 'tipo');
        data.objetivo = getSelectedValues('objetivoProjeto', 'objetivo');
        data.funcionalidades = getSelectedValues('funcionalidades', null);
        data.estiloDesign = getSelectedValues('estiloDesign', null);
        data.prazo = getSelectedValues('prazo', null);
        data.materiais = getSelectedValues('materiais', null);
        data.investimento = getSelectedValues('investimento', null);

        return data;
    }

    function getSelectedValues(containerId, nameAttr) {
        const container = document.getElementById(containerId);
        if (!container) return [];
        const cards = container.querySelectorAll('.option-card.selected');
        const values = [];
        cards.forEach(card => {
            const checkbox = card.querySelector('input[type="checkbox"]');
            if (checkbox) {
                values.push(checkbox.value);
            } else {
                // Para seleção única (estilo, prazo, investimento)
                values.push(card.dataset.value || card.textContent.trim());
            }
        });
        return values;
    }

    // ============================================================
    // REVISÃO
    // ============================================================
    function gerarRevisao() {
        const data = getFormData();
        let html = '';

        const blocks = [
            { title: 'SEUS DADOS', fields: [
                { label: 'Nome', value: data.nome },
                { label: 'E-mail', value: data.email },
                { label: 'WhatsApp', value: data.whatsapp },
                { label: 'Empresa', value: data.empresa },
                { label: 'Instagram', value: data.instagram }
            ]},
            { title: 'PROJETO', fields: [
                { label: 'Tipo de projeto', value: data.tipoProjeto.join(', ') || (data.outroProjeto ? 'Outro: ' + data.outroProjeto : '') },
                { label: 'Descrição', value: data.descricao },
                { label: 'Possui site?', value: data.possuiSite },
                { label: 'Site atual', value: data.siteAtual },
                { label: 'Objetivo', value: data.objetivo.join(', ') || data.outroObjetivo },
                { label: 'Funcionalidades', value: data.funcionalidades.join(', ') || data.outraFuncionalidade }
            ]},
            { title: 'DESIGN', fields: [
                { label: 'Estilo', value: data.estiloDesign.join(', ') },
                { label: 'Referência', value: data.referencia },
                { label: 'Possui identidade visual?', value: data.possuiIdentidade },
                { label: 'Cores', value: data.cores }
            ]},
            { title: 'PRAZO E INVESTIMENTO', fields: [
                { label: 'Prazo', value: data.prazo.join(', ') },
                { label: 'Domínio', value: data.dominio },
                { label: 'Hospedagem', value: data.hospedagem },
                { label: 'Materiais', value: data.materiais.join(', ') },
                { label: 'Faixa de investimento', value: data.investimento.join(', ') },
                { label: 'Observações', value: data.observacoes }
            ]}
        ];

        blocks.forEach(block => {
            const hasValue = block.fields.some(f => f.value && f.value.trim() !== '');
            if (!hasValue) return;
            html += `<div class="review-block"><strong>${block.title}</strong>`;
            block.fields.forEach(f => {
                if (f.value && f.value.trim() !== '') {
                    html += `<div><span class="value">${f.label}: ${f.value}</span></div>`;
                }
            });
            html += `</div>`;
        });

        if (!html) {
            html = '<p style="color:var(--text-secondary);">Nenhuma informação preenchida.</p>';
        }

        reviewContent.innerHTML = html;
    }

    // ============================================================
    // ENVIO PARA WHATSAPP
    // ============================================================
    function enviarBriefing() {
        const data = getFormData();

        // Montar mensagem
        let msg = '🚀 NOVO BRIEFING DE PROJETO\n\n';
        msg += 'Olá! Vim através do site e gostaria de solicitar um orçamento.\n\n';

        // Seção Dados
        msg += '━━━━━━━━━━━━━━━━━━\n';
        msg += '👤 DADOS DO CLIENTE\n';
        msg += '━━━━━━━━━━━━━━━━━━\n';
        if (data.nome) msg += `Nome: ${data.nome}\n`;
        if (data.email) msg += `E-mail: ${data.email}\n`;
        if (data.whatsapp) msg += `WhatsApp: ${data.whatsapp}\n`;
        if (data.empresa) msg += `Empresa: ${data.empresa}\n`;
        if (data.instagram) msg += `Instagram: ${data.instagram}\n`;
        msg += '\n';

        // Projeto
        msg += '━━━━━━━━━━━━━━━━━━\n';
        msg += '💻 PROJETO\n';
        msg += '━━━━━━━━━━━━━━━━━━\n';
        const tipos = data.tipoProjeto.join(', ');
        if (tipos) msg += `Tipo de projeto: ${tipos}\n`;
        if (data.outroProjeto) msg += `Outro: ${data.outroProjeto}\n`;
        if (data.descricao) msg += `Descrição: ${data.descricao}\n`;
        if (data.possuiSite) msg += `Possui site: ${data.possuiSite}\n`;
        if (data.siteAtual) msg += `Site atual: ${data.siteAtual}\n`;
        const objetivos = data.objetivo.join(', ');
        if (objetivos) msg += `Objetivo: ${objetivos}\n`;
        if (data.outroObjetivo) msg += `Outro objetivo: ${data.outroObjetivo}\n`;
        msg += '\n';

        // Funcionalidades
        const funcs = data.funcionalidades.join(', ');
        if (funcs || data.outraFuncionalidade) {
            msg += '━━━━━━━━━━━━━━━━━━\n';
            msg += '⚙️ FUNCIONALIDADES\n';
            msg += '━━━━━━━━━━━━━━━━━━\n';
            if (funcs) msg += `${funcs}\n`;
            if (data.outraFuncionalidade) msg += `Outra: ${data.outraFuncionalidade}\n`;
            msg += '\n';
        }

        // Design
        const estilos = data.estiloDesign.join(', ');
        if (estilos || data.referencia || data.cores) {
            msg += '━━━━━━━━━━━━━━━━━━\n';
            msg += '🎨 DESIGN\n';
            msg += '━━━━━━━━━━━━━━━━━━\n';
            if (estilos) msg += `Estilo: ${estilos}\n`;
            if (data.referencia) msg += `Referência: ${data.referencia}\n`;
            if (data.possuiIdentidade) msg += `Possui identidade: ${data.possuiIdentidade}\n`;
            if (data.cores) msg += `Cores: ${data.cores}\n`;
            msg += '\n';
        }

        // Prazo e infra
        const prazos = data.prazo.join(', ');
        if (prazos || data.dominio || data.hospedagem) {
            msg += '━━━━━━━━━━━━━━━━━━\n';
            msg += '📅 PRAZO E INFRA\n';
            msg += '━━━━━━━━━━━━━━━━━━\n';
            if (prazos) msg += `Prazo: ${prazos}\n`;
            if (data.dominio) msg += `Domínio: ${data.dominio}\n`;
            if (data.hospedagem) msg += `Hospedagem: ${data.hospedagem}\n`;
            msg += '\n';
        }

        // Materiais
        const mats = data.materiais.join(', ');
        if (mats) {
            msg += '━━━━━━━━━━━━━━━━━━\n';
            msg += '📎 MATERIAIS\n';
            msg += '━━━━━━━━━━━━━━━━━━\n';
            msg += `${mats}\n\n`;
        }

        // Investimento
        const inv = data.investimento.join(', ');
        if (inv) {
            msg += '━━━━━━━━━━━━━━━━━━\n';
            msg += '💰 INVESTIMENTO\n';
            msg += '━━━━━━━━━━━━━━━━━━\n';
            msg += `Faixa: ${inv}\n\n`;
        }

        // Observações
        if (data.observacoes) {
            msg += '━━━━━━━━━━━━━━━━━━\n';
            msg += '📝 OBSERVAÇÕES\n';
            msg += '━━━━━━━━━━━━━━━━━━\n';
            msg += `${data.observacoes}\n\n`;
        }

        msg += '━━━━━━━━━━━━━━━━━━\n';
        msg += 'Aguardo o contato para conversarmos sobre o projeto. 🚀';

        // Codificar e abrir WhatsApp
        const url = 'https://wa.me/5511974793895?text=' + encodeURIComponent(msg);
        window.open(url, '_blank');
    }

    // ============================================================
    // INICIAR
    // ============================================================
    init();
});