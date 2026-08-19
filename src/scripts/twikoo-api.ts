import { siteConfig } from "../config";


/**
 * Twikoo API
 *
 * 保留自定义评论 UI
 * 不加载 Twikoo 默认组件
 */


const envId =
    siteConfig.twikoo.envId.replace(/\/$/, "");



/**
 * 获取 Twikoo 云函数地址
 */
function apiUrl(){

    return `${envId}/api/comment`;

}



/**
 * 发布评论
 */
export async function submitComment(
    data:any
){

    const body = {

        event:"COMMENT_CREATE",

        data:{

            nick:data.nick,

            mail:data.mail,

            comment:data.comment,

            url:
            window.location.pathname

        }

    };


    const res =
        await fetch(
            apiUrl(),
            {

                method:"POST",

                headers:{
                    "Content-Type":
                    "application/json"
                },

                body:
                JSON.stringify(body)

            }
        );


    if(!res.ok){

        throw new Error(
            "评论提交失败"
        );

    }


    return await res.json();

}




/**
 * 获取评论列表
 */
export async function fetchComments(){

    const body = {

        event:"COMMENT_GET",

        data:{

            url:
            window.location.pathname

        }

    };


    const res =
        await fetch(
            apiUrl(),
            {

                method:"POST",

                headers:{
                    "Content-Type":
                    "application/json"
                },


                body:
                JSON.stringify(body)

            }
        );



    if(!res.ok){

        throw new Error(
            "评论加载失败"
        );

    }



    const result =
        await res.json();



    /**
     * 兼容 Twikoo 返回格式
     */
    if(
        Array.isArray(result)
    ){

        return result;

    }



    if(
        Array.isArray(result.data)
    ){

        return result.data;

    }



    if(
        Array.isArray(result.comments)
    ){

        return result.comments;

    }



    return [];

}