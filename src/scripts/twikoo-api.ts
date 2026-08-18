import { siteConfig } from "../config";


const TWIKOO_API =
    siteConfig.twikoo.envId;


/**
 * 调用 Twikoo API
 */
async function twikooRequest(
    action:string,
    data:any = {}
){

    const res =
        await fetch(
            `${TWIKOO_API}/api/${action}`,
            {

                method:"POST",

                headers:{
                    "Content-Type":
                    "application/json"
                },

                body:
                JSON.stringify(data)

            }
        );


    const json =
        await res.json();


    if(
        json.code !== 0
    ){

        throw new Error(
            json.message ||
            "Twikoo API Error"
        );

    }


    return json;
}



/**
 * 发布评论
 */
export async function submitComment(
    data:any
){

    return await twikooRequest(
        "comment",
        {

            event:
            "COMMENT_CREATE",


            nick:
            data.nick,


            mail:
            data.mail,


            text:
            data.comment,


            path:
            window.location.pathname

        }
    );

}



/**
 * 获取评论
 */
export async function fetchComments(){

    return await twikooRequest(
        "comment",
        {

            event:
            "COMMENT_GET",


            path:
            window.location.pathname

        }
    );

}