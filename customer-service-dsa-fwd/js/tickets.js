class TicketQueue {
  constructor(items = []) { this.items = items; }
  enqueue(item) { this.items.push(item); }
  dequeue() { return this.items.shift(); }
  peek() { return this.items[0]; }
}

class Stack {
  constructor() { this.data = []; }
  push(v) { this.data.push(v); }
  pop() { return this.data.pop(); }
}

class LinkedNode { constructor(value) { this.value = value; this.next = null; } }
class LinkedList {
  constructor() { this.head = null; }
  insertEnd(value) {
    const node = new LinkedNode(value);
    if (!this.head) return (this.head = node);
    let cur = this.head;
    while (cur.next) cur = cur.next;
    cur.next = node;
  }
  removeHead() { if (!this.head) return null; const v = this.head.value; this.head = this.head.next; return v; }
  toArray() { const out = []; let cur = this.head; while (cur) { out.push(cur.value); cur = cur.next; } return out; }
}

const db = {
  get tickets() { return JSON.parse(localStorage.getItem('acsms_tickets') || '[]'); },
  set tickets(v) { localStorage.setItem('acsms_tickets', JSON.stringify(v)); },
  get agents() { return JSON.parse(localStorage.getItem('acsms_agents') || '[]'); },
  set agents(v) { localStorage.setItem('acsms_agents', JSON.stringify(v)); },
  get settings() { return JSON.parse(localStorage.getItem('acsms_settings') || '{"theme":"dark"}'); },
  set settings(v) { localStorage.setItem('acsms_settings', JSON.stringify(v)); }
};

const TicketService = {
  createTicket(payload) {
    const tickets = db.tickets;
    const ticket = {
      id: `T-${Math.floor(Math.random() * 9000 + 1000)}`,
      customer: payload.customer,
      email: payload.email,
      issue: payload.issue,
      category: payload.category,
      priority: Number(payload.priority),
      status: 'Open',
      eta: `${Math.ceil(Math.random() * 4)}h`,
      createdAt: new Date().toISOString(),
      agent: 'Unassigned'
    };
    tickets.push(ticket);
    db.tickets = tickets;
    return ticket;
  },
  searchTickets(keyword) {
    const k = keyword.toLowerCase();
    return db.tickets.filter((t) => [t.id, t.customer, t.issue, t.category].join(' ').toLowerCase().includes(k));
  },
  sortByPriority(list = db.tickets) {
    return [...list].sort((a, b) => b.priority - a.priority);
  },
  filterTickets({ status = 'all', priority = 'all' }) {
    return db.tickets.filter((t) => (status === 'all' || t.status === status) && (priority === 'all' || String(t.priority) === String(priority)));
  },
  assignAgent(ticketId, agentName) {
    const tickets = db.tickets;
    const idx = tickets.findIndex((t) => t.id === ticketId);
    if (idx >= 0) tickets[idx].agent = agentName;
    db.tickets = tickets;
  },
  resolveTicket(ticketId) {
    const tickets = db.tickets;
    const t = tickets.find((x) => x.id === ticketId);
    if (t) t.status = 'Resolved';
    db.tickets = tickets;
  },
  seed() {
    db.tickets = [
      { id: 'T-1201', customer: 'Aisha', email: 'a@example.com', issue: 'Payment failed', category: 'Billing', priority: 3, status: 'Open', eta: '2h', agent: 'Zayd', createdAt: new Date().toISOString() },
      { id: 'T-1202', customer: 'Noah', email: 'n@example.com', issue: 'Cannot login', category: 'Technical', priority: 2, status: 'In Progress', eta: '1h', agent: 'Mira', createdAt: new Date().toISOString() },
      { id: 'T-1203', customer: 'Rita', email: 'r@example.com', issue: 'Address update', category: 'Account', priority: 1, status: 'Resolved', eta: 'done', agent: 'Yasmin', createdAt: new Date().toISOString() }
    ];
    db.agents = [{ name: 'Zayd', skill: 'Billing', capacity: 5, active: 2 }, { name: 'Mira', skill: 'Technical', capacity: 6, active: 3 }];
  }
};

window.ACSMS = { TicketQueue, Stack, LinkedList, TicketService, db };
