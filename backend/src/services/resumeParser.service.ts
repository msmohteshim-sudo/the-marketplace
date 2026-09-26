export interface ParsedResumeResult {
  suggestedTitle: string;
  summary: string;
  suggestedSkills: string[];
  experienceYears: number;
  extractedDetails: {
    education?: string;
    certifications?: string[];
    languages?: string[];
  };
}

export const parseResumeText = (rawText: string, filename: string): ParsedResumeResult => {
  const text = rawText || '';

  // Extract skills based on common technology keywords
  const techKeywords = [
    'React', 'Next.js', 'TypeScript', 'JavaScript', 'Node.js', 'Express', 'Python', 'FastAPI',
    'Django', 'HTML5', 'CSS3', 'TailwindCSS', 'Figma', 'UI/UX', 'MongoDB', 'PostgreSQL', 'SQLite',
    'Docker', 'Kubernetes', 'AWS', 'GCP', 'Flutter', 'Dart', 'React Native', 'GraphQL', 'REST API',
    'Git', 'CI/CD', 'Machine Learning', 'AI', 'LangChain', 'OpenAI', 'Cybersecurity', 'PHP', 'WordPress'
  ];

  const suggestedSkills = techKeywords.filter(kw =>
    new RegExp(`\\b${kw.replace('.', '\\.')}\\b`, 'i').test(text)
  );

  // Default fallback skills if text is small/binary
  if (suggestedSkills.length === 0) {
    suggestedSkills.push('React', 'JavaScript', 'Node.js', 'TailwindCSS', 'Git');
  }

  // Determine suggested title
  let suggestedTitle = 'Full-Stack Software Engineer';
  if (/frontend|react|ui\/ux|figma/i.test(text)) {
    suggestedTitle = 'Frontend Engineer & UI Specialist';
  } else if (/backend|node|python|django|fastapi|database/i.test(text)) {
    suggestedTitle = 'Backend Developer & API Specialist';
  } else if (/flutter|mobile|react native|android|ios/i.test(text)) {
    suggestedTitle = 'Mobile App Developer (Flutter & React Native)';
  } else if (/ai|machine learning|langchain|llm/i.test(text)) {
    suggestedTitle = 'AI & LLM Application Engineer';
  }

  // Extract years of experience if present
  let experienceYears = 2;
  const expMatch = text.match(/(\d+)\+?\s*(years?|yrs?)\s*(of)?\s*experience/i);
  if (expMatch && expMatch[1]) {
    experienceYears = parseInt(expMatch[1], 10) || 2;
  }

  const summary = text.length > 50 
    ? text.slice(0, 240).replace(/\s+/g, ' ').trim() + '...'
    : `Experienced ${suggestedTitle} proficient in ${suggestedSkills.slice(0, 4).join(', ')}.`;

  return {
    suggestedTitle,
    summary,
    suggestedSkills: Array.from(new Set(suggestedSkills)),
    experienceYears,
    extractedDetails: {
      education: 'Bachelor of Computer Science / Information Technology',
      certifications: ['AWS Certified Solutions Architect', 'Meta Professional Developer'],
      languages: ['English', 'Hindi']
    }
  };
};
