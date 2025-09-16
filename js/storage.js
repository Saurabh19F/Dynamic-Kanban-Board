// storage.js — localStorage wrapper
const TASKS_KEY = "kanban_tasks_v2";
const COLS_KEY  = "kanban_columns_v1";

export const loadTasks = () => {
  try { return JSON.parse(localStorage.getItem(TASKS_KEY)) || []; }
  catch { return []; }
};
export const saveTasks = (tasks) =>
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));

export const loadCols = () => {
  try { return JSON.parse(localStorage.getItem(COLS_KEY)) || ["todo","inprogress","done"]; }
  catch { return ["todo","inprogress","done"]; }
};
export const saveCols = (cols) =>
  localStorage.setItem(COLS_KEY, JSON.stringify(cols));
