/* 全站搜索 v3：历史 + 分组 + 拼音纠错 + 快捷键 + 防抖 */
(function(){
  var INDEX = [
    {u:"index.html", t:"首页 · 云暖·旅居", k:"首页 开始 一颗糖 慢 云南 介绍", g:"其他"},
    {u:"destination.html", t:"16州版图 · 目的地", k:"16州 目的地 版图 哪里 选 地方", g:"地州"},
    {u:"experience.html", t:"旅居体验包 · 一周起", k:"体验包 价格 费用 多少钱 天数 一周 15天 30天 自选 组合 报价", g:"服务"},
    {u:"living.html", t:"生活方式 · 焕新居/安居/以工换住", k:"生活方式 焕新居 安居 退休 养老 数字游民 间隔年 换工 打工换宿", g:"服务"},
    {u:"revive.html", t:"焕新居 · 给日子透口气", k:"焕新居 revive 透口气 数字游民 间隔年 1-3月 短住", g:"服务"},
    {u:"settle.html", t:"安居 · 退休换地方住", k:"安居 settle 退休 养老 长住 15天 数年 爸妈 父母", g:"服务"},
    {u:"concierge.html", t:"旅居总管 · 一地一管家", k:"管家 总管 服务 买菜 就医 陪诊 接站 家属群 应急 打扫 做饭", g:"服务"},
    {u:"food.html", t:"美食 · 味觉版图", k:"美食 吃 菜市场 餐厅 菌子 过桥米线 傣味 小吃", g:"其他"},
    {u:"trust.html", t:"信任中心 · 合同/保险/医疗边界", k:"信任 合同 保险 承诺 医疗边界 资质 隐私 安全 靠谱", g:"其他"},
    {u:"contact.html", t:"联系 · 立即咨询", k:"联系 咨询 电话 留言 表单 132 0888 加微信", g:"其他"},
    {u:"stories.html", t:"旅居故事", k:"故事 案例 客户 爸妈 退休 真实", g:"其他"},
    {u:"faq.html", t:"常见问题", k:"faq 问题 收费 几天 接站 安全 怎么办", g:"其他"},
    {u:"mianze.html", t:"免责声明 · 风险告知", k:"免责 风险 合同 法律 责任 条款", g:"其他"},
    {u:"privacy.html", t:"隐私政策", k:"隐私 个人信息 手机号", g:"其他"},
    {u:"terms.html", t:"服务条款", k:"条款 服务 协议", g:"其他"},
    {u:"places/kunming.html", t:"昆明 · 春城", k:"昆明 春城 省会 交通 医疗 篆新 翠湖 中转站", g:"地州"},
    {u:"places/dali.html", t:"大理 · 苍山洱海", k:"大理 苍山 洱海 古城 白族 乳扇 温泉 风花雪月", g:"地州"},
    {u:"places/lijiang.html", t:"丽江 · 古城与雪山", k:"丽江 古城 玉龙雪山 纳西 束河 高", g:"地州"},
    {u:"places/diqing.html", t:"迪庆 · 香格里拉", k:"迪庆 香格里拉 中甸 藏区 高原 松赞林寺 高反 冷", g:"地州"},
    {u:"places/xishuangbanna.html", t:"西双版纳 · 雨林避寒", k:"西双版纳 版纳 景洪 雨林 傣味 避寒 泼水节 热 冬天", g:"地州"},
    {u:"places/puer.html", t:"普洱 · 茶山", k:"普洱 茶山 咖啡 思茅 避寒 温和", g:"地州"},
    {u:"places/baoshan.html", t:"保山 · 腾冲温泉", k:"保山 腾冲 温泉 和顺 银杏 热海", g:"地州"},
    {u:"places/dehong.html", t:"德宏 · 芒市边境", k:"德宏 芒市 边境 傣味 景颇 撒撇 泡鲁达 缅甸", g:"地州"},
    {u:"places/lincang.html", t:"临沧 · 佤乡茶山", k:"临沧 佤族 滇红 茶 小众", g:"地州"},
    {u:"places/nujiang.html", t:"怒江 · 峡谷", k:"怒江 六库 傈僳 峡谷 老姆登 知子罗", g:"地州"},
    {u:"places/chuxiong.html", t:"楚雄 · 彝族", k:"楚雄 彝族 火把节 恐龙 恐龙谷", g:"地州"},
    {u:"places/yuxi.html", t:"玉溪 · 抚仙湖", k:"玉溪 抚仙湖 铜锅鱼 离昆明近 澄江", g:"地州"},
    {u:"places/honghe.html", t:"红河 · 梯田米线", k:"红河 蒙自 个旧 元阳梯田 过桥米线 碧色寨", g:"地州"},
    {u:"places/wenshan.html", t:"文山 · 普者黑", k:"文山 普者黑 三七 荷花 喀斯特", g:"地州"},
    {u:"places/qujing.html", t:"曲靖 · 珠江源", k:"曲靖 珠江源 避暑 蒸饵丝 宣威火腿", g:"地州"},
    {u:"places/zhaotong.html", t:"昭通 · 乌蒙山", k:"昭通 苹果 天麻 大山包 黑颈鹤 冷 凉", g:"地州"}
  ];

  var SYN = {
    "养老":"退休 安居 长住 爸妈 父母 老人",
    "老年":"退休 安居 老人",
    "退休":"安居 settle 老人 长住",
    "爸妈":"父母 安居 退休 家属",
    "父母":"爸妈 安居 退休",
    "老人":"退休 安居 慢病 陪同",
    "钱":"价格 费用 多少钱 体验包 报价",
    "多少钱":"价格 费用 体验包",
    "费用":"价格 体验包",
    "报价":"价格 体验包",
    "便宜":"价格 体验包",
    "贵":"价格 体验包",
    "冷":"迪庆 香格里拉 昭通 丽江 冬季",
    "热":"西双版纳 版纳 德宏 芒市 夏季",
    "避寒":"西双版纳 版纳 普洱 德宏 芒市 冬天 温暖",
    "暖和":"避寒 西双版纳 版纳 普洱 德宏",
    "暖和":"避寒 西双版纳 版纳 普洱 德宏",
    "避暑":"昆明 曲靖 大理 丽江 夏季",
    "凉快":"避暑 昆明 曲靖 大理 夏季",
    "高反":"香格里拉 迪庆 高原 海拔",
    "高原":"香格里拉 迪庆 海拔 高反",
    "海拔":"迪庆 香格里拉 丽江 高原",
    "医院":"医疗 就医 陪诊 三甲 管家",
    "看病":"就医 陪诊 医院 管家",
    "大夫":"就医 医院 医疗",
    "看病":"就医 医院 管家",
    "买菜":"管家 生活 菜市场 做饭",
    "做饭":"管家 买菜 做饭 餐厅",
    "吃饭":"美食 餐厅 管家",
    "接站":"管家 机场 高铁 到达",
    "家属":"家属群 安心 爸妈 父母 远程",
    "微信":"联系 咨询 电话 加微信",
    "电话":"联系 132 0888 咨询",
    "靠谱":"信任 合同 安全 资质",
    "安全":"信任 合同 医疗边界 保险",
    "保险":"信任 保险 意外险",
    "合同":"信任 协议 确认单 免责",
    "几天":"天数 一周 15天 30天 体验包",
    "多久":"天数 一周 15天 30天",
    "短住":"焕新居 一周 体验",
    "长住":"安居 退休 数月 数年",
    "数字游民":"焕新居 远程 咖啡 网络",
    "咖啡":"普洱 小粒咖啡 咖啡馆",
    "温泉":"保山 腾冲 热海",
    "菌子":"美食 野生菌 雨季 见手青",
    "米线":"美食 过桥米线 蒙自 红河",
    "梯田":"红河 元阳",
    "雪山":"丽江 玉龙雪山 迪庆 香格里拉",
    "雨林":"西双版纳 版纳 热带",
    "寺庙":"迪庆 松赞林寺 藏区",
    "边境":"德宏 芒市 缅甸",
    "茶山":"普洱 临沧 滇红 茶",
    "湖":"大理 洱海 玉溪 抚仙湖",
    "冬天":"避寒 西双版纳 版纳 普洱 德宏",
    "夏季":"避暑 昆明 大理 丽江 曲靖",
    "老人":"退休 安居 慢病",
    "小孩":"家庭 带娃 亲子",
    "自驾":"交通 到达",
    "飞机":"机场 到达",
    "高铁":"动车 到达",
    "行李":"接站 管家",
    "药":"就医 医院 慢病",
    "慢病":"医疗 医院 管家",
    "高血压":"医疗 医院 高原",
    "糖尿病":"医疗 医院",
    "心脏":"高反 高原 医疗",
    "高反":"香格里拉 迪庆 高原",
    "缺氧":"高反 高原 香格里拉",
    "雨":"雨季 天气",
    "天气":"气候 季节",
    "季节":"气候 最佳",
    "穿衣":"气候 衣服",
    "衣服":"穿衣 气候",
    "花":"玫瑰 银杏 樱花",
    "樱花":"大理 春季",
    "银杏":"保山 腾冲 秋季",
    "玫瑰":"丽江 大理",
    "赶集":"菜市场 美食",
    "夜市":"美食 版纳 芒市",
    "酒吧":"夜生活",
    "安静":"普洱 临沧 小众",
    "热闹":"版纳 大理 丽江",
    "第一":"推荐 适合",
    "推荐":"适合 哪里",
    "哪好":"推荐 适合",
    "最好":"推荐",
    "新手":"第一次 昆明 大理",
    "第一次":"昆明 大理 中转",
    "入门":"第一次 昆明",
    "深度":"怒江 迪庆 临沧",
    "小众":"临沧 怒江 文山",
    "网红":"大理 丽江 版纳",
    "避坑":"注意 风险",
    "坑":"注意 风险",
    "骗":"信任 风险",
    "靠谱":"信任 合同"
  };

  var PY = {
    "dl":"大理", "ljs":"丽江", "xsb":"西双版纳", "xsbn":"西双版纳", "bn":"版纳",
    "km":"昆明", "pe":"普洱", "bs":"保山", "dh":"德宏", "ms":"芒市",
    "lc":"临沧", "nj":"怒江", "cx":"楚雄", "yx":"玉溪", "hh":"红河",
    "mz":"蒙自", "ys":"元阳梯田", "ws":"文山", "pzh":"普者黑", "qj":"曲靖",
    "zt":"昭通", "dlg":"大理古城", "eg":"洱海", "cs":"苍山",
    "gj":"管家", "tn":"体验包", "aj":"安居", "hx":"焕新居",
    "bh":"避寒", "bs2":"避暑", "gf":"高反", "yl":"养老",
    "dali":"大理", "lijiang":"丽江", "banna":"版纳", "xsbn":"西双版纳",
    "kunming":"昆明", "puer":"普洱", "baoshan":"保山", "dehong":"德宏",
    "menghun":"勐海", "mengla":"勐腊", "tengchong":"腾冲", "ruili":"瑞丽",
    "gongshan":"贡山", "fugong":"福贡", "lanping":"兰坪", "shangrila":"香格里拉",
    "zhongdian":"中甸", "deqin":"德钦", "weixi":"维西", "yunlong":"云龙",
    "yulong":"玉龙", "yanjing":"盐井", "shaxi":"沙溪", "xizhou":"喜洲",
    "dengchuan":"邓川", " Eryuan":"洱源", "jianchuan":"剑川", "heqing":"鹤庆",
    "songping":"松坪", "lugu":"泸沽湖", "ninglang":"宁蒗", "yongsheng":"永胜",
    "huaping":"华坪", "yuanmou":"元谋", "mouding":"牟定", "shuangbai":"双柏",
    "nanlao":"南涧", "jingdong":"景东", "jinggu":"景谷", "zhenyuan":"镇沅",
    "mengdai":"勐大", "simao":"思茅", "jiangcheng":"江城", "menglian":"孟连",
    "lancang":"澜沧", "ximeng":"西盟", "gengma":"耿马", "cangyuan":"沧源",
    "shuangjiang":"双江", "zhenkang":"镇康", "yongde":"永德", "fengqing":"凤庆",
    "yun":"云县", "baoshan":"保山", "longyang":"隆阳", "longling":"龙陵",
    "shidian":"施甸", "changning":"昌宁", "longling":"龙陵", "tengchong":"腾冲",
    "ruili":"瑞丽", "longchuan":"陇川", "yingjiang":"盈江", "lianghe":"梁河",
    "lushui":"泸水", "fugong":"福贡", "gongshan":"贡山", "lanping":"兰坪",
    "chuxiong":"楚雄", "lufeng":"禄丰", "shuangbai":"双柏", "mouding":"牟定",
    "na":""  // 占位
  };

  // 常见错别字 → 正确
  var TYPO = {
    "大里":"大理", "大荔":"大理", "理里":"大理",
    "版那":"版纳", "版讷":"版纳", "西双版纳":"西双版纳",
    "香格里": "香格里拉", "香格里纳":"香格里拉", "中甸":"中甸",
    "丽江山":"丽江", "丽江古":"丽江",
    "昆民":"昆明", "昆鸣":"昆明",
    "普耳":"普洱", "普而":"普洱",
    "腾充":"腾冲", "滕冲":"腾冲",
    "芒市":"芒市", "盲市":"芒市",
    "德宏":"德宏", "德红":"德宏",
    "红和":"红河", "河红":"红河",
    "玉夕":"玉溪", "欲溪":"玉溪",
    "曲静":"曲靖", "曲清":"曲靖",
    "昭捅":"昭通", "召通":"昭通",
    "怒讲":"怒江", "怒工":"怒江",
    "临仓":"临沧", "林仓":"临沧",
    "文三":"文山", "门山":"文山",
    "楚熊":"楚雄", "出雄":"楚雄"
  };

  var HOT = ["避寒","退休养老","大理","西双版纳","高反","温泉","体验包价格","管家服务","接站","第一次去云南"];
  var HIST_KEY = "yn_search_history";

  var box = document.createElement('div');
  box.style.cssText = 'position:fixed;top:72px;right:20px;z-index:9999;width:340px;font-family:inherit;';
  box.innerHTML = '<div style="position:relative;"><input id="site-search" type="text" placeholder="搜索（按 / 快速聚焦）" style="width:100%;padding:.6rem .9rem;padding-right:2.2rem;border:1px solid #B5C9A8;border-radius:20px;font-size:.9rem;background:#FFF7EC;outline:none;box-shadow:0 4px 16px rgba(0,0,0,.1);box-sizing:border-box;"><span id="site-clear" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);cursor:pointer;color:#999;display:none;">×</span></div>'
    + '<div id="site-results" style="display:none;margin-top:.4rem;background:#fff;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,.15);max-height:480px;overflow-y:auto;"></div>';
  document.body.appendChild(box);

  var input = box.querySelector('#site-search');
  var results = box.querySelector('#site-results');
  var clearBtn = box.querySelector('#site-clear');
  var debounce = null;

  // 快捷键：按 / 聚焦搜索
  document.addEventListener('keydown', function(e){
    if(e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA'){
      e.preventDefault();
      input.focus();
      input.select();
    }
    if(e.key === 'Escape'){ input.blur(); results.style.display='none'; }
  });

  function getHistory(){
    try { return JSON.parse(localStorage.getItem(HIST_KEY) || '[]'); } catch(e){ return []; }
  }
  function saveHistory(q){
    var h = getHistory().filter(function(x){ return x !== q; });
    h.unshift(q);
    h = h.slice(0,6);
    try { localStorage.setItem(HIST_KEY, JSON.stringify(h)); } catch(e){}
  }

  function fixTypo(q){
    // 常见错别字纠正
    Object.keys(TYPO).forEach(function(t){
      if(q.indexOf(t) >= 0){ q = q.replace(t, TYPO[t]); }
    });
    return q;
  }

  function expand(q){
    q = fixTypo(q);
    var terms = [q.toLowerCase()];
    Object.keys(SYN).forEach(function(k){
      if(q.toLowerCase().indexOf(k) >= 0) terms.push(SYN[k]);
    });
    Object.keys(PY).forEach(function(k){
      if(q.toLowerCase() === k || q.toLowerCase().indexOf(k) === 0) terms.push(PY[k]);
    });
    return {q:q, exp:terms.join(' ')};
  }

  function highlight(text, q){
    if(!q) return text;
    var safe = q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    return text.replace(new RegExp('('+safe+')','gi'), '<mark style="background:#FFD8A8;padding:0 2px;border-radius:2px;">$1</mark>');
  }

  function groupHits(hits){
    var groups = {地州:[], 服务:[], 其他:[]};
    hits.forEach(function(h){ groups[h.g].push(h); });
    return groups;
  }

  function renderHits(hits, q){
    var g = groupHits(hits);
    var html = '';
    var order = ['地州','服务','其他'];
    var labels = {地州:'📍 地州', 服务:'🛠 服务', 其他:'📄 其他'};
    order.forEach(function(gn){
      if(!g[gn].length) return;
      html += '<div style="padding:.5rem .9rem .2rem;color:#888;font-size:.75rem;background:#FAF8F3;">'+labels[gn]+'</div>';
      html += g[gn].map(function(it){
        return '<a href="./'+it.u+'" style="display:block;padding:.5rem .9rem;color:#333;text-decoration:none;border-bottom:1px solid #f0f0f0;font-size:.9rem;">'
          + highlight(it.t, q) + '<br><span style="color:#888;font-size:.78rem;">'+highlight(it.k, q)+'</span></a>';
      }).join('');
    });
    return html;
  }

  function showHome(){
    var h = getHistory();
    var html = '';
    if(h.length){
      html += '<div style="padding:.4rem .9rem;color:#888;font-size:.75rem;">最近搜索 <span style="float:right;cursor:pointer;color:#bbb;" id="site-clear-h">清空</span></div>';
      html += '<div style="padding:.2rem .5rem .5rem;">';
      html += h.map(function(w){return '<span style="display:inline-block;margin:.2rem;border:1px solid #ddd;padding:.2rem .7rem;border-radius:12px;font-size:.8rem;cursor:pointer;color:#555;" class="hist">'+w+'</span>';}).join('');
      html += '</div>';
    }
    html += '<div style="padding:.4rem .9rem;color:#888;font-size:.75rem;">热门搜索</div>';
    html += '<div style="padding:.2rem .5rem .6rem;">';
    html += HOT.map(function(w){return '<span style="display:inline-block;margin:.2rem .3rem;padding:.2rem .7rem;background:#F5EFE0;border-radius:12px;font-size:.8rem;cursor:pointer;color:#333;" class="hot">'+w+'</span>';}).join('');
    html += '</div>';
    results.innerHTML = html;
    results.style.display = 'block';
    results.querySelectorAll('.hot, .hist').forEach(function(el){
      el.addEventListener('click', function(){
        input.value = el.textContent;
        clearBtn.style.display='block';
        doSearch();
      });
    });
    var ch = document.getElementById('site-clear-h');
    if(ch) ch.addEventListener('click', function(){
      try{ localStorage.removeItem(HIST_KEY); }catch(e){}
      showHome();
    });
  }

  function doSearch(){
    var q = input.value.trim();
    if(!q){ showHome(); return; }
    var r = expand(q);
    var ql = r.q.toLowerCase();
    var hits = INDEX.filter(function(it){
      var hay = (it.t + ' ' + it.k).toLowerCase();
      if(hay.indexOf(ql) >= 0) return true;
      return r.exp.toLowerCase().split(/\s+/).some(function(t){ return t && hay.indexOf(t) >= 0; });
    });
    if(!hits.length){
      results.innerHTML = '<div style="padding:.8rem;color:#888;font-size:.85rem;">没找到「'+input.value+'」<br><span style="font-size:.78rem;">试试：大理、避寒、退休、多少钱、高反、温泉</span></div>';
    } else {
      results.innerHTML = renderHits(hits.slice(0,12), r.q);
      saveHistory(r.q);
    }
    results.style.display = 'block';
  }

  input.addEventListener('focus', function(){
    if(!input.value) showHome();
  });
  input.addEventListener('input', function(){
    clearBtn.style.display = input.value ? 'block' : 'none';
    clearTimeout(debounce);
    debounce = setTimeout(doSearch, 120);
  });
  input.addEventListener('keydown', function(e){
    if(e.key === 'Enter'){
      // 跳到第一个结果
      var first = results.querySelector('a');
      if(first) window.location.href = first.getAttribute('href');
    }
  });
  clearBtn.addEventListener('click', function(){
    input.value=''; results.style.display='none'; clearBtn.style.display='none'; input.focus();
  });
  document.addEventListener('click', function(e){
    if(!box.contains(e.target)) results.style.display='none';
  });
})();
