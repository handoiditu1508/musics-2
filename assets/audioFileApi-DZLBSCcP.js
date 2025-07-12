import{g as w,a as C,r as S,u as $,j as k,s as b,c as x,d as R,m as A,w as M,aV as h,aW as f,aX as B,aY as F,aS as d,aZ as U,a_ as L}from"./index-VSDYpku-.js";function T(t){return String(t).match(/[\d.\-+]*\s*(.*)/)[1]||""}function j(t){return parseFloat(t)}function I(t){return w("MuiSkeleton",t)}C("MuiSkeleton",["root","text","rectangular","rounded","circular","pulse","wave","withChildren","fitContent","heightAuto"]);const q=t=>{const{classes:e,variant:a,animation:s,hasChildren:r,width:i,height:o}=t;return R({root:["root",a,s,r&&"withChildren",r&&!i&&"fitContent",r&&!o&&"heightAuto"]},I,e)},n=f`
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }

  100% {
    opacity: 1;
  }
`,l=f`
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
`,E=typeof n!="string"?h`
        animation: ${n} 2s ease-in-out 0.5s infinite;
      `:null,X=typeof l!="string"?h`
        &::after {
          animation: ${l} 2s linear 0.5s infinite;
        }
      `:null,G=b("span",{name:"MuiSkeleton",slot:"Root",overridesResolver:(t,e)=>{const{ownerState:a}=t;return[e.root,e[a.variant],a.animation!==!1&&e[a.animation],a.hasChildren&&e.withChildren,a.hasChildren&&!a.width&&e.fitContent,a.hasChildren&&!a.height&&e.heightAuto]}})(A(({theme:t})=>{const e=T(t.shape.borderRadius)||"px",a=j(t.shape.borderRadius);return{display:"block",backgroundColor:t.vars?t.vars.palette.Skeleton.bg:M(t.palette.text.primary,t.palette.mode==="light"?.11:.13),height:"1.2em",variants:[{props:{variant:"text"},style:{marginTop:0,marginBottom:0,height:"auto",transformOrigin:"0 55%",transform:"scale(1, 0.60)",borderRadius:`${a}${e}/${Math.round(a/.6*10)/10}${e}`,"&:empty:before":{content:'"\\00a0"'}}},{props:{variant:"circular"},style:{borderRadius:"50%"}},{props:{variant:"rounded"},style:{borderRadius:(t.vars||t).shape.borderRadius}},{props:({ownerState:s})=>s.hasChildren,style:{"& > *":{visibility:"hidden"}}},{props:({ownerState:s})=>s.hasChildren&&!s.width,style:{maxWidth:"fit-content"}},{props:({ownerState:s})=>s.hasChildren&&!s.height,style:{height:"auto"}},{props:{animation:"pulse"},style:E||{animation:`${n} 2s ease-in-out 0.5s infinite`}},{props:{animation:"wave"},style:{position:"relative",overflow:"hidden",WebkitMaskImage:"-webkit-radial-gradient(white, black)","&::after":{background:`linear-gradient(
                90deg,
                transparent,
                ${(t.vars||t).palette.action.hover},
                transparent
              )`,content:'""',position:"absolute",transform:"translateX(-100%)",bottom:0,left:0,right:0,top:0}}},{props:{animation:"wave"},style:X||{"&::after":{animation:`${l} 2s linear 0.5s infinite`}}}]}})),_=S.forwardRef(function(e,a){const s=$({props:e,name:"MuiSkeleton"}),{animation:r="pulse",className:i,component:o="span",height:u,style:m,variant:g="text",width:y,...p}=s,c={...s,animation:r,component:o,variant:g,hasChildren:!!p.children},v=q(c);return k.jsx(G,{as:o,ref:a,className:x(v.root,i),ownerState:c,...p,style:{width:y,height:u,...m}})}),K=(t,e=2)=>{if(t===0)return"0 Bytes";const a=1024,s=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],r=Math.floor(Math.log(t)/Math.log(a));return`${parseFloat((t/Math.pow(a,r)).toFixed(e))} ${s[r]}`},N=t=>{const e=Math.floor(t/3600),a=Math.floor(t%3600/60),s=Math.floor(t%60);return e>0?`${e}:${String(a).padStart(2,"0")}:${String(s).padStart(2,"0")}`:`${a}:${String(s).padStart(2,"0")}`},P=B.injectEndpoints({endpoints:t=>({getAudioFiles:t.query({query:()=>"js/filesList.json",transformResponse:e=>e.map(a=>({...a,path:`${d.API_URL}musics/${a.name}`})),onQueryStarted:async(e,a)=>{try{const{data:s}=await a.queryFulfilled;a.dispatch(L(s))}catch{}},providesTags:(e,a)=>U("AudioFile",e,a)}),getLyrics:t.query({queryFn:async(e,a,s,r)=>{var i=await fetch(`${d.API_URL}lyrics/${e}`);return i.ok?{data:(await i.text()).trim()}:{error:{error:"Error fetching lyrics",originalStatus:i.status,status:i.status,data:void 0}}},providesTags:(e,a,s)=>F("AudioFile",`LYRICS-${s}`,a)})})}),{useGetAudioFilesQuery:O,useGetLyricsQuery:W}=P;export{_ as S,W as a,K as b,N as f,O as u};
