(function () {
  const byId = (i) => document.getElementById(i);
  const stack = [];
  const queue = [];
  let linked = [];

  document.querySelectorAll('.tab-btn').forEach((btn) => btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-pane').forEach((p) => p.classList.add('hidden'));
    byId(btn.dataset.tab).classList.remove('hidden');
  }));

  const paint = (id, arr, sep = '') => byId(id).innerHTML = arr.map((v) => `<div class='widget'>${v}${sep}</div>`).join('');

  byId('stackPushBtn').onclick = () => { stack.push(byId('stackValue').value); paint('stackViz', [...stack].reverse()); };
  byId('stackPopBtn').onclick = () => { stack.pop(); paint('stackViz', [...stack].reverse()); };

  byId('queueEnqueueBtn').onclick = () => { queue.push(byId('queueValue').value); paint('queueViz', queue); };
  byId('queueDequeueBtn').onclick = () => { queue.shift(); paint('queueViz', queue); };

  byId('linkedInsertBtn').onclick = () => { linked.push(byId('linkedValue').value); paint('linkedViz', linked, ' →'); };
  byId('linkedRemoveBtn').onclick = () => { linked = linked.slice(1); paint('linkedViz', linked, ' →'); };

  const bubbleSort = (arr) => {
    const a = [...arr];
    for (let i = 0; i < a.length; i++) {
      for (let j = 0; j < a.length - i - 1; j++) {
        if (a[j] > a[j + 1]) [a[j], a[j + 1]] = [a[j + 1], a[j]];
      }
    }
    return a;
  };

  const quickSort = (arr) => {
    if (arr.length <= 1) return arr;
    const p = arr[arr.length - 1], left = [], right = [];
    for (let i = 0; i < arr.length - 1; i++) (arr[i] < p ? left : right).push(arr[i]);
    return [...quickSort(left), p, ...quickSort(right)];
  };

  byId('bubbleSortBtn').onclick = () => {
    const arr = byId('sortInput').value.split(',').map(Number);
    byId('sortViz').textContent = `Bubble sort: ${bubbleSort(arr).join(', ')}`;
  };
  byId('quickSortBtn').onclick = () => {
    const arr = byId('sortInput').value.split(',').map(Number);
    byId('sortViz').textContent = `Quick sort: ${quickSort(arr).join(', ')}`;
  };

  byId('linearSearchBtn').onclick = () => {
    const arr = byId('searchArrayInput').value.split(',').map(Number), t = Number(byId('searchTarget').value);
    byId('searchViz').textContent = `Linear Search Index: ${arr.findIndex((v) => v === t)}`;
  };

  byId('binarySearchBtn').onclick = () => {
    const arr = byId('searchArrayInput').value.split(',').map(Number), t = Number(byId('searchTarget').value);
    let l = 0, r = arr.length - 1, idx = -1;
    while (l <= r) { const m = Math.floor((l + r) / 2); if (arr[m] === t) { idx = m; break; } arr[m] < t ? l = m + 1 : r = m - 1; }
    byId('searchViz').textContent = `Binary Search Index: ${idx}`;
  };

  const graph = { A: ['B', 'C'], B: ['D'], C: ['E'], D: [], E: ['F'], F: [] };
  const bfs = (s) => { const q = [s], seen = new Set([s]), out = []; while (q.length) { const n = q.shift(); out.push(n); graph[n].forEach((x) => { if (!seen.has(x)) { seen.add(x); q.push(x); } }); } return out; };
  const dfs = (s, seen = new Set(), out = []) => { seen.add(s); out.push(s); graph[s].forEach((n) => !seen.has(n) && dfs(n, seen, out)); return out; };
  byId('runBfsBtn').onclick = () => byId('graphViz').textContent = `BFS: ${bfs('A').join(' -> ')}`;
  byId('runDfsBtn').onclick = () => byId('graphViz').textContent = `DFS: ${dfs('A').join(' -> ')}`;

  const tree = { val: 8, left: { val: 4, left: { val: 2 }, right: { val: 6 } }, right: { val: 12, left: { val: 10 }, right: { val: 14 } } };
  const inO = (n, o = []) => { if (!n) return o; inO(n.left, o); o.push(n.val); inO(n.right, o); return o; };
  const pre = (n, o = []) => { if (!n) return o; o.push(n.val); pre(n.left, o); pre(n.right, o); return o; };
  const post = (n, o = []) => { if (!n) return o; post(n.left, o); post(n.right, o); o.push(n.val); return o; };
  byId('runInOrderBtn').onclick = () => byId('treeViz').textContent = `InOrder: ${inO(tree).join(', ')}`;
  byId('runPreOrderBtn').onclick = () => byId('treeViz').textContent = `PreOrder: ${pre(tree).join(', ')}`;
  byId('runPostOrderBtn').onclick = () => byId('treeViz').textContent = `PostOrder: ${post(tree).join(', ')}`;
})();
