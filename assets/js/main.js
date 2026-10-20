/* ============================================================
   云暖・旅居 · 共享脚本 v2
   职责：移动菜单、体验包组合器、联系表单、FAQ 手风琴、
        悬浮咨询条（电话 + 意向弹窗 + 返回顶部）、平滑滚动。
   数据忠实于品牌站内容；新增交互均为本地展示。
   ============================================================ */
(function(){
  "use strict";
  var $ = function(s, el){ return (el || document).querySelector(s); };
  var $$ = function(s, el){ return Array.prototype.slice.call((el||document).querySelectorAll(s)); };

  /* ---------- 平滑滚动 ---------- */
  document.documentElement.style.scrollBehavior = "smooth";

  /* ---------- 移动菜单 ---------- */
  var toggle = $(".nav-toggle");
  var nav = $("#site-nav");
  var closeBtn = $(".nav-close");
  var openNav = function(){ if(nav){ nav.classList.add("is-open"); } if(toggle){ toggle.setAttribute("aria-expanded","true"); } };
  var closeNav = function(){ if(nav){ nav.classList.remove("is-open"); } if(toggle){ toggle.setAttribute("aria-expanded","false"); } };
  if(toggle && nav){
    toggle.addEventListener("click", function(){ nav.classList.contains("is-open") ? closeNav() : openNav(); });
  }
  if(closeBtn){ closeBtn.addEventListener("click", closeNav); }
  document.addEventListener("click", function(e){
    if(nav && nav.classList.contains("is-open") && !e.target.closest(".site-nav") && !e.target.closest(".nav-toggle")) closeNav();
  });
  $$("[data-nav]").forEach(function(a){ a.addEventListener("click", closeNav); });

  /* ---------- 返回顶部 ---------- */
  var backTop = $("#back-top");
  if(backTop){
    var show = function(){ backTop.classList.toggle("is-on", window.scrollY > 480); };
    window.addEventListener("scroll", show, {passive:true}); show();
    backTop.addEventListener("click", function(){ window.scrollTo({top:0, behavior:"smooth"}); });
  }

  /* ---------- 意向弹窗（全站悬浮咨询条） ---------- */
  var leadBtn = $("#cta-lead");
  var leadModal = $("#lead-modal");
  if(leadBtn && leadModal){
    var openLead = function(){ leadModal.hidden = false; leadModal.classList.add("is-open"); document.body.style.overflow = "hidden"; var f=$("#lead-form"); if(f){ var n=f.querySelector("[name=lead-name]"); if(n){ try{n.focus();}catch(_){} } } };
    var closeLead = function(){ leadModal.classList.remove("is-open"); leadModal.hidden = true; document.body.style.overflow = ""; };
    leadBtn.addEventListener("click", openLead);
    var leadClose = $("#lead-close");
    if(leadClose){ leadClose.addEventListener("click", closeLead); }
    leadModal.addEventListener("click", function(e){ if(e.target === leadModal) closeLead(); });
    document.addEventListener("keydown", function(e){ if(e.key === "Escape") closeLead(); });
    var leadForm = $("#lead-form");
    if(leadForm){
      leadForm.addEventListener("submit", function(e){
        e.preventDefault();
        var name = leadForm.querySelector("[name=lead-name]").value.trim();
        var contact = leadForm.querySelector("[name=lead-contact]").value.trim();
        if(!name || !contact) return;
        var ok = $("#lead-ok");
        if(ok){ ok.hidden = false; }
        leadForm.querySelector("button[type=submit]").disabled = true;
      });
    }
  }

  /* ---------- FAQ 手风琴 ---------- */
  $$(".faq-item").forEach(function(item){
    var btn = item.querySelector("h3 button");
    if(!btn) return;
    var a = item.querySelector(".faq-a");
    btn.addEventListener("click", function(){
      var isOpen = item.classList.contains("is-open");
      $$(".faq-item.is-open").forEach(function(o){ o.classList.remove("is-open"); var ob=o.querySelector("h3 button"); if(ob) ob.setAttribute("aria-expanded","false"); var oa=o.querySelector(".faq-a"); if(oa) oa.style.maxHeight = null; });
      if(!isOpen){ item.classList.add("is-open"); btn.setAttribute("aria-expanded","true"); if(a){ a.style.maxHeight = a.scrollHeight + "px"; } }
    });
  });

  /* ---------- 体验包 · 组合器（16 州勾选 + 人数/日期 → 生成定制方案详情页） ---------- */
  var pickTags = $("#pick-tags");
  if(pickTags){
    var STATE_META = {
      diqing:["迪庆","香格里拉的静谧高处"], nujiang:["怒江","三江并流的峡谷人家"], lijiang:["丽江","古城与雪山的对望"],
      dali:["大理","苍山洱海之间"], baoshan:["保山","腾冲的温泉与古镇"], dehong:["德宏","边境线上的傣乡"],
      lincang:["临沧","佤乡与茶山"], puer:["普洱","茶山雾里的栖居"], xishuangbanna:["西双版纳","北回归线的雨林"],
      chuxiong:["楚雄","彝州的山川旧事"], kunming:["昆明","春城的晨昏"], yuxi:["玉溪","高原湖群的光"],
      qujing:["曲靖","珠江源头的辽阔"], zhaotong:["昭通","乌蒙山的云上人家"], honghe:["红河","元阳梯田的晨雾"], wenshan:["文山","喀斯特的山水"] };
    var LIFE_THEMES = [
      ["菜市场日","跟管家认摊、买当季菜，回来做一顿家常饭。"],
      ["朋友家饭局日","去本地人家做客，吃一顿真正的家常饭。"],
      ["温泉日","把高原的风泡进身体里，慢慢待一下午。"],
      ["非遗工坊日","白族扎染、纳西东巴、藏地手作——学一样带回家。"],
      ["自由日","晨光与风都是你的，管家不安排，随时能找到人。"]
    ];
    var picks = {}, dur = "7", stay = "民宿（一室一厅一厨一卫）", exps = {}, svcs = {};
    var resultBox = $("#composer-result");
    var durTags = $("#dur-tags");
    var generateBtn = $("#composer-generate");
    var paxSel = $("#inp-pax");
    var startInp = $("#inp-start");
    var stayTags = $("#stay-tags"), expTags = $("#exp-tags"), svcTags = $("#svc-tags");
    function chosen(obj){ return Object.keys(obj).filter(function(k){return obj[k];}); }
    function addDays(s, n){ if(!s) return "待定"; var d=new Date(s+"T00:00:00"); d.setDate(d.getDate()+n); var y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,"0"),dd=String(d.getDate()).padStart(2,"0"); return y+"-"+m+"-"+dd; }
    function renderPlan(){
      var ids = Object.keys(picks);
      if(!resultBox) return;
      if(!ids.length){ resultBox.classList.remove("is-show"); resultBox.innerHTML=""; return; }
      var per = parseInt(dur,10), total = ids.length*per;
      var pax = paxSel ? paxSel.value : "2 人";
      var start = startInp ? startInp.value : "";
      var rhythm = per===7?"一周节奏":per===15?"半月节奏":"深度节奏";
      var expList = chosen(exps), svcList = chosen(svcs);
      var dayNo=1, ti=0, daysHtml=[];
      ids.forEach(function(id, si){
        var m = STATE_META[id]||[id,""];
        for(var k=0;k<per;k++){
          var kind,title,desc;
          if(si===0&&k===0){ kind="安顿日"; title="抵达"+m[0]+" · 生活接入"; desc="管家完成「生活接入」：接站入住、家电讲解、认菜市/医院/药店的路，见管家与邻居——当天不安排任何景点。"; }
          else if(k===0){ kind="转场日"; title="转场至"+m[0]; desc="上午动车，下午安顿；下一站管家已备好入住与生活地图，行李与就医档案随行交接。转场本身是景观路。"; }
          else { var t=LIFE_THEMES[ti%LIFE_THEMES.length]; ti++; kind=t[0]; title=m[0]+" · "+t[0]; desc=t[1]; }
          daysHtml.push('<li class="pd-day"><span class="pd-no">Day'+dayNo+'</span><div class="pd-body"><span class="pd-kind">'+kind+'</span><h5>'+title+'</h5><p>'+desc+'</p></div></li>');
          dayNo++;
        }
      });
      var feats = ids.map(function(id){ var m=STATE_META[id]||[id,""]; return '<li><b>'+m[0]+'</b> · '+m[1]+'</li>'; }).join("");
      // 住宿板块
      var stayHtml = '<li>全程住 <b>'+stay+'</b>，一地一处，随住随停；房型与朝向按你的人数与偏好预留。</li>' +
        '<li>每州固定一处居所，不换房、不挪行李；管家提前完成清扫与生活物资配齐。</li>';
      // 体验板块
      var expDesc = {
        "温泉":"：跟本地管家去真正的温泉池，不是景点，是本地人泡汤的地方。",
        "赶街":"：跟管家赶本地乡街，看当季物产，吃路边摊，买新鲜菌子和野菜。",
        "灶间":"：跟本地阿姨学做一道云南家常菜，从择菜到端上桌。",
        "家宴":"：去本地人家做客，吃一顿真正的家常饭，不是饭店是家。",
        "茶事":"：去茶山走一走，看古树、喝头道茶，跟茶农聊一年的茶事。",
        "识菌":"：雨季跟本地向导进山识菌，哪些能吃哪些不能，回来端上桌。",
        "观鸟":"：跟着观鸟向导走清晨的林子，认识本地花草和鸟。",
        "山径":"：选一段平缓的山间步道慢慢走，不赶时间，走到哪算哪。",
        "听雨":"：找个能听见雨的茶室坐一下午，泡一壶本地茶。"
      };
      var expHtml = expList.length
        ? expList.map(function(e){ return '<li><b>'+e+'</b>'+ (expDesc[e] || '：慢慢体验当地日常。') +'</li>'; }).join("")
        : '<li>不特别安排体验项目，日子由你自己过；管家随时能接，不打扰。</li>';
      // 服务板块
      var svcRows = {
        "健康监测":"每日血压/血氧记录并同步家属；本地就医绿色通道对接。",
        "护理护工保姆":"按需安排住家护理/护工/保姆，服务清单与频率写入合同。",
        "车辆接驳":"板块内车辆接驳固定预约，换车与接送不临时等。",
        "安神助眠包":"入住房内配香包、泡脚包等助眠物资，按需补给。",
        "起居管家":"一名在地起居管家，日常 2 小时到场、应急 24 小时电话在线。"
      };
      var svcHtml = svcList.length
        ? svcList.map(function(s){ return '<li><b>'+s+'</b> —— '+svcRows[s]+'</li>'; }).join("")
        : '<li>基础起居管家与就医陪诊已含；增值项未选则不额外收费。</li>';
      resultBox.classList.add("is-show");
      resultBox.innerHTML =
        '<div class="plan-doc">' +
          '<div class="plan-hero"><span class="plan-badge">1V1 旅居定制 · 方案草稿</span>' +
          '<h3>'+ids.length+' 地州 · '+total+' 天旅居方案</h3>' +
          '<p class="plan-price">价格 · 私人定制（签约前出具书面报价）</p></div>' +
          '<div class="plan-meta">' +
            '<div class="pm"><span>出游人数</span><b>'+pax+'</b></div>' +
            '<div class="pm"><span>每州停留</span><b>'+per+' 天</b></div>' +
            '<div class="pm"><span>出发日期</span><b>'+(start||"待定")+'</b></div>' +
            '<div class="pm"><span>结束日期</span><b>'+addDays(start,total-1)+'</b></div>' +
          '</div>' +
          '<div class="plan-section"><h4>线路特色</h4><ul class="plan-feats">'+feats+'</ul></div>' +
          '<div class="plan-section"><h4>住宿安排</h4><ul class="plan-fees">'+stayHtml+'</ul></div>' +
          '<div class="plan-section"><h4>每日行程（示意）</h4><ol class="plan-days">'+daysHtml.join("")+'</ol>' +
          '<p class="plan-note">以上为节奏示意（'+rhythm+'），具体每天安排由管家按季节、天气与你的体力逐日敲定。</p></div>' +
          '<div class="plan-section"><h4>体验安排</h4><ul class="plan-fees">'+expHtml+'</ul></div>' +
          '<div class="plan-section"><h4>在地服务</h4><ul class="plan-fees">'+svcHtml+'</ul></div>' +
          '<div class="plan-section"><h4>费用包含</h4><ul class="plan-fees">' +
            '<li>所列住宿、每日一件生活主题、起居管家服务、板块内短程转场接驳；</li>' +
            '<li>已勾选的体验项目与增值服务（健康监测/护理/车辆/助眠包等）；</li>' +
            '<li>旅游意外险（含医疗）及本地就医对接；总价含所列税费。</li>' +
          '</ul></div>' +
          '<div class="plan-section"><h4>费用不含</h4><ul class="plan-fees">' +
            '<li>往返大交通（机票/火车）不安排、不含；</li>' +
            '<li>个人消费、自由日餐饮与自选升级项目；</li>' +
            '<li>未在方案中勾选的增值服务。</li>' +
          '</ul></div>' +
          '<div class="plan-section"><h4>免责条款</h4><ul class="plan-fees">' +
            '<li>本页为按你勾选生成的示意草稿，非最终合同；具体以签约前出具的书面报价与合同为准；</li>' +
            '<li>每日行程为节奏示意，管家按季节、天气与体力调整；</li>' +
            '<li>服务频率与交付标准以合同逐项约定、可勾选可验收。</li>' +
          '</ul></div>' +
          '<div class="plan-cta"><a class="btn btn--earthen" href="./contact.html" data-nav>把这份方案发给管家</a>' +
          '<a class="btn btn--ink" href="tel:13208888618">直接拨打电话</a></div>' +
        '</div>';
    }
    pickTags.addEventListener("click", function(e){
      var btn = e.target.closest(".tag-btn"); if(!btn) return;
      var id = btn.getAttribute("data-id");
      if(picks[id]){ delete picks[id]; btn.classList.remove("is-on"); btn.setAttribute("aria-pressed","false"); }
      else { picks[id] = true; btn.classList.add("is-on"); btn.setAttribute("aria-pressed","true"); }
      updateLive();
    });
    var liveBox = $("#composer-live");
    function updateLive(){
      if(!liveBox) return;
      var ids = Object.keys(picks);
      if(!ids.length){
        liveBox.innerHTML = '选几个想去的地方，每地住几天，实时算给你看。';
        return;
      }
      var per = parseInt(dur,10), total = ids.length*per;
      var names = ids.map(function(id){ return STATE_META[id][0]; }).join("、");
      liveBox.innerHTML = '已选 <b style="color:var(--earthen-deep);">'+ids.length+'</b> 个地方（'+names+'）· 每地 <b style="color:var(--earthen-deep);">'+per+'</b> 天 · 全程约 <b style="color:var(--earthen-deep);">'+total+'</b> 天';
    }
    if(durTags){
      durTags.addEventListener("click", function(e){
        var btn = e.target.closest(".tag-btn"); if(!btn || !btn.getAttribute("data-dur")) return;
        dur = btn.getAttribute("data-dur");
        $$(".tag-btn", durTags).forEach(function(b){ b.classList.toggle("is-on", b === btn); });
        updateLive();
      });
    }
    if(stayTags){
      stayTags.addEventListener("click", function(e){
        var btn = e.target.closest(".tag-btn"); if(!btn || !btn.getAttribute("data-stay")) return;
        stay = btn.getAttribute("data-stay");
        $$(".tag-btn", stayTags).forEach(function(b){ b.classList.toggle("is-on", b === btn); b.setAttribute("aria-pressed", b === btn ? "true":"false"); });
      });
    }
    function bindMulti(container, store){
      if(!container) return;
      container.addEventListener("click", function(e){
        var btn = e.target.closest(".tag-btn"); if(!btn) return;
        var key = btn.getAttribute("data-exp") || btn.getAttribute("data-svc"); if(!key) return;
        if(store[key]){ delete store[key]; btn.classList.remove("is-on"); btn.setAttribute("aria-pressed","false"); }
        else { store[key] = true; btn.classList.add("is-on"); btn.setAttribute("aria-pressed","true"); }
      });
    }
    bindMulti(expTags, exps); bindMulti(svcTags, svcs);
    if(generateBtn){ generateBtn.addEventListener("click", renderPlan); }
    if(startInp){ startInp.addEventListener("change", function(){ if(resultBox.classList.contains("is-show")) renderPlan(); }); }
    var clearBtn = $("#composer-clear");
    if(clearBtn){
      clearBtn.addEventListener("click", function(){
        picks = {}; exps = {}; svcs = {}; stay = "民宿（一室一厅一厨一卫）";
        $$(".tag-btn", pickTags).forEach(function(b){ b.classList.remove("is-on"); b.setAttribute("aria-pressed","false"); });
        $$(".tag-btn", expTags).forEach(function(b){ b.classList.remove("is-on"); b.setAttribute("aria-pressed","false"); });
        $$(".tag-btn", svcTags).forEach(function(b){ b.classList.remove("is-on"); b.setAttribute("aria-pressed","false"); });
        updateLive();
        renderPlan();
      });
    }
  }

  /* ---------- 联系 · 表单提交反馈 ---------- */
  var form = $("#contact-form");
  if(form){
    form.addEventListener("submit", function(e){
      e.preventDefault();
      var name = ($("#f-name") || {}).value || "";
      var contact = ($("#f-contact") || {}).value || "";
      if(!name.trim() || !contact.trim()) return;
      var sent = $("#form-sent");
      if(sent){ sent.classList.add("is-show"); }
      var btn = form.querySelector("button[type=submit]");
      if(btn){ btn.disabled = true; btn.textContent = "已提交"; }
      try{ form.reset(); }catch(_){}
    });
  }
})();

/* Hero 背景轮播 */
(function(){
  var slides = document.querySelectorAll('.hero-carousel .hero-media');
  if(slides.length < 2) return;
  var idx = 0;
  setInterval(function(){
    slides[idx].classList.remove('is-active');
    idx = (idx + 1) % slides.length;
    slides[idx].classList.add('is-active');
  }, 4500);
})();
