# EcoDominó Pixel

Jogo/simulador de ecossistema em React + Vite, compatível com GitHub Pages.

## O que o jogo tem

- 4 biomas excludentes no mapa central.
- 20 animais por bioma, totalizando 80 espécies únicas.
- Menu com dieta, função ecológica, força, mobilidade, estresse e população.
- Clima automático, crescimento de vegetação, água, fogo e poluição.
- Interferências humanas manuais.
- Migração entre biomas.
- Campanha com fases, orçamento, objetivos, vitória e colapso.
- Visual simples pixelado.

## Rodar localmente

```bash
npm install
npm run dev
```

## Gerar versão de produção

```bash
npm run build
npm run preview
```

## Publicar no GitHub Pages

1. Crie um repositório no GitHub.
2. Envie todos os arquivos deste projeto para a branch `main`.
3. No repositório, vá em **Settings > Pages**.
4. Em **Build and deployment**, selecione **GitHub Actions**.
5. Faça um push para `main`.
6. O workflow `.github/workflows/deploy.yml` vai gerar o site automaticamente.

O `vite.config.js` usa `base: './'`, então o jogo funciona tanto em:

- `https://usuario.github.io/repositorio/`
- previews locais do Vite
- hospedagens estáticas simples

## Estrutura

```text
.
├── .github/workflows/deploy.yml
├── index.html
├── package.json
├── vite.config.js
└── src
    ├── App.jsx
    ├── main.jsx
    └── styles.css
```
