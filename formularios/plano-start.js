/* ============================================================
   PROJETO START — Briefing Multi-etapas
   Dev Ruby
   ============================================================ */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    const form = document.getElementById("form-plano-start");
    if (!form) return;

    const steps = Array.from(form.querySelectorAll(".step"));
    const totalSteps = steps.length;

    const progressLabel = document.getElementById("progress-label");
    const progressPercent = document.getElementById("progress-percent");
    const progressFill = document.getElementById("progress-fill");
    const progressBar = document.getElementById("progress");

    const card = document.getElementById("card");

    let currentStep = 0;
    let isSubmitting = false;

    /* ==========================================================
       CRIA OS BOTÕES DE NAVEGAÇÃO + TELA DE SUCESSO
       ========================================================== */
    const stepNav = document.createElement("div");
    stepNav.className = "step-nav";
    stepNav.innerHTML = `
      <button type="button" class="btn btn-ghost" id="btn-prev">Voltar</button>
      <button type="button" class="btn btn-primary" id="btn-next">Continuar</button>
    `;
    form.appendChild(stepNav);

    const btnPrev = stepNav.querySelector("#btn-prev");
    const btnNext = stepNav.querySelector("#btn-next");

    const successScreen = document.createElement("div");
    successScreen.className = "success-screen";
    successScreen.innerHTML = `
      <div class="success-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="3"
             stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      <h2 class="success-title">Briefing enviado com sucesso!</h2>
      <p class="success-text">
        Recebemos todas as informações do seu Projeto START.
        Em breve entraremos em contato pelo WhatsApp para os próximos passos.
      </p>
      <span class="success-badge">Dev Ruby • Projeto START</span>
    `;
    card.appendChild(successScreen);

    /* ==========================================================
       RENDERIZA A ETAPA ATUAL
       ========================================================== */
    function renderStep(index) {
      steps.forEach((step, i) => {
        step.classList.toggle("is-active", i === index);
      });

      const humanIndex = index + 1;
      const pct = Math.round((humanIndex / totalSteps) * 100);

      progressLabel.textContent = `Etapa ${String(humanIndex).padStart(2, "0")} de ${String(totalSteps).padStart(2, "0")}`;
      progressPercent.textContent = `${pct}%`;
      progressFill.style.width = `${pct}%`;

      btnPrev.disabled = index === 0;
      btnNext.textContent = index === totalSteps - 1 ? "Enviar briefing" : "Continuar";
      btnNext.classList.toggle("is-final", index === totalSteps - 1);

      // Foco acessível no primeiro input
      const firstInput = steps[index].querySelector("input, textarea");
      if (firstInput && window.innerWidth > 640) {
        setTimeout(() => firstInput.focus({ preventScroll: true }), 60);
      }

      // Rola para o card em telas pequenas
      if (window.innerWidth <= 640) {
        card.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }

    /* ==========================================================
       NAVEGAÇÃO
       ========================================================== */
    btnNext.addEventListener("click", () => {
      if (!validateStep(currentStep)) return;

      if (currentStep < totalSteps - 1) {
        currentStep++;
        renderStep(currentStep);
      } else {
        submitForm();
      }
    });

    btnPrev.addEventListener("click", () => {
      if (currentStep > 0) {
        currentStep--;
        renderStep(currentStep);
      }
    });

    /* Enter avança (exceto em textarea) */
    form.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && e.target.tagName !== "TEXTAREA" && e.target.type !== "submit") {
        e.preventDefault();
        btnNext.click();
      }
    });

    /* ==========================================================
       VALIDAÇÃO
       ========================================================== */
    function validateStep(index) {
      const step = steps[index];
      const fields = step.querySelectorAll(".field");
      let valid = true;
      let firstInvalid = null;

      fields.forEach((field) => {
        // Ignora campos escondidos
        if (field.classList.contains("is-hidden")) return;

        const groupName = field.dataset.field;
        const group = field.querySelector("[data-group]");
        const errorEl = field.querySelector("[data-error]");
        let fieldValid = true;
        let message = "";

        // ---- INPUTS SIMPLES ----
        const directInput = field.querySelector("input:not([type=radio]):not([type=checkbox]), textarea");
        if (directInput && !directInput.disabled && directInput.offsetParent !== null) {
          const value = (directInput.value || "").trim();
          const required = directInput.hasAttribute("required");

          if (required && !value) {
            fieldValid = false;
            message = "Este campo é obrigatório.";
          } else if (value) {
            if (directInput.type === "email" && !isValidEmail(value)) {
              fieldValid = false;
              message = "Informe um e-mail válido.";
            }
            if (directInput.id === "whatsapp" && !isValidPhone(value)) {
              fieldValid = false;
              message = "Informe um WhatsApp válido com DDD.";
            }
            if (directInput.type === "url" && !isValidUrl(value)) {
              fieldValid = false;
              message = "Informe uma URL válida (ex: https://...).";
            }
          }
        }

        // ---- GRUPOS (radio / checkbox) ----
        if (group && group.dataset.requiredGroup === "true") {
          const inputs = group.querySelectorAll("input");
          const anyChecked = Array.from(inputs).some((i) => i.checked);
          if (!anyChecked) {
            fieldValid = false;
            message = group.dataset.type === "checkbox"
              ? "Selecione pelo menos uma opção."
              : "Selecione uma opção.";
          }
        }

        // ---- APLICA ESTADO ----
        if (!fieldValid) {
          field.classList.add("has-error");
          if (errorEl) errorEl.textContent = message;
          valid = false;
          if (!firstInvalid) firstInvalid = field;
        } else {
          field.classList.remove("has-error");
          if (errorEl) errorEl.textContent = "";
        }
      });

      if (!valid && firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
        const input = firstInvalid.querySelector("input, textarea");
        if (input) setTimeout(() => input.focus({ preventScroll: true }), 250);
      }

      return valid;
    }

    /* Limpa erro ao digitar / marcar */
    form.addEventListener("input", (e) => {
      const field = e.target.closest(".field");
      if (field && field.classList.contains("has-error")) {
        field.classList.remove("has-error");
        const errorEl = field.querySelector("[data-error]");
        if (errorEl) errorEl.textContent = "";
      }
    });

    form.addEventListener("change", (e) => {
      const field = e.target.closest(".field");
      if (field && field.classList.contains("has-error")) {
        field.classList.remove("has-error");
        const errorEl = field.querySelector("[data-error]");
        if (errorEl) errorEl.textContent = "";
      }
    });

    /* ==========================================================
       REGRAS ESPECIAIS
       ========================================================== */

    // Mostrar/ocultar campo "site_url" conforme "possui_site"
    const possuiSiteRadios = form.querySelectorAll('input[name="possui_site"]');
    const siteUrlField = form.querySelector('[data-field="site_url"]');
    const siteUrlInput = form.querySelector("#site_url");

    possuiSiteRadios.forEach((radio) => {
      radio.addEventListener("change", () => {
        if (radio.value === "Sim" && radio.checked) {
          siteUrlField.classList.remove("is-hidden");
          siteUrlInput.setAttribute("required", "required");
        } else {
          siteUrlField.classList.add("is-hidden");
          siteUrlInput.removeAttribute("required");
          siteUrlInput.value = "";
          siteUrlField.classList.remove("has-error");
          const err = siteUrlField.querySelector("[data-error]");
          if (err) err.textContent = "";
        }
      });
    });

    // Máscara de WhatsApp
    const whatsappInput = document.getElementById("whatsapp");
    if (whatsappInput) {
      whatsappInput.addEventListener("input", (e) => {
        let v = e.target.value.replace(/\D/g, "").slice(0, 11);
        if (v.length > 0) {
          if (v.length <= 2) v = `(${v}`;
          else if (v.length <= 6) v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
          else if (v.length <= 10) v = `(${v.slice(0, 2)}) ${v.slice(2, 6)}-${v.slice(6)}`;
          else v = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
        }
        e.target.value = v;
      });
    }

    /* ==========================================================
       SUBMIT
       ========================================================== */
    function submitForm() {
      if (isSubmitting) return;

      // Valida TODAS as etapas antes de enviar (segurança extra)
      for (let i = 0; i < totalSteps; i++) {
        if (!validateStep(i)) {
          currentStep = i;
          renderStep(i);
          return;
        }
      }

      isSubmitting = true;
      btnNext.disabled = true;
      btnPrev.disabled = true;
      btnNext.textContent = "Enviando...";

      const formData = new FormData(form);
      const encoded = new URLSearchParams(formData).toString();

      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encoded,
      })
        .then((res) => {
          if (!res.ok) throw new Error("Falha no envio");
          showSuccess();
        })
        .catch((err) => {
          console.error(err);
          isSubmitting = false;
          btnNext.disabled = false;
          btnPrev.disabled = false;
          btnNext.textContent = "Tentar novamente";
          alert("Ocorreu um erro ao enviar. Verifique sua conexão e tente novamente.");
        });
    }

    function showSuccess() {
      steps.forEach((s) => s.classList.remove("is-active"));
      stepNav.style.display = "none";
      if (progressBar) progressBar.style.display = "none";
      successScreen.classList.add("is-active");
      successScreen.scrollIntoView({ behavior: "smooth", block: "center" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    /* ==========================================================
       HELPERS
       ========================================================== */
    function isValidEmail(v) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
    }

    function isValidPhone(v) {
      const digits = v.replace(/\D/g, "");
      return digits.length >= 10 && digits.length <= 11;
    }

    function isValidUrl(v) {
      try {
        const u = new URL(v);
        return u.protocol === "http:" || u.protocol === "https:";
      } catch {
        return false;
      }
    }

    /* ==========================================================
       INICIALIZA
       ========================================================== */
    renderStep(0);
  }
})();