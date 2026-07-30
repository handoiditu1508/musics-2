import{ao as C,ap as $,K as m,aq as k,ar as F,f as A,z as B,r as R,A as M,j as a,w as g,a as T,d as U,x as L,as as f,at as y,au as q,av as I,J as v,T as d}from"./index-D4AWE2Ws.js";function X(t){return String(t).match(/[\d.\-+]*\s*(.*)/)[1]||""}function E(t){return parseFloat(t)}const P=(t,i=2)=>{if(t===0)return"0 Bytes";const e=1024,s=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],r=Math.floor(Math.log(t)/Math.log(e));return`${parseFloat((t/Math.pow(e,r)).toFixed(i))} ${s[r]}`},K=t=>{const i=Math.floor(t/3600),e=Math.floor(t%3600/60),s=Math.floor(t%60);return i>0?`${i}:${String(e).padStart(2,"0")}:${String(s).padStart(2,"0")}`:`${e}:${String(s).padStart(2,"0")}`},W=C.injectEndpoints({endpoints:t=>({getAudioFiles:t.query({query:()=>"/js/filesList.json",transformResponse:i=>i.map(e=>({...e,path:`${m.API_URL}/musics/${e.name}`})),onQueryStarted:async(i,e)=>{try{const{data:s}=await e.queryFulfilled;e.dispatch(F(s))}catch{}},providesTags:(i,e)=>k("AudioFile",i,e)}),getLyrics:t.query({queryFn:async(i,e,s,r)=>{var o=await fetch(`/${m.API_URL}lyrics/${i}`);return o.ok?{data:(await o.text()).trim()}:{error:{error:"Error fetching lyrics",originalStatus:o.status,status:o.status,data:void 0}}},providesTags:(i,e,s)=>$("AudioFile",`LYRICS-${s}`,e)})})}),{useGetLyricsQuery:z}=W;function G(t){return A("MuiSkeleton",t)}B("MuiSkeleton",["root","text","rectangular","rounded","circular","pulse","wave","withChildren","fitContent","heightAuto"]);const N=t=>{const{classes:i,variant:e,animation:s,hasChildren:r,width:o,height:l}=t;return U({root:["root",e,s,r&&"withChildren",r&&!o&&"fitContent",r&&!l&&"heightAuto"]},G,i)},c=y`
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }

  100% {
    opacity: 1;
  }
`,p=y`
  0% {
    transform: translateX(-100%);
  }

  50% {
    /* +0.5s of delay between each loop */
    transform: translateX(100%);
  }

  100% {
    transform: translateX(100%);
  }
`,O=typeof c!="string"?f`
        animation: ${c} 2s ease-in-out 0.5s infinite;
      `:null,Q=typeof p!="string"?f`
        &::after {
          animation: ${p} 2s linear 0.5s infinite;
        }
      `:null,_=g("span",{name:"MuiSkeleton",slot:"Root",overridesResolver:(t,i)=>{const{ownerState:e}=t;return[i.root,i[e.variant],e.animation!==!1&&i[e.animation],e.hasChildren&&i.withChildren,e.hasChildren&&!e.width&&i.fitContent,e.hasChildren&&!e.height&&i.heightAuto]}})(L(({theme:t})=>{const i=X(t.shape.borderRadius)||"px",e=E(t.shape.borderRadius);return{display:"block",backgroundColor:t.vars?t.vars.palette.Skeleton.bg:t.alpha(t.palette.text.primary,t.palette.mode==="light"?.11:.13),height:"1.2em",variants:[{props:{variant:"text"},style:{marginTop:0,marginBottom:0,height:"auto",transformOrigin:"0 55%",transform:"scale(1, 0.60)",borderRadius:`${e}${i}/${Math.round(e/.6*10)/10}${i}`,"&:empty:before":{content:'"\\00a0"'}}},{props:{variant:"circular"},style:{borderRadius:"50%"}},{props:{variant:"rounded"},style:{borderRadius:(t.vars||t).shape.borderRadius}},{props:({ownerState:s})=>s.hasChildren,style:{"& > *":{visibility:"hidden"}}},{props:({ownerState:s})=>s.hasChildren&&!s.width,style:{maxWidth:"fit-content"}},{props:({ownerState:s})=>s.hasChildren&&!s.height,style:{height:"auto"}},{props:{animation:"pulse"},style:O||{animation:`${c} 2s ease-in-out 0.5s infinite`}},{props:{animation:"wave"},style:{position:"relative",overflow:"hidden",WebkitMaskImage:"-webkit-radial-gradient(white, black)","&::after":{background:`linear-gradient(
                90deg,
                transparent,
                ${(t.vars||t).palette.action.hover},
                transparent
              )`,content:'""',position:"absolute",transform:"translateX(-100%)",bottom:0,left:0,right:0,top:0}}},{props:{animation:"wave"},style:Q||{"&::after":{animation:`${p} 2s linear 0.5s infinite`}}}]}})),n=R.forwardRef(function(i,e){const s=M({props:i,name:"MuiSkeleton"}),{animation:r="pulse",className:o,component:l="span",height:h,style:j,variant:w="text",width:b,...u}=s,x={...s,animation:r,component:l,variant:w,hasChildren:!!u.children},S=N(x);return a.jsx(_,{as:l,ref:e,className:T(S.root,o),ownerState:x,...u,style:{width:b,height:h,...j}})}),Y=g("table")(({theme:t})=>({maxWidth:400,margin:`${t.spacing(1)} auto 0`,borderCollapse:"separate",borderSpacing:t.spacing(1)}));function H(){const t=q(I),i=t&&t.lyricsFile?t.lyricsFile:"",{data:e,isFetching:s,isSuccess:r}=z(i,{skip:!i});return t&&a.jsxs(v,{sx:{paddingX:2,paddingBottom:2},children:[a.jsx(Y,{children:a.jsxs("tbody",{children:[a.jsxs("tr",{children:[a.jsx("td",{children:a.jsx(d,{children:t.name})}),a.jsx("td",{children:a.jsx(d,{variant:"body2",children:P(t.size)})})]}),a.jsxs("tr",{children:[a.jsx("td",{children:a.jsx(d,{children:t.title})}),a.jsx("td",{children:a.jsx(d,{variant:"body2",children:K(t.duration)})})]}),a.jsx("tr",{children:a.jsx("td",{children:a.jsx(d,{children:t.artists.join(", ")})})})]})}),t.lyricsFile&&a.jsxs(v,{sx:{whiteSpace:"pre-line",marginTop:2,marginX:"auto",maxWidth:600},children:[s&&a.jsxs(a.Fragment,{children:[a.jsx(n,{variant:"text",animation:"wave"}),a.jsx(n,{variant:"text",animation:"wave"}),a.jsx(n,{variant:"text",animation:"wave",width:"50%"}),a.jsx("br",{}),a.jsx(n,{variant:"text",animation:"wave"}),a.jsx(n,{variant:"text",animation:"wave"}),a.jsx(n,{variant:"text",animation:"wave",width:"50%"}),a.jsx("br",{}),a.jsx(n,{variant:"text",animation:"wave"}),a.jsx(n,{variant:"text",animation:"wave"}),a.jsx(n,{variant:"text",animation:"wave",width:"50%"}),a.jsx("br",{}),a.jsx(n,{variant:"text",animation:"wave"}),a.jsx(n,{variant:"text",animation:"wave"}),a.jsx(n,{variant:"text",animation:"wave",width:"50%"}),a.jsx("br",{}),a.jsx(n,{variant:"text",animation:"wave"}),a.jsx(n,{variant:"text",animation:"wave"}),a.jsx(n,{variant:"text",animation:"wave",width:"50%"})]}),r&&e]})]})}export{H as default};
