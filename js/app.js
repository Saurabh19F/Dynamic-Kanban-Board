// app.js — event handling & bootstrap
import { $, parseLabels, download } from "./util.js";
import { get, addTask, updateTask, deleteTask, moveColumn, replaceAll } from "./state.js";
import { init as initRenderer, render } from "./renderer.js";

let editingId = null;

// Form submit -> add task
const onSubmit = (e) => {
  e.preventDefault();
  const payload = {
    title: $("#title").value,
    desc: $("#desc").value,
    assignee: $("#assignee").value,
    priority: $("#priority").value,
    due: $("#due").value,
    labels: parseLabels($("#labels").value),
  };
  if (!payload.title.trim()) return;
  addTask(payload);
  e.target.reset();
  $("#title").focus();
};

// Card actions / Column move (event delegation)
const onBoardClick = (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  // Column reorder buttons
  const mv = btn.dataset.move;
  if (mv) {
    const [dir, idxStr] = mv.split(":");
    const idx = Number(idxStr);
    moveColumn(idx, dir === "left" ? idx - 1 : idx + 1);
    render(get());
    return;
  }

  // Card actions
  const action = btn.dataset.action;
  console.log(action);
  if (!action) return;
  const card = btn.closest(".card");
  const id = card?.dataset.id;
  if (!id) return;

  if (action === "edit") openEdit(id);
  if (action === "delete") confirmDelete(id);
};

// Keyboard shortcuts inside cards
const onBoardKeydown = (e) => {
  const card = e.target.closest(".card");
  const id = card?.dataset.id;
  if (!id) return;

  if (e.key === "1") updateTask(id, { status: "todo", order: Date.now() });
  if (e.key === "2") updateTask(id, { status: "inprogress", order: Date.now() });
  if (e.key === "3") updateTask(id, { status: "done", order: Date.now() });
  if (e.key.toLowerCase() === "e") { e.preventDefault(); openEdit(id); }
  if (e.key === "Delete") confirmDelete(id);
};

// Edit modal
const openEdit = (id) => {
  const t = get().tasks.find(x => x.id === id); if (!t) return;
  editingId = id;
  $("#editTitle").value = t.title;
  $("#editDesc").value = t.desc || "";
  $("#editAssignee").value = t.assignee || "";
  $("#editPriority").value = t.priority || "med";
  $("#editDue").value = t.due || "";
  $("#editLabels").value = (t.labels || []).join(", ");
  $("#editModal").showModal();
};
const closeEdit = () => { editingId = null; $("#editModal").close(); };
const saveEdit = () => {
  const patch = {
    title: $("#editTitle").value.trim(),
    desc: $("#editDesc").value.trim(),
    assignee: $("#editAssignee").value.trim(),
    priority: $("#editPriority").value,
    due: $("#editDue").value,
    labels: parseLabels($("#editLabels").value),
  };
  if (!patch.title) return;
  updateTask(editingId, patch);
  closeEdit();
};

// Delete confirmation

const confirmDelete = (id) => {
  const t = get().tasks.find(x => x.id === id); if (!t) return;
  if (confirm(`Delete task:\n${t.title}?`)) deleteTask(id);
};

// Search + filters -> re-render
const reRender = () => render(get());

// Export / Import
const exportJson = () =>
  download(`kanban-${Date.now()}.json`, JSON.stringify(get().tasks, null, 2));

const importJson = async (file) => {
  const text = await file.text();
  try {
    const arr = JSON.parse(text);
    if (!Array.isArray(arr)) throw new Error("Invalid JSON");

    // Minimal validation/coercion
    const safe = arr.filter(t => t && t.id && t.title).map(t => ({
      id: String(t.id),
      title: String(t.title),
      desc: String(t.desc || ""),
      assignee: String(t.assignee || ""),
      priority: ["low","med","high"].includes(t.priority) ? t.priority : "med",
      due: t.due ? String(t.due) : "",
      labels: Array.isArray(t.labels) ? t.labels.map(String) : [],
      status: ["todo","inprogress","done"].includes(t.status) ? t.status : "todo",
      order: Number(t.order || Date.now()),
      createdAt: Number(t.createdAt || Date.now()),
      updatedAt: Number(t.updatedAt || Date.now()),
    }));

    replaceAll(safe);
  } catch (e) {
    alert("Import failed: " + e.message);
  }
};

// Global shortcuts
document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
    e.preventDefault(); $("#q").focus();
  }
});

// Bootstrap
initRenderer();
$("#taskForm").addEventListener("submit", onSubmit);
$("#board").addEventListener("click", onBoardClick);
$("#board").addEventListener("keydown", onBoardKeydown);

$("#cancelEdit").addEventListener("click", closeEdit);
$("#saveEdit").addEventListener("click", saveEdit);

$("#q").addEventListener("input", reRender);
$("#filterPriority").addEventListener("change", reRender);
$("#filterLabel").addEventListener("change", reRender);
$("#clearSearch").addEventListener("click", () => { $("#q").value = ""; reRender(); });

$("#exportJson").addEventListener("click", exportJson);
$("#importBtn").addEventListener("click", () => $("#importJson").click());
$("#importJson").addEventListener("change", (e) => {
  const f = e.target.files?.[0]; if (f) importJson(f);
  e.target.value = "";
});
