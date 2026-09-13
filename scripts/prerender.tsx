import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { renderToString } from 'react-dom/server';
import { App } from '../src/App';
import { content } from '../src/data/content';
import { site } from '../src/data/site';
import { projectUrl, researchUrl } from '../src/components/ui';
const ids = content.projects.map(p => p.id.toLowerCase());
if (new Set(ids).size !== ids.length || ids.some(id => !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)))
  throw new Error('Project ids must be unique URL-safe slugs');
const template = await readFile('dist/index.html', 'utf8');
const escape = (text: string) =>
  text.replace(
    /[&<>"']/g,
    char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!,
  );
// SITE_URL is public build configuration, never a secret.
const origin = (process.env.SITE_URL || site.url).replace(/\/$/, '');
if (origin && new URL(origin).protocol !== 'https:') throw new Error('SITE_URL must use HTTPS');
const pages = [
  { path: '/', title: site.title, description: site.description },
  {
    path: researchUrl,
    title: content.research.theme + '（研究） | ' + site.title,
    description: content.research.summary,
  },
  ...content.projects.map(p => ({
    path: projectUrl(p.id),
    title: p.name + ' | ' + site.title,
    description: p.summary,
  })),
  {
    path: '/404.html',
    title: 'ページが見つかりません | ' + site.title,
    description: site.description,
  },
];
for (const page of pages) {
  const canonical = origin + page.path;
  const meta = [
    '<meta property="og:type" content="website"/>',
    '<meta property="og:locale" content="ja_JP"/>',
    '<meta property="og:site_name" content="' + escape(site.title) + '"/>',
    '<meta property="og:title" content="' + escape(page.title) + '"/>',
    '<meta property="og:description" content="' + escape(page.description) + '"/>',
    '<meta name="twitter:card" content="summary_large_image"/>',
    ...(origin
      ? [
          '<link rel="canonical" href="' + escape(canonical) + '"/>',
          '<meta property="og:url" content="' + escape(canonical) + '"/>',
          '<meta property="og:image" content="' + escape(origin) + '/og.png"/>',
          '<meta property="og:image:width" content="1200"/>',
          '<meta property="og:image:height" content="630"/>',
          '<meta property="og:image:alt" content="Portfolio — Research and Engineering"/>',
        ]
      : []),
    ...(site.sample || page.path === '/404.html'
      ? ['<meta name="robots" content="noindex, nofollow"/>']
      : []),
  ].join('');
  const html = template
    .replace(/<title>.*?<\/title>/, '<title>' + escape(page.title) + '</title>')
    .replace(
      /<meta name="description"[^>]*>/,
      '<meta name="description" content="' + escape(page.description) + '"/>',
    )
    .replace('</head>', meta + '</head>')
    .replace(
      '<div id="root"></div>',
      '<div id="root">' + renderToString(<App path={page.path} />) + '</div>',
    );
  const file = 'dist' + (page.path.endsWith('/') ? page.path + 'index.html' : page.path);
  await mkdir(file.slice(0, file.lastIndexOf('/')), { recursive: true });
  await writeFile(file, html);
}
await writeFile('dist/.nojekyll', '');
await writeFile(
  'dist/robots.txt',
  site.sample
    ? 'User-agent: *\nDisallow: /\n'
    : 'User-agent: *\nAllow: /\n' + (origin ? 'Sitemap: ' + origin + '/sitemap.xml\n' : ''),
);
if (origin && !site.sample)
  await writeFile(
    'dist/sitemap.xml',
    '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
      pages
        .filter(p => p.path !== '/404.html')
        .map(p => '<url><loc>' + escape(origin + p.path) + '</loc></url>')
        .join('') +
      '</urlset>',
  );
console.log('Generated ' + pages.length + ' static pages.');
