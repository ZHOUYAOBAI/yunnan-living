'use client';
export default function Home() {
  const styles = {
    body: { margin: 0, fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue", sans-serif', color: '#2d3748', background: '#fdfef8', lineHeight: 1.6 },
    nav: { display: 'flex', justifyContent: 'space-between', padding: '20px 40px', alignItems: 'center', maxWidth: 1200, margin: '0 auto' },
    logo: { fontSize: 20, fontWeight: 600, letterSpacing: '1px' },
    hero: { textAlign: 'center', padding: '100px 20px 80px', maxWidth: 800, margin: '0 auto' },
    heroTitle: { fontSize: 48, fontWeight: 700, marginBottom: 20, color: '#1a202c', lineHeight: 1.2 },
    btn: { padding: '12px 32px', background: '#2d3748', color: '#fff', border: 'none', borderRadius: 30, fontSize: 16, cursor: 'pointer' },
    section: { padding: '60px 40px', maxWidth: 1200, margin: '0 auto' },
    sectionAlt: { background: '#f7fafc', padding: '60px 40px', textAlign: 'center' },
    card: { background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', paddingBottom: 20 },
    footer: { textAlign: 'center', padding: 40, color: '#a0aec0', fontSize: 13 }
  };
  return (
    <div style={styles.body}>
      <nav style={styles.nav}>
        <div style={styles.logo}>Yunnan Living</div>
        <div style={{fontSize: 13, color: '#718096', border: '1px solid #e2e8f0', padding: '4px 10px', borderRadius: 20}}>EN / 中</div>
      </nav>
      <header style={styles.hero}>
        <h1 style={styles.heroTitle}>让云“难”游变得不难</h1>
        <p style={{fontSize: 18, color: '#718096', marginBottom: 40}}>外网高端定制 · 旅居换住 · 必备极简站</p>
        <button style={styles.btn}>查看定制方案</button>
      </header>
      <section style={styles.section}>
        <h2 style={{fontSize: 28, fontWeight: 600, marginBottom: 40, textAlign: 'center'}}>核心服务</h2>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 30}}>
          <div style={styles.card}><div style={{height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, background: '#f7fafc'}}>🏔️</div><div style={{fontSize: 20, margin: '16px 20px 8px', fontWeight: 600}}>高端定制</div><div style={{fontSize: 14, color: '#718096', margin: '0 20px'}}>严选酒店，指定车型，真实信息流通。</div></div>
          <div style={styles.card}><div style={{height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, background: '#f7fafc'}}>🏡</div><div style={{fontSize: 20, margin: '16px 20px 8px', fontWeight: 600}}>旅居换住</div><div style={{fontSize: 14, color: '#718096', margin: '0 20px'}}>多城市换住，适合长居及离退休干部。</div></div>
          <div style={styles.card}><div style={{height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, background: '#f7fafc'}}>🌐</div><div style={{fontSize: 20, margin: '16px 20px 8px', fontWeight: 600}}>多语言引流</div><div style={{fontSize: 14, color: '#718096', margin: '0 20px'}}>面向全球，导私域（ChatsApp/微信）成交。</div></div>
        </div>
      </section>
      <section style={styles.sectionAlt}>
        <h2 style={{fontSize: 28, fontWeight: 600, marginBottom: 20}}>5天经典路线（可勾选生成）</h2>
        <div style={{maxWidth: 600, margin: '0 auto', textAlign: 'left'}}>
          <div style={{padding: '16px 0', borderBottom: '1px solid #e2e8f0'}}>Day 1: 抵达昆明 · 适应气候</div>
          <div style={{padding: '16px 0', borderBottom: '1px solid #e2e8f0'}}>Day 2: 飞大理 · 洱海旅拍</div>
          <div style={{padding: '16px 0', borderBottom: '1px solid #e2e8f0'}}>Day 3: 丽江古城 · 玉龙雪山</div>
          <div style={{padding: '16px 0'}}>Day 4-5: 普洱茶山 / 返程（旅居可延长）</div>
        </div>
      </section>
      <footer style={styles.footer}>
        <p>Yunnan Living · 云南旅游极简设计规划 © {new Date().getFullYear()}</p>
        <p style={{fontSize: 12}}>让云“难”游变得不难 · 必备定制网站</p>
      </footer>
    </div>
  );
}
