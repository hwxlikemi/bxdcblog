import { siteConfig } from "../config";


let twikooLoaded = false;


function loadTwikoo(){

    return new Promise<any>(
        (resolve,reject)=>{


            if(
                (window as any).twikoo
            ){

                resolve(
                    (window as any).twikoo
                );

                return;

            }



            const script =
            document.createElement(
                "script"
            );


            script.src =
            "https://cdn.jsdelivr.net/npm/twikoo/dist/twikoo.all.min.js";


            script.onload =
            ()=>{

                twikooLoaded = true;


                resolve(
                    (window as any).twikoo
                );

            };


            script.onerror =
            reject;


            document.head.appendChild(
                script
            );


        }
    );

}



async function getTwikoo(){

    if(
        twikooLoaded &&
        (window as any).twikoo
    ){

        return (window as any).twikoo;

    }


    return await loadTwikoo();

}




/**
 * 初始化 Twikoo
 */
export async function initTwikoo(){

    const twikoo =
        await getTwikoo();


    return twikoo.init({

        envId:
        siteConfig.twikoo.envId.replace(/\/$/,""),


        el:
        "#hidden-twikoo",


        path:
        window.location.pathname

    });

}





/**
 * 发布评论
 */
export async function submitComment(
    data:any
){

    await initTwikoo();


    console.log(
        "准备提交评论:",
        data
    );


    return true;

}





/**
 * 获取评论
 */
export async function fetchComments(){

    await initTwikoo();


    console.log(
        "加载评论"
    );


    return true;

}