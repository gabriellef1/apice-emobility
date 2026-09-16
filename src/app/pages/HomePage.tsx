import { ArrowRight, Mail, MessageCircle } from 'lucide-react'
import { motion } from 'motion/react'
import { Link, useLoaderData } from 'react-router'

import { type homeLoader } from '@/app/loaders'
import { Seo } from '@/components/seo/Seo'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Picture } from '@/components/ui/Picture'
import { Reveal } from '@/components/ui/Reveal'
import { revealEase } from '@/lib/motion'
import { company } from '@/config/company'
import { categoryContent } from '@/content/categories'
import { coverImage, heroImage } from '@/content/images'
import { ProductCard } from '@/features/catalog/components/ProductCard'
import { CATEGORY_ORDER } from '@/features/catalog/lib/facets'
import { PARAM } from '@/features/catalog/lib/query'
import { AvailabilityBadge } from '@/features/product/components/AvailabilityBadge'
import { Price } from '@/features/product/components/Price'
import { primarySpecs } from '@/features/product/lib/specs'
import { whatsappLink } from '@/lib/whatsapp'
import { CATEGORY_LABELS, type Product } from '@/services/catalog'

const benefits = [
  {
    title: 'Carrega em tomada comum',
    text: 'Bateria removível ou cabo direto na tomada 220V de casa ou do trabalho. Sem posto, sem fila, sem troca de óleo.',
  },
  {
    title: 'Revisão é freio, pneu e bateria',
    text: 'Sem óleo, sem embreagem, sem escapamento, sem corrente em modelos com motor no cubo. Sobram poucas peças pra desgastar.',
  },
  {
    title: 'Força total desde a saída',
    text: 'Motor elétrico entrega o torque máximo em zero rotação, sem marcha. Arrancar no sinal fica imediato e silencioso.',
  },
]

const contactImage = 'detail-dash'
const benefitsImage = 'ride-city'

export function HomePage() {
  const { products } = useLoaderData<typeof homeLoader>()
  const featured = products.filter((p) => p.featured)
  const hero = featured[0] ?? products[0]
  const spotlight = featured[1]
  const picks = featured.slice(2, 5)
  const categories = CATEGORY_ORDER.map((category) => ({
    category,
    count: products.filter((p) => p.category === category).length,
  })).filter((c) => c.count > 0)

  return (
    <>
      <Seo />

      {hero && <Hero product={hero} />}

      {(spotlight !== undefined || picks.length > 0) && (
        <section className="py-16 lg:py-24" aria-labelledby="destaques-heading">
          <Container>
            <Reveal className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow text-brand-600">Em destaque</p>
                <h2
                  id="destaques-heading"
                  className="mt-3 text-display-md font-display text-ink-950"
                >
                  Modelos em destaque
                </h2>
              </div>
              <Link
                to="/catalogo"
                viewTransition
                className="inline-flex items-center gap-1.5 rounded-sm text-sm font-medium text-ink-900 hover:text-brand-600"
              >
                Ver catálogo completo
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Reveal>

            {spotlight && <Spotlight product={spotlight} />}

            {picks.length > 0 && (
              <ul className="-mx-4 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0">
                {picks.map((product, index) => (
                  <Reveal
                    as="li"
                    key={product.id}
                    delay={0.1 + index * 0.12}
                    className="w-[82%] shrink-0 snap-start sm:w-auto"
                  >
                    <ProductCard product={product} sizes="(min-width: 640px) 30vw, 82vw" />
                  </Reveal>
                ))}
              </ul>
            )}
          </Container>
        </section>
      )}

      {categories.length > 1 && (
        <section className="border-t border-ink-200 py-16 lg:py-24" aria-labelledby="uso-heading">
          <Container>
            <Reveal className="max-w-2xl">
              <p className="eyebrow text-brand-600">Escolha por uso</p>
              <h2 id="uso-heading" className="mt-3 text-display-md font-display text-ink-950">
                Qual é o seu trajeto?
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink-600">
                Cada categoria resolve um tipo de deslocamento. Escolha a sua e veja só os modelos
                que fazem sentido.
              </p>
            </Reveal>
            <ul className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
              {categories.map(({ category, count }, index) => {
                const content = categoryContent[category]
                return (
                  <Reveal as="li" key={category} delay={0.1 + index * 0.1}>
                    <Link
                      to={`/catalogo?${PARAM.categoria}=${category}`}
                      viewTransition
                      className="group block rounded-lg"
                    >
                      <Picture
                        image={coverImage(content.image)}
                        sizes="(min-width: 1024px) 22vw, 45vw"
                        className="aspect-[4/3] rounded-lg"
                        imgClassName="transition-transform duration-700 ease-out-quart group-hover:scale-105"
                      />
                      <div className="mt-3 flex items-baseline justify-between gap-2">
                        <h3 className="text-lg font-display text-ink-950 group-hover:text-brand-600">
                          {CATEGORY_LABELS[category]}
                        </h3>
                        <span className="text-xs text-ink-500 tabular-nums">
                          {count} {count === 1 ? 'modelo' : 'modelos'}
                        </span>
                      </div>
                      <p className="mt-1 text-sm leading-snug text-ink-600">{content.blurb}</p>
                    </Link>
                  </Reveal>
                )
              })}
            </ul>
          </Container>
        </section>
      )}

      <section
        id="por-que-eletrica"
        className="scroll-mt-16 overflow-hidden border-t border-ink-200 bg-paper-100"
        aria-labelledby="beneficios-heading"
      >
        <div className="lg:grid lg:grid-cols-2">
          <Reveal x={-32} y={0} className="relative lg:min-h-[44rem]">
            <Picture
              image={coverImage(benefitsImage)}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="aspect-[4/3] lg:absolute lg:inset-0 lg:aspect-auto lg:h-full"
            />
          </Reveal>
          <div className="px-4 py-14 sm:px-6 lg:py-24 lg:pr-[max(2rem,calc((100vw-80rem)/2+2rem))] lg:pl-16 xl:pl-24">
            <Reveal>
              <p className="eyebrow text-brand-600">Por que elétrica</p>
              <h2
                id="beneficios-heading"
                className="mt-4 max-w-xl text-display-md font-display text-ink-950 md:text-display-lg"
              >
                <span className="block">Menos custo.</span>
                <span className="block">Menos ruído.</span>
                <span className="block text-brand-600">Menos oficina.</span>
              </h2>
            </Reveal>
            <ul className="mt-12 space-y-10 lg:mt-16 lg:space-y-12">
              {benefits.map((benefit, index) => (
                <Reveal as="li" key={benefit.title} delay={0.1 + index * 0.14} className="max-w-md">
                  <h3 className="text-display-sm font-display text-ink-950">{benefit.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-ink-600">{benefit.text}</p>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section
        id="sobre"
        className="scroll-mt-16 bg-ink-950 text-white"
        aria-labelledby="sobre-heading"
      >
        <Container className="grid gap-12 py-16 lg:grid-cols-2 lg:gap-20 lg:py-24">
          <div>
            <Reveal>
              <p className="eyebrow text-brand-400">Sobre a Ápice</p>
              <h2
                id="sobre-heading"
                className="mt-4 text-display-md font-display md:text-display-lg"
              >
                Revenda de motos elétricas, atendimento direto.
              </h2>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-300">
                A {company.name} vende scooters, urbanas, trail e esportivas elétricas. Você escolhe
                o modelo no catálogo, tira dúvidas de autonomia e carga e fecha o orçamento pelo
                WhatsApp ou por e-mail.
              </p>
            </Reveal>

            <Reveal id="contato" delay={0.15} className="mt-12 scroll-mt-24">
              <h3 className="eyebrow text-brand-400">Contato</h3>
              <dl className="mt-5 space-y-5">
                <div>
                  <dt className="text-sm text-ink-400">WhatsApp</dt>
                  <dd className="mt-1">
                    <a
                      href={whatsappLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xl font-display tabular-nums hover:text-brand-300"
                    >
                      {company.whatsapp.display}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-ink-400">E-mail</dt>
                  <dd className="mt-1">
                    <a
                      href={`mailto:${company.email}`}
                      className="text-xl font-display break-all hover:text-brand-300"
                    >
                      {company.email}
                    </a>
                  </dd>
                </div>
                {company.address && (
                  <div>
                    <dt className="text-sm text-ink-400">Endereço</dt>
                    <dd className="mt-1 text-base">{company.address}</dd>
                  </div>
                )}
                {company.businessHours && (
                  <div>
                    <dt className="text-sm text-ink-400">Horário</dt>
                    <dd className="mt-1 text-base">{company.businessHours}</dd>
                  </div>
                )}
              </dl>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href={whatsappLink()} target="_blank" rel="noopener noreferrer" size="lg">
                  <MessageCircle className="size-5" aria-hidden />
                  Chamar no WhatsApp
                </Button>
                <Button href={`mailto:${company.email}`} variant="outline-light" size="lg">
                  <Mail className="size-5" aria-hidden />
                  Enviar e-mail
                </Button>
              </div>
            </Reveal>
          </div>

          <Reveal x={32} y={0} delay={0.1} className="order-first lg:order-none lg:self-stretch">
            <Picture
              image={coverImage(contactImage)}
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="aspect-[4/3] rounded-lg lg:aspect-auto lg:h-full lg:min-h-[32rem]"
            />
          </Reveal>
        </Container>
      </section>
    </>
  )
}

function Hero({ product }: { product: Product }) {
  const cover = product.images[0]
  const image = heroImage(cover?.path ?? 'hero-gtr', cover?.alt)
  const specs = primarySpecs(product)

  return (
    <section
      className="relative overflow-hidden bg-ink-950 text-white"
      aria-labelledby="hero-heading"
    >
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-[68%]">
        <motion.div
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: revealEase }}
          className="h-full"
        >
          <Picture
            image={image}
            sizes="(min-width: 1024px) 68vw, 100vw"
            priority
            className="aspect-[16/9] bg-ink-950 lg:aspect-auto lg:h-full"
            imgClassName="object-center"
          />
        </motion.div>
        <div
          className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-ink-950 via-ink-950/50 via-30% to-transparent lg:block"
          aria-hidden
        />
      </div>

      <Container className="relative py-10 lg:flex lg:min-h-[640px] lg:items-center lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: revealEase }}
          className="max-w-xl"
        >
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="eyebrow text-brand-400">{CATEGORY_LABELS[product.category]}</span>
            <AvailabilityBadge availability={product.availability} />
          </div>
          <h1 id="hero-heading" className="mt-4 text-display-lg font-display md:text-display-xl">
            {product.name}
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-ink-300 md:text-lg">
            {product.short_description}
          </p>

          {specs.length > 0 && (
            <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/15 pt-6">
              {specs.map((spec) => (
                <div key={spec.key}>
                  <dt className="text-[11px] tracking-wide text-ink-400 uppercase">{spec.label}</dt>
                  <dd className="mt-0.5 text-xl font-display tabular-nums">{spec.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button to={`/produto/${product.slug}`} size="lg">
              Conhecer a {product.name}
              <ArrowRight className="size-5" aria-hidden />
            </Button>
            <Button to="/catalogo" variant="outline-light" size="lg">
              Ver catálogo
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}

function Spotlight({ product }: { product: Product }) {
  const cover = product.images[0]
  const specs = primarySpecs(product)

  return (
    <Reveal className="mt-10">
      <Link
        to={`/produto/${product.slug}`}
        viewTransition
        className="group grid overflow-hidden rounded-lg border border-ink-200 bg-white transition-[border-color,box-shadow] duration-300 hover:border-ink-400 hover:shadow-card lg:grid-cols-[1.4fr_1fr]"
      >
        <Picture
          image={coverImage(cover?.path ?? 'detail-front', cover?.alt)}
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="aspect-[4/3] lg:aspect-auto lg:h-full"
          imgClassName="transition-transform duration-700 ease-out-quart group-hover:scale-105"
        />
        <div className="flex flex-col p-6 lg:p-10">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="eyebrow text-ink-500">{CATEGORY_LABELS[product.category]}</span>
            <AvailabilityBadge availability={product.availability} />
          </div>
          <h3 className="mt-3 text-display-sm font-display text-ink-950 lg:text-display-md">
            {product.name}
          </h3>
          <p className="mt-3 text-base leading-relaxed text-ink-600">{product.short_description}</p>

          {specs.length > 0 && (
            <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-ink-100 pt-5">
              {specs.map((spec) => (
                <div key={spec.key} className="min-w-0">
                  <dt className="text-[11px] tracking-wide text-ink-500 uppercase">{spec.label}</dt>
                  <dd className="mt-0.5 truncate text-lg font-display text-ink-950 tabular-nums">
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-auto flex items-end justify-between gap-3 pt-8">
            <Price product={product} size="lg" />
            <span className="inline-flex items-center gap-1 text-sm font-medium text-ink-700 group-hover:text-brand-600">
              Ver modelo
              <ArrowRight
                className="size-4 transition-transform duration-300 ease-out-quart group-hover:translate-x-1"
                aria-hidden
              />
            </span>
          </div>
        </div>
      </Link>
    </Reveal>
  )
}
