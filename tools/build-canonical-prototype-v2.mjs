import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import http from 'node:http';
import path from 'node:path';
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
const BUILD_COMMENT = 'GDG知识库权威原型：最终运行态已静态归并；无历史提交加载器、无运行时补丁注入、无本地补丁依赖。';
const HISTORICAL_HOST = /(?:raw\.githubusercontent\.com\/KingjamesSummer\/important|cdn\.jsdelivr\.net\/gh\/KingjamesSummer\/important@)/i;
const LOCAL_CODE_ASSET = /(?:^|["'`(\s])(?:\.\/)?assets\/[^"'`)\s]+\.(?:js|css)(?:\?[^"'`)\s]*)?/i;
const RESOURCE_HELPER_HINT = /(?:appendScript|appendStyle|ensurePremiumMotionStyles|ensureAdminDept|installTheme|loadScript|loadStyle)/i;

const BANNED_OUTPUT = [
  /\bconst\s+revision\s*=/i,
  HISTORICAL_HOST,
  /document\.(?:open|write|close)\s*\(/i,
  /\bappendScript\b/,
  /\bappendStyle\b/,
  /data-source-asset/i,
  /data-personal-(?:space|dropdown)-v\d+/i,
  /personal-space-v(?:8|9|10|11|12|13)/i,
  /collaboration-space-v(?:1-fix|1|2|3|4|5|6)/i,
  /public-shell-hotfix/i,
  /admin-shell-hotfix/i,
  /admin-grant-polish/i,
  /admin-dept-(?:console|polish)-v\d+/i,
  /(?:\.\/)?assets\/[^"'`)\s]+\.(?:js|css)/i
];

const NAME_REPLACEMENTS = [
  [/personal-space-v8/gi, 'personal-space-core'],
  [/personal-space-v9/gi, 'personal-space-navigation'],
  [/personal-space-v10/gi, 'personal-space-details'],
  [/personal-space-v11/gi, 'personal-space-toolbar'],
  [/personal-space-v12/gi, 'personal-space-transfer'],
  [/personal-space-v13/gi, 'personal-space-dropdown'],
  [/personalV8/g, 'personalCore'], [/PersonalV8/g, 'PersonalCore'], [/PERSONAL_V8/g, 'PERSONAL_CORE'],
  [/personalV9/g, 'personalNavigation'], [/PersonalV9/g, 'PersonalNavigation'], [/PERSONAL_V9/g, 'PERSONAL_NAVIGATION'],
  [/personalV10/g, 'personalDetails'], [/PersonalV10/g, 'PersonalDetails'], [/PERSONAL_V10/g, 'PERSONAL_DETAILS'],
  [/personalV11/g, 'personalToolbar'], [/PersonalV11/g, 'PersonalToolbar'], [/PERSONAL_V11/g, 'PERSONAL_TOOLBAR'],
  [/personalV12/g, 'personalTransfer'], [/PersonalV12/g, 'PersonalTransfer'], [/PERSONAL_V12/g, 'PERSONAL_TRANSFER'],
  [/personalV13/g, 'personalDropdown'], [/PersonalV13/g, 'PersonalDropdown'], [/PERSONAL_V13/g, 'PERSONAL_DROPDOWN'],
  [/collaboration-space-v1-fix/gi, 'collaboration-space-core'],
  [/collaboration-space-v1/gi, 'collaboration-space-core'],
  [/collaboration-space-v2/gi, 'collaboration-space-files'],
  [/collaboration-space-v3/gi, 'collaboration-space-detail'],
  [/collaboration-space-v4/gi, 'collaboration-space-layout'],
  [/collaboration-space-v5/gi, 'collaboration-space-list'],
  [/collaboration-space-v6/gi, 'collaboration-space-actions'],
  [/collabV1/g, 'collabCore'], [/CollabV1/g, 'CollabCore'],
  [/collabV2/g, 'collabFiles'], [/CollabV2/g, 'CollabFiles'],
  [/collabV3/g, 'collabDetail'], [/CollabV3/g, 'CollabDetail'],
  [/collabV4/g, 'collabLayout'], [/CollabV4/g, 'CollabLayout'],
  [/collabV5/g, 'collabList'], [/CollabV5/g, 'CollabList'],
  [/collabV6/g, 'collabActions'], [/CollabV6/g, 'CollabActions'],
  [/public-shell-hotfix-v\d+/gi, 'public-shell'],
  [/admin-shell-hotfix-v\d+/gi, 'admin-shell'],
  [/admin-grant-polish-v\d+/gi, 'admin-grant'],
  [/admin-sunny-theme-v\d+/gi, 'admin-theme'],
  [/admin-dept-console-v\d+/gi, 'admin-department'],
  [/admin-dept-polish-v\d+/gi, 'admin-department'],
  [/AdminDeptConsoleV\d+/g, 'AdminDepartment'],
  [/adminDeptConsoleV\d+/g, 'adminDepartment'],
  [/__adminDeptConsoleV\d+/g, '__adminDepartmentReady'],
  [/__collaborationSpaceV\d+Loaded/g, '__collaborationReady'],
  [/__personalSpaceV\d+Loaded/g, '__personalSpaceReady'],
  [/data-(?:personal-space|personal-dropdown|collaboration)-v\d+/gi, 'data-canonical-module']
];

function canonicalNames(value) {
  let output = String(value || '');
  for (const [pattern, replacement] of NAME_REPLACEMENTS) output = output.replace(pattern, replacement);
  return output;
}

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
      if (!target.startsWith(`${ROOT}${path.sep}`) && target !== ENTRY) throw new Error('Forbidden path');
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
  return /;base64/i.test(meta) ? Buffer.from(payload, 'base64').toString('utf8') : decodeURIComponent(payload);
}

function isStableExternalScript(src) {
  try {
    const url = new URL(src);
    return url.hostname === 'code.iconify.design' || (url.hostname === 'cdn.jsdelivr.net' && /anime(?:\.min)?\.js/i.test(url.pathname));
  } catch {
    return false;
  }
}

function isStableExternalStyle(href) {
  try { return new URL(href).hostname === 'fonts.googleapis.com'; }
  catch { return false; }
}

async function resourceText(rawUrl, pageUrl) {
  const absolute = new URL(rawUrl, pageUrl);
  if (absolute.protocol === 'data:') return dataUrlText(absolute.href);
  if (absolute.origin === new URL(pageUrl).origin) {
    const localPath = path.resolve(ROOT, `.${decodeURIComponent(absolute.pathname)}`);
    if (!localPath.startsWith(`${ROOT}${path.sep}`)) throw new Error(`Refused path: ${localPath}`);
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
      const count = await locator.count();
      for (let index = 0; index < Math.min(count, 16); index += 1) {
        const target = locator.nth(index);
        if (!await target.isVisible()) continue;
        await target.click({ timeout: 3500 });
        await page.waitForTimeout(450);
        return true;
      }
    } catch {}
  }
  return false;
}

async function waitUntilStable(page) {
  let previous = '';
  let stable = 0;
  for (let index = 0; index < 40; index += 1) {
    const signature = await page.evaluate(() => [
      document.scripts.length,
      document.querySelectorAll('style,link[rel="stylesheet"]').length,
      document.documentElement.outerHTML.length,
      document.body?.innerText?.slice(0, 100) || ''
    ].join('|'));
    if (signature === previous) stable += 1; else stable = 0;
    previous = signature;
    if (stable >= 4) return;
    await page.waitForTimeout(700);
  }
}

async function exerciseRoutes(page) {
  for (const route of ['工作台', '企业空间', '个人空间', '协作空间', '检索', '管理中心']) {
    await clickVisibleText(page, route);
  }
  for (const section of ['部门管理', '成员管理', '管理员设置', '统计报表', '安全配置']) {
    await clickVisibleText(page, '管理中心');
    await clickVisibleText(page, section);
  }
  await clickVisibleText(page, '个人空间');
  await clickVisibleText(page, '协作空间');
  await clickVisibleText(page, '工作台');
}

function nodeCode(node) {
  try { return generate(node, { comments: false, compact: true }).code; }
  catch { return ''; }
}

function isVersionGuard(code) {
  return /__(?:personalSpace|collaborationSpace|adminDeptConsole|adminDepartment)[A-Za-z]*?(?:V\d+)?(?:Loaded|Ready)?/.test(code) && /(?:return|=\s*true|setAttribute|dataset)/.test(code);
}

function cleanScript(source) {
  if (!source || !source.trim()) return '';
  if (HISTORICAL_HOST.test(source) && /document\.(?:open|write|close)/.test(source)) return '';
  if (/__collaborationSpaceV4Loaded/.test(source) && /removeSummaryCards/.test(source)) return '';

  let prepared = source.replace(
    /<div class="collab-v3-summary-grid">[\s\S]*?<div class="collab-v3-activity-toolbar">/g,
    '<div class="collab-v3-activity-toolbar">'
  );

  let ast;
  try {
    ast = parse(prepared, {
      sourceType: 'script', allowAwaitOutsideFunction: true, allowReturnOutsideFunction: true,
      errorRecovery: true, plugins: ['optionalChaining', 'nullishCoalescingOperator', 'classProperties', 'topLevelAwait']
    });
  } catch (error) {
    console.warn(`AST parse fallback: ${error.message}`);
    return canonicalNames(prepared
      .replace(/\b(?:appendScript|appendStyle)\s*\([^;]*;?/g, '')
      .replace(/document\.(?:open|write|close)\s*\([^;]*;?/g, '')
      .replace(/\b(?:script|link|style)\.(?:src|href)\s*=\s*["'`][^"'`]+\.(?:js|css)[^"'`]*["'`]\s*;?/gi, '')
    );
  }

  const resourceHelpers = new Set();
  traverse(ast, {
    FunctionDeclaration(pathRef) {
      const name = pathRef.node.id?.name || '';
      const code = nodeCode(pathRef.node);
      if (RESOURCE_HELPER_HINT.test(name) || (/document\.createElement\(["'](?:script|link|style)["']\)/.test(code) && LOCAL_CODE_ASSET.test(code))) {
        resourceHelpers.add(name);
      }
    },
    VariableDeclarator(pathRef) {
      const name = pathRef.node.id?.type === 'Identifier' ? pathRef.node.id.name : '';
      const code = nodeCode(pathRef.node.init);
      if (RESOURCE_HELPER_HINT.test(name) || (/document\.createElement\(["'](?:script|link|style)["']\)/.test(code) && LOCAL_CODE_ASSET.test(code))) {
        resourceHelpers.add(name);
      }
    }
  });

  traverse(ast, {
    FunctionDeclaration(pathRef) {
      const name = pathRef.node.id?.name || '';
      if (resourceHelpers.has(name)) pathRef.remove();
    },
    VariableDeclarator(pathRef) {
      const name = pathRef.node.id?.type === 'Identifier' ? pathRef.node.id.name : '';
      if (!resourceHelpers.has(name)) return;
      const declaration = pathRef.parentPath;
      if (declaration.node.declarations.length === 1) declaration.remove(); else pathRef.remove();
    },
    IfStatement(pathRef) {
      const code = nodeCode(pathRef.node);
      if (isVersionGuard(code) || (HISTORICAL_HOST.test(code) && /fetch\s*\(/.test(code))) pathRef.remove();
    },
    AssignmentExpression(pathRef) {
      const code = nodeCode(pathRef.node);
      if (isVersionGuard(code)) {
        if (pathRef.parentPath.isExpressionStatement()) pathRef.parentPath.remove();
        return;
      }
      if (/\.(?:src|href)\s*=/.test(code) && /\.(?:js|css)(?:\?|["'`])/.test(code)) {
        if (pathRef.parentPath.isExpressionStatement()) pathRef.parentPath.remove();
      }
    },
    ExpressionStatement(pathRef) {
      const code = nodeCode(pathRef.node.expression);
      if (isVersionGuard(code) || /document\.(?:open|write|close)\s*\(/.test(code)) {
        pathRef.remove();
        return;
      }
      if (LOCAL_CODE_ASSET.test(code) && /(?:appendChild|append|insertBefore|createElement)/.test(code)) pathRef.remove();
    },
    CallExpression(pathRef) {
      const callee = pathRef.node.callee;
      if (callee?.type === 'Identifier' && resourceHelpers.has(callee.name)) {
        if (pathRef.parentPath.isExpressionStatement()) pathRef.parentPath.remove();
        return;
      }
      const property = callee?.type === 'MemberExpression' && !callee.computed ? callee.property?.name : '';
      const firstName = pathRef.node.arguments?.[0]?.type === 'Identifier' ? pathRef.node.arguments[0].name : '';
      const callCode = nodeCode(pathRef.node);
      if (['appendChild', 'append', 'insertBefore'].includes(property) && /^(?:script|link|style|avatars|theme)$/i.test(firstName)) {
        if (pathRef.parentPath.isExpressionStatement()) pathRef.parentPath.remove();
        return;
      }
      if (/document\.(?:open|write|close)\s*\(/.test(callCode) || (HISTORICAL_HOST.test(callCode) && /fetch\s*\(/.test(callCode))) {
        if (pathRef.parentPath.isExpressionStatement()) pathRef.parentPath.remove();
      }
    }
  });

  const generated = generate(ast, { comments: false, compact: false, jsescOption: { minimal: true } }).code;
  return canonicalNames(generated);
}

function mergeCssRules(root) {
  const latest = new Map();
  root.walkRules(rule => {
    if (rule.parent?.type === 'atrule' && /keyframes$/i.test(rule.parent.name || '')) return;
    const ancestry = [];
    let parent = rule.parent;
    while (parent && parent.type !== 'root') {
      if (parent.type === 'atrule') ancestry.unshift(`@${parent.name} ${parent.params}`);
      parent = parent.parent;
    }
    const key = `${ancestry.join('|')}::${rule.selector}`;
    const previous = latest.get(key);
    if (!previous) {
      latest.set(key, rule);
      return;
    }

    const declarations = new Map();
    const collect = node => {
      node.nodes?.forEach(child => {
        if (child.type !== 'decl') return;
        const existing = declarations.get(child.prop);
        if (!existing || child.important || !existing.important) declarations.set(child.prop, child.clone());
      });
    };
    collect(previous);
    collect(rule);
    rule.removeAll();
    for (const declaration of declarations.values()) rule.append(declaration);
    previous.remove();
    latest.set(key, rule);
  });
}

async function consolidateCss(parts) {
  const root = postcss.parse(canonicalNames(parts.filter(Boolean).join('\n')));
  mergeCssRules(root);
  const result = await postcss([
    cssnano({ preset: ['default', {
      discardComments: { removeAll: true },
      normalizeWhitespace: false,
      reduceIdents: false,
      zindex: false,
      mergeLonghand: false
    }] })
  ]).process(root.toString(), { from: undefined });
  return result.css.trim();
}

async function consolidateJs(parts) {
  const cleaned = parts.map(cleanScript).filter(code => code.trim());
  const combined = `window.__GDG_CANONICAL__=true;\n${cleaned.join('\n;\n')}`;
  const result = await minify(combined, {
    ecma: 2022,
    compress: { defaults: false, dead_code: true, side_effects: true, unused: true, conditionals: true, evaluate: true },
    mangle: false,
    format: { beautify: true, comments: false, semicolons: true }
  });
  return canonicalNames(result.code || combined);
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
    if (isStableExternalStyle(href)) continue;
    try { cssParts.push(await resourceText(href, pageUrl)); }
    catch (error) { console.warn(`Style skipped ${href}: ${error.message}`); }
    node.remove();
  }

  for (const element of $('script').toArray()) {
    const node = $(element);
    const src = node.attr('src');
    if (src && isStableExternalScript(new URL(src, pageUrl).href)) continue;
    try { jsParts.push(src ? await resourceText(src, pageUrl) : (node.html() || '')); }
    catch (error) { console.warn(`Script skipped ${src || '<inline>'}: ${error.message}`); }
    node.remove();
  }

  $('*').each((_, element) => {
    const node = $(element);
    for (const attribute of Object.keys(element.attribs || {})) {
      if (/^data-source-asset$/i.test(attribute) || /^data-(?:personal-space|personal-dropdown|collaboration)-v\d+$/i.test(attribute)) node.removeAttr(attribute);
    }
  });
  $('html').removeClass('iconify-ready');
  $('meta[name="gdg-prototype-build"]').remove();
  $('head').append('<meta name="gdg-prototype-build" content="canonical-main">');

  const css = await consolidateCss(cssParts);
  const js = await consolidateJs(jsParts);
  $('head').append(`<style id="canonical-styles">${css.replace(/<\/style/gi, '<\\/style')}</style>`);
  $('body').append(`<script id="canonical-app">${js.replace(/<\/script/gi, '<\\/script')}</script>`);

  const output = canonicalNames(`<!DOCTYPE html>\n<!-- ${BUILD_COMMENT} -->\n${$.html()}`);
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
  const localCodeRequests = [];
  page.on('pageerror', error => errors.push(`pageerror: ${error.message}`));
  page.on('console', message => { if (message.type() === 'error') errors.push(`console: ${message.text()}`); });
  page.on('request', request => {
    try {
      const url = new URL(request.url());
      if (url.origin === origin && /\.(?:js|css)$/i.test(url.pathname)) localCodeRequests.push(url.href);
    } catch {}
  });

  await page.goto(`${origin}/web-prototype.html?canonical-validation=1`, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForFunction(() => document.querySelector('#app') && document.body.innerText.length > 100, null, { timeout: 60000 });
  await page.waitForTimeout(2200);

  for (const route of ['工作台', '企业空间', '个人空间', '协作空间', '检索', '管理中心']) {
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
    await page.waitForTimeout(250);
  }

  await clickVisibleText(page, '协作空间');
  const card = page.locator('.collab-card').first();
  if (await card.count()) {
    await card.click().catch(() => {});
    await page.waitForTimeout(350);
  }

  await browser.close();
  const meaningful = errors.filter(item => !/favicon|fonts\.gstatic|ERR_ABORTED|Failed to load resource/i.test(item));
  if (localCodeRequests.length) throw new Error(`Generated page requested local JS/CSS:\n${localCodeRequests.join('\n')}`);
  if (meaningful.length) throw new Error(`Browser validation errors:\n${meaningful.join('\n')}`);
}

async function main() {
  if (!fsSync.existsSync(ENTRY)) throw new Error('web-prototype.html not found');
  const { server, origin } = await startServer();
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const sourceErrors = [];
    page.on('pageerror', error => sourceErrors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') sourceErrors.push(message.text()); });
    const pageUrl = `${origin}/web-prototype.html?canonical-source=1`;
    await page.goto(pageUrl, { waitUntil: 'domcontentloaded', timeout: 180000 });
    await page.waitForFunction(() => document.querySelector('#app') && !/正在载入|原型载入失败/.test(document.body.innerText), null, { timeout: 180000 });
    await waitUntilStable(page);
    await exerciseRoutes(page);
    await waitUntilStable(page);
    await clickVisibleText(page, '工作台');
    const result = await buildFromPage(page, pageUrl);
    assertStaticContract(result.output);
    await fs.writeFile(ENTRY, result.output, 'utf8');
    console.log(`Canonicalized ${result.cssParts} style sources and ${result.jsParts} script sources.`);
    if (sourceErrors.length) console.warn(`Source runtime reported ${sourceErrors.length} non-blocking errors before canonicalization.`);
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
