// util.js — reusable DOM + helpers
export const $ = (sel, root=document) => root.querySelector(sel);
export const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

export const el = (tag, props = {}, ...children) => {
const node = document.createElement(tag);

  // Extract dataset separately
const { dataset, ...rest } = props || {};
Object.assign(node, rest);

if (dataset && typeof dataset === "object") {
    Object.assign(node.dataset, dataset);
}

  for (const child of children) {
    if (child != null) {
      node.append(child.nodeType ? child : document.createTextNode(child));
    }
  }
  return node;
};

export const uid = () =>
  Math.random().toString(36).slice(2) + Date.now().toString(36);

export const time = ts => new Date(ts).toLocaleString();

export const download = (filename, dataStr) => {
  const a = document.createElement("a");
  a.href = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
  a.download = filename;
  a.click();
};

export const initials = (name="") =>
  name.trim().split(/\s+/).slice(0,2).map(s=>s[0]?.toUpperCase()).join("") || "?";

export const hashColor = (str="") => {
  let h=0; for (let i=0;i<str.length;i++) h=(h<<5)-h+str.charCodeAt(i);
  const r=(h>>0)&255,g=(h>>8)&255,b=(h>>16)&255;
  return `rgb(${(r&127)+80}, ${(g&127)+80}, ${(b&127)+80})`;
};

export const parseLabels = (s="") =>
  s.split(",").map(x=>x.trim()).filter(Boolean);
