const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const RESUME_PATH = path.join(ROOT, 'assets/pdfs/Hildebrand_Ligtas_Resume.html');
const OUTPUT_PATH = path.join(ROOT, '_data/skill.json');

const BASE_PERCENT_BY_SECTION = {
  Languages: 86,
  Frameworks: 84,
  Databases: 80,
  'Cloud & DevOps': 78,
  Testing: 74,
};

function decodeHtml(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim();
}

function stripTags(text) {
  return text.replace(/<[^>]*>/g, '').trim();
}

function parsePillsBlock(pillsHtml, sectionLabel) {
  const pills = [];
  const pillRegex = /<span class="([^"]*\bpill\b[^"]*)">([\s\S]*?)<\/span>/g;
  let pillMatch;

  while ((pillMatch = pillRegex.exec(pillsHtml)) !== null) {
    const className = pillMatch[1] || '';
    const highlighted = /\bhi\b/.test(className);
    const name = decodeHtml(stripTags(pillMatch[2]));
    if (name) {
      pills.push({
        name,
        highlighted,
        section: sectionLabel,
      });
    }
  }

  return pills;
}

function parseSectionPills(html) {
  const targetLabels = [
    'Languages',
    'Frameworks',
    'Databases',
    'Cloud & DevOps',
    'Testing',
    'Other Skills',
  ];
  const sections = {};

  targetLabels.forEach((label) => {
    const escapedLabel = label
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/\s*&\s*/g, '\\s*&(?:amp;)?\\s*');
    const sectionRegex = new RegExp(
      `<div class="sec-label">\\s*${escapedLabel}\\s*<\\/div>\\s*<div class="pills">([\\s\\S]*?)<\\/div>`,
      'i'
    );
    const match = html.match(sectionRegex);

    if (!match) {
      return;
    }

    const pills = parsePillsBlock(match[1], label);
    if (pills.length > 0) {
      sections[label] = pills;
    }
  });

  return sections;
}

function toAbbreviation(label) {
  const words = label.split(/\s+/).filter(Boolean);
  if (words.length === 1) {
    return words[0].slice(0, 3).toUpperCase();
  }

  return words
    .slice(0, 3)
    .map((word) => word[0].toUpperCase())
    .join('');
}

function buildRawSkills(sectionMap) {
  const otherSkills = sectionMap['Other Skills'] || [];
  return otherSkills.slice(0, 6).map((skill, index) => ({
    title: skill.name,
    percent: Math.max(76, 90 - index * 2),
    color: '#1D9E75',
    icon: '/assets/icons/shine.svg',
    alt: skill.name,
    abbr: toAbbreviation(skill.name),
  }));
}

function buildCodingSkills(sectionMap) {
  const orderedSections = ['Languages', 'Frameworks', 'Databases', 'Cloud & DevOps', 'Testing'];
  const seen = new Set();
  const items = [];

  orderedSections.forEach((section) => {
    const pills = sectionMap[section] || [];
    pills.forEach((pill) => {
      const key = pill.name.toLowerCase();
      if (seen.has(key)) {
        return;
      }

      seen.add(key);

      const base = BASE_PERCENT_BY_SECTION[section] || 74;
      const percent = Math.min(96, base + (pill.highlighted ? 10 : 0));

      items.push({
        label: pill.name,
        percent,
        section,
      });
    });
  });

  return items;
}

function generateSkillData(html) {
  const sectionMap = parseSectionPills(html);

  return {
    meta: {
      source: 'assets/pdfs/Hildebrand_Ligtas_Resume.html',
      generated_on: new Date().toISOString(),
      sections_extracted: Object.keys(sectionMap),
    },
    sections: [
      {
        type: 'raw',
      },
      {
        type: 'coding',
      },
    ],
    raw: {
      title: 'Core Skills',
      items: buildRawSkills(sectionMap),
    },
    coding: {
      title: 'Coding Skills',
      items: buildCodingSkills(sectionMap),
    },
  };
}

function writeIfChanged(filePath, content) {
  const existing = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
  if (existing === content) {
    return false;
  }

  fs.writeFileSync(filePath, content, 'utf8');
  return true;
}

function main() {
  if (!fs.existsSync(RESUME_PATH)) {
    throw new Error(`Resume HTML file not found: ${RESUME_PATH}`);
  }

  const html = fs.readFileSync(RESUME_PATH, 'utf8');
  const data = generateSkillData(html);
  const serialized = `${JSON.stringify(data, null, 2)}\n`;
  const changed = writeIfChanged(OUTPUT_PATH, serialized);

  if (changed) {
    console.log(`Updated ${path.relative(ROOT, OUTPUT_PATH)} from resume HTML.`);
  } else {
    console.log(`No changes detected in ${path.relative(ROOT, OUTPUT_PATH)}.`);
  }
}

main();
