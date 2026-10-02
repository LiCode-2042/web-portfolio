/* 取色器 · popup 逻辑
   在扩展里：点按钮 → 注入脚本读当前页 → 统计出现最多的颜色 → 渲染色块
   直接双击打开本文件（没有 chrome API）时：用演示数据渲染，方便截图和给人看 */

const DEMO = {
  url: 'demo.local',
  colors: [
    ['#143D5C', 412], ['#E4572E', 96], ['#F5F6F7', 388], ['#12181D', 341],
    ['#D8DEE2', 64], ['#5E6B73', 52], ['#E8EEF3', 31], ['#FFFFFF', 210]
  ],
  fonts: [['Microsoft YaHei', 612], ['Georgia', 78], ['Consolas', 22]]
};

const el = (id) => document.getElementById(id);
const rgbToHex = (s) => {
  const m = s.match(/\d+(\.\d+)?/g);
  if (!m) return null;
  if (m.length < 3) return null;
  return '#' + m.slice(0, 3).map(v => Math.round(+v).toString(16).padStart(2, '0')).join('').toUpperCase();
};

function render(data) {
  el('src').textContent = data.url || '—';
  const wrap = el('swatches');
  wrap.innerHTML = '';
  if (!data.colors.length) {
    wrap.innerHTML = '<div class="empty">这个页面没读到颜色</div>';
  } else {
    data.colors.slice(0, 8).forEach(([hex]) => {
      const b = document.createElement('button');
      b.className = 'chip';
      b.innerHTML = `<div class="c" style="background:${hex}"></div><div class="h">${hex}</div>`;
      b.title = '点击复制 ' + hex;
      b.onclick = () => copy(hex);
      wrap.appendChild(b);
    });
  }
  const fwrap = el('fonts');
  fwrap.innerHTML = '';
  if (!data.fonts.length) {
    fwrap.innerHTML = '<div class="empty">—</div>';
  } else {
    data.fonts.slice(0, 4).forEach(([name, n]) => {
      const d = document.createElement('div');
      d.className = 'fontrow';
      d.innerHTML = `<b>${name}</b><i>${n} 处</i>`;
      d.title = '点击复制字体名';
      d.onclick = () => copy(name);
      fwrap.appendChild(d);
    });
  }
}

function toast(t) {
  const t0 = el('toast');
  t0.textContent = t;
  t0.classList.add('on');
  setTimeout(() => t0.classList.remove('on'), 1200);
}

async function copy(text) {
  try {
    await navigator.clipboard.writeText(text);
    toast('已复制 ' + text);
  } catch (e) {
    toast('复制失败，手动选一下吧');
  }
}

/* 在页面里跑的提取函数（会被 executeScript 注入） */
function extractOnPage() {
  /* 注意：这个函数会被序列化后注入到页面里执行，
     所以它依赖的工具函数必须写在函数内部，不能引用户面外的变量 */
  const toHex = (s) => {
    const m = String(s).match(/\d+(\.\d+)?/g);
    if (!m || m.length < 3) return null;
    return '#' + m.slice(0, 3).map(v => Math.round(+v).toString(16).padStart(2, '0')).join('').toUpperCase();
  };
  const count = new Map(), fonts = new Map();
  const els = document.querySelectorAll('body *');
  const limit = Math.min(els.length, 1500);
  for (let i = 0; i < limit; i++) {
    const s = getComputedStyle(els[i]);
    if (s.display === 'none' || s.visibility === 'hidden') continue;
    const r = els[i].getBoundingClientRect();
    if (r.width < 8 || r.height < 8) continue;
    [s.backgroundColor, s.color].forEach(c => {
      if (!c || c === 'rgba(0, 0, 0, 0)' || c === 'transparent') return;
      const hex = toHex(c);
      if (hex) count.set(hex, (count.get(hex) || 0) + 1);
    });
    const f = (s.fontFamily || '').split(',')[0].replace(/["']/g, '').trim();
    if (f) fonts.set(f, (fonts.get(f) || 0) + 1);
  }
  const top = (m, n) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
  return { url: location.hostname, colors: top(count, 8), fonts: top(fonts, 4) };
}

el('go').onclick = async () => {
  if (typeof chrome !== 'undefined' && chrome.scripting) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) return render({ url: '', colors: [], fonts: [] });
    try {
      const [res] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: extractOnPage
      });
      render(res.result || { url: tab.url, colors: [], fonts: [] });
    } catch (e) {
      render({ url: '此页面不允许读取（如浏览器设置页）', colors: [], fonts: [] });
    }
  } else {
    render(DEMO);           // 直接打开 html 时的演示数据
  }
};

/* 直接打开时自动填演示数据，方便截图 */
if (typeof chrome === 'undefined' || !chrome.scripting) {
  document.addEventListener('DOMContentLoaded', () => render(DEMO));
}
