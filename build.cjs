const fs = require("node:fs/promises");
const path = require("node:path");
const { gzipSync } = require("node:zlib");
const esbuild = require("esbuild");
const { minify } = require("html-minifier-terser");

const raiz = __dirname;
const destino = path.join(raiz, "dist");

const arquivos = [
  "html/index.html",
  "html/projetos.html",
  "html/cadastro.html",
  "css/style.css",
  "js/menu.js",
  "js/formulario.js",
  "js/armazenamento.js",
  "js/script.js"
];

async function prepararSite() {
  // Confere os arquivos antes de gerar a versão otimizada.
  for (const arquivo of arquivos) {
    await fs.access(path.join(raiz, arquivo));
  }

  await fs.access(path.join(raiz, "Imagens/voluntarios.jpg"));

  // Limpa somente a pasta de arquivos gerados.
  await fs.rm(destino, { recursive: true, force: true });

  const relatorio = [];

  for (const arquivo of arquivos) {
    const original = await fs.readFile(
      path.join(raiz, arquivo),
      "utf8"
    );

    let otimizado;

    if (arquivo.endsWith(".html")) {
      otimizado = await minify(original, {
        collapseWhitespace: true,
        removeComments: true
      });
    } else {
      const resultado = await esbuild.transform(original, {
        loader: arquivo.endsWith(".css") ? "css" : "js",
        minifyWhitespace: true,
        minifySyntax: true,
        minifyIdentifiers: false,
        charset: "utf8"
      });

      otimizado = resultado.code;
    }

    const saida = path.join(destino, arquivo);

    await fs.mkdir(path.dirname(saida), { recursive: true });
    await fs.writeFile(saida, otimizado, "utf8");

    // Gera também uma cópia comprimida em gzip.
    const comprimido = gzipSync(Buffer.from(otimizado));
    await fs.writeFile(saida + ".gz", comprimido);

    relatorio.push({
      arquivo,
      original: Buffer.byteLength(original),
      otimizado: Buffer.byteLength(otimizado),
      gzip: comprimido.length
    });
  }

  await fs.mkdir(path.join(destino, "Imagens"), {
    recursive: true
  });

  await fs.copyFile(
    path.join(raiz, "Imagens/voluntarios.jpg"),
    path.join(destino, "Imagens/voluntarios.jpg")
  );

  // Cria uma entrada para abrir o site pela raiz da publicação.
  await fs.writeFile(
    path.join(destino, "index.html"),
    `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ONG Mãos Unidas</title>
</head>
<body>
  <p><a href="html/index.html">Abrir ONG Mãos Unidas</a></p>
  <script>
    location.replace("html/index.html" + location.hash);
  </script>
</body>
</html>`,
    "utf8"
  );

  console.table(relatorio);
  console.log("Build concluído! Abra dist/html/index.html.");
  console.log(
    "As cópias gzip exigem configuração do servidor para serem utilizadas."
  );
}

prepararSite().catch(function (erro) {
  console.error("Não foi possível preparar o site:", erro.message);
  process.exitCode = 1;
});