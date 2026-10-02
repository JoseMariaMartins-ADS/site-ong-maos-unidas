# ONG Mãos Unidas

Projeto acadêmico de Desenvolvimento Front-End para Web,
do curso de Análise e Desenvolvimento de Sistemas da
Universidade Cruzeiro do Sul.

Autor: José Maria Martins.

## Objetivo

Apresentar uma ONG, divulgar projetos solidários e demonstrar
um formulário de cadastro de voluntários.

## Tecnologias

- HTML5 para estruturar o conteúdo.
- CSS3 para estilos e adaptação a diferentes tamanhos de tela.
- JavaScript para navegação, menu, máscaras e validação.
- localStorage para guardar o rascunho do formulário no navegador.
- Git para registrar alterações e organizar branches.

O projeto utiliza JavaScript sem bibliotecas externas.

## Como executar

1. Baixe ou copie a pasta completa do projeto.
2. Abra o arquivo html/index.html no navegador.
3. Use o menu para acessar Início, Projetos e Seja voluntário.

Também é possível abrir a pasta no VS Code e utilizar
um servidor local, como a extensão Live Server.

Não é necessário instalar dependências para executar
esta versão do projeto.

## Organização dos arquivos

| Arquivo | Função |
| --- | --- |
| html/index.html | Página inicial e entrada da SPA |
| html/projetos.html | Página independente dos projetos |
| html/cadastro.html | Página independente do cadastro |
| css/style.css | Estilos e regras responsivas |
| js/menu.js | Abertura e fechamento do menu |
| js/formulario.js | Máscaras, validação e mensagem de confirmação |
| js/armazenamento.js | Salvamento e restauração do rascunho |
| js/script.js | Rotas e atualização do conteúdo da SPA |
| Imagens/voluntarios.jpg | Imagem da página inicial |

## Navegação SPA

Ao entrar por html/index.html, o JavaScript troca o conteúdo
da área principal sem recarregar toda a página.

Rotas disponíveis:

- #inicio
- #projetos
- #projetos/alimentos
- #projetos/apoio
- #cadastro

Os projetos são apresentados a partir de uma lista de objetos,
utilizando map e join para gerar os cartões.

## Formulário

O cadastro possui os campos nome, e-mail, CPF, telefone e CEP.

Todos são obrigatórios. CPF, telefone e CEP recebem
pontuação automaticamente durante o preenchimento.

A validação do CPF verifica o formato.
Não verifica os dígitos de controle do documento.

O telefone utiliza o formato de celular com 11 dígitos.

O rascunho é armazenado no localStorage do navegador
e restaurado ao retornar ao cadastro.

Ao concluir o formulário, uma mensagem informa que o cadastro
é uma demonstração. Os campos e o rascunho são limpos.

Não existe envio dos dados para servidor ou banco de dados.
Para testar, utilize dados fictícios, pois o rascunho
fica armazenado no navegador.

## Recursos de acessibilidade

- Idioma da página definido como português do Brasil.
- Estrutura com títulos e elementos semânticos.
- Texto alternativo na imagem.
- Rótulos associados aos campos do formulário.
- Indicação de abertura do menu com aria-expanded.
- Mensagens de erro associadas aos campos.
- Mensagem de confirmação com role="status".
- Link "Pular para o conteúdo" na página inicial.
- Controle de foco após a mudança de rota.

Esses recursos não representam uma certificação
de conformidade completa com WCAG.

## Verificações realizadas

- Navegação entre as telas da SPA.
- Exibição dos dois projetos.
- Formatação de CPF, telefone e CEP.
- Bloqueio do envio com campos obrigatórios vazios.
- Mensagem de confirmação e limpeza do formulário.
- Restauração do rascunho após atualizar a página.
- Uso do link para pular o menu pelo teclado.
- Navegação pelos campos com a tecla Tab.
- Inspeção do Console e da aba Network no Chrome.

## Controle de versões

O desenvolvimento segue a organização do GitFlow:

- main: destinada às versões estáveis.
- develop: integração das alterações.
- feature/: desenvolvimento de melhorias.
- release/: preparação de uma versão.
- hotfix/: correções urgentes de uma versão publicada.

A melhoria do link para pular o conteúdo foi desenvolvida
na branch feature/acessibilidade e integrada à develop.

Este README foi preparado na branch feature/documentacao.

Branches release/ e hotfix/ devem ser criadas quando houver
uma preparação de versão ou uma correção urgente real.

## Limitações

O projeto é uma demonstração acadêmica de front-end.
Não possui autenticação, cadastro real de voluntários,
validação oficial de CPF ou integração com serviços externos.
## Geração da versão otimizada

É necessário ter Node.js e npm instalados.

No terminal, dentro da pasta do projeto, execute:

```powershell
npm.cmd ci
npm.cmd run build
```

O arquivo build.cjs gera a pasta dist com HTML, CSS e JavaScript
minificados, preservando a estrutura de pastas e os arquivos originais.
A imagem voluntarios.jpg é copiada sem alteração.

Para abrir a versão otimizada no Windows:

```powershell
Start-Process .\dist\html\index.html
```

Também são geradas cópias dos arquivos em gzip.
Seu uso depende da configuração do servidor.
A pasta dist e as dependências em node_modules são ignoradas pelo Git.

## Testes realizados nesta etapa

- Navegação para os projetos na versão otimizada.
- Formatação automática do CPF no cadastro.
- Envio demonstrativo com mensagem de confirmação.
- Limpeza do formulário e do rascunho após o envio, conferida com F5.
- Navegação por teclado e uso do link para pular ao conteúdo.
- Leitura dos campos e do botão pelo Narrador do Windows.
- Verificação visual com zoom de 200%.
- Melhoria do contraste das bordas dos campos.

Esses testes não constituem uma auditoria completa de conformidade WCAG.