// src/scripts/app.ts 第一部分

import { playlist } from "../data/music";
import { siteConfig } from "../config";

import {
    submitComment,
    fetchComments
} from "./twikoo-api";



/* ================================================================
   Twikoo 配置
   仅作为 API 使用
   不加载 Twikoo 官方 UI
================================================================ */

const TWIKOO_API_ONLY = true;



/* ================================================================
1. 动态日历
================================================================ */

function renderDynamicCalendar() {

    const calendarTitle =
        document.getElementById(
            "calendarTitle"
        ) as HTMLElement | null;


    const calendarGrid =
        document.getElementById(
            "calendarGrid"
        ) as HTMLElement | null;



    if (
        !calendarTitle ||
        !calendarGrid
    ) {
        return;
    }



    const now =
        new Date();



    const year =
        now.getFullYear();


    const month =
        now.getMonth();


    const todayDate =
        now.getDate();



    const titleSpan =
        calendarTitle.querySelector(
            "span"
        );


    if(titleSpan){

        titleSpan.innerText =
            `${year}年 ${month + 1}月`;

    }



    const headers =
        calendarGrid.querySelectorAll(
            ".cal-day-header"
        );



    calendarGrid.innerHTML =
        "";



    headers.forEach(
        header => {

            calendarGrid.appendChild(
                header
            );

        }
    );



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



    for(
        let i = 0;
        i < startOffset;
        i++
    ){

        const emptyCell =
            document.createElement(
                "div"
            );


        emptyCell.className =
            "cal-day";


        calendarGrid.appendChild(
            emptyCell
        );

    }




    for(
        let day = 1;
        day <= daysInMonth;
        day++
    ){

        const dayCell =
            document.createElement(
                "div"
            );


        dayCell.className =
            "cal-day";


        dayCell.innerText =
            String(day);



        if(
            day === todayDate
        ){

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
) as HTMLInputElement | null;



const blurRange =
document.getElementById(
    "blurRange"
) as HTMLInputElement | null;



const opacityVal =
document.getElementById(
    "opacityVal"
);



const blurVal =
document.getElementById(
    "blurVal"
);




opacityRange?.addEventListener(
    "input",
    (e)=>{

        const value =
            Number(
                (e.target as HTMLInputElement).value
            );


        document.documentElement.style.setProperty(
            "--glass-opacity",
            String(value)
        );


        if(opacityVal){

            opacityVal.innerText =
                Math.round(
                    value * 100
                ) + "%";

        }

    }
);




blurRange?.addEventListener(
    "input",
    (e)=>{


        const value =
            Number(
                (e.target as HTMLInputElement).value
            );


        document.documentElement.style.setProperty(
            "--glass-blur",
            value + "px"
        );



        if(blurVal){

            blurVal.innerText =
                value + "px";

        }


    }
);




const refractiveRange =
document.getElementById(
    "refractiveRange"
) as HTMLInputElement | null;



const refractiveVal =
document.getElementById(
    "refractiveVal"
);



refractiveRange?.addEventListener(
    "input",
    (e)=>{


        const value =
            Number(
                (e.target as HTMLInputElement).value
            );



        document.documentElement.style.setProperty(
            "--glass-refractive-index",
            String(value)
        );



        if(refractiveVal){

            refractiveVal.innerText =
                value.toFixed(2);

        }


    }
);





/* ================================================================
3. Toast
================================================================ */


function showToast(
    msg:string
){

    const toast =
        document.getElementById(
            "glassToast"
        );



    if(!toast){
        return;
    }



    toast.innerText =
        msg;



    toast.classList.add(
        "show"
    );



    setTimeout(
        ()=>{

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

import { playlist } from "../data/music";

let currentTrackIndex =
    siteConfig.music.defaultTrackIndex;



const audioPlayer =
document.getElementById(
    "audioPlayer"
) as HTMLAudioElement | null;


const largeCover =
document.getElementById(
    "largeCover"
) as HTMLImageElement | null;


const largeTitle =
document.getElementById(
    "largeTitle"
);



const largeArtist =
document.getElementById(
    "largeArtist"
);



const mainPlayBtn =
document.getElementById(
    "mainPlayBtn"
);



const mainPlayIcon =
document.getElementById(
    "mainPlayIcon"
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
) as HTMLImageElement | null;



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



const prevBtn =
document.getElementById(
    "prevBtn"
);



const nextBtn =
document.getElementById(
    "nextBtn"
);



const popPrevBtn =
document.getElementById(
    "popPrevBtn"
);



const popNextBtn =
document.getElementById(
    "popNextBtn"
);



function loadTrack(
    index:number
){

    if(
        !playlist[index] ||
        !audioPlayer
    ){
        return;
    }



    const track =
        playlist[index];



    audioPlayer.src =
        track.url;



    if(largeTitle){

        largeTitle.innerText =
            track.title;

    }



    if(popTitle){

        popTitle.innerText =
            track.title;

    }



    if(largeArtist){

        largeArtist.innerText =
            track.artist;

    }



    if(popArtist){

        popArtist.innerText =
            track.artist;

    }



    if(largeCover){

        largeCover.src =
            track.cover;

    }



    if(musicCover){

        musicCover.src =
            track.cover;

    }

}



loadTrack(
    currentTrackIndex
);





musicToggleBtn?.addEventListener(
    "click",
    (e)=>{

        e.stopPropagation();


        musicPopover?.classList.toggle(
            "active"
        );

    }
);





document.addEventListener(
    "click",
    (e)=>{

        if(
            !musicPopover?.contains(
                e.target as Node
            ) &&
            e.target !== musicToggleBtn
        ){

            musicPopover?.classList.remove(
                "active"
            );

        }

    }
);





function togglePlay(){

    if(
        !audioPlayer
    ){
        return;
    }



    if(
        audioPlayer.paused
    ){

        audioPlayer.play();

    }else{

        audioPlayer.pause();

    }

}



mainPlayBtn?.addEventListener(
    "click",
    togglePlay
);



popPlayBtn?.addEventListener(
    "click",
    togglePlay
);





prevBtn?.addEventListener(
    "click",
    ()=>{


        currentTrackIndex =
            (
                currentTrackIndex -
                1 +
                playlist.length
            )
            %
            playlist.length;



        loadTrack(
            currentTrackIndex
        );



        audioPlayer?.play();


    }
);





nextBtn?.addEventListener(
    "click",
    ()=>{


        currentTrackIndex =
            (
                currentTrackIndex +
                1
            )
            %
            playlist.length;



        loadTrack(
            currentTrackIndex
        );



        audioPlayer?.play();


    }
);





popPrevBtn?.addEventListener(
    "click",
    ()=>prevBtn?.click()
);



popNextBtn?.addEventListener(
    "click",
    ()=>nextBtn?.click()
);





audioPlayer?.addEventListener(
    "play",
    ()=>{

        if(mainPlayIcon){

            mainPlayIcon.className =
                "fa-solid fa-pause";

        }



        if(popPlayIcon){

            popPlayIcon.className =
                "fa-solid fa-pause";

        }



    }
);





audioPlayer?.addEventListener(
    "pause",
    ()=>{


        if(mainPlayIcon){

            mainPlayIcon.className =
                "fa-solid fa-play";

        }



        if(popPlayIcon){

            popPlayIcon.className =
                "fa-solid fa-play";

        }


    }
);






/* ================================================================
9. 评论系统
Twikoo API模式
不渲染官方UI
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



const commentInputField =
document.getElementById(
    "commentInputField"
) as HTMLTextAreaElement | null;



const commentNameField =
document.getElementById(
    "commentNameField"
) as HTMLInputElement | null;



const commentEmailField =
document.getElementById(
    "commentEmailField"
) as HTMLInputElement | null;



const commentListScroll =
document.getElementById(
    "commentListScroll"
);



const commentCount =
document.getElementById(
    "commentCount"
);



const sendCommentBtn =
document.getElementById(
    "sendCommentBtn"
);



let commentAnimationLocked =
false;





/* 打开评论页面 */

commentBtn?.addEventListener(
    "click",
    ()=>{


        if(commentAnimationLocked){
            return;
        }



        commentAnimationLocked =
            true;



        const rect =
            commentBtn.getBoundingClientRect();



        commentCurtain?.style.setProperty(
            "--cx",
            rect.left +
            rect.width / 2 +
            "px"
        );



        commentCurtain?.style.setProperty(
            "--cy",
            rect.top +
            rect.height / 2 +
            "px"
        );



        commentPageOverlay?.classList.remove(
            "closing"
        );



        commentPageOverlay?.classList.add(
            "active"
        );



        setTimeout(
            ()=>{

                commentAnimationLocked =
                    false;

            },
            600
        );

    }
);





function closeCommentPage(){

    if(commentAnimationLocked){
        return;
    }



    commentAnimationLocked =
        true;



    commentPageOverlay?.classList.add(
        "closing"
    );



    setTimeout(
        ()=>{

            commentPageOverlay?.classList.remove(
                "active"
            );



            commentPageOverlay?.classList.remove(
                "closing"
            );



            commentAnimationLocked =
                false;


        },
        600
    );

}



commentPageBackBtn?.addEventListener(
    "click",
    closeCommentPage
);





/* HTML转义 */

function escapeHtml(
    text:string
){

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}





/* ================================================================
加载 Twikoo 评论数据
只填充自己的磨砂列表
================================================================ */


async function loadTwikooComments(){

    try{


        const comments =
            await fetchComments();



        if(
            !commentListScroll
        ){
            return;
        }



        commentListScroll.innerHTML =
            "";



        if(commentCount){

            commentCount.innerText =
                String(
                    comments.length
                );

        }




        comments.forEach(
            (item:any)=>{


                const node =
                    document.createElement(
                        "div"
                    );



                node.className =
                    "comment-node";



                node.innerHTML =
                `
                <img
                    class="comment-avatar"
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(item.nick || "user")}"
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


    }catch(err){

        console.error(
            "加载评论失败",
            err
        );

    }

}





/* 发布评论 */


sendCommentBtn?.addEventListener(
    "click",
    async ()=>{


        const name =
            commentNameField?.value.trim() || "";



        const email =
            commentEmailField?.value.trim() || "";



        const content =
            commentInputField?.value.trim() || "";



        if(!name){

            showToast(
                "请输入昵称"
            );

            return;

        }



        if(!email){

            showToast(
                "请输入邮箱"
            );

            return;

        }



        if(!content){

            showToast(
                "请输入评论内容"
            );

            return;

        }



        try{


            await submitComment({

                nick:name,

                mail:email,

                comment:content

            });



            showToast(
                "评论发布成功"
            );



            if(commentInputField){

                commentInputField.value =
                    "";

            }



            loadTwikooComments();



        }catch(e){


            console.error(
                e
            );


            showToast(
                "评论发布失败"
            );


        }


    }
);



loadTwikooComments();
