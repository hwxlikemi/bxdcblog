const AUTHOR_NAME = "boxueduocai";
const AUTHOR_AVATAR = "/assets/images/avatar.jpg";
const AUTHOR_DESCRIPTION = "后来烟雨皆散尽，无人撑伞一人行";

const SHARE_POSTER_STYLE_ID = "share-poster-style";
const SHARE_POSTER_OVERLAY_ID = "sharePosterOverlay";

let shareOriginButton: HTMLElement | null = null;

function injectStyles() {
    if (document.getElementById(SHARE_POSTER_STYLE_ID)) {
        return;
    }

    const style = document.createElement("style");

    style.id = SHARE_POSTER_STYLE_ID;

    style.textContent = `
        #sharePosterOverlay {
            position: fixed;
            inset: 0;
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            background: rgba(15, 23, 42, 0.48);
            backdrop-filter: blur(18px);
            -webkit-backdrop-filter: blur(18px);

            opacity: 0;
            visibility: hidden;
            pointer-events: none;

            /*
             * 背景本身只淡入，
             * 海报主体负责“从按钮飞出来”
             */
            transition:
                opacity 300ms ease,
                visibility 300ms ease;
        }

        #sharePosterOverlay.active {
            opacity: 1;
            visibility: visible;
            pointer-events: auto;
        }

        .share-poster-modal {
            position: relative;

            width: min(430px, 100%);
            max-height: calc(100vh - 40px);
            overflow-y: auto;

            padding: 15px;

            border-radius: 26px;

            background: rgba(255, 255, 255, 0.86);

            border: 1px solid rgba(255, 255, 255, 0.72);

            box-shadow:
                0 30px 80px rgba(15, 23, 42, 0.24),
                0 8px 30px rgba(15, 23, 42, 0.12);

            /*
             * 初始值由 JS 动态设置：
             *
             * transform:
             * translate(...)
             * scale(...)
             *
             * 从分享按钮位置进入
             */
            transform-origin: center center;

            transition:
                transform 520ms cubic-bezier(0.16, 1, 0.3, 1),
                opacity 360ms ease;
        }

        /*
         * 海报关闭时不需要改变布局，
         * JS 会动态设置反向 transform。
         */

        .share-poster-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            padding: 3px 3px 12px;
        }

        .share-poster-header-title {
            font-size: 1rem;
            font-weight: 700;
            color: #0f172a;
        }

        .share-poster-header-subtitle {
            margin-top: 3px;
            font-size: 0.72rem;
            color: #64748b;
        }

        .share-poster-close {
            width: 36px;
            height: 36px;
            flex: 0 0 36px;

            border: 0;
            border-radius: 50%;

            background: rgba(15, 23, 42, 0.07);
            color: #334155;

            cursor: pointer;

            display: flex;
            align-items: center;
            justify-content: center;

            font-size: 0.95rem;

            transition:
                transform 180ms ease,
                background 180ms ease;
        }

        .share-poster-close:hover {
            transform: rotate(90deg);
            background: rgba(15, 23, 42, 0.12);
        }

        .share-poster-preview-wrap {
            display: flex;
            justify-content: center;

            width: 100%;

            overflow: hidden;

            border-radius: 20px;

            background:
                linear-gradient(
                    135deg,
                    rgba(2, 132, 199, 0.08),
                    rgba(56, 189, 248, 0.03)
                );
        }

        #sharePosterPreview {
            display: block;

            width: min(100%, 390px);

            height: auto;

            border-radius: 18px;

            box-shadow:
                0 16px 35px rgba(15, 23, 42, 0.15);
        }

        .share-poster-actions {
            display: grid;

            grid-template-columns: 1fr 1fr;

            gap: 9px;

            padding: 12px 1px 1px;
        }

        .share-poster-action {
            height: 44px;

            border: 0;
            border-radius: 14px;

            cursor: pointer;

            font-size: 0.88rem;
            font-weight: 700;

            display: flex;
            align-items: center;
            justify-content: center;

            gap: 8px;

            transition:
                transform 180ms ease,
                opacity 180ms ease;
        }

        .share-poster-action:hover {
            transform: translateY(-2px);
        }

        .share-poster-action:active {
            transform: translateY(0);
        }

        .share-poster-action:disabled {
            opacity: 0.45;
            cursor: default;
            transform: none;
        }

        .share-poster-save {
            background: #0284c7;
            color: white;

            box-shadow:
                0 8px 20px rgba(2, 132, 199, 0.22);
        }

        .share-poster-native {
            background: rgba(15, 23, 42, 0.07);
            color: #0f172a;
        }

        .share-poster-loading {
            position: absolute;

            inset: 0;

            display: flex;
            align-items: center;
            justify-content: center;

            border-radius: 18px;

            background: rgba(255, 255, 255, 0.72);

            color: #334155;

            font-size: 0.85rem;
            font-weight: 600;

            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
        }

        .share-poster-preview-container {
            position: relative;

            width: 100%;

            display: flex;
            justify-content: center;
        }

        .share-poster-spinner {
            width: 20px;
            height: 20px;

            border: 2px solid rgba(15, 23, 42, 0.12);

            border-top-color: #0284c7;

            border-radius: 50%;

            animation:
                sharePosterSpin 700ms linear infinite;
        }

        @keyframes sharePosterSpin {
            to {
                transform: rotate(360deg);
            }
        }

        /*
         * 点击按钮时，
         * 按钮本身稍微缩一下，
         * 和海报动画形成连续效果。
         */
        .share-poster-origin-active {
            transform: scale(0.88) !important;
            transition:
                transform 180ms
                cubic-bezier(0.16, 1, 0.3, 1) !important;
        }

        @media (max-width: 520px) {
            #sharePosterOverlay {
                padding: 10px;
            }

            .share-poster-modal {
                padding: 11px;
                border-radius: 23px;
            }

            .share-poster-actions {
                grid-template-columns: 1fr;
            }
        }
    `;

    document.head.appendChild(style);
}

/*
 * 获取分享按钮
 */
function getShareButton(): HTMLElement | null {
    return document.querySelector(
        "#shareBtn",
    );
}

/*
 * 获取海报 Modal
 */
function getPosterModal(
    overlay: HTMLElement,
): HTMLElement {
    return overlay.querySelector(
        ".share-poster-modal",
    ) as HTMLElement;
}

/*
 * 根据分享按钮的位置，
 * 计算海报应该从哪里飞出来。
 *
 * 返回：
 *
 * x = 按钮中心相对于屏幕中心的偏移
 * y = 按钮中心相对于屏幕中心的偏移
 */
function getOriginTransform(
    button: HTMLElement,
    modal: HTMLElement,
) {
    const buttonRect =
        button.getBoundingClientRect();

    const modalRect =
        modal.getBoundingClientRect();

    const buttonCenterX =
        buttonRect.left +
        buttonRect.width / 2;

    const buttonCenterY =
        buttonRect.top +
        buttonRect.height / 2;

    const modalCenterX =
        modalRect.left +
        modalRect.width / 2;

    const modalCenterY =
        modalRect.top +
        modalRect.height / 2;

    const x =
        buttonCenterX -
        modalCenterX;

    const y =
        buttonCenterY -
        modalCenterY;

    return {
        x,
        y,
    };
}

/*
 * 打开动画
 *
 * 1. 先把 Modal 放到按钮位置
 * 2. scale(0.05)
 * 3. 再恢复到中心 scale(1)
 */
function playOpenAnimation(
    overlay: HTMLElement,
    button: HTMLElement,
) {
    const modal =
        getPosterModal(overlay);

    /*
     * 先让 Modal 出现在页面，
     * 这样才能获取真实尺寸。
     */
    overlay.classList.add(
        "active",
    );

    /*
     * 禁止立即过渡，
     * 设置初始位置。
     */
    modal.style.transition =
        "none";

    modal.style.opacity = "0";

    const origin =
        getOriginTransform(
            button,
            modal,
        );

    /*
     * 从按钮位置开始。
     */
    modal.style.transform =
        `
        translate(
            ${origin.x}px,
            ${origin.y}px
        )
        scale(0.08)
        `;

    /*
     * 强制浏览器提交初始状态。
     */
    modal.getBoundingClientRect();

    /*
     * 下一帧开始动画。
     */
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            modal.style.transition = `
                transform 560ms
                cubic-bezier(0.16, 1, 0.3, 1),
                opacity 260ms ease
            `;

            modal.style.opacity =
                "1";

            modal.style.transform =
                `
                translate(0, 0)
                scale(1)
                `;
        });
    });

    /*
     * 分享按钮缩小。
     */
    button.classList.add(
        "share-poster-origin-active",
    );
}

/*
 * 关闭动画
 *
 * 与打开完全相反：
 *
 * 中央
 * ↓
 * 缩小
 * ↓
 * 飞回按钮
 */
function playCloseAnimation(
    overlay: HTMLElement,
    button: HTMLElement | null,
) {
    const modal =
        getPosterModal(overlay);

    if (!button) {
        modal.style.opacity =
            "0";

        overlay.classList.remove(
            "active",
        );

        return;
    }

    const origin =
        getOriginTransform(
            button,
            modal,
        );

    modal.style.transition = `
        transform 460ms
        cubic-bezier(0.4, 0, 1, 1),
        opacity 300ms ease
    `;

    modal.style.transform =
        `
        translate(
            ${origin.x}px,
            ${origin.y}px
        )
        scale(0.08)
        `;

    modal.style.opacity =
        "0";

    button.classList.remove(
        "share-poster-origin-active",
    );

    window.setTimeout(() => {
        overlay.classList.remove(
            "active",
        );

        /*
         * 清除内联状态，
         * 防止下一次打开出现位置错误。
         */
        modal.style.transition =
            "";

        modal.style.transform =
            "";

        modal.style.opacity =
            "";
    }, 470);
}

function cleanText(
    text: string,
) {
    return text
        .replace(/\s+/g, " ")
        .trim();
}

function truncateText(
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number,
) {
    const clean =
        cleanText(text);

    if (
        ctx.measureText(clean)
            .width <= maxWidth
    ) {
        return clean;
    }

    let result = "";

    for (
        const char of clean
    ) {
        const next =
            result +
            char +
            "...";

        if (
            ctx.measureText(
                next,
            ).width > maxWidth
        ) {
            break;
        }

        result += char;
    }

    return result + "...";
}

function roundedRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
) {
    const r =
        Math.min(
            radius,
            width / 2,
            height / 2,
        );

    ctx.beginPath();

    ctx.moveTo(
        x + r,
        y,
    );

    ctx.arcTo(
        x + width,
        y,
        x + width,
        y + height,
        r,
    );

    ctx.arcTo(
        x + width,
        y + height,
        x,
        y + height,
        r,
    );

    ctx.arcTo(
        x,
        y + height,
        x,
        y,
        r,
    );

    ctx.arcTo(
        x,
        y,
        x + width,
        y,
        r,
    );

    ctx.closePath();
}

function drawCircle(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
) {
    ctx.beginPath();

    ctx.arc(
        x,
        y,
        radius,
        0,
        Math.PI * 2,
    );
}

async function loadImage(
    src: string,
    crossOrigin = true,
): Promise<HTMLImageElement> {
    return new Promise(
        (resolve, reject) => {
            const image =
                new Image();

            if (crossOrigin) {
                image.crossOrigin =
                    "anonymous";
            }

            image.onload = () =>
                resolve(image);

            image.onerror = () =>
                reject(
                    new Error(
                        `无法加载图片：${src}`,
                    ),
                );

            image.src = src;
        },
    );
}

function createInitialAvatar(
    name: string,
    size: number,
) {
    const canvas =
        document.createElement(
            "canvas",
        );

    canvas.width = size;
    canvas.height = size;

    const ctx =
        canvas.getContext(
            "2d",
        )!;

    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            size,
            size,
        );

    gradient.addColorStop(
        0,
        "#0284c7",
    );

    gradient.addColorStop(
        1,
        "#38bdf8",
    );

    ctx.fillStyle =
        gradient;

    drawCircle(
        ctx,
        size / 2,
        size / 2,
        size / 2,
    );

    ctx.fill();

    ctx.fillStyle =
        "#ffffff";

    ctx.font =
        `700 ${Math.round(
            size * 0.38,
        )}px Arial`;

    ctx.textAlign =
        "center";

    ctx.textBaseline =
        "middle";

    const firstChar =
        name
            .trim()
            .charAt(0)
            .toUpperCase() ||
        "B";

    ctx.fillText(
        firstChar,
        size / 2,
        size / 2 + 2,
    );

    return canvas;
}

async function drawAvatar(
    ctx: CanvasRenderingContext2D,
    avatarUrl: string,
    name: string,
    x: number,
    y: number,
    size: number,
) {
    ctx.save();

    drawCircle(
        ctx,
        x + size / 2,
        y + size / 2,
        size / 2,
    );

    ctx.clip();

    try {
        const image =
            await loadImage(
                avatarUrl,
                true,
            );

        const ratio =
            image.width /
            image.height;

        let drawWidth = size;
        let drawHeight = size;
        let drawX = x;
        let drawY = y;

        if (ratio > 1) {
            drawWidth =
                size * ratio;

            drawX =
                x -
                (drawWidth - size) /
                    2;
        } else if (
            ratio < 1
        ) {
            drawHeight =
                size / ratio;

            drawY =
                y -
                (drawHeight - size) /
                    2;
        }

        ctx.drawImage(
            image,
            drawX,
            drawY,
            drawWidth,
            drawHeight,
        );
    } catch {
        const fallback =
            createInitialAvatar(
                name,
                size,
            );

        ctx.drawImage(
            fallback,
            x,
            y,
            size,
            size,
        );
    }

    ctx.restore();
}

async function loadQrCode(
    url: string,
): Promise<HTMLImageElement> {
    const qrUrl =
        `https://quickchart.io/qr?` +
        `text=${encodeURIComponent(
            url,
        )}` +
        `&size=520` +
        `&margin=2` +
        `&dark=0f172a` +
        `&light=ffffff` +
        `&ecLevel=H` +
        `&dotStyle=rounded` +
        `&finderStyle=rounded`;

    return loadImage(
        qrUrl,
        true,
    );
}

function drawWrappedTitle(
    ctx: CanvasRenderingContext2D,
    title: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number,
    maxLines: number,
) {
    const cleanTitle =
        cleanText(title);

    const lines: string[] = [];

    let current = "";

    for (
        const char of cleanTitle
    ) {
        const test =
            current + char;

        if (
            ctx.measureText(
                test,
            ).width >
            maxWidth
        ) {
            lines.push(
                current,
            );

            current = char;

            if (
                lines.length >=
                maxLines
            ) {
                break;
            }
        } else {
            current = test;
        }
    }

    if (
        lines.length < maxLines &&
        current
    ) {
        lines.push(current);
    }

    if (
        lines.length ===
            maxLines &&
        cleanTitle.length >
            lines.join("").length
    ) {
        let last =
            lines[
                maxLines - 1
            ];

        while (
            ctx.measureText(
                last + "...",
            ).width >
                maxWidth &&
            last.length > 1
        ) {
            last =
                last.slice(
                    0,
                    -1,
                );
        }

        lines[
            maxLines - 1
        ] =
            last + "...";
    }

    lines.forEach(
        (
            line,
            index,
        ) => {
            ctx.fillText(
                line,
                x,
                y +
                    index *
                        lineHeight,
            );
        },
    );

    return lines.length;
}

async function createSharePoster(
    title: string,
    shareUrl: string,
) {
    /*
     * 1080 × 1280
     *
     * 比之前的 1080 × 1440 更短。
     */
    const width = 1080;
    const height = 1280;

    const canvas =
        document.createElement(
            "canvas",
        );

    canvas.width = width;
    canvas.height = height;

    const ctx =
        canvas.getContext(
            "2d",
        )!;

    /*
     * 背景
     */
    const background =
        ctx.createLinearGradient(
            0,
            0,
            width,
            height,
        );

    background.addColorStop(
        0,
        "#f8fafc",
    );

    background.addColorStop(
        0.58,
        "#ffffff",
    );

    background.addColorStop(
        1,
        "#e0f2fe",
    );

    ctx.fillStyle =
        background;

    ctx.fillRect(
        0,
        0,
        width,
        height,
    );

    /*
     * 几何装饰
     */
    ctx.save();

    ctx.globalAlpha =
        0.08;

    ctx.fillStyle =
        "#0284c7";

    drawCircle(
        ctx,
        940,
        115,
        155,
    );

    ctx.fill();

    ctx.strokeStyle =
        "#0284c7";

    ctx.lineWidth = 3;

    ctx.beginPath();

    ctx.arc(
        940,
        115,
        215,
        0,
        Math.PI * 2,
    );

    ctx.stroke();

    ctx.beginPath();

    ctx.arc(
        940,
        115,
        265,
        0,
        Math.PI * 2,
    );

    ctx.stroke();

    ctx.fillStyle =
        "#38bdf8";

    ctx.save();

    ctx.translate(
        110,
        1010,
    );

    ctx.rotate(
        -Math.PI / 8,
    );

    roundedRect(
        ctx,
        -60,
        -60,
        120,
        120,
        28,
    );

    ctx.fill();

    ctx.restore();

    ctx.restore();

    /*
     * 品牌
     */
    ctx.textAlign =
        "left";

    ctx.fillStyle =
        "#0284c7";

    ctx.font =
        "700 28px Arial, 'Microsoft YaHei', sans-serif";

    ctx.fillText(
        "BLOG / SHARE",
        82,
        90,
    );

    ctx.fillStyle =
        "rgba(15, 23, 42, 0.35)";

    ctx.font =
        "500 18px Arial, 'Microsoft YaHei', sans-serif";

    ctx.fillText(
        "BXDCBLOG",
        82,
        120,
    );

    /*
     * 标题
     */
    ctx.fillStyle =
        "#0f172a";

    ctx.font =
        "700 61px Arial, 'Microsoft YaHei', sans-serif";

    const titleLines =
        drawWrappedTitle(
            ctx,
            title || "文章分享",
            82,
            235,
            900,
            78,
            3,
        );

    /*
     * 分隔线
     */
    const separatorY =
        235 +
        titleLines * 78 +
        34;

    ctx.strokeStyle =
        "rgba(15, 23, 42, 0.1)";

    ctx.lineWidth = 2;

    ctx.beginPath();

    ctx.moveTo(
        82,
        separatorY,
    );

    ctx.lineTo(
        width - 82,
        separatorY,
    );

    ctx.stroke();

    /*
     * 作者
     */
    const avatarSize = 82;

    const avatarX = 82;

    const avatarY =
        separatorY + 38;

    await drawAvatar(
        ctx,
        AUTHOR_AVATAR,
        AUTHOR_NAME,
        avatarX,
        avatarY,
        avatarSize,
    );

    ctx.textAlign =
        "left";

    ctx.fillStyle =
        "#0f172a";

    ctx.font =
        "700 28px Arial, 'Microsoft YaHei', sans-serif";

    ctx.fillText(
        AUTHOR_NAME,
        avatarX +
            avatarSize +
            22,
        avatarY + 34,
    );

    ctx.fillStyle =
        "#64748b";

    ctx.font =
        "400 19px Arial, 'Microsoft YaHei', sans-serif";

    ctx.fillText(
        truncateText(
            ctx,
            AUTHOR_DESCRIPTION,
            650,
        ),
        avatarX +
            avatarSize +
            22,
        avatarY + 64,
    );

    /*
     * QR Code
     */
    const qrSize = 360;

    const qrX =
        width -
        82 -
        qrSize;

    const qrY = 745;

    ctx.save();

    ctx.shadowColor =
        "rgba(15, 23, 42, 0.12)";

    ctx.shadowBlur = 30;

    ctx.shadowOffsetY = 12;

    ctx.fillStyle =
        "rgba(255, 255, 255, 0.97)";

    roundedRect(
        ctx,
        qrX - 24,
        qrY - 24,
        qrSize + 48,
        qrSize + 48,
        30,
    );

    ctx.fill();

    ctx.restore();

    try {
        const qr =
            await loadQrCode(
                shareUrl,
            );

        ctx.drawImage(
            qr,
            qrX,
            qrY,
            qrSize,
            qrSize,
        );
    } catch {
        ctx.fillStyle =
            "#0f172a";

        ctx.font =
            "600 20px Arial, 'Microsoft YaHei', sans-serif";

        ctx.textAlign =
            "center";

        ctx.fillText(
            "二维码加载失败",
            qrX +
                qrSize / 2,
            qrY +
                qrSize / 2,
        );

        ctx.textAlign =
            "left";
    }

    /*
     * QR Code 文字
     */
    ctx.textAlign =
        "center";

    ctx.fillStyle =
        "#334155";

    ctx.font =
        "600 22px Arial, 'Microsoft YaHei', sans-serif";

    ctx.fillText(
        "扫码直达博客",
        qrX +
            qrSize / 2,
        qrY +
            qrSize +
            58,
    );

    ctx.fillStyle =
        "rgba(51, 65, 85, 0.55)";

    ctx.font =
        "400 17px Arial, 'Microsoft YaHei', sans-serif";

    const shortUrl =
        truncateText(
            ctx,
            shareUrl.replace(
                /^https?:\/\//,
                "",
            ),
            qrSize,
        );

    ctx.fillText(
        shortUrl,
        qrX +
            qrSize / 2,
        qrY +
            qrSize +
            86,
    );

    /*
     * 底部
     */
    ctx.textAlign =
        "left";

    ctx.fillStyle =
        "rgba(2, 132, 199, 0.12)";

    drawCircle(
        ctx,
        85,
        1200,
        24,
    );

    ctx.fill();

    ctx.fillStyle =
        "rgba(56, 189, 248, 0.18)";

    drawCircle(
        ctx,
        140,
        1200,
        11,
    );

    ctx.fill();

    ctx.fillStyle =
        "#64748b";

    ctx.font =
        "500 18px Arial, 'Microsoft YaHei', sans-serif";

    ctx.fillText(
        "记录生活 · 分享文字 · 留下思考",
        82,
        1235,
    );

    ctx.fillStyle =
        "rgba(15, 23, 42, 0.32)";

    ctx.textAlign =
        "right";

    ctx.fillText(
        "bxdcblog.vercel.app",
        width - 82,
        1235,
    );

    return canvas;
}

function getPosterOverlay() {
    let overlay =
        document.getElementById(
            SHARE_POSTER_OVERLAY_ID,
        );

    if (overlay) {
        return overlay;
    }

    overlay =
        document.createElement(
            "div",
        );

    overlay.id =
        SHARE_POSTER_OVERLAY_ID;

    overlay.innerHTML = `
        <div class="share-poster-modal">
            <div class="share-poster-header">
                <div>
                    <div class="share-poster-header-title">
                        分享文章
                    </div>

                    <div class="share-poster-header-subtitle">
                        已生成专属分享海报
                    </div>
                </div>

                <button
                    type="button"
                    class="share-poster-close"
                    id="sharePosterClose"
                    aria-label="关闭"
                >
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>

            <div class="share-poster-preview-wrap">
                <div class="share-poster-preview-container">
                    <canvas
                        id="sharePosterPreview"
                    ></canvas>

                    <div
                        class="share-poster-loading"
                        id="sharePosterLoading"
                    >
                        <div class="share-poster-spinner"></div>
                    </div>
                </div>
            </div>

            <div class="share-poster-actions">
                <button
                    type="button"
                    class="share-poster-action share-poster-save"
                    id="sharePosterSave"
                >
                    <i class="fa-solid fa-download"></i>
                    保存图片
                </button>

                <button
                    type="button"
                    class="share-poster-action share-poster-native"
                    id="sharePosterNative"
                >
                    <i class="fa-solid fa-share-nodes"></i>
                    分享
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(
        overlay,
    );

    const closeButton =
        overlay.querySelector(
            "#sharePosterClose",
        ) as HTMLButtonElement;

    closeButton.addEventListener(
        "click",
        () => {
            playCloseAnimation(
                overlay!,
                shareOriginButton,
            );
        },
    );

    overlay.addEventListener(
        "click",
        (event) => {
            if (
                event.target ===
                overlay
            ) {
                playCloseAnimation(
                    overlay!,
                    shareOriginButton,
                );
            }
        },
    );

    /*
     * ESC 关闭
     */
    document.addEventListener(
        "keydown",
        (event) => {
            if (
                event.key ===
                    "Escape" &&
                overlay!.classList.contains(
                    "active",
                )
            ) {
                playCloseAnimation(
                    overlay!,
                    shareOriginButton,
                );
            }
        },
    );

    return overlay;
}

let currentPosterCanvas:
    HTMLCanvasElement | null =
        null;

let currentPosterTitle =
    "文章分享";

let currentPosterUrl =
    window.location.href;

async function openSharePoster(
    button: HTMLElement,
) {
    injectStyles();

    shareOriginButton =
        button;

    const overlay =
        getPosterOverlay();

    const preview =
        overlay.querySelector(
            "#sharePosterPreview",
        ) as HTMLCanvasElement;

    const loading =
        overlay.querySelector(
            "#sharePosterLoading",
        ) as HTMLElement;

    const saveButton =
        overlay.querySelector(
            "#sharePosterSave",
        ) as HTMLButtonElement;

    const nativeButton =
        overlay.querySelector(
            "#sharePosterNative",
        ) as HTMLButtonElement;

    const titleElement =
        document.getElementById(
            "viewTitle",
        );

    const title =
        titleElement?.innerText.trim() ||
        "文章分享";

    const shareUrl =
        window.location.href;

    currentPosterTitle =
        title;

    currentPosterUrl =
        shareUrl;

    loading.style.display =
        "flex";

    loading.innerHTML = `
        <div class="share-poster-spinner"></div>
    `;

    saveButton.disabled = true;
    nativeButton.disabled = true;

    /*
     * 先生成海报。
     *
     * 但这里先执行打开动画，
     * 让用户看到“从按钮出来”的感觉。
     */
    playOpenAnimation(
        overlay,
        button,
    );

    try {
        const canvas =
            await createSharePoster(
                title,
                shareUrl,
            );

        currentPosterCanvas =
            canvas;

        preview.width =
            canvas.width;

        preview.height =
            canvas.height;

        const previewContext =
            preview.getContext(
                "2d",
            )!;

        previewContext.clearRect(
            0,
            0,
            preview.width,
            preview.height,
        );

        previewContext.drawImage(
            canvas,
            0,
            0,
        );

        loading.style.display =
            "none";

        saveButton.disabled =
            false;

        nativeButton.disabled =
            false;
    } catch (error) {
        console.error(
            "分享海报生成失败:",
            error,
        );

        loading.innerHTML = `
            <div style="
                text-align:center;
                line-height:1.7;
            ">
                <div style="
                    font-size:24px;
                    margin-bottom:6px;
                ">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                </div>

                <div>
                    海报生成失败
                </div>
            </div>
        `;
    }
}

function downloadPoster() {
    if (
        !currentPosterCanvas
    ) {
        return;
    }

    const link =
        document.createElement(
            "a",
        );

    const safeTitle =
        currentPosterTitle
            .replace(
                /[\\/:*?"<>|]/g,
                "",
            )
            .slice(0, 40) ||
        "文章分享";

    link.download =
        `${safeTitle}-分享海报.png`;

    link.href =
        currentPosterCanvas.toDataURL(
            "image/png",
        );

    link.click();
}

async function nativeSharePoster() {
    if (
        !currentPosterCanvas
    ) {
        return;
    }

    try {
        const blob =
            await new Promise<Blob | null>(
                (resolve) => {
                    currentPosterCanvas!.toBlob(
                        resolve,
                        "image/png",
                        0.95,
                    );
                },
            );

        if (!blob) {
            throw new Error(
                "无法生成图片",
            );
        }

        const file =
            new File(
                [blob],
                "分享海报.png",
                {
                    type: "image/png",
                },
            );

        if (
            navigator.share &&
            navigator.canShare &&
            navigator.canShare({
                files: [file],
            })
        ) {
            await navigator.share({
                title:
                    currentPosterTitle,

                text:
                    `分享文章：${currentPosterTitle}`,

                url:
                    currentPosterUrl,

                files: [file],
            });

            return;
        }

        if (
            navigator.share
        ) {
            await navigator.share({
                title:
                    currentPosterTitle,

                text:
                    `分享文章：${currentPosterTitle}`,

                url:
                    currentPosterUrl,
            });

            return;
        }

        downloadPoster();
    } catch (error) {
        if (
            error instanceof DOMException &&
            error.name ===
                "AbortError"
        ) {
            return;
        }

        console.error(
            "系统分享失败:",
            error,
        );

        downloadPoster();
    }
}

function bindSharePosterButtons() {
    /*
     * 捕获阶段拦截原来的分享按钮。
     */
    document.addEventListener(
        "click",
        (event) => {
            const target =
                event.target as HTMLElement;

            const shareButton =
                target.closest(
                    "#shareBtn",
                ) as HTMLElement | null;

            if (
                !shareButton
            ) {
                return;
            }

            event.preventDefault();

            event.stopPropagation();

            event.stopImmediatePropagation();

            void openSharePoster(
                shareButton,
            );
        },
        true,
    );

    /*
     * 保存 / 系统分享。
     */
    document.addEventListener(
        "click",
        (event) => {
            const target =
                event.target as HTMLElement;

            if (
                target.closest(
                    "#sharePosterSave",
                )
            ) {
                event.preventDefault();

                event.stopPropagation();

                downloadPoster();

                return;
            }

            if (
                target.closest(
                    "#sharePosterNative",
                )
            ) {
                event.preventDefault();

                event.stopPropagation();

                void nativeSharePoster();
            }
        },
        true,
    );
}

if (
    document.readyState ===
    "loading"
) {
    document.addEventListener(
        "DOMContentLoaded",
        bindSharePosterButtons,
        {
            once: true,
        },
    );
} else {
    bindSharePosterButtons();
}