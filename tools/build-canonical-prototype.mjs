import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import * as cheerio from 'cheerio';
import postcss from 'postcss';
import cssnano from 'cssnano';
import { parse } from '@babel/parser';
import traverseModule from '@babel/traverse';
import generateModule from '@babel/generator';
import { minify } from 'terser';

const traverse = traverseModule.default;
const generate = generateModule.default;
const ROOT = process.cwd();
const ENTRY = path.join(ROOT, 'web-prototype.html');
const BUILD_COMMENT = 'GDG知识库权威原型：由最终可运行页面静态归并生成；无历史提交加载器、无运行时补丁注入。';
const STABLE_SCRIPT_HOSTS = ['code.iconify.design', 'cdn.jsdelivr.net'];
const VERSION_MARKER = /(?:__?(?:personal|collaboration)[A-Za-z]*V\d+[A-Za-z]*|data-(?:personal-space|personal-dropdown|collaboration)-v\d+)/i;
const HISTORICAL_URL = /(?:raw\.githubusercontent\.com\/KingjamesSummer\/important|cdn\.jsdelivr\.net\/gh\/KingjamesSummer\/important@)/i;
const PATCH_ASSET = /(?:personal-space-v(?:8|9|10|11|12|13)|collaboration-space-v(?:1-fix|2|3|4|5|6)|public-shell-hotfix|admin-shell-hotfix|admin-grant-polish|admin-dept-console-v\d+)/i;
const BANNED_OUTPUT = [
  /\bconst\s+revision\s*=/i,
  HISTORICAL_URL,
  /document\.(?:open|write|close)\s*\(/i,
  /\bappendScript\b/,
  /\bappendStyle\b/,
  /data-personal-(?:space|dropdown)-v(?:8|9|10|11|12|13)/i,
  /__personalSpaceV(?:8|9|10|11|12|13)Loaded/i,
  /__collaborationSpaceV(?:1|2|3|4|5|6)Loaded/i,
  /personal-space-v(?:8|9|10|11|12|13)\.(?:js|css)/i,
  /collaboration-space-v(?:1-fix|2|3|4|5|6)\.(?:js|css)/i,
  /public-shell-hotfix-v\d+/i,
  /admin-shell-hotfix-v\d+/i,
  /admin-grant-polish-v\d+/i,
  /admin-dept-console-v\d+/i
];

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function mimeFor(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return ({
    '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
    '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif',
    '.woff': 'font/woff', '.woff2': 'font/woff2'
  })[ext] || 'application/octet-stream';
}

async function startServer() {
  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url || '/', 'http://127.0.0.1');
      let pathname = decodeURIComponent(url.pathname);
      if (pathname === '/') pathname = '/web-prototype.html';
      const target = path.resolve(ROOT, `.${pathname}`);
      if (!target.startsWith(ROOT + path.sep) && target !== ENTRY) {
        res.writeHead(403); res.end('Forbidden'); return;
      }
      const stat = await fs.stat(target);
      const file = stat.isDirectory() ? path.join(target, 'index.html') : target;
      const body = await fs.readFile(file);
      res.writeHead(200, { 'content-type': mimeFor(file), 'cache-control': 'no-store' });
      res.end(body);
    } catch (error) {
      res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      res.end(`Not found: ${String(error.message || error)}`);
    }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  return { server, origin: `http://127.0.0.1:${address.port}` };
}

function dataUrlText(url) {
  const comma = url.indexOf(',');
  if (comma < 0) return '';
  const meta = url.slice(0, comma);
  const payload = url.slice(comma + 1);
  return /;base64/i.test(meta)
    ? Buffer.from(payload, 'base64').toString('utf8')
    : decodeURIComponent(payload);
}

function stableExternalScript(src) {
  try {
    const url = new URL(src);
    if (url.hostname === 'code.iconify.design') return true;
    if (url.hostname === 'cdn.jsdelivr.net' && /anime(?:\.min)?\.js/i.test(url.pathname)) return true;
  } catch {}
  return false;
}

function stableExternalStyle(href) {
  try {
    const url = new URL(href);
    return url.hostname === 'fonts.googleapis.com';
  } catch {}
  return false;
}

async function resourceText(rawUrl, pageUrl) {
  const absolute = new URL(rawUrl, pageUrl);
  if (absolute.protocol === 'data:') return dataUrlText(absolute.href);
  if (absolute.origin === new URL(pageUrl).origin) {
    const localPath = path.resolve(ROOT, `.${decodeURIComponent(absolute.pathname)}`);
    if (!localPath.startsWith(ROOT + path.sep)) throw new Error(`Refused path: ${localPath}`);
    return fs.readFile(localPath, 'utf8');
  }
  const response = await fetch(absolute, { redirect: 'follow' });
  if (!response.ok) throw new Error(`Unable to fetch ${absolute}: ${response.status}`);
  return response.text();
}

async function clickVisibleText(page, text) {
  const candidates = [
    page.getByRole('button', { name: text, exact: true }),
    page.getByRole('link', { name: text, exact: true }),
    page.locator('button, a, [role="button"], .nav-item, .admin-menu button').filter({ hasText: text })
  ];
  for (const locator of candidates) {
    try {
      const target = locator.filter({ visible: true }).first();
      if (await target.count()) {
        await target.click({ timeout: 2500 });
        await page.waitForTimeout(700);
        return true;
      }
    } catch {}
  }
  return false;
}

async function exerciseRoutes(page) {
  const topRoutes = ['工作台', '企业空间', '个人空间', '协作空间', '检索', '管理中心'];
  for (const route of topRoutes) await clickVisibleText(page, route);
  for (const section of ['部门管理', '成员管理', '管理员设置', '统计报表', '安全配置']) {
    await clickVisibleText(page, '管理中心');
    await clickVisibleText(page, section);
  }
  await clickVisibleText(page, '工作台');
}

async function waitUntilStable(page) {
  let previous = '';
  let stable = 0;
  for (let i = 0; i < 30; i += 1) {
    const signature = await page.evaluate(() => [
      document.scripts.length,
      document.querySelectorAll('style,link[rel="stylesheet"]').length,
      document.documentElement.outerHTML.length,
      document.body?.innerText?.slice(0, 80) || ''
    ].join('|'));
    if (signature === previous) stable += 1; else stable = 0;
    previous = signature;
    if (stable >= 4) return;
    await page.waitForTimeout(1000);
  }
}

function nodeCode(node) {
  try { return generate(node, { comments: false, compact: true }).code; } catch { return ''; }
}

function isVersionMarkerNode(node) {
  return VERSION_MARKER.test(nodeCode(node));
}

function isHistoricalFetch(node) {
  const code = nodeCode(node);
  return HISTORICAL_URL.test(code) || /\brevision\b/.test(code) && /fetch\s*\(/.test(code);
}

function cleanScript(source) {
  if (!source.trim()) return '';
  if (HISTORICAL_URL.test(source) && /document\.(?:write|open|close)/.test(source)) return '';
  let ast;
  try {
    ast = parse(source, {
      sourceType: 'script', allowAwaitOutsideFunction: true, allowReturnOutsideFunction: true,
      errorRecovery: true, plugins: ['optionalChaining', 'nullishCoalescingOperator', 'classProperties', 'topLevelAwait']
    });
  } catch (error) {
    console.warn(`AST parse fallback: ${error.message}`);
    return source
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*\/\/.*$/gm, '')
      .replace(/\b(?:appendScript|appendStyle)\s*\([^;]*;?/g, '')
      .replace(/document\.(?:open|write|close)\s*\([^;]*;?/g, '')
      .replace(/if\s*\(window\.__(?:personal|collaboration)[A-Za-z]*V\d+[A-Za-z]*\)\s*return\s*;?/g, '')
      .replace(/window\.__(?:personal|collaboration)[A-Za-z]*V\d+[A-Za-z]*\s*=\s*true\s*;?/g, '');
  }

  traverse(ast, {
    VariableDeclarator(p) {
      if (p.node.id?.type === 'Identifier' && ['appendScript', 'appendStyle'].includes(p.node.id.name)) {
        const declaration = p.parentPath;
        if (declaration.node.declarations.length === 1) declaration.remove(); else p.remove();
      }
    },
    FunctionDeclaration(p) {
      if (p.node.id && ['appendScript', 'appendStyle'].includes(p.node.id.name)) p.remove();
    },
    IfStatement(p) {
      const testCode = nodeCode(p.node.test);
      if (VERSION_MARKER.test(testCode)) {
        const consequent = p.node.consequent;
        const onlyReturn = consequent?.type === 'ReturnStatement' ||
          consequent?.type === 'BlockStatement' && consequent.body.every(item => item.type === 'ReturnStatement' || item.type === 'ExpressionStatement');
        if (onlyReturn || /Loaded|dataset|hasAttribute/.test(testCode)) p.remove();
      }
      if (isHistoricalFetch(p.node)) p.remove();
    },
    ExpressionStatement(p) {
      const expression = p.node.expression;
      const code = nodeCode(expression);
      if (/^(?:appendScript|appendStyle)\s*\(/.test(code)) { p.remove(); return; }
      if (/^document\.(?:open|write|close)\s*\(/.test(code)) { p.remove(); return; }
      if (VERSION_MARKER.test(code) && /(?:=|setAttribute|removeAttribute|dataset)/.test(code)) { p.remove(); return; }
      if (HISTORICAL_URL.test(code) && /fetch\s*\(/.test(code)) p.remove();
    },
    CallExpression(p) {
      const callee = p.node.callee;
      if (callee?.type === 'Identifier' && ['appendScript', 'appendStyle'].includes(callee.name)) {
        if (p.parentPath.isExpressionStatement()) p.parentPath.remove();
        return;
      }
      const code = nodeCode(p.node);
      if (/document\.(?:open|write|close)\s*\(/.test(code) || isHistoricalFetch(p.node)) {
        if (p.parentPath.isExpressionStatement()) p.parentPath.remove();
      }
      if (VERSION_MARKER.test(code) && /(?:setAttribute|hasAttribute|removeAttribute)/.test(code)) {
        if (p.parentPath.isExpressionStatement()) p.parentPath.remove();
      }
    }
  });

  return generate(ast, { comments: false, compact: false, retainLines: false, jsescOption: { minimal: true } }).code;
}

async function consolidateCss(parts) {
  const input = parts.filter(Boolean).join('\n');
  const result = await postcss([
    cssnano({ preset: ['default', {
      discardComments: { removeAll: true },
      normalizeWhitespace: false,
      reduceIdents: false,
      zindex: false,
      mergeLonghand: false
    }] })
  ]).process(input, { from: undefined });
  return result.css.trim();
}

async function consolidateJs(parts) {
  const cleaned = parts.map(cleanScript).filter(code => code.trim());
  const combined = `window.__GDG_CANONICAL__=true;\n${cleaned.join('\n;\n')}`;
  try {
    const result = await minify(combined, {
      ecma: 2022,
      compress: { defaults: false, dead_code: true, side_effects: false, unused: false },
      mangle: false,
      format: { beautify: true, comments: false, semicolons: true, preserve_annotations: false }
    });
    return result.code || combined;
  } catch (error) {
    console.warn(`Terser fallback: ${error.message}`);
    return combined;
  }
}

async function buildFromPage(page, pageUrl) {
  const html = await page.content();
  const $ = cheerio.load(html, { decodeEntities: false });
  const cssParts = [];
  const jsParts = [];

  for (const element of $('style,link[rel="stylesheet"]').toArray()) {
    const node = $(element);
    if (element.tagName === 'style') {
      cssParts.push(node.html() || '');
      node.remove();
      continue;
    }
    const href = node.attr('href') || '';
    if (stableExternalStyle(href)) continue;
    try { cssParts.push(await resourceText(href, pageUrl)); }
    catch (error) { console.warn(`Style skipped ${href}: ${error.message}`); }
    node.remove();
  }

  for (const element of $('script').toArray()) {
    const node = $(element);
    const src = node.attr('src');
    if (src && stableExternalScript(new URL(src, pageUrl).href)) continue;
    try {
      jsParts.push(src ? await resourceText(src, pageUrl) : (node.html() || ''));
    } catch (error) {
      console.warn(`Script skipped ${src || '<inline>'}: ${error.message}`);
    }
    node.remove();
  }

  $('*').each((_, element) => {
    const node = $(element);
    for (const attribute of Object.keys(element.attribs || {})) {
      if (/^data-source-asset$/i.test(attribute) || /^data-(?:personal-space|personal-dropdown|collaboration)-v\d+$/i.test(attribute)) {
        node.removeAttr(attribute);
      }
    }
  });
  $('html').removeClass('iconify-ready');
  $('meta[name="gdg-prototype-build"]').remove();
  $('head').append(`<meta name="gdg-prototype-build" content="canonical-main">`);

  const css = await consolidateCss(cssParts);
  const js = await consolidateJs(jsParts);
  $('head').append(`<style id="canonical-styles">${css.replace(/<\/style/gi, '<\\/style')}</style>`);
  $('body').append(`<script id="canonical-app">${js.replace(/<\/script/gi, '<\\/script')}</script>`);

  const output = `<!DOCTYPE html>\n<!-- ${BUILD_COMMENT} -->\n${$.html()}`;
  return { output, cssParts: cssParts.length, jsParts: jsParts.length };
}

function assertStaticContract(output) {
  const failures = BANNED_OUTPUT.filter(pattern => pattern.test(output)).map(pattern => String(pattern));
  if (failures.length) throw new Error(`Canonical output still contains banned patterns:\n${failures.join('\n')}`);
  if ((output.match(/id="canonical-styles"/g) || []).length !== 1) throw new Error('Expected one canonical stylesheet');
  if ((output.match(/id="canonical-app"/g) || []).length !== 1) throw new Error('Expected one canonical application script');
  if (!/管理中心/.test(output) || !/个人空间/.test(output) || !/协作空间/.test(output)) throw new Error('Core module text missing');
}

async function validateGenerated(origin) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on('pageerror', error => errors.push(`pageerror: ${error.message}`));
  page.on('console', message => { if (message.type() === 'error') errors.push(`console: ${message.text()}`); });
  await page.goto(`${origin}/web-prototype.html?canonical-validation=1`, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForFunction(() => document.querySelector('#app') && document.body.innerText.length > 100, null, { timeout: 60000 });
  await page.waitForTimeout(2500);

  const routes = ['工作台', '企业空间', '个人空间', '协作空间', '检索', '管理中心'];
  for (const route of routes) {
    if (!await clickVisibleText(page, route)) throw new Error(`Unable to open top-level module: ${route}`);
  }
  for (const section of ['部门管理', '成员管理', '管理员设置', '统计报表', '安全配置']) {
    await clickVisibleText(page, '管理中心');
    if (!await clickVisibleText(page, section)) throw new Error(`Unable to open admin module: ${section}`);
  }

  await clickVisibleText(page, '个人空间');
  const firstRow = page.locator('tbody tr').first();
  if (await firstRow.count()) {
    await firstRow.click({ button: 'right' }).catch(() => {});
    await page.waitForTimeout(300);
  }
  await clickVisibleText(page, '协作空间');
  const card = page.locator('.collab-card').first();
  if (await card.count()) await card.click().catch(() => {});
  await page.waitForTimeout(400);

  await browser.close();
  const meaningful = errors.filter(item => !/favicon|fonts\.gstatic|ERR_ABORTED/i.test(item));
  if (meaningful.length) throw new Error(`Browser validation errors:\n${meaningful.join('\n')}`);
}

async function main() {
  if (!fsSync.existsSync(ENTRY)) throw new Error('web-prototype.html not found');
  const { server, origin } = await startServer();
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const loadErrors = [];
    page.on('pageerror', error => loadErrors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') loadErrors.push(message.text()); });
    const pageUrl = `${origin}/web-prototype.html?canonical-source=1`;
    await page.goto(pageUrl, { waitUntil: 'domcontentloaded', timeout: 180000 });
    await page.waitForFunction(() => document.querySelector('#app') && !/正在载入|原型载入失败/.test(document.body.innerText), null, { timeout: 180000 });
    await waitUntilStable(page);
    await exerciseRoutes(page);
    await waitUntilStable(page);
    await clickVisibleText(page, '工作台');
    const { output, cssParts, jsParts } = await buildFromPage(page, pageUrl);
    assertStaticContract(output);
    await fs.writeFile(ENTRY, output, 'utf8');
    console.log(`Canonicalized ${cssParts} style sources and ${jsParts} script sources.`);
    if (loadErrors.length) console.warn(`Source page reported ${loadErrors.length} console/page errors before canonicalization.`);
  } finally {
    if (browser) await browser.close();
  }

  await validateGenerated(origin);
  await new Promise(resolve => server.close(resolve));
  console.log('Canonical prototype validation passed.');
}

main().catch(error => {
  console.error(error.stack || error);
  process.exitCode = 1;
});
