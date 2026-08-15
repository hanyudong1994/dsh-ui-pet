# dsh-ui-pet

DeepSeek Harness 桌面宠物浏览器插件：一只悬浮在 Web GUI 右下角的小猫，随当前会话的活动状态实时变化。

English intro: a desktop pet browser plugin for DeepSeek Harness — a floating cat docked at the bottom-right of the Web GUI that reacts to the current session's activity.

## 特性

- **状态联动**：无当前会话 → 睡觉（`呼…`）；当前会话运行中 → 工作（`加油！`）；空闲 → 发呆（`喵？`）
- **点击互动**：点击宠物触发反应气泡，依次循环 `喵！` / `呼噜…` / `呀！`，700ms 后恢复状态文案
- **纯展示层**：只读取会话列表标准数据流，不写会话日志、对模型不可见，零副作用
- **框架原生接入**：注册到 `shell.overlay` 列表槽，随插件卸载自动清理，热更新友好

## 兼容性

- 基于 **deepseek-harness npm 公开发布线 `0.1.0-rc.6`**（`@deepseek-ai/cordis@^4.0.1`）构建，
  已通过 install / typecheck / build / 16 项单元测试全量验证
- deepseek-harness 处于 pre-release 阶段，上游接口可能变化；如升级后失效请以新版本重新构建并提 Issue

## 安装（集成到你的 dsh 源码检出）

本插件是**浏览器侧 client 插件**，dsh 目前没有树外加载路径，需要把它接入你自己的
[deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) 源码检出（clone 一个即可，无需 fork 上游）。

### 方式一：npm 安装（插件发布到 npm 后）

1. **安装依赖**（在 dsh 检出目录中执行）：

   ```sh
   pnpm --filter @deepseek-ai/dsh-web-app add dsh-ui-pet
   ```

2. **注册插件行**：编辑 `packages/bundle/web-app/cordis.patch.yml`，在浏览器插件名单
   （`# browser plugin roster` 的 `insert:` 列表）中加入：

   ```yaml
   # The desktop pet: a floating companion in the frame overlay.
   - id: ui-pet
     name: 'dsh-ui-pet'
   ```

3. **添加源码路径映射**：编辑检出根目录的 `tsconfig.base.json`，在 `paths` 中加入
   （本插件随 npm 包发布 `src/`；该映射供 tsx 源码启动与 `verify-cordis-config` 解析裸包名）：

   ```json
   "dsh-ui-pet": ["./node_modules/dsh-ui-pet/src"],
   "dsh-ui-pet/client": ["./node_modules/dsh-ui-pet/src/client"]
   ```

4. **重建并重启**：`pnpm install && pnpm run build`，重启 `pnpm dsh web`，刷新页面即见宠物。

### 方式二：源码集成（不用等 npm）

把本仓库的 `src/`、`tests/`、`package.json`、`tsconfig.json`、`tsdown.config.ts`
复制到检出的 `packages/client/ui-pet/`，然后：

1. `tsconfig.client.json` 的 `references` 加入 `{ "path": "./packages/client/ui-pet" }`
2. `packages/bundle/web-app/package.json` 的 `dependencies` 加入 `"dsh-ui-pet": "workspace:^"`
3. `cordis.patch.yml` 按方式一第 2 步加行
4. `tsconfig.base.json` 的 `paths` 加入：

   ```json
   "dsh-ui-pet": ["./packages/client/ui-pet/src"],
   "dsh-ui-pet/client": ["./packages/client/ui-pet/src/client"]
   ```

5. `pnpm install && pnpm run build`，重启 `pnpm dsh web`

**卸载**：反向删除对应步骤的内容，再 `pnpm install && pnpm run build`。

## 本地开发

本仓库可独立开发（依赖全部来自 npm）：

```sh
pnpm install
pnpm run build      # tsc 产出类型 + tsdown 打包 node 侧与浏览器 bundle
pnpm run typecheck
pnpm test           # vitest：组件、状态推导、注册/卸载、invariant（16 项）
pnpm run watch      # tsdown 监听重打包（配合 dsh 的 dev:web 热更新）
```

发布：`npm publish`（`prepublishOnly` 已配置为自动构建）。

## 工作原理

- 浏览器侧通过 `ctx.slots.inject('shell.overlay', ...)` 注册 `pet` 列表条目，
  等待 ui-layout 的框架声明后挂载，随插件 fiber 卸载
- 状态由 `useSessions` 从会话列表推导（`current` + 当前行 `running`），
  不建立任何自己的订阅
- 打包产物 `lib/client.js` 经 `window.__ModuleLoader__.load({ id, factory })`
  交给 dsh 的模块表，外部依赖（react、cordis 等）由 shell 注入；
  测试侧用 `tests/setup-module-loader.ts` 模拟同一加载协议，从而在 node 环境下
  直接运行发布的浏览器 bundle

## 许可证

MIT。代码衍生自 deepseek-harness（MIT，Copyright (c) 2026 DeepSeek），
版权行见 [LICENSE](./LICENSE)。

