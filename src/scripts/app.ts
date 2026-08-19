// @ts-nocheck
import { playlist } from "../data/music";
import { siteConfig } from "../config";
import {
    submitComment,
    fetchComments,
    likeComment,
    type TwikooComment,
} from "./twikoo-api";

/* ================================================================
   1. 动态日历
================================================================ */

function renderDynamicCalendar() {

    const calendarTitle =
        document.getElementById("calendarTitle");

    const calendarGrid =
        document.getElementById("calendarGrid");

    const now = new Date();

    const year =
        now.getFullYear();

    const month =
        now.getMonth();

    const todayDate =
        now.getDate();

    calendarTitle.querySelector("span").innerText =
        `${year}年 ${month + 1}月`;

    const headers =
        calendarGrid.querySelectorAll(
            ".cal-day-header"
        );

    calendarGrid.innerHTML = "";

    headers.forEach(header => {
        calendarGrid.appendChild(header);
    });

    const firstDay =
        new Date(
            year,
            month,
            1
        ).getDay();

    const startOffset =
        firstDay === 0
            ? 6
            : firstDay - 1;

    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();

    for (
        let i = 0;
        i < startOffset;
        i++
    ) {

        const emptyCell =
            document.createElement("div");

        emptyCell.className =
            "cal-day";

        calendarGrid.appendChild(
            emptyCell
        );
    }

    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const dayCell =
            document.createElement("div");

        dayCell.className =
            "cal-day";

        dayCell.innerText =
            day;

        if (
            day === todayDate
        ) {

            dayCell.classList.add(
                "active"
            );
        }

        calendarGrid.appendChild(
            dayCell
        );
    }
}

renderDynamicCalendar();


/* ================================================================
   2. 玻璃参数实时调节
================================================================ */

const opacityRange =
    document.getElementById(
        "opacityRange"
    );

const blurRange =
    document.getElementById(
        "blurRange"
    );

const opacityVal =
    document.getElementById(
        "opacityVal"
    );

const blurVal =
    document.getElementById(
        "blurVal"
    );

opacityRange.addEventListener(
    "input",
    (e) => {

        document.documentElement.style.setProperty(
            "--glass-opacity",
            e.target.value
        );

        opacityVal.innerText =
            Math.round(
                e.target.value * 100
            ) + "%";
    }
);

blurRange.addEventListener(
    "input",
    (e) => {

        document.documentElement.style.setProperty(
            "--glass-blur",
            e.target.value + "px"
        );

        blurVal.innerText =
            e.target.value + "px";
    }
);

const refractiveRange =
    document.getElementById("refractiveRange");

const refractiveVal =
    document.getElementById("refractiveVal");

refractiveRange.addEventListener(
    "input",
    (e) => {
        const value = Number(e.target.value);
        document.documentElement.style.setProperty(
            "--glass-refractive-index",
            value
        );
        refractiveVal.innerText =
            value.toFixed(2);
    }
);


/* ================================================================
   3. Toast
================================================================ */

function showToast(msg) {

    const toast =
        document.getElementById(
            "glassToast"
        );

    toast.innerText =
        msg;

    toast.classList.add(
        "show"
    );

    setTimeout(
        () => {
            toast.classList.remove(
                "show"
            );
        },
        2200
    );
}


/* ================================================================
   4. 音乐播放器
================================================================ */

const currentPlaylist = playlist;



let currentTrackIndex = siteConfig.music.defaultTrackIndex;

const audioPlayer =
    document.getElementById(
        "audioPlayer"
    );

const largeCover =
    document.getElementById(
        "largeCover"
    );

const largeTitle =
    document.getElementById(
        "largeTitle"
    );

const largeArtist =
    document.getElementById(
        "largeArtist"
    );

const largeCurrTime =
    document.getElementById(
        "largeCurrTime"
    );

const largeDurTime =
    document.getElementById(
        "largeDurTime"
    );

const commonProgressBar =
    document.getElementById(
        "commonProgressBar"
    );

const commonProgressFill =
    document.getElementById(
        "commonProgressFill"
    );

const mainPlayBtn =
    document.getElementById(
        "mainPlayBtn"
    );

const mainPlayIcon =
    document.getElementById(
        "mainPlayIcon"
    );

const prevBtn =
    document.getElementById(
        "prevBtn"
    );

const nextBtn =
    document.getElementById(
        "nextBtn"
    );

const musicToggleBtn =
    document.getElementById(
        "musicToggleBtn"
    );

const musicPopover =
    document.getElementById(
        "musicPopover"
    );

const musicCover =
    document.getElementById(
        "musicCover"
    );

const popTitle =
    document.getElementById(
        "popTitle"
    );

const popArtist =
    document.getElementById(
        "popArtist"
    );

const popPlayBtn =
    document.getElementById(
        "popPlayBtn"
    );

const popPlayIcon =
    document.getElementById(
        "popPlayIcon"
    );

const popPrevBtn =
    document.getElementById(
        "popPrevBtn"
    );

const popNextBtn =
    document.getElementById(
        "popNextBtn"
    );


function loadTrack(index) {

    if (!currentPlaylist[index]) {
        return;
    }

    const track =
        currentPlaylist[index];

    audioPlayer.src =
        track.url;

    largeTitle.innerText =
        track.title;

    popTitle.innerText =
        track.title;

    largeArtist.innerText =
        track.artist;

    popArtist.innerText =
        track.artist;

    largeCover.src =
        track.cover;

    musicCover.src =
        track.cover;
}

loadTrack(
    currentTrackIndex
);


musicToggleBtn.addEventListener(
    "click",
    (e) => {

        e.stopPropagation();

        musicPopover.classList.toggle(
            "active"
        );
    }
);


document.addEventListener(
    "click",
    (e) => {

        if (
            !musicPopover.contains(e.target) &&
            e.target !== musicToggleBtn
        ) {

            musicPopover.classList.remove(
                "active"
            );
        }
    }
);


function togglePlay() {

    if (
        audioPlayer.paused
    ) {

        audioPlayer
            .play()
            .catch(
                () =>
                    showToast(
                        "正在尝试播放音频..."
                    )
            );

    } else {

        audioPlayer.pause();
    }
}


mainPlayBtn.addEventListener(
    "click",
    togglePlay
);

popPlayBtn.addEventListener(
    "click",
    togglePlay
);


prevBtn.addEventListener(
    "click",
    () => {

        currentTrackIndex =
            (
                currentTrackIndex -
                1 +
                currentPlaylist.length
            ) %
            currentPlaylist.length;

        loadTrack(
            currentTrackIndex
        );

        audioPlayer.play();
    }
);


popPrevBtn.addEventListener(
    "click",
    () =>
        prevBtn.click()
);


nextBtn.addEventListener(
    "click",
    () => {

        currentTrackIndex =
            (
                currentTrackIndex +
                1
            ) %
            currentPlaylist.length;

        loadTrack(
            currentTrackIndex
        );

        audioPlayer.play();
    }
);


popNextBtn.addEventListener(
    "click",
    () =>
        nextBtn.click()
);


audioPlayer.addEventListener(
    "play",
    () => {

        mainPlayIcon.className =
            "fa-solid fa-pause";

        popPlayIcon.className =
            "fa-solid fa-pause";

        largeCover.classList.add(
            "playing"
        );

        musicCover.classList.add(
            "playing"
        );
    }
);


audioPlayer.addEventListener(
    "pause",
    () => {

        mainPlayIcon.className =
            "fa-solid fa-play";

        popPlayIcon.className =
            "fa-solid fa-play";

        largeCover.classList.remove(
            "playing"
        );

        musicCover.classList.remove(
            "playing"
        );
    }
);


function formatTime(sec) {

    if (isNaN(sec)) {
        return "0:00";
    }

    const m =
        Math.floor(sec / 60);

    const s =
        Math.floor(sec % 60);

    return `${m}:${s < 10 ? "0" : ""}${s}`;
}


audioPlayer.addEventListener(
    "timeupdate",
    () => {

        if (
            audioPlayer.duration
        ) {

            const pct =
                (
                    audioPlayer.currentTime /
                    audioPlayer.duration
                ) * 100;

            commonProgressFill.style.width =
                pct + "%";

            largeCurrTime.innerText =
                formatTime(
                    audioPlayer.currentTime
                );

            largeDurTime.innerText =
                formatTime(
                    audioPlayer.duration
                );
        }
    }
);


commonProgressBar.addEventListener(
    "click",
    (e) => {

        const rect =
            commonProgressBar.getBoundingClientRect();

        const pos =
            (
                e.clientX -
                rect.left
            ) /
            rect.width;

        if (
            audioPlayer.duration
        ) {

            audioPlayer.currentTime =
                pos *
                audioPlayer.duration;
        }
    }
);


/* ================================================================
   5. 返回顶部
================================================================ */

document
    .getElementById("scrollTopBtn")
    .addEventListener(
        "click",
        () => {

            const articlePage =
                document.getElementById(
                    "articlePage"
                );

            const commentScroll =
                document.getElementById(
                    "commentListScroll"
                );

            if (
                document
                    .getElementById(
                        "commentPageOverlay"
                    )
                    .classList.contains(
                        "active"
                    )
            ) {

                commentScroll.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            } else if (
                document
                    .getElementById(
                        "articleOverlay"
                    )
                    .classList.contains(
                        "active"
                    )
            ) {

                articlePage.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            } else {

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }
        }
    );


/* ================================================================
   6. 文章 FLIP 动画
================================================================ */

let activeCard = null;

let isAnimating = false;

/** 当前打开的文章 ID，用于区分不同文章的评论 */
let currentPostId = "";

const overlay =
    document.getElementById(
        "articleOverlay"
    );

const articlePage =
    document.getElementById(
        "articlePage"
    );

const articleContent =
    document.getElementById(
        "articleContent"
    );

const backBtn =
    document.getElementById(
        "backBtn"
    );

const mainWrapper =
    document.getElementById(
        "mainWrapper"
    );


function openArticle(
    card,
    postId,
    title,
    date,
    category,
    content
) {

    if (
        isAnimating
    ) {
        return;
    }

    isAnimating = true;

    activeCard =
        card;

    // 记录当前文章 ID，用于评论区分
    currentPostId = postId;

    // 更新 URL hash，刷新后能恢复文章状态，也方便分享链接
    if (postId) {
        history.replaceState(null, "", `#post-${postId}`);
    }

    document.getElementById(
        "viewTitle"
    ).innerText =
        title;

    document.getElementById(
        "viewMeta"
    ).innerHTML =
        `
        <i class="fa-regular fa-calendar"></i>
        ${date}
        &nbsp;&nbsp;|&nbsp;&nbsp;
        <i class="fa-regular fa-folder"></i>
        ${category}
        `;

    document.getElementById(
        "viewBody"
    ).innerText =
        content;

    const first =
        card.getBoundingClientRect();

    /*
     * 进入文章：
     * 隐藏整个原页面。
     */
    document.body.classList.add(
        "article-mode"
    );

    overlay.classList.add(
        "active"
    );

    document.body.style.overflow =
        "hidden";

    articlePage.style.transition =
        "none";

    articlePage.style.transform =
        `
        translate3d(
            ${first.left}px,
            ${first.top}px,
            0
        )
        scale(
            ${first.width / window.innerWidth},
            ${first.height / window.innerHeight}
        )
        `;

    articlePage.style.borderRadius =
        "26px";

    articlePage.style.opacity =
        "1";

    articleContent.classList.remove(
        "content-visible"
    );

    articleContent.classList.add(
        "content-hidden"
    );

    card.classList.add(
        "morph-hidden"
    );

    articlePage.getBoundingClientRect();

    requestAnimationFrame(
        () => {

            articlePage.style.transition =
                `
                transform 430ms cubic-bezier(0.16, 1, 0.3, 1),
                border-radius 430ms cubic-bezier(0.16, 1, 0.3, 1)
                `;

            articlePage.style.transform =
                "translate3d(0,0,0) scale(1,1)";

            articlePage.style.borderRadius =
                "0px";

            setTimeout(
                () => {

                    articleContent.classList.remove(
                        "content-hidden"
                    );

                    articleContent.classList.add(
                        "content-visible"
                    );

                },
                260
            );

            setTimeout(
                () => {

                    isAnimating = false;

                },
                450
            );
        }
    );
}


function closeArticle() {

    if (
        !activeCard ||
        isAnimating
    ) {
        return;
    }

    isAnimating = true;

    articleContent.classList.remove(
        "content-visible"
    );

    articleContent.classList.add(
        "content-hidden"
    );

    /* 立即计算卡片位置，避免等待 110ms 导致返回时页面出现断层。 */
    const first =
        activeCard.getBoundingClientRect();

    articlePage.style.transition =
        `
        transform 390ms cubic-bezier(0.16, 1, 0.3, 1),
        border-radius 390ms cubic-bezier(0.16, 1, 0.3, 1)
        `;

    articlePage.style.transform =
        `
        translate3d(
            ${first.left}px,
            ${first.top}px,
            0
        )
        scale(
            ${first.width / window.innerWidth},
            ${first.height / window.innerHeight}
        )
        `;

    articlePage.style.borderRadius =
        "26px";

    /* 缩回动画结束前保持原卡片隐藏，结束时再一次性恢复。 */
    setTimeout(
        () => {
            overlay.classList.remove(
                "active"
            );

            document.body.classList.remove(
                "article-mode"
            );

            activeCard.classList.remove(
                "morph-hidden"
            );

            articlePage.style.transition =
                "none";

            articlePage.style.transform =
                "translate3d(0,0,0) scale(1)";

            articlePage.style.borderRadius =
                "0px";

            document.body.style.overflow =
                "";

            isAnimating = false;
            activeCard = null;
            currentPostId = "";

            // 清除 hash
            history.replaceState(null, "", window.location.pathname);
        },
        400
    );
}


backBtn.addEventListener(
    "click",
    (e) => {

        e.preventDefault();

        closeArticle();
    }
);


/* ================================================================
   7. 点赞
================================================================ */

const likeBtn =
    document.getElementById(
        "likeBtn"
    );

const likeIcon =
    document.getElementById(
        "likeIcon"
    );

const likeActionItem =
    document.getElementById(
        "likeActionItem"
    );

const likersPopover =
    document.getElementById(
        "likersPopover"
    );

let pressTimer = null;

let isLiked = false;


likeBtn.addEventListener(
    "click",
    () => {

        isLiked =
            !isLiked;

        if (
            isLiked
        ) {

            likeActionItem.classList.add(
                "liked"
            );

            likeIcon.className =
                "fa-solid fa-heart";

            showToast(
                "已点赞该文章"
            );

        } else {

            likeActionItem.classList.remove(
                "liked"
            );

            likeIcon.className =
                "fa-regular fa-heart";
        }
    }
);


function startPress() {

    clearTimeout(
        pressTimer
    );

    pressTimer =
        setTimeout(
            () => {

                likersPopover.classList.add(
                    "active"
                );

            },
            500
        );
}


function cancelPress() {

    clearTimeout(
        pressTimer
    );
}


likeBtn.addEventListener(
    "touchstart",
    startPress,
    {
        passive: true
    }
);

likeBtn.addEventListener(
    "mousedown",
    startPress
);

likeBtn.addEventListener(
    "touchend",
    cancelPress
);

likeBtn.addEventListener(
    "mouseup",
    cancelPress
);

likeBtn.addEventListener(
    "mouseleave",
    cancelPress
);


document.addEventListener(
    "click",
    (e) => {

        if (
            !likeActionItem.contains(
                e.target
            )
        ) {

            likersPopover.classList.remove(
                "active"
            );
        }
    }
);


/* ================================================================
   8. 分享
================================================================ */



/* ================================================================
   9. 评论页面 —— 从评论按钮扩散
================================================================ */

const commentBtn =
    document.getElementById(
        "commentBtn"
    );

const commentPageOverlay =
    document.getElementById(
        "commentPageOverlay"
    );

const commentCurtain =
    document.getElementById(
        "commentCurtain"
    );

const commentPageBackBtn =
    document.getElementById(
        "commentPageBackBtn"
    );


let commentAnimationLocked =
    false;


/*
 * 打开评论。
 *
 * 核心：
 * 先记录评论按钮中心点，
 * 然后让 clip-path 从 0px 扩张到 150vmax。
 */
commentBtn.addEventListener(
    "click",
    () => {

        if (
            commentAnimationLocked
        ) {
            return;
        }

        commentAnimationLocked =
            true;

        const rect =
            commentBtn.getBoundingClientRect();

        const cx =
            rect.left +
            rect.width / 2;

        const cy =
            rect.top +
            rect.height / 2;

        commentCurtain.style.setProperty(
            "--cx",
            cx + "px"
        );

        commentCurtain.style.setProperty(
            "--cy",
            cy + "px"
        );

        /*
         * 清除关闭状态。
         */
        commentPageOverlay.classList.remove(
            "closing"
        );

        /*
         * 显示页面。
         */
        commentPageOverlay.classList.add(
            "active"
        );

        /*
         * 等动画完成后解除锁定。
         */
        setTimeout(
            () => {

                commentAnimationLocked =
                    false;

            },
            590
        );
    }
);


/*
 * 评论页面返回。
 *
 * 不是直接消失，
 * 而是从整个屏幕重新缩回评论按钮。
 */
function closeCommentPage() {

    if (
        commentAnimationLocked
    ) {
        return;
    }

    commentAnimationLocked =
        true;

    commentPageOverlay.classList.add(
        "closing"
    );

    setTimeout(
        () => {

            commentPageOverlay.classList.remove(
                "active"
            );

            commentPageOverlay.classList.remove(
                "closing"
            );

            commentAnimationLocked =
                false;

        },
        590
    );
}


commentPageBackBtn.addEventListener(
    "click",
    closeCommentPage
);


/* ================================================================
   10. 评论 Emoji
================================================================ */


/* ================================================================
   12. 回复
================================================================ */

interface ReplyTarget {
    pid: string;   // 被回复的评论 ID
    rid: string;   // 所在楼 ID（主楼评论的 _id）
    nick: string;  // 被回复者昵称
}

let currentReplyTarget: ReplyTarget | null = null;

function prepareReply(comment: TwikooComment) {
    // 回复时：pid = 被回复评论的 _id，rid = 所在楼的 _id
    // 如果被回复的是主楼（rid 为空），则 rid = 该主楼的 _id
    const rid = comment.rid || comment._id;
    currentReplyTarget = {
        pid: comment._id,
        rid,
        nick: comment.nick || "匿名",
    };

    commentInputField.placeholder = `回复 @${comment.nick || "匿名"}...`;
    commentInputField.focus();
}

function cancelReply() {
    currentReplyTarget = null;
    commentInputField.placeholder = "善语结善缘，恶语伤人心...";
}


/* ================================================================
   13. HTML 转义
   防止评论直接插入 HTML。
================================================================ */

function escapeHtml(
    text: string
) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        text;

    return div.innerHTML;
}


/* ================================================================
   14. 发布评论（Twikoo API）
================================================================ */

const sendCommentBtn =
    document.getElementById(
        "sendCommentBtn"
    );

const commentListScroll =
    document.getElementById(
        "commentListScroll"
    );

const commentCount =
    document.getElementById(
        "commentCount"
    );

const commentNameField =
    document.getElementById(
        "commentNameField"
    ) as HTMLInputElement;

const commentEmailField =
    document.getElementById(
        "commentEmailField"
    ) as HTMLInputElement;

const commentInputField =
    document.getElementById(
        "commentInputField"
    ) as HTMLTextAreaElement;


sendCommentBtn?.addEventListener(
    "click",
    sendComment
);


async function sendComment() {

    const val =
        commentInputField.value.trim();

    const name =
        commentNameField.value.trim();

    const email =
        commentEmailField.value.trim();


    if (!name) {

        showToast(
            "请先填写昵称"
        );

        commentNameField.focus();

        return;
    }


    if (!val) {

        showToast(
            "请输入评论内容"
        );

        commentInputField.focus();

        return;
    }


    if (!email) {

        showToast(
            "请先填写邮箱"
        );

        commentEmailField.focus();

        return;
    }


    try {

        await submitComment({

            url: currentPostId || window.location.pathname,
            nick: name,
            mail: email,
            comment: val,
            pid: currentReplyTarget?.pid,
            rid: currentReplyTarget?.rid,

        });


        showToast(
            "评论发布成功！"
        );


        commentInputField.value = "";

        cancelReply();


        loadTwikooComments();


    } catch (e: any) {

        showToast(
            e?.message || "评论发布失败"
        );

    }

}



/* ================================================================
   Twikoo 评论加载与渲染
================================================================ */

/** 格式化相对时间 */
function formatRelativeTime(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;
    const min = Math.floor(diff / 60000);
    const hour = Math.floor(diff / 3600000);
    const day = Math.floor(diff / 86400000);

    if (min < 1) return "刚刚";
    if (min < 60) return `${min} 分钟前`;
    if (hour < 24) return `${hour} 小时前`;
    if (day < 30) return `${day} 天前`;

    const d = new Date(timestamp);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** 获取头像地址，优先用 Twikoo 返回的，fallback 到 dicebear */
function getAvatar(comment: TwikooComment): string {
    if (comment.avatar) return comment.avatar;
    const seed = encodeURIComponent(comment.nick || "user");
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
}

/** 渲染单条评论节点 */
function renderCommentNode(comment: TwikooComment): HTMLElement {
    const node = document.createElement("div");
    node.className = "comment-node";
    node.dataset.id = comment._id;

    const ups = comment.ups?.length || 0;

    node.innerHTML = `
        <img
            src="${getAvatar(comment)}"
            class="comment-avatar"
            alt=""
        />
        <div class="comment-content-box">
            <div class="comment-user-name">
                ${escapeHtml(comment.nick || "匿名")}
                ${comment.master ? '<span style="color:var(--accent);font-size:0.7rem;margin-left:6px;">博主</span>' : ""}
            </div>
            <div class="comment-text">${comment.comment || ""}</div>
            <div class="comment-bottom-meta">
                <span>${formatRelativeTime(comment.created)}</span>
                <span class="comment-reply-btn" data-action="reply">回复</span>
                <span class="comment-like-icon" data-action="like">
                    <i class="fa-regular fa-heart"></i>
                    <span class="c-like-num">${ups}</span>
                </span>
            </div>
            <div class="sub-comments-list" data-sub-list></div>
        </div>
    `;

    // 绑定回复按钮
    node.querySelector('[data-action="reply"]')?.addEventListener("click", () => {
        prepareReply(comment);
    });

    // 绑定点赞按钮
    const likeBtn = node.querySelector('[data-action="like"]') as HTMLElement;
    likeBtn?.addEventListener("click", async () => {
        const numEl = likeBtn.querySelector(".c-like-num") as HTMLElement;
        const iconEl = likeBtn.querySelector("i") as HTMLElement;
        const isActive = likeBtn.classList.contains("active");

        try {
            await likeComment(comment._id, "up");
            if (isActive) {
                likeBtn.classList.remove("active");
                iconEl.className = "fa-regular fa-heart";
                numEl.innerText = String(Math.max(0, ups - 1));
            } else {
                likeBtn.classList.add("active");
                iconEl.className = "fa-solid fa-heart";
                numEl.innerText = String(ups + 1);
            }
        } catch {
            showToast("点赞失败，请稍后重试");
        }
    });

    return node;
}

/** 把扁平评论列表组织成楼中楼结构 */
function buildCommentTree(comments: TwikooComment[]): TwikooComment[][] {
    const mains: TwikooComment[] = [];
    const replyMap = new Map<string, TwikooComment[]>();

    for (const c of comments) {
        if (!c.rid) {
            mains.push(c);
        } else {
            const list = replyMap.get(c.rid) || [];
            list.push(c);
            replyMap.set(c.rid, list);
        }
    }

    // 按时间排序：主楼倒序，回复正序
    mains.sort((a, b) => b.created - a.created);

    return mains.map((main) => {
        const replies = replyMap.get(main._id) || [];
        replies.sort((a, b) => a.created - b.created);
        return [main, ...replies];
    });
}

async function loadTwikooComments() {
    if (!commentListScroll) return;

    try {
        const result = await fetchComments({
            url: currentPostId || window.location.pathname,
        });

        const comments: TwikooComment[] = result.data || [];

        // 更新评论数
        if (commentCount) {
            commentCount.innerText = String(result.count || comments.length);
        }

        commentListScroll.innerHTML = "";

        if (comments.length === 0) {
            commentListScroll.innerHTML = `
                <div style="text-align:center;padding:40px 0;color:var(--text-secondary);font-size:0.9rem;">
                    暂无评论，来抢沙发吧～
                </div>
            `;
            return;
        }

        const trees = buildCommentTree(comments);

        for (const [main, ...replies] of trees) {
            const mainNode = renderCommentNode(main);
            const subList = mainNode.querySelector('[data-sub-list]') as HTMLElement;

            for (const reply of replies) {
                const replyNode = renderCommentNode(reply);
                replyNode.style.background = "rgba(255,255,255,0.08)";
                subList.appendChild(replyNode);
            }

            // 如果没有回复，移除子列表容器
            if (replies.length === 0) {
                subList.remove();
            }

            commentListScroll.appendChild(mainNode);
        }

    } catch (e) {
        console.error("Twikoo 加载失败", e);
        commentListScroll.innerHTML = `
            <div style="text-align:center;padding:40px 0;color:var(--text-secondary);font-size:0.9rem;">
                评论加载失败，请刷新重试
            </div>
        `;
    }
}

// 页面加载后自动拉取评论
loadTwikooComments();


/* ================================================================
   15. 评论点赞（已整合到 renderCommentNode 中）
================================================================ */


/* ================================================================
   16. ESC 键关闭
================================================================ */

document.addEventListener(
    "keydown",
    (e) => {

        if (
            e.key !== "Escape"
        ) {
            return;
        }

        if (
            commentPageOverlay.classList.contains(
                "active"
            )
        ) {

            closeCommentPage();

            return;
        }

        if (
            overlay.classList.contains(
                "active"
            )
        ) {

            closeArticle();
        }
    }
);

/* ================================================================
   Astro migration bindings
   原 HTML 使用 inline onclick。Astro 组件不依赖 inline handler，
   因此在客户端为文章卡片绑定同等行为。
================================================================ */

document.querySelectorAll(".post-card").forEach((card) => {
    const open = () => {
        const el = card as HTMLElement;
        openArticle(
            el,
            el.dataset.postId || "",
            el.dataset.title || "",
            el.dataset.date || "",
            el.dataset.category || "",
            el.dataset.content || ""
        );
    };

    card.addEventListener("click", open);
    card.addEventListener("keydown", (event) => {
        if ((event as KeyboardEvent).key === "Enter" || (event as KeyboardEvent).key === " ") {
            event.preventDefault();
            open();
        }
    });
});

/* 本地静态资源 fallback。 */
document.querySelectorAll("img[data-fallback]").forEach((img) => {
    img.addEventListener("error", () => {
        const element = img as HTMLImageElement;
        const fallback = element.dataset.fallback;
        if (fallback && element.src !== fallback) {
            element.src = fallback;
        }
    }, { once: true });
});

/* ================================================================
   17. URL Hash 同步
   打开文章时写入 #post-xxx，刷新/分享链接后能自动恢复。
================================================================ */

function openArticleByHash() {
    const match = window.location.hash.match(/^#post-(.+)$/);
    if (!match) return;

    const postId = match[1];
    const card = document.querySelector(`.post-card[data-post-id="${postId}"]`) as HTMLElement;
    if (card) {
        // 延迟一帧，确保 DOM 和样式就绪
        requestAnimationFrame(() => card.click());
    }
}

// 页面加载时恢复
window.addEventListener("load", openArticleByHash);

// 监听浏览器前进/后退
window.addEventListener("hashchange", () => {
    if (window.location.hash) {
        openArticleByHash();
    } else if (overlay?.classList.contains("active")) {
        closeArticle();
    }
});
