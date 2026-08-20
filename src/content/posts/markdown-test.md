---
title: Markdown 增强功能测试
date: "2026-08-19"
category: 技术折腾
tags: ["Markdown", "测试", "前端"]
excerpt: 测试代码块复制、提示框、GitHub卡片、折叠剧透等增强功能……
---

这篇文章用于测试博客的 Markdown 增强功能。

## 代码块复制按钮

鼠标悬停在代码块右上角会出现「复制」按钮：

```javascript
function hello() {
  console.log("Hello, World!");
  return {
    status: "ok",
    data: [1, 2, 3],
  };
}
```

```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))
```

## 提示框 Admonitions

### 标准语法

:::note
这是一个说明提示框，用于展示普通信息。
:::

:::tip
这是一个技巧提示框，用于展示实用小技巧。
:::

:::important
这是一个重要提示框，用于展示需要特别关注的信息。
:::

:::warning
这是一个警告提示框，用于展示需要注意的风险。
:::

:::caution
这是一个谨慎提示框，用于展示高风险操作提醒。
:::

### 自定义标题

:::note[我的自定义标题]
这是一个带有自定义标题的说明提示框。
支持多行内容。
:::

### GitHub 兼容语法

> [!NOTE]
> GitHub 语法的说明提示框。
> 支持多行内容。

> [!TIP]
> GitHub 语法的技巧提示框。

## 折叠剧透 Spoiler

这是普通文本，剧透内容：:spoiler[被隐藏的**剧透内容**（支持粗体等 Markdown 语法）]！

鼠标悬停或点击即可显示。

## GitHub 仓库卡片

::github{repo="hwxlikemi/bxdcblog"}


