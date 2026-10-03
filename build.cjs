const fs = require("node:fs/promises");
const path = require("node:path");
const { gzipSync } = require("node:zlib");
const esbuild = require("esbuild");
const sharp = require("sharp");
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
  // Confere os arquivos antes de gerar a publicação.
  for (const arquivo of arquivos) {
    await fs.access(path.join(raiz, arquivo));
  }

  const fotoOriginal = await fs.readFile(
    path.join(raiz, "Imagens/voluntarios.jpg")
  );

  const inicioOriginal = await fs.readFile(
    path.join(raiz, "html/index.html"),
    "utf8"
  );

  const padraoFoto =
    /<img\b[^>]*\bsrc=["']\.\.\/Imagens\/voluntarios\.jpg["'][^>]*>/gi;

  const fotosEncontradas = inicioOriginal.match(padraoFoto);

  if (!fotosEncontradas || fotosEncontradas.length !== 1) {
    throw new Error(
      "Esperava encontrar uma foto voluntarios.jpg em html/index.html."
    );
  }

  // Prepara as imagens sem alterar a foto original.
  const imagens = [];

  for (const largura of [500, 1000]) {
    const resultado = await sharp(fotoOriginal)
      .rotate()
      .resize({ width: largura, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer({ resolveWithObject: true });

    imagens.push({
      arquivo: `Imagens/voluntarios-${largura}.webp`,
      ...resultado
    });
  }

  const jpeg = await sharp(fotoOriginal)
    .rotate()
    .resize({ width: 1000, withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true })
    .toBuffer({ resolveWithObject: true });

  imagens.push({
    arquivo: "Imagens/voluntarios.jpg",
    ...jpeg
  });

  // Mantém o texto alternativo e ajusta as dimensões.
  const fotoPequena = imagens[0];
  const fotoGrande = imagens[1];

  const tagFoto = fotosEncontradas[0]
    .replace(/\s+(width|height)=["'][^"']*["']/gi, "")
    .replace(
      /\s*\/?>$/,
      ` width="${fotoPequena.info.width}" height="${fotoPequena.info.height}">`
    );

  const imagemResponsiva = `
    <picture>
      <source
        type="image/webp"
        srcset="../${fotoPequena.arquivo} ${fotoPequena.info.width}w,
                ../${fotoGrande.arquivo} ${fotoGrande.info.width}w"
        sizes="(max-width: 500px) 100vw, 500px">
      ${tagFoto}
    </picture>
  `;

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
      const conteudo = arquivo === "html/index.html"
        ? original.replace(padraoFoto, () => imagemResponsiva)
        : original;

      otimizado = await minify(conteudo, {
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

  const relatorioImagens = [];

  for (const imagem of imagens) {
    await fs.writeFile(
      path.join(destino, imagem.arquivo),
      imagem.data
    );

    relatorioImagens.push({
      arquivo: imagem.arquivo,
      largura: imagem.info.width,
      altura: imagem.info.height,
      original: fotoOriginal.length,
      otimizado: imagem.data.length,
      reducao:
        (100 * (1 - imagem.data.length / fotoOriginal.length))
          .toFixed(2) + "%"
    });
  }

  // Entrada para abrir o site pela raiz da publicação.
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
  console.table(relatorioImagens);
  console.log("Build concluído! Abra dist/html/index.html.");
  console.log(
    "As cópias gzip exigem configuração do servidor para serem utilizadas."
  );
}

prepararSite().catch(function (erro) {
  console.error("Não foi possível preparar o site:", erro.message);
  process.exitCode = 1;
});