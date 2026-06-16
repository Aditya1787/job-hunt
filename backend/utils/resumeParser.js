import fs from 'fs';
import pdf from 'pdf-parse';

const KNOWN_SKILLS = [
  'React', 'Node.js', 'Express', 'MongoDB', 'Vue', 'Angular', 'Svelte',
  'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Tailwind CSS', 'Bootstrap',
  'Java', 'Python', 'C++', 'C#', 'Go', 'Rust', 'Ruby', 'PHP', 'SQL',
  'PostgreSQL', 'MySQL', 'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure',
  'Git', 'GraphQL', 'REST APIs', 'Redux', 'Next.js', 'Django', 'Flask',
  'FastAPI', 'Spring Boot', 'Figma', 'Agile', 'Scrum', 'Project Management'
];

/**
 * Reads a PDF resume from disk and extracts matched skills.
 * @param {string} filePath - Absolute or relative path to PDF file
 * @returns {Promise<string[]>} Array of matched skills
 */
export const extractSkillsFromPDF = async (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`File does not exist: ${filePath}`);
      return [];
    }

    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    const text = data.text;
    
    return parseTextForSkills(text);
  } catch (error) {
    console.error('Error parsing resume PDF, attempting fallback text matching...', error.message);
    
    // Fallback: Check if file can be read as plain text (if it was a mocked file)
    try {
      const plainText = fs.readFileSync(filePath, 'utf8');
      return parseTextForSkills(plainText);
    } catch (fallbackError) {
      console.error('Fallback read failed:', fallbackError.message);
      return [];
    }
  }
};

/**
 * Helper to match text against known skills array
 * @param {string} text - Raw text to parse
 * @returns {string[]} Matched skills
 */
export const parseTextForSkills = (text) => {
  if (!text) return [];
  const lowerText = text.toLowerCase();
  const matchedSkills = [];

  KNOWN_SKILLS.forEach(skill => {
    // Escape special characters (e.g. Node.js -> Node\.js, C++ -> C\+\+)
    const escaped = skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    // Match with boundary. Handled specifically for skills ending in special chars
    let regex;
    if (skill.endsWith('+') || skill.endsWith('#')) {
      regex = new RegExp(`${escaped}`, 'i');
    } else {
      regex = new RegExp(`\\b${escaped}\\b`, 'i');
    }

    if (regex.test(lowerText)) {
      matchedSkills.push(skill);
    }
  });

  return matchedSkills;
};
