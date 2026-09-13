import { useEffect, useState } from 'react';
import { content } from '../data/content';
const sections = [
  'projects',
  'research',
  'awards',
  'experience',
  'skills',
  'certifications',
  'about',
];
export function Header({ detail = false }: { detail?: boolean }) {
  const [active, setActive] = useState('projects');
  useEffect(() => {
    if (detail) return;
    const nodes = sections
      .map(id => document.getElementById(id))
      .filter((node): node is HTMLElement => !!node);
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-15% 0px -55% 0px', threshold: 0 },
    );
    nodes.forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, [detail]);
  return (
    <header className="header">
      <a className="brand" href="/">
        {content.about.name}
        <span>.dev</span>
      </a>
      <nav aria-label="メインナビゲーション">
        {sections.map(id => (
          <a
            key={id}
            href={(detail ? '/' : '') + '#' + id}
            aria-current={!detail && active === id ? 'location' : undefined}
          >
            {id[0].toUpperCase() + id.slice(1)}
          </a>
        ))}
      </nav>
    </header>
  );
}
