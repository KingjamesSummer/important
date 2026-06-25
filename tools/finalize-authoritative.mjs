import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import vm from 'node:vm';
import { chromium } from 'playwright-core';

const ROOT = process.cwd();
const ENTRY = path.join(ROOT, 'web-prototype.html');
const BUILD_COMMENT = 'GDG知识库权威主原型：单一最终样式与应用脚本；无历史提交加载、无运行时补丁链。';

const REPLACEMENTS = [
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
  [/public-shell-hotfix-v1/gi, 'public-shell-refinement'],
  [/admin-shell-hotfix-v1/gi, 'admin-shell-refinement'],
  [/admin-grant-polish-v2/gi, 'admin-grant-refinement'],
  [/admin-sunny-theme-v1/gi, 'admin-theme'],
  [/admin-dept-console-v2/gi, 'admin-department-layout'],
  [/admin-dept-console-v3/gi, 'admin-department-interaction'],
  [/admin-dept-console-v9/gi, 'admin-department-theme'],
  [/admin-dept-console-v11/gi, 'admin-department-final'],
  [/admin-dept-polish-v12/gi, 'admin-department-refinement'],
  [/AdminDeptConsoleV2/g, 'AdminDepartmentLayout'],
  [/AdminDeptConsoleV3/g, 'AdminDepartmentInteraction'],
  [/AdminDeptConsoleV9/g, 'AdminDepartmentTheme'],
  [/AdminDeptConsoleV11/g, 'AdminDepartmentFinal'],
  [/adminDeptConsoleV2/g, 'adminDepartmentLayout'],
  [/adminDeptConsoleV3/g, 'adminDepartmentInteraction'],
  [/adminDeptConsoleV9/g, 'adminDepartmentTheme'],
  [/adminDeptConsoleV11/g, 'adminDepartmentFinal'],
  [/__adminDeptConsoleV\d+/g, '__adminDepartmentReady'],
  [/__collaborationSpaceV\d+Loaded/g, '__collaborationReady'],
  [/__personalSpaceV\d+Loaded/g, '__personalSpaceReady'],
  [/data-(?:personal-space|personal-dropdown|collaboration)-v\d+/gi, 'data-canonical-module']
];

const BANNED = [
  /\bconst\s+revision\s*=/i,
  /raw\.githubusercontent\.com\/KingjamesSummer\/important/i,
  /cdn\.jsdelivr\.net\/gh\/KingjamesSummer\/important@/i,
  /document\.(?:open|write|close)\s*\(/i,
  /\bappendScript\b/i,
  /\bappendStyle\b/i,
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

function canonicalize(text) {
  let value = String(text || '');
  for (const [pattern, replacement] of REPLACEMENTS) value = value.replace(pattern, replacement);
  return value;
}

function removeVersionScaffolding(code) {
  let value = code;
  value = value.replace(/if\s*\(\s*window\.__[A-Za-z_$][\w$]*(?:V\d+)?(?:Loaded|Ready)?\s*\)\s*return\s*;?/g, '');
  value = value.replace(/window\.__[A-Za-z_$][\w$]*(?:V\d+)?(?:Loaded|Ready)?\s*=\s*true\s*;?/g, '');
  value = value.replace(/if\s*\(\s*document\.documentElement\.(?:dataset\.[A-Za-z_$][\w$]*|hasAttribute\([^)]*\))\s*\)\s*return\s*;?/g, '');
  value = value.replace(/document\.documentElement\.(?:dataset\.[A-Za-z_$][\w$]*\s*=\s*['"]1['"]|setAttribute\([^;]*\))\s*;?/g, '');
  value = value.replace(/function\s+(?:appendScript|appendStyle|ensurePremiumMotionStyles|ensureAdminDeptV3|ensureAdminDeptV11|installTheme)\s*\([^)]*\)\s*\{\s*\/\*\s*bundled\s*\*\/\s*\}/g, '');
  value = value.replace(/\b(?:ensurePremiumMotionStyles|ensureAdminDeptV3|ensureAdminDeptV11|installTheme)\s*\(\s*\)\s*;?/g, '');
  return value;
}

function cleanScript(code) {
  if (!code.trim()) return '';
  if (/document\.(?:open|write|close)\s*\(/.test(code) && /raw\.githubusercontent|jsdelivr\.net\/gh/.test(code)) return '';
  if (/removeSummaryCards/.test(code) && /collaborationSpaceV4|collabV4|collaboration-space-v4/i.test(code)) return '';
  let value = code.replace(
    /<div class="collab-v3-summary-grid">[\s\S]*?<div class="collab-v3-activity-toolbar">/g,
    '<div class="collab-v3-activity-toolbar">'
  );
  value = removeVersionScaffolding(value);
  value = canonicalize(value);
  return value.trim();
}

function escapeStyle(text) { return text.replace(/<\/style/gi, '<\\/style'); }
function escapeScript(text) { return text.replace(/<\/script/gi, '<\\/script'); }

function normalizeHtml(source) {
  const styles = [];
  source = source.replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gi, (_, css) => {
    styles.push(css);
    return '';
  });

  const inlineScripts = [];
  source = source.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (whole, attrs, code) => {
    if (/\bsrc\s*=/.test(attrs)) return whole;
    const cleaned = cleanScript(code);
    if (cleaned) inlineScripts.push(cleaned);
    return '';
  });

  const combinedCss = canonicalize(styles.join('\n\n/* canonical boundary */\n\n'));
  const combinedJs = `window.__GDG_CANONICAL__=true;\n${inlineScripts.join('\n;\n')}`;
  new vm.Script(combinedJs, { filename: 'canonical-app.js' });

  source = canonicalize(source)
    .replace(/\sdata-authoritative-stage="[^"]*"/gi, '')
    .replace(/\sdata-authoritative-section="[^"]*"/gi, '')
    .replace(/\sdata-build="[^"]*"/i, '')
    .replace(/<!--\s*GDG知识库权威主原型：[\s\S]*?-->/i, '');

  source = source.replace(/<html\b([^>]*)>/i, '<html$1 data-build="canonical-main">');
  source = source.replace(/<!doctype html>/i, `<!doctype html>\n<!-- ${BUILD_COMMENT} -->`);
  source = source.replace(/<\/head>/i, `<style id="canonical-styles">\n${escapeStyle(combinedCss)}\n</style>\n</head>`);
  source = source.replace(/<\/body>/i, `<script id="canonical-app">\n${escapeScript(combinedJs)}\n</script>\n</body>`);

  const failures = BANNED.filter(pattern => pattern.test(source));
  if (failures.length) throw new Error(`Forbidden patterns remain:\n${failures.join('\n')}`);
  if ((source.match(/id="canonical-styles"/g) || []).length !== 1) throw new Error('Expected one canonical style block');
  if ((source.match(/id="canonical-app"/g) || []).length !== 1) throw new Error('Expected one canonical application script');
  const inlineCount = (source.match(/<script\b(?![^>]*\bsrc=)/gi) || []).length;
  if (inlineCount !== 1) throw new Error(`Expected one inline application script, found ${inlineCount}`);
  for (const token of ['工作台', '企业空间', '个人空间', '协作空间', '管理中心', '部门管理', '成员管理', '管理员设置', '统计报表', '安全配置']) {
    if (!source.includes(token)) throw new Error(`Missing required module token: ${token}`);
  }
  return { html: source, styleSources: styles.length, scriptSources: inlineScripts.length };
}

function mimeFor(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return ({
    '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
    '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp'
  })[ext] || 'application/octet-stream';
}

async function startServer() {
  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url || '/', 'http://127.0.0.1');
      let pathname = decodeURIComponent(url.pathname);
      if (pathname === '/') pathname = '/web-prototype.html';
      const target = path.resolve(ROOT, `.${pathname}`);
      if (!target.startsWith(`${ROOT}${path.sep}`) && target !== ENTRY) throw new Error('Forbidden');
      const data = await fs.readFile(target);
      res.writeHead(200, { 'content-type': mimeFor(target), 'cache-control': 'no-store' });
      res.end(data);
    } catch (error) {
      res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      res.end(String(error.message || error));
    }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  return { server, origin: `http://127.0.0.1:${port}` };
}

async function clickVisibleText(page, text) {
  const candidates = [
    page.getByRole('button', { name: text, exact: true }),
    page.getByRole('link', { name: text, exact: true }),
    page.locator('button,a,[role="button"],.nav-item,.admin-menu button').filter({ hasText: text })
  ];
  for (const locator of candidates) {
    const count = await locator.count().catch(() => 0);
    for (let index = 0; index < Math.min(count, 12); index += 1) {
      const target = locator.nth(index);
      if (!await target.isVisible().catch(() => false)) continue;
      try {
        await target.click({ timeout: 2000 });
        await page.waitForTimeout(180);
        return true;
      } catch {}
    }
  }
  return false;
}

async function validateInBrowser(origin) {
  const executablePath = process.env.CHROME_PATH || undefined;
  const browser = await chromium.launch({ headless: true, executablePath, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
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
  await page.route('**/*', async route => {
    const request = route.request();
    try {
      const url = new URL(request.url());
      if (url.origin !== origin) {
        if (request.resourceType() === 'script') {
          const stub = url.href.includes('anime')
            ? 'window.anime=function(){return {pause(){},play(){}}};window.anime.timeline=function(){return {add(){return this}}};'
            : '';
          await route.fulfill({ status: 200, contentType: 'application/javascript', body: stub });
          return;
        }
        if (request.resourceType() === 'stylesheet') {
          await route.fulfill({ status: 200, contentType: 'text/css', body: '' });
          return;
        }
        if (['font', 'image'].includes(request.resourceType())) {
          await route.abort();
          return;
        }
      }
    } catch {}
    await route.continue();
  });

  await page.goto(`${origin}/web-prototype.html`, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForFunction(() => document.querySelector('#app') && document.body.innerText.length > 100, null, { timeout: 30000 });

  for (const route of ['工作台', '企业空间', '个人空间', '协作空间', '检索', '管理中心']) {
    if (!await clickVisibleText(page, route)) throw new Error(`Unable to open module: ${route}`);
  }
  for (const section of ['部门管理', '成员管理', '管理员设置', '统计报表', '安全配置']) {
    await clickVisibleText(page, '管理中心');
    if (!await clickVisibleText(page, section)) throw new Error(`Unable to open admin module: ${section}`);
  }

  await clickVisibleText(page, '个人空间');
  const row = page.locator('tbody tr').first();
  if (await row.count()) await row.click({ button: 'right' }).catch(() => {});
  await clickVisibleText(page, '协作空间');
  const card = page.locator('.collab-card').first();
  if (await card.count()) await card.click().catch(() => {});

  await browser.close();
  const meaningful = errors.filter(item => !/favicon|ERR_ABORTED|Failed to load resource/i.test(item));
  if (localCodeRequests.length) throw new Error(`Local JS/CSS requests remain:\n${localCodeRequests.join('\n')}`);
  if (meaningful.length) throw new Error(`Browser validation errors:\n${meaningful.join('\n')}`);
}

async function main() {
  if (!fsSync.existsSync(ENTRY)) throw new Error('web-prototype.html not found');
  const original = await fs.readFile(ENTRY, 'utf8');
  const result = normalizeHtml(original);
  await fs.writeFile(ENTRY, result.html, 'utf8');
  console.log(`Consolidated ${result.styleSources} style sources and ${result.scriptSources} inline scripts.`);
  const { server, origin } = await startServer();
  try {
    await validateInBrowser(origin);
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
  console.log('Canonical browser validation passed.');
}

main().catch(error => {
  console.error(error.stack || error);
  process.exitCode = 1;
});
