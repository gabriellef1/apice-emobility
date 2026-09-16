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

Coluna **`brand`** (2026-09-16): a Ápice é revenda autorizada Aima, então o produto guarda a fabricante e `name` fica só com o modelo ("X6"); `productTitle()` compõe "Aima X6". Fica no modelo pra suportar outra fabricante depois. Categorias seguem a linha real e a decisão de compra no Brasil: `scooter` (até 32 km/h), `moto` (ciclomotor/moto elétrica), `ebike`, `triciclo`.

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

Curvas e durações vivem em `src/lib/motion.ts` (Motion) e espelhadas em `tokens.css` (CSS): `easeOutExpo` (0.16, 1, 0.3, 1) pra entradas, `easeSnap` (0.2, 0.8, 0.2, 1) pra hover. Nada de ease padrão do navegador.

Momentos com assinatura (reimplementados em Motion a partir do estudo de ReactBits SplitText/BlurText, 21st.dev text-split-reveal e micro de botão do Uiverse; nenhuma lib extra):

- **Hero**: foto revelada por `clip-path` da direita pra esquerda enquanto um zoom lento assenta; filete rosa entra por máscara; título sobe palavra a palavra de dentro de linhas recortadas (`overflow: hidden`), com stagger; parágrafo, specs e CTAs em cascata.
- **Títulos de seção** (`SplitText`): palavra a palavra, saindo de desfoque (`blur`) ou subindo de linha recortada (`line`). Texto inteiro vai no `aria-label`; palavras são `aria-hidden`.
- **Fotos e acentos** (`Reveal effect="wipe-*"`): revelação por `clip-path`, nunca por `translateX` (deslocamento lateral em estado inicial vira overflow horizontal no celular). Quem observa a viewport é um wrapper sem clip; o Chrome desconta o clip-path no cálculo de interseção e um elemento 100% recortado nunca "entra".
- **Catálogo**: cards entram em cascata; ao filtrar, `AnimatePresence mode="popLayout"` + `layout` faz o card que sai encolher e os vizinhos deslizarem.
- **Card**: hover em camadas com tempos diferentes (foto 900 ms, borda/sombra 200 ms, título 300 ms com atraso, seta 500 ms com atraso), e o mesmo estado por teclado via `group-focus-within`.
- **Botão**: preenchimento que desliza da esquerda no hover e no `focus-visible`.
- **Rotas**: View Transitions API via `viewTransition` do React Router; ao clicar num card, a foto dele recebe `view-transition-name` e vira a foto grande do produto (elemento compartilhado). Header fora da animação.

Tudo sob `prefers-reduced-motion`: `MotionConfig reducedMotion="user"` no layout raiz, `useReducedMotion` nos efeitos de máscara/blur (viram fade) e media query no CSS das rotas. `<dialog>` nativo no drawer (foco preso, Esc, fundo inerte, devolução de foco).

## Testes de navegador

`e2e/overflow.spec.ts` (Playwright, Chromium, contra `vite preview` do build) percorre todos os elementos de cada página em 320/360/375/390/768, antes e depois de rolar, e reprova qualquer um que passe da viewport (descontando trilhos com overflow-x contido). Roda no CI depois do build.

## Segurança (estado da Fase 1)

Sem backend, sem segredos, sem formulário que envie dado. `.env` ignorado; `.env.example` só com valores públicos. WhatsApp abre `wa.me` com `rel="noopener noreferrer"`. UTMs ficam em `sessionStorage` (chave `apice.attribution`), com whitelist e truncamento, e não entram em nenhuma URL externa. Sem dependência de runtime além das listadas no briefing.
