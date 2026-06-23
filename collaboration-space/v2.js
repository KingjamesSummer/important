const STORAGE_KEY = 'zhihui-collaboration-spaces-v2';
const VIEW_KEY = 'zhihui-collaboration-view-v2';

const defaults = [
  {
    id: 1,
    name: '智能知识库一期项目',
    description: '产品、研发、测试共同维护需求、设计与交付材料。',
    role: '群主', owner: true, archived: false, pinned: true,
    tags: ['重点项目', '跨部门'], updatedAt: 202606230942,
    members: [
      { name: '张蕾', department: '产品中心' },
      { name: '周然', department: '研发中心' },
      { name: '许宁', department: '测试中心' },
      { name: '刘珂', department: '项目管理部' },
      { name: '陈希', department: '研发中心' },
      { name: '王越', department: '产品中心' },
      { name: '赵晨', department: '信息中心' },
      { name: '李可', department: '项目管理部' }
    ],
    time: '今天 09:42', creator: '张蕾'
  },
  {
    id: 2,
    name: '2026 数字化转型方案',
    description: '集团数字化建设规划、调研和汇报材料协同空间。',
    role: '管理员', owner: false, archived: false, pinned: false,
    tags: ['规划'], updatedAt: 202606221721,
    members: [
      { name: '李可', department: '信息中心' },
      { name: '罗宁', department: '战略发展部' },
      { name: '唐悦', department: '信息中心' },
      { name: '周然', department: '研发中心' },
      { name: '杨帆', department: '战略发展部' },
      { name: '赵晨', department: '信息中心' }
    ],
    time: '昨天 17:21', creator: '李可'
  },
  {
    id: 3,
    name: '企业网盘 UI 评审组',
    description: '集中管理原型稿、视觉规范、评审意见和设计资产。',
    role: '编辑者', owner: false, archived: false, pinned: false,
    tags: ['设计评审'], updatedAt: 202606211518,
    members: [
      { name: '许宁', department: '设计中心' },
      { name: '张蕾', department: '产品中心' },
      { name: '王越', department: '设计中心' },
      { name: '赵晨', department: '信息中心' },
      { name: '陈希', department: '研发中心' },
      { name: '宋佳', department: '设计中心' }
    ],
    time: '06-21 15:18', creator: '许宁'
  }
];

function loadSpaces() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(stored) && stored.length ? stored : structuredClone(defaults);
  } catch {
    return structuredClone(defaults);
  }
}

let spaces = loadSpaces();
let activeFilter = 'all';
let searchKeyword = '';
let activeMenuSpaceId = null;
let activeDrawerSpaceId = null;
let renameSpaceId = null;
let confirmCallback = null;
let sortMode = 'recent';

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const grid = $('#workspaceGrid');
const emptyState = $('#emptyState');
const cardMenu = $('#cardMenu');
const backdrop = $('#backdrop');
const createModal = $('#createModal');
const renameModal = $('#renameModal');
const confirmModal = $('#confirmModal');
const drawer = $('#detailDrawer');
const searchPanel = $('#searchPanel');

const icon = (id, cls = 'icon icon-sm') => `<svg class="${cls}"><use href="#${id}"/></svg>`;
const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, character => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' })[character]);
const initial = name => String(name).trim().slice(0, 1) || '成';

function saveSpaces() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(spaces));
}

function getFilteredSpaces() {
  const keyword = searchKeyword.trim().toLowerCase();
  const result = spaces.filter(space => {
    const filterMatch = activeFilter === 'all'
      ? !space.archived
      : activeFilter === 'created'
        ? space.owner && !space.archived
        : activeFilter === 'joined'
          ? !space.owner && !space.archived
          : space.archived;
    const memberNames = space.members.map(member => member.name).join(' ');
    const searchMatch = !keyword || `${space.name} ${space.description} ${space.tags.join(' ')} ${memberNames}`.toLowerCase().includes(keyword);
    return filterMatch && searchMatch;
  });

  return result.sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    if (sortMode === 'name') return a.name.localeCompare(b.name, 'zh-CN');
    if (sortMode === 'members') return b.members.length - a.members.length;
    return b.updatedAt - a.updatedAt;
  });
}

function renderSpaces() {
  const result = getFilteredSpaces();
  grid.innerHTML = result.map((space, index) => `
    <article class="space-card ${space.archived ? 'archived' : ''} ${space.pinned ? 'pinned' : ''}" tabindex="0" data-id="${space.id}" style="animation-delay:${index * 38}ms">
      <div class="card-head">
        <div class="space-icon">${icon('i-folder', 'icon')}</div>
        <div class="card-copy">
          <div class="card-title-line"><h2 class="card-title">${escapeHtml(space.name)}</h2>${space.pinned ? `<span class="pin-mark" title="已置顶">${icon('i-pin', 'icon icon-xs')}</span>` : ''}</div>
          <p class="card-desc">${escapeHtml(space.description)}</p>
        </div>
        <div class="card-actions">
          <button class="quick-enter" data-enter-id="${space.id}" aria-label="进入${escapeHtml(space.name)}">${icon('i-chevron')}</button>
          <button class="more-btn" aria-label="${escapeHtml(space.name)}更多操作" aria-expanded="false" data-menu-id="${space.id}">${icon('i-more')}</button>
        </div>
      </div>
      <div class="card-middle">
        <div class="role-line">
          <div class="tag-row"><span class="tag role">${escapeHtml(space.role)}</span>${space.tags.slice(0, 2).map((tag, tagIndex) => `<span class="tag ${tagIndex ? 'amber' : 'green'}">${escapeHtml(tag)}</span>`).join('')}</div>
          ${space.archived ? `<span class="archive-label">${icon('i-archive', 'icon icon-xs')}已归档</span>` : ''}
        </div>
      </div>
      <div class="card-footer">
        <div class="members" aria-label="${space.members.length} 位成员">${space.members.slice(0, 4).map(member => `<span class="mini-avatar" title="${escapeHtml(member.name)}">${escapeHtml(initial(member.name))}</span>`).join('')}<span class="member-more">${space.members.length} 位成员</span></div>
        <span class="time">${icon('i-clock', 'icon icon-xs')}${escapeHtml(space.time)}</span>
      </div>
    </article>`).join('');

  $('#resultCount').textContent = `共 ${result.length} 个协作空间`;
  const hasResult = result.length > 0;
  grid.style.display = hasResult ? 'grid' : 'none';
  emptyState.classList.toggle('show', !hasResult);
  if (!hasResult) {
    if (activeFilter === 'archived' && !searchKeyword) {
      $('#emptyTitle').textContent = '暂无已归档空间';
      $('#emptyDesc').textContent = '归档后的协作空间会集中显示在这里。';
    } else {
      $('#emptyTitle').textContent = '没有找到协作空间';
      $('#emptyDesc').textContent = '换个关键词试试，或新建一个协作空间。';
    }
  }
}

function syncBackdrop() {
  const needsBackdrop = [createModal, renameModal, confirmModal, searchPanel].some(element => element.classList.contains('show'));
  backdrop.classList.toggle('show', needsBackdrop);
}

function showModal(element) {
  closeMenu();
  element.classList.add('show');
  syncBackdrop();
}

function hideModal(element) {
  element.classList.remove('show');
  syncBackdrop();
}

function openCreateModal() {
  showModal(createModal);
  requestAnimationFrame(() => $('#spaceName').focus());
}

function closeCreateModal() {
  hideModal(createModal);
  $('#createForm').reset();
  $('#inviteBox').querySelectorAll('.invite-chip').forEach(chip => chip.remove());
  $('#nameCount').textContent = '0 / 30';
  $('#descCount').textContent = '0 / 120';
}

function openRenameModal(spaceId) {
  const space = spaces.find(item => item.id === spaceId);
  if (!space) return;
  renameSpaceId = spaceId;
  $('#renameInput').value = space.name;
  showModal(renameModal);
  requestAnimationFrame(() => { $('#renameInput').focus(); $('#renameInput').select(); });
}

function closeRenameModal() {
  renameSpaceId = null;
  hideModal(renameModal);
}

function openConfirm(title, description, confirmText, callback) {
  $('#confirmTitle').textContent = title;
  $('#confirmDesc').textContent = description;
  $('#confirmActionBtn').textContent = confirmText;
  confirmCallback = callback;
  showModal(confirmModal);
}

function closeConfirmModal() {
  confirmCallback = null;
  hideModal(confirmModal);
}

function openMenu(button, spaceId) {
  activeMenuSpaceId = spaceId;
  $$('.more-btn').forEach(item => item.setAttribute('aria-expanded', 'false'));
  button.setAttribute('aria-expanded', 'true');
  const rect = button.getBoundingClientRect();
  const space = spaces.find(item => item.id === spaceId);
  cardMenu.querySelector('[data-action="pin"] span').textContent = space.pinned ? '取消置顶' : '置顶空间';
  cardMenu.querySelector('[data-action="archive"] span').textContent = space.archived ? '取消归档' : '归档空间';
  cardMenu.style.top = `${Math.min(rect.bottom + 7, window.innerHeight - 245)}px`;
  cardMenu.style.left = `${Math.max(12, Math.min(rect.right - 180, window.innerWidth - 192))}px`;
  cardMenu.classList.add('show');
}

function closeMenu() {
  cardMenu.classList.remove('show');
  activeMenuSpaceId = null;
  $$('.more-btn').forEach(item => item.setAttribute('aria-expanded', 'false'));
}

function openDrawer(spaceId) {
  const space = spaces.find(item => item.id === spaceId);
  if (!space) return;
  activeDrawerSpaceId = spaceId;
  $('#drawerRole').textContent = space.role;
  $('#drawerName').textContent = space.name;
  $('#drawerDesc').textContent = space.description;
  $('#drawerMemberCount').textContent = `${space.members.length} 人`;
  $('#drawerTime').textContent = space.time;
  $('#drawerOwner').textContent = space.creator;
  $('#drawerMemberHint').textContent = `显示 ${Math.min(space.members.length, 6)} / ${space.members.length}`;
  $('#drawerMembers').innerHTML = space.members.slice(0, 6).map(member => `
    <div class="member-row"><span class="member-avatar">${escapeHtml(initial(member.name))}</span><span class="member-name">${escapeHtml(member.name)}<small>${escapeHtml(member.department || '协作成员')}</small></span><span class="member-role">${member.name === space.creator ? '创建人' : '成员'}</span></div>`).join('');
  drawer.classList.add('show');
}

function closeDrawer() {
  activeDrawerSpaceId = null;
  drawer.classList.remove('show');
}

function enterSpace(spaceId) {
  const space = spaces.find(item => item.id === spaceId);
  if (!space) return;
  showToast(`正在进入“${space.name}”`);
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span class="status">${icon('i-check', 'icon icon-sm')}</span><span>${escapeHtml(message)}</span>`;
  $('#toastStack').appendChild(toast);
  window.setTimeout(() => toast.remove(), 3000);
}

function openGlobalSearch() {
  showModal(searchPanel);
  $('#globalSearchInput').value = '';
  renderGlobalResults('');
  requestAnimationFrame(() => $('#globalSearchInput').focus());
}

function closeGlobalSearch() {
  hideModal(searchPanel);
}

function renderGlobalResults(keyword) {
  const query = keyword.trim().toLowerCase();
  const results = spaces.filter(space => {
    const members = space.members.map(member => member.name).join(' ');
    return !query || `${space.name} ${space.description} ${members}`.toLowerCase().includes(query);
  }).slice(0, 6);
  $('#globalSearchResults').innerHTML = results.length ? results.map(space => `
    <div class="search-result" data-result-id="${space.id}"><div class="space-icon">${icon('i-folder', 'icon icon-sm')}</div><div><strong>${escapeHtml(space.name)}</strong><small>${escapeHtml(space.role)} · ${space.members.length} 位成员</small></div></div>`).join('') : '<div style="padding:30px;text-align:center;color:var(--text-3);font-size:12px">没有匹配结果</div>';
}

function updateSearchState() {
  $('.local-search').classList.toggle('has-value', Boolean(searchKeyword));
}

function setFilter(nextFilter) {
  activeFilter = nextFilter;
  $$('.tab').forEach(tab => {
    const active = tab.dataset.filter === nextFilter;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
  });
  renderSpaces();
}

function collectInvitees() {
  return $$('#inviteBox .invite-chip').map(chip => chip.dataset.name).filter(Boolean);
}

document.addEventListener('click', event => {
  const menuButton = event.target.closest('[data-menu-id]');
  if (menuButton) {
    event.stopPropagation();
    const spaceId = Number(menuButton.dataset.menuId);
    if (cardMenu.classList.contains('show') && activeMenuSpaceId === spaceId) closeMenu(); else openMenu(menuButton, spaceId);
    return;
  }

  const enterButton = event.target.closest('[data-enter-id]');
  if (enterButton) {
    event.stopPropagation();
    enterSpace(Number(enterButton.dataset.enterId));
    return;
  }

  if (!event.target.closest('#cardMenu')) closeMenu();
  const card = event.target.closest('.space-card');
  if (card && !event.target.closest('button')) openDrawer(Number(card.dataset.id));

  const result = event.target.closest('[data-result-id]');
  if (result) {
    closeGlobalSearch();
    openDrawer(Number(result.dataset.resultId));
  }
});

grid.addEventListener('keydown', event => {
  const card = event.target.closest('.space-card');
  if (card && (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault();
    openDrawer(Number(card.dataset.id));
  }
});

$$('.tab').forEach(tab => tab.addEventListener('click', () => setFilter(tab.dataset.filter)));

$('#localSearchInput').addEventListener('input', event => {
  searchKeyword = event.target.value;
  updateSearchState();
  renderSpaces();
});

$('#searchClear').addEventListener('click', () => {
  searchKeyword = '';
  $('#localSearchInput').value = '';
  updateSearchState();
  renderSpaces();
  $('#localSearchInput').focus();
});

$('#sortSelect').addEventListener('change', event => {
  sortMode = event.target.value;
  renderSpaces();
});

$$('.view-btn').forEach(button => button.addEventListener('click', () => {
  $$('.view-btn').forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  const view = button.dataset.view;
  grid.classList.toggle('list-view', view === 'list');
  localStorage.setItem(VIEW_KEY, view);
}));

$('#createSpaceBtn').addEventListener('click', openCreateModal);
$('#emptyCreateBtn').addEventListener('click', openCreateModal);
$('#closeModalBtn').addEventListener('click', closeCreateModal);
$('#cancelCreateBtn').addEventListener('click', closeCreateModal);
$('#closeRenameBtn').addEventListener('click', closeRenameModal);
$('#cancelRenameBtn').addEventListener('click', closeRenameModal);
$('#closeConfirmBtn').addEventListener('click', closeConfirmModal);
$('#cancelConfirmBtn').addEventListener('click', closeConfirmModal);
$('#closeDrawerBtn').addEventListener('click', closeDrawer);
$('#drawerOpenBtn').addEventListener('click', () => activeDrawerSpaceId && enterSpace(activeDrawerSpaceId));
$('#drawerManageBtn').addEventListener('click', () => showToast('已打开成员管理'));

backdrop.addEventListener('click', () => {
  if (confirmModal.classList.contains('show')) closeConfirmModal();
  else if (renameModal.classList.contains('show')) closeRenameModal();
  else if (createModal.classList.contains('show')) closeCreateModal();
  else if (searchPanel.classList.contains('show')) closeGlobalSearch();
});

$('#spaceName').addEventListener('input', event => { $('#nameCount').textContent = `${event.target.value.length} / 30`; });
$('#spaceDescription').addEventListener('input', event => { $('#descCount').textContent = `${event.target.value.length} / 120`; });

$('#inviteBox').addEventListener('click', event => {
  const removeButton = event.target.closest('[data-remove-invite]');
  if (removeButton) removeButton.closest('.invite-chip').remove();
});

$('#inviteInput').addEventListener('keydown', event => {
  if (event.key !== 'Enter') return;
  event.preventDefault();
  const name = event.target.value.trim();
  if (!name) return;
  if (collectInvitees().includes(name)) {
    showToast('该成员已添加');
    return;
  }
  const chip = document.createElement('span');
  chip.className = 'invite-chip';
  chip.dataset.name = name;
  chip.innerHTML = `${escapeHtml(name)} <button type="button" data-remove-invite aria-label="移除${escapeHtml(name)}">×</button>`;
  event.target.before(chip);
  event.target.value = '';
});

$('#createForm').addEventListener('submit', event => {
  event.preventDefault();
  const name = $('#spaceName').value.trim();
  const description = $('#spaceDescription').value.trim() || '团队协作文件空间。';
  if (!name) return;
  const invitees = collectInvitees();
  const members = [{ name: '张蕾', department: '产品中心' }, ...invitees.map(memberName => ({ name: memberName, department: '待完善' }))];
  spaces.unshift({
    id: Date.now(), name, description, role: '群主', owner: true, archived: false, pinned: false,
    tags: ['新建'], members, time: '刚刚', updatedAt: Date.now(), creator: '张蕾'
  });
  saveSpaces();
  searchKeyword = '';
  $('#localSearchInput').value = '';
  updateSearchState();
  setFilter('all');
  closeCreateModal();
  showToast(`“${name}”创建成功`);
});

$('#renameForm').addEventListener('submit', event => {
  event.preventDefault();
  const space = spaces.find(item => item.id === renameSpaceId);
  const nextName = $('#renameInput').value.trim();
  if (!space || !nextName) return;
  space.name = nextName.slice(0, 30);
  space.updatedAt = Date.now();
  space.time = '刚刚';
  saveSpaces();
  closeRenameModal();
  renderSpaces();
  if (activeDrawerSpaceId === space.id) openDrawer(space.id);
  showToast('空间名称已更新');
});

$('#confirmActionBtn').addEventListener('click', () => {
  const callback = confirmCallback;
  closeConfirmModal();
  if (typeof callback === 'function') callback();
});

cardMenu.addEventListener('click', event => {
  const actionButton = event.target.closest('[data-action]');
  if (!actionButton || activeMenuSpaceId == null) return;
  const spaceId = activeMenuSpaceId;
  const space = spaces.find(item => item.id === spaceId);
  if (!space) return;
  const action = actionButton.dataset.action;
  closeMenu();

  if (action === 'open') enterSpace(space.id);
  if (action === 'pin') {
    space.pinned = !space.pinned;
    saveSpaces();
    renderSpaces();
    showToast(space.pinned ? '已置顶协作空间' : '已取消置顶');
  }
  if (action === 'rename') openRenameModal(space.id);
  if (action === 'archive') {
    const nextArchived = !space.archived;
    openConfirm(
      nextArchived ? '归档协作空间' : '恢复协作空间',
      nextArchived ? `归档后，“${space.name}”将移至已归档列表。` : `确认将“${space.name}”恢复到协作空间列表吗？`,
      nextArchived ? '确认归档' : '确认恢复',
      () => {
        space.archived = nextArchived;
        saveSpaces();
        closeDrawer();
        renderSpaces();
        showToast(nextArchived ? '空间已归档' : '空间已恢复');
      }
    );
  }
  if (action === 'leave') {
    if (space.owner) {
      showToast('群主需先移交空间后才能退出');
      return;
    }
    openConfirm('退出协作空间', `退出后将无法继续访问“${space.name}”。`, '确认退出', () => {
      spaces = spaces.filter(item => item.id !== space.id);
      saveSpaces();
      closeDrawer();
      renderSpaces();
      showToast('已退出协作空间');
    });
  }
});

$('#globalSearch').addEventListener('click', openGlobalSearch);
$('#globalSearchInput').addEventListener('input', event => renderGlobalResults(event.target.value));

document.addEventListener('keydown', event => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    openGlobalSearch();
  }
  if (event.key === 'Escape') {
    closeMenu();
    if (confirmModal.classList.contains('show')) closeConfirmModal();
    else if (renameModal.classList.contains('show')) closeRenameModal();
    else if (createModal.classList.contains('show')) closeCreateModal();
    else if (searchPanel.classList.contains('show')) closeGlobalSearch();
    else if (drawer.classList.contains('show')) closeDrawer();
  }
});

window.addEventListener('resize', closeMenu);

const storedView = localStorage.getItem(VIEW_KEY) || 'grid';
const viewButton = $(`.view-btn[data-view="${storedView}"]`);
if (viewButton) viewButton.click();
renderSpaces();