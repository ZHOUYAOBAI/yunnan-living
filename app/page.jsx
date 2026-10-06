"use client";
import { useState } from 'react';

const dict = {
  zh: {
    nav: ["服务","路线","旅居","套餐","手记"], lang:"中文", brand:"云居 · Yunnan Living",
    sub:"云南 · 慢下来住一阵子", main:"云难游 我们陪你住成生活",
    desc:"不赶景点。昆明花落碗里，大理风进院子，普洱的茶香替你醒早晨。",
    btn1:"看看怎么住", btn2:"找定制师聊聊", whatWeDo:"我们做的事",
    s1t:"挑院子", s1d:"不是连锁酒店，是能晾衣服、能发呆的真实院子。",
    s2t:"排日子", s2d:"勾几天，右边就长出一份像手账的行程。",
    s3t:"接世界来客", s3d:"翻译跟着走，外国朋友落地也不慌。",
    planTitle:"勾几天，住哪里",
    days:["第一天 · 昆明","第二天 · 大理","第三天 · 丽江","第四天 · 普洱","第五天 · 回程"],
    summary:"已勾 {n} 段日子", item:"· {day}", save:"存成我的手账", footer:"云居 · Yunnan Living"
  },
  en: {
    nav: ["Service","Routes","Stay","Plans","Notes"], lang:"EN", brand:"Yunnan Living",
    sub:"Yunnan · Slow down and stay a while", main:"Yunnan Trip, Live Like a Local",
    desc:"No rush. Flowers in Kunming, wind in Dali, tea wakes you in Pu'er.",
    btn1:"See Stays", btn2:"Chat Concierge", whatWeDo:"What We Do",
    s1t:"Real Courtyards", s1d:"Not chain hotels. Real yards to hang clothes and daydream.",
    s2t:"Plan Days", s2d:"Tick days, get a journal-style itinerary.",
    s3t:"Global Guests", s3d:"Translator included, no stress on arrival.",
    planTitle:"Pick Days & Stays",
    days:["Day 1 · Kunming","Day 2 · Dali","Day 3 · Lijiang","Day 4 · Pu'er","Day 5 · Return"],
    summary:"{n} days picked", item:"· {day}", save:"Save My Journal", footer:"Yunnan Living"
  }
};

export default function Home() {
  const [lang, setLang] = useState('zh');
  const [sel, setSel] = useState([0,1]);
  const t = dict[lang];

  const toggle = (i) => setSel(sel.includes(i) ? sel.filter(x=>x!==i) : [...sel, i]);

  return (
    <div style={{fontFamily:"-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background:'#f7f7f2', color:'#1b3a2d'}}>
      <header style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'24px 40px', background:'rgba(247,247,242,0.95)', position:'sticky', top:0, zIndex:10}}>
        <div style={{fontSize:22, fontWeight:700}}>{t.brand}</div>
        <nav style={{display:'flex', gap:32, fontSize:16}}>{t.nav.map((n,i)=><span key={i} style={{cursor:'pointer'}}>{n}</span>)}</nav>
        <select value={lang} onChange={e=>setLang(e.target.value)} style={{padding:'8px 14px', borderRadius:20, border:'1px solid #1b3a2d', background:'#1b3a2d', color:'#fff', fontSize:14, cursor:'pointer'}}>
          <option value="zh">🇨🇳 {t.lang}</option><option value="en">🇬🇧 EN</option>
        </select>
      </header>

      <section style={{position:'relative', height:680, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', color:'#fff', background:'linear-gradient(rgba(0,0,0,0.25),rgba(0,0,0,0.45)), url(https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=80) center/cover'}}>
        <p style={{fontSize:21, letterSpacing:2, marginBottom:16}}>{t.sub}</p>
        <h1 style={{fontSize:48, fontWeight:700, textAlign:'center', lineHeight:1.2, margin:0}}>{t.main}</h1>
        <p style={{fontSize:17, maxWidth:760, textAlign:'center', marginTop:24, opacity:0.95}}>{t.desc}</p>
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
            {t.days.map((d,i)=>(<label key={i} onClick={()=>toggle(i)} style={{display:'flex', alignItems:'center', gap:12, padding:'14px 18px', background: sel.includes(i)?'#e8f0e6':'#f0f0e8', borderRadius:14, cursor:'pointer', fontSize:16}}><input type="checkbox" checked={sel.includes(i)} onChange={()=>toggle(i)} style={{width:18,height:18}} /> {d}</label>))}
          </div>
        </div>
        <div style={{width:320, background:'#1b3a2d', color:'#fff', borderRadius:20, padding:32, alignSelf:'flex-start'}}>
          <div style={{fontSize:15, opacity:0.9, marginBottom:20}}>{t.summary.replace('{n}', sel.length)}</div>
          <ul style={{listStyle:'none', padding:0, margin:0, fontSize:16, lineHeight:2}}>{sel.map(i=><li key={i}>{t.item.replace('{day}', t.days[i])}</li>)}</ul>
          <button style={{marginTop:32, width:'100%', padding:'14px', borderRadius:30, border:'none', background:'#b65a2c', color:'#fff', fontSize:16, cursor:'pointer'}}>{t.save}</button>
        </div>
      </section>

      <footer style={{textAlign:'center', padding:'40px 20px', color:'#86868b', fontSize:13}}><p>{t.footer} © {new Date().getFullYear()}</p></footer>
    </div>
  );
}
