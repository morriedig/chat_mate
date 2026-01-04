(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))r(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function t(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(a){if(a.ep)return;a.ep=!0;const o=t(a);fetch(a.href,o)}})();function Oo(e){const n=Object.create(null);for(const t of e.split(","))n[t]=1;return t=>t in n}const we={},Nt=[],zn=()=>{},sl=()=>!1,ma=e=>e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&(e.charCodeAt(2)>122||e.charCodeAt(2)<97),Ro=e=>e.startsWith("onUpdate:"),Oe=Object.assign,$o=(e,n)=>{const t=e.indexOf(n);t>-1&&e.splice(t,1)},Wu=Object.prototype.hasOwnProperty,ge=(e,n)=>Wu.call(e,n),ee=Array.isArray,Mt=e=>Tr(e)==="[object Map]",ga=e=>Tr(e)==="[object Set]",wi=e=>Tr(e)==="[object Date]",re=e=>typeof e=="function",Ie=e=>typeof e=="string",Tn=e=>typeof e=="symbol",ye=e=>e!==null&&typeof e=="object",ll=e=>(ye(e)||re(e))&&re(e.then)&&re(e.catch),cl=Object.prototype.toString,Tr=e=>cl.call(e),Hu=e=>Tr(e).slice(8,-1),ul=e=>Tr(e)==="[object Object]",ya=e=>Ie(e)&&e!=="NaN"&&e[0]!=="-"&&""+parseInt(e,10)===e,tr=Oo(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"),va=e=>{const n=Object.create(null);return(t=>n[t]||(n[t]=e(t)))},Uu=/-\w/g,rt=va(e=>e.replace(Uu,n=>n.slice(1).toUpperCase())),Yu=/\B([A-Z])/g,kt=va(e=>e.replace(Yu,"-$1").toLowerCase()),dl=va(e=>e.charAt(0).toUpperCase()+e.slice(1)),La=va(e=>e?`on${dl(e)}`:""),Qn=(e,n)=>!Object.is(e,n),Br=(e,...n)=>{for(let t=0;t<e.length;t++)e[t](...n)},hl=(e,n,t,r=!1)=>{Object.defineProperty(e,n,{configurable:!0,enumerable:!1,writable:r,value:t})},fl=e=>{const n=parseFloat(e);return isNaN(n)?e:n},Bu=e=>{const n=Ie(e)?Number(e):NaN;return isNaN(n)?e:n};let _i;const xa=()=>_i||(_i=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{});function mn(e){if(ee(e)){const n={};for(let t=0;t<e.length;t++){const r=e[t],a=Ie(r)?Gu(r):mn(r);if(a)for(const o in a)n[o]=a[o]}return n}else if(Ie(e)||ye(e))return e}const qu=/;(?![^(]*\))/g,Vu=/:([^]+)/,Ku=/\/\*[^]*?\*\//g;function Gu(e){const n={};return e.replace(Ku,"").split(qu).forEach(t=>{if(t){const r=t.split(Vu);r.length>1&&(n[r[0].trim()]=r[1].trim())}}),n}function Z(e){let n="";if(Ie(e))n=e;else if(ee(e))for(let t=0;t<e.length;t++){const r=Z(e[t]);r&&(n+=r+" ")}else if(ye(e))for(const t in e)e[t]&&(n+=t+" ");return n.trim()}const Xu="itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly",Ju=Oo(Xu);function pl(e){return!!e||e===""}function Qu(e,n){if(e.length!==n.length)return!1;let t=!0;for(let r=0;t&&r<e.length;r++)t=ba(e[r],n[r]);return t}function ba(e,n){if(e===n)return!0;let t=wi(e),r=wi(n);if(t||r)return t&&r?e.getTime()===n.getTime():!1;if(t=Tn(e),r=Tn(n),t||r)return e===n;if(t=ee(e),r=ee(n),t||r)return t&&r?Qu(e,n):!1;if(t=ye(e),r=ye(n),t||r){if(!t||!r)return!1;const a=Object.keys(e).length,o=Object.keys(n).length;if(a!==o)return!1;for(const i in e){const s=e.hasOwnProperty(i),l=n.hasOwnProperty(i);if(s&&!l||!s&&l||!ba(e[i],n[i]))return!1}}return String(e)===String(n)}function Zu(e,n){return e.findIndex(t=>ba(t,n))}const ml=e=>!!(e&&e.__v_isRef===!0),x=e=>Ie(e)?e:e==null?"":ee(e)||ye(e)&&(e.toString===cl||!re(e.toString))?ml(e)?x(e.value):JSON.stringify(e,gl,2):String(e),gl=(e,n)=>ml(n)?gl(e,n.value):Mt(n)?{[`Map(${n.size})`]:[...n.entries()].reduce((t,[r,a],o)=>(t[Pa(r,o)+" =>"]=a,t),{})}:ga(n)?{[`Set(${n.size})`]:[...n.values()].map(t=>Pa(t))}:Tn(n)?Pa(n):ye(n)&&!ee(n)&&!ul(n)?String(n):n,Pa=(e,n="")=>{var t;return Tn(e)?`Symbol(${(t=e.description)!=null?t:n})`:e};let Je;class yl{constructor(n=!1){this.detached=n,this._active=!0,this._on=0,this.effects=[],this.cleanups=[],this._isPaused=!1,this.parent=Je,!n&&Je&&(this.index=(Je.scopes||(Je.scopes=[])).push(this)-1)}get active(){return this._active}pause(){if(this._active){this._isPaused=!0;let n,t;if(this.scopes)for(n=0,t=this.scopes.length;n<t;n++)this.scopes[n].pause();for(n=0,t=this.effects.length;n<t;n++)this.effects[n].pause()}}resume(){if(this._active&&this._isPaused){this._isPaused=!1;let n,t;if(this.scopes)for(n=0,t=this.scopes.length;n<t;n++)this.scopes[n].resume();for(n=0,t=this.effects.length;n<t;n++)this.effects[n].resume()}}run(n){if(this._active){const t=Je;try{return Je=this,n()}finally{Je=t}}}on(){++this._on===1&&(this.prevScope=Je,Je=this)}off(){this._on>0&&--this._on===0&&(Je=this.prevScope,this.prevScope=void 0)}stop(n){if(this._active){this._active=!1;let t,r;for(t=0,r=this.effects.length;t<r;t++)this.effects[t].stop();for(this.effects.length=0,t=0,r=this.cleanups.length;t<r;t++)this.cleanups[t]();if(this.cleanups.length=0,this.scopes){for(t=0,r=this.scopes.length;t<r;t++)this.scopes[t].stop(!0);this.scopes.length=0}if(!this.detached&&this.parent&&!n){const a=this.parent.scopes.pop();a&&a!==this&&(this.parent.scopes[this.index]=a,a.index=this.index)}this.parent=void 0}}}function ed(e){return new yl(e)}function nd(){return Je}let ke;const Na=new WeakSet;class vl{constructor(n){this.fn=n,this.deps=void 0,this.depsTail=void 0,this.flags=5,this.next=void 0,this.cleanup=void 0,this.scheduler=void 0,Je&&Je.active&&Je.effects.push(this)}pause(){this.flags|=64}resume(){this.flags&64&&(this.flags&=-65,Na.has(this)&&(Na.delete(this),this.trigger()))}notify(){this.flags&2&&!(this.flags&32)||this.flags&8||bl(this)}run(){if(!(this.flags&1))return this.fn();this.flags|=2,ki(this),wl(this);const n=ke,t=pn;ke=this,pn=!0;try{return this.fn()}finally{_l(this),ke=n,pn=t,this.flags&=-3}}stop(){if(this.flags&1){for(let n=this.deps;n;n=n.nextDep)Wo(n);this.deps=this.depsTail=void 0,ki(this),this.onStop&&this.onStop(),this.flags&=-2}}trigger(){this.flags&64?Na.add(this):this.scheduler?this.scheduler():this.runIfDirty()}runIfDirty(){io(this)&&this.run()}get dirty(){return io(this)}}let xl=0,rr,ar;function bl(e,n=!1){if(e.flags|=8,n){e.next=ar,ar=e;return}e.next=rr,rr=e}function Do(){xl++}function Fo(){if(--xl>0)return;if(ar){let n=ar;for(ar=void 0;n;){const t=n.next;n.next=void 0,n.flags&=-9,n=t}}let e;for(;rr;){let n=rr;for(rr=void 0;n;){const t=n.next;if(n.next=void 0,n.flags&=-9,n.flags&1)try{n.trigger()}catch(r){e||(e=r)}n=t}}if(e)throw e}function wl(e){for(let n=e.deps;n;n=n.nextDep)n.version=-1,n.prevActiveLink=n.dep.activeLink,n.dep.activeLink=n}function _l(e){let n,t=e.depsTail,r=t;for(;r;){const a=r.prevDep;r.version===-1?(r===t&&(t=a),Wo(r),td(r)):n=r,r.dep.activeLink=r.prevActiveLink,r.prevActiveLink=void 0,r=a}e.deps=n,e.depsTail=t}function io(e){for(let n=e.deps;n;n=n.nextDep)if(n.dep.version!==n.version||n.dep.computed&&(kl(n.dep.computed)||n.dep.version!==n.version))return!0;return!!e._dirty}function kl(e){if(e.flags&4&&!(e.flags&16)||(e.flags&=-17,e.globalVersion===dr)||(e.globalVersion=dr,!e.isSSR&&e.flags&128&&(!e.deps&&!e._dirty||!io(e))))return;e.flags|=2;const n=e.dep,t=ke,r=pn;ke=e,pn=!0;try{wl(e);const a=e.fn(e._value);(n.version===0||Qn(a,e._value))&&(e.flags|=128,e._value=a,n.version++)}catch(a){throw n.version++,a}finally{ke=t,pn=r,_l(e),e.flags&=-3}}function Wo(e,n=!1){const{dep:t,prevSub:r,nextSub:a}=e;if(r&&(r.nextSub=a,e.prevSub=void 0),a&&(a.prevSub=r,e.nextSub=void 0),t.subs===e&&(t.subs=r,!r&&t.computed)){t.computed.flags&=-5;for(let o=t.computed.deps;o;o=o.nextDep)Wo(o,!0)}!n&&!--t.sc&&t.map&&t.map.delete(t.key)}function td(e){const{prevDep:n,nextDep:t}=e;n&&(n.nextDep=t,e.prevDep=void 0),t&&(t.prevDep=n,e.nextDep=void 0)}let pn=!0;const jl=[];function Wn(){jl.push(pn),pn=!1}function Hn(){const e=jl.pop();pn=e===void 0?!0:e}function ki(e){const{cleanup:n}=e;if(e.cleanup=void 0,n){const t=ke;ke=void 0;try{n()}finally{ke=t}}}let dr=0;class rd{constructor(n,t){this.sub=n,this.dep=t,this.version=t.version,this.nextDep=this.prevDep=this.nextSub=this.prevSub=this.prevActiveLink=void 0}}class Ho{constructor(n){this.computed=n,this.version=0,this.activeLink=void 0,this.subs=void 0,this.map=void 0,this.key=void 0,this.sc=0,this.__v_skip=!0}track(n){if(!ke||!pn||ke===this.computed)return;let t=this.activeLink;if(t===void 0||t.sub!==ke)t=this.activeLink=new rd(ke,this),ke.deps?(t.prevDep=ke.depsTail,ke.depsTail.nextDep=t,ke.depsTail=t):ke.deps=ke.depsTail=t,zl(t);else if(t.version===-1&&(t.version=this.version,t.nextDep)){const r=t.nextDep;r.prevDep=t.prevDep,t.prevDep&&(t.prevDep.nextDep=r),t.prevDep=ke.depsTail,t.nextDep=void 0,ke.depsTail.nextDep=t,ke.depsTail=t,ke.deps===t&&(ke.deps=r)}return t}trigger(n){this.version++,dr++,this.notify(n)}notify(n){Do();try{for(let t=this.subs;t;t=t.prevSub)t.sub.notify()&&t.sub.dep.notify()}finally{Fo()}}}function zl(e){if(e.dep.sc++,e.sub.flags&4){const n=e.dep.computed;if(n&&!e.dep.subs){n.flags|=20;for(let r=n.deps;r;r=r.nextDep)zl(r)}const t=e.dep.subs;t!==e&&(e.prevSub=t,t&&(t.nextSub=e)),e.dep.subs=e}}const Qr=new WeakMap,xt=Symbol(""),so=Symbol(""),hr=Symbol("");function He(e,n,t){if(pn&&ke){let r=Qr.get(e);r||Qr.set(e,r=new Map);let a=r.get(t);a||(r.set(t,a=new Ho),a.map=r,a.key=t),a.track()}}function Rn(e,n,t,r,a,o){const i=Qr.get(e);if(!i){dr++;return}const s=l=>{l&&l.trigger()};if(Do(),n==="clear")i.forEach(s);else{const l=ee(e),c=l&&ya(t);if(l&&t==="length"){const d=Number(r);i.forEach((h,f)=>{(f==="length"||f===hr||!Tn(f)&&f>=d)&&s(h)})}else switch((t!==void 0||i.has(void 0))&&s(i.get(t)),c&&s(i.get(hr)),n){case"add":l?c&&s(i.get("length")):(s(i.get(xt)),Mt(e)&&s(i.get(so)));break;case"delete":l||(s(i.get(xt)),Mt(e)&&s(i.get(so)));break;case"set":Mt(e)&&s(i.get(xt));break}}Fo()}function ad(e,n){const t=Qr.get(e);return t&&t.get(n)}function St(e){const n=ue(e);return n===e?n:(He(n,"iterate",hr),rn(e)?n:n.map(gn))}function wa(e){return He(e=ue(e),"iterate",hr),e}function Gn(e,n){return Un(e)?bt(e)?Dt(gn(n)):Dt(n):gn(n)}const od={__proto__:null,[Symbol.iterator](){return Ma(this,Symbol.iterator,e=>Gn(this,e))},concat(...e){return St(this).concat(...e.map(n=>ee(n)?St(n):n))},entries(){return Ma(this,"entries",e=>(e[1]=Gn(this,e[1]),e))},every(e,n){return En(this,"every",e,n,void 0,arguments)},filter(e,n){return En(this,"filter",e,n,t=>t.map(r=>Gn(this,r)),arguments)},find(e,n){return En(this,"find",e,n,t=>Gn(this,t),arguments)},findIndex(e,n){return En(this,"findIndex",e,n,void 0,arguments)},findLast(e,n){return En(this,"findLast",e,n,t=>Gn(this,t),arguments)},findLastIndex(e,n){return En(this,"findLastIndex",e,n,void 0,arguments)},forEach(e,n){return En(this,"forEach",e,n,void 0,arguments)},includes(...e){return Oa(this,"includes",e)},indexOf(...e){return Oa(this,"indexOf",e)},join(e){return St(this).join(e)},lastIndexOf(...e){return Oa(this,"lastIndexOf",e)},map(e,n){return En(this,"map",e,n,void 0,arguments)},pop(){return Kt(this,"pop")},push(...e){return Kt(this,"push",e)},reduce(e,...n){return ji(this,"reduce",e,n)},reduceRight(e,...n){return ji(this,"reduceRight",e,n)},shift(){return Kt(this,"shift")},some(e,n){return En(this,"some",e,n,void 0,arguments)},splice(...e){return Kt(this,"splice",e)},toReversed(){return St(this).toReversed()},toSorted(e){return St(this).toSorted(e)},toSpliced(...e){return St(this).toSpliced(...e)},unshift(...e){return Kt(this,"unshift",e)},values(){return Ma(this,"values",e=>Gn(this,e))}};function Ma(e,n,t){const r=wa(e),a=r[n]();return r!==e&&!rn(e)&&(a._next=a.next,a.next=()=>{const o=a._next();return o.done||(o.value=t(o.value)),o}),a}const id=Array.prototype;function En(e,n,t,r,a,o){const i=wa(e),s=i!==e&&!rn(e),l=i[n];if(l!==id[n]){const h=l.apply(e,o);return s?gn(h):h}let c=t;i!==e&&(s?c=function(h,f){return t.call(this,Gn(e,h),f,e)}:t.length>2&&(c=function(h,f){return t.call(this,h,f,e)}));const d=l.call(i,c,r);return s&&a?a(d):d}function ji(e,n,t,r){const a=wa(e);let o=t;return a!==e&&(rn(e)?t.length>3&&(o=function(i,s,l){return t.call(this,i,s,l,e)}):o=function(i,s,l){return t.call(this,i,Gn(e,s),l,e)}),a[n](o,...r)}function Oa(e,n,t){const r=ue(e);He(r,"iterate",hr);const a=r[n](...t);return(a===-1||a===!1)&&_a(t[0])?(t[0]=ue(t[0]),r[n](...t)):a}function Kt(e,n,t=[]){Wn(),Do();const r=ue(e)[n].apply(e,t);return Fo(),Hn(),r}const sd=Oo("__proto__,__v_isRef,__isVue"),Il=new Set(Object.getOwnPropertyNames(Symbol).filter(e=>e!=="arguments"&&e!=="caller").map(e=>Symbol[e]).filter(Tn));function ld(e){Tn(e)||(e=String(e));const n=ue(this);return He(n,"has",e),n.hasOwnProperty(e)}class Sl{constructor(n=!1,t=!1){this._isReadonly=n,this._isShallow=t}get(n,t,r){if(t==="__v_skip")return n.__v_skip;const a=this._isReadonly,o=this._isShallow;if(t==="__v_isReactive")return!a;if(t==="__v_isReadonly")return a;if(t==="__v_isShallow")return o;if(t==="__v_raw")return r===(a?o?vd:El:o?Cl:Al).get(n)||Object.getPrototypeOf(n)===Object.getPrototypeOf(r)?n:void 0;const i=ee(n);if(!a){let l;if(i&&(l=od[t]))return l;if(t==="hasOwnProperty")return ld}const s=Reflect.get(n,t,Le(n)?n:r);if((Tn(t)?Il.has(t):sd(t))||(a||He(n,"get",t),o))return s;if(Le(s)){const l=i&&ya(t)?s:s.value;return a&&ye(l)?co(l):l}return ye(s)?a?co(s):Yo(s):s}}class Tl extends Sl{constructor(n=!1){super(!1,n)}set(n,t,r,a){let o=n[t];const i=ee(n)&&ya(t);if(!this._isShallow){const c=Un(o);if(!rn(r)&&!Un(r)&&(o=ue(o),r=ue(r)),!i&&Le(o)&&!Le(r))return c||(o.value=r),!0}const s=i?Number(t)<n.length:ge(n,t),l=Reflect.set(n,t,r,Le(n)?n:a);return n===ue(a)&&(s?Qn(r,o)&&Rn(n,"set",t,r):Rn(n,"add",t,r)),l}deleteProperty(n,t){const r=ge(n,t);n[t];const a=Reflect.deleteProperty(n,t);return a&&r&&Rn(n,"delete",t,void 0),a}has(n,t){const r=Reflect.has(n,t);return(!Tn(t)||!Il.has(t))&&He(n,"has",t),r}ownKeys(n){return He(n,"iterate",ee(n)?"length":xt),Reflect.ownKeys(n)}}class cd extends Sl{constructor(n=!1){super(!0,n)}set(n,t){return!0}deleteProperty(n,t){return!0}}const ud=new Tl,dd=new cd,hd=new Tl(!0);const lo=e=>e,Mr=e=>Reflect.getPrototypeOf(e);function fd(e,n,t){return function(...r){const a=this.__v_raw,o=ue(a),i=Mt(o),s=e==="entries"||e===Symbol.iterator&&i,l=e==="keys"&&i,c=a[e](...r),d=t?lo:n?Dt:gn;return!n&&He(o,"iterate",l?so:xt),{next(){const{value:h,done:f}=c.next();return f?{value:h,done:f}:{value:s?[d(h[0]),d(h[1])]:d(h),done:f}},[Symbol.iterator](){return this}}}}function Or(e){return function(...n){return e==="delete"?!1:e==="clear"?void 0:this}}function pd(e,n){const t={get(a){const o=this.__v_raw,i=ue(o),s=ue(a);e||(Qn(a,s)&&He(i,"get",a),He(i,"get",s));const{has:l}=Mr(i),c=n?lo:e?Dt:gn;if(l.call(i,a))return c(o.get(a));if(l.call(i,s))return c(o.get(s));o!==i&&o.get(a)},get size(){const a=this.__v_raw;return!e&&He(ue(a),"iterate",xt),a.size},has(a){const o=this.__v_raw,i=ue(o),s=ue(a);return e||(Qn(a,s)&&He(i,"has",a),He(i,"has",s)),a===s?o.has(a):o.has(a)||o.has(s)},forEach(a,o){const i=this,s=i.__v_raw,l=ue(s),c=n?lo:e?Dt:gn;return!e&&He(l,"iterate",xt),s.forEach((d,h)=>a.call(o,c(d),c(h),i))}};return Oe(t,e?{add:Or("add"),set:Or("set"),delete:Or("delete"),clear:Or("clear")}:{add(a){!n&&!rn(a)&&!Un(a)&&(a=ue(a));const o=ue(this);return Mr(o).has.call(o,a)||(o.add(a),Rn(o,"add",a,a)),this},set(a,o){!n&&!rn(o)&&!Un(o)&&(o=ue(o));const i=ue(this),{has:s,get:l}=Mr(i);let c=s.call(i,a);c||(a=ue(a),c=s.call(i,a));const d=l.call(i,a);return i.set(a,o),c?Qn(o,d)&&Rn(i,"set",a,o):Rn(i,"add",a,o),this},delete(a){const o=ue(this),{has:i,get:s}=Mr(o);let l=i.call(o,a);l||(a=ue(a),l=i.call(o,a)),s&&s.call(o,a);const c=o.delete(a);return l&&Rn(o,"delete",a,void 0),c},clear(){const a=ue(this),o=a.size!==0,i=a.clear();return o&&Rn(a,"clear",void 0,void 0),i}}),["keys","values","entries",Symbol.iterator].forEach(a=>{t[a]=fd(a,e,n)}),t}function Uo(e,n){const t=pd(e,n);return(r,a,o)=>a==="__v_isReactive"?!e:a==="__v_isReadonly"?e:a==="__v_raw"?r:Reflect.get(ge(t,a)&&a in r?t:r,a,o)}const md={get:Uo(!1,!1)},gd={get:Uo(!1,!0)},yd={get:Uo(!0,!1)};const Al=new WeakMap,Cl=new WeakMap,El=new WeakMap,vd=new WeakMap;function xd(e){switch(e){case"Object":case"Array":return 1;case"Map":case"Set":case"WeakMap":case"WeakSet":return 2;default:return 0}}function bd(e){return e.__v_skip||!Object.isExtensible(e)?0:xd(Hu(e))}function Yo(e){return Un(e)?e:Bo(e,!1,ud,md,Al)}function wd(e){return Bo(e,!1,hd,gd,Cl)}function co(e){return Bo(e,!0,dd,yd,El)}function Bo(e,n,t,r,a){if(!ye(e)||e.__v_raw&&!(n&&e.__v_isReactive))return e;const o=bd(e);if(o===0)return e;const i=a.get(e);if(i)return i;const s=new Proxy(e,o===2?r:t);return a.set(e,s),s}function bt(e){return Un(e)?bt(e.__v_raw):!!(e&&e.__v_isReactive)}function Un(e){return!!(e&&e.__v_isReadonly)}function rn(e){return!!(e&&e.__v_isShallow)}function _a(e){return e?!!e.__v_raw:!1}function ue(e){const n=e&&e.__v_raw;return n?ue(n):e}function _d(e){return!ge(e,"__v_skip")&&Object.isExtensible(e)&&hl(e,"__v_skip",!0),e}const gn=e=>ye(e)?Yo(e):e,Dt=e=>ye(e)?co(e):e;function Le(e){return e?e.__v_isRef===!0:!1}function B(e){return Ll(e,!1)}function kd(e){return Ll(e,!0)}function Ll(e,n){return Le(e)?e:new jd(e,n)}class jd{constructor(n,t){this.dep=new Ho,this.__v_isRef=!0,this.__v_isShallow=!1,this._rawValue=t?n:ue(n),this._value=t?n:gn(n),this.__v_isShallow=t}get value(){return this.dep.track(),this._value}set value(n){const t=this._rawValue,r=this.__v_isShallow||rn(n)||Un(n);n=r?n:ue(n),Qn(n,t)&&(this._rawValue=n,this._value=r?n:gn(n),this.dep.trigger())}}function g(e){return Le(e)?e.value:e}const zd={get:(e,n,t)=>n==="__v_raw"?e:g(Reflect.get(e,n,t)),set:(e,n,t,r)=>{const a=e[n];return Le(a)&&!Le(t)?(a.value=t,!0):Reflect.set(e,n,t,r)}};function Pl(e){return bt(e)?e:new Proxy(e,zd)}class Id{constructor(n,t,r){this._object=n,this._key=t,this._defaultValue=r,this.__v_isRef=!0,this._value=void 0,this._raw=ue(n);let a=!0,o=n;if(!ee(n)||!ya(String(t)))do a=!_a(o)||rn(o);while(a&&(o=o.__v_raw));this._shallow=a}get value(){let n=this._object[this._key];return this._shallow&&(n=g(n)),this._value=n===void 0?this._defaultValue:n}set value(n){if(this._shallow&&Le(this._raw[this._key])){const t=this._object[this._key];if(Le(t)){t.value=n;return}}this._object[this._key]=n}get dep(){return ad(this._raw,this._key)}}class Sd{constructor(n){this._getter=n,this.__v_isRef=!0,this.__v_isReadonly=!0,this._value=void 0}get value(){return this._value=this._getter()}}function Td(e,n,t){return Le(e)?e:re(e)?new Sd(e):ye(e)&&arguments.length>1?Ad(e,n,t):B(e)}function Ad(e,n,t){return new Id(e,n,t)}class Cd{constructor(n,t,r){this.fn=n,this.setter=t,this._value=void 0,this.dep=new Ho(this),this.__v_isRef=!0,this.deps=void 0,this.depsTail=void 0,this.flags=16,this.globalVersion=dr-1,this.next=void 0,this.effect=this,this.__v_isReadonly=!t,this.isSSR=r}notify(){if(this.flags|=16,!(this.flags&8)&&ke!==this)return bl(this,!0),!0}get value(){const n=this.dep.track();return kl(this),n&&(n.version=this.dep.version),this._value}set value(n){this.setter&&this.setter(n)}}function Ed(e,n,t=!1){let r,a;return re(e)?r=e:(r=e.get,a=e.set),new Cd(r,a,t)}const Rr={},Zr=new WeakMap;let mt;function Ld(e,n=!1,t=mt){if(t){let r=Zr.get(t);r||Zr.set(t,r=[]),r.push(e)}}function Pd(e,n,t=we){const{immediate:r,deep:a,once:o,scheduler:i,augmentJob:s,call:l}=t,c=w=>a?w:rn(w)||a===!1||a===0?$n(w,1):$n(w);let d,h,f,y,k=!1,I=!1;if(Le(e)?(h=()=>e.value,k=rn(e)):bt(e)?(h=()=>c(e),k=!0):ee(e)?(I=!0,k=e.some(w=>bt(w)||rn(w)),h=()=>e.map(w=>{if(Le(w))return w.value;if(bt(w))return c(w);if(re(w))return l?l(w,2):w()})):re(e)?n?h=l?()=>l(e,2):e:h=()=>{if(f){Wn();try{f()}finally{Hn()}}const w=mt;mt=d;try{return l?l(e,3,[y]):e(y)}finally{mt=w}}:h=zn,n&&a){const w=h,_=a===!0?1/0:a;h=()=>$n(w(),_)}const P=nd(),v=()=>{d.stop(),P&&P.active&&$o(P.effects,d)};if(o&&n){const w=n;n=(..._)=>{w(..._),v()}}let j=I?new Array(e.length).fill(Rr):Rr;const N=w=>{if(!(!(d.flags&1)||!d.dirty&&!w))if(n){const _=d.run();if(a||k||(I?_.some((S,C)=>Qn(S,j[C])):Qn(_,j))){f&&f();const S=mt;mt=d;try{const C=[_,j===Rr?void 0:I&&j[0]===Rr?[]:j,y];j=_,l?l(n,3,C):n(...C)}finally{mt=S}}}else d.run()};return s&&s(N),d=new vl(h),d.scheduler=i?()=>i(N,!1):N,y=w=>Ld(w,!1,d),f=d.onStop=()=>{const w=Zr.get(d);if(w){if(l)l(w,4);else for(const _ of w)_();Zr.delete(d)}},n?r?N(!0):j=d.run():i?i(N.bind(null,!0),!0):d.run(),v.pause=d.pause.bind(d),v.resume=d.resume.bind(d),v.stop=v,v}function $n(e,n=1/0,t){if(n<=0||!ye(e)||e.__v_skip||(t=t||new Map,(t.get(e)||0)>=n))return e;if(t.set(e,n),n--,Le(e))$n(e.value,n,t);else if(ee(e))for(let r=0;r<e.length;r++)$n(e[r],n,t);else if(ga(e)||Mt(e))e.forEach(r=>{$n(r,n,t)});else if(ul(e)){for(const r in e)$n(e[r],n,t);for(const r of Object.getOwnPropertySymbols(e))Object.prototype.propertyIsEnumerable.call(e,r)&&$n(e[r],n,t)}return e}function Ar(e,n,t,r){try{return r?e(...r):e()}catch(a){ka(a,n,t)}}function yn(e,n,t,r){if(re(e)){const a=Ar(e,n,t,r);return a&&ll(a)&&a.catch(o=>{ka(o,n,t)}),a}if(ee(e)){const a=[];for(let o=0;o<e.length;o++)a.push(yn(e[o],n,t,r));return a}}function ka(e,n,t,r=!0){const a=n?n.vnode:null,{errorHandler:o,throwUnhandledErrorInProduction:i}=n&&n.appContext.config||we;if(n){let s=n.parent;const l=n.proxy,c=`https://vuejs.org/error-reference/#runtime-${t}`;for(;s;){const d=s.ec;if(d){for(let h=0;h<d.length;h++)if(d[h](e,l,c)===!1)return}s=s.parent}if(o){Wn(),Ar(o,null,10,[e,l,c]),Hn();return}}Nd(e,t,a,r,i)}function Nd(e,n,t,r=!0,a=!1){if(a)throw e;console.error(e)}const qe=[];let kn=-1;const Ot=[];let Xn=null,At=0;const Nl=Promise.resolve();let ea=null;function na(e){const n=ea||Nl;return e?n.then(this?e.bind(this):e):n}function Md(e){let n=kn+1,t=qe.length;for(;n<t;){const r=n+t>>>1,a=qe[r],o=fr(a);o<e||o===e&&a.flags&2?n=r+1:t=r}return n}function qo(e){if(!(e.flags&1)){const n=fr(e),t=qe[qe.length-1];!t||!(e.flags&2)&&n>=fr(t)?qe.push(e):qe.splice(Md(n),0,e),e.flags|=1,Ml()}}function Ml(){ea||(ea=Nl.then(Rl))}function Od(e){ee(e)?Ot.push(...e):Xn&&e.id===-1?Xn.splice(At+1,0,e):e.flags&1||(Ot.push(e),e.flags|=1),Ml()}function zi(e,n,t=kn+1){for(;t<qe.length;t++){const r=qe[t];if(r&&r.flags&2){if(e&&r.id!==e.uid)continue;qe.splice(t,1),t--,r.flags&4&&(r.flags&=-2),r(),r.flags&4||(r.flags&=-2)}}}function Ol(e){if(Ot.length){const n=[...new Set(Ot)].sort((t,r)=>fr(t)-fr(r));if(Ot.length=0,Xn){Xn.push(...n);return}for(Xn=n,At=0;At<Xn.length;At++){const t=Xn[At];t.flags&4&&(t.flags&=-2),t.flags&8||t(),t.flags&=-2}Xn=null,At=0}}const fr=e=>e.id==null?e.flags&2?-1:1/0:e.id;function Rl(e){try{for(kn=0;kn<qe.length;kn++){const n=qe[kn];n&&!(n.flags&8)&&(n.flags&4&&(n.flags&=-2),Ar(n,n.i,n.i?15:14),n.flags&4||(n.flags&=-2))}}finally{for(;kn<qe.length;kn++){const n=qe[kn];n&&(n.flags&=-2)}kn=-1,qe.length=0,Ol(),ea=null,(qe.length||Ot.length)&&Rl()}}let un=null,$l=null;function ta(e){const n=un;return un=e,$l=e&&e.type.__scopeId||null,n}function _t(e,n=un,t){if(!n||e._n)return e;const r=(...a)=>{r._d&&oa(-1);const o=ta(n);let i;try{i=e(...a)}finally{ta(o),r._d&&oa(1)}return i};return r._n=!0,r._c=!0,r._d=!0,r}function Rd(e,n){if(un===null)return e;const t=Sa(un),r=e.dirs||(e.dirs=[]);for(let a=0;a<n.length;a++){let[o,i,s,l=we]=n[a];o&&(re(o)&&(o={mounted:o,updated:o}),o.deep&&$n(i),r.push({dir:o,instance:t,value:i,oldValue:void 0,arg:s,modifiers:l}))}return e}function ut(e,n,t,r){const a=e.dirs,o=n&&n.dirs;for(let i=0;i<a.length;i++){const s=a[i];o&&(s.oldValue=o[i].value);let l=s.dir[r];l&&(Wn(),yn(l,t,8,[e.el,s,e,n]),Hn())}}function $d(e,n){if(Ke){let t=Ke.provides;const r=Ke.parent&&Ke.parent.provides;r===t&&(t=Ke.provides=Object.create(r)),t[e]=n}}function or(e,n,t=!1){const r=Zo();if(r||Rt){let a=Rt?Rt._context.provides:r?r.parent==null||r.ce?r.vnode.appContext&&r.vnode.appContext.provides:r.parent.provides:void 0;if(a&&e in a)return a[e];if(arguments.length>1)return t&&re(n)?n.call(r&&r.proxy):n}}const Dd=Symbol.for("v-scx"),Fd=()=>or(Dd);function dn(e,n,t){return Dl(e,n,t)}function Dl(e,n,t=we){const{immediate:r,deep:a,flush:o,once:i}=t,s=Oe({},t),l=n&&r||!n&&o!=="post";let c;if(gr){if(o==="sync"){const y=Fd();c=y.__watcherHandles||(y.__watcherHandles=[])}else if(!l){const y=()=>{};return y.stop=zn,y.resume=zn,y.pause=zn,y}}const d=Ke;s.call=(y,k,I)=>yn(y,d,k,I);let h=!1;o==="post"?s.scheduler=y=>{Be(y,d&&d.suspense)}:o!=="sync"&&(h=!0,s.scheduler=(y,k)=>{k?y():qo(y)}),s.augmentJob=y=>{n&&(y.flags|=4),h&&(y.flags|=2,d&&(y.id=d.uid,y.i=d))};const f=Pd(e,n,s);return gr&&(c?c.push(f):l&&f()),f}function Wd(e,n,t){const r=this.proxy,a=Ie(e)?e.includes(".")?Fl(r,e):()=>r[e]:e.bind(r,r);let o;re(n)?o=n:(o=n.handler,t=n);const i=Lr(this),s=Dl(a,o.bind(r),t);return i(),s}function Fl(e,n){const t=n.split(".");return()=>{let r=e;for(let a=0;a<t.length&&r;a++)r=r[t[a]];return r}}const Wl=Symbol("_vte"),Hl=e=>e.__isTeleport,ir=e=>e&&(e.disabled||e.disabled===""),Ii=e=>e&&(e.defer||e.defer===""),Si=e=>typeof SVGElement<"u"&&e instanceof SVGElement,Ti=e=>typeof MathMLElement=="function"&&e instanceof MathMLElement,uo=(e,n)=>{const t=e&&e.to;return Ie(t)?n?n(t):null:t},Ul={name:"Teleport",__isTeleport:!0,process(e,n,t,r,a,o,i,s,l,c){const{mc:d,pc:h,pbc:f,o:{insert:y,querySelector:k,createText:I,createComment:P}}=c,v=ir(n.props);let{shapeFlag:j,children:N,dynamicChildren:w}=n;if(e==null){const _=n.el=I(""),S=n.anchor=I("");y(_,t,r),y(S,t,r);const C=(F,q)=>{j&16&&d(N,F,q,a,o,i,s,l)},W=()=>{const F=n.target=uo(n.props,k),q=Yl(F,n,I,y);F&&(i!=="svg"&&Si(F)?i="svg":i!=="mathml"&&Ti(F)&&(i="mathml"),a&&a.isCE&&(a.ce._teleportTargets||(a.ce._teleportTargets=new Set)).add(F),v||(C(F,q),qr(n,!1)))};v&&(C(t,S),qr(n,!0)),Ii(n.props)?(n.el.__isMounted=!1,Be(()=>{W(),delete n.el.__isMounted},o)):W()}else{if(Ii(n.props)&&e.el.__isMounted===!1){Be(()=>{Ul.process(e,n,t,r,a,o,i,s,l,c)},o);return}n.el=e.el,n.targetStart=e.targetStart;const _=n.anchor=e.anchor,S=n.target=e.target,C=n.targetAnchor=e.targetAnchor,W=ir(e.props),F=W?t:S,q=W?_:C;if(i==="svg"||Si(S)?i="svg":(i==="mathml"||Ti(S))&&(i="mathml"),w?(f(e.dynamicChildren,w,F,a,o,i,s),Jo(e,n,!0)):l||h(e,n,F,q,a,o,i,s,!1),v)W?n.props&&e.props&&n.props.to!==e.props.to&&(n.props.to=e.props.to):$r(n,t,_,c,1);else if((n.props&&n.props.to)!==(e.props&&e.props.to)){const X=n.target=uo(n.props,k);X&&$r(n,X,null,c,0)}else W&&$r(n,S,C,c,1);qr(n,v)}},remove(e,n,t,{um:r,o:{remove:a}},o){const{shapeFlag:i,children:s,anchor:l,targetStart:c,targetAnchor:d,target:h,props:f}=e;if(h&&(a(c),a(d)),o&&a(l),i&16){const y=o||!ir(f);for(let k=0;k<s.length;k++){const I=s[k];r(I,n,t,y,!!I.dynamicChildren)}}},move:$r,hydrate:Hd};function $r(e,n,t,{o:{insert:r},m:a},o=2){o===0&&r(e.targetAnchor,n,t);const{el:i,anchor:s,shapeFlag:l,children:c,props:d}=e,h=o===2;if(h&&r(i,n,t),(!h||ir(d))&&l&16)for(let f=0;f<c.length;f++)a(c[f],n,t,2);h&&r(s,n,t)}function Hd(e,n,t,r,a,o,{o:{nextSibling:i,parentNode:s,querySelector:l,insert:c,createText:d}},h){function f(I,P,v,j){P.anchor=h(i(I),P,s(I),t,r,a,o),P.targetStart=v,P.targetAnchor=j}const y=n.target=uo(n.props,l),k=ir(n.props);if(y){const I=y._lpa||y.firstChild;if(n.shapeFlag&16)if(k)f(e,n,I,I&&i(I));else{n.anchor=i(e);let P=I;for(;P;){if(P&&P.nodeType===8){if(P.data==="teleport start anchor")n.targetStart=P;else if(P.data==="teleport anchor"){n.targetAnchor=P,y._lpa=n.targetAnchor&&i(n.targetAnchor);break}}P=i(P)}n.targetAnchor||Yl(y,n,d,c),h(I&&i(I),n,y,t,r,a,o)}qr(n,k)}else k&&n.shapeFlag&16&&f(e,n,e,i(e));return n.anchor&&i(n.anchor)}const Cr=Ul;function qr(e,n){const t=e.ctx;if(t&&t.ut){let r,a;for(n?(r=e.el,a=e.anchor):(r=e.targetStart,a=e.targetAnchor);r&&r!==a;)r.nodeType===1&&r.setAttribute("data-v-owner",t.uid),r=r.nextSibling;t.ut()}}function Yl(e,n,t,r){const a=n.targetStart=t(""),o=n.targetAnchor=t("");return a[Wl]=o,e&&(r(a,e),r(o,e)),o}const On=Symbol("_leaveCb"),Dr=Symbol("_enterCb");function Ud(){const e={isMounted:!1,isLeaving:!1,isUnmounting:!1,leavingVNodes:new Map};return Bt(()=>{e.isMounted=!0}),Ql(()=>{e.isUnmounting=!0}),e}const ln=[Function,Array],Bl={mode:String,appear:Boolean,persisted:Boolean,onBeforeEnter:ln,onEnter:ln,onAfterEnter:ln,onEnterCancelled:ln,onBeforeLeave:ln,onLeave:ln,onAfterLeave:ln,onLeaveCancelled:ln,onBeforeAppear:ln,onAppear:ln,onAfterAppear:ln,onAppearCancelled:ln},ql=e=>{const n=e.subTree;return n.component?ql(n.component):n},Yd={name:"BaseTransition",props:Bl,setup(e,{slots:n}){const t=Zo(),r=Ud();return()=>{const a=n.default&&Gl(n.default(),!0);if(!a||!a.length)return;const o=Vl(a),i=ue(e),{mode:s}=i;if(r.isLeaving)return Ra(o);const l=Ai(o);if(!l)return Ra(o);let c=ho(l,i,r,t,h=>c=h);l.type!==Ve&&pr(l,c);let d=t.subTree&&Ai(t.subTree);if(d&&d.type!==Ve&&!gt(d,l)&&ql(t).type!==Ve){let h=ho(d,i,r,t);if(pr(d,h),s==="out-in"&&l.type!==Ve)return r.isLeaving=!0,h.afterLeave=()=>{r.isLeaving=!1,t.job.flags&8||t.update(),delete h.afterLeave,d=void 0},Ra(o);s==="in-out"&&l.type!==Ve?h.delayLeave=(f,y,k)=>{const I=Kl(r,d);I[String(d.key)]=d,f[On]=()=>{y(),f[On]=void 0,delete c.delayedLeave,d=void 0},c.delayedLeave=()=>{k(),delete c.delayedLeave,d=void 0}}:d=void 0}else d&&(d=void 0);return o}}};function Vl(e){let n=e[0];if(e.length>1){for(const t of e)if(t.type!==Ve){n=t;break}}return n}const Bd=Yd;function Kl(e,n){const{leavingVNodes:t}=e;let r=t.get(n.type);return r||(r=Object.create(null),t.set(n.type,r)),r}function ho(e,n,t,r,a){const{appear:o,mode:i,persisted:s=!1,onBeforeEnter:l,onEnter:c,onAfterEnter:d,onEnterCancelled:h,onBeforeLeave:f,onLeave:y,onAfterLeave:k,onLeaveCancelled:I,onBeforeAppear:P,onAppear:v,onAfterAppear:j,onAppearCancelled:N}=n,w=String(e.key),_=Kl(t,e),S=(F,q)=>{F&&yn(F,r,9,q)},C=(F,q)=>{const X=q[1];S(F,q),ee(F)?F.every($=>$.length<=1)&&X():F.length<=1&&X()},W={mode:i,persisted:s,beforeEnter(F){let q=l;if(!t.isMounted)if(o)q=P||l;else return;F[On]&&F[On](!0);const X=_[w];X&&gt(e,X)&&X.el[On]&&X.el[On](),S(q,[F])},enter(F){let q=c,X=d,$=h;if(!t.isMounted)if(o)q=v||c,X=j||d,$=N||h;else return;let Q=!1;const ce=F[Dr]=$e=>{Q||(Q=!0,$e?S($,[F]):S(X,[F]),W.delayedLeave&&W.delayedLeave(),F[Dr]=void 0)};q?C(q,[F,ce]):ce()},leave(F,q){const X=String(e.key);if(F[Dr]&&F[Dr](!0),t.isUnmounting)return q();S(f,[F]);let $=!1;const Q=F[On]=ce=>{$||($=!0,q(),ce?S(I,[F]):S(k,[F]),F[On]=void 0,_[X]===e&&delete _[X])};_[X]=e,y?C(y,[F,Q]):Q()},clone(F){const q=ho(F,n,t,r,a);return a&&a(q),q}};return W}function Ra(e){if(ja(e))return e=at(e),e.children=null,e}function Ai(e){if(!ja(e))return Hl(e.type)&&e.children?Vl(e.children):e;if(e.component)return e.component.subTree;const{shapeFlag:n,children:t}=e;if(t){if(n&16)return t[0];if(n&32&&re(t.default))return t.default()}}function pr(e,n){e.shapeFlag&6&&e.component?(e.transition=n,pr(e.component.subTree,n)):e.shapeFlag&128?(e.ssContent.transition=n.clone(e.ssContent),e.ssFallback.transition=n.clone(e.ssFallback)):e.transition=n}function Gl(e,n=!1,t){let r=[],a=0;for(let o=0;o<e.length;o++){let i=e[o];const s=t==null?i.key:String(t)+String(i.key!=null?i.key:o);i.type===te?(i.patchFlag&128&&a++,r=r.concat(Gl(i.children,n,s))):(n||i.type!==Ve)&&r.push(s!=null?at(i,{key:s}):i)}if(a>1)for(let o=0;o<r.length;o++)r[o].patchFlag=-2;return r}function Vo(e,n){return re(e)?Oe({name:e.name},n,{setup:e}):e}function Xl(e){e.ids=[e.ids[0]+e.ids[2]+++"-",0,0]}const ra=new WeakMap;function sr(e,n,t,r,a=!1){if(ee(e)){e.forEach((k,I)=>sr(k,n&&(ee(n)?n[I]:n),t,r,a));return}if(lr(r)&&!a){r.shapeFlag&512&&r.type.__asyncResolved&&r.component.subTree.component&&sr(e,n,t,r.component.subTree);return}const o=r.shapeFlag&4?Sa(r.component):r.el,i=a?null:o,{i:s,r:l}=e,c=n&&n.r,d=s.refs===we?s.refs={}:s.refs,h=s.setupState,f=ue(h),y=h===we?sl:k=>ge(f,k);if(c!=null&&c!==l){if(Ci(n),Ie(c))d[c]=null,y(c)&&(h[c]=null);else if(Le(c)){c.value=null;const k=n;k.k&&(d[k.k]=null)}}if(re(l))Ar(l,s,12,[i,d]);else{const k=Ie(l),I=Le(l);if(k||I){const P=()=>{if(e.f){const v=k?y(l)?h[l]:d[l]:l.value;if(a)ee(v)&&$o(v,o);else if(ee(v))v.includes(o)||v.push(o);else if(k)d[l]=[o],y(l)&&(h[l]=d[l]);else{const j=[o];l.value=j,e.k&&(d[e.k]=j)}}else k?(d[l]=i,y(l)&&(h[l]=i)):I&&(l.value=i,e.k&&(d[e.k]=i))};if(i){const v=()=>{P(),ra.delete(e)};v.id=-1,ra.set(e,v),Be(v,t)}else Ci(e),P()}}}function Ci(e){const n=ra.get(e);n&&(n.flags|=8,ra.delete(e))}xa().requestIdleCallback;xa().cancelIdleCallback;const lr=e=>!!e.type.__asyncLoader,ja=e=>e.type.__isKeepAlive;function qd(e,n){Jl(e,"a",n)}function Vd(e,n){Jl(e,"da",n)}function Jl(e,n,t=Ke){const r=e.__wdc||(e.__wdc=()=>{let a=t;for(;a;){if(a.isDeactivated)return;a=a.parent}return e()});if(za(n,r,t),t){let a=t.parent;for(;a&&a.parent;)ja(a.parent.vnode)&&Kd(r,n,t,a),a=a.parent}}function Kd(e,n,t,r){const a=za(n,e,r,!0);Ko(()=>{$o(r[n],a)},t)}function za(e,n,t=Ke,r=!1){if(t){const a=t[e]||(t[e]=[]),o=n.__weh||(n.__weh=(...i)=>{Wn();const s=Lr(t),l=yn(n,t,e,i);return s(),Hn(),l});return r?a.unshift(o):a.push(o),o}}const Bn=e=>(n,t=Ke)=>{(!gr||e==="sp")&&za(e,(...r)=>n(...r),t)},Gd=Bn("bm"),Bt=Bn("m"),Xd=Bn("bu"),Jd=Bn("u"),Ql=Bn("bum"),Ko=Bn("um"),Qd=Bn("sp"),Zd=Bn("rtg"),eh=Bn("rtc");function nh(e,n=Ke){za("ec",e,n)}const th=Symbol.for("v-ndc");function _e(e,n,t,r){let a;const o=t,i=ee(e);if(i||Ie(e)){const s=i&&bt(e);let l=!1,c=!1;s&&(l=!rn(e),c=Un(e),e=wa(e)),a=new Array(e.length);for(let d=0,h=e.length;d<h;d++)a[d]=n(l?c?Dt(gn(e[d])):gn(e[d]):e[d],d,void 0,o)}else if(typeof e=="number"){a=new Array(e);for(let s=0;s<e;s++)a[s]=n(s+1,s,void 0,o)}else if(ye(e))if(e[Symbol.iterator])a=Array.from(e,(s,l)=>n(s,l,void 0,o));else{const s=Object.keys(e);a=new Array(s.length);for(let l=0,c=s.length;l<c;l++){const d=s[l];a[l]=n(e[d],d,l,o)}}else a=[];return a}const fo=e=>e?gc(e)?Sa(e):fo(e.parent):null,cr=Oe(Object.create(null),{$:e=>e,$el:e=>e.vnode.el,$data:e=>e.data,$props:e=>e.props,$attrs:e=>e.attrs,$slots:e=>e.slots,$refs:e=>e.refs,$parent:e=>fo(e.parent),$root:e=>fo(e.root),$host:e=>e.ce,$emit:e=>e.emit,$options:e=>ec(e),$forceUpdate:e=>e.f||(e.f=()=>{qo(e.update)}),$nextTick:e=>e.n||(e.n=na.bind(e.proxy)),$watch:e=>Wd.bind(e)}),$a=(e,n)=>e!==we&&!e.__isScriptSetup&&ge(e,n),rh={get({_:e},n){if(n==="__v_skip")return!0;const{ctx:t,setupState:r,data:a,props:o,accessCache:i,type:s,appContext:l}=e;if(n[0]!=="$"){const f=i[n];if(f!==void 0)switch(f){case 1:return r[n];case 2:return a[n];case 4:return t[n];case 3:return o[n]}else{if($a(r,n))return i[n]=1,r[n];if(a!==we&&ge(a,n))return i[n]=2,a[n];if(ge(o,n))return i[n]=3,o[n];if(t!==we&&ge(t,n))return i[n]=4,t[n];po&&(i[n]=0)}}const c=cr[n];let d,h;if(c)return n==="$attrs"&&He(e.attrs,"get",""),c(e);if((d=s.__cssModules)&&(d=d[n]))return d;if(t!==we&&ge(t,n))return i[n]=4,t[n];if(h=l.config.globalProperties,ge(h,n))return h[n]},set({_:e},n,t){const{data:r,setupState:a,ctx:o}=e;return $a(a,n)?(a[n]=t,!0):r!==we&&ge(r,n)?(r[n]=t,!0):ge(e.props,n)||n[0]==="$"&&n.slice(1)in e?!1:(o[n]=t,!0)},has({_:{data:e,setupState:n,accessCache:t,ctx:r,appContext:a,props:o,type:i}},s){let l;return!!(t[s]||e!==we&&s[0]!=="$"&&ge(e,s)||$a(n,s)||ge(o,s)||ge(r,s)||ge(cr,s)||ge(a.config.globalProperties,s)||(l=i.__cssModules)&&l[s])},defineProperty(e,n,t){return t.get!=null?e._.accessCache[n]=0:ge(t,"value")&&this.set(e,n,t.value,null),Reflect.defineProperty(e,n,t)}};function Ei(e){return ee(e)?e.reduce((n,t)=>(n[t]=null,n),{}):e}let po=!0;function ah(e){const n=ec(e),t=e.proxy,r=e.ctx;po=!1,n.beforeCreate&&Li(n.beforeCreate,e,"bc");const{data:a,computed:o,methods:i,watch:s,provide:l,inject:c,created:d,beforeMount:h,mounted:f,beforeUpdate:y,updated:k,activated:I,deactivated:P,beforeDestroy:v,beforeUnmount:j,destroyed:N,unmounted:w,render:_,renderTracked:S,renderTriggered:C,errorCaptured:W,serverPrefetch:F,expose:q,inheritAttrs:X,components:$,directives:Q,filters:ce}=n;if(c&&oh(c,r,null),i)for(const be in i){const pe=i[be];re(pe)&&(r[be]=pe.bind(t))}if(a){const be=a.call(t,t);ye(be)&&(e.data=Yo(be))}if(po=!0,o)for(const be in o){const pe=o[be],De=re(pe)?pe.bind(t,t):re(pe.get)?pe.get.bind(t,t):zn,An=!re(pe)&&re(pe.set)?pe.set.bind(t):zn,on=ie({get:De,set:An});Object.defineProperty(r,be,{enumerable:!0,configurable:!0,get:()=>on.value,set:Xe=>on.value=Xe})}if(s)for(const be in s)Zl(s[be],r,t,be);if(l){const be=re(l)?l.call(t):l;Reflect.ownKeys(be).forEach(pe=>{$d(pe,be[pe])})}d&&Li(d,e,"c");function fe(be,pe){ee(pe)?pe.forEach(De=>be(De.bind(t))):pe&&be(pe.bind(t))}if(fe(Gd,h),fe(Bt,f),fe(Xd,y),fe(Jd,k),fe(qd,I),fe(Vd,P),fe(nh,W),fe(eh,S),fe(Zd,C),fe(Ql,j),fe(Ko,w),fe(Qd,F),ee(q))if(q.length){const be=e.exposed||(e.exposed={});q.forEach(pe=>{Object.defineProperty(be,pe,{get:()=>t[pe],set:De=>t[pe]=De,enumerable:!0})})}else e.exposed||(e.exposed={});_&&e.render===zn&&(e.render=_),X!=null&&(e.inheritAttrs=X),$&&(e.components=$),Q&&(e.directives=Q),F&&Xl(e)}function oh(e,n,t=zn){ee(e)&&(e=mo(e));for(const r in e){const a=e[r];let o;ye(a)?"default"in a?o=or(a.from||r,a.default,!0):o=or(a.from||r):o=or(a),Le(o)?Object.defineProperty(n,r,{enumerable:!0,configurable:!0,get:()=>o.value,set:i=>o.value=i}):n[r]=o}}function Li(e,n,t){yn(ee(e)?e.map(r=>r.bind(n.proxy)):e.bind(n.proxy),n,t)}function Zl(e,n,t,r){let a=r.includes(".")?Fl(t,r):()=>t[r];if(Ie(e)){const o=n[e];re(o)&&dn(a,o)}else if(re(e))dn(a,e.bind(t));else if(ye(e))if(ee(e))e.forEach(o=>Zl(o,n,t,r));else{const o=re(e.handler)?e.handler.bind(t):n[e.handler];re(o)&&dn(a,o,e)}}function ec(e){const n=e.type,{mixins:t,extends:r}=n,{mixins:a,optionsCache:o,config:{optionMergeStrategies:i}}=e.appContext,s=o.get(n);let l;return s?l=s:!a.length&&!t&&!r?l=n:(l={},a.length&&a.forEach(c=>aa(l,c,i,!0)),aa(l,n,i)),ye(n)&&o.set(n,l),l}function aa(e,n,t,r=!1){const{mixins:a,extends:o}=n;o&&aa(e,o,t,!0),a&&a.forEach(i=>aa(e,i,t,!0));for(const i in n)if(!(r&&i==="expose")){const s=ih[i]||t&&t[i];e[i]=s?s(e[i],n[i]):n[i]}return e}const ih={data:Pi,props:Ni,emits:Ni,methods:er,computed:er,beforeCreate:Ye,created:Ye,beforeMount:Ye,mounted:Ye,beforeUpdate:Ye,updated:Ye,beforeDestroy:Ye,beforeUnmount:Ye,destroyed:Ye,unmounted:Ye,activated:Ye,deactivated:Ye,errorCaptured:Ye,serverPrefetch:Ye,components:er,directives:er,watch:lh,provide:Pi,inject:sh};function Pi(e,n){return n?e?function(){return Oe(re(e)?e.call(this,this):e,re(n)?n.call(this,this):n)}:n:e}function sh(e,n){return er(mo(e),mo(n))}function mo(e){if(ee(e)){const n={};for(let t=0;t<e.length;t++)n[e[t]]=e[t];return n}return e}function Ye(e,n){return e?[...new Set([].concat(e,n))]:n}function er(e,n){return e?Oe(Object.create(null),e,n):n}function Ni(e,n){return e?ee(e)&&ee(n)?[...new Set([...e,...n])]:Oe(Object.create(null),Ei(e),Ei(n??{})):n}function lh(e,n){if(!e)return n;if(!n)return e;const t=Oe(Object.create(null),e);for(const r in n)t[r]=Ye(e[r],n[r]);return t}function nc(){return{app:null,config:{isNativeTag:sl,performance:!1,globalProperties:{},optionMergeStrategies:{},errorHandler:void 0,warnHandler:void 0,compilerOptions:{}},mixins:[],components:{},directives:{},provides:Object.create(null),optionsCache:new WeakMap,propsCache:new WeakMap,emitsCache:new WeakMap}}let ch=0;function uh(e,n){return function(r,a=null){re(r)||(r=Oe({},r)),a!=null&&!ye(a)&&(a=null);const o=nc(),i=new WeakSet,s=[];let l=!1;const c=o.app={_uid:ch++,_component:r,_props:a,_container:null,_context:o,_instance:null,version:Hh,get config(){return o.config},set config(d){},use(d,...h){return i.has(d)||(d&&re(d.install)?(i.add(d),d.install(c,...h)):re(d)&&(i.add(d),d(c,...h))),c},mixin(d){return o.mixins.includes(d)||o.mixins.push(d),c},component(d,h){return h?(o.components[d]=h,c):o.components[d]},directive(d,h){return h?(o.directives[d]=h,c):o.directives[d]},mount(d,h,f){if(!l){const y=c._ceVNode||ve(r,a);return y.appContext=o,f===!0?f="svg":f===!1&&(f=void 0),e(y,d,f),l=!0,c._container=d,d.__vue_app__=c,Sa(y.component)}},onUnmount(d){s.push(d)},unmount(){l&&(yn(s,c._instance,16),e(null,c._container),delete c._container.__vue_app__)},provide(d,h){return o.provides[d]=h,c},runWithContext(d){const h=Rt;Rt=c;try{return d()}finally{Rt=h}}};return c}}let Rt=null;const dh=(e,n)=>n==="modelValue"||n==="model-value"?e.modelModifiers:e[`${n}Modifiers`]||e[`${rt(n)}Modifiers`]||e[`${kt(n)}Modifiers`];function hh(e,n,...t){if(e.isUnmounted)return;const r=e.vnode.props||we;let a=t;const o=n.startsWith("update:"),i=o&&dh(r,n.slice(7));i&&(i.trim&&(a=t.map(d=>Ie(d)?d.trim():d)),i.number&&(a=t.map(fl)));let s,l=r[s=La(n)]||r[s=La(rt(n))];!l&&o&&(l=r[s=La(kt(n))]),l&&yn(l,e,6,a);const c=r[s+"Once"];if(c){if(!e.emitted)e.emitted={};else if(e.emitted[s])return;e.emitted[s]=!0,yn(c,e,6,a)}}const fh=new WeakMap;function tc(e,n,t=!1){const r=t?fh:n.emitsCache,a=r.get(e);if(a!==void 0)return a;const o=e.emits;let i={},s=!1;if(!re(e)){const l=c=>{const d=tc(c,n,!0);d&&(s=!0,Oe(i,d))};!t&&n.mixins.length&&n.mixins.forEach(l),e.extends&&l(e.extends),e.mixins&&e.mixins.forEach(l)}return!o&&!s?(ye(e)&&r.set(e,null),null):(ee(o)?o.forEach(l=>i[l]=null):Oe(i,o),ye(e)&&r.set(e,i),i)}function Ia(e,n){return!e||!ma(n)?!1:(n=n.slice(2).replace(/Once$/,""),ge(e,n[0].toLowerCase()+n.slice(1))||ge(e,kt(n))||ge(e,n))}function Mi(e){const{type:n,vnode:t,proxy:r,withProxy:a,propsOptions:[o],slots:i,attrs:s,emit:l,render:c,renderCache:d,props:h,data:f,setupState:y,ctx:k,inheritAttrs:I}=e,P=ta(e);let v,j;try{if(t.shapeFlag&4){const w=a||r,_=w;v=jn(c.call(_,w,d,h,y,f,k)),j=s}else{const w=n;v=jn(w.length>1?w(h,{attrs:s,slots:i,emit:l}):w(h,null)),j=n.props?s:ph(s)}}catch(w){ur.length=0,ka(w,e,1),v=ve(Ve)}let N=v;if(j&&I!==!1){const w=Object.keys(j),{shapeFlag:_}=N;w.length&&_&7&&(o&&w.some(Ro)&&(j=mh(j,o)),N=at(N,j,!1,!0))}return t.dirs&&(N=at(N,null,!1,!0),N.dirs=N.dirs?N.dirs.concat(t.dirs):t.dirs),t.transition&&pr(N,t.transition),v=N,ta(P),v}const ph=e=>{let n;for(const t in e)(t==="class"||t==="style"||ma(t))&&((n||(n={}))[t]=e[t]);return n},mh=(e,n)=>{const t={};for(const r in e)(!Ro(r)||!(r.slice(9)in n))&&(t[r]=e[r]);return t};function gh(e,n,t){const{props:r,children:a,component:o}=e,{props:i,children:s,patchFlag:l}=n,c=o.emitsOptions;if(n.dirs||n.transition)return!0;if(t&&l>=0){if(l&1024)return!0;if(l&16)return r?Oi(r,i,c):!!i;if(l&8){const d=n.dynamicProps;for(let h=0;h<d.length;h++){const f=d[h];if(i[f]!==r[f]&&!Ia(c,f))return!0}}}else return(a||s)&&(!s||!s.$stable)?!0:r===i?!1:r?i?Oi(r,i,c):!0:!!i;return!1}function Oi(e,n,t){const r=Object.keys(n);if(r.length!==Object.keys(e).length)return!0;for(let a=0;a<r.length;a++){const o=r[a];if(n[o]!==e[o]&&!Ia(t,o))return!0}return!1}function yh({vnode:e,parent:n},t){for(;n;){const r=n.subTree;if(r.suspense&&r.suspense.activeBranch===e&&(r.el=e.el),r===e)(e=n.vnode).el=t,n=n.parent;else break}}const rc={},ac=()=>Object.create(rc),oc=e=>Object.getPrototypeOf(e)===rc;function vh(e,n,t,r=!1){const a={},o=ac();e.propsDefaults=Object.create(null),ic(e,n,a,o);for(const i in e.propsOptions[0])i in a||(a[i]=void 0);t?e.props=r?a:wd(a):e.type.props?e.props=a:e.props=o,e.attrs=o}function xh(e,n,t,r){const{props:a,attrs:o,vnode:{patchFlag:i}}=e,s=ue(a),[l]=e.propsOptions;let c=!1;if((r||i>0)&&!(i&16)){if(i&8){const d=e.vnode.dynamicProps;for(let h=0;h<d.length;h++){let f=d[h];if(Ia(e.emitsOptions,f))continue;const y=n[f];if(l)if(ge(o,f))y!==o[f]&&(o[f]=y,c=!0);else{const k=rt(f);a[k]=go(l,s,k,y,e,!1)}else y!==o[f]&&(o[f]=y,c=!0)}}}else{ic(e,n,a,o)&&(c=!0);let d;for(const h in s)(!n||!ge(n,h)&&((d=kt(h))===h||!ge(n,d)))&&(l?t&&(t[h]!==void 0||t[d]!==void 0)&&(a[h]=go(l,s,h,void 0,e,!0)):delete a[h]);if(o!==s)for(const h in o)(!n||!ge(n,h))&&(delete o[h],c=!0)}c&&Rn(e.attrs,"set","")}function ic(e,n,t,r){const[a,o]=e.propsOptions;let i=!1,s;if(n)for(let l in n){if(tr(l))continue;const c=n[l];let d;a&&ge(a,d=rt(l))?!o||!o.includes(d)?t[d]=c:(s||(s={}))[d]=c:Ia(e.emitsOptions,l)||(!(l in r)||c!==r[l])&&(r[l]=c,i=!0)}if(o){const l=ue(t),c=s||we;for(let d=0;d<o.length;d++){const h=o[d];t[h]=go(a,l,h,c[h],e,!ge(c,h))}}return i}function go(e,n,t,r,a,o){const i=e[t];if(i!=null){const s=ge(i,"default");if(s&&r===void 0){const l=i.default;if(i.type!==Function&&!i.skipFactory&&re(l)){const{propsDefaults:c}=a;if(t in c)r=c[t];else{const d=Lr(a);r=c[t]=l.call(null,n),d()}}else r=l;a.ce&&a.ce._setProp(t,r)}i[0]&&(o&&!s?r=!1:i[1]&&(r===""||r===kt(t))&&(r=!0))}return r}const bh=new WeakMap;function sc(e,n,t=!1){const r=t?bh:n.propsCache,a=r.get(e);if(a)return a;const o=e.props,i={},s=[];let l=!1;if(!re(e)){const d=h=>{l=!0;const[f,y]=sc(h,n,!0);Oe(i,f),y&&s.push(...y)};!t&&n.mixins.length&&n.mixins.forEach(d),e.extends&&d(e.extends),e.mixins&&e.mixins.forEach(d)}if(!o&&!l)return ye(e)&&r.set(e,Nt),Nt;if(ee(o))for(let d=0;d<o.length;d++){const h=rt(o[d]);Ri(h)&&(i[h]=we)}else if(o)for(const d in o){const h=rt(d);if(Ri(h)){const f=o[d],y=i[h]=ee(f)||re(f)?{type:f}:Oe({},f),k=y.type;let I=!1,P=!0;if(ee(k))for(let v=0;v<k.length;++v){const j=k[v],N=re(j)&&j.name;if(N==="Boolean"){I=!0;break}else N==="String"&&(P=!1)}else I=re(k)&&k.name==="Boolean";y[0]=I,y[1]=P,(I||ge(y,"default"))&&s.push(h)}}const c=[i,s];return ye(e)&&r.set(e,c),c}function Ri(e){return e[0]!=="$"&&!tr(e)}const Go=e=>e==="_"||e==="_ctx"||e==="$stable",Xo=e=>ee(e)?e.map(jn):[jn(e)],wh=(e,n,t)=>{if(n._n)return n;const r=_t((...a)=>Xo(n(...a)),t);return r._c=!1,r},lc=(e,n,t)=>{const r=e._ctx;for(const a in e){if(Go(a))continue;const o=e[a];if(re(o))n[a]=wh(a,o,r);else if(o!=null){const i=Xo(o);n[a]=()=>i}}},cc=(e,n)=>{const t=Xo(n);e.slots.default=()=>t},uc=(e,n,t)=>{for(const r in n)(t||!Go(r))&&(e[r]=n[r])},_h=(e,n,t)=>{const r=e.slots=ac();if(e.vnode.shapeFlag&32){const a=n._;a?(uc(r,n,t),t&&hl(r,"_",a,!0)):lc(n,r)}else n&&cc(e,n)},kh=(e,n,t)=>{const{vnode:r,slots:a}=e;let o=!0,i=we;if(r.shapeFlag&32){const s=n._;s?t&&s===1?o=!1:uc(a,n,t):(o=!n.$stable,lc(n,a)),i=n}else n&&(cc(e,n),i={default:1});if(o)for(const s in a)!Go(s)&&i[s]==null&&delete a[s]},Be=Th;function jh(e){return zh(e)}function zh(e,n){const t=xa();t.__VUE__=!0;const{insert:r,remove:a,patchProp:o,createElement:i,createText:s,createComment:l,setText:c,setElementText:d,parentNode:h,nextSibling:f,setScopeId:y=zn,insertStaticContent:k}=e,I=(b,z,O,U=null,H=null,Y=null,p=void 0,m=null,T=!!z.dynamicChildren)=>{if(b===z)return;b&&!gt(b,z)&&(U=qn(b),Xe(b,H,Y,!0),b=null),z.patchFlag===-2&&(T=!1,z.dynamicChildren=null);const{type:E,ref:V,shapeFlag:D}=z;switch(E){case Er:P(b,z,O,U);break;case Ve:v(b,z,O,U);break;case Vr:b==null&&j(z,O,U,p);break;case te:$(b,z,O,U,H,Y,p,m,T);break;default:D&1?_(b,z,O,U,H,Y,p,m,T):D&6?Q(b,z,O,U,H,Y,p,m,T):(D&64||D&128)&&E.process(b,z,O,U,H,Y,p,m,T,vn)}V!=null&&H?sr(V,b&&b.ref,Y,z||b,!z):V==null&&b&&b.ref!=null&&sr(b.ref,null,Y,b,!0)},P=(b,z,O,U)=>{if(b==null)r(z.el=s(z.children),O,U);else{const H=z.el=b.el;z.children!==b.children&&c(H,z.children)}},v=(b,z,O,U)=>{b==null?r(z.el=l(z.children||""),O,U):z.el=b.el},j=(b,z,O,U)=>{[b.el,b.anchor]=k(b.children,z,O,U,b.el,b.anchor)},N=({el:b,anchor:z},O,U)=>{let H;for(;b&&b!==z;)H=f(b),r(b,O,U),b=H;r(z,O,U)},w=({el:b,anchor:z})=>{let O;for(;b&&b!==z;)O=f(b),a(b),b=O;a(z)},_=(b,z,O,U,H,Y,p,m,T)=>{if(z.type==="svg"?p="svg":z.type==="math"&&(p="mathml"),b==null)S(z,O,U,H,Y,p,m,T);else{const E=b.el&&b.el._isVueCE?b.el:null;try{E&&E._beginPatch(),F(b,z,H,Y,p,m,T)}finally{E&&E._endPatch()}}},S=(b,z,O,U,H,Y,p,m)=>{let T,E;const{props:V,shapeFlag:D,transition:A,dirs:M}=b;if(T=b.el=i(b.type,Y,V&&V.is,V),D&8?d(T,b.children):D&16&&W(b.children,T,null,U,H,Da(b,Y),p,m),M&&ut(b,null,U,"created"),C(T,b,b.scopeId,p,U),V){for(const ne in V)ne!=="value"&&!tr(ne)&&o(T,ne,null,V[ne],Y,U);"value"in V&&o(T,"value",null,V.value,Y),(E=V.onVnodeBeforeMount)&&bn(E,U,b)}M&&ut(b,null,U,"beforeMount");const G=Ih(H,A);G&&A.beforeEnter(T),r(T,z,O),((E=V&&V.onVnodeMounted)||G||M)&&Be(()=>{E&&bn(E,U,b),G&&A.enter(T),M&&ut(b,null,U,"mounted")},H)},C=(b,z,O,U,H)=>{if(O&&y(b,O),U)for(let Y=0;Y<U.length;Y++)y(b,U[Y]);if(H){let Y=H.subTree;if(z===Y||fc(Y.type)&&(Y.ssContent===z||Y.ssFallback===z)){const p=H.vnode;C(b,p,p.scopeId,p.slotScopeIds,H.parent)}}},W=(b,z,O,U,H,Y,p,m,T=0)=>{for(let E=T;E<b.length;E++){const V=b[E]=m?Jn(b[E]):jn(b[E]);I(null,V,z,O,U,H,Y,p,m)}},F=(b,z,O,U,H,Y,p)=>{const m=z.el=b.el;let{patchFlag:T,dynamicChildren:E,dirs:V}=z;T|=b.patchFlag&16;const D=b.props||we,A=z.props||we;let M;if(O&&dt(O,!1),(M=A.onVnodeBeforeUpdate)&&bn(M,O,z,b),V&&ut(z,b,O,"beforeUpdate"),O&&dt(O,!0),(D.innerHTML&&A.innerHTML==null||D.textContent&&A.textContent==null)&&d(m,""),E?q(b.dynamicChildren,E,m,O,U,Da(z,H),Y):p||pe(b,z,m,null,O,U,Da(z,H),Y,!1),T>0){if(T&16)X(m,D,A,O,H);else if(T&2&&D.class!==A.class&&o(m,"class",null,A.class,H),T&4&&o(m,"style",D.style,A.style,H),T&8){const G=z.dynamicProps;for(let ne=0;ne<G.length;ne++){const se=G[ne],Pe=D[se],Se=A[se];(Se!==Pe||se==="value")&&o(m,se,Pe,Se,H,O)}}T&1&&b.children!==z.children&&d(m,z.children)}else!p&&E==null&&X(m,D,A,O,H);((M=A.onVnodeUpdated)||V)&&Be(()=>{M&&bn(M,O,z,b),V&&ut(z,b,O,"updated")},U)},q=(b,z,O,U,H,Y,p)=>{for(let m=0;m<z.length;m++){const T=b[m],E=z[m],V=T.el&&(T.type===te||!gt(T,E)||T.shapeFlag&198)?h(T.el):O;I(T,E,V,null,U,H,Y,p,!0)}},X=(b,z,O,U,H)=>{if(z!==O){if(z!==we)for(const Y in z)!tr(Y)&&!(Y in O)&&o(b,Y,z[Y],null,H,U);for(const Y in O){if(tr(Y))continue;const p=O[Y],m=z[Y];p!==m&&Y!=="value"&&o(b,Y,m,p,H,U)}"value"in O&&o(b,"value",z.value,O.value,H)}},$=(b,z,O,U,H,Y,p,m,T)=>{const E=z.el=b?b.el:s(""),V=z.anchor=b?b.anchor:s("");let{patchFlag:D,dynamicChildren:A,slotScopeIds:M}=z;M&&(m=m?m.concat(M):M),b==null?(r(E,O,U),r(V,O,U),W(z.children||[],O,V,H,Y,p,m,T)):D>0&&D&64&&A&&b.dynamicChildren&&b.dynamicChildren.length===A.length?(q(b.dynamicChildren,A,O,H,Y,p,m),(z.key!=null||H&&z===H.subTree)&&Jo(b,z,!0)):pe(b,z,O,V,H,Y,p,m,T)},Q=(b,z,O,U,H,Y,p,m,T)=>{z.slotScopeIds=m,b==null?z.shapeFlag&512?H.ctx.activate(z,O,U,p,T):ce(z,O,U,H,Y,p,T):$e(b,z,T)},ce=(b,z,O,U,H,Y,p)=>{const m=b.component=Oh(b,U,H);if(ja(b)&&(m.ctx.renderer=vn),Rh(m,!1,p),m.asyncDep){if(H&&H.registerDep(m,fe,p),!b.el){const T=m.subTree=ve(Ve);v(null,T,z,O),b.placeholder=T.el}}else fe(m,b,z,O,H,Y,p)},$e=(b,z,O)=>{const U=z.component=b.component;if(gh(b,z,O))if(U.asyncDep&&!U.asyncResolved){be(U,z,O);return}else U.next=z,U.update();else z.el=b.el,U.vnode=z},fe=(b,z,O,U,H,Y,p)=>{const m=()=>{if(b.isMounted){let{next:D,bu:A,u:M,parent:G,vnode:ne}=b;{const hn=dc(b);if(hn){D&&(D.el=ne.el,be(b,D,p)),hn.asyncDep.then(()=>{b.isUnmounted||m()});return}}let se=D,Pe;dt(b,!1),D?(D.el=ne.el,be(b,D,p)):D=ne,A&&Br(A),(Pe=D.props&&D.props.onVnodeBeforeUpdate)&&bn(Pe,G,D,ne),dt(b,!0);const Se=Mi(b),sn=b.subTree;b.subTree=Se,I(sn,Se,h(sn.el),qn(sn),b,H,Y),D.el=Se.el,se===null&&yh(b,Se.el),M&&Be(M,H),(Pe=D.props&&D.props.onVnodeUpdated)&&Be(()=>bn(Pe,G,D,ne),H)}else{let D;const{el:A,props:M}=z,{bm:G,m:ne,parent:se,root:Pe,type:Se}=b,sn=lr(z);dt(b,!1),G&&Br(G),!sn&&(D=M&&M.onVnodeBeforeMount)&&bn(D,se,z),dt(b,!0);{Pe.ce&&Pe.ce._def.shadowRoot!==!1&&Pe.ce._injectChildStyle(Se);const hn=b.subTree=Mi(b);I(null,hn,O,U,b,H,Y),z.el=hn.el}if(ne&&Be(ne,H),!sn&&(D=M&&M.onVnodeMounted)){const hn=z;Be(()=>bn(D,se,hn),H)}(z.shapeFlag&256||se&&lr(se.vnode)&&se.vnode.shapeFlag&256)&&b.a&&Be(b.a,H),b.isMounted=!0,z=O=U=null}};b.scope.on();const T=b.effect=new vl(m);b.scope.off();const E=b.update=T.run.bind(T),V=b.job=T.runIfDirty.bind(T);V.i=b,V.id=b.uid,T.scheduler=()=>qo(V),dt(b,!0),E()},be=(b,z,O)=>{z.component=b;const U=b.vnode.props;b.vnode=z,b.next=null,xh(b,z.props,U,O),kh(b,z.children,O),Wn(),zi(b),Hn()},pe=(b,z,O,U,H,Y,p,m,T=!1)=>{const E=b&&b.children,V=b?b.shapeFlag:0,D=z.children,{patchFlag:A,shapeFlag:M}=z;if(A>0){if(A&128){An(E,D,O,U,H,Y,p,m,T);return}else if(A&256){De(E,D,O,U,H,Y,p,m,T);return}}M&8?(V&16&&Cn(E,H,Y),D!==E&&d(O,D)):V&16?M&16?An(E,D,O,U,H,Y,p,m,T):Cn(E,H,Y,!0):(V&8&&d(O,""),M&16&&W(D,O,U,H,Y,p,m,T))},De=(b,z,O,U,H,Y,p,m,T)=>{b=b||Nt,z=z||Nt;const E=b.length,V=z.length,D=Math.min(E,V);let A;for(A=0;A<D;A++){const M=z[A]=T?Jn(z[A]):jn(z[A]);I(b[A],M,O,null,H,Y,p,m,T)}E>V?Cn(b,H,Y,!0,!1,D):W(z,O,U,H,Y,p,m,T,D)},An=(b,z,O,U,H,Y,p,m,T)=>{let E=0;const V=z.length;let D=b.length-1,A=V-1;for(;E<=D&&E<=A;){const M=b[E],G=z[E]=T?Jn(z[E]):jn(z[E]);if(gt(M,G))I(M,G,O,null,H,Y,p,m,T);else break;E++}for(;E<=D&&E<=A;){const M=b[D],G=z[A]=T?Jn(z[A]):jn(z[A]);if(gt(M,G))I(M,G,O,null,H,Y,p,m,T);else break;D--,A--}if(E>D){if(E<=A){const M=A+1,G=M<V?z[M].el:U;for(;E<=A;)I(null,z[E]=T?Jn(z[E]):jn(z[E]),O,G,H,Y,p,m,T),E++}}else if(E>A)for(;E<=D;)Xe(b[E],H,Y,!0),E++;else{const M=E,G=E,ne=new Map;for(E=G;E<=A;E++){const en=z[E]=T?Jn(z[E]):jn(z[E]);en.key!=null&&ne.set(en.key,E)}let se,Pe=0;const Se=A-G+1;let sn=!1,hn=0;const Vt=new Array(Se);for(E=0;E<Se;E++)Vt[E]=0;for(E=M;E<=D;E++){const en=b[E];if(Pe>=Se){Xe(en,H,Y,!0);continue}let xn;if(en.key!=null)xn=ne.get(en.key);else for(se=G;se<=A;se++)if(Vt[se-G]===0&&gt(en,z[se])){xn=se;break}xn===void 0?Xe(en,H,Y,!0):(Vt[xn-G]=E+1,xn>=hn?hn=xn:sn=!0,I(en,z[xn],O,null,H,Y,p,m,T),Pe++)}const vi=sn?Sh(Vt):Nt;for(se=vi.length-1,E=Se-1;E>=0;E--){const en=G+E,xn=z[en],xi=z[en+1],bi=en+1<V?xi.el||hc(xi):U;Vt[E]===0?I(null,xn,O,bi,H,Y,p,m,T):sn&&(se<0||E!==vi[se]?on(xn,O,bi,2):se--)}}},on=(b,z,O,U,H=null)=>{const{el:Y,type:p,transition:m,children:T,shapeFlag:E}=b;if(E&6){on(b.component.subTree,z,O,U);return}if(E&128){b.suspense.move(z,O,U);return}if(E&64){p.move(b,z,O,vn);return}if(p===te){r(Y,z,O);for(let D=0;D<T.length;D++)on(T[D],z,O,U);r(b.anchor,z,O);return}if(p===Vr){N(b,z,O);return}if(U!==2&&E&1&&m)if(U===0)m.beforeEnter(Y),r(Y,z,O),Be(()=>m.enter(Y),H);else{const{leave:D,delayLeave:A,afterLeave:M}=m,G=()=>{b.ctx.isUnmounted?a(Y):r(Y,z,O)},ne=()=>{Y._isLeaving&&Y[On](!0),D(Y,()=>{G(),M&&M()})};A?A(Y,G,ne):ne()}else r(Y,z,O)},Xe=(b,z,O,U=!1,H=!1)=>{const{type:Y,props:p,ref:m,children:T,dynamicChildren:E,shapeFlag:V,patchFlag:D,dirs:A,cacheIndex:M}=b;if(D===-2&&(H=!1),m!=null&&(Wn(),sr(m,null,O,b,!0),Hn()),M!=null&&(z.renderCache[M]=void 0),V&256){z.ctx.deactivate(b);return}const G=V&1&&A,ne=!lr(b);let se;if(ne&&(se=p&&p.onVnodeBeforeUnmount)&&bn(se,z,b),V&6)Pr(b.component,O,U);else{if(V&128){b.suspense.unmount(O,U);return}G&&ut(b,null,z,"beforeUnmount"),V&64?b.type.remove(b,z,O,vn,U):E&&!E.hasOnce&&(Y!==te||D>0&&D&64)?Cn(E,z,O,!1,!0):(Y===te&&D&384||!H&&V&16)&&Cn(T,z,O),U&&zt(b)}(ne&&(se=p&&p.onVnodeUnmounted)||G)&&Be(()=>{se&&bn(se,z,b),G&&ut(b,null,z,"unmounted")},O)},zt=b=>{const{type:z,el:O,anchor:U,transition:H}=b;if(z===te){qt(O,U);return}if(z===Vr){w(b);return}const Y=()=>{a(O),H&&!H.persisted&&H.afterLeave&&H.afterLeave()};if(b.shapeFlag&1&&H&&!H.persisted){const{leave:p,delayLeave:m}=H,T=()=>p(O,Y);m?m(b.el,Y,T):T()}else Y()},qt=(b,z)=>{let O;for(;b!==z;)O=f(b),a(b),b=O;a(z)},Pr=(b,z,O)=>{const{bum:U,scope:H,job:Y,subTree:p,um:m,m:T,a:E}=b;$i(T),$i(E),U&&Br(U),H.stop(),Y&&(Y.flags|=8,Xe(p,b,z,O)),m&&Be(m,z),Be(()=>{b.isUnmounted=!0},z)},Cn=(b,z,O,U=!1,H=!1,Y=0)=>{for(let p=Y;p<b.length;p++)Xe(b[p],z,O,U,H)},qn=b=>{if(b.shapeFlag&6)return qn(b.component.subTree);if(b.shapeFlag&128)return b.suspense.next();const z=f(b.anchor||b.el),O=z&&z[Wl];return O?f(O):z};let Vn=!1;const It=(b,z,O)=>{let U;b==null?z._vnode&&(Xe(z._vnode,null,null,!0),U=z._vnode.component):I(z._vnode||null,b,z,null,null,null,O),z._vnode=b,Vn||(Vn=!0,zi(U),Ol(),Vn=!1)},vn={p:I,um:Xe,m:on,r:zt,mt:ce,mc:W,pc:pe,pbc:q,n:qn,o:e};return{render:It,hydrate:void 0,createApp:uh(It)}}function Da({type:e,props:n},t){return t==="svg"&&e==="foreignObject"||t==="mathml"&&e==="annotation-xml"&&n&&n.encoding&&n.encoding.includes("html")?void 0:t}function dt({effect:e,job:n},t){t?(e.flags|=32,n.flags|=4):(e.flags&=-33,n.flags&=-5)}function Ih(e,n){return(!e||e&&!e.pendingBranch)&&n&&!n.persisted}function Jo(e,n,t=!1){const r=e.children,a=n.children;if(ee(r)&&ee(a))for(let o=0;o<r.length;o++){const i=r[o];let s=a[o];s.shapeFlag&1&&!s.dynamicChildren&&((s.patchFlag<=0||s.patchFlag===32)&&(s=a[o]=Jn(a[o]),s.el=i.el),!t&&s.patchFlag!==-2&&Jo(i,s)),s.type===Er&&(s.patchFlag!==-1?s.el=i.el:s.__elIndex=o+(e.type===te?1:0)),s.type===Ve&&!s.el&&(s.el=i.el)}}function Sh(e){const n=e.slice(),t=[0];let r,a,o,i,s;const l=e.length;for(r=0;r<l;r++){const c=e[r];if(c!==0){if(a=t[t.length-1],e[a]<c){n[r]=a,t.push(r);continue}for(o=0,i=t.length-1;o<i;)s=o+i>>1,e[t[s]]<c?o=s+1:i=s;c<e[t[o]]&&(o>0&&(n[r]=t[o-1]),t[o]=r)}}for(o=t.length,i=t[o-1];o-- >0;)t[o]=i,i=n[i];return t}function dc(e){const n=e.subTree.component;if(n)return n.asyncDep&&!n.asyncResolved?n:dc(n)}function $i(e){if(e)for(let n=0;n<e.length;n++)e[n].flags|=8}function hc(e){if(e.placeholder)return e.placeholder;const n=e.component;return n?hc(n.subTree):null}const fc=e=>e.__isSuspense;function Th(e,n){n&&n.pendingBranch?ee(e)?n.effects.push(...e):n.effects.push(e):Od(e)}const te=Symbol.for("v-fgt"),Er=Symbol.for("v-txt"),Ve=Symbol.for("v-cmt"),Vr=Symbol.for("v-stc"),ur=[];let tn=null;function L(e=!1){ur.push(tn=e?null:[])}function Ah(){ur.pop(),tn=ur[ur.length-1]||null}let mr=1;function oa(e,n=!1){mr+=e,e<0&&tn&&n&&(tn.hasOnce=!0)}function pc(e){return e.dynamicChildren=mr>0?tn||Nt:null,Ah(),mr>0&&tn&&tn.push(e),e}function R(e,n,t,r,a,o){return pc(u(e,n,t,r,a,o,!0))}function Ae(e,n,t,r,a){return pc(ve(e,n,t,r,a,!0))}function ia(e){return e?e.__v_isVNode===!0:!1}function gt(e,n){return e.type===n.type&&e.key===n.key}const mc=({key:e})=>e??null,Kr=({ref:e,ref_key:n,ref_for:t})=>(typeof e=="number"&&(e=""+e),e!=null?Ie(e)||Le(e)||re(e)?{i:un,r:e,k:n,f:!!t}:e:null);function u(e,n=null,t=null,r=0,a=null,o=e===te?0:1,i=!1,s=!1){const l={__v_isVNode:!0,__v_skip:!0,type:e,props:n,key:n&&mc(n),ref:n&&Kr(n),scopeId:$l,slotScopeIds:null,children:t,component:null,suspense:null,ssContent:null,ssFallback:null,dirs:null,transition:null,el:null,anchor:null,target:null,targetStart:null,targetAnchor:null,staticCount:0,shapeFlag:o,patchFlag:r,dynamicProps:a,dynamicChildren:null,appContext:null,ctx:un};return s?(Qo(l,t),o&128&&e.normalize(l)):t&&(l.shapeFlag|=Ie(t)?8:16),mr>0&&!i&&tn&&(l.patchFlag>0||o&6)&&l.patchFlag!==32&&tn.push(l),l}const ve=Ch;function Ch(e,n=null,t=null,r=0,a=null,o=!1){if((!e||e===th)&&(e=Ve),ia(e)){const s=at(e,n,!0);return t&&Qo(s,t),mr>0&&!o&&tn&&(s.shapeFlag&6?tn[tn.indexOf(e)]=s:tn.push(s)),s.patchFlag=-2,s}if(Wh(e)&&(e=e.__vccOpts),n){n=Eh(n);let{class:s,style:l}=n;s&&!Ie(s)&&(n.class=Z(s)),ye(l)&&(_a(l)&&!ee(l)&&(l=Oe({},l)),n.style=mn(l))}const i=Ie(e)?1:fc(e)?128:Hl(e)?64:ye(e)?4:re(e)?2:0;return u(e,n,t,r,a,i,o,!0)}function Eh(e){return e?_a(e)||oc(e)?Oe({},e):e:null}function at(e,n,t=!1,r=!1){const{props:a,ref:o,patchFlag:i,children:s,transition:l}=e,c=n?Ph(a||{},n):a,d={__v_isVNode:!0,__v_skip:!0,type:e.type,props:c,key:c&&mc(c),ref:n&&n.ref?t&&o?ee(o)?o.concat(Kr(n)):[o,Kr(n)]:Kr(n):o,scopeId:e.scopeId,slotScopeIds:e.slotScopeIds,children:s,target:e.target,targetStart:e.targetStart,targetAnchor:e.targetAnchor,staticCount:e.staticCount,shapeFlag:e.shapeFlag,patchFlag:n&&e.type!==te?i===-1?16:i|16:i,dynamicProps:e.dynamicProps,dynamicChildren:e.dynamicChildren,appContext:e.appContext,dirs:e.dirs,transition:l,component:e.component,suspense:e.suspense,ssContent:e.ssContent&&at(e.ssContent),ssFallback:e.ssFallback&&at(e.ssFallback),placeholder:e.placeholder,el:e.el,anchor:e.anchor,ctx:e.ctx,ce:e.ce};return l&&r&&pr(d,l.clone(d)),d}function Te(e=" ",n=0){return ve(Er,null,e,n)}function Lh(e,n){const t=ve(Vr,null,e);return t.staticCount=n,t}function ae(e="",n=!1){return n?(L(),Ae(Ve,null,e)):ve(Ve,null,e)}function jn(e){return e==null||typeof e=="boolean"?ve(Ve):ee(e)?ve(te,null,e.slice()):ia(e)?Jn(e):ve(Er,null,String(e))}function Jn(e){return e.el===null&&e.patchFlag!==-1||e.memo?e:at(e)}function Qo(e,n){let t=0;const{shapeFlag:r}=e;if(n==null)n=null;else if(ee(n))t=16;else if(typeof n=="object")if(r&65){const a=n.default;a&&(a._c&&(a._d=!1),Qo(e,a()),a._c&&(a._d=!0));return}else{t=32;const a=n._;!a&&!oc(n)?n._ctx=un:a===3&&un&&(un.slots._===1?n._=1:(n._=2,e.patchFlag|=1024))}else re(n)?(n={default:n,_ctx:un},t=32):(n=String(n),r&64?(t=16,n=[Te(n)]):t=8);e.children=n,e.shapeFlag|=t}function Ph(...e){const n={};for(let t=0;t<e.length;t++){const r=e[t];for(const a in r)if(a==="class")n.class!==r.class&&(n.class=Z([n.class,r.class]));else if(a==="style")n.style=mn([n.style,r.style]);else if(ma(a)){const o=n[a],i=r[a];i&&o!==i&&!(ee(o)&&o.includes(i))&&(n[a]=o?[].concat(o,i):i)}else a!==""&&(n[a]=r[a])}return n}function bn(e,n,t,r=null){yn(e,n,7,[t,r])}const Nh=nc();let Mh=0;function Oh(e,n,t){const r=e.type,a=(n?n.appContext:e.appContext)||Nh,o={uid:Mh++,vnode:e,type:r,parent:n,appContext:a,root:null,next:null,subTree:null,effect:null,update:null,job:null,scope:new yl(!0),render:null,proxy:null,exposed:null,exposeProxy:null,withProxy:null,provides:n?n.provides:Object.create(a.provides),ids:n?n.ids:["",0,0],accessCache:null,renderCache:[],components:null,directives:null,propsOptions:sc(r,a),emitsOptions:tc(r,a),emit:null,emitted:null,propsDefaults:we,inheritAttrs:r.inheritAttrs,ctx:we,data:we,props:we,attrs:we,slots:we,refs:we,setupState:we,setupContext:null,suspense:t,suspenseId:t?t.pendingId:0,asyncDep:null,asyncResolved:!1,isMounted:!1,isUnmounted:!1,isDeactivated:!1,bc:null,c:null,bm:null,m:null,bu:null,u:null,um:null,bum:null,da:null,a:null,rtg:null,rtc:null,ec:null,sp:null};return o.ctx={_:o},o.root=n?n.root:o,o.emit=hh.bind(null,o),e.ce&&e.ce(o),o}let Ke=null;const Zo=()=>Ke||un;let sa,yo;{const e=xa(),n=(t,r)=>{let a;return(a=e[t])||(a=e[t]=[]),a.push(r),o=>{a.length>1?a.forEach(i=>i(o)):a[0](o)}};sa=n("__VUE_INSTANCE_SETTERS__",t=>Ke=t),yo=n("__VUE_SSR_SETTERS__",t=>gr=t)}const Lr=e=>{const n=Ke;return sa(e),e.scope.on(),()=>{e.scope.off(),sa(n)}},Di=()=>{Ke&&Ke.scope.off(),sa(null)};function gc(e){return e.vnode.shapeFlag&4}let gr=!1;function Rh(e,n=!1,t=!1){n&&yo(n);const{props:r,children:a}=e.vnode,o=gc(e);vh(e,r,o,n),_h(e,a,t||n);const i=o?$h(e,n):void 0;return n&&yo(!1),i}function $h(e,n){const t=e.type;e.accessCache=Object.create(null),e.proxy=new Proxy(e.ctx,rh);const{setup:r}=t;if(r){Wn();const a=e.setupContext=r.length>1?Fh(e):null,o=Lr(e),i=Ar(r,e,0,[e.props,a]),s=ll(i);if(Hn(),o(),(s||e.sp)&&!lr(e)&&Xl(e),s){if(i.then(Di,Di),n)return i.then(l=>{Fi(e,l)}).catch(l=>{ka(l,e,0)});e.asyncDep=i}else Fi(e,i)}else yc(e)}function Fi(e,n,t){re(n)?e.type.__ssrInlineRender?e.ssrRender=n:e.render=n:ye(n)&&(e.setupState=Pl(n)),yc(e)}function yc(e,n,t){const r=e.type;e.render||(e.render=r.render||zn);{const a=Lr(e);Wn();try{ah(e)}finally{Hn(),a()}}}const Dh={get(e,n){return He(e,"get",""),e[n]}};function Fh(e){const n=t=>{e.exposed=t||{}};return{attrs:new Proxy(e.attrs,Dh),slots:e.slots,emit:e.emit,expose:n}}function Sa(e){return e.exposed?e.exposeProxy||(e.exposeProxy=new Proxy(Pl(_d(e.exposed)),{get(n,t){if(t in n)return n[t];if(t in cr)return cr[t](e)},has(n,t){return t in n||t in cr}})):e.proxy}function Wh(e){return re(e)&&"__vccOpts"in e}const ie=(e,n)=>Ed(e,n,gr);function ei(e,n,t){try{oa(-1);const r=arguments.length;return r===2?ye(n)&&!ee(n)?ia(n)?ve(e,null,[n]):ve(e,n):ve(e,null,n):(r>3?t=Array.prototype.slice.call(arguments,2):r===3&&ia(t)&&(t=[t]),ve(e,n,t))}finally{oa(1)}}const Hh="3.5.26";let vo;const Wi=typeof window<"u"&&window.trustedTypes;if(Wi)try{vo=Wi.createPolicy("vue",{createHTML:e=>e})}catch{}const vc=vo?e=>vo.createHTML(e):e=>e,Uh="http://www.w3.org/2000/svg",Yh="http://www.w3.org/1998/Math/MathML",Mn=typeof document<"u"?document:null,Hi=Mn&&Mn.createElement("template"),Bh={insert:(e,n,t)=>{n.insertBefore(e,t||null)},remove:e=>{const n=e.parentNode;n&&n.removeChild(e)},createElement:(e,n,t,r)=>{const a=n==="svg"?Mn.createElementNS(Uh,e):n==="mathml"?Mn.createElementNS(Yh,e):t?Mn.createElement(e,{is:t}):Mn.createElement(e);return e==="select"&&r&&r.multiple!=null&&a.setAttribute("multiple",r.multiple),a},createText:e=>Mn.createTextNode(e),createComment:e=>Mn.createComment(e),setText:(e,n)=>{e.nodeValue=n},setElementText:(e,n)=>{e.textContent=n},parentNode:e=>e.parentNode,nextSibling:e=>e.nextSibling,querySelector:e=>Mn.querySelector(e),setScopeId(e,n){e.setAttribute(n,"")},insertStaticContent(e,n,t,r,a,o){const i=t?t.previousSibling:n.lastChild;if(a&&(a===o||a.nextSibling))for(;n.insertBefore(a.cloneNode(!0),t),!(a===o||!(a=a.nextSibling)););else{Hi.innerHTML=vc(r==="svg"?`<svg>${e}</svg>`:r==="mathml"?`<math>${e}</math>`:e);const s=Hi.content;if(r==="svg"||r==="mathml"){const l=s.firstChild;for(;l.firstChild;)s.appendChild(l.firstChild);s.removeChild(l)}n.insertBefore(s,t)}return[i?i.nextSibling:n.firstChild,t?t.previousSibling:n.lastChild]}},Kn="transition",Gt="animation",yr=Symbol("_vtc"),xc={name:String,type:String,css:{type:Boolean,default:!0},duration:[String,Number,Object],enterFromClass:String,enterActiveClass:String,enterToClass:String,appearFromClass:String,appearActiveClass:String,appearToClass:String,leaveFromClass:String,leaveActiveClass:String,leaveToClass:String},qh=Oe({},Bl,xc),Vh=e=>(e.displayName="Transition",e.props=qh,e),Ft=Vh((e,{slots:n})=>ei(Bd,Kh(e),n)),ht=(e,n=[])=>{ee(e)?e.forEach(t=>t(...n)):e&&e(...n)},Ui=e=>e?ee(e)?e.some(n=>n.length>1):e.length>1:!1;function Kh(e){const n={};for(const $ in e)$ in xc||(n[$]=e[$]);if(e.css===!1)return n;const{name:t="v",type:r,duration:a,enterFromClass:o=`${t}-enter-from`,enterActiveClass:i=`${t}-enter-active`,enterToClass:s=`${t}-enter-to`,appearFromClass:l=o,appearActiveClass:c=i,appearToClass:d=s,leaveFromClass:h=`${t}-leave-from`,leaveActiveClass:f=`${t}-leave-active`,leaveToClass:y=`${t}-leave-to`}=e,k=Gh(a),I=k&&k[0],P=k&&k[1],{onBeforeEnter:v,onEnter:j,onEnterCancelled:N,onLeave:w,onLeaveCancelled:_,onBeforeAppear:S=v,onAppear:C=j,onAppearCancelled:W=N}=n,F=($,Q,ce,$e)=>{$._enterCancelled=$e,ft($,Q?d:s),ft($,Q?c:i),ce&&ce()},q=($,Q)=>{$._isLeaving=!1,ft($,h),ft($,y),ft($,f),Q&&Q()},X=$=>(Q,ce)=>{const $e=$?C:j,fe=()=>F(Q,$,ce);ht($e,[Q,fe]),Yi(()=>{ft(Q,$?l:o),Ln(Q,$?d:s),Ui($e)||Bi(Q,r,I,fe)})};return Oe(n,{onBeforeEnter($){ht(v,[$]),Ln($,o),Ln($,i)},onBeforeAppear($){ht(S,[$]),Ln($,l),Ln($,c)},onEnter:X(!1),onAppear:X(!0),onLeave($,Q){$._isLeaving=!0;const ce=()=>q($,Q);Ln($,h),$._enterCancelled?(Ln($,f),Ki($)):(Ki($),Ln($,f)),Yi(()=>{$._isLeaving&&(ft($,h),Ln($,y),Ui(w)||Bi($,r,P,ce))}),ht(w,[$,ce])},onEnterCancelled($){F($,!1,void 0,!0),ht(N,[$])},onAppearCancelled($){F($,!0,void 0,!0),ht(W,[$])},onLeaveCancelled($){q($),ht(_,[$])}})}function Gh(e){if(e==null)return null;if(ye(e))return[Fa(e.enter),Fa(e.leave)];{const n=Fa(e);return[n,n]}}function Fa(e){return Bu(e)}function Ln(e,n){n.split(/\s+/).forEach(t=>t&&e.classList.add(t)),(e[yr]||(e[yr]=new Set)).add(n)}function ft(e,n){n.split(/\s+/).forEach(r=>r&&e.classList.remove(r));const t=e[yr];t&&(t.delete(n),t.size||(e[yr]=void 0))}function Yi(e){requestAnimationFrame(()=>{requestAnimationFrame(e)})}let Xh=0;function Bi(e,n,t,r){const a=e._endId=++Xh,o=()=>{a===e._endId&&r()};if(t!=null)return setTimeout(o,t);const{type:i,timeout:s,propCount:l}=Jh(e,n);if(!i)return r();const c=i+"end";let d=0;const h=()=>{e.removeEventListener(c,f),o()},f=y=>{y.target===e&&++d>=l&&h()};setTimeout(()=>{d<l&&h()},s+1),e.addEventListener(c,f)}function Jh(e,n){const t=window.getComputedStyle(e),r=k=>(t[k]||"").split(", "),a=r(`${Kn}Delay`),o=r(`${Kn}Duration`),i=qi(a,o),s=r(`${Gt}Delay`),l=r(`${Gt}Duration`),c=qi(s,l);let d=null,h=0,f=0;n===Kn?i>0&&(d=Kn,h=i,f=o.length):n===Gt?c>0&&(d=Gt,h=c,f=l.length):(h=Math.max(i,c),d=h>0?i>c?Kn:Gt:null,f=d?d===Kn?o.length:l.length:0);const y=d===Kn&&/\b(?:transform|all)(?:,|$)/.test(r(`${Kn}Property`).toString());return{type:d,timeout:h,propCount:f,hasTransform:y}}function qi(e,n){for(;e.length<n.length;)e=e.concat(e);return Math.max(...n.map((t,r)=>Vi(t)+Vi(e[r])))}function Vi(e){return e==="auto"?0:Number(e.slice(0,-1).replace(",","."))*1e3}function Ki(e){return(e?e.ownerDocument:document).body.offsetHeight}function Qh(e,n,t){const r=e[yr];r&&(n=(n?[n,...r]:[...r]).join(" ")),n==null?e.removeAttribute("class"):t?e.setAttribute("class",n):e.className=n}const Gi=Symbol("_vod"),Zh=Symbol("_vsh"),ef=Symbol(""),nf=/(?:^|;)\s*display\s*:/;function tf(e,n,t){const r=e.style,a=Ie(t);let o=!1;if(t&&!a){if(n)if(Ie(n))for(const i of n.split(";")){const s=i.slice(0,i.indexOf(":")).trim();t[s]==null&&Gr(r,s,"")}else for(const i in n)t[i]==null&&Gr(r,i,"");for(const i in t)i==="display"&&(o=!0),Gr(r,i,t[i])}else if(a){if(n!==t){const i=r[ef];i&&(t+=";"+i),r.cssText=t,o=nf.test(t)}}else n&&e.removeAttribute("style");Gi in e&&(e[Gi]=o?r.display:"",e[Zh]&&(r.display="none"))}const Xi=/\s*!important$/;function Gr(e,n,t){if(ee(t))t.forEach(r=>Gr(e,n,r));else if(t==null&&(t=""),n.startsWith("--"))e.setProperty(n,t);else{const r=rf(e,n);Xi.test(t)?e.setProperty(kt(r),t.replace(Xi,""),"important"):e[r]=t}}const Ji=["Webkit","Moz","ms"],Wa={};function rf(e,n){const t=Wa[n];if(t)return t;let r=rt(n);if(r!=="filter"&&r in e)return Wa[n]=r;r=dl(r);for(let a=0;a<Ji.length;a++){const o=Ji[a]+r;if(o in e)return Wa[n]=o}return n}const Qi="http://www.w3.org/1999/xlink";function Zi(e,n,t,r,a,o=Ju(n)){r&&n.startsWith("xlink:")?t==null?e.removeAttributeNS(Qi,n.slice(6,n.length)):e.setAttributeNS(Qi,n,t):t==null||o&&!pl(t)?e.removeAttribute(n):e.setAttribute(n,o?"":Tn(t)?String(t):t)}function es(e,n,t,r,a){if(n==="innerHTML"||n==="textContent"){t!=null&&(e[n]=n==="innerHTML"?vc(t):t);return}const o=e.tagName;if(n==="value"&&o!=="PROGRESS"&&!o.includes("-")){const s=o==="OPTION"?e.getAttribute("value")||"":e.value,l=t==null?e.type==="checkbox"?"on":"":String(t);(s!==l||!("_value"in e))&&(e.value=l),t==null&&e.removeAttribute(n),e._value=t;return}let i=!1;if(t===""||t==null){const s=typeof e[n];s==="boolean"?t=pl(t):t==null&&s==="string"?(t="",i=!0):s==="number"&&(t=0,i=!0)}try{e[n]=t}catch{}i&&e.removeAttribute(a||n)}function bc(e,n,t,r){e.addEventListener(n,t,r)}function af(e,n,t,r){e.removeEventListener(n,t,r)}const ns=Symbol("_vei");function of(e,n,t,r,a=null){const o=e[ns]||(e[ns]={}),i=o[n];if(r&&i)i.value=r;else{const[s,l]=sf(n);if(r){const c=o[n]=uf(r,a);bc(e,s,c,l)}else i&&(af(e,s,i,l),o[n]=void 0)}}const ts=/(?:Once|Passive|Capture)$/;function sf(e){let n;if(ts.test(e)){n={};let r;for(;r=e.match(ts);)e=e.slice(0,e.length-r[0].length),n[r[0].toLowerCase()]=!0}return[e[2]===":"?e.slice(3):kt(e.slice(2)),n]}let Ha=0;const lf=Promise.resolve(),cf=()=>Ha||(lf.then(()=>Ha=0),Ha=Date.now());function uf(e,n){const t=r=>{if(!r._vts)r._vts=Date.now();else if(r._vts<=t.attached)return;yn(df(r,t.value),n,5,[r])};return t.value=e,t.attached=cf(),t}function df(e,n){if(ee(n)){const t=e.stopImmediatePropagation;return e.stopImmediatePropagation=()=>{t.call(e),e._stopped=!0},n.map(r=>a=>!a._stopped&&r&&r(a))}else return n}const rs=e=>e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&e.charCodeAt(2)>96&&e.charCodeAt(2)<123,hf=(e,n,t,r,a,o)=>{const i=a==="svg";n==="class"?Qh(e,r,i):n==="style"?tf(e,t,r):ma(n)?Ro(n)||of(e,n,t,r,o):(n[0]==="."?(n=n.slice(1),!0):n[0]==="^"?(n=n.slice(1),!1):ff(e,n,r,i))?(es(e,n,r),!e.tagName.includes("-")&&(n==="value"||n==="checked"||n==="selected")&&Zi(e,n,r,i,o,n!=="value")):e._isVueCE&&(/[A-Z]/.test(n)||!Ie(r))?es(e,rt(n),r,o,n):(n==="true-value"?e._trueValue=r:n==="false-value"&&(e._falseValue=r),Zi(e,n,r,i))};function ff(e,n,t,r){if(r)return!!(n==="innerHTML"||n==="textContent"||n in e&&rs(n)&&re(t));if(n==="spellcheck"||n==="draggable"||n==="translate"||n==="autocorrect"||n==="sandbox"&&e.tagName==="IFRAME"||n==="form"||n==="list"&&e.tagName==="INPUT"||n==="type"&&e.tagName==="TEXTAREA")return!1;if(n==="width"||n==="height"){const a=e.tagName;if(a==="IMG"||a==="VIDEO"||a==="CANVAS"||a==="SOURCE")return!1}return rs(n)&&Ie(t)?!1:n in e}const as=e=>{const n=e.props["onUpdate:modelValue"]||!1;return ee(n)?t=>Br(n,t):n},Ua=Symbol("_assign"),pf={deep:!0,created(e,{value:n,modifiers:{number:t}},r){const a=ga(n);bc(e,"change",()=>{const o=Array.prototype.filter.call(e.options,i=>i.selected).map(i=>t?fl(la(i)):la(i));e[Ua](e.multiple?a?new Set(o):o:o[0]),e._assigning=!0,na(()=>{e._assigning=!1})}),e[Ua]=as(r)},mounted(e,{value:n}){os(e,n)},beforeUpdate(e,n,t){e[Ua]=as(t)},updated(e,{value:n}){e._assigning||os(e,n)}};function os(e,n){const t=e.multiple,r=ee(n);if(!(t&&!r&&!ga(n))){for(let a=0,o=e.options.length;a<o;a++){const i=e.options[a],s=la(i);if(t)if(r){const l=typeof s;l==="string"||l==="number"?i.selected=n.some(c=>String(c)===String(s)):i.selected=Zu(n,s)>-1}else i.selected=n.has(s);else if(ba(la(i),n)){e.selectedIndex!==a&&(e.selectedIndex=a);return}}!t&&e.selectedIndex!==-1&&(e.selectedIndex=-1)}}function la(e){return"_value"in e?e._value:e.value}const mf=["ctrl","shift","alt","meta"],gf={stop:e=>e.stopPropagation(),prevent:e=>e.preventDefault(),self:e=>e.target!==e.currentTarget,ctrl:e=>!e.ctrlKey,shift:e=>!e.shiftKey,alt:e=>!e.altKey,meta:e=>!e.metaKey,left:e=>"button"in e&&e.button!==0,middle:e=>"button"in e&&e.button!==1,right:e=>"button"in e&&e.button!==2,exact:(e,n)=>mf.some(t=>e[`${t}Key`]&&!n.includes(t))},Zn=(e,n)=>{const t=e._withMods||(e._withMods={}),r=n.join(".");return t[r]||(t[r]=((a,...o)=>{for(let i=0;i<n.length;i++){const s=gf[n[i]];if(s&&s(a,n))return}return e(a,...o)}))},yf=Oe({patchProp:hf},Bh);let is;function vf(){return is||(is=jh(yf))}const xf=((...e)=>{const n=vf().createApp(...e),{mount:t}=n;return n.mount=r=>{const a=wf(r);if(!a)return;const o=n._component;!re(o)&&!o.render&&!o.template&&(o.template=a.innerHTML),a.nodeType===1&&(a.textContent="");const i=t(a,!1,bf(a));return a instanceof Element&&(a.removeAttribute("v-cloak"),a.setAttribute("data-v-app","")),i},n});function bf(e){if(e instanceof SVGElement)return"svg";if(typeof MathMLElement=="function"&&e instanceof MathMLElement)return"mathml"}function wf(e){return Ie(e)?document.querySelector(e):e}function _f(e,n){typeof console<"u"&&(console.warn("[intlify] "+e),n&&console.warn(n.stack))}const ca=typeof window<"u",it=(e,n=!1)=>n?Symbol.for(e):Symbol(e),kf=(e,n,t)=>jf({l:e,k:n,s:t}),jf=e=>JSON.stringify(e).replace(/\u2028/g,"\\u2028").replace(/\u2029/g,"\\u2029").replace(/\u0027/g,"\\u0027"),Ce=e=>typeof e=="number"&&isFinite(e),zf=e=>ni(e)==="[object Date]",Wt=e=>ni(e)==="[object RegExp]",Ta=e=>le(e)&&Object.keys(e).length===0,Me=Object.assign,If=Object.create,xe=(e=null)=>If(e);let ss;const yt=()=>ss||(ss=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:xe());function ls(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;").replace(/\//g,"&#x2F;").replace(/=/g,"&#x3D;")}function cs(e){return e.replace(/&(?![a-zA-Z0-9#]{2,6};)/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&apos;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function Sf(e){return e=e.replace(/(\w+)\s*=\s*"([^"]*)"/g,(r,a,o)=>`${a}="${cs(o)}"`),e=e.replace(/(\w+)\s*=\s*'([^']*)'/g,(r,a,o)=>`${a}='${cs(o)}'`),/\s*on\w+\s*=\s*["']?[^"'>]+["']?/gi.test(e)&&(e=e.replace(/(\s+)(on)(\w+\s*=)/gi,"$1&#111;n$3")),[/(\s+(?:href|src|action|formaction)\s*=\s*["']?)\s*javascript:/gi,/(style\s*=\s*["'][^"']*url\s*\(\s*)javascript:/gi].forEach(r=>{e=e.replace(r,"$1javascript&#58;")}),e}const Tf=Object.prototype.hasOwnProperty;function fn(e,n){return Tf.call(e,n)}const ze=Array.isArray,je=e=>typeof e=="function",K=e=>typeof e=="string",de=e=>typeof e=="boolean",he=e=>e!==null&&typeof e=="object",Af=e=>he(e)&&je(e.then)&&je(e.catch),wc=Object.prototype.toString,ni=e=>wc.call(e),le=e=>ni(e)==="[object Object]",Cf=e=>e==null?"":ze(e)||le(e)&&e.toString===wc?JSON.stringify(e,null,2):String(e);function ti(e,n=""){return e.reduce((t,r,a)=>a===0?t+r:t+n+r,"")}const Fr=e=>!he(e)||ze(e);function Xr(e,n){if(Fr(e)||Fr(n))throw new Error("Invalid value");const t=[{src:e,des:n}];for(;t.length;){const{src:r,des:a}=t.pop();Object.keys(r).forEach(o=>{o!=="__proto__"&&(he(r[o])&&!he(a[o])&&(a[o]=Array.isArray(r[o])?[]:xe()),Fr(a[o])||Fr(r[o])?a[o]=r[o]:t.push({src:r[o],des:a[o]}))})}}function Ef(e,n,t){return{line:e,column:n,offset:t}}function xo(e,n,t){return{start:e,end:n}}const me={EXPECTED_TOKEN:1,INVALID_TOKEN_IN_PLACEHOLDER:2,UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER:3,UNKNOWN_ESCAPE_SEQUENCE:4,INVALID_UNICODE_ESCAPE_SEQUENCE:5,UNBALANCED_CLOSING_BRACE:6,UNTERMINATED_CLOSING_BRACE:7,EMPTY_PLACEHOLDER:8,NOT_ALLOW_NEST_PLACEHOLDER:9,INVALID_LINKED_FORMAT:10,MUST_HAVE_MESSAGES_IN_PLURAL:11,UNEXPECTED_EMPTY_LINKED_MODIFIER:12,UNEXPECTED_EMPTY_LINKED_KEY:13,UNEXPECTED_LEXICAL_ANALYSIS:14},Lf=17;function Aa(e,n,t={}){const{domain:r,messages:a,args:o}=t,i=e,s=new SyntaxError(String(i));return s.code=e,n&&(s.location=n),s.domain=r,s}function Pf(e){throw e}const wn=" ",Nf="\r",We=`
`,Mf="\u2028",Of="\u2029";function Rf(e){const n=e;let t=0,r=1,a=1,o=0;const i=C=>n[C]===Nf&&n[C+1]===We,s=C=>n[C]===We,l=C=>n[C]===Of,c=C=>n[C]===Mf,d=C=>i(C)||s(C)||l(C)||c(C),h=()=>t,f=()=>r,y=()=>a,k=()=>o,I=C=>i(C)||l(C)||c(C)?We:n[C],P=()=>I(t),v=()=>I(t+o);function j(){return o=0,d(t)&&(r++,a=0),i(t)&&t++,t++,a++,n[t]}function N(){return i(t+o)&&o++,o++,n[t+o]}function w(){t=0,r=1,a=1,o=0}function _(C=0){o=C}function S(){const C=t+o;for(;C!==t;)j();o=0}return{index:h,line:f,column:y,peekOffset:k,charAt:I,currentChar:P,currentPeek:v,next:j,peek:N,reset:w,resetPeek:_,skipToPeek:S}}const Pn=void 0,$f=".",us="'",Df="tokenizer";function Ff(e,n={}){const t=n.location!==!1,r=Rf(e),a=()=>r.index(),o=()=>Ef(r.line(),r.column(),r.index()),i=o(),s=a(),l={currentType:13,offset:s,startLoc:i,endLoc:i,lastType:13,lastOffset:s,lastStartLoc:i,lastEndLoc:i,braceNest:0,inLinked:!1,text:""},c=()=>l,{onError:d}=n;function h(p,m,T,...E){const V=c();if(m.column+=T,m.offset+=T,d){const D=t?xo(V.startLoc,m):null,A=Aa(p,D,{domain:Df,args:E});d(A)}}function f(p,m,T){p.endLoc=o(),p.currentType=m;const E={type:m};return t&&(E.loc=xo(p.startLoc,p.endLoc)),T!=null&&(E.value=T),E}const y=p=>f(p,13);function k(p,m){return p.currentChar()===m?(p.next(),m):(h(me.EXPECTED_TOKEN,o(),0,m),"")}function I(p){let m="";for(;p.currentPeek()===wn||p.currentPeek()===We;)m+=p.currentPeek(),p.peek();return m}function P(p){const m=I(p);return p.skipToPeek(),m}function v(p){if(p===Pn)return!1;const m=p.charCodeAt(0);return m>=97&&m<=122||m>=65&&m<=90||m===95}function j(p){if(p===Pn)return!1;const m=p.charCodeAt(0);return m>=48&&m<=57}function N(p,m){const{currentType:T}=m;if(T!==2)return!1;I(p);const E=v(p.currentPeek());return p.resetPeek(),E}function w(p,m){const{currentType:T}=m;if(T!==2)return!1;I(p);const E=p.currentPeek()==="-"?p.peek():p.currentPeek(),V=j(E);return p.resetPeek(),V}function _(p,m){const{currentType:T}=m;if(T!==2)return!1;I(p);const E=p.currentPeek()===us;return p.resetPeek(),E}function S(p,m){const{currentType:T}=m;if(T!==7)return!1;I(p);const E=p.currentPeek()===".";return p.resetPeek(),E}function C(p,m){const{currentType:T}=m;if(T!==8)return!1;I(p);const E=v(p.currentPeek());return p.resetPeek(),E}function W(p,m){const{currentType:T}=m;if(!(T===7||T===11))return!1;I(p);const E=p.currentPeek()===":";return p.resetPeek(),E}function F(p,m){const{currentType:T}=m;if(T!==9)return!1;const E=()=>{const D=p.currentPeek();return D==="{"?v(p.peek()):D==="@"||D==="|"||D===":"||D==="."||D===wn||!D?!1:D===We?(p.peek(),E()):X(p,!1)},V=E();return p.resetPeek(),V}function q(p){I(p);const m=p.currentPeek()==="|";return p.resetPeek(),m}function X(p,m=!0){const T=(V=!1,D="")=>{const A=p.currentPeek();return A==="{"||A==="@"||!A?V:A==="|"?!(D===wn||D===We):A===wn?(p.peek(),T(!0,wn)):A===We?(p.peek(),T(!0,We)):!0},E=T();return m&&p.resetPeek(),E}function $(p,m){const T=p.currentChar();return T===Pn?Pn:m(T)?(p.next(),T):null}function Q(p){const m=p.charCodeAt(0);return m>=97&&m<=122||m>=65&&m<=90||m>=48&&m<=57||m===95||m===36}function ce(p){return $(p,Q)}function $e(p){const m=p.charCodeAt(0);return m>=97&&m<=122||m>=65&&m<=90||m>=48&&m<=57||m===95||m===36||m===45}function fe(p){return $(p,$e)}function be(p){const m=p.charCodeAt(0);return m>=48&&m<=57}function pe(p){return $(p,be)}function De(p){const m=p.charCodeAt(0);return m>=48&&m<=57||m>=65&&m<=70||m>=97&&m<=102}function An(p){return $(p,De)}function on(p){let m="",T="";for(;m=pe(p);)T+=m;return T}function Xe(p){let m="";for(;;){const T=p.currentChar();if(T==="{"||T==="}"||T==="@"||T==="|"||!T)break;if(T===wn||T===We)if(X(p))m+=T,p.next();else{if(q(p))break;m+=T,p.next()}else m+=T,p.next()}return m}function zt(p){P(p);let m="",T="";for(;m=fe(p);)T+=m;const E=p.currentChar();if(E&&E!=="}"&&E!==Pn&&E!==wn&&E!==We&&E!=="　"){const V=vn(p);return h(me.INVALID_TOKEN_IN_PLACEHOLDER,o(),0,T+V),T+V}return p.currentChar()===Pn&&h(me.UNTERMINATED_CLOSING_BRACE,o(),0),T}function qt(p){P(p);let m="";return p.currentChar()==="-"?(p.next(),m+=`-${on(p)}`):m+=on(p),p.currentChar()===Pn&&h(me.UNTERMINATED_CLOSING_BRACE,o(),0),m}function Pr(p){return p!==us&&p!==We}function Cn(p){P(p),k(p,"'");let m="",T="";for(;m=$(p,Pr);)m==="\\"?T+=qn(p):T+=m;const E=p.currentChar();return E===We||E===Pn?(h(me.UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER,o(),0),E===We&&(p.next(),k(p,"'")),T):(k(p,"'"),T)}function qn(p){const m=p.currentChar();switch(m){case"\\":case"'":return p.next(),`\\${m}`;case"u":return Vn(p,m,4);case"U":return Vn(p,m,6);default:return h(me.UNKNOWN_ESCAPE_SEQUENCE,o(),0,m),""}}function Vn(p,m,T){k(p,m);let E="";for(let V=0;V<T;V++){const D=An(p);if(!D){h(me.INVALID_UNICODE_ESCAPE_SEQUENCE,o(),0,`\\${m}${E}${p.currentChar()}`);break}E+=D}return`\\${m}${E}`}function It(p){return p!=="{"&&p!=="}"&&p!==wn&&p!==We}function vn(p){P(p);let m="",T="";for(;m=$(p,It);)T+=m;return T}function Nr(p){let m="",T="";for(;m=ce(p);)T+=m;return T}function b(p){const m=T=>{const E=p.currentChar();return E==="{"||E==="@"||E==="|"||E==="("||E===")"||!E||E===wn?T:(T+=E,p.next(),m(T))};return m("")}function z(p){P(p);const m=k(p,"|");return P(p),m}function O(p,m){let T=null;switch(p.currentChar()){case"{":return m.braceNest>=1&&h(me.NOT_ALLOW_NEST_PLACEHOLDER,o(),0),p.next(),T=f(m,2,"{"),P(p),m.braceNest++,T;case"}":return m.braceNest>0&&m.currentType===2&&h(me.EMPTY_PLACEHOLDER,o(),0),p.next(),T=f(m,3,"}"),m.braceNest--,m.braceNest>0&&P(p),m.inLinked&&m.braceNest===0&&(m.inLinked=!1),T;case"@":return m.braceNest>0&&h(me.UNTERMINATED_CLOSING_BRACE,o(),0),T=U(p,m)||y(m),m.braceNest=0,T;default:{let V=!0,D=!0,A=!0;if(q(p))return m.braceNest>0&&h(me.UNTERMINATED_CLOSING_BRACE,o(),0),T=f(m,1,z(p)),m.braceNest=0,m.inLinked=!1,T;if(m.braceNest>0&&(m.currentType===4||m.currentType===5||m.currentType===6))return h(me.UNTERMINATED_CLOSING_BRACE,o(),0),m.braceNest=0,H(p,m);if(V=N(p,m))return T=f(m,4,zt(p)),P(p),T;if(D=w(p,m))return T=f(m,5,qt(p)),P(p),T;if(A=_(p,m))return T=f(m,6,Cn(p)),P(p),T;if(!V&&!D&&!A)return T=f(m,12,vn(p)),h(me.INVALID_TOKEN_IN_PLACEHOLDER,o(),0,T.value),P(p),T;break}}return T}function U(p,m){const{currentType:T}=m;let E=null;const V=p.currentChar();switch((T===7||T===8||T===11||T===9)&&(V===We||V===wn)&&h(me.INVALID_LINKED_FORMAT,o(),0),V){case"@":return p.next(),E=f(m,7,"@"),m.inLinked=!0,E;case".":return P(p),p.next(),f(m,8,".");case":":return P(p),p.next(),f(m,9,":");default:return q(p)?(E=f(m,1,z(p)),m.braceNest=0,m.inLinked=!1,E):S(p,m)||W(p,m)?(P(p),U(p,m)):C(p,m)?(P(p),f(m,11,Nr(p))):F(p,m)?(P(p),V==="{"?O(p,m)||E:f(m,10,b(p))):(T===7&&h(me.INVALID_LINKED_FORMAT,o(),0),m.braceNest=0,m.inLinked=!1,H(p,m))}}function H(p,m){let T={type:13};if(m.braceNest>0)return O(p,m)||y(m);if(m.inLinked)return U(p,m)||y(m);switch(p.currentChar()){case"{":return O(p,m)||y(m);case"}":return h(me.UNBALANCED_CLOSING_BRACE,o(),0),p.next(),f(m,3,"}");case"@":return U(p,m)||y(m);default:{if(q(p))return T=f(m,1,z(p)),m.braceNest=0,m.inLinked=!1,T;if(X(p))return f(m,0,Xe(p));break}}return T}function Y(){const{currentType:p,offset:m,startLoc:T,endLoc:E}=l;return l.lastType=p,l.lastOffset=m,l.lastStartLoc=T,l.lastEndLoc=E,l.offset=a(),l.startLoc=o(),r.currentChar()===Pn?f(l,13):H(r,l)}return{nextToken:Y,currentOffset:a,currentPosition:o,context:c}}const Wf="parser",Hf=/(?:\\\\|\\'|\\u([0-9a-fA-F]{4})|\\U([0-9a-fA-F]{6}))/g;function Uf(e,n,t){switch(e){case"\\\\":return"\\";case"\\'":return"'";default:{const r=parseInt(n||t,16);return r<=55295||r>=57344?String.fromCodePoint(r):"�"}}}function Yf(e={}){const n=e.location!==!1,{onError:t}=e;function r(v,j,N,w,..._){const S=v.currentPosition();if(S.offset+=w,S.column+=w,t){const C=n?xo(N,S):null,W=Aa(j,C,{domain:Wf,args:_});t(W)}}function a(v,j,N){const w={type:v};return n&&(w.start=j,w.end=j,w.loc={start:N,end:N}),w}function o(v,j,N,w){n&&(v.end=j,v.loc&&(v.loc.end=N))}function i(v,j){const N=v.context(),w=a(3,N.offset,N.startLoc);return w.value=j,o(w,v.currentOffset(),v.currentPosition()),w}function s(v,j){const N=v.context(),{lastOffset:w,lastStartLoc:_}=N,S=a(5,w,_);return S.index=parseInt(j,10),v.nextToken(),o(S,v.currentOffset(),v.currentPosition()),S}function l(v,j){const N=v.context(),{lastOffset:w,lastStartLoc:_}=N,S=a(4,w,_);return S.key=j,v.nextToken(),o(S,v.currentOffset(),v.currentPosition()),S}function c(v,j){const N=v.context(),{lastOffset:w,lastStartLoc:_}=N,S=a(9,w,_);return S.value=j.replace(Hf,Uf),v.nextToken(),o(S,v.currentOffset(),v.currentPosition()),S}function d(v){const j=v.nextToken(),N=v.context(),{lastOffset:w,lastStartLoc:_}=N,S=a(8,w,_);return j.type!==11?(r(v,me.UNEXPECTED_EMPTY_LINKED_MODIFIER,N.lastStartLoc,0),S.value="",o(S,w,_),{nextConsumeToken:j,node:S}):(j.value==null&&r(v,me.UNEXPECTED_LEXICAL_ANALYSIS,N.lastStartLoc,0,_n(j)),S.value=j.value||"",o(S,v.currentOffset(),v.currentPosition()),{node:S})}function h(v,j){const N=v.context(),w=a(7,N.offset,N.startLoc);return w.value=j,o(w,v.currentOffset(),v.currentPosition()),w}function f(v){const j=v.context(),N=a(6,j.offset,j.startLoc);let w=v.nextToken();if(w.type===8){const _=d(v);N.modifier=_.node,w=_.nextConsumeToken||v.nextToken()}switch(w.type!==9&&r(v,me.UNEXPECTED_LEXICAL_ANALYSIS,j.lastStartLoc,0,_n(w)),w=v.nextToken(),w.type===2&&(w=v.nextToken()),w.type){case 10:w.value==null&&r(v,me.UNEXPECTED_LEXICAL_ANALYSIS,j.lastStartLoc,0,_n(w)),N.key=h(v,w.value||"");break;case 4:w.value==null&&r(v,me.UNEXPECTED_LEXICAL_ANALYSIS,j.lastStartLoc,0,_n(w)),N.key=l(v,w.value||"");break;case 5:w.value==null&&r(v,me.UNEXPECTED_LEXICAL_ANALYSIS,j.lastStartLoc,0,_n(w)),N.key=s(v,w.value||"");break;case 6:w.value==null&&r(v,me.UNEXPECTED_LEXICAL_ANALYSIS,j.lastStartLoc,0,_n(w)),N.key=c(v,w.value||"");break;default:{r(v,me.UNEXPECTED_EMPTY_LINKED_KEY,j.lastStartLoc,0);const _=v.context(),S=a(7,_.offset,_.startLoc);return S.value="",o(S,_.offset,_.startLoc),N.key=S,o(N,_.offset,_.startLoc),{nextConsumeToken:w,node:N}}}return o(N,v.currentOffset(),v.currentPosition()),{node:N}}function y(v){const j=v.context(),N=j.currentType===1?v.currentOffset():j.offset,w=j.currentType===1?j.endLoc:j.startLoc,_=a(2,N,w);_.items=[];let S=null;do{const F=S||v.nextToken();switch(S=null,F.type){case 0:F.value==null&&r(v,me.UNEXPECTED_LEXICAL_ANALYSIS,j.lastStartLoc,0,_n(F)),_.items.push(i(v,F.value||""));break;case 5:F.value==null&&r(v,me.UNEXPECTED_LEXICAL_ANALYSIS,j.lastStartLoc,0,_n(F)),_.items.push(s(v,F.value||""));break;case 4:F.value==null&&r(v,me.UNEXPECTED_LEXICAL_ANALYSIS,j.lastStartLoc,0,_n(F)),_.items.push(l(v,F.value||""));break;case 6:F.value==null&&r(v,me.UNEXPECTED_LEXICAL_ANALYSIS,j.lastStartLoc,0,_n(F)),_.items.push(c(v,F.value||""));break;case 7:{const q=f(v);_.items.push(q.node),S=q.nextConsumeToken||null;break}}}while(j.currentType!==13&&j.currentType!==1);const C=j.currentType===1?j.lastOffset:v.currentOffset(),W=j.currentType===1?j.lastEndLoc:v.currentPosition();return o(_,C,W),_}function k(v,j,N,w){const _=v.context();let S=w.items.length===0;const C=a(1,j,N);C.cases=[],C.cases.push(w);do{const W=y(v);S||(S=W.items.length===0),C.cases.push(W)}while(_.currentType!==13);return S&&r(v,me.MUST_HAVE_MESSAGES_IN_PLURAL,N,0),o(C,v.currentOffset(),v.currentPosition()),C}function I(v){const j=v.context(),{offset:N,startLoc:w}=j,_=y(v);return j.currentType===13?_:k(v,N,w,_)}function P(v){const j=Ff(v,Me({},e)),N=j.context(),w=a(0,N.offset,N.startLoc);return n&&w.loc&&(w.loc.source=v),w.body=I(j),e.onCacheKey&&(w.cacheKey=e.onCacheKey(v)),N.currentType!==13&&r(j,me.UNEXPECTED_LEXICAL_ANALYSIS,N.lastStartLoc,0,v[N.offset]||""),o(w,j.currentOffset(),j.currentPosition()),w}return{parse:P}}function _n(e){if(e.type===13)return"EOF";const n=(e.value||"").replace(/\r?\n/gu,"\\n");return n.length>10?n.slice(0,9)+"…":n}function Bf(e,n={}){const t={ast:e,helpers:new Set};return{context:()=>t,helper:o=>(t.helpers.add(o),o)}}function ds(e,n){for(let t=0;t<e.length;t++)ri(e[t],n)}function ri(e,n){switch(e.type){case 1:ds(e.cases,n),n.helper("plural");break;case 2:ds(e.items,n);break;case 6:{ri(e.key,n),n.helper("linked"),n.helper("type");break}case 5:n.helper("interpolate"),n.helper("list");break;case 4:n.helper("interpolate"),n.helper("named");break}}function qf(e,n={}){const t=Bf(e);t.helper("normalize"),e.body&&ri(e.body,t);const r=t.context();e.helpers=Array.from(r.helpers)}function Vf(e){const n=e.body;return n.type===2?hs(n):n.cases.forEach(t=>hs(t)),e}function hs(e){if(e.items.length===1){const n=e.items[0];(n.type===3||n.type===9)&&(e.static=n.value,delete n.value)}else{const n=[];for(let t=0;t<e.items.length;t++){const r=e.items[t];if(!(r.type===3||r.type===9)||r.value==null)break;n.push(r.value)}if(n.length===e.items.length){e.static=ti(n);for(let t=0;t<e.items.length;t++){const r=e.items[t];(r.type===3||r.type===9)&&delete r.value}}}}function Ct(e){switch(e.t=e.type,e.type){case 0:{const n=e;Ct(n.body),n.b=n.body,delete n.body;break}case 1:{const n=e,t=n.cases;for(let r=0;r<t.length;r++)Ct(t[r]);n.c=t,delete n.cases;break}case 2:{const n=e,t=n.items;for(let r=0;r<t.length;r++)Ct(t[r]);n.i=t,delete n.items,n.static&&(n.s=n.static,delete n.static);break}case 3:case 9:case 8:case 7:{const n=e;n.value&&(n.v=n.value,delete n.value);break}case 6:{const n=e;Ct(n.key),n.k=n.key,delete n.key,n.modifier&&(Ct(n.modifier),n.m=n.modifier,delete n.modifier);break}case 5:{const n=e;n.i=n.index,delete n.index;break}case 4:{const n=e;n.k=n.key,delete n.key;break}}delete e.type}function Kf(e,n){const{filename:t,breakLineCode:r,needIndent:a}=n,o=n.location!==!1,i={filename:t,code:"",column:1,line:1,offset:0,map:void 0,breakLineCode:r,needIndent:a,indentLevel:0};o&&e.loc&&(i.source=e.loc.source);const s=()=>i;function l(I,P){i.code+=I}function c(I,P=!0){const v=P?r:"";l(a?v+"  ".repeat(I):v)}function d(I=!0){const P=++i.indentLevel;I&&c(P)}function h(I=!0){const P=--i.indentLevel;I&&c(P)}function f(){c(i.indentLevel)}return{context:s,push:l,indent:d,deindent:h,newline:f,helper:I=>`_${I}`,needIndent:()=>i.needIndent}}function Gf(e,n){const{helper:t}=e;e.push(`${t("linked")}(`),Ht(e,n.key),n.modifier?(e.push(", "),Ht(e,n.modifier),e.push(", _type")):e.push(", undefined, _type"),e.push(")")}function Xf(e,n){const{helper:t,needIndent:r}=e;e.push(`${t("normalize")}([`),e.indent(r());const a=n.items.length;for(let o=0;o<a&&(Ht(e,n.items[o]),o!==a-1);o++)e.push(", ");e.deindent(r()),e.push("])")}function Jf(e,n){const{helper:t,needIndent:r}=e;if(n.cases.length>1){e.push(`${t("plural")}([`),e.indent(r());const a=n.cases.length;for(let o=0;o<a&&(Ht(e,n.cases[o]),o!==a-1);o++)e.push(", ");e.deindent(r()),e.push("])")}}function Qf(e,n){n.body?Ht(e,n.body):e.push("null")}function Ht(e,n){const{helper:t}=e;switch(n.type){case 0:Qf(e,n);break;case 1:Jf(e,n);break;case 2:Xf(e,n);break;case 6:Gf(e,n);break;case 8:e.push(JSON.stringify(n.value),n);break;case 7:e.push(JSON.stringify(n.value),n);break;case 5:e.push(`${t("interpolate")}(${t("list")}(${n.index}))`,n);break;case 4:e.push(`${t("interpolate")}(${t("named")}(${JSON.stringify(n.key)}))`,n);break;case 9:e.push(JSON.stringify(n.value),n);break;case 3:e.push(JSON.stringify(n.value),n);break}}const Zf=(e,n={})=>{const t=K(n.mode)?n.mode:"normal",r=K(n.filename)?n.filename:"message.intl";n.sourceMap;const a=n.breakLineCode!=null?n.breakLineCode:t==="arrow"?";":`
`,o=n.needIndent?n.needIndent:t!=="arrow",i=e.helpers||[],s=Kf(e,{filename:r,breakLineCode:a,needIndent:o});s.push(t==="normal"?"function __msg__ (ctx) {":"(ctx) => {"),s.indent(o),i.length>0&&(s.push(`const { ${ti(i.map(d=>`${d}: _${d}`),", ")} } = ctx`),s.newline()),s.push("return "),Ht(s,e),s.deindent(o),s.push("}"),delete e.helpers;const{code:l,map:c}=s.context();return{ast:e,code:l,map:c?c.toJSON():void 0}};function ep(e,n={}){const t=Me({},n),r=!!t.jit,a=!!t.minify,o=t.optimize==null?!0:t.optimize,s=Yf(t).parse(e);return r?(o&&Vf(s),a&&Ct(s),{ast:s,code:""}):(qf(s,t),Zf(s,t))}function np(){typeof __INTLIFY_PROD_DEVTOOLS__!="boolean"&&(yt().__INTLIFY_PROD_DEVTOOLS__=!1),typeof __INTLIFY_DROP_MESSAGE_COMPILER__!="boolean"&&(yt().__INTLIFY_DROP_MESSAGE_COMPILER__=!1)}function In(e){return he(e)&&ai(e)===0&&(fn(e,"b")||fn(e,"body"))}const _c=["b","body"];function tp(e){return st(e,_c)}const kc=["c","cases"];function rp(e){return st(e,kc,[])}const jc=["s","static"];function ap(e){return st(e,jc)}const zc=["i","items"];function op(e){return st(e,zc,[])}const Ic=["t","type"];function ai(e){return st(e,Ic)}const Sc=["v","value"];function Wr(e,n){const t=st(e,Sc);if(t!=null)return t;throw vr(n)}const Tc=["m","modifier"];function ip(e){return st(e,Tc)}const Ac=["k","key"];function sp(e){const n=st(e,Ac);if(n)return n;throw vr(6)}function st(e,n,t){for(let r=0;r<n.length;r++){const a=n[r];if(fn(e,a)&&e[a]!=null)return e[a]}return t}const Cc=[..._c,...kc,...jc,...zc,...Ac,...Tc,...Sc,...Ic];function vr(e){return new Error(`unhandled node type: ${e}`)}function Ya(e){return t=>lp(t,e)}function lp(e,n){const t=tp(n);if(t==null)throw vr(0);if(ai(t)===1){const o=rp(t);return e.plural(o.reduce((i,s)=>[...i,fs(e,s)],[]))}else return fs(e,t)}function fs(e,n){const t=ap(n);if(t!=null)return e.type==="text"?t:e.normalize([t]);{const r=op(n).reduce((a,o)=>[...a,bo(e,o)],[]);return e.normalize(r)}}function bo(e,n){const t=ai(n);switch(t){case 3:return Wr(n,t);case 9:return Wr(n,t);case 4:{const r=n;if(fn(r,"k")&&r.k)return e.interpolate(e.named(r.k));if(fn(r,"key")&&r.key)return e.interpolate(e.named(r.key));throw vr(t)}case 5:{const r=n;if(fn(r,"i")&&Ce(r.i))return e.interpolate(e.list(r.i));if(fn(r,"index")&&Ce(r.index))return e.interpolate(e.list(r.index));throw vr(t)}case 6:{const r=n,a=ip(r),o=sp(r);return e.linked(bo(e,o),a?bo(e,a):void 0,e.type)}case 7:return Wr(n,t);case 8:return Wr(n,t);default:throw new Error(`unhandled node on format message part: ${t}`)}}const cp=e=>e;let Hr=xe();function up(e,n={}){let t=!1;const r=n.onError||Pf;return n.onError=a=>{t=!0,r(a)},{...ep(e,n),detectError:t}}function dp(e,n){if(!__INTLIFY_DROP_MESSAGE_COMPILER__&&K(e)){de(n.warnHtmlMessage)&&n.warnHtmlMessage;const r=(n.onCacheKey||cp)(e),a=Hr[r];if(a)return a;const{ast:o,detectError:i}=up(e,{...n,location:!1,jit:!0}),s=Ya(o);return i?s:Hr[r]=s}else{const t=e.cacheKey;if(t){const r=Hr[t];return r||(Hr[t]=Ya(e))}else return Ya(e)}}let xr=null;function hp(e){xr=e}function fp(e,n,t){xr&&xr.emit("i18n:init",{timestamp:Date.now(),i18n:e,version:n,meta:t})}const pp=mp("function:translate");function mp(e){return n=>xr&&xr.emit(e,n)}const Dn={INVALID_ARGUMENT:Lf,INVALID_DATE_ARGUMENT:18,INVALID_ISO_DATE_ARGUMENT:19,NOT_SUPPORT_LOCALE_PROMISE_VALUE:21,NOT_SUPPORT_LOCALE_ASYNC_FUNCTION:22,NOT_SUPPORT_LOCALE_TYPE:23},gp=24;function Fn(e){return Aa(e,null,void 0)}function oi(e,n){return n.locale!=null?ps(n.locale):ps(e.locale)}let Ba;function ps(e){if(K(e))return e;if(je(e)){if(e.resolvedOnce&&Ba!=null)return Ba;if(e.constructor.name==="Function"){const n=e();if(Af(n))throw Fn(Dn.NOT_SUPPORT_LOCALE_PROMISE_VALUE);return Ba=n}else throw Fn(Dn.NOT_SUPPORT_LOCALE_ASYNC_FUNCTION)}else throw Fn(Dn.NOT_SUPPORT_LOCALE_TYPE)}function yp(e,n,t){return[...new Set([t,...ze(n)?n:he(n)?Object.keys(n):K(n)?[n]:[t]])]}function Ec(e,n,t){const r=K(t)?t:br,a=e;a.__localeChainCache||(a.__localeChainCache=new Map);let o=a.__localeChainCache.get(r);if(!o){o=[];let i=[t];for(;ze(i);)i=ms(o,i,n);const s=ze(n)||!le(n)?n:n.default?n.default:null;i=K(s)?[s]:s,ze(i)&&ms(o,i,!1),a.__localeChainCache.set(r,o)}return o}function ms(e,n,t){let r=!0;for(let a=0;a<n.length&&de(r);a++){const o=n[a];K(o)&&(r=vp(e,n[a],t))}return r}function vp(e,n,t){let r;const a=n.split("-");do{const o=a.join("-");r=xp(e,o,t),a.splice(-1,1)}while(a.length&&r===!0);return r}function xp(e,n,t){let r=!1;if(!e.includes(n)&&(r=!0,n)){r=n[n.length-1]!=="!";const a=n.replace(/!/g,"");e.push(a),(ze(t)||le(t))&&t[a]&&(r=t[a])}return r}const lt=[];lt[0]={w:[0],i:[3,0],"[":[4],o:[7]};lt[1]={w:[1],".":[2],"[":[4],o:[7]};lt[2]={w:[2],i:[3,0],0:[3,0]};lt[3]={i:[3,0],0:[3,0],w:[1,1],".":[2,1],"[":[4,1],o:[7,1]};lt[4]={"'":[5,0],'"':[6,0],"[":[4,2],"]":[1,3],o:8,l:[4,0]};lt[5]={"'":[4,0],o:8,l:[5,0]};lt[6]={'"':[4,0],o:8,l:[6,0]};const bp=/^\s?(?:true|false|-?[\d.]+|'[^']*'|"[^"]*")\s?$/;function wp(e){return bp.test(e)}function _p(e){const n=e.charCodeAt(0),t=e.charCodeAt(e.length-1);return n===t&&(n===34||n===39)?e.slice(1,-1):e}function kp(e){if(e==null)return"o";switch(e.charCodeAt(0)){case 91:case 93:case 46:case 34:case 39:return e;case 95:case 36:case 45:return"i";case 9:case 10:case 13:case 160:case 65279:case 8232:case 8233:return"w"}return"i"}function jp(e){const n=e.trim();return e.charAt(0)==="0"&&isNaN(parseInt(e))?!1:wp(n)?_p(n):"*"+n}function zp(e){const n=[];let t=-1,r=0,a=0,o,i,s,l,c,d,h;const f=[];f[0]=()=>{i===void 0?i=s:i+=s},f[1]=()=>{i!==void 0&&(n.push(i),i=void 0)},f[2]=()=>{f[0](),a++},f[3]=()=>{if(a>0)a--,r=4,f[0]();else{if(a=0,i===void 0||(i=jp(i),i===!1))return!1;f[1]()}};function y(){const k=e[t+1];if(r===5&&k==="'"||r===6&&k==='"')return t++,s="\\"+k,f[0](),!0}for(;r!==null;)if(t++,o=e[t],!(o==="\\"&&y())){if(l=kp(o),h=lt[r],c=h[l]||h.l||8,c===8||(r=c[0],c[1]!==void 0&&(d=f[c[1]],d&&(s=o,d()===!1))))return;if(r===7)return n}}const gs=new Map;function Ip(e,n){return he(e)?e[n]:null}function Sp(e,n){if(!he(e))return null;let t=gs.get(n);if(t||(t=zp(n),t&&gs.set(n,t)),!t)return null;const r=t.length;let a=e,o=0;for(;o<r;){const i=t[o];if(Cc.includes(i)&&In(a))return null;const s=a[i];if(s===void 0||je(a))return null;a=s,o++}return a}const Tp="11.2.7",Ca=-1,br="en-US",ys="",vs=e=>`${e.charAt(0).toLocaleUpperCase()}${e.substr(1)}`;function Ap(){return{upper:(e,n)=>n==="text"&&K(e)?e.toUpperCase():n==="vnode"&&he(e)&&"__v_isVNode"in e?e.children.toUpperCase():e,lower:(e,n)=>n==="text"&&K(e)?e.toLowerCase():n==="vnode"&&he(e)&&"__v_isVNode"in e?e.children.toLowerCase():e,capitalize:(e,n)=>n==="text"&&K(e)?vs(e):n==="vnode"&&he(e)&&"__v_isVNode"in e?vs(e.children):e}}let Lc;function Cp(e){Lc=e}let Pc;function Ep(e){Pc=e}let Nc;function Lp(e){Nc=e}let Mc=null;const Pp=e=>{Mc=e},Np=()=>Mc;let Oc=null;const xs=e=>{Oc=e},Mp=()=>Oc;let bs=0;function Op(e={}){const n=je(e.onWarn)?e.onWarn:_f,t=K(e.version)?e.version:Tp,r=K(e.locale)||je(e.locale)?e.locale:br,a=je(r)?br:r,o=ze(e.fallbackLocale)||le(e.fallbackLocale)||K(e.fallbackLocale)||e.fallbackLocale===!1?e.fallbackLocale:a,i=le(e.messages)?e.messages:qa(a),s=le(e.datetimeFormats)?e.datetimeFormats:qa(a),l=le(e.numberFormats)?e.numberFormats:qa(a),c=Me(xe(),e.modifiers,Ap()),d=e.pluralRules||xe(),h=je(e.missing)?e.missing:null,f=de(e.missingWarn)||Wt(e.missingWarn)?e.missingWarn:!0,y=de(e.fallbackWarn)||Wt(e.fallbackWarn)?e.fallbackWarn:!0,k=!!e.fallbackFormat,I=!!e.unresolving,P=je(e.postTranslation)?e.postTranslation:null,v=le(e.processor)?e.processor:null,j=de(e.warnHtmlMessage)?e.warnHtmlMessage:!0,N=!!e.escapeParameter,w=je(e.messageCompiler)?e.messageCompiler:Lc,_=je(e.messageResolver)?e.messageResolver:Pc||Ip,S=je(e.localeFallbacker)?e.localeFallbacker:Nc||yp,C=he(e.fallbackContext)?e.fallbackContext:void 0,W=e,F=he(W.__datetimeFormatters)?W.__datetimeFormatters:new Map,q=he(W.__numberFormatters)?W.__numberFormatters:new Map,X=he(W.__meta)?W.__meta:{};bs++;const $={version:t,cid:bs,locale:r,fallbackLocale:o,messages:i,modifiers:c,pluralRules:d,missing:h,missingWarn:f,fallbackWarn:y,fallbackFormat:k,unresolving:I,postTranslation:P,processor:v,warnHtmlMessage:j,escapeParameter:N,messageCompiler:w,messageResolver:_,localeFallbacker:S,fallbackContext:C,onWarn:n,__meta:X};return $.datetimeFormats=s,$.numberFormats=l,$.__datetimeFormatters=F,$.__numberFormatters=q,__INTLIFY_PROD_DEVTOOLS__&&fp($,t,X),$}const qa=e=>({[e]:xe()});function ii(e,n,t,r,a){const{missing:o,onWarn:i}=e;if(o!==null){const s=o(e,t,n,a);return K(s)?s:n}else return n}function Xt(e,n,t){const r=e;r.__localeChainCache=new Map,e.localeFallbacker(e,t,n)}function Rp(e,n){return e===n?!1:e.split("-")[0]===n.split("-")[0]}function $p(e,n){const t=n.indexOf(e);if(t===-1)return!1;for(let r=t+1;r<n.length;r++)if(Rp(e,n[r]))return!0;return!1}function ws(e,...n){const{datetimeFormats:t,unresolving:r,fallbackLocale:a,onWarn:o,localeFallbacker:i}=e,{__datetimeFormatters:s}=e,[l,c,d,h]=wo(...n),f=de(d.missingWarn)?d.missingWarn:e.missingWarn;de(d.fallbackWarn)?d.fallbackWarn:e.fallbackWarn;const y=!!d.part,k=oi(e,d),I=i(e,a,k);if(!K(l)||l==="")return new Intl.DateTimeFormat(k,h).format(c);let P={},v,j=null;const N="datetime format";for(let S=0;S<I.length&&(v=I[S],P=t[v]||{},j=P[l],!le(j));S++)ii(e,l,v,f,N);if(!le(j)||!K(v))return r?Ca:l;let w=`${v}__${l}`;Ta(h)||(w=`${w}__${JSON.stringify(h)}`);let _=s.get(w);return _||(_=new Intl.DateTimeFormat(v,Me({},j,h)),s.set(w,_)),y?_.formatToParts(c):_.format(c)}const Rc=["localeMatcher","weekday","era","year","month","day","hour","minute","second","timeZoneName","formatMatcher","hour12","timeZone","dateStyle","timeStyle","calendar","dayPeriod","numberingSystem","hourCycle","fractionalSecondDigits"];function wo(...e){const[n,t,r,a]=e,o=xe();let i=xe(),s;if(K(n)){const l=n.match(/(\d{4}-\d{2}-\d{2})(T|\s)?(.*)/);if(!l)throw Fn(Dn.INVALID_ISO_DATE_ARGUMENT);const c=l[3]?l[3].trim().startsWith("T")?`${l[1].trim()}${l[3].trim()}`:`${l[1].trim()}T${l[3].trim()}`:l[1].trim();s=new Date(c);try{s.toISOString()}catch{throw Fn(Dn.INVALID_ISO_DATE_ARGUMENT)}}else if(zf(n)){if(isNaN(n.getTime()))throw Fn(Dn.INVALID_DATE_ARGUMENT);s=n}else if(Ce(n))s=n;else throw Fn(Dn.INVALID_ARGUMENT);return K(t)?o.key=t:le(t)&&Object.keys(t).forEach(l=>{Rc.includes(l)?i[l]=t[l]:o[l]=t[l]}),K(r)?o.locale=r:le(r)&&(i=r),le(a)&&(i=a),[o.key||"",s,o,i]}function _s(e,n,t){const r=e;for(const a in t){const o=`${n}__${a}`;r.__datetimeFormatters.has(o)&&r.__datetimeFormatters.delete(o)}}function ks(e,...n){const{numberFormats:t,unresolving:r,fallbackLocale:a,onWarn:o,localeFallbacker:i}=e,{__numberFormatters:s}=e,[l,c,d,h]=_o(...n),f=de(d.missingWarn)?d.missingWarn:e.missingWarn;de(d.fallbackWarn)?d.fallbackWarn:e.fallbackWarn;const y=!!d.part,k=oi(e,d),I=i(e,a,k);if(!K(l)||l==="")return new Intl.NumberFormat(k,h).format(c);let P={},v,j=null;const N="number format";for(let S=0;S<I.length&&(v=I[S],P=t[v]||{},j=P[l],!le(j));S++)ii(e,l,v,f,N);if(!le(j)||!K(v))return r?Ca:l;let w=`${v}__${l}`;Ta(h)||(w=`${w}__${JSON.stringify(h)}`);let _=s.get(w);return _||(_=new Intl.NumberFormat(v,Me({},j,h)),s.set(w,_)),y?_.formatToParts(c):_.format(c)}const $c=["localeMatcher","style","currency","currencyDisplay","currencySign","useGrouping","minimumIntegerDigits","minimumFractionDigits","maximumFractionDigits","minimumSignificantDigits","maximumSignificantDigits","compactDisplay","notation","signDisplay","unit","unitDisplay","roundingMode","roundingPriority","roundingIncrement","trailingZeroDisplay"];function _o(...e){const[n,t,r,a]=e,o=xe();let i=xe();if(!Ce(n))throw Fn(Dn.INVALID_ARGUMENT);const s=n;return K(t)?o.key=t:le(t)&&Object.keys(t).forEach(l=>{$c.includes(l)?i[l]=t[l]:o[l]=t[l]}),K(r)?o.locale=r:le(r)&&(i=r),le(a)&&(i=a),[o.key||"",s,o,i]}function js(e,n,t){const r=e;for(const a in t){const o=`${n}__${a}`;r.__numberFormatters.has(o)&&r.__numberFormatters.delete(o)}}const Dp=e=>e,Fp=e=>"",Wp="text",Hp=e=>e.length===0?"":ti(e),Up=Cf;function zs(e,n){return e=Math.abs(e),n===2?e?e>1?1:0:1:e?Math.min(e,2):0}function Yp(e){const n=Ce(e.pluralIndex)?e.pluralIndex:-1;return e.named&&(Ce(e.named.count)||Ce(e.named.n))?Ce(e.named.count)?e.named.count:Ce(e.named.n)?e.named.n:n:n}function Bp(e,n){n.count||(n.count=e),n.n||(n.n=e)}function qp(e={}){const n=e.locale,t=Yp(e),r=he(e.pluralRules)&&K(n)&&je(e.pluralRules[n])?e.pluralRules[n]:zs,a=he(e.pluralRules)&&K(n)&&je(e.pluralRules[n])?zs:void 0,o=v=>v[r(t,v.length,a)],i=e.list||[],s=v=>i[v],l=e.named||xe();Ce(e.pluralIndex)&&Bp(t,l);const c=v=>l[v];function d(v,j){const N=je(e.messages)?e.messages(v,!!j):he(e.messages)?e.messages[v]:!1;return N||(e.parent?e.parent.message(v):Fp)}const h=v=>e.modifiers?e.modifiers[v]:Dp,f=le(e.processor)&&je(e.processor.normalize)?e.processor.normalize:Hp,y=le(e.processor)&&je(e.processor.interpolate)?e.processor.interpolate:Up,k=le(e.processor)&&K(e.processor.type)?e.processor.type:Wp,P={list:s,named:c,plural:o,linked:(v,...j)=>{const[N,w]=j;let _="text",S="";j.length===1?he(N)?(S=N.modifier||S,_=N.type||_):K(N)&&(S=N||S):j.length===2&&(K(N)&&(S=N||S),K(w)&&(_=w||_));const C=d(v,!0)(P),W=_==="vnode"&&ze(C)&&S?C[0]:C;return S?h(S)(W,_):W},message:d,type:k,interpolate:y,normalize:f,values:Me(xe(),i,l)};return P}const Is=()=>"",cn=e=>je(e);function Ss(e,...n){const{fallbackFormat:t,postTranslation:r,unresolving:a,messageCompiler:o,fallbackLocale:i,messages:s}=e,[l,c]=ko(...n),d=de(c.missingWarn)?c.missingWarn:e.missingWarn,h=de(c.fallbackWarn)?c.fallbackWarn:e.fallbackWarn,f=de(c.escapeParameter)?c.escapeParameter:e.escapeParameter,y=!!c.resolvedMessage,k=K(c.default)||de(c.default)?de(c.default)?o?l:()=>l:c.default:t?o?l:()=>l:null,I=t||k!=null&&(K(k)||je(k)),P=oi(e,c);f&&Vp(c);let[v,j,N]=y?[l,P,s[P]||xe()]:Dc(e,l,P,i,h,d),w=v,_=l;if(!y&&!(K(w)||In(w)||cn(w))&&I&&(w=k,_=w),!y&&(!(K(w)||In(w)||cn(w))||!K(j)))return a?Ca:l;let S=!1;const C=()=>{S=!0},W=cn(w)?w:Fc(e,l,j,w,_,C);if(S)return w;const F=Xp(e,j,N,c),q=qp(F),X=Kp(e,W,q);let $=r?r(X,l):X;if(f&&K($)&&($=Sf($)),__INTLIFY_PROD_DEVTOOLS__){const Q={timestamp:Date.now(),key:K(l)?l:cn(w)?w.key:"",locale:j||(cn(w)?w.locale:""),format:K(w)?w:cn(w)?w.source:"",message:$};Q.meta=Me({},e.__meta,Np()||{}),pp(Q)}return $}function Vp(e){ze(e.list)?e.list=e.list.map(n=>K(n)?ls(n):n):he(e.named)&&Object.keys(e.named).forEach(n=>{K(e.named[n])&&(e.named[n]=ls(e.named[n]))})}function Dc(e,n,t,r,a,o){const{messages:i,onWarn:s,messageResolver:l,localeFallbacker:c}=e,d=c(e,r,t);let h=xe(),f,y=null;const k="translate";for(let I=0;I<d.length&&(f=d[I],h=i[f]||xe(),(y=l(h,n))===null&&(y=h[n]),!(K(y)||In(y)||cn(y)));I++)if(!$p(f,d)){const P=ii(e,n,f,o,k);P!==n&&(y=P)}return[y,f,h]}function Fc(e,n,t,r,a,o){const{messageCompiler:i,warnHtmlMessage:s}=e;if(cn(r)){const c=r;return c.locale=c.locale||t,c.key=c.key||n,c}if(i==null){const c=(()=>r);return c.locale=t,c.key=n,c}const l=i(r,Gp(e,t,a,r,s,o));return l.locale=t,l.key=n,l.source=r,l}function Kp(e,n,t){return n(t)}function ko(...e){const[n,t,r]=e,a=xe();if(!K(n)&&!Ce(n)&&!cn(n)&&!In(n))throw Fn(Dn.INVALID_ARGUMENT);const o=Ce(n)?String(n):(cn(n),n);return Ce(t)?a.plural=t:K(t)?a.default=t:le(t)&&!Ta(t)?a.named=t:ze(t)&&(a.list=t),Ce(r)?a.plural=r:K(r)?a.default=r:le(r)&&Me(a,r),[o,a]}function Gp(e,n,t,r,a,o){return{locale:n,key:t,warnHtmlMessage:a,onError:i=>{throw o&&o(i),i},onCacheKey:i=>kf(n,t,i)}}function Xp(e,n,t,r){const{modifiers:a,pluralRules:o,messageResolver:i,fallbackLocale:s,fallbackWarn:l,missingWarn:c,fallbackContext:d}=e,f={locale:n,modifiers:a,pluralRules:o,messages:(y,k)=>{let I=i(t,y);if(I==null&&(d||k)){const[,,P]=Dc(d||e,y,n,s,l,c);I=i(P,y)}if(K(I)||In(I)){let P=!1;const j=Fc(e,y,n,I,y,()=>{P=!0});return P?Is:j}else return cn(I)?I:Is}};return e.processor&&(f.processor=e.processor),r.list&&(f.list=r.list),r.named&&(f.named=r.named),Ce(r.plural)&&(f.pluralIndex=r.plural),f}np();const Jp="11.2.7";function Qp(){typeof __VUE_I18N_FULL_INSTALL__!="boolean"&&(yt().__VUE_I18N_FULL_INSTALL__=!0),typeof __VUE_I18N_LEGACY_API__!="boolean"&&(yt().__VUE_I18N_LEGACY_API__=!0),typeof __INTLIFY_DROP_MESSAGE_COMPILER__!="boolean"&&(yt().__INTLIFY_DROP_MESSAGE_COMPILER__=!1),typeof __INTLIFY_PROD_DEVTOOLS__!="boolean"&&(yt().__INTLIFY_PROD_DEVTOOLS__=!1)}const Ze={UNEXPECTED_RETURN_TYPE:gp,INVALID_ARGUMENT:25,MUST_BE_CALL_SETUP_TOP:26,NOT_INSTALLED:27,REQUIRED_VALUE:28,INVALID_VALUE:29,NOT_INSTALLED_WITH_PROVIDE:31,UNEXPECTED_ERROR:32};function an(e,...n){return Aa(e,null,void 0)}const jo=it("__translateVNode"),zo=it("__datetimeParts"),Io=it("__numberParts"),Wc=it("__setPluralRules"),Hc=it("__injectWithOption"),So=it("__dispose");function wr(e){if(!he(e)||In(e))return e;for(const n in e)if(fn(e,n))if(!n.includes("."))he(e[n])&&wr(e[n]);else{const t=n.split("."),r=t.length-1;let a=e,o=!1;for(let i=0;i<r;i++){if(t[i]==="__proto__")throw new Error(`unsafe key: ${t[i]}`);if(t[i]in a||(a[t[i]]=xe()),!he(a[t[i]])){o=!0;break}a=a[t[i]]}if(o||(In(a)?Cc.includes(t[r])||delete e[n]:(a[t[r]]=e[n],delete e[n])),!In(a)){const i=a[t[r]];he(i)&&wr(i)}}return e}function si(e,n){const{messages:t,__i18n:r,messageResolver:a,flatJson:o}=n,i=le(t)?t:ze(r)?xe():{[e]:xe()};if(ze(r)&&r.forEach(s=>{if("locale"in s&&"resource"in s){const{locale:l,resource:c}=s;l?(i[l]=i[l]||xe(),Xr(c,i[l])):Xr(c,i)}else K(s)&&Xr(JSON.parse(s),i)}),a==null&&o)for(const s in i)fn(i,s)&&wr(i[s]);return i}function Uc(e){return e.type}function Yc(e,n,t){let r=he(n.messages)?n.messages:xe();"__i18nGlobal"in t&&(r=si(e.locale.value,{messages:r,__i18n:t.__i18nGlobal}));const a=Object.keys(r);a.length&&a.forEach(o=>{e.mergeLocaleMessage(o,r[o])});{if(he(n.datetimeFormats)){const o=Object.keys(n.datetimeFormats);o.length&&o.forEach(i=>{e.mergeDateTimeFormat(i,n.datetimeFormats[i])})}if(he(n.numberFormats)){const o=Object.keys(n.numberFormats);o.length&&o.forEach(i=>{e.mergeNumberFormat(i,n.numberFormats[i])})}}}function Ts(e){return ve(Er,null,e,0)}function _r(){return Zo()}const As="__INTLIFY_META__",Cs=()=>[],Zp=()=>!1;let Es=0;function Ls(e){return((n,t,r,a)=>e(t,r,_r()||void 0,a))}const em=()=>{const e=_r();let n=null;return e&&(n=Uc(e)[As])?{[As]:n}:null};function li(e={}){const{__root:n,__injectWithOption:t}=e,r=n===void 0,a=e.flatJson,o=ca?B:kd;let i=de(e.inheritLocale)?e.inheritLocale:!0;const s=o(n&&i?n.locale.value:K(e.locale)?e.locale:br),l=o(n&&i?n.fallbackLocale.value:K(e.fallbackLocale)||ze(e.fallbackLocale)||le(e.fallbackLocale)||e.fallbackLocale===!1?e.fallbackLocale:s.value),c=o(si(s.value,e)),d=o(le(e.datetimeFormats)?e.datetimeFormats:{[s.value]:{}}),h=o(le(e.numberFormats)?e.numberFormats:{[s.value]:{}});let f=n?n.missingWarn:de(e.missingWarn)||Wt(e.missingWarn)?e.missingWarn:!0,y=n?n.fallbackWarn:de(e.fallbackWarn)||Wt(e.fallbackWarn)?e.fallbackWarn:!0,k=n?n.fallbackRoot:de(e.fallbackRoot)?e.fallbackRoot:!0,I=!!e.fallbackFormat,P=je(e.missing)?e.missing:null,v=je(e.missing)?Ls(e.missing):null,j=je(e.postTranslation)?e.postTranslation:null,N=n?n.warnHtmlMessage:de(e.warnHtmlMessage)?e.warnHtmlMessage:!0,w=!!e.escapeParameter;const _=n?n.modifiers:le(e.modifiers)?e.modifiers:{};let S=e.pluralRules||n&&n.pluralRules,C;C=(()=>{r&&xs(null);const A={version:Jp,locale:s.value,fallbackLocale:l.value,messages:c.value,modifiers:_,pluralRules:S,missing:v===null?void 0:v,missingWarn:f,fallbackWarn:y,fallbackFormat:I,unresolving:!0,postTranslation:j===null?void 0:j,warnHtmlMessage:N,escapeParameter:w,messageResolver:e.messageResolver,messageCompiler:e.messageCompiler,__meta:{framework:"vue"}};A.datetimeFormats=d.value,A.numberFormats=h.value,A.__datetimeFormatters=le(C)?C.__datetimeFormatters:void 0,A.__numberFormatters=le(C)?C.__numberFormatters:void 0;const M=Op(A);return r&&xs(M),M})(),Xt(C,s.value,l.value);function F(){return[s.value,l.value,c.value,d.value,h.value]}const q=ie({get:()=>s.value,set:A=>{C.locale=A,s.value=A}}),X=ie({get:()=>l.value,set:A=>{C.fallbackLocale=A,l.value=A,Xt(C,s.value,A)}}),$=ie(()=>c.value),Q=ie(()=>d.value),ce=ie(()=>h.value);function $e(){return je(j)?j:null}function fe(A){j=A,C.postTranslation=A}function be(){return P}function pe(A){A!==null&&(v=Ls(A)),P=A,C.missing=v}const De=(A,M,G,ne,se,Pe)=>{F();let Se;try{__INTLIFY_PROD_DEVTOOLS__,r||(C.fallbackContext=n?Mp():void 0),Se=A(C)}finally{__INTLIFY_PROD_DEVTOOLS__,r||(C.fallbackContext=void 0)}if(G!=="translate exists"&&Ce(Se)&&Se===Ca||G==="translate exists"&&!Se){const[sn,hn]=M();return n&&k?ne(n):se(sn)}else{if(Pe(Se))return Se;throw an(Ze.UNEXPECTED_RETURN_TYPE)}};function An(...A){return De(M=>Reflect.apply(Ss,null,[M,...A]),()=>ko(...A),"translate",M=>Reflect.apply(M.t,M,[...A]),M=>M,M=>K(M))}function on(...A){const[M,G,ne]=A;if(ne&&!he(ne))throw an(Ze.INVALID_ARGUMENT);return An(M,G,Me({resolvedMessage:!0},ne||{}))}function Xe(...A){return De(M=>Reflect.apply(ws,null,[M,...A]),()=>wo(...A),"datetime format",M=>Reflect.apply(M.d,M,[...A]),()=>ys,M=>K(M)||ze(M))}function zt(...A){return De(M=>Reflect.apply(ks,null,[M,...A]),()=>_o(...A),"number format",M=>Reflect.apply(M.n,M,[...A]),()=>ys,M=>K(M)||ze(M))}function qt(A){return A.map(M=>K(M)||Ce(M)||de(M)?Ts(String(M)):M)}const Cn={normalize:qt,interpolate:A=>A,type:"vnode"};function qn(...A){return De(M=>{let G;const ne=M;try{ne.processor=Cn,G=Reflect.apply(Ss,null,[ne,...A])}finally{ne.processor=null}return G},()=>ko(...A),"translate",M=>M[jo](...A),M=>[Ts(M)],M=>ze(M))}function Vn(...A){return De(M=>Reflect.apply(ks,null,[M,...A]),()=>_o(...A),"number format",M=>M[Io](...A),Cs,M=>K(M)||ze(M))}function It(...A){return De(M=>Reflect.apply(ws,null,[M,...A]),()=>wo(...A),"datetime format",M=>M[zo](...A),Cs,M=>K(M)||ze(M))}function vn(A){S=A,C.pluralRules=S}function Nr(A,M){return De(()=>{if(!A)return!1;const G=K(M)?M:s.value,ne=O(G),se=C.messageResolver(ne,A);return In(se)||cn(se)||K(se)},()=>[A],"translate exists",G=>Reflect.apply(G.te,G,[A,M]),Zp,G=>de(G))}function b(A){let M=null;const G=Ec(C,l.value,s.value);for(let ne=0;ne<G.length;ne++){const se=c.value[G[ne]]||{},Pe=C.messageResolver(se,A);if(Pe!=null){M=Pe;break}}return M}function z(A){const M=b(A);return M??(n?n.tm(A)||{}:{})}function O(A){return c.value[A]||{}}function U(A,M){if(a){const G={[A]:M};for(const ne in G)fn(G,ne)&&wr(G[ne]);M=G[A]}c.value[A]=M,C.messages=c.value}function H(A,M){c.value[A]=c.value[A]||{};const G={[A]:M};if(a)for(const ne in G)fn(G,ne)&&wr(G[ne]);M=G[A],Xr(M,c.value[A]),C.messages=c.value}function Y(A){return d.value[A]||{}}function p(A,M){d.value[A]=M,C.datetimeFormats=d.value,_s(C,A,M)}function m(A,M){d.value[A]=Me(d.value[A]||{},M),C.datetimeFormats=d.value,_s(C,A,M)}function T(A){return h.value[A]||{}}function E(A,M){h.value[A]=M,C.numberFormats=h.value,js(C,A,M)}function V(A,M){h.value[A]=Me(h.value[A]||{},M),C.numberFormats=h.value,js(C,A,M)}Es++,n&&ca&&(dn(n.locale,A=>{i&&(s.value=A,C.locale=A,Xt(C,s.value,l.value))}),dn(n.fallbackLocale,A=>{i&&(l.value=A,C.fallbackLocale=A,Xt(C,s.value,l.value))}));const D={id:Es,locale:q,fallbackLocale:X,get inheritLocale(){return i},set inheritLocale(A){i=A,A&&n&&(s.value=n.locale.value,l.value=n.fallbackLocale.value,Xt(C,s.value,l.value))},get availableLocales(){return Object.keys(c.value).sort()},messages:$,get modifiers(){return _},get pluralRules(){return S||{}},get isGlobal(){return r},get missingWarn(){return f},set missingWarn(A){f=A,C.missingWarn=f},get fallbackWarn(){return y},set fallbackWarn(A){y=A,C.fallbackWarn=y},get fallbackRoot(){return k},set fallbackRoot(A){k=A},get fallbackFormat(){return I},set fallbackFormat(A){I=A,C.fallbackFormat=I},get warnHtmlMessage(){return N},set warnHtmlMessage(A){N=A,C.warnHtmlMessage=A},get escapeParameter(){return w},set escapeParameter(A){w=A,C.escapeParameter=A},t:An,getLocaleMessage:O,setLocaleMessage:U,mergeLocaleMessage:H,getPostTranslationHandler:$e,setPostTranslationHandler:fe,getMissingHandler:be,setMissingHandler:pe,[Wc]:vn};return D.datetimeFormats=Q,D.numberFormats=ce,D.rt=on,D.te=Nr,D.tm=z,D.d=Xe,D.n=zt,D.getDateTimeFormat=Y,D.setDateTimeFormat=p,D.mergeDateTimeFormat=m,D.getNumberFormat=T,D.setNumberFormat=E,D.mergeNumberFormat=V,D[Hc]=t,D[jo]=qn,D[zo]=It,D[Io]=Vn,D}function nm(e){const n=K(e.locale)?e.locale:br,t=K(e.fallbackLocale)||ze(e.fallbackLocale)||le(e.fallbackLocale)||e.fallbackLocale===!1?e.fallbackLocale:n,r=je(e.missing)?e.missing:void 0,a=de(e.silentTranslationWarn)||Wt(e.silentTranslationWarn)?!e.silentTranslationWarn:!0,o=de(e.silentFallbackWarn)||Wt(e.silentFallbackWarn)?!e.silentFallbackWarn:!0,i=de(e.fallbackRoot)?e.fallbackRoot:!0,s=!!e.formatFallbackMessages,l=le(e.modifiers)?e.modifiers:{},c=e.pluralizationRules,d=je(e.postTranslation)?e.postTranslation:void 0,h=K(e.warnHtmlInMessage)?e.warnHtmlInMessage!=="off":!0,f=!!e.escapeParameterHtml,y=de(e.sync)?e.sync:!0;let k=e.messages;if(le(e.sharedMessages)){const _=e.sharedMessages;k=Object.keys(_).reduce((C,W)=>{const F=C[W]||(C[W]={});return Me(F,_[W]),C},k||{})}const{__i18n:I,__root:P,__injectWithOption:v}=e,j=e.datetimeFormats,N=e.numberFormats,w=e.flatJson;return{locale:n,fallbackLocale:t,messages:k,flatJson:w,datetimeFormats:j,numberFormats:N,missing:r,missingWarn:a,fallbackWarn:o,fallbackRoot:i,fallbackFormat:s,modifiers:l,pluralRules:c,postTranslation:d,warnHtmlMessage:h,escapeParameter:f,messageResolver:e.messageResolver,inheritLocale:y,__i18n:I,__root:P,__injectWithOption:v}}function To(e={}){const n=li(nm(e)),{__extender:t}=e,r={id:n.id,get locale(){return n.locale.value},set locale(a){n.locale.value=a},get fallbackLocale(){return n.fallbackLocale.value},set fallbackLocale(a){n.fallbackLocale.value=a},get messages(){return n.messages.value},get datetimeFormats(){return n.datetimeFormats.value},get numberFormats(){return n.numberFormats.value},get availableLocales(){return n.availableLocales},get missing(){return n.getMissingHandler()},set missing(a){n.setMissingHandler(a)},get silentTranslationWarn(){return de(n.missingWarn)?!n.missingWarn:n.missingWarn},set silentTranslationWarn(a){n.missingWarn=de(a)?!a:a},get silentFallbackWarn(){return de(n.fallbackWarn)?!n.fallbackWarn:n.fallbackWarn},set silentFallbackWarn(a){n.fallbackWarn=de(a)?!a:a},get modifiers(){return n.modifiers},get formatFallbackMessages(){return n.fallbackFormat},set formatFallbackMessages(a){n.fallbackFormat=a},get postTranslation(){return n.getPostTranslationHandler()},set postTranslation(a){n.setPostTranslationHandler(a)},get sync(){return n.inheritLocale},set sync(a){n.inheritLocale=a},get warnHtmlInMessage(){return n.warnHtmlMessage?"warn":"off"},set warnHtmlInMessage(a){n.warnHtmlMessage=a!=="off"},get escapeParameterHtml(){return n.escapeParameter},set escapeParameterHtml(a){n.escapeParameter=a},get pluralizationRules(){return n.pluralRules||{}},__composer:n,t(...a){return Reflect.apply(n.t,n,[...a])},rt(...a){return Reflect.apply(n.rt,n,[...a])},te(a,o){return n.te(a,o)},tm(a){return n.tm(a)},getLocaleMessage(a){return n.getLocaleMessage(a)},setLocaleMessage(a,o){n.setLocaleMessage(a,o)},mergeLocaleMessage(a,o){n.mergeLocaleMessage(a,o)},d(...a){return Reflect.apply(n.d,n,[...a])},getDateTimeFormat(a){return n.getDateTimeFormat(a)},setDateTimeFormat(a,o){n.setDateTimeFormat(a,o)},mergeDateTimeFormat(a,o){n.mergeDateTimeFormat(a,o)},n(...a){return Reflect.apply(n.n,n,[...a])},getNumberFormat(a){return n.getNumberFormat(a)},setNumberFormat(a,o){n.setNumberFormat(a,o)},mergeNumberFormat(a,o){n.mergeNumberFormat(a,o)}};return r.__extender=t,r}function tm(e,n,t){return{beforeCreate(){const r=_r();if(!r)throw an(Ze.UNEXPECTED_ERROR);const a=this.$options;if(a.i18n){const o=a.i18n;if(a.__i18n&&(o.__i18n=a.__i18n),o.__root=n,this===this.$root)this.$i18n=Ps(e,o);else{o.__injectWithOption=!0,o.__extender=t.__vueI18nExtend,this.$i18n=To(o);const i=this.$i18n;i.__extender&&(i.__disposer=i.__extender(this.$i18n))}}else if(a.__i18n)if(this===this.$root)this.$i18n=Ps(e,a);else{this.$i18n=To({__i18n:a.__i18n,__injectWithOption:!0,__extender:t.__vueI18nExtend,__root:n});const o=this.$i18n;o.__extender&&(o.__disposer=o.__extender(this.$i18n))}else this.$i18n=e;a.__i18nGlobal&&Yc(n,a,a),this.$t=(...o)=>this.$i18n.t(...o),this.$rt=(...o)=>this.$i18n.rt(...o),this.$te=(o,i)=>this.$i18n.te(o,i),this.$d=(...o)=>this.$i18n.d(...o),this.$n=(...o)=>this.$i18n.n(...o),this.$tm=o=>this.$i18n.tm(o),t.__setInstance(r,this.$i18n)},mounted(){},unmounted(){const r=_r();if(!r)throw an(Ze.UNEXPECTED_ERROR);const a=this.$i18n;delete this.$t,delete this.$rt,delete this.$te,delete this.$d,delete this.$n,delete this.$tm,a.__disposer&&(a.__disposer(),delete a.__disposer,delete a.__extender),t.__deleteInstance(r),delete this.$i18n}}}function Ps(e,n){e.locale=n.locale||e.locale,e.fallbackLocale=n.fallbackLocale||e.fallbackLocale,e.missing=n.missing||e.missing,e.silentTranslationWarn=n.silentTranslationWarn||e.silentFallbackWarn,e.silentFallbackWarn=n.silentFallbackWarn||e.silentFallbackWarn,e.formatFallbackMessages=n.formatFallbackMessages||e.formatFallbackMessages,e.postTranslation=n.postTranslation||e.postTranslation,e.warnHtmlInMessage=n.warnHtmlInMessage||e.warnHtmlInMessage,e.escapeParameterHtml=n.escapeParameterHtml||e.escapeParameterHtml,e.sync=n.sync||e.sync,e.__composer[Wc](n.pluralizationRules||e.pluralizationRules);const t=si(e.locale,{messages:n.messages,__i18n:n.__i18n});return Object.keys(t).forEach(r=>e.mergeLocaleMessage(r,t[r])),n.datetimeFormats&&Object.keys(n.datetimeFormats).forEach(r=>e.mergeDateTimeFormat(r,n.datetimeFormats[r])),n.numberFormats&&Object.keys(n.numberFormats).forEach(r=>e.mergeNumberFormat(r,n.numberFormats[r])),e}const ci={tag:{type:[String,Object]},locale:{type:String},scope:{type:String,validator:e=>e==="parent"||e==="global",default:"parent"},i18n:{type:Object}};function rm({slots:e},n){return n.length===1&&n[0]==="default"?(e.default?e.default():[]).reduce((r,a)=>[...r,...a.type===te?a.children:[a]],[]):n.reduce((t,r)=>{const a=e[r];return a&&(t[r]=a()),t},xe())}function Bc(){return te}const am=Vo({name:"i18n-t",props:Me({keypath:{type:String,required:!0},plural:{type:[Number,String],validator:e=>Ce(e)||!isNaN(e)}},ci),setup(e,n){const{slots:t,attrs:r}=n,a=e.i18n||Re({useScope:e.scope,__useComponent:!0});return()=>{const o=Object.keys(t).filter(h=>h[0]!=="_"),i=xe();e.locale&&(i.locale=e.locale),e.plural!==void 0&&(i.plural=K(e.plural)?+e.plural:e.plural);const s=rm(n,o),l=a[jo](e.keypath,s,i),c=Me(xe(),r),d=K(e.tag)||he(e.tag)?e.tag:Bc();return ei(d,c,l)}}}),Ns=am;function om(e){return ze(e)&&!K(e[0])}function qc(e,n,t,r){const{slots:a,attrs:o}=n;return()=>{const i={part:!0};let s=xe();e.locale&&(i.locale=e.locale),K(e.format)?i.key=e.format:he(e.format)&&(K(e.format.key)&&(i.key=e.format.key),s=Object.keys(e.format).reduce((f,y)=>t.includes(y)?Me(xe(),f,{[y]:e.format[y]}):f,xe()));const l=r(e.value,i,s);let c=[i.key];ze(l)?c=l.map((f,y)=>{const k=a[f.type],I=k?k({[f.type]:f.value,index:y,parts:l}):[f.value];return om(I)&&(I[0].key=`${f.type}-${y}`),I}):K(l)&&(c=[l]);const d=Me(xe(),o),h=K(e.tag)||he(e.tag)?e.tag:Bc();return ei(h,d,c)}}const im=Vo({name:"i18n-n",props:Me({value:{type:Number,required:!0},format:{type:[String,Object]}},ci),setup(e,n){const t=e.i18n||Re({useScope:e.scope,__useComponent:!0});return qc(e,n,$c,(...r)=>t[Io](...r))}}),Ms=im;function sm(e,n){const t=e;if(e.mode==="composition")return t.__getInstance(n)||e.global;{const r=t.__getInstance(n);return r!=null?r.__composer:e.global.__composer}}function lm(e){const n=i=>{const{instance:s,value:l}=i;if(!s||!s.$)throw an(Ze.UNEXPECTED_ERROR);const c=sm(e,s.$),d=Os(l);return[Reflect.apply(c.t,c,[...Rs(d)]),c]};return{created:(i,s)=>{const[l,c]=n(s);ca&&e.global===c&&(i.__i18nWatcher=dn(c.locale,()=>{s.instance&&s.instance.$forceUpdate()})),i.__composer=c,i.textContent=l},unmounted:i=>{ca&&i.__i18nWatcher&&(i.__i18nWatcher(),i.__i18nWatcher=void 0,delete i.__i18nWatcher),i.__composer&&(i.__composer=void 0,delete i.__composer)},beforeUpdate:(i,{value:s})=>{if(i.__composer){const l=i.__composer,c=Os(s);i.textContent=Reflect.apply(l.t,l,[...Rs(c)])}},getSSRProps:i=>{const[s]=n(i);return{textContent:s}}}}function Os(e){if(K(e))return{path:e};if(le(e)){if(!("path"in e))throw an(Ze.REQUIRED_VALUE,"path");return e}else throw an(Ze.INVALID_VALUE)}function Rs(e){const{path:n,locale:t,args:r,choice:a,plural:o}=e,i={},s=r||{};return K(t)&&(i.locale=t),Ce(a)&&(i.plural=a),Ce(o)&&(i.plural=o),[n,s,i]}function cm(e,n,...t){const r=le(t[0])?t[0]:{};(!de(r.globalInstall)||r.globalInstall)&&([Ns.name,"I18nT"].forEach(o=>e.component(o,Ns)),[Ms.name,"I18nN"].forEach(o=>e.component(o,Ms)),[Ds.name,"I18nD"].forEach(o=>e.component(o,Ds))),e.directive("t",lm(n))}const um=it("global-vue-i18n");function dm(e={}){const n=__VUE_I18N_LEGACY_API__&&de(e.legacy)?e.legacy:__VUE_I18N_LEGACY_API__,t=de(e.globalInjection)?e.globalInjection:!0,r=new Map,[a,o]=hm(e,n),i=it("");function s(h){return r.get(h)||null}function l(h,f){r.set(h,f)}function c(h){r.delete(h)}const d={get mode(){return __VUE_I18N_LEGACY_API__&&n?"legacy":"composition"},async install(h,...f){if(h.__VUE_I18N_SYMBOL__=i,h.provide(h.__VUE_I18N_SYMBOL__,d),le(f[0])){const I=f[0];d.__composerExtend=I.__composerExtend,d.__vueI18nExtend=I.__vueI18nExtend}let y=null;!n&&t&&(y=bm(h,d.global)),__VUE_I18N_FULL_INSTALL__&&cm(h,d,...f),__VUE_I18N_LEGACY_API__&&n&&h.mixin(tm(o,o.__composer,d));const k=h.unmount;h.unmount=()=>{y&&y(),d.dispose(),k()}},get global(){return o},dispose(){a.stop()},__instances:r,__getInstance:s,__setInstance:l,__deleteInstance:c};return d}function Re(e={}){const n=_r();if(n==null)throw an(Ze.MUST_BE_CALL_SETUP_TOP);if(!n.isCE&&n.appContext.app!=null&&!n.appContext.app.__VUE_I18N_SYMBOL__)throw an(Ze.NOT_INSTALLED);const t=fm(n),r=mm(t),a=Uc(n),o=pm(e,a);if(o==="global")return Yc(r,e,a),r;if(o==="parent"){let l=gm(t,n,e.__useComponent);return l==null&&(l=r),l}const i=t;let s=i.__getInstance(n);if(s==null){const l=Me({},e);"__i18n"in a&&(l.__i18n=a.__i18n),r&&(l.__root=r),s=li(l),i.__composerExtend&&(s[So]=i.__composerExtend(s)),vm(i,n,s),i.__setInstance(n,s)}return s}function hm(e,n){const t=ed(),r=__VUE_I18N_LEGACY_API__&&n?t.run(()=>To(e)):t.run(()=>li(e));if(r==null)throw an(Ze.UNEXPECTED_ERROR);return[t,r]}function fm(e){const n=or(e.isCE?um:e.appContext.app.__VUE_I18N_SYMBOL__);if(!n)throw an(e.isCE?Ze.NOT_INSTALLED_WITH_PROVIDE:Ze.UNEXPECTED_ERROR);return n}function pm(e,n){return Ta(e)?"__i18n"in n?"local":"global":e.useScope?e.useScope:"local"}function mm(e){return e.mode==="composition"?e.global:e.global.__composer}function gm(e,n,t=!1){let r=null;const a=n.root;let o=ym(n,t);for(;o!=null;){const i=e;if(e.mode==="composition")r=i.__getInstance(o);else if(__VUE_I18N_LEGACY_API__){const s=i.__getInstance(o);s!=null&&(r=s.__composer,t&&r&&!r[Hc]&&(r=null))}if(r!=null||a===o)break;o=o.parent}return r}function ym(e,n=!1){return e==null?null:n&&e.vnode.ctx||e.parent}function vm(e,n,t){Bt(()=>{},n),Ko(()=>{const r=t;e.__deleteInstance(n);const a=r[So];a&&(a(),delete r[So])},n)}const xm=["locale","fallbackLocale","availableLocales"],$s=["t","rt","d","n","tm","te"];function bm(e,n){const t=Object.create(null);return xm.forEach(a=>{const o=Object.getOwnPropertyDescriptor(n,a);if(!o)throw an(Ze.UNEXPECTED_ERROR);const i=Le(o.value)?{get(){return o.value.value},set(s){o.value.value=s}}:{get(){return o.get&&o.get()}};Object.defineProperty(t,a,i)}),e.config.globalProperties.$i18n=t,$s.forEach(a=>{const o=Object.getOwnPropertyDescriptor(n,a);if(!o||!o.value)throw an(Ze.UNEXPECTED_ERROR);Object.defineProperty(e.config.globalProperties,`$${a}`,o)}),()=>{delete e.config.globalProperties.$i18n,$s.forEach(a=>{delete e.config.globalProperties[`$${a}`]})}}const wm=Vo({name:"i18n-d",props:Me({value:{type:[Number,Date],required:!0},format:{type:[String,Object]}},ci),setup(e,n){const t=e.i18n||Re({useScope:e.scope,__useComponent:!0});return qc(e,n,Rc,(...r)=>t[zo](...r))}}),Ds=wm;Qp();Cp(dp);Ep(Sp);Lp(Ec);if(__INTLIFY_PROD_DEVTOOLS__){const e=yt();e.__INTLIFY__=!0,hp(e.__INTLIFY_DEVTOOLS_GLOBAL_HOOK__)}const _m=[{id:"emma",name:"Emma",age:28,location:"Seattle",occupation:"Graphic Designer",avatar:"👩‍🎨",tagline:"Warm, curious, loves coffee and her cat Mochi",traits:["friendly","creative","casual"]},{id:"marcus",name:"Marcus",age:32,location:"Tokyo",occupation:"Software Developer",avatar:"👨‍💻",tagline:"Laid-back Brit in Tokyo, foodie and gamer",traits:["relaxed","witty","thoughtful"]},{id:"sophia",name:"Sophia",age:25,location:"Paris",occupation:"Pastry Chef",avatar:"👩‍🍳",tagline:"Passionate about baking and French culture",traits:["enthusiastic","warm","expressive"]},{id:"james",name:"James",age:35,location:"New York",occupation:"Journalist",avatar:"👨‍💼",tagline:"Curious storyteller, loves jazz and coffee",traits:["inquisitive","articulate","friendly"]},{id:"yuki",name:"Yuki",age:23,location:"Osaka",occupation:"University Student",avatar:"👩‍🎓",tagline:"Studying abroad, anime fan and foodie",traits:["cheerful","curious","casual"]}],Fs=[{id:"beginner",name:"Beginner",description:"Simple words, short sentences",icon:"🌱"},{id:"intermediate",name:"Intermediate",description:"Natural flow, common idioms",icon:"🌿"},{id:"advanced",name:"Advanced",description:"Full slang, complex structures",icon:"🌳"}],pt=B(!1);function ui(){function e(){pt.value?document.documentElement.classList.add("dark"):document.documentElement.classList.remove("dark")}function n(){pt.value=!pt.value,localStorage.setItem("chatmate_darkMode",pt.value?"dark":"light"),e()}function t(){const r=localStorage.getItem("chatmate_darkMode");r?pt.value=r==="dark":pt.value=window.matchMedia("(prefers-color-scheme: dark)").matches,e()}return Bt(()=>{t()}),{isDark:pt,toggle:n,init:t}}const Vc="chatmate_motherTongue",vt=[{id:"en",name:"English",nativeName:"English",flag:"🇺🇸"},{id:"ja",name:"Japanese",nativeName:"日本語",flag:"🇯🇵"},{id:"zh",name:"Chinese",nativeName:"中文",flag:"🇹🇼"}];function km(){const e=localStorage.getItem(Vc);return e&&vt.some(n=>n.id===e)?e:"en"}const Ur=B(km());function jm(){dn(Ur,t=>{localStorage.setItem(Vc,t)});function e(t){vt.some(r=>r.id===t)&&(Ur.value=t)}function n(){return vt.find(t=>t.id===Ur.value)||vt[0]}return{motherTongue:Ur,supportedLanguages:vt,setMotherTongue:e,getMotherTongueInfo:n}}const zm={class:"min-h-screen overflow-y-auto bg-background-light dark:bg-background-dark"},Im={class:"max-w-2xl mx-auto px-4 py-8 pb-12"},Sm={class:"flex justify-between items-center mb-8"},Tm={class:"flex items-center gap-2"},Am={class:"relative"},Cm=["value"],Em=["value"],Lm={class:"material-symbols-outlined text-[20px]"},Pm={class:"text-center mb-10"},Nm={class:"text-3xl font-bold text-text-main dark:text-white mb-2"},Mm={class:"text-text-muted dark:text-slate-400"},Om={class:"mb-8"},Rm={class:"grid grid-cols-2 gap-4"},$m={class:"font-bold text-text-main dark:text-white text-lg"},Dm={class:"text-xs text-text-muted dark:text-slate-400 text-center mt-2"},Fm={class:"font-bold text-text-main dark:text-white text-lg"},Wm={class:"text-xs text-text-muted dark:text-slate-400 text-center mt-2"},Hm={class:"mb-8"},Um={class:"flex items-center gap-2 mb-4"},Ym={class:"text-lg font-semibold text-text-main dark:text-white"},Bm={class:"flex gap-4 overflow-x-auto pb-2"},qm=["onClick"],Vm={class:"flex items-center justify-center rounded-full size-16 shrink-0 shadow-md bg-slate-100 dark:bg-slate-800 text-4xl"},Km={class:"flex-1"},Gm={class:"font-bold text-text-main dark:text-white text-lg"},Xm={class:"text-sm text-text-muted dark:text-slate-400"},Jm={class:"text-sm text-text-main dark:text-slate-300 mt-1"},Qm={key:0,class:"shrink-0"},Zm={class:"mb-8"},eg={class:"flex items-center gap-2 mb-4"},ng={class:"text-lg font-semibold text-text-main dark:text-white"},tg={class:"grid grid-cols-3 gap-3"},rg=["onClick"],ag={class:"text-2xl mb-2"},og={class:"font-semibold text-text-main dark:text-white text-sm"},ig={class:"text-xs text-text-muted dark:text-slate-400 text-center mt-1"},sg={class:"mb-10"},lg={class:"flex items-center gap-2 mb-4"},cg={class:"text-lg font-semibold text-text-main dark:text-white"},ug={class:"grid grid-cols-2 gap-4"},dg={class:"font-semibold text-text-main dark:text-white"},hg={class:"text-xs text-text-muted dark:text-slate-400 text-center mt-1"},fg={class:"font-semibold text-text-main dark:text-white"},pg={class:"text-xs text-text-muted dark:text-slate-400 text-center mt-1"},mg={class:"mb-8"},gg={class:"flex items-center gap-2 mb-4"},yg={class:"text-lg font-semibold text-text-main dark:text-white"},vg={class:"grid grid-cols-2 gap-3"},xg=["onClick"],bg={class:"text-2xl mb-2"},wg={class:"font-semibold text-text-main dark:text-white text-sm"},_g={class:"mb-10"},kg={class:"flex items-center gap-2 mb-4"},jg={class:"text-lg font-semibold text-text-main dark:text-white"},zg={class:"grid grid-cols-3 gap-3"},Ig=["onClick"],Sg={class:"text-2xl mb-2"},Tg={class:"font-semibold text-text-main dark:text-white text-sm"},Ag={class:"text-xs text-text-muted dark:text-slate-400 text-center mt-1"},Cg={class:"mb-10"},Eg={class:"p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800"},Lg={class:"flex items-start gap-3"},Pg={class:"font-semibold text-text-main dark:text-white mb-1"},Ng={class:"text-sm text-text-muted dark:text-slate-400 space-y-1"},Mg={class:"flex items-center gap-2"},Og={class:"flex items-center gap-2"},Rg={class:"flex items-center gap-2"},$g=["disabled"],Dg={class:"flex items-center justify-center gap-2"},Fg={__name:"SetupScreen",emits:["start","startLearning"],setup(e,{emit:n}){const{t,locale:r}=Re(),{isDark:a,toggle:o}=ui(),{motherTongue:i,setMotherTongue:s}=jm(),l=n,c=B("learning"),d=B(null),h=B(null),f=B("free"),y=B(null),k=B(null),I=ie(()=>vt.filter(w=>w.id!==i.value));function P(w){s(w),k.value=null,r.value=w,localStorage.setItem("chatmate_locale",w)}const v=ie(()=>d.value&&h.value),j=ie(()=>y.value&&k.value);function N(){c.value==="chat"&&v.value?l("start",{character:d.value,level:h.value,language:r.value,mode:f.value}):c.value==="learning"&&j.value&&l("startLearning",{level:y.value,targetLanguage:k.value,motherTongue:i.value,uiLanguage:r.value})}return(w,_)=>(L(),R("div",zm,[u("div",Im,[u("div",Sm,[_[7]||(_[7]=u("div",null,null,-1)),u("div",Tm,[u("div",Am,[u("select",{value:g(i),onChange:_[0]||(_[0]=S=>P(S.target.value)),class:"appearance-none pl-3 pr-8 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-surface-light dark:bg-surface-dark text-text-main dark:text-slate-200 text-sm font-medium cursor-pointer focus:ring-2 focus:ring-primary focus:outline-none"},[(L(!0),R(te,null,_e(g(vt),S=>(L(),R("option",{key:S.id,value:S.id},x(S.flag)+" "+x(S.nativeName),9,Em))),128))],40,Cm),_[6]||(_[6]=u("span",{class:"material-symbols-outlined text-sm absolute right-2 top-1/2 -translate-y-1/2 text-text-muted dark:text-slate-400 pointer-events-none"},"expand_more",-1))]),u("button",{onClick:_[1]||(_[1]=(...S)=>g(o)&&g(o)(...S)),class:"flex items-center justify-center size-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-surface-light dark:bg-surface-dark hover:bg-slate-50 dark:hover:bg-slate-800 text-text-main dark:text-slate-200 transition-colors"},[u("span",Lm,x(g(a)?"light_mode":"dark_mode"),1)])])]),u("div",Pm,[u("h1",Nm,x(g(t)("app.title")),1),u("p",Mm,x(g(t)("app.subtitle")),1)]),u("section",Om,[u("div",Rm,[u("div",{onClick:_[2]||(_[2]=S=>c.value="chat"),class:Z(["flex flex-col items-center p-6 rounded-2xl border-2 transition-all cursor-pointer",c.value==="chat"?"border-primary bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10":"border-slate-200 dark:border-slate-700 bg-surface-light dark:bg-surface-dark hover:border-slate-300 dark:hover:border-slate-600"])},[u("span",{class:Z(["material-symbols-outlined text-5xl mb-3",c.value==="chat"?"text-primary":"text-slate-400"])},"forum",2),u("h3",$m,x(g(t)("setup.primaryModes.chat.name")),1),u("p",Dm,x(g(t)("setup.primaryModes.chat.description")),1)],2),u("div",{onClick:_[3]||(_[3]=S=>c.value="learning"),class:Z(["flex flex-col items-center p-6 rounded-2xl border-2 transition-all cursor-pointer",c.value==="learning"?"border-primary bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10":"border-slate-200 dark:border-slate-700 bg-surface-light dark:bg-surface-dark hover:border-slate-300 dark:hover:border-slate-600"])},[u("span",{class:Z(["material-symbols-outlined text-5xl mb-3",c.value==="learning"?"text-primary":"text-slate-400"])},"school",2),u("h3",Fm,x(g(t)("setup.primaryModes.learning.name")),1),u("p",Wm,x(g(t)("setup.primaryModes.learning.description")),1)],2)])]),c.value==="chat"?(L(),R(te,{key:0},[u("section",Hm,[u("div",Um,[_[8]||(_[8]=u("span",{class:"material-symbols-outlined text-primary"},"person",-1)),u("h2",Ym,x(g(t)("setup.choosePartner")),1)]),u("div",Bm,[(L(!0),R(te,null,_e(g(_m),S=>(L(),R("div",{key:S.id,onClick:C=>d.value=S,class:Z(["flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer bg-surface-light dark:bg-surface-dark shrink-0 w-72",d.value?.id===S.id?"border-primary bg-primary/5 dark:bg-primary/10":"border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"])},[u("div",Vm,x(S.avatar),1),u("div",Km,[u("h3",Gm,x(S.name),1),u("p",Xm,x(S.age)+" · "+x(S.location),1),u("p",Jm,x(g(t)(`characters.${S.id}.tagline`)),1)]),d.value?.id===S.id?(L(),R("div",Qm,[..._[9]||(_[9]=[u("span",{class:"material-symbols-outlined icon-filled text-primary text-2xl"},"check_circle",-1)])])):ae("",!0)],10,qm))),128))])]),u("section",Zm,[u("div",eg,[_[10]||(_[10]=u("span",{class:"material-symbols-outlined text-primary"},"signal_cellular_alt",-1)),u("h2",ng,x(g(t)("setup.yourLevel")),1)]),u("div",tg,[(L(!0),R(te,null,_e(g(Fs),S=>(L(),R("div",{key:S.id,onClick:C=>h.value=S,class:Z(["flex flex-col items-center p-4 rounded-xl border-2 transition-all cursor-pointer bg-surface-light dark:bg-surface-dark",h.value?.id===S.id?"border-primary bg-primary/5 dark:bg-primary/10":"border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"])},[u("span",ag,x(S.icon),1),u("h3",og,x(g(t)(`levels.${S.id}.name`)),1),u("p",ig,x(g(t)(`levels.${S.id}.description`)),1)],10,rg))),128))])]),u("section",sg,[u("div",lg,[_[11]||(_[11]=u("span",{class:"material-symbols-outlined text-primary"},"category",-1)),u("h2",cg,x(g(t)("setup.chooseMode")),1)]),u("div",ug,[u("div",{onClick:_[4]||(_[4]=S=>f.value="free"),class:Z(["flex flex-col items-center p-5 rounded-xl border-2 transition-all cursor-pointer bg-surface-light dark:bg-surface-dark",f.value==="free"?"border-primary bg-primary/5 dark:bg-primary/10":"border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"])},[u("span",{class:Z(["material-symbols-outlined text-4xl mb-2",f.value==="free"?"text-primary":"text-slate-400"])},"chat_bubble",2),u("h3",dg,x(g(t)("setup.modes.free.name")),1),u("p",hg,x(g(t)("setup.modes.free.description")),1)],2),u("div",{onClick:_[5]||(_[5]=S=>f.value="article"),class:Z(["flex flex-col items-center p-5 rounded-xl border-2 transition-all cursor-pointer bg-surface-light dark:bg-surface-dark",f.value==="article"?"border-primary bg-primary/5 dark:bg-primary/10":"border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"])},[u("span",{class:Z(["material-symbols-outlined text-4xl mb-2",f.value==="article"?"text-primary":"text-slate-400"])},"article",2),u("h3",fg,x(g(t)("setup.modes.article.name")),1),u("p",pg,x(g(t)("setup.modes.article.description")),1)],2)])])],64)):ae("",!0),c.value==="learning"?(L(),R(te,{key:1},[u("section",mg,[u("div",gg,[_[12]||(_[12]=u("span",{class:"material-symbols-outlined text-primary"},"school",-1)),u("h2",yg,x(g(t)("setup.targetLanguage")),1)]),u("div",vg,[(L(!0),R(te,null,_e(I.value,S=>(L(),R("div",{key:S.id,onClick:C=>k.value=S.id,class:Z(["flex flex-col items-center p-4 rounded-xl border-2 transition-all cursor-pointer bg-surface-light dark:bg-surface-dark",k.value===S.id?"border-primary bg-primary/5 dark:bg-primary/10":"border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"])},[u("span",bg,x(S.flag),1),u("h3",wg,x(S.nativeName),1)],10,xg))),128))])]),u("section",_g,[u("div",kg,[_[13]||(_[13]=u("span",{class:"material-symbols-outlined text-primary"},"signal_cellular_alt",-1)),u("h2",jg,x(g(t)("setup.learningLevel")),1)]),u("div",zg,[(L(!0),R(te,null,_e(g(Fs),S=>(L(),R("div",{key:S.id,onClick:C=>y.value=S,class:Z(["flex flex-col items-center p-4 rounded-xl border-2 transition-all cursor-pointer bg-surface-light dark:bg-surface-dark",y.value?.id===S.id?"border-primary bg-primary/5 dark:bg-primary/10":"border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"])},[u("span",Sg,x(S.icon),1),u("h3",Tg,x(g(t)(`levels.${S.id}.name`)),1),u("p",Ag,x(g(t)(`levels.${S.id}.description`)),1)],10,Ig))),128))])]),u("section",Cg,[u("div",Eg,[u("div",Lg,[_[17]||(_[17]=u("span",{class:"material-symbols-outlined text-2xl text-blue-500"},"info",-1)),u("div",null,[u("h4",Pg,x(g(t)("setup.learningModeInfo.title")),1),u("ul",Ng,[u("li",Mg,[_[14]||(_[14]=u("span",{class:"material-symbols-outlined text-sm text-green-500"},"check",-1)),Te(" "+x(g(t)("setup.learningModeInfo.flashcards")),1)]),u("li",Og,[_[15]||(_[15]=u("span",{class:"material-symbols-outlined text-sm text-green-500"},"check",-1)),Te(" "+x(g(t)("setup.learningModeInfo.audio")),1)]),u("li",Rg,[_[16]||(_[16]=u("span",{class:"material-symbols-outlined text-sm text-green-500"},"check",-1)),Te(" "+x(g(t)("setup.learningModeInfo.quiz")),1)])])])])])])],64)):ae("",!0),u("button",{onClick:N,disabled:c.value==="chat"&&!v.value||c.value==="learning"&&!j.value,class:Z(["w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",c.value==="chat"&&v.value||c.value==="learning"&&j.value?"bg-primary text-[#0d171b] hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]":"bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400"])},[u("span",Dg,[_[18]||(_[18]=u("span",{class:"material-symbols-outlined"},"arrow_forward",-1)),Te(" "+x(c.value==="chat"?g(t)("setup.startChatting"):g(t)("setup.startLearning")),1)])],10,$g)])]))}};function Wg(e){return e?btoa(encodeURIComponent(e)):""}function Hg(e){if(!e)return"";try{return decodeURIComponent(atob(e))}catch{return""}}function Ug(e){function n(){const{language:i,characterId:s,levelId:l,isArticleMode:c,articleId:d}=e.value,h=`chatmate_${i}_${s}_${l}`;return c&&d?`${h}_article_${d}`:h}function t(i,s){const l=n(),c=JSON.stringify({messages:i,hints:s});localStorage.setItem(l,Wg(c))}function r(){const i=n(),s=localStorage.getItem(i);if(s)try{const l=Hg(s),c=JSON.parse(l);return Array.isArray(c)?{messages:c,hints:[]}:{messages:c.messages||[],hints:c.hints||[]}}catch{return{messages:[],hints:[]}}return{messages:[],hints:[]}}function a(){const i=n();localStorage.removeItem(i)}function o(i,s){dn([i,s],()=>{t(i.value,s.value)},{deep:!0})}return{save:t,load:r,clear:a,autoSave:o,getStorageKey:n}}const $t="https://script.google.com/macros/s/AKfycbxgt_HcdEXOwE91VPthUDf2xCNNrRELNR3nki9uiJXg-OVvyIhb0jvKc74R050I5lVNoQ/exec";let Ut=null,Jt=null;function Yg(){let e=localStorage.getItem("chatmate_clientId");return e||(e="client_"+Math.random().toString(36).substring(2)+Date.now().toString(36),localStorage.setItem("chatmate_clientId",e)),e}function Bg(){const e=encodeURIComponent(window.location.origin);return $t.includes("script.google.com")?`${$t}?action=token&origin=${e}`:`${$t.replace(/\/chat$/,"")}/token?origin=${e}`}async function Ao(){return Jt||(Jt=(async()=>{try{const e=Bg(),t=await(await fetch(e,{method:"GET",redirect:"follow"})).json();return t.success&&t.token?(Ut=t.token,Ut):(console.error("Failed to get auth token:",t.error),null)}catch(e){return console.error("Error requesting auth token:",e),null}finally{Jt=null}})(),Jt)}async function qg(){return Ut||await Ao()}function Vg(){Ut=null}function Kg(){const e=B(!1),n=B(null);async function t(a){const{messages:o,characterId:i,levelId:s,language:l,isGreeting:c,article:d}=a;e.value=!0,n.value=null;try{const h=await qg(),f={messages:o,character:i,level:s,language:l,isGreeting:c,clientId:Yg(),origin:window.location.origin,authToken:h};d&&(f.article={title:d.title,content:d.content,vocabulary:d.vocabulary,discussionPoints:d.discussionPoints});const k=await(await fetch($t,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(f),redirect:"follow"})).json();if(!k.success){if(k.isTokenError){Vg();const I=await Ao();if(I){f.authToken=I;const v=await(await fetch($t,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(f),redirect:"follow"})).json();if(v.success)return{reply:v.reply,hints:v.hints||[]}}}throw{isRateLimit:k.isRateLimit,isTokenError:k.isTokenError,message:k.error}}return{reply:k.reply,hints:k.hints||[]}}catch(h){throw n.value=h,h}finally{e.value=!1}}async function r(){Ut||await Ao()}return{isLoading:e,error:n,sendMessage:t,init:r}}const Kc="chatmate_userProgress",Qt=[{level:1,title:"Novice",minXP:0,icon:"🌱"},{level:2,title:"Beginner",minXP:100,icon:"🌿"},{level:3,title:"Learner",minXP:300,icon:"🌳"},{level:4,title:"Speaker",minXP:600,icon:"💬"},{level:5,title:"Conversationalist",minXP:1e3,icon:"🗣️"},{level:6,title:"Fluent",minXP:1500,icon:"📚"},{level:7,title:"Advanced",minXP:2200,icon:"🎓"},{level:8,title:"Expert",minXP:3e3,icon:"⭐"},{level:9,title:"Master",minXP:4e3,icon:"🏆"},{level:10,title:"Legend",minXP:5500,icon:"👑"}],Zt={userMessage:5,systemMessage:2,dailyStreak:10,firstMessageOfDay:5},Ws=[{days:3,bonus:15,icon:"🔥"},{days:7,bonus:35,icon:"⚡"},{days:14,bonus:70,icon:"💪"},{days:30,bonus:150,icon:"🌟"},{days:60,bonus:300,icon:"💎"},{days:100,bonus:500,icon:"🏆"},{days:365,bonus:1825,icon:"👑"}],Yr=[{id:"first_chat",category:"first_steps",icon:"💬",condition:e=>e.messagesSent>=1},{id:"ice_breaker",category:"first_steps",icon:"🧊",condition:e=>e.messagesSent>=10},{id:"chatterbox",category:"first_steps",icon:"🗣️",condition:e=>e.messagesSent>=100},{id:"streak_3",category:"consistency",icon:"🔥",condition:e=>e.longestStreak>=3},{id:"streak_7",category:"consistency",icon:"⚡",condition:e=>e.longestStreak>=7},{id:"streak_30",category:"consistency",icon:"🌟",condition:e=>e.longestStreak>=30},{id:"word_collector",category:"learning",icon:"📝",condition:e=>e.wordsLearned.length>=10},{id:"bookworm",category:"learning",icon:"📚",condition:e=>e.articlesCompleted.length>=5},{id:"polyglot",category:"learning",icon:"🌍",condition:e=>Object.keys(e.characterStats).length>=3},{id:"level_beginner",category:"mastery",icon:"🌿",condition:e=>e.totalXP>=100},{id:"level_speaker",category:"mastery",icon:"💬",condition:e=>e.totalXP>=600},{id:"level_legend",category:"mastery",icon:"👑",condition:e=>e.totalXP>=5500}];function Co(){return{totalXP:0,messagesSent:0,messagesReceived:0,articlesStarted:[],articlesCompleted:[],currentStreak:0,longestStreak:0,lastActiveDate:null,totalSessionMinutes:0,wordsLearned:[],characterStats:{},claimedMilestones:[],unlockedAchievements:[]}}function Gg(){try{const e=localStorage.getItem(Kc);if(e)return{...Co(),...JSON.parse(e)}}catch{}return Co()}function Nn(e){localStorage.setItem(Kc,JSON.stringify(e))}const oe=B(Gg()),Va=B(null),Ka=B(!1),Ga=B(null),Xa=B(!1),Ja=B(null),Qa=B(!1),Za=B(null);function jt(){const e=ie(()=>{const w=oe.value.totalXP;let _=Qt[0];for(const S of Qt)if(w>=S.minXP)_=S;else break;return _}),n=ie(()=>{const w=e.value.level;return Qt.find(_=>_.level===w+1)||null}),t=ie(()=>n.value?n.value.minXP-oe.value.totalXP:0),r=ie(()=>{if(!n.value)return 100;const w=e.value,_=n.value,S=oe.value.totalXP-w.minXP,C=_.minXP-w.minXP;return Math.min(100,Math.round(S/C*100))}),a=ie(()=>Yr.filter(w=>oe.value.unlockedAchievements.includes(w.id))),o=ie(()=>Yr.filter(w=>!oe.value.unlockedAchievements.includes(w.id)));function i(){for(const w of Yr)if(!oe.value.unlockedAchievements.includes(w.id)&&w.condition(oe.value))return oe.value.unlockedAchievements.push(w.id),Za.value=w,Qa.value=!0,Nn(oe.value),!0;return!1}function s(w){for(const _ of Ws)if(w===_.days&&!oe.value.claimedMilestones.includes(_.days))return oe.value.claimedMilestones.push(_.days),c(_.bonus,"streakMilestone"),Ja.value=_,Xa.value=!0,!0;return!1}function l(){const w=new Date().toDateString(),_=oe.value.lastActiveDate;if(_!==w){const S=new Date;S.setDate(S.getDate()-1),_===S.toDateString()?(oe.value.currentStreak+=1,oe.value.currentStreak>oe.value.longestStreak&&(oe.value.longestStreak=oe.value.currentStreak),c(Zt.dailyStreak,"streak"),s(oe.value.currentStreak)):_!==w&&(oe.value.currentStreak=1),c(Zt.firstMessageOfDay,"firstOfDay"),oe.value.lastActiveDate=w}}function c(w,_="action"){const S=e.value.level;return oe.value.totalXP+=w,Va.value={amount:w,reason:_},e.value.level>S&&(Ga.value=e.value,Ka.value=!0),Nn(oe.value),setTimeout(()=>{Va.value=null},2e3),w}function d(){l(),oe.value.messagesSent+=1,c(Zt.userMessage,"userMessage"),Nn(oe.value),i()}function h(){oe.value.messagesReceived+=1,c(Zt.systemMessage,"systemMessage"),Nn(oe.value),i()}function f(w){oe.value.articlesStarted.includes(w)||(oe.value.articlesStarted.push(w),Nn(oe.value))}function y(w){oe.value.wordsLearned.includes(w)||(oe.value.wordsLearned.push(w),Nn(oe.value))}function k(w){oe.value.characterStats[w]||(oe.value.characterStats[w]={messages:0}),oe.value.characterStats[w].messages+=1,Nn(oe.value)}function I(){Ka.value=!1,Ga.value=null}function P(){Xa.value=!1,Ja.value=null}function v(){Qa.value=!1,Za.value=null,setTimeout(()=>i(),300)}function j(){return Qt}function N(){oe.value=Co(),Nn(oe.value)}return dn(oe,()=>{Nn(oe.value)},{deep:!0}),{progress:oe,recentXPGain:Va,showLevelUp:Ka,newRank:Ga,showStreakMilestone:Xa,currentMilestone:Ja,showAchievementUnlock:Qa,newAchievement:Za,currentRank:e,nextRank:n,xpToNextRank:t,progressToNextRank:r,unlockedAchievements:a,lockedAchievements:o,addXP:c,onMessageSent:d,onMessageReceived:h,onArticleStarted:f,onWordLearned:y,trackCharacterInteraction:k,dismissLevelUp:I,dismissStreakMilestone:P,dismissAchievementUnlock:v,checkAchievements:i,getAllRanks:j,resetProgress:N,RANKS:Qt,XP_REWARDS:Zt,STREAK_MILESTONES:Ws,ACHIEVEMENTS:Yr}}const ct=(e,n)=>{const t=e.__vccOpts||e;for(const[r,a]of n)t[r]=a;return t},Xg=["title"],Jg={class:"badge-icon"},Qg={key:0},Zg={key:1,class:"locked-icon"},ey={class:"badge-info"},ny={class:"badge-title"},ty={class:"badge-desc"},ry={__name:"AchievementBadge",props:{achievement:{type:Object,required:!0},isUnlocked:{type:Boolean,default:!1}},setup(e){return(n,t)=>(L(),R("div",{class:Z(["achievement-badge",{unlocked:e.isUnlocked,locked:!e.isUnlocked}]),title:e.isUnlocked?"":n.$t(`achievements.${e.achievement.id}.hint`)},[u("div",Jg,[e.isUnlocked?(L(),R("span",Qg,x(e.achievement.icon),1)):(L(),R("span",Zg,"🔒"))]),u("div",ey,[u("span",ny,x(n.$t(`achievements.${e.achievement.id}.title`)),1),u("span",ty,x(n.$t(`achievements.${e.achievement.id}.description`)),1)])],10,Xg))}},ay=ct(ry,[["__scopeId","data-v-a4ad7f9d"]]),oy={class:"achievements-panel"},iy={class:"panel-header"},sy={class:"panel-title"},ly={class:"badge-count"},cy={class:"progress-bar-container"},uy={class:"category-title"},dy={class:"achievements-grid"},hy={__name:"AchievementsPanel",setup(e){const{unlockedAchievements:n,ACHIEVEMENTS:t,progress:r}=jt(),a=["first_steps","consistency","learning","mastery"],o=ie(()=>Math.round(n.value.length/t.length*100));function i(l){return t.filter(c=>c.category===l)}function s(l){return r.value.unlockedAchievements.includes(l)}return(l,c)=>(L(),R("div",oy,[u("div",iy,[u("h3",sy,x(l.$t("achievements.unlocked")),1),u("span",ly,x(g(n).length)+"/"+x(g(t).length),1)]),u("div",cy,[u("div",{class:"progress-bar",style:mn({width:`${o.value}%`})},null,4)]),(L(),R(te,null,_e(a,d=>u("div",{key:d,class:"category-section"},[u("h4",uy,x(l.$t(`achievements.categories.${d}`)),1),u("div",dy,[(L(!0),R(te,null,_e(i(d),h=>(L(),Ae(ay,{key:h.id,achievement:h,"is-unlocked":s(h.id)},null,8,["achievement","is-unlocked"]))),128))])])),64))]))}},fy=ct(hy,[["__scopeId","data-v-0eb207b6"]]),py={class:"flex items-center gap-2"},my={class:"text-xs font-bold text-yellow-600 dark:text-yellow-400"},gy={key:0,class:"flex items-center justify-center gap-1 px-2 py-1 rounded-lg bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/30 dark:to-orange-900/30 border border-red-200 dark:border-red-700"},yy={class:"text-xs font-bold text-red-600 dark:text-red-400"},vy={class:"hidden sm:inline text-[10px] text-red-500 dark:text-red-400"},xy={class:"relative group"},by={class:"flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 border border-amber-200 dark:border-amber-700"},wy={class:"text-base"},_y={class:"flex flex-col"},ky={class:"text-xs font-semibold text-amber-800 dark:text-amber-200 leading-tight"},jy={class:"text-[10px] text-amber-600 dark:text-amber-400 leading-tight"},zy={class:"absolute top-full left-0 mt-2 p-3 rounded-lg bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 min-w-[180px]"},Iy={class:"text-sm font-semibold text-text-main dark:text-white mb-2"},Sy={class:"text-xs text-text-muted dark:text-slate-400 mb-2"},Ty={key:0,class:"space-y-1"},Ay={class:"flex justify-between text-xs"},Cy={class:"text-text-muted dark:text-slate-400"},Ey={class:"text-amber-600 dark:text-amber-400"},Ly={class:"h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden"},Py={key:1,class:"text-xs text-amber-600 dark:text-amber-400"},Ny={class:"mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 text-xs text-text-muted dark:text-slate-400 space-y-1"},My={class:"flex items-center gap-1"},Oy={key:0,class:"text-amber-600 dark:text-amber-400"},Ry={key:1,class:"hidden sm:flex items-center gap-1.5"},$y={class:"w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden"},Dy={class:"text-[10px] text-text-muted dark:text-slate-400"},Fy={key:0,class:"absolute -top-2 right-0 px-2 py-0.5 rounded-full bg-green-500 text-white text-xs font-bold shadow-lg"},Wy={class:"achievements-popup"},Hy={class:"popup-header"},Uy={class:"popup-title"},Yy={__name:"RankBadge",setup(e){const{t:n}=Re(),{progress:t,currentRank:r,nextRank:a,progressToNextRank:o,xpToNextRank:i,recentXPGain:s,unlockedAchievements:l,ACHIEVEMENTS:c}=jt(),d=B(!1);return(h,f)=>(L(),R("div",py,[u("button",{onClick:f[0]||(f[0]=y=>d.value=!d.value),class:"flex items-center gap-1 px-2 py-1 rounded-lg bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30 border border-yellow-200 dark:border-yellow-700 hover:border-yellow-400 dark:hover:border-yellow-500 transition-colors"},[f[3]||(f[3]=u("span",{class:"text-base"},"🏆",-1)),u("span",my,x(g(l).length)+"/"+x(g(c).length),1)]),g(t).currentStreak>0?(L(),R("div",gy,[f[4]||(f[4]=u("span",{class:"text-base animate-pulse"},"🔥",-1)),u("span",yy,x(g(t).currentStreak),1),u("span",vy,x(g(n)("rank.days")),1)])):ae("",!0),u("div",xy,[u("div",by,[u("span",wy,x(g(r).icon),1),u("div",_y,[u("span",ky,x(g(n)(`ranks.${g(r).title.toLowerCase()}`,g(r).title)),1),u("span",jy," Lv."+x(g(r).level),1)])]),u("div",zy,[u("div",Iy,x(g(r).icon)+" "+x(g(n)(`ranks.${g(r).title.toLowerCase()}`,g(r).title)),1),u("div",Sy,x(g(n)("rank.totalXP",{xp:g(t).totalXP})),1),g(a)?(L(),R("div",Ty,[u("div",Ay,[u("span",Cy,x(g(n)("rank.nextLevel")),1),u("span",Ey,x(g(i))+" XP",1)]),u("div",Ly,[u("div",{class:"h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500",style:mn({width:`${g(o)}%`})},null,4)])])):(L(),R("div",Py,x(g(n)("rank.maxLevel")),1)),u("div",Ny,[u("div",null,x(g(n)("rank.messagesSent",{count:g(t).messagesSent})),1),u("div",My,[f[5]||(f[5]=u("span",null,"🔥",-1)),u("span",null,x(g(n)("rank.currentStreak",{count:g(t).currentStreak})),1)]),g(t).longestStreak>0?(L(),R("div",Oy,x(g(n)("rank.longestStreak",{count:g(t).longestStreak})),1)):ae("",!0)])])]),g(a)?(L(),R("div",Ry,[u("div",$y,[u("div",{class:"h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500",style:mn({width:`${g(o)}%`})},null,4)]),u("span",Dy,x(g(o))+"%",1)])):ae("",!0),ve(Ft,{name:"xp-popup"},{default:_t(()=>[g(s)?(L(),R("div",Fy," +"+x(g(s).amount)+" XP ",1)):ae("",!0)]),_:1}),(L(),Ae(Cr,{to:"body"},[ve(Ft,{name:"panel"},{default:_t(()=>[d.value?(L(),R("div",{key:0,class:"achievements-overlay",onClick:f[2]||(f[2]=Zn(y=>d.value=!1,["self"]))},[u("div",Wy,[u("div",Hy,[u("h2",Uy,"🏆 "+x(h.$t("achievements.unlocked")),1),u("button",{onClick:f[1]||(f[1]=y=>d.value=!1),class:"close-btn"},[...f[6]||(f[6]=[u("span",{class:"material-symbols-outlined"},"close",-1)])])]),ve(fy)])])):ae("",!0)]),_:1})]))]))}},By=ct(Yy,[["__scopeId","data-v-283c1e0d"]]),qy={class:"flex items-center justify-between border-b border-[#e7eff3] dark:border-slate-800 px-4 sm:px-6 py-4 bg-surface-light dark:bg-surface-dark z-10 shadow-sm"},Vy={class:"flex items-center gap-3 text-text-main dark:text-white"},Ky={class:"flex items-center justify-center rounded-full size-10 shrink-0 shadow-sm border-2 border-white dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-2xl"},Gy={class:"flex flex-col"},Xy={class:"text-base font-bold leading-tight tracking-[-0.015em]"},Jy={class:"text-xs text-text-muted dark:text-slate-400"},Qy={key:0,class:"px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold"},Zy={class:"flex items-center gap-2 relative"},ev={class:"material-symbols-outlined text-[18px]"},nv=["disabled"],tv={__name:"ChatHeader",props:{character:{type:Object,required:!0},level:{type:Object,required:!0},isArticleMode:{type:Boolean,default:!1},showArticle:{type:Boolean,default:!0},isLoading:{type:Boolean,default:!1}},emits:["back","toggle-article","renew-chat"],setup(e,{emit:n}){const{t}=Re(),{isDark:r,toggle:a}=ui(),o=n;return(i,s)=>(L(),R("header",qy,[u("div",Vy,[u("button",{onClick:s[0]||(s[0]=l=>o("back")),class:"flex items-center justify-center"},[...s[4]||(s[4]=[u("span",{class:"material-symbols-outlined cursor-pointer"},"arrow_back",-1)])]),u("div",Ky,x(e.character.avatar),1),u("div",Gy,[u("h2",Xy,x(e.character.name),1),u("span",Jy,x(g(t)(`levels.${e.level.id}.name`)),1)]),s[5]||(s[5]=u("span",{class:"px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-semibold"},"Online",-1)),e.isArticleMode?(L(),R("span",Qy,x(g(t)("chat.articleMode")),1)):ae("",!0)]),u("div",Zy,[ve(By),u("button",{onClick:s[1]||(s[1]=(...l)=>g(a)&&g(a)(...l)),class:"flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-text-main dark:text-slate-200 transition-colors"},[u("span",ev,x(g(r)?"light_mode":"dark_mode"),1)]),e.isArticleMode?(L(),R("button",{key:0,onClick:s[2]||(s[2]=l=>o("toggle-article")),class:"hidden sm:flex h-9 px-3 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-text-main dark:text-slate-200 text-sm font-medium transition-colors"},[s[6]||(s[6]=u("span",{class:"mr-1 material-symbols-outlined text-[18px]"},"article",-1)),Te(" "+x(e.showArticle?"Hide":"Show"),1)])):ae("",!0),u("button",{onClick:s[3]||(s[3]=l=>o("renew-chat")),disabled:e.isLoading,class:"flex h-9 px-3 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-text-main dark:text-slate-200 text-sm font-medium transition-colors disabled:opacity-50"},[...s[7]||(s[7]=[u("span",{class:"material-symbols-outlined text-[18px]"},"refresh",-1),u("span",{class:"hidden sm:inline ml-1"},"New Chat",-1)])],8,nv)])]))}},rv={key:0,class:"flex items-end gap-2 sm:gap-3 max-w-[calc(100%-2.5rem)] sm:max-w-3xl"},av={class:"flex items-center justify-center rounded-full size-8 sm:size-10 shrink-0 shadow-sm bg-slate-100 dark:bg-slate-800 text-xl sm:text-2xl"},ov={class:"flex flex-col gap-1 items-start min-w-0 overflow-hidden"},iv={class:"text-text-muted dark:text-slate-400 text-[13px] font-medium ml-1"},sv={class:"p-3 sm:p-4 rounded-2xl rounded-bl-none bg-surface-light dark:bg-surface-dark text-text-main dark:text-slate-200 shadow-sm border border-slate-100 dark:border-slate-700"},lv={class:"text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words overflow-wrap-anywhere"},cv={key:1,class:"flex items-end gap-2 sm:gap-3 justify-end"},uv={class:"flex flex-col gap-1 items-end min-w-0 max-w-[80%] sm:max-w-xl"},dv={class:"p-3 sm:p-4 rounded-2xl rounded-br-none bg-primary text-[#0d171b] shadow-md"},hv={class:"text-sm sm:text-base leading-relaxed font-medium whitespace-pre-wrap break-words"},fv={__name:"ChatMessage",props:{message:{type:Object,required:!0},character:{type:Object,required:!0}},setup(e){return(n,t)=>e.message.role==="assistant"?(L(),R("div",rv,[u("div",av,x(e.character.avatar),1),u("div",ov,[u("span",iv,x(e.character.name),1),u("div",sv,[u("p",lv,x(e.message.content),1)])])])):(L(),R("div",cv,[u("div",uv,[t[0]||(t[0]=u("span",{class:"text-text-muted dark:text-slate-400 text-[13px] font-medium mr-1"},"You",-1)),u("div",dv,[u("p",hv,x(e.message.content),1)])]),t[1]||(t[1]=u("div",{class:"flex items-center justify-center rounded-full size-8 sm:size-10 shrink-0 shadow-sm bg-primary/20 text-xl sm:text-2xl"}," 👤 ",-1))]))}},pv={class:"p-4 sm:p-6 bg-surface-light dark:bg-surface-dark border-t border-[#e7eff3] dark:border-slate-800 z-10"},mv={class:"flex items-center gap-3 max-w-4xl mx-auto"},gv={class:"flex-1 relative"},yv=["value","disabled","placeholder"],vv=["disabled"],xv={__name:"ChatInput",props:{modelValue:{type:String,default:""},disabled:{type:Boolean,default:!1}},emits:["update:modelValue","send"],setup(e,{expose:n,emit:t}){const{t:r}=Re(),a=e,o=t,i=B(null),s=B(a.modelValue);dn(()=>a.modelValue,h=>{s.value=h});function l(h){s.value=h.target.value,o("update:modelValue",h.target.value)}function c(h){h.key==="Enter"&&!h.shiftKey&&(h.preventDefault(),o("send"))}function d(){i.value?.focus()}return n({focus:d}),(h,f)=>(L(),R("div",pv,[u("div",mv,[u("div",gv,[u("textarea",{ref_key:"inputRef",ref:i,value:s.value,onInput:l,onKeydown:c,disabled:e.disabled,class:"w-full resize-none rounded-2xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#1e2930] text-text-main dark:text-white px-4 py-3 pr-12 text-base focus:border-primary focus:ring-1 focus:ring-primary dark:focus:ring-primary placeholder-slate-400 disabled:opacity-50",placeholder:g(r)("chat.typeMessage"),rows:"1",style:{"min-height":"50px","max-height":"150px"}},null,40,yv)]),u("button",{onClick:f[0]||(f[0]=y=>o("send")),disabled:!s.value.trim()||e.disabled,class:"shrink-0 flex items-center justify-center size-12 rounded-full bg-primary text-[#0d171b] shadow-lg hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"},[...f[1]||(f[1]=[u("span",{class:"material-symbols-outlined icon-filled text-[24px]"},"send",-1)])],8,vv)]),f[2]||(f[2]=u("div",{class:"text-center mt-2"},[u("p",{class:"text-[11px] text-slate-400 dark:text-slate-500"},"Press Enter to send, Shift+Enter for new line")],-1))]))}},bv={key:0,class:"max-w-[calc(100vw-2rem)] sm:max-w-3xl"},wv={class:"flex items-center gap-2 mb-3 px-1"},_v={class:"text-xs font-bold text-primary uppercase tracking-wider"},kv={class:"flex gap-3 pb-2 overflow-x-auto sm:grid sm:grid-cols-3 sm:overflow-visible"},jv={class:"mb-2"},zv={class:"font-bold text-primary text-lg"},Iv={class:"text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium"},Sv={class:"mt-auto pt-2 border-t border-slate-100 dark:border-slate-700"},Tv={class:"text-xs italic text-text-main dark:text-slate-300"},Av={__name:"VocabularyHints",props:{hints:{type:Array,required:!0}},setup(e){const{t:n}=Re();return(t,r)=>e.hints.length>0?(L(),R("div",bv,[u("div",wv,[r[0]||(r[0]=u("span",{class:"material-symbols-outlined text-primary text-sm"},"auto_awesome",-1)),u("span",_v,x(g(n)("chat.tryUsing")),1)]),u("div",kv,[(L(!0),R(te,null,_e(e.hints,a=>(L(),R("div",{key:a.word,class:"flex flex-col p-3 sm:p-4 bg-white dark:bg-[#1e2930] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm shrink-0 w-48 sm:w-auto sm:shrink"},[u("div",jv,[u("span",zv,x(a.word),1)]),u("p",Iv,x(a.description),1),u("div",Sv,[u("p",Tv,'"'+x(a.example)+'"',1)])]))),128))])])):ae("",!0)}};function Cv(e){const n=ie(()=>{const r={},a=e.value?.vocabulary||e?.vocabulary;return a&&a.forEach(o=>{r[o.word.toLowerCase()]=o}),r}),t=ie(()=>{const r=e.value?.content||e?.content;return r?Ev(r,n.value):[]});return{vocabularyMap:n,contentSegments:t}}function Ev(e,n){const t=[],r=/\[\[([^\]]+)\]\]/g;let a=0,o;for(;(o=r.exec(e))!==null;){if(o.index>a){const l=e.slice(a,o.index);Hs(t,l)}const i=o[1],s=n[i.toLowerCase()];s?t.push({type:"vocab",word:i,data:s}):t.push({type:"text",content:i}),a=r.lastIndex}return a<e.length&&Hs(t,e.slice(a)),t}function Hs(e,n){const t=n.split(`
`);t.forEach((r,a)=>{r&&e.push({type:"text",content:r}),a<t.length-1&&e.push({type:"break"})})}function Lv(e){return e?e.replace(/\[\[([^\]]+)\]\]/g,"$1"):""}const Pv={class:"vocabulary-word"},Nv={class:"popup-header"},Mv={class:"popup-word"},Ov={class:"popup-content"},Rv={class:"popup-section"},$v={class:"popup-text"},Dv={key:0,class:"popup-section"},Fv={class:"popup-text"},Wv={key:1,class:"popup-section"},Hv={class:"popup-text popup-example"},Uv={__name:"VocabularyWord",props:{word:{type:String,required:!0},vocabularyData:{type:Object,required:!0},popupPosition:{type:String,default:"bottom"}},setup(e){const n=B(!1);let t=null;function r(){t&&(clearTimeout(t),t=null),n.value=!0}function a(){t=setTimeout(()=>{n.value=!1},100)}return(o,i)=>(L(),R("span",{class:"vocabulary-word-wrapper",onMouseenter:r,onMouseleave:a},[u("span",Pv,x(e.word),1),ve(Ft,{name:"popup"},{default:_t(()=>[n.value?(L(),R("div",{key:0,class:Z(["vocabulary-popup",e.popupPosition])},[u("div",Nv,[u("span",Mv,x(e.word),1)]),u("div",Ov,[u("div",Rv,[i[0]||(i[0]=u("span",{class:"popup-label"},"Definition",-1)),u("p",$v,x(e.vocabularyData.definition),1)]),e.vocabularyData.explanation?(L(),R("div",Dv,[i[1]||(i[1]=u("span",{class:"popup-label"},"Explanation",-1)),u("p",Fv,x(e.vocabularyData.explanation),1)])):ae("",!0),e.vocabularyData.example?(L(),R("div",Wv,[i[2]||(i[2]=u("span",{class:"popup-label"},"Example",-1)),u("p",Hv,'"'+x(e.vocabularyData.example)+'"',1)])):ae("",!0)])],2)):ae("",!0)]),_:1})],32))}},Yv=ct(Uv,[["__scopeId","data-v-9c38e1ff"]]),Bv={class:"w-full lg:w-[500px] shrink-0 max-h-64 lg:max-h-none border-b lg:border-b-0 lg:border-r border-[#e7eff3] dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4 overflow-y-auto"},qv={class:"font-bold text-lg mb-3 text-text-main dark:text-white"},Vv={class:"text-sm text-text-main dark:text-slate-300 leading-relaxed mb-4"},Kv={key:0},Gv={key:1},Xv={class:"mb-3"},Jv={class:"text-xs font-bold text-primary uppercase tracking-wider"},Qv={class:"flex flex-wrap gap-2"},Zv={class:"font-semibold text-primary text-sm"},ex={class:"text-xs text-text-muted dark:text-slate-400 block"},nx={__name:"ArticlePanel",props:{article:{type:Object,required:!0}},setup(e){const{t:n}=Re(),t=e,{contentSegments:r}=Cv(Td(t,"article"));return(a,o)=>(L(),R("div",Bv,[u("h3",qv,x(e.article.title),1),u("div",Vv,[(L(!0),R(te,null,_e(g(r),(i,s)=>(L(),R(te,{key:s},[i.type==="text"?(L(),R("span",Kv,x(i.content),1)):i.type==="break"?(L(),R("br",Gv)):i.type==="vocab"?(L(),Ae(Yv,{key:2,word:i.word,"vocabulary-data":i.data},null,8,["word","vocabulary-data"])):ae("",!0)],64))),128))]),u("div",Xv,[u("span",Jv,x(g(n)("articles.keyWords")),1)]),u("div",Qv,[(L(!0),R(te,null,_e(e.article.vocabulary,i=>(L(),R("div",{key:i.word,class:"bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2"},[u("span",Zv,x(i.word),1),u("span",ex,x(i.definition),1)]))),128))])]))}},tx={class:"flex items-end gap-2 sm:gap-3 max-w-full sm:max-w-3xl"},rx={class:"flex items-center justify-center rounded-full size-8 sm:size-10 shrink-0 shadow-sm bg-slate-100 dark:bg-slate-800 text-xl sm:text-2xl"},ax={class:"flex flex-col gap-1 items-start"},ox={class:"text-text-muted dark:text-slate-400 text-[13px] font-medium ml-1"},ix={__name:"TypingIndicator",props:{character:{type:Object,required:!0}},setup(e){return(n,t)=>(L(),R("div",tx,[u("div",rx,x(e.character.avatar),1),u("div",ax,[u("span",ox,x(e.character.name),1),t[0]||(t[0]=Lh('<div class="p-3 sm:p-4 rounded-2xl rounded-bl-none bg-surface-light dark:bg-surface-dark shadow-sm border border-slate-100 dark:border-slate-700"><div class="flex gap-1"><span class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay:0ms;"></span><span class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay:150ms;"></span><span class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay:300ms;"></span></div></div>',1))])]))}},sx={class:"relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden"},lx={class:"absolute inset-0 overflow-hidden pointer-events-none"},cx={class:"confetti-container"},ux={class:"relative p-6 text-center"},dx={class:"text-6xl mb-4 animate-bounce"},hx={class:"text-2xl font-bold text-text-main dark:text-white mb-2"},fx={class:"inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50 mb-4"},px={class:"text-lg font-bold text-amber-700 dark:text-amber-300"},mx={class:"text-lg font-semibold text-amber-600 dark:text-amber-400"},gx={class:"text-sm text-text-muted dark:text-slate-400 mb-6"},yx={__name:"LevelUpModal",setup(e){const{t:n}=Re(),{showLevelUp:t,newRank:r,dismissLevelUp:a,progress:o}=jt();return(i,s)=>(L(),Ae(Cr,{to:"body"},[ve(Ft,{name:"modal"},{default:_t(()=>[g(t)&&g(r)?(L(),R("div",{key:0,class:"fixed inset-0 z-50 flex items-center justify-center p-4",onClick:s[1]||(s[1]=Zn((...l)=>g(a)&&g(a)(...l),["self"]))},[s[2]||(s[2]=u("div",{class:"absolute inset-0 bg-black/50 backdrop-blur-sm"},null,-1)),u("div",sx,[u("div",lx,[u("div",cx,[(L(),R(te,null,_e(20,l=>u("div",{key:l,class:"confetti",style:mn({"--delay":`${l*.1}s`,"--x":`${Math.random()*100}%`})},null,4)),64))])]),u("div",ux,[u("div",dx,x(g(r).icon),1),u("h2",hx,x(g(n)("rank.levelUp")),1),u("div",fx,[u("span",px," Lv."+x(g(r).level),1),u("span",mx,x(g(n)(`ranks.${g(r).title.toLowerCase()}`,g(r).title)),1)]),u("p",gx,x(g(n)("rank.totalXP",{xp:g(o).totalXP})),1),u("button",{onClick:s[0]||(s[0]=(...l)=>g(a)&&g(a)(...l)),class:"w-full py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-lg transition-all"},x(g(n)("rank.continue")),1)])])])):ae("",!0)]),_:1})]))}},vx=ct(yx,[["__scopeId","data-v-8522594d"]]),xx={class:"relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden"},bx={class:"absolute inset-0 overflow-hidden pointer-events-none"},wx={class:"fire-container"},_x={class:"relative p-6 text-center"},kx={class:"text-6xl mb-4 animate-bounce"},jx={class:"text-2xl font-bold text-text-main dark:text-white mb-2"},zx={class:"inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-900/50 dark:to-orange-900/50 mb-3"},Ix={class:"text-xl font-bold text-red-600 dark:text-red-400"},Sx={class:"text-lg font-semibold text-green-600 dark:text-green-400 mb-6"},Tx={__name:"StreakMilestoneModal",setup(e){const{t:n}=Re(),{showStreakMilestone:t,currentMilestone:r,dismissStreakMilestone:a}=jt();return(o,i)=>(L(),Ae(Cr,{to:"body"},[ve(Ft,{name:"modal"},{default:_t(()=>[g(t)&&g(r)?(L(),R("div",{key:0,class:"fixed inset-0 z-50 flex items-center justify-center p-4",onClick:i[1]||(i[1]=Zn((...s)=>g(a)&&g(a)(...s),["self"]))},[i[3]||(i[3]=u("div",{class:"absolute inset-0 bg-black/50 backdrop-blur-sm"},null,-1)),u("div",xx,[u("div",bx,[u("div",wx,[(L(),R(te,null,_e(15,s=>u("div",{key:s,class:"fire-particle",style:mn({"--delay":`${s*.15}s`,"--x":`${Math.random()*100}%`})},null,4)),64))])]),u("div",_x,[u("div",kx,x(g(r).icon),1),u("h2",jx,x(g(n)("rank.streakBonus")),1),u("div",zx,[i[2]||(i[2]=u("span",{class:"text-2xl"},"🔥",-1)),u("span",Ix,x(g(n)("rank.streakMilestone",{days:g(r).days})),1)]),u("div",Sx," +"+x(g(r).bonus)+" XP ",1),u("button",{onClick:i[0]||(i[0]=(...s)=>g(a)&&g(a)(...s)),class:"w-full py-3 px-6 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold shadow-lg transition-all"},x(g(n)("rank.continue")),1)])])])):ae("",!0)]),_:1})]))}},Ax=ct(Tx,[["__scopeId","data-v-2fac1a76"]]),Cx={class:"modal-content"},Ex={class:"celebration"},Lx={class:"badge-icon-large"},Px={class:"modal-title"},Nx={class:"achievement-info"},Mx={class:"achievement-title"},Ox={class:"achievement-desc"},Rx={class:"category-tag"},$x={__name:"AchievementUnlockModal",setup(e){const{showAchievementUnlock:n,newAchievement:t,dismissAchievementUnlock:r}=jt();function a(){r()}return(o,i)=>(L(),Ae(Cr,{to:"body"},[ve(Ft,{name:"modal"},{default:_t(()=>[g(n)&&g(t)?(L(),R("div",{key:0,class:"modal-overlay",onClick:Zn(a,["self"])},[u("div",Cx,[u("div",Ex,[(L(),R(te,null,_e(12,s=>u("span",{key:s,class:"confetti",style:mn({"--delay":`${s*.1}s`,"--rotation":`${Math.random()*360}deg`})},x(["🎉","✨","🌟","⭐"][s%4]),5)),64))]),u("div",Lx,x(g(t).icon),1),u("h2",Px,x(o.$t("achievements.unlocked")),1),u("div",Nx,[u("h3",Mx,x(o.$t(`achievements.${g(t).id}.title`)),1),u("p",Ox,x(o.$t(`achievements.${g(t).id}.description`)),1)]),u("span",Rx,x(o.$t(`achievements.categories.${g(t).category}`)),1),u("button",{onClick:a,class:"continue-btn"},x(o.$t("achievements.continue")),1)])])):ae("",!0)]),_:1})]))}},Dx=ct($x,[["__scopeId","data-v-8d586826"]]),Fx={class:"flex h-screen w-full overflow-hidden"},Wx={class:"flex flex-1 flex-col h-full relative bg-background-light dark:bg-background-dark"},Hx={class:"flex flex-col flex-1 overflow-hidden"},Ux={key:1,class:"flex items-center justify-between p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-xl"},Yx={__name:"ChatScreen",props:{character:Object,level:Object,language:{type:String,default:"en"},article:{type:Object,default:null},mode:{type:String,default:"free"}},emits:["back"],setup(e,{emit:n}){const{t}=Re(),r=e,a=n,o=ie(()=>r.mode==="article"&&r.article),i=ie(()=>({language:r.language,characterId:r.character.id,levelId:r.level.id,isArticleMode:o.value,articleId:r.article?.id})),s=Ug(i),{isLoading:l,sendMessage:c}=Kg(),{onMessageSent:d,onMessageReceived:h,onArticleStarted:f,trackCharacterInteraction:y}=jt(),k=B([]),I=B(""),P=B([]),v=B(""),j=B(!0),N=B(null),w=B(null);Bt(()=>{const X=s.load();X.messages.length>0?(k.value=X.messages,P.value=X.hints,_()):W(!0),o.value&&r.article&&f(r.article.id),s.autoSave(k,P)});async function _(){await na(),N.value&&(N.value.scrollTop=N.value.scrollHeight)}function S(){na(()=>{w.value?.focus()})}async function C(){const X=I.value.trim();!X||l.value||(k.value.push({role:"user",content:X}),I.value="",P.value=[],_(),d(),y(r.character.id),await W())}async function W(X=!1){v.value="";try{const $=await c({messages:k.value,characterId:r.character.id,levelId:r.level.id,language:r.language,isGreeting:X,article:o.value?r.article:null});k.value.push({role:"assistant",content:$.reply}),h(),$.hints.length>0&&(P.value=$.hints)}catch($){console.error("Chat error:",$),v.value=$.isRateLimit?t("chat.rateLimitError"):t("chat.genericError")}_(),S()}function F(){k.value=[],P.value=[],s.clear(),W(!0)}function q(){j.value=!j.value}return(X,$)=>(L(),R("div",Fx,[u("div",Wx,[ve(tv,{character:e.character,level:e.level,"is-article-mode":o.value,"show-article":j.value,"is-loading":g(l),onBack:$[0]||($[0]=Q=>a("back")),onToggleArticle:q,onRenewChat:F},null,8,["character","level","is-article-mode","show-article","is-loading"]),u("div",{class:Z(["flex flex-1 overflow-hidden",o.value&&j.value?"flex-col lg:flex-row":"flex-col"])},[o.value&&j.value?(L(),Ae(nx,{key:0,article:e.article},null,8,["article"])):ae("",!0),u("div",Hx,[u("div",{ref_key:"messagesContainer",ref:N,class:"flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 space-y-6 scroll-smooth"},[$[3]||($[3]=u("div",{class:"flex justify-center"},[u("span",{class:"text-xs font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full"},"Today")],-1)),(L(!0),R(te,null,_e(k.value,(Q,ce)=>(L(),Ae(fv,{key:ce,message:Q,character:e.character},null,8,["message","character"]))),128)),g(l)?(L(),Ae(ix,{key:0,character:e.character},null,8,["character"])):ae("",!0),v.value?(L(),R("div",Ux,[u("span",null,x(v.value),1),u("button",{onClick:$[1]||($[1]=Q=>v.value=""),class:"material-symbols-outlined text-lg"},"close")])):ae("",!0),o.value?ae("",!0):(L(),Ae(Av,{key:2,hints:P.value},null,8,["hints"])),$[4]||($[4]=u("div",{class:"h-4"},null,-1))],512),ve(xv,{ref_key:"chatInputRef",ref:w,modelValue:I.value,"onUpdate:modelValue":$[2]||($[2]=Q=>I.value=Q),disabled:g(l),onSend:C},null,8,["modelValue","disabled"])])],2)]),ve(vx),ve(Ax),ve(Dx)]))}},Us={en:[{id:"benefits_of_remote_work",topic_id:"benefits_of_remote_work",levels:{beginner:{title:"Working From Home Is Good",content:"Many people do not go to the [[office]] anymore. They work from their houses. This is called remote work. It has many good points. First, you do not need to drive or take a bus every day. This saves a lot of time. You can wake up later. Second, you can make your own [[schedule]]. You can work when you have energy. Finally, your home is usually quiet. It is very [[comfortable]] to sit on your own chair. You can wear soft clothes. Remote work makes life easier for many employees.",ai_opening_line:"Do you like working in your pajamas? Let's talk about working from home!",vocabulary:[{word:"office",definition:"A building or room where people work.",explanation:"This is a very common noun for a place of business.",example:"My father goes to his office at 8:00 AM every morning."},{word:"schedule",definition:"A plan of what time you will do things.",explanation:"We use this word to talk about our daily plan or calendar.",example:"I need to check my schedule before I meet you for lunch."},{word:"comfortable",definition:"Making you feel relaxed and good physically.",explanation:"This describes how a chair, bed, or piece of clothing feels.",example:"This new sofa is very soft and comfortable."}]},intermediate:{title:"The Freedom of Remote Work",content:'In recent years, working from home has become incredibly popular. It offers a [[flexible]] lifestyle that many people enjoy. You no longer have to rush to catch a train or sit in heavy traffic. Instead, you can start your day calmly and save money on gas or tickets. Furthermore, many studies show that [[productivity]] actually increases when people work from home. Without the typical distractions of a busy workplace, such as loud meetings or chatting colleagues, it is easier to finish tasks quickly. However, there is a significant [[drawback]] to this style of working. It can be hard to separate your job from your personal life. If you are not careful, you might [[burn out]] because you feel like you are always "on the clock." To avoid this, successful remote workers set strict boundaries. They take regular breaks and fully turn off their notifications at 5 PM. Despite the social isolation some feel, most professionals agree that the work-life balance is a major advantage.',ai_opening_line:"Working from home isn't just about comfort; it's about freedom. But is it always easy?",vocabulary:[{word:"flexible",definition:"Able to change easily according to the situation.",explanation:"Often used to describe work hours or plans that aren't strict.",example:"My boss is very flexible, so I can leave work early for my doctor's appointment."},{word:"productivity",definition:"The rate at which work or goods are produced.",explanation:"This is a key business term regarding how much work you get done.",example:"Drinking coffee in the morning helps increase my productivity."},{word:"drawback",definition:"A disadvantage or negative part of a situation.",explanation:"A useful synonym for 'disadvantage' or 'con'.",example:"The only drawback of living in the city is the noise."},{word:"burn out",definition:"To become extremely tired or sick from working too hard.",explanation:"A very common phrasal verb regarding mental health and work.",example:"If you study every night without sleeping, you will burn out before the exam."}]},advanced:{title:"The Paradigm Shift of the Digital Workplace",content:`The contemporary corporate landscape has undergone a fundamental [[paradigm shift]] regarding the necessity of physical presence. Once viewed merely as a temporary contingency measure, remote work has evolved into a [[ubiquitous]] feature of the modern global economy, challenging traditional notions of professionalism. Proponents champion this model because it grants employees unprecedented [[autonomy]], allowing them to meticulously tailor their environments to suit their specific cognitive needs. This customization often results in optimized output and, arguably, higher retention rates for companies that embrace trust over surveillance.

However, the narrative is not without its complexities. Sociologists and managers alike warn that the cessation of face-to-face interaction can erode the subtle fabric of corporate culture and stifle serendipitous innovation—those "water cooler moments" that often lead to breakthroughs. Furthermore, the digital tether to the office can severely [[blur]] the distinct lines between professional obligations and domestic sanctity. When the living room becomes the boardroom, the psychological intrusion can [[exacerbate]] feelings of anxiety, as individuals struggle to mentally disconnect from their duties. Consequently, the optimal solution for the future likely lies not in a binary choice, but in a nuanced hybrid approach that harmonizes the focused efficiency of solitude with the collaborative vitality of shared physical spaces.`,ai_opening_line:"Has the definition of 'the workplace' changed forever? Let's analyze the deeper implications.",vocabulary:[{word:"paradigm shift",definition:"A fundamental change in approach or underlying assumptions.",explanation:"Used in academic or formal contexts to describe a major change in how society thinks.",example:"The invention of the smartphone caused a paradigm shift in how we communicate."},{word:"ubiquitous",definition:"Present, appearing, or found everywhere.",explanation:"A sophisticated adjective for something that is very common or universal.",example:"Coffee shops have become ubiquitous in almost every major city."},{word:"autonomy",definition:"The right or condition of self-government; freedom from external control.",explanation:"Often used regarding independence in the workplace or politics.",example:"Senior managers usually have more autonomy than entry-level employees."},{word:"blur",definition:"To make or become unclear or less distinct.",explanation:"Used metaphorically here to describe boundaries disappearing.",example:"The long hours caused the days to blur together into one endless week."},{word:"exacerbate",definition:"To make a problem, bad situation, or negative feeling worse.",explanation:"A precise verb for describing the escalation of a negative issue.",example:"Scratching the bug bite will only exacerbate the itching and redness."}]}}}],ja:[{id:"benefits_of_remote_work",topic_id:"benefits_of_remote_work",levels:{beginner:{title:"在宅勤務は良いこと",content:"多くの人はもう[[オフィス]]に行きません。自分の家で働きます。これはリモートワークと呼ばれています。良い点がたくさんあります。まず、毎日車を運転したりバスに乗ったりする必要がありません。これで時間を大幅に節約できます。遅く起きることもできます。次に、自分の[[スケジュール]]を作ることができます。元気なときに働くことができます。最後に、自宅は通常静かです。自分の椅子に座るのはとても[[快適]]です。柔らかい服を着ることができます。リモートワークは多くの従業員の生活を楽にします。",ai_opening_line:"パジャマで働くのは好きですか？在宅勤務について話しましょう！",vocabulary:[{word:"オフィス",definition:"人々が働く建物や部屋。",explanation:"ビジネスの場所を表す非常に一般的な名詞です。",example:"父は毎朝8時にオフィスに行きます。"},{word:"スケジュール",definition:"何をいつするかの計画。",explanation:"日々の予定やカレンダーについて話すときに使います。",example:"ランチで会う前にスケジュールを確認する必要があります。"},{word:"快適",definition:"リラックスして体が気持ち良い状態。",explanation:"椅子、ベッド、衣服の感じを表します。",example:"この新しいソファはとても柔らかくて快適です。"}]},intermediate:{title:"リモートワークの自由",content:"近年、在宅勤務は非常に人気があります。多くの人が楽しむ[[柔軟]]なライフスタイルを提供します。電車に乗るために急いだり、渋滞に座ったりする必要がなくなりました。代わりに、穏やかに一日を始め、ガソリン代やチケット代を節約できます。さらに、多くの研究によると、在宅勤務では[[生産性]]が実際に向上します。うるさい会議やおしゃべりな同僚など、忙しい職場の典型的な気が散る要因がなければ、タスクを素早く終わらせやすくなります。しかし、この働き方には重大な[[欠点]]があります。仕事と私生活を分けるのが難しい場合があります。注意しないと、常に「勤務中」のように感じて[[燃え尽きる]]かもしれません。これを避けるために、成功したリモートワーカーは厳格な境界を設けます。定期的に休憩を取り、午後5時には通知を完全にオフにします。社会的孤立を感じる人もいますが、ほとんどの専門家はワークライフバランスが大きな利点であることに同意しています。",ai_opening_line:"在宅勤務は快適さだけではありません。自由についてです。でも、いつも簡単ですか？",vocabulary:[{word:"柔軟",definition:"状況に応じて簡単に変えられる。",explanation:"厳格でない勤務時間や計画を説明するときによく使います。",example:"上司はとても柔軟なので、医者の予約のために早く退社できます。"},{word:"生産性",definition:"仕事や商品が生産される速度。",explanation:"どれだけ仕事をこなすかに関する重要なビジネス用語です。",example:"朝コーヒーを飲むと生産性が上がります。"},{word:"欠点",definition:"状況の不利な点やマイナス面。",explanation:"「デメリット」や「短所」の便利な類義語です。",example:"都会に住む唯一の欠点は騒音です。"},{word:"燃え尽きる",definition:"働きすぎて極度に疲れたり病気になったりすること。",explanation:"メンタルヘルスと仕事に関する非常に一般的な句動詞です。",example:"毎晩寝ずに勉強すると、試験前に燃え尽きてしまいます。"}]},advanced:{title:"デジタルワークプレイスのパラダイムシフト",content:`現代の企業環境は、物理的な存在の必要性に関して根本的な[[パラダイムシフト]]を経験しています。かつては一時的な緊急措置としてのみ見られていたリモートワークは、現代のグローバル経済の[[普遍的]]な特徴へと進化し、プロフェッショナリズムの伝統的な概念に挑戦しています。支持者がこのモデルを推進するのは、従業員に前例のない[[自律性]]を与え、特定の認知的ニーズに合わせて環境を細心の注意を払って調整できるようにするからです。このカスタマイズにより、最適化された成果が得られ、監視よりも信頼を重視する企業では、おそらくより高い定着率が得られます。

しかし、この話は複雑さがないわけではありません。社会学者と管理者は同様に、対面でのやり取りの中止が企業文化の微妙な構造を侵食し、偶発的なイノベーション—ブレークスルーにつながることが多い「ウォータークーラーの瞬間」—を抑制する可能性があると警告しています。さらに、オフィスへのデジタルな繋がりは、職業上の義務と家庭の神聖さの間の明確な境界線を著しく[[曖昧に]]する可能性があります。リビングルームが会議室になると、心理的な侵入が不安感を[[悪化させる]]可能性があり、個人は職務から精神的に切り離すのに苦労します。したがって、将来の最適な解決策は、二者択一ではなく、孤独の集中した効率性と共有された物理的空間の協力的な活力を調和させる、微妙なハイブリッドアプローチにあると思われます。`,ai_opening_line:"「職場」の定義は永遠に変わったのでしょうか？より深い意味を分析しましょう。",vocabulary:[{word:"パラダイムシフト",definition:"アプローチや根本的な前提の根本的な変化。",explanation:"社会の考え方の大きな変化を説明するために、学術的または正式な文脈で使用されます。",example:"スマートフォンの発明は、私たちのコミュニケーション方法にパラダイムシフトを引き起こしました。"},{word:"普遍的",definition:"どこにでも存在し、見られる。",explanation:"非常に一般的または普遍的なものを表す洗練された形容詞です。",example:"コーヒーショップはほぼすべての主要都市で普遍的になっています。"},{word:"自律性",definition:"自己統治の権利または状態；外部からのコントロールからの自由。",explanation:"職場や政治における独立性に関してよく使われます。",example:"上級管理職は通常、新入社員よりも多くの自律性を持っています。"},{word:"曖昧に",definition:"不明確または区別がつかなくなること。",explanation:"ここでは境界が消えることを比喩的に表現するために使われています。",example:"長時間労働のため、日々が一つの終わりのない週に曖昧になりました。"},{word:"悪化させる",definition:"問題、悪い状況、または否定的な感情をさらに悪くすること。",explanation:"否定的な問題のエスカレーションを説明するための正確な動詞です。",example:"虫刺されを掻くと、かゆみと赤みを悪化させるだけです。"}]}}}]},Bx={class:"min-h-screen bg-background-light dark:bg-background-dark"},qx={class:"sticky top-0 z-10 flex items-center gap-4 px-4 sm:px-6 py-4 bg-surface-light dark:bg-surface-dark border-b border-[#e7eff3] dark:border-slate-800 shadow-sm"},Vx={class:"text-lg font-bold text-text-main dark:text-white"},Kx={class:"px-4 sm:px-6 py-3 bg-slate-50 dark:bg-slate-900 border-b border-[#e7eff3] dark:border-slate-800"},Gx={class:"text-sm text-text-muted dark:text-slate-400"},Xx={class:"ml-2 text-sm px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 font-medium"},Jx={class:"p-4 sm:p-6 max-w-3xl mx-auto"},Qx={class:"grid gap-4"},Zx=["onClick"],eb={class:"font-bold text-lg text-text-main dark:text-white mb-2"},nb={class:"text-sm text-text-muted dark:text-slate-400 mb-4 line-clamp-2"},tb={class:"flex flex-wrap gap-2"},rb={class:"text-xs text-text-muted dark:text-slate-500"},ab=["title"],ob={key:0,class:"text-center py-12"},ib={class:"text-text-muted dark:text-slate-400"},sb={__name:"ArticleScreen",props:{level:Object},emits:["select","back"],setup(e,{emit:n}){const{t,locale:r}=Re(),a=n,o=e,i=ie(()=>{const d=r.value||"en";return Us[d]||Us.en||[]}),s=ie(()=>o.level?i.value.map(d=>{const h=d.levels[o.level.id];return h?{id:d.id,topic_id:d.topic_id,levelId:o.level.id,title:h.title,content:h.content,ai_opening_line:h.ai_opening_line,vocabulary:h.vocabulary}:null}).filter(Boolean):[]);function l(d){a("select",d)}function c(d){return Lv(d).substring(0,120)}return(d,h)=>(L(),R("div",Bx,[u("header",qx,[u("button",{onClick:h[0]||(h[0]=f=>a("back")),class:"flex items-center justify-center"},[...h[1]||(h[1]=[u("span",{class:"material-symbols-outlined text-text-main dark:text-white cursor-pointer"},"arrow_back",-1)])]),u("h1",Vx,x(g(t)("articles.title")),1)]),u("div",Kx,[u("span",Gx,x(g(t)("articles.levelLabel"))+": ",1),u("span",Xx,x(g(t)(`levels.${e.level.id}.name`)),1)]),u("div",Jx,[u("div",Qx,[(L(!0),R(te,null,_e(s.value,f=>(L(),R("div",{key:f.id,onClick:y=>l(f),class:"p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-surface-light dark:bg-surface-dark cursor-pointer transition-all hover:border-primary/50 hover:shadow-md"},[u("h3",eb,x(f.title),1),u("p",nb,x(c(f.content))+"...",1),u("div",tb,[u("span",rb,x(g(t)("articles.keyWords"))+":",1),(L(!0),R(te,null,_e(f.vocabulary.slice(0,3),y=>(L(),R("span",{key:y.word,class:"text-xs px-2 py-1 rounded-md bg-primary/10 text-primary font-medium",title:y.definition},x(y.word),9,ab))),128))])],8,Zx))),128)),s.value.length===0?(L(),R("div",ob,[h[2]||(h[2]=u("span",{class:"material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-4"},"article",-1)),u("p",ib,x(g(t)("articles.noArticles")),1)])):ae("",!0)])])]))}},Gc="chatmate_learningProgress",Ys={chapters:{},stats:{totalQuizzesPassed:0,totalConversationsCompleted:0}};function lb(){try{const e=localStorage.getItem(Gc);return e?JSON.parse(e):{...Ys}}catch(e){return console.error("Failed to load learning progress:",e),{...Ys}}}function cb(e){try{localStorage.setItem(Gc,JSON.stringify(e))}catch(n){console.error("Failed to save learning progress:",n)}}const nn=B(lb());function Bs(e){return nn.value.chapters[e]||(nn.value.chapters[e]={quizCompleted:!1,quizScore:0,quizBestScore:0,conversationCompleted:!1}),nn.value.chapters[e]}function eo(){cb(nn.value)}function di(){function e(c,d,h){const f=Bs(c),y=Math.round(d/h*100);return y>f.quizBestScore&&(f.quizBestScore=y),f.quizScore=y,y>=60&&!f.quizCompleted&&(f.quizCompleted=!0,nn.value.stats.totalQuizzesPassed++),eo(),{percentage:y,passed:y>=60}}function n(c){return nn.value.chapters[c]?.quizCompleted||!1}function t(c){return nn.value.chapters[c]?.quizBestScore||0}function r(c){const d=Bs(c);d.conversationCompleted||(d.conversationCompleted=!0,nn.value.stats.totalConversationsCompleted++,eo())}function a(c){return nn.value.chapters[c]?.conversationCompleted||!1}function o(c){const d=nn.value.chapters[c];return d?d.quizCompleted&&d.conversationCompleted:!1}function i(c){const d=nn.value.chapters[c];return d?{quiz:d.quizCompleted,conversation:d.conversationCompleted,complete:d.quizCompleted&&d.conversationCompleted,quizBestScore:d.quizBestScore||0}:{quiz:!1,conversation:!1,complete:!1,quizBestScore:0}}const s=ie(()=>nn.value.stats);function l(){nn.value={chapters:{},stats:{totalQuizzesPassed:0,totalConversationsCompleted:0}},eo()}return{markQuizCompleted:e,isQuizCompleted:n,getQuizBestScore:t,markConversationCompleted:r,isConversationCompleted:a,isChapterCompleted:o,getChapterCompletionStatus:i,stats:s,resetProgress:l}}const ub=`# Chapter: Week 7 - City & Transportation
meta:
  id: city-and-transportation
  title:
    en: "City & Transportation"
    ja: "街と交通"
    zh: "城市與交通"
  description:
    en: "Getting around town and asking for directions."
    ja: "街を歩いて道を尋ねましょう。"
    zh: "學習在城市中移動和問路。"
  icon: "🚌"
  order: 7
  level: beginner

words:
  # Day 1: Core Nouns (City Objects)
  - id: city
    word:
      en: City
      ja: 都市
      zh: 城市
    reading: "SIT-ee"
    phonetic: "/ˈsɪti/"
    description:
      en: "Large town with many buildings."
      ja: "多くの建物がある大きな町。"
      zh: "有很多建築物的大城鎮。"
    sentence:
      en: "I am new in this city."
      ja: "この街に来たばかりです。"
      zh: "我剛來這座城市。"

  - id: street
    word:
      en: Street
      ja: 通り
      zh: 街道
    reading: "STREET"
    phonetic: "/striːt/"
    description:
      en: "Where cars drive."
      ja: "車が走る場所。"
      zh: "車子行駛的地方。"
    sentence:
      en: "I walk down the street."
      ja: "通りを歩きます。"
      zh: "我沿著街道走。"

  - id: station
    word:
      en: Station
      ja: 駅
      zh: 車站
    reading: "STAY-shun"
    phonetic: "/ˈsteɪʃən/"
    description:
      en: "Train or bus stop building."
      ja: "電車やバスの停留所の建物。"
      zh: "火車或公車站的建築物。"
    sentence:
      en: "The station is near the bank."
      ja: "駅は銀行の近くにあります。"
      zh: "車站在銀行附近。"

  - id: ticket
    word:
      en: Ticket
      ja: 切符
      zh: 車票
    reading: "TIK-it"
    phonetic: "/ˈtɪkɪt/"
    description:
      en: "Paper to pay for ride."
      ja: "乗車料金を支払うための紙。"
      zh: "付錢搭乘的紙張。"
    sentence:
      en: "I need to buy a ticket for the train."
      ja: "電車の切符を買う必要があります。"
      zh: "我需要買火車票。"

  - id: traffic-light
    word:
      en: Traffic Light
      ja: 信号機
      zh: 紅綠燈
    reading: "TRAF-ik lyt"
    phonetic: "/ˈtræfɪk laɪt/"
    description:
      en: "Red, Yellow, Green signal."
      ja: "赤、黄、緑の信号。"
      zh: "紅、黃、綠的號誌。"
    sentence:
      en: "We wait for the green traffic light."
      ja: "緑の信号を待ちます。"
      zh: "我們等綠燈。"

  - id: map
    word:
      en: Map
      ja: 地図
      zh: 地圖
    reading: "MAP"
    phonetic: "/mæp/"
    description:
      en: "Drawing of the area."
      ja: "地域の図。"
      zh: "區域的圖畫。"
    sentence:
      en: "I have a map on my phone."
      ja: "スマホに地図があります。"
      zh: "我手機上有地圖。"

  - id: corner
    word:
      en: Corner
      ja: 角
      zh: 轉角
    reading: "KOR-ner"
    phonetic: "/ˈkɔːrnər/"
    description:
      en: "Where two streets meet."
      ja: "二つの通りが交わる場所。"
      zh: "兩條街道交會的地方。"
    sentence:
      en: "Please turn left at the corner."
      ja: "角を左に曲がってください。"
      zh: "請在轉角左轉。"

  # Day 2: Core Verbs (Movement)
  - id: drive
    word:
      en: Drive
      ja: 運転する
      zh: 開車
    reading: "DRYV"
    phonetic: "/draɪv/"
    description:
      en: "Control a car."
      ja: "車を運転する。"
      zh: "駕駛汽車。"
    sentence:
      en: "Drive carefully on this road."
      ja: "この道は注意して運転してください。"
      zh: "在這條路上小心開車。"

  - id: ride
    word:
      en: Ride
      ja: 乗る
      zh: 搭乘
    reading: "RYD"
    phonetic: "/raɪd/"
    description:
      en: "Travel on a bike/bus/train."
      ja: "自転車/バス/電車に乗る。"
      zh: "搭乘腳踏車/公車/火車。"
    sentence:
      en: "I ride for ten minutes."
      ja: "10分間乗ります。"
      zh: "我搭乘十分鐘。"

  - id: walk
    word:
      en: Walk
      ja: 歩く
      zh: 走路
    reading: "WAWK"
    phonetic: "/wɔːk/"
    description:
      en: "Go on foot."
      ja: "歩いて行く。"
      zh: "步行。"
    sentence:
      en: "It is a 5-minute walk."
      ja: "歩いて5分です。"
      zh: "走路5分鐘。"

  - id: turn
    word:
      en: Turn
      ja: 曲がる
      zh: 轉彎
    reading: "TURN"
    phonetic: "/tɜːrn/"
    description:
      en: "Change direction - Left/Right."
      ja: "方向を変える - 左/右。"
      zh: "改變方向 - 左/右。"
    sentence:
      en: "Turn right at the traffic light."
      ja: "信号を右に曲がってください。"
      zh: "在紅綠燈右轉。"

  - id: stop
    word:
      en: Stop
      ja: 止まる
      zh: 停止
    reading: "STOP"
    phonetic: "/stɑːp/"
    description:
      en: "Do not move."
      ja: "動かない。"
      zh: "不要移動。"
    sentence:
      en: "Get off at the next stop."
      ja: "次の停留所で降りてください。"
      zh: "在下一站下車。"

  - id: cross
    word:
      en: Cross
      ja: 渡る
      zh: 穿越
    reading: "KROSS"
    phonetic: "/krɔːs/"
    description:
      en: "Go to the other side of the street."
      ja: "通りの反対側に行く。"
      zh: "走到街道的另一邊。"
    sentence:
      en: "Let's cross the street here."
      ja: "ここで通りを渡りましょう。"
      zh: "我們在這裡過馬路吧。"

  - id: get-off
    word:
      en: Get off
      ja: 降りる
      zh: 下車
    reading: "GET off"
    phonetic: "/ɡet ɔːf/"
    description:
      en: "Leave a bus/train."
      ja: "バス/電車から降りる。"
      zh: "離開公車/火車。"
    sentence:
      en: "I get off at the big corner."
      ja: "大きな角で降ります。"
      zh: "我在大轉角下車。"

chat:
  conversations:
    - id: scenario-1-new-in-city
      title:
        en: "New in the City"
        ja: "街に来たばかり"
        zh: "初來城市"
      messages:
        - role: partner
          text:
            en: "How do you get around in this city?"
            ja: "この街ではどうやって移動しますか？"
            zh: "你在這座城市怎麼移動？"
        - role: user
          text:
            en: "I am new in this city. I have a map on my phone."
            ja: "この街に来たばかりです。スマホに地図があります。"
            zh: "我剛來這座城市。我手機上有地圖。"
        - role: partner
          text:
            en: "Where do you want to go?"
            ja: "どこに行きたいですか？"
            zh: "你想去哪裡？"
        - role: user
          text:
            en: "I want to go to the museum."
            ja: "博物館に行きたいです。"
            zh: "我想去博物館。"
        - role: partner
          text:
            en: "How will you get there?"
            ja: "どうやって行きますか？"
            zh: "你怎麼去那裡？"
        - role: user
          text:
            en: "I walk to the bus stop and wait. When the bus comes, I pay for a ticket."
            ja: "バス停まで歩いて待ちます。バスが来たら、切符を買います。"
            zh: "我走到公車站等待。公車來了，我買票。"
        - role: partner
          text:
            en: "How long is the ride?"
            ja: "どのくらい乗りますか？"
            zh: "要搭多久？"
        - role: user
          text:
            en: "I ride for ten minutes. I get off at the big corner."
            ja: "10分間乗ります。大きな角で降ります。"
            zh: "我搭十分鐘。我在大轉角下車。"
        - role: partner
          text:
            en: "And then?"
            ja: "それから？"
            zh: "然後呢？"
        - role: user
          text:
            en: "I cross the street and I see the building."
            ja: "通りを渡ると、建物が見えます。"
            zh: "我過馬路，就看到那棟建築物。"

    - id: scenario-2-asking-directions
      title:
        en: "Asking for Directions"
        ja: "道を尋ねる"
        zh: "問路"
      messages:
        - role: partner
          text:
            en: "Excuse me. I am lost."
            ja: "すみません。道に迷いました。"
            zh: "不好意思。我迷路了。"
        - role: user
          text:
            en: "Where do you want to go?"
            ja: "どこに行きたいですか？"
            zh: "你想去哪裡？"
        - role: partner
          text:
            en: "I am looking for the Central Station."
            ja: "中央駅を探しています。"
            zh: "我在找中央車站。"
        - role: user
          text:
            en: "It is very close. Go straight on this street."
            ja: "とても近いですよ。この通りをまっすぐ行ってください。"
            zh: "很近。沿著這條街直走。"
        - role: partner
          text:
            en: "Do I turn anywhere?"
            ja: "どこかで曲がりますか？"
            zh: "我需要轉彎嗎？"
        - role: user
          text:
            en: "Yes, turn right at the traffic light. You will see it."
            ja: "はい、信号を右に曲がってください。見えますよ。"
            zh: "是的，在紅綠燈右轉。你就會看到了。"
        - role: partner
          text:
            en: "Is it far?"
            ja: "遠いですか？"
            zh: "遠嗎？"
        - role: user
          text:
            en: "No, it is a 5-minute walk."
            ja: "いいえ、歩いて5分です。"
            zh: "不遠，走路5分鐘。"

    - id: scenario-3-questions-answers
      title:
        en: "Direction Questions"
        ja: "道案内の質問"
        zh: "方向問答"
      messages:
        - role: partner
          text:
            en: "Where is the station?"
            ja: "駅はどこですか？"
            zh: "車站在哪裡？"
        - role: user
          text:
            en: "Go straight and turn right."
            ja: "まっすぐ行って右に曲がってください。"
            zh: "直走然後右轉。"
        - role: partner
          text:
            en: "How do I get to the park?"
            ja: "公園にはどうやって行きますか？"
            zh: "我怎麼去公園？"
        - role: user
          text:
            en: "You can take the number 5 bus."
            ja: "5番のバスに乗れます。"
            zh: "你可以搭5號公車。"
        - role: partner
          text:
            en: "Where do I get off?"
            ja: "どこで降りますか？"
            zh: "我在哪裡下車？"
        - role: user
          text:
            en: "Get off at the next stop."
            ja: "次の停留所で降りてください。"
            zh: "在下一站下車。"
        - role: partner
          text:
            en: "Should I take the bus or the train?"
            ja: "バスと電車、どちらに乗ればいいですか？"
            zh: "我該搭公車還是火車？"
        - role: user
          text:
            en: "Take the subway. It is faster."
            ja: "地下鉄に乗ってください。そっちの方が速いです。"
            zh: "搭地鐵。比較快。"
        - role: partner
          text:
            en: "Thank you! Go straight, right?"
            ja: "ありがとうございます！まっすぐですね？"
            zh: "謝謝！直走對嗎？"
        - role: user
          text:
            en: "Yes, go straight, then go left at the corner."
            ja: "はい、まっすぐ行って、角を左に曲がってください。"
            zh: "是的，直走，然後在轉角左轉。"

quiz:
  questionsPerRound: 5
  xpReward: 20
`,db=`# Chapter: Week 5 - Clothes & Shopping
meta:
  id: clothes-and-shopping
  title:
    en: "Clothes & Shopping"
    ja: "服とショッピング"
    zh: "服裝與購物"
  description:
    en: "Describing what you wear and buying new things."
    ja: "着ているものを説明し、新しいものを買いましょう。"
    zh: "學習描述你穿什麼以及購買新東西。"
  icon: "👕"
  order: 5
  level: beginner

words:
  # Day 1: Core Nouns (Clothing & Money)
  - id: shirt
    word:
      en: Shirt
      ja: シャツ
      zh: 襯衫
    reading: "SHURT"
    phonetic: "/ʃɜːrt/"
    description:
      en: "Top clothing."
      ja: "上半身の服。"
      zh: "上衣。"
    sentence:
      en: "I wear a blue shirt to work."
      ja: "私は仕事に青いシャツを着ていきます。"
      zh: "我穿藍色襯衫去上班。"

  - id: pants
    word:
      en: Pants
      ja: ズボン
      zh: 褲子
    reading: "PANTS"
    phonetic: "/pænts/"
    description:
      en: "Leg clothing."
      ja: "脚を覆う服。"
      zh: "腿部的衣服。"
    sentence:
      en: "Can I try on these pants?"
      ja: "このズボンを試着してもいいですか？"
      zh: "我可以試穿這條褲子嗎？"

  - id: shoes
    word:
      en: Shoes
      ja: 靴
      zh: 鞋子
    reading: "SHOOZ"
    phonetic: "/ʃuːz/"
    description:
      en: "Footwear."
      ja: "足に履くもの。"
      zh: "穿在腳上的。"
    sentence:
      en: "I need new shoes."
      ja: "新しい靴が必要です。"
      zh: "我需要新鞋子。"

  - id: jacket
    word:
      en: Jacket
      ja: ジャケット
      zh: 夾克
    reading: "JAK-it"
    phonetic: "/ˈdʒækɪt/"
    description:
      en: "Outerwear for cold."
      ja: "寒い時の上着。"
      zh: "寒冷時穿的外套。"
    sentence:
      en: "I want to buy this jacket."
      ja: "このジャケットを買いたいです。"
      zh: "我想買這件夾克。"

  - id: size
    word:
      en: Size
      ja: サイズ
      zh: 尺寸
    reading: "SYZ"
    phonetic: "/saɪz/"
    description:
      en: "Small, Medium, Large."
      ja: "S、M、L。"
      zh: "小、中、大。"
    sentence:
      en: "What size do you have?"
      ja: "どのサイズがありますか？"
      zh: "你們有什麼尺寸？"

  - id: price
    word:
      en: Price
      ja: 価格
      zh: 價格
    reading: "PRYS"
    phonetic: "/praɪs/"
    description:
      en: "How much money."
      ja: "いくらか。"
      zh: "多少錢。"
    sentence:
      en: "I look at the tag, the price is good."
      ja: "タグを見ると、価格がいいです。"
      zh: "我看了標籤，價格不錯。"

  - id: cash
    word:
      en: Cash
      ja: 現金
      zh: 現金
    reading: "KASH"
    phonetic: "/kæʃ/"
    description:
      en: "Paper money and coins."
      ja: "紙幣と硬貨。"
      zh: "紙鈔和硬幣。"
    sentence:
      en: "I pay with cash."
      ja: "現金で払います。"
      zh: "我用現金付款。"

  # Day 2: Core Verbs (Shopping Actions)
  - id: wear
    word:
      en: Wear
      ja: 着る
      zh: 穿
    reading: "WAIR"
    phonetic: "/wer/"
    description:
      en: "Have clothes on body."
      ja: "体に服をつける。"
      zh: "把衣服穿在身上。"
    sentence:
      en: "I am wearing a white T-shirt and jeans."
      ja: "白いTシャツとジーンズを着ています。"
      zh: "我穿著白色T恤和牛仔褲。"

  - id: buy
    word:
      en: Buy
      ja: 買う
      zh: 買
    reading: "BY"
    phonetic: "/baɪ/"
    description:
      en: "Exchange money for item."
      ja: "お金と品物を交換する。"
      zh: "用錢換取物品。"
    sentence:
      en: "I will buy them."
      ja: "それらを買います。"
      zh: "我要買它們。"

  - id: try-on
    word:
      en: Try on
      ja: 試着する
      zh: 試穿
    reading: "TRY on"
    phonetic: "/traɪ ɒn/"
    description:
      en: "Test if clothes fit."
      ja: "服が合うか試す。"
      zh: "試試衣服合不合身。"
    sentence:
      en: "I take it to the fitting room to try on."
      ja: "試着室に持っていって試着します。"
      zh: "我拿到試衣間試穿。"

  - id: look-for
    word:
      en: Look for
      ja: 探す
      zh: 尋找
    reading: "LOOK for"
    phonetic: "/lʊk fɔːr/"
    description:
      en: "Search."
      ja: "探す。"
      zh: "搜尋。"
    sentence:
      en: "I am looking for a new jacket."
      ja: "新しいジャケットを探しています。"
      zh: "我在找一件新夾克。"

  - id: cost
    word:
      en: Cost
      ja: 値段がする
      zh: 花費
    reading: "KAWST"
    phonetic: "/kɔːst/"
    description:
      en: "Have a price."
      ja: "値段がある。"
      zh: "有價格。"
    sentence:
      en: "It costs fifty dollars."
      ja: "50ドルします。"
      zh: "它要五十美元。"

  - id: fit
    word:
      en: Fit
      ja: 合う
      zh: 合身
    reading: "FIT"
    phonetic: "/fɪt/"
    description:
      en: "Is the right size."
      ja: "サイズが合う。"
      zh: "尺寸剛好。"
    sentence:
      en: "It fits perfectly."
      ja: "ぴったり合います。"
      zh: "非常合身。"

  - id: need
    word:
      en: Need
      ja: 必要とする
      zh: 需要
    reading: "NEED"
    phonetic: "/niːd/"
    description:
      en: "Must have."
      ja: "必要がある。"
      zh: "必須有。"
    sentence:
      en: "I need new shoes."
      ja: "新しい靴が必要です。"
      zh: "我需要新鞋子。"

chat:
  conversations:
    - id: scenario-1-shopping-story
      title:
        en: "Going Shopping"
        ja: "買い物に行く"
        zh: "去購物"
      messages:
        - role: partner
          text:
            en: "What are you doing today?"
            ja: "今日は何をしますか？"
            zh: "你今天要做什麼？"
        - role: user
          text:
            en: "Today I go shopping. I am looking for a new jacket."
            ja: "今日は買い物に行きます。新しいジャケットを探しています。"
            zh: "今天我去購物。我在找一件新夾克。"
        - role: partner
          text:
            en: "Did you find something you like?"
            ja: "気に入ったものは見つかりましたか？"
            zh: "你找到喜歡的東西了嗎？"
        - role: user
          text:
            en: "Yes, I enter a store and see a nice one. It is blue."
            ja: "はい、お店に入って素敵なのを見つけました。青いです。"
            zh: "是的，我進了一家店，看到一件不錯的。是藍色的。"
        - role: partner
          text:
            en: "Did you try it on?"
            ja: "試着しましたか？"
            zh: "你試穿了嗎？"
        - role: user
          text:
            en: "Yes, I take it to the fitting room to try on. It fits perfectly."
            ja: "はい、試着室で試着しました。ぴったり合います。"
            zh: "是的，我拿到試衣間試穿。非常合身。"
        - role: partner
          text:
            en: "How much does it cost?"
            ja: "いくらですか？"
            zh: "多少錢？"
        - role: user
          text:
            en: "I look at the tag, the price is good. I go to the cashier and pay with cash."
            ja: "タグを見ると、価格がいいです。レジに行って現金で払います。"
            zh: "我看了標籤，價格不錯。我去收銀台用現金付款。"

    - id: scenario-2-at-shoe-store
      title:
        en: "At the Shoe Store"
        ja: "靴屋で"
        zh: "在鞋店"
      messages:
        - role: partner
          text:
            en: "Can I help you?"
            ja: "何かお探しですか？"
            zh: "需要幫忙嗎？"
        - role: user
          text:
            en: "Yes, I am looking for shoes."
            ja: "はい、靴を探しています。"
            zh: "是的，我在找鞋子。"
        - role: partner
          text:
            en: "What size are you?"
            ja: "サイズはいくつですか？"
            zh: "你穿幾號？"
        - role: user
          text:
            en: "I am size 42."
            ja: "42です。"
            zh: "我穿42號。"
        - role: partner
          text:
            en: "Here, try on these."
            ja: "こちら、試着してみてください。"
            zh: "這裡，試試這雙。"
        - role: user
          text:
            en: "They are comfortable. How much do they cost?"
            ja: "履き心地がいいです。いくらですか？"
            zh: "很舒適。多少錢？"
        - role: partner
          text:
            en: "They cost $80."
            ja: "80ドルです。"
            zh: "80美元。"
        - role: user
          text:
            en: "I will buy them. Can I pay with card?"
            ja: "買います。カードで払えますか？"
            zh: "我要買。可以刷卡嗎？"

    - id: scenario-3-questions-answers
      title:
        en: "Shopping Questions"
        ja: "買い物の質問"
        zh: "購物問答"
      messages:
        - role: partner
          text:
            en: "What are you wearing?"
            ja: "何を着ていますか？"
            zh: "你穿什麼？"
        - role: user
          text:
            en: "I am wearing a white T-shirt and jeans."
            ja: "白いTシャツとジーンズを着ています。"
            zh: "我穿著白色T恤和牛仔褲。"
        - role: partner
          text:
            en: "How much is this?"
            ja: "これはいくらですか？"
            zh: "這個多少錢？"
        - role: user
          text:
            en: "It is $20."
            ja: "20ドルです。"
            zh: "20美元。"
        - role: partner
          text:
            en: "Do you like this color?"
            ja: "この色は好きですか？"
            zh: "你喜歡這個顏色嗎？"
        - role: user
          text:
            en: "No, I prefer black."
            ja: "いいえ、黒の方が好きです。"
            zh: "不，我比較喜歡黑色。"
        - role: partner
          text:
            en: "Does it fit?"
            ja: "サイズは合いますか？"
            zh: "合身嗎？"
        - role: user
          text:
            en: "No, it is too small."
            ja: "いいえ、小さすぎます。"
            zh: "不，太小了。"
        - role: partner
          text:
            en: "How about this one? Is it too big?"
            ja: "これはどうですか？大きすぎますか？"
            zh: "這件呢？太大了嗎？"
        - role: user
          text:
            en: "No, it fits perfectly!"
            ja: "いいえ、ぴったりです！"
            zh: "不，非常合身！"

quiz:
  questionsPerRound: 5
  xpReward: 20
`,hb=`# Chapter: Week 4 - Family & Friends
meta:
  id: family-and-friends
  title:
    en: "Family & Friends"
    ja: "家族と友達"
    zh: "家人與朋友"
  description:
    en: "Describing people around you."
    ja: "周りの人を説明しましょう。"
    zh: "學習描述你身邊的人。"
  icon: "👨‍👩‍👧‍👦"
  order: 4
  level: beginner

words:
  # Day 1: Core Nouns (People)
  - id: parents
    word:
      en: Parents
      ja: 両親
      zh: 父母
    reading: "PAIR-uhnts"
    phonetic: "/ˈperənts/"
    description:
      en: "Mother and Father."
      ja: "母親と父親。"
      zh: "母親和父親。"
    sentence:
      en: "I live with my parents."
      ja: "私は両親と一緒に住んでいます。"
      zh: "我和父母住在一起。"

  - id: father
    word:
      en: Father
      ja: 父
      zh: 父親
    reading: "FAH-ther"
    phonetic: "/ˈfɑːðər/"
    description:
      en: "Male parent."
      ja: "男性の親。"
      zh: "男性家長。"
    sentence:
      en: "My father is busy at work."
      ja: "父は仕事で忙しいです。"
      zh: "我父親工作很忙。"

  - id: mother
    word:
      en: Mother
      ja: 母
      zh: 母親
    reading: "MUHTH-er"
    phonetic: "/ˈmʌðər/"
    description:
      en: "Female parent."
      ja: "女性の親。"
      zh: "女性家長。"
    sentence:
      en: "My mother is very kind."
      ja: "母はとても優しいです。"
      zh: "我母親非常和藹。"

  - id: sister
    word:
      en: Sister
      ja: 姉妹
      zh: 姐妹
    reading: "SIS-ter"
    phonetic: "/ˈsɪstər/"
    description:
      en: "Female sibling."
      ja: "女性のきょうだい。"
      zh: "女性兄弟姐妹。"
    sentence:
      en: "I have two sisters."
      ja: "私には姉妹が2人います。"
      zh: "我有兩個姐妹。"

  - id: brother
    word:
      en: Brother
      ja: 兄弟
      zh: 兄弟
    reading: "BRUHTH-er"
    phonetic: "/ˈbrʌðər/"
    description:
      en: "Male sibling."
      ja: "男性のきょうだい。"
      zh: "男性兄弟姐妹。"
    sentence:
      en: "My brother is tall."
      ja: "私の兄弟は背が高いです。"
      zh: "我的兄弟很高。"

  - id: friend
    word:
      en: Friend
      ja: 友達
      zh: 朋友
    reading: "FREND"
    phonetic: "/frend/"
    description:
      en: "Person you like, not family."
      ja: "好きな人、家族ではない。"
      zh: "你喜歡的人，不是家人。"
    sentence:
      en: "She is my best friend."
      ja: "彼女は私の親友です。"
      zh: "她是我最好的朋友。"

  - id: family
    word:
      en: Family
      ja: 家族
      zh: 家庭
    reading: "FAM-uh-lee"
    phonetic: "/ˈfæməli/"
    description:
      en: "All your relatives group."
      ja: "親戚全員のグループ。"
      zh: "你所有親戚的群體。"
    sentence:
      en: "This is my family."
      ja: "これが私の家族です。"
      zh: "這是我的家人。"

  # Day 2: Adjectives (Describing People)
  - id: kind
    word:
      en: Kind
      ja: 優しい
      zh: 和藹
    reading: "KYND"
    phonetic: "/kaɪnd/"
    description:
      en: "Nice, helpful."
      ja: "親切で、助けになる。"
      zh: "友善、樂於助人。"
    sentence:
      en: "My mother is very kind."
      ja: "母はとても優しいです。"
      zh: "我母親非常和藹。"

  - id: funny
    word:
      en: Funny
      ja: 面白い
      zh: 有趣
    reading: "FUHN-ee"
    phonetic: "/ˈfʌni/"
    description:
      en: "Makes you laugh."
      ja: "笑わせてくれる。"
      zh: "讓你笑。"
    sentence:
      en: "My sister is funny, she always makes me laugh."
      ja: "姉妹は面白くて、いつも笑わせてくれます。"
      zh: "我姐妹很有趣，她總是讓我笑。"

  - id: tall
    word:
      en: Tall
      ja: 背が高い
      zh: 高
    reading: "TAWL"
    phonetic: "/tɔːl/"
    description:
      en: "High height."
      ja: "身長が高い。"
      zh: "身高很高。"
    sentence:
      en: "My dad is tall."
      ja: "父は背が高いです。"
      zh: "我爸爸很高。"

  - id: short
    word:
      en: Short
      ja: 背が低い
      zh: 矮
    reading: "SHORT"
    phonetic: "/ʃɔːrt/"
    description:
      en: "Low height."
      ja: "身長が低い。"
      zh: "身高很矮。"
    sentence:
      en: "No, he is short."
      ja: "いいえ、彼は背が低いです。"
      zh: "不，他很矮。"

  - id: old
    word:
      en: Old
      ja: 年をとった
      zh: 老
    reading: "OHLD"
    phonetic: "/oʊld/"
    description:
      en: "Many years."
      ja: "年齢が高い。"
      zh: "年紀大。"
    sentence:
      en: "My grandfather is old, but strong."
      ja: "祖父は年をとっていますが、元気です。"
      zh: "我爺爺年紀大了，但很強壯。"

  - id: young
    word:
      en: Young
      ja: 若い
      zh: 年輕
    reading: "YUHNG"
    phonetic: "/jʌŋ/"
    description:
      en: "Few years."
      ja: "年齢が若い。"
      zh: "年紀小。"
    sentence:
      en: "My little brother is very young."
      ja: "弟はとても若いです。"
      zh: "我弟弟很年輕。"

  - id: busy
    word:
      en: Busy
      ja: 忙しい
      zh: 忙碌
    reading: "BIZ-ee"
    phonetic: "/ˈbɪzi/"
    description:
      en: "Has lots of work."
      ja: "たくさんの仕事がある。"
      zh: "有很多工作。"
    sentence:
      en: "We are very busy during the week."
      ja: "私たちは平日とても忙しいです。"
      zh: "我們平日非常忙碌。"

chat:
  conversations:
    - id: scenario-1-my-family
      title:
        en: "My Family"
        ja: "私の家族"
        zh: "我的家人"
      messages:
        - role: partner
          text:
            en: "Tell me about your family."
            ja: "あなたの家族について教えてください。"
            zh: "跟我說說你的家人。"
        - role: user
          text:
            en: "I have a big family."
            ja: "私は大家族です。"
            zh: "我有一個大家庭。"
        - role: partner
          text:
            en: "Who do you live with?"
            ja: "誰と一緒に住んでいますか？"
            zh: "你和誰住在一起？"
        - role: user
          text:
            en: "I live with my parents and my sister."
            ja: "両親と姉妹と一緒に住んでいます。"
            zh: "我和父母還有姐妹住在一起。"
        - role: partner
          text:
            en: "What does your mother do?"
            ja: "お母さんは何をしていますか？"
            zh: "你媽媽做什麼工作？"
        - role: user
          text:
            en: "My mother is a teacher, she is very kind."
            ja: "母は先生で、とても優しいです。"
            zh: "我媽媽是老師，她非常和藹。"
        - role: partner
          text:
            en: "What about your sister?"
            ja: "お姉さんはどうですか？"
            zh: "你姐妹呢？"
        - role: user
          text:
            en: "My sister is funny, she always makes me laugh."
            ja: "姉妹は面白くて、いつも笑わせてくれます。"
            zh: "我姐妹很有趣，她總是讓我笑。"
        - role: partner
          text:
            en: "Do you meet your friends on weekends?"
            ja: "週末に友達に会いますか？"
            zh: "你週末會見朋友嗎？"
        - role: user
          text:
            en: "Yes, on weekends I meet my best friend."
            ja: "はい、週末に親友に会います。"
            zh: "是的，週末我會見我最好的朋友。"

    - id: scenario-2-family-photo
      title:
        en: "Family Photo"
        ja: "家族写真"
        zh: "家庭照片"
      messages:
        - role: partner
          text:
            en: "Is that a photo of your family?"
            ja: "それはあなたの家族の写真ですか？"
            zh: "那是你的家庭照片嗎？"
        - role: user
          text:
            en: "Yes. This is my father and this is my mother."
            ja: "はい。これが父で、これが母です。"
            zh: "是的。這是我爸爸，這是我媽媽。"
        - role: partner
          text:
            en: "Who is the young boy?"
            ja: "この若い男の子は誰ですか？"
            zh: "那個小男孩是誰？"
        - role: user
          text:
            en: "That is my little brother. He is 5 years old."
            ja: "それは弟です。5歳です。"
            zh: "那是我弟弟。他5歲。"
        - role: partner
          text:
            en: "He looks very funny."
            ja: "彼はとても面白そうですね。"
            zh: "他看起來很有趣。"
        - role: user
          text:
            en: "Yes, he always makes everyone laugh."
            ja: "はい、みんなをいつも笑わせます。"
            zh: "是的，他總是讓大家笑。"
        - role: partner
          text:
            en: "Is your father tall?"
            ja: "お父さんは背が高いですか？"
            zh: "你爸爸高嗎？"
        - role: user
          text:
            en: "No, he is short, but my brother is tall."
            ja: "いいえ、背が低いですが、兄弟は背が高いです。"
            zh: "不，他很矮，但我兄弟很高。"

    - id: scenario-3-questions-answers
      title:
        en: "Family Questions"
        ja: "家族についての質問"
        zh: "關於家人的問答"
      messages:
        - role: partner
          text:
            en: "Do you have any brothers?"
            ja: "兄弟はいますか？"
            zh: "你有兄弟嗎？"
        - role: user
          text:
            en: "Yes, I have one brother."
            ja: "はい、兄弟が1人います。"
            zh: "是的，我有一個兄弟。"
        - role: partner
          text:
            en: "Who is she?"
            ja: "彼女は誰ですか？"
            zh: "她是誰？"
        - role: user
          text:
            en: "She is my sister."
            ja: "彼女は私の姉妹です。"
            zh: "她是我姐妹。"
        - role: partner
          text:
            en: "Is your father tall?"
            ja: "お父さんは背が高いですか？"
            zh: "你爸爸高嗎？"
        - role: user
          text:
            en: "No, he is short."
            ja: "いいえ、背が低いです。"
            zh: "不，他很矮。"
        - role: partner
          text:
            en: "How are your parents?"
            ja: "ご両親はお元気ですか？"
            zh: "你父母好嗎？"
        - role: user
          text:
            en: "They are very good, thank you."
            ja: "とても元気です、ありがとうございます。"
            zh: "他們很好，謝謝。"
        - role: partner
          text:
            en: "How many friends do you have?"
            ja: "友達は何人いますか？"
            zh: "你有多少朋友？"
        - role: user
          text:
            en: "I have many friends."
            ja: "たくさん友達がいます。"
            zh: "我有很多朋友。"

quiz:
  questionsPerRound: 5
  xpReward: 20
`,fb=`# Chapter: Week 2 - Food & Eating
meta:
  id: food-and-eating
  title:
    en: "Food & Eating"
    ja: "食べ物と食事"
    zh: "食物與用餐"
  description:
    en: "Satisfying hunger and ordering at restaurants."
    ja: "空腹を満たし、レストランで注文する方法を学びましょう。"
    zh: "學習如何滿足飢餓感和在餐廳點餐。"
  icon: "🍽️"
  order: 2
  level: beginner

words:
  # Day 1: Core Nouns (Food & Places)
  - id: menu
    word:
      en: Menu
      ja: メニュー
      zh: 菜單
    reading: "MEN-yoo"
    phonetic: "/ˈmenjuː/"
    description:
      en: "List of food options."
      ja: "食べ物の選択肢のリスト。"
      zh: "食物選項的列表。"
    sentence:
      en: "Let's look at the menu."
      ja: "メニューを見ましょう。"
      zh: "我們看一下菜單吧。"

  - id: waiter
    word:
      en: Waiter
      ja: ウェイター
      zh: 服務生
    reading: "WAY-ter"
    phonetic: "/ˈweɪtər/"
    description:
      en: "Person serving food."
      ja: "食べ物を運ぶ人。"
      zh: "提供食物的人。"
    sentence:
      en: "The waiter brings the food."
      ja: "ウェイターが食べ物を運んできます。"
      zh: "服務生送來食物。"

  - id: water
    word:
      en: Water
      ja: 水
      zh: 水
    reading: "WAW-ter"
    phonetic: "/ˈwɔːtər/"
    description:
      en: "Clear drink."
      ja: "透明な飲み物。"
      zh: "透明的飲料。"
    sentence:
      en: "I am thirsty, I need water."
      ja: "喉が渇いています、水が必要です。"
      zh: "我很渴，我需要水。"

  - id: bread
    word:
      en: Bread
      ja: パン
      zh: 麵包
    reading: "BRED"
    phonetic: "/bred/"
    description:
      en: "Basic food made of flour."
      ja: "小麦粉で作った基本的な食べ物。"
      zh: "用麵粉做的基本食物。"
    sentence:
      en: "I eat bread with butter."
      ja: "私はバターをつけてパンを食べます。"
      zh: "我吃麵包配奶油。"

  - id: meat
    word:
      en: Meat
      ja: 肉
      zh: 肉
    reading: "MEET"
    phonetic: "/miːt/"
    description:
      en: "Chicken, beef, pork."
      ja: "鶏肉、牛肉、豚肉。"
      zh: "雞肉、牛肉、豬肉。"
    sentence:
      en: "This meat tastes delicious."
      ja: "この肉はとても美味しいです。"
      zh: "這肉嚐起來很美味。"

  - id: vegetables
    word:
      en: Vegetables
      ja: 野菜
      zh: 蔬菜
    reading: "VEJ-tuh-buhlz"
    phonetic: "/ˈvedʒtəbəlz/"
    description:
      en: "Salad, carrots, greens."
      ja: "サラダ、人参、葉物野菜。"
      zh: "沙拉、胡蘿蔔、蔬菜。"
    sentence:
      en: "I order chicken and vegetables."
      ja: "私は鶏肉と野菜を注文します。"
      zh: "我點雞肉和蔬菜。"

  - id: bill
    word:
      en: Bill
      ja: 請求書
      zh: 帳單
    reading: "BIL"
    phonetic: "/bɪl/"
    description:
      en: "Paper saying the price."
      ja: "値段が書かれた紙。"
      zh: "寫著價格的紙。"
    sentence:
      en: "I will pay the bill."
      ja: "私が請求書を払います。"
      zh: "我來付帳單。"

  # Day 2: Core Verbs (Eating Actions)
  - id: hungry
    word:
      en: Hungry
      ja: お腹が空いた
      zh: 餓
    reading: "HUHNG-gree"
    phonetic: "/ˈhʌŋɡri/"
    description:
      en: "Feeling: need food."
      ja: "食べ物が必要な感覚。"
      zh: "感覺：需要食物。"
    sentence:
      en: "I am very hungry right now."
      ja: "今とてもお腹が空いています。"
      zh: "我現在很餓。"

  - id: thirsty
    word:
      en: Thirsty
      ja: 喉が渇いた
      zh: 渴
    reading: "THUR-stee"
    phonetic: "/ˈθɜːrsti/"
    description:
      en: "Feeling: need drink."
      ja: "飲み物が必要な感覚。"
      zh: "感覺：需要喝水。"
    sentence:
      en: "I am thirsty, I need water."
      ja: "喉が渇いています、水が必要です。"
      zh: "我很渴，我需要水。"

  - id: order
    word:
      en: Order
      ja: 注文する
      zh: 點餐
    reading: "OR-der"
    phonetic: "/ˈɔːrdər/"
    description:
      en: "Ask for food."
      ja: "食べ物を頼む。"
      zh: "要求食物。"
    sentence:
      en: "I want to order chicken and vegetables."
      ja: "鶏肉と野菜を注文したいです。"
      zh: "我想點雞肉和蔬菜。"

  - id: cook
    word:
      en: Cook
      ja: 料理する
      zh: 烹飪
    reading: "KOOK"
    phonetic: "/kʊk/"
    description:
      en: "Make food."
      ja: "食べ物を作る。"
      zh: "做食物。"
    sentence:
      en: "The chef cooks the steak."
      ja: "シェフがステーキを料理します。"
      zh: "主廚烹調牛排。"

  - id: taste
    word:
      en: Taste
      ja: 味わう
      zh: 品嚐
    reading: "TAYST"
    phonetic: "/teɪst/"
    description:
      en: "Sense flavor."
      ja: "味を感じる。"
      zh: "感受味道。"
    sentence:
      en: "This meat tastes delicious."
      ja: "この肉はとても美味しいです。"
      zh: "這肉嚐起來很美味。"

  - id: pay
    word:
      en: Pay
      ja: 払う
      zh: 付錢
    reading: "PAY"
    phonetic: "/peɪ/"
    description:
      en: "Give money."
      ja: "お金を渡す。"
      zh: "給錢。"
    sentence:
      en: "I ask for the bill and pay."
      ja: "請求書をもらって払います。"
      zh: "我要帳單然後付錢。"

  - id: enjoy
    word:
      en: Enjoy
      ja: 楽しむ
      zh: 享受
    reading: "en-JOY"
    phonetic: "/ɪnˈdʒɔɪ/"
    description:
      en: "Like the experience."
      ja: "経験を楽しむ。"
      zh: "喜歡這個體驗。"
    sentence:
      en: "We enjoy the food very much."
      ja: "私たちは食事をとても楽しんでいます。"
      zh: "我們非常享受這頓飯。"

chat:
  conversations:
    - id: scenario-1-restaurant-story
      title:
        en: "Lunchtime at Restaurant"
        ja: "レストランでのランチタイム"
        zh: "餐廳午餐時間"
      messages:
        - role: partner
          text:
            en: "It is lunchtime. Are you hungry?"
            ja: "ランチタイムです。お腹空いていますか？"
            zh: "午餐時間到了。你餓嗎？"
        - role: user
          text:
            en: "Yes, I am starving. Let's go to a restaurant."
            ja: "はい、とてもお腹が空いています。レストランに行きましょう。"
            zh: "是的，我餓壞了。我們去餐廳吧。"
        - role: partner
          text:
            en: "Good idea. We sit down and the waiter gives us the menu."
            ja: "いいですね。座って、ウェイターがメニューをくれます。"
            zh: "好主意。我們坐下，服務生給我們菜單。"
        - role: user
          text:
            en: "I order a steak and a salad."
            ja: "私はステーキとサラダを注文します。"
            zh: "我點一份牛排和沙拉。"
        - role: partner
          text:
            en: "I will order fish. What do you want to drink?"
            ja: "私は魚を注文します。何を飲みたいですか？"
            zh: "我點魚。你想喝什麼？"
        - role: user
          text:
            en: "I am thirsty, I need cold water."
            ja: "喉が渇いています、冷たい水が必要です。"
            zh: "我很渴，我需要冰水。"
        - role: partner
          text:
            en: "The food is here. How does it taste?"
            ja: "食べ物が来ました。味はどうですか？"
            zh: "食物來了。味道怎麼樣？"
        - role: user
          text:
            en: "It is very good. I enjoy it very much."
            ja: "とても美味しいです。とても楽しんでいます。"
            zh: "非常好吃。我很享受。"
        - role: partner
          text:
            en: "After eating, let's ask for the bill."
            ja: "食べ終わったら、請求書をもらいましょう。"
            zh: "吃完後，我們要帳單吧。"
        - role: user
          text:
            en: "Yes, I will pay the bill."
            ja: "はい、私が請求書を払います。"
            zh: "好的，我來付帳。"

    - id: scenario-2-ordering-food
      title:
        en: "Ordering at a Restaurant"
        ja: "レストランで注文する"
        zh: "在餐廳點餐"
      messages:
        - role: partner
          text:
            en: "Hello, are you ready to order?"
            ja: "こんにちは、ご注文はお決まりですか？"
            zh: "你好，準備好點餐了嗎？"
        - role: user
          text:
            en: "Yes. I will have the burger, please."
            ja: "はい。バーガーをお願いします。"
            zh: "是的。我要漢堡，謝謝。"
        - role: partner
          text:
            en: "Anything to drink?"
            ja: "お飲み物はいかがですか？"
            zh: "要喝什麼嗎？"
        - role: user
          text:
            en: "Just water, please."
            ja: "水だけでお願いします。"
            zh: "請給我水就好。"
        - role: partner
          text:
            en: "Here is your food. Enjoy your meal."
            ja: "こちらがお料理です。ごゆっくりどうぞ。"
            zh: "這是您的餐點。請慢用。"
        - role: user
          text:
            en: "Thank you. This tastes delicious!"
            ja: "ありがとうございます。とても美味しいです！"
            zh: "謝謝。這很好吃！"
        - role: partner
          text:
            en: "I'm glad you like it. Anything else?"
            ja: "気に入っていただけて嬉しいです。他にご注文は？"
            zh: "很高興你喜歡。還需要什麼嗎？"
        - role: user
          text:
            en: "Can I have the bill now?"
            ja: "今、請求書をいただけますか？"
            zh: "可以給我帳單嗎？"

    - id: scenario-3-questions-answers
      title:
        en: "Food Questions"
        ja: "食べ物の質問"
        zh: "食物問答"
      messages:
        - role: partner
          text:
            en: "Are you hungry?"
            ja: "お腹空いていますか？"
            zh: "你餓嗎？"
        - role: user
          text:
            en: "Yes, I am starving."
            ja: "はい、とてもお腹が空いています。"
            zh: "是的，我餓壞了。"
        - role: partner
          text:
            en: "What do you want to eat?"
            ja: "何を食べたいですか？"
            zh: "你想吃什麼？"
        - role: user
          text:
            en: "I want to eat pasta."
            ja: "パスタを食べたいです。"
            zh: "我想吃義大利麵。"
        - role: partner
          text:
            en: "Can I have the menu, please?"
            ja: "メニューをいただけますか？"
            zh: "可以給我菜單嗎？"
        - role: user
          text:
            en: "Here you go."
            ja: "はい、どうぞ。"
            zh: "給你。"
        - role: partner
          text:
            en: "How is the food?"
            ja: "料理はどうですか？"
            zh: "食物怎麼樣？"
        - role: user
          text:
            en: "It is very good."
            ja: "とても美味しいです。"
            zh: "非常好吃。"
        - role: partner
          text:
            en: "Can I have a fork, please?"
            ja: "フォークをいただけますか？"
            zh: "可以給我一支叉子嗎？"
        - role: user
          text:
            en: "Of course, here you go."
            ja: "もちろん、どうぞ。"
            zh: "當然，給你。"

quiz:
  questionsPerRound: 5
  xpReward: 20
`,pb=`# Chapter: Week 10 - Health & Body
meta:
  id: health-and-body
  title:
    en: "Health & Body"
    ja: "健康と体"
    zh: "健康與身體"
  description:
    en: "Talking about your body and feeling unwell."
    ja: "体のことや体調不良について話しましょう。"
    zh: "學習談論身體和身體不適。"
  icon: "🏥"
  order: 10
  level: beginner

words:
  # Day 1: Core Nouns (Body Parts)
  - id: head
    word:
      en: Head
      ja: 頭
      zh: 頭
    reading: "HED"
    phonetic: "/hed/"
    description:
      en: "Top of body."
      ja: "体の一番上。"
      zh: "身體的最上方。"
    sentence:
      en: "My head hurts."
      ja: "頭が痛いです。"
      zh: "我頭痛。"

  - id: stomach
    word:
      en: Stomach
      ja: お腹
      zh: 肚子
    reading: "STUHM-uhk"
    phonetic: "/ˈstʌmək/"
    description:
      en: "Belly, where food goes."
      ja: "お腹、食べ物が行く場所。"
      zh: "腹部，食物去的地方。"
    sentence:
      en: "I have a pain in my stomach."
      ja: "お腹が痛いです。"
      zh: "我肚子痛。"

  - id: hand
    word:
      en: Hand
      ja: 手
      zh: 手
    reading: "HAND"
    phonetic: "/hænd/"
    description:
      en: "End of arm."
      ja: "腕の先。"
      zh: "手臂的末端。"
    sentence:
      en: "I use my hand to write."
      ja: "手を使って書きます。"
      zh: "我用手寫字。"

  - id: leg
    word:
      en: Leg
      ja: 脚
      zh: 腿
    reading: "LEG"
    phonetic: "/leɡ/"
    description:
      en: "Part for walking."
      ja: "歩くための部分。"
      zh: "用來走路的部位。"
    sentence:
      en: "He broke his leg playing soccer."
      ja: "彼はサッカーをして脚を骨折しました。"
      zh: "他踢足球時摔斷了腿。"

  - id: eye
    word:
      en: Eye
      ja: 目
      zh: 眼睛
    reading: "AY"
    phonetic: "/aɪ/"
    description:
      en: "Part for seeing."
      ja: "見るための部分。"
      zh: "用來看東西的部位。"
    sentence:
      en: "My eyes are tired from the computer."
      ja: "コンピューターで目が疲れました。"
      zh: "我的眼睛因為看電腦很累。"

  - id: medicine
    word:
      en: Medicine
      ja: 薬
      zh: 藥
    reading: "MED-uh-sin"
    phonetic: "/ˈmedɪsɪn/"
    description:
      en: "Drug to fix sickness."
      ja: "病気を治すための薬。"
      zh: "治療疾病的藥物。"
    sentence:
      en: "The doctor gave me medicine."
      ja: "医者が薬をくれました。"
      zh: "醫生給了我藥。"

  - id: doctor
    word:
      en: Doctor
      ja: 医者
      zh: 醫生
    reading: "DOK-ter"
    phonetic: "/ˈdɑːktər/"
    description:
      en: "Person who fixes health."
      ja: "健康を治す人。"
      zh: "治療健康的人。"
    sentence:
      en: "I called the doctor."
      ja: "医者に電話しました。"
      zh: "我打電話給醫生。"

  # Day 2: Verbs & Adjectives (Feeling)
  - id: sick
    word:
      en: Sick
      ja: 病気
      zh: 生病
    reading: "SIK"
    phonetic: "/sɪk/"
    description:
      en: "Not healthy, feeling bad."
      ja: "健康でない、気分が悪い。"
      zh: "不健康，感覺不舒服。"
    sentence:
      en: "I feel sick today."
      ja: "今日は気分が悪いです。"
      zh: "我今天感覺不舒服。"

  - id: hurt
    word:
      en: Hurt
      ja: 痛い
      zh: 痛
    reading: "HURT"
    phonetic: "/hɜːrt/"
    description:
      en: "Feel pain."
      ja: "痛みを感じる。"
      zh: "感到疼痛。"
    sentence:
      en: "My stomach hurts."
      ja: "お腹が痛いです。"
      zh: "我肚子痛。"

  - id: tired
    word:
      en: Tired
      ja: 疲れた
      zh: 累
    reading: "TY-erd"
    phonetic: "/ˈtaɪərd/"
    description:
      en: "No energy."
      ja: "エネルギーがない。"
      zh: "沒有精力。"
    sentence:
      en: "You look tired, go to sleep."
      ja: "疲れているようです、寝てください。"
      zh: "你看起來很累，去睡覺吧。"

  - id: healthy
    word:
      en: Healthy
      ja: 健康な
      zh: 健康
    reading: "HEL-thee"
    phonetic: "/ˈhelθi/"
    description:
      en: "Body is good."
      ja: "体が良い状態。"
      zh: "身體狀況良好。"
    sentence:
      en: "Now I feel a little more healthy."
      ja: "今は少し健康になりました。"
      zh: "現在我感覺健康多了。"

  - id: pain
    word:
      en: Pain
      ja: 痛み
      zh: 疼痛
    reading: "PAYN"
    phonetic: "/peɪn/"
    description:
      en: "Bad feeling."
      ja: "悪い感覚。"
      zh: "不好的感覺。"
    sentence:
      en: "I have a bad pain in my leg."
      ja: "脚がひどく痛いです。"
      zh: "我的腿很痛。"

  - id: rest
    word:
      en: Rest
      ja: 休む
      zh: 休息
    reading: "REST"
    phonetic: "/rest/"
    description:
      en: "Sleep or relax to get better."
      ja: "良くなるために寝たりリラックスする。"
      zh: "睡覺或放鬆來恢復。"
    sentence:
      en: "I stayed in bed all day to rest."
      ja: "休むために一日中ベッドにいました。"
      zh: "我整天都躺在床上休息。"

  - id: broken
    word:
      en: Broken
      ja: 骨折した
      zh: 斷掉
    reading: "BROH-ken"
    phonetic: "/ˈbroʊkən/"
    description:
      en: "Bone is snapped."
      ja: "骨が折れている。"
      zh: "骨頭斷裂。"
    sentence:
      en: "It is not broken, but it is hurt."
      ja: "骨折はしていませんが、痛いです。"
      zh: "沒有斷，但是很痛。"

chat:
  conversations:
    - id: scenario-1-feeling-sick
      title:
        en: "Feeling Sick"
        ja: "気分が悪い"
        zh: "感覺不舒服"
      messages:
        - role: partner
          text:
            en: "Good morning. How are you feeling?"
            ja: "おはようございます。気分はどうですか？"
            zh: "早安。你感覺怎麼樣？"
        - role: user
          text:
            en: "I woke up feeling terrible. My head was hot and my body was tired."
            ja: "ひどい気分で起きました。頭が熱くて体が疲れています。"
            zh: "我醒來感覺很糟。頭很熱，身體很累。"
        - role: partner
          text:
            en: "Did you go to work?"
            ja: "仕事に行きましたか？"
            zh: "你去上班了嗎？"
        - role: user
          text:
            en: "No, I did not go to work. I called the doctor."
            ja: "いいえ、仕事に行きませんでした。医者に電話しました。"
            zh: "不，我沒去上班。我打電話給醫生。"
        - role: partner
          text:
            en: "What did the doctor say?"
            ja: "医者は何と言いましたか？"
            zh: "醫生怎麼說？"
        - role: user
          text:
            en: "She said, 'You are sick. Take this medicine and rest.'"
            ja: "「病気です。この薬を飲んで休んでください」と言いました。"
            zh: "她說：「你生病了。吃這個藥然後休息。」"
        - role: partner
          text:
            en: "Are you feeling better now?"
            ja: "今は良くなりましたか？"
            zh: "你現在好點了嗎？"
        - role: user
          text:
            en: "I stayed in bed all day. Now I feel a little more healthy."
            ja: "一日中ベッドにいました。今は少し健康になりました。"
            zh: "我整天都躺在床上。現在我感覺健康多了。"

    - id: scenario-2-at-doctor
      title:
        en: "At the Doctor"
        ja: "医者で"
        zh: "看醫生"
      messages:
        - role: partner
          text:
            en: "Good morning. What is the problem?"
            ja: "おはようございます。どうされましたか？"
            zh: "早安。有什麼問題？"
        - role: user
          text:
            en: "I have a bad pain in my leg."
            ja: "脚がひどく痛いです。"
            zh: "我的腿很痛。"
        - role: partner
          text:
            en: "Did you fall?"
            ja: "転びましたか？"
            zh: "你摔倒了嗎？"
        - role: user
          text:
            en: "Yes, I fell yesterday."
            ja: "はい、昨日転びました。"
            zh: "是的，我昨天摔倒了。"
        - role: partner
          text:
            en: "Let me look. It is not broken, but it is hurt."
            ja: "見せてください。骨折はしていませんが、痛いですね。"
            zh: "讓我看看。沒有斷，但是有受傷。"
        - role: user
          text:
            en: "Do I need medicine?"
            ja: "薬が必要ですか？"
            zh: "我需要吃藥嗎？"
        - role: partner
          text:
            en: "No, just rest your leg."
            ja: "いいえ、脚を休めてください。"
            zh: "不用，只要讓腿休息。"
        - role: user
          text:
            en: "Thank you, doctor."
            ja: "ありがとうございます、先生。"
            zh: "謝謝醫生。"

    - id: scenario-3-questions-answers
      title:
        en: "Health Questions"
        ja: "健康の質問"
        zh: "健康問答"
      messages:
        - role: partner
          text:
            en: "Are you okay?"
            ja: "大丈夫ですか？"
            zh: "你還好嗎？"
        - role: user
          text:
            en: "No, I feel sick."
            ja: "いいえ、気分が悪いです。"
            zh: "不好，我感覺不舒服。"
        - role: partner
          text:
            en: "What is wrong?"
            ja: "どうしましたか？"
            zh: "怎麼了？"
        - role: user
          text:
            en: "My stomach hurts."
            ja: "お腹が痛いです。"
            zh: "我肚子痛。"
        - role: partner
          text:
            en: "Do you need a doctor?"
            ja: "医者が必要ですか？"
            zh: "你需要看醫生嗎？"
        - role: user
          text:
            en: "No, I just need rest."
            ja: "いいえ、休むだけで大丈夫です。"
            zh: "不用，我只需要休息。"
        - role: partner
          text:
            en: "Where is the pain?"
            ja: "どこが痛いですか？"
            zh: "哪裡痛？"
        - role: user
          text:
            en: "It is in my back."
            ja: "背中です。"
            zh: "在我的背。"
        - role: partner
          text:
            en: "Do you have a fever?"
            ja: "熱はありますか？"
            zh: "你有發燒嗎？"
        - role: user
          text:
            en: "Yes, I have a fever and a headache."
            ja: "はい、熱と頭痛があります。"
            zh: "是的，我發燒還頭痛。"

quiz:
  questionsPerRound: 5
  xpReward: 20
`,mb=`# Chapter: Week 8 - Hobbies & Free Time
meta:
  id: hobbies-and-free-time
  title:
    en: "Hobbies & Free Time"
    ja: "趣味と自由時間"
    zh: "嗜好與休閒"
  description:
    en: "What you do for fun when you are not working."
    ja: "仕事以外の楽しみを学びましょう。"
    zh: "學習工作之外你做什麼來娛樂。"
  icon: "🎮"
  order: 8
  level: beginner

words:
  # Day 1: Core Nouns (Activities)
  - id: music
    word:
      en: Music
      ja: 音楽
      zh: 音樂
    reading: "MYOO-zik"
    phonetic: "/ˈmjuːzɪk/"
    description:
      en: "Songs, instruments."
      ja: "歌、楽器。"
      zh: "歌曲、樂器。"
    sentence:
      en: "I like to listen to music."
      ja: "私は音楽を聴くのが好きです。"
      zh: "我喜歡聽音樂。"

  - id: movie
    word:
      en: Movie
      ja: 映画
      zh: 電影
    reading: "MOO-vee"
    phonetic: "/ˈmuːvi/"
    description:
      en: "Film at cinema or TV."
      ja: "映画館やテレビで見る映像作品。"
      zh: "在電影院或電視上看的影片。"
    sentence:
      en: "They watch a movie every Friday."
      ja: "彼らは毎週金曜日に映画を見ます。"
      zh: "他們每個星期五看電影。"

  - id: book
    word:
      en: Book
      ja: 本
      zh: 書
    reading: "BOOK"
    phonetic: "/bʊk/"
    description:
      en: "Reading material."
      ja: "読み物。"
      zh: "閱讀材料。"
    sentence:
      en: "I read a good book before bed."
      ja: "寝る前に良い本を読みます。"
      zh: "我睡前讀一本好書。"

  - id: game
    word:
      en: Game
      ja: ゲーム
      zh: 遊戲
    reading: "GAYM"
    phonetic: "/ɡeɪm/"
    description:
      en: "Video game, board game."
      ja: "ビデオゲーム、ボードゲーム。"
      zh: "電子遊戲、桌遊。"
    sentence:
      en: "I play video games for fun."
      ja: "楽しみにビデオゲームをします。"
      zh: "我玩電子遊戲來娛樂。"

  - id: sport
    word:
      en: Sport
      ja: スポーツ
      zh: 運動
    reading: "SPORT"
    phonetic: "/spɔːrt/"
    description:
      en: "Physical exercise game."
      ja: "体を動かす競技。"
      zh: "身體運動的比賽。"
    sentence:
      en: "My favorite sport is basketball."
      ja: "私の好きなスポーツはバスケットボールです。"
      zh: "我最喜歡的運動是籃球。"

  - id: park
    word:
      en: Park
      ja: 公園
      zh: 公園
    reading: "PARK"
    phonetic: "/pɑːrk/"
    description:
      en: "Green place outside."
      ja: "外にある緑の場所。"
      zh: "戶外有草木的地方。"
    sentence:
      en: "Let's go to the park to run."
      ja: "公園に走りに行きましょう。"
      zh: "我們去公園跑步吧。"

  - id: hobby
    word:
      en: Hobby
      ja: 趣味
      zh: 嗜好
    reading: "HOB-ee"
    phonetic: "/ˈhɑːbi/"
    description:
      en: "Activity you like."
      ja: "好きな活動。"
      zh: "你喜歡的活動。"
    sentence:
      en: "My favorite hobby is cooking."
      ja: "私の好きな趣味は料理です。"
      zh: "我最喜歡的嗜好是烹飪。"

  # Day 2: Core Verbs (Doing things)
  - id: play
    word:
      en: Play
      ja: 遊ぶ
      zh: 玩
    reading: "PLAY"
    phonetic: "/pleɪ/"
    description:
      en: "Do a sport or game."
      ja: "スポーツやゲームをする。"
      zh: "做運動或玩遊戲。"
    sentence:
      en: "We play soccer on Saturdays."
      ja: "土曜日にサッカーをします。"
      zh: "我們星期六踢足球。"

  - id: watch
    word:
      en: Watch
      ja: 見る
      zh: 觀看
    reading: "WOCH"
    phonetic: "/wɑːtʃ/"
    description:
      en: "Look at a screen/show."
      ja: "画面やショーを見る。"
      zh: "看螢幕或表演。"
    sentence:
      en: "I usually watch a movie with my friends."
      ja: "普段は友達と映画を見ます。"
      zh: "我通常和朋友一起看電影。"

  - id: listen
    word:
      en: Listen
      ja: 聴く
      zh: 聽
    reading: "LIS-en"
    phonetic: "/ˈlɪsən/"
    description:
      en: "Hear music."
      ja: "音楽を聴く。"
      zh: "聽音樂。"
    sentence:
      en: "I listen to loud music while I clean."
      ja: "掃除をしながら大きな音楽を聴きます。"
      zh: "我打掃時聽大聲的音樂。"

  - id: read
    word:
      en: Read
      ja: 読む
      zh: 閱讀
    reading: "REED"
    phonetic: "/riːd/"
    description:
      en: "Look at words."
      ja: "文字を見る。"
      zh: "看文字。"
    sentence:
      en: "I prefer reading books."
      ja: "私は本を読むのが好きです。"
      zh: "我比較喜歡看書。"

  - id: run
    word:
      en: Run
      ja: 走る
      zh: 跑步
    reading: "RUHN"
    phonetic: "/rʌn/"
    description:
      en: "Move fast on feet."
      ja: "足で速く動く。"
      zh: "用腳快速移動。"
    sentence:
      en: "On Saturday morning, I go to the park to run."
      ja: "土曜日の朝、公園に走りに行きます。"
      zh: "星期六早上，我去公園跑步。"

  - id: swim
    word:
      en: Swim
      ja: 泳ぐ
      zh: 游泳
    reading: "SWIM"
    phonetic: "/swɪm/"
    description:
      en: "Move in water."
      ja: "水の中で動く。"
      zh: "在水中移動。"
    sentence:
      en: "I like to swim in the summer."
      ja: "夏に泳ぐのが好きです。"
      zh: "我喜歡在夏天游泳。"

  - id: relax
    word:
      en: Relax
      ja: リラックスする
      zh: 放鬆
    reading: "ri-LAKS"
    phonetic: "/rɪˈlæks/"
    description:
      en: "Rest."
      ja: "休む。"
      zh: "休息。"
    sentence:
      en: "I want to relax this weekend."
      ja: "今週末はリラックスしたいです。"
      zh: "這個週末我想放鬆。"

chat:
  conversations:
    - id: scenario-1-weekend-story
      title:
        en: "My Weekend"
        ja: "私の週末"
        zh: "我的週末"
      messages:
        - role: partner
          text:
            en: "What do you do on weekends?"
            ja: "週末は何をしますか？"
            zh: "你週末做什麼？"
        - role: user
          text:
            en: "On weekends, I have free time."
            ja: "週末は自由な時間があります。"
            zh: "週末我有空閒時間。"
        - role: partner
          text:
            en: "What do you do on Saturday morning?"
            ja: "土曜日の朝は何をしますか？"
            zh: "星期六早上你做什麼？"
        - role: user
          text:
            en: "On Saturday morning, I go to the park to run. It is good exercise."
            ja: "土曜日の朝、公園に走りに行きます。いい運動です。"
            zh: "星期六早上，我去公園跑步。這是很好的運動。"
        - role: partner
          text:
            en: "And in the afternoon?"
            ja: "午後はどうですか？"
            zh: "下午呢？"
        - role: user
          text:
            en: "In the afternoon, I relax at home. I listen to loud music while I clean."
            ja: "午後は家でリラックスします。掃除をしながら大きな音楽を聴きます。"
            zh: "下午我在家放鬆。我打掃時聽大聲的音樂。"
        - role: partner
          text:
            en: "What about Sunday?"
            ja: "日曜日はどうですか？"
            zh: "星期天呢？"
        - role: user
          text:
            en: "On Sunday, I usually watch a movie with my friends. We eat popcorn and laugh."
            ja: "日曜日は普段、友達と映画を見ます。ポップコーンを食べて笑います。"
            zh: "星期天，我通常和朋友一起看電影。我們吃爆米花和大笑。"

    - id: scenario-2-hobbies-talk
      title:
        en: "Talking About Hobbies"
        ja: "趣味について話す"
        zh: "談論嗜好"
      messages:
        - role: partner
          text:
            en: "Do you like sports?"
            ja: "スポーツは好きですか？"
            zh: "你喜歡運動嗎？"
        - role: user
          text:
            en: "Not really. I prefer reading books."
            ja: "あまり。本を読む方が好きです。"
            zh: "不太喜歡。我比較喜歡看書。"
        - role: partner
          text:
            en: "I love soccer. I play every week."
            ja: "私はサッカーが大好きです。毎週やります。"
            zh: "我喜歡足球。我每週都踢。"
        - role: user
          text:
            en: "That is good. I like to swim in the summer."
            ja: "いいですね。私は夏に泳ぐのが好きです。"
            zh: "很好。我喜歡在夏天游泳。"
        - role: partner
          text:
            en: "We should go to the pool together."
            ja: "一緒にプールに行きましょう。"
            zh: "我們應該一起去游泳池。"
        - role: user
          text:
            en: "Yes, let's do that."
            ja: "はい、そうしましょう。"
            zh: "好，我們這樣做吧。"
        - role: partner
          text:
            en: "What is your favorite movie?"
            ja: "好きな映画は何ですか？"
            zh: "你最喜歡的電影是什麼？"
        - role: user
          text:
            en: "My favorite movie is Star Wars."
            ja: "私の好きな映画はスターウォーズです。"
            zh: "我最喜歡的電影是星際大戰。"

    - id: scenario-3-questions-answers
      title:
        en: "Hobby Questions"
        ja: "趣味の質問"
        zh: "嗜好問答"
      messages:
        - role: partner
          text:
            en: "What is your hobby?"
            ja: "趣味は何ですか？"
            zh: "你的嗜好是什麼？"
        - role: user
          text:
            en: "I like painting."
            ja: "絵を描くのが好きです。"
            zh: "我喜歡畫畫。"
        - role: partner
          text:
            en: "Do you play sports?"
            ja: "スポーツをしますか？"
            zh: "你做運動嗎？"
        - role: user
          text:
            en: "Yes, I play tennis."
            ja: "はい、テニスをします。"
            zh: "是的，我打網球。"
        - role: partner
          text:
            en: "Do you want to watch a movie?"
            ja: "映画を見ませんか？"
            zh: "你想看電影嗎？"
        - role: user
          text:
            en: "Sure, I love movies."
            ja: "もちろん、映画が大好きです。"
            zh: "當然，我喜歡電影。"
        - role: partner
          text:
            en: "What do you do for fun?"
            ja: "楽しみに何をしますか？"
            zh: "你做什麼來娛樂？"
        - role: user
          text:
            en: "I play video games."
            ja: "ビデオゲームをします。"
            zh: "我玩電子遊戲。"
        - role: partner
          text:
            en: "What do you like to do?"
            ja: "何をするのが好きですか？"
            zh: "你喜歡做什麼？"
        - role: user
          text:
            en: "I like to dance and sing."
            ja: "踊ったり歌ったりするのが好きです。"
            zh: "我喜歡跳舞和唱歌。"

quiz:
  questionsPerRound: 5
  xpReward: 20
`,gb=`# Chapter: Week 3 - Home & Living
meta:
  id: home-and-living
  title:
    en: "Home & Living"
    ja: "家と生活"
    zh: "家與居住"
  description:
    en: "Describing where you live."
    ja: "自分の住んでいる場所を説明しましょう。"
    zh: "學習描述你住的地方。"
  icon: "🏠"
  order: 3
  level: beginner

words:
  # Day 1: Core Nouns (Objects/Rooms)
  - id: kitchen
    word:
      en: Kitchen
      ja: キッチン
      zh: 廚房
    reading: "KICH-en"
    phonetic: "/ˈkɪtʃɪn/"
    description:
      en: "Room for cooking."
      ja: "料理をする部屋。"
      zh: "做飯的房間。"
    sentence:
      en: "I cook dinner in the kitchen."
      ja: "私はキッチンで夕食を作ります。"
      zh: "我在廚房做晚餐。"

  - id: bedroom
    word:
      en: Bedroom
      ja: 寝室
      zh: 臥室
    reading: "BED-room"
    phonetic: "/ˈbedruːm/"
    description:
      en: "Room for sleeping."
      ja: "寝るための部屋。"
      zh: "睡覺的房間。"
    sentence:
      en: "I sleep in the bedroom."
      ja: "私は寝室で寝ます。"
      zh: "我在臥室睡覺。"

  - id: bathroom
    word:
      en: Bathroom
      ja: バスルーム
      zh: 浴室
    reading: "BATH-room"
    phonetic: "/ˈbæθruːm/"
    description:
      en: "Room for shower/toilet."
      ja: "シャワーやトイレのある部屋。"
      zh: "淋浴和上廁所的房間。"
    sentence:
      en: "I need to clean the bathroom."
      ja: "バスルームを掃除する必要があります。"
      zh: "我需要打掃浴室。"

  - id: living-room
    word:
      en: Living Room
      ja: リビングルーム
      zh: 客廳
    reading: "LIV-ing room"
    phonetic: "/ˈlɪvɪŋ ruːm/"
    description:
      en: "Room for relaxing."
      ja: "くつろぐための部屋。"
      zh: "放鬆的房間。"
    sentence:
      en: "We watch TV in the living room."
      ja: "私たちはリビングルームでテレビを見ます。"
      zh: "我們在客廳看電視。"

  - id: sofa
    word:
      en: Sofa
      ja: ソファ
      zh: 沙發
    reading: "SOH-fuh"
    phonetic: "/ˈsoʊfə/"
    description:
      en: "Soft seat for multiple people."
      ja: "複数人が座れる柔らかい椅子。"
      zh: "可以坐多人的軟座椅。"
    sentence:
      en: "The sofa is very soft."
      ja: "ソファはとても柔らかいです。"
      zh: "沙發很軟。"

  - id: bed
    word:
      en: Bed
      ja: ベッド
      zh: 床
    reading: "BED"
    phonetic: "/bed/"
    description:
      en: "Furniture for sleeping."
      ja: "寝るための家具。"
      zh: "睡覺用的家具。"
    sentence:
      en: "I sleep in my comfortable bed."
      ja: "私は快適なベッドで寝ます。"
      zh: "我睡在舒適的床上。"

  - id: door
    word:
      en: Door
      ja: ドア
      zh: 門
    reading: "DOR"
    phonetic: "/dɔːr/"
    description:
      en: "Entrance."
      ja: "入り口。"
      zh: "入口。"
    sentence:
      en: "Please close the door."
      ja: "ドアを閉めてください。"
      zh: "請關門。"

  - id: window
    word:
      en: Window
      ja: 窓
      zh: 窗戶
    reading: "WIN-doh"
    phonetic: "/ˈwɪndoʊ/"
    description:
      en: "Glass to see outside."
      ja: "外を見るためのガラス。"
      zh: "可以看到外面的玻璃。"
    sentence:
      en: "The living room has a bright window."
      ja: "リビングルームには明るい窓があります。"
      zh: "客廳有一扇明亮的窗戶。"

  # Day 2: Core Verbs (Actions at Home)
  - id: live
    word:
      en: Live
      ja: 住む
      zh: 住
    reading: "LIV"
    phonetic: "/lɪv/"
    description:
      en: "Reside/stay long term."
      ja: "長期間住む。"
      zh: "長期居住。"
    sentence:
      en: "I live in an apartment."
      ja: "私はアパートに住んでいます。"
      zh: "我住在公寓裡。"

  - id: clean
    word:
      en: Clean
      ja: 掃除する
      zh: 打掃
    reading: "KLEEN"
    phonetic: "/kliːn/"
    description:
      en: "Make things tidy/wash."
      ja: "整理する、洗う。"
      zh: "整理乾淨、清洗。"
    sentence:
      en: "Every Saturday, I clean the whole house."
      ja: "毎週土曜日、家全体を掃除します。"
      zh: "每個星期六，我打掃整個房子。"

  - id: sleep
    word:
      en: Sleep
      ja: 寝る
      zh: 睡覺
    reading: "SLEEP"
    phonetic: "/sliːp/"
    description:
      en: "Rest at night."
      ja: "夜に休む。"
      zh: "晚上休息。"
    sentence:
      en: "I sleep in the bedroom."
      ja: "私は寝室で寝ます。"
      zh: "我在臥室睡覺。"

  - id: watch
    word:
      en: Watch
      ja: 見る
      zh: 看
    reading: "WOCH"
    phonetic: "/wɑːtʃ/"
    description:
      en: "Look at TV."
      ja: "テレビを見る。"
      zh: "看電視。"
    sentence:
      en: "We watch TV in the living room."
      ja: "私たちはリビングルームでテレビを見ます。"
      zh: "我們在客廳看電視。"

  - id: open
    word:
      en: Open
      ja: 開ける
      zh: 打開
    reading: "OH-pen"
    phonetic: "/ˈoʊpən/"
    description:
      en: "Unlock door/window."
      ja: "ドアや窓を開ける。"
      zh: "打開門或窗戶。"
    sentence:
      en: "Please open the window."
      ja: "窓を開けてください。"
      zh: "請打開窗戶。"

  - id: close
    word:
      en: Close
      ja: 閉める
      zh: 關閉
    reading: "KLOHZ"
    phonetic: "/kloʊz/"
    description:
      en: "Shut door/window."
      ja: "ドアや窓を閉める。"
      zh: "關上門或窗戶。"
    sentence:
      en: "Please close the door."
      ja: "ドアを閉めてください。"
      zh: "請關門。"

  - id: sit
    word:
      en: Sit
      ja: 座る
      zh: 坐
    reading: "SIT"
    phonetic: "/sɪt/"
    description:
      en: "Rest on a chair/sofa."
      ja: "椅子やソファに座る。"
      zh: "坐在椅子或沙發上。"
    sentence:
      en: "Please sit on the sofa."
      ja: "ソファに座ってください。"
      zh: "請坐在沙發上。"

chat:
  conversations:
    - id: scenario-1-my-house
      title:
        en: "My House"
        ja: "私の家"
        zh: "我的家"
      messages:
        - role: partner
          text:
            en: "Where do you live?"
            ja: "どこに住んでいますか？"
            zh: "你住在哪裡？"
        - role: user
          text:
            en: "I live in a small house."
            ja: "私は小さな家に住んでいます。"
            zh: "我住在一間小房子裡。"
        - role: partner
          text:
            en: "How many rooms does it have?"
            ja: "いくつ部屋がありますか？"
            zh: "有幾個房間？"
        - role: user
          text:
            en: "It has two bedrooms and one bathroom."
            ja: "寝室が2つとバスルームが1つあります。"
            zh: "有兩間臥室和一間浴室。"
        - role: partner
          text:
            en: "What is your favorite room?"
            ja: "一番好きな部屋はどこですか？"
            zh: "你最喜歡哪個房間？"
        - role: user
          text:
            en: "My favorite room is the living room."
            ja: "一番好きな部屋はリビングルームです。"
            zh: "我最喜歡客廳。"
        - role: partner
          text:
            en: "Why do you like it?"
            ja: "なぜ好きですか？"
            zh: "為什麼喜歡？"
        - role: user
          text:
            en: "It has a big sofa and a bright window."
            ja: "大きなソファと明るい窓があります。"
            zh: "有一張大沙發和一扇明亮的窗戶。"
        - role: partner
          text:
            en: "Do you clean your house often?"
            ja: "よく家を掃除しますか？"
            zh: "你常打掃房子嗎？"
        - role: user
          text:
            en: "Yes, every Saturday I clean the whole house."
            ja: "はい、毎週土曜日に家全体を掃除します。"
            zh: "是的，每個星期六我打掃整個房子。"

    - id: scenario-2-welcome-home
      title:
        en: "Welcome to My Home"
        ja: "我が家へようこそ"
        zh: "歡迎來我家"
      messages:
        - role: partner
          text:
            en: "Welcome! Please come in."
            ja: "ようこそ！どうぞお入りください。"
            zh: "歡迎！請進。"
        - role: user
          text:
            en: "Thank you for inviting me."
            ja: "招待してくれてありがとうございます。"
            zh: "謝謝你邀請我。"
        - role: partner
          text:
            en: "Your house is beautiful. The living room is so big!"
            ja: "あなたの家は素敵ですね。リビングルームがとても広い！"
            zh: "你的房子很漂亮。客廳好大！"
        - role: user
          text:
            en: "Thank you. Please sit on the sofa."
            ja: "ありがとうございます。ソファにどうぞ座ってください。"
            zh: "謝謝。請坐在沙發上。"
        - role: partner
          text:
            en: "Where is the bathroom?"
            ja: "バスルームはどこですか？"
            zh: "浴室在哪裡？"
        - role: user
          text:
            en: "It is next to the kitchen, on the left."
            ja: "キッチンの隣、左側にあります。"
            zh: "在廚房旁邊，左邊。"
        - role: partner
          text:
            en: "Is the window open? It feels nice."
            ja: "窓は開いていますか？気持ちいいですね。"
            zh: "窗戶開著嗎？感覺很舒服。"
        - role: user
          text:
            en: "Yes, I like fresh air. Should I close it?"
            ja: "はい、新鮮な空気が好きです。閉めましょうか？"
            zh: "是的，我喜歡新鮮空氣。需要關上嗎？"

    - id: scenario-3-questions-answers
      title:
        en: "Home Questions"
        ja: "家についての質問"
        zh: "關於家的問答"
      messages:
        - role: partner
          text:
            en: "Where do you live?"
            ja: "どこに住んでいますか？"
            zh: "你住在哪裡？"
        - role: user
          text:
            en: "I live in a house."
            ja: "私は家に住んでいます。"
            zh: "我住在房子裡。"
        - role: partner
          text:
            en: "Is the window open?"
            ja: "窓は開いていますか？"
            zh: "窗戶開著嗎？"
        - role: user
          text:
            en: "No, the window is closed."
            ja: "いいえ、窓は閉まっています。"
            zh: "不，窗戶是關著的。"
        - role: partner
          text:
            en: "Where are you now?"
            ja: "今どこにいますか？"
            zh: "你現在在哪裡？"
        - role: user
          text:
            en: "I am in the kitchen."
            ja: "キッチンにいます。"
            zh: "我在廚房。"
        - role: partner
          text:
            en: "Do you like your house?"
            ja: "あなたの家は好きですか？"
            zh: "你喜歡你的房子嗎？"
        - role: user
          text:
            en: "Yes, it is very comfortable."
            ja: "はい、とても快適です。"
            zh: "是的，非常舒適。"
        - role: partner
          text:
            en: "Please open the window."
            ja: "窓を開けてください。"
            zh: "請打開窗戶。"
        - role: user
          text:
            en: "Okay, I will open it now."
            ja: "わかりました、今開けます。"
            zh: "好的，我現在打開。"

quiz:
  questionsPerRound: 5
  xpReward: 20
`,yb=`# Chapter: Week 1 - The Morning Routine
meta:
  id: morning-routine
  title:
    en: "The Morning Routine"
    ja: "朝のルーティン"
    zh: "早晨日常"
  description:
    en: "Things you do every day when you start the day."
    ja: "毎日朝にすることを学びましょう。"
    zh: "學習每天早上起床後做的事情。"
  icon: "☀️"
  order: 1
  level: beginner

words:
  # Day 1: Core Nouns (Things)
  - id: alarm
    word:
      en: Alarm
      ja: 目覚まし時計
      zh: 鬧鐘
    reading: "uh-LARM"
    phonetic: "/əˈlɑːrm/"
    description:
      en: "Clock that makes noise to wake you."
      ja: "あなたを起こすために音を鳴らす時計。"
      zh: "發出聲音叫醒你的時鐘。"
    sentence:
      en: "The alarm rings at 7 AM."
      ja: "目覚まし時計は朝7時に鳴ります。"
      zh: "鬧鐘在早上7點響。"

  - id: coffee
    word:
      en: Coffee
      ja: コーヒー
      zh: 咖啡
    reading: "KAW-fee"
    phonetic: "/ˈkɔːfi/"
    description:
      en: "Hot black drink."
      ja: "熱い黒い飲み物。"
      zh: "熱的黑色飲料。"
    sentence:
      en: "I drink a cup of coffee."
      ja: "私はコーヒーを一杯飲みます。"
      zh: "我喝一杯咖啡。"

  - id: breakfast
    word:
      en: Breakfast
      ja: 朝食
      zh: 早餐
    reading: "BREK-fuhst"
    phonetic: "/ˈbrekfəst/"
    description:
      en: "First meal of the day."
      ja: "一日の最初の食事。"
      zh: "一天的第一餐。"
    sentence:
      en: "I eat breakfast every morning."
      ja: "私は毎朝朝食を食べます。"
      zh: "我每天早上吃早餐。"

  - id: shower
    word:
      en: Shower
      ja: シャワー
      zh: 淋浴
    reading: "SHOW-er"
    phonetic: "/ˈʃaʊər/"
    description:
      en: "Washing body with water."
      ja: "水で体を洗うこと。"
      zh: "用水沖洗身體。"
    sentence:
      en: "I take a hot shower to feel fresh."
      ja: "私は爽快になるために熱いシャワーを浴びます。"
      zh: "我洗個熱水澡讓自己清爽。"

  - id: clothes
    word:
      en: Clothes
      ja: 服
      zh: 衣服
    reading: "KLOHZ"
    phonetic: "/kloʊðz/"
    description:
      en: "What you wear."
      ja: "着るもの。"
      zh: "你穿的東西。"
    sentence:
      en: "I put on my clothes."
      ja: "私は服を着ます。"
      zh: "我穿上衣服。"

  - id: bus
    word:
      en: Bus
      ja: バス
      zh: 公車
    reading: "BUHS"
    phonetic: "/bʌs/"
    description:
      en: "Public transport vehicle."
      ja: "公共交通機関の車両。"
      zh: "公共交通工具。"
    sentence:
      en: "I go to work by bus."
      ja: "私はバスで仕事に行きます。"
      zh: "我搭公車去上班。"

  - id: train
    word:
      en: Train
      ja: 電車
      zh: 火車
    reading: "TRAYN"
    phonetic: "/treɪn/"
    description:
      en: "Public transport on rails."
      ja: "線路を走る公共交通機関。"
      zh: "在軌道上行駛的交通工具。"
    sentence:
      en: "I take the train to my office."
      ja: "私は電車でオフィスに行きます。"
      zh: "我搭火車去辦公室。"

  - id: office
    word:
      en: Office
      ja: オフィス
      zh: 辦公室
    reading: "AW-fis"
    phonetic: "/ˈɔːfɪs/"
    description:
      en: "Place of work."
      ja: "仕事をする場所。"
      zh: "工作的地方。"
    sentence:
      en: "I arrive at the office at 9 AM."
      ja: "私は朝9時にオフィスに着きます。"
      zh: "我早上9點到達辦公室。"

  # Day 2: Core Verbs (Actions)
  - id: wake-up
    word:
      en: Wake up
      ja: 起きる
      zh: 醒來
    reading: "WAYK uhp"
    phonetic: "/weɪk ʌp/"
    description:
      en: "Stop sleeping."
      ja: "眠りから覚める。"
      zh: "停止睡眠。"
    sentence:
      en: "I wake up at 7 AM."
      ja: "私は朝7時に起きます。"
      zh: "我早上7點醒來。"

  - id: get-up
    word:
      en: Get up
      ja: 起き上がる
      zh: 起床
    reading: "GET uhp"
    phonetic: "/ɡet ʌp/"
    description:
      en: "Leave the bed."
      ja: "ベッドから出る。"
      zh: "離開床鋪。"
    sentence:
      en: "I get up at 7:30."
      ja: "私は7時半に起き上がります。"
      zh: "我7點半起床。"

  - id: brush
    word:
      en: Brush
      ja: 磨く
      zh: 刷
    reading: "BRUHSH"
    phonetic: "/brʌʃ/"
    description:
      en: "Clean teeth."
      ja: "歯を磨く。"
      zh: "刷牙。"
    sentence:
      en: "I brush my teeth in the bathroom."
      ja: "私は浴室で歯を磨きます。"
      zh: "我在浴室刷牙。"

  - id: drink
    word:
      en: Drink
      ja: 飲む
      zh: 喝
    reading: "DRINGK"
    phonetic: "/drɪŋk/"
    description:
      en: "Swallow liquid."
      ja: "液体を飲み込む。"
      zh: "吞嚥液體。"
    sentence:
      en: "I drink tea every morning."
      ja: "私は毎朝お茶を飲みます。"
      zh: "我每天早上喝茶。"

  - id: eat
    word:
      en: Eat
      ja: 食べる
      zh: 吃
    reading: "EET"
    phonetic: "/iːt/"
    description:
      en: "Consume food."
      ja: "食べ物を食べる。"
      zh: "吃食物。"
    sentence:
      en: "I eat toast and eggs."
      ja: "私はトーストと卵を食べます。"
      zh: "我吃吐司和蛋。"

  - id: go
    word:
      en: Go
      ja: 行く
      zh: 去
    reading: "GOH"
    phonetic: "/ɡoʊ/"
    description:
      en: "Move to a place."
      ja: "場所に移動する。"
      zh: "移動到某個地方。"
    sentence:
      en: "I go to work at 8 AM."
      ja: "私は朝8時に仕事に行きます。"
      zh: "我早上8點去上班。"

  - id: work
    word:
      en: Work
      ja: 働く
      zh: 工作
    reading: "WURK"
    phonetic: "/wɜːrk/"
    description:
      en: "Do your job."
      ja: "仕事をする。"
      zh: "做你的工作。"
    sentence:
      en: "I start to work at 9 AM."
      ja: "私は朝9時に仕事を始めます。"
      zh: "我早上9點開始工作。"

chat:
  conversations:
    - id: scenario-1-morning-story
      title:
        en: "My Morning Routine"
        ja: "私の朝のルーティン"
        zh: "我的早晨日常"
      messages:
        - role: partner
          text:
            en: "Good morning! What time do you wake up?"
            ja: "おはようございます！何時に起きますか？"
            zh: "早安！你幾點起床？"
        - role: user
          text:
            en: "I wake up at 7 AM. The alarm rings every day."
            ja: "朝7時に起きます。毎日目覚ましが鳴ります。"
            zh: "我早上7點起床。鬧鐘每天都會響。"
        - role: partner
          text:
            en: "What do you do first in the morning?"
            ja: "朝一番に何をしますか？"
            zh: "你早上第一件事做什麼？"
        - role: user
          text:
            en: "First, I take a hot shower to feel fresh."
            ja: "まず、爽快になるために熱いシャワーを浴びます。"
            zh: "首先，我洗個熱水澡讓自己清爽。"
        - role: partner
          text:
            en: "Do you eat breakfast?"
            ja: "朝食を食べますか？"
            zh: "你吃早餐嗎？"
        - role: user
          text:
            en: "Yes, I eat toast and eggs. I also drink coffee."
            ja: "はい、トーストと卵を食べます。コーヒーも飲みます。"
            zh: "是的，我吃吐司和蛋。我也喝咖啡。"
        - role: partner
          text:
            en: "How do you go to work?"
            ja: "どうやって仕事に行きますか？"
            zh: "你怎麼去上班？"
        - role: user
          text:
            en: "I go by train. I arrive at the office at 9 AM."
            ja: "電車で行きます。朝9時にオフィスに着きます。"
            zh: "我搭火車去。我早上9點到達辦公室。"

    - id: scenario-2-questions-answers
      title:
        en: "Morning Questions"
        ja: "朝の質問"
        zh: "早晨問答"
      messages:
        - role: partner
          text:
            en: "What time do you get up?"
            ja: "何時に起き上がりますか？"
            zh: "你幾點起床？"
        - role: user
          text:
            en: "I get up at 7:30."
            ja: "7時半に起き上がります。"
            zh: "我7點半起床。"
        - role: partner
          text:
            en: "Do you drink coffee?"
            ja: "コーヒーを飲みますか？"
            zh: "你喝咖啡嗎？"
        - role: user
          text:
            en: "No, I drink tea."
            ja: "いいえ、お茶を飲みます。"
            zh: "不，我喝茶。"
        - role: partner
          text:
            en: "Do you brush your teeth before breakfast?"
            ja: "朝食前に歯を磨きますか？"
            zh: "你在早餐前刷牙嗎？"
        - role: user
          text:
            en: "Yes, I brush my teeth in the bathroom."
            ja: "はい、浴室で歯を磨きます。"
            zh: "是的，我在浴室刷牙。"
        - role: partner
          text:
            en: "What clothes do you wear to work?"
            ja: "仕事に何の服を着ますか？"
            zh: "你穿什麼衣服去上班？"
        - role: user
          text:
            en: "I put on a shirt and pants."
            ja: "シャツとズボンを着ます。"
            zh: "我穿襯衫和褲子。"

    - id: scenario-3-tired-morning
      title:
        en: "Tired Morning"
        ja: "疲れた朝"
        zh: "疲憊的早晨"
      messages:
        - role: partner
          text:
            en: "Good morning! You look tired."
            ja: "おはよう！疲れているように見えるね。"
            zh: "早安！你看起來很累。"
        - role: user
          text:
            en: "Yes, I woke up very early today."
            ja: "はい、今日はとても早く起きました。"
            zh: "是的，我今天很早就醒了。"
        - role: partner
          text:
            en: "Did you have coffee?"
            ja: "コーヒーは飲みましたか？"
            zh: "你喝咖啡了嗎？"
        - role: user
          text:
            en: "Not yet. I need a cup right now."
            ja: "まだです。今すぐ一杯必要です。"
            zh: "還沒。我現在需要一杯。"
        - role: partner
          text:
            en: "Let's go to the cafe before we work."
            ja: "仕事の前にカフェに行こう。"
            zh: "我們上班前去咖啡廳吧。"
        - role: user
          text:
            en: "Good idea. I also want some breakfast."
            ja: "いいね。朝食も食べたいです。"
            zh: "好主意。我也想吃點早餐。"
        - role: partner
          text:
            en: "Every morning is the same for you?"
            ja: "毎朝同じですか？"
            zh: "你每天早上都一樣嗎？"
        - role: user
          text:
            en: "Yes, it is a busy morning every day."
            ja: "はい、毎日忙しい朝です。"
            zh: "是的，每天都是忙碌的早晨。"

quiz:
  questionsPerRound: 5
  xpReward: 20
`,vb=`# Chapter: Week 6 - Time & Schedules
meta:
  id: time-and-schedules
  title:
    en: "Time & Schedules"
    ja: "時間とスケジュール"
    zh: "時間與行程"
  description:
    en: "Making plans and understanding the clock."
    ja: "予定を立てて、時計を理解しましょう。"
    zh: "學習安排計畫和看懂時鐘。"
  icon: "⏰"
  order: 6
  level: beginner

words:
  # Day 1: Core Nouns (Time Units)
  - id: hour
    word:
      en: Hour
      ja: 時間
      zh: 小時
    reading: "OW-er"
    phonetic: "/ˈaʊər/"
    description:
      en: "60 minutes."
      ja: "60分。"
      zh: "60分鐘。"
    sentence:
      en: "We talk for two hours."
      ja: "私たちは2時間話します。"
      zh: "我們聊了兩個小時。"

  - id: minute
    word:
      en: Minute
      ja: 分
      zh: 分鐘
    reading: "MIN-it"
    phonetic: "/ˈmɪnɪt/"
    description:
      en: "Small time unit."
      ja: "小さな時間の単位。"
      zh: "小的時間單位。"
    sentence:
      en: "We start in 10 minutes."
      ja: "10分後に始めます。"
      zh: "我們10分鐘後開始。"

  - id: morning
    word:
      en: Morning
      ja: 朝
      zh: 早上
    reading: "MOR-ning"
    phonetic: "/ˈmɔːrnɪŋ/"
    description:
      en: "Start of day."
      ja: "一日の始まり。"
      zh: "一天的開始。"
    sentence:
      en: "On Monday morning, I start work at 9."
      ja: "月曜日の朝、9時に仕事を始めます。"
      zh: "星期一早上，我9點開始工作。"

  - id: afternoon
    word:
      en: Afternoon
      ja: 午後
      zh: 下午
    reading: "af-ter-NOON"
    phonetic: "/ˌæftərˈnuːn/"
    description:
      en: "Middle of day."
      ja: "一日の真ん中。"
      zh: "一天的中間。"
    sentence:
      en: "I have a meeting in the afternoon."
      ja: "午後に会議があります。"
      zh: "我下午有個會議。"

  - id: evening
    word:
      en: Evening
      ja: 夕方
      zh: 傍晚
    reading: "EEV-ning"
    phonetic: "/ˈiːvnɪŋ/"
    description:
      en: "End of day."
      ja: "一日の終わり。"
      zh: "一天的結束。"
    sentence:
      en: "I finish work in the evening."
      ja: "夕方に仕事を終えます。"
      zh: "我傍晚下班。"

  - id: week
    word:
      en: Week
      ja: 週
      zh: 週
    reading: "WEEK"
    phonetic: "/wiːk/"
    description:
      en: "Monday to Sunday."
      ja: "月曜日から日曜日まで。"
      zh: "星期一到星期日。"
    sentence:
      en: "I have a busy week."
      ja: "忙しい週です。"
      zh: "我這週很忙。"

  - id: weekend
    word:
      en: Weekend
      ja: 週末
      zh: 週末
    reading: "WEEK-end"
    phonetic: "/ˈwiːkend/"
    description:
      en: "Saturday and Sunday."
      ja: "土曜日と日曜日。"
      zh: "星期六和星期日。"
    sentence:
      en: "On the weekend, I sleep late."
      ja: "週末は遅くまで寝ます。"
      zh: "週末我睡得很晚。"

  # Day 2: Core Verbs (Time Actions)
  - id: start
    word:
      en: Start
      ja: 始める
      zh: 開始
    reading: "START"
    phonetic: "/stɑːrt/"
    description:
      en: "Begin."
      ja: "始まる。"
      zh: "開始。"
    sentence:
      en: "The movie starts at 8 PM."
      ja: "映画は夜8時に始まります。"
      zh: "電影晚上8點開始。"

  - id: finish
    word:
      en: Finish
      ja: 終わる
      zh: 結束
    reading: "FIN-ish"
    phonetic: "/ˈfɪnɪʃ/"
    description:
      en: "Stop."
      ja: "終わる。"
      zh: "停止。"
    sentence:
      en: "I finish at 6 PM."
      ja: "夕方6時に終わります。"
      zh: "我下午6點結束。"

  - id: meet
    word:
      en: Meet
      ja: 会う
      zh: 見面
    reading: "MEET"
    phonetic: "/miːt/"
    description:
      en: "See a person."
      ja: "人に会う。"
      zh: "見某個人。"
    sentence:
      en: "Let's meet at the cafe."
      ja: "カフェで会いましょう。"
      zh: "我們在咖啡廳見面吧。"

  - id: wait
    word:
      en: Wait
      ja: 待つ
      zh: 等待
    reading: "WAYT"
    phonetic: "/weɪt/"
    description:
      en: "Stay until something happens."
      ja: "何かが起きるまでいる。"
      zh: "停留直到某事發生。"
    sentence:
      en: "I have to wait for the bus."
      ja: "バスを待たなければなりません。"
      zh: "我必須等公車。"

  - id: arrive
    word:
      en: Arrive
      ja: 到着する
      zh: 到達
    reading: "uh-RYV"
    phonetic: "/əˈraɪv/"
    description:
      en: "Come to a place."
      ja: "場所に来る。"
      zh: "來到某個地方。"
    sentence:
      en: "She arrives at 10:30."
      ja: "彼女は10時30分に到着します。"
      zh: "她10點30分到達。"

  - id: leave
    word:
      en: Leave
      ja: 出発する
      zh: 離開
    reading: "LEEV"
    phonetic: "/liːv/"
    description:
      en: "Go away."
      ja: "去る。"
      zh: "離開。"
    sentence:
      en: "We are going away for the weekend."
      ja: "週末に出かけます。"
      zh: "我們週末要出門。"

  - id: late
    word:
      en: Late
      ja: 遅い
      zh: 遲到
    reading: "LAYT"
    phonetic: "/leɪt/"
    description:
      en: "After the correct time."
      ja: "正しい時間の後。"
      zh: "在正確時間之後。"
    sentence:
      en: "Don't be late."
      ja: "遅れないでください。"
      zh: "不要遲到。"

chat:
  conversations:
    - id: scenario-1-busy-week
      title:
        en: "My Busy Week"
        ja: "忙しい週"
        zh: "我忙碌的一週"
      messages:
        - role: partner
          text:
            en: "How is your week going?"
            ja: "今週はどうですか？"
            zh: "這週過得怎麼樣？"
        - role: user
          text:
            en: "I have a busy week."
            ja: "忙しい週です。"
            zh: "我這週很忙。"
        - role: partner
          text:
            en: "What time do you start work on Monday?"
            ja: "月曜日は何時に仕事を始めますか？"
            zh: "星期一你幾點開始工作？"
        - role: user
          text:
            en: "On Monday morning, I start work at 9."
            ja: "月曜日の朝、9時に仕事を始めます。"
            zh: "星期一早上，我9點開始工作。"
        - role: partner
          text:
            en: "Do you have any meetings?"
            ja: "会議はありますか？"
            zh: "你有會議嗎？"
        - role: user
          text:
            en: "Yes, I have a meeting in the afternoon. I finish at 6 PM."
            ja: "はい、午後に会議があります。夕方6時に終わります。"
            zh: "是的，我下午有個會議。我下午6點結束。"
        - role: partner
          text:
            en: "What about Friday?"
            ja: "金曜日はどうですか？"
            zh: "星期五呢？"
        - role: user
          text:
            en: "On Friday evening, I meet my friends for dinner. We talk for two hours."
            ja: "金曜日の夕方、友達と夕食を食べます。2時間話します。"
            zh: "星期五晚上，我和朋友吃晚餐。我們聊了兩個小時。"
        - role: partner
          text:
            en: "And on the weekend?"
            ja: "週末はどうですか？"
            zh: "週末呢？"
        - role: user
          text:
            en: "On the weekend, I sleep late."
            ja: "週末は遅くまで寝ます。"
            zh: "週末我睡得很晚。"

    - id: scenario-2-making-plans
      title:
        en: "Making Lunch Plans"
        ja: "ランチの予定を立てる"
        zh: "安排午餐計畫"
      messages:
        - role: partner
          text:
            en: "Do you want to have lunch?"
            ja: "ランチを食べませんか？"
            zh: "你想吃午餐嗎？"
        - role: user
          text:
            en: "Sure. What time?"
            ja: "いいですね。何時ですか？"
            zh: "好啊。幾點？"
        - role: partner
          text:
            en: "Is 12:30 okay?"
            ja: "12時30分でいいですか？"
            zh: "12點30分可以嗎？"
        - role: user
          text:
            en: "No, I am busy then. Can we meet at 1:00?"
            ja: "いいえ、その時間は忙しいです。1時に会えますか？"
            zh: "不行，我那時候在忙。我們可以1點見面嗎？"
        - role: partner
          text:
            en: "That is fine. Where should we meet?"
            ja: "いいですよ。どこで会いましょうか？"
            zh: "可以。我們在哪裡見面？"
        - role: user
          text:
            en: "Let's meet at the cafe."
            ja: "カフェで会いましょう。"
            zh: "我們在咖啡廳見面吧。"
        - role: partner
          text:
            en: "Great! Don't be late!"
            ja: "いいですね！遅れないでね！"
            zh: "太好了！不要遲到！"
        - role: user
          text:
            en: "I will be there on time."
            ja: "時間通りに着きます。"
            zh: "我會準時到。"

    - id: scenario-3-questions-answers
      title:
        en: "Time Questions"
        ja: "時間の質問"
        zh: "時間問答"
      messages:
        - role: partner
          text:
            en: "What time is it?"
            ja: "今何時ですか？"
            zh: "現在幾點？"
        - role: user
          text:
            en: "It is three o'clock."
            ja: "3時です。"
            zh: "3點。"
        - role: partner
          text:
            en: "When do we start?"
            ja: "いつ始めますか？"
            zh: "我們什麼時候開始？"
        - role: user
          text:
            en: "We start in 10 minutes."
            ja: "10分後に始めます。"
            zh: "我們10分鐘後開始。"
        - role: partner
          text:
            en: "Are you busy today?"
            ja: "今日は忙しいですか？"
            zh: "你今天忙嗎？"
        - role: user
          text:
            en: "Yes, I have no time."
            ja: "はい、時間がありません。"
            zh: "是的，我沒有時間。"
        - role: partner
          text:
            en: "Can we meet on Monday?"
            ja: "月曜日に会えますか？"
            zh: "我們星期一可以見面嗎？"
        - role: user
          text:
            en: "Yes, Monday is fine. See you next week."
            ja: "はい、月曜日でいいです。来週会いましょう。"
            zh: "好，星期一可以。下週見。"
        - role: partner
          text:
            en: "See you tomorrow!"
            ja: "また明日！"
            zh: "明天見！"
        - role: user
          text:
            en: "See you tonight!"
            ja: "今夜会いましょう！"
            zh: "今晚見！"

quiz:
  questionsPerRound: 5
  xpReward: 20
`,xb=`# Chapter: Week 9 - Weather & Seasons
meta:
  id: weather-and-seasons
  title:
    en: "Weather & Seasons"
    ja: "天気と季節"
    zh: "天氣與季節"
  description:
    en: "Describing the outside world and temperature."
    ja: "外の世界と気温を説明しましょう。"
    zh: "學習描述戶外環境和溫度。"
  icon: "🌤️"
  order: 9
  level: beginner

words:
  # Day 1: Core Nouns (Nature)
  - id: sun
    word:
      en: Sun
      ja: 太陽
      zh: 太陽
    reading: "SUHN"
    phonetic: "/sʌn/"
    description:
      en: "Bright star in sky."
      ja: "空にある明るい星。"
      zh: "天空中明亮的星星。"
    sentence:
      en: "The sun is very bright today."
      ja: "今日は太陽がとても明るいです。"
      zh: "今天太陽很亮。"

  - id: rain
    word:
      en: Rain
      ja: 雨
      zh: 雨
    reading: "RAYN"
    phonetic: "/reɪn/"
    description:
      en: "Water falling from sky."
      ja: "空から落ちてくる水。"
      zh: "從天空落下的水。"
    sentence:
      en: "Take your umbrella, it is raining."
      ja: "傘を持って、雨が降っています。"
      zh: "帶上雨傘，正在下雨。"

  - id: snow
    word:
      en: Snow
      ja: 雪
      zh: 雪
    reading: "SNOH"
    phonetic: "/snoʊ/"
    description:
      en: "White ice falling from sky."
      ja: "空から落ちてくる白い氷。"
      zh: "從天空落下的白色冰晶。"
    sentence:
      en: "Look at the white snow on the ground."
      ja: "地面の白い雪を見てください。"
      zh: "看地上的白雪。"

  - id: wind
    word:
      en: Wind
      ja: 風
      zh: 風
    reading: "WIND"
    phonetic: "/wɪnd/"
    description:
      en: "Moving air."
      ja: "動いている空気。"
      zh: "移動的空氣。"
    sentence:
      en: "It is cold and windy outside."
      ja: "外は寒くて風が強いです。"
      zh: "外面又冷又有風。"

  - id: cloud
    word:
      en: Cloud
      ja: 雲
      zh: 雲
    reading: "KLOWD"
    phonetic: "/klaʊd/"
    description:
      en: "White fluff in sky."
      ja: "空にある白いふわふわ。"
      zh: "天空中白色的棉絮。"
    sentence:
      en: "The clouds cover the sky."
      ja: "雲が空を覆っています。"
      zh: "雲遮住了天空。"

  - id: umbrella
    word:
      en: Umbrella
      ja: 傘
      zh: 雨傘
    reading: "uhm-BREL-uh"
    phonetic: "/ʌmˈbrelə/"
    description:
      en: "Tool to stay dry."
      ja: "濡れないための道具。"
      zh: "保持乾燥的工具。"
    sentence:
      en: "I used my umbrella, but my shoes got wet."
      ja: "傘を使いましたが、靴が濡れました。"
      zh: "我用了雨傘，但鞋子還是濕了。"

  - id: temperature
    word:
      en: Temperature
      ja: 温度
      zh: 溫度
    reading: "TEM-per-uh-chur"
    phonetic: "/ˈtemprətʃər/"
    description:
      en: "Hot or Cold degree."
      ja: "暑さや寒さの度合い。"
      zh: "熱或冷的程度。"
    sentence:
      en: "The temperature is high, it is hot."
      ja: "気温が高くて、暑いです。"
      zh: "溫度很高，很熱。"

  # Day 2: Adjectives & Verbs (Conditions)
  - id: hot
    word:
      en: Hot
      ja: 暑い
      zh: 熱
    reading: "HOT"
    phonetic: "/hɑːt/"
    description:
      en: "High temperature, like fire."
      ja: "火のように高い温度。"
      zh: "像火一樣的高溫。"
    sentence:
      en: "It is so hot today!"
      ja: "今日はとても暑いです！"
      zh: "今天好熱！"

  - id: cold
    word:
      en: Cold
      ja: 寒い
      zh: 冷
    reading: "KOHLD"
    phonetic: "/koʊld/"
    description:
      en: "Low temperature, like ice."
      ja: "氷のように低い温度。"
      zh: "像冰一樣的低溫。"
    sentence:
      en: "Yes, you need a coat. It is cold outside."
      ja: "はい、コートが必要です。外は寒いです。"
      zh: "是的，你需要外套。外面很冷。"

  - id: sunny
    word:
      en: Sunny
      ja: 晴れ
      zh: 晴天
    reading: "SUHN-ee"
    phonetic: "/ˈsʌni/"
    description:
      en: "Sun is shining."
      ja: "太陽が輝いている。"
      zh: "太陽正在照耀。"
    sentence:
      en: "I like dry and sunny days."
      ja: "乾燥した晴れた日が好きです。"
      zh: "我喜歡乾燥晴朗的日子。"

  - id: wet
    word:
      en: Wet
      ja: 濡れた
      zh: 濕
    reading: "WET"
    phonetic: "/wet/"
    description:
      en: "Covered in water."
      ja: "水で覆われている。"
      zh: "被水覆蓋。"
    sentence:
      en: "My shoes got wet."
      ja: "靴が濡れました。"
      zh: "我的鞋子濕了。"

  - id: dry
    word:
      en: Dry
      ja: 乾いた
      zh: 乾
    reading: "DRY"
    phonetic: "/draɪ/"
    description:
      en: "No water."
      ja: "水がない。"
      zh: "沒有水。"
    sentence:
      en: "I like dry and sunny days."
      ja: "乾燥した晴れた日が好きです。"
      zh: "我喜歡乾燥晴朗的日子。"

  - id: shine
    word:
      en: Shine
      ja: 輝く
      zh: 照耀
    reading: "SHYN"
    phonetic: "/ʃaɪn/"
    description:
      en: "Give light."
      ja: "光を放つ。"
      zh: "發出光芒。"
    sentence:
      en: "The sun is shining."
      ja: "太陽が輝いています。"
      zh: "太陽正在照耀。"

  - id: blow
    word:
      en: Blow
      ja: 吹く
      zh: 吹
    reading: "BLOH"
    phonetic: "/bloʊ/"
    description:
      en: "Air moving hard."
      ja: "空気が強く動く。"
      zh: "空氣用力移動。"
    sentence:
      en: "The wind is blowing hard."
      ja: "風が強く吹いています。"
      zh: "風吹得很大。"

chat:
  conversations:
    - id: scenario-1-weather-story
      title:
        en: "Yesterday and Today"
        ja: "昨日と今日"
        zh: "昨天和今天"
      messages:
        - role: partner
          text:
            en: "How was the weather yesterday?"
            ja: "昨日の天気はどうでしたか？"
            zh: "昨天天氣怎麼樣？"
        - role: user
          text:
            en: "Yesterday the weather was bad. It was very windy and cold."
            ja: "昨日は天気が悪かったです。とても風が強くて寒かったです。"
            zh: "昨天天氣很差。又風又冷。"
        - role: partner
          text:
            en: "Did it rain?"
            ja: "雨は降りましたか？"
            zh: "有下雨嗎？"
        - role: user
          text:
            en: "Yes, dark clouds filled the sky. Then, the rain started."
            ja: "はい、暗い雲が空を覆いました。そして、雨が降り始めました。"
            zh: "是的，烏雲佈滿天空。然後開始下雨。"
        - role: partner
          text:
            en: "Did you get wet?"
            ja: "濡れましたか？"
            zh: "你有淋濕嗎？"
        - role: user
          text:
            en: "I used my umbrella, but my shoes got wet."
            ja: "傘を使いましたが、靴が濡れました。"
            zh: "我用了雨傘，但鞋子還是濕了。"
        - role: partner
          text:
            en: "How is the weather today?"
            ja: "今日の天気はどうですか？"
            zh: "今天天氣怎麼樣？"
        - role: user
          text:
            en: "Today is different. The sun is out and it is warm. It is a beautiful sunny day."
            ja: "今日は違います。太陽が出ていて暖かいです。美しい晴れた日です。"
            zh: "今天不一樣。太陽出來了，很暖和。是美麗的晴天。"

    - id: scenario-2-hot-day
      title:
        en: "A Hot Day"
        ja: "暑い日"
        zh: "炎熱的一天"
      messages:
        - role: partner
          text:
            en: "It is so hot today!"
            ja: "今日はとても暑いですね！"
            zh: "今天好熱！"
        - role: user
          text:
            en: "Yes, the temperature is 35 degrees."
            ja: "はい、気温は35度です。"
            zh: "是啊，溫度35度。"
        - role: partner
          text:
            en: "I want to go swimming."
            ja: "泳ぎに行きたいです。"
            zh: "我想去游泳。"
        - role: user
          text:
            en: "Good idea. The sun is shining."
            ja: "いいですね。太陽が輝いています。"
            zh: "好主意。太陽正在照耀。"
        - role: partner
          text:
            en: "Wait, look at that cloud."
            ja: "待って、あの雲を見て。"
            zh: "等等，看那朵雲。"
        - role: user
          text:
            en: "Oh no. I think it will rain soon."
            ja: "ああ。すぐ雨が降りそうです。"
            zh: "糟糕。我想快要下雨了。"
        - role: partner
          text:
            en: "Should we bring an umbrella?"
            ja: "傘を持って行きましょうか？"
            zh: "我們要帶雨傘嗎？"
        - role: user
          text:
            en: "Yes, just in case."
            ja: "はい、念のため。"
            zh: "是的，以防萬一。"

    - id: scenario-3-questions-answers
      title:
        en: "Weather Questions"
        ja: "天気の質問"
        zh: "天氣問答"
      messages:
        - role: partner
          text:
            en: "How is the weather?"
            ja: "天気はどうですか？"
            zh: "天氣怎麼樣？"
        - role: user
          text:
            en: "It is raining hard."
            ja: "激しく雨が降っています。"
            zh: "雨下得很大。"
        - role: partner
          text:
            en: "Is it cold outside?"
            ja: "外は寒いですか？"
            zh: "外面冷嗎？"
        - role: user
          text:
            en: "Yes, you need a coat."
            ja: "はい、コートが必要です。"
            zh: "是的，你需要外套。"
        - role: partner
          text:
            en: "Do you like snow?"
            ja: "雪は好きですか？"
            zh: "你喜歡雪嗎？"
        - role: user
          text:
            en: "Yes, it is beautiful."
            ja: "はい、きれいです。"
            zh: "是的，很美。"
        - role: partner
          text:
            en: "Is it sunny?"
            ja: "晴れていますか？"
            zh: "是晴天嗎？"
        - role: user
          text:
            en: "No, it is cloudy."
            ja: "いいえ、曇っています。"
            zh: "不，是陰天。"
        - role: partner
          text:
            en: "How do you feel?"
            ja: "どう感じますか？"
            zh: "你感覺怎麼樣？"
        - role: user
          text:
            en: "I feel warm. It is a nice day."
            ja: "暖かいです。いい日ですね。"
            zh: "我覺得很暖和。天氣很好。"

quiz:
  questionsPerRound: 5
  xpReward: 20
`,bb=`# Chapter: Week 3 - Future & Plans
meta:
  id: future-and-plans
  title:
    en: "Future & Plans"
    ja: "未来と計画"
    zh: "未來與計劃"
  description:
    en: "Talk about your goals, schedule, and predictions using Will, Going to, and Present Continuous correctly."
    ja: "Will、Going to、現在進行形を正しく使って、目標、予定、予測について話しましょう。"
    zh: "學習正確使用 Will、Going to 和現在進行式來談論目標、行程和預測。"
  icon: "🔮"
  order: 3
  level: intermediate

words:
  # Core Vocabulary (Day 1 - Technology Predictions)
  - id: likely
    word:
      en: Likely
      ja: おそらく
      zh: 可能
    reading: "LYK-lee"
    phonetic: "/ˈlaɪkli/"
    description:
      en: "Probable, expected to happen."
      ja: "起こる可能性が高い。"
      zh: "有可能發生的。"
    sentence:
      en: "Electric cars are likely to become more affordable in the next decade."
      ja: "電気自動車は今後10年でより手頃になる可能性が高いです。"
      zh: "電動車在未來十年內可能會變得更實惠。"

  - id: projected-to
    word:
      en: Projected to
      ja: 〜と予測されている
      zh: 預計會
    reading: "proh-JEK-tid too"
    phonetic: "/prəˈdʒektɪd tuː/"
    description:
      en: "Officially estimated or forecasted."
      ja: "公式に推定または予測されている。"
      zh: "正式估計或預測的。"
    sentence:
      en: "The global population is projected to reach 10 billion by 2050."
      ja: "世界人口は2050年までに100億人に達すると予測されています。"
      zh: "全球人口預計到2050年將達到100億。"

  - id: trend
    word:
      en: Trend
      ja: 傾向・トレンド
      zh: 趨勢
    reading: "trend"
    phonetic: "/trend/"
    description:
      en: "A general direction of change or development."
      ja: "変化や発展の一般的な方向性。"
      zh: "變化或發展的大致方向。"
    sentence:
      en: "Remote work is a trend that will continue to grow."
      ja: "リモートワークは成長し続けるトレンドです。"
      zh: "遠端工作是一個將持續增長的趨勢。"

  - id: prediction
    word:
      en: Prediction
      ja: 予測
      zh: 預測
    reading: "pri-DIK-shuhn"
    phonetic: "/prɪˈdɪkʃən/"
    description:
      en: "A statement about what will happen in the future."
      ja: "将来起こることについての声明。"
      zh: "關於未來會發生什麼的陳述。"
    sentence:
      en: "My prediction is that AI will change education completely."
      ja: "私の予測は、AIが教育を完全に変えるということです。"
      zh: "我的預測是人工智慧將徹底改變教育。"

  # Grammar Patterns (Day 2 - Will vs. Going to vs. Present Continuous)
  - id: will-instant
    word:
      en: Will (instant decision)
      ja: 〜します（即座の決定）
      zh: 會（即時決定）
    reading: "wil"
    phonetic: "/wɪl/"
    description:
      en: "Used for decisions made at the moment of speaking."
      ja: "話す瞬間に決めたことに使う。"
      zh: "用於說話當下做出的決定。"
    sentence:
      en: "Someone's at the door. I'll open it."
      ja: "誰か玄関にいます。開けます。"
      zh: "有人在門口。我去開門。"

  - id: going-to-plan
    word:
      en: Going to (plan)
      ja: 〜する予定です
      zh: 打算要
    reading: "GOH-ing too"
    phonetic: "/ˈɡoʊɪŋ tuː/"
    description:
      en: "Used for plans decided before the moment of speaking."
      ja: "話す前にすでに決めた計画に使う。"
      zh: "用於說話之前已經決定好的計劃。"
    sentence:
      en: "I'm going to fly to Japan next month. I already bought the ticket."
      ja: "来月日本に行く予定です。もうチケットを買いました。"
      zh: "我下個月打算飛去日本。我已經買好機票了。"

  - id: present-continuous-fixed
    word:
      en: Present Continuous (fixed)
      ja: 〜する予定です（確定）
      zh: 正在安排（確定的）
    reading: "PREZ-uhnt kuhn-TIN-yoo-uhs"
    phonetic: "/ˈprezənt kənˈtɪnjuəs/"
    description:
      en: "Used for fixed arrangements with specific time/place."
      ja: "具体的な時間や場所が決まった予定に使う。"
      zh: "用於有具體時間/地點的確定安排。"
    sentence:
      en: "I'm meeting him at 5 PM tomorrow at the coffee shop."
      ja: "明日午後5時にコーヒーショップで彼と会います。"
      zh: "我明天下午五點要在咖啡店跟他見面。"

  # Writing Phrases (Day 4 - The 5-Year Plan)
  - id: hope-to
    word:
      en: I hope to...
      ja: 〜したいと思っています
      zh: 我希望能...
    reading: "ay hohp too"
    phonetic: "/aɪ hoʊp tuː/"
    description:
      en: "Express a wish for the future (not certain)."
      ja: "将来の願望を表す（確実ではない）。"
      zh: "表達對未來的願望（不確定）。"
    sentence:
      en: "I hope to travel more and see different cultures."
      ja: "もっと旅行して、様々な文化を見たいと思っています。"
      zh: "我希望能多旅行，看看不同的文化。"

  - id: plan-on
    word:
      en: I plan on...
      ja: 〜するつもりです
      zh: 我計劃要...
    reading: "ay plan on"
    phonetic: "/aɪ plæn ɒn/"
    description:
      en: "Express intention to do something."
      ja: "何かをする意図を表す。"
      zh: "表達做某事的意圖。"
    sentence:
      en: "I plan on learning a new language this year."
      ja: "今年は新しい言語を学ぶつもりです。"
      zh: "我計劃今年學習一門新語言。"

  - id: my-goal-is
    word:
      en: My goal is to...
      ja: 私の目標は〜です
      zh: 我的目標是...
    reading: "my gohl iz too"
    phonetic: "/maɪ ɡoʊl ɪz tuː/"
    description:
      en: "State a specific objective."
      ja: "具体的な目標を述べる。"
      zh: "陳述一個具體的目標。"
    sentence:
      en: "My goal is to get promoted within two years."
      ja: "私の目標は2年以内に昇進することです。"
      zh: "我的目標是在兩年內升職。"

  # Phrasal Verbs (Day 5 - Planning)
  - id: look-forward-to
    word:
      en: Look forward to
      ja: 〜を楽しみにする
      zh: 期待
    reading: "look FOR-werd too"
    phonetic: "/lʊk ˈfɔːrwərd tuː/"
    description:
      en: "Feel excited about something in the future."
      ja: "将来のことにワクワクする。"
      zh: "對未來的事情感到興奮。"
    sentence:
      en: "I'm looking forward to the weekend. I need a break!"
      ja: "週末を楽しみにしています。休憩が必要です！"
      zh: "我很期待週末。我需要休息！"

  - id: put-off
    word:
      en: Put off
      ja: 延期する・先延ばしにする
      zh: 延後、拖延
    reading: "put awf"
    phonetic: "/pʊt ɒf/"
    description:
      en: "Delay or postpone something."
      ja: "何かを遅らせる、先延ばしにする。"
      zh: "推遲或延後某事。"
    sentence:
      en: "I've been putting off going to the gym. I really need to start."
      ja: "ジムに行くのを先延ばしにしています。本当に始めないと。"
      zh: "我一直在拖延去健身房這件事。我真的需要開始了。"

  - id: get-around-to
    word:
      en: Get around to
      ja: ようやく〜する
      zh: 終於去做
    reading: "get uh-ROWND too"
    phonetic: "/ɡet əˈraʊnd tuː/"
    description:
      en: "Finally do something after delay."
      ja: "延期した後でようやく何かをする。"
      zh: "拖延之後終於去做某事。"
    sentence:
      en: "I never get around to cleaning my room. It's always messy."
      ja: "部屋の掃除をする暇がありません。いつも散らかっています。"
      zh: "我總是沒時間打掃房間。它總是很亂。"

chat:
  conversations:
    - id: scenario-1-five-year-plan
      title:
        en: "The 5-Year Plan"
        ja: "5年計画"
        zh: "五年計劃"
      messages:
        - role: partner
          text:
            en: "So, do you have any big plans for the future?"
            ja: "それで、将来の大きな計画はありますか？"
            zh: "那麼，你對未來有什麼大計劃嗎？"
        - role: user
          text:
            en: "Yes, actually. My goal is to get promoted within two years."
            ja: "はい、実は。私の目標は2年以内に昇進することです。"
            zh: "有的，其實。我的目標是在兩年內升職。"
        - role: partner
          text:
            en: "That's ambitious! What else do you hope to achieve?"
            ja: "野心的ですね！他に達成したいことは何ですか？"
            zh: "很有抱負！你還希望達成什麼？"
        - role: user
          text:
            en: "I hope to travel more. I plan on visiting at least three new countries."
            ja: "もっと旅行したいと思っています。少なくとも3つの新しい国を訪れるつもりです。"
            zh: "我希望能多旅行。我計劃至少去三個新的國家。"
        - role: partner
          text:
            en: "Nice! Any specific destinations you're looking forward to?"
            ja: "いいですね！楽しみにしている具体的な目的地はありますか？"
            zh: "不錯！有什麼特別期待的目的地嗎？"
        - role: user
          text:
            en: "I'm looking forward to visiting Japan. I'm going to start saving money this month."
            ja: "日本を訪れるのを楽しみにしています。今月から貯金を始める予定です。"
            zh: "我很期待去日本。我這個月打算開始存錢。"
        - role: partner
          text:
            en: "Have you been putting off any plans recently?"
            ja: "最近先延ばしにしている計画はありますか？"
            zh: "你最近有拖延什麼計劃嗎？"
        - role: user
          text:
            en: "Honestly, yes. I've been putting off learning a new language. But I plan on starting next month."
            ja: "正直に言うと、はい。新しい言語を学ぶのを先延ばしにしています。でも来月から始めるつもりです。"
            zh: "老實說，有的。我一直在拖延學習新語言。但我計劃下個月開始。"

    - id: scenario-2-making-weekend-plans
      title:
        en: "Making Weekend Plans"
        ja: "週末の予定を立てる"
        zh: "規劃週末"
      messages:
        - role: partner
          text:
            en: "Hey, what are you doing this weekend?"
            ja: "ねえ、今週末は何をするの？"
            zh: "嘿，你這週末要做什麼？"
        - role: user
          text:
            en: "I'm meeting my sister at 2 PM on Saturday. We're having lunch together."
            ja: "土曜日の午後2時に姉と会います。一緒にランチをします。"
            zh: "我星期六下午兩點要跟我姐見面。我們要一起吃午餐。"
        - role: partner
          text:
            en: "Nice! What about Sunday? Do you have any plans?"
            ja: "いいね！日曜日は？何か予定ある？"
            zh: "不錯！星期天呢？你有什麼計劃嗎？"
        - role: user
          text:
            en: "I'm going to clean my apartment. I've been putting it off for weeks."
            ja: "アパートを掃除する予定です。何週間も先延ばしにしていました。"
            zh: "我打算打掃公寓。我已經拖延好幾週了。"
        - role: partner
          text:
            en: "Ha! I know that feeling. Want to grab coffee after you finish?"
            ja: "わかる！終わったらコーヒー飲まない？"
            zh: "哈！我懂那種感覺。你忙完後要不要去喝杯咖啡？"
        - role: user
          text:
            en: "Sure, I'll text you when I'm done. Oh wait, I just remembered - the weather forecast said it will be rainy on Sunday."
            ja: "いいよ、終わったらメッセージするね。あ、待って、思い出した - 天気予報で日曜日は雨だって。"
            zh: "好啊，我忙完傳訊息給你。哦等等，我剛想起來 - 天氣預報說星期天會下雨。"
        - role: partner
          text:
            en: "Perfect weather for staying home then! What time works for you?"
            ja: "じゃあ家にいるのにぴったりの天気だね！何時がいい？"
            zh: "那正好是待在家的好天氣！你幾點方便？"
        - role: user
          text:
            en: "I'll be free around 4 PM. I'll come to the cafe near your place."
            ja: "4時頃には空くと思う。あなたの家の近くのカフェに行くよ。"
            zh: "我大概下午四點會有空。我會去你家附近的咖啡廳。"

    - id: scenario-3-predictions-and-schedules
      title:
        en: "Predictions and Schedules"
        ja: "予測とスケジュール"
        zh: "預測和行程"
      messages:
        - role: partner
          text:
            en: "What do you think the future of work will look like?"
            ja: "仕事の未来はどうなると思いますか？"
            zh: "你認為工作的未來會是什麼樣子？"
        - role: user
          text:
            en: "Remote work is likely to become even more common. It's a growing trend."
            ja: "リモートワークはさらに一般的になる可能性が高いです。成長しているトレンドです。"
            zh: "遠端工作可能會變得更加普遍。這是一個增長中的趨勢。"
        - role: partner
          text:
            en: "What's your prediction for AI and jobs?"
            ja: "AIと仕事についての予測は何ですか？"
            zh: "你對人工智慧和工作有什麼預測？"
        - role: user
          text:
            en: "My prediction is that AI will change many industries. Some jobs are projected to disappear."
            ja: "私の予測は、AIが多くの産業を変えるということです。いくつかの仕事は消えると予測されています。"
            zh: "我的預測是人工智慧將改變許多產業。有些工作預計會消失。"
        - role: partner
          text:
            en: "Are you doing anything to prepare for these changes?"
            ja: "これらの変化に備えて何かしていますか？"
            zh: "你有在為這些變化做準備嗎？"
        - role: user
          text:
            en: "Yes, I'm taking an online course next month. The classes start on the 15th."
            ja: "はい、来月オンラインコースを受講します。授業は15日に始まります。"
            zh: "有的，我下個月要上一個線上課程。課程十五號開始。"
        - role: partner
          text:
            en: "That's smart! How long is the course?"
            ja: "賢いですね！コースはどのくらいの長さですか？"
            zh: "很聰明！課程有多長？"
        - role: user
          text:
            en: "It's three months. I'm looking forward to learning new skills. I've been putting off upgrading my skills for too long."
            ja: "3ヶ月です。新しいスキルを学ぶのを楽しみにしています。スキルアップを長い間先延ばしにしていました。"
            zh: "三個月。我很期待學習新技能。我拖延提升技能太久了。"
        - role: partner
          text:
            en: "When do you think you'll finally get around to using those new skills?"
            ja: "いつ頃その新しいスキルを使えるようになると思いますか？"
            zh: "你覺得你什麼時候會終於開始使用那些新技能？"
        - role: user
          text:
            en: "Hopefully by next year. My goal is to switch to a more tech-focused role."
            ja: "来年までにはできると思います。私の目標は、より技術に特化した役職に移ることです。"
            zh: "希望明年之前。我的目標是轉到一個更專注於科技的職位。"

quiz:
  questionsPerRound: 5
  xpReward: 25
`,wb=`# Chapter: Week 4 - Experiences & Achievements
meta:
  id: experiences-and-achievements
  title:
    en: "Experiences & Achievements"
    ja: "経験と達成"
    zh: "經歷與成就"
  description:
    en: "Discuss life achievements and travel experiences using Present Perfect. Learn when time matters and when it doesn't."
    ja: "現在完了形を使って人生の達成や旅行経験について話しましょう。時間が重要な場合とそうでない場合を学びます。"
    zh: "用現在完成式討論人生成就和旅行經歷。學習何時時間重要，何時不重要。"
  icon: "🏆"
  order: 4
  level: intermediate

words:
  # Present Perfect Structures (Day 1-2)
  - id: have-done
    word:
      en: I have done...
      ja: 〜したことがある
      zh: 我做過...
    reading: "ay hav duhn"
    phonetic: "/aɪ hæv dʌn/"
    description:
      en: "Present Perfect for life experiences (time not specified)."
      ja: "人生経験を表す現在完了形（時間は指定しない）。"
      zh: "用現在完成式表達人生經歷（不指定時間）。"
    sentence:
      en: "I have seen that movie three times. It's my favorite."
      ja: "その映画を3回見たことがあります。私のお気に入りです。"
      zh: "那部電影我看過三次了。是我的最愛。"

  - id: have-you-ever
    word:
      en: Have you ever...?
      ja: 〜したことがありますか？
      zh: 你曾經...嗎？
    reading: "hav yoo EV-er"
    phonetic: "/hæv juː ˈevər/"
    description:
      en: "Ask about someone's life experiences."
      ja: "誰かの人生経験について尋ねる。"
      zh: "詢問某人的人生經歷。"
    sentence:
      en: "Have you ever been to Japan? I'd love to visit someday."
      ja: "日本に行ったことはありますか？いつか訪れたいです。"
      zh: "你去過日本嗎？我很想有一天去看看。"

  - id: have-never
    word:
      en: I have never...
      ja: 一度も〜したことがない
      zh: 我從未...
    reading: "ay hav NEV-er"
    phonetic: "/aɪ hæv ˈnevər/"
    description:
      en: "Express something you haven't experienced in your life."
      ja: "人生で経験したことがないことを表す。"
      zh: "表達你人生中從未經歷過的事。"
    sentence:
      en: "I have never tried skydiving. It looks terrifying!"
      ja: "スカイダイビングをしたことがありません。恐ろしそうです！"
      zh: "我從沒試過跳傘。看起來太可怕了！"

  - id: havent-yet
    word:
      en: I haven't... yet
      ja: まだ〜していない
      zh: 我還沒...
    reading: "ay HAV-uhnt yet"
    phonetic: "/aɪ ˈhævənt jet/"
    description:
      en: "Something not done but expected or planned."
      ja: "まだしていないが、予定していることや期待していること。"
      zh: "尚未完成但預期或計劃要做的事。"
    sentence:
      en: "I haven't learned to ski yet, but it's on my bucket list."
      ja: "まだスキーを習っていませんが、やりたいことリストに入っています。"
      zh: "我還沒學會滑雪，但它在我的願望清單上。"

  - id: already
    word:
      en: Already
      ja: すでに・もう
      zh: 已經
    reading: "awl-RED-ee"
    phonetic: "/ɔːlˈredi/"
    description:
      en: "Something completed sooner than expected."
      ja: "予想より早く完了したこと。"
      zh: "比預期更早完成的事。"
    sentence:
      en: "I've already finished the report. I can help you now."
      ja: "すでにレポートを終えました。今あなたを手伝えます。"
      zh: "我已經完成報告了。現在可以幫你。"

  # Strong Adjectives (Day 5)
  - id: breath-taking
    word:
      en: Breath-taking
      ja: 息を呑むほど美しい
      zh: 令人嘆為觀止的
    reading: "BRETH-tay-king"
    phonetic: "/ˈbreθˌteɪkɪŋ/"
    description:
      en: "Extremely beautiful or impressive (stronger than 'beautiful')."
      ja: "極めて美しい、印象的（'beautiful'より強い）。"
      zh: "極其美麗或令人印象深刻（比 'beautiful' 更強烈）。"
    sentence:
      en: "The view from the mountain was breath-taking. I'll never forget it."
      ja: "山からの景色は息を呑むほど美しかったです。決して忘れません。"
      zh: "山上的景色令人嘆為觀止。我永遠不會忘記。"

  - id: exhausting
    word:
      en: Exhausting
      ja: 疲れ果てる
      zh: 令人精疲力竭的
    reading: "ig-ZAWS-ting"
    phonetic: "/ɪɡˈzɔːstɪŋ/"
    description:
      en: "Extremely tiring (stronger than 'tiring')."
      ja: "極めて疲れる（'tiring'より強い）。"
      zh: "極度疲累的（比 'tiring' 更強烈）。"
    sentence:
      en: "The hike was exhausting but totally worth it."
      ja: "ハイキングは疲れ果てましたが、完全にその価値がありました。"
      zh: "那次健行令人精疲力竭，但完全值得。"

  - id: terrifying
    word:
      en: Terrifying
      ja: 恐ろしい
      zh: 令人恐懼的
    reading: "TER-uh-fy-ing"
    phonetic: "/ˈterɪfaɪɪŋ/"
    description:
      en: "Extremely scary (stronger than 'scary')."
      ja: "極めて怖い（'scary'より強い）。"
      zh: "極度可怕的（比 'scary' 更強烈）。"
    sentence:
      en: "The experience was terrifying. My hands were shaking the whole time."
      ja: "その経験は恐ろしかったです。ずっと手が震えていました。"
      zh: "那次經歷令人恐懼。我的手全程都在發抖。"

  - id: overwhelming
    word:
      en: Overwhelming
      ja: 圧倒的な
      zh: 令人難以承受的
    reading: "oh-ver-WELM-ing"
    phonetic: "/ˌoʊvərˈwelmɪŋ/"
    description:
      en: "Too much emotion or information to handle."
      ja: "処理しきれないほどの感情や情報。"
      zh: "情緒或資訊多到難以處理。"
    sentence:
      en: "Starting a new job can be overwhelming at first."
      ja: "新しい仕事を始めるのは最初は圧倒的です。"
      zh: "剛開始新工作可能會讓人難以承受。"

  - id: life-changing
    word:
      en: Life-changing
      ja: 人生を変える
      zh: 改變人生的
    reading: "LYFE-chayn-jing"
    phonetic: "/ˈlaɪfˌtʃeɪndʒɪŋ/"
    description:
      en: "Changes your perspective or life completely."
      ja: "視点や人生を完全に変える。"
      zh: "徹底改變你的觀點或人生。"
    sentence:
      en: "Traveling alone was a life-changing experience for me."
      ja: "一人旅は私にとって人生を変える経験でした。"
      zh: "獨自旅行對我來說是一次改變人生的經歷。"

  # Achievement Vocabulary (Day 3)
  - id: managed-to
    word:
      en: I have managed to...
      ja: なんとか〜できた
      zh: 我設法做到了...
    reading: "ay hav MAN-ijd too"
    phonetic: "/aɪ hæv ˈmænɪdʒd tuː/"
    description:
      en: "Successfully accomplished something difficult."
      ja: "難しいことを首尾よく成し遂げた。"
      zh: "成功完成了困難的事情。"
    sentence:
      en: "I have managed a team of 10 people for two years."
      ja: "2年間10人のチームを管理してきました。"
      zh: "我已經管理一個十人團隊兩年了。"

  - id: achievement
    word:
      en: Achievement
      ja: 達成・業績
      zh: 成就
    reading: "uh-CHEEV-muhnt"
    phonetic: "/əˈtʃiːvmənt/"
    description:
      en: "Something accomplished through effort or skill."
      ja: "努力やスキルによって達成したこと。"
      zh: "通過努力或技能完成的事情。"
    sentence:
      en: "What is your biggest achievement so far?"
      ja: "これまでで一番の達成は何ですか？"
      zh: "到目前為止你最大的成就是什麼？"

  - id: bucket-list
    word:
      en: Bucket list
      ja: やりたいことリスト
      zh: 願望清單
    reading: "BUH-kit list"
    phonetic: "/ˈbʌkɪt lɪst/"
    description:
      en: "List of things you want to do before you die."
      ja: "死ぬまでにやりたいことのリスト。"
      zh: "死前想做的事情清單。"
    sentence:
      en: "Visiting the Northern Lights is on my bucket list."
      ja: "オーロラを見ることがやりたいことリストに入っています。"
      zh: "看北極光在我的願望清單上。"

  - id: paid-my-dues
    word:
      en: Paid my dues
      ja: 苦労を重ねてきた
      zh: 付出了代價
    reading: "payd my dooz"
    phonetic: "/peɪd maɪ duːz/"
    description:
      en: "Worked hard and earned your position through experience."
      ja: "一生懸命働き、経験を通じて地位を得た。"
      zh: "努力工作並通過經驗贏得了你的地位。"
    sentence:
      en: "I've paid my dues in this industry for over ten years."
      ja: "この業界で10年以上苦労を重ねてきました。"
      zh: "我在這個行業付出了十多年的代價。"

chat:
  conversations:
    - id: scenario-1-job-interview
      title:
        en: "The Job Interview"
        ja: "就職面接"
        zh: "工作面試"
      messages:
        - role: partner
          text:
            en: "Thank you for coming in today. Let's start - what is your biggest achievement?"
            ja: "今日はお越しいただきありがとうございます。始めましょう - あなたの一番の達成は何ですか？"
            zh: "感謝你今天過來。我們開始吧 - 你最大的成就是什麼？"
        - role: user
          text:
            en: "I have managed a team of 10 people for two years. We increased sales by 30%."
            ja: "2年間10人のチームを管理してきました。売上を30%増加させました。"
            zh: "我管理了一個十人團隊兩年。我們讓銷售額增加了30%。"
        - role: partner
          text:
            en: "Impressive! Have you ever worked under pressure with tight deadlines?"
            ja: "素晴らしい！厳しい締め切りのプレッシャーの下で働いたことはありますか？"
            zh: "令人印象深刻！你曾經在緊迫的截止日期壓力下工作過嗎？"
        - role: user
          text:
            en: "Yes, I have. It was overwhelming at first, but I've learned to prioritize tasks effectively."
            ja: "はい、あります。最初は圧倒的でしたが、タスクを効果的に優先することを学びました。"
            zh: "是的，有過。一開始讓人難以承受，但我學會了有效地排定任務優先順序。"
        - role: partner
          text:
            en: "Have you ever had to deal with a difficult client?"
            ja: "難しいクライアントに対処しなければならなかったことはありますか？"
            zh: "你曾經處理過難搞的客戶嗎？"
        - role: user
          text:
            en: "I have. Last year, I managed to turn an unhappy customer into our biggest supporter."
            ja: "あります。去年、不満を持っていた顧客を最大のサポーターに変えることができました。"
            zh: "有過。去年，我設法把一個不滿意的客戶變成我們最大的支持者。"
        - role: partner
          text:
            en: "That's a life-changing skill in this industry. Is there anything you haven't done yet?"
            ja: "それはこの業界で人生を変えるスキルですね。まだやっていないことはありますか？"
            zh: "那在這個行業是改變人生的技能。有什麼你還沒做過的事嗎？"
        - role: user
          text:
            en: "I haven't led an international team yet, but it's definitely on my list. I'm excited about the opportunity."
            ja: "まだ国際チームを率いたことはありませんが、それは確実にリストにあります。この機会にワクワクしています。"
            zh: "我還沒有領導過國際團隊，但這絕對在我的清單上。我對這個機會感到興奮。"

    - id: scenario-2-travel-stories
      title:
        en: "Travel Stories"
        ja: "旅行の話"
        zh: "旅行故事"
      messages:
        - role: partner
          text:
            en: "I heard you've traveled a lot! What's the most breath-taking place you've been to?"
            ja: "たくさん旅行したと聞きました！一番息を呑むような場所はどこでしたか？"
            zh: "我聽說你旅行過很多地方！你去過最令人嘆為觀止的地方是哪裡？"
        - role: user
          text:
            en: "I've been to the Grand Canyon. The view was absolutely breath-taking. I'll never forget it."
            ja: "グランドキャニオンに行ったことがあります。景色は本当に息を呑むほどでした。決して忘れません。"
            zh: "我去過大峽谷。那裡的景色絕對令人嘆為觀止。我永遠不會忘記。"
        - role: partner
          text:
            en: "Have you ever had a terrifying travel experience?"
            ja: "恐ろしい旅行経験はありましたか？"
            zh: "你有過令人恐懼的旅行經歷嗎？"
        - role: user
          text:
            en: "Yes! I've gone bungee jumping in New Zealand. It was terrifying but also life-changing."
            ja: "はい！ニュージーランドでバンジージャンプをしたことがあります。恐ろしかったですが、人生を変える体験でした。"
            zh: "有！我在紐西蘭跳過高空彈跳。很恐怖但也是改變人生的經歷。"
        - role: partner
          text:
            en: "What about physically challenging trips? Have you done any exhausting hikes?"
            ja: "体力的に大変な旅行はどうですか？疲れ果てるようなハイキングをしたことはありますか？"
            zh: "那體力挑戰型的旅行呢？你有做過令人精疲力竭的健行嗎？"
        - role: user
          text:
            en: "I've hiked Mount Fuji. It was exhausting but totally worth it. The sunrise was incredible."
            ja: "富士山に登ったことがあります。疲れ果てましたが、完全にその価値がありました。日の出は信じられないほどでした。"
            zh: "我爬過富士山。非常累人但完全值得。日出太驚人了。"
        - role: partner
          text:
            en: "Is there anywhere you haven't been yet but really want to visit?"
            ja: "まだ行ったことがないけど、本当に行きたい場所はありますか？"
            zh: "有什麼你還沒去過但真的很想去的地方嗎？"
        - role: user
          text:
            en: "I haven't visited the Northern Lights yet. It's been on my bucket list for years."
            ja: "まだオーロラを見たことがありません。何年もやりたいことリストに入っています。"
            zh: "我還沒看過北極光。它在我的願望清單上好幾年了。"
        - role: partner
          text:
            en: "I've already been there twice! The experience was overwhelming - I actually cried."
            ja: "私はすでに2回行きました！その経験は圧倒的で、実際に泣きました。"
            zh: "我已經去過兩次了！那種體驗讓人難以承受 - 我真的哭了。"
        - role: user
          text:
            en: "Now I want to go even more! I've paid my dues saving money. This year is the year!"
            ja: "今はもっと行きたくなりました！お金を貯めるために苦労を重ねてきました。今年こそは！"
            zh: "現在我更想去了！我存錢存了很久。今年就是那一年！"

    - id: scenario-3-never-have-i-ever
      title:
        en: "Never Have I Ever"
        ja: "やったことがないゲーム"
        zh: "我從來沒有"
      messages:
        - role: partner
          text:
            en: "Let's play a game! Have you ever eaten something really unusual?"
            ja: "ゲームをしよう！本当に変わったものを食べたことがありますか？"
            zh: "來玩個遊戲吧！你曾經吃過什麼真的很特別的東西嗎？"
        - role: user
          text:
            en: "Yes, I have! I've eaten sushi with raw horse meat in Japan. Have you ever tried it?"
            ja: "はい、あります！日本で馬刺しの寿司を食べたことがあります。試したことはありますか？"
            zh: "有啊！我在日本吃過生馬肉壽司。你試過嗎？"
        - role: partner
          text:
            en: "No, I haven't tried that yet! Have you ever sung karaoke in public?"
            ja: "いいえ、まだ試したことがありません！公衆の前でカラオケを歌ったことはありますか？"
            zh: "沒有，我還沒試過那個！你曾經在公開場合唱過卡拉OK嗎？"
        - role: user
          text:
            en: "I have never sung karaoke. The idea is terrifying to me! How about you?"
            ja: "カラオケを歌ったことがありません。私には恐ろしいアイデアです！あなたはどうですか？"
            zh: "我從來沒唱過卡拉OK。這個想法對我來說很可怕！你呢？"
        - role: partner
          text:
            en: "I've already done it many times! It's fun. Have you ever run a marathon?"
            ja: "すでに何度もやりました！楽しいですよ。マラソンを走ったことはありますか？"
            zh: "我已經唱過很多次了！很好玩。你跑過馬拉松嗎？"
        - role: user
          text:
            en: "I haven't run a marathon yet, but it's on my bucket list. It sounds exhausting!"
            ja: "まだマラソンを走ったことはありませんが、やりたいことリストに入っています。疲れそうですね！"
            zh: "我還沒跑過馬拉松，但它在我的願望清單上。聽起來超累的！"
        - role: partner
          text:
            en: "Trust me, it's exhausting but life-changing. Have you ever learned a new language?"
            ja: "信じて、疲れますが人生を変えますよ。新しい言語を学んだことはありますか？"
            zh: "相信我，很累但會改變人生。你學過新語言嗎？"
        - role: user
          text:
            en: "Yes! I've studied English for years. It was overwhelming at first but I've managed to improve a lot."
            ja: "はい！何年も英語を勉強してきました。最初は圧倒的でしたが、かなり上達することができました。"
            zh: "有！我學英語學了好幾年。一開始讓人難以承受，但我設法進步了很多。"
        - role: partner
          text:
            en: "That's an amazing achievement! What haven't you done yet that you really want to try?"
            ja: "それは素晴らしい達成ですね！まだやっていないけど本当にやりたいことは何ですか？"
            zh: "那是很棒的成就！有什麼你還沒做過但真的很想嘗試的？"
        - role: user
          text:
            en: "I've never tried skydiving. It looks terrifying, but maybe one day I'll be brave enough!"
            ja: "スカイダイビングをしたことがありません。恐ろしそうですが、いつか勇気が出るかもしれません！"
            zh: "我從沒試過跳傘。看起來很可怕，但也許有一天我會夠勇敢！"

quiz:
  questionsPerRound: 5
  xpReward: 25
`,_b=`# Chapter: Week 5 - Travel Problems & Complaints
meta:
  id: travel-problems-and-complaints
  title:
    en: "Travel Problems & Complaints"
    ja: "旅行のトラブルと苦情"
    zh: "旅行問題與投訴"
  description:
    en: "Handle travel problems politely using modal verbs. Learn to make complaints, describe lost items, and give balanced feedback."
    ja: "丁寧な表現を使って旅行のトラブルに対処しましょう。苦情の伝え方、紛失物の説明、バランスの取れたフィードバックを学びます。"
    zh: "學習用禮貌的情態動詞處理旅行問題。學會投訴、描述遺失物品，以及給予平衡的反饋。"
  icon: "🧳"
  order: 5
  level: intermediate

words:
  # Complaint Adjectives (Day 1)
  - id: filthy
    word:
      en: Filthy
      ja: 不潔な
      zh: 骯髒的
    reading: "FIL-thee"
    phonetic: "/ˈfɪlθi/"
    description:
      en: "Extremely dirty (stronger than 'dirty')."
      ja: "極めて汚い（'dirty'より強い）。"
      zh: "極度髒的（比 'dirty' 更強烈）。"
    sentence:
      en: "The bathroom was filthy. There was mold everywhere."
      ja: "バスルームは不潔でした。至る所にカビがありました。"
      zh: "浴室非常髒。到處都是霉菌。"

  - id: rude
    word:
      en: Rude
      ja: 失礼な
      zh: 粗魯的
    reading: "rood"
    phonetic: "/ruːd/"
    description:
      en: "Not polite or respectful in behavior."
      ja: "礼儀正しくない、無礼な行動。"
      zh: "行為不禮貌或不尊重人的。"
    sentence:
      en: "The staff was rude and unhelpful when I asked for assistance."
      ja: "スタッフは私が助けを求めた時、失礼で役に立ちませんでした。"
      zh: "當我尋求幫助時，員工很粗魯且不願意幫忙。"

  - id: unacceptable
    word:
      en: Unacceptable
      ja: 受け入れられない
      zh: 無法接受的
    reading: "uhn-ak-SEP-tuh-buhl"
    phonetic: "/ˌʌnəkˈseptəbl/"
    description:
      en: "Not good enough to be accepted or allowed."
      ja: "受け入れたり許可したりするには不十分。"
      zh: "不夠好，無法被接受或允許。"
    sentence:
      en: "The service was unacceptable. We waited two hours for our food."
      ja: "サービスは受け入れられませんでした。食事を2時間待ちました。"
      zh: "服務無法接受。我們等了兩個小時才上菜。"

  - id: disappointing
    word:
      en: Disappointing
      ja: がっかりする
      zh: 令人失望的
    reading: "dis-uh-POIN-ting"
    phonetic: "/ˌdɪsəˈpɔɪntɪŋ/"
    description:
      en: "Not as good as you hoped or expected."
      ja: "期待や希望ほど良くない。"
      zh: "不如你期望或希望的那麼好。"
    sentence:
      en: "The view was disappointing. It was nothing like the photos online."
      ja: "景色はがっかりでした。オンラインの写真とは全く違いました。"
      zh: "景色令人失望。跟網上的照片完全不一樣。"

  - id: overpriced
    word:
      en: Overpriced
      ja: 高すぎる
      zh: 定價過高的
    reading: "oh-ver-PRYST"
    phonetic: "/ˌoʊvərˈpraɪst/"
    description:
      en: "Costing more than it is worth."
      ja: "価値より高い値段。"
      zh: "價格超過其實際價值。"
    sentence:
      en: "The hotel was overpriced for what you get. Not worth the money."
      ja: "そのホテルは内容に対して高すぎました。お金の価値がありません。"
      zh: "這間飯店以提供的內容來說定價過高。不值那個錢。"

  # Polite Modal Verbs (Day 2)
  - id: would-like
    word:
      en: I would like...
      ja: 〜をお願いしたいのですが
      zh: 我想要...
    reading: "ay wuud lyk"
    phonetic: "/aɪ wʊd laɪk/"
    description:
      en: "Polite way to say 'I want' (formal requests)."
      ja: "'I want'の丁寧な言い方（正式な依頼）。"
      zh: "'I want' 的禮貌說法（正式請求）。"
    sentence:
      en: "I would like a refund, please. The product was defective."
      ja: "返金をお願いしたいのですが。製品に欠陥がありました。"
      zh: "我想要退款。產品有瑕疵。"

  - id: could-you-please
    word:
      en: Could you please...?
      ja: 〜していただけますか？
      zh: 能否請您...？
    reading: "kuud yoo pleez"
    phonetic: "/kʊd juː pliːz/"
    description:
      en: "Very polite way to ask someone to do something."
      ja: "誰かに何かをしてもらうとても丁寧な方法。"
      zh: "非常禮貌地請求某人做某事的方式。"
    sentence:
      en: "Could you please look into this? There seems to be a mistake."
      ja: "これを確認していただけますか？間違いがあるようです。"
      zh: "能否請您查看一下？似乎有個錯誤。"

  - id: would-you-mind
    word:
      en: Would you mind...?
      ja: 〜していただいても構いませんか？
      zh: 您介意...嗎？
    reading: "wuud yoo mynd"
    phonetic: "/wʊd juː maɪnd/"
    description:
      en: "Extremely polite way to make a request."
      ja: "極めて丁寧な依頼の方法。"
      zh: "極其禮貌的請求方式。"
    sentence:
      en: "Would you mind checking again? I'm sure I made a reservation."
      ja: "もう一度確認していただいても構いませんか？予約したはずです。"
      zh: "您介意再查一次嗎？我確定我有訂位。"

  - id: would-appreciate
    word:
      en: I would appreciate it if...
      ja: 〜していただけると幸いです
      zh: 如果...我會很感激
    reading: "ay wuud uh-PREE-shee-ayt"
    phonetic: "/aɪ wʊd əˈpriːʃieɪt/"
    description:
      en: "Formal, polite way to express a strong request."
      ja: "強い依頼を表す正式で丁寧な方法。"
      zh: "表達強烈請求的正式、禮貌方式。"
    sentence:
      en: "I would appreciate it if you could move me to a quieter room."
      ja: "静かな部屋に移していただけると幸いです。"
      zh: "如果您能幫我換到安靜一點的房間，我會很感激。"

  # Travel Phrasal Verbs (Day 5)
  - id: check-in
    word:
      en: Check in
      ja: チェックインする
      zh: 辦理入住/報到
    reading: "chek in"
    phonetic: "/tʃek ɪn/"
    description:
      en: "Register arrival at a hotel or airport."
      ja: "ホテルや空港で到着を登録する。"
      zh: "在飯店或機場登記到達。"
    sentence:
      en: "What time can we check in? We arrived early."
      ja: "何時にチェックインできますか？早く着きました。"
      zh: "我們幾點可以辦理入住？我們提早到了。"

  - id: check-out
    word:
      en: Check out
      ja: チェックアウトする
      zh: 辦理退房
    reading: "chek out"
    phonetic: "/tʃek aʊt/"
    description:
      en: "Leave a hotel and pay the bill."
      ja: "ホテルを出て精算する。"
      zh: "離開飯店並結帳。"
    sentence:
      en: "What time is check out? I need to catch an early flight."
      ja: "チェックアウトは何時ですか？早い便に乗らなければなりません。"
      zh: "退房時間是幾點？我需要趕早班飛機。"

  - id: drop-off
    word:
      en: Drop off
      ja: 降ろす・届ける
      zh: 送達/放下
    reading: "drop awf"
    phonetic: "/drɑːp ɔːf/"
    description:
      en: "Take someone or something to a place and leave them there."
      ja: "誰かや何かを場所に連れて行き、そこに残す。"
      zh: "把某人或某物送到某處並離開。"
    sentence:
      en: "Could you drop me off at the airport, please?"
      ja: "空港で降ろしていただけますか？"
      zh: "能否請您送我到機場？"

  - id: get-around
    word:
      en: Get around
      ja: 移動する
      zh: 四處走動
    reading: "get uh-ROUND"
    phonetic: "/ɡet əˈraʊnd/"
    description:
      en: "Move from place to place within an area."
      ja: "ある地域内で場所から場所へ移動する。"
      zh: "在一個區域內從一個地方移動到另一個地方。"
    sentence:
      en: "It's easy to get around Taipei by MRT. Very convenient!"
      ja: "台北はMRTで移動するのが簡単です。とても便利！"
      zh: "在台北搭捷運四處走動很方便！"

  # Balanced Feedback (Day 4)
  - id: however
    word:
      en: However
      ja: しかしながら
      zh: 然而
    reading: "how-EV-er"
    phonetic: "/haʊˈevər/"
    description:
      en: "Used to introduce a contrasting point (formal 'but')."
      ja: "対照的なポイントを導入する（正式な'but'）。"
      zh: "用來引入對比觀點（正式的 'but'）。"
    sentence:
      en: "The room was lovely. However, it was quite noisy at night."
      ja: "部屋は素敵でした。しかしながら、夜はかなりうるさかったです。"
      zh: "房間很漂亮。然而，晚上相當吵。"

chat:
  conversations:
    - id: scenario-1-lost-luggage
      title:
        en: "Lost Luggage"
        ja: "紛失した荷物"
        zh: "行李遺失"
      messages:
        - role: partner
          text:
            en: "Good afternoon. Welcome to the baggage claim counter. How can I help you?"
            ja: "こんにちは。手荷物カウンターへようこそ。どうされましたか？"
            zh: "午安。歡迎來到行李提領櫃檯。有什麼我能幫您的嗎？"
        - role: user
          text:
            en: "Hello. My luggage hasn't arrived. I've been waiting for over an hour."
            ja: "こんにちは。荷物が届いていません。1時間以上待っています。"
            zh: "你好。我的行李還沒到。我已經等了一個多小時了。"
        - role: partner
          text:
            en: "I'm sorry to hear that. May I have your flight number and baggage tag?"
            ja: "申し訳ございません。フライト番号と手荷物タグをいただけますか？"
            zh: "很抱歉聽到這個消息。可以給我您的航班號和行李標籤嗎？"
        - role: user
          text:
            en: "Yes, here's my tag. I was on flight BA287 from London."
            ja: "はい、これがタグです。ロンドンからのBA287便でした。"
            zh: "好的，這是我的標籤。我搭的是從倫敦來的BA287航班。"
        - role: partner
          text:
            en: "Could you please describe your luggage for me?"
            ja: "荷物の特徴を教えていただけますか？"
            zh: "能否請您描述一下您的行李？"
        - role: user
          text:
            en: "It's a large black suitcase with a red ribbon on the handle. The brand is Samsonite."
            ja: "大きな黒いスーツケースで、取っ手に赤いリボンが付いています。ブランドはサムソナイトです。"
            zh: "是一個大型黑色行李箱，把手上有紅色緞帶。品牌是新秀麗。"
        - role: partner
          text:
            en: "Thank you. I can see your bag was put on the wrong connecting flight. It should arrive tomorrow morning."
            ja: "ありがとうございます。お荷物が間違った乗り継ぎ便に載せられたようです。明日の朝届く予定です。"
            zh: "謝謝。我看到您的行李被放到錯誤的轉機航班了。應該明天早上會到。"
        - role: user
          text:
            en: "I see. I would appreciate it if you could deliver it to my hotel when it arrives."
            ja: "わかりました。届いたらホテルに届けていただけると幸いです。"
            zh: "我明白了。如果行李到了能送到我的飯店，我會很感激。"
        - role: partner
          text:
            en: "Of course. We'll arrange delivery. Here's a toiletry kit for tonight. We apologize for the inconvenience."
            ja: "もちろんです。配送を手配します。今夜用のアメニティキットをどうぞ。ご不便をおかけして申し訳ございません。"
            zh: "當然可以。我們會安排送達。這是今晚用的盥洗包。造成您的不便，我們深感抱歉。"
        - role: user
          text:
            en: "Thank you. What can you do if my bag doesn't arrive by tomorrow?"
            ja: "ありがとうございます。明日までに届かなかったらどうなりますか？"
            zh: "謝謝。如果我的行李明天還沒到，你們能怎麼處理？"
        - role: partner
          text:
            en: "If it doesn't arrive within 24 hours, you can claim up to $200 for essential items. Keep your receipts."
            ja: "24時間以内に届かない場合、必需品に対して最大200ドルまで請求できます。レシートを保管してください。"
            zh: "如果24小時內沒到，您可以申請最高200美元的必需品補償。請保留收據。"

    - id: scenario-2-hotel-complaint
      title:
        en: "Hotel Complaint"
        ja: "ホテルへの苦情"
        zh: "飯店投訴"
      messages:
        - role: partner
          text:
            en: "Front desk, how may I assist you this evening?"
            ja: "フロントです。今夜はどのようなご用件でしょうか？"
            zh: "這裡是櫃檯，今晚有什麼我能為您效勞的嗎？"
        - role: user
          text:
            en: "Hello. I'm calling from room 412. I'm afraid there's a problem with my room."
            ja: "もしもし。412号室から電話しています。部屋に問題があるようです。"
            zh: "你好。我從412號房打來。恐怕我的房間有問題。"
        - role: partner
          text:
            en: "I'm sorry to hear that. What seems to be the issue?"
            ja: "申し訳ございません。どのような問題でしょうか？"
            zh: "很抱歉聽到這個消息。請問是什麼問題？"
        - role: user
          text:
            en: "The air conditioning is broken. It's been making a loud noise and the room is getting very hot."
            ja: "エアコンが壊れています。大きな音がして、部屋がとても暑くなっています。"
            zh: "空調壞了。一直發出很大的噪音，房間也變得很熱。"
        - role: partner
          text:
            en: "I apologize for the inconvenience. Would you like me to send maintenance up right away?"
            ja: "ご不便をおかけして申し訳ございません。すぐにメンテナンスを送りましょうか？"
            zh: "造成您的不便，我深感抱歉。需要我立刻派維修人員上去嗎？"
        - role: user
          text:
            en: "Actually, I would appreciate it if you could move me to a quieter room instead. It's already quite late."
            ja: "実は、静かな部屋に移していただけると幸いです。もうかなり遅いので。"
            zh: "其實，如果能幫我換到安靜一點的房間，我會很感激。已經很晚了。"
        - role: partner
          text:
            en: "Let me check our availability. Yes, we have a room on the 8th floor. Would that work?"
            ja: "空室を確認いたします。はい、8階にお部屋がございます。いかがでしょうか？"
            zh: "讓我查看一下空房。是的，我們8樓有房間。可以嗎？"
        - role: user
          text:
            en: "That would be great. Could you please send someone to help me move my things?"
            ja: "それで結構です。荷物を運ぶのを手伝う人を送っていただけますか？"
            zh: "那太好了。能否請您派人幫我搬東西？"
        - role: partner
          text:
            en: "Of course. A bellhop will be there in five minutes. We'll also offer you a complimentary breakfast for the trouble."
            ja: "もちろんです。5分以内にベルボーイが参ります。ご迷惑をおかけしたお詫びに、朝食を無料でご提供します。"
            zh: "當然可以。服務生五分鐘內就到。為了補償您的困擾，我們也會提供免費早餐。"
        - role: user
          text:
            en: "Thank you very much. I appreciate your help in resolving this so quickly."
            ja: "どうもありがとうございます。迅速に対応していただき感謝します。"
            zh: "非常感謝。感謝您這麼快速地幫我解決問題。"

    - id: scenario-3-writing-review
      title:
        en: "Writing a Review"
        ja: "レビューを書く"
        zh: "撰寫評論"
      messages:
        - role: partner
          text:
            en: "How was your hotel in Tokyo? Are you going to write a review?"
            ja: "東京のホテルはどうでしたか？レビューを書く予定ですか？"
            zh: "你在東京的飯店怎麼樣？你打算寫評論嗎？"
        - role: user
          text:
            en: "Yes, but I'm not sure how to write it. It was a mixed experience."
            ja: "はい、でもどう書けばいいかわかりません。良いところと悪いところがありました。"
            zh: "是的，但我不太確定怎麼寫。體驗好壞參半。"
        - role: partner
          text:
            en: "Start with something positive. What did you like about it?"
            ja: "まず良いところから始めましょう。何が良かったですか？"
            zh: "從正面的部分開始。你喜歡什麼地方？"
        - role: user
          text:
            en: "The location was excellent. It was easy to get around the city by train from there."
            ja: "立地は最高でした。そこから電車で街中を移動するのが簡単でした。"
            zh: "位置非常好。從那裡搭火車在市區四處走動很方便。"
        - role: partner
          text:
            en: "Great! Now use 'however' to introduce the negative part."
            ja: "いいですね！では'however'を使って否定的な部分を導入しましょう。"
            zh: "很好！現在用 'however' 來引入負面的部分。"
        - role: user
          text:
            en: "The location was excellent. However, the room was quite noisy at night due to street traffic."
            ja: "立地は最高でした。しかしながら、夜は交通騒音で部屋がかなりうるさかったです。"
            zh: "位置非常好。然而，由於街上的交通，房間晚上相當吵。"
        - role: partner
          text:
            en: "Perfect structure! What about the staff and service?"
            ja: "完璧な構成！スタッフやサービスはどうでしたか？"
            zh: "結構完美！員工和服務怎麼樣？"
        - role: user
          text:
            en: "The staff at check in was friendly. However, the restaurant service was disappointing and slow."
            ja: "チェックイン時のスタッフはフレンドリーでした。しかしながら、レストランのサービスはがっかりで遅かったです。"
            zh: "辦理入住時的員工很友善。然而，餐廳服務令人失望又慢。"
        - role: partner
          text:
            en: "And what about value for money? Was it overpriced?"
            ja: "コスパはどうでしたか？高すぎましたか？"
            zh: "那性價比呢？定價過高嗎？"
        - role: user
          text:
            en: "The breakfast was overpriced for what you get. I would recommend eating outside the hotel."
            ja: "朝食は内容に対して高すぎました。ホテル外で食べることをお勧めします。"
            zh: "早餐以提供的內容來說定價過高。我建議在飯店外面吃。"
        - role: partner
          text:
            en: "Excellent balanced review! Would you stay there again?"
            ja: "素晴らしいバランスの取れたレビュー！また泊まりますか？"
            zh: "很棒的平衡評論！你會再住那裡嗎？"
        - role: user
          text:
            en: "Maybe. I would appreciate it if they fixed the noise issue. Overall, three out of five stars."
            ja: "多分。騒音の問題を解決してくれると嬉しいです。総合的には5つ星中3つです。"
            zh: "也許吧。如果他們能解決噪音問題，我會很感激。總體來說，五顆星給三顆。"

quiz:
  questionsPerRound: 5
  xpReward: 25
`,kb=`# Chapter: Week 6 - Opinions & Disagreement
meta:
  id: opinions-and-disagreement
  title:
    en: "Opinions & Disagreement"
    ja: "意見と反論"
    zh: "意見與異議"
  description:
    en: "Learn to disagree politely using softeners. Express opinions without sounding aggressive by saying 'I see your point, but...' instead of 'You are wrong.'"
    ja: "緩和表現を使って丁寧に反論する方法を学びましょう。「あなたは間違っている」ではなく「おっしゃることはわかりますが...」と言って、攻撃的にならずに意見を述べましょう。"
    zh: "學習使用緩和語禮貌地表達不同意見。用「我理解你的觀點，但是...」而不是「你錯了」來表達意見，避免聽起來具有攻擊性。"
  icon: "💬"
  order: 6
  level: intermediate

words:
  # Core Opinion Phrases (Day 1)
  - id: personally
    word:
      en: Personally
      ja: 個人的には
      zh: 就個人而言
    reading: "PER-suh-nuh-lee"
    phonetic: "/ˈpɜːrsənəli/"
    description:
      en: "Used to express your own opinion (not a universal truth)."
      ja: "自分自身の意見を表すときに使う（普遍的な真実ではない）。"
      zh: "用於表達自己的意見（而非普遍真理）。"
    sentence:
      en: "Personally, I believe that pineapple belongs on pizza."
      ja: "個人的には、ピザにパイナップルはありだと思います。"
      zh: "就個人而言，我認為披薩上可以放鳳梨。"

  - id: i-believe
    word:
      en: I believe
      ja: 私は〜と思う
      zh: 我相信
    reading: "ay bi-LEEV"
    phonetic: "/aɪ bɪˈliːv/"
    description:
      en: "Soft way to state an opinion (less aggressive than 'I think')."
      ja: "意見を述べる柔らかい方法（'I think'より攻撃的でない）。"
      zh: "表達意見的柔和方式（比 'I think' 更委婉）。"
    sentence:
      en: "I believe that working from home increases productivity."
      ja: "在宅勤務は生産性を上げると思います。"
      zh: "我相信在家工作可以提高生產力。"

  - id: the-reason-is
    word:
      en: The reason is...
      ja: その理由は...
      zh: 原因是...
    reading: "thuh REE-zuhn iz"
    phonetic: "/ðə ˈriːzən ɪz/"
    description:
      en: "Used to explain why you hold an opinion."
      ja: "なぜその意見を持っているかを説明するときに使う。"
      zh: "用於解釋你持有某種意見的原因。"
    sentence:
      en: "The reason is that I've tried both and I prefer this one."
      ja: "その理由は、両方試してこちらの方が好きだからです。"
      zh: "原因是我兩種都試過，我比較喜歡這個。"

  # Softeners (Day 2)
  - id: seems
    word:
      en: Seems
      ja: 〜のようだ
      zh: 似乎
    reading: "seemz"
    phonetic: "/siːmz/"
    description:
      en: "Makes statements less direct and more tentative."
      ja: "発言をより間接的で暫定的にする。"
      zh: "使陳述變得不那麼直接，更加試探性。"
    sentence:
      en: "That seems like it might be a bit risky."
      ja: "それは少しリスクがあるように見えます。"
      zh: "這似乎有點風險。"

  - id: might
    word:
      en: Might
      ja: 〜かもしれない
      zh: 可能
    reading: "myt"
    phonetic: "/maɪt/"
    description:
      en: "Shows possibility, not certainty. Softens opinions."
      ja: "確実性ではなく可能性を示す。意見を和らげる。"
      zh: "表示可能性而非確定性。使意見變得委婉。"
    sentence:
      en: "That might not be the best approach for this situation."
      ja: "この状況には最適なアプローチではないかもしれません。"
      zh: "這可能不是這種情況的最佳方法。"

  - id: tend-to
    word:
      en: Tend to
      ja: 〜する傾向がある
      zh: 傾向於
    reading: "tend too"
    phonetic: "/tend tuː/"
    description:
      en: "Express general patterns, not absolute rules."
      ja: "絶対的なルールではなく、一般的なパターンを表す。"
      zh: "表達一般模式，而非絕對規則。"
    sentence:
      en: "I tend to think that experience matters more than degrees."
      ja: "私は学歴より経験の方が重要だと思う傾向があります。"
      zh: "我傾向於認為經驗比學歷更重要。"

  - id: kind-of
    word:
      en: Kind of
      ja: ちょっと・やや
      zh: 有點
    reading: "KYND uhv"
    phonetic: "/kaɪnd əv/"
    description:
      en: "Informal softener to make statements less harsh."
      ja: "発言を和らげる非公式な緩和語。"
      zh: "非正式的緩和語，使陳述不那麼尖銳。"
    sentence:
      en: "I kind of disagree with that approach."
      ja: "そのアプローチにはちょっと同意できません。"
      zh: "我有點不同意那個方法。"

  # Debate Idioms (Day 5)
  - id: play-devils-advocate
    word:
      en: Play devil's advocate
      ja: あえて反対意見を述べる
      zh: 唱反調
    reading: "play DEV-uhlz AD-vuh-kuht"
    phonetic: "/pleɪ ˈdevəlz ˈædvəkət/"
    description:
      en: "Argue the opposite side to test an argument, not because you believe it."
      ja: "信じているからではなく、議論をテストするために反対側を主張する。"
      zh: "為了測試論點而提出相反意見，並非因為你相信它。"
    sentence:
      en: "Let me play devil's advocate here - what if AI actually creates more jobs?"
      ja: "ここであえて反対意見を述べますが、もしAIが実際にはもっと多くの仕事を生み出すとしたら？"
      zh: "讓我唱個反調——如果 AI 實際上創造了更多工作呢？"

  - id: sit-on-the-fence
    word:
      en: Sit on the fence
      ja: どっちつかずでいる
      zh: 保持中立
    reading: "sit on thuh fens"
    phonetic: "/sɪt ɒn ðə fens/"
    description:
      en: "Be undecided, not taking either side in a debate."
      ja: "決められない、議論でどちらの側にもつかない。"
      zh: "猶豫不決，不站在辯論的任何一方。"
    sentence:
      en: "I'm still sitting on the fence about this issue."
      ja: "この問題についてはまだどっちつかずです。"
      zh: "關於這個問題，我還在保持中立。"

  - id: see-eye-to-eye
    word:
      en: See eye to eye
      ja: 意見が一致する
      zh: 看法一致
    reading: "see ay too ay"
    phonetic: "/siː aɪ tuː aɪ/"
    description:
      en: "Agree with someone completely on an issue."
      ja: "ある問題について誰かと完全に同意する。"
      zh: "在某個問題上與某人完全一致。"
    sentence:
      en: "We don't really see eye to eye on this topic."
      ja: "この話題については私たちはあまり意見が一致しません。"
      zh: "我們在這個話題上看法不太一致。"

  - id: have-a-point
    word:
      en: Have a point
      ja: 一理ある
      zh: 有道理
    reading: "hav uh poynt"
    phonetic: "/hæv ə pɔɪnt/"
    description:
      en: "Acknowledge that someone's argument is valid."
      ja: "誰かの議論が正当であることを認める。"
      zh: "承認某人的論點是有效的。"
    sentence:
      en: "You have a point, but I still think there are other factors to consider."
      ja: "一理ありますが、まだ考慮すべき他の要因があると思います。"
      zh: "你有道理，但我仍然認為還有其他因素需要考慮。"

  - id: beg-to-differ
    word:
      en: Beg to differ
      ja: 失礼ながら異論がある
      zh: 恕我不同意
    reading: "beg too DIF-er"
    phonetic: "/beɡ tuː ˈdɪfər/"
    description:
      en: "Politely disagree with someone (formal)."
      ja: "丁寧に誰かに反対する（フォーマル）。"
      zh: "禮貌地表示不同意（正式用語）。"
    sentence:
      en: "I beg to differ. The data suggests otherwise."
      ja: "失礼ながら異論があります。データは別のことを示唆しています。"
      zh: "恕我不同意。數據顯示的是另一回事。"

  # Polite Interjections (Day 6)
  - id: if-i-may
    word:
      en: If I may...
      ja: よろしければ...
      zh: 如果可以的話...
    reading: "if ay may"
    phonetic: "/ɪf aɪ meɪ/"
    description:
      en: "Polite way to interrupt or add to a conversation."
      ja: "会話を中断したり付け加えたりする丁寧な方法。"
      zh: "禮貌地打斷或加入對話的方式。"
    sentence:
      en: "If I may, I'd like to add a different perspective."
      ja: "よろしければ、別の視点を加えさせてください。"
      zh: "如果可以的話，我想補充一個不同的觀點。"

  - id: thats-a-good-point-but
    word:
      en: That's a good point, but...
      ja: いい指摘ですが...
      zh: 這是個好觀點，但是...
    reading: "thats uh guud poynt but"
    phonetic: "/ðæts ə ɡʊd pɔɪnt bʌt/"
    description:
      en: "Acknowledge before disagreeing (sandwich technique)."
      ja: "反対する前に認める（サンドイッチ技法）。"
      zh: "在表達不同意之前先肯定對方（三明治技巧）。"
    sentence:
      en: "That's a good point, but I think we need to consider the costs as well."
      ja: "いい指摘ですが、コストも考慮する必要があると思います。"
      zh: "這是個好觀點，但我認為我們也需要考慮成本。"

chat:
  conversations:
    - id: scenario-1-pineapple-debate
      title:
        en: "The Pineapple Debate"
        ja: "パイナップル論争"
        zh: "鳳梨之爭"
      messages:
        - role: partner
          text:
            en: "Okay, I have an unpopular opinion. I think pineapple absolutely belongs on pizza. Fight me!"
            ja: "じゃあ、世間に逆らった意見を言うね。パイナップルは絶対にピザに合うと思う。反論して！"
            zh: "好吧，我有個不受歡迎的觀點。我認為鳳梨絕對可以放在披薩上。來辯論吧！"
        - role: user
          text:
            en: "Hmm, I tend to think that sweet fruits don't belong on savory dishes."
            ja: "うーん、私は甘いフルーツは塩味の料理には合わないと思う傾向があるな。"
            zh: "嗯，我傾向於認為甜的水果不適合放在鹹味料理上。"
        - role: partner
          text:
            en: "But have you actually tried it? The combination of sweet and salty is amazing!"
            ja: "でも実際に食べたことある？甘いのとしょっぱいの組み合わせは最高だよ！"
            zh: "但你實際試過嗎？甜和鹹的組合超棒的！"
        - role: user
          text:
            en: "You have a point. Personally, I believe the texture is the problem - it gets too soggy."
            ja: "一理あるね。個人的には、食感が問題だと思う - ベチャベチャになりすぎる。"
            zh: "你有道理。就個人而言，我認為口感是問題——它變得太濕軟了。"
        - role: partner
          text:
            en: "That seems like it might be a cooking problem, not a pineapple problem!"
            ja: "それはパイナップルの問題じゃなくて、調理の問題のように見えるけど！"
            zh: "這似乎可能是烹飪問題，不是鳳梨的問題！"
        - role: user
          text:
            en: "I beg to differ. The reason is that pineapple releases juice when heated. It's just how it works."
            ja: "失礼ながら異論があるな。その理由は、パイナップルは加熱すると果汁が出るから。そういうものなんだ。"
            zh: "恕我不同意。原因是鳳梨加熱時會釋放汁液。就是這樣運作的。"
        - role: partner
          text:
            en: "Okay, okay. I guess we don't really see eye to eye on this one!"
            ja: "わかった、わかった。この件では私たち意見が一致しないね！"
            zh: "好吧好吧。我想我們在這件事上看法不太一致！"
        - role: user
          text:
            en: "That's a good point, but at least we can agree that pizza itself is delicious!"
            ja: "いい指摘だけど、少なくともピザ自体は美味しいってことには同意できるよね！"
            zh: "這是個好觀點，但至少我們可以同意披薩本身很美味！"

    - id: scenario-2-ai-in-education
      title:
        en: "AI in Education"
        ja: "教育におけるAI"
        zh: "教育中的 AI"
      messages:
        - role: partner
          text:
            en: "I read an article saying AI will replace teachers within 10 years. What do you think?"
            ja: "AIが10年以内に教師に取って代わるという記事を読んだんだ。どう思う？"
            zh: "我讀到一篇文章說 AI 將在10年內取代教師。你怎麼看？"
        - role: user
          text:
            en: "I see your point, but I think that might be an exaggeration. Teachers do more than just deliver information."
            ja: "おっしゃることはわかりますが、それは誇張かもしれないと思います。教師は情報を伝えるだけではありません。"
            zh: "我理解你的觀點，但我認為這可能有點誇張。教師做的不僅僅是傳遞資訊。"
        - role: partner
          text:
            en: "Let me play devil's advocate here. AI can already grade essays and answer student questions 24/7."
            ja: "ここであえて反対意見を述べるね。AIはすでにエッセイを採点したり、24時間学生の質問に答えたりできる。"
            zh: "讓我唱個反調。AI 已經可以批改作文，全天候回答學生問題。"
        - role: user
          text:
            en: "That's an interesting perspective, however, teaching involves emotional support and motivation too."
            ja: "興味深い視点ですが、しかしながら、教えることには感情的なサポートとモチベーションも含まれます。"
            zh: "這是個有趣的觀點，然而，教學也涉及情感支持和激勵。"
        - role: partner
          text:
            en: "I'm not sure I agree with that. Some students might actually prefer learning from AI without judgment."
            ja: "それには同意できないかな。一部の学生は実際には判断されずにAIから学ぶことを好むかもしれない。"
            zh: "我不太同意。有些學生可能實際上更喜歡從 AI 學習，不會被評判。"
        - role: user
          text:
            en: "You have a point, but I tend to think that human connection is essential for learning."
            ja: "一理ありますが、私は人とのつながりが学習には不可欠だと思う傾向があります。"
            zh: "你有道理，但我傾向於認為人際連結對學習至關重要。"
        - role: partner
          text:
            en: "If I may, I think the future might be a hybrid - AI for content, humans for mentorship."
            ja: "よろしければ、未来はハイブリッドかもしれないと思う - コンテンツはAI、メンタリングは人間。"
            zh: "如果可以的話，我認為未來可能是混合模式——AI 負責內容，人類負責指導。"
        - role: user
          text:
            en: "Now that's something I can agree with. I believe that's the most likely outcome."
            ja: "それなら同意できるね。私はそれが最も可能性の高い結果だと思う。"
            zh: "這我可以同意。我相信那是最可能的結果。"
        - role: partner
          text:
            en: "Great! So we finally see eye to eye on something!"
            ja: "やった！ついに何かで意見が一致したね！"
            zh: "太好了！我們終於在某件事上看法一致了！"

    - id: scenario-3-polite-disagreement
      title:
        en: "Polite Disagreement Practice"
        ja: "丁寧な反論練習"
        zh: "禮貌地表達不同意見練習"
      messages:
        - role: partner
          text:
            en: "Let's practice softening statements. How would you politely disagree with 'That's a terrible idea'?"
            ja: "発言を和らげる練習をしよう。「それはひどいアイデアだ」に丁寧に反対するにはどう言う？"
            zh: "我們來練習緩和語氣。你會怎麼禮貌地不同意「那是個糟糕的主意」？"
        - role: user
          text:
            en: "I'm not sure I agree with that. It seems like it might have some challenges."
            ja: "それには同意できるかわかりません。いくつかの課題があるように見えます。"
            zh: "我不太確定我同意。這似乎可能有一些挑戰。"
        - role: partner
          text:
            en: "Perfect! Now how would you soften 'You're completely wrong about this'?"
            ja: "完璧！では「あなたはこれについて完全に間違っている」を和らげるとどうなる？"
            zh: "完美！那你會怎麼緩和「你在這件事上完全錯了」？"
        - role: user
          text:
            en: "I see your point, but I believe there might be another way to look at it."
            ja: "おっしゃることはわかりますが、別の見方があるかもしれないと思います。"
            zh: "我理解你的觀點，但我相信可能有另一種看法。"
        - role: partner
          text:
            en: "Excellent! What if someone says something you really disagree with at work?"
            ja: "素晴らしい！職場で本当に同意できないことを誰かが言ったらどうする？"
            zh: "太棒了！如果在工作中有人說了你真的不同意的話，你會怎麼說？"
        - role: user
          text:
            en: "That's a good point, but if I may, I'd like to suggest an alternative approach."
            ja: "いい指摘ですが、よろしければ、別のアプローチを提案させてください。"
            zh: "這是個好觀點，但如果可以的話，我想建議一個替代方案。"
        - role: partner
          text:
            en: "Now imagine you're sitting on the fence about an issue. How would you express that?"
            ja: "今度はある問題についてどっちつかずだと想像して。どう表現する？"
            zh: "現在想像你對某個問題保持中立。你會怎麼表達？"
        - role: user
          text:
            en: "Honestly, I'm still sitting on the fence about this. I can see both sides of the argument."
            ja: "正直、この件についてはまだどっちつかずです。両方の主張が理解できます。"
            zh: "老實說，關於這件事我還在保持中立。我能理解雙方的論點。"
        - role: partner
          text:
            en: "Great! And finally, how do you politely disagree while acknowledging the other person?"
            ja: "いいね！最後に、相手を認めながら丁寧に反対するにはどうする？"
            zh: "很好！最後，你怎麼在肯定對方的同時禮貌地表示不同意？"
        - role: user
          text:
            en: "You have a point there, but I beg to differ on the conclusion. The reason is that the data shows something different."
            ja: "一理ありますが、結論については失礼ながら異論があります。その理由は、データが別のことを示しているからです。"
            zh: "你有道理，但對於結論我恕我不同意。原因是數據顯示的是不同的結果。"

quiz:
  questionsPerRound: 5
  xpReward: 25
`,jb=`# Chapter: Week 7 - Describing Personality
meta:
  id: describing-personality
  title:
    en: "Describing Personality"
    ja: "性格を描写する"
    zh: "描述個性"
  description:
    en: "Go beyond 'He is nice.' Learn to describe character, habits, and relationships using relative clauses (who/which/that) and precise personality vocabulary."
    ja: "「彼は優しい」を超えて。関係代名詞（who/which/that）と正確な性格語彙を使って、性格、習慣、人間関係を描写する方法を学びましょう。"
    zh: "超越「他很好」。學習使用關係子句（who/which/that）和精確的個性詞彙來描述性格、習慣和人際關係。"
  icon: "🎭"
  order: 7
  level: intermediate

words:
  # Positive Personality Adjectives (Day 1 & 4)
  - id: punctual
    word:
      en: Punctual
      ja: 時間厳守の
      zh: 準時的
    reading: "PUHNK-choo-uhl"
    phonetic: "/ˈpʌŋktʃuəl/"
    description:
      en: "Always arriving or doing things at the expected time."
      ja: "常に予定通りの時間に到着したり物事を行う。"
      zh: "總是準時到達或做事。"
    sentence:
      en: "She's very punctual - she never arrives late to meetings."
      ja: "彼女はとても時間厳守で、会議に遅刻することは決してありません。"
      zh: "她非常準時——從不遲到開會。"

  - id: reliable
    word:
      en: Reliable
      ja: 信頼できる
      zh: 可靠的
    reading: "ri-LY-uh-buhl"
    phonetic: "/rɪˈlaɪəbəl/"
    description:
      en: "Someone you can trust and depend on."
      ja: "信頼して頼りにできる人。"
      zh: "你可以信任和依賴的人。"
    sentence:
      en: "He's the most reliable person I know - he always keeps his promises."
      ja: "彼は私が知っている中で最も信頼できる人です。いつも約束を守ります。"
      zh: "他是我認識的最可靠的人——總是信守承諾。"

  - id: ambitious
    word:
      en: Ambitious
      ja: 野心的な
      zh: 有野心的
    reading: "am-BISH-uhs"
    phonetic: "/æmˈbɪʃəs/"
    description:
      en: "Having a strong desire to succeed or achieve goals."
      ja: "成功したり目標を達成したりする強い願望を持っている。"
      zh: "有強烈的成功或實現目標的願望。"
    sentence:
      en: "She's incredibly ambitious - she wants to become CEO before 40."
      ja: "彼女は非常に野心的で、40歳前にCEOになりたいと思っています。"
      zh: "她非常有野心——想在40歲前成為CEO。"

  - id: easy-going
    word:
      en: Easy-going
      ja: のんびりした
      zh: 隨和的
    reading: "EE-zee-GOH-ing"
    phonetic: "/ˈiːzi ˈɡoʊɪŋ/"
    description:
      en: "Relaxed, not easily worried or stressed."
      ja: "リラックスしていて、心配やストレスを感じにくい。"
      zh: "放鬆的，不容易擔心或緊張。"
    sentence:
      en: "He's quite easy-going - he doesn't stress about small things."
      ja: "彼はかなりのんびりしていて、小さなことでストレスを感じません。"
      zh: "他很隨和——不會為小事煩惱。"

  - id: outgoing
    word:
      en: Outgoing
      ja: 社交的な
      zh: 外向的
    reading: "OWT-goh-ing"
    phonetic: "/ˈaʊtˌɡoʊɪŋ/"
    description:
      en: "Friendly and enjoys meeting new people."
      ja: "フレンドリーで新しい人に会うのを楽しむ。"
      zh: "友善且喜歡認識新朋友。"
    sentence:
      en: "My sister is very outgoing - she can make friends anywhere."
      ja: "私の妹はとても社交的で、どこでも友達を作れます。"
      zh: "我妹妹很外向——她在哪裡都能交到朋友。"

  - id: thoughtful
    word:
      en: Thoughtful
      ja: 思いやりのある
      zh: 體貼的
    reading: "THAWT-fuhl"
    phonetic: "/ˈθɔːtfəl/"
    description:
      en: "Considerate of others' feelings and needs."
      ja: "他人の気持ちやニーズに配慮する。"
      zh: "考慮他人的感受和需求。"
    sentence:
      en: "She's the type of person who remembers everyone's birthday."
      ja: "彼女は皆の誕生日を覚えているタイプの人です。"
      zh: "她是那種記得每個人生日的人。"

  - id: organized
    word:
      en: Organized
      ja: 整理整頓された
      zh: 有條理的
    reading: "OR-guh-nyzd"
    phonetic: "/ˈɔːrɡənaɪzd/"
    description:
      en: "Keeping things in order, planning well."
      ja: "物事を整理し、上手に計画する。"
      zh: "保持事物井井有條，善於規劃。"
    sentence:
      en: "He's extremely organized - his desk is always perfectly tidy."
      ja: "彼は非常に整理整頓されていて、机はいつも完璧に整頓されています。"
      zh: "他非常有條理——他的桌子總是完美整齊。"

  # Negative Personality Adjectives (Day 4)
  - id: messy
    word:
      en: Messy
      ja: だらしない
      zh: 凌亂的
    reading: "MES-ee"
    phonetic: "/ˈmesi/"
    description:
      en: "Untidy, not keeping things in order."
      ja: "散らかっていて、物を整理しない。"
      zh: "不整潔，不保持東西井然有序。"
    sentence:
      en: "I have a friend who is incredibly messy - you can't see his floor!"
      ja: "私には信じられないほどだらしない友達がいます。床が見えないんです！"
      zh: "我有個朋友非常凌亂——你看不到他的地板！"

  - id: moody
    word:
      en: Moody
      ja: 気分屋の
      zh: 喜怒無常的
    reading: "MOO-dee"
    phonetic: "/ˈmuːdi/"
    description:
      en: "Having unpredictable changes in emotions."
      ja: "感情の変化が予測できない。"
      zh: "情緒變化難以預測。"
    sentence:
      en: "He can be quite moody - happy one minute, angry the next."
      ja: "彼はかなり気分屋になることがある。1分前は幸せで、次の瞬間は怒っている。"
      zh: "他有時很喜怒無常——前一分鐘開心，下一分鐘就生氣。"

  - id: stubborn
    word:
      en: Stubborn
      ja: 頑固な
      zh: 固執的
    reading: "STUHB-urn"
    phonetic: "/ˈstʌbərn/"
    description:
      en: "Unwilling to change opinion or behavior."
      ja: "意見や行動を変えたがらない。"
      zh: "不願改變意見或行為。"
    sentence:
      en: "She's so stubborn - once she decides something, you can't change her mind."
      ja: "彼女はとても頑固で、一度決めたら考えを変えられません。"
      zh: "她很固執——一旦她決定了什麼，你就無法改變她的想法。"

  - id: strict
    word:
      en: Strict
      ja: 厳格な
      zh: 嚴格的
    reading: "strikt"
    phonetic: "/strɪkt/"
    description:
      en: "Demanding that rules be followed exactly."
      ja: "ルールを正確に守ることを要求する。"
      zh: "要求嚴格遵守規則。"
    sentence:
      en: "My boss is strict about deadlines - no extensions allowed."
      ja: "私の上司は締め切りに厳格で、延長は認められません。"
      zh: "我的老闆對截止日期很嚴格——不允許延期。"

  # Neutral Personality Adjectives
  - id: introverted
    word:
      en: Introverted
      ja: 内向的な
      zh: 內向的
    reading: "IN-troh-vur-tid"
    phonetic: "/ˈɪntrəvɜːrtɪd/"
    description:
      en: "Preferring quiet time alone rather than social activities."
      ja: "社交活動よりも一人の静かな時間を好む。"
      zh: "喜歡獨處的安靜時間而不是社交活動。"
    sentence:
      en: "I'm quite introverted - I need alone time to recharge."
      ja: "私はかなり内向的で、エネルギーを充電するには一人の時間が必要です。"
      zh: "我很內向——我需要獨處時間來充電。"

  - id: reserved
    word:
      en: Reserved
      ja: 控えめな
      zh: 矜持的
    reading: "ri-ZURVD"
    phonetic: "/rɪˈzɜːrvd/"
    description:
      en: "Quiet and not showing feelings openly."
      ja: "静かで感情をオープンに表さない。"
      zh: "安靜且不公開表露感情。"
    sentence:
      en: "He seems reserved at first, but he opens up once you know him."
      ja: "彼は最初は控えめに見えますが、知り合うと打ち解けます。"
      zh: "他一開始看起來很矜持，但熟了就會敞開心扉。"

  # Personality Idioms (Day 5)
  - id: social-butterfly
    word:
      en: Social butterfly
      ja: 社交的な人
      zh: 社交達人
    reading: "SOH-shuhl BUHT-er-fly"
    phonetic: "/ˈsoʊʃəl ˈbʌtərflaɪ/"
    description:
      en: "Someone who loves parties and is very sociable."
      ja: "パーティーが大好きでとても社交的な人。"
      zh: "喜歡派對且非常善於社交的人。"
    sentence:
      en: "My sister is a total social butterfly - she knows everyone in town."
      ja: "私の妹は完全に社交的な人で、町の誰もが知っています。"
      zh: "我妹妹是個徹底的社交達人——她認識鎮上的每個人。"

  - id: couch-potato
    word:
      en: Couch potato
      ja: カウチポテト
      zh: 沙發馬鈴薯
    reading: "KOWCH puh-TAY-toh"
    phonetic: "/kaʊtʃ pəˈteɪtoʊ/"
    description:
      en: "Someone lazy who watches TV all day."
      ja: "一日中テレビを見ている怠け者。"
      zh: "整天看電視的懶人。"
    sentence:
      en: "My brother is a bit of a couch potato - he binge-watches shows all weekend."
      ja: "私の兄はちょっとしたカウチポテトで、週末中ずっとドラマを一気見します。"
      zh: "我哥哥有點像沙發馬鈴薯——他整個週末都在追劇。"

  - id: down-to-earth
    word:
      en: Down to earth
      ja: 現実的な
      zh: 腳踏實地的
    reading: "down too urth"
    phonetic: "/daʊn tuː ɜːrθ/"
    description:
      en: "Practical, humble, and realistic."
      ja: "実用的で謙虚で現実的。"
      zh: "務實、謙遜、實際。"
    sentence:
      en: "She's really down to earth despite being successful and famous."
      ja: "彼女は成功して有名にもかかわらず、本当に現実的です。"
      zh: "儘管她成功又出名，她真的很腳踏實地。"

  - id: people-person
    word:
      en: People person
      ja: 人付き合いが上手な人
      zh: 善於交際的人
    reading: "PEE-puhl PUR-suhn"
    phonetic: "/ˈpiːpəl ˈpɜːrsən/"
    description:
      en: "Someone who enjoys being around others."
      ja: "他の人と一緒にいることを楽しむ人。"
      zh: "喜歡與他人相處的人。"
    sentence:
      en: "He's a people person - he can talk to anyone about anything."
      ja: "彼は人付き合いが上手な人で、誰とでも何でも話せます。"
      zh: "他善於交際——他可以和任何人聊任何事。"

  - id: old-soul
    word:
      en: Old soul
      ja: 大人びた人
      zh: 老靈魂
    reading: "ohld sohl"
    phonetic: "/oʊld soʊl/"
    description:
      en: "Someone wise beyond their years."
      ja: "年齢以上に賢い人。"
      zh: "智慧超越年齡的人。"
    sentence:
      en: "Even as a child, she was an old soul who preferred reading to playing."
      ja: "子供の頃から、彼女は遊ぶより読書を好む大人びた子でした。"
      zh: "即使是孩子時，她也是個老靈魂，喜歡閱讀勝過玩耍。"

  # Relative Clause Patterns (Day 2 & 3)
  - id: the-kind-of-person-who
    word:
      en: The kind of person who...
      ja: ～するタイプの人
      zh: 那種...的人
    reading: "thuh kynd uhv PUR-suhn hoo"
    phonetic: "/ðə kaɪnd əv ˈpɜːrsən huː/"
    description:
      en: "Pattern to describe someone's typical behavior."
      ja: "誰かの典型的な行動を説明するパターン。"
      zh: "用於描述某人典型行為的句型。"
    sentence:
      en: "He is the kind of person who always wakes up early."
      ja: "彼はいつも早起きするタイプの人です。"
      zh: "他是那種總是早起的人。"

  - id: the-type-of-person-who
    word:
      en: The type of person who...
      ja: ～するような人
      zh: 那類...的人
    reading: "thuh typ uhv PUR-suhn hoo"
    phonetic: "/ðə taɪp əv ˈpɜːrsən huː/"
    description:
      en: "Alternative pattern to describe typical behavior."
      ja: "典型的な行動を説明する別のパターン。"
      zh: "描述典型行為的另一種句型。"
    sentence:
      en: "She's the type of person who always brings homemade cookies to work."
      ja: "彼女は職場にいつも手作りクッキーを持ってくるような人です。"
      zh: "她是那類總是帶自製餅乾去上班的人。"

chat:
  conversations:
    - id: scenario-1-describing-a-friend
      title:
        en: "Describing a Friend"
        ja: "友達を描写する"
        zh: "描述朋友"
      messages:
        - role: partner
          text:
            en: "I heard you're meeting my friend Sarah this weekend. What kind of people do you usually get along with?"
            ja: "今週末、私の友達のサラに会うって聞いたよ。普段どんな人とうまくいくの？"
            zh: "聽說你這週末要見我朋友 Sarah。你通常跟什麼樣的人合得來？"
        - role: user
          text:
            en: "I tend to get along with people who are easy-going and don't take themselves too seriously."
            ja: "私はのんびりしていて、自分をあまり深刻に考えない人とうまくいく傾向があります。"
            zh: "我通常和隨和、不把自己看得太重的人合得來。"
        - role: partner
          text:
            en: "Oh, you'll love Sarah then! She's the kind of person who can laugh at anything."
            ja: "じゃあサラのこと気に入るよ！彼女は何でも笑えるタイプの人なんだ。"
            zh: "那你會喜歡 Sarah 的！她是那種什麼都能笑的人。"
        - role: user
          text:
            en: "That sounds great! I have a friend who loves coffee - does Sarah like cafes?"
            ja: "それはいいね！私にはコーヒー好きの友達がいるんだけど、サラはカフェが好き？"
            zh: "聽起來很棒！我有個喜歡咖啡的朋友——Sarah 喜歡咖啡廳嗎？"
        - role: partner
          text:
            en: "Absolutely! She's a total social butterfly. She knows the best cafes in town."
            ja: "もちろん！彼女は完全に社交的な人で、町で一番いいカフェを知ってるよ。"
            zh: "當然！她是個徹底的社交達人。她知道鎮上最棒的咖啡廳。"
        - role: user
          text:
            en: "Is she outgoing then? I'm quite introverted, so I hope we balance each other out."
            ja: "じゃあ彼女は社交的なの？私はかなり内向的だから、お互いにバランスが取れるといいな。"
            zh: "那她是外向的嗎？我很內向，希望我們能互相平衡。"
        - role: partner
          text:
            en: "Don't worry! She's also very thoughtful. She's the type of person who notices when someone needs space."
            ja: "心配しないで！彼女はとても思いやりもあるよ。誰かがスペースを必要としている時に気づくタイプの人なんだ。"
            zh: "別擔心！她也很體貼。她是那種會注意到別人需要空間的人。"
        - role: user
          text:
            en: "She sounds really down to earth. I bought a gift which I hope she'll like."
            ja: "彼女は本当に現実的そうだね。彼女が気に入ってくれるといいなと思うプレゼントを買ったんだ。"
            zh: "她聽起來很腳踏實地。我買了個禮物希望她會喜歡。"
        - role: partner
          text:
            en: "That's so sweet! She's definitely not the type who cares about expensive things. It's the thought that counts."
            ja: "優しいね！彼女は絶対に高価なものを気にするタイプじゃないよ。気持ちが大切だから。"
            zh: "真貼心！她絕對不是那種在意貴重東西的人。重要的是心意。"

    - id: scenario-2-the-new-colleague
      title:
        en: "The New Colleague"
        ja: "新しい同僚"
        zh: "新同事"
      messages:
        - role: partner
          text:
            en: "Did you meet the new colleague who joined our team last week? What's your impression?"
            ja: "先週チームに加わった新しい同僚に会った？どんな印象？"
            zh: "你見到上週加入我們團隊的新同事了嗎？你的印象如何？"
        - role: user
          text:
            en: "Yes! That's the colleague who sits next to me now. She seems very organized."
            ja: "うん！今私の隣に座っている同僚だよ。彼女はとても整理整頓されているみたい。"
            zh: "見到了！就是現在坐我旁邊的同事。她看起來很有條理。"
        - role: partner
          text:
            en: "Really? How can you tell? I only talked to her briefly."
            ja: "本当？どうしてわかるの？私は少ししか話してないんだ。"
            zh: "真的嗎？你怎麼看出來的？我只跟她簡短聊過。"
        - role: user
          text:
            en: "She's very punctual - she arrives exactly at 9 every day. And her desk is immaculate."
            ja: "彼女はとても時間厳守で、毎日ちょうど9時に到着する。そして机がピカピカなんだ。"
            zh: "她很準時——每天剛好9點到。而且她的桌子一塵不染。"
        - role: partner
          text:
            en: "Sounds like the opposite of Tom! He's so messy - you can never find anything on his desk."
            ja: "トムの正反対みたいだね！彼はすごくだらしなくて、机の上で何も見つからないんだ。"
            zh: "聽起來跟 Tom 完全相反！他很凌亂——你永遠在他桌上找不到東西。"
        - role: user
          text:
            en: "Ha! Tom is reliable though - he's the kind of person who always meets deadlines."
            ja: "はは！でもトムは信頼できるよ。彼はいつも締め切りを守るタイプの人なんだ。"
            zh: "哈！不過 Tom 很可靠——他是那種總是趕上截止日期的人。"
        - role: partner
          text:
            en: "True. What about the new colleague's personality? Is she easy-going or more strict?"
            ja: "確かに。新しい同僚の性格はどう？のんびりしてる、それとも厳格？"
            zh: "對。那新同事的個性呢？她是隨和還是比較嚴格？"
        - role: user
          text:
            en: "She seems ambitious but also down to earth. She mentioned wanting to lead a project someday."
            ja: "彼女は野心的だけど現実的にも見える。いつかプロジェクトをリードしたいって言ってたよ。"
            zh: "她看起來有野心但也很腳踏實地。她提到有一天想帶領一個專案。"
        - role: partner
          text:
            en: "That's great! We need more people who are ambitious. Is she a people person?"
            ja: "いいね！野心的な人がもっと必要だよ。彼女は人付き合いが上手なタイプ？"
            zh: "太好了！我們需要更多有野心的人。她善於交際嗎？"
        - role: user
          text:
            en: "I think she's a bit reserved at first, but she opens up quickly. She's not moody at all."
            ja: "最初は少し控えめだと思うけど、すぐに打ち解けるよ。全然気分屋じゃない。"
            zh: "我覺得她一開始有點矜持，但很快就會敞開心扉。她一點都不喜怒無常。"

    - id: scenario-3-personality-quiz
      title:
        en: "Personality Quiz"
        ja: "性格クイズ"
        zh: "個性測驗"
      messages:
        - role: partner
          text:
            en: "Let's do a fun personality quiz! First question: Would you call yourself a social butterfly or a couch potato?"
            ja: "楽しい性格クイズをしよう！最初の質問：自分のことを社交的な人とカウチポテト、どっちだと思う？"
            zh: "我們來做個有趣的個性測驗！第一題：你會說自己是社交達人還是沙發馬鈴薯？"
        - role: user
          text:
            en: "Honestly, I'm probably more of a couch potato on weekends, but I can be outgoing when I need to be."
            ja: "正直、週末はカウチポテト寄りだと思うけど、必要な時は社交的になれるよ。"
            zh: "老實說，我週末可能比較像沙發馬鈴薯，但需要的時候我也可以很外向。"
        - role: partner
          text:
            en: "Interesting! Next: Are you the kind of person who plans everything, or do you prefer being spontaneous?"
            ja: "面白い！次：あなたは全部計画するタイプの人？それとも自然に任せる方が好き？"
            zh: "有趣！下一題：你是那種計劃好一切的人，還是比較喜歡隨興？"
        - role: user
          text:
            en: "I'm quite organized when it comes to work, but with friends, I'm pretty easy-going."
            ja: "仕事に関してはかなり整理整頓されてるけど、友達といる時はかなりのんびりしてるよ。"
            zh: "工作上我很有條理，但和朋友在一起時我很隨和。"
        - role: partner
          text:
            en: "What about being stubborn? Do people ever say you're the type of person who never changes their mind?"
            ja: "頑固さについては？考えを絶対変えないタイプの人だって言われたことある？"
            zh: "固執呢？有人說過你是那種永遠不改變想法的人嗎？"
        - role: user
          text:
            en: "Ha! My family says I can be stubborn about small things, but I'm open to new ideas at work."
            ja: "はは！家族は小さいことには頑固になれるって言うけど、仕事では新しいアイデアに開かれてるよ。"
            zh: "哈！我家人說我對小事可能會固執，但在工作上我對新想法很開放。"
        - role: partner
          text:
            en: "Would you describe yourself as an old soul? Someone who is wise beyond their years?"
            ja: "自分のことを大人びた人だと思う？年齢以上に賢い人？"
            zh: "你會形容自己是老靈魂嗎？就是智慧超越年齡的人？"
        - role: user
          text:
            en: "Not really. I'm more of a people person who enjoys being around others and having fun."
            ja: "あまりそうじゃないかな。私はむしろ人付き合いが好きで、楽しむことが好きな人だよ。"
            zh: "不太算。我比較是善於交際的人，喜歡和別人在一起玩樂。"
        - role: partner
          text:
            en: "Last question: Are you reliable? The type who always keeps promises?"
            ja: "最後の質問：あなたは信頼できる？いつも約束を守るタイプ？"
            zh: "最後一題：你可靠嗎？那種總是信守承諾的人？"
        - role: user
          text:
            en: "I try to be! I'm the kind of person who hates being late or breaking commitments."
            ja: "そうなるよう努力してる！私は遅刻したり約束を破ったりするのが嫌いなタイプの人なんだ。"
            zh: "我努力做到！我是那種討厭遲到或違背承諾的人。"
        - role: partner
          text:
            en: "Perfect! Based on your answers, you seem like a reliable, easy-going people person with some couch potato tendencies!"
            ja: "完璧！回答から見ると、あなたはちょっとカウチポテト傾向のある、信頼できる、のんびりした、人付き合いが上手な人みたいだね！"
            zh: "完美！根據你的回答，你似乎是個可靠、隨和、善於交際的人，帶有一點沙發馬鈴薯傾向！"

quiz:
  questionsPerRound: 5
  xpReward: 25
`,zb=`# Chapter: Week 8 - Entertainment & Reviews
meta:
  id: entertainment-and-reviews
  title:
    en: "Entertainment & Reviews"
    ja: "エンターテインメントとレビュー"
    zh: "娛樂與評論"
  description:
    en: "Talk about movies, books, and shows like a pro! Master the -ED vs -ING adjective distinction and learn to give recommendations and reviews."
    ja: "映画、本、番組についてプロのように話そう！-EDと-ING形容詞の違いをマスターし、おすすめやレビューの仕方を学びましょう。"
    zh: "像專家一樣談論電影、書籍和節目！掌握 -ED 與 -ING 形容詞的區別，學會給予推薦和評論。"
  icon: "🎬"
  order: 8
  level: intermediate

words:
  # Review Vocabulary (Day 1 - Nouns/Adjectives)
  - id: masterpiece
    word:
      en: Masterpiece
      ja: 傑作
      zh: 傑作
    reading: "MAS-ter-pees"
    phonetic: "/ˈmæstərpiːs/"
    description:
      en: "A work of outstanding quality or skill."
      ja: "卓越した品質や技術の作品。"
      zh: "品質或技術出眾的作品。"
    sentence:
      en: "It's a masterpiece - absolutely gripping from start to finish."
      ja: "それは傑作です。最初から最後まで完全に引き込まれます。"
      zh: "這是一部傑作——從頭到尾都扣人心弦。"

  - id: gripping
    word:
      en: Gripping
      ja: 引き込まれる
      zh: 扣人心弦的
    reading: "GRIP-ing"
    phonetic: "/ˈɡrɪpɪŋ/"
    description:
      en: "So exciting that it holds your attention completely."
      ja: "とてもエキサイティングで、完全に注意を引きつける。"
      zh: "非常刺激，完全吸引你的注意力。"
    sentence:
      en: "The thriller was so gripping that I couldn't stop watching."
      ja: "そのスリラーはとても引き込まれて、見るのをやめられませんでした。"
      zh: "那部驚悚片太扣人心弦了，我停不下來。"

  - id: hilarious
    word:
      en: Hilarious
      ja: 爆笑の
      zh: 爆笑的
    reading: "hih-LAIR-ee-uhs"
    phonetic: "/hɪˈleriəs/"
    description:
      en: "Extremely funny."
      ja: "非常に面白い。"
      zh: "極度好笑。"
    sentence:
      en: "That comedy was hilarious - I laughed until I cried."
      ja: "そのコメディは爆笑でした。泣くまで笑いました。"
      zh: "那部喜劇太爆笑了——我笑到哭。"

  - id: thought-provoking
    word:
      en: Thought-provoking
      ja: 考えさせられる
      zh: 發人深省的
    reading: "THAWT-pruh-voh-king"
    phonetic: "/ˈθɔːt prəˌvoʊkɪŋ/"
    description:
      en: "Making you think deeply about something."
      ja: "何かについて深く考えさせる。"
      zh: "讓你對某事深思。"
    sentence:
      en: "That documentary was really thought-provoking - I'm still thinking about it."
      ja: "そのドキュメンタリーは本当に考えさせられました。まだ考えています。"
      zh: "那部紀錄片真的發人深省——我還在想著它。"

  - id: overrated
    word:
      en: Overrated
      ja: 過大評価された
      zh: 被高估的
    reading: "oh-ver-RAY-tid"
    phonetic: "/ˌoʊvərˈreɪtɪd/"
    description:
      en: "Given more praise than deserved."
      ja: "実際よりも高く評価されている。"
      zh: "得到比應得的更多讚揚。"
    sentence:
      en: "I found it a bit overrated, to be honest."
      ja: "正直なところ、ちょっと過大評価されていると思いました。"
      zh: "老實說，我覺得它有點被高估了。"

  - id: underwhelming
    word:
      en: Underwhelming
      ja: 期待外れの
      zh: 令人失望的
    reading: "uhn-der-WELM-ing"
    phonetic: "/ˌʌndərˈwelmɪŋ/"
    description:
      en: "Failing to impress or meet expectations."
      ja: "印象を与えられない、期待に応えられない。"
      zh: "未能給人留下深刻印象或達到期望。"
    sentence:
      en: "The sequel was pretty underwhelming compared to the original."
      ja: "続編はオリジナルに比べてかなり期待外れでした。"
      zh: "續集與原作相比相當令人失望。"

  # -ED/-ING Adjective Pairs (Day 2 - Verbs/Adjectives)
  - id: bored-boring
    word:
      en: Bored / Boring
      ja: 退屈している / 退屈な
      zh: 感到無聊的 / 無聊的
    reading: "bord / BOR-ing"
    phonetic: "/bɔːrd/ /ˈbɔːrɪŋ/"
    description:
      en: "Bored = how you feel; Boring = describes the thing."
      ja: "Bored = あなたの気持ち；Boring = 物事を描写する。"
      zh: "Bored = 你的感受；Boring = 描述事物。"
    sentence:
      en: "The movie was boring, so I was bored."
      ja: "映画が退屈だったので、私は退屈でした。"
      zh: "電影很無聊，所以我感到無聊。"

  - id: excited-exciting
    word:
      en: Excited / Exciting
      ja: ワクワクしている / ワクワクする
      zh: 興奮的 / 令人興奮的
    reading: "ik-SY-tid / ik-SY-ting"
    phonetic: "/ɪkˈsaɪtɪd/ /ɪkˈsaɪtɪŋ/"
    description:
      en: "Excited = how you feel; Exciting = describes the thing."
      ja: "Excited = あなたの気持ち；Exciting = 物事を描写する。"
      zh: "Excited = 你的感受；Exciting = 描述事物。"
    sentence:
      en: "I was so excited because the game was exciting."
      ja: "ゲームがワクワクするものだったので、とてもワクワクしました。"
      zh: "我非常興奮因為這場比賽很刺激。"

  - id: interested-interesting
    word:
      en: Interested / Interesting
      ja: 興味がある / 興味深い
      zh: 感興趣的 / 有趣的
    reading: "IN-ter-es-tid / IN-ter-es-ting"
    phonetic: "/ˈɪntrəstɪd/ /ˈɪntrəstɪŋ/"
    description:
      en: "Interested = how you feel; Interesting = describes the thing."
      ja: "Interested = あなたの気持ち；Interesting = 物事を描写する。"
      zh: "Interested = 你的感受；Interesting = 描述事物。"
    sentence:
      en: "I'm interested in sci-fi movies because they're so interesting."
      ja: "SF映画はとても興味深いので、興味があります。"
      zh: "我對科幻電影感興趣因為它們很有趣。"

  - id: fascinated-fascinating
    word:
      en: Fascinated / Fascinating
      ja: 魅了された / 魅力的な
      zh: 著迷的 / 迷人的
    reading: "FAS-ih-nay-tid / FAS-ih-nay-ting"
    phonetic: "/ˈfæsɪneɪtɪd/ /ˈfæsɪneɪtɪŋ/"
    description:
      en: "Fascinated = how you feel; Fascinating = describes the thing."
      ja: "Fascinated = あなたの気持ち；Fascinating = 物事を描写する。"
      zh: "Fascinated = 你的感受；Fascinating = 描述事物。"
    sentence:
      en: "That documentary was fascinating - I was completely fascinated."
      ja: "そのドキュメンタリーは魅力的で、完全に魅了されました。"
      zh: "那部紀錄片很迷人——我完全著迷了。"

  - id: disappointed-disappointing
    word:
      en: Disappointed / Disappointing
      ja: がっかりした / がっかりさせる
      zh: 失望的 / 令人失望的
    reading: "dis-uh-POIN-tid / dis-uh-POIN-ting"
    phonetic: "/ˌdɪsəˈpɔɪntɪd/ /ˌdɪsəˈpɔɪntɪŋ/"
    description:
      en: "Disappointed = how you feel; Disappointing = describes the thing."
      ja: "Disappointed = あなたの気持ち；Disappointing = 物事を描写する。"
      zh: "Disappointed = 你的感受；Disappointing = 描述事物。"
    sentence:
      en: "The ending was disappointing - I felt so disappointed."
      ja: "結末はがっかりさせるもので、とてもがっかりしました。"
      zh: "結局令人失望——我感到非常失望。"

  # Media Verbs (Day 5)
  - id: binge-watch
    word:
      en: Binge-watch
      ja: 一気見する
      zh: 追劇
    reading: "BINJ-woch"
    phonetic: "/bɪndʒ wɑːtʃ/"
    description:
      en: "Watch many episodes or a whole series in one sitting."
      ja: "一度に多くのエピソードや全シリーズを見る。"
      zh: "一次看很多集或整部劇。"
    sentence:
      en: "I binge-watched the entire season last weekend."
      ja: "先週末、シーズン全部を一気見しました。"
      zh: "我上週末追完了整季。"

  - id: spoil
    word:
      en: Spoil
      ja: ネタバレする
      zh: 劇透
    reading: "spoyl"
    phonetic: "/spɔɪl/"
    description:
      en: "Reveal important plot details, ruining the surprise."
      ja: "重要なプロット詳細を明かして驚きを台無しにする。"
      zh: "透露重要劇情細節，破壞驚喜。"
    sentence:
      en: "Don't spoil it for me! I haven't seen the finale yet."
      ja: "ネタバレしないで！まだ最終話見てないんだ。"
      zh: "別劇透！我還沒看完結篇。"

  - id: stream
    word:
      en: Stream
      ja: ストリーミングする
      zh: 串流
    reading: "streem"
    phonetic: "/striːm/"
    description:
      en: "Watch content online without downloading."
      ja: "ダウンロードせずにオンラインでコンテンツを見る。"
      zh: "不下載而在線上觀看內容。"
    sentence:
      en: "You can stream it on Netflix - no need to download."
      ja: "Netflixでストリーミングできるよ。ダウンロード不要だよ。"
      zh: "你可以在 Netflix 上串流——不用下載。"

  - id: subtitles
    word:
      en: Subtitles
      ja: 字幕
      zh: 字幕
    reading: "SUHB-ty-tuhlz"
    phonetic: "/ˈsʌbˌtaɪtəlz/"
    description:
      en: "Text at the bottom of the screen showing dialogue."
      ja: "セリフを表示する画面下部のテキスト。"
      zh: "螢幕底部顯示對話的文字。"
    sentence:
      en: "I prefer watching with subtitles - it helps me understand better."
      ja: "字幕付きで見る方が好きです。理解しやすくなります。"
      zh: "我比較喜歡看有字幕的——幫助我更好理解。"

  # Recommendation Phrases (Day 4)
  - id: must-watch
    word:
      en: Must-watch
      ja: 必見
      zh: 必看
    reading: "muhst-woch"
    phonetic: "/mʌst wɑːtʃ/"
    description:
      en: "Something so good that everyone should see it."
      ja: "みんなが見るべきほど良いもの。"
      zh: "好到每個人都應該看的東西。"
    sentence:
      en: "This documentary is a must-watch for anyone interested in history."
      ja: "このドキュメンタリーは歴史に興味がある人は必見です。"
      zh: "這部紀錄片是對歷史感興趣的人必看的。"

  - id: right-up-your-alley
    word:
      en: Right up your alley
      ja: あなた好み
      zh: 正合你的胃口
    reading: "ryt uhp yor AL-ee"
    phonetic: "/raɪt ʌp jɔːr ˈæli/"
    description:
      en: "Perfect for someone's taste or interests."
      ja: "誰かの趣味や興味にぴったり。"
      zh: "完全符合某人的口味或興趣。"
    sentence:
      en: "It's right up your alley - you would love it!"
      ja: "あなた好みだよ。きっと気に入るよ！"
      zh: "正合你的胃口——你會喜歡的！"

chat:
  conversations:
    - id: scenario-1-movie-night-discussion
      title:
        en: "Movie Night Discussion"
        ja: "映画鑑賞後の感想"
        zh: "電影之夜討論"
      messages:
        - role: partner
          text:
            en: "So, what did you think of the movie? I heard it's supposed to be a masterpiece."
            ja: "で、映画どうだった？傑作らしいって聞いたんだけど。"
            zh: "那麼，你覺得這部電影怎麼樣？我聽說它應該是部傑作。"
        - role: user
          text:
            en: "Honestly, the first half was boring, so I was quite bored. But then it got really exciting!"
            ja: "正直、前半は退屈で、かなり退屈だった。でもその後、本当にワクワクしたよ！"
            zh: "老實說，前半部很無聊，所以我蠻無聊的。但後來變得很刺激！"
        - role: partner
          text:
            en: "I know what you mean! I was so excited during the final scene. Did you find the plot confusing at all?"
            ja: "わかる！最後のシーンですごくワクワクした。プロットは混乱した？"
            zh: "我懂你意思！最後一幕我超興奮的。你覺得劇情有讓你困惑嗎？"
        - role: user
          text:
            en: "A little bit. Some parts were confusing, so I was confused about who the villain was at first."
            ja: "ちょっとね。いくつかの部分が混乱させるものだったから、最初は誰が悪役かわからなかった。"
            zh: "有一點。有些地方很讓人困惑，所以我一開始搞不清誰是反派。"
        - role: partner
          text:
            en: "That's the twist though! What about the documentary part? I found it fascinating."
            ja: "でもそれがどんでん返しだよ！ドキュメンタリーの部分は？私は魅力的だと思った。"
            zh: "那就是轉折啊！那紀錄片的部分呢？我覺得很迷人。"
        - role: user
          text:
            en: "That documentary was fascinating - I was completely fascinated by the historical details."
            ja: "そのドキュメンタリーは魅力的だった。歴史的な詳細に完全に魅了されたよ。"
            zh: "那部紀錄片很迷人——我完全被歷史細節迷住了。"
        - role: partner
          text:
            en: "Me too! Although some critics say the movie is overrated. What do you think?"
            ja: "私も！でも一部の批評家は映画が過大評価されてるって言ってるけど。どう思う？"
            zh: "我也是！雖然有些評論家說這電影被高估了。你怎麼想？"
        - role: user
          text:
            en: "I don't think it's overrated. It's gripping and thought-provoking. The ending left me amazed!"
            ja: "過大評価されてるとは思わない。引き込まれるし、考えさせられる。結末には驚いたよ！"
            zh: "我不覺得它被高估。它扣人心弦又發人深省。結局讓我驚嘆！"
        - role: partner
          text:
            en: "I felt the same way - the ending was amazing! So overall, worth watching?"
            ja: "同感！結末は素晴らしかった！全体的に、見る価値ある？"
            zh: "我也有同感——結局很精彩！所以整體來說，值得看嗎？"
        - role: user
          text:
            en: "Definitely! It's a must-watch. I wasn't disappointed at all - I was actually really impressed."
            ja: "絶対に！必見だよ。全然がっかりしなかった。むしろ本当に感動した。"
            zh: "絕對！必看的。我一點都不失望——我其實印象深刻。"

    - id: scenario-2-the-recommendation
      title:
        en: "The Recommendation"
        ja: "おすすめ"
        zh: "推薦"
      messages:
        - role: partner
          text:
            en: "I'm looking for something new to watch this weekend. Any recommendations?"
            ja: "今週末何か新しいもの見たいんだけど。何かおすすめある？"
            zh: "我在找這週末看的新東西。有什麼推薦嗎？"
        - role: user
          text:
            en: "You have to check out this new series on Netflix! I binge-watched the entire season last weekend."
            ja: "Netflixの新しいシリーズを見て！先週末、シーズン全部を一気見したんだ。"
            zh: "你一定要看看 Netflix 上這部新劇！我上週末追完了整季。"
        - role: partner
          text:
            en: "Really? What's it about? I'm interested in sci-fi and mystery shows."
            ja: "本当？何の話？私はSFとミステリー番組に興味があるんだ。"
            zh: "真的嗎？是關於什麼的？我對科幻和懸疑劇感興趣。"
        - role: user
          text:
            en: "It's right up your alley then! It's a sci-fi thriller - super gripping and thought-provoking."
            ja: "じゃああなた好みだよ！SFスリラーで、すごく引き込まれて考えさせられるよ。"
            zh: "那正合你的胃口！是部科幻驚悚片——超扣人心弦又發人深省。"
        - role: partner
          text:
            en: "Sounds interesting! Can I stream it easily? I don't want to download anything."
            ja: "面白そう！簡単にストリーミングできる？何もダウンロードしたくないんだ。"
            zh: "聽起來很有趣！可以輕鬆串流嗎？我不想下載任何東西。"
        - role: user
          text:
            en: "Yes, you can stream it on Netflix. I prefer watching with subtitles - it helps catch all the details."
            ja: "うん、Netflixでストリーミングできるよ。字幕付きで見るのが好きなんだ。詳細を全部把握できるから。"
            zh: "可以，你可以在 Netflix 上串流。我喜歡看有字幕的——幫助抓住所有細節。"
        - role: partner
          text:
            en: "Good tip! Don't spoil anything for me though! I hate knowing the ending in advance."
            ja: "いいヒント！でもネタバレしないでね！事前に結末を知るのは嫌なんだ。"
            zh: "好建議！不過別劇透給我！我討厭提前知道結局。"
        - role: user
          text:
            en: "Don't worry, I won't spoil it for you! Just trust me - you would love it. It's a must-watch."
            ja: "心配しないで、ネタバレしないよ！信じて。きっと気に入るよ。必見だから。"
            zh: "別擔心，我不會劇透的！相信我——你會喜歡的。必看的。"
        - role: partner
          text:
            en: "What about the acting? Is it convincing?"
            ja: "演技はどう？説得力ある？"
            zh: "演技呢？有說服力嗎？"
        - role: user
          text:
            en: "The acting is amazing! The lead actress was nominated for an award. You won't be disappointed."
            ja: "演技は素晴らしい！主演女優は賞にノミネートされたんだ。がっかりしないよ。"
            zh: "演技很精彩！女主角還被提名獎項。你不會失望的。"

    - id: scenario-3-the-critic
      title:
        en: "The Critic"
        ja: "批評家"
        zh: "評論家"
      messages:
        - role: partner
          text:
            en: "What kind of movies are you interested in? I'm curious about your taste."
            ja: "どんな映画に興味がある？あなたの好みが気になるんだ。"
            zh: "你對什麼類型的電影感興趣？我很好奇你的品味。"
        - role: user
          text:
            en: "I'm interested in sci-fi movies and documentaries. Action films can be entertaining but often feel predictable."
            ja: "SF映画とドキュメンタリーに興味があるよ。アクション映画は楽しめるけど、よく予測可能に感じる。"
            zh: "我對科幻電影和紀錄片感興趣。動作片可以很有娛樂性但常常感覺可預測。"
        - role: partner
          text:
            en: "Have you seen any good documentaries recently? I want something thought-provoking."
            ja: "最近いいドキュメンタリー見た？考えさせられるものが見たいんだ。"
            zh: "你最近有看到什麼好的紀錄片嗎？我想要發人深省的。"
        - role: user
          text:
            en: "Yes! There's one about climate change that was fascinating. I was fascinated by the research they showed."
            ja: "うん！気候変動についてのがあって、魅力的だったよ。見せてくれた研究に魅了されたんだ。"
            zh: "有！有一部關於氣候變遷的很迷人。我被他們展示的研究迷住了。"
        - role: partner
          text:
            en: "What makes a movie disappointing for you? When do you feel disappointed?"
            ja: "何が映画をがっかりさせる？いつがっかりする？"
            zh: "什麼讓一部電影令人失望？你什麼時候感到失望？"
        - role: user
          text:
            en: "I feel disappointed when the ending is underwhelming after a great build-up. That's so disappointing!"
            ja: "素晴らしい盛り上がりの後に結末が期待外れだとがっかりする。それはすごくがっかりするんだ！"
            zh: "當精彩的鋪陳後結局卻令人失望時我會感到失望。那真的很令人失望！"
        - role: partner
          text:
            en: "I totally agree. What about horror movies? Are you terrified easily?"
            ja: "完全に同意。ホラー映画は？簡単に怖がる？"
            zh: "我完全同意。恐怖片呢？你容易被嚇到嗎？"
        - role: user
          text:
            en: "Horror movies are terrifying! I get terrified during jump scares, but I find psychological horror more interesting."
            ja: "ホラー映画は恐ろしい！ジャンプスケアでは怖くなるけど、サイコホラーの方が興味深いと思う。"
            zh: "恐怖片很可怕！驚嚇畫面會嚇到我，但我覺得心理恐怖更有趣。"
        - role: partner
          text:
            en: "Do you think most blockbusters are overrated these days?"
            ja: "最近のほとんどの大作映画は過大評価されてると思う？"
            zh: "你覺得現在大部分大片都被高估了嗎？"
        - role: user
          text:
            en: "Some are overrated, yes. I find sequels underwhelming compared to originals. But there are still some hilarious comedies!"
            ja: "いくつかは過大評価されてる、うん。続編はオリジナルに比べて期待外れだと思う。でもまだ爆笑コメディもあるよ！"
            zh: "有些是被高估了，對。我覺得續集比原作令人失望。但還是有一些爆笑的喜劇！"
        - role: partner
          text:
            en: "What's the last movie that left you amazed?"
            ja: "最後に驚かされた映画は何？"
            zh: "最後一部讓你驚嘆的電影是什麼？"
        - role: user
          text:
            en: "A Korean thriller last month - it was amazing! The plot twists were incredible. Definitely a masterpiece."
            ja: "先月の韓国スリラー。素晴らしかった！どんでん返しが信じられなかった。間違いなく傑作だよ。"
            zh: "上個月的一部韓國驚悚片——太精彩了！劇情轉折令人難以置信。絕對是傑作。"

quiz:
  questionsPerRound: 5
  xpReward: 25
`,Ib=`# Chapter: Week 1 - Identity & Background
meta:
  id: identity-and-background
  title:
    en: "Identity & Background"
    ja: "アイデンティティと経歴"
    zh: "身份與背景"
  description:
    en: "Introduce yourself professionally and personally without sounding like a textbook."
    ja: "教科書のようにならずに、プロフェッショナルかつ個人的に自己紹介しましょう。"
    zh: "學習專業且自然地介紹自己，不要像教科書一樣生硬。"
  icon: "🪪"
  order: 1
  level: intermediate

words:
  # Personality Adjectives
  - id: innovative
    word:
      en: Innovative
      ja: 革新的な
      zh: 創新的
    reading: "IN-oh-vay-tiv"
    phonetic: "/ˈɪnəveɪtɪv/"
    description:
      en: "Introducing new ideas or methods."
      ja: "新しいアイデアや方法を導入する。"
      zh: "引進新想法或方法。"
    sentence:
      en: "Steve Jobs was known for his innovative approach to technology."
      ja: "スティーブ・ジョブズはテクノロジーへの革新的なアプローチで知られていました。"
      zh: "史蒂夫·賈伯斯以他對科技的創新方法而聞名。"

  - id: resilient
    word:
      en: Resilient
      ja: 回復力のある
      zh: 有韌性的
    reading: "ri-ZIL-ee-uhnt"
    phonetic: "/rɪˈzɪliənt/"
    description:
      en: "Able to recover quickly from difficulties."
      ja: "困難から素早く回復できる。"
      zh: "能夠從困難中快速恢復。"
    sentence:
      en: "She is resilient and never gives up when facing challenges."
      ja: "彼女は回復力があり、困難に直面しても決して諦めません。"
      zh: "她很有韌性，面對挑戰時從不放棄。"

  - id: ambitious
    word:
      en: Ambitious
      ja: 野心的な
      zh: 有抱負的
    reading: "am-BISH-uhs"
    phonetic: "/æmˈbɪʃəs/"
    description:
      en: "Having a strong desire to succeed."
      ja: "成功への強い意欲がある。"
      zh: "有強烈成功慾望的。"
    sentence:
      en: "He is ambitious and always sets high goals for himself."
      ja: "彼は野心的で、常に高い目標を設定しています。"
      zh: "他很有抱負，總是為自己設定高目標。"

  - id: resourceful
    word:
      en: Resourceful
      ja: 機知に富んだ
      zh: 足智多謀的
    reading: "ri-SORS-fuhl"
    phonetic: "/rɪˈsɔːrsfəl/"
    description:
      en: "Good at finding ways to solve problems."
      ja: "問題を解決する方法を見つけるのが得意。"
      zh: "善於找到解決問題的方法。"
    sentence:
      en: "A resourceful person can adapt to any situation."
      ja: "機知に富んだ人はどんな状況にも適応できます。"
      zh: "足智多謀的人能適應任何情況。"

  # Grammar: Used to vs. Usually
  - id: used-to
    word:
      en: Used to
      ja: 以前は〜していた
      zh: 曾經
    reading: "YOOST too"
    phonetic: "/juːst tuː/"
    description:
      en: "Past habit that stopped. Not anymore."
      ja: "もうしなくなった過去の習慣。"
      zh: "過去的習慣，現在不再做了。"
    sentence:
      en: "I used to play piano as a child, but I stopped in high school."
      ja: "子供の頃はピアノを弾いていましたが、高校でやめました。"
      zh: "我小時候曾經彈鋼琴，但高中就停了。"

  - id: usually
    word:
      en: Usually
      ja: 普段は
      zh: 通常
    reading: "YOO-zhoo-uh-lee"
    phonetic: "/ˈjuːʒuəli/"
    description:
      en: "Present habit. What you do regularly now."
      ja: "現在の習慣。今定期的にすること。"
      zh: "現在的習慣。你現在經常做的事。"
    sentence:
      en: "I usually go to the gym on weekends."
      ja: "週末は普段ジムに行きます。"
      zh: "我通常週末去健身房。"

  # Phrasal Verbs (Life Stages)
  - id: grow-up
    word:
      en: Grow up
      ja: 成長する
      zh: 長大
    reading: "GROH uhp"
    phonetic: "/ɡroʊ ʌp/"
    description:
      en: "Mature, become an adult."
      ja: "成熟する、大人になる。"
      zh: "成熟，變成大人。"
    sentence:
      en: "I grew up in a small town near the mountains."
      ja: "私は山の近くの小さな町で育ちました。"
      zh: "我在山附近的小鎮長大。"

  - id: settle-down
    word:
      en: Settle down
      ja: 落ち着く
      zh: 定居
    reading: "SET-uhl down"
    phonetic: "/ˈsetl daʊn/"
    description:
      en: "Buy a house, get married, stay in one place."
      ja: "家を買う、結婚する、一か所に住む。"
      zh: "買房子、結婚、在一個地方定居。"
    sentence:
      en: "After traveling for years, she decided to settle down in Tokyo."
      ja: "何年も旅行した後、彼女は東京に落ち着くことにしました。"
      zh: "旅行多年後，她決定在東京定居。"

  - id: take-up
    word:
      en: Take up
      ja: 始める
      zh: 開始從事
    reading: "TAYK uhp"
    phonetic: "/teɪk ʌp/"
    description:
      en: "Start a new hobby or activity."
      ja: "新しい趣味や活動を始める。"
      zh: "開始一個新的嗜好或活動。"
    sentence:
      en: "I took up photography during the pandemic."
      ja: "パンデミック中に写真を始めました。"
      zh: "我在疫情期間開始學攝影。"

  # Professional Verbs (avoid "do")
  - id: manage
    word:
      en: Manage
      ja: 管理する
      zh: 管理
    reading: "MAN-ij"
    phonetic: "/ˈmænɪdʒ/"
    description:
      en: "Be in charge of people or projects."
      ja: "人やプロジェクトを担当する。"
      zh: "負責人員或專案。"
    sentence:
      en: "I manage a team of five software developers."
      ja: "私は5人のソフトウェア開発者のチームを管理しています。"
      zh: "我管理一個五人的軟體開發團隊。"

  - id: design
    word:
      en: Design
      ja: 設計する
      zh: 設計
    reading: "di-ZYN"
    phonetic: "/dɪˈzaɪn/"
    description:
      en: "Create plans or drawings for something."
      ja: "何かの計画や図面を作成する。"
      zh: "為某事物創建計劃或圖紙。"
    sentence:
      en: "She designs user interfaces for mobile apps."
      ja: "彼女はモバイルアプリのユーザーインターフェースを設計しています。"
      zh: "她為手機應用程式設計使用者介面。"

  - id: analyze
    word:
      en: Analyze
      ja: 分析する
      zh: 分析
    reading: "AN-uh-lyz"
    phonetic: "/ˈænəlaɪz/"
    description:
      en: "Examine something in detail."
      ja: "何かを詳細に調べる。"
      zh: "詳細檢查某事物。"
    sentence:
      en: "My job is to analyze market trends and write reports."
      ja: "私の仕事は市場動向を分析してレポートを書くことです。"
      zh: "我的工作是分析市場趨勢並撰寫報告。"

  - id: support
    word:
      en: Support
      ja: サポートする
      zh: 支援
    reading: "suh-PORT"
    phonetic: "/səˈpɔːrt/"
    description:
      en: "Help or assist someone or something."
      ja: "誰かや何かを助ける。"
      zh: "幫助或協助某人或某事。"
    sentence:
      en: "I support clients with technical issues every day."
      ja: "私は毎日クライアントの技術的な問題をサポートしています。"
      zh: "我每天協助客戶處理技術問題。"

  - id: coordinate
    word:
      en: Coordinate
      ja: 調整する
      zh: 協調
    reading: "koh-OR-di-nayt"
    phonetic: "/koʊˈɔːrdɪneɪt/"
    description:
      en: "Organize different elements to work together."
      ja: "異なる要素を組織して一緒に機能させる。"
      zh: "組織不同元素使其一起運作。"
    sentence:
      en: "He coordinates between the design and engineering teams."
      ja: "彼はデザインチームとエンジニアリングチームの間を調整しています。"
      zh: "他協調設計團隊和工程團隊之間的工作。"

chat:
  conversations:
    - id: scenario-1-elevator-pitch
      title:
        en: "The Elevator Pitch"
        ja: "エレベーターピッチ"
        zh: "電梯簡報"
      messages:
        - role: partner
          text:
            en: "Hi! I don't think we've met. What do you do?"
            ja: "こんにちは！初めましてですね。お仕事は何をされていますか？"
            zh: "嗨！我們好像沒見過。你是做什麼的？"
        - role: user
          text:
            en: "Hi! I'm a product manager. I coordinate between design and engineering teams to build mobile apps."
            ja: "こんにちは！プロダクトマネージャーです。モバイルアプリを作るためにデザインチームとエンジニアリングチームの間を調整しています。"
            zh: "嗨！我是產品經理。我協調設計和工程團隊來開發手機應用程式。"
        - role: partner
          text:
            en: "That sounds interesting! How did you get into that field?"
            ja: "面白そうですね！どうやってその分野に入ったんですか？"
            zh: "聽起來很有趣！你是怎麼進入這個領域的？"
        - role: user
          text:
            en: "I used to work as a software developer, but I took up project management three years ago."
            ja: "以前はソフトウェア開発者として働いていましたが、3年前にプロジェクト管理を始めました。"
            zh: "我曾經是軟體開發人員，但三年前開始從事專案管理。"
        - role: partner
          text:
            en: "Nice career change! What do you enjoy most about it?"
            ja: "素敵なキャリアチェンジですね！一番楽しいことは何ですか？"
            zh: "很棒的職業轉換！你最喜歡什麼部分？"
        - role: user
          text:
            en: "I enjoy working with people. You have to be resourceful and resilient in this role."
            ja: "人と働くのが楽しいです。この役割では機知に富んで回復力がないといけません。"
            zh: "我喜歡與人合作。這個角色需要足智多謀和有韌性。"

    - id: scenario-2-past-and-present
      title:
        en: "Past vs. Present Habits"
        ja: "過去と現在の習慣"
        zh: "過去與現在的習慣"
      messages:
        - role: partner
          text:
            en: "Where did you grow up?"
            ja: "どこで育ちましたか？"
            zh: "你在哪裡長大的？"
        - role: user
          text:
            en: "I grew up in a small town near the coast. Very different from city life."
            ja: "海岸近くの小さな町で育ちました。都会の生活とは全然違います。"
            zh: "我在海邊附近的小鎮長大。跟城市生活很不一樣。"
        - role: partner
          text:
            en: "What did you use to do there as a kid?"
            ja: "子供の頃はそこで何をしていましたか？"
            zh: "你小時候在那裡都做什麼？"
        - role: user
          text:
            en: "I used to spend every summer at the beach. I used to surf almost every day."
            ja: "毎年夏はビーチで過ごしていました。ほぼ毎日サーフィンをしていました。"
            zh: "我以前每個夏天都在海邊度過。我幾乎每天都衝浪。"
        - role: partner
          text:
            en: "Do you still surf now?"
            ja: "今でもサーフィンしますか？"
            zh: "你現在還衝浪嗎？"
        - role: user
          text:
            en: "Not really. I usually just go to the gym now. City life is different."
            ja: "あまり。今は普段ジムに行くだけです。都会の生活は違いますね。"
            zh: "不太衝了。我現在通常只是去健身房。城市生活不一樣。"
        - role: partner
          text:
            en: "Have you taken up any new hobbies?"
            ja: "何か新しい趣味を始めましたか？"
            zh: "你有開始什麼新嗜好嗎？"
        - role: user
          text:
            en: "Yes, I took up photography last year. It helps me explore the city."
            ja: "はい、去年写真を始めました。街を探索するのに役立っています。"
            zh: "有，我去年開始學攝影。這幫助我探索城市。"

    - id: scenario-3-professional-intro
      title:
        en: "Professional Self-Description"
        ja: "プロフェッショナルな自己紹介"
        zh: "專業自我介紹"
      messages:
        - role: partner
          text:
            en: "Can you tell me about your current role?"
            ja: "現在の役職について教えていただけますか？"
            zh: "你能告訴我你目前的職位嗎？"
        - role: user
          text:
            en: "Sure. I manage a team of five people. We analyze customer data and design marketing strategies."
            ja: "もちろん。5人のチームを管理しています。顧客データを分析してマーケティング戦略を設計しています。"
            zh: "當然。我管理一個五人團隊。我們分析客戶數據並設計行銷策略。"
        - role: partner
          text:
            en: "That sounds like a lot of responsibility. What skills are important?"
            ja: "責任が大きそうですね。どんなスキルが重要ですか？"
            zh: "聽起來責任很大。什麼技能很重要？"
        - role: user
          text:
            en: "You need to be ambitious but also resilient. Not every campaign succeeds."
            ja: "野心的であると同時に回復力も必要です。すべてのキャンペーンが成功するわけではありません。"
            zh: "你需要有抱負，但也要有韌性。不是每個活動都會成功。"
        - role: partner
          text:
            en: "How did you develop those skills?"
            ja: "どうやってそのスキルを身につけましたか？"
            zh: "你是怎麼培養這些技能的？"
        - role: user
          text:
            en: "I used to be afraid of failure. But working in startups taught me to be more resourceful."
            ja: "以前は失敗を恐れていました。でもスタートアップで働いて、より機知に富むようになりました。"
            zh: "我以前害怕失敗。但在新創公司工作教會了我更加足智多謀。"
        - role: partner
          text:
            en: "Do you plan to settle down in this career?"
            ja: "このキャリアに落ち着く予定ですか？"
            zh: "你打算在這個職業定下來嗎？"
        - role: user
          text:
            en: "For now, yes. But I'm always open to taking up new challenges."
            ja: "今のところはい。でも常に新しい挑戦を始めることにオープンです。"
            zh: "目前是的。但我總是願意接受新挑戰。"

quiz:
  questionsPerRound: 5
  xpReward: 25
`,Sb=`# Chapter: Week 2 - Telling Stories
meta:
  id: telling-stories
  title:
    en: "Telling Stories"
    ja: "ストーリーを語る"
    zh: "講故事"
  description:
    en: "Tell a short story about a past event clearly, using the right timing."
    ja: "適切な時制を使って、過去の出来事を明確に語りましょう。"
    zh: "學習用正確的時態清楚地講述過去發生的事。"
  icon: "📖"
  order: 2
  level: intermediate

words:
  # Story Starters
  - id: so-one-time
    word:
      en: So, one time...
      ja: それで、ある時...
      zh: 所以，有一次...
    reading: "soh wuhn tym"
    phonetic: "/soʊ wʌn taɪm/"
    description:
      en: "Casual way to start a story."
      ja: "カジュアルに話を始める方法。"
      zh: "開始講故事的隨意方式。"
    sentence:
      en: "So, one time I was traveling in Thailand and I got completely lost."
      ja: "それで、ある時タイを旅行していて完全に迷子になりました。"
      zh: "所以，有一次我在泰國旅行，完全迷路了。"

  - id: i-remember-when
    word:
      en: I remember when...
      ja: 〜した時のことを覚えている
      zh: 我記得有一次...
    reading: "ay ri-MEM-ber wen"
    phonetic: "/aɪ rɪˈmembər wen/"
    description:
      en: "Nostalgic way to introduce a memory."
      ja: "懐かしく思い出を紹介する方法。"
      zh: "帶著懷舊感介紹回憶的方式。"
    sentence:
      en: "I remember when we first moved to this city. Everything was so confusing."
      ja: "この街に初めて引っ越した時のことを覚えています。全てがとても混乱していました。"
      zh: "我記得我們剛搬到這個城市的時候。一切都很混亂。"

  # Past Simple vs Past Continuous
  - id: was-doing
    word:
      en: Was/Were + doing
      ja: 〜していた
      zh: 正在做
    reading: "wuhz DOO-ing"
    phonetic: "/wɒz ˈduːɪŋ/"
    description:
      en: "Past Continuous: Background action in progress."
      ja: "過去進行形：進行中の背景動作。"
      zh: "過去進行式：正在進行的背景動作。"
    sentence:
      en: "I was sleeping when the phone rang."
      ja: "電話が鳴った時、私は寝ていました。"
      zh: "電話響的時候我正在睡覺。"

  - id: interrupted
    word:
      en: When (interruption)
      ja: 〜した時（中断）
      zh: 當...的時候（中斷）
    reading: "wen"
    phonetic: "/wen/"
    description:
      en: "Past Simple: The main action that interrupts."
      ja: "過去形：中断する主要な動作。"
      zh: "過去式：打斷的主要動作。"
    sentence:
      en: "I was walking down the street when I saw my ex-girlfriend."
      ja: "通りを歩いていたら、元カノを見かけました。"
      zh: "我正走在街上，突然看到我前女友。"

  # Connectors (The Glue)
  - id: suddenly
    word:
      en: Suddenly
      ja: 突然
      zh: 突然
    reading: "SUHD-n-lee"
    phonetic: "/ˈsʌdənli/"
    description:
      en: "Something unexpected happens quickly."
      ja: "予期しないことが急に起こる。"
      zh: "意外的事情快速發生。"
    sentence:
      en: "I was walking down the street when suddenly a dog started chasing me."
      ja: "通りを歩いていたら、突然犬が追いかけてきました。"
      zh: "我正走在街上，突然一隻狗開始追我。"

  - id: meanwhile
    word:
      en: Meanwhile
      ja: その間に
      zh: 與此同時
    reading: "MEEN-wyl"
    phonetic: "/ˈmiːnwaɪl/"
    description:
      en: "Something happening at the same time elsewhere."
      ja: "別の場所で同時に起きていること。"
      zh: "在其他地方同時發生的事情。"
    sentence:
      en: "I was stuck in traffic. Meanwhile, my friends were already at the restaurant."
      ja: "私は渋滞にはまっていました。その間に、友達はすでにレストランにいました。"
      zh: "我被困在車陣裡。與此同時，我的朋友們已經在餐廳了。"

  - id: eventually
    word:
      en: Eventually
      ja: 最終的に
      zh: 最後
    reading: "i-VEN-choo-uh-lee"
    phonetic: "/ɪˈventʃuəli/"
    description:
      en: "After a long time or process."
      ja: "長い時間やプロセスの後で。"
      zh: "經過很長時間或過程之後。"
    sentence:
      en: "We got lost three times, but eventually we found the hotel."
      ja: "3回迷子になりましたが、最終的にホテルを見つけました。"
      zh: "我們迷路了三次，但最後找到了飯店。"

  # Sensory Words (for vivid stories)
  - id: spicy
    word:
      en: Spicy
      ja: 辛い
      zh: 辣
    reading: "SPY-see"
    phonetic: "/ˈspaɪsi/"
    description:
      en: "Hot flavor, like chili."
      ja: "唐辛子のような辛い味。"
      zh: "像辣椒一樣的辣味。"
    sentence:
      en: "The curry was so spicy that my eyes started watering."
      ja: "カレーがとても辛くて、目から涙が出ました。"
      zh: "咖哩辣到我眼淚都流出來了。"

  - id: bitter
    word:
      en: Bitter
      ja: 苦い
      zh: 苦
    reading: "BIT-er"
    phonetic: "/ˈbɪtər/"
    description:
      en: "Sharp, unpleasant taste like black coffee."
      ja: "ブラックコーヒーのような鋭い不快な味。"
      zh: "像黑咖啡一樣尖銳、不愉快的味道。"
    sentence:
      en: "The medicine was extremely bitter. I almost couldn't swallow it."
      ja: "その薬はとても苦かったです。飲み込めないくらいでした。"
      zh: "那藥非常苦。我幾乎嚥不下去。"

  - id: crunchy
    word:
      en: Crunchy
      ja: カリカリ
      zh: 脆脆的
    reading: "KRUHN-chee"
    phonetic: "/ˈkrʌntʃi/"
    description:
      en: "Makes a crisp sound when you bite."
      ja: "噛むとパリパリ音がする。"
      zh: "咬下去會發出酥脆的聲音。"
    sentence:
      en: "The fried chicken was perfectly crunchy on the outside."
      ja: "フライドチキンは外側が完璧にカリカリでした。"
      zh: "炸雞外皮非常酥脆。"

  - id: freezing
    word:
      en: Freezing
      ja: 凍えるほど寒い
      zh: 冷得要命
    reading: "FREE-zing"
    phonetic: "/ˈfriːzɪŋ/"
    description:
      en: "Extremely cold (stronger than 'cold')."
      ja: "極端に寒い（'cold'より強い）。"
      zh: "非常冷（比'cold'更強烈）。"
    sentence:
      en: "The restaurant was freezing. I had to keep my jacket on the whole time."
      ja: "レストランは凍えるほど寒かったです。ずっとジャケットを着ていなければなりませんでした。"
      zh: "餐廳冷得要命。我整餐都得穿著外套。"

  - id: disgusting
    word:
      en: Disgusting
      ja: まずい・気持ち悪い
      zh: 噁心的
    reading: "dis-GUHS-ting"
    phonetic: "/dɪsˈɡʌstɪŋ/"
    description:
      en: "Extremely unpleasant, makes you feel sick."
      ja: "とても不快で、気分が悪くなる。"
      zh: "非常令人不快，讓你感到噁心。"
    sentence:
      en: "The fish smelled disgusting. I couldn't even try it."
      ja: "その魚は気持ち悪いにおいがしました。試すことすらできませんでした。"
      zh: "那魚聞起來很噁心。我連試都不敢試。"

  - id: hilarious
    word:
      en: Hilarious
      ja: 爆笑するほど面白い
      zh: 爆笑的
    reading: "hi-LAIR-ee-uhs"
    phonetic: "/hɪˈleriəs/"
    description:
      en: "Extremely funny (stronger than 'funny')."
      ja: "とても面白い（'funny'より強い）。"
      zh: "非常好笑（比'funny'更強烈）。"
    sentence:
      en: "The whole situation was hilarious. We couldn't stop laughing."
      ja: "状況全体が爆笑でした。笑いが止まりませんでした。"
      zh: "整個情況太爆笑了。我們笑個不停。"

chat:
  conversations:
    - id: scenario-1-travel-story
      title:
        en: "Travel Horror Story"
        ja: "旅行のホラーストーリー"
        zh: "旅行恐怖故事"
      messages:
        - role: partner
          text:
            en: "Have you ever had a terrible travel experience?"
            ja: "ひどい旅行経験はありますか？"
            zh: "你有過很糟糕的旅行經歷嗎？"
        - role: user
          text:
            en: "Oh yes. So, one time I was traveling in Thailand and everything went wrong."
            ja: "ありますよ。それで、ある時タイを旅行していて、全部うまくいかなかったんです。"
            zh: "有啊。所以，有一次我在泰國旅行，一切都出了問題。"
        - role: partner
          text:
            en: "What happened?"
            ja: "何があったんですか？"
            zh: "發生了什麼事？"
        - role: user
          text:
            en: "I was walking to my hotel when suddenly it started pouring rain. I had no umbrella."
            ja: "ホテルに歩いていたら、突然土砂降りになりました。傘を持っていませんでした。"
            zh: "我正走去飯店，突然下起傾盆大雨。我沒帶傘。"
        - role: partner
          text:
            en: "Oh no! What did you do?"
            ja: "大変！どうしたんですか？"
            zh: "糟糕！你怎麼辦？"
        - role: user
          text:
            en: "I ran into a restaurant. Meanwhile, my phone got completely wet and stopped working."
            ja: "レストランに駆け込みました。その間に、電話が完全に濡れて動かなくなりました。"
            zh: "我跑進一家餐廳。與此同時，我的手機完全濕透，停止運作了。"
        - role: partner
          text:
            en: "That's terrible! Did you find your hotel?"
            ja: "ひどい！ホテルは見つかりましたか？"
            zh: "太慘了！你找到飯店了嗎？"
        - role: user
          text:
            en: "Eventually, yes. A kind stranger helped me. But I was freezing and exhausted."
            ja: "最終的には、はい。親切な見知らぬ人が助けてくれました。でも凍えるほど寒くて疲れ果てていました。"
            zh: "最後找到了。一個好心的陌生人幫了我。但我冷得要命又精疲力盡。"

    - id: scenario-2-memorable-meal
      title:
        en: "A Memorable Meal"
        ja: "忘れられない食事"
        zh: "難忘的一餐"
      messages:
        - role: partner
          text:
            en: "Tell me about a meal you'll never forget."
            ja: "忘れられない食事について教えてください。"
            zh: "跟我說說你永遠忘不了的一餐。"
        - role: user
          text:
            en: "I remember when I tried street food in Korea for the first time."
            ja: "韓国で初めて屋台料理を食べた時のことを覚えています。"
            zh: "我記得第一次在韓國吃街頭小吃的時候。"
        - role: partner
          text:
            en: "Was it good?"
            ja: "美味しかったですか？"
            zh: "好吃嗎？"
        - role: user
          text:
            en: "The fried chicken was amazing - perfectly crunchy on the outside and juicy inside."
            ja: "フライドチキンは最高でした - 外はカリカリで中はジューシー。"
            zh: "炸雞超好吃 - 外皮酥脆，裡面多汁。"
        - role: partner
          text:
            en: "What about the spicy food? I heard Korean food is hot."
            ja: "辛い食べ物はどうでしたか？韓国料理は辛いと聞きましたが。"
            zh: "辣的食物呢？我聽說韓國菜很辣。"
        - role: user
          text:
            en: "The kimchi stew was so spicy that my eyes started watering! But I loved it."
            ja: "キムチチゲはとても辛くて目から涙が出ました！でも大好きでした。"
            zh: "泡菜鍋辣到我眼淚都流出來了！但我超愛。"
        - role: partner
          text:
            en: "Did you try anything you didn't like?"
            ja: "嫌いなものはありましたか？"
            zh: "有試到不喜歡的嗎？"
        - role: user
          text:
            en: "Yes, one dish tasted bitter and had a disgusting texture. I couldn't finish it."
            ja: "はい、一つの料理は苦くて気持ち悪い食感でした。食べきれませんでした。"
            zh: "有，有一道菜嚐起來苦苦的，口感很噁心。我吃不完。"

    - id: scenario-3-funny-story
      title:
        en: "A Hilarious Mistake"
        ja: "爆笑の失敗"
        zh: "爆笑的錯誤"
      messages:
        - role: partner
          text:
            en: "Do you have any funny stories from your past?"
            ja: "過去の面白い話はありますか？"
            zh: "你有什麼過去的有趣故事嗎？"
        - role: user
          text:
            en: "So, one time I was giving a presentation at work. It was going really well."
            ja: "それで、ある時仕事でプレゼンをしていました。とてもうまくいっていました。"
            zh: "所以，有一次我在工作上做簡報。進行得很順利。"
        - role: partner
          text:
            en: "And then what happened?"
            ja: "それからどうなりましたか？"
            zh: "然後呢？"
        - role: user
          text:
            en: "I was explaining the data when suddenly my cat jumped onto my keyboard!"
            ja: "データを説明していたら、突然猫がキーボードの上に飛び乗りました！"
            zh: "我正在解釋數據，突然我的貓跳到鍵盤上！"
        - role: partner
          text:
            en: "Oh no! This was a video call?"
            ja: "大変！これはビデオ通話でしたか？"
            zh: "糟糕！這是視訊會議嗎？"
        - role: user
          text:
            en: "Yes! Meanwhile, my cat was walking across the screen. Everyone started laughing."
            ja: "はい！その間に、猫が画面を歩いていました。みんな笑い始めました。"
            zh: "對！與此同時，我的貓走過螢幕。大家都開始笑。"
        - role: partner
          text:
            en: "That must have been embarrassing!"
            ja: "恥ずかしかったでしょう！"
            zh: "那一定很尷尬！"
        - role: user
          text:
            en: "At first, yes. But eventually everyone said it was hilarious. Best meeting ever!"
            ja: "最初はそうでした。でも最終的にみんな爆笑だと言いました。最高の会議でした！"
            zh: "一開始是的。但最後大家都說太爆笑了。有史以來最棒的會議！"

quiz:
  questionsPerRound: 5
  xpReward: 25
`,Tb=`# Chapter: Comprehension Check
meta:
  id: comprehension-check
  title:
    en: "Comprehension Check"
    ja: "理解度の確認"
    zh: "理解度確認"
  description:
    en: "Learn to ask for clarification and repetition."
    ja: "説明や繰り返しを求める方法を学びましょう。"
    zh: "學習如何請求澄清和重複說明。"
  icon: "🤔"
  order: 8
  level: beginner

words:
  - id: understand
    word:
      en: Understand
      ja: 理解する
      zh: 懂/明白
    reading: Rikai suru
    phonetic: "/ˌʌndərˈstænd/"
    description:
      en: "To know the meaning of something."
      ja: "何かの意味を知ること。"
      zh: "了解某事的意思。"
    sentence:
      en: "Do you understand?"
      ja: "わかりますか？"
      zh: "你懂嗎？"

  - id: again
    word:
      en: Again
      ja: もう一度
      zh:再一次
    reading: Mō ichido
    phonetic: "/əˈɡɛn/"
    description:
      en: "One more time."
      ja: "もう一回。"
      zh: "再一次。"
    sentence:
      en: "Please say it again."
      ja: "もう一度言ってください。"
      zh: "請再說一次。"

  - id: slowly
    word:
      en: Slowly
      ja: ゆっくり
      zh: 慢一點
    reading: Yukkuri
    phonetic: "/ˈsloʊli/"
    description:
      en: "At a low speed."
      ja: "遅い速度で。"
      zh: "速度很慢地。"
    sentence:
      en: "Please speak slowly."
      ja: "ゆっくり話してください。"
      zh: "請說慢一點。"

  - id: mean
    word:
      en: Mean
      ja: 意味する
      zh: 意思/意味著
    reading: Imi suru
    phonetic: "/miːn/"
    description:
      en: "To have a specific meaning."
      ja: "特定の意味を持つこと。"
      zh: "具有特定的含義。"
    sentence:
      en: "What does this mean?"
      ja: "これはどういう意味ですか？"
      zh: "這是什麼意思？"

  - id: question
    word:
      en: Question
      ja: 質問
      zh: 問題
    reading: Shitsumon
    phonetic: "/ˈkwɛstʃən/"
    description:
      en: "A sentence that asks for information."
      ja: "情報を求める文。"
      zh: "用來詢問資訊的語句。"
    sentence:
      en: "I have a question."
      ja: "質問があります。"
      zh: "我有一個問題。"

  - id: speak
    word:
      en: Speak
      ja: 話す
      zh: 說
    reading: Hanasu
    phonetic: "/spiːk/"
    description:
      en: "To say words."
      ja: "言葉を言うこと。"
      zh: "說話。"
    sentence:
      en: "I speak English."
      ja: "私は英語を話します。"
      zh: "我說英語。"

chat:
  conversations:
    - id: scenario-1-asking-repetition
      title:
        en: "Asking for Repetition"
        ja: "繰り返しをお願いする"
        zh: "請求重複"
      messages:
        - role: partner
          text:
            en: "This is very important."
            ja: "これはとても重要です。"
            zh: "這非常重要。"
        - role: user
          text:
            en: "Sorry, I do not understand."
            ja: "すみません、わかりません。"
            zh: "抱歉，我不懂。"
        - role: partner
          text:
            en: "Okay, I will say it again."
            ja: "わかりました、もう一度言います。"
            zh: "好，我再說一次。"
        - role: user
          text:
            en: "Please speak slowly."
            ja: "ゆっくり話してください。"
            zh: "請說慢一點。"
        - role: partner
          text:
            en: "Is this speed okay?"
            ja: "この速さで大丈夫ですか？"
            zh: "這個速度可以嗎？"
        - role: user
          text:
            en: "Yes, thank you."
            ja: "はい、ありがとう。"
            zh: "可以，謝謝。"
        - role: partner
          text:
            en: "Do you have a question?"
            ja: "質問はありますか？"
            zh: "你有問題嗎？"
        - role: user
          text:
            en: "No questions now."
            ja: "今は質問ありません。"
            zh: "現在沒有問題。"

    - id: scenario-2-clarifying-meaning
      title:
        en: "Clarifying Meaning"
        ja: "意味を確認する"
        zh: "確認意思"
      messages:
        - role: partner
          text:
            en: "Do you speak Japanese?"
            ja: "日本語を話しますか？"
            zh: "你會說日語嗎？"
        - role: user
          text:
            en: "Yes, I speak a little."
            ja: "はい、少し話します。"
            zh: "會，我會說一點。"
        - role: partner
          text:
            en: "Look at this word."
            ja: "この単語を見てください。"
            zh: "看看這個字。"
        - role: user
          text:
            en: "What does it mean?"
            ja: "それはどういう意味ですか？"
            zh: "那是什麼意思？"
        - role: partner
          text:
            en: "It means 'Hello'."
            ja: "それは「こんにちは」という意味です。"
            zh: "它是「你好」的意思。"
        - role: user
          text:
            en: "Ah, I understand now."
            ja: "あ、今はわかります。"
            zh: "啊，我現在懂了。"
        - role: partner
          text:
            en: "That is good."
            ja: "それはよかったです。"
            zh: "那很好。"
        - role: user
          text:
            en: "Thank you for helping."
            ja: "助けてくれてありがとう。"
            zh: "謝謝你的幫忙。"

quiz:
  questionsPerRound: 5
  xpReward: 20`,Ab=`# Chapter: Me and You
meta:
  id: me-and-you
  title:
    en: "Me & You"
    ja: "私とあなた"
    zh: "我與你"
  description:
    en: "Learn how to introduce yourself and ask about others."
    ja: "自己紹介や他人のことを尋ねる方法を学びましょう。"
    zh: "學習如何自我介紹和詢問他人。"
  icon: "🤝"
  order: 1
  level: beginner

words:
  - id: i-watashi
    word:
      en: I
      ja: 私
      zh: 我
    reading: Watashi
    phonetic: "/waˈtɑːʃi/"
    description:
      en: "Used to talk about yourself."
      ja: "自分のことを話すときに使います。"
      zh: "用來談論自己。"
    sentence:
      en: "I am a student."
      ja: "私は学生です。"
      zh: "我是學生。"

  - id: you-anata
    word:
      en: You
      ja: あなた
      zh: 你
    reading: Anata
    phonetic: "/ɑːˈnɑːtɑː/"
    description:
      en: "Used to talk to the other person."
      ja: "相手のことを話すときに使います。"
      zh: "用來對對方說話。"
    sentence:
      en: "Are you Tanaka?"
      ja: "あなたは田中さんですか？"
      zh: "你是田中嗎？"

  - id: name
    word:
      en: Name
      ja: 名前
      zh: 名字
    reading: Namae
    phonetic: "/nɑːˈmɑːeɪ/"
    description:
      en: "What people call you."
      ja: "人があなたを呼ぶときの言葉。"
      zh: "別人稱呼你的詞。"
    sentence:
      en: "My name is Ken."
      ja: "私の名前はケンです。"
      zh: "我的名字是Ken。"

  - id: who
    word:
      en: Who
      ja: 誰
      zh: 誰
    reading: Dare
    phonetic: "/ˈdɑːreɪ/"
    description:
      en: "Used to ask about a person."
      ja: "人について尋ねるときに使います。"
      zh: "用來詢問某人。"
    sentence:
      en: "Who is that?"
      ja: "あれは誰ですか？"
      zh: "那是誰？"

  - id: friend
    word:
      en: Friend
      ja: 友達
      zh: 朋友
    reading: Tomodachi
    phonetic: "/toʊmoʊˈdɑːtʃi/"
    description:
      en: "Someone you like and know well."
      ja: "好きでよく知っている人。"
      zh: "你喜歡且熟悉的人。"
    sentence:
      en: "He is my friend."
      ja: "彼は私の友達です。"
      zh: "他是我的朋友。"

  - id: student
    word:
      en: Student
      ja: 学生
      zh: 學生
    reading: Gakusei
    phonetic: "/gɑːkˈseɪ/"
    description:
      en: "A person who studies at school."
      ja: "学校で勉強している人。"
      zh: "在學校學習的人。"
    sentence:
      en: "I am not a student."
      ja: "私は学生ではありません。"
      zh: "我不是學生。"

chat:
  conversations:
    - id: scenario-1-introduction
      title:
        en: "Self Introduction"
        ja: "自己紹介"
        zh: "自我介紹"
      messages:
        - role: partner
          text:
            en: "Hello. I am Ken."
            ja: "こんにちは。私はケンです。"
            zh: "你好。我是Ken。"
        - role: user
          text:
            en: "Hello. My name is John."
            ja: "こんにちは。私の名前はジョンです。"
            zh: "你好。我的名字是John。"
        - role: partner
          text:
            en: "Are you a student?"
            ja: "あなたは学生ですか？"
            zh: "你是學生嗎？"
        - role: user
          text:
            en: "Yes, I am a student."
            ja: "はい、私は学生です。"
            zh: "是的，我是學生。"
        - role: partner
          text:
            en: "Me too. Nice to meet you."
            ja: "私もです。はじめまして。"
            zh: "我也是。很高興認識你。"
        - role: user
          text:
            en: "Nice to meet you too."
            ja: "こちらこそ、はじめまして。"
            zh: "我也很高興認識你。"
        - role: partner
          text:
            en: "Are you Japanese?"
            ja: "あなたは日本人ですか？"
            zh: "你是日本人嗎？"
        - role: user
          text:
            en: "No, I am American."
            ja: "いいえ、私はアメリカ人です。"
            zh: "不是，我是美國人。"

    - id: scenario-2-asking-who
      title:
        en: "Who is that?"
        ja: "あの人は誰？"
        zh: "那是誰？"
      messages:
        - role: partner
          text:
            en: "Who is that person?"
            ja: "あの人は誰ですか？"
            zh: "那個人是誰？"
        - role: user
          text:
            en: "That is my friend."
            ja: "あれは私の友達です。"
            zh: "那是我的朋友。"
        - role: partner
          text:
            en: "What is his name?"
            ja: "彼の名前は何ですか？"
            zh: "他叫什麼名字？"
        - role: user
          text:
            en: "His name is Tanaka."
            ja: "彼の名前は田中です。"
            zh: "他的名字是田中。"
        - role: partner
          text:
            en: "Is he a student too?"
            ja: "彼も学生ですか？"
            zh: "他也是學生嗎？"
        - role: user
          text:
            en: "No, he is a teacher."
            ja: "いいえ、彼は先生です。"
            zh: "不是，他是老師。"
        - role: partner
          text:
            en: "Oh, I see."
            ja: "ああ、そうですか。"
            zh: "喔，原來如此。"
        - role: user
          text:
            en: "He is very kind."
            ja: "彼はとても親切です。"
            zh: "他非常親切。"

quiz:
  questionsPerRound: 5
  xpReward: 20
`,Cb=`# Chapter: Me, You, and Professionals
meta:
  id: me-you-and-professionals
  title:
    en: "Me, You, and Professionals"
    ja: "私、あなた、そして仕事"
    zh: "我、你與職業"
  description:
    en: "Learn to introduce yourself and discuss jobs."
    ja: "自己紹介や仕事について話す方法を学びましょう。"
    zh: "學習自我介紹和談論職業。"
  icon: "🤝"
  order: 2
  level: beginner

words:
  - id: name
    word:
      en: Name
      ja: 名前
      zh: 名字
    reading: Namae
    phonetic: "/neɪm/"
    description:
      en: "What you call a person."
      ja: "人を呼ぶ時の言葉。"
      zh: "用來稱呼一個人的詞。"
    sentence:
      en: "My name is Tanaka."
      ja: "私の名前は田中です。"
      zh: "我的名字是田中。"

  - id: teacher
    word:
      en: Teacher
      ja: 先生
      zh: 老師
    reading: Sensei
    phonetic: "/ˈtiːtʃər/"
    description:
      en: "A person who teaches students."
      ja: "生徒に教える人。"
      zh: "教導學生的人。"
    sentence:
      en: "Mr. Sato is a teacher."
      ja: "佐藤さんは先生です。"
      zh: "佐藤先生是老師。"

  - id: student
    word:
      en: Student
      ja: 学生
      zh: 學生
    reading: Gakusei
    phonetic: "/ˈstjuːdənt/"
    description:
      en: "A person who studies at school."
      ja: "学校で勉強する人。"
      zh: "在學校學習的人。"
    sentence:
      en: "I am a university student."
      ja: "私は大学生です。"
      zh: "我是大學生。"

  - id: job
    word:
      en: Job
      ja: 仕事
      zh: 工作
    reading: Shigoto
    phonetic: "/dʒɒb/"
    description:
      en: "Work you do for money."
      ja: "お金のためにする労働。"
      zh: "為了賺錢而做的勞動。"
    sentence:
      en: "Do you have a job?"
      ja: "仕事はありますか？"
      zh: "你有工作嗎？"

  - id: doctor
    word:
      en: Doctor
      ja: 医者
      zh: 醫生
    reading: Isha
    phonetic: "/ˈdɒktər/"
    description:
      en: "A person who helps sick people."
      ja: "病気の人を助ける人。"
      zh: "幫助生病的人的人。"
    sentence:
      en: "She is a good doctor."
      ja: "彼女は良い医者です。"
      zh: "她是個好醫生。"

  - id: company
    word:
      en: Company
      ja: 会社
      zh: 公司
    reading: Kaisha
    phonetic: "/ˈkʌmpəni/"
    description:
      en: "A business or organization."
      ja: "ビジネスや組織。"
      zh: "企業或組織。"
    sentence:
      en: "I go to the company."
      ja: "私は会社に行きます。"
      zh: "我去公司。"

chat:
  conversations:
    - id: scenario-1-introduction
      title:
        en: "Self Introduction"
        ja: "自己紹介"
        zh: "自我介紹"
      messages:
        - role: partner
          text:
            en: "Hello. What is your name?"
            ja: "こんにちは。お名前は何ですか？"
            zh: "你好。你叫什麼名字？"
        - role: user
          text:
            en: "My name is Ken."
            ja: "私の名前はケンです。"
            zh: "我的名字是Ken。"
        - role: partner
          text:
            en: "Nice to meet you, Ken."
            ja: "はじめまして、ケンさん。"
            zh: "很高興認識你，Ken。"
        - role: user
          text:
            en: "Are you a student?"
            ja: "あなたは学生ですか？"
            zh: "你是學生嗎？"
        - role: partner
          text:
            en: "No, I am a teacher."
            ja: "いいえ、私は先生です。"
            zh: "不是，我是老師。"
        - role: user
          text:
            en: "Oh, I see."
            ja: "ああ、そうですか。"
            zh: "喔，原來如此。"
        - role: partner
          text:
            en: "Are you a student?"
            ja: "あなたは学生ですか？"
            zh: "你是學生嗎？"
        - role: user
          text:
            en: "Yes, I study English."
            ja: "はい、英語を勉強しています。"
            zh: "是的，我在學英文。"

    - id: scenario-2-talking-about-work
      title:
        en: "Talking About Work"
        ja: "仕事について話す"
        zh: "談論工作"
      messages:
        - role: partner
          text:
            en: "Do you have a job?"
            ja: "仕事はしていますか？"
            zh: "你有工作嗎？"
        - role: user
          text:
            en: "Yes, I work at a company."
            ja: "はい、会社で働いています。"
            zh: "有，我在公司上班。"
        - role: partner
          text:
            en: "Is it a big company?"
            ja: "大きな会社ですか？"
            zh: "是大公司嗎？"
        - role: user
          text:
            en: "No, it is small."
            ja: "いいえ、小さいです。"
            zh: "不是，是小公司。"
        - role: partner
          text:
            en: "Is your father a doctor?"
            ja: "お父さんはお医者さんですか？"
            zh: "你爸爸是醫生嗎？"
        - role: user
          text:
            en: "Yes, he is a doctor."
            ja: "はい、彼は医者です。"
            zh: "是的，他是醫生。"
        - role: partner
          text:
            en: "That is a hard job."
            ja: "それは大変な仕事ですね。"
            zh: "那是很辛苦的工作。"
        - role: user
          text:
            en: "Yes, he is very busy."
            ja: "はい、彼はとても忙しいです。"
            zh: "是的，他非常忙。"

quiz:
  questionsPerRound: 5
  xpReward: 20
`,Eb=`# Chapter: Mixed Practice (Dialogue Flow)
meta:
  id: mixed-practice-dialogue-flow
  title:
    en: "Natural Conversation Practice"
    ja: "自然な会話の練習"
    zh: "自然對話練習"
  description:
    en: "Practice simple interactions for making plans."
    ja: "予定を立てるための簡単なやり取りを練習します。"
    zh: "練習制定計畫的簡單互動。"
  icon: "🗣️"
  order: 6
  level: beginner

words:
  - id: time
    word:
      en: Time
      ja: 時間
      zh: 時間
    reading: Jikan
    phonetic: "/taɪm/"
    description:
      en: "A point or period in the day."
      ja: "1日の中の時点や期間。"
      zh: "一天中的某個時刻或時段。"
    sentence:
      en: "Do you have time?"
      ja: "時間がありますか？"
      zh: "你有時間嗎？"

  - id: meet
    word:
      en: Meet
      ja: 会う
      zh: 見面
    reading: Au
    phonetic: "/miːt/"
    description:
      en: "To see and talk to someone."
      ja: "誰かに会って話すこと。"
      zh: "見到某人並交談。"
    sentence:
      en: "Let's meet today."
      ja: "今日会いましょう。"
      zh: "我們今天見面吧。"

  - id: lunch
    word:
      en: Lunch
      ja: ランチ
      zh: 午餐
    reading: Ranchi
    phonetic: "/lʌntʃ/"
    description:
      en: "The meal eaten in the middle of the day."
      ja: "日中に食べる食事。"
      zh: "中午吃的飯。"
    sentence:
      en: "I eat lunch at noon."
      ja: "私は正午にランチを食べます。"
      zh: "我中午吃午餐。"

  - id: where
    word:
      en: Where
      ja: どこ
      zh: 哪裡
    reading: Doko
    phonetic: "/wɛər/"
    description:
      en: "Used to ask about a place."
      ja: "場所を尋ねるときに使います。"
      zh: "用於詢問地點。"
    sentence:
      en: "Where are you?"
      ja: "どこにいますか？"
      zh: "你在哪裡？"

  - id: station
    word:
      en: Station
      ja: 駅
      zh: 車站
    reading: Eki
    phonetic: "/ˈsteɪʃən/"
    description:
      en: "A place where trains stop."
      ja: "電車が止まる場所。"
      zh: "火車停靠的地方。"
    sentence:
      en: "The station is near."
      ja: "駅は近いです。"
      zh: "車站很近。"

  - id: busy
    word:
      en: Busy
      ja: 忙しい
      zh: 忙
    reading: Isogashii
    phonetic: "/ˈbɪzi/"
    description:
      en: "Having a lot to do."
      ja: "やることがたくさんあること。"
      zh: "有很多事情要做。"
    sentence:
      en: "I am very busy."
      ja: "私はとても忙しいです。"
      zh: "我很忙。"

chat:
  conversations:
    - id: scenario-1-making-plans
      title:
        en: "Making a Plan"
        ja: "予定を立てる"
        zh: "制定計畫"
      messages:
        - role: partner
          text:
            en: "Do you have time today?"
            ja: "今日、時間がありますか？"
            zh: "你今天有時間嗎？"
        - role: user
          text:
            en: "Yes, I am free."
            ja: "はい、暇です。"
            zh: "是的，我有空。"
        - role: partner
          text:
            en: "Let's meet for lunch."
            ja: "ランチに会いましょう。"
            zh: "我們見面吃午餐吧。"
        - role: user
          text:
            en: "That sounds good."
            ja: "それはいいですね。"
            zh: "聽起來不錯。"
        - role: partner
          text:
            en: "Where do you want to go?"
            ja: "どこに行きたいですか？"
            zh: "你想去哪裡？"
        - role: user
          text:
            en: "I like the burger shop."
            ja: "ハンバーガー屋が好きです。"
            zh: "我喜歡那家漢堡店。"
        - role: partner
          text:
            en: "Okay, let's go there."
            ja: "わかりました、そこに行きましょう。"
            zh: "好，我們去那裡。"
        - role: user
          text:
            en: "See you soon."
            ja: "またね。"
            zh: "待會見。"

    - id: scenario-2-setting-details
      title:
        en: "Setting Details"
        ja: "詳細を決める"
        zh: "決定細節"
      messages:
        - role: partner
          text:
            en: "Are you busy now?"
            ja: "今、忙しいですか？"
            zh: "你現在忙嗎？"
        - role: user
          text:
            en: "No, I am ready."
            ja: "いいえ、準備できました。"
            zh: "不，我準備好了。"
        - role: partner
          text:
            en: "Let's meet at the station."
            ja: "駅で会いましょう。"
            zh: "我們在車站見。"
        - role: user
          text:
            en: "Which station?"
            ja: "どの駅ですか？"
            zh: "哪個車站？"
        - role: partner
          text:
            en: "Tokyo Station, North Exit."
            ja: "東京駅の北口です。"
            zh: "東京車站北出口。"
        - role: user
          text:
            en: "Okay, what time?"
            ja: "わかりました、何時ですか？"
            zh: "好，幾點？"
        - role: partner
          text:
            en: "Is 12:00 okay?"
            ja: "12時は大丈夫ですか？"
            zh: "12點可以嗎？"
        - role: user
          text:
            en: "Yes, 12:00 is perfect."
            ja: "はい、12時で完璧です。"
            zh: "可以，12點很完美。"

quiz:
  questionsPerRound: 5
  xpReward: 20`,Lb=`# Chapter: The Negative (Not X)
meta:
  id: negative-not-x
  title:
    en: "The Negative (Not X)"
    ja: "否定形（Xではありません）"
    zh: "否定句 (不是 X)"
  description:
    en: "Learn how to say what something is not."
    ja: "何かがそうではないと言う方法を学びましょう。"
    zh: "學習如何表達「不是...」。"
  icon: "🙅"
  order: 5
  level: beginner

words:
  - id: doctor
    word:
      en: Doctor
      ja: 医者
      zh: 醫生
    reading: Isha
    phonetic: "/ˈdɒktər/"
    description:
      en: "A person who helps sick people."
      ja: "病気の人を助ける人。"
      zh: "幫助病人的人。"
    sentence:
      en: "I am not a doctor."
      ja: "私は医者ではありません。"
      zh: "我不是醫生。"

  - id: teacher
    word:
      en: Teacher
      ja: 先生
      zh: 老師
    reading: Sensei
    phonetic: "/ˈtiːtʃər/"
    description:
      en: "A person who teaches students."
      ja: "学生に教える人。"
      zh: "教導學生的人。"
    sentence:
      en: "He is not a teacher."
      ja: "彼は先生ではありません。"
      zh: "他不是老師。"

  - id: cat
    word:
      en: Cat
      ja: 猫
      zh: 貓
    reading: Neko
    phonetic: "/kæt/"
    description:
      en: "A small animal that says meow."
      ja: "ニャーと鳴く小さな動物。"
      zh: "會喵喵叫的小動物。"
    sentence:
      en: "It is not a cat."
      ja: "それは猫ではありません。"
      zh: "那不是貓。"

  - id: dog
    word:
      en: Dog
      ja: 犬
      zh: 狗
    reading: Inu
    phonetic: "/dɔːg/"
    description:
      en: "An animal that barks."
      ja: "吠える動物。"
      zh: "會吠叫的動物。"
    sentence:
      en: "That is not a dog."
      ja: "あれは犬ではありません。"
      zh: "那不是狗。"

  - id: book
    word:
      en: Book
      ja: 本
      zh: 書
    reading: Hon
    phonetic: "/bʊk/"
    description:
      en: "Something you read."
      ja: "読むもの。"
      zh: "用來閱讀的東西。"
    sentence:
      en: "This is not a book."
      ja: "これは本ではありません。"
      zh: "這不是書。"

  - id: pen
    word:
      en: Pen
      ja: ペン
      zh: 筆
    reading: Pen
    phonetic: "/pɛn/"
    description:
      en: "Something used to write."
      ja: "書くために使うもの。"
      zh: "用來書寫的東西。"
    sentence:
      en: "It is not a pen."
      ja: "それはペンではありません。"
      zh: "那不是筆。"

chat:
  conversations:
    - id: scenario-1-guessing-profession
      title:
        en: "Guessing the Job"
        ja: "仕事を推測する"
        zh: "猜測職業"
      messages:
        - role: partner
          text:
            en: "Is he a doctor?"
            ja: "彼は医者ですか？"
            zh: "他是醫生嗎？"
        - role: user
          text:
            en: "No, he is not a doctor."
            ja: "いいえ、彼は医者ではありません。"
            zh: "不，他不是醫生。"
        - role: partner
          text:
            en: "Is he a teacher?"
            ja: "彼は先生ですか？"
            zh: "他是老師嗎？"
        - role: user
          text:
            en: "No, he is not a teacher."
            ja: "いいえ、彼は先生ではありません。"
            zh: "不，他不是老師。"
        - role: partner
          text:
            en: "Who is he?"
            ja: "彼は誰ですか？"
            zh: "他是誰？"
        - role: user
          text:
            en: "He is a student."
            ja: "彼は学生です。"
            zh: "他是學生。"
        - role: partner
          text:
            en: "Oh, I see."
            ja: "あ、そうですか。"
            zh: "喔，我了解了。"
        - role: user
          text:
            en: "He is my friend."
            ja: "彼は私の友達です。"
            zh: "他是我的朋友。"

    - id: scenario-2-identifying-objects
      title:
        en: "What is this?"
        ja: "これは何ですか？"
        zh: "這是什麼？"
      messages:
        - role: partner
          text:
            en: "Is this a cat?"
            ja: "これは猫ですか？"
            zh: "這是貓嗎？"
        - role: user
          text:
            en: "No, it is not a cat."
            ja: "いいえ、それは猫ではありません。"
            zh: "不，那不是貓。"
        - role: partner
          text:
            en: "Is it a dog?"
            ja: "それは犬ですか？"
            zh: "那是狗嗎？"
        - role: user
          text:
            en: "No, it is not a dog."
            ja: "いいえ、それは犬ではありません。"
            zh: "不，那不是狗。"
        - role: partner
          text:
            en: "What is it?"
            ja: "それは何ですか？"
            zh: "那是什麼？"
        - role: user
          text:
            en: "It is a fox."
            ja: "それはキツネです。"
            zh: "那是狐狸。"
        - role: partner
          text:
            en: "Is that a pen?"
            ja: "あれはペンですか？"
            zh: "那是筆嗎？"
        - role: user
          text:
            en: "No, that is not a pen."
            ja: "いいえ、あれはペンではありません。"
            zh: "不，那不是筆。"
        - role: partner
          text:
            en: "Is it a book?"
            ja: "それは本ですか？"
            zh: "那是書嗎？"
        - role: user
          text:
            en: "Yes, it is a book."
            ja: "はい、それは本です。"
            zh: "是的，那是書。"

quiz:
  questionsPerRound: 5
  xpReward: 20`,Pb=`# Chapter: Shadowing (Speed & Rhythm)
# Focus: Repeat these rapidly without pausing.
meta:
  id: shadowing-speed-rhythm
  title:
    en: "Shadowing: Speed & Rhythm"
    ja: "シャドーイング：スピードとリズム"
    zh: "跟讀練習：速度與節奏"
  description:
    en: "Practice speaking quickly and smoothly."
    ja: "速く、スムーズに話す練習をしましょう。"
    zh: "練習快速且流暢地說話。"
  icon: "⚡"
  order: 7
  level: beginner

words:
  - id: hurry
    word:
      en: Hurry
      ja: 急ぐ
      zh: 快點
    reading: Isogu
    phonetic: "/ˈhʌri/"
    description:
      en: "To move or act quickly."
      ja: "速く動いたり行動したりすること。"
      zh: "迅速移動或行動。"
    sentence:
      en: "Please hurry up."
      ja: "急いでください。"
      zh: "請快一點。"

  - id: fast
    word:
      en: Fast
      ja: 速い
      zh: 快
    reading: Hayai
    phonetic: "/fæst/"
    description:
      en: "Moving with high speed."
      ja: "スピードが速いこと。"
      zh: "速度很快。"
    sentence:
      en: "He runs very fast."
      ja: "彼はとても速く走ります。"
      zh: "他跑得很快。"

  - id: late
    word:
      en: Late
      ja: 遅刻
      zh: 遲到
    reading: Chikoku
    phonetic: "/leɪt/"
    description:
      en: "Not on time."
      ja: "時間通りではないこと。"
      zh: "沒有準時。"
    sentence:
      en: "We are late for school."
      ja: "私たちは学校に遅刻です。"
      zh: "我們上學遲到了。"

  - id: ready
    word:
      en: Ready
      ja: 準備完了
      zh: 準備好
    reading: Junbi kanryou
    phonetic: "/ˈrɛdi/"
    description:
      en: "Prepared to do something."
      ja: "何かをする準備ができていること。"
      zh: "準備好做某事。"
    sentence:
      en: "Are you ready to go?"
      ja: "行く準備はできましたか？"
      zh: "你準備好要走了嗎？"

  - id: wait
    word:
      en: Wait
      ja: 待つ
      zh: 等
    reading: Matsu
    phonetic: "/weɪt/"
    description:
      en: "To stay in one place."
      ja: "一箇所に留まること。"
      zh: "留在一個地方。"
    sentence:
      en: "Wait for me here."
      ja: "ここで私を待ってください。"
      zh: "在這裡等我。"

  - id: go
    word:
      en: Go
      ja: 行く
      zh: 走
    reading: Iku
    phonetic: "/ɡoʊ/"
    description:
      en: "To move to another place."
      ja: "別の場所に移動すること。"
      zh: "移動到另一個地方。"
    sentence:
      en: "Let's go now."
      ja: "今行きましょう。"
      zh: "我們現在走吧。"

chat:
  conversations:
    - id: scenario-1-rushing
      title:
        en: "Rushing to the Bus"
        ja: "バスに急ぐ"
        zh: "趕公車"
      messages:
        - role: partner
          text:
            en: "Hurry up! We are late."
            ja: "急いで！遅刻しちゃうよ。"
            zh: "快一點！我們要遲到了。"
        - role: user
          text:
            en: "I am coming fast."
            ja: "急いで行きます。"
            zh: "我很快就來。"
        - role: partner
          text:
            en: "The bus leaves now."
            ja: "バスがもう出るよ。"
            zh: "公車現在要開了。"
        - role: user
          text:
            en: "Wait! Do not go."
            ja: "待って！行かないで。"
            zh: "等一下！別走。"
        - role: partner
          text:
            en: "Run fast! It is here."
            ja: "速く走って！ここだよ。"
            zh: "快跑！在這裡。"
        - role: user
          text:
            en: "I run very fast."
            ja: "私はとても速く走っています。"
            zh: "我跑得很快。"
        - role: partner
          text:
            en: "Good. Let's go in."
            ja: "よし。入ろう。"
            zh: "好，我們進去吧。"
        - role: user
          text:
            en: "Okay, I am safe."
            ja: "よし、セーフだ。"
            zh: "好了，我趕上了。"

    - id: scenario-2-getting-ready
      title:
        en: "Are You Ready?"
        ja: "準備はいい？"
        zh: "你準備好了嗎？"
      messages:
        - role: partner
          text:
            en: "Are you ready?"
            ja: "準備はいい？"
            zh: "你準備好了嗎？"
        - role: user
          text:
            en: "No, please wait."
            ja: "いいえ、待ってください。"
            zh: "還沒，請等一下。"
        - role: partner
          text:
            en: "Why? We are late."
            ja: "なんで？遅れちゃうよ。"
            zh: "為什麼？我們要遲到了。"
        - role: user
          text:
            en: "I cannot find my bag."
            ja: "鞄が見つかりません。"
            zh: "我找不到我的包包。"
        - role: partner
          text:
            en: "Hurry, please."
            ja: "急いで、お願い。"
            zh: "拜託快一點。"
        - role: user
          text:
            en: "Okay, I am ready now."
            ja: "よし、準備できました。"
            zh: "好了，我準備好了。"
        - role: partner
          text:
            en: "Let's go fast."
            ja: "速く行こう。"
            zh: "我們快走吧。"
        - role: user
          text:
            en: "Yes, let's go."
            ja: "はい、行きましょう。"
            zh: "好，走吧。"

quiz:
  questionsPerRound: 5
  xpReward: 20`,Nb=`# Chapter: Stating Facts
meta:
  id: stating-facts
  title:
    en: "Stating Facts"
    ja: "事実を述べる"
    zh: "陳述事實"
  description:
    en: "Learn how to describe things and state simple facts."
    ja: "物事を説明し、簡単な事実を述べる方法を学びましょう。"
    zh: "學習如何描述事物並陳述簡單的事實。"
  icon: "☝️"
  order: 3
  level: beginner

words:
  - id: weather
    word:
      en: Weather
      ja: 天気
      zh: 天氣
    reading: Tenki
    phonetic: "/ˈwɛðər/"
    description:
      en: "The state of the atmosphere (sun, rain, wind)."
      ja: "大気の状態（晴れ、雨、風など）。"
      zh: "大氣的狀態（陽光、雨、風）。"
    sentence:
      en: "The weather is nice."
      ja: "天気が良いです。"
      zh: "天氣很好。"

  - id: cold
    word:
      en: Cold
      ja: 寒い
      zh: 冷
    reading: Samui
    phonetic: "/koʊld/"
    description:
      en: "Having a low temperature."
      ja: "気温が低いこと。"
      zh: "溫度很低。"
    sentence:
      en: "The water is cold."
      ja: "水が冷たいです。"
      zh: "水很冷。"

  - id: true
    word:
      en: True
      ja: 本当
      zh: 真的
    reading: Hontou
    phonetic: "/truː/"
    description:
      en: "Based on facts; not false."
      ja: "事実に基づいていること。嘘ではないこと。"
      zh: "基於事實；不是假的。"
    sentence:
      en: "That is not true."
      ja: "それは本当ではありません。"
      zh: "那不是真的。"

  - id: time
    word:
      en: Time
      ja: 時間
      zh: 時間
    reading: Jikan
    phonetic: "/taɪm/"
    description:
      en: "What is measured in minutes and hours."
      ja: "分や時間で測られるもの。"
      zh: "以分和小時計算的概念。"
    sentence:
      en: "Do you have time?"
      ja: "時間はありますか？"
      zh: "你有時間嗎？"

  - id: open
    word:
      en: Open
      ja: 開いている
      zh: 開著
    reading: Aiteiru
    phonetic: "/ˈoʊpən/"
    description:
      en: "Not closed; allowing entry."
      ja: "閉まっていないこと。入れる状態。"
      zh: "沒關；允許進入。"
    sentence:
      en: "The store is open."
      ja: "店は開いています。"
      zh: "商店開著。"

  - id: expensive
    word:
      en: Expensive
      ja: 高い
      zh: 貴
    reading: Takai
    phonetic: "/ɪkˈspɛnsɪv/"
    description:
      en: "Costing a lot of money."
      ja: "多くのお金がかかること。"
      zh: "花費很多錢。"
    sentence:
      en: "This car is expensive."
      ja: "この車は高いです。"
      zh: "這輛車很貴。"

chat:
  conversations:
    - id: scenario-1-outside
      title:
        en: "Outside Today"
        ja: "今日の外"
        zh: "今天的戶外"
      messages:
        - role: partner
          text:
            en: "Look at the weather."
            ja: "天気を見てください。"
            zh: "看看這個天氣。"
        - role: user
          text:
            en: "Yes, it is very cold."
            ja: "はい、とても寒いです。"
            zh: "對，非常冷。"
        - role: partner
          text:
            en: "What time is it now?"
            ja: "今、何時ですか？"
            zh: "現在幾點了？"
        - role: user
          text:
            en: "It is five o'clock."
            ja: "5時です。"
            zh: "現在五點。"
        - role: partner
          text:
            en: "It gets dark fast."
            ja: "暗くなるのが早いです。"
            zh: "天黑得很快。"
        - role: user
          text:
            en: "That is true."
            ja: "それは本当です。"
            zh: "那是真的。"
        - role: partner
          text:
            en: "Let's go inside."
            ja: "中に入りましょう。"
            zh: "我們進去吧。"
        - role: user
          text:
            en: "Good idea."
            ja: "いい考えです。"
            zh: "好主意。"

    - id: scenario-2-shopping
      title:
        en: "At the Shop"
        ja: "お店で"
        zh: "在商店"
      messages:
        - role: partner
          text:
            en: "Is the shop open?"
            ja: "店は開いていますか？"
            zh: "商店有開嗎？"
        - role: user
          text:
            en: "Yes, the door is open."
            ja: "はい、ドアが開いています。"
            zh: "有，門是開著的。"
        - role: partner
          text:
            en: "Look at this red bag."
            ja: "この赤い鞄を見てください。"
            zh: "看這個紅色的包包。"
        - role: user
          text:
            en: "It is very nice."
            ja: "とても素敵です。"
            zh: "非常漂亮。"
        - role: partner
          text:
            en: "But it is expensive."
            ja: "でも、高いです。"
            zh: "但是它很貴。"
        - role: user
          text:
            en: "How much is it?"
            ja: "いくらですか？"
            zh: "多少錢？"
        - role: partner
          text:
            en: "It costs 200 dollars."
            ja: "200ドルします。"
            zh: "它要兩百元。"
        - role: user
          text:
            en: "We cannot buy it."
            ja: "私たちは買えません。"
            zh: "我們買不起。"

quiz:
  questionsPerRound: 5
  xpReward: 20`,Mb=`# Chapter: Yes / No Questions
# Focus: Notice the "ka" sound at the end makes it a question.
meta:
  id: yes-no-questions
  title:
    en: "Yes / No Questions"
    ja: "「はい」か「いいえ」の質問"
    zh: "是非問句"
  description:
    en: "Learn how to ask questions using 'ka'."
    ja: "「か」を使って質問する方法を学びましょう。"
    zh: "學習如何使用「ka」來提問。"
  icon: "❓"
  order: 4
  level: beginner

words:
  - id: yes
    word:
      en: Yes
      ja: はい
      zh: 是
    reading: Hai
    phonetic: "/haɪ/"
    description:
      en: "Used to agree or answer positively."
      ja: "同意したり、肯定的に答える時に使います。"
      zh: "用於同意或肯定回答。"
    sentence:
      en: "Yes, that is correct."
      ja: "はい、それは正しいです。"
      zh: "是的，那是對的。"

  - id: no
    word:
      en: No
      ja: いいえ
      zh: 不
    reading: Iie
    phonetic: "/iːe/"
    description:
      en: "Used to disagree or answer negatively."
      ja: "同意しない、または否定的に答える時に使います。"
      zh: "用於不同意或否定回答。"
    sentence:
      en: "No, I am not a student."
      ja: "いいえ、私は学生ではありません。"
      zh: "不，我不是學生。"

  - id: understand
    word:
      en: Understand
      ja: 分かります
      zh: 明白
    reading: Wakarimasu
    phonetic: "/wɑːkɑːriːmɑːsuː/"
    description:
      en: "To know the meaning of something."
      ja: "何かの意味を知ること。"
      zh: "知道某事的含义。"
    sentence:
      en: "Do you understand Japanese?"
      ja: "日本語が分かりますか？"
      zh: "你懂日語嗎？"

  - id: like
    word:
      en: Like
      ja: 好き
      zh: 喜歡
    reading: Suki
    phonetic: "/skiː/"
    description:
      en: "To find something agreeable or enjoyable."
      ja: "何かを好ましい、楽しいと感じること。"
      zh: "覺得某事物令人愉快或喜愛。"
    sentence:
      en: "I like sushi."
      ja: "私は寿司が好きです。"
      zh: "我喜歡壽司。"

  - id: eat
    word:
      en: Eat
      ja: 食べます
      zh: 吃
    reading: Tabemasu
    phonetic: "/tɑːbeɪmɑːsuː/"
    description:
      en: "To consume food."
      ja: "食べ物を摂取すること。"
      zh: "食用食物。"
    sentence:
      en: "I eat breakfast everyday."
      ja: "私は毎日朝食を食べます。"
      zh: "我每天吃早餐。"

  - id: book
    word:
      en: Book
      ja: 本
      zh: 書
    reading: Hon
    phonetic: "/hɒn/"
    description:
      en: "A set of pages with writing."
      ja: "文字が書かれたページの集まり。"
      zh: "有文字的頁面集合。"
    sentence:
      en: "Is this a book?"
      ja: "これは本ですか？"
      zh: "這是一本書嗎？"

chat:
  conversations:
    - id: scenario-1-asking-preferences
      title:
        en: "Asking Preferences"
        ja: "好みを尋ねる"
        zh: "詢問喜好"
      messages:
        - role: partner
          text:
            en: "Do you like sushi?"
            ja: "寿司が好きですか？"
            zh: "你喜歡壽司嗎？"
        - role: user
          text:
            en: "Yes, I like it."
            ja: "はい、好きです。"
            zh: "是的，我喜歡。"
        - role: partner
          text:
            en: "Do you eat fish?"
            ja: "魚を食べますか？"
            zh: "你吃魚嗎？"
        - role: user
          text:
            en: "No, I do not eat it."
            ja: "いいえ、食べません。"
            zh: "不，我不吃。"
        - role: partner
          text:
            en: "Do you eat meat?"
            ja: "肉を食べますか？"
            zh: "你吃肉嗎？"
        - role: user
          text:
            en: "Yes, I eat meat."
            ja: "はい、肉を食べます。"
            zh: "是的，我吃肉。"
        - role: partner
          text:
            en: "Is it delicious?"
            ja: "おいしいですか？"
            zh: "好吃嗎？"
        - role: user
          text:
            en: "Yes, it is delicious."
            ja: "はい、おいしいです。"
            zh: "是的，很好吃。"

    - id: scenario-2-understanding-objects
      title:
        en: "Checking Understanding"
        ja: "理解を確認する"
        zh: "確認理解"
      messages:
        - role: partner
          text:
            en: "Do you understand Japanese?"
            ja: "日本語が分かりますか？"
            zh: "你懂日語嗎？"
        - role: user
          text:
            en: "No, I do not understand."
            ja: "いいえ、分かりません。"
            zh: "不，我不懂。"
        - role: partner
          text:
            en: "Is this a book?"
            ja: "これは本ですか？"
            zh: "這是一本書嗎？"
        - role: user
          text:
            en: "Yes, that is a book."
            ja: "はい、それは本です。"
            zh: "是的，那是一本書。"
        - role: partner
          text:
            en: "Do you like books?"
            ja: "本が好きですか？"
            zh: "你喜歡書嗎？"
        - role: user
          text:
            en: "Yes, I like books."
            ja: "はい、本が好きです。"
            zh: "是的，我喜歡書。"
        - role: partner
          text:
            en: "Do you read everyday?"
            ja: "毎日読みますか？"
            zh: "你每天讀書嗎？"
        - role: user
          text:
            en: "No, not everyday."
            ja: "いいえ、毎日ではありません。"
            zh: "不，不是每天。"

quiz:
  questionsPerRound: 5
  xpReward: 20`,Ob=`# Chapter: Discussing Movies

meta:
  id: discussing-movies
  title:
    en: "Discussing Movies"
    ja: "映画について語る"
  description:
    en: "Share your opinions on films, acting, and storylines."
    ja: "映画、演技、ストーリーについての意見を共有しましょう。"
  icon: "🎬"
  order: 3
  level: intermediate

words:
  - id: plot
    word:
      en: Plot
      ja: あらすじ
    reading: Arasuji
    phonetic: "/plɒt/"
    description:
      en: "The main events of a play, novel, or movie."
      ja: "劇、小説、または映画の主な出来事や筋書き。"
    sentence:
      en: "The plot was complex, but I understood the main idea."
      ja: "あらすじは複雑でしたが、要点は理解できました。"

  - id: performance
    word:
      en: Performance
      ja: 演技
    reading: Engi
    phonetic: "/pəˈfɔːməns/"
    description:
      en: "How well an actor plays their role in the film."
      ja: "俳優が映画の中でどれだけうまく役を演じているか。"
    sentence:
      en: "I thought the main actor's performance was incredibly moving."
      ja: "主演俳優の演技は信じられないほど感動的だと思いました。"

  - id: soundtrack
    word:
      en: Soundtrack
      ja: サウンドトラック
    reading: Saundotorakku
    phonetic: "/ˈsaʊndtræk/"
    description:
      en: "The music that is recorded for a movie."
      ja: "映画のために録音された音楽。"
    sentence:
      en: "This movie features a soundtrack that was composed by a famous artist."
      ja: "この映画は、有名なアーティストが作曲したサウンドトラックを特徴としています。"

  - id: genre
    word:
      en: Genre
      ja: ジャンル
    reading: Janru
    phonetic: "/ˈʒɒnrə/"
    description:
      en: "A category of artistic composition, like comedy or horror."
      ja: "コメディやホラーのような芸術作品のカテゴリー。"
    sentence:
      en: "I usually prefer action, but this romance genre is interesting."
      ja: "私は普段アクションを好みますが、この恋愛ジャンルは面白いです。"

  - id: recommend
    word:
      en: Recommend
      ja: 勧める
    reading: Susumeru
    phonetic: "/ˌrɛkəˈmɛnd/"
    description:
      en: "To suggest that something is good or suitable."
      ja: "何かが良い、または適していると提案すること。"
    sentence:
      en: "I have recommended this film to everyone who likes history."
      ja: "私は歴史が好きな人全員にこの映画を勧めました。"

  - id: disappointing
    word:
      en: Disappointing
      ja: 残念な
    reading: Zannen na
    phonetic: "/ˌdɪsəˈpɔɪntɪŋ/"
    description:
      en: "Failing to fulfill someone's hopes or expectations."
      ja: "誰かの希望や期待を満たせなかったこと。"
    sentence:
      en: "The ending was a bit disappointing because it felt unresolved."
      ja: "結末は未解決な感じがして、少し残念でした。"

chat:
  conversations:
    - id: scenario-1-post-movie-thoughts
      title:
        en: "Post-Movie Thoughts"
        ja: "映画を見終わった後の感想"
      messages:
        - role: partner
          text:
            en: "Have you ever seen a movie with such an intense ending before?"
            ja: "これほど強烈な結末の映画を、今までに見たことがありますか？"
        - role: user
          text:
            en: "No, I haven't. The plot twists really surprised me until the very end."
            ja: "いいえ、ありません。あらすじの展開には最後まで本当に驚かされました。"
        - role: partner
          text:
            en: "I agree, although I felt the lead actor's performance was slightly exaggerated."
            ja: "同感ですが、主演俳優の演技は少し大げさだと感じました。"
        - role: user
          text:
            en: "Really? I actually thought his emotional acting was the best part."
            ja: "そうですか？私はむしろ、彼の感情的な演技が一番良かったと思いました。"
        - role: partner
          text:
            en: "Well, at least the soundtrack that played during the final scene was beautiful."
            ja: "まあ、少なくとも最後のシーンで流れたサウンドトラックは美しかったです。"
        - role: user
          text:
            en: "Yes, the music perfectly matched the mysterious mood of the scene."
            ja: "はい、音楽はそのシーンの神秘的な雰囲気に完璧に合っていました。"
        - role: partner
          text:
            en: "I am glad we decided to watch this drama genre today."
            ja: "今日はこのドラマジャンルを見ることに決めてよかったです。"
        - role: user
          text:
            en: "Me too. It has been a long time since I enjoyed a film this much."
            ja: "私もです。これほど映画を楽しめたのは久しぶりです。"

    - id: scenario-2-sharing-recommendations
      title:
        en: "Sharing Recommendations"
        ja: "おすすめを共有する"
      messages:
        - role: partner
          text:
            en: "Since you liked that movie, would you recommend it to my brother?"
            ja: "あの映画が気に入ったのなら、私の兄にも勧めますか？"
        - role: user
          text:
            en: "Yes, I have already sent him a message telling him to watch it."
            ja: "はい、もう彼に「見るように」とメッセージを送りました。"
        - role: partner
          text:
            en: "He often finds slow movies disappointing, so I was worried he might get bored."
            ja: "彼はよく遅い展開の映画を残念に思うので、退屈しないか心配でした。"
        - role: user
          text:
            en: "Even if it is slow, the story is compelling enough to keep his attention."
            ja: "たとえ展開が遅くても、物語は彼の注意を引くのに十分魅力的です。"
        - role: partner
          text:
            en: "That is good to know. By the way, have you heard about the sequel?"
            ja: "それは良かったです。ところで、続編について聞いたことはありますか？"
        - role: user
          text:
            en: "I have heard rumors, but I don't know if they have started filming yet."
            ja: "噂は聞いていますが、まだ撮影が始まったかどうかは知りません。"
        - role: partner
          text:
            en: "If the original cast returns, I will definitely buy tickets immediately."
            ja: "もしオリジナルのキャストが戻ってくるなら、私は間違いなくすぐにチケットを買います。"
        - role: user
          text:
            en: "Let's hope the sequel lives up to the high standards of the first one."
            ja: "続編が１作目の高い基準に応えてくれることを期待しましょう。"

quiz:
  questionsPerRound: 5
  xpReward: 20
`;function Xc(e){return typeof e>"u"||e===null}function Rb(e){return typeof e=="object"&&e!==null}function $b(e){return Array.isArray(e)?e:Xc(e)?[]:[e]}function Db(e,n){var t,r,a,o;if(n)for(o=Object.keys(n),t=0,r=o.length;t<r;t+=1)a=o[t],e[a]=n[a];return e}function Fb(e,n){var t="",r;for(r=0;r<n;r+=1)t+=e;return t}function Wb(e){return e===0&&Number.NEGATIVE_INFINITY===1/e}var Hb=Xc,Ub=Rb,Yb=$b,Bb=Fb,qb=Wb,Vb=Db,Ne={isNothing:Hb,isObject:Ub,toArray:Yb,repeat:Bb,isNegativeZero:qb,extend:Vb};function Jc(e,n){var t="",r=e.reason||"(unknown reason)";return e.mark?(e.mark.name&&(t+='in "'+e.mark.name+'" '),t+="("+(e.mark.line+1)+":"+(e.mark.column+1)+")",!n&&e.mark.snippet&&(t+=`

`+e.mark.snippet),r+" "+t):r}function kr(e,n){Error.call(this),this.name="YAMLException",this.reason=e,this.mark=n,this.message=Jc(this,!1),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=new Error().stack||""}kr.prototype=Object.create(Error.prototype);kr.prototype.constructor=kr;kr.prototype.toString=function(n){return this.name+": "+Jc(this,n)};var Ge=kr;function no(e,n,t,r,a){var o="",i="",s=Math.floor(a/2)-1;return r-n>s&&(o=" ... ",n=r-s+o.length),t-r>s&&(i=" ...",t=r+s-i.length),{str:o+e.slice(n,t).replace(/\t/g,"→")+i,pos:r-n+o.length}}function to(e,n){return Ne.repeat(" ",n-e.length)+e}function Kb(e,n){if(n=Object.create(n||null),!e.buffer)return null;n.maxLength||(n.maxLength=79),typeof n.indent!="number"&&(n.indent=1),typeof n.linesBefore!="number"&&(n.linesBefore=3),typeof n.linesAfter!="number"&&(n.linesAfter=2);for(var t=/\r?\n|\r|\0/g,r=[0],a=[],o,i=-1;o=t.exec(e.buffer);)a.push(o.index),r.push(o.index+o[0].length),e.position<=o.index&&i<0&&(i=r.length-2);i<0&&(i=r.length-1);var s="",l,c,d=Math.min(e.line+n.linesAfter,a.length).toString().length,h=n.maxLength-(n.indent+d+3);for(l=1;l<=n.linesBefore&&!(i-l<0);l++)c=no(e.buffer,r[i-l],a[i-l],e.position-(r[i]-r[i-l]),h),s=Ne.repeat(" ",n.indent)+to((e.line-l+1).toString(),d)+" | "+c.str+`
`+s;for(c=no(e.buffer,r[i],a[i],e.position,h),s+=Ne.repeat(" ",n.indent)+to((e.line+1).toString(),d)+" | "+c.str+`
`,s+=Ne.repeat("-",n.indent+d+3+c.pos)+`^
`,l=1;l<=n.linesAfter&&!(i+l>=a.length);l++)c=no(e.buffer,r[i+l],a[i+l],e.position-(r[i]-r[i+l]),h),s+=Ne.repeat(" ",n.indent)+to((e.line+l+1).toString(),d)+" | "+c.str+`
`;return s.replace(/\n$/,"")}var Gb=Kb,Xb=["kind","multi","resolve","construct","instanceOf","predicate","represent","representName","defaultStyle","styleAliases"],Jb=["scalar","sequence","mapping"];function Qb(e){var n={};return e!==null&&Object.keys(e).forEach(function(t){e[t].forEach(function(r){n[String(r)]=t})}),n}function Zb(e,n){if(n=n||{},Object.keys(n).forEach(function(t){if(Xb.indexOf(t)===-1)throw new Ge('Unknown option "'+t+'" is met in definition of "'+e+'" YAML type.')}),this.options=n,this.tag=e,this.kind=n.kind||null,this.resolve=n.resolve||function(){return!0},this.construct=n.construct||function(t){return t},this.instanceOf=n.instanceOf||null,this.predicate=n.predicate||null,this.represent=n.represent||null,this.representName=n.representName||null,this.defaultStyle=n.defaultStyle||null,this.multi=n.multi||!1,this.styleAliases=Qb(n.styleAliases||null),Jb.indexOf(this.kind)===-1)throw new Ge('Unknown kind "'+this.kind+'" is specified for "'+e+'" YAML type.')}var Fe=Zb;function qs(e,n){var t=[];return e[n].forEach(function(r){var a=t.length;t.forEach(function(o,i){o.tag===r.tag&&o.kind===r.kind&&o.multi===r.multi&&(a=i)}),t[a]=r}),t}function e0(){var e={scalar:{},sequence:{},mapping:{},fallback:{},multi:{scalar:[],sequence:[],mapping:[],fallback:[]}},n,t;function r(a){a.multi?(e.multi[a.kind].push(a),e.multi.fallback.push(a)):e[a.kind][a.tag]=e.fallback[a.tag]=a}for(n=0,t=arguments.length;n<t;n+=1)arguments[n].forEach(r);return e}function Eo(e){return this.extend(e)}Eo.prototype.extend=function(n){var t=[],r=[];if(n instanceof Fe)r.push(n);else if(Array.isArray(n))r=r.concat(n);else if(n&&(Array.isArray(n.implicit)||Array.isArray(n.explicit)))n.implicit&&(t=t.concat(n.implicit)),n.explicit&&(r=r.concat(n.explicit));else throw new Ge("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");t.forEach(function(o){if(!(o instanceof Fe))throw new Ge("Specified list of YAML types (or a single Type object) contains a non-Type object.");if(o.loadKind&&o.loadKind!=="scalar")throw new Ge("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");if(o.multi)throw new Ge("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.")}),r.forEach(function(o){if(!(o instanceof Fe))throw new Ge("Specified list of YAML types (or a single Type object) contains a non-Type object.")});var a=Object.create(Eo.prototype);return a.implicit=(this.implicit||[]).concat(t),a.explicit=(this.explicit||[]).concat(r),a.compiledImplicit=qs(a,"implicit"),a.compiledExplicit=qs(a,"explicit"),a.compiledTypeMap=e0(a.compiledImplicit,a.compiledExplicit),a};var Qc=Eo,Zc=new Fe("tag:yaml.org,2002:str",{kind:"scalar",construct:function(e){return e!==null?e:""}}),eu=new Fe("tag:yaml.org,2002:seq",{kind:"sequence",construct:function(e){return e!==null?e:[]}}),nu=new Fe("tag:yaml.org,2002:map",{kind:"mapping",construct:function(e){return e!==null?e:{}}}),tu=new Qc({explicit:[Zc,eu,nu]});function n0(e){if(e===null)return!0;var n=e.length;return n===1&&e==="~"||n===4&&(e==="null"||e==="Null"||e==="NULL")}function t0(){return null}function r0(e){return e===null}var ru=new Fe("tag:yaml.org,2002:null",{kind:"scalar",resolve:n0,construct:t0,predicate:r0,represent:{canonical:function(){return"~"},lowercase:function(){return"null"},uppercase:function(){return"NULL"},camelcase:function(){return"Null"},empty:function(){return""}},defaultStyle:"lowercase"});function a0(e){if(e===null)return!1;var n=e.length;return n===4&&(e==="true"||e==="True"||e==="TRUE")||n===5&&(e==="false"||e==="False"||e==="FALSE")}function o0(e){return e==="true"||e==="True"||e==="TRUE"}function i0(e){return Object.prototype.toString.call(e)==="[object Boolean]"}var au=new Fe("tag:yaml.org,2002:bool",{kind:"scalar",resolve:a0,construct:o0,predicate:i0,represent:{lowercase:function(e){return e?"true":"false"},uppercase:function(e){return e?"TRUE":"FALSE"},camelcase:function(e){return e?"True":"False"}},defaultStyle:"lowercase"});function s0(e){return 48<=e&&e<=57||65<=e&&e<=70||97<=e&&e<=102}function l0(e){return 48<=e&&e<=55}function c0(e){return 48<=e&&e<=57}function u0(e){if(e===null)return!1;var n=e.length,t=0,r=!1,a;if(!n)return!1;if(a=e[t],(a==="-"||a==="+")&&(a=e[++t]),a==="0"){if(t+1===n)return!0;if(a=e[++t],a==="b"){for(t++;t<n;t++)if(a=e[t],a!=="_"){if(a!=="0"&&a!=="1")return!1;r=!0}return r&&a!=="_"}if(a==="x"){for(t++;t<n;t++)if(a=e[t],a!=="_"){if(!s0(e.charCodeAt(t)))return!1;r=!0}return r&&a!=="_"}if(a==="o"){for(t++;t<n;t++)if(a=e[t],a!=="_"){if(!l0(e.charCodeAt(t)))return!1;r=!0}return r&&a!=="_"}}if(a==="_")return!1;for(;t<n;t++)if(a=e[t],a!=="_"){if(!c0(e.charCodeAt(t)))return!1;r=!0}return!(!r||a==="_")}function d0(e){var n=e,t=1,r;if(n.indexOf("_")!==-1&&(n=n.replace(/_/g,"")),r=n[0],(r==="-"||r==="+")&&(r==="-"&&(t=-1),n=n.slice(1),r=n[0]),n==="0")return 0;if(r==="0"){if(n[1]==="b")return t*parseInt(n.slice(2),2);if(n[1]==="x")return t*parseInt(n.slice(2),16);if(n[1]==="o")return t*parseInt(n.slice(2),8)}return t*parseInt(n,10)}function h0(e){return Object.prototype.toString.call(e)==="[object Number]"&&e%1===0&&!Ne.isNegativeZero(e)}var ou=new Fe("tag:yaml.org,2002:int",{kind:"scalar",resolve:u0,construct:d0,predicate:h0,represent:{binary:function(e){return e>=0?"0b"+e.toString(2):"-0b"+e.toString(2).slice(1)},octal:function(e){return e>=0?"0o"+e.toString(8):"-0o"+e.toString(8).slice(1)},decimal:function(e){return e.toString(10)},hexadecimal:function(e){return e>=0?"0x"+e.toString(16).toUpperCase():"-0x"+e.toString(16).toUpperCase().slice(1)}},defaultStyle:"decimal",styleAliases:{binary:[2,"bin"],octal:[8,"oct"],decimal:[10,"dec"],hexadecimal:[16,"hex"]}}),f0=new RegExp("^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");function p0(e){return!(e===null||!f0.test(e)||e[e.length-1]==="_")}function m0(e){var n,t;return n=e.replace(/_/g,"").toLowerCase(),t=n[0]==="-"?-1:1,"+-".indexOf(n[0])>=0&&(n=n.slice(1)),n===".inf"?t===1?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY:n===".nan"?NaN:t*parseFloat(n,10)}var g0=/^[-+]?[0-9]+e/;function y0(e,n){var t;if(isNaN(e))switch(n){case"lowercase":return".nan";case"uppercase":return".NAN";case"camelcase":return".NaN"}else if(Number.POSITIVE_INFINITY===e)switch(n){case"lowercase":return".inf";case"uppercase":return".INF";case"camelcase":return".Inf"}else if(Number.NEGATIVE_INFINITY===e)switch(n){case"lowercase":return"-.inf";case"uppercase":return"-.INF";case"camelcase":return"-.Inf"}else if(Ne.isNegativeZero(e))return"-0.0";return t=e.toString(10),g0.test(t)?t.replace("e",".e"):t}function v0(e){return Object.prototype.toString.call(e)==="[object Number]"&&(e%1!==0||Ne.isNegativeZero(e))}var iu=new Fe("tag:yaml.org,2002:float",{kind:"scalar",resolve:p0,construct:m0,predicate:v0,represent:y0,defaultStyle:"lowercase"}),su=tu.extend({implicit:[ru,au,ou,iu]}),lu=su,cu=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),uu=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");function x0(e){return e===null?!1:cu.exec(e)!==null||uu.exec(e)!==null}function b0(e){var n,t,r,a,o,i,s,l=0,c=null,d,h,f;if(n=cu.exec(e),n===null&&(n=uu.exec(e)),n===null)throw new Error("Date resolve error");if(t=+n[1],r=+n[2]-1,a=+n[3],!n[4])return new Date(Date.UTC(t,r,a));if(o=+n[4],i=+n[5],s=+n[6],n[7]){for(l=n[7].slice(0,3);l.length<3;)l+="0";l=+l}return n[9]&&(d=+n[10],h=+(n[11]||0),c=(d*60+h)*6e4,n[9]==="-"&&(c=-c)),f=new Date(Date.UTC(t,r,a,o,i,s,l)),c&&f.setTime(f.getTime()-c),f}function w0(e){return e.toISOString()}var du=new Fe("tag:yaml.org,2002:timestamp",{kind:"scalar",resolve:x0,construct:b0,instanceOf:Date,represent:w0});function _0(e){return e==="<<"||e===null}var hu=new Fe("tag:yaml.org,2002:merge",{kind:"scalar",resolve:_0}),hi=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;function k0(e){if(e===null)return!1;var n,t,r=0,a=e.length,o=hi;for(t=0;t<a;t++)if(n=o.indexOf(e.charAt(t)),!(n>64)){if(n<0)return!1;r+=6}return r%8===0}function j0(e){var n,t,r=e.replace(/[\r\n=]/g,""),a=r.length,o=hi,i=0,s=[];for(n=0;n<a;n++)n%4===0&&n&&(s.push(i>>16&255),s.push(i>>8&255),s.push(i&255)),i=i<<6|o.indexOf(r.charAt(n));return t=a%4*6,t===0?(s.push(i>>16&255),s.push(i>>8&255),s.push(i&255)):t===18?(s.push(i>>10&255),s.push(i>>2&255)):t===12&&s.push(i>>4&255),new Uint8Array(s)}function z0(e){var n="",t=0,r,a,o=e.length,i=hi;for(r=0;r<o;r++)r%3===0&&r&&(n+=i[t>>18&63],n+=i[t>>12&63],n+=i[t>>6&63],n+=i[t&63]),t=(t<<8)+e[r];return a=o%3,a===0?(n+=i[t>>18&63],n+=i[t>>12&63],n+=i[t>>6&63],n+=i[t&63]):a===2?(n+=i[t>>10&63],n+=i[t>>4&63],n+=i[t<<2&63],n+=i[64]):a===1&&(n+=i[t>>2&63],n+=i[t<<4&63],n+=i[64],n+=i[64]),n}function I0(e){return Object.prototype.toString.call(e)==="[object Uint8Array]"}var fu=new Fe("tag:yaml.org,2002:binary",{kind:"scalar",resolve:k0,construct:j0,predicate:I0,represent:z0}),S0=Object.prototype.hasOwnProperty,T0=Object.prototype.toString;function A0(e){if(e===null)return!0;var n=[],t,r,a,o,i,s=e;for(t=0,r=s.length;t<r;t+=1){if(a=s[t],i=!1,T0.call(a)!=="[object Object]")return!1;for(o in a)if(S0.call(a,o))if(!i)i=!0;else return!1;if(!i)return!1;if(n.indexOf(o)===-1)n.push(o);else return!1}return!0}function C0(e){return e!==null?e:[]}var pu=new Fe("tag:yaml.org,2002:omap",{kind:"sequence",resolve:A0,construct:C0}),E0=Object.prototype.toString;function L0(e){if(e===null)return!0;var n,t,r,a,o,i=e;for(o=new Array(i.length),n=0,t=i.length;n<t;n+=1){if(r=i[n],E0.call(r)!=="[object Object]"||(a=Object.keys(r),a.length!==1))return!1;o[n]=[a[0],r[a[0]]]}return!0}function P0(e){if(e===null)return[];var n,t,r,a,o,i=e;for(o=new Array(i.length),n=0,t=i.length;n<t;n+=1)r=i[n],a=Object.keys(r),o[n]=[a[0],r[a[0]]];return o}var mu=new Fe("tag:yaml.org,2002:pairs",{kind:"sequence",resolve:L0,construct:P0}),N0=Object.prototype.hasOwnProperty;function M0(e){if(e===null)return!0;var n,t=e;for(n in t)if(N0.call(t,n)&&t[n]!==null)return!1;return!0}function O0(e){return e!==null?e:{}}var gu=new Fe("tag:yaml.org,2002:set",{kind:"mapping",resolve:M0,construct:O0}),fi=lu.extend({implicit:[du,hu],explicit:[fu,pu,mu,gu]}),ot=Object.prototype.hasOwnProperty,ua=1,yu=2,vu=3,da=4,ro=1,R0=2,Vs=3,$0=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,D0=/[\x85\u2028\u2029]/,F0=/[,\[\]\{\}]/,xu=/^(?:!|!!|![a-z\-]+!)$/i,bu=/^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;function Ks(e){return Object.prototype.toString.call(e)}function Sn(e){return e===10||e===13}function wt(e){return e===9||e===32}function Qe(e){return e===9||e===32||e===10||e===13}function Lt(e){return e===44||e===91||e===93||e===123||e===125}function W0(e){var n;return 48<=e&&e<=57?e-48:(n=e|32,97<=n&&n<=102?n-97+10:-1)}function H0(e){return e===120?2:e===117?4:e===85?8:0}function U0(e){return 48<=e&&e<=57?e-48:-1}function Gs(e){return e===48?"\0":e===97?"\x07":e===98?"\b":e===116||e===9?"	":e===110?`
`:e===118?"\v":e===102?"\f":e===114?"\r":e===101?"\x1B":e===32?" ":e===34?'"':e===47?"/":e===92?"\\":e===78?"":e===95?" ":e===76?"\u2028":e===80?"\u2029":""}function Y0(e){return e<=65535?String.fromCharCode(e):String.fromCharCode((e-65536>>10)+55296,(e-65536&1023)+56320)}function wu(e,n,t){n==="__proto__"?Object.defineProperty(e,n,{configurable:!0,enumerable:!0,writable:!0,value:t}):e[n]=t}var _u=new Array(256),ku=new Array(256);for(var Tt=0;Tt<256;Tt++)_u[Tt]=Gs(Tt)?1:0,ku[Tt]=Gs(Tt);function B0(e,n){this.input=e,this.filename=n.filename||null,this.schema=n.schema||fi,this.onWarning=n.onWarning||null,this.legacy=n.legacy||!1,this.json=n.json||!1,this.listener=n.listener||null,this.implicitTypes=this.schema.compiledImplicit,this.typeMap=this.schema.compiledTypeMap,this.length=e.length,this.position=0,this.line=0,this.lineStart=0,this.lineIndent=0,this.firstTabInLine=-1,this.documents=[]}function ju(e,n){var t={name:e.filename,buffer:e.input.slice(0,-1),position:e.position,line:e.line,column:e.position-e.lineStart};return t.snippet=Gb(t),new Ge(n,t)}function J(e,n){throw ju(e,n)}function ha(e,n){e.onWarning&&e.onWarning.call(null,ju(e,n))}var Xs={YAML:function(n,t,r){var a,o,i;n.version!==null&&J(n,"duplication of %YAML directive"),r.length!==1&&J(n,"YAML directive accepts exactly one argument"),a=/^([0-9]+)\.([0-9]+)$/.exec(r[0]),a===null&&J(n,"ill-formed argument of the YAML directive"),o=parseInt(a[1],10),i=parseInt(a[2],10),o!==1&&J(n,"unacceptable YAML version of the document"),n.version=r[0],n.checkLineBreaks=i<2,i!==1&&i!==2&&ha(n,"unsupported YAML version of the document")},TAG:function(n,t,r){var a,o;r.length!==2&&J(n,"TAG directive accepts exactly two arguments"),a=r[0],o=r[1],xu.test(a)||J(n,"ill-formed tag handle (first argument) of the TAG directive"),ot.call(n.tagMap,a)&&J(n,'there is a previously declared suffix for "'+a+'" tag handle'),bu.test(o)||J(n,"ill-formed tag prefix (second argument) of the TAG directive");try{o=decodeURIComponent(o)}catch{J(n,"tag prefix is malformed: "+o)}n.tagMap[a]=o}};function et(e,n,t,r){var a,o,i,s;if(n<t){if(s=e.input.slice(n,t),r)for(a=0,o=s.length;a<o;a+=1)i=s.charCodeAt(a),i===9||32<=i&&i<=1114111||J(e,"expected valid JSON character");else $0.test(s)&&J(e,"the stream contains non-printable characters");e.result+=s}}function Js(e,n,t,r){var a,o,i,s;for(Ne.isObject(t)||J(e,"cannot merge mappings; the provided source object is unacceptable"),a=Object.keys(t),i=0,s=a.length;i<s;i+=1)o=a[i],ot.call(n,o)||(wu(n,o,t[o]),r[o]=!0)}function Pt(e,n,t,r,a,o,i,s,l){var c,d;if(Array.isArray(a))for(a=Array.prototype.slice.call(a),c=0,d=a.length;c<d;c+=1)Array.isArray(a[c])&&J(e,"nested arrays are not supported inside keys"),typeof a=="object"&&Ks(a[c])==="[object Object]"&&(a[c]="[object Object]");if(typeof a=="object"&&Ks(a)==="[object Object]"&&(a="[object Object]"),a=String(a),n===null&&(n={}),r==="tag:yaml.org,2002:merge")if(Array.isArray(o))for(c=0,d=o.length;c<d;c+=1)Js(e,n,o[c],t);else Js(e,n,o,t);else!e.json&&!ot.call(t,a)&&ot.call(n,a)&&(e.line=i||e.line,e.lineStart=s||e.lineStart,e.position=l||e.position,J(e,"duplicated mapping key")),wu(n,a,o),delete t[a];return n}function pi(e){var n;n=e.input.charCodeAt(e.position),n===10?e.position++:n===13?(e.position++,e.input.charCodeAt(e.position)===10&&e.position++):J(e,"a line break is expected"),e.line+=1,e.lineStart=e.position,e.firstTabInLine=-1}function Ee(e,n,t){for(var r=0,a=e.input.charCodeAt(e.position);a!==0;){for(;wt(a);)a===9&&e.firstTabInLine===-1&&(e.firstTabInLine=e.position),a=e.input.charCodeAt(++e.position);if(n&&a===35)do a=e.input.charCodeAt(++e.position);while(a!==10&&a!==13&&a!==0);if(Sn(a))for(pi(e),a=e.input.charCodeAt(e.position),r++,e.lineIndent=0;a===32;)e.lineIndent++,a=e.input.charCodeAt(++e.position);else break}return t!==-1&&r!==0&&e.lineIndent<t&&ha(e,"deficient indentation"),r}function Ea(e){var n=e.position,t;return t=e.input.charCodeAt(n),!!((t===45||t===46)&&t===e.input.charCodeAt(n+1)&&t===e.input.charCodeAt(n+2)&&(n+=3,t=e.input.charCodeAt(n),t===0||Qe(t)))}function mi(e,n){n===1?e.result+=" ":n>1&&(e.result+=Ne.repeat(`
`,n-1))}function q0(e,n,t){var r,a,o,i,s,l,c,d,h=e.kind,f=e.result,y;if(y=e.input.charCodeAt(e.position),Qe(y)||Lt(y)||y===35||y===38||y===42||y===33||y===124||y===62||y===39||y===34||y===37||y===64||y===96||(y===63||y===45)&&(a=e.input.charCodeAt(e.position+1),Qe(a)||t&&Lt(a)))return!1;for(e.kind="scalar",e.result="",o=i=e.position,s=!1;y!==0;){if(y===58){if(a=e.input.charCodeAt(e.position+1),Qe(a)||t&&Lt(a))break}else if(y===35){if(r=e.input.charCodeAt(e.position-1),Qe(r))break}else{if(e.position===e.lineStart&&Ea(e)||t&&Lt(y))break;if(Sn(y))if(l=e.line,c=e.lineStart,d=e.lineIndent,Ee(e,!1,-1),e.lineIndent>=n){s=!0,y=e.input.charCodeAt(e.position);continue}else{e.position=i,e.line=l,e.lineStart=c,e.lineIndent=d;break}}s&&(et(e,o,i,!1),mi(e,e.line-l),o=i=e.position,s=!1),wt(y)||(i=e.position+1),y=e.input.charCodeAt(++e.position)}return et(e,o,i,!1),e.result?!0:(e.kind=h,e.result=f,!1)}function V0(e,n){var t,r,a;if(t=e.input.charCodeAt(e.position),t!==39)return!1;for(e.kind="scalar",e.result="",e.position++,r=a=e.position;(t=e.input.charCodeAt(e.position))!==0;)if(t===39)if(et(e,r,e.position,!0),t=e.input.charCodeAt(++e.position),t===39)r=e.position,e.position++,a=e.position;else return!0;else Sn(t)?(et(e,r,a,!0),mi(e,Ee(e,!1,n)),r=a=e.position):e.position===e.lineStart&&Ea(e)?J(e,"unexpected end of the document within a single quoted scalar"):(e.position++,a=e.position);J(e,"unexpected end of the stream within a single quoted scalar")}function K0(e,n){var t,r,a,o,i,s;if(s=e.input.charCodeAt(e.position),s!==34)return!1;for(e.kind="scalar",e.result="",e.position++,t=r=e.position;(s=e.input.charCodeAt(e.position))!==0;){if(s===34)return et(e,t,e.position,!0),e.position++,!0;if(s===92){if(et(e,t,e.position,!0),s=e.input.charCodeAt(++e.position),Sn(s))Ee(e,!1,n);else if(s<256&&_u[s])e.result+=ku[s],e.position++;else if((i=H0(s))>0){for(a=i,o=0;a>0;a--)s=e.input.charCodeAt(++e.position),(i=W0(s))>=0?o=(o<<4)+i:J(e,"expected hexadecimal character");e.result+=Y0(o),e.position++}else J(e,"unknown escape sequence");t=r=e.position}else Sn(s)?(et(e,t,r,!0),mi(e,Ee(e,!1,n)),t=r=e.position):e.position===e.lineStart&&Ea(e)?J(e,"unexpected end of the document within a double quoted scalar"):(e.position++,r=e.position)}J(e,"unexpected end of the stream within a double quoted scalar")}function G0(e,n){var t=!0,r,a,o,i=e.tag,s,l=e.anchor,c,d,h,f,y,k=Object.create(null),I,P,v,j;if(j=e.input.charCodeAt(e.position),j===91)d=93,y=!1,s=[];else if(j===123)d=125,y=!0,s={};else return!1;for(e.anchor!==null&&(e.anchorMap[e.anchor]=s),j=e.input.charCodeAt(++e.position);j!==0;){if(Ee(e,!0,n),j=e.input.charCodeAt(e.position),j===d)return e.position++,e.tag=i,e.anchor=l,e.kind=y?"mapping":"sequence",e.result=s,!0;t?j===44&&J(e,"expected the node content, but found ','"):J(e,"missed comma between flow collection entries"),P=I=v=null,h=f=!1,j===63&&(c=e.input.charCodeAt(e.position+1),Qe(c)&&(h=f=!0,e.position++,Ee(e,!0,n))),r=e.line,a=e.lineStart,o=e.position,Yt(e,n,ua,!1,!0),P=e.tag,I=e.result,Ee(e,!0,n),j=e.input.charCodeAt(e.position),(f||e.line===r)&&j===58&&(h=!0,j=e.input.charCodeAt(++e.position),Ee(e,!0,n),Yt(e,n,ua,!1,!0),v=e.result),y?Pt(e,s,k,P,I,v,r,a,o):h?s.push(Pt(e,null,k,P,I,v,r,a,o)):s.push(I),Ee(e,!0,n),j=e.input.charCodeAt(e.position),j===44?(t=!0,j=e.input.charCodeAt(++e.position)):t=!1}J(e,"unexpected end of the stream within a flow collection")}function X0(e,n){var t,r,a=ro,o=!1,i=!1,s=n,l=0,c=!1,d,h;if(h=e.input.charCodeAt(e.position),h===124)r=!1;else if(h===62)r=!0;else return!1;for(e.kind="scalar",e.result="";h!==0;)if(h=e.input.charCodeAt(++e.position),h===43||h===45)ro===a?a=h===43?Vs:R0:J(e,"repeat of a chomping mode identifier");else if((d=U0(h))>=0)d===0?J(e,"bad explicit indentation width of a block scalar; it cannot be less than one"):i?J(e,"repeat of an indentation width identifier"):(s=n+d-1,i=!0);else break;if(wt(h)){do h=e.input.charCodeAt(++e.position);while(wt(h));if(h===35)do h=e.input.charCodeAt(++e.position);while(!Sn(h)&&h!==0)}for(;h!==0;){for(pi(e),e.lineIndent=0,h=e.input.charCodeAt(e.position);(!i||e.lineIndent<s)&&h===32;)e.lineIndent++,h=e.input.charCodeAt(++e.position);if(!i&&e.lineIndent>s&&(s=e.lineIndent),Sn(h)){l++;continue}if(e.lineIndent<s){a===Vs?e.result+=Ne.repeat(`
`,o?1+l:l):a===ro&&o&&(e.result+=`
`);break}for(r?wt(h)?(c=!0,e.result+=Ne.repeat(`
`,o?1+l:l)):c?(c=!1,e.result+=Ne.repeat(`
`,l+1)):l===0?o&&(e.result+=" "):e.result+=Ne.repeat(`
`,l):e.result+=Ne.repeat(`
`,o?1+l:l),o=!0,i=!0,l=0,t=e.position;!Sn(h)&&h!==0;)h=e.input.charCodeAt(++e.position);et(e,t,e.position,!1)}return!0}function Qs(e,n){var t,r=e.tag,a=e.anchor,o=[],i,s=!1,l;if(e.firstTabInLine!==-1)return!1;for(e.anchor!==null&&(e.anchorMap[e.anchor]=o),l=e.input.charCodeAt(e.position);l!==0&&(e.firstTabInLine!==-1&&(e.position=e.firstTabInLine,J(e,"tab characters must not be used in indentation")),!(l!==45||(i=e.input.charCodeAt(e.position+1),!Qe(i))));){if(s=!0,e.position++,Ee(e,!0,-1)&&e.lineIndent<=n){o.push(null),l=e.input.charCodeAt(e.position);continue}if(t=e.line,Yt(e,n,vu,!1,!0),o.push(e.result),Ee(e,!0,-1),l=e.input.charCodeAt(e.position),(e.line===t||e.lineIndent>n)&&l!==0)J(e,"bad indentation of a sequence entry");else if(e.lineIndent<n)break}return s?(e.tag=r,e.anchor=a,e.kind="sequence",e.result=o,!0):!1}function J0(e,n,t){var r,a,o,i,s,l,c=e.tag,d=e.anchor,h={},f=Object.create(null),y=null,k=null,I=null,P=!1,v=!1,j;if(e.firstTabInLine!==-1)return!1;for(e.anchor!==null&&(e.anchorMap[e.anchor]=h),j=e.input.charCodeAt(e.position);j!==0;){if(!P&&e.firstTabInLine!==-1&&(e.position=e.firstTabInLine,J(e,"tab characters must not be used in indentation")),r=e.input.charCodeAt(e.position+1),o=e.line,(j===63||j===58)&&Qe(r))j===63?(P&&(Pt(e,h,f,y,k,null,i,s,l),y=k=I=null),v=!0,P=!0,a=!0):P?(P=!1,a=!0):J(e,"incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"),e.position+=1,j=r;else{if(i=e.line,s=e.lineStart,l=e.position,!Yt(e,t,yu,!1,!0))break;if(e.line===o){for(j=e.input.charCodeAt(e.position);wt(j);)j=e.input.charCodeAt(++e.position);if(j===58)j=e.input.charCodeAt(++e.position),Qe(j)||J(e,"a whitespace character is expected after the key-value separator within a block mapping"),P&&(Pt(e,h,f,y,k,null,i,s,l),y=k=I=null),v=!0,P=!1,a=!1,y=e.tag,k=e.result;else if(v)J(e,"can not read an implicit mapping pair; a colon is missed");else return e.tag=c,e.anchor=d,!0}else if(v)J(e,"can not read a block mapping entry; a multiline key may not be an implicit key");else return e.tag=c,e.anchor=d,!0}if((e.line===o||e.lineIndent>n)&&(P&&(i=e.line,s=e.lineStart,l=e.position),Yt(e,n,da,!0,a)&&(P?k=e.result:I=e.result),P||(Pt(e,h,f,y,k,I,i,s,l),y=k=I=null),Ee(e,!0,-1),j=e.input.charCodeAt(e.position)),(e.line===o||e.lineIndent>n)&&j!==0)J(e,"bad indentation of a mapping entry");else if(e.lineIndent<n)break}return P&&Pt(e,h,f,y,k,null,i,s,l),v&&(e.tag=c,e.anchor=d,e.kind="mapping",e.result=h),v}function Q0(e){var n,t=!1,r=!1,a,o,i;if(i=e.input.charCodeAt(e.position),i!==33)return!1;if(e.tag!==null&&J(e,"duplication of a tag property"),i=e.input.charCodeAt(++e.position),i===60?(t=!0,i=e.input.charCodeAt(++e.position)):i===33?(r=!0,a="!!",i=e.input.charCodeAt(++e.position)):a="!",n=e.position,t){do i=e.input.charCodeAt(++e.position);while(i!==0&&i!==62);e.position<e.length?(o=e.input.slice(n,e.position),i=e.input.charCodeAt(++e.position)):J(e,"unexpected end of the stream within a verbatim tag")}else{for(;i!==0&&!Qe(i);)i===33&&(r?J(e,"tag suffix cannot contain exclamation marks"):(a=e.input.slice(n-1,e.position+1),xu.test(a)||J(e,"named tag handle cannot contain such characters"),r=!0,n=e.position+1)),i=e.input.charCodeAt(++e.position);o=e.input.slice(n,e.position),F0.test(o)&&J(e,"tag suffix cannot contain flow indicator characters")}o&&!bu.test(o)&&J(e,"tag name cannot contain such characters: "+o);try{o=decodeURIComponent(o)}catch{J(e,"tag name is malformed: "+o)}return t?e.tag=o:ot.call(e.tagMap,a)?e.tag=e.tagMap[a]+o:a==="!"?e.tag="!"+o:a==="!!"?e.tag="tag:yaml.org,2002:"+o:J(e,'undeclared tag handle "'+a+'"'),!0}function Z0(e){var n,t;if(t=e.input.charCodeAt(e.position),t!==38)return!1;for(e.anchor!==null&&J(e,"duplication of an anchor property"),t=e.input.charCodeAt(++e.position),n=e.position;t!==0&&!Qe(t)&&!Lt(t);)t=e.input.charCodeAt(++e.position);return e.position===n&&J(e,"name of an anchor node must contain at least one character"),e.anchor=e.input.slice(n,e.position),!0}function ew(e){var n,t,r;if(r=e.input.charCodeAt(e.position),r!==42)return!1;for(r=e.input.charCodeAt(++e.position),n=e.position;r!==0&&!Qe(r)&&!Lt(r);)r=e.input.charCodeAt(++e.position);return e.position===n&&J(e,"name of an alias node must contain at least one character"),t=e.input.slice(n,e.position),ot.call(e.anchorMap,t)||J(e,'unidentified alias "'+t+'"'),e.result=e.anchorMap[t],Ee(e,!0,-1),!0}function Yt(e,n,t,r,a){var o,i,s,l=1,c=!1,d=!1,h,f,y,k,I,P;if(e.listener!==null&&e.listener("open",e),e.tag=null,e.anchor=null,e.kind=null,e.result=null,o=i=s=da===t||vu===t,r&&Ee(e,!0,-1)&&(c=!0,e.lineIndent>n?l=1:e.lineIndent===n?l=0:e.lineIndent<n&&(l=-1)),l===1)for(;Q0(e)||Z0(e);)Ee(e,!0,-1)?(c=!0,s=o,e.lineIndent>n?l=1:e.lineIndent===n?l=0:e.lineIndent<n&&(l=-1)):s=!1;if(s&&(s=c||a),(l===1||da===t)&&(ua===t||yu===t?I=n:I=n+1,P=e.position-e.lineStart,l===1?s&&(Qs(e,P)||J0(e,P,I))||G0(e,I)?d=!0:(i&&X0(e,I)||V0(e,I)||K0(e,I)?d=!0:ew(e)?(d=!0,(e.tag!==null||e.anchor!==null)&&J(e,"alias node should not have any properties")):q0(e,I,ua===t)&&(d=!0,e.tag===null&&(e.tag="?")),e.anchor!==null&&(e.anchorMap[e.anchor]=e.result)):l===0&&(d=s&&Qs(e,P))),e.tag===null)e.anchor!==null&&(e.anchorMap[e.anchor]=e.result);else if(e.tag==="?"){for(e.result!==null&&e.kind!=="scalar"&&J(e,'unacceptable node kind for !<?> tag; it should be "scalar", not "'+e.kind+'"'),h=0,f=e.implicitTypes.length;h<f;h+=1)if(k=e.implicitTypes[h],k.resolve(e.result)){e.result=k.construct(e.result),e.tag=k.tag,e.anchor!==null&&(e.anchorMap[e.anchor]=e.result);break}}else if(e.tag!=="!"){if(ot.call(e.typeMap[e.kind||"fallback"],e.tag))k=e.typeMap[e.kind||"fallback"][e.tag];else for(k=null,y=e.typeMap.multi[e.kind||"fallback"],h=0,f=y.length;h<f;h+=1)if(e.tag.slice(0,y[h].tag.length)===y[h].tag){k=y[h];break}k||J(e,"unknown tag !<"+e.tag+">"),e.result!==null&&k.kind!==e.kind&&J(e,"unacceptable node kind for !<"+e.tag+'> tag; it should be "'+k.kind+'", not "'+e.kind+'"'),k.resolve(e.result,e.tag)?(e.result=k.construct(e.result,e.tag),e.anchor!==null&&(e.anchorMap[e.anchor]=e.result)):J(e,"cannot resolve a node with !<"+e.tag+"> explicit tag")}return e.listener!==null&&e.listener("close",e),e.tag!==null||e.anchor!==null||d}function nw(e){var n=e.position,t,r,a,o=!1,i;for(e.version=null,e.checkLineBreaks=e.legacy,e.tagMap=Object.create(null),e.anchorMap=Object.create(null);(i=e.input.charCodeAt(e.position))!==0&&(Ee(e,!0,-1),i=e.input.charCodeAt(e.position),!(e.lineIndent>0||i!==37));){for(o=!0,i=e.input.charCodeAt(++e.position),t=e.position;i!==0&&!Qe(i);)i=e.input.charCodeAt(++e.position);for(r=e.input.slice(t,e.position),a=[],r.length<1&&J(e,"directive name must not be less than one character in length");i!==0;){for(;wt(i);)i=e.input.charCodeAt(++e.position);if(i===35){do i=e.input.charCodeAt(++e.position);while(i!==0&&!Sn(i));break}if(Sn(i))break;for(t=e.position;i!==0&&!Qe(i);)i=e.input.charCodeAt(++e.position);a.push(e.input.slice(t,e.position))}i!==0&&pi(e),ot.call(Xs,r)?Xs[r](e,r,a):ha(e,'unknown document directive "'+r+'"')}if(Ee(e,!0,-1),e.lineIndent===0&&e.input.charCodeAt(e.position)===45&&e.input.charCodeAt(e.position+1)===45&&e.input.charCodeAt(e.position+2)===45?(e.position+=3,Ee(e,!0,-1)):o&&J(e,"directives end mark is expected"),Yt(e,e.lineIndent-1,da,!1,!0),Ee(e,!0,-1),e.checkLineBreaks&&D0.test(e.input.slice(n,e.position))&&ha(e,"non-ASCII line breaks are interpreted as content"),e.documents.push(e.result),e.position===e.lineStart&&Ea(e)){e.input.charCodeAt(e.position)===46&&(e.position+=3,Ee(e,!0,-1));return}if(e.position<e.length-1)J(e,"end of the stream or a document separator is expected");else return}function zu(e,n){e=String(e),n=n||{},e.length!==0&&(e.charCodeAt(e.length-1)!==10&&e.charCodeAt(e.length-1)!==13&&(e+=`
`),e.charCodeAt(0)===65279&&(e=e.slice(1)));var t=new B0(e,n),r=e.indexOf("\0");for(r!==-1&&(t.position=r,J(t,"null byte is not allowed in input")),t.input+="\0";t.input.charCodeAt(t.position)===32;)t.lineIndent+=1,t.position+=1;for(;t.position<t.length-1;)nw(t);return t.documents}function tw(e,n,t){n!==null&&typeof n=="object"&&typeof t>"u"&&(t=n,n=null);var r=zu(e,t);if(typeof n!="function")return r;for(var a=0,o=r.length;a<o;a+=1)n(r[a])}function rw(e,n){var t=zu(e,n);if(t.length!==0){if(t.length===1)return t[0];throw new Ge("expected a single document in the stream, but found more")}}var aw=tw,ow=rw,Iu={loadAll:aw,load:ow},Su=Object.prototype.toString,Tu=Object.prototype.hasOwnProperty,gi=65279,iw=9,jr=10,sw=13,lw=32,cw=33,uw=34,Lo=35,dw=37,hw=38,fw=39,pw=42,Au=44,mw=45,fa=58,gw=61,yw=62,vw=63,xw=64,Cu=91,Eu=93,bw=96,Lu=123,ww=124,Pu=125,Ue={};Ue[0]="\\0";Ue[7]="\\a";Ue[8]="\\b";Ue[9]="\\t";Ue[10]="\\n";Ue[11]="\\v";Ue[12]="\\f";Ue[13]="\\r";Ue[27]="\\e";Ue[34]='\\"';Ue[92]="\\\\";Ue[133]="\\N";Ue[160]="\\_";Ue[8232]="\\L";Ue[8233]="\\P";var _w=["y","Y","yes","Yes","YES","on","On","ON","n","N","no","No","NO","off","Off","OFF"],kw=/^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;function jw(e,n){var t,r,a,o,i,s,l;if(n===null)return{};for(t={},r=Object.keys(n),a=0,o=r.length;a<o;a+=1)i=r[a],s=String(n[i]),i.slice(0,2)==="!!"&&(i="tag:yaml.org,2002:"+i.slice(2)),l=e.compiledTypeMap.fallback[i],l&&Tu.call(l.styleAliases,s)&&(s=l.styleAliases[s]),t[i]=s;return t}function zw(e){var n,t,r;if(n=e.toString(16).toUpperCase(),e<=255)t="x",r=2;else if(e<=65535)t="u",r=4;else if(e<=4294967295)t="U",r=8;else throw new Ge("code point within a string may not be greater than 0xFFFFFFFF");return"\\"+t+Ne.repeat("0",r-n.length)+n}var Iw=1,zr=2;function Sw(e){this.schema=e.schema||fi,this.indent=Math.max(1,e.indent||2),this.noArrayIndent=e.noArrayIndent||!1,this.skipInvalid=e.skipInvalid||!1,this.flowLevel=Ne.isNothing(e.flowLevel)?-1:e.flowLevel,this.styleMap=jw(this.schema,e.styles||null),this.sortKeys=e.sortKeys||!1,this.lineWidth=e.lineWidth||80,this.noRefs=e.noRefs||!1,this.noCompatMode=e.noCompatMode||!1,this.condenseFlow=e.condenseFlow||!1,this.quotingType=e.quotingType==='"'?zr:Iw,this.forceQuotes=e.forceQuotes||!1,this.replacer=typeof e.replacer=="function"?e.replacer:null,this.implicitTypes=this.schema.compiledImplicit,this.explicitTypes=this.schema.compiledExplicit,this.tag=null,this.result="",this.duplicates=[],this.usedDuplicates=null}function Zs(e,n){for(var t=Ne.repeat(" ",n),r=0,a=-1,o="",i,s=e.length;r<s;)a=e.indexOf(`
`,r),a===-1?(i=e.slice(r),r=s):(i=e.slice(r,a+1),r=a+1),i.length&&i!==`
`&&(o+=t),o+=i;return o}function Po(e,n){return`
`+Ne.repeat(" ",e.indent*n)}function Tw(e,n){var t,r,a;for(t=0,r=e.implicitTypes.length;t<r;t+=1)if(a=e.implicitTypes[t],a.resolve(n))return!0;return!1}function pa(e){return e===lw||e===iw}function Ir(e){return 32<=e&&e<=126||161<=e&&e<=55295&&e!==8232&&e!==8233||57344<=e&&e<=65533&&e!==gi||65536<=e&&e<=1114111}function el(e){return Ir(e)&&e!==gi&&e!==sw&&e!==jr}function nl(e,n,t){var r=el(e),a=r&&!pa(e);return(t?r:r&&e!==Au&&e!==Cu&&e!==Eu&&e!==Lu&&e!==Pu)&&e!==Lo&&!(n===fa&&!a)||el(n)&&!pa(n)&&e===Lo||n===fa&&a}function Aw(e){return Ir(e)&&e!==gi&&!pa(e)&&e!==mw&&e!==vw&&e!==fa&&e!==Au&&e!==Cu&&e!==Eu&&e!==Lu&&e!==Pu&&e!==Lo&&e!==hw&&e!==pw&&e!==cw&&e!==ww&&e!==gw&&e!==yw&&e!==fw&&e!==uw&&e!==dw&&e!==xw&&e!==bw}function Cw(e){return!pa(e)&&e!==fa}function nr(e,n){var t=e.charCodeAt(n),r;return t>=55296&&t<=56319&&n+1<e.length&&(r=e.charCodeAt(n+1),r>=56320&&r<=57343)?(t-55296)*1024+r-56320+65536:t}function Nu(e){var n=/^\n* /;return n.test(e)}var Mu=1,No=2,Ou=3,Ru=4,Et=5;function Ew(e,n,t,r,a,o,i,s){var l,c=0,d=null,h=!1,f=!1,y=r!==-1,k=-1,I=Aw(nr(e,0))&&Cw(nr(e,e.length-1));if(n||i)for(l=0;l<e.length;c>=65536?l+=2:l++){if(c=nr(e,l),!Ir(c))return Et;I=I&&nl(c,d,s),d=c}else{for(l=0;l<e.length;c>=65536?l+=2:l++){if(c=nr(e,l),c===jr)h=!0,y&&(f=f||l-k-1>r&&e[k+1]!==" ",k=l);else if(!Ir(c))return Et;I=I&&nl(c,d,s),d=c}f=f||y&&l-k-1>r&&e[k+1]!==" "}return!h&&!f?I&&!i&&!a(e)?Mu:o===zr?Et:No:t>9&&Nu(e)?Et:i?o===zr?Et:No:f?Ru:Ou}function Lw(e,n,t,r,a){e.dump=(function(){if(n.length===0)return e.quotingType===zr?'""':"''";if(!e.noCompatMode&&(_w.indexOf(n)!==-1||kw.test(n)))return e.quotingType===zr?'"'+n+'"':"'"+n+"'";var o=e.indent*Math.max(1,t),i=e.lineWidth===-1?-1:Math.max(Math.min(e.lineWidth,40),e.lineWidth-o),s=r||e.flowLevel>-1&&t>=e.flowLevel;function l(c){return Tw(e,c)}switch(Ew(n,s,e.indent,i,l,e.quotingType,e.forceQuotes&&!r,a)){case Mu:return n;case No:return"'"+n.replace(/'/g,"''")+"'";case Ou:return"|"+tl(n,e.indent)+rl(Zs(n,o));case Ru:return">"+tl(n,e.indent)+rl(Zs(Pw(n,i),o));case Et:return'"'+Nw(n)+'"';default:throw new Ge("impossible error: invalid scalar style")}})()}function tl(e,n){var t=Nu(e)?String(n):"",r=e[e.length-1]===`
`,a=r&&(e[e.length-2]===`
`||e===`
`),o=a?"+":r?"":"-";return t+o+`
`}function rl(e){return e[e.length-1]===`
`?e.slice(0,-1):e}function Pw(e,n){for(var t=/(\n+)([^\n]*)/g,r=(function(){var c=e.indexOf(`
`);return c=c!==-1?c:e.length,t.lastIndex=c,al(e.slice(0,c),n)})(),a=e[0]===`
`||e[0]===" ",o,i;i=t.exec(e);){var s=i[1],l=i[2];o=l[0]===" ",r+=s+(!a&&!o&&l!==""?`
`:"")+al(l,n),a=o}return r}function al(e,n){if(e===""||e[0]===" ")return e;for(var t=/ [^ ]/g,r,a=0,o,i=0,s=0,l="";r=t.exec(e);)s=r.index,s-a>n&&(o=i>a?i:s,l+=`
`+e.slice(a,o),a=o+1),i=s;return l+=`
`,e.length-a>n&&i>a?l+=e.slice(a,i)+`
`+e.slice(i+1):l+=e.slice(a),l.slice(1)}function Nw(e){for(var n="",t=0,r,a=0;a<e.length;t>=65536?a+=2:a++)t=nr(e,a),r=Ue[t],!r&&Ir(t)?(n+=e[a],t>=65536&&(n+=e[a+1])):n+=r||zw(t);return n}function Mw(e,n,t){var r="",a=e.tag,o,i,s;for(o=0,i=t.length;o<i;o+=1)s=t[o],e.replacer&&(s=e.replacer.call(t,String(o),s)),(Yn(e,n,s,!1,!1)||typeof s>"u"&&Yn(e,n,null,!1,!1))&&(r!==""&&(r+=","+(e.condenseFlow?"":" ")),r+=e.dump);e.tag=a,e.dump="["+r+"]"}function ol(e,n,t,r){var a="",o=e.tag,i,s,l;for(i=0,s=t.length;i<s;i+=1)l=t[i],e.replacer&&(l=e.replacer.call(t,String(i),l)),(Yn(e,n+1,l,!0,!0,!1,!0)||typeof l>"u"&&Yn(e,n+1,null,!0,!0,!1,!0))&&((!r||a!=="")&&(a+=Po(e,n)),e.dump&&jr===e.dump.charCodeAt(0)?a+="-":a+="- ",a+=e.dump);e.tag=o,e.dump=a||"[]"}function Ow(e,n,t){var r="",a=e.tag,o=Object.keys(t),i,s,l,c,d;for(i=0,s=o.length;i<s;i+=1)d="",r!==""&&(d+=", "),e.condenseFlow&&(d+='"'),l=o[i],c=t[l],e.replacer&&(c=e.replacer.call(t,l,c)),Yn(e,n,l,!1,!1)&&(e.dump.length>1024&&(d+="? "),d+=e.dump+(e.condenseFlow?'"':"")+":"+(e.condenseFlow?"":" "),Yn(e,n,c,!1,!1)&&(d+=e.dump,r+=d));e.tag=a,e.dump="{"+r+"}"}function Rw(e,n,t,r){var a="",o=e.tag,i=Object.keys(t),s,l,c,d,h,f;if(e.sortKeys===!0)i.sort();else if(typeof e.sortKeys=="function")i.sort(e.sortKeys);else if(e.sortKeys)throw new Ge("sortKeys must be a boolean or a function");for(s=0,l=i.length;s<l;s+=1)f="",(!r||a!=="")&&(f+=Po(e,n)),c=i[s],d=t[c],e.replacer&&(d=e.replacer.call(t,c,d)),Yn(e,n+1,c,!0,!0,!0)&&(h=e.tag!==null&&e.tag!=="?"||e.dump&&e.dump.length>1024,h&&(e.dump&&jr===e.dump.charCodeAt(0)?f+="?":f+="? "),f+=e.dump,h&&(f+=Po(e,n)),Yn(e,n+1,d,!0,h)&&(e.dump&&jr===e.dump.charCodeAt(0)?f+=":":f+=": ",f+=e.dump,a+=f));e.tag=o,e.dump=a||"{}"}function il(e,n,t){var r,a,o,i,s,l;for(a=t?e.explicitTypes:e.implicitTypes,o=0,i=a.length;o<i;o+=1)if(s=a[o],(s.instanceOf||s.predicate)&&(!s.instanceOf||typeof n=="object"&&n instanceof s.instanceOf)&&(!s.predicate||s.predicate(n))){if(t?s.multi&&s.representName?e.tag=s.representName(n):e.tag=s.tag:e.tag="?",s.represent){if(l=e.styleMap[s.tag]||s.defaultStyle,Su.call(s.represent)==="[object Function]")r=s.represent(n,l);else if(Tu.call(s.represent,l))r=s.represent[l](n,l);else throw new Ge("!<"+s.tag+'> tag resolver accepts not "'+l+'" style');e.dump=r}return!0}return!1}function Yn(e,n,t,r,a,o,i){e.tag=null,e.dump=t,il(e,t,!1)||il(e,t,!0);var s=Su.call(e.dump),l=r,c;r&&(r=e.flowLevel<0||e.flowLevel>n);var d=s==="[object Object]"||s==="[object Array]",h,f;if(d&&(h=e.duplicates.indexOf(t),f=h!==-1),(e.tag!==null&&e.tag!=="?"||f||e.indent!==2&&n>0)&&(a=!1),f&&e.usedDuplicates[h])e.dump="*ref_"+h;else{if(d&&f&&!e.usedDuplicates[h]&&(e.usedDuplicates[h]=!0),s==="[object Object]")r&&Object.keys(e.dump).length!==0?(Rw(e,n,e.dump,a),f&&(e.dump="&ref_"+h+e.dump)):(Ow(e,n,e.dump),f&&(e.dump="&ref_"+h+" "+e.dump));else if(s==="[object Array]")r&&e.dump.length!==0?(e.noArrayIndent&&!i&&n>0?ol(e,n-1,e.dump,a):ol(e,n,e.dump,a),f&&(e.dump="&ref_"+h+e.dump)):(Mw(e,n,e.dump),f&&(e.dump="&ref_"+h+" "+e.dump));else if(s==="[object String]")e.tag!=="?"&&Lw(e,e.dump,n,o,l);else{if(s==="[object Undefined]")return!1;if(e.skipInvalid)return!1;throw new Ge("unacceptable kind of an object to dump "+s)}e.tag!==null&&e.tag!=="?"&&(c=encodeURI(e.tag[0]==="!"?e.tag.slice(1):e.tag).replace(/!/g,"%21"),e.tag[0]==="!"?c="!"+c:c.slice(0,18)==="tag:yaml.org,2002:"?c="!!"+c.slice(18):c="!<"+c+">",e.dump=c+" "+e.dump)}return!0}function $w(e,n){var t=[],r=[],a,o;for(Mo(e,t,r),a=0,o=r.length;a<o;a+=1)n.duplicates.push(t[r[a]]);n.usedDuplicates=new Array(o)}function Mo(e,n,t){var r,a,o;if(e!==null&&typeof e=="object")if(a=n.indexOf(e),a!==-1)t.indexOf(a)===-1&&t.push(a);else if(n.push(e),Array.isArray(e))for(a=0,o=e.length;a<o;a+=1)Mo(e[a],n,t);else for(r=Object.keys(e),a=0,o=r.length;a<o;a+=1)Mo(e[r[a]],n,t)}function Dw(e,n){n=n||{};var t=new Sw(n);t.noRefs||$w(e,t);var r=e;return t.replacer&&(r=t.replacer.call({"":r},"",r)),Yn(t,0,r,!0,!0)?t.dump+`
`:""}var Fw=Dw,Ww={dump:Fw};function yi(e,n){return function(){throw new Error("Function yaml."+e+" is removed in js-yaml 4. Use yaml."+n+" instead, which is now safe by default.")}}var Hw=Fe,Uw=Qc,Yw=tu,Bw=su,qw=lu,Vw=fi,Kw=Iu.load,Gw=Iu.loadAll,Xw=Ww.dump,Jw=Ge,Qw={binary:fu,float:iu,map:nu,null:ru,pairs:mu,set:gu,timestamp:du,bool:au,int:ou,merge:hu,omap:pu,seq:eu,str:Zc},Zw=yi("safeLoad","load"),e_=yi("safeLoadAll","loadAll"),n_=yi("safeDump","dump"),t_={Type:Hw,Schema:Uw,FAILSAFE_SCHEMA:Yw,JSON_SCHEMA:Bw,CORE_SCHEMA:qw,DEFAULT_SCHEMA:Vw,load:Kw,loadAll:Gw,dump:Xw,YAMLException:Jw,types:Qw,safeLoad:Zw,safeLoadAll:e_,safeDump:n_};const r_=Object.assign({"./chapters/en/beginner/city-and-transportation.yml":ub,"./chapters/en/beginner/clothes-and-shopping.yml":db,"./chapters/en/beginner/family-and-friends.yml":hb,"./chapters/en/beginner/food-and-eating.yml":fb,"./chapters/en/beginner/health-and-body.yml":pb,"./chapters/en/beginner/hobbies-and-free-time.yml":mb,"./chapters/en/beginner/home-and-living.yml":gb,"./chapters/en/beginner/morning-routine.yml":yb,"./chapters/en/beginner/time-and-schedules.yml":vb,"./chapters/en/beginner/weather-and-seasons.yml":xb,"./chapters/en/intermediate/03-future-and-plans.yml":bb,"./chapters/en/intermediate/04-experiences-and-achievements.yml":wb,"./chapters/en/intermediate/05-travel-problems.yml":_b,"./chapters/en/intermediate/06-opinions-and-disagreement.yml":kb,"./chapters/en/intermediate/07-describing-personality.yml":jb,"./chapters/en/intermediate/08-entertainment-and-reviews.yml":zb,"./chapters/en/intermediate/identity-and-background.yml":Ib,"./chapters/en/intermediate/telling-stories.yml":Sb,"./chapters/ja/beginner/comprehension-check.yml":Tb,"./chapters/ja/beginner/me-and-you.yml":Ab,"./chapters/ja/beginner/me-you-and-professionals.yml":Cb,"./chapters/ja/beginner/mixed-practice-dialogue-flow.yml":Eb,"./chapters/ja/beginner/negative-not-x.yml":Lb,"./chapters/ja/beginner/shadowing-speed-rhythm.yml":Pb,"./chapters/ja/beginner/stating-facts.yml":Nb,"./chapters/ja/beginner/yes-no-questions.yml":Mb,"./chapters/ja/intermediate/discussing-movies.yml":Ob});function a_(e){try{return t_.load(e)}catch(n){return console.error("Failed to parse chapter YAML:",n),null}}function o_(e){const n=e.match(/\.\/chapters\/([a-z]{2})\//);return n?n[1]:null}function i_(e,n,t="en"){return e?.words?e.words.map((r,a)=>{const o=r.word[n]||r.word.en,i=r.word[t]||r.word.en;return{id:`${e.meta.id}_${r.id}`,word:o,nativeWord:i,meaning:r.description[n]||r.description.en,nativeMeaning:r.description[t]||r.description.en,example:r.sentence[n]||r.sentence.en,nativeExample:r.sentence[t]||r.sentence.en,phonetic:n==="en"?r.phonetic:void 0,reading:n==="ja"?r.reading:void 0}}):[]}function s_(){const e={};for(const[n,t]of Object.entries(r_)){const r=o_(n);if(!r)continue;const a=a_(t);a?.meta&&(a.meta.targetLanguage=r,e[r]||(e[r]=[]),e[r].push(a))}for(const n of Object.keys(e))e[n].sort((t,r)=>(t.meta.order||999)-(r.meta.order||999));return e}let ao=null;function l_(){return ao||(ao=s_()),ao}function $u(e="ja"){return l_()[e]||[]}function c_(e="ja",n="en"){return $u(e).map(r=>({id:r.meta.id,title:r.meta.title[n]||r.meta.title.en,description:r.meta.description[n]||r.meta.description.en,icon:r.meta.icon,level:r.meta.level,targetLanguage:r.meta.targetLanguage,wordCount:r.words?.length||0,order:r.meta.order}))}function u_(e="ja",n="beginner",t="en"){return c_(e,t).filter(r=>r.level===n)}function Du(e,n="ja"){return $u(n).find(r=>r.meta.id===e)}function d_(e,n="ja",t="en"){const r=Du(e,n);return r?i_(r,n,t):[]}function h_(e,n="ja",t="en"){const r=Du(e,n);return r?.chat?.conversations?r.chat.conversations.map(a=>({id:a.id,title:a.title[n]||a.title.en,messages:a.messages.map(o=>({role:o.role,text:o.text[n]||o.text.en,nativeText:o.text[t]||o.text.en}))})):[]}const Fu={en:"en-US",ja:"ja-JP",zh:"zh-CN",ko:"ko-KR",es:"es-ES",fr:"fr-FR",de:"de-DE"};function nt(){return"speechSynthesis"in window}function oo(){nt()&&window.speechSynthesis.cancel()}const f_={normal:{rate:.9,label:"Normal"},slow:{rate:.15,label:"Slow"},word:{rate:.5,label:"Word by Word"}};function tt(e,n="en",t="normal",r=null){return new Promise((a,o)=>{if(!nt()){o(new Error("Speech synthesis not supported"));return}if(window.speechSynthesis.cancel(),t==="word"){p_(e,n,r).then(a).catch(o);return}const i=new SpeechSynthesisUtterance(e);i.lang=Fu[n]||n,i.rate=f_[t]?.rate||.9,i.pitch=1,i.onend=()=>a(),i.onerror=s=>o(new Error("Speech synthesis failed")),window.speechSynthesis.speak(i)})}async function p_(e,n,t=null){const a=["ja","zh","ko"].includes(n)?e.replace(/[。、！？，]/g," ").split("").filter(o=>o.trim()):e.split(/\s+/).filter(o=>o.trim());for(let o=0;o<a.length;o++){const i=a[o];t&&t(o,i,a),await new Promise((s,l)=>{const c=new SpeechSynthesisUtterance(i);c.lang=Fu[n]||n,c.rate=.6,c.pitch=1,c.onend=()=>s(),c.onerror=()=>l(new Error("Speech synthesis failed")),window.speechSynthesis.speak(c)}),await new Promise(s=>setTimeout(s,400))}t&&t(-1,null,a)}function Sr(e,n="en"){return["ja","zh","ko"].includes(n)?e.split("").filter(r=>r.trim()&&!/[。、！？，]/.test(r)):e.split(/\s+/).filter(r=>r.trim())}const m_={class:"p-4 rounded-xl bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"},g_={class:"flex items-start gap-4"},y_=["disabled"],v_={class:"material-symbols-outlined text-xl"},x_={class:"flex-1 min-w-0"},b_={class:"flex items-baseline gap-2 flex-wrap"},w_={class:"text-xl font-bold text-text-main dark:text-white"},__={key:0,class:"text-lg text-primary font-medium"},k_={key:1,class:"text-sm text-text-muted dark:text-slate-400"},j_={key:2,class:"text-sm text-primary"},z_={class:"flex items-start gap-2 mt-1"},I_=["disabled"],S_={class:"material-symbols-outlined text-sm"},T_={key:0,class:"text-text-muted dark:text-slate-300"},A_={key:1,class:"text-text-muted dark:text-slate-300"},C_={key:2,class:"text-sm text-slate-500 dark:text-slate-400"},E_={class:"mt-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border-l-4 border-primary"},L_={class:"flex items-start gap-2"},P_=["disabled"],N_={key:0,class:"text-sm text-text-main dark:text-slate-200 italic"},M_={key:1,class:"text-sm text-text-main dark:text-slate-200 italic"},O_={key:2,class:"text-xs text-slate-500 dark:text-slate-400 mt-1"},R_={key:0,class:"mt-2 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1"},$_={__name:"VocabularyCard",props:{word:{type:Object,required:!0},language:{type:String,default:"en"},bilingual:{type:Boolean,default:!0},voiceSpeed:{type:String,default:"normal"}},setup(e){const{t:n}=Re(),t=e,r=B(!1),a=B(!1),o=B(!1),i=B(!1),s=B(-1),l=B(-1),c=ie(()=>Sr(t.word.meaning,t.language)),d=ie(()=>Sr(t.word.example,t.language));async function h(){if(!r.value){if(!nt()){i.value=!0;return}r.value=!0,i.value=!1;try{await tt(t.word.word,t.language,t.voiceSpeed)}catch(k){i.value=!0,console.warn("Audio playback failed:",k)}finally{r.value=!1}}}async function f(){if(!a.value&&nt()){a.value=!0,s.value=-1;try{await tt(t.word.meaning,t.language,t.voiceSpeed,k=>{s.value=k})}catch(k){console.warn("Audio playback failed:",k)}finally{a.value=!1,s.value=-1}}}async function y(){if(!o.value&&nt()){o.value=!0,l.value=-1;try{await tt(t.word.example,t.language,t.voiceSpeed,k=>{l.value=k})}catch(k){console.warn("Audio playback failed:",k)}finally{o.value=!1,l.value=-1}}}return(k,I)=>(L(),R("div",m_,[u("div",g_,[u("button",{onClick:h,disabled:r.value,class:Z(["shrink-0 flex items-center justify-center size-12 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors disabled:opacity-50",{"animate-pulse":r.value}])},[u("span",v_,x(r.value?"volume_up":"play_arrow"),1)],10,y_),u("div",x_,[u("div",b_,[u("h3",w_,x(e.word.word),1),e.bilingual&&e.word.nativeWord?(L(),R("span",__,"("+x(e.word.nativeWord)+")",1)):ae("",!0),e.word.phonetic?(L(),R("span",k_,x(e.word.phonetic),1)):ae("",!0),e.word.reading?(L(),R("span",j_,x(e.word.reading),1)):ae("",!0)]),u("div",z_,[u("button",{onClick:f,disabled:a.value,class:Z(["shrink-0 flex items-center justify-center size-6 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-text-muted dark:text-slate-400 transition-colors disabled:opacity-50",{"animate-pulse":a.value}])},[u("span",S_,x((a.value,"volume_up")),1)],10,I_),u("div",null,[e.voiceSpeed==="word"&&s.value>=0?(L(),R("p",T_,[(L(!0),R(te,null,_e(c.value,(P,v)=>(L(),R("span",{key:v,class:Z(v===s.value?"bg-primary/30 text-primary font-semibold px-0.5 rounded":"")},x(P)+x(v<c.value.length-1?" ":""),3))),128))])):(L(),R("p",A_,x(e.word.meaning),1)),e.bilingual&&e.word.nativeMeaning?(L(),R("p",C_,x(e.word.nativeMeaning),1)):ae("",!0)])]),u("div",E_,[u("div",L_,[u("button",{onClick:y,disabled:o.value,class:Z(["shrink-0 flex items-center justify-center size-6 rounded-full bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-primary transition-colors disabled:opacity-50 shadow-sm",{"animate-pulse":o.value}])},[...I[0]||(I[0]=[u("span",{class:"material-symbols-outlined text-sm"},"volume_up",-1)])],10,P_),u("div",null,[e.voiceSpeed==="word"&&l.value>=0?(L(),R("p",N_,[I[1]||(I[1]=Te(' "',-1)),(L(!0),R(te,null,_e(d.value,(P,v)=>(L(),R("span",{key:v,class:Z(v===l.value?"bg-primary/30 text-primary font-semibold not-italic px-0.5 rounded":"")},x(P)+x(v<d.value.length-1?" ":""),3))),128)),I[2]||(I[2]=Te('" ',-1))])):(L(),R("p",M_,' "'+x(e.word.example)+'" ',1)),e.bilingual&&e.word.nativeExample?(L(),R("p",O_,' "'+x(e.word.nativeExample)+'" ',1)):ae("",!0)])])])])]),i.value?(L(),R("p",R_,[I[3]||(I[3]=u("span",{class:"material-symbols-outlined text-sm"},"warning",-1)),Te(" "+x(g(n)("learning.audioNotAvailable")),1)])):ae("",!0)]))}};function Jr(e){const n=[...e];for(let t=n.length-1;t>0;t--){const r=Math.floor(Math.random()*(t+1));[n[t],n[r]]=[n[r],n[t]]}return n}function D_(){const e=B([]),n=B(0),t=B(!1),r=ie(()=>e.value[n.value]),a=ie(()=>e.value.length===0?0:(n.value+1)/e.value.length*100),o=ie(()=>e.value.length),i=ie(()=>n.value===0),s=ie(()=>n.value===e.value.length-1);function l(y){e.value=Jr(y),n.value=0,t.value=!1}function c(){t.value=!t.value}function d(){n.value<e.value.length-1&&(n.value++,t.value=!1)}function h(){n.value>0&&(n.value--,t.value=!1)}function f(y){l(y)}return{shuffledWords:e,currentIndex:n,isFlipped:t,currentWord:r,progress:a,totalCards:o,isFirstCard:i,isLastCard:s,initCards:l,flipCard:c,nextCard:d,prevCard:h,shuffle:f}}const F_={class:"flex flex-col items-center"},W_={class:"w-full max-w-lg mb-6"},H_={class:"flex justify-between text-sm text-text-muted dark:text-slate-400 mb-2"},U_={class:"h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden"},Y_={class:"absolute inset-0 backface-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 dark:from-primary/30 dark:to-primary/10 border-2 border-primary/30 shadow-lg flex flex-col items-center justify-center p-8"},B_={class:"text-4xl sm:text-5xl font-bold text-text-main dark:text-white text-center mb-2"},q_={key:0,class:"text-2xl text-primary font-medium mb-2"},V_={key:1,class:"text-xl text-primary mb-2"},K_={key:2,class:"text-lg text-text-muted dark:text-slate-400"},G_=["disabled"],X_={class:"material-symbols-outlined text-primary"},J_={class:"text-sm font-medium text-text-main dark:text-white"},Q_={class:"absolute bottom-4 text-sm text-text-muted dark:text-slate-400"},Z_={class:"absolute inset-0 backface-hidden rotate-y-180 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/20 border-2 border-green-300 dark:border-green-700 shadow-lg flex flex-col items-center justify-center p-6"},ek={class:"flex items-start gap-2 mb-2"},nk=["disabled"],tk={class:"material-symbols-outlined text-xl text-green-600 dark:text-green-400"},rk={class:"text-center"},ak={key:0,class:"text-lg sm:text-xl text-text-main dark:text-white"},ok={key:1,class:"text-lg sm:text-xl text-text-main dark:text-white"},ik={key:2,class:"text-sm text-slate-600 dark:text-slate-400"},sk={class:"p-3 rounded-xl bg-white/50 dark:bg-slate-800/50 w-full mt-2"},lk={class:"flex items-start gap-2"},ck=["disabled"],uk={class:"material-symbols-outlined text-xl text-green-600 dark:text-green-400"},dk={key:0,class:"text-text-muted dark:text-slate-300 italic text-sm"},hk={key:1,class:"text-text-muted dark:text-slate-300 italic text-sm"},fk={key:2,class:"text-xs text-slate-500 dark:text-slate-400 italic mt-1"},pk={class:"absolute bottom-4 text-sm text-text-muted dark:text-slate-400"},mk={class:"flex items-center gap-4 mt-8"},gk=["disabled"],yk=["disabled"],vk={class:"mt-4 text-xs text-text-muted dark:text-slate-400 hidden sm:block"},xk={__name:"FlashcardMode",props:{words:{type:Array,required:!0},language:{type:String,default:"en"},bilingual:{type:Boolean,default:!0},voiceSpeed:{type:String,default:"normal"}},setup(e){const{t:n}=Re(),t=e,r=B(!1),a=B(!1),o=B(!1),i=B(-1),s=B(-1),l=ie(()=>f.value?.meaning?Sr(f.value.meaning,t.language):[]),c=ie(()=>f.value?.example?Sr(f.value.example,t.language):[]),{currentIndex:d,isFlipped:h,currentWord:f,progress:y,totalCards:k,isFirstCard:I,isLastCard:P,initCards:v,flipCard:j,nextCard:N,prevCard:w,shuffle:_}=D_();function S(){j()}function C(){N()}function W(){w()}function F(){_(t.words)}async function q(){if(!(!f.value?.word||r.value)&&nt()){r.value=!0;try{await tt(f.value.word,t.language,t.voiceSpeed)}catch(Q){console.warn("Audio playback failed:",Q)}finally{r.value=!1}}}async function X(){if(!(!f.value?.meaning||a.value)&&nt()){a.value=!0,i.value=-1;try{await tt(f.value.meaning,t.language,t.voiceSpeed,Q=>{i.value=Q})}catch(Q){console.warn("Audio playback failed:",Q)}finally{a.value=!1,i.value=-1}}}async function $(){if(!(!f.value?.example||o.value)&&nt()){o.value=!0,s.value=-1;try{await tt(f.value.example,t.language,t.voiceSpeed,Q=>{s.value=Q})}catch(Q){console.warn("Audio playback failed:",Q)}finally{o.value=!1,s.value=-1}}}return dn(()=>t.words,Q=>v(Q),{immediate:!0}),(Q,ce)=>(L(),R("div",F_,[u("div",W_,[u("div",H_,[u("span",null,x(g(d)+1)+" / "+x(g(k)),1),u("span",null,x(Math.round(g(y)))+"%",1)]),u("div",U_,[u("div",{class:"h-full bg-gradient-to-r from-primary to-green-400 rounded-full transition-all duration-300",style:mn({width:`${g(y)}%`})},null,4)])]),u("div",{onClick:S,class:"w-full max-w-lg aspect-[4/3] perspective-1000 cursor-pointer"},[u("div",{class:Z(["relative w-full h-full transition-transform duration-500 transform-style-3d",{"rotate-y-180":g(h)}])},[u("div",Y_,[u("span",B_,x(g(f)?.word),1),e.bilingual&&g(f)?.nativeWord?(L(),R("span",q_," ("+x(g(f).nativeWord)+") ",1)):ae("",!0),g(f)?.reading?(L(),R("span",V_,x(g(f).reading),1)):ae("",!0),g(f)?.phonetic?(L(),R("span",K_,x(g(f).phonetic),1)):ae("",!0),u("button",{onClick:Zn(q,["stop"]),disabled:r.value,class:Z(["mt-6 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-shadow",{"animate-pulse":r.value}])},[u("span",X_,x(r.value?"volume_up":"play_arrow"),1),u("span",J_,x(g(n)("learning.listen")),1)],10,G_),u("p",Q_,x(g(n)("learning.tapToFlip")),1)]),u("div",Z_,[u("div",ek,[u("button",{onClick:Zn(X,["stop"]),disabled:a.value,class:Z(["flex-shrink-0 p-1.5 rounded-full hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors",{"animate-pulse text-primary":a.value}])},[u("span",tk,x((a.value,"volume_up")),1)],10,nk),u("div",rk,[e.voiceSpeed==="word"&&i.value>=0?(L(),R("p",ak,[(L(!0),R(te,null,_e(l.value,($e,fe)=>(L(),R("span",{key:fe,class:Z(fe===i.value?"bg-primary/40 text-primary font-bold px-1 rounded":"")},x($e)+x(fe<l.value.length-1?" ":""),3))),128))])):(L(),R("p",ok,x(g(f)?.meaning),1)),e.bilingual&&g(f)?.nativeMeaning?(L(),R("p",ik,x(g(f).nativeMeaning),1)):ae("",!0)])]),u("div",sk,[u("div",lk,[u("button",{onClick:Zn($,["stop"]),disabled:o.value,class:Z(["flex-shrink-0 p-1.5 rounded-full hover:bg-white/70 dark:hover:bg-slate-700/70 transition-colors",{"animate-pulse text-primary":o.value}])},[u("span",uk,x((o.value,"volume_up")),1)],10,ck),u("div",null,[e.voiceSpeed==="word"&&s.value>=0?(L(),R("p",dk,[ce[0]||(ce[0]=Te(' "',-1)),(L(!0),R(te,null,_e(c.value,($e,fe)=>(L(),R("span",{key:fe,class:Z(fe===s.value?"bg-primary/40 text-primary font-bold not-italic px-0.5 rounded":"")},x($e)+x(fe<c.value.length-1?" ":""),3))),128)),ce[1]||(ce[1]=Te('" ',-1))])):(L(),R("p",hk,' "'+x(g(f)?.example)+'" ',1)),e.bilingual&&g(f)?.nativeExample?(L(),R("p",fk,' "'+x(g(f).nativeExample)+'" ',1)):ae("",!0)])])]),u("p",pk,x(g(n)("learning.tapToFlip")),1)])],2)]),u("div",mk,[u("button",{onClick:W,disabled:g(I),class:"flex items-center justify-center size-12 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"},[...ce[2]||(ce[2]=[u("span",{class:"material-symbols-outlined text-text-main dark:text-white"},"chevron_left",-1)])],8,gk),u("button",{onClick:F,class:"flex items-center gap-2 px-6 py-3 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary font-medium transition-colors"},[ce[3]||(ce[3]=u("span",{class:"material-symbols-outlined"},"replay",-1)),Te(" "+x(g(n)("learning.shuffle")),1)]),u("button",{onClick:C,disabled:g(P),class:"flex items-center justify-center size-12 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"},[...ce[4]||(ce[4]=[u("span",{class:"material-symbols-outlined text-text-main dark:text-white"},"chevron_right",-1)])],8,yk)]),u("p",vk,x(g(n)("learning.keyboardHints")),1)]))}},bk=ct(xk,[["__scopeId","data-v-750517c5"]]);function wk(e){const n=B([]),t=B(0),r=B(null),a=B(!1),o=B(0),i=B(!1),s=B([]),l=ie(()=>n.value[t.value]),c=ie(()=>n.value.length===0?0:t.value/n.value.length*100),d=ie(()=>n.value.length===0?0:Math.round(o.value/n.value.length*100)),h=ie(()=>n.value.length),f=ie(()=>n.value.length===0?0:Math.round(o.value/n.value.length*20));function y(N,w){const _=[N],S=w.filter(W=>W.id!==N.id),C=Jr(S);for(let W=0;W<Math.min(3,C.length);W++)_.push(C[W]);return Jr(_)}function k(N){const w=Jr(N);n.value=w.map(_=>({..._,options:y(_,N)})),t.value=0,r.value=null,a.value=!1,o.value=0,i.value=!1,s.value=[]}function I(N){if(a.value)return null;r.value=N,a.value=!0;const w=N.id===l.value.id;return s.value.push({word:l.value,selected:N,isCorrect:w}),w&&o.value++,w}function P(){return t.value<n.value.length-1?(t.value++,r.value=null,a.value=!1,{completed:!1}):(i.value=!0,{completed:!0,score:o.value,total:n.value.length,accuracy:d.value,xpEarned:f.value})}function v(N){k(N)}function j(N){return l.value?N.id===l.value.id:!1}return{quizWords:n,currentIndex:t,selectedAnswer:r,isAnswered:a,score:o,isCompleted:i,answers:s,currentQuestion:l,progress:c,accuracy:d,totalQuestions:h,xpEarned:f,initQuiz:k,selectAnswer:I,nextQuestion:P,restartQuiz:v,isCorrectOption:j}}const _k={class:"flex flex-col items-center"},kk={class:"w-full max-w-lg mb-6"},jk={class:"flex justify-between text-sm text-text-muted dark:text-slate-400 mb-2"},zk={class:"flex items-center gap-1"},Ik={class:"h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden"},Sk={class:"w-full max-w-lg p-8 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800 mb-6"},Tk={class:"text-sm text-text-muted dark:text-slate-400 mb-2"},Ak={class:"text-3xl sm:text-4xl font-bold text-text-main dark:text-white text-center"},Ck={key:0,class:"text-xl text-primary text-center mt-2"},Ek={key:1,class:"text-lg text-text-muted dark:text-slate-400 text-center mt-1"},Lk={class:"w-full max-w-lg space-y-3"},Pk=["onClick","disabled"],Nk={class:"flex items-center gap-3"},Mk={class:"flex items-center justify-center size-8 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-bold text-text-muted"},Ok={class:"text-text-main dark:text-white"},Rk={key:0,class:"ml-auto material-symbols-outlined text-green-500"},$k={key:1,class:"ml-auto material-symbols-outlined text-red-500"},Dk={key:0,class:"w-full max-w-lg mt-6"},Fk={class:"flex items-center gap-2 mb-2"},Wk={class:"text-sm text-text-muted dark:text-slate-400"},Hk={key:1,class:"w-full max-w-lg text-center"},Uk={class:"p-8 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/20 border border-amber-200 dark:border-amber-700 mb-6"},Yk={class:"text-6xl mb-4"},Bk={class:"text-2xl font-bold text-text-main dark:text-white mb-2"},qk={class:"text-text-muted dark:text-slate-400 mb-4"},Vk={class:"flex items-center justify-center gap-4"},Kk={class:"text-center"},Gk={class:"text-4xl font-bold text-primary"},Xk={class:"text-2xl text-text-muted dark:text-slate-400"},Jk={class:"text-center"},Qk={class:"mt-4 text-sm text-amber-600 dark:text-amber-400"},Zk={class:"mb-6"},ej={class:"text-lg font-semibold text-text-main dark:text-white mb-3 text-left"},nj={class:"space-y-2"},tj={class:"font-medium text-text-main dark:text-white"},rj={class:"text-sm text-text-muted dark:text-slate-400 truncate flex-1"},aj={class:"flex items-center justify-center gap-2"},oj={__name:"QuizMode",props:{words:{type:Array,required:!0},language:{type:String,default:"en"},chapterId:{type:String,default:null}},emits:["complete"],setup(e,{emit:n}){const{t}=Re(),{markQuizCompleted:r}=di(),a=e,o=n,{currentIndex:i,selectedAnswer:s,isAnswered:l,score:c,isCompleted:d,answers:h,currentQuestion:f,progress:y,accuracy:k,totalQuestions:I,xpEarned:P,initQuiz:v,selectAnswer:j,nextQuestion:N,restartQuiz:w,isCorrectOption:_}=wk();function S(q){j(q)}function C(){const q=N();q.completed&&(a.chapterId&&r(a.chapterId,q.score,q.total),o("complete",{score:q.score,total:q.total,accuracy:q.accuracy,xpEarned:q.xpEarned}))}function W(){w(a.words)}function F(q){return l.value?_(q)?"border-green-500 bg-green-50 dark:bg-green-900/30":s.value?.id===q.id&&!_(q)?"border-red-500 bg-red-50 dark:bg-red-900/30":"border-slate-200 dark:border-slate-700 opacity-50":"border-slate-200 dark:border-slate-700 hover:border-primary dark:hover:border-primary"}return dn(()=>a.words,q=>v(q),{immediate:!0}),(q,X)=>(L(),R("div",_k,[g(d)?(L(),R("div",Hk,[u("div",Uk,[u("div",Yk,x(g(k)>=80?"🎉":g(k)>=60?"👍":"💪"),1),u("h2",Bk,x(g(t)("learning.quizComplete")),1),u("p",qk,x(g(t)("learning.yourScore")),1),u("div",Vk,[u("div",Kk,[u("span",Gk,x(g(c)),1),u("span",Xk," / "+x(g(I)),1)]),X[1]||(X[1]=u("div",{class:"h-12 w-px bg-slate-300 dark:bg-slate-600"},null,-1)),u("div",Jk,[u("span",{class:Z(["text-4xl font-bold",g(k)>=80?"text-green-500":g(k)>=60?"text-amber-500":"text-red-500"])},x(g(k))+"%",3)])]),u("p",Qk," +"+x(g(P))+" XP "+x(g(t)("learning.earned")),1)]),u("div",Zk,[u("h3",ej,x(g(t)("learning.reviewAnswers")),1),u("div",nj,[(L(!0),R(te,null,_e(g(h),($,Q)=>(L(),R("div",{key:Q,class:"flex items-center gap-3 p-3 rounded-lg bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700"},[u("span",{class:Z(["material-symbols-outlined",$.isCorrect?"text-green-500":"text-red-500"])},x($.isCorrect?"check_circle":"cancel"),3),u("span",tj,x($.word.word),1),X[2]||(X[2]=u("span",{class:"text-text-muted dark:text-slate-400"},"-",-1)),u("span",rj,x($.word.meaning),1)]))),128))])]),u("button",{onClick:W,class:"w-full py-4 rounded-xl bg-primary text-[#0d171b] font-bold text-lg hover:bg-primary/90 transition-colors"},[u("span",aj,[X[3]||(X[3]=u("span",{class:"material-symbols-outlined"},"replay",-1)),Te(" "+x(g(t)("learning.tryAgain")),1)])])])):(L(),R(te,{key:0},[u("div",kk,[u("div",jk,[u("span",null,x(g(t)("learning.question"))+" "+x(g(i)+1)+" / "+x(g(I)),1),u("span",zk,[X[0]||(X[0]=u("span",{class:"material-symbols-outlined text-sm text-green-500"},"check_circle",-1)),Te(" "+x(g(c)),1)])]),u("div",Ik,[u("div",{class:"h-full bg-gradient-to-r from-primary to-green-400 rounded-full transition-all duration-300",style:mn({width:`${g(y)}%`})},null,4)])]),u("div",Sk,[u("p",Tk,x(g(t)("learning.whatMeans")),1),u("h2",Ak,x(g(f)?.word),1),g(f)?.reading?(L(),R("p",Ck,x(g(f).reading),1)):ae("",!0),g(f)?.phonetic?(L(),R("p",Ek,x(g(f).phonetic),1)):ae("",!0)]),u("div",Lk,[(L(!0),R(te,null,_e(g(f)?.options,($,Q)=>(L(),R("button",{key:$.id,onClick:ce=>S($),disabled:g(l),class:Z(["w-full p-4 rounded-xl border-2 text-left transition-all",F($)])},[u("div",Nk,[u("span",Mk,x(String.fromCharCode(65+Q)),1),u("span",Ok,x($.meaning),1),g(l)&&g(_)($)?(L(),R("span",Rk,"check_circle")):ae("",!0),g(l)&&g(s)?.id===$.id&&!g(_)($)?(L(),R("span",$k,"cancel")):ae("",!0)])],10,Pk))),128))]),g(l)?(L(),R("div",Dk,[u("div",{class:Z(["p-4 rounded-xl mb-4",g(s)?.id===g(f)?.id?"bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700":"bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700"])},[u("div",Fk,[u("span",{class:Z(["material-symbols-outlined",g(s)?.id===g(f)?.id?"text-green-600":"text-red-600"])},x(g(s)?.id===g(f)?.id?"celebration":"sentiment_dissatisfied"),3),u("span",{class:Z(["font-semibold",g(s)?.id===g(f)?.id?"text-green-700 dark:text-green-300":"text-red-700 dark:text-red-300"])},x(g(s)?.id===g(f)?.id?g(t)("learning.correct"):g(t)("learning.incorrect")),3)]),u("p",Wk,x(g(f)?.example),1)],2),u("button",{onClick:C,class:"w-full py-4 rounded-xl bg-primary text-[#0d171b] font-bold text-lg hover:bg-primary/90 transition-colors"},x(g(i)<g(I)-1?g(t)("learning.nextQuestion"):g(t)("learning.finishQuiz")),1)])):ae("",!0)],64))]))}},ij={class:"flex flex-col h-[600px] max-h-[80vh] bg-surface-light dark:bg-surface-dark rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700"},sj={class:"flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20 border-b border-slate-200 dark:border-slate-700"},lj={class:"flex items-center gap-3"},cj={class:"font-semibold text-text-main dark:text-white text-sm"},uj={class:"text-xs text-text-muted dark:text-slate-400"},dj={class:"material-symbols-outlined text-lg"},hj={class:"text-sm"},fj={key:0,class:"flex-1 overflow-y-auto p-4"},pj={key:0,class:"flex flex-col items-center justify-center h-full text-center"},mj={class:"text-text-muted dark:text-slate-400"},gj={key:1,class:"space-y-3"},yj=["onClick"],vj={class:"flex items-center justify-between"},xj={class:"flex items-center gap-3"},bj={class:"font-medium text-text-main dark:text-white group-hover:text-primary transition-colors"},wj={class:"text-xs text-text-muted dark:text-slate-400"},_j={key:1,class:"flex-1 overflow-y-auto p-4 space-y-4"},kj=["onClick","title"],jj={class:"material-symbols-outlined text-xl"},zj={key:0,class:"text-text-main dark:text-white text-base leading-relaxed"},Ij={key:1,class:"text-text-main dark:text-white text-base leading-relaxed"},Sj={key:2,class:"mt-2 text-sm text-text-muted dark:text-slate-400 italic border-t border-slate-200 dark:border-slate-600 pt-2"},Tj={class:"mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800"},Aj={class:"flex items-start gap-3"},Cj={class:"font-medium text-amber-800 dark:text-amber-200 text-sm mb-1"},Ej={class:"text-xs text-amber-700 dark:text-amber-300"},Lj={__name:"ConversationPractice",props:{conversations:{type:Array,required:!0},language:{type:String,default:"en"},bilingual:{type:Boolean,default:!0},voiceSpeed:{type:String,default:"normal"},chapterId:{type:String,default:null}},emits:["back"],setup(e,{emit:n}){const{t}=Re(),{markConversationCompleted:r}=di(),a=e,o=n,i=B(null),s=B(null),l=B(!1),c=B(!1),d=B(-1),h=B(-1),f=ie(()=>i.value?a.conversations.find(_=>_.id===i.value):null);function y(_){i.value=_.id}function k(){P(),oo(),s.value=null,i.value=null}async function I(){if(!f.value?.messages)return;if(l.value){P();return}l.value=!0,c.value=!1;const _=f.value.messages;for(let S=0;S<_.length&&!c.value;S++){s.value=S,h.value=S,d.value=-1;try{await tt(_[S].text,a.language,a.voiceSpeed,C=>{d.value=C})}catch(C){console.error("TTS error:",C)}!c.value&&S<_.length-1&&await new Promise(C=>setTimeout(C,500))}!c.value&&a.chapterId&&r(a.chapterId),s.value=null,h.value=-1,d.value=-1,l.value=!1,c.value=!1}function P(){c.value=!0,l.value=!1,oo(),s.value=null,h.value=-1,d.value=-1}async function v(_,S){if(l.value&&P(),oo(),s.value===S){s.value=null,h.value=-1,d.value=-1;return}s.value=S,h.value=S,d.value=-1;try{await tt(_.text,a.language,a.voiceSpeed,C=>{d.value=C})}catch(C){console.error("TTS error:",C)}finally{s.value=null,h.value=-1,d.value=-1}}function j(_){return Sr(_,a.language)}function N(_){return t(_==="partner"?"learning.conversation.partner":"learning.conversation.you")}function w(_){return _==="partner"?"bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light":"bg-accent/10 dark:bg-accent/20 text-accent dark:text-accent-light"}return(_,S)=>(L(),R("div",ij,[u("div",sj,[u("div",lj,[u("button",{onClick:S[0]||(S[0]=C=>f.value?k():o("back")),class:"p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"},[...S[1]||(S[1]=[u("span",{class:"material-symbols-outlined text-text-muted dark:text-slate-400"},"arrow_back",-1)])]),u("div",null,[u("h3",cj,x(f.value?f.value.title:g(t)("learning.conversation.title")),1),u("p",uj,x(f.value?g(t)("learning.conversation.practiceDialogue"):g(t)("learning.conversation.selectDialogue")),1)])]),f.value?(L(),R("button",{key:0,onClick:I,class:Z(["flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all",l.value?"bg-red-500 text-white hover:bg-red-600":"bg-primary text-white hover:bg-primary/90"])},[u("span",dj,x(l.value?"stop":"play_arrow"),1),u("span",hj,x(l.value?g(t)("learning.conversation.stop"):g(t)("learning.conversation.playAll")),1)],2)):ae("",!0)]),f.value?(L(),R("div",_j,[(L(!0),R(te,null,_e(f.value.messages,(C,W)=>(L(),R("div",{key:W,class:Z(["flex gap-3",C.role==="user"?"flex-row-reverse":""])},[u("button",{onClick:F=>v(C,W),class:Z(["flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all",[s.value===W?"bg-primary text-white animate-pulse":"bg-slate-100 dark:bg-slate-700 text-text-muted dark:text-slate-400 hover:bg-primary/20 hover:text-primary"]]),title:g(t)("learning.conversation.playAudio")},[u("span",jj,x(s.value===W?"stop":"volume_up"),1)],10,kj),u("div",{class:Z(["flex-1 max-w-[80%] rounded-2xl p-4",C.role==="partner"?"bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700":"bg-primary/10 dark:bg-primary/20"])},[u("span",{class:Z(["inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-2",w(C.role)])},x(N(C.role)),3),e.voiceSpeed==="word"&&h.value===W&&d.value>=0?(L(),R("p",zj,[(L(!0),R(te,null,_e(j(C.text),(F,q)=>(L(),R("span",{key:q,class:Z(q===d.value?"bg-primary/40 text-primary font-bold px-0.5 rounded":"")},x(F)+x(q<j(C.text).length-1?" ":""),3))),128))])):(L(),R("p",Ij,x(C.text),1)),e.bilingual&&C.nativeText&&C.nativeText!==C.text?(L(),R("p",Sj,x(C.nativeText),1)):ae("",!0)],2)],2))),128)),u("div",Tj,[u("div",Aj,[S[5]||(S[5]=u("span",{class:"text-xl"},"💡",-1)),u("div",null,[u("h4",Cj,x(g(t)("learning.conversation.practiceTip")),1),u("p",Ej,x(g(t)("learning.conversation.practiceTipText")),1)])])])])):(L(),R("div",fj,[e.conversations.length===0?(L(),R("div",pj,[S[2]||(S[2]=u("span",{class:"text-4xl mb-3"},"💬",-1)),u("p",mj,x(g(t)("learning.conversation.noConversations")),1)])):(L(),R("div",gj,[(L(!0),R(te,null,_e(e.conversations,C=>(L(),R("button",{key:C.id,onClick:W=>y(C),class:"w-full p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary dark:hover:border-primary transition-colors text-left group"},[u("div",vj,[u("div",xj,[S[3]||(S[3]=u("span",{class:"text-2xl"},"💬",-1)),u("div",null,[u("h4",bj,x(C.title),1),u("p",wj,x(C.messages.length)+" "+x(g(t)("learning.conversation.messages")),1)])]),S[4]||(S[4]=u("span",{class:"material-symbols-outlined text-text-muted dark:text-slate-400 group-hover:text-primary transition-colors"}," chevron_right ",-1))])],8,yj))),128))]))]))]))}},Pj={class:"min-h-screen bg-background-light dark:bg-background-dark"},Nj={class:"sticky top-0 z-10 bg-surface-light dark:bg-surface-dark border-b border-slate-200 dark:border-slate-700"},Mj={class:"max-w-4xl mx-auto px-4 py-3 flex items-center justify-between"},Oj={class:"text-sm font-medium"},Rj={class:"flex items-center gap-4"},$j={class:"relative"},Dj={value:"normal"},Fj={value:"slow"},Wj={value:"word"},Hj={class:"hidden sm:inline"},Uj={class:"flex items-center gap-2"},Yj={class:"text-2xl"},Bj={class:"font-semibold text-text-main dark:text-white"},qj={class:"max-w-4xl mx-auto px-4 py-6"},Vj={class:"text-2xl font-bold text-text-main dark:text-white mb-2"},Kj={class:"text-text-muted dark:text-slate-400 mb-6"},Gj={class:"space-y-4"},Xj=["onClick"],Jj={key:0,class:"material-symbols-outlined text-2xl text-green-600 dark:text-green-400"},Qj={key:1,class:"text-lg font-bold text-primary"},Zj={class:"text-4xl"},ez={class:"flex-1 min-w-0"},nz={class:"font-semibold text-text-main dark:text-white text-lg"},tz={class:"text-sm text-text-muted dark:text-slate-400 truncate"},rz={class:"flex items-center gap-3 mt-1"},az={class:"material-symbols-outlined text-sm"},oz={class:"material-symbols-outlined text-sm"},iz={class:"flex-shrink-0 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full"},sz={class:"text-sm font-medium text-text-muted dark:text-slate-400"},lz={key:0,class:"text-center py-12"},cz={class:"text-lg font-semibold text-text-main dark:text-white mb-2"},uz={class:"text-text-muted dark:text-slate-400"},dz={class:"flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"},hz={class:"flex items-center gap-3"},fz={class:"text-4xl"},pz={class:"text-2xl font-bold text-text-main dark:text-white"},mz={class:"text-sm text-text-muted dark:text-slate-400"},gz={class:"flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1"},yz={key:0,class:"space-y-3"},vz={class:"bg-surface-light dark:bg-surface-dark rounded-2xl p-6 max-w-md w-full shadow-xl"},xz={class:"text-center"},bz={class:"text-xl font-bold text-text-main dark:text-white mb-2"},wz={class:"text-text-muted dark:text-slate-400 mb-6"},_z={class:"flex gap-3"},kz={__name:"LearningScreen",props:{level:{type:Object,required:!0},targetLanguage:{type:String,required:!0},motherTongue:{type:String,default:"en"},uiLanguage:{type:String,default:"en"}},emits:["back"],setup(e,{emit:n}){const{t,locale:r}=Re();ui();const{addXP:a}=jt(),{getChapterCompletionStatus:o}=di(),i=e,s=n,l=B(null),c=B("list"),d=B([]),h=B([]),f=B(!1),y=B(!0),k=B("normal"),I=ie(()=>u_(i.targetLanguage,i.level.id,i.uiLanguage));function P(C){l.value=C,d.value=d_(C.id,i.targetLanguage,i.motherTongue),h.value=h_(C.id,i.targetLanguage,i.motherTongue),c.value="list"}function v(){l.value=null,c.value="list"}function j(C){c.value=C}function N(C){C.xpEarned>0&&a(C.xpEarned,"quiz"),f.value=!0}function w(){f.value=!1,c.value="conversation"}function _(){f.value=!1}function S(){c.value="list"}return Bt(()=>{I.value.length===1&&P(I.value[0])}),(C,W)=>(L(),R("div",Pj,[u("header",Nj,[u("div",Mj,[u("button",{onClick:W[0]||(W[0]=F=>l.value?v():s("back")),class:"flex items-center gap-2 text-text-muted hover:text-text-main dark:text-slate-400 dark:hover:text-white transition-colors"},[W[7]||(W[7]=u("span",{class:"material-symbols-outlined"},"arrow_back",-1)),u("span",Oj,x(l.value?g(t)("learning.backToChapters"):g(t)("learning.backToSetup")),1)]),u("div",Rj,[u("div",$j,[Rd(u("select",{"onUpdate:modelValue":W[1]||(W[1]=F=>k.value=F),class:"appearance-none pl-8 pr-8 py-1.5 rounded-full text-sm font-medium bg-slate-100 dark:bg-slate-800 text-text-main dark:text-slate-300 border-none cursor-pointer focus:ring-2 focus:ring-primary focus:outline-none"},[u("option",Dj,x(g(t)("learning.voiceSpeed.normal")),1),u("option",Fj,x(g(t)("learning.voiceSpeed.slow")),1),u("option",Wj,x(g(t)("learning.voiceSpeed.word")),1)],512),[[pf,k.value]]),W[8]||(W[8]=u("span",{class:"material-symbols-outlined text-lg absolute left-2 top-1/2 -translate-y-1/2 text-text-muted dark:text-slate-400 pointer-events-none"},"volume_up",-1)),W[9]||(W[9]=u("span",{class:"material-symbols-outlined text-sm absolute right-2 top-1/2 -translate-y-1/2 text-text-muted dark:text-slate-400 pointer-events-none"},"expand_more",-1))]),u("button",{onClick:W[2]||(W[2]=F=>y.value=!y.value),class:Z(["flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",y.value?"bg-primary/10 text-primary":"bg-slate-100 dark:bg-slate-800 text-text-muted dark:text-slate-400"])},[W[10]||(W[10]=u("span",{class:"material-symbols-outlined text-lg"},"translate",-1)),u("span",Hj,x(g(t)("learning.bilingual")),1)],2),u("div",Uj,[u("span",Yj,x(i.level.icon),1),u("span",Bj,x(g(t)(`levels.${i.level.id}.name`)),1)])])])]),u("main",qj,[l.value?(L(),R(te,{key:1},[u("div",dz,[u("div",hz,[u("span",fz,x(l.value.icon),1),u("div",null,[u("h1",pz,x(l.value.title),1),u("p",mz,x(d.value.length)+" "+x(g(t)("learning.words")),1)])]),u("div",gz,[u("button",{onClick:W[3]||(W[3]=F=>j("list")),class:Z(["flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",c.value==="list"?"bg-white dark:bg-slate-700 text-primary shadow-sm":"text-text-muted dark:text-slate-400 hover:text-text-main dark:hover:text-white"])},[W[13]||(W[13]=u("span",{class:"material-symbols-outlined text-lg"},"list",-1)),Te(" "+x(g(t)("learning.modes.list")),1)],2),u("button",{onClick:W[4]||(W[4]=F=>j("flashcard")),class:Z(["flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",c.value==="flashcard"?"bg-white dark:bg-slate-700 text-primary shadow-sm":"text-text-muted dark:text-slate-400 hover:text-text-main dark:hover:text-white"])},[W[14]||(W[14]=u("span",{class:"material-symbols-outlined text-lg"},"style",-1)),Te(" "+x(g(t)("learning.modes.flashcard")),1)],2),u("button",{onClick:W[5]||(W[5]=F=>j("quiz")),class:Z(["flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",c.value==="quiz"?"bg-white dark:bg-slate-700 text-primary shadow-sm":"text-text-muted dark:text-slate-400 hover:text-text-main dark:hover:text-white"])},[W[15]||(W[15]=u("span",{class:"material-symbols-outlined text-lg"},"quiz",-1)),Te(" "+x(g(t)("learning.modes.quiz")),1)],2),u("button",{onClick:W[6]||(W[6]=F=>j("conversation")),class:Z(["flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",c.value==="conversation"?"bg-white dark:bg-slate-700 text-primary shadow-sm":"text-text-muted dark:text-slate-400 hover:text-text-main dark:hover:text-white"])},[W[16]||(W[16]=u("span",{class:"material-symbols-outlined text-lg"},"chat",-1)),Te(" "+x(g(t)("learning.modes.conversation")),1)],2)])]),c.value==="list"?(L(),R("div",yz,[(L(!0),R(te,null,_e(d.value,F=>(L(),Ae($_,{key:F.id,word:F,language:e.targetLanguage,bilingual:y.value,"voice-speed":k.value},null,8,["word","language","bilingual","voice-speed"]))),128))])):c.value==="flashcard"?(L(),Ae(bk,{key:1,words:d.value,language:e.targetLanguage,bilingual:y.value,"voice-speed":k.value},null,8,["words","language","bilingual","voice-speed"])):c.value==="quiz"?(L(),Ae(oj,{key:2,words:d.value,language:e.targetLanguage,"chapter-id":l.value.id,onComplete:N},null,8,["words","language","chapter-id"])):c.value==="conversation"?(L(),Ae(Lj,{key:3,conversations:h.value,language:e.targetLanguage,bilingual:y.value,"voice-speed":k.value,"chapter-id":l.value.id,onBack:S},null,8,["conversations","language","bilingual","voice-speed","chapter-id"])):ae("",!0)],64)):(L(),R(te,{key:0},[u("h1",Vj,x(g(t)("learning.chooseChapter")),1),u("p",Kj,x(g(t)("learning.chapterDescription")),1),u("div",Gj,[(L(!0),R(te,null,_e(I.value,(F,q)=>(L(),R("div",{key:F.id,onClick:X=>P(F),class:Z(["flex items-center gap-4 p-4 rounded-2xl border-2 bg-surface-light dark:bg-surface-dark hover:border-primary dark:hover:border-primary cursor-pointer transition-all hover:scale-[1.01]",g(o)(F.id).complete?"border-green-400 dark:border-green-600":"border-slate-200 dark:border-slate-700"])},[u("div",{class:Z(["flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center",g(o)(F.id).complete?"bg-green-100 dark:bg-green-900/30":"bg-primary/10 dark:bg-primary/20"])},[g(o)(F.id).complete?(L(),R("span",Jj,"check_circle")):(L(),R("span",Qj,x(q+1),1))],2),u("span",Zj,x(F.icon),1),u("div",ez,[u("h3",nz,x(F.title),1),u("p",tz,x(F.description),1),u("div",rz,[u("span",{class:Z(["flex items-center gap-1 text-xs",g(o)(F.id).quiz?"text-green-600 dark:text-green-400":"text-text-muted dark:text-slate-500"])},[u("span",az,x(g(o)(F.id).quiz?"check_circle":"radio_button_unchecked"),1),Te(" "+x(g(t)("learning.progress.quiz")),1)],2),u("span",{class:Z(["flex items-center gap-1 text-xs",g(o)(F.id).conversation?"text-green-600 dark:text-green-400":"text-text-muted dark:text-slate-500"])},[u("span",oz,x(g(o)(F.id).conversation?"check_circle":"radio_button_unchecked"),1),Te(" "+x(g(t)("learning.progress.conversation")),1)],2)])]),u("div",iz,[u("span",sz,x(F.wordCount)+" "+x(g(t)("learning.words")),1)]),W[11]||(W[11]=u("span",{class:"material-symbols-outlined text-text-muted dark:text-slate-400"},"chevron_right",-1))],10,Xj))),128))]),I.value.length===0?(L(),R("div",lz,[W[12]||(W[12]=u("span",{class:"text-6xl block mb-4"},"📚",-1)),u("h3",cz,x(g(t)("learning.noChapters")),1),u("p",uz,x(g(t)("learning.noChaptersDescription")),1)])):ae("",!0)],64))]),(L(),Ae(Cr,{to:"body"},[f.value?(L(),R("div",{key:0,class:"fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4",onClick:Zn(_,["self"])},[u("div",vz,[u("div",xz,[W[17]||(W[17]=u("span",{class:"text-5xl block mb-4"},"💬",-1)),u("h3",bz,x(g(t)("learning.conversation.prompt.title")),1),u("p",wz,x(g(t)("learning.conversation.prompt.description")),1),u("div",_z,[u("button",{onClick:_,class:"flex-1 px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-text-main dark:text-white font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"},x(g(t)("learning.conversation.prompt.skip")),1),u("button",{onClick:w,class:"flex-1 px-4 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"},x(g(t)("learning.conversation.prompt.start")),1)])])])])):ae("",!0)]))]))}},jz={__name:"App",setup(e){const n=B("setup"),t=B(null),r=B(null),a=B("en"),o=B(null),i=B("free"),s=B(null),l=B("en"),c=B("ja"),d=B("en");function h({character:P,level:v,language:j,mode:N}){t.value=P,r.value=v,a.value=j,i.value=N||"free",N==="article"?n.value="articles":n.value="chat"}function f({level:P,targetLanguage:v,motherTongue:j,uiLanguage:N}){s.value=P,c.value=v,l.value=j||"en",d.value=N||"en",n.value="learning"}function y(P){o.value=P,n.value="chat"}function k(){n.value==="chat"&&i.value==="article"?(n.value="articles",o.value=null):n.value==="learning"?(n.value="setup",s.value=null):(n.value="setup",o.value=null,i.value="free")}function I(){n.value="setup",o.value=null,i.value="free",s.value=null}return(P,v)=>n.value==="setup"?(L(),Ae(Fg,{key:0,onStart:h,onStartLearning:f})):n.value==="articles"?(L(),Ae(sb,{key:1,level:r.value,onSelect:y,onBack:I},null,8,["level"])):n.value==="learning"?(L(),Ae(kz,{key:2,level:s.value,"target-language":c.value,"mother-tongue":l.value,"ui-language":d.value,onBack:k},null,8,["level","target-language","mother-tongue","ui-language"])):(L(),Ae(Yx,{key:3,character:t.value,level:r.value,language:a.value,article:o.value,mode:i.value,onBack:k},null,8,["character","level","language","article","mode"]))}},zz={title:"Chat Mate",subtitle:"Practice English with AI friends"},Iz={choosePartner:"Choose your chat partner",yourLevel:"Your English level",chooseMode:"Chat type",startChatting:"Start Chatting",startLearning:"Start Learning",motherTongue:"Your native language",targetLanguage:"I want to learn",learningLevel:"Choose your level",primaryModes:{chat:{name:"Chat Mode",description:"Practice conversation with AI friends"},learning:{name:"Learning Mode",description:"Study vocabulary with flashcards & quizzes"}},learningModeInfo:{title:"What's included?",flashcards:"Flashcards to memorize words",audio:"Audio pronunciation for each word",quiz:"Quiz mode to test your knowledge"},modes:{free:{name:"Free Chat",description:"Casual conversation"},article:{name:"Article",description:"Read & discuss"}}},Sz={typeMessage:"Type a message...",send:"Send",tryUsing:"Try using:",articleMode:"Article",rateLimitError:"I need a quick breather! Too many messages at once. Wait a few seconds and try again.",genericError:"Hmm, something went wrong. Let's try that again?"},Tz={title:"Choose an Article",levelLabel:"Level",keyWords:"Key words",noArticles:"No articles found for this level",categories:{all:"All",lifestyle:"Lifestyle",work:"Work",technology:"Technology",environment:"Environment"}},Az={beginner:{name:"Beginner",description:"Simple words"},intermediate:{name:"Intermediate",description:"Everyday talk"},advanced:{name:"Advanced",description:"Natural speech"}},Cz={emma:{tagline:"Loves coffee, cats & creativity"},marcus:{tagline:"Tech nerd exploring Tokyo"},sophia:{tagline:"Pastry chef with a Paris flair"},james:{tagline:"NYC journalist, jazz & coffee lover"},yuki:{tagline:"Osaka student, anime & food enthusiast"}},Ez={totalXP:"{xp} XP total",nextLevel:"Next level",maxLevel:"Max level reached!",messagesSent:"{count} messages sent",streak:"{count} day streak",days:"days",currentStreak:"{count} day streak",longestStreak:"Best: {count} days",levelUp:"Level Up!",continue:"Keep Learning!",streakBonus:"Streak Bonus!",streakMilestone:"{days} Day Streak!"},Lz={unlocked:"Achievement Unlocked!",continue:"Awesome!",categories:{first_steps:"First Steps",consistency:"Consistency",learning:"Learning",mastery:"Mastery"},first_chat:{title:"First Chat",description:"Send your first message",hint:"Start a conversation to unlock"},ice_breaker:{title:"Ice Breaker",description:"Send 10 messages",hint:"Send 10 messages to unlock"},chatterbox:{title:"Chatterbox",description:"Send 100 messages",hint:"Send 100 messages to unlock"},streak_3:{title:"Getting Started",description:"Achieve a 3-day streak",hint:"Practice 3 days in a row"},streak_7:{title:"Week Warrior",description:"Achieve a 7-day streak",hint:"Practice 7 days in a row"},streak_30:{title:"Month Master",description:"Achieve a 30-day streak",hint:"Practice 30 days in a row"},word_collector:{title:"Word Collector",description:"Learn 10 vocabulary words",hint:"Learn 10 new words"},bookworm:{title:"Bookworm",description:"Complete 5 articles",hint:"Finish reading 5 articles"},polyglot:{title:"Polyglot",description:"Chat with 3 different characters",hint:"Try talking to different AI friends"},level_beginner:{title:"Rising Star",description:"Reach Beginner rank",hint:"Earn 100 XP to unlock"},level_speaker:{title:"Fluent Speaker",description:"Reach Speaker rank",hint:"Earn 600 XP to unlock"},level_legend:{title:"Legend",description:"Reach Legend rank",hint:"Earn 5500 XP to unlock"}},Pz={novice:"Novice",beginner:"Beginner",learner:"Learner",speaker:"Speaker",conversationalist:"Conversationalist",fluent:"Fluent",advanced:"Advanced",expert:"Expert",master:"Master",legend:"Legend"},Nz={backToChapters:"Chapters",backToSetup:"Back",bilingual:"Bilingual",voiceSpeed:{normal:"Normal",slow:"Slow",word:"Word by Word"},chooseChapter:"Choose a Chapter",chapterDescription:"Select a chapter to start learning vocabulary",noChapters:"No Chapters Available",noChaptersDescription:"Add YAML files to the chapters folder to create new chapters",words:"words",categories:{travel:"Travel",food:"Food & Dining",work:"Work & Business",daily:"Daily Life",shopping:"Shopping"},modes:{list:"List",flashcard:"Flashcard",quiz:"Quiz",conversation:"Chat"},progress:{quiz:"Quiz",conversation:"Conversation"},audioNotAvailable:"Audio not available",listen:"Listen",tapToFlip:"Tap to flip",shuffle:"Shuffle",keyboardHints:"Use arrow keys to navigate, space to flip",question:"Question",whatMeans:"What does this word mean?",correct:"Correct!",incorrect:"Not quite...",nextQuestion:"Next Question",finishQuiz:"See Results",quizComplete:"Quiz Complete!",yourScore:"Here's how you did:",earned:"earned",reviewAnswers:"Review Answers",tryAgain:"Try Again",conversation:{title:"Practice Conversation",description:"Chat with {name} about {category} to practice using your new vocabulary!",practiceWith:"Vocabulary Practice",practiceDialogue:"Listen and practice the dialogue",selectDialogue:"Select a dialogue to practice",noConversations:"No conversations available for this chapter",messages:"messages",partner:"Partner",you:"You",playAudio:"Play audio",playAll:"Play All",stop:"Stop",practiceTip:"Practice Tip",practiceTipText:"Listen to each line, then try speaking it out loud. Repeat until you feel comfortable with the pronunciation.",wordsToUse:"Words you can use",more:"more",start:"Start Chatting",finish:"Finish",contextHint:"Topic: {category}",progress:"{current}/{min} messages - keep chatting!",prompt:{title:"Practice with Conversation?",description:"Want to practice using the words you just learned in a real conversation?",start:"Let's Chat!",skip:"Maybe Later"}}},Mz={app:zz,setup:Iz,chat:Sz,articles:Tz,levels:Az,characters:Cz,rank:Ez,achievements:Lz,ranks:Pz,learning:Nz},Oz={title:"Chat Mate",subtitle:"AIの友達と日本語を練習しよう"},Rz={choosePartner:"チャット相手を選ぶ",yourLevel:"あなたの日本語レベル",chooseMode:"チャットタイプ",startChatting:"チャットを始める",startLearning:"学習を始める",motherTongue:"母国語",targetLanguage:"学びたい言語",learningLevel:"レベルを選ぶ",primaryModes:{chat:{name:"チャットモード",description:"AI友達と会話を練習"},learning:{name:"学習モード",description:"単語帳とクイズで語彙を学ぶ"}},learningModeInfo:{title:"含まれる機能",flashcards:"単語を覚えるフラッシュカード",audio:"各単語の発音音声",quiz:"知識をテストするクイズ"},modes:{free:{name:"フリートーク",description:"自由に会話"},article:{name:"記事",description:"読んで話す"}}},$z={typeMessage:"メッセージを入力...",send:"送信",tryUsing:"使ってみよう:",articleMode:"記事",rateLimitError:"ちょっと休憩が必要！メッセージが多すぎました。少し待ってからもう一度試してください。",genericError:"うーん、何か問題が起きました。もう一度試してみましょう？"},Dz={title:"記事を選ぶ",levelLabel:"レベル",keyWords:"キーワード",noArticles:"このレベルの記事が見つかりません",categories:{all:"すべて",lifestyle:"ライフスタイル",work:"仕事",technology:"テクノロジー",environment:"環境"}},Fz={beginner:{name:"初級",description:"簡単な言葉"},intermediate:{name:"中級",description:"日常会話"},advanced:{name:"上級",description:"自然な会話"}},Wz={emma:{tagline:"コーヒー、猫、クリエイティブが大好き"},marcus:{tagline:"東京を探検するテック好き"},sophia:{tagline:"パリのパティシエ、お菓子作りが情熱"},james:{tagline:"NYジャーナリスト、ジャズとコーヒー好き"},yuki:{tagline:"大阪の大学生、アニメと食べ物が好き"}},Hz={totalXP:"合計 {xp} XP",nextLevel:"次のレベル",maxLevel:"最高レベル達成！",messagesSent:"{count} メッセージ送信",streak:"{count} 日連続",days:"日",currentStreak:"{count} 日連続",longestStreak:"最高: {count} 日",levelUp:"レベルアップ！",continue:"学習を続ける！",streakBonus:"連続ボーナス！",streakMilestone:"{days} 日連続達成！"},Uz={unlocked:"実績解除!",continue:"すごい!",categories:{first_steps:"はじめの一歩",consistency:"継続",learning:"学習",mastery:"マスタリー"},first_chat:{title:"初めてのチャット",description:"最初のメッセージを送信",hint:"会話を始めて解除"},ice_breaker:{title:"アイスブレイカー",description:"10通のメッセージを送信",hint:"10通のメッセージを送って解除"},chatterbox:{title:"おしゃべり",description:"100通のメッセージを送信",hint:"100通のメッセージを送って解除"},streak_3:{title:"スタート",description:"3日連続達成",hint:"3日連続で練習"},streak_7:{title:"ウィークウォリアー",description:"7日連続達成",hint:"7日連続で練習"},streak_30:{title:"マンスマスター",description:"30日連続達成",hint:"30日連続で練習"},word_collector:{title:"単語コレクター",description:"10個の単語を学習",hint:"10個の新しい単語を学ぶ"},bookworm:{title:"読書家",description:"5つの記事を完了",hint:"5つの記事を読み終える"},polyglot:{title:"ポリグロット",description:"3人のキャラクターとチャット",hint:"違うAI友達と話してみて"},level_beginner:{title:"ライジングスター",description:"ビギナーランクに到達",hint:"100 XPを獲得して解除"},level_speaker:{title:"流暢な話者",description:"話者ランクに到達",hint:"600 XPを獲得して解除"},level_legend:{title:"レジェンド",description:"レジェンドランクに到達",hint:"5500 XPを獲得して解除"}},Yz={novice:"初心者",beginner:"ビギナー",learner:"学習者",speaker:"話者",conversationalist:"会話上手",fluent:"流暢",advanced:"上級者",expert:"エキスパート",master:"マスター",legend:"レジェンド"},Bz={backToChapters:"チャプター",backToSetup:"戻る",bilingual:"2言語表示",voiceSpeed:{normal:"普通",slow:"ゆっくり",word:"単語ごと"},chooseChapter:"チャプターを選ぶ",chapterDescription:"学習したいチャプターを選んでください",noChapters:"チャプターがありません",noChaptersDescription:"chaptersフォルダにYAMLファイルを追加してチャプターを作成してください",words:"単語",categories:{travel:"旅行",food:"食べ物",work:"仕事",daily:"日常生活",shopping:"買い物"},modes:{list:"リスト",flashcard:"単語帳",quiz:"クイズ",conversation:"会話"},progress:{quiz:"クイズ",conversation:"会話"},audioNotAvailable:"音声がありません",listen:"聴く",tapToFlip:"タップで裏返す",shuffle:"シャッフル",keyboardHints:"矢印キーで移動、スペースで裏返す",question:"問題",whatMeans:"この単語の意味は？",correct:"正解！",incorrect:"残念...",nextQuestion:"次の問題",finishQuiz:"結果を見る",quizComplete:"クイズ完了！",yourScore:"あなたの結果：",earned:"獲得",reviewAnswers:"答えを確認",tryAgain:"もう一度",conversation:{title:"会話練習",description:"{name}と{category}について話して、覚えた単語を使ってみよう！",practiceWith:"語彙練習",practiceDialogue:"対話を聞いて練習しましょう",selectDialogue:"練習する対話を選んでください",noConversations:"このチャプターには会話がありません",messages:"メッセージ",partner:"相手",you:"あなた",playAudio:"音声を再生",playAll:"全て再生",stop:"停止",practiceTip:"練習のコツ",practiceTipText:"各セリフを聞いて、声に出して言ってみましょう。発音に慣れるまで繰り返し練習してください。",wordsToUse:"使える単語",more:"他にも",start:"チャットを始める",finish:"終了",contextHint:"トピック: {category}",progress:"{current}/{min} メッセージ - 続けてみよう！",prompt:{title:"会話で練習する？",description:"覚えた単語を実際の会話で使ってみませんか？",start:"話してみる！",skip:"また今度"}}},qz={app:Oz,setup:Rz,chat:$z,articles:Dz,levels:Fz,characters:Wz,rank:Hz,achievements:Uz,ranks:Yz,learning:Bz},Vz={title:"Chat Mate",subtitle:"和AI朋友一起練習中文"},Kz={choosePartner:"選擇聊天夥伴",yourLevel:"你的中文程度",chooseMode:"聊天類型",startChatting:"開始聊天",startLearning:"開始學習",motherTongue:"你的母語",targetLanguage:"我想學習",learningLevel:"選擇等級",primaryModes:{chat:{name:"聊天模式",description:"和AI朋友練習對話"},learning:{name:"學習模式",description:"用單字卡和測驗學習詞彙"}},learningModeInfo:{title:"包含功能",flashcards:"記憶單字的閃卡",audio:"每個單字的發音音檔",quiz:"測試知識的測驗"},modes:{free:{name:"自由聊天",description:"隨意交談"},article:{name:"文章",description:"閱讀討論"}}},Gz={typeMessage:"輸入訊息...",send:"發送",tryUsing:"試試用：",articleMode:"文章",rateLimitError:"我需要休息一下！訊息太多了。請等幾秒鐘再試。",genericError:"嗯，出了點問題。我們再試一次？"},Xz={title:"選擇文章",levelLabel:"等級",keyWords:"關鍵字",noArticles:"找不到該等級的文章",categories:{all:"全部",lifestyle:"生活方式",work:"工作",technology:"科技",environment:"環境"}},Jz={beginner:{name:"初級",description:"簡單詞彙"},intermediate:{name:"中級",description:"日常對話"},advanced:{name:"高級",description:"自然表達"}},Qz={emma:{tagline:"喜歡咖啡、貓和創意"},marcus:{tagline:"探索東京的科技迷"},sophia:{tagline:"有巴黎風情的糕點師"},james:{tagline:"紐約記者，愛爵士和咖啡"},yuki:{tagline:"大阪學生，動漫美食愛好者"}},Zz={totalXP:"共 {xp} XP",nextLevel:"下一等級",maxLevel:"已達最高等級！",messagesSent:"已發送 {count} 則訊息",streak:"連續 {count} 天",days:"天",currentStreak:"連續 {count} 天",longestStreak:"最高：{count} 天",levelUp:"升級了！",continue:"繼續學習！",streakBonus:"連續獎勵！",streakMilestone:"連續 {days} 天！"},e1={unlocked:"成就解鎖！",continue:"太棒了！",categories:{first_steps:"第一步",consistency:"堅持",learning:"學習",mastery:"精通"},first_chat:{title:"第一次聊天",description:"發送第一則訊息",hint:"開始對話解鎖"},ice_breaker:{title:"破冰者",description:"發送10則訊息",hint:"發送10則訊息解鎖"},chatterbox:{title:"話匣子",description:"發送100則訊息",hint:"發送100則訊息解鎖"},streak_3:{title:"良好開端",description:"達成3天連續",hint:"連續練習3天"},streak_7:{title:"一週戰士",description:"達成7天連續",hint:"連續練習7天"},streak_30:{title:"月度大師",description:"達成30天連續",hint:"連續練習30天"},word_collector:{title:"單字收集者",description:"學習10個詞彙",hint:"學習10個新單字"},bookworm:{title:"書蟲",description:"完成5篇文章",hint:"閱讀完成5篇文章"},polyglot:{title:"多語達人",description:"與3個不同角色聊天",hint:"嘗試和不同的AI朋友交流"},level_beginner:{title:"新星",description:"達到初學者等級",hint:"獲得100 XP解鎖"},level_speaker:{title:"流利說者",description:"達到說者等級",hint:"獲得600 XP解鎖"},level_legend:{title:"傳奇",description:"達到傳奇等級",hint:"獲得5500 XP解鎖"}},n1={novice:"新手",beginner:"初學者",learner:"學習者",speaker:"說者",conversationalist:"健談者",fluent:"流利",advanced:"進階者",expert:"專家",master:"大師",legend:"傳奇"},t1={backToChapters:"章節",backToSetup:"返回",bilingual:"雙語",voiceSpeed:{normal:"正常",slow:"慢速",word:"逐字"},chooseChapter:"選擇章節",chapterDescription:"選擇一個章節開始學習詞彙",noChapters:"沒有章節",noChaptersDescription:"在chapters資料夾中新增YAML檔案來建立新章節",words:"個單字",categories:{travel:"旅行",food:"美食",work:"工作",daily:"日常生活",shopping:"購物"},modes:{list:"列表",flashcard:"閃卡",quiz:"測驗",conversation:"對話"},progress:{quiz:"測驗",conversation:"對話"},audioNotAvailable:"音檔不可用",listen:"聽",tapToFlip:"點擊翻轉",shuffle:"打亂",keyboardHints:"使用方向鍵導航，空白鍵翻轉",question:"問題",whatMeans:"這個字是什麼意思？",correct:"正確！",incorrect:"不太對...",nextQuestion:"下一題",finishQuiz:"查看結果",quizComplete:"測驗完成！",yourScore:"你的成績：",earned:"獲得",reviewAnswers:"查看答案",tryAgain:"再試一次",conversation:{title:"對話練習",description:"和{name}聊聊{category}，練習使用你學過的詞彙！",practiceWith:"詞彙練習",practiceDialogue:"聽對話並練習",selectDialogue:"選擇一個對話來練習",noConversations:"這個章節沒有對話",messages:"則訊息",partner:"夥伴",you:"你",playAudio:"播放音檔",playAll:"全部播放",stop:"停止",practiceTip:"練習提示",practiceTipText:"聽每一句，然後大聲朗讀。反覆練習直到發音流利。",wordsToUse:"可用的詞彙",more:"更多",start:"開始聊天",finish:"完成",contextHint:"話題：{category}",progress:"{current}/{min} 則訊息 - 繼續聊！",prompt:{title:"用對話練習？",description:"想在真實對話中使用你剛學的詞彙嗎？",start:"開始聊！",skip:"下次再說"}}},r1={app:Vz,setup:Kz,chat:Gz,articles:Xz,levels:Jz,characters:Qz,rank:Zz,achievements:e1,ranks:n1,learning:t1},a1=localStorage.getItem("chatmate_locale")||"en",o1=dm({legacy:!1,locale:a1,fallbackLocale:"en",messages:{en:Mz,ja:qz,zh:r1}});xf(jz).use(o1).mount("#app");
