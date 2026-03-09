(function () {
  const app = window.ACSMS;
  if (!app) return;

  const byId = (id) => document.getElementById(id);
  const toastContainer = byId('toastContainer');
  const toast = (msg) => {
    if (!toastContainer) return;
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    toastContainer.appendChild(el);
    setTimeout(() => el.remove(), 2200);
  };

  const applyTheme = () => {
    const theme = app.db.settings.theme || 'dark';
    document.body.classList.toggle('light', theme === 'light');
  };
  applyTheme();

  const themeToggle = byId('themeToggle');
  if (themeToggle) {
    themeToggle.onclick = () => {
      const s = app.db.settings;
      s.theme = s.theme === 'dark' ? 'light' : 'dark';
      app.db.settings = s;
      applyTheme();
      toast(`Theme: ${s.theme}`);
    };
  }

  const renderStats = () => {
    const host = byId('statsCards');
    if (!host) return;
    const tickets = app.db.tickets;
    const stats = [
      ['Total Tickets', tickets.length],
      ['Open', tickets.filter((t) => t.status === 'Open').length],
      ['In Progress', tickets.filter((t) => t.status === 'In Progress').length],
      ['Resolved', tickets.filter((t) => t.status === 'Resolved').length],
      ['High Priority', tickets.filter((t) => t.priority === 3).length],
      ['Unassigned', tickets.filter((t) => t.agent === 'Unassigned').length]
    ];
    host.innerHTML = stats.map(([k, v]) => `<article class='glass stat-card'><small>${k}</small><h2>${v}</h2></article>`).join('');
  };

  const renderQuickActions = () => {
    const host = byId('quickActions');
    if (!host) return;
    const actions = Array.from({ length: 110 }, (_, i) => `Action ${i + 1}`);
    host.innerHTML = actions.map((a) => `<button class='widget' title='${a}'>${a}</button>`).join('');
    host.querySelectorAll('.widget').forEach((el) => el.addEventListener('click', () => toast(`${el.textContent} triggered`)));
  };

  const renderTicketRows = (rows) => {
    const body = byId('ticketTableBody') || byId('trackingTableBody');
    if (!body) return;
    body.innerHTML = rows.map((t) => `<tr><td>${t.id}</td><td>${t.customer}</td><td>${t.issue}</td><td>${t.priority}</td><td><span class='badge ${t.status==='Resolved'?'closed':'open'}'>${t.status}</span></td><td>${t.agent || t.eta}</td></tr>`).join('');
  };

  const ticketSearch = byId('ticketSearch');
  if (ticketSearch) {
    renderTicketRows(app.TicketService.sortByPriority());
    ticketSearch.addEventListener('input', () => renderTicketRows(app.TicketService.searchTickets(ticketSearch.value)));
  }

  const fabCreate = byId('fabCreate');
  if (fabCreate) fabCreate.onclick = () => (location.href = 'ticket-creation.html');

  const submitBtn = byId('submitTicketBtn');
  if (submitBtn) {
    submitBtn.onclick = () => {
      const payload = {
        customer: byId('customerName').value,
        email: byId('customerEmail').value,
        category: byId('issueCategory').value,
        priority: byId('issuePriority').value,
        issue: byId('issueDescription').value
      };
      if (!payload.customer || !payload.issue) return toast('Please fill required fields.');
      const t = app.TicketService.createTicket(payload);
      toast(`Ticket ${t.id} created`);
    };
  }

  const mockApiBtn = byId('mockApiBtn');
  if (mockApiBtn) {
    mockApiBtn.onclick = async () => {
      const out = byId('apiOutput');
      out.textContent = 'Loading suggestion...';
      try {
        const res = await fetch('https://jsonplaceholder.typicode.com/posts/1');
        const data = await res.json();
        out.textContent = `Suggested resolution template:\n${data.title}\n\n${data.body}`;
      } catch {
        out.textContent = 'API unavailable. Please retry later.';
      }
    };
  }

  const applyFiltersBtn = byId('applyFiltersBtn');
  if (applyFiltersBtn) {
    const run = () => {
      const status = byId('statusFilter').value;
      const priority = byId('priorityFilter').value;
      const search = byId('trackingSearch').value.trim().toLowerCase();
      const rows = app.TicketService.filterTickets({ status, priority }).filter((t) => JSON.stringify(t).toLowerCase().includes(search));
      renderTicketRows(rows);
    };
    applyFiltersBtn.onclick = run; run();
  }

  const addAgentBtn = byId('addAgentBtn');
  if (addAgentBtn) {
    const renderAgents = () => {
      const b = byId('agentTableBody');
      b.innerHTML = app.db.agents.map((a, i) => `<tr><td>${a.name}</td><td>${a.skill}</td><td>${a.capacity}</td><td>${a.active||0}</td><td><button data-rm='${i}'>Remove</button></td></tr>`).join('');
      b.querySelectorAll('button').forEach((btn) => btn.onclick = () => {
        const list = app.db.agents; list.splice(Number(btn.dataset.rm), 1); app.db.agents = list; renderAgents();
      });
    };
    addAgentBtn.onclick = () => {
      const list = app.db.agents;
      list.push({ name: byId('agentName').value, skill: byId('agentSkill').value, capacity: Number(byId('agentCapacity').value), active: 0 });
      app.db.agents = list;
      renderAgents();
      toast('Agent added.');
    };
    renderAgents();
  }

  const saveSettingsBtn = byId('saveSettingsBtn');
  if (saveSettingsBtn) {
    saveSettingsBtn.onclick = () => {
      app.db.settings = {
        ...app.db.settings,
        theme: byId('themeSetting').value,
        notification: byId('notificationSetting').value,
        shortcuts: byId('shortcutSetting').value
      };
      applyTheme();
      toast('Settings saved.');
    };
  }
  if (byId('seedDataBtn')) byId('seedDataBtn').onclick = () => { app.TicketService.seed(); toast('Seed data added.'); };
  if (byId('clearDataBtn')) byId('clearDataBtn').onclick = () => { localStorage.clear(); toast('Local database cleared.'); };

  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'k' && e.ctrlKey) {
      const target = byId('ticketSearch') || byId('trackingSearch');
      if (target) { e.preventDefault(); target.focus(); toast('Shortcut activated: search focus'); }
    }
  });

  renderStats();
  renderQuickActions();
})();
