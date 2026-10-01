// RETENÇÃO DO RASCUNHO NO NAVEGADOR
const chaveRascunho = "maos-unidas-rascunho";
const camposRascunho = ["nome", "email", "cpf", "telefone", "cep"];

function restaurarRascunho() {
  const formulario = document.querySelector("form");

  if (!formulario || !formulario.querySelector("#cpf")) {
    return;
  }

  try {
    const texto = localStorage.getItem(chaveRascunho);

    if (!texto) return;

    const dados = JSON.parse(texto);

    if (!dados || typeof dados !== "object" || Array.isArray(dados)) {
      return;
    }

    camposRascunho.forEach(function (id) {
      const campo = formulario.querySelector("#" + id);

      if (campo && typeof dados[id] === "string") {
        campo.value = dados[id];
      }
    });
  } catch (erro) {
    console.warn("Não foi possível recuperar o rascunho.", erro);
  }
}

document.addEventListener("input", function (evento) {
  const formulario = evento.target.closest("form");

  if (!formulario || !formulario.querySelector("#cpf")) {
    return;
  }

  const dados = {};

  camposRascunho.forEach(function (id) {
    dados[id] = formulario.querySelector("#" + id).value;
  });

  try {
    localStorage.setItem(chaveRascunho, JSON.stringify(dados));
  } catch (erro) {
    console.warn("Não foi possível salvar o rascunho.", erro);
  }
});

document.addEventListener("reset", function (evento) {
  if (!evento.target.querySelector("#cpf")) return;

  try {
    localStorage.removeItem(chaveRascunho);
  } catch (erro) {
    console.warn("Não foi possível remover o rascunho.", erro);
  }
});

restaurarRascunho();