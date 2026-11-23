import Link from 'next/link';
import { notFound } from 'next/navigation';
import { absoluteUrl, config } from '@/lib/catalog';
import { getSkins } from '@/lib/skins';
import { getMessages, localizePath, guidePath, type Locale } from '@/lib/i18n';
import { getGuideTemplate, getGuide, getGuides, getGuideBundle, guideGroups, articlePath, guidesPath, type GuideExample } from '@/lib/guides';
import { pageMetadata } from '@/lib/metadata';
import { Breadcrumbs, ChatStyleButton, ChatStyleLink, ChatStyleLogo, StructuredData } from './site-chrome';
import { PreviewMedia } from './preview-media';
import { DiscoverCard } from './discover-card';
import { ChatMakeover } from './chat-makeover';
import { skinThumbnail } from '@/lib/skin-paths';
import { CommunityTemplates } from './community-templates';

export function guidesMetadata(locale: Locale) {
  const { ui } = getGuideBundle(locale);
  return pageMetadata(guidesPath, ui.title, ui.description, undefined, locale);
}

export function articleMetadata(slug: string, locale: Locale) {
  const article = getGuide(slug, locale);
  if (!article) notFound();
  const metadata = pageMetadata(articlePath(slug), article.title, article.description, getGuideTemplate(article.examples[0].slug, locale)?.image, locale);
  return { ...metadata, openGraph: { ...metadata.openGraph, type: 'article' as const } };
}

export function GuideCards({ locale, slugs, headingLevel = 2 }: { locale: Locale; slugs?: string[]; headingLevel?: 2 | 3 }) {
  const all = getGuides(locale);
  const guides = slugs ? slugs.map(slug => all.find(guide => guide.slug === slug)!) : all;
  const Heading = headingLevel === 3 ? 'h3' : 'h2';
  return <div className="guide-cards">{guides.map((guide, index) => {
    const illustration = guide.examples[guide.slug === 'cute-cozy-chat-overlays' ? 1 : 0];
    const template = getGuideTemplate(illustration.slug, locale)!;
    const skin = illustration.skinId ? getSkins(template.slug).find(skin => skin.id === illustration.skinId) : undefined;
    return <Link prefetch={false} className={`guide-card guide-tone-${index % 3}`} key={guide.slug} href={localizePath(articlePath(guide.slug), locale)}>
      <img className={skin ? 'guide-card-skin' : undefined} src={skin ? skinThumbnail(skin.preview, locale) : template.image.replace('.webp', '.360.webp')} alt="" width="360" height="360" loading="lazy"/>
      <div><Heading>{guide.heading}</Heading><p>{guide.description}</p></div>
    </Link>;
  })}</div>;
}

export function GuidesPage({ locale }: { locale: Locale }) {
  const { ui } = getGuideBundle(locale);
  const messages = getMessages(locale);
  return <div className="wrap guides-index">
    <Breadcrumbs name={ui.nav}/>
    <header className="guides-index-heading"><h1>{ui.heading}</h1><p className="lead">{ui.intro}</p><nav className="article-contents" aria-label={ui.contents}>{guideGroups.map(group => <a key={group.id} href={`#${group.id}`}>{ui[group.label as keyof typeof ui]}</a>)}</nav></header>
    {guideGroups.map(group => <section className="guide-group" id={group.id} key={group.id} aria-labelledby={`${group.id}-title`}><h2 id={`${group.id}-title`}>{ui[group.label as keyof typeof ui]}</h2><GuideCards locale={locale} slugs={group.slugs} headingLevel={3}/></section>)}
    <Link className="guide-start" href={localizePath(guidePath, locale)}><h2>{messages.guide.title}</h2><p>{messages.guide.description}</p></Link>
    <StructuredData data={{ '@type': 'CollectionPage', inLanguage: locale, name: ui.title, description: ui.description, url: absoluteUrl(localizePath(guidesPath, locale)), mainEntity: { '@type': 'ItemList', itemListElement: getGuides(locale).map((guide, index) => ({ '@type': 'ListItem', position: index + 1, name: guide.title, url: absoluteUrl(localizePath(articlePath(guide.slug), locale)) })) } }}/>
  </div>;
}

export function GuideExamples({ examples, locale }: { examples: GuideExample[]; locale: Locale }) {
  const { ui } = getGuideBundle(locale);
  return <><div className="guide-examples" data-count={examples.length}>{examples.map(example => {
    const template = getGuideTemplate(example.slug, locale)!;
    const skin = example.skinId ? getSkins(template.slug).find(skin => skin.id === example.skinId) : undefined;
    const href = localizePath(`/overlays/${template.slug}/${skin ? `?skin=${skin.id}#skins` : ''}`, locale);
    return <article className="guide-example" data-hover-preview key={`${template.slug}-${skin?.id ?? ''}`}>
      {skin ? <Link className="guide-skin-image" href={href} prefetch={false} aria-label={`${template.name} · ${skin.name}`}><img src={skinThumbnail(skin.preview, locale)} alt={`${template.name} · ${skin.name}`} width="360" height="220" loading="lazy"/></Link> : <PreviewMedia template={template} mode="hover" externalUrl={template.localDetail ? undefined : template.shopUrl}/>}
      <div className="guide-example-copy"><h3>{template.localDetail ? <Link href={href} prefetch={false}>{template.name}{skin && <span> · {skin.name}</span>}</Link> : template.name}</h3><p>{example.why}</p>
        <div className="guide-example-links">{template.localDetail && <Link className="button button-preview" href={href} prefetch={false}>{skin ? ui.skinPreview : ui.preview}</Link>}<ChatStyleButton href={template.shopUrl}/></div>
      </div>
    </article>;
  })}</div><DiscoverCard locale={locale}/></>;
}

export function GuideArticlePage({ slug, locale }: { slug: string; locale: Locale }) {
  const article = getGuide(slug, locale);
  if (!article) notFound();
  const { ui } = getGuideBundle(locale);
  const messages = getMessages(locale);
  const url = absoluteUrl(localizePath(articlePath(slug), locale));
  const examples = <section id="examples" className="article-examples"><h2>{ui.examples}</h2>{article.communityExamples ? <><CommunityTemplates/><DiscoverCard locale={locale}/></> : <GuideExamples examples={article.examples} locale={locale}/>}</section>;
  const steps = <section id="steps" className="article-steps"><h2>{ui.steps}</h2><ol>{article.steps.map(([title, text], index) => <li key={title}><span className="article-step-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><div><h3>{title}</h3><p>{text}</p></div></li>)}</ol></section>;
  return <article className={`guide-article guide-topic-${slug}`}>
    <div className="wrap"><nav className="breadcrumbs" aria-label={messages.ui.breadcrumbs}><Link href={localizePath('/', locale)}>{messages.ui.home}</Link><span aria-hidden="true">/</span><Link href={localizePath(guidesPath, locale)}>{ui.nav}</Link></nav></div>
    <header className="article-hero"><div className="wrap"><h1>{article.heading}</h1><p className="lead">{article.intro}</p>
      <nav className="article-contents" aria-label={ui.contents}>{article.stepsFirst ? <><a href="#steps">{ui.steps}</a><a href="#examples">{ui.examples}</a></> : <><a href="#examples">{ui.examples}</a><a href="#steps">{ui.steps}</a></>}<a href="#questions">{ui.faq}</a></nav>
    </div></header>
    <div className="wrap article-body">
      {article.comparison && <ChatMakeover looks={article.examples.map(example => { const template = getGuideTemplate(example.slug, locale)!; const skin = getSkins(example.slug).find(skin => skin.id === example.skinId)!; return { name: template.name, skin: skin.name, preview: skin.preview }; })}/>}
      <p className="article-answer">{article.answer}</p>
      {article.reference && <section className="article-reference"><table><caption>{article.reference.title}</caption><thead><tr>{article.reference.columns.map(column => <th key={column} scope="col">{column}</th>)}</tr></thead><tbody>{article.reference.rows.map(([label, ...cells]) => <tr key={label}><th scope="row">{label}</th>{cells.map((cell, index) => <td key={index}>{cell}</td>)}</tr>)}</tbody></table></section>}
      {article.stepsFirst ? <>{steps}{examples}</> : <>{examples}{steps}</>}
      <section className="article-notes"><h2>{ui.notes}</h2><div>{article.notes.map(([title, text]) => <section key={title}><h3>{title}</h3><p>{text}</p></section>)}</div></section>
      <section id="questions" className="article-faq"><h2>{ui.faq}</h2><div className="faq-list">{article.faq.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></section>
      {article.sources.length > 0 && <aside className="article-sources"><h2>{ui.sources}</h2><ul>{article.sources.map(source => <li key={source.url}>{source.url.startsWith('https://chatstyle.gg/') ? <ChatStyleLink href={source.url}><span>{source.label}</span><ChatStyleLogo/></ChatStyleLink> : <a href={source.url} target="_blank" rel="noopener">{source.label}<span className="sr-only"> ({messages.ui.newTab})</span></a>}</li>)}</ul></aside>}
      <section className="article-related"><h2>{ui.related}</h2><GuideCards locale={locale} slugs={article.related}/><Link className="guide-preview-link" href={localizePath(guidesPath, locale)}>{ui.all}</Link></section>
    </div>
    <StructuredData data={{ '@graph': [
      { '@type': 'Article', inLanguage: locale, headline: article.title, description: article.description, image: absoluteUrl(getGuideTemplate(article.examples[0].slug, locale)!.image), author: { '@type': 'Person', name: config.creator, url: config.creatorUrl }, mainEntityOfPage: url, url, citation: article.sources.map(source => source.url) },
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: messages.ui.home, item: absoluteUrl(localizePath('/', locale)) }, { '@type': 'ListItem', position: 2, name: ui.nav, item: absoluteUrl(localizePath(guidesPath, locale)) }, { '@type': 'ListItem', position: 3, name: article.heading, item: url }] }
    ] }}/>
  </article>;
}
