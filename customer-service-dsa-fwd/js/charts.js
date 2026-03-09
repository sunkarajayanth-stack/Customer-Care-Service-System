(function () {
  const app = window.ACSMS;
  if (!app || typeof Chart === 'undefined') return;
  const tickets = app.db.tickets;

  const priorityCounts = [1, 2, 3].map((p) => tickets.filter((t) => t.priority === p).length);
  const statusNames = ['Open', 'In Progress', 'Resolved'];
  const statusCounts = statusNames.map((s) => tickets.filter((t) => t.status === s).length);

  new Chart(document.getElementById('priorityChart'), {
    type: 'bar',
    data: { labels: ['Low', 'Medium', 'High'], datasets: [{ label: 'Priority', data: priorityCounts, backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'] }] },
    options: { responsive: true }
  });

  new Chart(document.getElementById('statusChart'), {
    type: 'doughnut',
    data: { labels: statusNames, datasets: [{ data: statusCounts, backgroundColor: ['#facc15', '#38bdf8', '#22c55e'] }] },
    options: { responsive: true }
  });

  const resolved = statusCounts[2], total = tickets.length || 1;
  document.getElementById('resolutionBar').style.width = `${Math.round((resolved / total) * 100)}%`;
  document.getElementById('csatBar').style.width = `${60 + Math.floor(Math.random() * 35)}%`;
})();
