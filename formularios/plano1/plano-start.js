/* ==========================================================================
   DEV RUBY — Briefing START
   plano-start.js
   --------------------------------------------------------------------------
   Toda a lógica original foi preservada:
   - avançar / voltar etapa
   - barra de progresso
   - validação de campos obrigatórios
   - seleção de opções (radio / checkbox)
   - campo condicional (site_url)
   - Netlify Forms + honeypot
   - envio assíncrono
   - mensagem de sucesso
   - geração do link de WhatsApp
   ========================================================================== */

(function () {
  "use strict";

  /* =========================================================================
     CONFIGURAÇÃO
     -------------------------------------------------------------------------
     Ajuste apenas o número do WhatsApp oficial da Dev Ruby.
     Formato: DDI + DDD + número (somente dígitos, sem símbolos).
     Exemplo: "5511999999999"
     ========================================================================= */
  var CONFIG = {
    whatsapp: "5511999999999" // <-- SUBSTITUA pelo número oficial
  };

  /* =========================================================================
     ELEMENTOS
     ========================================================================= */

  var form = document.getElementById("form-plano-start");
  if (!form) return;

  var steps = Array.prototype.slice.call(form.querySelectorAll(".step"));
  var TOTAL = steps.length; // 10 (9 etapas + revisão)

  var elFill    = document.getElementById("progress-fill");
  var elCurrent = document.getElementById("progress-current");
  var elTotal   = document.getElementById("progress-total");
  var elStage   = document.getElementById("progress-stage");

  var btnPrev   = document.getElementById("btn-prev");
  var btnNext   = document.getElementById("btn-next");
  var btnSubmit = document.getElementById("btn-submit");
  var formAlert = document.getElementById("form-alert");

  var successBox  = document.getElementById("success");
  var btnWhatsapp = document.getElementById("btn-whatsapp");
  var summaryList = document.getElementById("summary-list");

  var stageEl     = document.querySelector(".stage");
  var siteUrlField = form.querySelector('[data-field="site_url"]');

  /* =========================================================================
     MAPAS
     ========================================================================= */

  var STAGE_LABELS = [
    "Conhecendo você",
    "Seu negócio",
    "A solução",
    "Objetivos",
    "Materiais",
    "Visão do projeto",
    "Prazo",
    "Referências",
    "Detalhes finais",
    "Revisão final"
  ];

  var FIELD_LABELS = {
    nome: "Nome",
    whatsapp: "WhatsApp",
    email: "E-mail",
    empresa: "Empresa",
    segmento: "Segmento",
    rede_social: "Rede social",
    possui_site: "Já possui site",
    site_url: "Site atual",
    solucao: "Solução desejada",
    objetivos: "Objetivos",
    materiais: "Materiais",
    identidade_visual: "Identidade visual",
    descricao: "Sobre o projeto",
    prazo: "Prazo",
    referencia: "Referência",
    observacoes: "Observações"
  };

  var FIELD_STEP = {
    nome: 0,
    whatsapp: 0,
    email: 0,
    empresa: 1,
    segmento: 1,
    rede_social: 1,
    possui_site: 1,
    site_url: 1,
    solucao: 2,
    objetivos: 3,
    materiais: 4,
    identidade_visual: 4,
    descricao: 5,
    prazo: 6,
    referencia: 7,
    observacoes: 8
  };

  var SKIP_FIELDS = {
    "form-name": true,
    "bot-field": true,
    "plano": true,
    "investimento": true,
    "inclusos": true
  };

  /* =========================================================================
     ESTADO
     ========================================================================= */

  var current = 0;
  var sending = false;
  var firstRender = true;

  /* =========================================================================
     HELPERS DE VALIDAÇÃO
     ========================================================================= */

  function isEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
  }

  function isPhone(v) {
    var digits = v.replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 11;
  }

  function isUrl(v) {
    return /^(https?:\/\/)?[^\s.]+\.[^\s]{2,}$/i.test(v.trim());
  }

  function requiredMessage(control) {
    switch (control.name) {
      case "nome":
        return "Informe seu nome para continuar.";
      case "whatsapp":
        return "Informe seu WhatsApp para continuar.";
      case "descricao":
        return "Conte um pouco sobre o projeto para continuar.";
      default:
        return "Este campo é necessário para continuar.";
    }
  }

  /* =========================================================================
     VALIDAÇÃO DE ETAPA
     ========================================================================= */

  function validateStep(index) {
    var step = steps[index];
    if (!step) return true;

    var fields = Array.prototype.slice.call(step.querySelectorAll(".field"));
    var firstInvalid = null;

    fields.forEach(function (field) {
      var errorEl = field.querySelector("[data-error]");
      var hidden = field.classList.contains("is-hidden");

      field.classList.remove("has-error");
      if (errorEl) errorEl.textContent = "";

      if (hidden) return;

      var controls = Array.prototype.slice.call(
        field.querySelectorAll("input, textarea, select")
      );

      var message = "";

      controls.forEach(function (control) {
        if (control.name === "bot-field") return;
        if (control.type === "radio" || control.type === "checkbox") return;

        var value = (control.value || "").trim();

        if (control.required && !value) {
          message = message || requiredMessage(control);
        } else if (value && control.type === "email" && !isEmail(value)) {
          message = message || "Verifique o e-mail informado.";
        } else if (value && control.type === "tel" && !isPhone(value)) {
          message = message || "Informe um WhatsApp válido, com DDD.";
        } else if (value && control.type === "url" && !isUrl(value)) {
          message = message || "Verifique o endereço informado.";
        }
      });

      if (message) {
        if (errorEl) errorEl.textContent = message;
        field.classList.add("has-error");

        controls.forEach(function (c) {
          if (c.type !== "radio" && c.type !== "checkbox") {
            c.setAttribute("aria-invalid", "true");
          }
        });

        if (!firstInvalid) {
          firstInvalid = field.querySelector("input:not([type=hidden]), textarea");
        }
      } else {
        controls.forEach(function (c) {
          c.removeAttribute("aria-invalid");
        });
      }
    });

    if (firstInvalid) {
      firstInvalid.focus();
      return false;
    }

    return true;
  }

  /* =========================================================================
     RENDER
     ========================================================================= */

  function render() {
    steps.forEach(function (step, i) {
      step.classList.toggle("is-active", i === current);
    });

    var numero = current + 1;

    if (elCurrent) {
      elCurrent.textContent = ("0" + numero).slice(-2);
    }

    if (elFill) {
      var pct = Math.round((numero / TOTAL) * 100);
      elFill.style.width = pct + "%";
    }

    if (elStage) {
      elStage.textContent = STAGE_LABELS[current] || "";
    }

    if (btnPrev)   btnPrev.hidden   = current === 0;
    if (btnNext)   btnNext.hidden   = current === TOTAL - 1;
    if (btnSubmit) btnSubmit.hidden = current !== TOTAL - 1;

    if (formAlert) {
      formAlert.textContent = "";
      formAlert.classList.remove("is-visible");
    }
  }

  /* =========================================================================
     NAVEGAÇÃO
     ========================================================================= */

  function scrollToStage() {
    if (firstRender) return;
    if (window.innerWidth > 960) return;
    if (!stageEl) return;

    var rect = stageEl.getBoundingClientRect();
    var target = rect.top + window.scrollY - 24;

    if (Math.abs(window.scrollY - target) > 80) {
      window.scrollTo({ top: target, behavior: "smooth" });
    }
  }

  function goTo(index) {
    if (index < 0 || index >= TOTAL) return;

    current = index;

    if (current === TOTAL - 1) {
      buildSummary();
    }

    render();
    scrollToStage();
  }

  function nextStep() {
    if (!validateStep(current)) return;
    goTo(current + 1);
  }

  function prevStep() {
    goTo(current - 1);
  }

  /* =========================================================================
     MÁSCARA DE WHATSAPP
     ========================================================================= */

  function maskPhone(value) {
    var d = String(value).replace(/\D/g, "").slice(0, 11);

    if (d.length === 0) return "";
    if (d.length <= 2) return "(" + d;
    if (d.length <= 6) return "(" + d.slice(0, 2) + ") " + d.slice(2);
    if (d.length <= 10) {
      return "(" + d.slice(0, 2) + ") " + d.slice(2, 6) + "-" + d.slice(6);
    }
    return "(" + d.slice(0, 2) + ") " + d.slice(2, 7) + "-" + d.slice(7);
  }

  var whatsappInput = document.getElementById("whatsapp");
  if (whatsappInput) {
    whatsappInput.addEventListener("input", function (e) {
      e.target.value = maskPhone(e.target.value);
    });
  }

  /* =========================================================================
     CAMPO CONDICIONAL — site_url
     ========================================================================= */

  var siteRadios = form.querySelectorAll('input[name="possui_site"]');

  Array.prototype.forEach.call(siteRadios, function (radio) {
    radio.addEventListener("change", function () {
      if (!siteUrlField) return;

      var checked = form.querySelector('input[name="possui_site"]:checked');
      var mostrar = !!checked && checked.value === "Sim";

      siteUrlField.classList.toggle("is-hidden", !mostrar);

      if (!mostrar) {
        var inp = siteUrlField.querySelector("input");
        if (inp) {
          inp.value = "";
          inp.removeAttribute("aria-invalid");
        }
        siteUrlField.classList.remove("has-error");
        var err = siteUrlField.querySelector("[data-error]");
        if (err) err.textContent = "";
      }
    });
  });

  /* =========================================================================
     RESUMO (ETAPA 10)
     ========================================================================= */

  function buildSummary() {
    if (!summaryList) return;

    var data = new FormData(form);
    var grouped = {};

    data.forEach(function (value, key) {
      if (SKIP_FIELDS[key]) return;

      var v = String(value == null ? "" : value).trim();
      if (!v) return;

      if (!grouped[key]) grouped[key] = [];
      if (grouped[key].indexOf(v) === -1) grouped[key].push(v);
    });

    summaryList.innerHTML = "";

    var keys = Object.keys(FIELD_LABELS);
    var rendered = 0;

    keys.forEach(function (key) {
      var values = grouped[key];
      if (!values || !values.length) return;

      rendered++;

      var row = document.createElement("div");
      row.className = "summary-row";

      var label = document.createElement("p");
      label.className = "summary-key";
      label.textContent = FIELD_LABELS[key];

      var value = document.createElement("p");
      value.className = "summary-value";
      value.textContent = values.join(" · ");

      row.appendChild(label);
      row.appendChild(value);

      var stepIndex = FIELD_STEP[key];
      if (typeof stepIndex === "number") {
        var edit = document.createElement("button");
        edit.type = "button";
        edit.className = "summary-edit";
        edit.textContent = "Editar";
        edit.setAttribute("aria-label", "Editar " + FIELD_LABELS[key]);
        edit.addEventListener("click", function () {
          goTo(stepIndex);
        });
        row.appendChild(edit);
      }

      summaryList.appendChild(row);
    });

    if (!rendered) {
      var empty = document.createElement("p");
      empty.className = "summary-empty";
      empty.textContent = "Você ainda não preencheu informações nesta etapa.";
      summaryList.appendChild(empty);
    }
  }

  /* =========================================================================
     WHATSAPP
     ========================================================================= */

  function buildWhatsappLink() {
    if (!btnWhatsapp) return;

    var data = new FormData(form);

    function v(key) {
      var value = data.get(key);
      return value == null ? "" : String(value).trim();
    }

    function all(key) {
      return data.getAll(key)
        .map(function (item) { return String(item).trim(); })
        .filter(Boolean);
    }

    var linhas = [];

    linhas.push("*Briefing — Projeto START*");
    linhas.push("");
    linhas.push("*Nome:* " + v("nome"));

    if (v("email"))       linhas.push("*E-mail:* " + v("email"));
    if (v("whatsapp"))    linhas.push("*WhatsApp:* " + v("whatsapp"));
    if (v("empresa"))     linhas.push("*Empresa:* " + v("empresa"));
    if (v("segmento"))    linhas.push("*Segmento:* " + v("segmento"));
    if (v("rede_social")) linhas.push("*Rede social:* " + v("rede_social"));

    if (v("possui_site")) {
      linhas.push(
        "*Já possui site:* " + v("possui_site") +
        (v("site_url") ? " — " + v("site_url") : "")
      );
    }

    if (v("solucao")) linhas.push("*Solução:* " + v("solucao"));

    var objetivos = all("objetivos");
    if (objetivos.length) {
      linhas.push("*Objetivos:* " + objetivos.join(", "));
    }

    if (v("materiais"))         linhas.push("*Materiais:* " + v("materiais"));
    if (v("identidade_visual")) linhas.push("*Identidade visual:* " + v("identidade_visual"));

    if (v("descricao")) {
      linhas.push("");
      linhas.push("*Sobre o projeto:*");
      linhas.push(v("descricao"));
    }

    if (v("prazo"))      linhas.push("*Prazo:* " + v("prazo"));
    if (v("referencia")) linhas.push("*Referência:* " + v("referencia"));

    if (v("observacoes")) {
      linhas.push("");
      linhas.push("*Observações:*");
      linhas.push(v("observacoes"));
    }

    var texto = encodeURIComponent(linhas.join("\n"));
    var numero = String(CONFIG.whatsapp || "").replace(/\D/g, "");

    btnWhatsapp.href = numero
      ? "https://wa.me/" + numero + "?text=" + texto
      : "https://wa.me/?text=" + texto;
  }

  /* =========================================================================
     SUCESSO
     ========================================================================= */

  function showSuccess() {
    form.hidden = true;

    if (successBox) {
      successBox.hidden = false;
      successBox.classList.add("is-visible");
    }

    var rail = document.querySelector(".rail");
    if (rail) rail.classList.add("is-done");

    buildWhatsappLink();

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* =========================================================================
     ENVIO
     ========================================================================= */

  function validateAllSteps() {
    for (var i = 0; i < steps.length - 1; i++) {
      if (!validateStep(i)) {
        goTo(i);
        return false;
      }
    }
    return true;
  }

  function resetSubmitButton() {
    if (!btnSubmit) return;
    btnSubmit.disabled = false;
    var lbl = btnSubmit.querySelector(".btn-label");
    if (lbl) lbl.textContent = "Enviar projeto";
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (sending) return;

    if (!validateAllSteps()) return;

    sending = true;

    if (btnSubmit) {
      btnSubmit.disabled = true;
      var lbl = btnSubmit.querySelector(".btn-label");
      if (lbl) lbl.textContent = "Enviando...";
    }

    var formData = new FormData(form);
    var body = new URLSearchParams();

    formData.forEach(function (value, key) {
      if (key === "bot-field") return;
      body.append(key, value);
    });

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: body.toString()
    })
      .then(function (response) {
        if (!response.ok) throw new Error("Falha no envio");
        showSuccess();
      })
      .catch(function () {
        sending = false;
        resetSubmitButton();

        if (formAlert) {
          formAlert.textContent =
            "Não conseguimos enviar agora. Verifique sua conexão e tente novamente.";
          formAlert.classList.add("is-visible");
        }
      });
  });

  /* =========================================================================
     ENTER AVANÇA
     ========================================================================= */

  form.addEventListener("keydown", function (event) {
    if (event.key !== "Enter") return;
    if (event.target.tagName === "TEXTAREA") return;
    if (event.target.type === "submit") return;

    event.preventDefault();

    if (current < TOTAL - 1) {
      nextStep();
    } else {
      form.requestSubmit();
    }
  });

  /* =========================================================================
     BOTÕES
     ========================================================================= */

  if (btnNext) btnNext.addEventListener("click", nextStep);
  if (btnPrev) btnPrev.addEventListener("click", prevStep);

  /* =========================================================================
     INIT
     ========================================================================= */

  if (elTotal) {
    elTotal.textContent = ("0" + TOTAL).slice(-2);
  }

  render();

  window.setTimeout(function () {
    firstRender = false;
  }, 120);

})();