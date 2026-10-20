# 云暖・旅居 · App Store 上线准备计划

> **执行方式：** 本计划为"上线准备"而非纯代码实现，每 Task 以**可验证的检查项/验收标准**收口（对应 writing-plans 的 test cycle）。

**Goal:** 把云暖・旅居（现为 29 页纯静态 HTML 部署包）包装成可上架 App Store 的原生 iOS App，并完成提交前全部准备（资产、元数据、隐私合规、性能与无障碍审计、提交流程）。

**Architecture:** 静态站 → 原生 WebView 壳 App（Capacitor 优先，回退原生 WKWebView）→ Xcode 自动签名打包 → Transporter 上传 App Store Connect → 审核上架。**Web 资源本地内置**（离线可跑、规避"纯套壳"审核风险），仅网络请求走 HTTPS。

**Tech Stack:** 现有静态站（HTML/CSS/JS，零后端）；壳：Capacitor（@capacitor/core, ios）；构建：Xcode + 自动签名；上传：Transporter / altool。

**Spec:** 见对话记录——部署包 `yun-nuan-luju/`（29 页 + 24 张本地图 + sitemap/robots/隐私/条款/FAQ），生成脚本 `yun-nuan-luju-gen.py`；品牌站原始单文件 `luju-app/index.html` 为内容权威源。

## 关键现实约束（计划起点，不可跳过）

1. **当前资产是静态网站，不是原生 App。** App Store 只接受原生 .app 二进制；必须先把静态站包装成原生壳 App（Task 3）。
2. **内容权威源**：电话（王先生 132 0888 8618 / 白先生 177 8728 8800）、16 州数据、医疗边界、隐私政策逐字沿用，禁止改动语义。
3. **占位需替换**：`https://example.com` 域名、footer ICP 备案号、trust 页证照号——真实上线前必须替换，否则审核/合规有风险。
4. **合规红线**：医疗边界书面化（管家不做诊疗建议）；隐私标签与 privacy.html 收集字段一一对应；年龄分级需诚实（4+，因无不当内容）。

## Global Constraints

- 内容与品牌站逐字一致；新增内容一律显式标注「示意 / 以合同为准」。
- 医疗：任何界面不得出现诊疗建议；就医陪诊仅"陪同/预约/取药/传达"。
- 隐私：表单仅收集 privacy.html 所列字段（称呼、联系方式、意向住法、人数、日期、特殊需求、留言）；不得收集 iOS 设备标识、位置（除非用户主动）。
- 年龄分级 4+；无广告 SDK、无第三方统计（避免隐私标签复杂化）。
- 壳 App 需有原生价值：系统状态栏/安全区适配、本地资源离线、可添加主屏（可选）。
- 性能目标：LCP < 2.5s（Fast 3G）、无控制台报错、无障碍无严重违规。

## Review Focus

| 输入/失败模式 | 预期行为 | 负责 Task |
|---|---|---|
| WebView 壳被审核判为"纯浏览器套壳" | 提供原生功能价值 + 本地离线 + 明确产品定位 | Task 3 / Task 8 |
| 医疗内容被误判为提供诊疗 | 全程"医疗边界"话术、无诊断建议 | Task 7 |
| 隐私标签与收集字段不一致 | 隐私标签 = privacy.html 字段精确映射 | Task 6 |
| 域名/ICP 占位未替换就提交 | 上线清单强制勾选"占位替换" | Task 5 / Task 8 |
| 图片/字体在弱网加载慢（LCP） | hero 本地图、width/height、eager 首屏 | Task 7 |

---

## Task 1: 资产与合规审计（上线前盘点）

**Files:**
- 审阅：`yun-nuan-luju/` 全目录、`yun-nuan-luju-gen.py`、`luju-app/index.html`
- 产出：`docs/superpowers/plans/2026-10-15-asset-audit.md`（可省略，并入本清单）

- [ ] **Step 1: 核对页面数与资源** —— 29 HTML + 24 本地图 + sitemap/robots/隐私/条款/FAQ 全在，无外部 CDN 图片依赖。
- [ ] **Step 2: 列出全部占位** —— `example.com` 域名出现位置（sitemap/robots/canonical/og/JSON-LD）、ICP 备案号、trust 证照号。
- [ ] **Step 3: 核对两个联系电话与医疗边界** —— 全站出现且一致。
- [ ] **Step 4: 验收** —— 生成"占位替换清单"，逐项可勾选。

## Task 2: 视觉方向确立与界面审查（frontend-design）

**Files:**
- 审阅：`assets/css/style.css` 全部 token
- 产出：设计方向声明（anchor + 不同iator）+ 针对性优化（回写 `yun-nuan-luju-gen.py` 后重生成）

- [ ] **Step 1: 选定 anchor** 并给出理由（不落 Safe 套）。
- [ ] **Step 2: Token 一致性核对** —— 现有 palette/typeface/texture 是否全在 anchor 允许域内；发现 drift 则列出。
- [ ] **Step 3: Content discipline 审查** —— 有无编造数据 / filler / unicode 图标 / AI-slop。
- [ ] **Step 4: 验收** —— 输出审查结论 + 高价值优化项（不破坏已验证站点）。

## Task 3: 原生壳 App 工程搭建（Capacitor）

**Files:**
- 创建：`ios-shell/`（Capacitor 工程，web assets 指向 `yun-nuan-luju/`）
- 命令：`npm init` → `npx cap init` → `npx cap add ios` → `npx cap sync`

- [ ] **Step 1: 初始化工程** 并把 `yun-nuan-luju/` 设为 webDir。
- [ ] **Step 2: `npx cap sync ios`** —— 生成 iOS 工程。
- [ ] **Step 3: 本地资源内置确认** —— 所有 HTML/CSS/JS/图片打包进 .app（无远程依赖）。
- [ ] **Step 4: 验收** —— `xcodebuild -project … -scheme App -sdk iphonesimulator build` 编译通过；模拟器启动到首页。

## Task 4: 原生价值 + 移动端适配

**Files:**
- 修改：iOS 工程配置（Info.plist、Capacitor config）、`yun-nuan-luju/assets/css/style.css`（安全区）
- 产出：移动端体验清单

- [ ] **Step 1: 安全区适配** —— CSS `env(safe-area-inset-*)` 用于悬浮 CTA / 底部。
- [ ] **Step 2: 状态栏/启动屏** —— LaunchScreen 深青底色 + logo，无黑边。
- [ ] **Step 3: 离线与缓存** —— 资源本地内置即离线；可选加 Service Worker。
- [ ] **Step 4: 权限最小化** —— 不声明任何系统权限（或仅最小必要）。
- [ ] **Step 5: 验收** —— 模拟器断网可完整浏览；无刘海遮挡。

## Task 5: 元数据与商店资产

**Files:**
- 产出：`docs/superpowers/plans/2026-10-15-store-assets.md`（清单）

- [ ] **Step 1: App 图标** —— 1024×1024，深青底 + 山脉 logo，无圆角/透明。
- [ ] **Step 2: 启动屏图** —— 6.7/6.5/6.1/5.5/4.7/4" 各尺寸（Xcode 单资源可自适应，Apple 现已支持单尺寸）。
- [ ] **Step 3: 截图规格** —— 6.7"(1290×2796) 与 6.5"(1242×2688) 各 2–4 张竖屏；内容展示首页/目的地/体验包/州详情。
- [ ] **Step 4: 文案字段** —— 名称（≤30 字符）、副标题（≤30）、关键词（≤100，逗号分隔）、宣传文本、描述（4000 字内）、URL/支持 URL/营销 URL。
- [ ] **Step 5: 验收** —— 所有资产尺寸与格式正确，占位域名已替换为真实支持页。

## Task 6: 隐私与合规（App Store Connect）

**Files:**
- 输入：`privacy.html`
- 产出：隐私标签映射表 + 分级

- [ ] **Step 1: 隐私标签** —— "联系信息-姓名/联系号码（收集，用户提供）""未收集第三方数据""无追踪"。
- [ ] **Step 2: 年龄分级问卷** —— 4+（无暴力/成人/赌博/未经过滤用户生成内容）。
- [ ] **Step 3: 隐私政策 URL** —— 指向可访问的隐私页（真实域名替换后）。
- [ ] **Step 4: 验收** —— 隐私标签 = privacy.html 字段逐项对应，无遗漏/夸大。

## Task 7: 性能与无障碍审计（chrome-devtools / 等价 CDP）

**Files:**
- 审阅：全站
- 产出：审计报告 + 修复

- [ ] **Step 1: 控制台/网络** —— 0 error、0 404。
- [ ] **Step 2: LCP** —— hero 首屏图 ≤2.5s（Fast 3G）；必要时 preload。
- [ ] **Step 3: 无障碍** —— 对比度、可访问名、焦点可见、alt、landmark。
- [ ] **Step 4: 医疗边界抽查** —— 无诊疗建议文案。
- [ ] **Step 5: 验收** —— 审计通过；未过项逐条修复并复测。

## Task 8: 提交与审核

**Files:**
- 产出：提交流程清单

- [ ] **Step 1: 签名与归档** —— Xcode Archive + 自动签名（个人/公司开发者账号）。
- [ ] **Step 2: Transporter 上传** —— 或 Xcode Organizer Distribute App。
- [ ] **Step 3: 提交审核** —— App Store Connect → 提交；填写出口合规（无加密）。
- [ ] **Step 4: 审核注意事项** —— WebView 壳：本地内容、明确产品价值；医疗边界话术；占位已替换。
- [ ] **Step 5: 验收** —— 提交成功并进入"等待审核"；准备好常见审核问题答复。

---

## Execution Handoff

本计划为"上线准备计划"，由主代理按 `执行→验证→交付` 直接推进（用户已授权全自动），不拆子代理。Task 2/7 立即执行；Task 1/5/6/8 产出清单；Task 3/4 需 macOS + Xcode 环境（当前 Linux 不可执行，给出命令与验收标准，由用户在有 Xcode 的 Mac 上执行或另行授权）。
