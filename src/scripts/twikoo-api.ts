import twikoo from "twikoo";
import { siteConfig } from "../config";


export async function submitComment(data:any){

    return await twikoo.addComment({

        envId:
        siteConfig.twikoo.envId,


        path:
        window.location.pathname,


        nick:
        data.nick,


        mail:
        data.mail,


        comment:
        data.comment

    });

}



export async function fetchComments(){

    return await twikoo.getComments({

        envId:
        siteConfig.twikoo.envId,


        path:
        window.location.pathname

    });

}
