import { siteConfig } from "../config";

/**
 * Twikoo API 封装
 *
 * 保留自定义液态玻璃评论 UI，不加载 Twikoo 默认组件。
 * 所有请求 POST 到 Twikoo 云函数根地址，靠 body.event 区分动作。
 */

const envId = siteConfig.twikoo.envId.replace(/\/$/, "");

/** Twikoo 云函数地址（Vercel 部署即为根路径） */
function apiUrl() {
    return `${envId}/`;
}

/** 统一请求方法 */
async function twikooRequest<T = any>(body: Record<string, any>): Promise<T> {
    const res = await fetch(apiUrl(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        throw new Error(`Twikoo 请求失败: ${res.status}`);
    }

    return res.json();
}

/* ================================================================
   类型定义
================================================================ */

export interface TwikooComment {
    _id: string;
    id?: string;
    nick: string;
    mail?: string;
    mailMd5?: string;
    avatar?: string;
    link?: string;
    comment: string;        // 已清洗的 HTML
    commentText?: string;   // 纯文本
    created: number;        // 毫秒时间戳
    updated?: number;
    pid?: string;           // 父评论 ID（回复时有值）
    rid?: string;           // 所在楼 ID（回复时有值）
    ups?: string[];         // 点赞用户 ID
    downs?: string[];
    master?: boolean;       // 是否博主
    isSpam?: boolean;
    top?: boolean;
    ua?: string;
    ip?: string;
}

export interface CommentGetResult {
    data: TwikooComment[];
    more: boolean;
    count: number;
}

/* ================================================================
   1. 获取评论列表
================================================================ */

export interface FetchCommentsParams {
    url: string;
    before?: number;    // 分页：上一页最后一条的 created 时间戳
    sort?: "newest" | "oldest";
}

export async function fetchComments(
    params: FetchCommentsParams
): Promise<CommentGetResult> {
    return twikooRequest<CommentGetResult>({
        event: "COMMENT_GET",
        url: params.url,
        before: params.before,
        sort: params.sort || "newest",
    });
}

/* ================================================================
   2. 提交评论
================================================================ */

export interface SubmitCommentParams {
    url: string;
    nick: string;
    mail?: string;
    link?: string;
    comment: string;
    pid?: string;   // 回复的评论 ID
    rid?: string;   // 所在楼 ID（回复时传，主楼不传）
}

export async function submitComment(
    params: SubmitCommentParams
): Promise<{ id: string }> {
    return twikooRequest<{ id: string }>({
        event: "COMMENT_SUBMIT",
        url: params.url,
        ua: navigator.userAgent,
        nick: params.nick,
        mail: params.mail || "",
        link: params.link || "",
        comment: params.comment,
        pid: params.pid || "",
        rid: params.rid || "",
    });
}

/* ================================================================
   3. 点赞 / 反对 / 取消
================================================================ */

export async function likeComment(
    id: string,
    type: "up" | "down" = "up"
): Promise<{ updated: number }> {
    return twikooRequest<{ updated: number }>({
        event: "COMMENT_LIKE",
        id,
        type,
    });
}

/* ================================================================
   4. 批量获取文章评论数（首页/列表页用）
================================================================ */

export async function getCommentsCount(
    urls: string[],
    includeReply = false
): Promise<{ data: Array<{ url: string; count: number }> }> {
    return twikooRequest({
        event: "GET_COMMENTS_COUNT",
        urls,
        includeReply,
    });
}

/* ================================================================
   5. 获取最新评论（侧边栏用）
================================================================ */

export interface GetRecentCommentsParams {
    urls?: string[];
    pageSize?: number;
    includeReply?: boolean;
}

export async function getRecentComments(
    params: GetRecentCommentsParams = {}
): Promise<{ data: TwikooComment[] }> {
    return twikooRequest({
        event: "GET_RECENT_COMMENTS",
        urls: params.urls || [],
        pageSize: params.pageSize || 10,
        includeReply: params.includeReply || false,
    });
}
