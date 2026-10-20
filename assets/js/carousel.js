/* ============================================================
 * 16 州卡片自动轮播
 * 每个州独立轮播，淡入淡出，3.5 秒切换，悬停暂停。
 *
 * 【图片配置】
 * 每个州的图片数组在下面 STATE_SLIDES 里配置。
 * - 第一项必须是当前已上线的主图（hero）
 * - 后续项是同州的其他代表性风景图，可继续增补
 * - 当前先用主图占位，后续把对应路径替换成真实图即可
 * - 图片放到 assets/img/ 目录，路径写 ./assets/img/xxx.jpg
 * ============================================================ */

const STATE_SLIDES = {
  diqing: [
    './assets/img/diqing-hero.jpg',          // 独克宗古城全景
    './assets/img/diqing-hero.jpg',          // TODO: 梅里雪山日照金山
    './assets/img/diqing-hero.jpg',          // TODO: 松赞林寺
  ],
  nujiang: [
    './assets/img/nujiang-hero.jpg',         // 怒江第一湾
    './assets/img/nujiang-hero.jpg',         // TODO: 丙中洛
    './assets/img/nujiang-hero.jpg',         // TODO: 雾里村
  ],
  lijiang: [
    './assets/img/lijiang-hero.jpg',        // 丽江古城航拍
    './assets/img/lijiang-hero.jpg',        // TODO: 玉龙雪山
    './assets/img/lijiang-hero.jpg',        // TODO: 蓝月谷
  ],
  dali: [
    './assets/img/dali-hero.jpg',           // 三塔倒影
    './assets/img/dali-hero.jpg',           // TODO: 洱海
    './assets/img/dali-hero.jpg',           // TODO: 苍山
  ],
  baoshan: [
    './assets/img/baoshan-hero.jpg',        // 和顺古镇
    './assets/img/baoshan-hero.jpg',        // TODO: 热海温泉
    './assets/img/baoshan-hero.jpg',        // TODO: 火山公园
  ],
  dehong: [
    './assets/img/dehong-hero.jpg',         // 勐焕大金塔
    './assets/img/dehong-hero.jpg',         // TODO: 莫里热带雨林
    './assets/img/dehong-hero.jpg',         // TODO: 树包塔
  ],
  lincang: [
    './assets/img/lincang-hero.jpg',        // 临沧云海佛塔
    './assets/img/lincang-hero.jpg',        // TODO: 翁丁佤族古寨
    './assets/img/lincang-hero.jpg',        // TODO: 冰岛茶山
  ],
  puer: [
    './assets/img/puer-hero.jpg',            // 小熊猫
    './assets/img/puer-hero.jpg',          // TODO: 景迈山古茶林
    './assets/img/puer-hero.jpg',            // TODO: 太阳河森林公园
  ],
  xishuangbanna: [
    './assets/img/xishuangbanna-hero.jpg',  // 傣族佛寺
    './assets/img/xishuangbanna-hero.jpg',  // TODO: 野象谷
    './assets/img/xishuangbanna-hero.jpg',  // TODO: 告庄夜市
  ],
  chuxiong: [
    './assets/img/chuxiong-hero.jpg',       // 彝人古镇
    './assets/img/chuxiong-hero.jpg',       // TODO: 元谋土林
    './assets/img/chuxiong-hero.jpg',       // TODO: 彝人古镇夜景
  ],
  kunming: [
    './assets/img/kunming-hero.jpg',        // 金马碧鸡坊
    './assets/img/kunming-hero.jpg',        // TODO: 滇池
    './assets/img/kunming-hero.jpg',        // TODO: 西山
  ],
  yuxi: [
    './assets/img/yuxi-hero.jpg',           // 明星渔洞帆船
    './assets/img/yuxi-hero.jpg',           // TODO: 抚仙湖日落
    './assets/img/yuxi-hero.jpg',           // TODO: 澄江化石地
  ],
  qujing: [
    './assets/img/qujing-hero.jpg',         // 麒麟水乡
    './assets/img/qujing-hero.jpg',         // TODO: 罗平油菜花
    './assets/img/qujing-hero.jpg',         // TODO: 珠江源
  ],
  zhaotong: [
    './assets/img/zhaotong-hero.jpg',       // 大山包悬崖
    './assets/img/zhaotong-hero.jpg',       // TODO: 大山包黑颈鹤
    './assets/img/zhaotong-hero.jpg',       // TODO: 黄连河瀑布
  ],
  honghe: [
    './assets/img/honghe-hero.jpg',         // 元阳蓝色梯田
    './assets/img/honghe-hero.jpg',         // TODO: 建水古城
    './assets/img/honghe-hero.jpg',         // TODO: 弥勒东风韵
  ],
  wenshan: [
    './assets/img/wenshan-hero.jpg',        // 普者黑
    './assets/img/wenshan-hero.jpg',        // TODO: 坝美
    './assets/img/wenshan-hero.jpg',        // TODO: 广南峰林
  ],
};

// 轮播间隔（毫秒）
const SLIDE_INTERVAL = 3500;

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.state-card').forEach((card) => {
    const ph = card.querySelector('.ph');
    if (!ph) return;

    // 从 href 提取州名，如 ./places/diqing.html -> diqing
    const href = card.getAttribute('href') || '';
    const m = href.match(/places\/([a-z]+)\.html/);
    if (!m) return;
    const key = m[1];
    const slides = STATE_SLIDES[key];
    if (!slides || slides.length < 2) return;

    // 清掉原来的单图，重新构建轮播图
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

    // 轮播逻辑
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
});
