const fs = require('fs');

const date = '2026-05-16';
const topicsMd = fs.readFileSync('settings/topics.md', 'utf-8');
const manifest = JSON.parse(fs.readFileSync(`raw/runs/${date}/manifest.json`, 'utf-8'));

const topics = [];
const regex = /^##\s+([a-zA-Z0-9-]+)$/gm;
let match;
while ((match = regex.exec(topicsMd)) !== null) {
  topics.push(match[1].trim());
}

if (!fs.existsSync('content/daily')) {
  fs.mkdirSync('content/daily', { recursive: true });
}
const dailyPath = `content/daily/${date}.md`;
let existingContent = '';
if (fs.existsSync(dailyPath)) {
  existingContent = fs.readFileSync(dailyPath, 'utf-8');
}

let newContent = existingContent || `# ${date} 日報\n\n`;

let succeeded = 0;
let failed = 0;
let no_news = 0;
let verified_items = 0;
let skipped = [];
let updated_sections = [];
let retained_sections = [];

for (const topic of topics) {
  const topicData = manifest.topics[topic];
  if (!topicData) {
    skipped.push(topic);
    continue;
  }

  if (topicData.status === 'failed') {
    failed++;
    retained_sections.push(topic);
    continue;
  }

  if (topicData.status === 'no_news') {
    no_news++;
    retained_sections.push(topic);
    continue;
  }

  succeeded++;

  const rawPath = `raw/runs/${date}/${topic}.md`;
  if (!fs.existsSync(rawPath)) {
    skipped.push(topic);
    continue;
  }

  const raw = fs.readFileSync(rawPath, 'utf-8');

  const shouluStart = raw.indexOf('## 收錄');
  const weishouluStart = raw.indexOf('## 未收錄');

  if (shouluStart === -1) {
    skipped.push(topic);
    continue;
  }

  const shouluContent = weishouluStart !== -1 ? raw.substring(shouluStart, weishouluStart) : raw.substring(shouluStart);

  const items = shouluContent.split('### ').slice(1);
  let topicContent = '';
  let hasVerified = false;

  for (const item of items) {
    if (
      item.includes('來源狀態：verified') &&
      item.includes('URL 檢查：passed，final status 2xx') &&
      item.includes('內容驗證：passed')
    ) {
      hasVerified = true;
      verified_items++;

      const lines = item.split('\n');
      const cleanLines = [];
      let skipMode = false;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.startsWith('- URL 檢查') ||
            line.startsWith('- 內容驗證') ||
            line.startsWith('- 狀態：rejected') ||
            line.startsWith('- retry：')) {
          continue;
        }
        if (line.startsWith('- 不確定或未使用：')) {
          skipMode = true;
          continue;
        }
        if (skipMode && line.trim().startsWith('-')) {
          continue;
        }
        if (skipMode && line.trim() !== '' && !line.trim().startsWith('-')) {
          skipMode = false;
        }
        if (!skipMode) {
          cleanLines.push(line);
        }
      }
      topicContent += `### ${cleanLines.join('\n').trim()}\n\n`;
    }
  }

  if (hasVerified) {
    updated_sections.push(topic);
    // capitalize appropriately
    const capitalizedTopic = topic.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const newSection = `<!-- topic: ${topic} -->\n## ${capitalizedTopic}\n\n${topicContent.trim()}\n\n`;

    const anchor = `<!-- topic: ${topic} -->`;
    const nextAnchorRegex = /<!-- topic: .*? -->/g;

    let sectionStart = newContent.indexOf(anchor);
    if (sectionStart !== -1) {
      nextAnchorRegex.lastIndex = sectionStart + anchor.length;
      const nextMatch = nextAnchorRegex.exec(newContent);
      let sectionEnd = nextMatch ? nextMatch.index : newContent.length;
      newContent = newContent.substring(0, sectionStart) + newSection + newContent.substring(sectionEnd);
    } else {
      newContent += `${newSection}`;
    }
  } else {
    skipped.push(topic);
    retained_sections.push(topic);
  }
}

fs.writeFileSync(dailyPath, newContent.replace(/\n{3,}/g, '\n\n').trim() + '\n');

let indexUpdated = false;
const indexPath = 'content/daily/index.md';
if (!fs.existsSync(indexPath)) {
  fs.writeFileSync(indexPath, '# 日報\n\n');
}
let indexContent = fs.readFileSync(indexPath, 'utf-8');
const indexLink = `- [${date}](./${date}.md)`;
if (!indexContent.includes(indexLink)) {
  const lines = indexContent.split('\n');
  const insertPos = lines.findIndex(l => l.startsWith('- ['));
  if (insertPos !== -1) {
    lines.splice(insertPos, 0, indexLink);
  } else {
    lines.push(indexLink);
  }
  fs.writeFileSync(indexPath, lines.join('\n').replace(/\n{2,}/g, '\n') + '\n');
  indexUpdated = true;
}

const result = {
  succeeded,
  no_news,
  failed,
  verified_items,
  skipped,
  updated_sections,
  retained_sections,
  indexUpdated
};
console.log(JSON.stringify(result, null, 2));
