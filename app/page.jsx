export default function Home() {
  const [lang, setLang] = (typeof window !== 'undefined' && window.__lang) ? window.__lang : (typeof window !== 'undefined' ? (window.__lang = ['zh','en','ja']) : ['zh','en','ja']);
  const [cl, setCl] = (typeof window !== 'undefined' && window.__checked) ? window.__checked : (typeof window !== 'undefined' ? (window.__checked = [0,1]) : [0,1]);
  const t = {
    zh:{nav:['服务','路线','旅居','套餐','手记'], title:'云居·Yunnan Living', sub:'云南·慢下来住一阵子', h1:'云游 我们陪你住成生活', p:'不赶景点。昆明花落碗里，大理风进院子，普洱的茶香替你醒早晨。', btn1:'看看怎么住', btn2:'找定制师聊聊', whatWeDo:'我们做的事', s1t:'挑院子', s1d:'不是连锁酒店，是能晾衣服、能发呆的真实院子。', s2t:'排日子', s2d:'勾几天，右边就长出一份像手账的行程。', s3t:'接世界来客', s3d:'翻译跟着走，外国朋友落地也不慌。', planTitle:'勾几天，住哪里', days:['第一天·昆明','第二天·大理','第三天·丽江','第四天·普洱','第五天·回程'], summary:'已勾 {n} 段日子', item:'· {day}', save:'存成我的手账', footer:'云居·Yunnan Living 慢游旅居'},
    en:{nav:['Service','Routes','Stay','Packages','Journal'], title:'Yunnan Living', sub:'Yunnan · Slow down and stay', h1:'Travel Yunnan, Live Like Locals', p:"No rush. Flowers in Kunming, wind in Dali, tea in Pu'er wakes your morning.", btn1:'See How', btn2:'Chat with Planner', whatWeDo:'What We Do', s1t:'Real Courtyards', s1d:'Not chain hotels. Real homes to hang clothes and daydream.', s2t:'Plan Days', s2d:'Check days, get a journal-style itinerary.', s3t:'Global Guests', s3d:'Translation support, no panic on landing.', planTitle:'Pick Days & Stays', days:['Day1 Kunming','Day2 Dali','Day3 Lijiang','Day4 Pu\'er','Day5 Return'], summary:'{n} days picked', item:'· {day}', save:'Save My Journal', footer:'Yunnan Living Slow Travel'},
    ja:{nav:['サービス','ルート','滞在','プラン','手記'], title:'雲居・Yunnan Living', sub:'雲南・ゆっくり暮らす', h1:'雲南旅、暮らすように泊まる', p:'急がない。昆明の花、大理の風、普洱の茶で朝を迎える。', btn1:'見方を見る', btn2:'相談する', whatWeDo:'私たちのこと', s1t:'庭先を選ぶ', s1d:'チェーンホテルではなく、洗濯物を干せる本当の家。', s2t:'日数を決める', s2d:'日付をチェックすると、手帳のような旅程に。', s3t:'世界からの客', s3d:'通訳同行、海外の方も安心。', planTitle:'何日、どこに泊まる', days:['1日目 昆明','2日目 大理','3日目 麗江','4日目 普洱','5日目 帰路'], summary:'{n} 日選択済', item:'・{day}', save:'手帳に保存', footer:'雲居・Yunnan Living'}
  }[lang];
  const toggle = i => { const n=[...cl]; n.includes(i)?n.splice(n.indexOf(i),1):n.push(i); window.__checked=n; setCl(n); };
  const switchLang = l => { window.__lang=l; setLang(l); };
  return (
    <div style={{fontFamily:"-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background:'#f7f7f2', color:'#1b3a2d'}}>
      <header style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'24px 40px', background:'rgba(255,255,255,0.9)', position:'sticky', top:0, zIndex:10}}>
        <div style={{fontSize:24, fontWeight:700}}>{t.title}</div>
        <nav style={{display:'flex', gap:32, fontSize:15}}>{t.nav.map((n,i)=><a key={i} href="#" style={{color:'inherit', textDecoration:'none'}}>{n}</a>)}</nav>
        <select value={lang} onChange={e=>switchLang(e.target.value)} style={{padding:'8px 12px', borderRadius:20, border:'1px solid #1b3a2d', background:'#1b3a2d', color:'#fff'}}>
          <option value="zh">🇨🇳 中文</option><option value="en">🇬🇧 English</option><option value="ja">🇯🇵 日本語</option>
        </select>
      </header>
      <section style={{position:'relative', height:600, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', color:'#fff', background:'linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.4)), url(https://images.unsplash.com/photo-1528127269322-539801943592) center/cover'}}>
        <p style={{fontSize:21, letterSpacing:4, marginBottom:20}}>{t.sub}</p>
        <h1 style={{fontSize:64, fontWeight:700, textAlign:'center', lineHeight:1.2, margin:0, textShadow:'0 4px 20px rgba(0,0,0,0.3)'}}>{t.h1}</h1>
        <p style={{fontSize:18, marginTop:24, maxWidth:800, textAlign:'center', textShadow:'0 2px 10px rgba(0,0,0,0.3)'}}>{t.p}</p>
        <div style={{marginTop:40, display:'flex', gap:16}}>
          <button style={{padding:'14px 32px', borderRadius:30, border:'1px solid #fff', background:'transparent', color:'#fff', fontSize:16, cursor:'pointer'}}>{t.btn1}</button>
          <button style={{padding:'14px 32px', borderRadius:30, border:'none', background:'#b65a2c', color:'#fff', fontSize:16, cursor:'pointer'}}>{t.btn2}</button>
        </div>
      </section>
      <section style={{padding:'80px 40px', maxWidth:1000, margin:'0 auto'}}>
        <h2 style={{textAlign:'center', fontSize:36, marginBottom:60}}>{t.whatWeDo}</h2>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px,1fr))', gap:40}}>
          {[{ti:t.s1t, de:t.s1d},{ti:t.s2t, de:t.s2d},{ti:t.s3t, de:t.s3d}].map((s,i)=>(<div key={i} style={{background:'#fff', borderRadius:20, padding:32, boxShadow:'0 4px 20px rgba(0,0,0,0.03)'}}><h3 style={{fontSize:22, marginBottom:12}}>{s.ti}</h3><p style={{color:'#555', fontSize:15, lineHeight:1.6}}>{s.de}</p></div>))}
        </div>
      </section>
      <section style={{padding:'40px 40px 80px', maxWidth:1000, margin:'0 auto', display:'flex', gap:40, flexWrap:'wrap'}}>
        <div style={{flex:1, minWidth:300}}>
          <h2 style={{fontSize:32, marginBottom:24}}>{t.planTitle}</h2>
          <div style={{display:'flex', flexDirection:'column', gap:12}}>
            {t.days.map((d,i)=>(<label key={i} onClick={()=>toggle(i)} style={{display:'flex', alignItems:'center', gap:12, padding:'14px 18px', background: cl.includes(i)?'#e8f0e6':'#f0f0e8', borderRadius:14, cursor:'pointer', fontSize:16}}><input type="checkbox" checked={cl.includes(i)} onChange={()=>toggle(i)} style={{width:18,height:18}} /> {d}</label>))}
          </div>
        </div>
        <div style={{width:320, background:'#1b3a2d', color:'#fff', borderRadius:20, padding:32, alignSelf:'flex-start'}}>
          <div style={{fontSize:15, opacity:0.9, marginBottom:20}}>{t.summary.replace('{n}', cl.length)}</div>
          <ul style={{listStyle:'none', padding:0, margin:0, fontSize:16, lineHeight:2}}>{cl.map(i=><li key={i}>{t.item.replace('{day}', t.days[i])}</li>)}</ul>
          <button style={{marginTop:32, width:'100%', padding:'14px', borderRadius:30, border:'none', background:'#b65a2c', color:'#fff', fontSize:16, cursor:'pointer'}}>{t.save}</button>
        </div>
      </section>
      <footer style={{textAlign:'center', padding:'40px 20px', color:'#86868b', fontSize:13}}><p>{t.footer} © {new Date().getFullYear()}</p></footer>
    </div>
  );
}
