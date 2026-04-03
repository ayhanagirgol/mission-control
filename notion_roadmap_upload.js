#!/usr/bin/env node

const https = require('https');

const API_KEY = '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';
const NOTION_VERSION = '2022-06-28'; // Use stable version
const PARENT_PAGE_ID = '330d4f17-ff64-8134-bbc6-cb363afacc87';

function notionRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'api.notion.com',
      port: 443,
      path: path,
      method: method,
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {})
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => { responseData += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${JSON.stringify(parsed)}`));
          }
        } catch (e) {
          reject(new Error(`Parse error: ${responseData}`));
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

function richText(text) {
  // Split into chunks of max 2000 chars
  const chunks = [];
  for (let i = 0; i < text.length; i += 2000) {
    chunks.push({ type: 'text', text: { content: text.slice(i, i + 2000) } });
  }
  return chunks;
}

function parseMarkdownToBlocks(md) {
  const lines = md.split('\n');
  const blocks = [];
  let inCodeBlock = false;
  let codeContent = [];
  let codeLanguage = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code block handling
    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeLanguage = line.slice(3).trim() || 'plain text';
        codeContent = [];
      } else {
        // End code block
        inCodeBlock = false;
        const codeText = codeContent.join('\n');
        // Split code blocks at 2000 chars
        for (let j = 0; j < codeText.length; j += 1900) {
          blocks.push({
            object: 'block',
            type: 'code',
            code: {
              rich_text: [{ type: 'text', text: { content: codeText.slice(j, j + 1900) } }],
              language: codeLanguage === 'plain text' ? 'plain text' : codeLanguage
            }
          });
        }
      }
      continue;
    }

    if (inCodeBlock) {
      codeContent.push(line);
      continue;
    }

    // Horizontal rule
    if (line.match(/^---+$/)) {
      blocks.push({ object: 'block', type: 'divider', divider: {} });
      continue;
    }

    // Headings
    if (line.startsWith('### ')) {
      const text = line.slice(4).trim();
      if (!text) continue;
      blocks.push({
        object: 'block',
        type: 'heading_3',
        heading_3: { rich_text: richText(text) }
      });
      continue;
    }

    if (line.startsWith('## ')) {
      const text = line.slice(3).trim();
      if (!text) continue;
      blocks.push({
        object: 'block',
        type: 'heading_2',
        heading_2: { rich_text: richText(text) }
      });
      continue;
    }

    if (line.startsWith('# ')) {
      const text = line.slice(2).trim();
      if (!text) continue;
      blocks.push({
        object: 'block',
        type: 'heading_1',
        heading_1: { rich_text: richText(text) }
      });
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      const text = line.slice(2).trim();
      if (!text) continue;
      blocks.push({
        object: 'block',
        type: 'quote',
        quote: { rich_text: richText(text) }
      });
      continue;
    }

    // Bullet list
    if (line.match(/^[-*] /)) {
      const text = line.slice(2).trim();
      if (!text) continue;
      blocks.push({
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: { rich_text: richText(text) }
      });
      continue;
    }

    // Numbered list
    if (line.match(/^\d+\. /)) {
      const text = line.replace(/^\d+\.\s+/, '').trim();
      if (!text) continue;
      blocks.push({
        object: 'block',
        type: 'numbered_list_item',
        numbered_list_item: { rich_text: richText(text) }
      });
      continue;
    }

    // Table rows — convert to paragraph (simplified)
    if (line.startsWith('|')) {
      // Skip separator rows
      if (line.match(/^\|[\s\-|]+\|$/)) continue;
      // Convert table row to paragraph
      const cells = line.split('|').filter(c => c.trim()).map(c => c.trim()).join(' | ');
      if (!cells) continue;
      blocks.push({
        object: 'block',
        type: 'paragraph',
        paragraph: { rich_text: richText(cells) }
      });
      continue;
    }

    // Empty line
    if (!line.trim()) {
      // Skip consecutive empty lines
      continue;
    }

    // Regular paragraph
    const text = line.trim();
    if (!text) continue;

    // Split long paragraphs
    for (let j = 0; j < text.length; j += 2000) {
      blocks.push({
        object: 'block',
        type: 'paragraph',
        paragraph: { rich_text: [{ type: 'text', text: { content: text.slice(j, j + 2000) } }] }
      });
    }
  }

  return blocks;
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  const fs = require('fs');
  const mdContent = fs.readFileSync('/Users/baykus/.openclaw/workspace/firmacom_docs/firmacom_urun_yol_haritasi.md', 'utf8');

  // Step 1: Create the page
  console.log('Creating Notion page...');
  const page = await notionRequest('POST', '/v1/pages', {
    parent: { page_id: PARENT_PAGE_ID },
    properties: {
      title: {
        title: [{ type: 'text', text: { content: '📋 Ürün Yol Haritası (Roadmap)' } }]
      }
    }
  });

  const pageId = page.id;
  console.log(`Page created: ${pageId}`);
  console.log(`URL: ${page.url}`);

  // Step 2: Parse markdown to blocks
  console.log('Parsing markdown...');
  const blocks = parseMarkdownToBlocks(mdContent);
  console.log(`Total blocks: ${blocks.length}`);

  // Step 3: Upload in batches of 100
  const BATCH_SIZE = 100;
  let uploaded = 0;

  for (let i = 0; i < blocks.length; i += BATCH_SIZE) {
    const batch = blocks.slice(i, i + BATCH_SIZE);
    console.log(`Uploading batch ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(blocks.length/BATCH_SIZE)} (${batch.length} blocks)...`);
    
    try {
      await notionRequest('PATCH', `/v1/blocks/${pageId}/children`, {
        children: batch
      });
      uploaded += batch.length;
      console.log(`  ✓ Uploaded ${uploaded}/${blocks.length} blocks`);
    } catch (err) {
      console.error(`  ✗ Error in batch: ${err.message}`);
      // Try smaller batches on error
      for (let j = 0; j < batch.length; j += 10) {
        const smallBatch = batch.slice(j, j + 10);
        try {
          await notionRequest('PATCH', `/v1/blocks/${pageId}/children`, {
            children: smallBatch
          });
          uploaded += smallBatch.length;
          console.log(`    ✓ Fallback batch uploaded ${uploaded}/${blocks.length}`);
          await sleep(500);
        } catch (err2) {
          console.error(`    ✗ Fallback batch error: ${err2.message}`);
          // Log the problematic block
          smallBatch.forEach((b, idx) => {
            console.error(`    Block ${j+idx}: type=${b.type}, content=${JSON.stringify(b).slice(0,100)}`);
          });
        }
      }
    }

    // Rate limiting
    if (i + BATCH_SIZE < blocks.length) {
      await sleep(300);
    }
  }

  console.log(`\n✅ Done! Page URL: ${page.url}`);
  console.log(`Page ID: ${pageId}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
