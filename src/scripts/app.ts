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
   iOS26 Liquid Glass Shared-Element Morph

   关键参数：
   - OPEN_DURATION / CLOSE_DURATION：总时长 300ms
   - BACKGROUND_DELAY：背景滞后 55ms
   - CONTENT_FADE_DELAY：App 内容约 165ms 开始进入
   - CARD_RADIUS：源卡片圆角 26px
   - OVERSHOOT：末尾仅约 0.7% 的弱弹簧过冲

   视觉结构：
   源卡片 → Liquid Glass Morph 层 → 全屏 Article
   而不是简单 scale 一个页面。
   ================================================================ */

let activeCard = null;
let currentPostId = "";
let articleAnimation = null;
let glassAnimation = null;
let backgroundAnimation = null;
let contentFadeTimer = null;
let pressAnimation = null;
let articleMorphDirection = null;

const overlay = document.getElementById("articleOverlay");
const articlePage = document.getElementById("articlePage");
const articleContent = document.getElementById("articleContent");
const backBtn = document.getElementById("backBtn");
const mainWrapper = document.getElementById("mainWrapper");

const OPEN_DURATION = 300;
const CLOSE_DURATION = 300;
const PRESS_DURATION = 72;
const BACKGROUND_DELAY = 55;
const BACKGROUND_DURATION = 230;
const CONTENT_FADE_DELAY = 165;
const SOURCE_FADE_TIME = 145;
const CARD_RADIUS = 26;
const FULL_RADIUS = 0;
const OVERSHOOT = 1.007;

const LIQUID_SPRING =
    "linear(0, .10 7%, .25 18%, .48 35%, .70 53%, .85 69%, .94 82%, .992 91%, 1.007 96%, .999 99%, 1 100%)";

const LIQUID_CLOSE =
    "linear(0, .015 6%, .09 17%, .25 34%, .48 53%, .68 70%, .84 84%, .95 94%, 1 100%)";

function ensureLiquidGlassLayer() {
    if (document.getElementById("ios26MorphGlassStyle")) return;

    const style = document.createElement("style");
    style.id = "ios26MorphGlassStyle";
    style.textContent = `
        #ios26MorphGlass {
            position: fixed;
            z-index: 99999;
            left: 0;
            top: 0;
            width: 0;
            height: 0;
            overflow: hidden;
            pointer-events: none;
            box-sizing: border-box;
            border: 1px solid rgba(255,255,255,.22);
            background:
                linear-gradient(135deg,
                    rgba(255,255,255,.30),
                    rgba(255,255,255,.10) 42%,
                    rgba(255,255,255,.035));
            backdrop-filter: blur(24px) saturate(1.25);
            -webkit-backdrop-filter: blur(24px) saturate(1.25);
            box-shadow:
                0 18px 55px rgba(0,0,0,.18),
                inset 0 1px 0 rgba(255,255,255,.34),
                inset 0 -1px 0 rgba(255,255,255,.08);
            will-change:
                left, top, width, height, border-radius,
                opacity, filter, box-shadow;
        }

        #ios26MorphGlass::before {
            content: "";
            position: absolute;
            inset: -50%;
            border-radius: inherit;
            background:
                radial-gradient(ellipse at 20% 12%,
                    rgba(255,255,255,.62) 0%,
                    rgba(255,255,255,.20) 17%,
                    transparent 48%);
            transform: translate3d(-12%,-7%,0) rotate(-8deg);
            opacity: .78;
            will-change: transform, opacity;
        }

        #ios26MorphGlass::after {
            content: "";
            position: absolute;
            inset: 0;
            border-radius: inherit;
            background:
                linear-gradient(112deg,
                    transparent 0%,
                    transparent 34%,
                    rgba(255,255,255,.30) 45%,
                    rgba(255,255,255,.08) 51%,
                    transparent 63%);
            transform: translate3d(-78%,0,0);
            opacity: .72;
            will-change: transform, opacity;
        }

        body.ios26-liquid-morphing #articleOverlay {
            background: transparent !important;
        }

        body.ios26-liquid-opening #articleContent {
            opacity: 0 !important;
            transform: translate3d(0,10px,0) scale(.985);
        }

        body.ios26-liquid-opened #articleContent {
            opacity: 1 !important;
            transform: translate3d(0,0,0) scale(1);
            transition:
                opacity 130ms cubic-bezier(.22,1,.36,1),
                transform 170ms cubic-bezier(.22,1,.36,1);
        }

        .post-card.ios26-morph-source {
            z-index: 100000 !important;
            transform: translate3d(0,1px,0) scale(.975) !important;
            filter: brightness(1.06) saturate(1.08);
            transition: none !important;
        }

        .post-card.ios26-morph-source-hidden {
            opacity: 0 !important;
            visibility: hidden !important;
            pointer-events: none !important;
            transition: none !important;
        }
    `;
    document.head.appendChild(style);
}

function cancelAllAnimations() {
    if (articleAnimation) articleAnimation.cancel();
    if (glassAnimation) glassAnimation.cancel();
    if (backgroundAnimation) backgroundAnimation.cancel();
    if (pressAnimation) pressAnimation.cancel();
    if (contentFadeTimer) clearTimeout(contentFadeTimer);
    articleAnimation = null;
    glassAnimation = null;
    backgroundAnimation = null;
    pressAnimation = null;
    contentFadeTimer = null;
}

function getCardRect(card) {
    const r = card.getBoundingClientRect();
    return {
        left: r.left,
        top: r.top,
        width: r.width,
        height: r.height
    };
}

function hideArticleContent() {
    if (contentFadeTimer) clearTimeout(contentFadeTimer);
    articleContent.classList.remove("content-visible");
    articleContent.classList.add("content-hidden");
}

function showArticleContent() {
    if (contentFadeTimer) clearTimeout(contentFadeTimer);
    contentFadeTimer = setTimeout(() => {
        if (articleMorphDirection !== "open") return;
        articleContent.classList.remove("content-hidden");
        articleContent.classList.add("content-visible");
        document.body.classList.remove("ios26-liquid-opening");
        document.body.classList.add("ios26-liquid-opened");
        contentFadeTimer = null;
    }, CONTENT_FADE_DELAY);
}

function pressCard(card) {
    pressAnimation = card.animate([
        {
            transform: "translate3d(0,0,0) scale(1)",
            filter: "brightness(1) saturate(1)"
        },
        {
            transform: "translate3d(0,1px,0) scale(.972)",
            filter: "brightness(1.06) saturate(1.08)"
        },
        {
            transform: "translate3d(0,0,0) scale(.985)",
            filter: "brightness(1.02) saturate(1.04)"
        }
    ], {
        duration: PRESS_DURATION,
        easing: "cubic-bezier(.22,1,.36,1)",
        fill: "forwards"
    });
}

function animateBackgroundOpen() {
    if (!mainWrapper) return;
    backgroundAnimation = mainWrapper.animate([
        { filter: "brightness(1) saturate(1)" },
        { filter: "brightness(.88) saturate(.98)", offset: .20 },
        { filter: "brightness(.58) saturate(.88)" }
    ], {
        duration: BACKGROUND_DURATION,
        delay: BACKGROUND_DELAY,
        easing: "cubic-bezier(.22,1,.36,1)",
        fill: "forwards"
    });
}

function animateBackgroundClose() {
    if (!mainWrapper) return;
    backgroundAnimation = mainWrapper.animate([
        { filter: "brightness(.58) saturate(.88)" },
        { filter: "brightness(.86) saturate(.98)", offset: .72 },
        { filter: "brightness(1) saturate(1)" }
    ], {
        duration: BACKGROUND_DURATION,
        easing: "cubic-bezier(.22,1,.36,1)",
        fill: "forwards"
    });
}

function createGlass(rect) {
    const old = document.getElementById("ios26MorphGlass");
    if (old) old.remove();

    const glass = document.createElement("div");
    glass.id = "ios26MorphGlass";
    glass.style.left = `${rect.left}px`;
    glass.style.top = `${rect.top}px`;
    glass.style.width = `${rect.width}px`;
    glass.style.height = `${rect.height}px`;
    glass.style.borderRadius = `${CARD_RADIUS}px`;
    document.body.appendChild(glass);
    return glass;
}

function openArticle(card, postId, title, date, category) {
    if (!card || !articlePage || !overlay) return;

    ensureLiquidGlassLayer();
    cancelAllAnimations();

    activeCard = card;
    currentPostId = postId;
    articleMorphDirection = "open";

    const source = getCardRect(card);

    if (postId) history.replaceState(null, "", `#post-${postId}`);

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
    const viewBody = document.getElementById("viewBody");
    viewBody.innerHTML = enhanceMarkdownHtml(rawHtml);
    enhanceMarkdownDom(viewBody);

    document.body.classList.add("article-mode", "ios26-liquid-morphing", "ios26-liquid-opening");
    document.body.classList.remove("ios26-liquid-opened");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";

    hideArticleContent();
    card.classList.add("ios26-morph-source");
    pressCard(card);

    articlePage.style.transition = "none";
    articlePage.style.left = `${source.left}px`;
    articlePage.style.top = `${source.top}px`;
    articlePage.style.width = `${source.width}px`;
    articlePage.style.height = `${source.height}px`;
    articlePage.style.borderRadius = `${CARD_RADIUS}px`;
    articlePage.style.opacity = "1";
    articlePage.style.overflowY = "hidden";
    articlePage.style.pointerEvents = "none";

    articlePage.getBoundingClientRect();
    animateBackgroundOpen();

    const glass = createGlass(source);
    const W = window.innerWidth;
    const H = window.innerHeight;
    const cx = source.left + source.width / 2;
    const cy = source.top + source.height / 2;

    /* ------------------------------------------------------------
       0-200ms：Glass 容器从“被点击卡片”向四周摊开。
       这里故意不用 scale 整个 App，而是改变真实几何边界。
       ------------------------------------------------------------ */
    glassAnimation = glass.animate([
        {
            left: `${source.left}px`,
            top: `${source.top}px`,
            width: `${source.width}px`,
            height: `${source.height}px`,
            borderRadius: `${CARD_RADIUS}px`,
            opacity: 1,
            filter: "blur(0px) saturate(1)",
            boxShadow: "0 8px 28px rgba(0,0,0,.12), inset 0 1px 0 rgba(255,255,255,.30)"
        },
        {
            left: `${cx - source.width * .68}px`,
            top: `${cy - source.height * .76}px`,
            width: `${source.width * 2.36}px`,
            height: `${source.height * 2.52}px`,
            borderRadius: "44px",
            opacity: 1,
            filter: "blur(1px) saturate(1.20)",
            boxShadow: "0 18px 54px rgba(0,0,0,.16), inset 0 1px 0 rgba(255,255,255,.34)"
        },
        {
            left: `${-W * .012}px`,
            top: `${-H * .012}px`,
            width: `${W * 1.024}px`,
            height: `${H * 1.024}px`,
            borderRadius: "7px",
            opacity: 1,
            filter: "blur(1.5px) saturate(1.12)",
            boxShadow: "0 20px 62px rgba(0,0,0,.10), inset 0 1px 0 rgba(255,255,255,.20)"
        },
        {
            left: "0px",
            top: "0px",
            width: `${W}px`,
            height: `${H}px`,
            borderRadius: `${FULL_RADIUS}px`,
            opacity: 0,
            filter: "blur(0px) saturate(1)",
            boxShadow: "0 0 0 rgba(0,0,0,0)"
        }
    ], {
        duration: OPEN_DURATION,
        easing: LIQUID_SPRING,
        fill: "forwards"
    });

    /* ------------------------------------------------------------
       Glass 高光层：0-300ms 横向扫过，制造“液体表面”运动。
       ------------------------------------------------------------ */
    glass.animate([
        { transform: "translate3d(-78%,0,0) rotate(-4deg)", opacity: .72 },
        { transform: "translate3d(-5%,2%,0) rotate(-1deg)", opacity: .58 },
        { transform: "translate3d(72%,6%,0) rotate(2deg)", opacity: .20 },
        { transform: "translate3d(105%,8%,0) rotate(3deg)", opacity: 0 }
    ], {
        duration: OPEN_DURATION,
        easing: "cubic-bezier(.22,1,.36,1)",
        fill: "forwards"
    });

    /* 145ms：源卡片 UI 淡出，但 Glass 仍然覆盖在同一个几何层上。 */
    setTimeout(() => {
        if (articleMorphDirection !== "open") return;
        card.classList.remove("ios26-morph-source");
        card.classList.add("ios26-morph-source-hidden");
    }, SOURCE_FADE_TIME);

    /* 165ms：App 内容开始进入，和源 UI 形成交叉。 */
    showArticleContent();

    glassAnimation.onfinish = () => {
        if (articleMorphDirection !== "open") return;

        glass.remove();
        articlePage.style.left = "0px";
        articlePage.style.top = "0px";
        articlePage.style.width = "100vw";
        articlePage.style.height = "100vh";
        articlePage.style.borderRadius = `${FULL_RADIUS}px`;
        articlePage.style.overflowY = "auto";
        articlePage.style.pointerEvents = "auto";
        glassAnimation = null;
    };
}

function closeArticle() {
    if (!activeCard || !articlePage) return;

    ensureLiquidGlassLayer();

    const card = activeCard;
    const target = getCardRect(card);
    articleMorphDirection = "close";

    cancelAllAnimations();
    hideArticleContent();
    document.body.classList.remove("ios26-liquid-opened");
    document.body.classList.add("ios26-liquid-opening", "ios26-liquid-morphing");
    articlePage.style.pointerEvents = "none";

    animateBackgroundClose();

    const glass = createGlass({
        left: 0,
        top: 0,
        width: window.innerWidth,
        height: window.innerHeight
    });
    glass.style.borderRadius = "0px";
    glass.style.opacity = "0";

    /* ------------------------------------------------------------
       反向：全屏 Glass → 扩散 → 精准回到源卡片。
       圆角同步 0 → 44 → 26px。
       ------------------------------------------------------------ */
    glassAnimation = glass.animate([
        {
            left: "0px",
            top: "0px",
            width: "100vw",
            height: "100vh",
            borderRadius: "0px",
            opacity: 0
        },
        {
            left: "0px",
            top: "0px",
            width: "100vw",
            height: "100vh",
            borderRadius: "7px",
            opacity: .94
        },
        {
            left: `${target.left - target.width * .58}px`,
            top: `${target.top - target.height * .76}px`,
            width: `${target.width * 2.22}px`,
            height: `${target.height * 2.46}px`,
            borderRadius: "44px",
            opacity: 1
        },
        {
            left: `${target.left}px`,
            top: `${target.top}px`,
            width: `${target.width}px`,
            height: `${target.height}px`,
            borderRadius: `${CARD_RADIUS}px`,
            opacity: 1
        }
    ], {
        duration: CLOSE_DURATION,
        easing: LIQUID_CLOSE,
        fill: "forwards"
    });

    glass.animate([
        { transform: "translate3d(78%,8%,0) rotate(3deg)", opacity: 0 },
        { transform: "translate3d(15%,4%,0) rotate(1deg)", opacity: .40 },
        { transform: "translate3d(-42%,-2%,0) rotate(-2deg)", opacity: .62 },
        { transform: "translate3d(-78%,-5%,0) rotate(-4deg)", opacity: .76 }
    ], {
        duration: CLOSE_DURATION,
        easing: "cubic-bezier(.22,1,.36,1)",
        fill: "forwards"
    });

    /* 145ms：源卡片先恢复，Glass 最后落位，避免视觉断层。 */
    setTimeout(() => {
        if (articleMorphDirection !== "close") return;
        card.classList.remove("ios26-morph-source-hidden");
        card.classList.add("ios26-morph-source");
    }, SOURCE_FADE_TIME);

    glassAnimation.onfinish = () => {
        finishCloseArticle();
        glass.remove();
    };
}

function finishCloseArticle() {
    if (articleAnimation) articleAnimation.cancel();
    if (glassAnimation) glassAnimation.cancel();
    if (backgroundAnimation) backgroundAnimation.cancel();

    articleAnimation = null;
    glassAnimation = null;
    backgroundAnimation = null;

    overlay.classList.remove("active");
    document.body.classList.remove(
        "article-mode",
        "ios26-liquid-morphing",
        "ios26-liquid-opening",
        "ios26-liquid-opened"
    );

    if (activeCard) {
        activeCard.classList.remove(
            "morph-hidden",
            "ios26-morph-source",
            "ios26-morph-source-hidden"
        );
        activeCard.style.transform = "";
        activeCard.style.filter = "";
        activeCard.style.opacity = "";
    }

    articlePage.style.left = "";
    articlePage.style.top = "";
    articlePage.style.width = "";
    articlePage.style.height = "";
    articlePage.style.borderRadius = "";
    articlePage.style.opacity = "";
    articlePage.style.overflowY = "";
    articlePage.style.pointerEvents = "";

    document.body.style.overflow = "";

    activeCard = null;
    currentPostId = "";
    articleMorphDirection = null;

    history.replaceState(null, "", window.location.pathname);
}

backBtn.addEventListener("click", (e) => {
    e.preventDefault();
    closeArticle();
});


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