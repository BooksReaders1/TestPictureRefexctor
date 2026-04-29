# 任务列表：Vue漫画查看器重构

**输入**：来自 `/specs/001-vue-manga-refactor/` 的设计文档
**前置条件**：plan.md（必需）、spec.md（用于用户故事）、research.md、data-model.md、contracts/

**测试**：测试是可选的 - 规范中没有明确要求。

**组织结构**：任务按用户故事分组，以便实现每个故事的独立开发和测试。

## 格式：`[ID] [P?] [Story?] 描述`

- **[P]**：可以并行运行（不同文件，无依赖）
- **[Story]**：此任务属于哪个用户故事（如 US1、US2、US3）
- 描述中包含确切文件路径

## 路径约定

- **Web应用**：`frontend/src/`、`frontend/tests/` 位于仓库根目录
- 下面显示的路径基于 plan.md 的前端结构

## 阶段 1：设置（共享基础设施）

**目的**：项目初始化和基础结构

- [X] T001 在 frontend/ 中初始化 Vue 3 + TypeScript + Vite 项目
- [X] T002 在 frontend/package.json 中安装核心依赖（Vue Router、Pinia、JSZip、MD5）
- [X] T003 [P] 在 frontend/vite.config.ts 中配置 Vite
- [X] T004 [P] 在 frontend/tsconfig.json 中配置 TypeScript
- [X] T005 [P] 在 frontend/.eslintrc.cjs 中创建 ESLint 配置
- [X] T006 [P] 在 frontend/.prettierrc 中创建 Prettier 配置
- [X] T007 [P] 在 frontend/src/assets/css/theme.css 中创建 CSS 变量
- [X] T008 [P] 在 frontend/src/router/index.ts 中配置 Vue Router
- [X] T009 [P] 在 frontend/src/stores/index.ts 中配置 Pinia 状态管理
- [X] T010 在 frontend/src/components/common/ 中创建基础组件结构
- [X] T011 在 frontend/src/App.vue 中创建根组件
- [X] T012 在 frontend/index.html 中创建入口 HTML
- [X] T013 在 frontend/package.json 中创建包含依赖的 package.json
- [X] T014 在 frontend/README.md 中创建文档

---

## 阶段 2：基础（阻塞所有用户故事的前置条件）

**目的**：所有用户故事必须完成此阶段后才能开始的核心基础设施

**⚠️ 关键**：在任何用户故事工作开始之前，此阶段必须完成

- [X] T015 在 frontend/src/types/index.ts 中定义 TypeScript 接口（Manga、Chapter、Image、AppState、UserSettings）
- [X] T016 [P] 在 frontend/src/utils/errorHandler.ts 中实现错误处理工具
- [X] T017 [P] 在 frontend/src/utils/cache.ts 中实现缓存工具
- [X] T018 [P] 在 frontend/src/utils/token.ts 中实现令牌生成工具
- [X] T019 [P] 在 frontend/src/composables/useImageProcessor.ts 中实现图片处理组合式函数
- [X] T020 [P] 在 frontend/src/services/api.ts 中实现带有令牌认证的 API 服务
- [X] T021 [P] 在 frontend/src/stores/manga.ts 中创建 Pinia 漫画状态管理
- [X] T022 [P] 在 frontend/src/stores/app.ts 中创建 Pinia 应用状态管理
- [X] T023 [P] 在 frontend/src/stores/settings.ts 中创建 Pinia 设置状态管理
- [X] T024 在 frontend/src/components/common/LoadingSpinner.vue 中实现加载动画组件
- [X] T025 在 frontend/src/components/common/ErrorToast.vue 中实现错误提示组件
- [X] T026 在 frontend/src/utils/toast.ts 中实现 Toast 通知工具

**检查点**：基础就绪 - 现在可以并行开始用户故事实现

---

## 阶段 3：用户故事 1 - 漫画阅读体验（优先级：P1）🎯 MVP

**目标**：用户可以输入漫画ID获取漫画信息，选择章节并逐页浏览漫画

**独立测试**：输入漫画ID，验证是否显示漫画标题、章节列表，选择章节后验证是否逐页显示图片

### 用户故事 1 实现

- [X] T027 在 frontend/src/views/HomeView.vue 中创建主页视图
- [X] T028 在 frontend/src/components/manga/MangaSearch.vue 中创建漫画搜索组件
- [X] T029 在 frontend/src/components/manga/MangaInfo.vue 中创建漫画信息显示组件
- [X] T030 在 frontend/src/components/manga/ChapterList.vue 中创建章节列表组件
- [X] T031 在 frontend/src/components/manga/ChapterList.vue 中实现章节选择处理
- [X] T032 在 frontend/src/components/image/ImageContainer.vue 中创建图片容器组件
- [X] T033 在 frontend/src/components/manga/PageNavigation.vue 中创建页面导航组件
- [X] T034 在 frontend/src/components/manga/ChapterNavigation.vue 中创建章节导航组件
- [X] T035 在 frontend/src/views/MangaView.vue 中创建漫画详情页
- [X] T036 在 frontend/src/components/manga/ChapterNavigation.vue 中添加章节选择集成
- [X] T037 在 frontend/src/components/manga/PageNavigation.vue 中添加页面变化集成
- [X] T038 在 frontend/src/components/image/ImageContainer.vue 中实现图片懒加载
- [X] T039 在 frontend/src/components/image/ImageContainer.vue 中实现图片加载后的处理
- [X] T040 在 frontend/src/components/manga/PageNavigation.vue 中实现页面导航逻辑

**检查点**：此时，用户故事 1 应该完全可用 - 用户可以输入漫画 ID，查看漫画信息和章节列表，并浏览页面

---

## 阶段 4：用户故事 2 - 界面交互（优先级：P2）

**目标**：保持悬浮菜单、拖拽移动、侧边抽屉菜单、Toast提示、加载动画和错误提示

**独立测试**：验证悬浮菜单显示/隐藏，拖拽按钮跟随鼠标，点击抽屉菜单项触发相应功能，错误提示正常显示

### 用户故事 2 实现

- [X] T041 在 frontend/src/components/common/FloatingMenu.vue 中创建悬浮菜单组件
- [X] T042 在 frontend/src/components/common/MenuDrawer.vue 中实现菜单抽屉
- [X] T043 在 frontend/src/components/common/FloatingMenu.vue 中实现拖拽功能
- [X] T044 在 frontend/src/components/common/MenuItem.vue 中创建菜单项组件
- [X] T045 在 frontend/src/components/common/MenuDrawer.vue 中实现点击外部关闭菜单
- [X] T046 在 frontend/src/components/common/MenuDrawer.vue 中实现菜单点击处理
- [X] T047 在 MangaView.vue 中集成悬浮菜单
- [X] T048 在 MenuDrawer.vue 中实现下载菜单项功能
- [X] T049 在 MenuDrawer.vue 中实现设置菜单项功能

**检查点**：此时，用户故事 1 和用户故事 2 都应该独立可用，并具备完整的 UI 交互

---

## 阶段 5：用户故事 3 - 图片加载与处理（优先级：P3）

**目标**：保持MD5切片计算、图片切片和重组、Canvas处理、错误重试、尺寸异常处理、响应式缩放

**独立测试**：验证图片处理准确性，错误重试机制，异常尺寸图片处理，缩放适配

### 用户故事 3 实现

- [X] T050 在 frontend/src/composables/useImageProcessor.ts 中优化图片处理逻辑
- [X] T051 在 frontend/src/utils/md5.ts 中实现用于切片参数的 MD5 哈希计算
- [X] T052 在 frontend/src/utils/imageProcessor.ts 中实现图片切片和重组
- [X] T053 在 frontend/src/utils/imageProcessor.ts 中实现基于 Canvas 的图片处理
- [X] T054 在 frontend/src/composables/useImageProcessor.ts 中实现图片加载失败的重试机制
- [X] T055 在 frontend/src/composables/useImageProcessor.ts 中实现图片尺寸验证和处理
- [X] T056 在 frontend/src/components/image/ImageContainer.vue 中实现响应式图片缩放
- [X] T057 在 frontend/src/composables/useImageProcessor.ts 中实现图片预加载
- [X] T058 在 frontend/src/services/api.ts 中实现并发请求控制

**检查点**：所有图片处理功能正常工作，包含适当的错误处理和性能优化

---

## 阶段 6：用户故事 4 - 下载功能（优先级：P4）

**目标**：将漫画章节导出为ZIP文件，支持下载进度显示和iOS/Safari适配

**独立测试**：验证ZIP文件创建正确，下载进度显示，Safari设备正常下载

### 用户故事 4 实现

- [X] T059 在 frontend/src/services/downloadService.ts 中创建下载服务
- [X] T060 在 frontend/src/services/downloadService.ts 中实现 ZIP 文件创建
- [X] T061 在 frontend/src/services/downloadService.ts 中实现下载进度跟踪
- [X] T062 在 frontend/src/services/downloadService.ts 中实现 iOS/Safari 下载处理
- [X] T063 在 MenuDrawer.vue 中添加下载按钮
- [X] T064 在 frontend/src/components/common/DownloadProgress.vue 中创建下载进度对话框
- [X] T065 在 store actions 中集成下载服务

**检查点**：所有下载功能正常工作，包含进度反馈和跨浏览器支持

---

## 阶段 7：用户故事 5 - 响应式设计（优先级：P5）

**目标**：实现移动优先的响应式设计，确保在桌面和移动设备上都有良好体验

**独立测试**：验证桌面端显示完整界面，移动端自适应布局，触摸操作流畅

### 用户故事 5 实现

- [X] T066 在 frontend/src/assets/css/theme.css 中实现响应式 CSS
- [X] T067 在 frontend/src/assets/css/theme.css 中添加移动端断点
- [X] T068 在 frontend/src/components/manga/ChapterList.vue 中优化移动端章节列表
- [X] T069 在 frontend/src/components/image/ImageContainer.vue 中优化移动端图片容器
- [X] T070 在 frontend/src/components/common/FloatingMenu.vue 中实现触摸事件处理
- [X] T071 在 frontend/src/components/manga/ChapterNavigation.vue 中优化移动端导航
- [X] T072 在 MangaView.vue 中添加响应式调整
- [X] T073 在移动设备上测试并根据样式进行调整

**检查点**：所有响应式设计功能在各个设备上都能正常工作

---

## 阶段 8：优化与跨领域关注点

**目的**：影响多个用户故事的改进

- [X] T074 [P] 在 frontend/src/components/manga/PageNavigation.vue 中添加键盘导航支持
- [X] T075 [P] 在 frontend/src/components/manga/ChapterNavigation.vue 中添加章节键盘导航
- [X] T076 在 frontend/src/components/ 中添加 ARIA 属性以提升无障碍访问
- [X] T077 [P] 在 frontend/src/services/api.ts 中通过缓存优化图片加载性能
- [X] T078 [P] 在 frontend/src/composables/useImageProcessor.ts 中为大图片优化内存管理
- [X] T079 为所有异步操作添加加载状态
- [X] T080 在 frontend/src/App.vue 中添加组件级错误边界
- [X] T081 在 frontend/src/router/index.ts 中实现路由守卫和认证
- [X] T082 [P] 在 frontend/tests/unit/ 中添加工具函数的单元测试
- [X] T083 [P] 在 frontend/tests/unit/ 中添加组合式函数的单元测试
- [X] T084 在 frontend/tests/components/ 中添加关键组件的组件测试
- [X] T085 运行 quickstart.md 验证检查清单
- [X] T086 在 frontend/ 中构建生产版本并测试

---

## 依赖关系与执行顺序

### 阶段依赖

- **设置（阶段 1）**：无依赖 - 可以立即开始
- **基础（阶段 2）**：依赖于设置完成 - **阻塞所有用户故事**
- **用户故事（阶段 3-7）**：都依赖于基础阶段完成
  - 用户故事可以按优先级顺序进行（P1 → P2 → P3 → P4 → P5）
- **优化（阶段 8）**：依赖于所有所需用户故事完成

### 用户故事依赖

- **用户故事 1（P1 - 漫画阅读体验）**：基础阶段后可以开始 - 不依赖其他故事
- **用户故事 2（P2 - 界面交互）**：基础阶段后可以开始 - 与 US1 UI 集成但独立可测试
- **用户故事 3（P3 - 图片加载与处理）**：基础阶段后可以开始 - 与 US1 图片显示集成但独立可测试
- **用户故事 4（P4 - 下载功能）**：基础阶段后可以开始 - 与 US2 菜单和 US3 图片处理集成但独立可测试
- **用户故事 5（P5 - 响应式设计）**：基础阶段后可以开始 - 适用于所有 UI 组件但独立可测试

### 每个用户故事内部

- 核心组件在集成之前
- UI 组件在事件处理之前
- 每个故事内标记 [P] 的任务可以并行运行

### 并行机会

- 所有设置任务（T001-T014）标记 [P] 可以并行运行
- 所有基础任务（T016-T026）标记 [P] 可以并行运行（在阶段 2 内）
- 基础阶段完成后，用户故事可以按优先级顺序进行
- 在每个用户故事内，标记 [P] 的并行任务可以一起运行

---

## 并行示例：设置阶段

```bash
# 一起启动所有设置任务（不同文件，无依赖）：
任务: "在 frontend/ 中初始化 Vue 3 + TypeScript + Vite 项目"
任务: "在 frontend/vite.config.ts 中配置 Vite"
任务: "在 frontend/tsconfig.json 中配置 TypeScript"
任务: "在 frontend/.eslintrc.cjs 中创建 ESLint 配置"
任务: "在 frontend/.prettierrc 中创建 Prettier 配置"
任务: "在 frontend/src/assets/css/theme.css 中创建 CSS 变量"
任务: "在 frontend/src/router/index.ts 中配置 Vue Router"
任务: "在 frontend/src/stores/index.ts 中配置 Pinia 状态管理"
任务: "在 frontend/src/components/common/ 中创建基础组件结构"
```

---

## 并行示例：基础阶段

```bash
# 一起启动所有基础任务（不同文件）：
任务: "在 frontend/src/types/index.ts 中定义 TypeScript 接口"
任务: "在 frontend/src/utils/errorHandler.ts 中实现错误处理工具"
任务: "在 frontend/src/utils/cache.ts 中实现缓存工具"
任务: "在 frontend/src/utils/token.ts 中实现令牌生成工具"
任务: "在 frontend/src/composables/useImageProcessor.ts 中实现图片处理组合式函数"
任务: "在 frontend/src/services/api.ts 中实现带有令牌认证的 API 服务"
任务: "在 frontend/src/stores/manga.ts 中创建 Pinia 漫画状态管理"
任务: "在 frontend/src/stores/app.ts 中创建 Pinia 应用状态管理"
任务: "在 frontend/src/stores/settings.ts 中创建 Pinia 设置状态管理"
```

---

## 实施策略

### MVP 优先（仅用户故事 1）

1. 完成阶段 1：设置
2. 完成阶段 2：基础（关键 - 阻塞所有故事）
3. 完成阶段 3：用户故事 1（漫画阅读体验）
4. **停止并验证**：独立测试漫画 ID 输入、章节选择和页面浏览
5. 如果准备好，部署/演示

### 增量交付

1. 完成 Setup + Foundational → 基础就绪
2. 添加用户故事 1 → 独立测试 → 部署/演示（MVP！）
3. 添加用户故事 2 → 独立测试 → 部署/演示（完整 UI 交互）
4. 添加用户故事 3 → 独立测试 → 部署/演示（图片处理优化）
5. 添加用户故事 4 → 独立测试 → 部署/演示（下载功能）
6. 添加用户故事 5 → 独立测试 → 部署/演示（响应式设计）
7. 每个故事都增加价值，且不破坏之前的故事

### 并行团队策略

使用多个开发者：

1. 团队一起完成 Setup + Foundational
2. Foundational 完成后：
   - 开发者 A：用户故事 1（漫画阅读体验）
   - 开发者 B：用户故事 2（界面交互）
   - 开发者 C：用户故事 3（图片加载与处理）
3. 故事完成并独立集成

---

## 注意事项

- [P] 任务 = 不同文件，无依赖
- [Story] 标签将任务映射到特定用户故事以便追溯
- 每个用户故事都应该独立可完成和可测试
- 测试是可选的 - 根据规范未包含
- 在每个任务或逻辑组之后提交
- 在任何检查点停止以独立验证故事
- 避免：模糊任务、相同文件冲突、破坏独立性的跨故事依赖
