import { siteConfig } from "../config";


let twikooInstance:any = null;


function loadTwikoo(){

    return new Promise((resolve,reject)=>{


        if((window as any).twikoo){

            resolve(
                (window as any).twikoo
            );

            return;
        }



        const script =
        document.createElement("script");


        script.src =
        "https://cdn.jsdelivr.net/npm/twikoo/dist/twikoo.all.min.js";


        script.onload = ()=>{

            resolve(
                (window as any).twikoo
            );

        };


        script.onerror =
        reject;


        document.head.appendChild(
            script
        );


    });

}



async function getTwikoo(){

    if(twikooInstance){

        return twikooInstance;

    }


    twikooInstance =
        await loadTwikoo();


    return twikooInstance;

}




export async function submitComment(
    data:any
){

    const twikoo =
        await getTwikoo();



    return twikoo.init({

        envId:
        siteConfig.twikoo.envId,


        el:
        "#hidden-twikoo",


        path:
        window.location.pathname


    });

}




export async function initTwikoo(){

    const twikoo =
        await getTwikoo();


    return twikoo.init({

        envId:
        siteConfig.twikoo.envId,


        el:
        "#hidden-twikoo",


        path:
        window.location.pathname

    });

}