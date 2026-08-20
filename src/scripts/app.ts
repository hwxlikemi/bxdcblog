// @ts-nocheck
import { playlist } from "../data/music";
import { siteConfig } from "../config";
import {
    submitComment,
    fetchComments,
    likeComment,
    type TwikooComment,
} from "./twikoo-api";
import { enhanceMarkdownHtml, enhanceMarkdownDom } from "./markdown-enhance";

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

if (opacityRange && opacityVal) {
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
}

if (blurRange && blurVal) {
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
}

const refractiveRange =
    document.getElementById("refractiveRange");

const refractiveVal =
    document.getElementById("refractiveVal");

if (refractiveRange && refractiveVal) {
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
}


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
   4.5 播放列表
================================================================ */

const playlistOverlay =
    document.getElementById("playlistOverlay");

const playlistItems =
    document.getElementById("playlistItems");

const playlistClose =
    document.getElementById("playlistClose");

const listBtn =
    document.getElementById("listBtn");

const popListBtn =
    document.getElementById("popListBtn");

function renderPlaylist() {
    if (!playlistItems) return;

    playlistItems.innerHTML = "";

    currentPlaylist.forEach((track, index) => {
        const item = document.createElement("div");
        item.className = "playlist-item";
        if (index === currentTrackIndex) {
            item.classList.add("active");
        }
        item.innerHTML = `
            <div class="playlist-item-index">${index + 1}</div>
            <div class="playlist-item-info">
                <div class="playlist-item-title">${track.title}</div>
                <div class="playlist-item-artist">${track.artist}</div>
            </div>
            <div class="playlist-item-play">
                <i class="fa-solid ${index === currentTrackIndex && !audioPlayer.paused ? 'fa-pause' : 'fa-play'}"></i>
            </div>
        `;
        item.addEventListener("click", () => {
            currentTrackIndex = index;
            loadTrack(index);
            audioPlayer.play();
            renderPlaylist();
        });
        playlistItems.appendChild(item);
    });
}

function togglePlaylist() {
    if (!playlistOverlay) return;
    renderPlaylist();
    playlistOverlay.classList.toggle("active");
}

if (listBtn) {
    listBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        togglePlaylist();
    });
}

if (popListBtn) {
    popListBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        togglePlaylist();
    });
}

if (playlistClose) {
    playlistClose.addEventListener("click", () => {
        playlistOverlay.classList.remove("active");
    });
}

if (playlistOverlay) {
    playlistOverlay.addEventListener("click", (e) => {
        if (e.target === playlistOverlay) {
            playlistOverlay.classList.remove("active");
        }
    });
}

// 播放状态变化时更新播放列表高亮
audioPlayer.addEventListener("play", () => {
    if (playlistOverlay?.classList.contains("active")) {
        renderPlaylist();
    }
});

audioPlayer.addEventListener("pause", () => {
    if (playlistOverlay?.classList.contains("active")) {
        renderPlaylist();
    }
});


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
   6. 文章卡片 Morph 动画（iOS26 风格，支持打断）
================================================================ */

let activeCard = null;

/** 当前打开的文章 ID，用于区分不同文章的评论 */
let currentPostId = "";

/** 页面变形动画 */
let articleAnimation = null;
/** 背景变暗动画 */
let backgroundAnimation = null;
/** 内容淡入定时器 */
let contentFadeTimer = null;
/** 点击瞬间保存的源卡片几何，返回绝不重新计算 */
let activeMorphRect = null;
/** 按压定时器 */
let pressTimer = null;

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

/* 动画参数 */
const OPEN_DURATION = 480;
const CLOSE_DURATION = 420;
const EASE_OUT_CUBIC = "cubic-bezier(0.33, 1, 0.68, 1)";
const EASE_IN_OUT_CUBIC = "cubic-bezier(0.65, 0, 0.35, 1)";
const CONTENT_FADE_DELAY = 280;

/** 取消所有正在运行的动画 */
function cancelAllAnimations() {
    if (articleAnimation) {
        articleAnimation.cancel();
        articleAnimation = null;
    }
    if (backgroundAnimation) {
        backgroundAnimation.cancel();
        backgroundAnimation = null;
    }
    if (contentFadeTimer) {
        clearTimeout(contentFadeTimer);
        contentFadeTimer = null;
    }
    if (pressTimer) {
        clearTimeout(pressTimer);
        pressTimer = null;
    }
}

/** 显示文章内容（淡入） */
function showArticleContent() {
    if (contentFadeTimer) clearTimeout(contentFadeTimer);
    contentFadeTimer = setTimeout(() => {
        articleContent.classList.remove("content-hidden");
        articleContent.classList.add("content-visible");
        contentFadeTimer = null;
    }, CONTENT_FADE_DELAY);
}

/** 隐藏文章内容 */
function hideArticleContent() {
    if (contentFadeTimer) {
        clearTimeout(contentFadeTimer);
        contentFadeTimer = null;
    }
    articleContent.classList.remove("content-visible");
    articleContent.classList.add("content-hidden");
}

function openArticle(
    card,
    postId,
    title,
    date,
    category
) {
    cancelAllAnimations();

    activeCard = card;
    currentPostId = postId;

    const rect = card.getBoundingClientRect();

    // 永久保存"点击瞬间"的源几何，返回绝不重新计算
    activeMorphRect = {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
    };

    if (postId) {
        history.replaceState(null, "", `#post-${postId}`);
    }

    document.getElementById("viewTitle").innerText = title;
    document.getElementById("viewMeta").innerHTML = `
        <i class="fa-regular fa-calendar"></i>
        ${date}
        &nbsp;&nbsp;|&nbsp;&nbsp;
        <i class="fa-regular fa-folder"></i>
        ${category}
    `;

    const template = card.querySelector("template[data-post-html]");
    const rawHtml = template ? template.innerHTML : "";
    const enhancedHtml = enhanceMarkdownHtml(rawHtml);
    const viewBody = document.getElementById("viewBody");
    viewBody.innerHTML = enhancedHtml;
    enhanceMarkdownDom(viewBody);

    // 先准备文章页到源卡片位置，此时还未显示
    articlePage.style.transition = "none";
    articlePage.style.left = `${rect.left}px`;
    articlePage.style.top = `${rect.top}px`;
    articlePage.style.width = `${rect.width}px`;
    articlePage.style.height = `${rect.height}px`;
    articlePage.style.borderRadius = "26px";
    articlePage.style.opacity = "1";
    articlePage.style.visibility = "visible";
    articlePage.style.overflowY = "hidden";
    articlePage.style.pointerEvents = "none";
    articlePage.classList.add("ios26-glass-morph");

    hideArticleContent();

    // 强制布局，同一帧隐藏源卡片 + 显示文章页
    articlePage.getBoundingClientRect();
    card.classList.add("morph-hidden");

    document.body.classList.add("article-mode", "ios26-morph-running");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";

    // 背景渐暗（延迟 55ms，避免突然变暗）
    if (mainWrapper) {
        mainWrapper.style.transition = "none";
        mainWrapper.style.filter = "brightness(1) saturate(1)";
        backgroundAnimation = mainWrapper.animate(
            [
                { filter: "brightness(1) saturate(1)" },
                { filter: "brightness(.88) saturate(.98)", offset: .30 },
                { filter: "brightness(.55) saturate(.90)" }
            ],
            {
                duration: 245,
                delay: 55,
                easing: "cubic-bezier(.22,1,.36,1)",
                fill: "forwards"
            }
        );
    }

    // 核心 Morph：left/top/width/height 几何变换，无 scale
    const W = window.innerWidth;
    const H = window.innerHeight;

    articleAnimation = articlePage.animate(
        [
            {
                left: `${rect.left}px`,
                top: `${rect.top}px`,
                width: `${rect.width}px`,
                height: `${rect.height}px`,
                borderRadius: "26px",
                boxShadow: "0 8px 30px rgba(0,0,0,.12), inset 0 1px 0 rgba(255,255,255,.30)"
            },
            {
                left: `${rect.left - rect.width * .28}px`,
                top: `${rect.top - rect.height * .32}px`,
                width: `${rect.width * 1.56}px`,
                height: `${rect.height * 1.72}px`,
                borderRadius: "42px",
                boxShadow: "0 18px 48px rgba(0,0,0,.16), inset 0 1px 0 rgba(255,255,255,.34)"
            },
            {
                left: `${-W * .008}px`,
                top: `${-H * .008}px`,
                width: `${W * 1.016}px`,
                height: `${H * 1.016}px`,
                borderRadius: "7px",
                boxShadow: "0 22px 60px rgba(0,0,0,.10), inset 0 1px 0 rgba(255,255,255,.22)"
            },
            {
                left: "0px",
                top: "0px",
                width: `${W}px`,
                height: `${H}px`,
                borderRadius: "0px",
                boxShadow: "0 0 0 rgba(0,0,0,0), inset 0 1px 0 rgba(255,255,255,.10)"
            }
        ],
        {
            duration: OPEN_DURATION,
            easing: "linear(0, .10 7%, .25 18%, .48 35%, .70 53%, .85 69%, .94 82%, .992 91%, 1.006 96%, .999 99%, 1 100%)",
            fill: "forwards"
        }
    );

    // 200ms 后内容渐显
    contentFadeTimer = setTimeout(() => {
        if (!activeCard) return;
        showArticleContent();
    }, 200);

    articleAnimation.onfinish = () => {
        if (!activeCard) return;
        // 关键修复：移除 ios26-glass-morph 类，恢复 overflow 和交互
        articlePage.classList.remove("ios26-glass-morph");
        articlePage.classList.add("ios26-glass-settled");
        articlePage.style.left = "0px";
        articlePage.style.top = "0px";
        articlePage.style.width = "100vw";
        articlePage.style.height = "100vh";
        articlePage.style.borderRadius = "0px";
        articlePage.style.overflowY = "auto";
        articlePage.style.pointerEvents = "auto";
        articleAnimation = null;
    };
}


function closeArticle() {
    if (!activeCard) return;

    // 打开动画尚未结束：直接反向同一条 Web Animation，原路返回
    if (articleAnimation && articleAnimation.playState === "running") {
        hideArticleContent();
        articleAnimation.reverse();
        articleAnimation.onfinish = () => {
            finishCloseArticle();
        };
        if (backgroundAnimation) {
            backgroundAnimation.reverse();
        }
        return;
    }

    hideArticleContent();

    const rect = activeMorphRect;
    if (!rect) {
        finishCloseArticle();
        return;
    }

    // 正常返回也使用点击瞬间保存的 sourceRect
    articleAnimation = articlePage.animate(
        [
            {
                left: "0px",
                top: "0px",
                width: "100vw",
                height: "100vh",
                borderRadius: "0px"
            },
            {
                left: `${-window.innerWidth * .008}px`,
                top: `${-window.innerHeight * .008}px`,
                width: `${window.innerWidth * 1.016}px`,
                height: `${window.innerHeight * 1.016}px`,
                borderRadius: "7px"
            },
            {
                left: `${rect.left - rect.width * .28}px`,
                top: `${rect.top - rect.height * .32}px`,
                width: `${rect.width * 1.56}px`,
                height: `${rect.height * 1.72}px`,
                borderRadius: "42px"
            },
            {
                left: `${rect.left}px`,
                top: `${rect.top}px`,
                width: `${rect.width}px`,
                height: `${rect.height}px`,
                borderRadius: "26px"
            }
        ],
        {
            duration: CLOSE_DURATION,
            easing: "linear(0, .015 6%, .09 17%, .25 34%, .48 53%, .68 70%, .84 84%, .95 94%, 1 100%)",
            fill: "forwards"
        }
    );

    if (mainWrapper) {
        if (backgroundAnimation) backgroundAnimation.cancel();
        backgroundAnimation = mainWrapper.animate(
            [
                { filter: "brightness(.55) saturate(.90)" },
                { filter: "brightness(.82) saturate(.97)", offset: .70 },
                { filter: "brightness(1) saturate(1)" }
            ],
            {
                duration: 245,
                easing: "cubic-bezier(.22,1,.36,1)",
                fill: "forwards"
            }
        );
    }

    setTimeout(() => {
        if (activeCard) {
            activeCard.classList.remove("morph-hidden");
        }
    }, 205);

    articleAnimation.onfinish = () => {
        finishCloseArticle();
    };
}

/** 关闭动画结束后的清理 */
function finishCloseArticle() {
    if (articleAnimation) {
        articleAnimation.cancel();
    }
    if (backgroundAnimation) {
        backgroundAnimation.cancel();
    }

    overlay.classList.remove("active");
    document.body.classList.remove("article-mode", "ios26-morph-running");

    if (activeCard) {
        activeCard.classList.remove("morph-hidden");
        activeCard.style.transform = "";
        activeCard.style.opacity = "";
    }

    // 清理所有 inline style，恢复 CSS 默认值
    articlePage.style.transition = "none";
    articlePage.style.left = "";
    articlePage.style.top = "";
    articlePage.style.width = "";
    articlePage.style.height = "";
    articlePage.style.borderRadius = "";
    articlePage.style.opacity = "";
    articlePage.style.visibility = "";
    articlePage.style.overflowY = "";
    articlePage.style.pointerEvents = "";
    articlePage.classList.remove("ios26-glass-morph", "ios26-glass-settled");

    if (mainWrapper) {
        mainWrapper.style.filter = "";
        mainWrapper.style.transition = "";
    }

    document.body.style.overflow = "";

    articleAnimation = null;
    backgroundAnimation = null;
    activeCard = null;
    currentPostId = "";
    activeMorphRect = null;

    history.replaceState(null, "", window.location.pathname);
}


backBtn.addEventListener(
    "click",
    (e) => {
        e.preventDefault();
        closeArticle();
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
         * 打开评论页时才拉取评论，
         * 确保 currentPostId 已是当前文章的 ID。
         */
        loadTwikooComments();

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

    // 显示加载状态
    commentListScroll.innerHTML = `
        <div style="text-align:center;padding:40px 0;color:var(--text-secondary);font-size:0.9rem;">
            评论加载中...
        </div>
    `;

    const postUrl = currentPostId || window.location.pathname;
    let result = null;
    let lastError = null;

    // 最多重试 2 次（共 3 次尝试）
    for (let attempt = 0; attempt < 3; attempt++) {
        try {
            result = await fetchComments({ url: postUrl });
            break;
        } catch (e) {
            lastError = e;
            console.warn(`Twikoo 评论加载第 ${attempt + 1} 次失败`, e);
            if (attempt < 2) {
                await new Promise(r => setTimeout(r, 800));
            }
        }
    }

    if (!result) {
        console.error("Twikoo 评论加载最终失败", lastError);
        commentListScroll.innerHTML = `
            <div style="text-align:center;padding:40px 0;color:var(--text-secondary);font-size:0.9rem;">
                评论加载失败，请刷新重试
            </div>
        `;
        return;
    }

    try {
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
        console.error("Twikoo 评论渲染失败", e);
        commentListScroll.innerHTML = `
            <div style="text-align:center;padding:40px 0;color:var(--text-secondary);font-size:0.9rem;">
                评论渲染失败，请刷新重试
            </div>
        `;
    }
}

// 评论在打开评论页时加载，不在页面加载时加载
// loadTwikooComments();


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
   分类筛选
================================================================ */

let currentCategory = "all";

function filterByCategory(category) {
    currentCategory = category;

    // 更新分类栏按钮状态
    document.querySelectorAll(".cat-btn").forEach((btn) => {
        const el = btn as HTMLElement;
        if (el.dataset.category === category) {
            el.classList.add("active");
        } else {
            el.classList.remove("active");
        }
    });

    // 筛选文章卡片
    document.querySelectorAll(".post-card").forEach((card) => {
        const el = card as HTMLElement;
        const cardCategory = el.dataset.category || "";
        if (category === "all" || cardCategory === category) {
            el.style.display = "";
        } else {
            el.style.display = "none";
        }
    });
}

// 分类栏按钮点击
document.querySelectorAll(".cat-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        const category = (btn as HTMLElement).dataset.category || "all";
        filterByCategory(category);
    });
});

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
            el.dataset.category || ""
        );
    };

    card.addEventListener("click", open);
    card.addEventListener("keydown", (event) => {
        if ((event as KeyboardEvent).key === "Enter" || (event as KeyboardEvent).key === " ") {
            event.preventDefault();
            open();
        }
    });

    // 卡片内分类标签点击：筛选分类，不打开文章
    const categoryLink = card.querySelector(".post-category-link");
    if (categoryLink) {
        categoryLink.addEventListener("click", (e) => {
            e.stopPropagation();
            const category = (categoryLink as HTMLElement).dataset.category || "";
            if (category) {
                filterByCategory(category);
                // 滚动到分类栏
                document.querySelector(".category-bar")?.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        });
    }

    // 卡片内标签点击：按标签筛选（简单实现：显示包含该标签的文章）
    card.querySelectorAll(".post-tag").forEach((tag) => {
        tag.addEventListener("click", (e) => {
            e.stopPropagation();
            const tagName = (tag as HTMLElement).dataset.tag || "";
            if (tagName) {
                // 切换显示：只显示包含该标签的文章
                document.querySelectorAll(".post-card").forEach((c) => {
                    const tags = Array.from(c.querySelectorAll(".post-tag")).map(
                        (t) => (t as HTMLElement).dataset.tag
                    );
                    if (tags.includes(tagName)) {
                        (c as HTMLElement).style.display = "";
                    } else {
                        (c as HTMLElement).style.display = "none";
                    }
                });
                // 重置分类栏状态
                document.querySelectorAll(".cat-btn").forEach((btn) => {
                    btn.classList.remove("active");
                });
                showToast(`筛选标签：${tagName}`);
            }
        });
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
