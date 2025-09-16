# 🗂️ Dynamic Kanban Board

A lightweight **Kanban Board** built with **vanilla JavaScript**, **HTML5 Drag & Drop**, and **LocalStorage**.  
It’s modular, scalable, and requires no backend — everything runs in the browser.

---

## 🚀 Features

- **Task Management**
  - Create tasks with **title, description, assignee, priority, due date, and labels**.
  - Edit or delete tasks anytime.
  - Search and filter tasks by priority or labels.

- **Drag & Drop**
  - Move tasks across columns (`To Do → In Progress → Done`).
  - Columns highlight on drag-over.

- **Keyboard Shortcuts**
  - Focus a card and press:
    - `1` → Move to **To Do**
    - `2` → Move to **In Progress**
    - `3` → Move to **Done**
    - `E` → Edit
    - `Del` → Delete

- **Persistence**
  - All tasks are stored in `localStorage`.
  - Import/Export tasks as JSON.

- **Customizable Columns**
  - Reorder columns left/right with buttons.
  - WIP (Work In Progress) limits shown in headers.

---

## 📂 Project Structure

├── index.html # App entry point
├── style.css # Styles (Dark theme, responsive, drag highlights)
├── app.js # Event handling & bootstrap
├── renderer.js # Rendering logic (columns & cards)
├── dnd.js # Drag & Drop binding
├── state.js # In-memory state + pub/sub
├── storage.js # LocalStorage wrapper
├── util.js # DOM & helper utilities

yaml
Copy code

---

## 🛠️ Setup & Usage

1. Clone or download the project.
2. Open `index.html` in a modern browser.
3. Start adding tasks and drag them across columns.

⚡ No build step, no server needed.

---

## 🎨 UI/UX Highlights

- Dark theme with accent color.
- Smooth hover/focus feedback.
- Accessible: keyboard shortcuts, focus rings, screen-reader helpers.
- Responsive: works on desktop, tablet, and mobile.

---

## 📸 Preview

(Add a screenshot or GIF of the board here if you’d like)

---

## 📝 License

MIT License – free to use, modify, and distribute.

---
