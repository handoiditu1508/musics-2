import{aF as w,aG as C,aA as d,aH as S,aI as $,g as k,d as b,r as x,i as A,j as R,s as F,c as M,f as B,w as U,aJ as h,aK as f}from"./index-Bs6vVaIv.js";function I(t){return String(t).match(/[\d.\-+]*\s*(.*)/)[1]||""}function L(t){return parseFloat(t)}const Q=(t,s=2)=>{if(t===0)return"0 Bytes";const a=1024,e=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],r=Math.floor(Math.log(t)/Math.log(a));return`${parseFloat((t/Math.pow(a,r)).toFixed(s))} ${e[r]}`},X=t=>{const s=Math.floor(t/3600),a=Math.floor(t%3600/60),e=Math.floor(t%60);return s>0?`${s}:${String(a).padStart(2,"0")}:${String(e).padStart(2,"0")}`:`${a}:${String(e).padStart(2,"0")}`},T=w.injectEndpoints({endpoints:t=>({getAudioFiles:t.query({query:()=>"/js/filesList.json",transformResponse:s=>s.map(a=>({...a,path:`${d.API_URL}/musics/${a.name}`})),onQueryStarted:async(s,a)=>{try{const{data:e}=await a.queryFulfilled;a.dispatch($(e))}catch{}},providesTags:(s,a)=>S("AudioFile",s,a)}),getLyrics:t.query({queryFn:async(s,a,e,r)=>{var i=await fetch(`/${d.API_URL}lyrics/${s}`);return i.ok?{data:(await i.text()).trim()}:{error:{error:"Error fetching lyrics",originalStatus:i.status,status:i.status,data:void 0}}},providesTags:(s,a,e)=>C("AudioFile",`LYRICS-${e}`,a)})})}),{useGetAudioFilesQuery:N,useGetLyricsQuery:O}=T;function j(t){return k("MuiSkeleton",t)}b("MuiSkeleton",["root","text","rectangular","rounded","circular","pulse","wave","withChildren","fitContent","heightAuto"]);const q=t=>{const{classes:s,variant:a,animation:e,hasChildren:r,width:i,height:o}=t;return B({root:["root",a,e,r&&"withChildren",r&&!i&&"fitContent",r&&!o&&"heightAuto"]},j,s)},n=f`
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
      `:null,G=typeof l!="string"?h`
        &::after {
          animation: ${l} 2s linear 0.5s infinite;
        }
      `:null,K=F("span",{name:"MuiSkeleton",slot:"Root",overridesResolver:(t,s)=>{const{ownerState:a}=t;return[s.root,s[a.variant],a.animation!==!1&&s[a.animation],a.hasChildren&&s.withChildren,a.hasChildren&&!a.width&&s.fitContent,a.hasChildren&&!a.height&&s.heightAuto]}})(U(({theme:t})=>{const s=I(t.shape.borderRadius)||"px",a=L(t.shape.borderRadius);return{display:"block",backgroundColor:t.vars?t.vars.palette.Skeleton.bg:t.alpha(t.palette.text.primary,t.palette.mode==="light"?.11:.13),height:"1.2em",variants:[{props:{variant:"text"},style:{marginTop:0,marginBottom:0,height:"auto",transformOrigin:"0 55%",transform:"scale(1, 0.60)",borderRadius:`${a}${s}/${Math.round(a/.6*10)/10}${s}`,"&:empty:before":{content:'"\\00a0"'}}},{props:{variant:"circular"},style:{borderRadius:"50%"}},{props:{variant:"rounded"},style:{borderRadius:(t.vars||t).shape.borderRadius}},{props:({ownerState:e})=>e.hasChildren,style:{"& > *":{visibility:"hidden"}}},{props:({ownerState:e})=>e.hasChildren&&!e.width,style:{maxWidth:"fit-content"}},{props:({ownerState:e})=>e.hasChildren&&!e.height,style:{height:"auto"}},{props:{animation:"pulse"},style:E||{animation:`${n} 2s ease-in-out 0.5s infinite`}},{props:{animation:"wave"},style:{position:"relative",overflow:"hidden",WebkitMaskImage:"-webkit-radial-gradient(white, black)","&::after":{background:`linear-gradient(
                90deg,
                transparent,
                ${(t.vars||t).palette.action.hover},
                transparent
              )`,content:'""',position:"absolute",transform:"translateX(-100%)",bottom:0,left:0,right:0,top:0}}},{props:{animation:"wave"},style:G||{"&::after":{animation:`${l} 2s linear 0.5s infinite`}}}]}})),_=x.forwardRef(function(s,a){const e=A({props:s,name:"MuiSkeleton"}),{animation:r="pulse",className:i,component:o="span",height:u,style:g,variant:m="text",width:y,...p}=e,c={...e,animation:r,component:o,variant:m,hasChildren:!!p.children},v=q(c);return R.jsx(K,{as:o,ref:a,className:M(v.root,i),ownerState:c,...p,style:{width:y,height:u,...g}})});export{_ as S,O as a,Q as b,X as f,N as u};
