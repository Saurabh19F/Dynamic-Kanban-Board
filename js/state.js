// state.js — in-memory state + pub/sub
import { loadTasks, saveTasks, loadCols, saveCols } from "./storage.js";
import { uid } from "./util.js";

let tasks = loadTasks();
let columns = loadCols();
const listeners = new Set();

const emit = () => listeners.forEach(fn => fn({ tasks, columns }));
export const subscribe = (fn) => (listeners.add(fn), () => listeners.delete(fn));

export const addTask = ({ title, desc, assignee, priority, due, labels }) => {
  const t = { id: uid(), title: title.trim(), desc: (desc||"").trim(),
              assignee: assignee||"", priority: priority||"med", due: due||"",
              labels: labels||[], status: "todo", order: Date.now(),
              createdAt: Date.now(), updatedAt: Date.now() };
  tasks = [t, ...tasks]; saveTasks(tasks); emit();
};

export const updateTask = (id, patch) => {
  tasks = tasks.map(t => t.id===id ? { ...t, ...patch, updatedAt: Date.now() } : t);
  saveTasks(tasks); emit();
};

export const deleteTask = (id) => {
  tasks = tasks.filter(t=>t.id!==id);
  saveTasks(tasks); emit();
};

export const moveTask   = (id, status) =>
  updateTask(id, { status, order: Date.now() });

export const replaceAll = (arr) => { tasks = arr; saveTasks(tasks); emit(); };

export const moveColumn = (fromIdx, toIdx) => {
  const arr = columns.slice();
  if (fromIdx<0||toIdx<0||fromIdx>=arr.length||toIdx>=arr.length) return;
  const [c] = arr.splice(fromIdx,1); arr.splice(toIdx,0,c);
  columns = arr; saveCols(columns); emit();
};

export const get = () => ({ tasks: tasks.slice(), columns: columns.slice() });
