/* 云暖・旅居 —— 全站背景氛围音（极弱版）
 * 无按钮、无任何UI：音量压到很微弱，作为纯背景氛围音。
 * 加载后自动尝试播放；若被浏览器自动播放策略拦截，则在用户
 * 首次与页面交互（点击 / 滑动 / 触摸 / 按键）时自动启动。
 * 雨林白噪音与葫芦丝轻音乐 60 秒轮换，避免单调。
 */
(function () {
  'use strict';

  var TRACKS = ['rainforest.mp3', 'hulusi.mp3'];

  var script = document.currentScript;
  var base = script && script.src ? script.src.replace(/\/js\/music\.js.*$/, '') + '/' : './';

  var audio = new Audio(base + 'audio/' + TRACKS[0]);
  audio.loop = false;               /* 用 ended 轮换，不用 loop */
  audio.volume = 0.12;              /* 很微弱的背景音 */
  audio.preload = 'auto';

  var idx = 0;
  var started = false;

  function start() {
    if (started) return;
    started = true;
    var p = audio.play();
    if (p && p.catch) p.catch(function () { started = false; });
  }

  /* 60 秒播完换下一首，循环轮换 */
  audio.addEventListener('ended', function () {
    idx = (idx + 1) % TRACKS.length;
    audio.src = base + 'audio/' + TRACKS[idx];
    if (started) {
      var p = audio.play();
      if (p && p.catch) p.catch(function () {});
    }
  });

  /* 1) 加载后立即尝试（部分环境允许自动播放） */
  try { start(); } catch (e) {}

  /* 2) 被拦截则首次交互时启动 */
  ['click', 'touchstart', 'scroll', 'keydown'].forEach(function (evt) {
    document.addEventListener(evt, function once() {
      start();
    }, { once: true, passive: true });
  });
})();
