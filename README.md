# Advanced Customer Service Management System – FWD + DSA Project

A complete academic project that combines **Front-End Web Development (FWD)** with **Data Structures & Algorithms (DSA)**.

## Project Outputs
1. **Web Application** (HTML/CSS/JS): multi-page customer service management platform.
2. **Terminal Program** (`terminal/dsa_terminal.js`): interactive DSA simulation menu.

## Features Snapshot
- Login/register authentication simulation with localStorage
- Dashboard with sidebar navigation and glassmorphism UI
- Ticket creation, filtering, searching, sorting by priority
- Agent management and assignment-ready structures
- Analytics with Chart.js
- DSA visualizer for stack, queue, linked list, sorting, searching, graph, tree
- Dark/light theme toggle
- Toast messages, keyboard shortcut (`Ctrl + K`), hover cards, tabs, FAB, progress bars
- API simulation using `fetch()`
- 100+ interactive quick-action components generated in dashboard

## Pages
- `index.html`
- `login.html`
- `register.html`
- `dashboard.html`
- `ticket-creation.html`
- `ticket-tracking.html`
- `agent-management.html`
- `dsa.html`
- `analytics.html`
- `settings.html`
- `about.html`
- `topics.html`

## FWD Topics Used
- HTML structure and semantic sections (`nav`, `main`, `section`, `article`, `aside`)
- Forms and validation
- Responsive CSS grid layout
- Advanced CSS (gradients, glassmorphism, animation, transitions)
- JavaScript functions, arrays, objects, events, DOM manipulation
- Fetch API for simulated remote response
- Local storage as lightweight browser database
- Git/GitHub deploy-ready static architecture

## DSA Topics Used
- Arrays
- Stacks
- Queues
- Linked Lists
- Sorting (Bubble, Quick)
- Searching (Linear, Binary)
- Graph traversal (BFS, DFS)
- Tree traversal (InOrder, PreOrder, PostOrder)
- Hash-table style indexing strategy via object keys/store mapping patterns
- Recursion for quick sort / DFS / tree traversals
- Complexity analysis notes in terminal mode outputs

## Screenshots
Add screenshots after running locally (example target pages):
- Dashboard
- DSA Visualizer
- Analytics

## Run Web Project
### Option A (Quick)
Open `index.html` in browser.

### Option B (Recommended local server)
```bash
cd customer-service-dsa-fwd
python3 -m http.server 8080
```
Then open `http://localhost:8080`.

## Run Terminal Program
```bash
cd customer-service-dsa-fwd
node terminal/dsa_terminal.js
```

## GitHub Pages Deployment
1. Push repository to GitHub.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Choose branch (`main` or your branch) and folder (`/root` if project is repo root, or `/customer-service-dsa-fwd` if configured accordingly).
5. Save and wait for deployment URL.

## Notes
- Designed as a capstone-style FWD + DSA educational project.
- All data is simulated client-side for demonstration.
