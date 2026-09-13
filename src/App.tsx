import { content as c } from './data/content';
import { site } from './data/site';
import { Header } from './components/Header';
import {
  ExternalLink,
  Field,
  Heading,
  ProjectCard,
  ProjectLinks,
  Screenshot,
  projectUrl,
  researchUrl,
  safeUrl,
} from './components/ui';
import type { Project } from './data/types';
const hasContent = (value: string) => Boolean(value) && !value.includes('［');
function Home() {
  const featured = c.projects.find(p => p.featured);
  const r = c.research;
  const a = c.about;
  const repositories = c.repositories.filter(r => safeUrl(r.url));
  const other = c.projects.filter(p => p.status === 'preparing' && hasContent(p.name));
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">研究と開発のポートフォリオ</p>
          <h1 id="hero-title">{a.name}</h1>
          <p className="position">{a.focus}</p>
          <p className="intro">{a.intro}</p>
          <p className="affiliation">
            {a.affiliation ? (
              <>
                <span>
                  {a.affiliation.university} · {a.affiliation.year}
                </span>
                <span>{a.affiliation.program}</span>
              </>
            ) : (
              a.position
            )}
          </p>
          <div className="actions hero-actions">
            <a className="button primary" href="#projects">
              制作物を見る ↓
            </a>
            <a className="button" href="#research">
              研究について ↓
            </a>
          </div>
        </div>
        {featured && (
          <aside className="featured">
            <a
              href={projectUrl(featured.id)}
              className="project-image-link"
              aria-label={featured.name + 'の詳細を読む'}
            >
              <Screenshot src={featured.screenshot} alt={featured.screenshotAlt ?? featured.name} />
            </a>
            <div className="featured-caption">
              <span>Featured</span>
              <a href={projectUrl(featured.id)}>{featured.name} →</a>
            </div>
            <p>{featured.summary}</p>
          </aside>
        )}
      </section>
      <section id="projects" className="section projects">
        <Heading number="01" title="Projects" note="制作物と開発背景" />
        <div className="project-grid">
          {c.projects
            .filter(p => p.status === 'published')
            .map(p => (
              <ProjectCard key={p.id} project={p} />
            ))}
        </div>
        {(other.length > 0 || repositories.length > 0) && (
          <div className="secondary-grid">
            {other.map(p => (
              <ProjectCard key={p.id} project={p} />
            ))}
            {repositories.length > 0 && (
              <aside className="repositories">
                <h3>その他のリポジトリ</h3>
                {repositories.map(r => (
                  <div className="repo-row" key={r.url}>
                    <ExternalLink href={r.url}>{r.name}</ExternalLink>
                    <p>{r.description}</p>
                  </div>
                ))}
              </aside>
            )}
          </div>
        )}
      </section>
      <section id="research" className="section research">
        <Heading number="02" title="Research" note="研究について" />
        <div className="research-lead">
          <h3>{r.theme}</h3>
          <p className="research-summary">{r.summary}</p>
          <div className="actions">
            <a className="button primary" href={researchUrl}>
              研究の詳細を読む →
            </a>
          </div>
        </div>
        {r.highlights.length > 0 && (
          <div className="research-cards">
            {r.highlights.map(h => (
              <article className="research-card" key={h.label}>
                <h4>{h.label}</h4>
                <p>{h.text}</p>
              </article>
            ))}
          </div>
        )}
        <dl className="research-meta">
          {r.outputs.length > 0 && (
            <div>
              <dt>発表</dt>
              <dd>
                {r.outputs[0].venue}（{r.outputs[0].date}）
                {r.outputs.length > 1 && ` ほか${r.outputs.length - 1}件`}
              </dd>
            </div>
          )}
          <div>
            <dt>実装コード</dt>
            <dd>{r.codeNote}</dd>
          </div>
        </dl>
      </section>
      <section id="awards" className="section awards">
        <Heading number="03" title="Awards" note="受賞歴" />
        <div className="award-list">
          {c.awards.map((w, i) => (
            <article className="award-card" key={i}>
              <div>
                <strong>{w.date}</strong>
              </div>
              <div>
                <h3>{w.title}</h3>
                <p>{w.organization}</p>
                {w.event && <p>{w.event}</p>}
              </div>
              <div>
                <Field label="TARGET">{w.target}</Field>
                {w.detail && <p className="code-note">{w.detail}</p>}
              </div>
            </article>
          ))}
        </div>
      </section>
      <section id="experience" className="section experience">
        <Heading number="04" title="Experience" note="これまでの経験" />
        <div className="experience-list">
          {c.experience
            .filter(e => hasContent(e.title))
            .map((e, i) => (
              <article className="experience-card" key={i}>
                <div>
                  <strong>{e.period}</strong>
                  <p>{e.type}</p>
                </div>
                <div>
                  <h3>{e.title}</h3>
                  <p>{e.role}</p>
                  <p>{e.work}</p>
                </div>
                <div>
                  <Field label="RESULT">{e.result}</Field>
                  {e.award && <p>{e.award}</p>}
                </div>
              </article>
            ))}
        </div>
      </section>
      <section id="skills" className="section skills">
        <Heading number="05" title="Skills" note="技術の活用実績" />
        <div className="skills-grid">
          {c.skills.map(s => (
            <article key={s.category} className="skill-card">
              <h3>{s.category}</h3>
              <div className="skill-items">
                {s.items.map((item, i) => {
                  const ids = item.projectIds.filter(id =>
                    c.projects.some(p => p.id === id && p.status === 'published'),
                  );
                  return (
                    <div key={i}>
                      <div className="chips">
                        {ids.length ? (
                          <a href={'#' + ids[0]}>{item.name}</a>
                        ) : (
                          <span>{item.name}</span>
                        )}
                      </div>
                      <p>
                        {item.usage}{' '}
                        {ids.map(id => (
                          <a key={id} href={'#' + id}>
                            {' '}
                            → {c.projects.find(p => p.id === id)?.shortName ?? id}
                          </a>
                        ))}
                      </p>
                    </div>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      </section>
      {c.certifications.length > 0 && (
        <section id="certifications" className="section awards">
          <Heading number="06" title="Certifications" note="資格" />
          <div className="award-list">
            {c.certifications.map((cert, i) => (
              <article className="award-card" key={i}>
                <div>{cert.date && <strong>{cert.date}</strong>}</div>
                <div>
                  <h3>{cert.title}</h3>
                  <p>{cert.organization}</p>
                </div>
                <div>{cert.detail && <Field label="SCORE">{cert.detail}</Field>}</div>
              </article>
            ))}
          </div>
        </section>
      )}
      <section id="about" className="section about">
        <div className="about-copy">
          <Heading number="07" title="About" note="プロフィール" />
          <p>{a.bio}</p>
          <div className="values">
            {hasContent(a.values) && <Field label="VALUES">{a.values}</Field>}
            <Field label="NEXT">{a.next}</Field>
          </div>
        </div>
        <div className="contact">
          <h3>連絡先・関連リンク</h3>
          {(
            [
              ['GitHub — 個人開発・インターン', a.contacts.github],
              ['GitHub — 大学・研究', a.contacts.academicGithub],
              ['LinkedIn', a.contacts.linkedin],
              ['Resume / CV', a.contacts.resume],
            ] as const
          )
            .filter(([, url]) => safeUrl(url))
            .map(([label, url]) => (
              <div className="contact-row" key={label}>
                <ExternalLink href={url}>{label}</ExternalLink>
              </div>
            ))}
          {a.contacts.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.contacts.email) && (
            <div className="contact-row">
              <a href={'mailto:' + a.contacts.email}>{a.contacts.email} ✉</a>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
function ResearchDetail() {
  const r = c.research;
  const a = c.about;
  const blocks: [string, string][] = [
    ['背景', r.background],
    ['研究課題', r.question],
    ['これまでの取り組み', [r.method, r.system].filter(Boolean).join('\n')],
    ['得られた知見', r.learned],
    ['現在の状況', r.status],
  ];
  return (
    <article className="detail section">
      <a className="back-link" href="/#research">
        ← トップページに戻る
      </a>
      <p className="eyebrow">Research</p>
      <h1>{r.theme}</h1>
      <p className="intro">{r.summary}</p>
      <dl className="detail-meta">
        {a.affiliation && (
          <>
            <div>
              <dt>所属</dt>
              <dd>{a.affiliation.university}</dd>
            </div>
            <div>
              <dt>学年</dt>
              <dd>{a.affiliation.year}</dd>
            </div>
            <div>
              <dt>専攻</dt>
              <dd>{a.affiliation.program}</dd>
            </div>
          </>
        )}
      </dl>
      {blocks.map(
        ([label, text]) =>
          text && (
            <section className="detail-block" key={label}>
              <h2>{label}</h2>
              <p>{text}</p>
            </section>
          ),
      )}
      {r.architectureImage && (
        <section className="detail-block">
          <h2>システム構成</h2>
          <Screenshot
            src={r.architectureImage}
            alt={r.architectureAlt ?? '研究システムの構成図'}
            kind="architecture"
          />
        </section>
      )}
      {r.outputs.length > 0 && (
        <section className="detail-block">
          <h2>発表・論文</h2>
          <ul className="output-list">
            {r.outputs.map(o => (
              <li key={o.title}>
                <p className="output-title">{o.title}</p>
                <p className="output-venue">
                  {o.venue}（{o.date}
                  {o.location && `・${o.location}`}）
                </p>
                {o.note && <p className="code-note">{o.note}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}
      <section className="detail-block">
        <h2>コードの公開について</h2>
        <p>{r.codeNote}</p>
      </section>
      <a className="button strong" href="/#research">
        ← トップページに戻る
      </a>
    </article>
  );
}
function Detail({ p }: { p: Project }) {
  return (
    <article className="detail section">
      <a className="back-link" href={'/#' + p.id}>
        ← 制作一覧に戻る
      </a>
      <p className="eyebrow">{p.status === 'preparing' ? '公開準備中' : '公開中'}</p>
      <h1>{p.name}</h1>
      <p className="intro">{p.summary}</p>
      <dl className="detail-meta">
        <div>
          <dt>開発形態</dt>
          <dd>
            {p.format === 'team'
              ? p.teamSize
                ? `${p.teamSize}人チーム`
                : 'チーム開発'
              : p.format === 'solo'
                ? '個人開発'
                : '開発プロジェクト'}
          </dd>
        </div>
        <div>
          <dt>開発期間</dt>
          <dd>{p.period}</dd>
        </div>
        <div>
          <dt>使用技術</dt>
          <dd>{p.stack.join(' / ')}</dd>
        </div>
      </dl>
      <Screenshot src={p.screenshot} alt={p.screenshotAlt ?? p.name + 'の画面'} />
      {[
        ['概要', p.summary],
        ['課題', p.problem],
        ['解決方法', p.solution ?? p.approach],
        ['担当', p.myRole],
        ['技術上の課題と対応', p.technicalChallenges],
        ['システム構成', p.architecture],
        ...(p.status === 'preparing'
          ? [
              ['現在の状況', p.statusNote],
              ['公開予定', p.publishPlan],
            ]
          : [
              ['成果', p.result ?? p.teamResult],
              ['担当範囲', p.myContribution],
            ]),
      ].map(
        ([label, text]) =>
          text && (
            <section className="detail-block" key={label}>
              <h2>{label}</h2>
              <p>{text}</p>
              {label === 'システム構成' && p.architectureImage && (
                <Screenshot
                  src={p.architectureImage}
                  alt={p.architectureAlt ?? p.name + 'の構成図'}
                />
              )}
            </section>
          ),
      )}
      <section className="detail-block">
        <h2>関連リンク</h2>
        <ProjectLinks project={p} detail={false} />
        {p.demoNote && <p className="code-note">{p.demoNote}</p>}
        {(p.status === 'preparing' || (!safeUrl(p.links.github) && !safeUrl(p.links.demo))) && (
          <p>公開リンクは準備中です。</p>
        )}
      </section>
      <a className="button strong" href={'/#' + p.id}>
        ← 制作一覧に戻る
      </a>
    </article>
  );
}
export function App({ path = '/' }: { path?: string }) {
  const p = c.projects.find(
    p => projectUrl(p.id) === path || projectUrl(p.id).slice(0, -1) === path,
  );
  const home = path === '/' || path === '/index.html';
  const research = path === researchUrl || path === researchUrl.slice(0, -1);
  return (
    <div className="site">
      <a className="skip-link" href="#main">
        本文へスキップ
      </a>
      <Header detail={!home} />
      <main id="main">
        {home ? (
          <Home />
        ) : research ? (
          <ResearchDetail />
        ) : p ? (
          <Detail p={p} />
        ) : (
          <section className="section not-found">
            <h1>ページが見つかりません</h1>
            <a href="/">トップページへ戻る →</a>
          </section>
        )}
      </main>
      <footer>
        {site.draftNotice && <p>掲載内容は更新中です。</p>}
        <span>Portfolio — Research & Engineering</span>
      </footer>
    </div>
  );
}
