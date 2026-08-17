# boxueduocai Astro Blog

这是基于 `index4_fixed_optimized.html` 工程化迁移得到的 Astro 博客项目。

## 技术栈

- Astro
- TypeScript
- 原生客户端 JavaScript
- 原始 CSS / Liquid Glass
- Font Awesome CDN

没有强制引入 React、Vue、Svelte、Tailwind 或 jQuery。

## 目录

- `src/components/`：页面组件
- `src/data/`：文章和音乐数据
- `src/scripts/app.ts`：原 HTML 客户端交互逻辑及 Astro 客户端绑定
- `src/styles/global.css`：原 HTML 完整 CSS
- `public/assets/images/`：本地图片
- `public/assets/music/`：本地音乐
- `.github/workflows/deploy.yml`：GitHub Pages 部署

## 本地资源

请将原 HTML 引用的实际二进制文件放入：

```text
public/assets/images/1000067252_2.jpg
public/assets/music/爱情信息.mp3
public/assets/music/song2.mp3
```

原 HTML 本身只包含引用路径，不包含这些二进制文件。

## 开发

```bash
pnpm install
pnpm dev
```

## 构建

```bash
pnpm build
```

## GitHub Pages

如果仓库是：

```text
用户名.github.io
```

工作流会自动识别为用户站点。

如果仓库是普通项目仓库，例如：

```text
用户名/blog
```

工作流会自动将 Astro `base` 设置为：

```text
/blog
```

因此不需要手动修改 `astro.config.mjs`。

GitHub 仓库 Settings → Pages → Source 选择 GitHub Actions。

## Vercel

直接将仓库导入 Vercel，框架选择 Astro，构建命令：

```text
pnpm build
```

输出目录：

```text
dist
```

## Cloudflare Pages

构建命令：

```text
pnpm build
```

输出目录：

```text
dist
```

## 评论系统说明

原 HTML 中评论没有后端 API，也没有 localStorage/sessionStorage 持久化。

因此本项目保留原来的前端内存状态行为：

- 发布评论后当前页面可见
- 刷新页面后评论状态恢复为初始 HTML 状态

没有虚构服务器持久化。

## 文章系统说明

文章仍然使用原 HTML 的全屏 FLIP 展开 / 收起体验，而不是简单改成普通页面跳转。

文章标题、日期、分类、摘要和正文来自：

```text
src/data/posts.ts
```

新增文章时可以复制一个 `Post` 对象。

## 音乐系统说明

音乐数据来自：

```text
src/data/music.ts
```

播放器逻辑来自原 HTML 的客户端 JavaScript，并保留：

- 播放
- 暂停
- 上一首
- 下一首
- 进度
- 封面旋转
- 浮动播放器
- 大播放器
- 音乐弹窗

## 注意

请不要删除原来的 CSS 变量、backdrop-filter、动画和状态 class。这些内容是原始 Liquid Glass UI 和文章 / 评论动画的基础。
