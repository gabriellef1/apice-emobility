# Ápice E-Mobility

Site-catálogo de motos elétricas da Ápice E-Mobility: catálogo com filtros, página de produto com especificações e pedido de orçamento via WhatsApp.

## Stack

React 19 · TypeScript strict · Vite · Tailwind CSS v4 · Motion · React Router · Zod · lucide-react
Testes com Vitest + Testing Library. Deploy no GitHub Pages via GitHub Actions.

## Rodando

```bash
npm ci
npm run dev
```

Scripts: `lint`, `typecheck`, `test`, `build`, `format`, `logo` (regenera os assets de marca a partir do PNG original).

## Configuração

Copie `.env.example` para `.env`. `VITE_BASE_PATH` define a base do site (`/` em dev e domínio próprio, `/<repo>/` no GitHub Pages; o workflow de deploy injeta esse valor).

## Documentação

- `docs/brand-decision.md`: escolha do logo e assets.
- `docs/architecture.md`: estrutura, modelo de dados e decisões técnicas.
