function switchTab(tier){
  document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active',t.dataset.tier===tier));
  document.querySelectorAll('.tab-content').forEach(c=>c.classList.toggle('active',c.dataset.tier===tier));
}
document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.tab').forEach(t=>t.onclick=()=>switchTab(t.dataset.tier));
  const f=document.getElementById('consultForm');
  if(f)f.onsubmit=function(e){
    e.preventDefault();
    const d=new FormData(f);
    const body=Array.from(d.entries()).map(([k,v])=>k+':'+v).join('\n');
    fetch('https://formspree.io/f/xxxxxx',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:body})}).then(r=>{
      alert(r.ok?'提交成功，管家会尽快联系您':'提交失败，请直接拨打电话');
      if(r.ok)f.reset();
    }).catch(()=>alert('网络异常，请直接拨打电话'));
  };
});

// 滚动触发动画
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animationPlayState = 'running';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.section .title, .section .subtitle, .card, .dest-card, .quad-cell').forEach(el => {
  el.style.animationPlayState = 'paused';
  observer.observe(el);
});

// 导航栏滚动加深
window.addEventListener('scroll', () => {
  const header = document.querySelector('.header');
  if (header) {
    header.classList.toggle('scrolled', window.scrollY > 50);
  }
});
