/* 云暖・旅居 —— 全站背景氛围音（轻音渐强版）
 * 无播放按钮，音量很轻微（0.10），且以 5 秒 easeIn 渐强进入，
 * 换曲时 1.5 秒轻柔过渡，全程不突兀。
 * 加载后自动尝试播放；若被浏览器自动播放策略拦截，则在用户
 * 首次交互（点击 / 触摸 / 滚动 / 滚轮 / 按键）时自动启动。
 * 两首 120 秒云南民族纯音乐轮换。
 * 若 3 秒后仍未开始，首屏角落浮现一句「轻触屏幕，开启云南的声音」，
 * 1.8 秒后自动淡出（仅引导，不是按钮）。
 */
(function () {
  'use strict';

  var TRACKS = ['yunnan-morning.mp3', 'yunnan-dusk.mp3'];
  var TARGET_VOLUME = 0.10;          /* 很轻微的背景音 */

  var script = document.currentScript;
  var base = script && script.src ? script.src.replace(/\/js\/music\.js.*$/, '') + '/' : './';

  var audio = new Audio(base + 'audio/' + TRACKS[0]);
  audio.loop = false;               /* 用 ended 轮换，不用 loop */
  audio.volume = 0;                 /* 从静音开始，由渐强进入 */
  audio.preload = 'auto';

  var idx = 0;
  var started = false;
  var rafId = null;

  /* 音量渐强：从当前音量缓动到 target，dur 毫秒 */
  function fadeTo(target, dur) {
    if (rafId) cancelAnimationFrame(rafId);
    var startV = audio.volume;
    var t0 = null;
    function step(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      /* easeInQuad：开头更轻，慢慢起来 */
      audio.volume = startV + (target - startV) * p * p;
      if (p < 1) rafId = requestAnimationFrame(step);
      else audio.volume = target;
    }
    rafId = requestAnimationFrame(step);
  }

  function start() {
    if (started) return;
    started = true;
    var p = audio.play();
    if (p && p.catch) p.catch(function () { started = false; });
    fadeTo(TARGET_VOLUME, 5000);    /* 5 秒渐强进入 */
  }

  /* 120 秒播完换下一首：轻柔过渡 */
  audio.addEventListener('ended', function () {
    idx = (idx + 1) % TRACKS.length;
    audio.src = base + 'audio/' + TRACKS[idx];
    if (started) {
      var p = audio.play();
      if (p && p.catch) p.catch(function () {});
      fadeTo(TARGET_VOLUME, 1500);  /* 换曲 1.5 秒渐强 */
    }
  });

  /* 1) 加载后立即尝试（老访客有交互历史时可自动播放） */
  try { start(); } catch (e) {}

  /* 2) 被拦截则首次交互时启动（覆盖所有常见手势） */
  ['click', 'pointerdown', 'touchstart', 'scroll', 'mousewheel', 'keydown'].forEach(function (evt) {
    document.addEventListener(evt, function once() {
      start();
      hideHint();
    }, { once: true, passive: true });
  });

  /* 3) 引导提示：加载后 3 秒还没出声，闪现一句提示后自动消失 */
  var hintTimer = null;
  function showHint() {
    if (started) return;
    var d = document.createElement('div');
    d.id = 'yunnuan-sound-hint';
    d.textContent = '轻触屏幕，开启云南的声音';
    d.setAttribute('role', 'status');
    var s = d.style;
    s.position = 'fixed';
    s.left = '50%';
    s.bottom = '2.2rem';
    s.transform = 'translateX(-50%)';
    s.zIndex = '2147483000';
    s.background = 'rgba(45,74,53,.82)';
    s.color = '#F5EFE6';
    s.fontSize = '.85rem';
    s.letterSpacing = '.04em';
    s.padding = '.6rem 1.2rem';
    s.borderRadius = '999px';
    s.boxShadow = '0 6px 22px rgba(20,40,30,.35)';
    s.opacity = '0';
    s.transition = 'opacity .5s ease';
    s.pointerEvents = 'none';
    document.body.appendChild(d);
    /* 淡入，1.8 秒后淡出并移除 */
    requestAnimationFrame(function () { d.style.opacity = '1'; });
    setTimeout(function () {
      d.style.opacity = '0';
      setTimeout(function () { if (d.parentNode) d.parentNode.removeChild(d); }, 600);
    }, 1800);
  }
  function hideHint() {
    if (hintTimer) { clearTimeout(hintTimer); hintTimer = null; }
    var d = document.getElementById('yunnuan-sound-hint');
    if (d && d.parentNode) d.parentNode.removeChild(d);
  }
  hintTimer = setTimeout(showHint, 3000);
})();
