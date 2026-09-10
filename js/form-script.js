// ============================================================
// FORMULÁRIO DE BRIEFING — DEV RUBY
// ENVIO EXCLUSIVO PARA NETLIFY FORMS
// ============================================================

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  const steps = document.querySelectorAll('.form-step');
  const progressFill = document.getElementById('progressFill');
  const stepCounter = document.getElementById('stepCounter');
  const btnVoltar = document.getElementById('btnVoltar');
  const btnContinuar = document.getElementById('btnContinuar');
  const form = document.getElementById('briefingForm');
  const reviewContent = document.getElementById('reviewContent');
  const btnEnviar = document.getElementById('enviarNetlify');

  // Se o formulário não existir na página, sai silenciosamente
  if (!steps.length || !btnContinuar || !btnVoltar || !btnEnviar) return;

  let currentStep = 0;
  const totalSteps = steps.length;

  // ============================================================
  // INICIALIZAÇÃO
  // ============================================================
  function init() {
    // Multi-select em cards
    document.querySelectorAll('.options-grid').forEach(grid => {
      grid.querySelectorAll('.option-card').forEach(card => {
        card.addEventListener('click', function (e) {
          const checkbox = this.querySelector('input[type="checkbox"]');
          if (checkbox) {
            e.preventDefault();
            checkbox.checked = !checkbox.checked;
            this.classList.toggle('selected', checkbox.checked);
          }
        });
      });
    });

    // Condicional: possui site?
    document.querySelectorAll('input[name="possuiSite"]').forEach(radio => {
      radio.addEventListener('change', function () {
        const group = document.getElementById('siteAtualGroup');
        if (!group) return;
        if (this.value === 'Sim') {
          group.classList.add('show');
          group.style.display = 'block';
        } else {
          group.classList.remove('show');
          group.style.display = 'none';
        }
      });
    });

    // Navegação
    btnContinuar.addEventListener('click', nextStep);
    btnVoltar.addEventListener('click', prevStep);

    // Envio — apenas Netlify
    btnEnviar.addEventListener('click', enviarParaNetlify);

    // Enter avança etapa (e envia se estiver na revisão)
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        const target = e.target;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
          e.preventDefault();
          if (currentStep === totalSteps - 1) {
            enviarParaNetlify();
          } else {
            nextStep();
          }
        }
      }
    });

    showStep(0);
  }

  // ============================================================
  // NAVEGAÇÃO
  // ============================================================
  function showStep(index) {
    steps.forEach((step, i) => {
      step.classList.toggle('active', i === index);
    });

    document.querySelectorAll('.step-indicator').forEach((ind, i) => {
      ind.classList.remove('active', 'done');
      if (i === index) ind.classList.add('active');
      else if (i < index) ind.classList.add('done');
    });

    const progress = ((index + 1) / totalSteps) * 100;
    if (progressFill) progressFill.style.width = Math.min(progress, 100) + '%';
    if (stepCounter) stepCounter.textContent = (index + 1) + ' de ' + totalSteps;

    btnVoltar.style.display = index === 0 ? 'none' : 'inline-flex';
    if (index === totalSteps - 1) {
      btnContinuar.style.display = 'none';
      btnEnviar.style.display = 'block';
      gerarRevisao();
    } else {
      btnContinuar.style.display = 'inline-flex';
      btnEnviar.style.display = 'none';
    }

    const container = document.getElementById('briefingContainer');
    if (container) {
      container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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

    data.possuiSite = document.querySelector('input[name="possuiSite"]:checked')?.value || '';
    data.possuiIdentidade = document.querySelector('input[name="possuiIdentidade"]:checked')?.value || '';
    data.dominio = document.querySelector('input[name="dominio"]:checked')?.value || '';
    data.hospedagem = document.querySelector('input[name="hospedagem"]:checked')?.value || '';

    data.tipoProjeto = getSelectedValues('tipoProjeto');
    data.objetivo = getSelectedValues('objetivoProjeto');
    data.funcionalidades = getSelectedValues('funcionalidades');
    data.estiloDesign = getSelectedValues('estiloDesign');
    data.prazo = getSelectedValues('prazo');
    data.materiais = getSelectedValues('materiais');
    data.investimento = getSelectedValues('investimento');

    return data;
  }

  function getSelectedValues(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return [];
    const cards = container.querySelectorAll('.option-card.selected');
    const values = [];
    cards.forEach(card => {
      const checkbox = card.querySelector('input[type="checkbox"]');
      if (checkbox) values.push(checkbox.value);
      else values.push(card.dataset.value || card.textContent.trim());
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
        { label: 'Tipo de projeto', value: data.tipoProjeto.join(', ') || data.outroProjeto },
        { label: 'O que precisa resolver', value: data.descricao },
        { label: 'Possui site?', value: data.possuiSite },
        { label: 'Site atual', value: data.siteAtual },
        { label: 'Objetivo', value: data.objetivo.join(', ') || data.outroObjetivo }
      ]},
      { title: 'FUNCIONALIDADES', fields: [
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

    if (reviewContent) reviewContent.innerHTML = html;
  }

  // ============================================================
  // ENVIO EXCLUSIVO PARA NETLIFY FORMS
  // ============================================================
  function enviarParaNetlify() {
    const data = getFormData();

    // Validações básicas
    if (!data.nome) {
      alert('Por favor, informe seu nome.');
      currentStep = 0;
      showStep(0);
      return;
    }
    if (!data.whatsapp && !data.email) {
      alert('Por favor, informe pelo menos um contato (WhatsApp ou e-mail).');
      currentStep = 0;
      showStep(0);
      return;
    }

    // Monta FormData no formato aceito pelo Netlify Forms
    const formData = new FormData();
    formData.append('form-name', 'briefing');
    formData.append('nome', data.nome);
    formData.append('email', data.email);
    formData.append('whatsapp', data.whatsapp);
    formData.append('empresa', data.empresa);
    formData.append('instagram', data.instagram);
    formData.append('descricao', data.descricao);
    formData.append('siteAtual', data.siteAtual);
    formData.append('outroProjeto', data.outroProjeto);
    formData.append('outroObjetivo', data.outroObjetivo);
    formData.append('outraFuncionalidade', data.outraFuncionalidade);
    formData.append('referencia', data.referencia);
    formData.append('cores', data.cores);
    formData.append('observacoes', data.observacoes);
    formData.append('possuiSite', data.possuiSite);
    formData.append('possuiIdentidade', data.possuiIdentidade);
    formData.append('dominio', data.dominio);
    formData.append('hospedagem', data.hospedagem);
    formData.append('tipoProjeto', data.tipoProjeto.join(', '));
    formData.append('objetivo', data.objetivo.join(', '));
    formData.append('funcionalidades', data.funcionalidades.join(', '));
    formData.append('estiloDesign', data.estiloDesign.join(', '));
    formData.append('prazo', data.prazo.join(', '));
    formData.append('materiais', data.materiais.join(', '));
    formData.append('investimento', data.investimento.join(', '));

    // Feedback visual
    btnEnviar.disabled = true;
    btnEnviar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ENVIANDO...';

    // Envia para o Netlify Forms
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData).toString()
    })
    .then(response => {
      if (response.ok) {
        mostrarMensagemSucesso();
      } else {
        throw new Error('Falha no envio: ' + response.status);
      }
    })
    .catch(error => {
      console.error('Erro:', error);
      mostrarMensagemErro(error.message);
    })
    .finally(() => {
      btnEnviar.disabled = false;
      btnEnviar.innerHTML = '<i class="fas fa-paper-plane"></i> ENVIAR BRIEFING';
    });
  }

  // ============================================================
  // MENSAGEM DE SUCESSO
  // ============================================================
  function mostrarMensagemSucesso() {
    if (reviewContent) {
      reviewContent.innerHTML = `
        <div style="text-align: center; padding: 40px 20px;">
          <i class="fas fa-check-circle" style="font-size: 4rem; color: #4ade80; margin-bottom: 20px;"></i>
          <h3 style="font-family: var(--font-title); font-size: 1.8rem;">Briefing enviado com sucesso!</h3>
          <p style="color: var(--text-secondary); margin-top: 8px;">
            Agradecemos pelo seu contato. Em breve entraremos em contato.
          </p>
          <button onclick="location.reload()" class="btn btn-secondary" style="margin-top: 24px;">
            <i class="fas fa-plus"></i> NOVO BRIEFING
          </button>
        </div>
      `;
    }
    btnEnviar.style.display = 'none';
  }

  // ============================================================
  // MENSAGEM DE ERRO
  // ============================================================
  function mostrarMensagemErro(mensagem) {
    if (reviewContent) {
      reviewContent.innerHTML = `
        <div style="text-align: center; padding: 40px 20px;">
          <i class="fas fa-exclamation-circle" style="font-size: 4rem; color: #f87171; margin-bottom: 20px;"></i>
          <h3 style="font-family: var(--font-title); font-size: 1.8rem;">Ops! Algo deu errado.</h3>
          <p style="color: var(--text-secondary); margin-top: 8px;">
            Não foi possível enviar seu briefing. Tente novamente ou entre em contato diretamente.
          </p>
          <p style="color: var(--text-secondary); font-size: 0.85rem; margin-top: 8px;">
            Detalhe técnico: ${mensagem}
          </p>
          <button onclick="location.reload()" class="btn btn-primary" style="margin-top: 24px;">
            <i class="fas fa-redo"></i> TENTAR NOVAMENTE
          </button>
        </div>
      `;
    }
    btnEnviar.style.display = 'none';
  }

  // ============================================================
  // START
  // ============================================================
  init();
});