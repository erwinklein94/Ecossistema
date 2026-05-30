# EcoDominó Pixel — versão GitHub Pages direta

Esta versão foi feita para funcionar no GitHub Pages sem build, sem Vite, sem React e sem GitHub Actions.

## Como publicar

1. Apague os arquivos antigos do repositório ou crie um repositório novo.
2. Envie estes arquivos para a branch `main`:
   - `index.html`
   - `.nojekyll`
   - `README.md`
3. Vá em **Settings > Pages**.
4. Em **Source**, escolha **Deploy from a branch**.
5. Escolha:
   - Branch: `main`
   - Folder: `/root`
6. Aguarde o deploy e abra:
   `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`

## Por que esta versão resolve a tela branca?

A versão anterior dependia de Vite/React ser compilado antes do GitHub Pages servir o site. Se o Pages servia o `index.html` direto da raiz, ele tentava abrir `/src/main.jsx`, e isso gerava tela branca.

Esta versão é um único `index.html` autossuficiente. O navegador abre direto.
