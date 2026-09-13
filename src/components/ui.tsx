import type { ReactNode } from 'react';
import type { Project } from '../data/types';
export const projectUrl = (id: string) => '/projects/' + id.toLowerCase() + '/';
export const researchUrl = '/research/';
export function safeUrl(url?: string): string | undefined {
  if (!url || /[［］\s]/u.test(url)) return;
  if (/^\/(?!\/)/.test(url)) return url;
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'https:') return url;
  } catch {
    /* Unset or invalid links are not interactive. */
  }
}
export function ExternalLink({
  href,
  children,
  className = '',
}: {
  href?: string;
  children: ReactNode;
  className?: string;
}) {
  const url = safeUrl(href);
  return url ? (
    <a className={className} href={url} target="_blank" rel="noopener noreferrer">
      {children} <span aria-hidden="true">↗</span>
      <span className="sr-only">（新しいタブで開く）</span>
    </a>
  ) : null;
}
export function Heading({ number, title, note }: { number: string; title: string; note?: string }) {
  return (
    <div className="section-heading">
      <span>{number}</span>
      <h2>{title}</h2>
      {note && <p>{note}</p>}
    </div>
  );
}
const fieldLabels: Record<string, string> = {
  PROBLEM: '課題',
  SOLUTION: '解決方法',
  ENGINEERING: '設計・実装上の工夫',
  RESULT: '成果',
  'TEAM RESULT': 'チームの成果',
  'MY CONTRIBUTION': '担当範囲',
  BACKGROUND: '背景',
  QUESTION: '研究課題',
  'METHOD ／ SYSTEM': '取り組んだテーマ',
  LEARNED: '得られた知見',
  STATUS: '現在の状況',
  OUTPUT: '発表・論文',
  VALUES: '大切にしていること',
  NEXT: 'これから',
  TARGET: '対象',
  SCORE: '成績',
};
export function Field({ label, children }: { label: string; children: ReactNode }) {
  return children ? (
    <div className="field">
      <p className={'field-label ' + (label === 'PROBLEM' ? 'accent' : '')}>
        {fieldLabels[label] ?? label}
      </p>
      <div>{children}</div>
    </div>
  ) : null;
}
export function Screenshot({
  src,
  alt,
  kind = 'product',
}: {
  src?: string | null;
  alt: string;
  kind?: string;
}) {
  return (
    <div className={'screenshot ' + kind}>
      {src ? (
        <img src={src} alt={alt} loading="lazy" />
      ) : (
        <span>
          {kind === 'architecture' ? '研究システムの構成図' : 'プロダクト画面'}
          <br />［ 画像を準備中 ］
        </span>
      )}
    </div>
  );
}
export function ProjectLinks({ project, detail = true }: { project: Project; detail?: boolean }) {
  return (
    <div className="actions">
      {detail && (
        <a className="button primary" href={projectUrl(project.id)}>
          {project.status === 'preparing' ? '技術メモを読む' : '詳しく見る'} →
        </a>
      )}
      {project.status !== 'preparing' && (
        <>
          <ExternalLink className="button" href={project.links.github}>
            GitHub
          </ExternalLink>
          <ExternalLink className="button" href={project.links.demo}>
            デモ
          </ExternalLink>
        </>
      )}
    </div>
  );
}
export function ProjectCard({ project: p }: { project: Project }) {
  const copy = { ...p, ...p.card };
  return (
    <article id={p.id} className="project-card" aria-labelledby={p.id + '-title'}>
      <div className="project-visual">
        <div className="card-bar">
          <span>{p.period}</span>
          <span>
            {p.format === 'team'
              ? p.teamSize
                ? `${p.teamSize}人チーム`
                : 'チーム開発'
              : p.format === 'solo'
                ? '個人開発'
                : '開発プロジェクト'}
          </span>
        </div>
        <a
          className="project-image-link"
          href={projectUrl(p.id)}
          aria-label={p.name + 'の詳細を読む'}
        >
          <Screenshot src={p.screenshot} alt={p.screenshotAlt ?? p.name + 'の画面'} />
        </a>
        <h3 id={p.id + '-title'}>{p.name}</h3>
        <p className="project-summary">{p.summary}</p>
        <ProjectLinks project={p} />
        {p.demoNote && <p className="code-note">{p.demoNote}</p>}
      </div>
      <div className="card-body">
        <div className="fields">
          <Field label="PROBLEM">{copy.problem}</Field>
          <Field label="SOLUTION">{copy.solution ?? p.approach}</Field>
          <Field label="ENGINEERING">{copy.engineering}</Field>
        </div>
        <div className="project-outcome">
          <Field label={p.format === 'team' ? 'TEAM RESULT' : 'RESULT'}>
            {copy.teamResult ?? copy.result ?? p.statusNote}
          </Field>
          <Field label="MY CONTRIBUTION">{copy.myContribution ?? copy.myRole}</Field>
        </div>
        <dl className="project-meta">
          <div>
            <dt>使用技術</dt>
            <dd>{p.stack.join(' / ')}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
