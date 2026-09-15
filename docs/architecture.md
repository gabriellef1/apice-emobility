# Arquitetura

Site-catálogo estático (SPA) com backend na Fase 3. Este documento registra a estrutura e as decisões que não dá pra deduzir só do código.

## Stack

React 19, TypeScript strict, Vite 8, Tailwind CSS v4 (tokens em `@theme`), Motion (`motion/react`), React Router 7 (data router com loaders), Zod 4, lucide-react. Testes: Vitest + Testing Library (unitário e componente), Playwright (fluxo crítico, Fase 5; hoje usado só pra verificação visual). ESLint 9 (typescript-eslint strict, react-hooks, jsx-a11y, react-refresh) + Prettier com plugin Tailwind.

ESLint fica na versão 9 porque `eslint-plugin-jsx-a11y` ainda não suporta a 10. Trocar quando o plugin atualizar.

## Estrutura

```
src/
  app/            router, loaders, layout (Header, Footer, RootLayout, DemoNotice), pages
  components/     ui (Button, Container, Picture, Badge, Drawer, Reveal), seo (Seo), brand (Logo)
  config/         company.ts (dados oficiais), site.ts (base, URL, flags), nav.ts
  content/        images.json (fotos + licença), images.ts (srcset), categories.ts (texto da home)
  features/
    catalog/      ProductCard, FilterPanel, SortSelect, query (URL), facets, apply, useCatalogQuery
    product/      Price, AvailabilityBadge, specs (formatação e ordem das specs)
    leads/        attribution (captura de UTM/referrer na sessão)
  lib/            cn, format (BRL, números), whatsapp (link contextual)
  services/
    catalog/      types (Zod), CatalogService (interface), mock/ (dados e implementação)
  styles/         tokens.css (único lugar de tokens), globals.css
  test/           setup (polyfills de jsdom), factories
```

Sem `src/hooks` e `src/types` por enquanto: os hooks e tipos existentes pertencem a uma feature ou ao serviço, e uma pasta vazia só confunde. Criar quando houver algo genuinamente transversal.

## Dados

Os tipos espelham as colunas que a tabela `products` terá (snake_case, mesmos nomes). Um schema base (`productColumns`) deriva três schemas com a mesma regra de preço (`price_on_request` XOR `price !== null`):

- `productRowSchema` / `ProductRow`: a linha do banco.
- `productSchema` / `Product`: linha + `images[]`, o que a UI consome.
- `productInputSchema` / `ProductInput`: o que o admin envia (sem id e timestamps).

Desvio do modelo inicial, aprovado em 2026-09-15: coluna **`availability`** (`in_stock | pre_order | sold_out`). `active` é publicação (aparece ou não), `availability` é situação comercial (badge e filtro). Sem ela não existe "disponibilidade" nem "status" no card.

Specs ficam em `specifications` (jsonb) com chaves tipadas no Zod (`range_km`, `top_speed_kmh`, `motor_power_w`, `battery_v`, `battery_ah`, `battery_type`, `charge_time_h`, `weight_kg`, `max_load_kg`, `colors`). Normalizar em tabela só se um dia houver filtro por spec no banco.

`CatalogService` é a única porta da UI pro dado. `MockCatalogService` valida o mock com o schema na construção e nunca devolve `active = false`. A Fase 3 troca a instância em `services/catalog/index.ts` por uma implementação Supabase; páginas e loaders não mudam.

## Catálogo

- Estado dos filtros vive na URL (`categoria`, `disponibilidade`, `destaque`, `ordem`), traduzido só em `features/catalog/lib/query.ts`. Valor inválido é ignorado, não derruba a página. Trocar filtro faz `replace` no histórico (voltar sai do catálogo, não desfaz um checkbox).
- Facetas são calculadas sobre o catálogo público completo, não sobre o resultado filtrado. Faceta com menos de 2 valores não aparece.
- Ordenação com valor ausente (sem preço, sem spec) vai pro fim em qualquer direção.
- Faixas numéricas (preço, autonomia, velocidade, potência) entram na Fase 2 com os mesmos params.
- Detalhe: o checkbox é controlado pela URL e `setSearchParams` é assíncrono, então entre o clique e a navegação o input fica um tick no estado antigo. Imperceptível ao olho, mas ferramentas que leem o estado imediatamente após o clique veem isso.

## Rotas e GitHub Pages

- `createBrowserRouter` com `basename` = `import.meta.env.BASE_URL`. `VITE_BASE_PATH` define a base: `/` em dev e domínio próprio, `/<repo>/` no Pages (o workflow injeta a partir de `github.event.repository.name`; o nome do repo não aparece no código).
- Deep-link no Pages: `scripts/postbuild.mjs` gera `dist/404.html` com o redirect do spa-github-pages (segmentos a preservar calculados a partir da base). O `index.html` restaura a URL antes do React Router iniciar. Query e hash são preservados.
- Custo aceito: o Pages responde HTTP 404 nesses deep-links, então crawlers não indexam páginas de produto. Por isso o `sitemap.xml` só lista rotas estáticas. Some com hospedagem que faça rewrite (domínio próprio) ou com prerender, ambos fora do escopo atual.
- `site.webmanifest`, `robots.txt` e `sitemap.xml` também são gerados no postbuild com a base certa. O `public/` tem versões com base `/` só pra dev.

## SEO

`components/seo/Seo` usa o suporte nativo do React 19 a `<title>` e `<meta>` no `<head>`. O `index.html` mantém título e descrição estáticos (fallback sem JS) marcados com `data-static-seo`, removidos na primeira renderização pra não duplicar. OG por produto funciona só pra quem executa JS; previews sociais de produto exigem prerender (não feito).

## Imagens

Fotos ilustrativas do Unsplash, listadas em `src/content/images.json` com autor, link e licença. `scripts/images.mjs` baixa os originais (cache local fora do git) e gera WebP em 3 larguras (4:3; 16:9 onde `wide: true`) em `public/images`. `Picture` fixa largura/altura pra não ter layout shift, usa `srcset`/`sizes` e lazy load fora da dobra. Nenhuma foto retrata o modelo à venda; o rodapé e a página de produto dizem isso.

## Animação

`MotionConfig reducedMotion="user"` no layout raiz. Hero: fade + 12px. Seções: `Reveal` (whileInView, uma vez). Grid do catálogo: `AnimatePresence` com fade nos itens. Drawer: `<dialog>` nativo (foco preso, Esc, fundo inerte, devolução de foco) com Motion só pra entrada e saída.

## Segurança (estado da Fase 1)

Sem backend, sem segredos, sem formulário que envie dado. `.env` ignorado; `.env.example` só com valores públicos. WhatsApp abre `wa.me` com `rel="noopener noreferrer"`. UTMs ficam em `sessionStorage` (chave `apice.attribution`), com whitelist e truncamento, e não entram em nenhuma URL externa. Sem dependência de runtime além das listadas no briefing.
