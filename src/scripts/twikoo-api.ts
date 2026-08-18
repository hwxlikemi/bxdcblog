import { siteConfig } from "../config";


const TWIKOO_API =
    siteConfig.twikoo.envId;


/**
 * 发布评论
 */
export async function submitComment(
    data:any
){

    const response =
        await fetch(
            `${TWIKOO_API}/comment`,
            {

                method:"POST",

                headers:{
                    "Content-Type":
                    "application/json"
                },

                body:JSON.stringify({

                    nick:
                    data.nick,


                    mail:
                    data.mail,


                    comment:
                    data.comment,


                    path:
                    window.location.pathname

                })

            }
        );


    if(!response.ok){

        throw new Error(
            "Twikoo comment failed"
        );

    }


    return response.json();

}



/**
 * 获取评论
 */
export async function fetchComments(){

    const response =
        await fetch(
            `${TWIKOO_API}/comments?path=${encodeURIComponent(
                window.location.pathname
            )}`
        );


    if(!response.ok){

        throw new Error(
            "Twikoo load failed"
        );

    }


    return response.json();

}