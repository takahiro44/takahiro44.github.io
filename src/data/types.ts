export interface Project {
  card?: Partial<
    Pick<
      Project,
      'problem' | 'solution' | 'engineering' | 'result' | 'teamResult' | 'myContribution' | 'myRole'
    >
  >;
  id: string;
  name: string;
  shortName?: string;
  summary: string;
  status: 'published' | 'preparing' | 'repo-only';
  format: 'solo' | 'team' | 'unspecified';
  teamSize?: number;
  myRole: string;
  problem: string;
  solution?: string;
  approach?: string;
  engineering?: string;
  result?: string;
  teamResult?: string;
  myContribution?: string;
  stack: string[];
  links: { github?: string; demo?: string };
  screenshot?: string | null;
  screenshotAlt?: string;
  featured?: boolean;
  period: string;
  technicalChallenges: string;
  architecture: string;
  architectureImage?: string;
  architectureAlt?: string;
  statusNote?: string;
  publishPlan?: string;
  demoNote?: string;
}
export interface Content {
  about: {
    affiliation?: { university: string; program: string; year: string };
    name: string;
    position: string;
    focus: string;
    intro: string;
    bio: string;
    values: string;
    next: string;
    contacts: {
      github?: string;
      academicGithub?: string;
      email?: string;
      linkedin?: string;
      resume?: string;
    };
  };
  projects: Project[];
  repositories: { name: string; description: string; language: string; url?: string }[];
  research: {
    theme: string;
    summary: string;
    highlights: { label: string; text: string }[];
    background: string;
    question: string;
    method: string;
    system: string;
    learned: string;
    status: string;
    outputs: { title: string; venue: string; date: string; location?: string; note?: string }[];
    architectureImage?: string | null;
    architectureAlt?: string;
    codePublic: false;
    codeNote: string;
    technologies: string[];
  };
  experience: {
    period: string;
    type: string;
    title: string;
    format: string;
    teamSize?: number;
    role: string;
    work: string;
    result: string;
    tech: string[];
    award?: string | null;
  }[];
  awards: {
    title: string;
    organization: string;
    event?: string;
    date: string;
    target: string;
    detail?: string;
  }[];
  skills: {
    category: string;
    highlight?: boolean;
    items: { name: string; usage: string; projectIds: string[] }[];
  }[];
  certifications: {
    title: string;
    organization: string;
    date?: string;
    detail?: string;
  }[];
}
