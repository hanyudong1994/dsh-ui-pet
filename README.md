# dsh-desktop-pet

DeepSeek Harness 桌面宠物浏览器插件：一只悬浮在 Web GUI 右下角的小猫，随当前会话的活动状态实时变化。

English intro: a desktop pet browser plugin for DeepSeek Harness — a floating cat docked at the bottom-right of the Web GUI that reacts to the current session's activity.

## 特性

- **状态联动**：无当前会话 → 睡觉（`呼…`）；当前会话运行中 → 工作（`加油！`）；空闲 → 发呆（`喵？`）
- **点击互动**：点击宠物触发反应气泡，依次循环 `喵！` / `呼噜…` / `呀！`，700ms 后恢复状态文案
- **纯展示层**：只读取会话列表标准数据流，不写会话日志、对模型不可见，零副作用
- **框架原生接入**：注册到 `shell.overlay` 列表槽，随插件卸载自动清理，热更新友好

## 兼容性

- 针对 **deepseek-harness npm 公开发布线 `0.0.1-rc.1`**（`@deepseek-ai/cordis@^4.0.1`）构建
- deepseek-harness 处于 pre-release 阶段，上游接口可能变化；如升级后失效请以新版本重新构建并提 Issue

## 安装（集成到你的 dsh 源码检出）

本插件是**浏览器侧 client 插件**，dsh 目前没有树外加载路径。上游 npm 公开线尚未发布完整
（部分 `@deepseek-ai/dsh-*` 依赖缺失），因此当前唯一可靠的安装方式是把插件目录放进你自己的
[deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) 源码检出（clone 一个即可，无需 fork 上游）：

1. **放入插件目录**：把本仓库的 `src/`、`tests/`、`package.json`、`tsconfig.json`、`tsdown.config.ts`
   复制到检出的 `packages/client/ui-pet/`（保留包名 `dsh-desktop-pet`）。

2. **加入 client 聚合引用**：编辑检出的 `tsconfig.client.json`，在 `references` 中加入：

   ```json
   { "path": "./packages/client/ui-pet" }
   ```

3. **注册依赖**：编辑 `packages/bundle/web-app/package.json`，在 `dependencies` 中加入：

   ```json
   "dsh-desktop-pet": "workspace:^"
   ```

4. **注册插件行**：编辑 `packages/bundle/web-app/cordis.patch.yml`，在浏览器插件名单
   （`# browser plugin roster` 的 `insert:` 列表）中加入：

   ```yaml
   # The desktop pet: a floating companion in the frame overlay.
   - id: ui-pet
     name: 'dsh-desktop-pet'
   ```

5. **添加源码路径映射**：编辑检出根目录的 `tsconfig.base.json`，在 `paths` 中加入：

   ```json
   "dsh-desktop-pet": ["./packages/client/ui-pet/src"],
   "dsh-desktop-pet/client": ["./packages/client/ui-pet/src/client"]
   ```

6. **安装并重建**：

   ```sh
   pnpm install
   pnpm run build
   ```

7. **重启并查看**：重启 `pnpm dsh web`，刷新页面，右下角即出现宠物。

**卸载**：反向删除第 2–5 步的内容并删除 `packages/client/ui-pet/`，再 `pnpm install && pnpm run build`。

> **npm 方式**：`pnpm --filter @deepseek-ai/dsh-web-app add dsh-desktop-pet` 配合
> `cordis.patch.yml` 行与 `tsconfig.base.json` 中指向 `./node_modules/dsh-desktop-pet/src`
> 的映射，待上游 npm 线补全（`@deepseek-ai/dsh-compact` 等包发布）后即可使用。
> 若 pnpm 对插件内部依赖的版本范围发出警告，属正常：工作区内的同名包优先链接。

## 本地开发

上游 npm 线补全前，本仓库无法独立 `pnpm install`（`@deepseek-ai/dsh-compact` 等依赖尚未发布）。
开发时请按上一节把目录放进 dsh 检出，在检出内执行：

```sh
pnpm install
pnpm run build      # tsc 产出类型 + tsdown 打包 node 侧与浏览器 bundle
pnpm run typecheck
pnpm test           # vitest：组件、状态推导、注册/卸载、invariant
pnpm run watch      # tsdown 监听重打包（配合 dsh 的 dev:web 热更新）
```

## 工作原理

- 浏览器侧通过 `ctx.slots.inject('shell.overlay', ...)` 注册 `pet` 列表条目，
  等待 ui-layout 的框架声明后挂载，随插件 fiber 卸载
- 状态由 `useSessions` 从会话列表推导（`current` + 当前行 `running`），
  不建立任何自己的订阅
- 打包产物 `lib/client.js` 经 `window.__ModuleLoader__.load({ id, factory })`
  交给 dsh 的模块表，外部依赖（react、cordis 等）由 shell 注入

## 许可证

MIT。代码衍生自 deepseek-harness（MIT，Copyright (c) 2026 DeepSeek），
版权行见 [LICENSE](./LICENSE)。
