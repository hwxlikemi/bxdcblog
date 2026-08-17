export interface Post {
  id: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  content: string;
}

export const posts: Post[] = [
  {
    "id": "post-1",
    "title": "我的第一篇博客文章标题",
    "date": "2026-08-16",
    "category": "技术折腾",
    "content": "欢迎来到我的全新博客！\\n\\n这里记录我折腾网站、Android、Linux、AI以及各种技术的过程。\\n\\n这一次重新设计了博客的视觉效果，加入了更加通透的液态玻璃效果，同时重新制作了文章卡片展开动画。\\n\\n点击文章之后，卡片会从当前位置自然展开到整个屏幕，而不是突然跳转到一个新的页面。\\n\\n在右侧我们加入了全新的互动工具栏，并且打通了丝滑的全屏扩散评论系统！",
    "excerpt": "欢迎来到全新的液态玻璃博客站点，点击查看完整文章与界面细节……"
  },
  {
    "id": "vercel",
    "title": "关于博客搭建与迁移 Vercel 的二三事",
    "date": "2026-08-15",
    "category": "日常随笔",
    "content": "记录一下将静态博客托管到 Vercel 和 GitHub Pages 的过程。\\n\\n从最开始只有一个 HTML 文件，到后来加入液态玻璃视觉、响应式布局、文章展开动画和音乐播放器，这个博客也慢慢变成了一个真正属于自己的小站。\\n\\n折腾网站本身也是一种乐趣。",
    "excerpt": "记录使用 Vercel 与 GitHub Pages 构建个人站点的过程与心得……"
  }
];
