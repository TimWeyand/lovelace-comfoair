function e(e,t,i,s){var n,r=arguments.length,o=r<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(n=e[a])&&(o=(r<3?n(o):r>3?n(t,i,o):n(t,i))||o);return r>3&&o&&Object.defineProperty(t,i,o),o}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,i=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),n=new WeakMap;class r{constructor(e,t,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(i&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=n.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&n.set(t,e))}return e}toString(){return this.cssText}}const o=(e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,i,s)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[s+1],e[0]);return new r(i,e,s)},a=i?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new r("string"==typeof e?e:e+"",void 0,s))(t)})(e):e,{is:l,defineProperty:c,getOwnPropertyDescriptor:d,getOwnPropertyNames:p,getOwnPropertySymbols:h,getPrototypeOf:u}=Object,m=globalThis,f=m.trustedTypes,_=f?f.emptyScript:"",g=m.reactiveElementPolyfillSupport,b=(e,t)=>e,v={toAttribute(e,t){switch(t){case Boolean:e=e?_:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},y=(e,t)=>!l(e,t),$={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:y};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),m.litPropertyMetadata??=new WeakMap;class x extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=$){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(e,i,t);void 0!==s&&c(this.prototype,e,s)}}static getPropertyDescriptor(e,t,i){const{get:s,set:n}=d(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:s,set(t){const r=s?.call(this);n?.call(this,t),this.requestUpdate(e,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??$}static _$Ei(){if(this.hasOwnProperty(b("elementProperties")))return;const e=u(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(b("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(b("properties"))){const e=this.properties,t=[...p(e),...h(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(a(e))}else void 0!==e&&t.push(a(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,s)=>{if(i)e.adoptedStyleSheets=s.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const i of s){const s=document.createElement("style"),n=t.litNonce;void 0!==n&&s.setAttribute("nonce",n),s.textContent=i.cssText,e.appendChild(s)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,i);if(void 0!==s&&!0===i.reflect){const n=(void 0!==i.converter?.toAttribute?i.converter:v).toAttribute(t,i.type);this._$Em=e,null==n?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(e,t){const i=this.constructor,s=i._$Eh.get(e);if(void 0!==s&&this._$Em!==s){const e=i.getPropertyOptions(s),n="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:v;this._$Em=s;const r=n.fromAttribute(t,e.type);this[s]=r??this._$Ej?.get(s)??r,this._$Em=null}}requestUpdate(e,t,i,s=!1,n){if(void 0!==e){const r=this.constructor;if(!1===s&&(n=this[e]),i??=r.getPropertyOptions(e),!((i.hasChanged??y)(n,t)||i.useDefault&&i.reflect&&n===this._$Ej?.get(e)&&!this.hasAttribute(r._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:s,wrapped:n},r){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,r??t??this[e]),!0!==n||void 0!==r)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===s&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,s=this[t];!0!==e||this._$AL.has(t)||void 0===s||this.C(t,void 0,i,s)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}}x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[b("elementProperties")]=new Map,x[b("finalized")]=new Map,g?.({ReactiveElement:x}),(m.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w=globalThis,A=e=>e,S=w.trustedTypes,C=S?S.createPolicy("lit-html",{createHTML:e=>e}):void 0,E="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,M="?"+k,N=`<${M}>`,P=document,O=()=>P.createComment(""),U=e=>null===e||"object"!=typeof e&&"function"!=typeof e,T=Array.isArray,z="[ \t\n\f\r]",R=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,H=/-->/g,F=/>/g,L=RegExp(`>|${z}(?:([^\\s"'>=/]+)(${z}*=${z}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),j=/'/g,B=/"/g,I=/^(?:script|style|textarea|title)$/i,D=e=>(t,...i)=>({_$litType$:e,strings:t,values:i}),W=D(1),q=D(2),V=Symbol.for("lit-noChange"),G=Symbol.for("lit-nothing"),Z=new WeakMap,K=P.createTreeWalker(P,129);function Q(e,t){if(!T(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==C?C.createHTML(t):t}const J=(e,t)=>{const i=e.length-1,s=[];let n,r=2===t?"<svg>":3===t?"<math>":"",o=R;for(let t=0;t<i;t++){const i=e[t];let a,l,c=-1,d=0;for(;d<i.length&&(o.lastIndex=d,l=o.exec(i),null!==l);)d=o.lastIndex,o===R?"!--"===l[1]?o=H:void 0!==l[1]?o=F:void 0!==l[2]?(I.test(l[2])&&(n=RegExp("</"+l[2],"g")),o=L):void 0!==l[3]&&(o=L):o===L?">"===l[0]?(o=n??R,c=-1):void 0===l[1]?c=-2:(c=o.lastIndex-l[2].length,a=l[1],o=void 0===l[3]?L:'"'===l[3]?B:j):o===B||o===j?o=L:o===H||o===F?o=R:(o=L,n=void 0);const p=o===L&&e[t+1].startsWith("/>")?" ":"";r+=o===R?i+N:c>=0?(s.push(a),i.slice(0,c)+E+i.slice(c)+k+p):i+k+(-2===c?t:p)}return[Q(e,r+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),s]};class Y{constructor({strings:e,_$litType$:t},i){let s;this.parts=[];let n=0,r=0;const o=e.length-1,a=this.parts,[l,c]=J(e,t);if(this.el=Y.createElement(l,i),K.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(s=K.nextNode())&&a.length<o;){if(1===s.nodeType){if(s.hasAttributes())for(const e of s.getAttributeNames())if(e.endsWith(E)){const t=c[r++],i=s.getAttribute(e).split(k),o=/([.?@])?(.*)/.exec(t);a.push({type:1,index:n,name:o[2],strings:i,ctor:"."===o[1]?se:"?"===o[1]?ne:"@"===o[1]?re:ie}),s.removeAttribute(e)}else e.startsWith(k)&&(a.push({type:6,index:n}),s.removeAttribute(e));if(I.test(s.tagName)){const e=s.textContent.split(k),t=e.length-1;if(t>0){s.textContent=S?S.emptyScript:"";for(let i=0;i<t;i++)s.append(e[i],O()),K.nextNode(),a.push({type:2,index:++n});s.append(e[t],O())}}}else if(8===s.nodeType)if(s.data===M)a.push({type:2,index:n});else{let e=-1;for(;-1!==(e=s.data.indexOf(k,e+1));)a.push({type:7,index:n}),e+=k.length-1}n++}}static createElement(e,t){const i=P.createElement("template");return i.innerHTML=e,i}}function X(e,t,i=e,s){if(t===V)return t;let n=void 0!==s?i._$Co?.[s]:i._$Cl;const r=U(t)?void 0:t._$litDirective$;return n?.constructor!==r&&(n?._$AO?.(!1),void 0===r?n=void 0:(n=new r(e),n._$AT(e,i,s)),void 0!==s?(i._$Co??=[])[s]=n:i._$Cl=n),void 0!==n&&(t=X(e,n._$AS(e,t.values),n,s)),t}class ee{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,s=(e?.creationScope??P).importNode(t,!0);K.currentNode=s;let n=K.nextNode(),r=0,o=0,a=i[0];for(;void 0!==a;){if(r===a.index){let t;2===a.type?t=new te(n,n.nextSibling,this,e):1===a.type?t=new a.ctor(n,a.name,a.strings,this,e):6===a.type&&(t=new oe(n,this,e)),this._$AV.push(t),a=i[++o]}r!==a?.index&&(n=K.nextNode(),r++)}return K.currentNode=P,s}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class te{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,s){this.type=2,this._$AH=G,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=X(this,e,t),U(e)?e===G||null==e||""===e?(this._$AH!==G&&this._$AR(),this._$AH=G):e!==this._$AH&&e!==V&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>T(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==G&&U(this._$AH)?this._$AA.nextSibling.data=e:this.T(P.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,s="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=Y.createElement(Q(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(t);else{const e=new ee(s,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=Z.get(e.strings);return void 0===t&&Z.set(e.strings,t=new Y(e)),t}k(e){T(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,s=0;for(const n of e)s===t.length?t.push(i=new te(this.O(O()),this.O(O()),this,this.options)):i=t[s],i._$AI(n),s++;s<t.length&&(this._$AR(i&&i._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=A(e).nextSibling;A(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ie{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,s,n){this.type=1,this._$AH=G,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=G}_$AI(e,t=this,i,s){const n=this.strings;let r=!1;if(void 0===n)e=X(this,e,t,0),r=!U(e)||e!==this._$AH&&e!==V,r&&(this._$AH=e);else{const s=e;let o,a;for(e=n[0],o=0;o<n.length-1;o++)a=X(this,s[i+o],t,o),a===V&&(a=this._$AH[o]),r||=!U(a)||a!==this._$AH[o],a===G?e=G:e!==G&&(e+=(a??"")+n[o+1]),this._$AH[o]=a}r&&!s&&this.j(e)}j(e){e===G?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class se extends ie{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===G?void 0:e}}class ne extends ie{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==G)}}class re extends ie{constructor(e,t,i,s,n){super(e,t,i,s,n),this.type=5}_$AI(e,t=this){if((e=X(this,e,t,0)??G)===V)return;const i=this._$AH,s=e===G&&i!==G||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,n=e!==G&&(i===G||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class oe{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){X(this,e)}}const ae=w.litHtmlPolyfillSupport;ae?.(Y,te),(w.litHtmlVersions??=[]).push("3.3.3");const le=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class ce extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const s=i?.renderBefore??t;let n=s._$litPart$;if(void 0===n){const e=i?.renderBefore??null;s._$litPart$=n=new te(t.insertBefore(O(),e),e,void 0,i??{})}return n._$AI(e),n})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return V}}ce._$litElement$=!0,ce.finalized=!0,le.litElementHydrateSupport?.({LitElement:ce});const de=le.litElementPolyfillSupport;de?.({LitElement:ce}),(le.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const pe=e=>(t,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},he={attribute:!0,type:String,converter:v,reflect:!1,hasChanged:y},ue=(e=he,t,i)=>{const{kind:s,metadata:n}=i;let r=globalThis.litPropertyMetadata.get(n);if(void 0===r&&globalThis.litPropertyMetadata.set(n,r=new Map),"setter"===s&&((e=Object.create(e)).wrapped=!0),r.set(i.name,e),"accessor"===s){const{name:s}=i;return{set(i){const n=t.get.call(this);t.set.call(this,i),this.requestUpdate(s,n,e,!0,i)},init(t){return void 0!==t&&this.C(s,void 0,e,t),t}}}if("setter"===s){const{name:s}=i;return function(i){const n=this[s];t.call(this,i),this.requestUpdate(s,n,e,!0,i)}}throw Error("Unsupported decorator location: "+s)};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function me(e){return(t,i)=>"object"==typeof i?ue(e,t,i):((e,t,i)=>{const s=t.hasOwnProperty(i);return t.constructor.createProperty(i,e),s?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function fe(e){return me({...e,state:!0,attribute:!1})}var _e,ge;!function(e){e.language="language",e.system="system",e.comma_decimal="comma_decimal",e.decimal_comma="decimal_comma",e.space_comma="space_comma",e.none="none"}(_e||(_e={})),function(e){e.language="language",e.system="system",e.am_pm="12",e.twenty_four="24"}(ge||(ge={}));var be=function(e,t,i,s){s=s||{},i=null==i?{}:i;var n=new Event(t,{bubbles:void 0===s.bubbles||s.bubbles,cancelable:Boolean(s.cancelable),composed:void 0===s.composed||s.composed});return n.detail=i,e.dispatchEvent(n),n};const ve="mqttcomfoair-card",ye="mqttcomfoair-card-editor",$e=[{mode:"off",icon:"mdi:fan-off"},{mode:"low",icon:"mdi:fan-speed-1"},{mode:"medium",icon:"mdi:fan-speed-2"},{mode:"high",icon:"mdi:fan-speed-3"}],xe=["entity","tempSensor1","tempSensor2","tempSensor3","tempSensor4","filterstatus","bypass_valve","summer_mode","preheat","fan_speed_supply","fan_speed_exhaust","return_air_level","supply_air_level"],we={en:{invalid_config:"Invalid configuration",no_entity:"No climate entity defined",detected:"entities detected",advanced:"Advanced / manual mapping",default_name:"Ventilation",heat_recovery:"Heat recovery",show_history:"Show history",colder:"colder",warmer:"warmer",outside_air:"Outside air",return_air:"Return air",exhaust_air:"Exhaust air",supply_air:"Supply air",fan_off:"Off",fan_low:"Low",fan_medium:"Medium",fan_high:"High",chip_fan:"Fan",chip_filter:"Filter",chip_bypass:"Bypass",chip_preheating:"Preheating",chip_summer:"Summer",chip_winter:"Winter",state_off:"Off",state_active:"Active",filter_replace:"Replace",filter_ok:"OK",bypass_open:"Open",bypass_closed:"Closed",label_entity:"CA350/550 climate entity (required)",label_animation:"Animation",label_animation_speed_source:"Speed source",label_animation_speed:"Fixed speed (%)",label_color_scale:"Color scale",label_temp_min:"Fixed scale – min (°C)",label_temp_max:"Fixed scale – max (°C)",label_show_legend:"Show temperature scale",label_name:"Name (optional)",label_tempSensor1:"Outside air temperature",label_tempSensor2:"Exhaust air temperature",label_tempSensor3:"Return air temperature",label_tempSensor4:"Supply air temperature",label_filterstatus:"Filter status",label_bypass_valve:"Bypass valve",label_summer_mode:"Summer mode",label_preheat:"Preheating",label_fan_speed_supply:"Supply fan speed",label_fan_speed_exhaust:"Exhaust fan speed",label_return_air_level:"Return air level",label_supply_air_level:"Supply air level",opt_animated:"Animated (airflow + fans)",opt_static:"Static",opt_speed_fixed:"Fixed speed (%)",opt_speed_level:"By air volume (supply/return %)",opt_scale_auto:"Auto (current values)",opt_scale_fixed:"Fixed (manual range)"},de:{invalid_config:"Ungültige Konfiguration",no_entity:"Keine climate-Entity ausgewählt",detected:"Entities erkannt",advanced:"Erweitert / manuelle Zuordnung",default_name:"Wohnraumlüftung",heat_recovery:"Rückgewinnung",show_history:"Verlauf anzeigen",colder:"kälter",warmer:"wärmer",outside_air:"Außenluft",return_air:"Abluft",exhaust_air:"Fortluft",supply_air:"Zuluft",fan_off:"Aus",fan_low:"Stufe 1",fan_medium:"Stufe 2",fan_high:"Stufe 3",chip_fan:"Lüfter",chip_filter:"Filter",chip_bypass:"Bypass",chip_preheating:"Vorheizen",chip_summer:"Sommer",chip_winter:"Winter",state_off:"Aus",state_active:"Aktiv",filter_replace:"Wechseln",filter_ok:"OK",bypass_open:"Offen",bypass_closed:"Zu",label_entity:"CA350/550 Climate-Entity (Pflicht)",label_animation:"Animation",label_animation_speed_source:"Tempo-Quelle",label_animation_speed:"Festes Tempo (%)",label_color_scale:"Farbskala",label_temp_min:"Feste Skala – Min (°C)",label_temp_max:"Feste Skala – Max (°C)",label_show_legend:"Temperaturskala einblenden",label_name:"Name (optional)",label_tempSensor1:"Außentemperatur",label_tempSensor2:"Fortlufttemperatur",label_tempSensor3:"Rücklufttemperatur",label_tempSensor4:"Zulufttemperatur",label_filterstatus:"Filterstatus",label_bypass_valve:"Bypass-Ventil",label_summer_mode:"Sommermodus",label_preheat:"Vorheizregister",label_fan_speed_supply:"Lüfterdrehzahl Zuluft",label_fan_speed_exhaust:"Lüfterdrehzahl Fortluft",label_return_air_level:"Rückluft-Stufe",label_supply_air_level:"Zuluft-Stufe",opt_animated:"Animiert (Luftströme + Lüfter)",opt_static:"Statisch",opt_speed_fixed:"Festes Tempo (%)",opt_speed_level:"Nach Luftmenge (Supply/Return %)",opt_scale_auto:"Auto (aktuelle Werte)",opt_scale_fixed:"Fest (manueller Bereich)"},nb:{invalid_config:"Ikke gyldig konfigurasjon",no_entity:"Ingen climate-enhet valgt",detected:"enheter funnet",advanced:"Avansert / manuell tilordning"}};function Ae(e,t){let i=(t||"en").replace(/['"]+/g,"").split("-")[0].toLowerCase();return we[i]||(i="en"),we[i][e]??we.en[e]??e}function Se(e,t){const i={off:"fan_off",low:"fan_low",medium:"fan_medium",high:"fan_high"}[(e??"").toLowerCase()];return i?Ae(i,t):e??""}function Ce(e,t){if(e&&t)return e.states?e.states[t]:void 0}function Ee(e,t){const i=Ce(e,t);return i&&"unavailable"!==i.state&&"unknown"!==i.state&&""!==i.state?i.state:"—"}function ke(e,t){const i=Ce(e,t);if(!i)return;const s=parseFloat(i.state);return Number.isNaN(s)?void 0:s}const Me=(e,t,i)=>e+(t-e)*i,Ne=[[.6,.16,252],[.72,.13,215],[.8,.14,155],[.82,.16,95],[.66,.19,45],[.5,.205,28]];function Pe(e){const t=Ne,i=(e=>Math.min(1,Math.max(0,e)))(e),s=i*(t.length-1),n=Math.min(t.length-2,Math.floor(s)),r=s-n,o=Me(t[n][0],t[n+1][0],r),a=Me(t[n][1],t[n+1][1],r),l=Me(t[n][2],t[n+1][2],r);return`oklch(${o.toFixed(3)} ${a.toFixed(3)} ${l.toFixed(1)})`}function Oe(e,t,i,s){const n="on"===t;switch(e){case"fan":{const e=(i??"off").toLowerCase();return{icon:"mdi:fan",label:Ae("chip_fan",s),sub:Se(e,s),active:"off"!==e,color:"#03a9f4"}}case"filter":return{icon:"mdi:air-filter",label:Ae("chip_filter",s),sub:Ae(n?"filter_replace":"filter_ok",s),active:n,color:"#f5a623"};case"bypass":return{icon:"mdi:valve",label:Ae("chip_bypass",s),sub:Ae(n?"bypass_open":"bypass_closed",s),active:n,color:"#36c46b"};case"preheat":return{icon:"mdi:radiator",label:Ae("chip_preheating",s),sub:Ae(n?"state_active":"state_off",s),active:n,color:"#ff7043"};case"season":return n?{icon:"mdi:weather-sunny",label:Ae("chip_summer",s),sub:"",active:!0,color:"#ffb300"}:{icon:"mdi:snowflake",label:Ae("chip_winter",s),sub:"",active:!0,color:"#4fc3f7"}}}const Ue=e=>"temperature"===e.attributes?.device_class,Te=e=>"rpm"===e.attributes?.unit_of_measurement,ze=e=>"%"===e.attributes?.unit_of_measurement,Re=()=>!0,He=[{field:"tempSensor1",domain:"sensor",predicate:Ue,keywords:["outside","outdoor","außen","aussen"]},{field:"tempSensor2",domain:"sensor",predicate:Ue,keywords:["exhaust","fortluft","abluft"]},{field:"tempSensor3",domain:"sensor",predicate:Ue,keywords:["return","extract","rückluft","rueckluft"]},{field:"tempSensor4",domain:"sensor",predicate:Ue,keywords:["supply","zuluft"]},{field:"filterstatus",domain:"binary_sensor",predicate:Re,keywords:["filter"]},{field:"bypass_valve",domain:"binary_sensor",predicate:Re,keywords:["bypass"]},{field:"summer_mode",domain:"binary_sensor",predicate:Re,keywords:["summer","sommer"]},{field:"preheat",domain:"binary_sensor",predicate:Re,keywords:["preheat","preheating","vorheiz"]},{field:"fan_speed_supply",domain:"sensor",predicate:Te,keywords:["supply","zuluft"]},{field:"fan_speed_exhaust",domain:"sensor",predicate:Te,keywords:["exhaust","fortluft","abluft"]},{field:"return_air_level",domain:"sensor",predicate:ze,keywords:["return","extract","rückluft","rueckluft"]},{field:"supply_air_level",domain:"sensor",predicate:ze,keywords:["supply","zuluft"]}];function Fe(e,t){if(!e||!t)return{};let i=[];const s=e.entities?.[t]?.device_id??void 0;if(s&&e.entities&&(i=Object.keys(e.entities).filter(t=>e.entities[t].device_id===s)),0===i.length){const s=function(e){const t=e.split(".")[1]??"";return t.replace(/_climate$/,"")||t}(t);i=Object.keys(e.states).filter(e=>e.startsWith(`sensor.${s}_`)||e.startsWith(`binary_sensor.${s}_`))}const n={};for(const t of He){const s=i.filter(i=>{if(!i.startsWith(`${t.domain}.`))return!1;const s=e.states[i];if(!s||!t.predicate(s))return!1;const n=`${i} ${String(s.attributes?.friendly_name??"")}`.toLowerCase();return t.keywords.some(e=>n.includes(e))});if(s.length){const e=s.reduce((e,t)=>t.length<e.length?t:e);n[t.field]=e}}return n}const Le=[{name:"name",selector:{text:{}}},{name:"tempSensor1",selector:{entity:{domain:"sensor",device_class:"temperature"}}},{name:"tempSensor2",selector:{entity:{domain:"sensor",device_class:"temperature"}}},{name:"tempSensor3",selector:{entity:{domain:"sensor",device_class:"temperature"}}},{name:"tempSensor4",selector:{entity:{domain:"sensor",device_class:"temperature"}}},{name:"filterstatus",selector:{entity:{domain:"binary_sensor"}}},{name:"bypass_valve",selector:{entity:{domain:"binary_sensor"}}},{name:"summer_mode",selector:{entity:{domain:"binary_sensor"}}},{name:"preheat",selector:{entity:{domain:"binary_sensor"}}},{name:"fan_speed_supply",selector:{entity:{domain:"sensor"}}},{name:"fan_speed_exhaust",selector:{entity:{domain:"sensor"}}},{name:"return_air_level",selector:{entity:{domain:"sensor"}}},{name:"supply_air_level",selector:{entity:{domain:"sensor"}}}];let je=class extends ce{constructor(){super(...arguments),this._detectedCount=0,this._label=e=>Ae(`label_${e.name}`,this.hass?.language)}setConfig(e){this._config=e}_mainSchema(){const e=this._config,t=this.hass?.language,i=[{name:"entity",required:!0,selector:{entity:{domain:"climate"}}},{name:"animation",selector:{select:{options:[{value:"animated",label:Ae("opt_animated",t)},{value:"static",label:Ae("opt_static",t)}]}}}];return"animated"===e.animation&&(i.push({name:"animation_speed_source",selector:{select:{options:[{value:"fixed",label:Ae("opt_speed_fixed",t)},{value:"level",label:Ae("opt_speed_level",t)}]}}}),"level"!==e.animation_speed_source&&i.push({name:"animation_speed",selector:{number:{min:10,max:200,step:10,unit_of_measurement:"%",mode:"slider"}}})),i.push({name:"color_scale",selector:{select:{options:[{value:"auto",label:Ae("opt_scale_auto",t)},{value:"fixed",label:Ae("opt_scale_fixed",t)}]}}}),"fixed"===e.color_scale&&i.push({name:"temp_min",selector:{number:{min:-30,max:20,step:1,unit_of_measurement:"°C",mode:"box"}}},{name:"temp_max",selector:{number:{min:0,max:50,step:1,unit_of_measurement:"°C",mode:"box"}}}),i.push({name:"show_legend",selector:{boolean:{}}}),i}render(){return this.hass&&this._config?W`
      <div class="editor">
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${this._mainSchema()}
          .computeLabel=${this._label}
          @value-changed=${this._mainChanged}
        ></ha-form>
        ${this._detectedCount>0?W`<div class="hint">✓ ${this._detectedCount} ${Ae("detected",this.hass.language)}</div>`:""}
        <ha-expansion-panel outlined>
          <span slot="header">${Ae("advanced",this.hass.language)}</span>
          <ha-form
            .hass=${this.hass}
            .data=${this._config}
            .schema=${Le}
            .computeLabel=${this._label}
            @value-changed=${this._advancedChanged}
          ></ha-form>
        </ha-expansion-panel>
      </div>
    `:W``}_mainChanged(e){e.stopPropagation();const t=e.detail.value,i=t.entity??"",s=!!i&&i!==this._config.entity;let n={...this._config,...t};if(s){const e=n;for(const t of xe)"entity"!==t&&delete e[t];const t=Fe(this.hass,i);n={...n,...t},this._detectedCount=Object.keys(t).length}this._emit(n)}_advancedChanged(e){e.stopPropagation(),this._emit({...this._config,...e.detail.value})}_emit(e){this._config=e,be(this,"config-changed",{config:e})}static get styles(){return o`
      .hint { color: var(--success-color, #43a047); padding: 4px 0 8px; font-size: 0.9em; }
      ha-form { display: block; }
      ha-expansion-panel { margin-top: 8px; }
    `}};e([me({attribute:!1})],je.prototype,"hass",void 0),e([fe()],je.prototype,"_config",void 0),e([fe()],je.prototype,"_detectedCount",void 0),je=e([pe(ye)],je),console.info("%c MQTT-COMFOAIR-CARD %c 0.16.3 ","color:orange;font-weight:bold;background:black","color:white;font-weight:bold;background:dimgray"),window.customCards=window.customCards||[],window.customCards.push({type:ve,name:"MQTT Comfoair Card",preview:!1,description:"Control a CA350/550 ventilation unit (hacomfoairmqtt) via MQTT."});const Be="M6,19 H120 L320,113 H434",Ie="M434,19 H320 L120,113 H6";let De=class extends ce{static async getConfigElement(){return document.createElement(ye)}static getStubConfig(e){if(!e)return{entity:""};const t=Object.keys(e.states).find(e=>e.startsWith("climate.")&&/comfo|ca\d{3}|wtw/i.test(e));return t?{entity:t,animation:"static",animation_speed_source:"fixed",animation_speed:50,color_scale:"auto",temp_min:-10,temp_max:30,...Fe(e,t)}:{entity:""}}setConfig(e){if(!e)throw new Error(Ae("invalid_config",this.hass?.language));this._config=e}getCardSize(){return 5}shouldUpdate(e){if(e.has("_config"))return!0;const t=e.get("hass");if(!t||!this._config)return!0;const i=this._config,s=xe.map(e=>i[e]).filter(e=>!!e);return s.some(e=>t.states[e]!==this.hass.states[e])}render(){if(!this.hass||!this._config)return W``;const e=this._config,t=this.hass,i=this.hass.language,s=Ce(t,e.entity);if(!s)return W`<ha-card>
        <hui-warning>${Ae("no_entity",this.hass.language)}: ${e.entity||"—"}</hui-warning>
      </ha-card>`;const n=s.attributes.fan_mode,r=n?.toLowerCase(),o=s.attributes.temperature,a="animated"===e.animation,l="fixed"===e.color_scale?"fixed":"auto",c=!!r&&"off"!==r,d=ke(t,e.tempSensor1),p=ke(t,e.tempSensor2),h=ke(t,e.tempSensor3),u=ke(t,e.tempSensor4),m=function(e,t="auto",i=-10,s=30){if("fixed"===t)return[i,s];const n=e.filter(e=>null!=e&&!Number.isNaN(e));if(0===n.length)return[i,s];let r=Math.min(...n),o=Math.max(...n);if(o-r<4){const e=(o+r)/2;r=e-2,o=e+2}const a=.12*(o-r);return[r-a,o+a]}([d,p,h,u],l,Number.isFinite(Number(e.temp_min))?Number(e.temp_min):-10,Number.isFinite(Number(e.temp_max))?Number(e.temp_max):30),[f,_,g,b]=[d,p,h,u].map(e=>function(e,t){if(null==e||Number.isNaN(e))return"var(--disabled-text-color, #888)";const[i,s]=t;return Pe((e-i)/(s-i||1))}(e,m));let v=1,y=1;if(a){const i="level"===e.animation_speed_source?"level":"fixed";v=We(t,e,i,e.supply_air_level),y=We(t,e,i,e.return_air_level)}const $=(3/v).toFixed(1),x=(3/y).toFixed(1),w=Ce(t,e.bypass_valve)?.state,A="on"===w?null:function(e,t,i){if(null==e||null==t||null==i)return null;const s=t-e;if(s<=.5)return null;const n=(i-e)/s;return n<=0?null:Math.round(100*Math.min(1,n))}(d,h,u),S=[Oe("fan",void 0,n,i),Oe("filter",Ce(t,e.filterstatus)?.state,void 0,i),Oe("bypass",w,void 0,i),Oe("preheat",Ce(t,e.preheat)?.state,void 0,i),Oe("season",Ce(t,e.summer_mode)?.state,void 0,i)],C=e=>e.replace(".",","),E=(e,s)=>W`<div class="tempbadge ${s?"clickable":""}" style=${`--fg:${e};--bd:color-mix(in srgb, ${e} 45%, transparent);--bg:color-mix(in srgb, ${e} 14%, transparent)`} @click=${()=>this._moreInfo(s)} title=${s?Ae("show_history",i):""}><span class="v">${C(Ee(t,s))}</span><span class="u">°C</span></div>`,k=(e,i)=>{const s=ke(t,e)??0,n=a&&c&&s>0;return W`<div class="subt ${e?"clickable":""}" @click=${()=>this._moreInfo(e)}>
        <ha-icon class=${n?"spinico spin":"spinico"} style=${n?`animation-duration:${(1.6/i).toFixed(2)}s`:""} icon="mdi:fan"></ha-icon>
        <span>${Ee(t,e)}</span>&nbsp;rpm
      </div>`},M=e=>W`<div class="subt ${e?"clickable":""}" @click=${()=>this._moreInfo(e)}>
        <ha-icon icon="mdi:gauge"></ha-icon><span>${Ee(t,e)}</span>&nbsp;%
      </div>`,N=(e,t,i=!1)=>W`<div class="lbl ${i?"rev":""}"><ha-icon icon=${e}></ha-icon>${t}</div>`,P=W`
      <div class="hub corehub">
        <div class="setpc">
          <button @click=${()=>this._stepTemp(-1)} aria-label=${Ae("colder",i)}>−</button>
          <div class="val">${null!=o?C(String(o)):"—"}<small>°C</small></div>
          <button @click=${()=>this._stepTemp(1)} aria-label=${Ae("warmer",i)}>+</button>
        </div>
        <div class="fanrow">
          ${$e.map(e=>W`<button
              class=${function(e,t){return!!e&&e.toLowerCase()===t.toLowerCase()}(n,e.mode)?"on":""}
              title=${e.mode}
              @click=${()=>this._setFan(e.mode)}
            ><ha-icon icon=${e.icon}></ha-icon></button>`)}
        </div>
      </div>`;return W`
      <ha-card class=${a?"animated":""}>
        <div class="hd">
          <div class="ic"><ha-icon icon="mdi:hvac"></ha-icon></div>
          <div>
            <div class="ttl">${e.name||Ae("default_name",i)}</div>
            <div class="st"><span class="dot ${c?"live":""}"></span><span>${r?Se(n,i):"—"}</span></div>
          </div>
          <div class="grow"></div>
          <div class="recov">
            ${null!=A?W`<b>${A}%</b><span>${Ae("heat_recovery",i)}</span>`:""}
          </div>
        </div>

        <div class="lanes">
          <div class="trow top">
            <div class="tcell l">${k(e.fan_speed_supply,v)}${E(f,e.tempSensor1)}${N("mdi:tree-outline",Ae("outside_air",i))}</div>
            <div></div>
            <div class="tcell r">${M(e.return_air_level)}${E(g,e.tempSensor3)}${N("mdi:home-thermometer-outline",Ae("return_air",i),!0)}</div>
          </div>

          <div class="flowband">
            <svg class="airsvg" viewBox="0 0 440 132" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
              <defs>
                <linearGradient id="gSupply" x1="6" y1="19" x2="434" y2="113" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stop-color=${f}></stop><stop offset="100%" stop-color=${b}></stop>
                </linearGradient>
                <linearGradient id="gExhaust" x1="434" y1="19" x2="6" y2="113" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stop-color=${g}></stop><stop offset="100%" stop-color=${_}></stop>
                </linearGradient>
                <filter id="soft" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="4.5"></feGaussianBlur></filter>
              </defs>
              <path class="airrib" d=${Be} stroke="url(#gSupply)"></path>
              <path class="airrib" d=${Ie} stroke="url(#gExhaust)"></path>
              <polygon class="airarrow" points="86,11 86,27 102,19"></polygon>
              <polygon class="airarrow" points="354,11 354,27 338,19"></polygon>
              <polygon class="airarrow" points="102,105 102,121 86,113"></polygon>
              <polygon class="airarrow" points="338,105 338,121 354,113"></polygon>
              ${a&&c?this._flowGroup($,x):""}
            </svg>
            ${P}
          </div>

          <div class="trow bot">
            <div class="tcell l">${N("mdi:export",Ae("exhaust_air",i))}${E(_,e.tempSensor2)}${k(e.fan_speed_exhaust,y)}</div>
            <div></div>
            <div class="tcell r">${N("mdi:import",Ae("supply_air",i),!0)}${E(b,e.tempSensor4)}${M(e.supply_air_level)}</div>
          </div>
        </div>

        ${e.show_legend?W`<div class="legend">
          <span class="mn">${Math.round(m[0])}°C</span>
          <div class="bar" style="background:linear-gradient(90deg, ${Pe(0)}, ${Pe(.25)}, ${Pe(.5)}, ${Pe(.75)}, ${Pe(1)})"></div>
          <span class="mx">${Math.round(m[1])}°C</span>
        </div>`:""}

        <div class="status">
          ${S.map(e=>W`<div class="chip ${e.active?"on":""}" style="--c:${e.color}">
              <ha-icon icon=${e.icon}></ha-icon>
              <span class="nm">${e.label}</span>
              ${e.sub?W`<span class="vs">${e.sub}</span>`:""}
            </div>`)}
        </div>
      </ha-card>
    `}_flowGroup(e,t){const i=(Number(e)/2).toFixed(1),s=(Number(t)/2).toFixed(1);return q`<g class="flow-hi" filter="url(#soft)">
      <circle r="11" fill="#fff"><animateMotion path=${Be} dur="${e}s" begin="0s" repeatCount="indefinite"></animateMotion></circle>
      <circle r="11" fill="#fff"><animateMotion path=${Be} dur="${e}s" begin="-${i}s" repeatCount="indefinite"></animateMotion></circle>
      <circle r="11" fill="#fff"><animateMotion path=${Ie} dur="${t}s" begin="0s" repeatCount="indefinite"></animateMotion></circle>
      <circle r="11" fill="#fff"><animateMotion path=${Ie} dur="${t}s" begin="-${s}s" repeatCount="indefinite"></animateMotion></circle>
    </g>`}_moreInfo(e){e&&be(this,"hass-more-info",{entityId:e})}_setFan(e){this._config.entity&&this.hass.callService("climate","set_fan_mode",{entity_id:this._config.entity,fan_mode:e})}_stepTemp(e){const t=Ce(this.hass,this._config.entity),i=Number(t?.attributes.temperature);if(!Number.isFinite(i))return;const s=Number(t.attributes.target_temp_step),n=Number.isFinite(s)&&s>0?s:.5,r=Number(t.attributes.min_temp),o=Number(t.attributes.max_temp),a=function(e,t,i,s,n){const r=Math.round(10*(e+n*t))/10;return Math.min(s,Math.max(i,r))}(i,n,Number.isFinite(r)?r:-1/0,Number.isFinite(o)?o:1/0,e);this.hass.callService("climate","set_temperature",{entity_id:this._config.entity,temperature:a})}static get styles(){return o`
      ha-card {
        padding: 14px 16px 12px;
        --arrow: rgba(255, 255, 255, 0.92);
      }
      .hd { display: flex; align-items: center; gap: 11px; padding: 2px 2px 12px; }
      .hd .ic {
        width: 34px; height: 34px; border-radius: 10px; flex: none;
        display: flex; align-items: center; justify-content: center;
        background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.14);
        color: var(--primary-color);
      }
      .hd .ttl { font-size: 15.5px; font-weight: 600; letter-spacing: -0.01em; }
      .hd .st { font-size: 12px; color: var(--secondary-text-color); margin-top: 1px; display: flex; align-items: center; gap: 6px; }
      .hd .dot { width: 7px; height: 7px; border-radius: 50%; background: var(--disabled-text-color, #777); }
      .hd .dot.live { background: #36c46b; }
      .hd .grow { flex: 1; }
      .hd .recov { text-align: right; line-height: 1.05; min-height: 30px; }
      .hd .recov b { font-size: 16px; font-weight: 700; letter-spacing: -0.02em; }
      .hd .recov span { display: block; font-size: 10px; letter-spacing: 0.05em; text-transform: uppercase; color: var(--secondary-text-color); margin-top: 1px; }

      .tempbadge {
        display: inline-flex; align-items: baseline; justify-content: center; gap: 1px;
        width: 88px; padding: 3px 4px; border-radius: 10px; line-height: 1;
        font-variant-numeric: tabular-nums;
        background: var(--bg); color: var(--fg); border: 1px solid var(--bd);
        box-shadow: 0 2px 10px -4px rgba(0, 0, 0, 0.5);
        transition: background 0.5s, color 0.5s, border-color 0.5s;
      }
      .tempbadge .v { font-size: 22px; font-weight: 700; letter-spacing: -0.02em; }
      .tempbadge .u { font-size: 12px; font-weight: 600; opacity: 0.7; }
      .lbl { font-size: 9.5px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--secondary-text-color); font-weight: 600; display: flex; align-items: center; gap: 5px; }
      .lbl.rev { flex-direction: row-reverse; }
      .lbl ha-icon { --mdc-icon-size: 14px; }
      .subt { font-size: 11px; color: var(--secondary-text-color); display: flex; align-items: center; gap: 4px; font-variant-numeric: tabular-nums; }
      .subt ha-icon { --mdc-icon-size: 15px; opacity: 0.85; }
      .clickable { cursor: pointer; }
      .tempbadge.clickable:hover { filter: brightness(1.08); }
      .subt.clickable:hover { color: var(--primary-text-color); }

      .corehub {
        background: var(--card-background-color);
        border: 1px solid var(--divider-color); border-radius: 15px; padding: 6px 9px;
        box-shadow: 0 6px 22px -6px rgba(0, 0, 0, 0.55);
        display: flex; flex-direction: column; align-items: center; gap: 5px;
      }
      .setpc { display: flex; align-items: center; gap: 6px; }
      .setpc button {
        width: 24px; height: 24px; border-radius: 50%; border: 1px solid var(--divider-color);
        background: transparent; color: var(--primary-text-color); font-size: 15px; cursor: pointer;
        display: flex; align-items: center; justify-content: center; transition: 0.15s;
      }
      .setpc button:hover { border-color: var(--primary-color); color: var(--primary-color); }
      .setpc .val { min-width: 56px; text-align: center; font-size: 17px; font-weight: 700; font-variant-numeric: tabular-nums; letter-spacing: -0.02em; }
      .setpc .val small { font-size: 11px; font-weight: 600; color: var(--secondary-text-color); }
      .fanrow { display: flex; gap: 2px; background: rgba(127, 127, 127, 0.14); border-radius: 11px; padding: 3px; }
      .fanrow button {
        width: 32px; height: 26px; border: 0; background: transparent; border-radius: 8px;
        color: var(--secondary-text-color); cursor: pointer; transition: 0.15s;
        display: flex; align-items: center; justify-content: center;
      }
      .fanrow button:hover { color: var(--primary-text-color); }
      .fanrow button.on { background: var(--primary-color); color: #fff; box-shadow: 0 2px 8px -2px var(--primary-color); }
      .fanrow ha-icon { --mdc-icon-size: 18px; }

      .lanes { display: flex; flex-direction: column; gap: 3px; --hub-w: 188px; }
      .trow { display: grid; grid-template-columns: 1fr var(--hub-w) 1fr; gap: 10px; padding: 0 6px; }
      .trow.top { align-items: end; }
      .trow.bot { align-items: start; }
      .tcell { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
      .tcell.l { align-items: flex-start; }
      .tcell.r { align-items: flex-end; text-align: right; }

      .flowband { position: relative; width: 100%; aspect-ratio: 440 / 132; }
      .airsvg { position: absolute; inset: 0; width: 100%; height: 100%; }
      .airrib { fill: none; stroke-width: 38; stroke-linejoin: round; stroke-linecap: round; }
      .airarrow { fill: var(--arrow); filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.28)); }
      .flow-hi { opacity: 0.5; }
      .hub { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); z-index: 4; }

      .spinico.spin { animation-name: spin; animation-timing-function: linear; animation-iteration-count: infinite; transform-origin: center; }
      @keyframes spin { to { transform: rotate(360deg); } }

      .legend { display: flex; align-items: center; gap: 9px; padding: 8px 4px 2px; }
      .legend .bar { flex: 1; height: 7px; border-radius: 4px; }
      .legend .mn, .legend .mx { font-size: 11px; color: var(--secondary-text-color); font-variant-numeric: tabular-nums; font-weight: 600; min-width: 44px; }
      .legend .mx { text-align: right; }

      .status { display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--divider-color); }
      .chip { display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 7px 2px 4px; border-radius: 11px; color: var(--secondary-text-color); transition: 0.25s; }
      .chip ha-icon { --mdc-icon-size: 23px; transition: 0.25s; }
      .chip .nm { font-size: 10.5px; font-weight: 600; }
      .chip .vs { font-size: 9px; letter-spacing: 0.04em; text-transform: uppercase; color: var(--secondary-text-color); opacity: 0.65; }
      .chip.on { color: var(--c); background: color-mix(in srgb, var(--c) 12%, transparent); }
      .chip.on .vs { color: var(--c); opacity: 0.9; }
      .chip.on ha-icon { filter: drop-shadow(0 0 7px var(--c)); }
    `}};function We(e,t,i,s){return function(e,t,i){if("level"===e){const e=null==i||Number.isNaN(i)?50:i;return Math.min(2.5,Math.max(.2,e/50))}const s=null==t||Number.isNaN(t)?50:t;return Math.min(2,Math.max(.1,s/100))}(i,t.animation_speed,ke(e,s))}e([me({attribute:!1})],De.prototype,"hass",void 0),e([fe()],De.prototype,"_config",void 0),De=e([pe(ve)],De);export{De as MqttComfoairCard};
