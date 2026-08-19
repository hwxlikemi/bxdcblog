// @ts-nocheck

/**
 * Markdown 增强
 *
 * 支持：
 * 1. 代码块复制按钮
 * 2. GitHub 仓库卡片 ::github{repo="用户/仓库"}
 * 3. 提示框 Admonitions :::note / :::tip / :::important / :::warning / :::caution
 *    支持自定义标题 :::note[标题]
 *    支持 GitHub 风格 > [!NOTE]
 * 4. 折叠剧透 :spoiler[内容]
 */

const ADMONITION_TITLES = {
    note: "说明",
    tip: "技巧",
    important: "重要",
    warning: "警告",
    caution: "注意",
};

const ADMONITION_ICONS = {
    note: "fa-circle-info",
    tip: "fa-lightbulb",
    important: "fa-triangle-exclamation",
    warning: "fa-circle-exclamation",
    caution: "fa-fire",
};

/**
 * 在注入 HTML 前处理自定义语法
 */
export function enhanceMarkdownHtml(html: string): string {
    let result = html;

    // 1. 提示框 :::type[标题] ... :::（渲染后在同一个 <p> 内，用换行分隔）
    result = result.replace(
        /<p>:::(note|tip|important|warning|caution)(?:\[([^\]]*)\])?\n([\s\S]*?)\n:::<\/p>/g,
        (match, type, title, content) => {
            const titleText = title || ADMONITION_TITLES[type] || type;
            const icon = ADMONITION_ICONS[type] || "fa-circle-info";
            return `<div class="admonition admonition-${type}">
                <div class="admonition-title"><i class="fa-solid ${icon}"></i>${titleText}</div>
                <div class="admonition-content">${content}</div>
            </div>`;
        }
    );

    // 2. GitHub 风格提示框 > [!NOTE]
    result = result.replace(
        /<blockquote>\s*<p>\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\n([\s\S]*?)<\/p>\s*<\/blockquote>/gi,
        (match, type, content) => {
            const typeLower = type.toLowerCase();
            const titleText = ADMONITION_TITLES[typeLower] || typeLower;
            const icon = ADMONITION_ICONS[typeLower] || "fa-circle-info";
            return `<div class="admonition admonition-${typeLower}">
                <div class="admonition-title"><i class="fa-solid ${icon}"></i>${titleText}</div>
                <div class="admonition-content">${content}</div>
            </div>`;
        }
    );

    // 3. 折叠剧透 :spoiler[内容]
    result = result.replace(
        /:spoiler\[([^\]]*)\]/g,
        '<span class="spoiler" tabindex="0">$1</span>'
    );

    // 4. GitHub 仓库卡片 ::github{repo="用户/仓库"}（兼容各种引号）
    result = result.replace(
        /<p>::github\{repo=([^}]+?)\}<\/p>/g,
        (match, repo) => {
            const cleanRepo = repo.replace(/^["'\u201c\u201d]|["'\u201c\u201d]$/g, "");
            return `<div class="github-card" data-repo="${cleanRepo}"><div class="github-card-loading"><i class="fa-brands fa-github"></i> 正在加载仓库信息...</div></div>`;
        }
    );

    return result;
}

/**
 * 在 DOM 注入后处理：代码块复制按钮、GitHub 卡片加载
 */
export function enhanceMarkdownDom(container: HTMLElement) {
    if (!container) return;

    // 1. 代码块复制按钮
    container.querySelectorAll("pre").forEach((pre) => {
        if (pre.querySelector(".copy-btn")) return;

        const btn = document.createElement("button");
        btn.className = "copy-btn";
        btn.type = "button";
        btn.innerHTML = '<i class="fa-regular fa-copy"></i> 复制';
        btn.addEventListener("click", async () => {
            const code = pre.querySelector("code");
            const text = code ? code.innerText : pre.innerText;
            try {
                await navigator.clipboard.writeText(text);
                btn.innerHTML = '<i class="fa-solid fa-check"></i> 已复制';
                btn.classList.add("copied");
                setTimeout(() => {
                    btn.innerHTML = '<i class="fa-regular fa-copy"></i> 复制';
                    btn.classList.remove("copied");
                }, 2000);
            } catch {
                btn.innerHTML = '<i class="fa-solid fa-xmark"></i> 失败';
                setTimeout(() => {
                    btn.innerHTML = '<i class="fa-regular fa-copy"></i> 复制';
                }, 2000);
            }
        });
        pre.appendChild(btn);
    });

    // 2. GitHub 仓库卡片
    container.querySelectorAll(".github-card[data-repo]").forEach((card) => {
        const repo = card.getAttribute("data-repo");
        if (!repo || card.classList.contains("loaded")) return;
        card.classList.add("loaded");
        loadGithubCard(card as HTMLElement, repo);
    });
}

/**
 * 加载 GitHub 仓库信息
 */
async function loadGithubCard(card: HTMLElement, repo: string) {
    try {
        const res = await fetch(`https://api.github.com/repos/${repo}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        card.innerHTML = `
            <a href="${data.html_url}" target="_blank" rel="noopener noreferrer" class="github-card-link">
                <div class="github-card-header">
                    <i class="fa-brands fa-github"></i>
                    <span class="github-card-repo">${data.full_name}</span>
                    ${data.fork ? '<span class="github-card-badge">Fork</span>' : ""}
                </div>
                <div class="github-card-desc">${data.description || "暂无描述"}</div>
                <div class="github-card-meta">
                    ${data.language ? `<span><i class="fa-solid fa-circle" style="color:${langColor(data.language)}"></i> ${data.language}</span>` : ""}
                    <span><i class="fa-regular fa-star"></i> ${data.stargazers_count}</span>
                    <span><i class="fa-solid fa-code-fork"></i> ${data.forks_count}</span>
                    <span><i class="fa-regular fa-eye"></i> ${data.watchers_count}</span>
                </div>
            </a>
        `;
    } catch (e) {
        card.innerHTML = `<div class="github-card-error"><i class="fa-solid fa-circle-exclamation"></i> 加载失败：${repo}</div>`;
    }
}

/**
 * 编程语言颜色（简化版）
 */
function langColor(lang: string): string {
    const colors: Record<string, string> = {
        JavaScript: "#f1e05a",
        TypeScript: "#3178c6",
        Python: "#3572A5",
        Java: "#b07219",
        "C++": "#f34b7d",
        C: "#555555",
        "C#": "#178600",
        Go: "#00ADD8",
        Rust: "#dea584",
        Vue: "#41b883",
        HTML: "#e34c26",
        CSS: "#563d7c",
        Shell: "#89e051",
        PHP: "#4F5D95",
        Ruby: "#701516",
        Swift: "#F05138",
        Kotlin: "#A97BFF",
        Dart: "#00B4AB",
    };
    return colors[lang] || "#8b949e";
}
