/* 云暖・旅居 —— 全站背景声音控件
 * 左下角悬浮：主按钮播放/暂停，小按钮在「雨林白噪音」「葫芦丝轻音乐」间切换
 * 仅用户点击后播放（符合浏览器自动播放策略），音源偏好记 localStorage
 */
(function () {
  'use strict';

  var AUDIOS = [
    { key: 'rainforest', name: '雨林白噪音', file: 'rainforest.mp3' },
    { key: 'hulusi', name: '葫芦丝轻音乐', file: 'hulusi.mp3' }
  ];

  var cur = AUDIOS[0];
  try {
    var saved = localStorage.getItem('yunnuan_bgm');
    AUDIOS.forEach(function (a) { if (a.key === saved) cur = a; });
  } catch (e) {}

  /* 自动推导音频根路径：兼容根目录与 places/ 子目录 */
  var script = document.currentScript;
  var base = script && script.src ? script.src.replace(/\/js\/music\.js.*$/, '') + '/' : './';

  var audio = new Audio(base + 'audio/' + cur.file);
  audio.loop = true;
  audio.volume = 0.55;
  audio.preload = 'none';

  /* ---------- 样式（注入，不污染现有CSS） ---------- */
  var css =
    '.music-dock{position:fixed;left:1.2rem;bottom:1.2rem;z-index:9999;display:flex;align-items:center;gap:.6rem;font-family:inherit;}' +
    '.music-toggle{width:52px;height:52px;border-radius:50%;border:none;cursor:pointer;background:#2D4A35;color:#F5EFE6;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 22px rgba(20,40,30,.38);transition:transform .2s ease,background .2s ease;position:relative;}' +
    '.music-toggle:hover{transform:scale(1.06);background:#38594A;}' +
    '.music-toggle svg{width:24px;height:24px;}' +
    '.music-toggle .ic-pause{display:none;}' +
    '.music-dock.is-playing .music-toggle .ic-play{display:none;}' +
    '.music-dock.is-playing .music-toggle .ic-pause{display:block;}' +
    '.music-switch{width:34px;height:34px;border-radius:50%;border:none;cursor:pointer;background:rgba(255,255,255,.94);color:#2D4A35;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(20,40,30,.26);transition:transform .2s ease;}' +
    '.music-switch:hover{transform:scale(1.1);}' +
    '.music-switch svg{width:17px;height:17px;}' +
    '.music-label{background:rgba(255,255,255,.95);color:#2D4A35;font-size:.78rem;padding:.35rem .75rem;border-radius:999px;box-shadow:0 4px 14px rgba(20,40,30,.22);opacity:0;transform:translateX(-6px);transition:opacity .25s ease,transform .25s ease;white-space:nowrap;}' +
    '.music-dock.is-playing .music-label{opacity:1;transform:translateX(0);}' +
    '.music-dock.is-playing .music-toggle::after{content:\'\';position:absolute;inset:-6px;border-radius:50%;border:2px solid rgba(45,74,53,.45);animation:musicPulse 2s ease-out infinite;}' +
    '@keyframes musicPulse{0%{transform:scale(.92);opacity:.9;}70%{transform:scale(1.25);opacity:0;}100%{opacity:0;}}' +
    '@media (max-width:768px){.music-dock{left:.9rem;bottom:.9rem;}.music-toggle{width:48px;height:48px;}.music-toggle svg{width:22px;height:22px;}}';

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  /* ---------- DOM ---------- */
  var dock = document.createElement('div');
  dock.className = 'music-dock';
  dock.setAttribute('role', 'region');
  dock.setAttribute('aria-label', '背景声音');

  var switchBtn = document.createElement('button');
  switchBtn.type = 'button';
  switchBtn.className = 'music-switch';
  switchBtn.setAttribute('aria-label', '切换背景声音');
  switchBtn.title = '切换声音';
  switchBtn.innerHTML =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 0 1 14-5.6M20 12a8 8 0 0 1-14 5.6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18 2v5h-5M6 22v-5h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

  var toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'music-toggle';
  toggle.setAttribute('aria-label', '播放背景声音');
  toggle.innerHTML =
    '<svg class="ic-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>' +
    '<svg class="ic-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h4v14H7zM13 5h4v14h-4z" fill="currentColor"/></svg>';

  var label = document.createElement('span');
  label.className = 'music-label';
  label.textContent = cur.name;

  dock.appendChild(switchBtn);
  dock.appendChild(toggle);
  dock.appendChild(label);
  document.body.appendChild(dock);

  var playing = false;

  function render() {
    dock.classList.toggle('is-playing', playing);
    toggle.setAttribute('aria-label', (playing ? '暂停' : '播放') + '：' + cur.name);
    label.textContent = cur.name;
  }

  toggle.addEventListener('click', function () {
    if (playing) {
      audio.pause();
      playing = false;
    } else {
      var p = audio.play();
      if (p && p.then) {
        p.then(function () { playing = true; render(); }).catch(function () { playing = false; render(); });
      } else {
        playing = true;
      }
    }
    render();
  });

  switchBtn.addEventListener('click', function () {
    var i = AUDIOS.indexOf(cur);
    cur = AUDIOS[(i + 1) % AUDIOS.length];
    audio.src = base + 'audio/' + cur.file;
    try { localStorage.setItem('yunnuan_bgm', cur.key); } catch (e) {}
    if (playing) {
      var p = audio.play();
      if (p && p.then) p.catch(function () {});
    }
    render();
  });

  render();
})();
