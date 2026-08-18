import { playlist } from "../data/music";
import { siteConfig } from "../config";
import {
    submitComment,
    fetchComments
}
from "./twikoo-api";

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

let currentReplyTarget =
    null;


function prepareReply(
    username
) {

    currentReplyTarget =
        username;

    commentInputField.placeholder =
        `回复 @${username}...`;

    commentInputField.focus();
}


/* ================================================================
   13. HTML 转义
   防止评论直接插入 HTML。
================================================================ */

function escapeHtml(
    text
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
    );

const commentEmailField =
    document.getElementById(
        "commentEmailField"
    );


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

            nick:name,

            mail:email,

            comment:val

        });


        showToast(
            "评论发布成功！"
        );


        commentInputField.value = "";

        commentInputField.placeholder =
            "善语结善缘，恶语伤人心...";


        currentReplyTarget =
            null;


        loadTwikooComments();


    } catch(e) {

        showToast(
            "评论发布失败"
        );

    }

}



/* ================================================================
   Twikoo 评论加载
================================================================ */

async function loadTwikooComments(){

    try {

        const comments =
            await fetchComments();


        if(!commentListScroll){
            return;
        }


        commentListScroll.innerHTML =
            "";


        comments.forEach(
            item => {

                const node =
                    document.createElement(
                        "div"
                    );


                node.className =
                    "comment-node";


                node.innerHTML =
                `
                <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(item.nick || "user")}"
                    class="comment-avatar"
                >

                <div class="comment-content-box">

                    <div class="comment-user-name">
                        ${escapeHtml(item.nick || "")}
                    </div>

                    <div class="comment-text">
                        ${escapeHtml(item.comment || "")}
                    </div>

                </div>
                `;


                commentListScroll.appendChild(
                    node
                );

            }
        );


    } catch(e) {

        console.error(
            "Twikoo加载失败",
            e
        );

    }

}


/* ================================================================
   15. 评论点赞
================================================================ */

function toggleCommentLike(
    el
) {

    const numEl =
        el.querySelector(
            ".c-like-num"
        );

    let count =
        parseInt(
            numEl.innerText
        ) || 0;



    if (
        el.classList.contains(
            "active"
        )
    ) {

        el.classList.remove(
            "active"
        );

        el.querySelector(
            "i"
        ).className =
            "fa-regular fa-heart";

        numEl.innerText =
            Math.max(
                0,
                count - 1
            );

    } else {

        el.classList.add(
            "active"
        );

        el.querySelector(
            "i"
        ).className =
            "fa-solid fa-heart";

        numEl.innerText =
            count + 1;
    }
}


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
