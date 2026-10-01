document.addEventListener("input", function (evento) {
  const campo = evento.target;

    if (campo.id === "cpf") {
    const numeros = campo.value.replace(/[^0-9]/g, "").slice(0, 11);
    let resultado = numeros.slice(0, 3);

    if (numeros.length > 3) {
      resultado += "." + numeros.slice(3, 6);
    }

    if (numeros.length > 6) {
      resultado += "." + numeros.slice(6, 9);
    }

    if (numeros.length > 9) {
      resultado += "-" + numeros.slice(9, 11);
    }

    campo.value = resultado;
  }

  if (campo.id === "cep") {
    campo.value = campo.value
      .replace(/\D/g, "")
      .slice(0, 8)
      .replace(/^(\d{5})(\d)/, "$1-$2");
  }

  if (campo.id === "telefone") {
    const numeros = campo.value.replace(/\D/g, "").slice(0, 11);

    campo.value = numeros
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
  }
});

// MENSAGEM DO CADASTRO
function mostrarMensagemCadastro() {
  let toast = document.querySelector("#toast-cadastro");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast-cadastro";
    toast.className = "toast";
    toast.hidden = true;

    toast.innerHTML = `
      <p id="mensagem-toast" role="status" aria-live="polite"></p>
      <button id="fechar-toast" type="button"
        aria-label="Fechar mensagem">Fechar</button>
    `;

    document.body.appendChild(toast);
  }

  toast.hidden = false;
  toast.querySelector("#mensagem-toast").textContent =
    "Formulário preenchido com sucesso! Este cadastro é uma demonstração; os dados não foram enviados.";
}

document.addEventListener("submit", function (evento) {
  const formulario = evento.target;

  if (!formulario.matches("form") ||
      !formulario.querySelector("#cpf")) {
    return;
  }

  evento.preventDefault();

  if (!formulario.reportValidity()) {
    return;
  }

  mostrarMensagemCadastro();
  formulario.reset();
});

document.addEventListener("click", function (evento) {
  if (!evento.target.closest("#fechar-toast")) {
    return;
  }

  const toast = document.querySelector("#toast-cadastro");
  if (toast) toast.hidden = true;

  document.querySelector('form button[type="submit"]')?.focus();
});

// AVISOS DE VALIDAÇÃO JUNTO AOS CAMPOS
function atualizarAviso(campo) {
  const formulario = campo.closest("form");

  if (!formulario || !formulario.querySelector("#cpf")) {
    return;
  }

  const idAviso = "erro-" + campo.id;
  let aviso = document.getElementById(idAviso);

  if (!aviso) {
    aviso = document.createElement("p");
    aviso.id = idAviso;
    aviso.className = "erro-campo";
    aviso.style.color = "#b42318";
    aviso.setAttribute("aria-live", "polite");
    campo.insertAdjacentElement("afterend", aviso);

    const descricao = campo.getAttribute("aria-describedby") || "";
    campo.setAttribute(
      "aria-describedby",
      (descricao + " " + idAviso).trim()
    );
  }

  const invalido = !campo.validity.valid;
  campo.setAttribute("aria-invalid", String(invalido));
  campo.classList.toggle("campo-invalido", invalido);
  campo.style.borderColor = invalido ? "#b42318" : "";

  if (!invalido) {
    aviso.textContent = "";
  } else if (campo.validity.valueMissing) {
    aviso.textContent = "Preencha este campo.";
  } else if (campo.validity.typeMismatch) {
    aviso.textContent = "Digite um e-mail válido, como nome@exemplo.com.";
  } else if (campo.validity.patternMismatch) {
    aviso.textContent = campo.title || "Confira o formato deste campo.";
  } else {
    aviso.textContent = campo.validationMessage;
  }
}

// O evento invalid precisa ser capturado para chegar ao document.
document.addEventListener("invalid", function (evento) {
  atualizarAviso(evento.target);
}, true);

// Atualiza o aviso enquanto o usuário corrige o preenchimento.
document.addEventListener("input", function (evento) {
  const campo = evento.target;

  if (campo.matches("input") &&
      campo.hasAttribute("aria-invalid")) {
    atualizarAviso(campo);
  }
});
