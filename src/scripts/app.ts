// src/scripts/app.ts

import { playlist } from "../data/music";
import { siteConfig } from "../config";


/*
========================================================
Twikoo 配置
只作为评论 API 使用
不渲染官方评论界面
========================================================
*/

declare global {
    interface Window {
        twikoo?: any;
        twikooReady?: boolean;
    }
}


let twikooInstance:any = null;


/*
========================================================
初始化 Twikoo
========================================================
*/

async function initTwikoo(){

    if(
        window.twikooReady
    ){
        return;
    }


    if(
        !window.twikoo
    ){

        console.error(
            "Twikoo脚本未加载"
        );

        return;
    }



    try{

        twikooInstance =
            await window.twikoo.init({

                envId:
                    "https://kwitoo-bxdc.vercel.app",

                el:
                    "#hidden-twikoo",

                path:
                    location.pathname

            });



        window.twikooReady =
            true;


        console.log(
            "Twikoo初始化成功"
        );


    }catch(e){

        console.error(
            "Twikoo初始化失败",
            e
        );

    }

}



initTwikoo();





/*
========================================================
Twikoo 发布评论
========================================================
*/


async function submitTwikooComment(data:any){

    if(
        !window.twikoo
    ){

        throw new Error(
            "Twikoo未加载"
        );

    }


    /*
        使用 Twikoo 内部 API
        不显示官方 UI
    */


    const result =
        await window.twikoo.addComment({

            envId:
                "https://kwitoo-bxdc.vercel.app",

            path:
                location.pathname,

            nick:
                data.nick,

            mail:
                data.mail,

            comment:
                data.comment

        });



    return result;

}





/*
========================================================
获取评论
========================================================
*/


async function getTwikooComments(){


    if(
        !window.twikoo
    ){

        return [];

    }



    try{


        const result =
            await window.twikoo.getComments({

                envId:
                    "https://kwitoo-bxdc.vercel.app",

                path:
                    location.pathname

            });



        return result;


    }catch(e){


        console.error(
            "获取评论失败",
            e
        );


        return [];

    }


}






/* ================================================================
1. 动态日历
================================================================ */


function renderDynamicCalendar() {


    const calendarTitle =
        document.getElementById(
            "calendarTitle"
        );


    const calendarGrid =
        document.getElementById(
            "calendarGrid"
        );



    if(
        !calendarTitle ||
        !calendarGrid
    ){
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
            `${year}年 ${month+1}月`;

    }




    const headers =
        calendarGrid.querySelectorAll(
            ".cal-day-header"
        );



    calendarGrid.innerHTML =
        "";



    headers.forEach(
        header=>{
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
        firstDay===0
        ?
        6
        :
        firstDay-1;



    const daysInMonth =
        new Date(
            year,
            month+1,
            0
        ).getDate();




    for(
        let i=0;
        i<startOffset;
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
        let day=1;
        day<=daysInMonth;
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
            day===todayDate
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
/*
========================================================
14. 发布评论（Twikoo API）
替换原来的 submitComment
========================================================
*/


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





async function sendComment(){


    const val =
        (document.getElementById(
            "commentInputField"
        ) as HTMLTextAreaElement)
        ?.value
        .trim();



    const name =
        (
            commentNameField as HTMLInputElement
        )
        ?.value
        .trim();



    const email =
        (
            commentEmailField as HTMLInputElement
        )
        ?.value
        .trim();





    if(!name){


        showToast(
            "请先填写昵称"
        );


        commentNameField?.focus();


        return;

    }





    if(!val){


        showToast(
            "请输入评论内容"
        );


        return;

    }





    if(!email){


        showToast(
            "请先填写邮箱"
        );


        return;

    }






    try{


        sendCommentBtn?.setAttribute(
            "disabled",
            "true"
        );



        await submitTwikooComment({

            nick:
                name,


            mail:
                email,


            comment:
                val

        });






        showToast(
            "评论发布成功！"
        );






        (
            document.getElementById(
                "commentInputField"
            ) as HTMLTextAreaElement
        ).value = "";




        (
            document.getElementById(
                "commentInputField"
            ) as HTMLTextAreaElement
        ).placeholder =
            "善语结善缘，恶语伤人心...";






        loadTwikooComments();





    }catch(e){


        console.error(
            "发布评论失败",
            e
        );



        showToast(
            "评论发布失败"
        );



    }finally{


        sendCommentBtn?.removeAttribute(
            "disabled"
        );


    }


}








/*
========================================================
加载评论列表
保持你的磨砂 UI
只读取 Twikoo 数据
========================================================
*/


async function loadTwikooComments(){


    try{


        const comments =
            await getTwikooComments();




        if(
            !commentListScroll
        ){

            return;

        }





        commentListScroll.innerHTML =
            "";





        let count =
            0;





        comments.forEach(
            (item:any)=>{



                count++;




                const node =
                    document.createElement(
                        "div"
                    );



                node.className =
                    "comment-node";






                node.innerHTML =
                `

                <img
                    src="
                    https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                        item.nick || "user"
                    )}
                    "
                    class="comment-avatar"
                >



                <div class="comment-content-box">


                    <div class="comment-user-name">

                        ${escapeHtml(
                            item.nick || ""
                        )}

                    </div>



                    <div class="comment-text">

                        ${escapeHtml(
                            item.comment || ""
                        )}

                    </div>



                </div>


                `;




                commentListScroll.appendChild(
                    node
                );



            }
        );





        if(
            commentCount
        ){

            commentCount.innerText =
                String(count);

        }





    }catch(e){


        console.error(
            "评论加载失败",
            e
        );


    }


}





/*
打开评论页面时自动刷新
*/

commentBtn?.addEventListener(
    "click",
    ()=>{

        setTimeout(
            ()=>{

                loadTwikooComments();

            },
            650
        );

    }
);
/*
========================================================
17. Twikoo启动补充
========================================================

注意：
这里不要调用 twikoo 官方渲染。

你的 CommentPage.astro 里面：

<div id="hidden-twikoo"></div>

只作为隐藏通信节点。


========================================================
*/

document.addEventListener(
    "DOMContentLoaded",
    ()=>{


        /*
        确保 Twikoo 已初始化
        */

        setTimeout(
            ()=>{

                initTwikoo();

            },
            300
        );



    }
);







/*
========================================================
18. ESC关闭优化
========================================================
*/


document.addEventListener(
    "keydown",
    (e)=>{


        if(
            e.key !== "Escape"
        ){

            return;

        }



        if(
            commentPageOverlay &&
            commentPageOverlay.classList.contains(
                "active"
            )
        ){

            closeCommentPage();

            return;

        }




        if(
            overlay &&
            overlay.classList.contains(
                "active"
            )
        ){

            closeArticle();

        }


    }
);








/*
========================================================
19. Astro事件绑定
========================================================
*/


document
.querySelectorAll(
    ".post-card"
)
.forEach(
    (card)=>{


        const open = ()=>{


            const el =
                card as HTMLElement;



            openArticle(

                el,


                el.dataset.title || "",


                el.dataset.date || "",


                el.dataset.category || "",


                el.dataset.content || ""

            );


        };





        card.addEventListener(
            "click",
            open
        );





        card.addEventListener(
            "keydown",
            (event)=>{


                const e =
                    event as KeyboardEvent;



                if(
                    e.key==="Enter" ||
                    e.key===" "
                ){

                    e.preventDefault();


                    open();


                }


            }
        );


    }
);








/*
========================================================
20. 图片 fallback
========================================================
*/


document
.querySelectorAll(
    "img[data-fallback]"
)
.forEach(
    (img)=>{


        img.addEventListener(
            "error",
            ()=>{


                const element =
                    img as HTMLImageElement;



                const fallback =
                    element.dataset.fallback;




                if(
                    fallback &&
                    element.src !== fallback
                ){

                    element.src =
                        fallback;

                }


            },
            {
                once:true
            }
        );


    }
);







/*
========================================================
21. 首次加载评论
========================================================
*/


loadTwikooComments();
