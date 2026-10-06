import styles from './page.module.css';

export default function Home() {
  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", background: '#f5f5f7', color: '#1d1d1f', minHeight: '100vh' }}>
      <header style={{ padding: '60px 20px 40px', textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
        <h1 style={{ fontSize: 48, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 16 }}>云南旅居</h1>
        <p style={{ fontSize: 21, color: '#86868b', fontWeight: 400 }}>让“云”难游变得不难 · 极简定制规划</p>
      </header>

      <section style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px 60px' }}>
        <div style={{ background: '#fff', borderRadius: 24, overflow: 'hidden', boxShadow: '0 12px 48px rgba(0,0,0,0.04)', marginBottom: 40 }}>
          <div style={{ aspectRatio: '16/9', background: 'url(https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80) center/cover', backgroundSize: 'cover' }} />
          <div style={{ padding: 32 }}>
            <h2 style={{ fontSize: 28, fontWeight: 600, marginBottom: 12 }}>5天经典路线</h2>
            <p style={{ color: '#515154', fontSize: 17, lineHeight: 1.6 }}>可勾选生成专属行程，灵活延长旅居时间。</p>
          </div>
        </div>

        <div style={{ display: 'grid', gap: 16 }}>
          {[
            { day: 'Day 1', txt: '抵达昆明 · 适应气候' },
            { day: 'Day 2', txt: '飞大理 · 洱海旅拍' },
            { day: 'Day 3', txt: '丽江古城 · 玉龙雪山' },
            { day: 'Day 4-5', txt: '普洱茶山 / 返程（旅居可延长）' }
          ].map((it, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 18, padding: '20px 24px', display: 'flex', alignItems: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <span style={{ fontSize: 15, color: '#86868b', width: 80, fontWeight: 600 }}>{it.day}</span>
              <span style={{ fontSize: 18, fontWeight: 500 }}>{it.txt}</span>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ textAlign: 'center', padding: '40px 20px', color: '#86868b', fontSize: 13 }}>
        <p>Yunnan Living · 云南旅游极简设计规划 © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
