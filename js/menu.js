// CONTROLE DO MENU
const botaoMenu = document.querySelector(".botao-menu");
const menuPrincipal = document.querySelector("#menu-principal");

if (botaoMenu && menuPrincipal) {
  botaoMenu.addEventListener("click", function () {
    const aberto = menuPrincipal.classList.toggle("aberto");

    botaoMenu.setAttribute("aria-expanded", String(aberto));
    botaoMenu.setAttribute(
      "aria-label",
      aberto ? "Fechar menu" : "Abrir menu"
    );
  });
}