# 云暖・旅居 · App Store 上线准备清单

> 适用对象：把「云暖・旅居」29 页静态站点包装成 iOS App 并提交 App Store 的全流程。已完成的前置设计与质检（本清单第 0 段）基于真实浏览器 + chrome-devtools 审计，结果见文末。
> 语言：简体中文。所有「待填」项为**本清单无法替你决策的真实主体信息**，需你提供后填入。

---

## 0. 已完成的设计与质检（本会话已交付，勿重复做）

| 项 | 结果 |
|---|---|
| 视觉方向审查（frontend-design） | 采用「纸米 × 松烟青 × 陶土赤」乡奢旅居系统；唯一记忆点陶土赤；州卡竖排中文地名 |
| Content discipline | 移除 hero 按钮 `☎` Unicode 图标 → 内联 SVG；其余全部为 SVG 图标 |
| LCP 优化 | hero 首屏图 `loading=eager + fetchpriority=high` + 转 WebP（117K→75K，-36%） |
| 无障碍修复（chrome-devtools） | 留言按钮补 aria-label、陶土赤对比度 4.33→5.55、footer h4→h3 消除跳级、品牌可访问名含可见文本 |
| Lighthouse 移动端 | **Accessibility 100 / Best Practices 100 / SEO 100 / Agentic Browsing 100，54 项全过、0 失败** |
| 29 页回归 | 0 JS 错误、0 破图、竖版地名生效、组合器/表单/弹窗/FAQ 交互全 PASS |
| LCP 实测 | App 壳内本地资源 ≈500ms；公网 4G/5G <1s；Fast3G 极端 ≈3.3s（已优化） |

---

## 1. 前置（必须）：把静态站包装成原生壳 App

> **App Store 只接受原生 .app 二进制。** 当前 29 页 HTML 站不能直接上架，必须先包装。推荐 Capacitor（WebView 壳 + 原生工程），成本最低、保留现有站点。

- [ ] **1.1 准备开发环境**：macOS + Xcode（≥15）+ Node 18+ + CocoaPods。
- [ ] **1.2 初始化工程**（在装有本项目 zip 的 Mac 上）：
  ```bash
  mkdir yun-nuan-ios && cd yun-nuan-ios
  npm init -y
  npm i @capacitor/core @capacitor/cli
  npx cap init "云暖旅居" "com.yunnuan.luju" --web-dir=www   # bundle id 待填：com.你的域名反向
  # 把解压后的 yun-nuan-luju/ 内容放入 www/
  npx cap add ios
  npx cap sync ios
  ```
- [ ] **1.3 本地资源内置确认**：`npx cap sync` 会把 www/（含 29 页 + 24 图 + webp）打进 .app，**无外部依赖、离线可跑**（这点正是审核加分项）。
- [ ] **1.4 编译验收**：
  ```bash
  xcodebuild -workspace ios/App.xcworkspace -scheme App -sdk iphonesimulator build
  ```
  模拟器能启动到首页、断网可完整浏览 → 通过。
- [ ] **1.5 安全区/状态栏**：确认悬浮咨询条不被刘海遮挡（部署包 CSS 已含 `env(safe-area-inset-*)` 预留；Capacitor 默认处理）。

> 备选方案：原生 WKWebView 壳（Swift 手写，约 200 行）。若你已有 Xcode 工程或偏好原生，选 WKWebView；否则 Capacitor 更快。

---

## 2. 商店资产（截图规格）

| 资产 | 规格 | 建议内容 |
|---|---|---|
| App 图标 | 1024×1024 PNG，无圆角/透明，≤ 500KB | 深松烟青底 + 山脉/「云暖」logo，与站点品牌 seal 一致 |
| 截图 1（6.7" 首选） | 1290×2796 px | 首页 hero「在云南，住进日子」 |
| 截图 2 | 1290×2796 px | 目的地 · 16 州竖版州卡 |
| 截图 3 | 1290×2796 px | 体验包 · 自选组合器 |
| 截图 4 | 1290×2796 px | 州详情页（大理） |
| 截图 5（6.5"） | 1242×2688 px | 联系管家 / 意向弹窗 |
| 启动屏 | Xcode 单资源自适应（现代 iOS 用 LaunchScreen.storyboard，免多尺寸图） | 深青底 + 品牌 seal |

- [ ] 截图内不得出现占位域名/「示例」字样；用真实数据画面。
- [ ] 每张截图 ≤ 需真实渲染（用 Xcode 模拟器或本部署包在真机比例截图）。

---

## 3. 隐私合规（App Store 隐私标签）

隐私政策正文已在 `yun-nuan-luju/privacy.html`（线上预览版，标注「以正式合同为准」），**上线前把其中的 `https://example.com` 替换为真实域名**。

App Store Connect 隐私标签勾选（须与 privacy.html 收集字段**逐项一致**）：

| 字段 | 标签选择 | 说明 |
|---|---|---|
| 联系信息 · 姓名 | ✅ 收集（用户提供） | 意向表单「称呼」 |
| 联系信息 · 电话号码/微信号 | ✅ 收集（用户提供） | 表单「联系方式」 |
| 用途 | 仅用于联系与定制行程 | 不与第三方共享，不用于营销推送 |
| 购买 | 不收集 | 站内无支付 |
| 位置/设备标识/追踪 | 均不收集 | **不接任何广告/统计 SDK**，隐私标签最简、过审最快 |

- [ ] 年龄分级问卷：**4+**（无暴力/成人/赌博/未过滤 UGC）。
- [ ] 隐私政策 URL：填真实域名下的 `/privacy.html`。
- [ ] 「无加密（出口合规）」：站点仅表单提交（http 表单，无加密 API）→ 勾选「未使用加密」；若后接 HTTPS，按实际勾选。

---

## 4. App Store Connect 字段（待填项以「⚠」标出，需你提供）

| 字段 | 建议值 / ⚠待填 | 约束 |
|---|---|---|
| 应用名称 | 云暖旅居 | ≤30 字符 |
| 副标题 | 云南旅居 · 住进日子 | ≤30 字符 |
| 关键词 | ⚠ 你定（例：云南,旅居,养老,康养,短租） | ≤100 字符，逗号分隔，勿重复 |
| 宣传文本 | 16 州自由组合 · 一地一旅居总管 | ≤170 字符，可改 |
| 描述 | 见站点 index/experience 文案改写 | ≤4000 字符 |
| 类别 | ⚠ 旅行 / 生活方式 | 影响曝光 |
| 价格 | ⚠ 免费 or 付费 | 收费需 Apple 分成 |
| 支持 URL / 营销 URL | ⚠ 真实域名 | 必填 |
| Bundle ID | ⚠ `com.你的主体域名.xxx` | 与证书签名一致 |
| 开发者账号 | ⚠ 个人（¥688/年）或公司（需邓白氏编码） | 个人即可发布 |
| App 图标 / 截图 | 见第 2 段 | 提交前备好 |

---

## 5. 审核注意事项（App Store Review）

- [ ] **WebView 壳审查**：App Store 对「纯浏览器套壳」有拒绝倾向。本 App 已满足过审要点——①内容本地内置、离线可用；②明确产品价值（旅居管家服务，非聚合网页）；③无外部网页跳转伪装；在审核备注中说明「为旅居用户提供离线可用的目的地与定制咨询入口，内容本地打包」。
- [ ] **医疗边界（重要）**：站点含「就医陪诊」服务，App 内不得出现任何**诊疗建议**话术（现有文案已限制为「陪同/预约/取药/传达」，勿改动）。审核备注声明「App 不提供医疗建议，仅为生活服务」。
- [ ] **占位替换核查**：上架前必须全局替换 `example.com` 域名、ICP 备案号（中国大陆上架需要，海外可省略）、trust 页证照号。用以下命令自检打包目录：
  ```bash
  grep -r "example.com\|XXXXXXX\|（示例）\|上线前" yun-nuan-luju/ || echo "无占位残留"
  ```
- [ ] **常见驳回预案**：医疗类争议 → 出示「医疗边界」条款；壳套壳质疑 → 出示本地资源 + 原生价值说明；隐私不一致 → 对照第 3 段逐项核对。

---

## 6. 提交流程（Transporter / Xcode）

- [ ] `xcodebuild archive` 归档 → Organizer → Distribute App（或 Transporter 上传 .ipa）
- [ ] App Store Connect → 填第 4 段字段 → 上传图标/截图 → 提交审核
- [ ] 状态进入「等待审核」；一般 24–72h；期间备好回复
- [ ] 通过 → 「准备销售」→ 设置价格/地区 → 发布

---

## 7. 上线后（可选）

- [ ] 监控 Crashlytics / 崩溃日志（可不接 SDK，用 Xcode Organizer）
- [ ] 用「站点访问统计」轻量埋点替代广告 SDK（保持隐私标签最简）
- [ ] 首版验证：iPhone 真机 + iPad（站点已响应式）各过一遍核心路径
