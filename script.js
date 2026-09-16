/* =========================================================
   CLOUD PHONE — SCRIPT
   JavaScript puro, sem dependências externas.
   Responsável por:
   1. Menu responsivo (abrir/fechar no celular)
   2. Rolagem suave ao clicar nos links do menu
   3. Autenticação real com Firebase (login e cadastro)
   4. Links "Criar uma conta" e "Esqueci minha senha"
   5. Botão "Sair da conta"
   6. Sombra no cabeçalho ao rolar a página
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
     3. AUTENTICAÇÃO REAL COM FIREBASE
     Login e cadastro de verdade, usando o
     Firebase Authentication (e-mail/senha).
  ------------------------------------------ */
  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const senhaInput = document.getElementById("senha");
  const emailError = document.getElementById("emailError");
  const senhaError = document.getElementById("senhaError");
  const formFeedback = document.getElementById("formFeedback");
  const authFormTitle = document.getElementById("authFormTitle");
  const authSubmitBtn = document.getElementById("authSubmitBtn");
  const linkCriarConta = document.getElementById("linkCriarConta");
  const linkEsqueciSenha = document.getElementById("linkEsqueciSenha");
  const authLoggedPanel = document.getElementById("authLoggedPanel");
  const loggedEmail = document.getElementById("loggedEmail");
  const logoutBtn = document.getElementById("logoutBtn");

  // Expressão simples para validar formato de e-mail
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // "login" = entrar em uma conta já existente
  // "cadastro" = criar uma conta nova
  let modoAtual = "login";

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

  // Alterna a aparência do formulário entre "Entrar" e "Criar conta"
  function alternarModo(novoModo) {
    modoAtual = novoModo;
    formFeedback.textContent = "";

    if (modoAtual === "cadastro") {
      authFormTitle.textContent = "Criar uma conta";
      authSubmitBtn.textContent = "Criar minha conta";
      linkCriarConta.textContent = "Já tenho conta — Entrar";
    } else {
      authFormTitle.textContent = "Entrar na conta";
      authSubmitBtn.textContent = "Entrar na minha conta";
      linkCriarConta.textContent = "Criar uma conta";
    }
  }

  // Traduz os códigos de erro do Firebase para mensagens amigáveis
  function traduzirErroFirebase(erro) {
    switch (erro.code) {
      case "auth/invalid-email":
        return "Esse e-mail não parece válido.";
      case "auth/user-not-found":
        return "Não encontramos uma conta com esse e-mail.";
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return "E-mail ou senha incorretos.";
      case "auth/email-already-in-use":
        return "Já existe uma conta com esse e-mail. Tente entrar.";
      case "auth/weak-password":
        return "Escolha uma senha com pelo menos 6 caracteres.";
      case "auth/too-many-requests":
        return "Muitas tentativas seguidas. Aguarde um pouco e tente de novo.";
      default:
        return "Não foi possível concluir. Tente novamente em instantes.";
    }
  }

  // Mostra o painel de "logado" e esconde o formulário
  function mostrarUsuarioLogado(user) {
    loginForm.hidden = true;
    authLoggedPanel.hidden = false;
    loggedEmail.textContent = user.email;
  }

  // Mostra o formulário de login/cadastro e esconde o painel de logado
  function mostrarFormulario() {
    authLoggedPanel.hidden = true;
    loginForm.hidden = false;
  }

  // Fica de olho no estado de login (persiste ao recarregar a página)
  if (window.firebase && firebase.auth) {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        mostrarUsuarioLogado(user);
      } else {
        mostrarFormulario();
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const isEmailValid = validateEmail();
      const isSenhaValid = validateSenha();

      if (!isEmailValid || !isSenhaValid) {
        formFeedback.textContent = "Verifique os campos destacados antes de continuar.";
        return;
      }

      const email = emailInput.value.trim();
      const senha = senhaInput.value;

      authSubmitBtn.disabled = true;
      formFeedback.textContent = "Só um instante...";

      const acao =
        modoAtual === "cadastro"
          ? firebase.auth().createUserWithEmailAndPassword(email, senha)
          : firebase.auth().signInWithEmailAndPassword(email, senha);

      acao
        .then(function (credencial) {
          formFeedback.textContent = "";
          loginForm.reset();
          mostrarUsuarioLogado(credencial.user);
        })
        .catch(function (erro) {
          formFeedback.textContent = traduzirErroFirebase(erro);
        })
        .finally(function () {
          authSubmitBtn.disabled = false;
        });
    });
  }

  /* -----------------------------------------
     4. LINKS "CRIAR CONTA" / "ENTRAR" E
     "ESQUECI MINHA SENHA"
  ------------------------------------------ */
  if (linkCriarConta) {
    linkCriarConta.addEventListener("click", function (event) {
      event.preventDefault();
      alternarModo(modoAtual === "cadastro" ? "login" : "cadastro");
    });
  }

  if (linkEsqueciSenha) {
    linkEsqueciSenha.addEventListener("click", function (event) {
      event.preventDefault();
      const email = emailInput.value.trim();

      if (!EMAIL_REGEX.test(email)) {
        formFeedback.textContent = "Digite seu e-mail no campo acima primeiro, depois clique aqui de novo.";
        emailInput.focus();
        return;
      }

      firebase
        .auth()
        .sendPasswordResetEmail(email)
        .then(function () {
          formFeedback.textContent = "Enviamos um e-mail para você redefinir sua senha. ✉️";
        })
        .catch(function (erro) {
          formFeedback.textContent = traduzirErroFirebase(erro);
        });
    });
  }

  /* -----------------------------------------
     5. BOTÃO "SAIR DA CONTA"
  ------------------------------------------ */
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      firebase.auth().signOut();
    });
  }

  /* -----------------------------------------
     6. CABEÇALHO: leve sombra ao rolar a página
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
