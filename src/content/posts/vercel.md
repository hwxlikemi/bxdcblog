---
title: 关于博客搭建与迁移 Vercel 的二三事
date: "2026-08-15"
category: 日常随笔
tags: ["Vercel", "部署", "GitHub Pages"]
excerpt: 记录使用 Vercel 与 GitHub Pages 构建个人站点的过程与心得……
---

记录一下将静态博客托管到 Vercel 和 GitHub Pages 的过程。

从最开始只有一个 HTML 文件，到后来加入液态玻璃视觉、响应式布局、文章展开动画和音乐播放器，这个博客也慢慢变成了一个真正属于自己的小站。

折腾网站本身也是一种乐趣。

## Markdown 兼容性测试

这篇文章同时包含标准 Markdown 和内联 HTML，验证博客的渲染能力。

### 标准 Markdown

- 无序列表项一
- 无序列表项二
- 无序列表项三

1. 有序列表项一
2. 有序列表项二
3. 有序列表项三

> 这是一段引用文字，用于测试 blockquote 样式。

`inline code` 行内代码测试。

```javascript
// 代码块测试
function hello() {
  console.log("Hello, World!");
}
```

### 内联 HTML 测试

下面是一个自定义样式的提示框：

<div style="background: rgba(255,255,255,0.15); padding: 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.3); margin: 16px 0;">
  <strong>💡 提示：</strong>这是用内联 HTML 写的提示框，说明博客支持 md+html 混合渲染。
</div>

### iframe 嵌入测试

下面嵌入一个 Bilibili 视频（iframe）：
# BiliBili

<iframe src="//player.bilibili.com/player.html?isOutside=true&aid=116090667540095&bvid=BV1ALZDBtEfK&cid=36139303706&p=1&autoplay=0" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" style="width: 100%; aspect-ratio: 16/9; border-radius: 12px;"></iframe>

# YouTube
<iframe width="100%" height="410" src="https://www.youtube.com/embed/szn2R3_d8UA?si=BcIMHwwSnPT88s5d" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

也可以嵌入其他网站，例如 CodePen、YouTube 等。
