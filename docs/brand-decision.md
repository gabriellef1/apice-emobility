# Decisão de marca

Data: 2026-09-15. Fonte: `C:\Users\gabri\Downloads\logos.png` (3 propostas, PNG 1536x1024, fundo preto texturizado, sem vetor). O original não foi alterado.

## As três propostas

| #   | Descrição                                                                                                   | Legibilidade                        | Redução (16-48px)                                         | Header                                   | Fundo claro                            | Reconhecimento                       |
| --- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------- | --------------------------------------------------------- | ---------------------------------------- | -------------------------------------- | ------------------------------------ |
| 1   | Monograma "A" com silhueta de moto integrada + wordmark ÁPICE (branco, geométrico wide) + E-MOBILITY (rosa) | Alta: símbolo e wordmark separáveis | Boa a partir de 32px; em 16px vira mancha rosa triangular | Lockup horizontal cabe em 64px de altura | Wordmark branco some; símbolo funciona | Alto: o A com moto é único           |
| 2   | Badge circular com roda, raios e texto curvo em volta                                                       | Média: texto curvo pequeno          | Ruim: em 48px o texto curvo vira ruído                    | Precisa de altura grande (é quadrado)    | Funciona (anel rosa)                   | Médio: lembra selo/patch             |
| 3   | Roda com linhas de velocidade + wordmark                                                                    | Alta no wordmark; símbolo genérico  | Ruim: em 16-32px a roda com rastro vira cometa            | Lockup horizontal ok                     | Wordmark some                          | Baixo: roda com rastro é lugar-comum |

## Escolha

**Opção 1** para tudo: lockup horizontal (símbolo + wordmark) no header e footer, símbolo A como favicon.

Motivos: é a única com símbolo distintivo que se sustenta sozinho; o wordmark separado permite compor horizontalmente sem redesenhar; a badge (2) não reduz e força um header alto; a roda (3) perde identidade em tamanho pequeno.

Descartado: usar o símbolo da opção 3 como favicon. Em 16px seria um cometa sem relação com o A do header.

## Extração (sem redesenho)

Script versionado: `scripts/extract-logo.mjs` (`npm run logo`). Recorta as regiões da opção 1 no PNG original e remove o fundo preto por **un-premultiply**: alpha = canal máximo do pixel, cor = pixel dividido pelo alpha. Compor o resultado sobre preto devolve o pixel original, então o desenho, proporção e tipografia ficam idênticos. O fundo do PNG é limpo (valor máximo 13/255), o que evita halo.

Validação feita antes de gerar variantes (comparação lado a lado em `~/.claude/build/build-20260915-apice-emobility/logo-compare-*.png`): sobre preto e grafite o resultado é indistinguível do original a olho, com antialiasing e gradiente do rosa preservados.

Assets gerados:

- `src/assets/brand/symbol.png` (372x255), `wordmark.png` (416x124), `lockup-stacked.png` (416x391): recortes fiéis.
- `src/assets/brand/lockup-horizontal.png` (948x255): composição do símbolo com o wordmark ao lado. É layout, não redesenho.
- `public/favicon-{16,32,48,180,192,512}.png`: símbolo centralizado num quadrado `#0a0a0b`, para funcionar em aba clara e escura.
- `public/og-default.png` (1200x630): foto do hero escurecida + lockup empilhado (gerado por `scripts/images.mjs`).

## Limitações registradas

1. **O wordmark é branco**: só funciona sobre fundo escuro. Header, footer e OG são escuros por isso. Não existe versão para fundo claro; produzir uma exigiria vetor oficial.
2. **Favicon 16px**: o A com a moto integrada vira uma forma rosa triangular. Reconhecível como "marca rosa em fundo escuro", não como moto. Aceito como está (decisão de 2026-09-15). Qualquer marca com esse nível de detalhe sofre em 16px; 32px e 48px leem bem.
3. **Pendência: vetor oficial (SVG/AI) do logo.** Os PNGs atuais são provisórios e suficientes até 2x em 40px de altura. Quando o vetor chegar, substituir os arquivos em `src/assets/brand/` e `public/` mantendo os nomes; nenhum componente precisa mudar.

## Paleta derivada do logo

Amostrada dos pixels do wordmark e do símbolo (`scripts` de análise, ver relatório da Fase 1):

- Rosa marca: `brand-500 #e24a78` (acento), `brand-400 #e8698f`, `brand-300 #ee93aa` (tom claro do gradiente), `brand-600 #c9315f` (texto rosa sobre claro, contraste AA).
- Estrutura: `ink-950 #0a0a0b` a `ink-100 #e9e9ec`.
- Respiro: `paper-50 #fbfaf8`, `paper-100 #f5f4f0`, `paper-200 #ebe9e3`.

Tokens em `src/styles/tokens.css`. O rosa é acento (CTAs, eyebrows, estados); a estrutura é preto/grafite; o off-white dá respiro. O site não é rosa.

## Tipografia

Archivo Variable (eixo de largura 62-125%, self-hosted via `@fontsource-variable/archivo`). Display em 110% de largura ecoa a proporção wide do wordmark sem imitar a fonte do logo, que é imagem. Uma família só: menos peso na página.
