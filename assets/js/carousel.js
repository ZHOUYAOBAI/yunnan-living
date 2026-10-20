/* ============================================================
 * 16 州卡片自动轮播
 * 每个州独立轮播，淡入淡出，3.5 秒切换，悬停暂停。
 *
 * 图片在 assets/img/slides/ 目录下，命名规则：{州名}-1.jpg / -2.jpg / -3.jpg
 * ============================================================ */

const STATE_SLIDES = {
  diqing: [
    './assets/img/slides/diqing-1.jpg',   // 独克宗古城全景（有人居住）
    './assets/img/slides/diqing-2.jpg',   // 梅里雪山日照金山
    './assets/img/slides/diqing-3.jpg',   // 松赞林寺
  ],
  nujiang: [
    './assets/img/slides/nujiang-1.jpg',  // 怒江第一湾
    './assets/img/slides/nujiang-2.jpg',  // 丙中洛田园
    './assets/img/slides/nujiang-3.jpg',   // 怒江峡谷全景
  ],
  lijiang: [
    './assets/img/slides/lijiang-1.jpg',   // 丽江古城航拍（有人居住）
    './assets/img/slides/lijiang-2.jpg',  // 蓝月谷碧蓝湖水
    './assets/img/slides/lijiang-3.jpg',  // 蓝月谷全景
  ],
  dali: [
    './assets/img/slides/dali-1.jpg',     // 三塔倒影
    './assets/img/slides/dali-2.jpg',     // 洱海与古城（有人居住）
    './assets/img/slides/dali-3.jpg',      // 苍山下白族村落
  ],
  baoshan: [
    './assets/img/slides/baoshan-1.jpg',   // 和顺古镇湖泊（有人居住）
    './assets/img/slides/baoshan-2.jpg',   // 和顺古镇牌坊
    './assets/img/slides/baoshan-3.jpg',   // 腾冲城全景
  ],
  dehong: [
    './assets/img/slides/dehong-1.jpg',    // 勐焕大金塔
    './assets/img/slides/dehong-2.jpg',    // 勐焕银塔
    './assets/img/slides/dehong-3.jpg',   // 银塔日光
  ],
  lincang: [
    './assets/img/slides/lincang-1.jpg',  // 云海佛塔城市（有人居住）
    './assets/img/slides/lincang-2.jpg',  // 鲁史古镇航拍
    './assets/img/slides/lincang-3.jpg',  // 临沧城航拍
  ],
  puer: [
    './assets/img/slides/puer-1.jpg',     // 小熊猫
    './assets/img/slides/puer-2.jpg',     // 景迈山古茶林
    './assets/img/slides/puer-3.jpg',     // 太阳河森林公园
  ],
  xishuangbanna: [
    './assets/img/slides/xishuangbanna-1.jpg', // 傣族佛寺金塔
    './assets/img/slides/xishuangbanna-2.jpg', // 告庄大金塔
    './assets/img/slides/xishuangbanna-3.jpg', // 曼听公园水景
  ],
  chuxiong: [
    './assets/img/slides/chuxiong-1.jpg', // 彝人古镇牌坊（有人居住）
    './assets/img/slides/chuxiong-2.jpg', // 彝人古镇航拍
    './assets/img/slides/chuxiong-3.jpg', // 彝人古镇夜景
  ],
  kunming: [
    './assets/img/slides/kunming-1.jpg',  // 金马碧鸡坊夜景（有人居住）
    './assets/img/slides/kunming-2.jpg',  // 滇池红嘴鸥
    './assets/img/slides/kunming-3.jpg',  // 西山日出
  ],
  yuxi: [
    './assets/img/slides/yuxi-1.jpg',      // 明星渔洞帆船
    './assets/img/slides/yuxi-2.jpg',      // 抚仙湖碧蓝湖面
    './assets/img/slides/yuxi-3.jpg',      // 抚仙湖孤山岛
  ],
  qujing: [
    './assets/img/slides/qujing-1.jpg',    // 麒麟水乡垂柳
    './assets/img/slides/qujing-2.jpg',    // 水乡游船
    './assets/img/slides/qujing-3.jpg',    // 水乡湖畔
  ],
  zhaotong: [
    './assets/img/slides/zhaotong-1.jpg', // 大山包悬崖
    './assets/img/slides/zhaotong-2.jpg', // 黑颈鹤群飞
    './assets/img/slides/zhaotong-3.jpg', // 黑颈鹤特写
  ],
  honghe: [
    './assets/img/slides/honghe-1.jpg',    // 元阳蓝色梯田
    './assets/img/slides/honghe-2.jpg',    // 老虎嘴梯田
    './assets/img/slides/honghe-3.jpg',   // 建水古城朝阳楼（有人居住）
  ],
  wenshan: [
    './assets/img/slides/wenshan-1.jpg',   // 普者黑
    './assets/img/slides/wenshan-2.jpg',   // 普者黑
    './assets/img/slides/wenshan-3.jpg',   // 普者黑
  ],
};

const SLIDE_INTERVAL = 3500;

function initCarousel() {
  document.querySelectorAll('.state-card').forEach((card) => {
    const ph = card.querySelector('.ph');
    if (!ph) return;

    const href = card.getAttribute('href') || '';
    const m = href.match(/places\/([a-z]+)\.html/);
    if (!m) return;
    const key = m[1];
    const slides = STATE_SLIDES[key];
    if (!slides || slides.length < 2) return;

    const regionTag = ph.querySelector('.region-tag');
    ph.querySelectorAll('img').forEach((im) => im.remove());

    slides.forEach((src, i) => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = '';
      img.loading = 'lazy';
      if (i === 0) img.classList.add('is-first');
      ph.appendChild(img);
    });
    if (regionTag) ph.appendChild(regionTag);

    const imgs = ph.querySelectorAll('img');
    let idx = 0;
    let timer = null;

    const go = (next) => {
      imgs[idx].classList.remove('is-active');
      imgs[idx].classList.remove('is-first');
      idx = (next + imgs.length) % imgs.length;
      imgs[idx].classList.add('is-active');
    };

    const start = () => {
      stop();
      timer = setInterval(() => go(idx + 1), SLIDE_INTERVAL);
    };
    const stop = () => {
      if (timer) { clearInterval(timer); timer = null; }
    };

    card.addEventListener('mouseenter', stop);
    card.addEventListener('mouseleave', start);
    card.addEventListener('touchstart', stop, { passive: true });
    card.addEventListener('touchend', start);

    start();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCarousel);
} else {
  initCarousel();
}
