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
    setTimeout(() => el.remove(), 2500);
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
      toast(`Theme switched to ${s.theme}.`);
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
    host.innerHTML = stats
      .map(([k, v]) => `<article class='glass stat-card'><small>${k}</small><h2>${v}</h2></article>`)
      .join('');
  };

  const renderTicketRows = (rows) => {
    const body = byId('ticketTableBody') || byId('trackingTableBody');
    if (!body) return;
    body.innerHTML = rows
      .map(
        (t) =>
          `<tr><td>${t.id}</td><td>${t.customer}</td><td>${t.issue}</td><td>${t.priority}</td><td><span class='badge ${
            t.status === 'Resolved' ? 'closed' : 'open'
          }'>${t.status}</span></td><td>${t.agent || t.eta}</td></tr>`
      )
      .join('');
  };

  const refreshDashboardData = () => {
    renderStats();
    const ticketSearch = byId('ticketSearch');
    if (ticketSearch) {
      const query = ticketSearch.value.trim();
      const rows = query ? app.TicketService.searchTickets(query) : app.TicketService.sortByPriority();
      renderTicketRows(rows);
    }
  };

  const resolveTopPriorityTicket = () => {
    const open = app.db.tickets.filter((t) => t.status !== 'Resolved');
    if (!open.length) return toast('No open ticket available to resolve.');
    const top = [...open].sort((a, b) => b.priority - a.priority)[0];
    app.TicketService.resolveTicket(top.id);
    toast(`Resolved top-priority ticket ${top.id}.`);
    refreshDashboardData();
  };

  const assignTopPriorityTicket = () => {
    const agents = app.db.agents;
    if (!agents.length) return toast('No agents available. Add an agent first.');

    const tickets = app.db.tickets;
    const candidates = tickets.filter((t) => t.status !== 'Resolved' && t.agent === 'Unassigned');
    if (!candidates.length) return toast('No unassigned open ticket found.');

    const ticket = candidates.sort((a, b) => b.priority - a.priority)[0];
    const agent = [...agents].sort((a, b) => (a.active || 0) - (b.active || 0))[0];

    app.TicketService.assignAgent(ticket.id, agent.name);
    const updatedAgents = app.db.agents.map((a) =>
      a.name === agent.name ? { ...a, active: (a.active || 0) + 1 } : a
    );
    app.db.agents = updatedAgents;
    toast(`Assigned ${ticket.id} to ${agent.name}.`);
    refreshDashboardData();
  };

  const quickActionsConfig = [
    { label: 'Open Ticket Form', run: () => (location.href = 'ticket-creation.html') },
    { label: 'Track Tickets', run: () => (location.href = 'ticket-tracking.html') },
    { label: 'Agent Management', run: () => (location.href = 'agent-management.html') },
    {
      label: 'Seed Demo Data',
      run: () => {
        app.TicketService.seed();
        toast('Demo data loaded.');
        refreshDashboardData();
      }
    },
    {
      label: 'Resolve Top Priority',
      run: () => resolveTopPriorityTicket()
    },
    {
      label: 'Auto Assign Top Ticket',
      run: () => assignTopPriorityTicket()
    },
    {
      label: 'Toggle Theme',
      run: () => themeToggle && themeToggle.click()
    },
    {
      label: 'Open DSA Visualizer',
      run: () => (location.href = 'dsa.html')
    }
  ];

  const renderQuickActions = () => {
    const host = byId('quickActions');
    if (!host) return;
    host.innerHTML = quickActionsConfig
      .map((action, idx) => `<button class='widget quick-action-btn' data-action='${idx}' title='${action.label}'>${action.label}</button>`)
      .join('');

    host.querySelectorAll('.quick-action-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.action);
        const action = quickActionsConfig[idx];
        action.run();
      });
    });
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
      toast(`Ticket ${t.id} created.`);
    };
  }

  const buildEnglishSuggestion = ({ customer, category, issue, priority, contact }, apiHint) => {
    const severity = { 1: 'Low', 2: 'Medium', 3: 'High' }[Number(priority)] || 'Medium';
    const categoryPlan = {
      Technical: [
        'Verify local network connectivity and restart router/modem.',
        'Run browser cache cleanup and retry the service login.',
        'Collect error screenshot + timestamp for escalation if issue persists.'
      ],
      Billing: [
        'Validate transaction status from payment gateway logs.',
        'Confirm billing profile details and retry payment safely.',
        'If still failing, create refund/escalation workflow with finance team.'
      ],
      Account: [
        'Confirm account ownership using registered email verification.',
        'Reset credentials/session tokens and ask user to sign in again.',
        'Review account restrictions or policy flags in admin panel.'
      ],
      Shipping: [
        'Check shipment tracking and carrier delay notifications.',
        'Confirm delivery address and contact number with customer.',
        'Escalate to logistics partner if SLA threshold is exceeded.'
      ]
    };

    const steps = categoryPlan[category] || [
      'Collect complete issue details and reproduce in support sandbox.',
      'Attempt first-level troubleshooting with customer confirmation.',
      'Escalate to specialist team with logs and timeline if unresolved.'
    ];

    return [
      'Suggested Resolution Plan (English):',
      `Customer: ${customer || 'N/A'} | Contact: ${contact || 'N/A'}`,
      `Issue Category: ${category || 'General'} | Priority: ${severity}`,
      `Issue Summary: ${issue || 'N/A'}`,
      '',
      'Action Steps:',
      `1) ${steps[0]}`,
      `2) ${steps[1]}`,
      `3) ${steps[2]}`,
      '',
      `Agent Note: ${apiHint || 'Use standard support SOP and confirm resolution with the customer.'}`,
      'Expected Follow-up: Update ticket status to In Progress, then Resolved after customer confirmation.'
    ].join('\n');
  };

  const mockApiBtn = byId('mockApiBtn');
  if (mockApiBtn) {
    mockApiBtn.onclick = async () => {
      const out = byId('apiOutput');
      const formData = {
        customer: byId('customerName')?.value?.trim(),
        contact: byId('customerEmail')?.value?.trim(),
        category: byId('issueCategory')?.value,
        priority: byId('issuePriority')?.value,
        issue: byId('issueDescription')?.value?.trim()
      };

      out.textContent = 'Loading English suggestion...';
      try {
        // Fetch is still used to simulate API enrichment, but output is normalized in English.
        const res = await fetch('https://jsonplaceholder.typicode.com/users/1');
        const data = await res.json();
        const apiHint = `Coordinate with ${data.company?.name || 'support team'} and follow the playbook: "${data.company?.catchPhrase || 'Resolve, verify, and document'}".`;
        out.textContent = buildEnglishSuggestion(formData, apiHint);
      } catch {
        out.textContent = buildEnglishSuggestion(formData);
      }
    };
  }

  const applyFiltersBtn = byId('applyFiltersBtn');
  if (applyFiltersBtn) {
    const run = () => {
      const status = byId('statusFilter').value;
      const priority = byId('priorityFilter').value;
      const search = byId('trackingSearch').value.trim().toLowerCase();
      const rows = app.TicketService
        .filterTickets({ status, priority })
        .filter((t) => JSON.stringify(t).toLowerCase().includes(search));
      renderTicketRows(rows);
    };
    applyFiltersBtn.onclick = run;
    run();
  }

  const addAgentBtn = byId('addAgentBtn');
  if (addAgentBtn) {
    const renderAgents = () => {
      const b = byId('agentTableBody');
      b.innerHTML = app.db.agents
        .map(
          (a, i) =>
            `<tr><td>${a.name}</td><td>${a.skill}</td><td>${a.capacity}</td><td>${a.active || 0}</td><td><button data-rm='${i}'>Remove</button></td></tr>`
        )
        .join('');
      b.querySelectorAll('button').forEach((btn) =>
        (btn.onclick = () => {
          const list = app.db.agents;
          list.splice(Number(btn.dataset.rm), 1);
          app.db.agents = list;
          renderAgents();
        })
      );
    };

    addAgentBtn.onclick = () => {
      const name = byId('agentName').value.trim();
      const skill = byId('agentSkill').value.trim();
      if (!name || !skill) return toast('Provide agent name and skill.');

      const list = app.db.agents;
      list.push({ name, skill, capacity: Number(byId('agentCapacity').value), active: 0 });
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

  if (byId('seedDataBtn')) {
    byId('seedDataBtn').onclick = () => {
      app.TicketService.seed();
      toast('Seed data added.');
    };
  }

  if (byId('clearDataBtn')) {
    byId('clearDataBtn').onclick = () => {
      localStorage.clear();
      toast('Local database cleared.');
    };
  }

  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'k' && e.ctrlKey) {
      const target = byId('ticketSearch') || byId('trackingSearch');
      if (target) {
        e.preventDefault();
        target.focus();
        toast('Shortcut activated: search focus.');
      }
    }
  });

  renderStats();
  renderQuickActions();
})();
