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
   6. 文章卡片 Morph 动画
   iOS26 Liquid Glass 同源连续形变版

   核心：
   1. 动画源严格来自被点击文章卡片的真实 viewport 几何位置。
   2. 不使用 transform: scale() 缩放整页，避免文字/图片被拉伸。
   3. 使用 left / top / width / height / border-radius 连续形变。
   4. 背景暗化延迟于容器扩张。
   5. 文章内容独立淡入。
   6. 支持打开/关闭过程中途打断。
   ================================================================ */

let activeCard = null;
let currentPostId = "";
let articleAnimation = null;
let backgroundAnimation = null;
let contentFadeTimer = null;
let pressAnimation = null;
let articleMorphDirection = null;

const overlay =
    document.getElementById("articleOverlay");

const articlePage =
    document.getElementById("articlePage");

const articleContent =
    document.getElementById("articleContent");

const backBtn =
    document.getElementById("backBtn");

const mainWrapper =
    document.getElementById("mainWrapper");


/* ================================================================
   iOS26 Morph 核心参数
   ================================================================ */

/** 动画总时长：打开 300ms */
const OPEN_DURATION = 300;

/** 动画总时长：返回 300ms */
const CLOSE_DURATION = 300;

/** 点击瞬间轻微按压 */
const PRESS_DURATION = 70;

/**
 * 背景暗化时间偏移：
 * 容器先开始扩张，55ms 后背景才跟进。
 */
const BACKGROUND_DELAY = 55;

/** 背景暗化总时长 */
const BACKGROUND_DURATION = 220;

/**
 * 文章内容开始淡入：
 * 容器已经完成主要扩张之后再进入。
 */
const CONTENT_FADE_DELAY = 175;

/** 首页文章卡片默认圆角 */
const CARD_RADIUS = 26;

/** 全屏文章圆角 */
const FINAL_RADIUS = 0;

/**
 * 极弱弹簧过冲。
 * 0.8% 只提供“液态玻璃落位”的微妙感觉。
 */
const SPRING_OVERSHOOT = 1.008;

/**
 * 高阻尼弱弹簧。
 * 末尾仅有极轻微过冲，禁止夸张弹跳。
 */
const LIQUID_SPRING_EASE =
    "linear(" +
    "0, " +
    "0.12 8%, " +
    "0.30 20%, " +
    "0.56 40%, " +
    "0.76 60%, " +
    "0.90 76%, " +
    "0.975 88%, " +
    "1.008 96%, " +
    "0.999 99%, " +
    "1 100%" +
    ")";

const LIQUID_CLOSE_EASE =
    "linear(" +
    "0, " +
    "0.02 5%, " +
    "0.10 15%, " +
    "0.28 32%, " +
    "0.52 52%, " +
    "0.74 70%, " +
    "0.90 86%, " +
    "0.98 96%, " +
    "1 100%" +
    ")";


interface ArticleRect {
    left: number;
    top: number;
    width: number;
    height: number;
}


/* ================================================================
   工具：取消当前 Morph 动画
   ================================================================ */

function cancelAllArticleAnimations() {

    if (articleAnimation) {
        articleAnimation.cancel();
        articleAnimation = null;
    }

    if (backgroundAnimation) {
        backgroundAnimation.cancel();
        backgroundAnimation = null;
    }

    if (pressAnimation) {
        pressAnimation.cancel();
        pressAnimation = null;
    }

    if (contentFadeTimer) {
        clearTimeout(contentFadeTimer);
        contentFadeTimer = null;
    }
}


/* ================================================================
   工具：读取文章卡片真实 viewport 几何位置
   ================================================================ */

function getCardRect(card) {

    const rect =
        card.getBoundingClientRect();

    return {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height
    };
}


/* ================================================================
   工具：设置文章容器几何位置
   ================================================================ */

function setArticleGeometry(rect) {

    articlePage.style.left =
        `${rect.left}px`;

    articlePage.style.top =
        `${rect.top}px`;

    articlePage.style.width =
        `${rect.width}px`;

    articlePage.style.height =
        `${rect.height}px`;
}


/* ================================================================
   工具：设置文章容器全屏状态
   ================================================================ */

function setArticleFullscreen() {

    articlePage.style.left = "0px";
    articlePage.style.top = "0px";
    articlePage.style.width = "100vw";
    articlePage.style.height = "100vh";
}


/* ================================================================
   工具：恢复 articlePage 最终 CSS 状态
   ================================================================ */

function resetArticleGeometry() {

    setArticleFullscreen();

    articlePage.style.borderRadius =
        `${FINAL_RADIUS}px`;

    articlePage.style.opacity = "1";
    articlePage.style.overflowY = "";
    articlePage.style.visibility = "";
}


/* ================================================================
   工具：隐藏文章内容
   ================================================================ */

function hideArticleContent() {

    if (contentFadeTimer) {
        clearTimeout(contentFadeTimer);
        contentFadeTimer = null;
    }

    articleContent.classList.remove("content-visible");
    articleContent.classList.add("content-hidden");
}


/* ================================================================
   工具：延迟显示文章内容
   ================================================================ */

function scheduleArticleContent() {

    if (contentFadeTimer) {
        clearTimeout(contentFadeTimer);
    }

    contentFadeTimer =
        setTimeout(() => {

            articleContent.classList.remove(
                "content-hidden"
            );

            articleContent.classList.add(
                "content-visible"
            );

            contentFadeTimer = null;

        }, CONTENT_FADE_DELAY);
}


/* ================================================================
   0 - 70ms：卡片轻微按压
   ================================================================ */

function playCardPress(card) {

    if (pressAnimation) {
        pressAnimation.cancel();
    }

    pressAnimation =
        card.animate(
            [
                {
                    transform:
                        "translate3d(0,0,0) scale(1)"
                },
                {
                    transform:
                        "translate3d(0,0,0) scale(0.975)"
                },
                {
                    transform:
                        "translate3d(0,0,0) scale(1)"
                }
            ],
            {
                duration: PRESS_DURATION,
                easing:
                    "cubic-bezier(0.2,0.8,0.2,1)",
                fill: "forwards"
            }
        );
}


/* ================================================================
   55ms 后：背景开始滞后暗化
   ================================================================ */

function animateBackgroundOpen() {

    if (!mainWrapper) {
        return;
    }

    if (backgroundAnimation) {
        backgroundAnimation.cancel();
    }

    backgroundAnimation =
        mainWrapper.animate(
            [
                {
                    filter: "brightness(1)"
                },
                {
                    filter: "brightness(0.55)"
                }
            ],
            {
                duration: BACKGROUND_DURATION,
                delay: BACKGROUND_DELAY,
                easing: "ease-out",
                fill: "forwards"
            }
        );
}


/* ================================================================
   返回：背景恢复
   ================================================================ */

function animateBackgroundClose() {

    if (!mainWrapper) {
        return;
    }

    if (backgroundAnimation) {
        backgroundAnimation.cancel();
    }

    backgroundAnimation =
        mainWrapper.animate(
            [
                {
                    filter: "brightness(0.55)"
                },
                {
                    filter: "brightness(1)"
                }
            ],
            {
                duration: BACKGROUND_DURATION,
                delay: 20,
                easing: "ease-out",
                fill: "forwards"
            }
        );
}


/* ================================================================
   打开文章
   ================================================================ */

function openArticle(
    card,
    postId,
    title,
    date,
    category
) {

    if (
        !card ||
        !articlePage ||
        !overlay
    ) {
        return;
    }

    cancelAllArticleAnimations();

    activeCard = card;
    currentPostId = postId;
    articleMorphDirection = "open";

    if (postId) {
        history.replaceState(
            null,
            "",
            `#post-${postId}`
        );
    }

    document.getElementById(
        "viewTitle"
    ).innerText = title;

    document.getElementById(
        "viewMeta"
    ).innerHTML = `
        <i class="fa-regular fa-calendar"></i>
        ${date}
        &nbsp;&nbsp;|&nbsp;&nbsp;
        <i class="fa-regular fa-folder"></i>
        ${category}
    `;

    /* ------------------------------------------------------------
       从卡片 template 读取文章 HTML
       ------------------------------------------------------------ */

    const template =
        card.querySelector(
            "template[data-post-html]"
        );

    const rawHtml =
        template
            ? template.innerHTML
            : "";

    const enhancedHtml =
        enhanceMarkdownHtml(rawHtml);

    const viewBody =
        document.getElementById("viewBody");

    viewBody.innerHTML =
        enhancedHtml;

    enhanceMarkdownDom(viewBody);


    /* ------------------------------------------------------------
       最关键的一步：

       必须在隐藏原卡片之前读取真实位置。

       这就是同源液态 Morph 的源锚点。
       ------------------------------------------------------------ */

    const sourceRect =
        getCardRect(card);


    /* ------------------------------------------------------------
       0ms：点击反馈
       ------------------------------------------------------------ */

    playCardPress(card);


    /* ------------------------------------------------------------
       进入文章模式
       ------------------------------------------------------------ */

    document.body.classList.add(
        "article-mode"
    );

    overlay.classList.add(
        "active"
    );

    document.body.style.overflow =
        "hidden";


    /* ------------------------------------------------------------
       原卡片隐藏，但不删除。

       articlePage 会从它原来的位置继续生长。
       ------------------------------------------------------------ */

    card.classList.add(
        "morph-hidden"
    );


    /* ------------------------------------------------------------
       0ms：文章内容先隐藏
       ------------------------------------------------------------ */

    hideArticleContent();


    /* ------------------------------------------------------------
       设置 Morph 初始状态
       ------------------------------------------------------------ */

    articlePage.style.transition =
        "none";

    articlePage.style.visibility =
        "visible";

    articlePage.style.opacity =
        "1";

    articlePage.style.overflowY =
        "hidden";

    articlePage.style.borderRadius =
        `${CARD_RADIUS}px`;

    setArticleGeometry(
        sourceRect
    );

    /* 强制浏览器提交初始几何状态 */
    articlePage.getBoundingClientRect();


    /* ------------------------------------------------------------
       55ms：背景开始暗化
       ------------------------------------------------------------ */

    animateBackgroundOpen();


    /* ============================================================
       0 - 300ms：核心同源液态形变

       0ms：
         卡片原始位置/大小/圆角

       0 - 200ms：
         容器高速向外流体扩张

       55ms：
         背景才开始缓慢暗化

       175ms：
         App 内容开始淡入

       288ms 左右：
         极轻微弹簧过冲

       300ms：
         稳定为完整 App 页面
       ============================================================ */

    const finalWidth =
        window.innerWidth;

    const finalHeight =
        window.innerHeight;

    articleAnimation =
        articlePage.animate(
            [
                {
                    left:
                        `${sourceRect.left}px`,
                    top:
                        `${sourceRect.top}px`,
                    width:
                        `${sourceRect.width}px`,
                    height:
                        `${sourceRect.height}px`,
                    borderRadius:
                        `${CARD_RADIUS}px`
                },

                {
                    left:
                        `${sourceRect.left * 0.55}px`,
                    top:
                        `${sourceRect.top * 0.55}px`,
                    width:
                        `${sourceRect.width +
                            (finalWidth - sourceRect.width) * 0.78}px`,
                    height:
                        `${sourceRect.height +
                            (finalHeight - sourceRect.height) * 0.78}px`,
                    borderRadius:
                        `${CARD_RADIUS * 0.42}px`
                },

                {
                    left:
                        `${sourceRect.left * 0.12}px`,
                    top:
                        `${sourceRect.top * 0.12}px`,
                    width:
                        `${finalWidth * SPRING_OVERSHOOT}px`,
                    height:
                        `${finalHeight * SPRING_OVERSHOOT}px`,
                    borderRadius:
                        "1px"
                },

                {
                    left: "0px",
                    top: "0px",
                    width: `${finalWidth}px`,
                    height: `${finalHeight}px`,
                    borderRadius:
                        `${FINAL_RADIUS}px`
                }
            ],
            {
                duration: OPEN_DURATION,
                easing: LIQUID_SPRING_EASE,
                fill: "forwards"
            }
        );


    /* ------------------------------------------------------------
       175ms：App 内容淡入
       ------------------------------------------------------------ */

    scheduleArticleContent();


    articleAnimation.onfinish =
        () => {

            if (
                articleMorphDirection !==
                "open"
            ) {
                return;
            }

            setArticleFullscreen();

            articlePage.style.borderRadius =
                `${FINAL_RADIUS}px`;

            articlePage.style.overflowY =
                "auto";

            articleAnimation = null;
        };
}


/* ================================================================
   返回文章
   ================================================================ */

function closeArticle() {

    if (
        !activeCard ||
        !articlePage
    ) {
        return;
    }

    const currentRect =
        articlePage.getBoundingClientRect();

    const targetRect =
        getCardRect(activeCard);

    articleMorphDirection =
        "close";

    cancelAllArticleAnimations();

    hideArticleContent();

    animateBackgroundClose();


    /* ------------------------------------------------------------
       读取当前视觉状态。

       如果用户在打开动画中途点击返回，
       就从当前状态直接反向收缩。
       ------------------------------------------------------------ */

    articlePage.style.visibility =
        "visible";

    articlePage.style.opacity =
        "1";

    articlePage.style.overflowY =
        "hidden";

    articlePage.style.left =
        `${currentRect.left}px`;

    articlePage.style.top =
        `${currentRect.top}px`;

    articlePage.style.width =
        `${currentRect.width}px`;

    articlePage.style.height =
        `${currentRect.height}px`;

    const currentRadius =
        Math.min(
            CARD_RADIUS,
            Math.max(
                0,
                currentRect.width * 0.08
            )
        );

    articlePage.style.borderRadius =
        `${currentRadius}px`;

    articlePage.getBoundingClientRect();


    /* ============================================================
       反向镜像：

       全屏 App
         ↓
       内容淡出
         ↓
       容器收缩
         ↓
       圆角恢复
         ↓
       精准落回原卡片
       ============================================================ */

    articleAnimation =
        articlePage.animate(
            [
                {
                    left:
                        `${currentRect.left}px`,
                    top:
                        `${currentRect.top}px`,
                    width:
                        `${currentRect.width}px`,
                    height:
                        `${currentRect.height}px`,
                    borderRadius:
                        `${currentRadius}px`
                },

                {
                    left:
                        `${targetRect.left}px`,
                    top:
                        `${targetRect.top}px`,
                    width:
                        `${targetRect.width * 1.015}px`,
                    height:
                        `${targetRect.height * 1.015}px`,
                    borderRadius:
                        `${CARD_RADIUS + 1}px`
                },

                {
                    left:
                        `${targetRect.left}px`,
                    top:
                        `${targetRect.top}px`,
                    width:
                        `${targetRect.width}px`,
                    height:
                        `${targetRect.height}px`,
                    borderRadius:
                        `${CARD_RADIUS}px`
                }
            ],
            {
                duration: CLOSE_DURATION,
                easing: LIQUID_CLOSE_EASE,
                fill: "forwards"
            }
        );

    articleAnimation.onfinish =
        () => {

            finishCloseArticle();

        };
}


/* ================================================================
   返回动画完成后的清理
   ================================================================ */

function finishCloseArticle() {

    if (articleAnimation) {
        articleAnimation.cancel();
        articleAnimation = null;
    }

    if (backgroundAnimation) {
        backgroundAnimation.cancel();
        backgroundAnimation = null;
    }

    overlay.classList.remove(
        "active"
    );

    document.body.classList.remove(
        "article-mode"
    );

    if (activeCard) {

        activeCard.classList.remove(
            "morph-hidden"
        );

        activeCard.style.transform = "";
        activeCard.style.opacity = "";
    }

    resetArticleGeometry();

    document.body.style.overflow = "";

    activeCard = null;
    currentPostId = "";
    articleMorphDirection = null;

    history.replaceState(
        null,
        "",
        window.location.pathname
    );
}


/* ================================================================
   返回按钮
   ================================================================ */

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