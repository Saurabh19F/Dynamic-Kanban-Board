// renderer.js — build columns & render cards
import { el, time, initials, hashColor } from "./util.js";
import { bindCard, bindColumn } from "./dnd.js";
import { get, subscribe } from "./state.js";

const STATUS_META = {
  todo:       { label: "To Do",       wip: 8 },
  inprogress: { label: "In Progress", wip: 5 },
  done:       { label: "Done",        wip: Infinity },
};

const board = document.getElementById("board");
const daysUntil = (iso) => {
  if (!iso) return null;
  const now = new Date(); const d = new Date(iso + "T23:59:59");
  return Math.ceil((d - now) / (1000*60*60*24));
};
const chip = (txt, cls="") => el("span", { className: `badge ${cls}` }, txt);

const buildCard = (t) => {
  const node = el("article", { className: "card", tabindex: 0, dataset: { id: t.id } });
  const dueDays = daysUntil(t.due);
  const dueText = t.due ? (dueDays < 0 ? `Due ${Math.abs(dueDays)}d ago` : dueDays === 0 ? "Due today" : `Due in ${dueDays}d`) : "";
  const priCls = t.priority === "high" ? "high" : t.priority === "low" ? "low" : "med";

  const metaRow = el("div", { className: "meta" });
  if (t.assignee) {
    const av = el("span", { className: "avatar badge", title: t.assignee });
    av.style.background = hashColor(t.assignee);
    av.textContent = initials(t.assignee);
    metaRow.append(av);
  }
  metaRow.append(chip(t.priority.toUpperCase(), `priority ${priCls}`));
  if (t.due) metaRow.append(chip(dueText, dueDays < 0 ? "due overdue" : "due"));
  (t.labels || []).forEach(l => metaRow.append(chip(l)));

  node.append(
    el("h4", {}, t.title || "(Untitled)"),
    metaRow,
    t.desc ? el("p", {}, t.desc) : null,
    el("small", {}, `Created: ${time(t.createdAt)}`),
    el("div", { className: "card-actions" },
      //("button", { className: "icon-btn", "data-action": "edit", title: "Edit (E)" }, "Edit"),
      //el("button", { className: "icon-btn danger", "data-action": "delete", title: "Delete (Del)" }, "Delete"),
      el("button", { className: "icon-btn", dataset: { action: "edit" }, title: "Edit (E)" }, "Edit"),
      el("button", { className: "icon-btn danger", dataset: { action: "delete" }, title: "Delete (Del)" }, "Delete"),
    )
  );
  bindCard(node);
  return node;
};

const buildColumn = (status, idx, total) => {
  const meta = STATUS_META[status];
  const header = el("div", { className: "col-header" },
    el("div", { className: "col-left" },
      el("span", { className: "col-title" }, meta.label),
      el("span", { className: "wip" }, meta.wip === Infinity ? "" : `(WIP ${meta.wip})`)
    ),
    el("div", { className: "col-move" },
      el("button", { className: "tiny", disabled: idx === 0, "data-move": `left:${idx}` }, "◀"),
      el("button", { className: "tiny", disabled: idx === total - 1, "data-move": `right:${idx}` }, "▶"),
      el("span", { className: "count", id: `count-${status}` }, "0"),
    )
  );
  const body = el("div", { className: "col-body" },
    el("div", { className: "dropzone", id: `zone-${status}` })
  );
  const node = el("section", { className: "col", id: `col-${status}` }, header, body);
  board.append(node);
  bindColumn(node, status);
};

export const render = ({ tasks, columns }) => {
  // Build columns
  board.innerHTML = "";
  columns.forEach((s, i) => buildColumn(s, i, columns.length));

  // Filters
  const q = document.getElementById("q").value.trim().toLowerCase();
  const fPri = document.getElementById("filterPriority").value;
  const fLab = document.getElementById("filterLabel").value.trim().toLowerCase();

  // Filter & group
  const filtered = tasks.filter(t => {
    const matchQ = !q || t.title.toLowerCase().includes(q) || (t.desc || "").toLowerCase().includes(q);
    const matchPri = !fPri || t.priority === fPri;
    const matchLab = !fLab || (t.labels || []).some(l => l.toLowerCase() === fLab);
    return matchQ && matchPri && matchLab;
  });

  const byStatus = Object.fromEntries(columns.map(s => [s, []]));
  filtered.sort((a,b) => b.order - a.order).forEach(t => (byStatus[t.status] || []).push(t));

  // Render cards & counts
  columns.forEach(s => {
    const zone = document.getElementById(`zone-${s}`);
    const cnt  = document.getElementById(`count-${s}`);
    (byStatus[s] || []).forEach(t => zone.append(buildCard(t)));
    cnt.textContent = String((byStatus[s] || []).length);

    const meta = STATUS_META[s];
    const col = document.getElementById(`col-${s}`);
    if (meta && col) col.classList.toggle("wip-exceeded", meta.wip !== Infinity && (byStatus[s] || []).length > meta.wip);
  });

  // Refresh label filter options
  const select = document.getElementById("filterLabel");
  const allLabels = [...new Set(tasks.flatMap(t => t.labels || []))].sort();
  const current = select.value;
  select.innerHTML = "<option value=''>All labels</option>" + allLabels.map(l => `<option value='${l}'>${l}</option>`).join("");
  if ([...select.options].some(o => o.value === current)) select.value = current;
};

export const init = () => { render(get()); subscribe(render); };
