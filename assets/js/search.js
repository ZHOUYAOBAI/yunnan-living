/* 全站搜索（纯前端，无后端） */
(function(){
  // 索引：url、title、keywords（关键词，用于模糊匹配）
  var INDEX = [
    {u:"index.html", t:"首页 · 云暖·旅居", k:"首页 开始 一颗糖 慢 云南 介绍"},
    {u:"destination.html", t:"16州版图 · 目的地", k:"16州 目的地 版图 哪里 选"},
    {u:"experience.html", t:"旅居体验包 · 一周起", k:"体验包 价格 天数 一周 15天 30天 自选 组合 体验"},
    {u:"living.html", t:"生活方式 · 焕新居/安居/以工换住", k:"生活方式 焕新居 安居 退休 数字游民 间隔年 WORK 以工换住"},
    {u:"revive.html", t:"焕新居 · 给日子透口气", k:"焕新居 revive 透口气 数字游民 间隔年 1-3月"},
    {u:"settle.html", t:"安居 · 退休换地方住", k:"安居 settle 退休 养老 长住 15天 数年"},
    {u:"concierge.html", t:"旅居总管 · 一地一管家", k:"管家 总管 服务 买菜 就医 陪诊 接站 家属群 应急"},
    {u:"food.html", t:"美食 · 味觉版图", k:"美食 吃 菜市场 餐厅 菌子 过桥米线 傣味"},
    {u:"trust.html", t:"信任中心 · 合同/保险/医疗边界", k:"信任 合同 保险 承诺 医疗边界 资质 隐私"},
    {u:"contact.html", t:"联系 · 立即咨询", k:"联系 咨询 电话 留言 表单 132 0888"},
    {u:"stories.html", t:"旅居故事", k:"故事 案例 客户 爸妈 退休"},
    {u:"faq.html", t:"常见问题", k:"faq 问题 收费 几天 接站 安全"},
    {u:"mianze.html", t:"免责声明 · 风险告知", k:"免责 风险 合同 法律 责任"},
    {u:"privacy.html", t:"隐私政策", k:"隐私 个人信息"},
    {u:"terms.html", t:"服务条款", k:"条款 服务"},
    // 16州
    {u:"places/kunming.html", t:"昆明 · 春城的晨昏", k:"昆明 春城 省会 交通 医疗 篆新 翠湖"},
    {u:"places/dali.html", t:"大理 · 苍山洱海", k:"大理 苍山 洱海 古城 白族 乳扇 温泉"},
    {u:"places/lijiang.html", t:"丽江 · 古城与雪山", k:"丽江 古城 玉龙雪山 纳西 束河"},
    {u:"places/diqing.html", t:"迪庆 · 香格里拉", k:"迪庆 香格里拉 藏区 高原 松赞林寺 高反"},
    {u:"places/xishuangbanna.html", t:"西双版纳 · 雨林避寒", k:"西双版纳 版纳 景洪 雨林 傣味 避寒 泼水节"},
    {u:"places/puer.html", t:"普洱 · 茶山", k:"普洱 茶山 咖啡 思茅 避寒"},
    {u:"places/baoshan.html", t:"保山 · 腾冲温泉", k:"保山 腾冲 温泉 和顺 银杏"},
    {u:"places/dehong.html", t:"德宏 · 芒市边境", k:"德宏 芒市 边境 傣味 景颇 撒撇 泡鲁达"},
    {u:"places/lincang.html", t:"临沧 · 佤乡茶山", k:"临沧 佤族 滇红 茶"},
    {u:"places/nujiang.html", t:"怒江 · 峡谷", k:"怒江 六库 傈僳 峡谷 老姆登"},
    {u:"places/chuxiong.html", t:"楚雄 · 彝族", k:"楚雄 彝族 火把节 恐龙"},
    {u:"places/yuxi.html", t:"玉溪 · 抚仙湖", k:"玉溪 抚仙湖 铜锅鱼 离昆明近"},
    {u:"places/honghe.html", t:"红河 · 梯田米线", k:"红河 蒙自 个旧 元阳梯田 过桥米线 碧色寨"},
    {u:"places/wenshan.html", t:"文山 · 普者黑", k:"文山 普者黑 三七 荷花"},
    {u:"places/qujing.html", t:"曲靖 · 珠江源", k:"曲靖 珠江源 避暑 蒸饵丝"},
    {u:"places/zhaotong.html", t:"昭通 · 乌蒙山", k:"昭通 苹果 天麻 大山包 黑颈鹤 冷"}
  ];

  // 创建搜索UI（固定在右上角）
  var box = document.createElement('div');
  box.style.cssText = 'position:fixed;top:72px;right:20px;z-index:9999;width:320px;font-family:inherit;';
  box.innerHTML = '<input id="site-search" type="text" placeholder="搜索：地州/管家/价格/避寒/退休…" style="width:100%;padding:.6rem .9rem;border:1px solid #B5C9A8;border-radius:20px;font-size:.9rem;background:#FFF7EC;outline:none;box-shadow:0 4px 16px rgba(0,0,0,.1);">'
    + '<div id="site-results" style="display:none;margin-top:.4rem;background:#fff;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,.15);max-height:400px;overflow-y:auto;"></div>';
  document.body.appendChild(box);

  var input = box.querySelector('#site-search');
  var results = box.querySelector('#site-results');

  input.addEventListener('input', function(){
    var q = input.value.trim().toLowerCase();
    if(!q){ results.style.display='none'; return; }
    var hits = INDEX.filter(function(it){
      return it.t.toLowerCase().indexOf(q) >= 0 || it.k.toLowerCase().indexOf(q) >= 0;
    });
    if(!hits.length){
      results.innerHTML = '<div style="padding:.8rem;color:#888;font-size:.85rem;">没找到「'+input.value+'」，试试：大理、避寒、退休、管家、价格</div>';
    } else {
      results.innerHTML = hits.slice(0,8).map(function(it){
        return '<a href="./'+it.u+'" style="display:block;padding:.6rem .9rem;color:#333;text-decoration:none;border-bottom:1px solid #f0f0f0;font-size:.9rem;">'+it.t+'<br><span style="color:#888;font-size:.78rem;">'+it.k+'</span></a>';
      }).join('');
    }
    results.style.display = 'block';
  });
  document.addEventListener('click', function(e){
    if(!box.contains(e.target)) results.style.display='none';
  });
})();
