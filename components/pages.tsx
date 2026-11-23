import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCatalog, getCategories, getTemplate, getFeaturedTemplates, absoluteUrl, config } from '@/lib/catalog';
import { getMessages, localizePath, guidePath, type Locale } from '@/lib/i18n';
import { pageMetadata } from '@/lib/metadata';
import { getSkins } from '@/lib/skins';
import { skinThumbnail } from '@/lib/skin-paths';
import { Gallery } from './gallery';
import { PreviewMedia } from './preview-media';
import { Breadcrumbs, ChatStyleLink, ChatStyleLogo, ChatStyleButton, StructuredData } from './site-chrome';
import { GridIcon } from './icons';
import { TemplateCard } from './template-card';
import { SkinGallery } from './skin-gallery';
import { getGuideBundle, getGuides, articlePath, guidesPath } from '@/lib/guides';
import { GuideExamples } from './guide-pages';
import { DiscoverCard } from './discover-card';
import { HeroBackdrop } from './hero-backdrop';

function RichText({ text, locale }: { text: string; locale: Locale }) {
  return <>{text.split(/(\[[^\]]+\]\(\/[^)]+\))/g).map((part, index) => {
    const link = part.match(/^\[([^\]]+)\]\((\/[^)]+)\)$/);
    return link ? <Link key={index} href={localizePath(link[2], locale)}>{link[1]}</Link> : part;
  })}</>;
}

export function homeMetadata(locale: Locale) {
  const { seo } = getMessages(locale);
  return pageMetadata('/', seo.homeTitle, seo.homeDescription, undefined, locale);
}
export function HomePage({ locale }: { locale: Locale }) {
  const { home: h, seo } = getMessages(locale);
  const catalog = getCatalog(locale);
  const backdropSkins = [
    getSkins('sleeping-cats').find(skin => skin.id === 725),
    getSkins('y2k-media-player').find(skin => skin.id === 987),
    getSkins('medieval-announcement').find(skin => skin.id === 794),
    getSkins('sakura-cherry-blossom').find(skin => skin.id === 972),
    getSkins('arcade-pixel').find(skin => skin.id === 1067),
    getSkins('daydream').find(skin => skin.id === 761),
    getSkins('receipt-flow').find(skin => skin.id === 721),
    getSkins('poker-stack').find(skin => skin.id === 816),
    getSkins('lunar-omen').find(skin => skin.id === 687),
    getSkins('kuromi').find(skin => skin.id === 682),
  ];
  return <div className="home-page">
    <section className="hero-section">
      <HeroBackdrop bubbles={backdropSkins.flatMap(skin => skin ? [{ id: skin.id, src: skinThumbnail(skin.preview, locale) }] : [])}/>
      <div className="hero wrap">
      <div className="hero-heading"><h1><span className="headline-line">{h.hero[0]}</span>{' '}<span className="headline-line accent">{h.hero[1]}</span></h1><p>{h.tagline}</p><div className="hero-actions"><ChatStyleButton href="https://chatstyle.gg/" label={h.platform}/><a className="button hero-discover" href="#templates"><GridIcon/>{h.discover}</a></div></div>
      <div className="hero-stage"><div className="hero-showcase">{getFeaturedTemplates(locale).map(template => <figure key={template.slug} className={`hero-tile tile-${template.slug}`} data-autoplay-preview><div className="card-window" aria-hidden="true"><i/><i/><i/></div><PreviewMedia template={template} mode="hero"/><figcaption><Link prefetch={false} href={localizePath(`/overlays/${template.slug}/`, locale)}>{template.name}</Link></figcaption></figure>)}</div></div>
    </div></section>
    <section className="section gallery-section" id="templates"><div className="wrap"><h2 data-reveal>{h.gallery}</h2><Gallery items={catalog}/></div></section>
    <section className="how-section" id="so-gehts"><div className="wrap"><h2 data-reveal>{h.howTitle}</h2><ol className="steps">{h.steps.map(([title, text], index) => <li key={title} data-reveal><span className="step-number" aria-hidden="true">0{index + 1}</span><h3>{title}</h3><p>{text}</p></li>)}</ol></div></section>
    <aside className="home-guides wrap"><div className="home-guides-card"><h2>{getGuideBundle(locale).ui.homeTitle}</h2><Link className="button button-outline" href={localizePath(guidesPath, locale)}>{getGuideBundle(locale).ui.homeLink}</Link></div></aside>
    <section className="creator-section wrap" id="creator"><div className="creator-inner"><h2 data-reveal>{h.creatorTitle[0]}<br/>{h.creatorTitle[1]}</h2><div className="creator-copy"><p>{h.creatorDescription}</p><ChatStyleLink className="creator-link">{h.allDesigns} <ChatStyleLogo/></ChatStyleLink></div></div></section>
    <section className="faq-section wrap" id="fragen"><h2 data-reveal>{h.faqTitle}</h2><div className="faq-list">{h.faq.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p><RichText text={answer} locale={locale}/></p></details>)}</div></section>
    <StructuredData data={{ '@type': 'CollectionPage', inLanguage: locale, name: seo.collection, url: absoluteUrl(localizePath('/', locale)), description: seo.collectionDescription, mainEntity: { '@type': 'ItemList', itemListElement: catalog.map((template, index) => ({ '@type': 'ListItem', position: index + 1, name: template.name, url: absoluteUrl(localizePath(`/overlays/${template.slug}/`, locale)) })) } }}/>
  </div>;
}

export function templateMetadata(slug: string, locale: Locale) {
  const template = getTemplate(slug, locale);
  if (!template) notFound();
  const { seo } = getMessages(locale);
  return pageMetadata(`/overlays/${slug}/`, seo.detailTitle.replace('{name}', template.name).replace('{category}', template.category), `${template.description} ${seo.detailDescription}`, template.image, locale);
}
export function TemplatePage({ slug, locale }: { slug: string; locale: Locale }) {
  const template = getTemplate(slug, locale);
  if (!template) notFound();
  const { ui } = getMessages(locale);
  const category = getCategories(locale).find(item => item.slug === template.categorySlug)!;
  const related = getCatalog(locale).filter(item => item.slug !== slug && item.categorySlug === template.categorySlug).slice(0, 3);
  const skins = getSkins(slug);
  return <div className="wrap detail-page" data-category={template.categorySlug}><Breadcrumbs name={template.name} category={category}/>
    <section className="detail-hero"><PreviewMedia key={slug} template={template} mode="detail"/><div className="detail-copy"><h1 data-reveal>{template.name}</h1><p className="lead">{template.description}</p><ChatStyleButton href={template.shopUrl}/><p className="shop-note">{template.free ? ui.free : ui.price}</p><div className="design-note"><h2>{ui.forStream}</h2><p>{template.advice}</p></div></div></section>
    {skins.length > 0 && <SkinGallery key={slug} skins={skins} templateName={template.name}/>}
    <DiscoverCard locale={locale}/>
    <aside className="template-guides"><h2>{getGuideBundle(locale).ui.nav}</h2><div>{getGuides(locale).filter(guide => guide.examples.some(example => example.slug === slug)).slice(0, 2).map(guide => <Link key={guide.slug} href={localizePath(articlePath(guide.slug), locale)}>{guide.heading}</Link>)}<Link href={localizePath(guidesPath, locale)}>{getGuideBundle(locale).ui.all}</Link></div></aside>
    <section className="section related-section"><h2 data-reveal>{ui.related}</h2><div className="template-grid">{related.map(item => <TemplateCard key={item.slug} template={item}/>)}</div></section>
    <StructuredData data={{ '@graph': [
      { '@type': 'CreativeWork', inLanguage: locale, name: template.name, description: template.description, image: absoluteUrl(template.image), url: absoluteUrl(localizePath(`/overlays/${slug}/`, locale)), creator: { '@type': 'Person', name: config.creator, url: config.creatorUrl }, sameAs: template.url },
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: ui.home, item: absoluteUrl(localizePath('/', locale)) }, { '@type': 'ListItem', position: 2, name: category.name, item: absoluteUrl(localizePath(`/styles/${category.slug}/`, locale)) }, { '@type': 'ListItem', position: 3, name: template.name, item: absoluteUrl(localizePath(`/overlays/${slug}/`, locale)) }] },
    ] }}/>
  </div>;
}

export function categoryMetadata(slug: string, locale: Locale) {
  const category = getCategories(locale).find(item => item.slug === slug);
  if (!category) notFound();
  return pageMetadata(`/styles/${slug}/`, getMessages(locale).seo.categoryTitle.replace('{category}', category.name), category.intro, undefined, locale);
}
export function CategoryPage({ slug, locale }: { slug: string; locale: Locale }) {
  const category = getCategories(locale).find(item => item.slug === slug);
  if (!category) notFound();
  return <div className="wrap category-page" data-category={slug}><Breadcrumbs name={category.name}/><section className="category-hero"><h1 data-reveal>{category.name}</h1><p className="lead">{category.intro}</p></section><section className="section category-gallery"><Gallery items={getCatalog(locale).filter(item => item.categorySlug === slug)}/></section><DiscoverCard locale={locale}/><aside className="category-tip"><h2 data-reveal>{getMessages(locale).ui.forStream}</h2><p>{category.tip}</p></aside><StructuredData data={{ '@type': 'CollectionPage', inLanguage: locale, name: category.name, url: absoluteUrl(localizePath(`/styles/${slug}/`, locale)), description: category.intro }}/></div>;
}

export function guideMetadata(locale: Locale) {
  const { guide } = getMessages(locale);
  return pageMetadata(guidePath, guide.title, guide.description, undefined, locale);
}
export function GuidePage({ locale }: { locale: Locale }) {
  const { guide: g, ui } = getMessages(locale);
  const guideUi = getGuideBundle(locale).ui;
  const examples = ['lofi-windows-93', 'chat-garden', 'inline-flow'].map(slug => ({ slug, why: getTemplate(slug, locale)!.advice }));
  return <article className="wrap guide">
    <Breadcrumbs name={ui.guide}/><h1>{g.heading[0]}<br/>{g.heading[1]}</h1><p className="lead">{g.intro}</p>
    {g.sections.map(([title, text]) => <section key={title}><h2>{title}</h2><p><RichText text={text} locale={locale}/></p></section>)}
    <section className="legacy-guide-examples"><h2>{guideUi.examples}</h2><GuideExamples examples={examples} locale={locale}/></section>
    <Link className="guide-preview-link" href={localizePath(guidesPath, locale)}>{guideUi.all}</Link>
    <StructuredData data={{ '@type': 'Article', inLanguage: locale, headline: g.title, author: { '@type': 'Person', name: config.creator, url: config.creatorUrl }, mainEntityOfPage: absoluteUrl(localizePath(guidePath, locale)) }}/>
  </article>;
}
