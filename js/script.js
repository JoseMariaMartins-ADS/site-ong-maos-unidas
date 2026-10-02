// NAVEGAÇÃO SPA
const conteudoPrincipal = document.querySelector("#conteudo-principal");

if (conteudoPrincipal) {
  // Guarda o conteúdo inicial antes de trocar de tela.
  const templates = {
    inicio: conteudoPrincipal.innerHTML,

        projetos: `
      <section class="grade-projetos">
        <h2>Iniciativas solidárias</h2>

        ${[
          {
            id: "alimentos",
            titulo: "Arrecadação de alimentos",
            categoria: "Alimentação",
            descricao: "Recolhemos alimentos para ajudar famílias da comunidade."
          },
          {
            id: "apoio",
            titulo: "Apoio escolar",
            categoria: "Educação",
            descricao: "Voluntários ajudam crianças em suas atividades escolares."
          }
        ].map(function (projeto) {
          return `
            <article id="${projeto.id}">
              <h3>${projeto.titulo}</h3>
              <span class="badge">${projeto.categoria}</span>
              <p>${projeto.descricao}</p>
            </article>
          `;
        }).join("")}
      </section>
    `,

    cadastro: `
      <section>
        <h2>Cadastro de voluntários</h2>
        <p>Preencha seus dados para participar dos nossos projetos.</p>

        <div class="alerta">
          <strong>Atenção:</strong>
          Todos os campos são obrigatórios. Confira seus dados
          antes de enviar o cadastro.
        </div>

        <form>
          <fieldset>
            <legend>Dados pessoais</legend>

            <label for="nome">Nome completo:</label>
            <input type="text" id="nome" name="nome" required>

            <label for="email">E-mail:</label>
            <input type="email" id="email" name="email" autocomplete="email" required>

            <p>
              <label for="cpf">CPF:</label>
              <input type="text" id="cpf" name="cpf"
                placeholder="000.000.000-00"
                pattern="[0-9]{3}\\.[0-9]{3}\\.[0-9]{3}-[0-9]{2}"
                title="Digite o CPF no formato 000.000.000-00"
                required>
            </p>
          </fieldset>

          <fieldset>
            <legend>Contato e endereço</legend>

            <p>
              <label for="telefone">Telefone:</label>
              <input type="tel" id="telefone" name="telefone"
                placeholder="(00) 00000-0000"
                pattern="\\([0-9]{2}\\) [0-9]{5}-[0-9]{4}"
                title="Digite o telefone no formato (00) 00000-0000"
                required>
            </p>

            <p>
              <label for="cep">CEP:</label>
              <input type="text" id="cep" name="cep"
                placeholder="00000-000"
                pattern="[0-9]{5}-[0-9]{3}"
                title="Digite o CEP no formato 00000-000"
                required>
            </p>
          </fieldset>

          <button type="submit">Enviar cadastro</button>
        </form>
      </section>
    `
  };

  const destinos = {
    "index.html": "#inicio",
    "projetos.html": "#projetos",
    "projetos.html#alimentos": "#projetos/alimentos",
    "projetos.html#apoio": "#projetos/apoio",
    "cadastro.html": "#cadastro"
  };

  function ajustarLinks() {
    document.querySelectorAll("a[href]").forEach(function (link) {
      const destino = destinos[link.getAttribute("href")];

      if (destino) {
        link.setAttribute("href", destino);
      }
    });
  }

  function renderizar() {
    const [rotaSolicitada, secao] =
      location.hash.slice(1).split("/");

    const rota = Object.hasOwn(templates, rotaSolicitada)
      ? rotaSolicitada
      : "inicio";

    // Substitui somente o conteúdo da área central.
        conteudoPrincipal.innerHTML = templates[rota];
restaurarRascunho();
ajustarLinks();
    ajustarLinks();

    const titulos = {
      inicio: "ONG Mãos Unidas",
      projetos: "Projetos | ONG Mãos Unidas",
      cadastro: "Cadastro | ONG Mãos Unidas"
    };

    document.title = titulos[rota];

    const toast = document.querySelector("#toast-cadastro");
    if (toast) toast.hidden = true;

    if (menuPrincipal && botaoMenu) {
      menuPrincipal.classList.remove("aberto");
      botaoMenu.setAttribute("aria-expanded", "false");
      botaoMenu.setAttribute("aria-label", "Abrir menu");
      menuPrincipal.querySelectorAll("details").forEach(function (item) {
        item.open = false;
      });
    }

    const alvo = rota === "projetos" &&
      (secao === "alimentos" || secao === "apoio")
      ? document.getElementById(secao)
      : null;

    const foco = alvo || conteudoPrincipal.querySelector("h2");

    if (foco) {
      foco.setAttribute("tabindex", "-1");
      foco.focus({ preventScroll: true });
    }

    if (alvo) {
      alvo.scrollIntoView({ block: "start" });
    } else {
      window.scrollTo(0, 0);
    }
  }

  window.addEventListener("hashchange", renderizar);
  renderizar();
}
// Leva o foco ao conteúdo sem alterar a rota da SPA.
document.querySelector(".pular-conteudo")?.addEventListener("click", function (evento) {
  evento.preventDefault();

  const conteudo = document.querySelector("#conteudo-principal");

  if (conteudo) {
    conteudo.focus({ preventScroll: true });
    conteudo.scrollIntoView({ block: "start" });
  }
});
// BOTÃO E PREFERÊNCIA DE ALTO CONTRASTE
(function () {
  const cabecalho = document.querySelector("header");

  if (!cabecalho) {
    return;
  }

  const chaveContraste = "maos-unidas-alto-contraste";
  const botao = document.createElement("button");

  botao.type = "button";
  botao.className = "botao-contraste";
  botao.textContent = "Alto contraste";
  botao.setAttribute("aria-pressed", "false");

  cabecalho.appendChild(botao);

  function aplicarContraste(ativado) {
    document.body.classList.toggle("alto-contraste", ativado);
    botao.setAttribute("aria-pressed", String(ativado));
  }

  try {
    aplicarContraste(localStorage.getItem(chaveContraste) === "true");
  } catch {
    aplicarContraste(false);
  }

  botao.addEventListener("click", function () {
    const ativado = !document.body.classList.contains("alto-contraste");

    aplicarContraste(ativado);

    try {
      localStorage.setItem(chaveContraste, String(ativado));
    } catch {
      // O botão continua funcionando se o armazenamento estiver bloqueado.
    }
  });
})();