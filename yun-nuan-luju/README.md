# 云暖・旅居 · 静态部署包

多页静态站点，可部署到任意静态托管（Apache / Nginx / 对象存储 / GitHub Pages / Vercel 等），直接浏览器打开 `index.html` 即可本地预览。

## 目录结构

```
yun-nuan-luju/
├── index.html          首页（四词 / 方式 / 体验包 / 16 州卡 / 故事 / FAQ / CTA）
├── destination.html    目的地 · 16 州版图（七区域分组）
├── experience.html     旅居体验包（两档 + 三节奏 + 自选组合器）
├── concierge.html      旅居总管（七层服务 + 医疗边界）
├── living.html         生活方式（焕新 / 安居 / 旅居工作）
├── food.html           美食 · 16 州味觉版图
├── trust.html          信任中心（承诺 / 保险 / 医疗边界 / 可核验）
├── contact.html        联系管家（表单 + 六步流程）
├── stories.html        旅居故事（三种典型客群旅程 · 示意）
├── faq.html            常见问题（10 问 · 含 JSON-LD）
├── privacy.html        隐私政策
├── terms.html          服务条款
├── 404.html            友好 404
├── places/             16 个州详情页（diqing … wenshan）
├── assets/
│   ├── css/style.css   全站共享样式
│   ├── js/main.js      共享脚本（菜单 / 组合器 / 表单 / FAQ / 悬浮咨询条）
│   └── img/            24 张本地实景图（零 CDN 依赖）
├── sitemap.xml         SEO
├── robots.txt          SEO
├── favicon.svg
└── README.md
```

## 关键说明

- **内容一致性**：全部文案、温区 / 穿衣数据、16 州美食五列、七层服务、医疗边界、两个联系电话（王先生 132 0888 8618 / 白先生 177 8728 8800）均与品牌站原单文件逐字一致。
- **地名竖排**：16 州卡中文地名统一竖排（`writing-mode: vertical-rl`），桌面与移动端一致。
- **图片本地化**：24 张实景摄影图全部存入 `assets/img/`，部署包零外部依赖，离线可跑；图片已补 width/height 防布局抖动。
- **转化组件**：全站悬浮咨询条（右下角电话 + 在线留言意向弹窗）、首页 hero「立即咨询」电话按钮、移动端自动收起文字标签。
- **新增页面均显式标注边界**：旅居故事为「典型客群旅程示意」，适居季节为「示意参考」，隐私 / 条款为「线上预览文本，以正式合同为准」——不编造可查证事实。
- **SEO / 上线**：sitemap、robots、404、og / twitter / canonical、Organization 与 FAQPage JSON-LD、州页 TouristDestination JSON-LD。

## 上线前需替换的占位（README 醒目标注）

1. `sitemap.xml`、`robots.txt`、全站 `<link rel="canonical">`、og:url / og:image、JSON-LD 中的域名 `https://example.com` → 真实域名。
2. footer「ICP 备案号：沪ICP备XXXXXXXX号」→ 真实备案号（中国大陆上线必需）。
3. trust.html「统一社会信用代码 / 旅行社业务经营许可证号（上线前公示）」→ 真实证照。
4. og:image 与 apple-touch-icon 指向的 `yunnan-hero.jpg` 为占位社交分享图，可替换为 1200×630 品牌图。

## 快速开始

```bash
cd yun-nuan-luju
python3 -m http.server 8080    # 浏览器打开 http://localhost:8080
# 或直接双击打开 index.html
```

## 生成脚本

`yun-nuan-luju-gen.py`（项目根）是部署包生成器：改数据后运行 `python3 yun-nuan-luju-gen.py` 可重建全站，不属于运行时依赖。
