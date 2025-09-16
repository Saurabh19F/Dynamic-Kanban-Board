// dnd.js — HTML5 drag & drop
import { moveTask } from "./state.js";

const DRAG_KEY = "text/task-id";

const onDragStart = (e) => {
  // Ensure we always get the card element
  const card = e.currentTarget?.closest(".card") || e.target.closest(".card");
  if (!card) return;

  e.dataTransfer.setData(DRAG_KEY, card.dataset.id);
  e.dataTransfer.effectAllowed = "move";

  // Add dragging style
  setTimeout(() => card.classList.add("dragging"), 0);
};

const onDragEnd = (e) => {
  const card = e.currentTarget?.closest(".card") || e.target.closest(".card");
  if (card) card.classList.remove("dragging");
};

export const bindCard = (el) => {
  el.draggable = true;
  el.addEventListener("dragstart", onDragStart);
  el.addEventListener("dragend", onDragEnd);
};

export const bindColumn = (el, status) => {
  const zone = el.querySelector(".dropzone");

  zone.addEventListener("dragover", (e) => {
    e.preventDefault();
    el.classList.add("drag-over");
  });

  zone.addEventListener("dragleave", () => el.classList.remove("drag-over"));

  zone.addEventListener("drop", (e) => {
    e.preventDefault();
    el.classList.remove("drag-over");

    const id = e.dataTransfer.getData(DRAG_KEY);
    if (id) moveTask(id, status);
  });
};
