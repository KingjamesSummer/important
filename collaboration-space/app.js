const spaces = [
  {
    id: 1,
    name: '智能知识库一期项目',
    description: '产品、研发、测试共同维护需求、设计与交付材料。',
    role: '群主', owner: true, archived: false,
    tags: ['重点项目', '跨部门'],
    members: ['张', '周', '许', '刘', '陈', '王', '赵', '李'],
    time: '今天 09:42'
  },
  {
    id: 2,
    name: '2026 数字化转型方案',
    description: '集团数字化建设规划、调研和汇报材料协同空间。',
    role: '管理员', owner: false, archived: false,
    tags: ['规划'],
    members: ['李', '罗', '唐', '周', '杨', '赵'],
    time: '昨天 17:21'
  },
  {
    id: 3,
    name: '企业网盘 UI 评审组',
    description: '集中管理原型稿、视觉规范、评审意见和设计资产。',
    role: '编辑者', owner: false, archived: false,
    tags: ['设计评审'],
    members: ['许', '张', '王', '赵', '陈', '宋'],
    time: '06-21 15:18'
  }
];

let activeFilter = 'all';
let searchKeyword = '';
let activeMenuSpaceId = null;

const grid = document.getElementById('workspaceGrid');
const emptyState = document.getElementById('emptyState');
const emptyTitle = document.getElementById('emptyTitle');
const emptyDesc = document.getElementById('emptyDesc');
const cardMenu = document.getElementById('cardMenu');
const backdrop = document.getElementById('backdrop');
const modal = document.getElementById('createModal');
const drawer = document.getElementById('detailDrawer');
const searchPanel = document.getElementById('searchPanel');

const icon = (id, cls = 'icon icon-sm') => `<svg class="${cls}"><use href="#${id}"/></svg>`;
const escapeHtml = (value = '') => value.replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));

function getFilteredSpaces() {
  return spaces.filter(space => {
    const filterMatch = activeFilter === 'all' ||
      (activeFilter === 'created' && space.owner && !space.archived) ||
      (activeFilter === 'joined' && !space.owner && !space.archived) ||
      (activeFilter === 'archived' && space.archived);
    const keyword = searchKeyword.trim().toLowerCase();
    const searchMatch = !keyword || `${space.name} ${space.description} ${space.tags.join(' ')}`.toLowerCase().includes(keyword);
    return filterMatch && searchMatch;
  });
}

function renderSpaces() {
  const result = getFilteredSpaces();
  grid.innerHTML = result.map((space, index) => `
    <article class="space-card ${space.archived ? 'archived' : ''}" tabindex="0" data-id="${space.id}" style="animation-delay:${index * 45}ms">
      <div class="card-head">
        <div class="space-icon">${icon('i-users', 'icon')}</div>
        <div>
          <h2 class="card-title">${escapeHtml(space.name)}</h2>
          <p class="card-desc">${escapeHtml(space.description)}</p>
        </div>
        <button class="more-btn" aria-label="${escapeHtml(space.name)}更多操作" aria-expanded="false" data-menu-id="${space.id}">${icon('i-more')}</button>
      </div>
      <div class="tag-row">
        <span class="tag role">${escapeHtml(space.role)}</span>
        ${space.tags.map((tag, i) => `<span class="tag ${i === 0 ? 'green' : 'amber'}">${escapeHtml(tag)}</span>`).join('')}
        ${space.archived ? '<span class="tag amber">已归档</span>' : ''}
      </div>
      <div class="card-footer">
        <div class="members" aria-label="${space.members.length} 位成员">
          ${space.members.slice(0, 4).map(name => `<span class="mini-avatar">${escapeHtml(name)}</span>`).join('')}
          <span class="member-more">+${Math.max(0, space.members.length - 4)} 成员</span>
        </div>
        <span class="time">${icon('i-clock', 'icon icon-xs')}${escapeHtml(space.time)}</span>
      </div>
    </article>`).join('');

  const hasResult = result.length > 0;
  grid.style.display = hasResult ? 'grid' : 'none';
  emptyState.classList.toggle('show', !hasResult);
  if (!hasResult) {
    if (activeFilter === 'archived' && !searchKeyword) {
      emptyTitle.textContent = '暂无已归档空间';
      emptyDesc.textContent = '归档后的协作空间会集中显示在这里。';
    } else {
      emptyTitle.textContent = '没有找到协作空间';
      emptyDesc.textContent = '换个关键词试试，或新建一个协作空间。';
    }
  }
}

function openMenu(button, spaceId) {
  activeMenuSpaceId = spaceId;
  document.querySelectorAll('.more-btn').forEach(btn => btn.setAttribute('aria-expanded', 'false'));
  button.setAttribute('aria-expanded', 'true');
  const rect = button.getBoundingClientRect();
  const space = spaces.find(item => item.id === spaceId);
  cardMenu.querySelector('[data-action="archive"] span').textContent = space.archived ? '取消归档' : '归档空间';
  cardMenu.style.top = `${Math.min(rect.bottom + 6, window.innerHeight - 225)}px`;
  cardMenu.style.left = `${Math.min(rect.right - 172, window.innerWidth - 184)}px`;
  cardMenu.classList.add('show');
}

function closeMenu() {
  cardMenu.classList.remove('show');
  activeMenuSpaceId = null;
  document.querySelectorAll('.more-btn').forEach(btn => btn.setAttribute('aria-expanded', 'false'));
}

function openCreateModal() {
  backdrop.classList.add('show');
  modal.classList.add('show');
  document.getElementById('spaceName').focus();
}

function closeCreateModal() {
  modal.classList.remove('show');
  backdrop.classList.remove('show');
  document.getElementById('createForm').reset();
  document.getElementById('nameCount').textContent = '0 / 30';
  document.getElementById('descCount').textContent = '0 / 120';
}

function openDrawer(spaceId) {
  const space = spaces.find(item => item.id === spaceId);
  if (!space) return;
  document.getElementById('drawerName').textContent = space.name;
  document.getElementById('drawerDesc').textContent = space.description;
  document.getElementById('drawerRole').textContent = space.role;
  document.getElementById('drawerMemberCount').textContent = `${space.members.length} 人`;
  document.getElementById('drawerTime').textContent = space.time;
  document.getElementById('drawerMembers').innerHTML = space.members.slice(0, 6).map((name, i) => `
    <div class="member-row"><span class="mini-avatar">${escapeHtml(name)}</span><span class="member-name">${escapeHtml(name)}${i === 0 ? '蕾' : '成员'}</span><span class="member-role">${i === 0 ? space.role : '成员'}</span></div>
  `).join('');
  drawer.classList.add('show');
}

function closeDrawer() {
  drawer.classList.remove('show');
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span class="status">${icon('i-check', 'icon icon-sm')}</span><span>${escapeHtml(message)}</span>`;
  document.getElementById('toastStack').appendChild(toast);
  setTimeout(() => toast.remove(), 3100);
}

function openGlobalSearch() {
  backdrop.classList.add('show');
  searchPanel.classList.add('show');
  const input = document.getElementById('globalSearchInput');
  input.value = '';
  renderGlobalResults('');
  setTimeout(() => input.focus(), 0);
}

function closeGlobalSearch() {
  searchPanel.classList.remove('show');
  if (!modal.classList.contains('show')) backdrop.classList.remove('show');
}

function renderGlobalResults(keyword) {
  const k = keyword.trim().toLowerCase();
  const results = spaces.filter(space => !k || `${space.name} ${space.description}`.toLowerCase().includes(k)).slice(0, 4);
  document.getElementById('globalSearchResults').innerHTML = results.length ? results.map(space => `
    <div class="search-result" data-result-id="${space.id}">
      <div class="space-icon" style="width:36px;height:36px;border-radius:11px">${icon('i-users', 'icon icon-sm')}</div>
      <div><strong>${escapeHtml(space.name)}</strong><small>协作空间 · ${escapeHtml(space.role)}</small></div>
    </div>`).join('') : '<div style="padding:28px;text-align:center;color:var(--text-3);font-size:12px">没有匹配结果</div>';
}

document.addEventListener('click', event => {
  const menuButton = event.target.closest('[data-menu-id]');
  if (menuButton) {
    event.stopPropagation();
    const id = Number(menuButton.dataset.menuId);
    if (cardMenu.classList.contains('show') && activeMenuSpaceId === id) closeMenu(); else openMenu(menuButton, id);
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

document.querySelectorAll('.tab').forEach(tab => tab.addEventListener('click', () => {
  document.querySelectorAll('.tab').forEach(item => {
    item.classList.remove('active');
    item.setAttribute('aria-selected', 'false');
  });
  tab.classList.add('active');
  tab.setAttribute('aria-selected', 'true');
  activeFilter = tab.dataset.filter;
  renderSpaces();
}));

document.getElementById('localSearchInput').addEventListener('input', event => {
  searchKeyword = event.target.value;
  renderSpaces();
});

document.querySelectorAll('.view-btn').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('.view-btn').forEach(item => item.classList.remove('active'));
  btn.classList.add('active');
  grid.classList.toggle('list-view', btn.dataset.view === 'list');
}));

document.getElementById('createSpaceBtn').addEventListener('click', openCreateModal);
document.getElementById('emptyCreateBtn').addEventListener('click', openCreateModal);
document.getElementById('closeModalBtn').addEventListener('click', closeCreateModal);
document.getElementById('cancelCreateBtn').addEventListener('click', closeCreateModal);
document.getElementById('closeDrawerBtn').addEventListener('click', closeDrawer);
document.getElementById('drawerOpenBtn').addEventListener('click', () => showToast('已进入协作空间'));
document.getElementById('drawerManageBtn').addEventListener('click', () => showToast('已打开成员管理'));
backdrop.addEventListener('click', () => {
  if (modal.classList.contains('show')) closeCreateModal();
  else closeGlobalSearch();
});

document.getElementById('spaceName').addEventListener('input', event => {
  document.getElementById('nameCount').textContent = `${event.target.value.length} / 30`;
});

document.getElementById('spaceDescription').addEventListener('input', event => {
  document.getElementById('descCount').textContent = `${event.target.value.length} / 120`;
});

document.getElementById('inviteBox').addEventListener('click', event => {
  if (event.target.closest('button')) event.target.closest('.invite-chip').remove();
});

document.getElementById('inviteInput').addEventListener('keydown', event => {
  if (event.key === 'Enter' && event.target.value.trim()) {
    event.preventDefault();
    const chip = document.createElement('span');
    chip.className = 'invite-chip';
    chip.innerHTML = `${escapeHtml(event.target.value.trim())} <button type="button" aria-label="移除成员" style="border:0;background:transparent;padding:0;color:inherit;cursor:pointer">×</button>`;
    event.target.before(chip);
    event.target.value = '';
  }
});

document.getElementById('createForm').addEventListener('submit', event => {
  event.preventDefault();
  const name = document.getElementById('spaceName').value.trim();
  const description = document.getElementById('spaceDescription').value.trim() || '团队协作文件空间。';
  if (!name) return;
  spaces.unshift({
    id: Date.now(), name, description, role: '群主', owner: true, archived: false,
    tags: ['新建'], members: ['张', '蕾'], time: '刚刚'
  });
  activeFilter = 'all';
  searchKeyword = '';
  document.getElementById('localSearchInput').value = '';
  document.querySelectorAll('.tab').forEach(item => {
    const active = item.dataset.filter === 'all';
    item.classList.toggle('active', active);
    item.setAttribute('aria-selected', String(active));
  });
  closeCreateModal();
  renderSpaces();
  showToast(`“${name}”创建成功`);
});

cardMenu.addEventListener('click', event => {
  const actionButton = event.target.closest('[data-action]');
  if (!actionButton || activeMenuSpaceId == null) return;
  const space = spaces.find(item => item.id === activeMenuSpaceId);
  if (!space) return;
  const action = actionButton.dataset.action;
  closeMenu();
  if (action === 'open') openDrawer(space.id);
  if (action === 'rename') {
    const nextName = window.prompt('请输入新的空间名称', space.name);
    if (nextName && nextName.trim()) {
      space.name = nextName.trim().slice(0, 30);
      renderSpaces();
      showToast('空间名称已更新');
    }
  }
  if (action === 'archive') {
    space.archived = !space.archived;
    renderSpaces();
    showToast(space.archived ? '空间已归档' : '空间已恢复');
  }
  if (action === 'leave') {
    if (space.owner) showToast('群主需先移交空间后才能退出');
    else if (window.confirm(`确定退出“${space.name}”吗？`)) {
      spaces.splice(spaces.indexOf(space), 1);
      renderSpaces();
      showToast('已退出协作空间');
    }
  }
});

document.getElementById('globalSearch').addEventListener('click', openGlobalSearch);
document.getElementById('globalSearchInput').addEventListener('input', event => renderGlobalResults(event.target.value));
document.addEventListener('keydown', event => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    openGlobalSearch();
  }
  if (event.key === 'Escape') {
    closeMenu();
    if (modal.classList.contains('show')) closeCreateModal();
    else if (searchPanel.classList.contains('show')) closeGlobalSearch();
    else if (drawer.classList.contains('show')) closeDrawer();
  }
});

window.addEventListener('resize', closeMenu);
renderSpaces();