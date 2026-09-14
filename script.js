/* =========================================================
   CLOUD PHONE — SCRIPT
   JavaScript puro, sem dependências externas.
   Responsável por:
   1. Menu responsivo (abrir/fechar no celular)
   2. Rolagem suave ao clicar nos links do menu
   3. Validação básica do formulário de login (demonstração)
   4. Links "Criar uma conta" e "Esqueci minha senha" (demonstração)
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  /* -----------------------------------------
     1. MENU RESPONSIVO (MOBILE)
  ------------------------------------------ */
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("nav");

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", function () {
      const isOpen = nav.classList.toggle("is-open");
      menuToggle.classList.toggle("is-active", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
    });

    // Fecha o menu automaticamente ao clicar em um link (no celular)
    nav.querySelectorAll(".nav__link").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        menuToggle.classList.remove("is-active");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menu");
      });
    });
  }

  /* -----------------------------------------
     2. ROLAGEM SUAVE ENTRE SEÇÕES
     (o CSS já define scroll-behavior: smooth,
     este trecho garante compatibilidade e o
     comportamento correto em navegadores mais
     antigos que respeitam apenas o JS)
  ------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (event) {
      const targetId = this.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      event.preventDefault();
      targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  /* -----------------------------------------
     3. VALIDAÇÃO DO FORMULÁRIO DE LOGIN
     Isto é apenas uma DEMONSTRAÇÃO de interface.
     Não existe autenticação real: nenhum dado
     é enviado a um servidor.
  ------------------------------------------ */
  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const senhaInput = document.getElementById("senha");
  const emailError = document.getElementById("emailError");
  const senhaError = document.getElementById("senhaError");
  const formFeedback = document.getElementById("formFeedback");

  // Expressão simples para validar formato de e-mail
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setFieldError(inputEl, errorEl, message) {
    if (message) {
      inputEl.classList.add("is-invalid");
      errorEl.textContent = message;
    } else {
      inputEl.classList.remove("is-invalid");
      errorEl.textContent = "";
    }
  }

  function validateEmail() {
    const value = emailInput.value.trim();

    if (value === "") {
      setFieldError(emailInput, emailError, "Digite seu e-mail.");
      return false;
    }
    if (!EMAIL_REGEX.test(value)) {
      setFieldError(emailInput, emailError, "Digite um e-mail válido.");
      return false;
    }
    setFieldError(emailInput, emailError, "");
    return true;
  }

  function validateSenha() {
    const value = senhaInput.value;

    if (value === "") {
      setFieldError(senhaInput, senhaError, "Digite sua senha.");
      return false;
    }
    if (value.length < 6) {
      setFieldError(senhaInput, senhaError, "A senha deve ter pelo menos 6 caracteres.");
      return false;
    }
    setFieldError(senhaInput, senhaError, "");
    return true;
  }

  // Valida em tempo real, assim que o usuário sai do campo
  if (emailInput) emailInput.addEventListener("blur", validateEmail);
  if (senhaInput) senhaInput.addEventListener("blur", validateSenha);

  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const isEmailValid = validateEmail();
      const isSenhaValid = validateSenha();

      if (isEmailValid && isSenhaValid) {
        // Demonstração apenas: não há autenticação real.
        formFeedback.textContent =
          "Tudo certo! Esta é apenas uma demonstração — em breve você poderá acessar seu Cloud Phone de verdade. ☁️";
        loginForm.reset();
      } else {
        formFeedback.textContent = "Verifique os campos destacados antes de continuar.";
      }
    });
  }

  /* -----------------------------------------
     4. LINKS "CRIAR CONTA" E "ESQUECI SENHA"
     Também apenas demonstrativos por enquanto.
  ------------------------------------------ */
  const linkCriarConta = document.getElementById("linkCriarConta");
  const linkEsqueciSenha = document.getElementById("linkEsqueciSenha");

  if (linkCriarConta) {
    linkCriarConta.addEventListener("click", function (event) {
      event.preventDefault();
      formFeedback.textContent =
        "O cadastro de novas contas chega em breve. Fique de olho! 🚀";
    });
  }

  if (linkEsqueciSenha) {
    linkEsqueciSenha.addEventListener("click", function (event) {
      event.preventDefault();
      formFeedback.textContent =
        "A recuperação de senha ainda não está disponível nesta demonstração.";
    });
  }

  /* -----------------------------------------
     5. CABEÇALHO: leve sombra ao rolar a página
  ------------------------------------------ */
  const header = document.getElementById("header");
  if (header) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 10) {
        header.style.boxShadow = "0 10px 30px -20px rgba(0,0,0,0.6)";
      } else {
        header.style.boxShadow = "none";
      }
    });
  }

});
