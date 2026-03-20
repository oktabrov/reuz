(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function a(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(s){if(s.ep)return;s.ep=!0;const n=a(s);fetch(s.href,n)}})();class _t{constructor(){this.routes=[],this.currentRoute=null,this.beforeEach=null,window.addEventListener("hashchange",()=>this.resolve())}add(e,a){return this.routes.push({pattern:this.patternToRegex(e),rawPattern:e,handler:a}),this}patternToRegex(e){const a=e.replace(/:[a-zA-Z]+/g,"([^/]+)").replace(/\//g,"\\/");return new RegExp(`^${a}$`)}navigate(e){window.location.hash=e}resolve(){const e=window.location.hash.slice(1)||"/";if(!(this.beforeEach&&!this.beforeEach(e))){for(const a of this.routes){const i=e.match(a.pattern);if(i){const s=i.slice(1);this.currentRoute={path:e,pattern:a.rawPattern,params:s},a.handler(...s);return}}this.navigate("/")}}start(){this.resolve()}}const V=new _t;function h(t){V.navigate(t)}const Ae="reuz_store",be={currentUser:null,users:[],products:[],orders:[],disputes:[],conversations:[],favorites:[],notifications:[],seeded:!1};class xt{constructor(){this.listeners={},this.state=this.load()}load(){try{const e=localStorage.getItem(Ae);return e?JSON.parse(e):{...be}}catch{return{...be}}}save(){try{localStorage.setItem(Ae,JSON.stringify(this.state))}catch(e){console.warn("Store save failed:",e)}}get(e){return this.state[e]}set(e,a){this.state[e]=a,this.save(),this.emit(e,a)}getAll(e){return this.state[e]||[]}getById(e,a){return(this.state[e]||[]).find(i=>i.id===a)}add(e,a){return this.state[e]||(this.state[e]=[]),this.state[e].push(a),this.save(),this.emit(e,this.state[e]),a}update(e,a,i){const s=this.state[e]||[],n=s.findIndex(o=>o.id===a);return n!==-1?(s[n]={...s[n],...i},this.save(),this.emit(e,s),s[n]):null}remove(e,a){const i=this.state[e]||[];this.state[e]=i.filter(s=>s.id!==a),this.save(),this.emit(e,this.state[e])}filter(e,a){return(this.state[e]||[]).filter(a)}on(e,a){return this.listeners[e]||(this.listeners[e]=[]),this.listeners[e].push(a),()=>{this.listeners[e]=this.listeners[e].filter(i=>i!==a)}}emit(e,a){(this.listeners[e]||[]).forEach(i=>i(a))}login(e){this.set("currentUser",e)}logout(){this.set("currentUser",null)}isLoggedIn(){return this.state.currentUser!==null}getCurrentUser(){return this.state.currentUser}generateId(){return Date.now().toString(36)+Math.random().toString(36).substr(2,9)}reset(){this.state={...be},this.save()}}const d=new xt,z=["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop","https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop","https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400&h=500&fit=crop","https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400&h=500&fit=crop","https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=500&fit=crop","https://images.unsplash.com/photo-1434389677669-e08b4cda3a0b?w=400&h=500&fit=crop","https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=500&fit=crop","https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=500&fit=crop","https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=500&fit=crop","https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=500&fit=crop","https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=500&fit=crop","https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&h=500&fit=crop","https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=500&fit=crop","https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=500&fit=crop","https://images.unsplash.com/photo-1588117305388-c2631a279f82?w=400&h=500&fit=crop","https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=500&fit=crop"];function $t(){if(d.get("seeded"))return;[{id:"user_alice",name:"Alice Karimova",email:"alice@demo.com",password:"demo123",region:"Tashkent",avatar:null,bio:"Vintage fashion lover based in Tashkent. 5+ years selling preloved designer items. Authentic only — I personally verify every piece before listing. Fast shipper with 98% 5-star reviews!",rating:4.8,reviewCount:23,joinedAt:Date.now()-864e5*120,listingsCount:0,phone:"+998 90 123 4567",verified:!0},{id:"user_bob",name:"Bobur Umarov",email:"bob@demo.com",password:"demo123",region:"Samarkand",avatar:null,bio:"Tech enthusiast upgrading my gear — your gain! I sell quality electronics, cameras, and audio equipment from Samarkand. Everything tested and described honestly. I ship within 24 hours.",rating:4.5,reviewCount:15,joinedAt:Date.now()-864e5*90,listingsCount:0,phone:"+998 91 234 5678",verified:!0},{id:"user_carol",name:"Kamola Nazarova",email:"carol@demo.com",password:"demo123",region:"Fergana",avatar:null,bio:"Minimalist on a mission to declutter! Selling gently used brands like Patagonia, Zara, and Ray-Ban from the Fergana Valley. All items cleaned, pressed, and ready to wear. Bundle discounts available!",rating:4.9,reviewCount:31,joinedAt:Date.now()-864e5*200,listingsCount:0,phone:"+998 93 345 6789",verified:!0},{id:"user_dima",name:"Dima Aliyev",email:"dima@demo.com",password:"demo123",region:"Bukhara",avatar:null,bio:"Sneakerhead from Bukhara with a growing collection that needs thinning. Primarily selling Nike, Adidas, and New Balance. All shoes come with original boxes and are carefully packed. Open to negotiation!",rating:4.7,reviewCount:19,joinedAt:Date.now()-864e5*60,listingsCount:0,phone:"+998 94 456 7890",verified:!0},{id:"user_elena",name:"Elena Rashidova",email:"elena@demo.com",password:"demo123",region:"Namangan",avatar:null,bio:"Mom of two clearing out the family wardrobe. Selling kids clothes, women's fashion, and household items from Namangan. Everything is in great condition — our home is smoke-free and pet-free. Returns accepted within policy!",rating:4.6,reviewCount:12,joinedAt:Date.now()-864e5*45,listingsCount:0,phone:"+998 97 567 8901",verified:!1}].forEach(a=>d.add("users",a)),[{id:"prod_1",title:"Nike Air Max 90 — Like New",description:"Worn only twice. Original box included. US size 10. Perfect condition, no scuffs or marks. Authentic Nike product.",price:45,category:"Shoes",brand:"Nike",condition:"Like New",size:"US 10",images:[z[0],z[1]],sellerId:"user_alice",sold:!1,createdAt:Date.now()-864e5*5,views:142},{id:"prod_2",title:"Vintage Levi's 501 Jeans",description:"Classic straight leg 501s. W32 L34. Authentic vintage wash with natural fading. No tears, rips, or stains.",price:35,category:"Clothing",brand:"Levi's",condition:"Good",size:"W32 L34",images:[z[3],z[4]],sellerId:"user_alice",sold:!1,createdAt:Date.now()-864e5*3,views:89},{id:"prod_3",title:"Sony WH-1000XM4 Headphones",description:"Industry-leading noise cancellation. Includes carrying case, cable, and original box. Battery holds excellent charge.",price:120,category:"Electronics",brand:"Sony",condition:"Very Good",size:"One Size",images:[z[7],z[8]],sellerId:"user_bob",sold:!1,createdAt:Date.now()-864e5*7,views:234},{id:"prod_4",title:"Adidas Ultraboost 22",description:"Running shoes in great condition. Very comfortable. Size EU 42. Minor wear on sole.",price:55,category:"Shoes",brand:"Adidas",condition:"Good",size:"EU 42",images:[z[2],z[12]],sellerId:"user_bob",sold:!1,createdAt:Date.now()-864e5*2,views:167},{id:"prod_5",title:"Patagonia Nano Puff Jacket",description:"Lightweight insulated jacket. Men's size M. Excellent condition, no rips or tears. Color: Black.",price:80,category:"Clothing",brand:"Patagonia",condition:"Excellent",size:"M",images:[z[4],z[5]],sellerId:"user_carol",sold:!1,createdAt:Date.now()-864e5*1,views:95},{id:"prod_6",title:"Ray-Ban Aviator Sunglasses",description:"Classic gold frame with green lenses. Includes original case and cleaning cloth. No scratches.",price:65,category:"Accessories",brand:"Ray-Ban",condition:"Like New",size:"One Size",images:[z[10],z[9]],sellerId:"user_carol",sold:!1,createdAt:Date.now()-864e5*4,views:178},{id:"prod_7",title:"Canon EOS M50 Camera",description:"Mirrorless camera with 15-45mm kit lens. Shutter count under 5000. Comes with bag, charger, extra battery.",price:280,category:"Electronics",brand:"Canon",condition:"Very Good",size:"One Size",images:[z[6],z[8]],sellerId:"user_bob",sold:!1,createdAt:Date.now()-864e5*10,views:312},{id:"prod_8",title:"Supreme Box Logo Hoodie",description:"FW21 release. Size L. Worn a few times but in excellent condition. 100% authentic with receipt.",price:150,category:"Clothing",brand:"Supreme",condition:"Excellent",size:"L",images:[z[15],z[14]],sellerId:"user_alice",sold:!1,createdAt:Date.now()-864e5*6,views:456},{id:"prod_9",title:"Apple Watch Series 7",description:"45mm GPS. Midnight aluminum case. Includes charger and two bands. Battery health 94%.",price:200,category:"Electronics",brand:"Apple",condition:"Good",size:"45mm",images:[z[8],z[6]],sellerId:"user_carol",sold:!1,createdAt:Date.now()-864e5*8,views:289},{id:"prod_10",title:"New Balance 550 Sneakers",description:"White/Green colorway. Size US 9. Barely worn, some minor creasing. Comes with OG box.",price:70,category:"Shoes",brand:"New Balance",condition:"Very Good",size:"US 9",images:[z[13],z[12]],sellerId:"user_dima",sold:!1,createdAt:Date.now()-864e5*2,views:198},{id:"prod_11",title:"The North Face Backpack",description:"Borealis model. 28L capacity. Black. All zippers work perfectly. Minor cosmetic wear.",price:40,category:"Accessories",brand:"The North Face",condition:"Good",size:"One Size",images:[z[11],z[9]],sellerId:"user_dima",sold:!1,createdAt:Date.now()-864e5*12,views:132},{id:"prod_12",title:"Zara Oversized Blazer",description:"Classic black oversized blazer. Size S. Perfect for layering. Worn once to an event.",price:30,category:"Clothing",brand:"Zara",condition:"Like New",size:"S",images:[z[14],z[15]],sellerId:"user_elena",sold:!1,createdAt:Date.now()-864e5*1,views:76},{id:"prod_13",title:"Samsung Galaxy Buds Pro",description:"Wireless earbuds with active noise cancellation. Silver. Includes charging case and extra ear tips. Battery life still excellent.",price:60,category:"Electronics",brand:"Samsung",condition:"Excellent",size:"One Size",images:[z[8],z[7]],sellerId:"user_elena",sold:!1,createdAt:Date.now()-864e5*3,views:145},{id:"prod_14",title:"Converse Chuck Taylor High",description:"Classic black canvas high tops. Size EU 40. Worn a few times, soles still clean. Great everyday sneakers.",price:25,category:"Shoes",brand:"Converse",condition:"Good",size:"EU 40",images:[z[1],z[0]],sellerId:"user_dima",sold:!1,createdAt:Date.now()-864e5*4,views:88}].forEach(a=>d.add("products",a)),d.update("users","user_alice",{listingsCount:3}),d.update("users","user_bob",{listingsCount:3}),d.update("users","user_carol",{listingsCount:3}),d.update("users","user_dima",{listingsCount:3}),d.update("users","user_elena",{listingsCount:2}),d.set("seeded",!0)}function qt(){return[{email:"alice@demo.com",password:"demo123",name:"Alice Karimova",region:"Tashkent"},{email:"bob@demo.com",password:"demo123",name:"Bobur Umarov",region:"Samarkand"},{email:"carol@demo.com",password:"demo123",name:"Kamola Nazarova",region:"Fergana"},{email:"dima@demo.com",password:"demo123",name:"Dima Aliyev",region:"Bukhara"},{email:"elena@demo.com",password:"demo123",name:"Elena Rashidova",region:"Namangan"}]}function xe(t,e){const a=parseFloat(t),i=parseFloat(e),s=Math.round(a*.05*100)/100,n=Math.round((a*.02+.5)*100)/100,o=Math.round((s+n)*100)/100,r=Math.round((a-s)*100)/100,l=Math.round((a+n+i)*100)/100;return{itemPrice:a,sellerFee:s,escrow:n,shippingCost:i,platformRevenue:o,sellerGets:r,buyerPays:l}}function w(t){return`$${parseFloat(t).toFixed(2)}`}const Bt=["Tashkent","Tashkent Region","Samarkand","Bukhara","Khorezm","Navoi","Kashkadarya","Surkhandarya","Jizzakh","Syrdarya","Andijan","Namangan","Fergana","Karakalpakstan"],St={Tashkent:["Tashkent Region","Syrdarya"],"Tashkent Region":["Tashkent","Syrdarya","Jizzakh","Namangan"],Samarkand:["Jizzakh","Navoi","Kashkadarya"],Bukhara:["Navoi","Kashkadarya","Khorezm","Karakalpakstan"],Khorezm:["Bukhara","Karakalpakstan"],Navoi:["Samarkand","Bukhara","Jizzakh","Karakalpakstan"],Kashkadarya:["Samarkand","Bukhara","Surkhandarya"],Surkhandarya:["Kashkadarya"],Jizzakh:["Tashkent Region","Syrdarya","Samarkand","Navoi"],Syrdarya:["Tashkent","Tashkent Region","Jizzakh"],Andijan:["Fergana","Namangan"],Namangan:["Andijan","Fergana","Tashkent Region"],Fergana:["Andijan","Namangan"],Karakalpakstan:["Khorezm","Bukhara","Navoi"]};function Lt(t,e){if(t===e)return 0;const a=new Set([t]),i=[{region:t,dist:0}];for(;i.length>0;){const{region:s,dist:n}=i.shift(),o=St[s]||[];for(const r of o){if(r===e)return n+1;a.has(r)||(a.add(r),i.push({region:r,dist:n+1}))}}return 5}function $e(t,e){const a=Lt(t,e);let i,s,n;return a===0?(i=2,s=5,n="Same region"):a===1?(i=3,s=8,n="Neighboring region"):a<=3?(i=a===2?4:5,s=12,n="Medium distance"):(i=a===4?6:7,s=18,n="Long distance"),{cost:i,estimatedSeconds:s,label:n,distance:a,fromRegion:t,toRegion:e}}let N=null;function It(){return N||(N=document.getElementById("toast-root"),N||(N=document.createElement("div"),N.id="toast-root",document.body.appendChild(N)),N.className="toast-container"),N}function _(t,e="info",a=3500){const i=It(),s={success:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',error:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',warning:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',info:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'},n=document.createElement("div");return n.className=`toast toast-${e}`,n.innerHTML=`
    <span>${s[e]||""}</span>
    <span>${t}</span>
  `,i.appendChild(n),setTimeout(()=>{n.style.animation="fadeIn 200ms reverse forwards",setTimeout(()=>n.remove(),200)},a),n}let qe=localStorage.getItem("reuz_lang")||"en";function Et(t){qe=t,localStorage.setItem("reuz_lang",t),window.dispatchEvent(new CustomEvent("lang-change",{detail:t})),window.dispatchEvent(new HashChangeEvent("hashchange"))}function m(){return qe}function At(){Et(qe==="en"?"uz":"en")}function Ue(t){let e=d.filter("conversations",i=>i.orderId===t)[0];if(e)return e;const a=d.getById("orders",t);return a?(e={id:d.generateId(),orderId:t,buyerId:a.buyerId,sellerId:a.sellerId,messages:[],escalated:!1,createdAt:Date.now()},d.add("conversations",e),e):null}function J(t){return d.filter("conversations",e=>e.orderId===t)[0]||null}function Ct(t,e,a){const i=d.getById("conversations",t);if(!i)return null;const s={id:d.generateId(),senderId:e,text:a,type:"user",timestamp:Date.now()},n=[...i.messages,s];return d.update("conversations",t,{messages:n,updatedAt:Date.now()}),s}function He(t,e,a="info"){const i=d.getById("conversations",t);if(!i)return null;const s={id:d.generateId(),senderId:"__system__",text:e,type:"system",subtype:a,timestamp:Date.now()},n=[...i.messages,s];return d.update("conversations",t,{messages:n,updatedAt:Date.now()}),s}function S(t,e,a="info"){const i=J(t);i&&He(i.id,e,a)}function Pt(t){d.update("conversations",t,{escalated:!0})}const Fe=5,Be=8,Se=1800,F={};function Tt(t,e,a){const i=d.getById("products",e),s=d.getById("users",t),n=d.getById("users",i.sellerId);if(!i||!s||!n)throw new Error("Invalid order data");if(i.sold)throw new Error("Product already sold");if(t===i.sellerId)throw new Error("Cannot buy your own item");const o=$e(n.region,s.region),r=xe(i.price,o.cost),l=m(),c={id:d.generateId(),productId:e,buyerId:t,sellerId:i.sellerId,status:"paid",pricing:r,shipping:o,paymentDetails:{cardLast4:a.cardNumber.slice(-4),method:"card"},statusHistory:[{status:"paid",timestamp:Date.now(),note:l==="uz"?"To'lov qabul qilindi":"Payment received"}],createdAt:Date.now(),updatedAt:Date.now(),deliveredAt:null,disputeId:null,sellerPaidOut:!1};return d.update("products",e,{sold:!0,soldAt:Date.now()}),d.add("orders",c),Ue(c.id)&&S(c.id,l==="uz"?`To'lov tasdiqlandi. ${i.title} uchun $${r.buyerPays.toFixed(2)} to'landi.`:`Payment confirmed. $${r.buyerPays.toFixed(2)} paid for ${i.title}.`,"success"),Ke(c.id),c}function Ke(t){Le(t);const e=d.getById("orders",t);if(!(!e||e.status==="cancelled"||e.status==="completed"||e.status==="disputed")){if(e.status==="paid")F[`${t}_ship`]=setTimeout(()=>{jt(t)},Fe*1e3);else if(e.status==="shipped")F[`${t}_deliver`]=setTimeout(()=>{Qe(t)},Be*1e3);else if(e.status==="delivered"){const a=e.deliveredAt||Date.now(),i=Date.now()-a,s=Math.max(0,Se*1e3-i);s<=0?we(t):F[`${t}_complete`]=setTimeout(()=>{we(t)},s)}}}function jt(t){const e=d.getById("orders",t);if(!e||e.status!=="paid")return;const a=m(),i=a==="uz"?"Sotuvchi buyumni jo'natdi":"Seller has shipped the item";oe(t,"shipped",i),S(t,i,"info"),_(a==="uz"?"Buyurtma jo'natildi!":"Order shipped!","info"),F[`${t}_deliver`]=setTimeout(()=>{Qe(t)},Be*1e3)}function Qe(t){const e=d.getById("orders",t);if(!e||e.status!=="shipped")return;const a=m(),i=Date.now(),s=a==="uz"?"Buyum yetkazildi. Tasdiqlash yoki muammo xabar qilish uchun 30 daqiqangiz bor.":"Item delivered. You have 30 minutes to confirm or report an issue.";oe(t,"delivered",s),d.update("orders",t,{deliveredAt:i}),S(t,s,"success"),_(a==="uz"?"Buyum yetkazildi! Buyurtmangizni tekshiring.":"Item delivered! Review your order.","success"),F[`${t}_complete`]=setTimeout(()=>{we(t)},Se*1e3)}function we(t){const e=d.getById("orders",t);!e||e.status!=="delivered"||We(t)}function We(t){if(!d.getById("orders",t))return;const a=m(),i=a==="uz"?"Buyurtma bajarildi. Sotuvchiga to'lov chiqarildi.":"Order completed. Seller payout released.";oe(t,"completed",i),d.update("orders",t,{sellerPaidOut:!0}),S(t,i,"success"),Le(t),_(a==="uz"?"Buyurtma bajarildi!":"Order completed!","success")}function Ye(t,e){const a=d.getById("orders",t);if(!a)return;const i=m();if(a.status!=="paid")return _(i==="uz"?"Bekor qilib bo'lmaydi — buyum allaqachon jo'natilgan":"Cannot cancel — item already shipped","error"),!1;const s=e===a.buyerId?i==="uz"?"xaridor":"buyer":i==="uz"?"sotuvchi":"seller",n=`${i==="uz"?"Buyurtma bekor qilindi":"Order cancelled by"} ${s}`;return oe(t,"cancelled",n),S(t,n,"error"),d.update("products",a.productId,{sold:!1,soldAt:null}),Le(t),_(i==="uz"?"Buyurtma bekor qilindi. Xaridorga qaytarildi.":"Order cancelled. Buyer refunded.","info"),!0}function Ge(t){const e=d.getById("orders",t);!e||e.status!=="delivered"||We(t)}function oe(t,e,a){const i=d.getById("orders",t);if(!i)return;const s={status:e,timestamp:Date.now(),note:a},n=[...i.statusHistory||[],s];d.update("orders",t,{status:e,statusHistory:n,updatedAt:Date.now()})}function Le(t){Object.keys(F).forEach(e=>{e.startsWith(t)&&(clearTimeout(F[e]),delete F[e])})}function Rt(t){return d.filter("orders",e=>e.buyerId===t)}function Dt(t){return d.filter("orders",e=>e.sellerId===t)}function Ot(t){const e=d.getById("orders",t);if(!e)return null;let a=null,i=0;switch(e.status){case"paid":a="shipped",i=Fe;break;case"shipped":a="delivered",i=Be;break;case"delivered":a="completed",i=Se;break}return{nextStatus:a,nextDelay:i}}function Mt(){d.getAll("orders").forEach(e=>{["paid","shipped","delivered"].includes(e.status)&&Ke(e.id)})}const le=[{id:"women",icon:"",children:[{id:"w_clothing",children:[{id:"w_dresses",children:[{id:"w_mini_dresses"},{id:"w_midi_dresses"},{id:"w_maxi_dresses"},{id:"w_evening_dresses"},{id:"w_casual_dresses"},{id:"w_shirt_dresses"}]},{id:"w_tops",children:[{id:"w_tshirts"},{id:"w_blouses"},{id:"w_tanks"},{id:"w_crop_tops"},{id:"w_bodysuits"},{id:"w_sweaters"}]},{id:"w_bottoms",children:[{id:"w_jeans"},{id:"w_trousers"},{id:"w_skirts"},{id:"w_shorts"},{id:"w_leggings"}]},{id:"w_outerwear",children:[{id:"w_coats"},{id:"w_jackets"},{id:"w_blazers"},{id:"w_vests"},{id:"w_puffers"}]},{id:"w_activewear",children:[{id:"w_sports_bras"},{id:"w_sports_tops"},{id:"w_sports_leggings"}]},{id:"w_swimwear"},{id:"w_lingerie"},{id:"w_maternity"}]},{id:"w_shoes",children:[{id:"w_sneakers"},{id:"w_heels"},{id:"w_boots"},{id:"w_sandals"},{id:"w_flats"},{id:"w_loafers"},{id:"w_platforms"},{id:"w_slippers"}]},{id:"w_bags",children:[{id:"w_handbags"},{id:"w_shoulder_bags"},{id:"w_crossbody"},{id:"w_tote_bags"},{id:"w_clutches"},{id:"w_backpacks"},{id:"w_wallets_w"}]},{id:"w_accessories",children:[{id:"w_jewelry"},{id:"w_watches_w"},{id:"w_sunglasses_w"},{id:"w_scarves"},{id:"w_hats"},{id:"w_belts_w"}]},{id:"w_beauty"}]},{id:"men",icon:"",children:[{id:"m_clothing",children:[{id:"m_tshirts",children:[{id:"m_graphic_tees"},{id:"m_plain_tees"},{id:"m_polo_shirts"},{id:"m_long_sleeve"}]},{id:"m_shirts",children:[{id:"m_casual_shirts"},{id:"m_dress_shirts"},{id:"m_flannel"}]},{id:"m_bottoms",children:[{id:"m_jeans"},{id:"m_chinos"},{id:"m_joggers"},{id:"m_shorts"},{id:"m_trousers"}]},{id:"m_outerwear",children:[{id:"m_jackets"},{id:"m_coats"},{id:"m_hoodies"},{id:"m_blazers"},{id:"m_puffers"},{id:"m_bombers"}]},{id:"m_suits",children:[{id:"m_suit_jackets"},{id:"m_suit_trousers"},{id:"m_full_suits"}]},{id:"m_activewear"},{id:"m_swimwear"},{id:"m_underwear"}]},{id:"m_shoes",children:[{id:"m_sneakers"},{id:"m_boots"},{id:"m_dress_shoes"},{id:"m_sandals"},{id:"m_loafers"},{id:"m_sports_shoes"}]},{id:"m_accessories",children:[{id:"m_watches"},{id:"m_sunglasses"},{id:"m_bags_m"},{id:"m_wallets"},{id:"m_belts"},{id:"m_hats"},{id:"m_ties"}]}]},{id:"kids",icon:"",children:[{id:"k_girls",children:[{id:"k_g_clothing",children:[{id:"k_g_dresses"},{id:"k_g_tops"},{id:"k_g_bottoms"},{id:"k_g_outerwear"}]},{id:"k_g_shoes"},{id:"k_g_accessories"}]},{id:"k_boys",children:[{id:"k_b_clothing",children:[{id:"k_b_tops"},{id:"k_b_bottoms"},{id:"k_b_outerwear"}]},{id:"k_b_shoes"},{id:"k_b_accessories"}]},{id:"k_baby",children:[{id:"k_baby_clothing"},{id:"k_baby_shoes"},{id:"k_baby_gear"}]},{id:"k_toys"}]},{id:"home_living",icon:"",children:[{id:"h_decor",children:[{id:"h_vases"},{id:"h_candles"},{id:"h_frames"},{id:"h_mirrors"}]},{id:"h_textiles",children:[{id:"h_bedding"},{id:"h_curtains"},{id:"h_cushions"},{id:"h_rugs"}]},{id:"h_kitchen"},{id:"h_garden"},{id:"h_storage"}]},{id:"electronics",icon:"",children:[{id:"e_phones",children:[{id:"e_smartphones"},{id:"e_phone_cases"},{id:"e_chargers"}]},{id:"e_computers",children:[{id:"e_laptops"},{id:"e_tablets"},{id:"e_monitors"},{id:"e_pc_parts"}]},{id:"e_audio",children:[{id:"e_headphones"},{id:"e_speakers"},{id:"e_earbuds"}]},{id:"e_cameras"},{id:"e_gaming",children:[{id:"e_consoles"},{id:"e_games"},{id:"e_controllers"}]},{id:"e_wearables",children:[{id:"e_smartwatches"},{id:"e_fitness"}]}]},{id:"entertainment",icon:"",children:[{id:"ent_books"},{id:"ent_music",children:[{id:"ent_vinyl"},{id:"ent_cds"},{id:"ent_instruments"}]},{id:"ent_movies"},{id:"ent_games"}]},{id:"sports",icon:"",children:[{id:"s_fitness"},{id:"s_outdoor",children:[{id:"s_camping"},{id:"s_hiking"},{id:"s_cycling"}]},{id:"s_team_sports"},{id:"s_water_sports"},{id:"s_winter_sports"}]}],Ce={en:{women:"Women",men:"Men",kids:"Kids",home_living:"Home",electronics:"Electronics",entertainment:"Entertainment",sports:"Sports",w_clothing:"Clothing",w_dresses:"Dresses",w_mini_dresses:"Mini dresses",w_midi_dresses:"Midi dresses",w_maxi_dresses:"Maxi dresses",w_evening_dresses:"Evening dresses",w_casual_dresses:"Casual dresses",w_shirt_dresses:"Shirt dresses",w_tops:"Tops",w_tshirts:"T-shirts",w_blouses:"Blouses",w_tanks:"Tank tops",w_crop_tops:"Crop tops",w_bodysuits:"Bodysuits",w_sweaters:"Sweaters & Knitwear",w_bottoms:"Bottoms",w_jeans:"Jeans",w_trousers:"Trousers",w_skirts:"Skirts",w_shorts:"Shorts",w_leggings:"Leggings",w_outerwear:"Outerwear",w_coats:"Coats",w_jackets:"Jackets",w_blazers:"Blazers",w_vests:"Vests",w_puffers:"Puffer jackets",w_activewear:"Activewear",w_sports_bras:"Sports bras",w_sports_tops:"Sports tops",w_sports_leggings:"Sports leggings",w_swimwear:"Swimwear",w_lingerie:"Lingerie",w_maternity:"Maternity",w_shoes:"Shoes",w_sneakers:"Sneakers",w_heels:"Heels",w_boots:"Boots",w_sandals:"Sandals",w_flats:"Flats",w_loafers:"Loafers",w_platforms:"Platforms",w_slippers:"Slippers",w_bags:"Bags",w_handbags:"Handbags",w_shoulder_bags:"Shoulder bags",w_crossbody:"Crossbody bags",w_tote_bags:"Tote bags",w_clutches:"Clutches",w_backpacks:"Backpacks",w_wallets_w:"Wallets",w_accessories:"Accessories",w_jewelry:"Jewellery",w_watches_w:"Watches",w_sunglasses_w:"Sunglasses",w_scarves:"Scarves",w_hats:"Hats",w_belts_w:"Belts",w_beauty:"Beauty",m_clothing:"Clothing",m_tshirts:"T-shirts & Vests",m_graphic_tees:"Graphic tees",m_plain_tees:"Plain tees",m_polo_shirts:"Polo shirts",m_long_sleeve:"Long sleeve",m_shirts:"Shirts",m_casual_shirts:"Casual shirts",m_dress_shirts:"Dress shirts",m_flannel:"Flannel shirts",m_bottoms:"Trousers & Shorts",m_jeans:"Jeans",m_chinos:"Chinos",m_joggers:"Joggers",m_shorts:"Shorts",m_trousers:"Trousers",m_outerwear:"Outerwear",m_jackets:"Jackets",m_coats:"Coats",m_hoodies:"Hoodies & Sweatshirts",m_blazers:"Blazers",m_puffers:"Puffer jackets",m_bombers:"Bomber jackets",m_suits:"Suits",m_suit_jackets:"Suit jackets",m_suit_trousers:"Suit trousers",m_full_suits:"Full suits",m_activewear:"Activewear",m_swimwear:"Swimwear",m_underwear:"Underwear",m_shoes:"Shoes",m_sneakers:"Sneakers",m_boots:"Boots",m_dress_shoes:"Dress shoes",m_sandals:"Sandals",m_loafers:"Loafers",m_sports_shoes:"Sports shoes",m_accessories:"Accessories",m_watches:"Watches",m_sunglasses:"Sunglasses",m_bags_m:"Bags",m_wallets:"Wallets",m_belts:"Belts",m_hats:"Hats & Caps",m_ties:"Ties & Bow ties",k_girls:"Girls",k_boys:"Boys",k_baby:"Baby",k_toys:"Toys",k_g_clothing:"Clothing",k_g_dresses:"Dresses",k_g_tops:"Tops",k_g_bottoms:"Bottoms",k_g_outerwear:"Outerwear",k_g_shoes:"Shoes",k_g_accessories:"Accessories",k_b_clothing:"Clothing",k_b_tops:"Tops",k_b_bottoms:"Bottoms",k_b_outerwear:"Outerwear",k_b_shoes:"Shoes",k_b_accessories:"Accessories",k_baby_clothing:"Baby clothing",k_baby_shoes:"Baby shoes",k_baby_gear:"Baby gear",h_decor:"Decoration",h_vases:"Vases",h_candles:"Candles",h_frames:"Picture frames",h_mirrors:"Mirrors",h_textiles:"Textiles",h_bedding:"Bedding",h_curtains:"Curtains",h_cushions:"Cushions",h_rugs:"Rugs",h_kitchen:"Kitchen",h_garden:"Garden",h_storage:"Storage",e_phones:"Phones",e_smartphones:"Smartphones",e_phone_cases:"Phone cases",e_chargers:"Chargers",e_computers:"Computers",e_laptops:"Laptops",e_tablets:"Tablets",e_monitors:"Monitors",e_pc_parts:"PC parts",e_audio:"Audio",e_headphones:"Headphones",e_speakers:"Speakers",e_earbuds:"Earbuds",e_cameras:"Cameras",e_gaming:"Gaming",e_consoles:"Consoles",e_games:"Games",e_controllers:"Controllers",e_wearables:"Wearables",e_smartwatches:"Smartwatches",e_fitness:"Fitness trackers",ent_books:"Books",ent_music:"Music",ent_vinyl:"Vinyl records",ent_cds:"CDs",ent_instruments:"Instruments",ent_movies:"Movies & Series",ent_games:"Board games",s_fitness:"Fitness",s_outdoor:"Outdoor",s_camping:"Camping",s_hiking:"Hiking",s_cycling:"Cycling",s_team_sports:"Team sports",s_water_sports:"Water sports",s_winter_sports:"Winter sports"},uz:{women:"Ayollar",men:"Erkaklar",kids:"Bolalar",home_living:"Uy",electronics:"Elektronika",entertainment:"Ko'ngilochar",sports:"Sport",w_clothing:"Kiyim",w_dresses:"Ko'ylaklar",w_mini_dresses:"Mini ko'ylaklar",w_midi_dresses:"Midi ko'ylaklar",w_maxi_dresses:"Maxi ko'ylaklar",w_evening_dresses:"Kechki ko'ylaklar",w_casual_dresses:"Kundalik ko'ylaklar",w_shirt_dresses:"Ko'ylak-liboslar",w_tops:"Ustki kiyim",w_tshirts:"Futbolkalar",w_blouses:"Bluzalar",w_tanks:"Maykachar",w_crop_tops:"Krop-toplar",w_bodysuits:"Bodysuitlar",w_sweaters:"Sviterlar",w_bottoms:"Pastki kiyim",w_jeans:"Jinsi shimlar",w_trousers:"Shimlar",w_skirts:"Yubkalar",w_shorts:"Shortlar",w_leggings:"Legginslar",w_outerwear:"Ustki kiyim",w_coats:"Paltolar",w_jackets:"Kurtkajar",w_blazers:"Blazerlar",w_vests:"Jiletlar",w_puffers:"Pufer kurtkalar",w_activewear:"Sport kiyim",w_sports_bras:"Sport sutiyenlar",w_sports_tops:"Sport toplar",w_sports_leggings:"Sport legginslar",w_swimwear:"Suzish kiyimi",w_lingerie:"Ichki kiyim",w_maternity:"Homilador ayollar uchun",w_shoes:"Poyabzal",w_sneakers:"Krossovkalar",w_heels:"Poshnali",w_boots:"Etiklar",w_sandals:"Sandallar",w_flats:"Yassi poyabzal",w_loafers:"Loferlar",w_platforms:"Platformalar",w_slippers:"Shippaklar",w_bags:"Sumkalar",w_handbags:"Qo'l sumkalar",w_shoulder_bags:"Yelka sumkalar",w_crossbody:"Krossbodi sumkalar",w_tote_bags:"Tote sumkalar",w_clutches:"Klatchlar",w_backpacks:"Ryukzaklar",w_wallets_w:"Hamyonlar",w_accessories:"Aksessuarlar",w_jewelry:"Zargarlik",w_watches_w:"Soatlar",w_sunglasses_w:"Quyosh ko'zoynagi",w_scarves:"Sharf va ro'mollar",w_hats:"Shlyapalar",w_belts_w:"Kamarlar",w_beauty:"Go'zallik",m_clothing:"Kiyim",m_tshirts:"Futbolkalar",m_graphic_tees:"Grafik futbolkalar",m_plain_tees:"Oddiy futbolkalar",m_polo_shirts:"Polo futbolkalar",m_long_sleeve:"Uzun yengli",m_shirts:"Ko'ylaklar",m_casual_shirts:"Kundalik ko'ylaklar",m_dress_shirts:"Rasmiy ko'ylaklar",m_flannel:"Flanel ko'ylaklar",m_bottoms:"Shimlar",m_jeans:"Jinsi shimlar",m_chinos:"Chinolar",m_joggers:"Joggerlar",m_shorts:"Shortlar",m_trousers:"Shimlar",m_outerwear:"Ustki kiyim",m_jackets:"Kurtkalar",m_coats:"Paltolar",m_hoodies:"Xudi va svitshortlar",m_blazers:"Blazerlar",m_puffers:"Pufer kurtkalar",m_bombers:"Bomber kurtkalar",m_suits:"Kostumlar",m_suit_jackets:"Kostum kurtkalari",m_suit_trousers:"Kostum shimlari",m_full_suits:"To'liq kostumlar",m_activewear:"Sport kiyim",m_swimwear:"Suzish kiyimi",m_underwear:"Ichki kiyim",m_shoes:"Poyabzal",m_sneakers:"Krossovkalar",m_boots:"Etiklar",m_dress_shoes:"Rasmiy poyabzal",m_sandals:"Sandallar",m_loafers:"Loferlar",m_sports_shoes:"Sport poyabzal",m_accessories:"Aksessuarlar",m_watches:"Soatlar",m_sunglasses:"Quyosh ko'zoynagi",m_bags_m:"Sumkalar",m_wallets:"Hamyonlar",m_belts:"Kamarlar",m_hats:"Shlyapalar",m_ties:"Galstuklar",k_girls:"Qizlar",k_boys:"O'g'il bolalar",k_baby:"Chaqaloqlar",k_toys:"O'yinchoqlar",k_g_clothing:"Kiyim",k_g_dresses:"Ko'ylaklar",k_g_tops:"Ustki kiyim",k_g_bottoms:"Pastki kiyim",k_g_outerwear:"Ustki kiyim",k_g_shoes:"Poyabzal",k_g_accessories:"Aksessuarlar",k_b_clothing:"Kiyim",k_b_tops:"Ustki kiyim",k_b_bottoms:"Pastki kiyim",k_b_outerwear:"Ustki kiyim",k_b_shoes:"Poyabzal",k_b_accessories:"Aksessuarlar",k_baby_clothing:"Chaqaloq kiyimi",k_baby_shoes:"Chaqaloq poyabzali",k_baby_gear:"Chaqaloq jihozlari",h_decor:"Bezak",h_vases:"Vazalar",h_candles:"Shamlar",h_frames:"Rasm ramkalari",h_mirrors:"Oynalar",h_textiles:"Tekstil",h_bedding:"To'shak-ko'rpa",h_curtains:"Pardalar",h_cushions:"Yostiqchalar",h_rugs:"Gilamlar",h_kitchen:"Oshxona",h_garden:"Bog'",h_storage:"Saqlash",e_phones:"Telefonlar",e_smartphones:"Smartfonlar",e_phone_cases:"Telefon chexollari",e_chargers:"Zaryadka qurilmalari",e_computers:"Kompyuterlar",e_laptops:"Noutbuklar",e_tablets:"Planshetlar",e_monitors:"Monitorlar",e_pc_parts:"Kompyuter qismlari",e_audio:"Audio",e_headphones:"Quloqchinlar",e_speakers:"Karnaylar",e_earbuds:"Simsiz quloqchinlar",e_cameras:"Kameralar",e_gaming:"O'yinlar",e_consoles:"Konsollar",e_games:"O'yinlar",e_controllers:"Kontrollerlar",e_wearables:"Kiyiladigan qurilmalar",e_smartwatches:"Aqlli soatlar",e_fitness:"Fitnes trekkerlar",ent_books:"Kitoblar",ent_music:"Musiqa",ent_vinyl:"Vinil plastinkalar",ent_cds:"CD disklar",ent_instruments:"Musiqa asboblari",ent_movies:"Filmlar",ent_games:"Stol o'yinlari",s_fitness:"Fitnes",s_outdoor:"Ochiq havoda",s_camping:"Kemping",s_hiking:"Piyoda yurish",s_cycling:"Velosiped",s_team_sports:"Jamoaviy sport",s_water_sports:"Suv sporti",s_winter_sports:"Qishki sport"}};function X(t){var a;const e=m();return((a=Ce[e])==null?void 0:a[t])||Ce.en[t]||t}function Ve(t,e=le,a=[]){for(const i of e){const s=[...a,i.id];if(i.id===t)return s;if(i.children){const n=Ve(t,i.children,s);if(n)return n}}return null}let $={isOpen:!1,levels:[],onSelect:null,searchQuery:""};function Je(t){$.onSelect=t,$.levels=[{parentId:null,items:le}],$.searchQuery="",$.isOpen=!0,Nt()}function ne(){$.isOpen=!1;const t=document.getElementById("cat-browser-overlay"),e=document.getElementById("cat-browser-panel");t&&t.classList.remove("open"),e&&e.classList.remove("open"),setTimeout(()=>{const a=document.getElementById("cat-browser-container");a&&a.remove()},400)}function Nt(){const e=m()==="uz"?"Kategoriyalarni qidirish...":"Search categories...",a=document.getElementById("cat-browser-container");a&&a.remove();const i=document.createElement("div");i.id="cat-browser-container",i.innerHTML=`
    <div class="category-browser-overlay" id="cat-browser-overlay"></div>
    <div class="category-browser-panel" id="cat-browser-panel">
      <div class="category-browser-header" id="cat-browser-header">
        ${Xe()}
      </div>
      <div class="category-browser-search">
        <input type="text" id="cat-browser-search" placeholder="${e}" value="${$.searchQuery}" />
      </div>
      <div class="category-browser-levels" id="cat-browser-levels">
        ${Ze()}
      </div>
    </div>
  `,document.body.appendChild(i),requestAnimationFrame(()=>{var s,n;(s=document.getElementById("cat-browser-overlay"))==null||s.classList.add("open"),(n=document.getElementById("cat-browser-panel"))==null||n.classList.add("open")}),Ht()}function Xe(){const t=m(),e=$.levels[$.levels.length-1],a=$.levels.length<=1,i=a?t==="uz"?"Kategoriyalar":"Categories":X(e.parentId);return`
    ${a?"":`
      <button class="category-browser-back" id="cat-browser-back-btn">←</button>
    `}
    <span class="category-browser-title">${i}</span>
    <button class="category-browser-close" id="cat-browser-close-btn">✕</button>
  `}function Ze(){const t=$.levels[$.levels.length-1],e=$.searchQuery.toLowerCase();return e?Ut(e):`
    <div class="category-browser-level active">
      ${(t.items||[]).map(i=>{const s=i.children&&i.children.length>0;return`
          <button class="category-browser-item" data-cat-id="${i.id}" data-has-children="${s}">
            ${i.icon?`<span class="category-browser-item-icon">${i.icon}</span>`:""}
            <span class="category-browser-item-label">${X(i.id)}</span>
            ${s?'<span class="category-browser-item-arrow">›</span>':""}
          </button>
        `}).join("")}
    </div>
  `}function Ut(t){const e=et(le,t),i=m()==="uz"?"Natija topilmadi":"No results found";return e.length===0?`
      <div class="category-browser-level active" style="padding: var(--space-xl); text-align: center; color: var(--text-muted);">
        ${i}
      </div>
    `:`
    <div class="category-browser-level active">
      ${e.map(s=>{const n=Ve(s.id),o=n?n.map(r=>X(r)).join(" → "):"";return`
          <button class="category-browser-item" data-cat-id="${s.id}" data-has-children="false">
            ${s.icon?`<span class="category-browser-item-icon">${s.icon}</span>`:""}
            <span class="category-browser-item-label">
              ${X(s.id)}
              ${o?`<br><small style="color: var(--text-muted); font-size: 0.75rem;">${o}</small>`:""}
            </span>
          </button>
        `}).join("")}
    </div>
  `}function et(t,e){let a=[];for(const i of t)X(i.id).toLowerCase().includes(e)&&a.push(i),i.children&&(a=a.concat(et(i.children,e)));return a}function Ht(){const t=document.getElementById("cat-browser-overlay");t&&t.addEventListener("click",ne);const e=document.getElementById("cat-browser-close-btn");e&&e.addEventListener("click",ne);const a=document.getElementById("cat-browser-back-btn");a&&a.addEventListener("click",()=>{$.levels.length>1&&($.levels.pop(),Ie())});const i=document.getElementById("cat-browser-search");i&&(i.addEventListener("input",s=>{$.searchQuery=s.target.value,at()}),setTimeout(()=>i.focus(),300)),tt()}function tt(){document.querySelectorAll("#cat-browser-levels .category-browser-item").forEach(t=>{t.addEventListener("click",()=>{const e=t.dataset.catId;if(t.dataset.hasChildren==="true"&&!$.searchQuery){const i=it(e,le);i&&i.children&&($.levels.push({parentId:e,items:i.children}),Ie())}else $.onSelect&&$.onSelect(e),ne()})})}function Ie(){const t=document.getElementById("cat-browser-header");t&&(t.innerHTML=Xe()),at();const e=document.getElementById("cat-browser-close-btn");e&&e.addEventListener("click",ne);const a=document.getElementById("cat-browser-back-btn");a&&a.addEventListener("click",()=>{$.levels.length>1&&($.levels.pop(),Ie())})}function at(){const t=document.getElementById("cat-browser-levels");t&&(t.innerHTML=Ze(),tt())}function it(t,e){for(const a of e){if(a.id===t)return a;if(a.children){const i=it(t,a.children);if(i)return i}}return null}const T=(t,e="")=>`<span class="icon ${e}" aria-hidden="true">${t}</span>`,q={search:T('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>'),catalog:T('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>'),help:T('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'),package:T('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>'),user:T('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'),logout:T('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>'),dashboard:T('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>'),tag:T('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>'),cart:T('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>'),shopping:T('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>')};function st(){const t=d.getCurrentUser(),e=m(),a=e==="uz"?"UZ":"EN";return`
    <nav class="navbar">
      <div class="navbar-inner">
        <div class="navbar-logo" id="nav-logo">
          <svg width="72" height="28" viewBox="0 0 72 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <text x="0" y="22" font-family="Inter, sans-serif" font-size="24" font-weight="800" letter-spacing="-1">
              <tspan fill="#FFFFFF">Re</tspan><tspan fill="#00FF9D">Uz</tspan>
            </text>
          </svg>
        </div>

        <div class="navbar-search">
          ${q.search}
          <input type="text" id="nav-search" placeholder="${e==="uz"?"Buyumlarni qidirish...":"Search for items, brands..."}" />
        </div>

        <div class="navbar-actions">
          <button class="btn btn-ghost btn-sm" id="nav-catalog-btn" title="${e==="uz"?"Katalog":"Catalog"}">
            ${q.catalog} ${e==="uz"?"Katalog":"Catalog"}
          </button>

          <button class="btn btn-ghost btn-sm" id="nav-help-btn" title="${e==="uz"?"Yordam":"Help"}">
            ${q.help}
          </button>

          <button class="btn btn-ghost btn-sm" id="nav-lang-btn" title="${e==="uz"?"Tilni almashtirish":"Switch language"}" style="font-weight: 700; min-width: 40px;">
            ${a}
          </button>

          ${t?`
            <button class="btn btn-primary btn-sm" id="nav-sell-btn">
              + ${e==="uz"?"Sotish":"Sell"}
            </button>

            <button class="navbar-action-btn" id="nav-orders-btn" title="${e==="uz"?"Buyurtmalarim":"My Orders"}">
              ${q.package}
            </button>

            <div class="navbar-user" id="nav-user-container">
              <button class="avatar avatar-sm" id="nav-avatar-btn">
                ${t.name.charAt(0)}
              </button>
              <div class="navbar-user-menu" id="nav-user-menu" style="display:none">
                <div style="padding: var(--space-sm) var(--space-md);">
                  <div class="font-semibold text-sm">${t.name}</div>
                  <div class="text-xs text-muted">${t.email}</div>
                </div>
                <div class="navbar-user-menu-divider"></div>
                <button class="navbar-user-menu-item" data-nav="profile">${q.user} ${e==="uz"?"Profilim":"My Profile"}</button>
                <button class="navbar-user-menu-item" data-nav="orders">${q.package} ${e==="uz"?"Buyurtmalarim":"My Orders"}</button>
                <button class="navbar-user-menu-item" data-nav="admin">${q.dashboard} ${e==="uz"?"Boshqaruv paneli":"Admin Dashboard"}</button>
                <div class="navbar-user-menu-divider"></div>
                <button class="navbar-user-menu-item" id="nav-logout-btn">${q.logout} ${e==="uz"?"Chiqish":"Log Out"}</button>
              </div>
            </div>
          `:`
            <button class="btn btn-ghost btn-sm" id="nav-login-btn">${e==="uz"?"Kirish":"Log In"}</button>
            <button class="btn btn-primary btn-sm" id="nav-register-btn">${e==="uz"?"Royxatdan otish":"Sign Up"}</button>
          `}
        </div>
      </div>
    </nav>
  `}function nt(){const t=document.getElementById("nav-logo");t&&t.addEventListener("click",()=>h("/"));const e=document.getElementById("nav-search");e&&e.addEventListener("keydown",g=>{g.key==="Enter"&&e.value.trim()&&h(`/search/${encodeURIComponent(e.value.trim())}`)});const a=document.getElementById("nav-sell-btn");a&&a.addEventListener("click",()=>h("/sell"));const i=document.getElementById("nav-orders-btn");i&&i.addEventListener("click",()=>h("/orders"));const s=document.getElementById("nav-login-btn");s&&s.addEventListener("click",()=>h("/login"));const n=document.getElementById("nav-register-btn");n&&n.addEventListener("click",()=>h("/register"));const o=document.getElementById("nav-help-btn");o&&o.addEventListener("click",()=>h("/help"));const r=document.getElementById("nav-lang-btn");r&&r.addEventListener("click",()=>At());const l=document.getElementById("nav-catalog-btn");l&&l.addEventListener("click",()=>{Je(g=>{h(`/search/${encodeURIComponent(g)}`)})});const c=document.getElementById("nav-avatar-btn"),u=document.getElementById("nav-user-menu");c&&u&&(c.addEventListener("click",g=>{g.stopPropagation(),u.style.display=u.style.display==="none"?"block":"none"}),document.addEventListener("click",()=>{u.style.display="none"}),u.querySelectorAll("[data-nav]").forEach(g=>{g.addEventListener("click",()=>{h(`/${g.dataset.nav}`),u.style.display="none"})}));const p=document.getElementById("nav-logout-btn");p&&p.addEventListener("click",()=>{d.logout(),h("/login")})}function Ft(){const t=qt(),e=m(),a=e==="uz"?"Xush kelibsiz! Davom etish uchun tizimga kiring.":"Welcome back! Log in to continue.",i=e==="uz"?"Elektron pochta":"Email",s=e==="uz"?"Parol":"Password",n=e==="uz"?"Kirish":"Log In",o=e==="uz"?"Tezkor demo kirish:":"Quick demo login:",r=e==="uz"?"Hisobingiz yo'qmi?":"Don't have an account?",l=e==="uz"?"Ro'yxatdan o'tish":"Sign up";return`
    <div class="page">
      <div class="container-narrow">
        <div style="max-width: 420px; margin: 0 auto;">
          <div class="text-center" style="margin-bottom: var(--space-2xl);">
            <div style="font-size: var(--font-size-4xl); font-weight: 900; margin-bottom: var(--space-sm);">
              <span style="color: #fff;">RE</span><span style="color: #00FF9D; text-shadow: 0 0 30px rgba(0,255,157,0.5);">UZ</span>
            </div>
            <p class="text-secondary text-md">${a}</p>
          </div>

          <div class="card" style="padding: var(--space-xl);">
            <form id="login-form" class="flex flex-col gap-md">
              <div class="form-group">
                <label class="form-label">${i}</label>
                <input type="email" class="form-input" id="login-email" placeholder="you@example.com" required />
              </div>
              <div class="form-group">
                <label class="form-label">${s}</label>
                <input type="password" class="form-input" id="login-password" placeholder="••••••••" required />
              </div>
              <button type="submit" class="btn btn-primary btn-lg btn-full" style="margin-top: var(--space-sm);">
                ${n}
              </button>
            </form>

            <div class="divider"></div>

            <div>
              <p class="text-sm text-muted text-center" style="margin-bottom: var(--space-md);">${o}</p>
              <div class="flex flex-col gap-xs">
                ${t.map(c=>`
                  <button class="btn btn-secondary btn-sm btn-full demo-login-btn" 
                          data-email="${c.email}" data-password="${c.password}">
                    ${c.name} <span class="text-muted">— ${c.region}</span>
                  </button>
                `).join("")}
              </div>
            </div>
          </div>

          <p class="text-center text-sm text-muted" style="margin-top: var(--space-lg);">
            ${r} <a href="#/register">${l}</a>
          </p>
        </div>
      </div>
    </div>
  `}function Kt(){const t=document.getElementById("login-form"),e=m();t&&t.addEventListener("submit",a=>{a.preventDefault();const i=document.getElementById("login-email").value,s=document.getElementById("login-password").value;Pe(i,s,e)}),document.querySelectorAll(".demo-login-btn").forEach(a=>{a.addEventListener("click",()=>{Pe(a.dataset.email,a.dataset.password,e)})})}function Pe(t,e,a){const i=d.filter("users",s=>s.email===t&&s.password===e)[0];i?(d.login(i),_(a==="uz"?`Xush kelibsiz, ${i.name}!`:`Welcome back, ${i.name}!`,"success"),h("/")):_(a==="uz"?"Noto'g'ri email yoki parol":"Invalid email or password","error")}function Qt(){const t=m(),e=t==="uz"?"Hisobingizni yarating va savdoni boshlang.":"Create your account and start trading.",a=t==="uz"?"To'liq ism":"Full Name",i=t==="uz"?"Ismingiz":"Your name",s=t==="uz"?"Elektron pochta":"Email",n=t==="uz"?"Parol":"Password",o=t==="uz"?"Kamida 6 belgi":"Min 6 characters",r=t==="uz"?"Viloyat":"Region",l=t==="uz"?"Viloyatni tanlang...":"Select region...",c=t==="uz"?"Hisob yaratish":"Create Account",u=t==="uz"?"Hisobingiz bormi?":"Already have an account?",p=t==="uz"?"Kirish":"Log in";return`
    <div class="page">
      <div class="container-narrow">
        <div style="max-width: 420px; margin: 0 auto;">
          <div class="text-center" style="margin-bottom: var(--space-2xl);">
            <div style="font-size: var(--font-size-4xl); font-weight: 900; margin-bottom: var(--space-sm);">
              <span style="color: #fff;">RE</span><span style="color: #00FF9D; text-shadow: 0 0 30px rgba(0,255,157,0.5);">UZ</span>
            </div>
            <p class="text-secondary text-md">${e}</p>
          </div>

          <div class="card" style="padding: var(--space-xl);">
            <form id="register-form" class="flex flex-col gap-md">
              <div class="form-group">
                <label class="form-label">${a}</label>
                <input type="text" class="form-input" id="reg-name" placeholder="${i}" required />
              </div>
              <div class="form-group">
                <label class="form-label">${s}</label>
                <input type="email" class="form-input" id="reg-email" placeholder="you@example.com" required />
              </div>
              <div class="form-group">
                <label class="form-label">${n}</label>
                <input type="password" class="form-input" id="reg-password" placeholder="${o}" required minlength="6" />
              </div>
              <div class="form-group">
                <label class="form-label">${r}</label>
                <select class="form-input" id="reg-region" required>
                  <option value="">${l}</option>
                  ${Bt.map(g=>`<option value="${g}">${g}</option>`).join("")}
                </select>
              </div>
              <button type="submit" class="btn btn-primary btn-lg btn-full" style="margin-top: var(--space-sm);">
                ${c}
              </button>
            </form>
          </div>

          <p class="text-center text-sm text-muted" style="margin-top: var(--space-lg);">
            ${u} <a href="#/login">${p}</a>
          </p>
        </div>
      </div>
    </div>
  `}function Wt(){const t=document.getElementById("register-form");if(!t)return;const e=m();t.addEventListener("submit",a=>{a.preventDefault();const i=document.getElementById("reg-name").value.trim(),s=document.getElementById("reg-email").value.trim(),n=document.getElementById("reg-password").value,o=document.getElementById("reg-region").value;if(d.filter("users",c=>c.email===s).length>0){_(e==="uz"?"Email allaqachon ro'yxatdan o'tgan":"Email already registered","error");return}const l={id:d.generateId(),name:i,email:s,password:n,region:o,avatar:null,bio:"",rating:0,reviewCount:0,joinedAt:Date.now(),listingsCount:0};d.add("users",l),d.login(l),_(e==="uz"?`ReUzga xush kelibsiz, ${i}!`:`Welcome to ReUz, ${i}!`,"success"),h("/")})}function Z(t){var s;const e=d.getById("users",t.sellerId),a=t.condition||"Good",i={New:"badge-success","Like New":"badge-success",Excellent:"badge-info","Very Good":"badge-info",Good:"badge-warning",Fair:"badge-neutral"};return`
    <div class="product-card" data-product-id="${t.id}">
      <div class="product-card-image">
        <img src="${((s=t.images)==null?void 0:s[0])||"https://via.placeholder.com/400x500/1A1A25/A0A0B8?text=No+Image"}" 
             alt="${t.title}" loading="lazy" />
        <span class="product-card-badge badge ${i[a]||"badge-neutral"}">${a}</span>
        <button class="product-card-favorite" data-fav="${t.id}" title="Add to favorites">♡</button>
      </div>
      <div class="product-card-body">
        <div class="product-card-price">${w(t.price)}</div>
        <div class="product-card-title">${t.title}</div>
        <div class="product-card-meta">
          <span>${t.brand||""}</span>
          ${t.size?`<span>· ${t.size}</span>`:""}
        </div>
        ${e?`
          <div class="product-card-seller">
            <div class="avatar avatar-sm">${e.name.charAt(0)}</div>
            <span class="text-xs text-muted">${e.name}</span>
          </div>
        `:""}
      </div>
    </div>
  `}function de(t){t&&(t.querySelectorAll(".product-card").forEach(e=>{e.addEventListener("click",a=>{if(a.target.closest(".product-card-favorite"))return;const i=e.dataset.productId;h(`/product/${i}`)})}),t.querySelectorAll(".product-card-favorite").forEach(e=>{e.addEventListener("click",a=>{a.stopPropagation(),e.classList.toggle("active"),e.textContent=e.classList.contains("active")?"♥":"♡"})}))}function Yt(){const t=d.getCurrentUser(),e=m(),a=d.filter("products",y=>!y.sold).sort((y,f)=>f.createdAt-y.createdAt),i=[{key:"All",en:"All",uz:"Hammasi"},{key:"Clothing",en:"Clothing",uz:"Kiyimlar"},{key:"Shoes",en:"Shoes",uz:"Poyabzallar"},{key:"Electronics",en:"Electronics",uz:"Elektronika"},{key:"Accessories",en:"Accessories",uz:"Aksessuarlar"}],s=[{key:"Newest",en:"Newest",uz:"Eng yangi"},{key:"Price: Low to High",en:"Price: Low to High",uz:"Narx: pastdan yuqoriga"},{key:"Price: High to Low",en:"Price: High to Low",uz:"Narx: yuqoridan pastga"},{key:"Most Viewed",en:"Most Viewed",uz:"Eng ko'p ko'rilgan"}],n=e==="uz"?`Sotib oling va soting<br/><span style="color: var(--color-primary);">ikkinchi qo'l</span> boyliklar`:'Buy & sell<br/><span style="color: var(--color-primary);">second-hand</span> treasures',o=e==="uz"?"ReUz — oldindan sevib ishlatilgan buyumlar uchun hamjamiyat bozori. Barqaror xarid oson.":"Join ReUz — the community marketplace for preloved items. Sustainable shopping made easy.",r=e==="uz"?"Boshlash":"Get Started",l=e==="uz"?"Kirish":"Log In",c=e==="uz"?"+ Buyum sotish":"+ Sell an item",u=e==="uz"?"ta buyum mavjud":"items available",p=e==="uz"?"Hali buyumlar yo'q":"No items yet",g=e==="uz"?"Birinchi bo'lib biror narsa joylang!":"Be the first to list something!",b=e==="uz"?"Hozir sotish":"Sell now";return`
    <div class="page">
      <div class="container">
        <!-- Hero -->
        <div class="hero animate-fadeIn">
          <div class="hero-title">
            ${n}
          </div>
          <div class="hero-subtitle">
            ${o}
          </div>
          ${t?`
            <button class="btn btn-primary btn-lg" onclick="location.hash='/sell'">${c}</button>
          `:`
            <div class="flex gap-md justify-center">
              <button class="btn btn-primary btn-lg" onclick="location.hash='/register'">${r}</button>
              <button class="btn btn-secondary btn-lg" onclick="location.hash='/login'">${l}</button>
            </div>
          `}
        </div>

        <!-- Filters -->
        <div class="flex justify-between items-center flex-wrap gap-md" style="margin-bottom: var(--space-lg);">
          <div class="category-pills" id="category-pills">
            ${i.map((y,f)=>`
              <button class="category-pill ${f===0?"active":""}" data-category="${y.key}">${e==="uz"?y.uz:y.en}</button>
            `).join("")}
          </div>
          <div class="flex items-center gap-sm">
            <select class="form-input" id="sort-select" style="padding: var(--space-xs) var(--space-md); font-size: var(--font-size-sm); min-width: 170px;">
              ${s.map(y=>`<option value="${y.key}">${e==="uz"?y.uz:y.en}</option>`).join("")}
            </select>
          </div>
        </div>

        <!-- Product count -->
        <p class="text-sm text-muted" style="margin-bottom: var(--space-md);">
          <span id="product-count">${a.length}</span> ${u}
        </p>

        <!-- Product Grid -->
        <div class="product-grid" id="product-grid">
          ${a.map(y=>Z(y)).join("")}
        </div>

        ${a.length===0?`
          <div class="empty-state">
            <div class="empty-state-icon">${q.shopping}</div>
            <div class="empty-state-title">${p}</div>
            <div class="empty-state-text">${g}</div>
            <button class="btn btn-primary" onclick="location.hash='/sell'">${b}</button>
          </div>
        `:""}
      </div>
    </div>
  `}function Gt(){const t=document.getElementById("product-grid");de(t);const e=document.querySelectorAll("#category-pills .category-pill");e.forEach(i=>{i.addEventListener("click",()=>{e.forEach(s=>s.classList.remove("active")),i.classList.add("active"),Te()})});const a=document.getElementById("sort-select");a&&a.addEventListener("change",()=>Te())}function Te(){var n,o;const t=((n=document.querySelector("#category-pills .category-pill.active"))==null?void 0:n.dataset.category)||"All",e=((o=document.getElementById("sort-select"))==null?void 0:o.value)||"Newest";let a=d.filter("products",r=>!r.sold);switch(t!=="All"&&(a=a.filter(r=>r.category===t)),e){case"Price: Low to High":a.sort((r,l)=>r.price-l.price);break;case"Price: High to Low":a.sort((r,l)=>l.price-r.price);break;case"Most Viewed":a.sort((r,l)=>(l.views||0)-(r.views||0));break;default:a.sort((r,l)=>l.createdAt-r.createdAt)}const i=document.getElementById("product-grid"),s=document.getElementById("product-count");i&&(i.innerHTML=a.map(r=>Z(r)).join(""),de(i)),s&&(s.textContent=a.length)}function Vt(t){const e=decodeURIComponent(t),a=e.toLowerCase(),i=m(),s=d.filter("products",u=>!u.sold&&(u.title.toLowerCase().includes(a)||(u.brand||"").toLowerCase().includes(a)||(u.category||"").toLowerCase().includes(a)||(u.description||"").toLowerCase().includes(a))),n=i==="uz"?"Qidiruv natijalari":"Search results for",o=i==="uz"?"ta buyum topildi":"items found",r=i==="uz"?"Natija topilmadi":"No results",l=i==="uz"?"Boshqa kalit so'zlarni sinab ko'ring yoki barcha buyumlarni ko'ring":"Try different keywords or browse all items",c=i==="uz"?"Hammasini ko'rish":"Browse all";return`
    <div class="page">
      <div class="container">
        <h1 style="margin-bottom: var(--space-xs);">${n} "${e}"</h1>
        <p class="text-muted" style="margin-bottom: var(--space-xl);">${s.length} ${o}</p>

        <div class="product-grid" id="product-grid">
          ${s.map(u=>Z(u)).join("")}
        </div>

        ${s.length===0?`
          <div class="empty-state">
            <div class="empty-state-icon">${q.search}</div>
            <div class="empty-state-title">${r}</div>
            <div class="empty-state-text">${l}</div>
            <button class="btn btn-primary" onclick="location.hash='/'">${c}</button>
          </div>
        `:""}
      </div>
    </div>
  `}function Jt(){de(document.getElementById("product-grid"))}function Xt(t){const e=d.getById("products",t),a=m();if(!e)return`<div class="page"><div class="container"><div class="empty-state"><div class="empty-state-icon">?</div><div class="empty-state-title">${a==="uz"?"Buyum topilmadi":"Product not found"}</div><button class="btn btn-primary" onclick="location.hash=''">${a==="uz"?"Buyumlarni ko'rish":"Browse items"}</button></div></div></div>`;const i=d.getById("users",e.sellerId),s=d.getCurrentUser(),n=s&&s.id===e.sellerId;let o=null,r=null;s&&i&&(o=$e(i.region,s.region),r=xe(e.price,o.cost));const l={brand:a==="uz"?"Brend":"Brand",size:a==="uz"?"O'lcham":"Size",condition:a==="uz"?"Holat":"Condition",category:a==="uz"?"Kategoriya":"Category",material:"Material",color:a==="uz"?"Rang":"Color",uploaded:a==="uz"?"Yuklangan":"Uploaded",unknown:a==="uz"?"Noma'lum":"Unknown",oneSize:a==="uz"?"Bir o'lcham":"One Size",other:a==="uz"?"Boshqa":"Other",buyNow:a==="uz"?"Hozir sotib olish":"Buy now",makeOffer:a==="uz"?"Taklif berish":"Make an offer",msgSeller:a==="uz"?"Sotuvchiga xabar":"Message seller",loginToBuy:a==="uz"?"Sotib olish uchun tizimga kiring":"Log in to buy",needLogin:a==="uz"?"Avval tizimga kirishingiz kerak":"You need to log in first",yourListing:a==="uz"?"Bu sizning e'loningiz":"This is your listing",soldMsg:a==="uz"?"Bu buyum sotilgan":"This item has been sold",items:a==="uz"?"buyum":"items",buyerProt:a==="uz"?"Xaridor himoyasi":"Buyer Protection",buyerProtFee:a==="uz"?"Xaridor himoyasi to'lovi":"Buyer Protection fee",buyerProtDesc:a==="uz"?"har bir xarid uchun to'lov sifatida qo'shiladi. Xaridor himoyasi bizning Qaytarish siyosatini o'z ichiga oladi.":'is added for a fee to every purchase made with the "Buy now" button. Buyer Protection includes our Refund Policy.',refundPolicy:a==="uz"?"Qaytarish siyosati":"Refund Policy",includesProt:a==="uz"?"Xaridor himoyasi bilan":"Includes Buyer Protection",shipping:a==="uz"?"Yetkazib berish":"Shipping",freeShipping:a==="uz"?"Bepul yetkazib berish":"Free shipping"},c=Zt(e.createdAt,a),u=o?o.cost===0?l.freeShipping:`${l.shipping}: ${w(o.cost)}`:"",p=w(r?r.buyerPays:e.price),g=e.images||[];let b="";g.length>=3?b=`
      <div class="product-images-grid">
        ${g.slice(0,3).map((f,x)=>`
          <div class="product-image-cell" data-img="${f}" data-index="${x}">
            <img src="${f}" alt="${e.title} ${x+1}" loading="lazy" />
          </div>
        `).join("")}
      </div>
    `:g.length===2?b=`
      <div class="product-images-grid" style="grid-template-columns: 1fr 1fr;">
        ${g.map((f,x)=>`
          <div class="product-image-cell" data-img="${f}" data-index="${x}" style="grid-row: auto;">
            <img src="${f}" alt="${e.title} ${x+1}" loading="lazy" />
          </div>
        `).join("")}
      </div>
    `:b=`
      <div class="product-images-single" data-img="${g[0]||""}" data-index="0">
        <img src="${g[0]||""}" alt="${e.title}" />
      </div>
    `;const y=[[l.condition,e.condition||l.unknown],[l.brand,e.brand||l.unknown],[l.size,e.size||l.oneSize],[l.category,e.category||l.other],[l.material,e.material||"-"],[l.color,e.color||"-"],[l.uploaded,c]];return`
    <div class="page">
      <div class="container">
        <div class="product-detail-grid">
          <!-- Left: Images -->
          <div>
            ${b}
          </div>

          <!-- Right: Info Panel -->
          <div class="product-info-panel animate-fadeInUp">
            <!-- Title & condition -->
            <h1 style="font-size: var(--font-size-xl); margin-bottom: var(--space-2xs); line-height: 1.3;">${e.title}</h1>
            <div class="text-xs text-muted" style="margin-bottom: var(--space-md);">
              ${e.size||""} ${e.size?"·":""} ${e.condition||""} ${e.brand?"· "+e.brand:""} · ${c}
            </div>

            <!-- Price Section -->
            <div class="product-price-section">
              ${r?`
                <div class="product-price-original">${w(e.price)}</div>
                <div class="product-price-current">${p}</div>
              `:`
                <div class="product-price-current">${w(e.price)}</div>
              `}
              <div class="product-protection-line">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <a href="#/help/buyer-protection-fee">${l.includesProt}</a>
              </div>
            </div>

            <!-- Details Table -->
            <table class="product-details-table">
              ${y.map(([f,x])=>`
                <tr><td>${f}</td><td>${x}</td></tr>
              `).join("")}
            </table>

            <!-- Description -->
            <div style="margin-bottom: var(--space-lg);">
              <p class="text-sm text-secondary" style="line-height: var(--line-height-relaxed);">${e.description}</p>
            </div>

            <!-- Shipping -->
            ${u?`
              <div class="text-sm" style="margin-bottom: var(--space-lg);">
                <strong>${u}</strong>
              </div>
            `:""}

            <!-- Three Buttons -->
            ${!e.sold&&!n?`
              <div class="product-buttons-stack">
                <button class="btn btn-primary btn-lg btn-full" id="buy-btn" ${s?"":"disabled"}>
                  ${s?l.buyNow:l.loginToBuy}
                </button>
                ${s?`
                  <button class="btn btn-secondary btn-lg btn-full" id="offer-btn" style="background: transparent; border: 2px solid var(--border-default); color: var(--text-primary);">
                    ${l.makeOffer}
                  </button>
                  <button class="btn btn-secondary btn-lg btn-full" id="msg-seller-btn" style="background: transparent; border: 2px solid var(--border-default); color: var(--text-primary);">
                    ${l.msgSeller}
                  </button>
                `:`<p class="text-center text-xs text-muted">${l.needLogin}</p>`}
              </div>
            `:n?`
              <div class="text-center text-muted text-sm" style="padding: var(--space-md); background: var(--bg-surface); border-radius: var(--radius-md); margin-bottom: var(--space-lg);">
                ${l.yourListing}
              </div>
            `:`
              <div class="text-center" style="padding: var(--space-md); background: var(--bg-error); border-radius: var(--radius-md); margin-bottom: var(--space-lg);">
                <span class="text-error font-semibold">${l.soldMsg}</span>
              </div>
            `}

            <!-- Buyer Protection Card (Vinted-style) -->
            <div class="buyer-prot-card">
              <div class="buyer-prot-card-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <div class="buyer-prot-card-text">
                <strong>${l.buyerProtFee}</strong>
                ${a==="uz"?"Bizning":"Our"} <a href="#/help/buyer-protection-fee" style="color: var(--color-primary); text-decoration: underline;">${l.buyerProt}</a> ${l.buyerProtDesc}
                <br/>${l.buyerProt} ${a==="uz"?"bizning":"includes our"} <a href="#/help/refund-policy" style="color: var(--color-primary); text-decoration: underline;">${l.refundPolicy}</a>.
              </div>
            </div>

            <!-- Seller Info -->
            ${i?`
              <div class="card" style="margin-top: var(--space-lg); cursor: pointer;" id="seller-link" data-seller-id="${i.id}">
                <div class="flex items-center gap-sm">
                  <div class="avatar avatar-md">${i.name.charAt(0)}</div>
                  <div>
                    <div class="font-semibold text-sm">${i.name}</div>
                    <div class="text-xs text-muted">${i.rating.toFixed(1)} · ${i.listingsCount} ${l.items} · ${i.region}</div>
                  </div>
                </div>
              </div>
            `:""}
          </div>
        </div>
      </div>
    </div>

    <!-- Offer Modal (hidden) -->
    <div id="offer-modal-overlay" style="display: none;"></div>

    <!-- Image Lightbox (hidden) -->
    <div id="image-lightbox" style="display: none;"></div>
  `}function Zt(t,e){const a=Date.now()-t,i=Math.floor(a/6e4),s=Math.floor(a/36e5),n=Math.floor(a/864e5);return e==="uz"?i<60?`${i} daqiqa oldin`:s<24?`${s} soat oldin`:`${n} kun oldin`:i<60?`${i} minutes ago`:s<24?`${s} hours ago`:`${n} days ago`}function ea(t){const e=d.getById("products",t),a=m();document.querySelectorAll(".product-image-cell, .product-images-single").forEach(r=>{r.addEventListener("click",()=>{var c;const l=r.dataset.img||((c=r.querySelector("img"))==null?void 0:c.src);l&&aa(l)})});const i=document.getElementById("buy-btn");i&&i.addEventListener("click",()=>{if(!d.getCurrentUser()){h("/login");return}h(`/checkout/${t}`)});const s=document.getElementById("offer-btn");s&&e&&s.addEventListener("click",()=>{if(!d.getCurrentUser()){h("/login");return}ta(e,a)});const n=document.getElementById("msg-seller-btn");n&&n.addEventListener("click",()=>{const r=d.getCurrentUser();if(!r){h("/login");return}const l=d.filter("orders",c=>c.productId===t&&c.buyerId===r.id)[0];l?h(`/chat/${l.id}`):_(a==="uz"?"Avval buyumni sotib oling — keyin suhbat ochiladi":"Buy the item first — chat opens after purchase","info")});const o=document.getElementById("seller-link");o&&o.addEventListener("click",()=>{h(`/profile/${o.dataset.sellerId}`)}),e&&d.update("products",t,{views:(e.views||0)+1})}function ta(t,e){var s,n,o;const a=document.getElementById("offer-modal-overlay");if(!a)return;const i={title:e==="uz"?"Taklif berish":"Make an Offer",currentPrice:e==="uz"?"Joriy narx":"Current price",send:e==="uz"?"Taklifni yuborish":"Send Offer",cancel:e==="uz"?"Bekor qilish":"Cancel"};a.style.display="flex",a.innerHTML=`
    <div class="offer-modal-overlay" id="offer-modal-bg">
      <div class="offer-modal">
        <div class="offer-modal-title">${i.title}</div>
        <div class="text-xs text-muted" style="margin-bottom: var(--space-md);">${i.currentPrice}: <strong>${w(t.price)}</strong></div>
        <div class="offer-modal-price">
          <span class="text-lg font-bold">$</span>
          <input type="number" id="offer-amount" placeholder="0.00" step="0.50" min="1" max="${(t.price*.95).toFixed(2)}" value="${(t.price*.8).toFixed(2)}" />
        </div>
        <div class="offer-modal-buttons">
          <button class="btn btn-ghost" id="offer-cancel">${i.cancel}</button>
          <button class="btn btn-primary" id="offer-send">${i.send}</button>
        </div>
      </div>
    </div>
  `,(s=document.getElementById("offer-modal-bg"))==null||s.addEventListener("click",r=>{r.target.id==="offer-modal-bg"&&ve()}),(n=document.getElementById("offer-cancel"))==null||n.addEventListener("click",()=>ve()),(o=document.getElementById("offer-send"))==null||o.addEventListener("click",()=>{var l;const r=parseFloat((l=document.getElementById("offer-amount"))==null?void 0:l.value);if(!r||r<=0){_(e==="uz"?"Iltimos, narx kiriting":"Please enter a price","error");return}ve(),_(e==="uz"?`$${r.toFixed(2)} taklifingiz yuborildi! Sotuvchi javobini kuting.`:`Your offer of $${r.toFixed(2)} has been sent! Wait for the seller's response.`,"success")})}function ve(){const t=document.getElementById("offer-modal-overlay");t&&(t.style.display="none",t.innerHTML="")}function aa(t){var i,s;const e=document.getElementById("image-lightbox");if(!e)return;e.style.display="block",e.innerHTML=`
    <div class="image-lightbox-overlay" id="lightbox-bg">
      <button class="image-lightbox-close" id="lightbox-close">&times;</button>
      <img src="${t}" alt="Full size" />
    </div>
  `,(i=document.getElementById("lightbox-bg"))==null||i.addEventListener("click",n=>{(n.target.id==="lightbox-bg"||n.target.id==="lightbox-close")&&fe()}),(s=document.getElementById("lightbox-close"))==null||s.addEventListener("click",()=>fe());const a=n=>{n.key==="Escape"&&(fe(),document.removeEventListener("keydown",a))};document.addEventListener("keydown",a)}function fe(){const t=document.getElementById("image-lightbox");t&&(t.style.display="none",t.innerHTML="")}const je=["New","Like New","Excellent","Very Good","Good","Fair"],ia=["Yangi","Yangidek","A'lo","Juda yaxshi","Yaxshi","Qoniqarli"],rt=["https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400&h=500&fit=crop","https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=500&fit=crop","https://images.unsplash.com/photo-1434389677669-e08b4cda3a0b?w=400&h=500&fit=crop","https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=500&fit=crop"];function sa(){if(!d.getCurrentUser())return h("/login"),"";const e=m(),a=e==="uz"?ia:je,i=e==="uz"?"Sotish":"Sell",s=e==="uz"?"buyum":"an item",n=e==="uz"?"Rasmlar":"Photos",o=e==="uz"?"Demo rejimida joy egalari rasmlari ishlatiladi":"Demo uses placeholder images",r=e==="uz"?"+ Qo'shish":"+ Add",l=e==="uz"?"Sarlavha *":"Title *",c=e==="uz"?"masalan, Nike Air Max 90":"e.g., Nike Air Max 90",u=e==="uz"?"Tavsif *":"Description *",p=e==="uz"?"Buyumni, uning holatini va kamchiliklarni tasvirlang...":"Describe the item, its condition, and any defects...",g=e==="uz"?"Kategoriya *":"Category *",b=e==="uz"?"Kategoriyani tanlang...":"Select category...",y=e==="uz"?"Holat *":"Condition *",f=e==="uz"?"Tanlang...":"Select...",x=e==="uz"?"Brend":"Brand",L=e==="uz"?"masalan, Nike, Zara":"e.g., Nike, Zara",B=e==="uz"?"O'lcham":"Size",k=e==="uz"?"masalan, M, US 10, EU 42":"e.g., M, US 10, EU 42",C=e==="uz"?"Narx ($) *":"Price ($) *",P=e==="uz"?"5% sotuvchi to'lovidan keyin 95% olasiz":"You'll receive 95% after the 5% seller fee",j=e==="uz"?"Sotuvga qo'yish":"List Item for Sale";return`
    <div class="page">
      <div class="container-narrow">
        <h1 style="margin-bottom: var(--space-2xl);">
          <span style="color: var(--color-primary);">${i}</span> ${s}
        </h1>

        <div class="card" style="padding: var(--space-xl);">
          <form id="sell-form" class="flex flex-col gap-lg">
            <!-- Photo -->
            <div class="form-group">
              <label class="form-label">${n}</label>
              <p class="text-xs text-muted" style="margin-bottom: var(--space-xs);">${o}</p>
              <div class="flex gap-sm flex-wrap" id="photo-preview">
                ${rt.slice(0,2).map((E,A)=>`
                  <div style="width: 100px; height: 100px; border-radius: var(--radius-md); overflow: hidden; border: 2px solid var(--border-default);">
                    <img src="${E}" style="width: 100%; height: 100%; object-fit: cover;" alt="Preview ${A+1}" />
                  </div>
                `).join("")}
                <div style="width: 100px; height: 100px; border-radius: var(--radius-md); border: 2px dashed var(--border-default); display: flex; align-items: center; justify-content: center; color: var(--text-muted); cursor: pointer;">
                  ${r}
                </div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">${l}</label>
              <input type="text" class="form-input" id="sell-title" placeholder="${c}" required maxlength="80" />
            </div>

            <div class="form-group">
              <label class="form-label">${u}</label>
              <textarea class="form-input" id="sell-description" placeholder="${p}" required maxlength="1000"></textarea>
            </div>

            <div class="grid-2" style="gap: var(--space-md);">
              <div class="form-group">
                <label class="form-label">${g}</label>
                <input type="text" class="form-input" id="sell-category" placeholder="${b}" readonly required style="cursor: pointer;" />
                <input type="hidden" id="sell-category-id" />
              </div>
              <div class="form-group">
                <label class="form-label">${y}</label>
                <select class="form-input" id="sell-condition" required>
                  <option value="">${f}</option>
                  ${a.map((E,A)=>`<option value="${je[A]}">${E}</option>`).join("")}
                </select>
              </div>
            </div>

            <div class="grid-2" style="gap: var(--space-md);">
              <div class="form-group">
                <label class="form-label">${x}</label>
                <input type="text" class="form-input" id="sell-brand" placeholder="${L}" />
              </div>
              <div class="form-group">
                <label class="form-label">${B}</label>
                <input type="text" class="form-input" id="sell-size" placeholder="${k}" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">${C}</label>
              <input type="number" class="form-input" id="sell-price" placeholder="0.00" min="1" step="0.01" required style="font-size: var(--font-size-xl); font-weight: 700;" />
              <div class="text-xs text-muted" style="margin-top: var(--space-2xs);">
                ${P}
              </div>
              <div id="sell-fee-preview" class="text-sm" style="margin-top: var(--space-xs); color: var(--color-primary);"></div>
            </div>

            <button type="submit" class="btn btn-primary btn-lg btn-full">
              ${j}
            </button>
          </form>
        </div>
      </div>
    </div>
  `}function na(){const t=m(),e=document.getElementById("sell-category"),a=document.getElementById("sell-category-id");e&&e.addEventListener("click",()=>{Je(o=>{a.value=o,e.value=X(o)})});const i=document.getElementById("sell-price"),s=document.getElementById("sell-fee-preview");i&&s&&i.addEventListener("input",()=>{const o=parseFloat(i.value);if(o>0){const r=Math.round(o*.05*100)/100,l=Math.round((o-r)*100)/100,c=t==="uz"?"Siz olasiz":"You'll earn",u=t==="uz"?"to'lov":"fee";s.textContent=`${c} $${l.toFixed(2)} (${u}: $${r.toFixed(2)})`}else s.textContent=""});const n=document.getElementById("sell-form");n&&n.addEventListener("submit",o=>{o.preventDefault();const r=d.getCurrentUser();if(!r)return;const l={id:d.generateId(),title:document.getElementById("sell-title").value.trim(),description:document.getElementById("sell-description").value.trim(),category:document.getElementById("sell-category-id").value||document.getElementById("sell-category").value,condition:document.getElementById("sell-condition").value,brand:document.getElementById("sell-brand").value.trim()||null,size:document.getElementById("sell-size").value.trim()||null,price:parseFloat(document.getElementById("sell-price").value),images:rt.slice(0,2),sellerId:r.id,sold:!1,createdAt:Date.now(),views:0};d.add("products",l),d.update("users",r.id,{listingsCount:(r.listingsCount||0)+1}),d.login({...r,listingsCount:(r.listingsCount||0)+1}),_(t==="uz"?"Buyum muvaffaqiyatli joylashtirildi!":"Item listed successfully!","success"),h(`/product/${l.id}`)})}function ot(t,{showPlatformRevenue:e=!1,title:a=null}={}){const i=m(),n=a||(i==="uz"?"Narx taqsimoti":"Price Breakdown"),o=i==="uz"?"Buyum narxi":"Item price",r=i==="uz"?"Xaridor himoyasi":"Buyer protection",l=i==="uz"?"Yetkazib berish":"Shipping",c=i==="uz"?"Siz to'laysiz":"You pay",u=i==="uz"?"Sotuvchi oladi":"Seller receives",p=i==="uz"?"Sotuvchi to'lovi (5%)":"Seller fee (5%)",g=i==="uz"?"Platforma daromadi":"Platform revenue";return`
    <div class="price-breakdown">
      <div class="price-breakdown-header">${n}</div>
      
      <div class="price-breakdown-row">
        <span class="label">${o}</span>
        <span class="value">${w(t.itemPrice)}</span>
      </div>
      
      <div class="price-breakdown-row">
        <span class="label">${r}</span>
        <span class="value">${w(t.escrow)}</span>
      </div>
      
      <div class="price-breakdown-row">
        <span class="label">${l}</span>
        <span class="value">${w(t.shippingCost)}</span>
      </div>
      
      <div class="price-breakdown-row total">
        <span>${c}</span>
        <span>${w(t.buyerPays)}</span>
      </div>

      <div class="divider" style="margin: 0;"></div>

      <div class="price-breakdown-row highlight">
        <span class="label">${u}</span>
        <span class="value">${w(t.sellerGets)}</span>
      </div>
      
      <div class="price-breakdown-row">
        <span class="label text-xs">${p}</span>
        <span class="value text-xs text-muted">-${w(t.sellerFee)}</span>
      </div>

      ${e?`
        <div class="divider" style="margin: 0;"></div>
        <div class="price-breakdown-row" style="background: var(--color-primary-glow);">
          <span class="label" style="color: var(--color-primary);">${g}</span>
          <span class="value" style="color: var(--color-primary); font-weight: 700;">${w(t.platformRevenue)}</span>
        </div>
      `:""}
    </div>
  `}function ra(t){var Q;const e=d.getCurrentUser();if(!e)return h("/login"),"";const a=d.getById("products",t);if(!a)return h("/"),"";const i=m();if(a.sold)return _(i==="uz"?"Bu buyum allaqachon sotilgan":"This item has already been sold","error"),h("/"),"";const s=d.getById("users",a.sellerId),n=$e(s.region,e.region),o=xe(a.price,n.cost),r=i==="uz"?"Buyurtmani rasmiylashtirish":"Checkout",l=i==="uz"?"Buyum":"Item",c=i==="uz"?"To'lov":"Payment",u=i==="uz"?"Tayyor":"Done",p=i==="uz"?"Yetkazish manzili":"Shipping to",g=i==="uz"?"":"From",b=i==="uz"?"To'lov tafsilotlari":"Payment Details",y=i==="uz"?"Simulyatsiya — haqiqiy to'lov amalga oshirilmaydi":"Simulated — no real payment will be made",f=i==="uz"?"Karta raqami":"Card Number",x=i==="uz"?"Amal qilish muddati":"Expiry",L="CVV",B=i==="uz"?"Kartadagi ism":"Name on Card",k=i==="uz"?"To'lash":"Pay",C=i==="uz"?"Xaridor himoyasi":"Buyer Protection",P=i==="uz"?"Buyum tavsifga mos kelmasa pul qaytariladi":"Money-back guarantee if item not as described",j=i==="uz"?"To'lov amalga oshirilmoqda...":"Processing payment...",E=i==="uz"?"Iltimos kuting, sahifani yopmang":"Please wait, do not close this page",A=i==="uz"?"To'lov muvaffaqiyatli!":"Payment Successful!",M=i==="uz"?"Buyurtmangiz yaratildi. Buyurtma kuzatuviga yo'naltirilmoqda...":"Your order has been created. Redirecting to order tracking...",K=i==="uz"?"Buyurtma xulosasi":"Order Summary";return`
    <div class="page">
      <div class="container-narrow">
        <!-- Checkout Steps -->
        <div class="checkout-steps">
          <div class="checkout-step completed">
            <div class="checkout-step-number">✓</div>
            <span class="checkout-step-label hide-mobile">${l}</span>
          </div>
          <div class="checkout-step-line completed"></div>
          <div class="checkout-step active">
            <div class="checkout-step-number">2</div>
            <span class="checkout-step-label hide-mobile">${c}</span>
          </div>
          <div class="checkout-step-line"></div>
          <div class="checkout-step">
            <div class="checkout-step-number">3</div>
            <span class="checkout-step-label hide-mobile">${u}</span>
          </div>
        </div>

        <h1 style="margin-bottom: var(--space-xl);">${r}</h1>

        <div class="grid-2" style="gap: var(--space-2xl); align-items: start;" id="checkout-content">
          <!-- Left: Payment Form -->
          <div>
            <!-- Item Summary -->
            <div class="card" style="margin-bottom: var(--space-lg);">
              <div class="flex gap-md items-center">
                <div style="width: 70px; height: 70px; border-radius: var(--radius-md); overflow: hidden; flex-shrink: 0;">
                  <img src="${((Q=a.images)==null?void 0:Q[0])||""}" style="width: 100%; height: 100%; object-fit: cover;" alt="${a.title}" />
                </div>
                <div>
                  <div class="font-semibold">${a.title}</div>
                  <div class="text-sm text-muted">${a.brand||""} · ${a.condition}</div>
                </div>
              </div>
            </div>

            <!-- Shipping Info -->
            <div class="card" style="margin-bottom: var(--space-lg);">
              <div class="flex items-center gap-sm" style="margin-bottom: var(--space-sm);">
                <span class="font-semibold">${p}: ${e.region}</span>
              </div>
              <div class="text-sm text-muted">
                ${g} ${s.region} · ${n.label}
              </div>
            </div>

            <!-- Payment Form -->
            <div class="card">
              <h3 style="margin-bottom: var(--space-md);">${b}</h3>
              <p class="text-xs text-muted" style="margin-bottom: var(--space-md); padding: var(--space-xs) var(--space-sm); background: var(--bg-warning); border-radius: var(--radius-sm); color: var(--color-warning);">
                ${y}
              </p>
              <form id="payment-form" class="payment-form">
                <div class="form-group">
                  <label class="form-label">${f}</label>
                  <input type="text" class="form-input card-number-display" id="card-number"
                         placeholder="1234 5678 9012 3456" maxlength="19" required />
                </div>
                <div class="card-input-row">
                  <div class="form-group">
                    <label class="form-label">${x}</label>
                    <input type="text" class="form-input" id="card-expiry" placeholder="MM/YY" maxlength="5" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label">${L}</label>
                    <input type="text" class="form-input" id="card-cvv" placeholder="123" maxlength="3" required />
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label">${B}</label>
                  <input type="text" class="form-input" id="card-name" placeholder="${i==="uz"?"To'liq ism":"Full name"}" value="${e.name}" required />
                </div>
                <button type="submit" class="btn btn-primary btn-lg btn-full">
                  ${k} ${w(o.buyerPays)}
                </button>
              </form>
            </div>

            <!-- Buyer Protection -->
            <div class="buyer-protection-badge" style="margin-top: var(--space-lg);">
              <span class="buyer-protection-badge-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></span>
              <div class="buyer-protection-badge-text">
                <strong>${C}</strong> — ${P}
              </div>
            </div>
          </div>

          <!-- Right: Order Summary -->
          <div>
            ${ot(o,{showPlatformRevenue:!0,title:K})}
          </div>
        </div>

        <!-- Processing / Success states (hidden initially) -->
        <div id="payment-processing" class="payment-processing" style="display: none;">
          <div class="spinner"></div>
          <h2>${j}</h2>
          <p class="text-muted">${E}</p>
        </div>

        <div id="payment-success" class="payment-processing" style="display: none;">
          <div class="payment-success-check">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h2 style="color: var(--color-primary);">${A}</h2>
          <p class="text-secondary">${M}</p>
        </div>
      </div>
    </div>
  `}function oa(t){const e=document.getElementById("payment-form");if(!e)return;const a=document.getElementById("card-number");a&&a.addEventListener("input",n=>{let o=n.target.value.replace(/\D/g,"").slice(0,16);o=o.replace(/(\d{4})/g,"$1 ").trim(),n.target.value=o});const i=document.getElementById("card-expiry");i&&i.addEventListener("input",n=>{let o=n.target.value.replace(/\D/g,"").slice(0,4);o.length>=2&&(o=o.slice(0,2)+"/"+o.slice(2)),n.target.value=o});const s=m();e.addEventListener("submit",n=>{n.preventDefault();const o=document.getElementById("card-number").value.replace(/\s/g,""),r=document.getElementById("card-expiry").value,l=document.getElementById("card-cvv").value,c=document.getElementById("card-name").value;if(o.length<12){_(s==="uz"?"Iltimos, to'g'ri karta raqamini kiriting":"Please enter a valid card number","error");return}document.getElementById("checkout-content").style.display="none",document.getElementById("payment-processing").style.display="flex",setTimeout(()=>{try{const u=d.getCurrentUser(),p=Tt(u.id,t,{cardNumber:o,cardExpiry:r,cardCvv:l,cardName:c});document.getElementById("payment-processing").style.display="none",document.getElementById("payment-success").style.display="flex",setTimeout(()=>{h(`/chat/${p.id}`)},2e3)}catch(u){document.getElementById("payment-processing").style.display="none",document.getElementById("checkout-content").style.display="grid",_(u.message||(s==="uz"?"To'lov amalga oshmadi":"Payment failed"),"error")}},2500)})}function Re(t,e){var n;const a=d.getById("products",t.productId),i=m(),s={paid:i==="uz"?"To'langan":"Paid",shipped:i==="uz"?"Jo'natilgan":"Shipped",delivered:i==="uz"?"Yetkazilgan":"Delivered",completed:i==="uz"?"Bajarilgan":"Completed",cancelled:i==="uz"?"Bekor qilingan":"Cancelled",disputed:i==="uz"?"Nizo ochilgan":"Disputed"};return`
    <div class="order-card" data-order-id="${t.id}" style="margin-bottom: var(--space-sm);">
      <div class="order-card-image">
        <img src="${((n=a==null?void 0:a.images)==null?void 0:n[0])||""}" style="width: 100%; height: 100%; object-fit: cover;" />
      </div>
      <div style="flex: 1;">
        <div class="font-semibold">${(a==null?void 0:a.title)||(i==="uz"?"Buyum":"Item")}</div>
        <div class="text-sm text-muted">${w(t.pricing.buyerPays)}</div>
        <div style="margin-top: var(--space-xs);">
          <span class="badge badge-${t.status==="completed"?"success":t.status==="cancelled"?"error":"info"}">${s[t.status]||t.status}</span>
        </div>
      </div>
    </div>
  `}function la(){const t=d.getCurrentUser();if(!t)return h("/login"),"";const e=Rt(t.id).sort((b,y)=>y.createdAt-b.createdAt),a=Dt(t.id).sort((b,y)=>y.createdAt-b.createdAt),i=m(),s=i==="uz"?"Mening buyurtmalarim":"My Orders",n=i==="uz"?"Xaridlar":"Buying",o=i==="uz"?"Sotuvlar":"Selling",r=i==="uz"?"Hali xarid yo'q":"No purchases yet",l=i==="uz"?"Ajoyib narxlarni topish uchun ko'rib chiqishni boshlang!":"Start browsing to find great deals!",c=i==="uz"?"Buyumlarni ko'rish":"Browse items",u=i==="uz"?"Hali sotuv yo'q":"No sales yet",p=i==="uz"?"Sotishni boshlash uchun buyum joylashtiring!":"List an item to start selling!",g=i==="uz"?"Hozir sotish":"Sell now";return`
    <div class="page">
      <div class="container-narrow">
        <h1 style="margin-bottom: var(--space-lg);">${s}</h1>

        <div class="tabs" id="order-tabs">
          <button class="tab active" data-tab="buying">${n} (${e.length})</button>
          <button class="tab" data-tab="selling">${o} (${a.length})</button>
        </div>

        <div id="tab-buying">
          ${e.length>0?e.map(b=>Re(b)).join(""):`
            <div class="empty-state">
              <div class="empty-state-icon">--</div>
              <div class="empty-state-title">${r}</div>
              <div class="empty-state-text">${l}</div>
              <button class="btn btn-primary" onclick="location.hash='/'">${c}</button>
            </div>
          `}
        </div>
        <div id="tab-selling" style="display: none;">
          ${a.length>0?a.map(b=>Re(b)).join(""):`
            <div class="empty-state">
              <div class="empty-state-icon">--</div>
              <div class="empty-state-title">${u}</div>
              <div class="empty-state-text">${p}</div>
              <button class="btn btn-primary" onclick="location.hash='/sell'">${g}</button>
            </div>
          `}
        </div>
      </div>
    </div>
  `}function da(){document.querySelectorAll("#order-tabs .tab").forEach(t=>{t.addEventListener("click",()=>{document.querySelectorAll("#order-tabs .tab").forEach(e=>e.classList.remove("active")),t.classList.add("active"),document.getElementById("tab-buying").style.display=t.dataset.tab==="buying"?"block":"none",document.getElementById("tab-selling").style.display=t.dataset.tab==="selling"?"block":"none"})}),document.querySelectorAll(".order-card").forEach(t=>{t.addEventListener("click",()=>{h(`/order/${t.dataset.orderId}`)})})}function lt(t,e){const a=["paid","shipped","delivered","completed"],i=a.indexOf(e);return`
    <div class="order-timeline">
      ${(t||[]).map((s,n)=>{const o=a.indexOf(s.status)<i||s.status==="completed"||s.status==="refunded",r=s.status===e;return`
          <div class="timeline-step ${o?"completed":r?"active":""}" style="animation-delay: ${n*100}ms">
            <div class="timeline-dot"></div>
            <div class="timeline-step-title">${ca(s.status)}</div>
            <div class="timeline-step-time">${ua(s.timestamp)}</div>
            ${s.note?`<div class="timeline-step-desc">${s.note}</div>`:""}
          </div>
        `}).join("")}
    </div>
  `}function ca(t){return(m()==="uz"?{paid:"To'lov qabul qilindi",shipped:"Jo'natilgan",delivered:"Yetkazilgan",completed:"Bajarilgan",cancelled:"Bekor qilingan",disputed:"Nizo ochilgan",refunded:"Qaytarilgan",open:"Ochilgan",under_review:"Ko'rib chiqilmoqda",return_required:"Qaytarish talab qilinadi",return_shipped:"Qaytarish jo'natilgan",return_received:"Qaytarish qabul qilingan",resolved_refund:"Qaytarish hal qilindi",resolved_no_refund:"Qaytarishsiz hal qilindi",resolved_partial_refund:"Qisman qaytarish",closed:"Yopilgan"}:{paid:"Payment Received",shipped:"Shipped",delivered:"Delivered",completed:"Completed",cancelled:"Cancelled",disputed:"Dispute Opened",refunded:"Refunded",open:"Opened",under_review:"Under Review",return_required:"Return Required",return_shipped:"Return Shipped",return_received:"Return Received",resolved_refund:"Refund Resolved",resolved_no_refund:"Resolved — No Refund",resolved_partial_refund:"Partial Refund",closed:"Closed"})[t]||t}function ua(t){const e=new Date(t);return e.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"})+" · "+e.toLocaleDateString()}function ha(t){const e=m(),a={paid:"badge-info",shipped:"badge-warning",delivered:"badge-success",completed:"badge-success",cancelled:"badge-error",disputed:"badge-error",refunded:"badge-warning"},i=e==="uz"?{paid:"To'langan",shipped:"Jo'natilgan",delivered:"Yetkazilgan",completed:"Bajarilgan",cancelled:"Bekor qilingan",disputed:"Nizolashgan",refunded:"Qaytarilgan"}:{paid:"Paid",shipped:"Shipped",delivered:"Delivered",completed:"Completed",cancelled:"Cancelled",disputed:"Disputed",refunded:"Refunded"};return`<span class="badge ${a[t]||"badge-neutral"}">${i[t]||t}</span>`}let Y=null;function dt(t){var Q,te;const e=d.getCurrentUser();if(!e)return h("/login"),"";const a=d.getById("orders",t),i=m();if(!a)return`<div class="page"><div class="container"><div class="empty-state"><div class="empty-state-icon">?</div><div class="empty-state-title">${i==="uz"?"Buyurtma topilmadi":"Order not found"}</div></div></div></div>`;const s=d.getById("products",a.productId),n=a.buyerId===e.id,o=a.sellerId===e.id,r=d.getById("users",n?a.sellerId:a.buyerId),l=Ot(t);let c="";if(a.status==="delivered"){const ue=a.deliveredAt||(()=>{const ie=[...a.statusHistory].reverse().find(ye=>ye.status==="delivered");return ie?ie.timestamp:Date.now()})(),he=30*60*1e3,me=Date.now()-ue,ae=Math.max(0,he-me),ge=Math.floor(ae/6e4),pe=Math.floor(ae%6e4/1e3);c=`
      <div class="card" style="margin-bottom: var(--space-lg); background: linear-gradient(135deg, rgba(255,184,0,0.1), rgba(255,184,0,0.03)); border-color: rgba(255,184,0,0.3);">
        <div style="text-align: center;">
          <div class="text-xs text-muted" style="margin-bottom: var(--space-xs);">${i==="uz"?"Xaridor tasdiqlash oynasi":"Buyer Confirmation Window"}</div>
          <div id="countdown-timer" style="font-size: var(--font-size-3xl); font-weight: 800; color: var(--color-warning); font-variant-numeric: tabular-nums; letter-spacing: 2px;">
            ${String(ge).padStart(2,"0")}:${String(pe).padStart(2,"0")}
          </div>
          <div class="text-xs text-muted" style="margin-top: var(--space-xs);">${i==="uz"?"Agar muammo xabar qilinmasa, mablag'lar avtomatik chiqariladi":"Funds will auto-release if no issue is reported"}</div>
        </div>
      </div>
    `}const u=i==="uz"?"← Buyurtmalarga qaytish":"← Back to Orders",p=i==="uz"?"Buyurtma holati":"Order Status",g=i==="uz"?"Harakatlar":"Actions",b=i==="uz"?"Buyurtmani bekor qilish":"Cancel Order",y=i==="uz"?"Hammasi yaxshi":"Everything is OK",f=i==="uz"?"Muammo bor":"I Have an Issue",x=i==="uz"?"Nizoni ko'rish":"View Dispute",L=i==="uz"?"Suhbatni ochish":"Open Chat",B=i==="uz"?"Hech qanday harakat mavjud emas":"No actions available",k=i==="uz"?"Sotuvchi":"Seller",C=i==="uz"?"Xaridor":"Buyer",P=i==="uz"?"Yetkazib berish":"Shipping",j=i==="uz"?"Narxi":"Cost",E=i==="uz"?"To'lov":"Payment",A=i==="uz"?"Karta":"Card ending in",M=i==="uz"?"Simulyatsiya: avto-ilgarilanish":"Simulating: auto-progressing",K=i==="uz"?"Keyingi":"Next";return`
    <div class="page">
      <div class="container-narrow">
        <div class="flex justify-between items-center" style="margin-bottom: var(--space-xl);">
          <div>
            <button class="btn btn-ghost btn-sm" onclick="location.hash='/orders'" style="margin-bottom: var(--space-xs);">${u}</button>
            <h1>${i==="uz"?"Buyurtma":"Order"} #${t.slice(-6).toUpperCase()}</h1>
          </div>
          ${ha(a.status)}
        </div>

        <div class="grid-2" style="gap: var(--space-2xl); align-items: start;">
          <!-- Left: Timeline & Actions -->
          <div>
            ${c}
            <!-- Auto-progress indicator -->
            ${l&&l.nextStatus&&l.nextDelay<60?`
              <div class="card" style="margin-bottom: var(--space-lg); background: var(--color-primary-glow); border-color: rgba(0,255,157,0.2);">
                <div class="flex items-center gap-sm">
                  <div class="spinner spinner-sm"></div>
                  <div>
                    <div class="text-sm font-semibold" style="color: var(--color-primary);">${M}</div>
                    <div class="text-xs text-muted">${K}: "${l.nextStatus}" ~${l.nextDelay}s</div>
                  </div>
                </div>
              </div>
            `:""}

            <!-- Timeline -->
            <div class="card" style="margin-bottom: var(--space-lg);">
              <h3 style="margin-bottom: var(--space-md);">${p}</h3>
              <div id="order-timeline">
                ${lt(a.statusHistory,a.status)}
              </div>
            </div>

            <!-- Actions -->
            <div class="card" id="order-actions">
              <h3 style="margin-bottom: var(--space-md);">${g}</h3>
              <div class="flex flex-col gap-sm">
                <!-- Open Chat always available -->
                <button class="btn btn-secondary btn-full" id="open-chat-btn">${L}</button>
                ${n&&a.status==="paid"?`
                  <button class="btn btn-danger btn-full" id="cancel-order-btn">${b}</button>
                `:""}
                ${o&&a.status==="paid"?`
                  <button class="btn btn-danger btn-full" id="cancel-order-btn">${b}</button>
                `:""}
                ${n&&a.status==="delivered"?`
                  <button class="btn btn-primary btn-full" id="confirm-receipt-btn">${y}</button>
                  <button class="btn btn-danger btn-full" id="report-issue-btn">${f}</button>
                `:""}
                ${a.status==="disputed"&&a.disputeId?`
                  <button class="btn btn-warning btn-full" id="view-dispute-btn">${x}</button>
                `:""}
                ${["completed","cancelled","refunded"].includes(a.status)?`
                  <p class="text-sm text-muted text-center">${B}</p>
                `:""}
              </div>
            </div>
          </div>

          <!-- Right: Order Summary -->
          <div>
            <!-- Product -->
            <div class="card" style="margin-bottom: var(--space-lg); cursor: pointer;" id="product-link" data-product-id="${a.productId}">
              <div class="flex gap-md items-center">
                <div style="width: 80px; height: 80px; border-radius: var(--radius-md); overflow: hidden; flex-shrink: 0;">
                  <img src="${((Q=s==null?void 0:s.images)==null?void 0:Q[0])||""}" style="width: 100%; height: 100%; object-fit: cover;" />
                </div>
                <div>
                  <div class="font-semibold">${(s==null?void 0:s.title)||(i==="uz"?"Buyum":"Item")}</div>
                  <div class="text-sm text-muted">${(s==null?void 0:s.brand)||""} · ${(s==null?void 0:s.condition)||""}</div>
                </div>
              </div>
            </div>

            <!-- Other party -->
            <div class="card" style="margin-bottom: var(--space-lg);">
              <div class="text-xs text-muted" style="margin-bottom: var(--space-xs);">${n?k:C}</div>
              <div class="flex items-center gap-sm">
                <div class="avatar avatar-sm">${((te=r==null?void 0:r.name)==null?void 0:te.charAt(0))||"?"}</div>
                <div>
                  <div class="font-semibold text-sm">${(r==null?void 0:r.name)||(i==="uz"?"Noma'lum":"Unknown")}</div>
                  <div class="text-xs text-muted">${(r==null?void 0:r.region)||""}</div>
                </div>
              </div>
            </div>

            <!-- Shipping -->
            <div class="card" style="margin-bottom: var(--space-lg);">
              <div class="text-xs text-muted" style="margin-bottom: var(--space-xs);">${P}</div>
              <div class="text-sm">
                <div>${a.shipping.label}</div>
                <div class="text-muted">${a.shipping.fromRegion} → ${a.shipping.toRegion}</div>
                <div class="text-muted">${j}: ${w(a.shipping.cost)}</div>
              </div>
            </div>

            <!-- Price Breakdown -->
            ${ot(a.pricing,{showPlatformRevenue:!0,title:i==="uz"?"To'lov tafsilotlari":"Payment Details"})}

            <!-- Payment info -->
            <div class="card" style="margin-top: var(--space-lg);">
              <div class="text-xs text-muted" style="margin-bottom: var(--space-xs);">${E}</div>
              <div class="flex items-center gap-sm text-sm">
                <span>${A} ${a.paymentDetails.cardLast4}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `}function ct(t){const e=document.getElementById("cancel-order-btn");e&&e.addEventListener("click",()=>{const c=d.getCurrentUser();Ye(t,c.id)&&h("/orders")});const a=document.getElementById("confirm-receipt-btn");a&&a.addEventListener("click",()=>{Ge(t),h(`/order/${t}`)});const i=document.getElementById("report-issue-btn");i&&i.addEventListener("click",()=>{h(`/chat/${t}`)});const s=document.getElementById("view-dispute-btn");s&&s.addEventListener("click",()=>{h(`/chat/${t}`)});const n=document.getElementById("open-chat-btn");n&&n.addEventListener("click",()=>{h(`/chat/${t}`)});const o=document.getElementById("product-link");o&&o.addEventListener("click",()=>{h(`/product/${o.dataset.productId}`)});const r=document.getElementById("countdown-timer");if(r){const c=d.getById("orders",t);if(c&&c.status==="delivered"){const u=c.deliveredAt||(()=>{const b=[...c.statusHistory].reverse().find(y=>y.status==="delivered");return b?b.timestamp:Date.now()})(),p=30*60*1e3,g=setInterval(()=>{const b=Date.now()-u,y=Math.max(0,p-b),f=Math.floor(y/6e4),x=Math.floor(y%6e4/1e3);r.textContent=`${String(f).padStart(2,"0")}:${String(x).padStart(2,"0")}`,y<=0&&clearInterval(g)},1e3);window._reuzCountdownIntervals||(window._reuzCountdownIntervals=[]),window._reuzCountdownIntervals.push(g)}}Y&&clearInterval(Y);const l=d.getById("orders",t);l&&["paid","shipped","delivered"].includes(l.status)&&(Y=setInterval(()=>{const c=d.getById("orders",t);if(!c){clearInterval(Y);return}const u=document.getElementById("order-timeline");if(u&&c.statusHistory.length>u.querySelectorAll(".timeline-step").length){const p=document.getElementById("app");p&&window.location.hash.includes(t)&&(p.innerHTML=st()+dt(t),ct(t),nt())}},2e3))}function ma(){Y&&(clearInterval(Y),Y=null),window._reuzCountdownIntervals&&(window._reuzCountdownIntervals.forEach(t=>clearInterval(t)),window._reuzCountdownIntervals=[])}const ee=[{id:"not_received",label:"Not Received",icon:"",description:"I never received the item"},{id:"damaged",label:"Damaged",icon:"",description:"Item arrived damaged"},{id:"not_as_described",label:"Not as Described",icon:"",description:"Item is significantly different from listing (SNAD)"},{id:"counterfeit",label:"Counterfeit",icon:"",description:"Item appears to be fake or counterfeit"}],ga=60,se={};function ut(t,e,a,i=[]){const s=d.getById("orders",t);if(!s)throw new Error("Order not found");const n=m();if(s.status!=="delivered")return _(n==="uz"?"Faqat yetkazilgan buyurtmalar uchun muammo xabar qilish mumkin":"Can only report issues for delivered orders","error"),null;const o=ee.find(p=>p.id===e),r=o?o.label:e,l={id:d.generateId(),orderId:t,buyerId:s.buyerId,sellerId:s.sellerId,reason:e,description:a,photos:i,status:"open",sellerResponse:null,resolution:null,escalated:!1,statusHistory:[{status:"open",timestamp:Date.now(),note:n==="uz"?"Xaridor tomonidan nizo ochildi":"Dispute opened by buyer"}],createdAt:Date.now(),updatedAt:Date.now()};d.add("disputes",l);const c={status:"disputed",timestamp:Date.now(),note:`Issue reported: ${e}`},u=[...s.statusHistory||[],c];return d.update("orders",t,{status:"disputed",disputeId:l.id,statusHistory:u,updatedAt:Date.now()}),S(t,n==="uz"?`Nizo ochildi: ${r}. Sotuvchi to'lovi to'xtatildi.`:`Dispute opened: ${r}. Seller payout frozen.`,"warning"),setTimeout(()=>{O(l.id,"under_review",n==="uz"?"Nizo ko'rib chiqilmoqda":"Dispute is being reviewed")},1e4),se[l.id]=setTimeout(()=>{ba(l.id)},ga*1e3),_(n==="uz"?"Nizo ochildi. Sotuvchi to'lovi to'xtatildi.":"Dispute opened. Seller payout frozen.","warning"),l}function re(t,e,a){const i=d.getById("disputes",t);if(!i)return;const s=m();se[t]&&(clearTimeout(se[t]),delete se[t]),d.update("disputes",t,{sellerResponse:e,updatedAt:Date.now()}),a?(O(t,"return_required",s==="uz"?"Sotuvchi qaytarishni qabul qildi. Xaridor buyumni qaytarishi kerak.":"Seller accepted return. Buyer must ship item back."),S(i.orderId,s==="uz"?"Sotuvchi qaytarishni qabul qildi. Iltimos, buyumni qaytarib jo'nating.":"Seller accepted return. Please ship the item back.","info"),_(s==="uz"?"Sotuvchi qaytarishni qabul qildi":"Seller accepted return request","info")):(S(i.orderId,s==="uz"?"Sotuvchi nizoni rad etdi. Platforma ko'rib chiqmoqda...":"Seller rejected the dispute. Platform is reviewing...","warning"),setTimeout(()=>{const n=i.reason;n==="not_as_described"||n==="counterfeit"||n==="damaged"?ce(t):(O(t,"return_required",s==="uz"?"Platforma qaytarishni talab qiladi.":"Platform requires item return for refund."),S(i.orderId,s==="uz"?"Platforma qaytarishni talab qiladi.":"Platform requires item return for refund.","info"))},12e3))}function ht(t){const e=d.getById("disputes",t);if(!e||e.status!=="return_required")return;const a=m();O(t,"return_shipped",a==="uz"?"Xaridor qaytarishni jo'natdi":"Buyer has shipped the return"),S(e.orderId,a==="uz"?"Qaytarish jo'natildi. Sotuvchi qabul qilguncha kutilmoqda.":"Return shipped. Waiting for seller to receive.","info"),setTimeout(()=>{pa(t)},15e3)}function pa(t){const e=d.getById("disputes",t);if(!e)return;const a=m();O(t,"return_received",a==="uz"?"Sotuvchi qaytarilgan buyumni qabul qildi":"Seller received returned item"),S(e.orderId,a==="uz"?"Sotuvchi qaytarilgan buyumni qabul qildi. Qaytarish jarayonida...":"Seller received returned item. Processing refund...","info"),setTimeout(()=>{ce(t)},8e3)}function ya(t){const e=d.getById("disputes",t);if(!e)return;const a=m();d.update("disputes",t,{escalated:!0,updatedAt:Date.now()}),O(t,"under_review",a==="uz"?"Nizo ReUz qo'llab-quvvatlash xizmatiga yuborildi":"Dispute escalated to ReUz support");const i=J(e.orderId);i&&(Pt(i.id),He(i.id,a==="uz"?"ReUz qo'llab-quvvatlash xizmati suhbatga qo'shildi. Biz ishni ko'rib chiqamiz.":"ReUz support has joined the chat. We will review this case.","warning")),_(a==="uz"?"Nizo ReUz xizmatiga yuborildi":"Dispute escalated to ReUz support","info"),setTimeout(()=>{const s=d.getById("disputes",t);if(s&&!s.status.startsWith("resolved_")){const n=s.reason;n==="not_as_described"||n==="counterfeit"||n==="damaged"||n==="not_received"?ce(t):(O(t,"return_required",a==="uz"?"ReUz qaytarishni talab qiladi":"ReUz requires item return"),S(s.orderId,a==="uz"?"ReUz qaytarishni talab qiladi. Iltimos, buyumni qaytaring.":"ReUz requires item return. Please ship the item back.","info"))}},2e4)}function ba(t){const e=d.getById("disputes",t);if(!e||e.status==="closed")return;const a=m();O(t,"under_review",a==="uz"?"Sotuvchi javob bermadi. Platforma avtomatik hal qilmoqda.":"Seller did not respond. Platform is auto-resolving."),S(e.orderId,a==="uz"?"Sotuvchi javob bermadi. Avtomatik qaytarish jarayonida...":"Seller did not respond. Auto-refund in progress...","warning"),setTimeout(()=>{ce(t)},8e3)}function ce(t){const e=d.getById("disputes",t);if(!e)return;const a=m(),i=d.getById("orders",e.orderId);if(!i)return;d.update("disputes",t,{resolution:"full_refund",updatedAt:Date.now()}),O(t,"resolved_refund",a==="uz"?"Xaridorga to'liq qaytarish amalga oshirildi":"Full refund issued to buyer");const s={status:"refunded",timestamp:Date.now(),note:a==="uz"?"To'liq qaytarish amalga oshirildi":"Full refund issued"},n=[...i.statusHistory||[],s];d.update("orders",i.id,{status:"refunded",statusHistory:n,updatedAt:Date.now()}),d.update("products",i.productId,{sold:!1,soldAt:null}),S(e.orderId,a==="uz"?`To'liq qaytarish amalga oshirildi: $${i.pricing.buyerPays.toFixed(2)}. Nizo hal qilindi.`:`Full refund issued: $${i.pricing.buyerPays.toFixed(2)}. Dispute resolved.`,"success"),_(a==="uz"?"Nizo hal qilindi — to'liq qaytarish!":"Dispute resolved — full refund issued!","success")}function O(t,e,a){const i=d.getById("disputes",t);if(!i)return;const s={status:e,timestamp:Date.now(),note:a},n=[...i.statusHistory||[],s];d.update("disputes",t,{status:e,statusHistory:n,updatedAt:Date.now()})}let H=null;function va(t){var B;const e=d.getCurrentUser();if(!e)return h("/login"),"";const a=d.getById("orders",t);if(!a)return h("/orders"),"";const i=d.getById("products",a.productId),s=a.buyerId===e.id,n=a.sellerId===e.id,o=m(),r=a.disputeId?d.getById("disputes",a.disputeId):null;if(r)return fa(r,a,i,s,n,o);if(!s||a.status!=="delivered")return`
      <div class="page">
        <div class="container-narrow">
          <div class="empty-state">
            <div class="empty-state-icon">?</div>
            <div class="empty-state-title">${o==="uz"?"Nizo ochib bo'lmaydi":"Cannot open a dispute"}</div>
            <div class="empty-state-text">${s?o==="uz"?"Muammolar faqat yetkazilgan buyurtmalar uchun xabar qilinishi mumkin":"Issues can only be reported for delivered orders":o==="uz"?"Faqat xaridorlar muammo xabar qilishi mumkin":"Only buyers can report issues"}</div>
            <button class="btn btn-secondary" onclick="location.hash='/orders'">${o==="uz"?"Buyurtmalarga qaytish":"Back to Orders"}</button>
          </div>
        </div>
      </div>
    `;const l=o==="uz"?"← Buyurtmaga qaytish":"← Back to Order",c=o==="uz"?"Muammo xabar qilish":"Report an Issue",u=o==="uz"?"Nizo sababini tanlang. To'lovingiz himoyalangan.":"Select the reason for your dispute. Your payment is protected.",p=o==="uz"?"To'langan":"Paid",g=o==="uz"?"Muammo nima?":"What's the issue?",b=o==="uz"?"Muammoni tasvirlang *":"Describe the issue *",y=o==="uz"?"Iltimos, buyum bilan nima noto'g'ri ekanligini tasvirlang...":"Please describe what's wrong with the item...",f=o==="uz"?"Xaridor himoyasi — Ishni ko'rib chiqayotganimizda sotuvchining to'lovi to'xtatilgan. Agar sotuvchi 15s ichida javob bermasa (simulyatsiya 48s), sizga avtomatik qaytariladi.":"Buyer Protection — Seller payout will be frozen while we review your case. If the seller doesn't respond within 15s (simulated 48h), you'll be automatically refunded.",x=o==="uz"?"Nizoni yuborish":"Submit Dispute",L=ee.map(k=>({...k,label:o==="uz"?ze(k.id).label:k.label,description:o==="uz"?ze(k.id).description:k.description}));return`
    <div class="page">
      <div class="container-narrow">
        <button class="btn btn-ghost btn-sm" onclick="location.hash='/order/${t}'" style="margin-bottom: var(--space-md);">${l}</button>

        <h1 style="margin-bottom: var(--space-xs);">
          <span style="color: var(--color-error);">${c}</span>
        </h1>
        <p class="text-muted" style="margin-bottom: var(--space-xl);">
          ${u}
        </p>

        <!-- Item Summary -->
        <div class="card" style="margin-bottom: var(--space-xl);">
          <div class="flex gap-md items-center">
            <div style="width: 60px; height: 60px; border-radius: var(--radius-md); overflow: hidden; flex-shrink: 0;">
              <img src="${((B=i==null?void 0:i.images)==null?void 0:B[0])||""}" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>
            <div>
              <div class="font-semibold">${(i==null?void 0:i.title)||(o==="uz"?"Buyum":"Item")}</div>
              <div class="text-sm text-muted">${p}: ${w(a.pricing.buyerPays)}</div>
            </div>
          </div>
        </div>

        <!-- Reason Selection -->
        <h3 style="margin-bottom: var(--space-md);">${g}</h3>
        <div class="dispute-reason-cards" id="reason-cards">
          ${L.map(k=>`
            <div class="dispute-reason-card" data-reason="${k.id}">
              <div class="dispute-reason-icon">${k.icon}</div>
              <div class="dispute-reason-title">${k.label}</div>
              <p class="text-xs text-muted" style="margin-top: var(--space-2xs);">${k.description}</p>
            </div>
          `).join("")}
        </div>

        <!-- Description form (hidden until reason selected) -->
        <div id="dispute-form-container" style="display: none; margin-top: var(--space-xl);">
          <div class="card" style="padding: var(--space-xl);">
            <form id="dispute-form" class="flex flex-col gap-md">
              <div class="form-group">
                <label class="form-label">${b}</label>
                <textarea class="form-input" id="dispute-description" 
                          placeholder="${y}" required maxlength="500"></textarea>
              </div>
              <div class="buyer-protection-badge">
                <span>${o==="uz"?"Nizo":"Dispute"}</span>
                <div class="text-sm">
                  <strong>${o==="uz"?"Xaridor himoyasi":"Buyer Protection"}</strong> — ${f}
                </div>
              </div>
              <button type="submit" class="btn btn-danger btn-lg btn-full">
                ${x}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `}function ze(t){return{not_received:{label:"Olinmagan",description:"Buyumni olmadim"},damaged:{label:"Shikastlangan",description:"Buyum shikastlangan holda keldi"},not_as_described:{label:"Tavsifga mos kelmaydi",description:"Buyum e'londan sezilarli farq qiladi"},counterfeit:{label:"Soxta",description:"Buyum soxta ko'rinadi"}}[t]||{label:t,description:""}}function fa(t,e,a,i,s,n){var M;const o={open:"badge-warning",under_review:"badge-info",resolved_refund:"badge-success",resolved_no_refund:"badge-error",resolved_partial_refund:"badge-warning",return_required:"badge-warning",return_shipped:"badge-info",return_received:"badge-info",closed:"badge-neutral"},r=ee.find(K=>K.id===t.reason),l=t.status.startsWith("resolved_"),c=n==="uz"?ze(t.reason).label:(r==null?void 0:r.label)||t.reason,u=n==="uz"?"← Buyurtmaga qaytish":"← Back to Order",p=n==="uz"?"Miqdor":"Amount",g=n==="uz"?"Nizo jarayoni":"Dispute Progress",b=n==="uz"?"Harakatlar":"Actions",y=n==="uz"?"Bu nizoga javob bering:":"Respond to this dispute:",f=n==="uz"?"Qaytarishni qabul qilish":"Accept Return",x=n==="uz"?"Nizoni rad etish":"Reject Dispute",L=n==="uz"?"Agar 15s ichida javob berilmasa, sotuvchi foydasiga hal qilinmaydi":"Auto-resolve in seller's disfavor if no response within 15s",B=n==="uz"?"Buyumni sotuvchiga qaytaring va qaytarishni oling.":"Ship the item back to the seller to receive your refund.",k=n==="uz"?"Jo'natilgan deb belgilash":"Mark as Shipped",C=n==="uz"?"To'liq qaytarish amalga oshirildi":"Full refund issued",P=n==="uz"?"Qisman qaytarish amalga oshirildi":"Partial refund issued",j=n==="uz"?"Nizo hal qilindi — qaytarish yo'q":"Dispute resolved — no refund",E=n==="uz"?"Qaytarish jarayonida...":"Processing return...",A=n==="uz"?"Sotuvchi javobi yoki avtomatik hal qilish kutilmoqda...":"Waiting for seller response or auto-resolution...";return`
    <div class="page">
      <div class="container-narrow">
        <button class="btn btn-ghost btn-sm" onclick="location.hash='/order/${e.id}'" style="margin-bottom: var(--space-md);">${u}</button>

        <div class="flex justify-between items-center" style="margin-bottom: var(--space-xl);">
          <div>
            <h1>${n==="uz"?"Nizo":"Dispute"} #${t.id.slice(-6).toUpperCase()}</h1>
            <p class="text-muted text-sm">${c}</p>
          </div>
          <span class="badge ${o[t.status]||"badge-neutral"}">${t.status.replace(/_/g," ")}</span>
        </div>

        <!-- Item -->
        <div class="card" style="margin-bottom: var(--space-lg);">
          <div class="flex gap-md items-center">
            <div style="width: 60px; height: 60px; border-radius: var(--radius-md); overflow: hidden; flex-shrink: 0;">
              <img src="${((M=a==null?void 0:a.images)==null?void 0:M[0])||""}" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>
            <div>
              <div class="font-semibold">${(a==null?void 0:a.title)||(n==="uz"?"Buyum":"Item")}</div>
              <div class="text-sm text-muted">${p}: ${w(e.pricing.buyerPays)}</div>
            </div>
          </div>
        </div>

        <!-- Dispute Reason -->
        <div class="dispute-panel" style="margin-bottom: var(--space-lg);">
          <div class="dispute-panel-header">
            <div class="flex items-center gap-sm">
              <span>${(r==null?void 0:r.icon)||""}</span>
              <span class="font-semibold">${c}</span>
            </div>
          </div>
          <div style="padding: var(--space-lg);">
            <p class="text-sm text-secondary">${t.description}</p>
          </div>
        </div>

        <!-- Dispute Timeline -->
        <div class="card" style="margin-bottom: var(--space-lg);">
          <h3 style="margin-bottom: var(--space-md);">${g}</h3>
          <div id="dispute-timeline">
            ${lt(t.statusHistory,t.status)}
          </div>
        </div>

        <!-- Actions -->
        <div class="card" id="dispute-actions">
          <h3 style="margin-bottom: var(--space-md);">${b}</h3>
          ${s&&["open","under_review"].includes(t.status)&&!t.sellerResponse?`
            <div class="flex flex-col gap-sm">
              <p class="text-sm text-muted">${y}</p>
              <button class="btn btn-primary btn-full" id="accept-return-btn">${f}</button>
              <button class="btn btn-secondary btn-full" id="reject-dispute-btn">${x}</button>
              <p class="text-xs text-muted text-center">${L}</p>
            </div>
          `:""}
          ${i&&t.status==="return_required"?`
            <div class="flex flex-col gap-sm">
              <p class="text-sm text-muted">${B}</p>
              <button class="btn btn-primary btn-full" id="ship-return-btn">${k}</button>
            </div>
          `:""}
          ${l?`
            <div style="text-align: center; padding: var(--space-md);">
              ${t.resolution==="full_refund"?`
                <div class="text-success font-semibold text-lg">${C}</div>
                <p class="text-sm text-muted" style="margin-top: var(--space-xs);">${p}: ${w(e.pricing.buyerPays)}</p>
              `:t.resolution==="partial_refund"?`
                <div class="text-warning font-semibold text-lg">${P}</div>
                <p class="text-sm text-muted" style="margin-top: var(--space-xs);">${p}: ${w(t.refundAmount||0)}</p>
              `:`
                <div class="text-error font-semibold text-lg">${j}</div>
              `}
            </div>
          `:""}
          ${["return_shipped","return_received"].includes(t.status)?`
            <div class="flex items-center gap-sm justify-center" style="padding: var(--space-md);">
              <div class="spinner spinner-sm"></div>
              <span class="text-sm text-muted">${E}</span>
            </div>
          `:""}
          ${t.status==="open"||t.status==="under_review"?`
            ${i?`
              <div class="flex items-center gap-sm justify-center" style="padding: var(--space-md);">
                <div class="spinner spinner-sm"></div>
                <span class="text-sm text-muted">${A}</span>
              </div>
            `:""}
          `:""}
        </div>
      </div>
    </div>
  `}function ka(t){const e=d.getById("orders",t),a=e!=null&&e.disputeId?d.getById("disputes",e.disputeId):null,i=m();let s=null;document.querySelectorAll(".dispute-reason-card").forEach(c=>{c.addEventListener("click",()=>{document.querySelectorAll(".dispute-reason-card").forEach(u=>u.classList.remove("selected")),c.classList.add("selected"),s=c.dataset.reason,document.getElementById("dispute-form-container").style.display="block"})});const n=document.getElementById("dispute-form");n&&n.addEventListener("submit",c=>{if(c.preventDefault(),!s){_(i==="uz"?"Iltimos, sababni tanlang":"Please select a reason","error");return}const u=document.getElementById("dispute-description").value.trim();ut(t,s,u)&&h(`/dispute/${t}`)});const o=document.getElementById("accept-return-btn");o&&a&&o.addEventListener("click",()=>{re(a.id,i==="uz"?"Qaytarishni qabul qilaman":"I accept the return",!0),setTimeout(()=>h(`/dispute/${t}`),500)});const r=document.getElementById("reject-dispute-btn");r&&a&&r.addEventListener("click",()=>{re(a.id,i==="uz"?"Bu nizoga qo'shilmayman":"I disagree with this dispute",!1),_(i==="uz"?"Javob yuborildi. Platforma ko'rib chiqadi.":"Response submitted. Platform will review.","info"),setTimeout(()=>h(`/dispute/${t}`),500)});const l=document.getElementById("ship-return-btn");l&&a&&l.addEventListener("click",()=>{ht(a.id),_(i==="uz"?"Qaytarish jo'natilgan deb belgilandi":"Return marked as shipped","info"),setTimeout(()=>h(`/dispute/${t}`),500)}),H&&clearInterval(H),a&&!a.status.startsWith("resolved_")&&(H=setInterval(()=>{const c=d.getById("disputes",a.id);if(!c){clearInterval(H);return}const u=document.getElementById("dispute-timeline");u&&c.statusHistory.length>u.querySelectorAll(".timeline-step").length&&(h(`/dispute/${t}`),clearInterval(H))},2e3))}function wa(){H&&(clearInterval(H),H=null)}let D=null;function za(t){var f;const e=d.getCurrentUser();if(!e)return h("/login"),"";const a=d.getById("orders",t);if(!a)return h("/orders"),"";const i=d.getById("products",a.productId),s=a.buyerId===e.id,n=a.sellerId===e.id,o=d.getById("users",s?a.sellerId:a.buyerId),r=m(),l=Ue(t);if(!l)return h("/orders"),"";const c=a.disputeId?d.getById("disputes",a.disputeId):null,u={with:r==="uz"?"bilan":"with",placeholder:r==="uz"?"Xabar yozing...":"Type a message...",report:r==="uz"?"Muammo xabar qilish":"Report a problem",escalated:r==="uz"?"ReUz qo'llab-quvvatlash xizmati suhbatga qo'shilgan":"ReUz support has joined this conversation",confirm:r==="uz"?"Buyurtmani tasdiqlash":"Confirm Order",cancel:r==="uz"?"Bekor qilish":"Cancel Order",acceptReturn:r==="uz"?"Qaytarishni qabul qilish":"Accept Return",reject:r==="uz"?"Rad etish":"Reject",shipReturn:r==="uz"?"Qaytarishni jo'natish":"Ship Return",escalate:r==="uz"?"ReUz ga yuborish":"Escalate to ReUz",orderDetails:r==="uz"?"Buyurtma tafsilotlari":"Order details",item:r==="uz"?"Buyum":"Item",chatEnded:r==="uz"?"Bu suhbat yakunlangan":"This conversation has ended",emptyChat:r==="uz"?"Hali xabar yo'q. Suhbatni boshlang!":"No messages yet. Start the conversation!"},p={paid:r==="uz"?"To'langan":"Paid",shipped:r==="uz"?"Jo'natilgan":"Shipped",delivered:r==="uz"?"Yetkazilgan":"Delivered",completed:r==="uz"?"Bajarilgan":"Completed",cancelled:r==="uz"?"Bekor qilingan":"Cancelled",disputed:r==="uz"?"Nizolashgan":"Disputed",refunded:r==="uz"?"Qaytarilgan":"Refunded"},g={paid:"badge-info",shipped:"badge-warning",delivered:"badge-success",completed:"badge-success",cancelled:"badge-error",disputed:"badge-error",refunded:"badge-warning"},b=["completed","cancelled","refunded"].includes(a.status),y=c&&c.status.startsWith("resolved_");return`
    <div class="chat-page">
      <div class="chat-container">
        <!-- Header -->
        <div class="chat-header">
          <div class="chat-header-image">
            ${(f=i==null?void 0:i.images)!=null&&f[0]?`<img src="${i.images[0]}" alt="${(i==null?void 0:i.title)||""}" />`:'<div style="width:100%;height:100%;background:var(--bg-elevated);"></div>'}
          </div>
          <div class="chat-header-info">
            <div class="chat-header-title">${(i==null?void 0:i.title)||u.item}</div>
            <div class="chat-header-subtitle">
              <span>${w(a.pricing.buyerPays)}</span>
              <span>&middot;</span>
              <span>${u.with} ${(o==null?void 0:o.name)||"?"}</span>
            </div>
          </div>
          <div class="chat-header-actions">
            <span class="badge ${g[a.status]||"badge-neutral"}">${p[a.status]||a.status}</span>
            <button class="btn btn-ghost btn-sm" onclick="location.hash='/order/${t}'" title="${u.orderDetails}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            </button>
          </div>
        </div>

        <!-- Escalated Banner -->
        ${l.escalated?`
          <div class="chat-escalated-banner">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span>${u.escalated}</span>
          </div>
        `:""}

        <!-- Messages Area -->
        <div class="chat-messages" id="chat-messages">
          ${mt(l,e.id,r,u)}
        </div>

        <!-- Action Buttons -->
        ${$a(a,c,s,n,l,u)}

        <!-- Bottom: Input + Footer (ALWAYS visible) -->
        <div class="chat-bottom">
          <div class="chat-input-bar">
            <input type="text" id="chat-input" placeholder="${b?u.chatEnded:u.placeholder}" autocomplete="off" ${b&&y?"disabled":""} />
            <button class="chat-send-btn" id="chat-send-btn" disabled>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
          ${s&&!b?`
            <div class="chat-footer-link">
              <a id="chat-report-link">${u.report}</a>
            </div>
          `:""}
        </div>

        <!-- Report Overlay (hidden by default) -->
        <div id="chat-report-overlay" style="display: none;"></div>
      </div>
    </div>
  `}function mt(t,e,a,i){return!t.messages||t.messages.length===0?`<div class="chat-system-message system-info"><span>${i.emptyChat}</span></div>`:t.messages.map(s=>{var l;if(s.type==="system"){const c=s.subtype?`system-${s.subtype}`:"",u=xa(s.subtype);return`
        <div class="chat-system-message ${c}">
          <span class="chat-system-message-icon">${u}</span>
          <span>${s.text}</span>
        </div>
      `}const n=s.senderId===e,o=d.getById("users",s.senderId),r=new Date(s.timestamp).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});return`
      <div class="chat-message ${n?"sent":"received"}">
        <div class="chat-message-avatar">${((l=o==null?void 0:o.name)==null?void 0:l.charAt(0))||"?"}</div>
        <div>
          <div class="chat-message-bubble">${_a(s.text)}</div>
          <span class="chat-message-time">${r}</span>
        </div>
      </div>
    `}).join("")}function _a(t){const e=document.createElement("div");return e.textContent=t,e.innerHTML}function xa(t){switch(t){case"success":return'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>';case"warning":return'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';case"error":return'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';default:return'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'}}function $a(t,e,a,i,s,n){const o=[];return a&&t.status==="delivered"&&!e&&o.push(`<button class="btn btn-primary btn-sm" id="chat-confirm-btn">${n.confirm}</button>`),(a||i)&&t.status==="paid"&&o.push(`<button class="btn btn-ghost btn-sm" id="chat-cancel-btn">${n.cancel}</button>`),i&&e&&["open","under_review"].includes(e.status)&&!e.sellerResponse&&(o.push(`<button class="btn btn-primary btn-sm" id="chat-accept-return-btn">${n.acceptReturn}</button>`),o.push(`<button class="btn btn-secondary btn-sm" id="chat-reject-btn">${n.reject}</button>`)),a&&e&&e.status==="return_required"&&o.push(`<button class="btn btn-primary btn-sm" id="chat-ship-return-btn">${n.shipReturn}</button>`),e&&!e.status.startsWith("resolved_")&&e.status!=="closed"&&!e.escalated&&(a||i)&&o.push(`<button class="btn btn-warning btn-sm" id="chat-escalate-btn">${n.escalate}</button>`),o.length===0?"":`<div class="chat-action-bar">${o.join("")}</div>`}function qa(t){const e={title:t==="uz"?"Muammo xabar qilish":"Report a Problem",cancel:t==="uz"?"Bekor qilish":"Cancel"},a=ee.map(s=>({...s,label:t==="uz"?_e(s.id).label:s.label,description:t==="uz"?_e(s.id).description:s.description})),i={not_received:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><line x1="1" y1="3" x2="23" y2="16"/></svg>',damaged:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',not_as_described:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',counterfeit:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'};return`
    <div class="chat-report-overlay">
      <div class="chat-report-header">
        <span class="chat-report-header-title">${e.title}</span>
        <button class="chat-report-close" id="chat-report-close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="chat-report-body">
        <div class="chat-report-reasons">
          ${a.map(s=>`
            <div class="chat-report-reason" data-reason="${s.id}">
              <span class="chat-report-reason-icon">${i[s.id]||""}</span>
              <div>
                <div class="font-semibold text-sm">${s.label}</div>
                <div class="text-xs text-muted">${s.description}</div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
      <div class="chat-report-cancel-row">
        <button class="btn btn-ghost btn-full btn-sm" id="chat-report-cancel-btn">${e.cancel}</button>
      </div>
    </div>
  `}function _e(t){return{not_received:{label:"Olinmagan",description:"Buyumni olmadim"},damaged:{label:"Shikastlangan",description:"Buyum shikastlangan holda keldi"},not_as_described:{label:"Tavsifga mos kelmaydi",description:"Buyum e'londan sezilarli farq qiladi"},counterfeit:{label:"Soxta",description:"Buyum soxta ko'rinadi"}}[t]||{label:t,description:""}}function Ba(t){const e=d.getCurrentUser();if(!e)return;const a=d.getById("orders",t);if(!a)return;const i=J(t);if(!i)return;const s=m();a.buyerId,e.id;const n=a.disputeId?d.getById("disputes",a.disputeId):null;gt();const o=document.getElementById("chat-input"),r=document.getElementById("chat-send-btn");o&&r&&(o.addEventListener("input",()=>{r.disabled=!o.value.trim()}),o.addEventListener("keypress",c=>{c.key==="Enter"&&o.value.trim()&&(De(i.id,e.id,o.value.trim(),t),o.value="",r.disabled=!0)}),r.addEventListener("click",()=>{o.value.trim()&&(De(i.id,e.id,o.value.trim(),t),o.value="",r.disabled=!0)}));const l=document.getElementById("chat-report-link");l&&l.addEventListener("click",c=>{c.preventDefault(),Sa(t,s)}),G("chat-confirm-btn",()=>{Ge(t),W(t)}),G("chat-cancel-btn",()=>{Ye(t,e.id),W(t)}),n&&(G("chat-accept-return-btn",()=>{re(n.id,s==="uz"?"Qaytarishni qabul qilaman":"I accept the return",!0),W(t)}),G("chat-reject-btn",()=>{re(n.id,s==="uz"?"Bu nizoga qo'shilmayman":"I disagree with this dispute",!1),W(t)}),G("chat-ship-return-btn",()=>{ht(n.id),W(t)}),G("chat-escalate-btn",()=>{ya(n.id),W(t)})),Ia(t)}function G(t,e){const a=document.getElementById(t);a&&a.addEventListener("click",e)}function De(t,e,a,i){Ct(t,e,a),La(i)}function Sa(t,e){const a=document.getElementById("chat-report-overlay");if(!a)return;const i=d.getById("orders",t);if(i.status!=="delivered"){_(e==="uz"?"Muammo faqat yetkazilgan buyurtmalar uchun xabar qilinishi mumkin":"Issues can only be reported for delivered orders","error");return}if(i.disputeId){_(e==="uz"?"Bu buyurtma uchun nizo allaqachon ochilgan":"A dispute is already open for this order","info");return}a.style.display="block",a.innerHTML=qa(e);const s=document.getElementById("chat-report-close");s&&s.addEventListener("click",()=>ke());const n=document.getElementById("chat-report-cancel-btn");n&&n.addEventListener("click",()=>ke()),a.querySelectorAll(".chat-report-reason").forEach(o=>{o.addEventListener("click",()=>{const r=o.dataset.reason,l=ee.find(p=>p.id===r),c=e==="uz"?_e(r).label:(l==null?void 0:l.label)||r;ke(),ut(t,r,c)&&W(t)})})}function ke(){const t=document.getElementById("chat-report-overlay");t&&(t.style.display="none",t.innerHTML="")}function La(t){const e=d.getCurrentUser();if(!e)return;const a=J(t);if(!a)return;const i=m(),s={emptyChat:i==="uz"?"Hali xabar yo'q. Suhbatni boshlang!":"No messages yet. Start the conversation!"},n=document.getElementById("chat-messages");n&&(n.innerHTML=mt(a,e.id,i,s),gt())}function W(t){setTimeout(()=>h(`/chat/${t}`),400)}function gt(){const t=document.getElementById("chat-messages");t&&setTimeout(()=>{t.scrollTop=t.scrollHeight},50)}function Ia(t){D&&clearInterval(D);let e=0;const a=J(t);a&&(e=a.messages.length),D=setInterval(()=>{const i=J(t);if(!i){clearInterval(D);return}if(!document.getElementById("chat-messages")){clearInterval(D);return}i.messages.length>e&&(e=i.messages.length,h(`/chat/${t}`),clearInterval(D))},1500)}function Ea(){D&&(clearInterval(D),D=null)}function Oe(t){const e=d.getCurrentUser(),a=t||(e?e.id:null),i=m();if(!a)return h("/login"),"";const s=d.getById("users",a);if(!s)return`<div class="page"><div class="container"><div class="empty-state"><div class="empty-state-icon">?</div><div class="empty-state-title">${i==="uz"?"Foydalanuvchi topilmadi":"User not found"}</div></div></div></div>`;const n=e&&e.id===s.id,o=d.filter("products",k=>k.sellerId===s.id),r=o.filter(k=>!k.sold),l=o.filter(k=>k.sold),c=Math.floor((Date.now()-s.joinedAt)/864e5),u=i==="uz"?`A'zo bo'lganiga ${c} kun`:`Member for ${c} days`,p=i==="uz"?"sharh":"reviews",g=i==="uz"?"e'lonlar":"listings",b=i==="uz"?"sotilgan":"sold",y=i==="uz"?"Faol":"Active",f=i==="uz"?"Sotilgan":"Sold",x=i==="uz"?"Faol e'lonlar yo'q":"No active listings",L=i==="uz"?"Buyum joylashtirish":"List an item",B=i==="uz"?"Hali sotilgan buyum yo'q":"No sold items yet";return`
    <div class="page">
      <div class="container-narrow">
        <div class="profile-header">
          <div class="avatar avatar-xl">${s.name.charAt(0)}</div>
          <div style="flex: 1;">
            <h1 style="margin-bottom: var(--space-2xs);">${s.name}</h1>
            <div class="text-sm text-muted" style="margin-bottom: var(--space-sm);">
              ${s.region} · ${u}
            </div>
            ${s.bio?`<p class="text-sm text-secondary">${s.bio}</p>`:""}
            <div class="profile-stats" style="margin-top: var(--space-md);">
              <div class="profile-stat">
                <div class="profile-stat-value" style="color: var(--color-primary);">${s.rating.toFixed(1)}</div>
                <div class="profile-stat-label">${s.reviewCount} ${p}</div>
              </div>
              <div class="profile-stat">
                <div class="profile-stat-value">${o.length}</div>
                <div class="profile-stat-label">${g}</div>
              </div>
              <div class="profile-stat">
                <div class="profile-stat-value">${l.length}</div>
                <div class="profile-stat-label">${b}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="divider"></div>

        <div class="tabs" id="profile-tabs">
          <button class="tab active" data-tab="active">${y} (${r.length})</button>
          <button class="tab" data-tab="sold">${f} (${l.length})</button>
        </div>

        <div id="profile-tab-active">
          ${r.length>0?`
            <div class="product-grid" id="profile-products">
              ${r.map(k=>Z(k)).join("")}
            </div>
          `:`
            <div class="empty-state">
              <div class="empty-state-icon">--</div>
              <div class="empty-state-title">${x}</div>
              ${n?`<button class="btn btn-primary" onclick="location.hash='/sell'">${L}</button>`:""}
            </div>
          `}
        </div>

        <div id="profile-tab-sold" style="display: none;">
          ${l.length>0?`
            <div class="product-grid">
              ${l.map(k=>Z(k)).join("")}
            </div>
          `:`
            <div class="empty-state">
              <div class="empty-state-icon">--</div>
              <div class="empty-state-title">${B}</div>
            </div>
          `}
        </div>
      </div>
    </div>
  `}function Me(){de(document.getElementById("profile-products")),document.querySelectorAll("#profile-tabs .tab").forEach(t=>{t.addEventListener("click",()=>{document.querySelectorAll("#profile-tabs .tab").forEach(a=>a.classList.remove("active")),t.classList.add("active");const e=t.dataset.tab;document.getElementById("profile-tab-active").style.display=e==="active"?"block":"none",document.getElementById("profile-tab-sold").style.display=e==="sold"?"block":"none"})})}function Aa(){if(!d.getCurrentUser())return h("/login"),"";const e=d.getAll("orders"),a=d.getAll("disputes"),i=d.getAll("products"),s=m(),n=e.filter(v=>v.status==="completed"),o=e.filter(v=>["paid","shipped","delivered"].includes(v.status)),r=e.filter(v=>v.status==="disputed"),l=n.reduce((v,I)=>v+I.pricing.platformRevenue,0),c=n.reduce((v,I)=>v+I.pricing.sellerFee,0),u=n.reduce((v,I)=>v+I.pricing.escrow,0),p=e.reduce((v,I)=>v+I.pricing.buyerPays,0),g=a.filter(v=>!v.status.startsWith("resolved_")&&v.status!=="closed"),b=a.filter(v=>v.status.startsWith("resolved_")),y=s==="uz"?"Platforma boshqaruv paneli":"Platform Dashboard",f=s==="uz"?"ReUz bozori tahlili va ko'rsatkichlari":"ReUz marketplace analytics and metrics",x=s==="uz"?"Platforma daromadi":"Platform Revenue",L=s==="uz"?"Umumiy GMV":"Total GMV",B=s==="uz"?"Jami buyurtmalar":"Total Orders",k=s==="uz"?"Jami e'lonlar":"Total Listings",C=s==="uz"?"Daromad taqsimoti":"Revenue Breakdown",P=s==="uz"?"Sotuvchi to'lovlari (5%)":"Seller Fees (5%)",j=s==="uz"?"Xaridor himoyasi to'lovlari":"Buyer Protection Fees",E=s==="uz"?"Jami daromad":"Total Revenue",A=s==="uz"?"Buyurtmalar ko'rinishi":"Order Overview",M=s==="uz"?"Faol":"Active",K=s==="uz"?"Bajarilgan":"Completed",Q=s==="uz"?"Nizolashgan":"Disputed",te=s==="uz"?"Bekor qilingan":"Cancelled",ue=s==="uz"?"Qaytarilgan":"Refunded",he=s==="uz"?"Nizolar":"Disputes",me=s==="uz"?"Ochiq":"Open",ae=s==="uz"?"Hal qilingan":"Resolved",ge=s==="uz"?"So'nggi buyurtmalar":"Recent Orders",pe=s==="uz"?"Buyurtma ID":"Order ID",ie=s==="uz"?"Buyum":"Item",ye=s==="uz"?"Xaridor to'ladi":"Buyer Paid",yt=s==="uz"?"Platforma":"Platform Rev",bt=s==="uz"?"Sotuvchi oladi":"Seller Gets",vt=s==="uz"?"Holati":"Status",ft=s==="uz"?"Hali buyurtma yo'q":"No orders yet",kt=s==="uz"?"Tranzaksiyalar boshlanganida buyurtma ma'lumotlari bu yerda paydo bo'ladi":"Order data will appear here once transactions start",wt={paid:s==="uz"?"To'langan":"Paid",shipped:s==="uz"?"Jo'natilgan":"Shipped",delivered:s==="uz"?"Yetkazilgan":"Delivered",completed:s==="uz"?"Bajarilgan":"Completed",cancelled:s==="uz"?"Bekor qilingan":"Cancelled",disputed:s==="uz"?"Nizolashgan":"Disputed",refunded:s==="uz"?"Qaytarilgan":"Refunded"};return`
    <div class="page">
      <div class="container">
        <h1 style="margin-bottom: var(--space-xs);">${y}</h1>
        <p class="text-muted" style="margin-bottom: var(--space-xl);">${f}</p>

        <!-- Stats Grid -->
        <div class="stats-grid" style="margin-bottom: var(--space-2xl);">
          <div class="stat-card">
            <div class="stat-card-icon">$</div>
            <div class="stat-card-value" style="color: var(--color-primary);">${w(l)}</div>
            <div class="stat-card-label">${x}</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-icon">+</div>
            <div class="stat-card-value">${w(p)}</div>
            <div class="stat-card-label">${L}</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-icon">#</div>
            <div class="stat-card-value">${e.length}</div>
            <div class="stat-card-label">${B}</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-icon">L</div>
            <div class="stat-card-value">${i.length}</div>
            <div class="stat-card-label">${k}</div>
          </div>
        </div>

        <div class="grid-2" style="gap: var(--space-2xl);">
          <!-- Revenue Breakdown -->
          <div class="card">
            <h3 style="margin-bottom: var(--space-lg);">${C}</h3>
            <div class="flex flex-col gap-md">
              <div>
                <div class="flex justify-between text-sm" style="margin-bottom: var(--space-2xs);">
                  <span class="text-muted">${P}</span>
                  <span class="font-semibold">${w(c)}</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-bar-fill" style="width: ${l>0?c/l*100:0}%;"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-sm" style="margin-bottom: var(--space-2xs);">
                  <span class="text-muted">${j}</span>
                  <span class="font-semibold">${w(u)}</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-bar-fill" style="width: ${l>0?u/l*100:0}%;"></div>
                </div>
              </div>
            </div>

            <div class="divider"></div>

            <div class="flex justify-between font-bold text-lg">
              <span>${E}</span>
              <span style="color: var(--color-primary);">${w(l)}</span>
            </div>
          </div>

          <!-- Order Status Distribution -->
          <div class="card">
            <h3 style="margin-bottom: var(--space-lg);">${A}</h3>
            <div class="flex flex-col gap-sm">
              ${[{label:M,count:o.length,color:"var(--color-info)"},{label:K,count:n.length,color:"var(--color-success)"},{label:Q,count:r.length,color:"var(--color-error)"},{label:te,count:e.filter(v=>v.status==="cancelled").length,color:"var(--text-muted)"},{label:ue,count:e.filter(v=>v.status==="refunded").length,color:"var(--color-warning)"}].map(v=>`
                <div class="flex justify-between items-center text-sm">
                  <div class="flex items-center gap-sm">
                    <div style="width: 8px; height: 8px; border-radius: 50%; background: ${v.color};"></div>
                    <span>${v.label}</span>
                  </div>
                  <span class="font-semibold">${v.count}</span>
                </div>
              `).join("")}
            </div>

            <div class="divider"></div>

            <div>
              <h4 class="text-sm font-semibold" style="margin-bottom: var(--space-sm);">${he}</h4>
              <div class="flex justify-between text-sm">
                <span class="text-muted">${me}</span>
                <span class="font-semibold" style="color: var(--color-warning);">${g.length}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-muted">${ae}</span>
                <span class="font-semibold" style="color: var(--color-success);">${b.length}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Orders Table -->
        <div class="card" style="margin-top: var(--space-2xl);">
          <h3 style="margin-bottom: var(--space-lg);">${ge}</h3>
          ${e.length>0?`
            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="border-bottom: 1px solid var(--border-subtle);">
                    <th style="text-align: left; padding: var(--space-sm); font-size: var(--font-size-xs); color: var(--text-muted); font-weight: 600;">${pe}</th>
                    <th style="text-align: left; padding: var(--space-sm); font-size: var(--font-size-xs); color: var(--text-muted); font-weight: 600;">${ie}</th>
                    <th style="text-align: left; padding: var(--space-sm); font-size: var(--font-size-xs); color: var(--text-muted); font-weight: 600;">${ye}</th>
                    <th style="text-align: left; padding: var(--space-sm); font-size: var(--font-size-xs); color: var(--text-muted); font-weight: 600;">${yt}</th>
                    <th style="text-align: left; padding: var(--space-sm); font-size: var(--font-size-xs); color: var(--text-muted); font-weight: 600;">${bt}</th>
                    <th style="text-align: left; padding: var(--space-sm); font-size: var(--font-size-xs); color: var(--text-muted); font-weight: 600;">${vt}</th>
                  </tr>
                </thead>
                <tbody>
                  ${e.sort((v,I)=>I.createdAt-v.createdAt).slice(0,10).map(v=>{const I=d.getById("products",v.productId),zt={paid:"badge-info",shipped:"badge-warning",delivered:"badge-success",completed:"badge-success",cancelled:"badge-error",disputed:"badge-error",refunded:"badge-warning"};return`
                      <tr style="border-bottom: 1px solid var(--border-subtle); cursor: pointer;" class="order-row" data-order-id="${v.id}">
                        <td style="padding: var(--space-sm); font-size: var(--font-size-sm);">#${v.id.slice(-6).toUpperCase()}</td>
                        <td style="padding: var(--space-sm); font-size: var(--font-size-sm);">${(I==null?void 0:I.title)||(s==="uz"?"Noma'lum":"Unknown")}</td>
                        <td style="padding: var(--space-sm); font-size: var(--font-size-sm); font-weight: 600;">${w(v.pricing.buyerPays)}</td>
                        <td style="padding: var(--space-sm); font-size: var(--font-size-sm); color: var(--color-primary); font-weight: 600;">${w(v.pricing.platformRevenue)}</td>
                        <td style="padding: var(--space-sm); font-size: var(--font-size-sm);">${w(v.pricing.sellerGets)}</td>
                        <td style="padding: var(--space-sm);"><span class="badge ${zt[v.status]||"badge-neutral"}">${wt[v.status]||v.status}</span></td>
                      </tr>
                    `}).join("")}
                </tbody>
              </table>
            </div>
          `:`
            <div class="empty-state" style="padding: var(--space-xl);">
              <div class="empty-state-icon">--</div>
              <div class="empty-state-title">${ft}</div>
              <div class="empty-state-text">${kt}</div>
            </div>
          `}
        </div>
      </div>
    </div>
  `}function Ca(){document.querySelectorAll(".order-row").forEach(t=>{t.addEventListener("click",()=>{h(`/order/${t.dataset.orderId}`)})})}const Ee=[{id:"buyer-protection",slug:"buyer-protection-fee",icon:"",category:"buying",en:{title:"Buyer Protection Fee on ReUz",sections:[{heading:null,body:"Our goal is to provide buyers with a secure purchasing experience by applying a Buyer Protection fee. This fee is mandatory for every order made through ReUz and is added automatically at checkout."},{heading:"How the fee is calculated",body:"The calculation of this fee varies based on several factors, such as:",bullets:["Item characteristics","Order value","Order type (a single item versus a bundle)"]},{heading:null,body:"The Buyer Protection fee typically includes a percentage of the item's or bundle's price, as well as a fixed fee — usually <strong>2% + $0.50</strong>."},{heading:"Where the fee appears",body:"As you browse items, the fee is included in the price breakdown for each listing and reflected in the total price for the item or bundle. At checkout, the total Buyer Protection fee, which includes VAT, will be added to your order's final price and clearly displayed in the order summary."},{heading:null,body:'Learn more about the benefits that you get from our <a href="#/help/refund-policy" class="help-link">Buyer Protection and Refund Policy</a>.'}]},uz:{title:"ReUz'da Xaridor Himoyasi To'lovi",sections:[{heading:null,body:"Bizning maqsadimiz xaridorlarga Xaridor Himoyasi to'lovini qo'llash orqali xavfsiz xarid tajribasini taqdim etishdir. Bu to'lov ReUz orqali berilgan har bir buyurtma uchun majburiy bo'lib, to'lov sahifasida avtomatik ravishda qo'shiladi."},{heading:"To'lov qanday hisoblanadi",body:"Ushbu to'lovning hisobi bir qancha omillarga asoslanadi, masalan:",bullets:["Buyum xususiyatlari","Buyurtma qiymati","Buyurtma turi (bitta buyum yoki to'plam)"]},{heading:null,body:"Xaridor Himoyasi to'lovi odatda buyum yoki to'plam narxining foizini, shuningdek belgilangan to'lovni o'z ichiga oladi — odatda <strong>2% + $0.50</strong>."},{heading:"To'lov qayerda ko'rsatiladi",body:"Buyumlarni ko'rib chiqayotganingizda, to'lov har bir e'lonning narx tarkibiga kiritilgan va buyum yoki to'plamning umumiy narxida aks ettirilgan. To'lov sahifasida QQS ni o'z ichiga olgan umumiy Xaridor Himoyasi to'lovi buyurtmangizning yakuniy narxiga qo'shiladi va buyurtma xulosasida aniq ko'rsatiladi."},{heading:null,body:`Bizning <a href="#/help/refund-policy" class="help-link">Xaridor Himoyasi va Qaytarish Siyosati</a>dan oladigan imtiyozlar haqida ko'proq bilib oling.`}]}},{id:"packing-item",slug:"packing-an-item",icon:"",category:"selling",en:{title:"Packing an Item",sections:[{heading:null,body:"When sending items with the prepaid ReUz-generated shipping label, make sure they are packed properly and comply with our Catalog Rules and the prohibited items list."},{heading:null,body:"<strong>You may not receive a refund or compensation if you ignore these rules and the package gets damaged in transit.</strong>"},{heading:"To pack an item",body:null,bullets:["<strong>Use sturdy outer packaging</strong> that snugly fits the item. For example, a cardboard box to protect the item from dirt and moisture, or carrier-provided packaging, such as a padded waterproof envelope or bag, if available. Don't use bags without padding inside.","<strong>Fill the empty space</strong> inside with bubble wrap, paper, foam, or similar material to prevent movement and contact with the outer packaging during transit.","<strong>Seal the package</strong> with strong tape to provide extra protection and prevent the item from falling out.","<strong>Stick the shipping label</strong> flat on the largest side of the package, ensuring the barcode is fully visible. Secure the label's edges with strong tape. Remove any old labels.",'<strong>For fragile items</strong>, always use a sturdy box, not a plastic bag. Stick a "Fragile" label on the package. Separate each fragile item with bubble wrap or other cushioning material.',"<strong>For bundles</strong>, place all items in one package (no more than two electronic devices with batteries). Make sure each item is securely wrapped and not moving inside.","If unsure, always follow your carrier's packaging requirements."]},{heading:"Note",body:"We recommend taking photos of the item and the packed package (inside and outside) before shipping. If the buyer reports any issues during transit, these photos may help resolve the issue faster."}]},uz:{title:"Buyumni Qadoqlash",sections:[{heading:null,body:"ReUz tomonidan yaratilgan oldindan to'langan jo'natish yorlig'i bilan buyumlarni jo'natayotganda, ularning to'g'ri qadoqlanganligiga va Katalog Qoidalari hamda taqiqlangan buyumlar ro'yxatiga muvofiqligiga ishonch hosil qiling."},{heading:null,body:"<strong>Agar ushbu qoidalarga e'tibor bermasangiz va paket jo'natish paytida shikastlansa, qaytarish yoki kompensatsiya olmaysiz.</strong>"},{heading:"Buyumni qadoqlash",body:null,bullets:["<strong>Mustahkam tashqi qadoqlashdan foydalaning</strong> — buyumga mos keladigan. Masalan, buyumni kir va namlikdan himoya qilish uchun karton quti, yoki mavjud bo'lsa, tashuvchi tomonidan taqdim etilgan qadoqlash, masalan, yumshoq suv o'tkazmaydigan konvert yoki sumka. Ichida to'ldiruvchisi yo'q sumkalardan foydalanmang.","<strong>Bo'sh joyni to'ldiring</strong> — pufakcham, qog'oz, ko'pik yoki shunga o'xshash material bilan harakatlanishni va tashqi qadoqlash bilan aloqani oldini olish uchun.","<strong>Paketni muhriang</strong> — mustahkam lenta bilan qo'shimcha himoya ta'minlash va buyumning tushib ketishini oldini olish uchun.","<strong>Jo'natish yorlig'ini yopishtiring</strong> — paketning eng katta tomoniga tekis holda, shtrix-kod to'liq ko'rinib turishiga ishonch hosil qiling. Yorliq chetlarini mustahkam lenta bilan mahkamlang. Eski yorliqlarni olib tashlang.",`<strong>Mo'rt buyumlar uchun</strong> — har doim mustahkam qutidan foydalaning, polietilen paketdan emas. Paketga "Mo'rt" yorlig'ini yopishtiring. Har bir mo'rt buyumni pufakcham yoki boshqa to'ldiruvchi material bilan ajrating.`,"<strong>To'plamlar uchun</strong> — barcha buyumlarni bitta paketga joylashtiring (batareyali ikki ta elektronik qurilmadan ko'p emas). Har bir buyum xavfsiz o'ralgan va ichida harakatlanmasligiga ishonch hosil qiling.","Agar ishonchingiz komil bo'lmasa, har doim tashuvchingizning qadoqlash talablariga rioya qiling."]},{heading:"Eslatma",body:"Jo'natishdan oldin buyum va qadoqlangan paketning (ichkaridan va tashqaridan) rasmlarini olishni tavsiya qilamiz. Agar xaridor jo'natish paytida biror muammo haqida xabar bersa, bu rasmlar muammoni tezroq hal qilishga yordam berishi mumkin."}]}},{id:"returning-item",slug:"returning-an-item",icon:"",category:"buying",en:{title:"Returning an Item",sections:[{heading:null,body:`When you make a purchase using the "Buy now" button, you're covered by our <a href="#/help/buyer-protection-fee" class="help-link">Buyer Protection</a> and <a href="#/help/refund-policy" class="help-link">Refund Policy</a>.`},{heading:null,body:`This means we can help you return an item for a refund if it's <a href="#/help/significantly-not-as-described" class="help-link">significantly not as described (SNAD)</a>. If an item doesn't fit you or you don't like it, you can only return it if your seller agrees to refund you.`},{heading:null,body:`If you don't use the "Buy now" button to make a purchase, you'll need to discuss the return and refund options directly with your seller as Buyer Protection won't apply.`},{heading:'Press "I have an issue" & submit a refund request',body:'<strong>1. Press "I have an issue"</strong> in your conversation screen with the seller within 2 days from being notified by ReUz that the item should have been delivered.'},{heading:null,body:`If you don't report any issues within this time (or if you press "Everything is OK"), the order will be completed automatically and your payment sent to the seller.`},{heading:null,body:"<strong>2. Provide proof</strong><br><br>Attach photos of the item and explain your issue to the seller. This should include:",bullets:["The item with the damaged parts visible","The item's packaging showing its damaged parts","The item's parts that do not match the item description"]},{heading:null,body:'When ready, press "Send to seller" to submit a refund request. Once you submit a refund request, your order will be suspended to keep your money safe until the issue is resolved.'},{heading:null,body:"<strong>3. Talk to the seller — find a resolution</strong><br><br>Discuss the return and refund options with the seller. The seller can:",bullets:["<strong>Offer you a partial refund</strong> (not available for bundles): The seller offers an amount to resolve the issue — you can choose to accept or decline it. If you accept the offer, you will keep the item and receive a partial refund of the item's price, the Buyer Protection fee, and sales tax, along with a full refund of any applicable customs tax.","<strong>Offer you a full refund:</strong> You'll keep the order and get a full refund of the above-mentioned fees and taxes.","<strong>Ask you for a return:</strong> You'll need to return any reported items in time to get a refund for them."]},{heading:"Return the item for a refund",body:'If the seller requests a return, press "Return the order" to check your options. You can either:',bullets:["Use an integrated shipping option on ReUz for the return (if available for your order)","Select a shipping provider for the return and get a ReUz-generated shipping label or code","Arrange your own tracked return and pay for shipping separately (please note that this option is only available for local shipping)"]},{heading:null,body:"Use a shipping provider with tracked shipping and share the following with the seller:",bullets:["A valid tracking number of the package","A photo of the item in the packaging","A photo of the shipping label (with visible tracking number, and both sender and recipient names and addresses)"]},{heading:null,body:"The buyer usually covers the cost of return shipping. However, you can discuss it with the seller and they can offer to pay for it when requesting a return. Ask the seller for their contact details if your shipping provider requires them."},{heading:null,body:"If you can't find an agreement with the seller or they're not communicating, you can contact us to help find a solution. Once you've confirmed the return option, you must proceed with the return — you can't change your selection or cancel the refund request."},{heading:"Pack the return",body:`Pack the package securely so it returns safely. Make sure to return everything in the same condition as you received it (i.e. you shouldn't wash or use the item). Include all contents from the original package (e.g. receipts, labels, dust bags). See our guide on <a href="#/help/packing-an-item" class="help-link">packing an item</a>.`},{heading:"Time limit to return an order",body:"Once the seller requests a return, you'll have <strong>5 business days</strong> to send the package. If you don't send it in time, your refund request will be closed and your payment will be released to the seller."},{heading:"Bundles",body:"If all the items in a bundle are SNAD, you'll need to return the whole order. If only part of the bundle is SNAD, you'll only need to return the items you reported (unless they're confirmed as counterfeit)."},{heading:"Electronic devices",body:`If you find that your electronic item is still linked to the seller's account, you may need to raise an issue following the steps described above. If you purchased an electronic device and have used it, make sure to delete any personal data and disconnect your personal accounts (such as Samsung, Google, or Apple accounts). Check if there's a "factory reset" option to return the device to its original state.`},{heading:"Get your refund",body:`When the seller receives the package, they will have <strong>2 days</strong> to confirm whether everything's OK with the item. Once they press "Everything is OK" (or the 2-day deadline ends), you'll <a href="#/help/receiving-a-refund" class="help-link">receive a refund</a>. The refund is made up of:`,bullets:["The price of any returned items","The Buyer Protection fee for any returned items","The initial shipping fee you paid to get the order","Sales tax","Customs tax (for international shipping only)"]},{heading:null,body:"The refunded Buyer Protection fee is calculated based on the items that you keep, and we'll refund you the difference. Also, any offers, discounts, and vouchers used during purchase are subtracted from your refund. The amount subtracted is proportional to the price of any refunded items."},{heading:"Returning an item for other reasons",body:"If you want to return an item and get a refund because it doesn't fit or you don't like it, you'll need to discuss this with your seller. It's the seller's choice to accept returns or not."},{heading:"Return the order",body:"If the seller agrees to a return, you can use any shipping option available to send it back. We recommend using an integrated shipping option. Ask the seller for their contact details if your shipping provider requires them. If you can't find an agreement with the seller or they're not communicating, you can contact us to help find a solution. You should pay for any applicable shipping costs (unless agreed otherwise)."},{heading:"Pack the return",body:`Pack the package securely so it returns safely. Make sure to return everything in the same condition as you received it (i.e. you shouldn't wash or use the item). Include all contents from the original package (e.g. receipts, labels, dust bags). See our guide on <a href="#/help/packing-an-item" class="help-link">packing an item</a>.`},{heading:"Time limit to return an order",body:"Once the seller provides their return address and contact details, you'll have <strong>5 business days</strong> to send the package."}]},uz:{title:"Buyumni Qaytarish",sections:[{heading:null,body:'"Sotib olish" tugmasidan foydalanib xarid qilganingizda, siz bizning <a href="#/help/buyer-protection-fee" class="help-link">Xaridor Himoyasi</a> va <a href="#/help/refund-policy" class="help-link">Qaytarish Siyosati</a> bilan himoyalangansiz.'},{heading:null,body:`Bu siz <a href="#/help/significantly-not-as-described" class="help-link">tavsifga sezilarli mos kelmaydigan (SNAD)</a> buyumni qaytarish uchun pul qaytarib olishingizga yordam berishimiz mumkinligini anglatadi. Agar buyum sizga mos kelmasa yoki yoqmasa, uni faqat sotuvchi qaytarishga rozi bo'lsagina qaytarishingiz mumkin.`},{heading:null,body:`Agar xarid qilish uchun "Sotib olish" tugmasidan foydalanmasangiz, qaytarish va pul qaytarish variantlarini bevosita sotuvchingiz bilan muhokama qilishingiz kerak bo'ladi, chunki Xaridor Himoyasi qo'llanilmaydi.`},{heading:`"Muammo bor" tugmasini bosing va qaytarish so'rovini yuboring`,body:'<strong>1. "Muammo bor" tugmasini bosing</strong> — sotuvchi bilan suhbat ekranida, ReUz tomonidan buyum yetkazilishi kerakligi haqida xabar berilganidan 2 kun ichida.'},{heading:null,body:`Agar shu vaqt ichida biror muammo haqida xabar bermasangiz (yoki "Hammasi yaxshi" tugmasini bossangiz), buyurtma avtomatik bajariladi va to'lovingiz sotuvchiga yuboriladi.`},{heading:null,body:"<strong>2. Dalil taqdim eting</strong><br><br>Buyumning rasmlarini biriktiring va muammoingizni sotuvchiga tushuntiring. Bu quyidagilarni o'z ichiga olishi kerak:",bullets:["Shikastlangan qismlari ko'rinib turgan buyum","Shikastlangan qismlarini ko'rsatuvchi buyum qadoqlashi","Buyum tavsifiga mos kelmaydigan buyum qismlari"]},{heading:null,body:`Tayyor bo'lgach, qaytarish so'rovini yuborish uchun "Sotuvchiga yuborish" tugmasini bosing. Qaytarish so'rovini yuborganingizdan so'ng, muammo hal qilinguncha pulingizni himoya qilish uchun buyurtmangiz to'xtatiladi.`},{heading:null,body:"<strong>3. Sotuvchi bilan gaplashing — yechim toping</strong><br><br>Qaytarish va pul qaytarish variantlarini sotuvchi bilan muhokama qiling. Sotuvchi:",bullets:["<strong>Qisman qaytarish taklif qilishi mumkin</strong> (to'plamlar uchun mavjud emas): Sotuvchi muammoni hal qilish uchun summa taklif qiladi — siz qabul qilishingiz yoki rad etishingiz mumkin.","<strong>To'liq qaytarish taklif qilishi mumkin:</strong> Siz buyurtmani saqlaysiz va yuqorida aytilgan to'lovlar va soliqlarning to'liq qaytarilishini olasiz.","<strong>Qaytarishni so'rashi mumkin:</strong> Pul qaytarib olish uchun xabar berilgan buyumlarni o'z vaqtida qaytarishingiz kerak bo'ladi."]},{heading:"Pul qaytarib olish uchun buyumni qaytaring",body:`Agar sotuvchi qaytarishni so'rasa, variantlaringizni tekshirish uchun "Buyurtmani qaytarish" tugmasini bosing. Siz:`,bullets:["Qaytarish uchun ReUz'dagi integratsiyalangan jo'natish variantidan foydalanishingiz mumkin (buyurtmangiz uchun mavjud bo'lsa)","Qaytarish uchun jo'natish provayderini tanlang va ReUz tomonidan yaratilgan jo'natish yorlig'i yoki kodini oling","O'zingizning kuzatiladigan qaytarishingizni tashkil qiling va jo'natish uchun alohida to'lang (iltimos, bu variant faqat mahalliy jo'natish uchun mavjud ekanligini yodda tuting)"]},{heading:null,body:"Kuzatiladigan jo'natish bilan jo'natish provayderidan foydalaning va sotuvchi bilan quyidagilarni ulashing:",bullets:["Paketning amaldagi kuzatuv raqami","Qadoqlashdagi buyumning rasmi","Jo'natish yorlig'ining rasmi (ko'rinadigan kuzatuv raqami va jo'natuvchi hamda qabul qiluvchining ismlari va manzillari bilan)"]},{heading:null,body:"Qaytarish jo'natish xarajatlarini odatda xaridor o'z zimmasiga oladi. Biroq, siz buni sotuvchi bilan muhokama qilishingiz mumkin va ular qaytarishni so'raganda to'lashni taklif qilishlari mumkin."},{heading:null,body:"Agar sotuvchi bilan kelishuv topa olmasangiz yoki ular bog'lanmasa, yechim topishga yordam berish uchun biz bilan bog'lanishingiz mumkin. Qaytarish variantini tasdiqlaganingizdan so'ng, qaytarishni davom ettirishingiz kerak — tanlovingizni o'zgartira olmaysiz yoki qaytarish so'rovini bekor qila olmaysiz."},{heading:"Qaytarishni qadoqlang",body:`Paketni xavfsiz qaytarilishi uchun puxta qadoqlang. Hamma narsani olganingizdek qaytarishga ishonch hosil qiling (ya'ni buyumni yuvmasligingiz yoki ishlatmasligingiz kerak). Asl paketdagi barcha tarkibni o'z ichiga oling. <a href="#/help/packing-an-item" class="help-link">Buyumni qadoqlash</a> bo'yicha qo'llanmamizni ko'ring.`},{heading:"Buyurtmani qaytarish uchun muddat",body:"Sotuvchi qaytarishni so'raganidan so'ng, paketni jo'natish uchun <strong>5 ish kuningiz</strong> bor. Agar o'z vaqtida jo'natmasangiz, qaytarish so'rovingiz yopiladi va to'lovingiz sotuvchiga chiqariladi."},{heading:"To'plamlar",body:"To'plamdagi barcha buyumlar SNAD bo'lsa, butun buyurtmani qaytarishingiz kerak bo'ladi. Agar to'plamning faqat bir qismi SNAD bo'lsa, faqat xabar bergan buyumlaringizni qaytarishingiz kerak bo'ladi (agar ular soxta deb tasdiqlangan bo'lmasa)."},{heading:"Elektron qurilmalar",body:"Agar elektron buyumingiz hali ham sotuvchining hisobiga ulangan bo'lsa, yuqorida tasvirlangan qadamlarni bajarib muammo ko'tarishingiz kerak bo'lishi mumkin. Agar elektron qurilma sotib olib ishlatgan bo'lsangiz, shaxsiy ma'lumotlarni o'chirib, shaxsiy hisoblaringizni uzishga ishonch hosil qiling."},{heading:"Pulingizni qaytarib oling",body:'Sotuvchi paketni olganida, buyum bilan hammasi yaxshimi tekshirish uchun <strong>2 kun</strong> muddati bor. "Hammasi yaxshi" tugmasini bosgach (yoki 2 kunlik muddat tugagach), siz <a href="#/help/receiving-a-refund" class="help-link">pul qaytarib olasiz</a>. Qaytarish quyidagilardan iborat:',bullets:["Qaytarilgan buyumlarning narxi","Qaytarilgan buyumlar uchun Xaridor Himoyasi to'lovi","Buyurtmani olish uchun to'lagan dastlabki jo'natish to'lovi","Sotuv solig'i","Bojxona solig'i (faqat xalqaro jo'natish uchun)"]},{heading:null,body:"Qaytarilgan Xaridor Himoyasi to'lovi siz saqlab qolgan buyumlar asosida hisoblanadi va biz sizga farqni qaytaramiz. Shuningdek, xarid paytida ishlatilgan takliflar, chegirmalar va vaucherlar qaytarishingizdan chegiriladi."},{heading:"Boshqa sabablarga ko'ra buyumni qaytarish",body:"Agar buyumni mos kelmagani yoki yoqmagani uchun qaytarmoqchi bo'lsangiz, buni sotuvchingiz bilan muhokama qilishingiz kerak bo'ladi. Qaytarishni qabul qilish yoki qilmaslik sotuvchining tanlovidir."},{heading:"Buyurtmani qaytaring",body:"Agar sotuvchi qaytarishga rozi bo'lsa, qaytarish uchun mavjud bo'lgan har qanday jo'natish variantidan foydalanishingiz mumkin. Integratsiyalangan jo'natish variantidan foydalanishni tavsiya qilamiz. Agar kelishuv topa olmasangiz, yechim topish uchun biz bilan bog'laning. Tegishli jo'natish xarajatlarini to'lashingiz kerak (boshqacha kelishilmagan bo'lsa)."},{heading:"Qaytarishni qadoqlang",body:`Paketni xavfsiz qaytarilishi uchun puxta qadoqlang. Hamma narsani olganingizdek qaytarishga ishonch hosil qiling. <a href="#/help/packing-an-item" class="help-link">Buyumni qadoqlash</a> bo'yicha qo'llanmamizni ko'ring.`},{heading:"Buyurtmani qaytarish uchun muddat",body:"Sotuvchi qaytarish manzili va aloqa ma'lumotlarini taqdim etganidan so'ng, paketni jo'natish uchun <strong>5 ish kuningiz</strong> bor."}]}},{id:"snad-items",slug:"significantly-not-as-described",icon:"",category:"buying",en:{title:'"Significantly Not as Described" Items at ReUz',sections:[{heading:null,body:`Items that don't match their listing description or photos are considered "significantly not as described" (or SNAD).`},{heading:"What is considered SNAD?",body:"Here are the main cases that would be considered SNAD:",bullets:["Wrong colour","Incorrect size","Missing item parts and/or accessories that weren't detailed in the listing description or photos","Bundles with missing items","A damaged item (stained, ripped, broken or damaged in any other way) that wasn't detailed in the description or photos","Different main materials from the listing (if at least one is inaccurate)","Counterfeit","Any other visible flaw that wasn't detailed in the listing","Functionality not as described (e.g. console not connecting to the TV, accessory not pairing, device not charging, buttons or touchscreen not working)"]},{heading:"What is not SNAD?",body:null,bullets:["Items that you don't like or that don't fit you","Minor differences to an item that don't affect its use or look (slight colour differences due to lighting; in case of multi-material items, differences in the additional materials not listed among the main 3 in the description, etc.)"]},{heading:null,body:`See how to <a href="#/help/returning-an-item" class="help-link">return an item</a> for a refund if it's significantly not as described (SNAD).`}]},uz:{title:`ReUz'da "Tavsifga Sezilarli Mos Kelmaydigan" Buyumlar`,sections:[{heading:null,body:`E'lon tavsifi yoki rasmlariga mos kelmaydigan buyumlar "tavsifga sezilarli mos kelmaydi" (yoki SNAD) hisoblanadi.`},{heading:"SNAD deb nima hisoblanadi?",body:"SNAD deb hisoblanadiigan asosiy holatlar:",bullets:["Noto'g'ri rang","Noto'g'ri o'lcham","E'lon tavsifi yoki rasmlarida batafsil ko'rsatilmagan buyum qismlari va/yoki aksessuarlar yo'qligi","Buyumlari yetishmaydigan to'plamlar","Tavsif yoki rasmlarda batafsil ko'rsatilmagan shikastlangan buyum (dog'li, yirtilgan, singan yoki boshqa tarzda shikastlangan)","E'londagi asosiy materiallardan farq qiladigan materiallar (kamida bittasi noto'g'ri bo'lsa)","Soxta","E'londa batafsil ko'rsatilmagan boshqa har qanday ko'rinadigan nuqson","Funksionallik tavsifga mos kelmaydi (masalan, konsol televizorga ulanmaydi, aksessuar juftlanmaydi, qurilma zaryadlanmaydi, tugmalar yoki sensorli ekran ishlamaydi)"]},{heading:"SNAD deb nima HISOBLANMAYDI?",body:null,bullets:["Yoqmagan yoki mos kelmaydigan buyumlar","Buyumning foydalanishi yoki ko'rinishiga ta'sir qilmaydigan kichik farqlar (yoritish tufayli rang farqlari; ko'p materialli buyumlarda tavsifda ko'rsatilmagan qo'shimcha materiallardagi farqlar va boshqalar)"]},{heading:null,body:`Tavsifga sezilarli mos kelmasa pul qaytarib olish uchun <a href="#/help/returning-an-item" class="help-link">buyumni qanday qaytarish</a> mumkinligini ko'ring.`}]}},{id:"canceling-order",slug:"canceling-an-order",icon:"",category:"buying",en:{title:"Canceling an Order",sections:[{heading:null,body:"An order can only be cancelled (by either the buyer or the seller) if the item hasn't been shipped yet."},{heading:"To cancel an order",body:null,bullets:["Open your conversation with the other member","Press the ⓘ symbol in the top-right corner","Choose <strong>Cancel order</strong> and select a reason from the list, or choose <strong>Other</strong> and give more details"]},{heading:null,body:"The seller might have to confirm the cancellation if they've already sent the order, but the tracking information hasn't been updated yet. If they don't confirm the cancellation, please wait until the order is cancelled automatically."},{heading:"Note",body:"If you cancel an order manually, you might receive automatic negative feedback. To avoid it, inform the other member before canceling the order and reach a mutual agreement. Then they will be able to edit or delete the feedback. Additionally, buyers can wait until the order is cancelled automatically instead of canceling it themselves."},{heading:"Good to know",body:"After an order is cancelled, sellers can press <strong>Re-upload item</strong> in their conversation screen to put the item on sale again. In certain cases, we may cancel an order too."},{heading:"Order was canceled. What happened?",body:"There are several possible reasons why an order may get cancelled. It can happen either if we receive no tracking details or due to issues after the item is sent."},{heading:"No tracking details",body:"The order will get cancelled if the seller:",bullets:["Doesn't download the shipping label in 4 business days",`Doesn't send the item or doesn't press the "Item sent" button in 5 business days`,"Uses a ReUz-generated shipping label and marks the item as sent, but no package location info appears on ReUz for 4 business days. This can happen for various reasons, such as: seller choosing a wrong shipping method (not what the buyer paid for) or seller not shipping the package"]},{heading:null,body:`The cancellation might not occur immediately, but within a week after the time frames stated above are missed. However, sending an item after the indicated deadline will not avoid the eventual cancellation. The buyer will then <a href="#/help/receiving-a-refund" class="help-link">receive a refund</a>. After the cancellation, the seller can re-upload the same item and sell it again, assuming it hasn't been sent yet.`},{heading:null,body:"As long as the item isn't sent, the buyer and the seller can cancel an order too."},{heading:"When the item is sent",body:"We may cancel an order if the item is:",bullets:["Lost in transit, or returned to seller","Damaged in transit",'<a href="#/help/significantly-not-as-described" class="help-link">Significantly not as described</a> in the listing']},{heading:null,body:"The buyer may also cancel the order if the package is lost, assuming they've chosen a tracked shipping method."}]},uz:{title:"Buyurtmani Bekor Qilish",sections:[{heading:null,body:"Buyurtma faqat buyum hali jo'natilmagan bo'lsa (xaridor yoki sotuvchi tomonidan) bekor qilinishi mumkin."},{heading:"Buyurtmani bekor qilish",body:null,bullets:["Boshqa a'zo bilan suhbatingizni oching","Yuqori o'ng burchakdagi ⓘ belgisini bosing","<strong>Buyurtmani bekor qilish</strong> ni tanlang va ro'yxatdan sabab tanlang, yoki <strong>Boshqa</strong> ni tanlang va batafsil ma'lumot bering"]},{heading:null,body:"Agar sotuvchi buyurtmani allaqachon jo'natgan bo'lsa, lekin kuzatuv ma'lumotlari yangilanmagan bo'lsa, bekor qilishni tasdiqlashi kerak bo'lishi mumkin. Agar ular bekor qilishni tasdiqlamasa, buyurtma avtomatik bekor qilinguncha kuting."},{heading:"Eslatma",body:"Agar buyurtmani qo'lda bekor qilsangiz, avtomatik salbiy fikr olishingiz mumkin. Bundan qochish uchun buyurtmani bekor qilishdan oldin boshqa a'zoni xabardor qiling va o'zaro kelishuvga keling. Shuningdek, xaridorlar o'zlari bekor qilish o'rniga buyurtma avtomatik bekor qilinguncha kutishlari mumkin."},{heading:"Bilish foydali",body:"Buyurtma bekor qilinganidan so'ng, sotuvchilar buyumni qayta sotuvga qo'yish uchun suhbat ekranida <strong>Buyumni qayta yuklash</strong> tugmasini bosishlari mumkin. Ba'zi hollarda biz ham buyurtmani bekor qilishimiz mumkin."},{heading:"Buyurtma bekor qilindi. Nima bo'ldi?",body:"Buyurtma bekor qilinishining bir nechta mumkin sabablari bor. Bu kuzatuv tafsilotlarini olmasak yoki buyum jo'natilganidan keyingi muammolar tufayli sodir bo'lishi mumkin."},{heading:"Kuzatuv tafsilotlari yo'q",body:"Agar sotuvchi quyidagilarni bajarsa, buyurtma bekor qilinadi:",bullets:["Jo'natish yorlig'ini 4 ish kuni ichida yuklab olmasa",`Buyumni jo'natmasa yoki "Buyum jo'natildi" tugmasini 5 ish kuni ichida bosmasa`,"ReUz tomonidan yaratilgan jo'natish yorlig'idan foydalansa va buyumni jo'natilgan deb belgilasa, lekin 4 ish kuni davomida ReUz'da paket joylashuvi ma'lumotlari ko'rinmasa"]},{heading:null,body:`Bekor qilish darhol sodir bo'lmasligi mumkin, lekin yuqorida ko'rsatilgan muddatlar o'tkazib yuborilganidan keyin bir hafta ichida. Xaridor keyin <a href="#/help/receiving-a-refund" class="help-link">pul qaytarib oladi</a>. Bekor qilganidan so'ng, sotuvchi buyum hali jo'natilmagan bo'lsa, xuddi shu buyumni qayta yuklashi va sotishi mumkin.`},{heading:null,body:"Buyum jo'natilmagan ekan, xaridor ham, sotuvchi ham buyurtmani bekor qilishi mumkin."},{heading:"Buyum jo'natilganda",body:"Agar buyum quyidagi bo'lsa, biz buyurtmani bekor qilishimiz mumkin:",bullets:["Yo'lda yo'qolgan yoki sotuvchiga qaytarilgan","Yo'lda shikastlangan",`E'londa <a href="#/help/significantly-not-as-described" class="help-link">tavsifga sezilarli mos kelmaydi</a>`]},{heading:null,body:"Agar paket yo'qolgan bo'lsa va kuzatiladigan jo'natish usulini tanlagan bo'lsa, xaridor buyurtmani bekor qilishi mumkin."}]}},{id:"receiving-refund",slug:"receiving-a-refund",icon:"",category:"buying",en:{title:"Receiving a Refund",sections:[{heading:"Note",body:`A refund is issued after the order is canceled. If the seller hasn't shipped the item yet, you can <a href="#/help/canceling-an-order" class="help-link">cancel the order yourself</a>. Otherwise, please check the <a href="#/help/refund-policy" class="help-link">ReUz Refund Policy</a>.`},{heading:null,body:"Refunds are issued to the same e-wallet or account that you used to pay for the order. The refund processing time and where it will appear is also determined by the payment method you used."},{heading:"Refund time by payment method",body:null,bullets:["<strong>ReUz Wallet:</strong> Instant","<strong>Credit or debit card:</strong> 3–5 business days","<strong>Apple Pay:</strong> 3–5 business days","<strong>Google Pay:</strong> 3–5 business days"]},{heading:"Refunds frequently asked questions",body:null},{heading:null,body:'<strong>"I only see part of my refund. Where is the rest?"</strong><br><br>This typically happens when two payment methods were used to pay for the item, such as your ReUz Wallet and a credit or debit card. Try checking both your ReUz Wallet and the other payment method used to see if the missing funds were issued in both places. Keep in mind that refunds issued to your bank account will take longer to transfer.'},{heading:null,body:`<strong>"Will I get a refund for a pending payment?"</strong><br><br>If your payment fails, your account may still be charged (or the amount may be held as a pending payment). If this happens you will always be fully refunded. Even if you accidentally pay twice, we'll refund the second payment.`},{heading:null,body:'<strong>"How do I request a refund?"</strong><br><br>Learn more about <a href="#/help/returning-an-item" class="help-link">how to get a refund here</a>. You can also go to the Help Center homepage and select a recent order from the top of the page to get order-specific information.'},{heading:"Good to know",body:`Your refund will fully cover your expenses. This includes the item's price, shipping cost, and the <a href="#/help/buyer-protection-fee" class="help-link">Buyer Protection fee</a>. Business days are Monday to Friday, excluding public holidays.`}]},uz:{title:"Pul Qaytarib Olish",sections:[{heading:"Eslatma",body:`Buyurtma bekor qilinganidan so'ng pul qaytariladi. Agar sotuvchi buyumni hali jo'natmagan bo'lsa, <a href="#/help/canceling-an-order" class="help-link">buyurtmani o'zingiz bekor qilishingiz mumkin</a>. Aks holda, <a href="#/help/refund-policy" class="help-link">ReUz Qaytarish Siyosati</a>ni tekshiring.`},{heading:null,body:"Qaytarishlar buyurtma uchun to'lash uchun foydalangan o'sha elektron hamyon yoki hisobga beriladi. Qaytarish vaqti va u qayerda paydo bo'lishi ham siz foydalangan to'lov usuli bilan belgilanadi."},{heading:"To'lov usuli bo'yicha qaytarish vaqti",body:null,bullets:["<strong>ReUz Hamyon:</strong> Darhol","<strong>Kredit yoki debet karta:</strong> 3–5 ish kuni","<strong>Apple Pay:</strong> 3–5 ish kuni","<strong>Google Pay:</strong> 3–5 ish kuni"]},{heading:"Qaytarish bo'yicha tez-tez so'raladigan savollar",body:null},{heading:null,body:`<strong>"Men qaytarishning faqat bir qismini ko'ryapman. Qolgani qayerda?"</strong><br><br>Bu odatda buyum uchun ikkita to'lov usuli ishlatilganda sodir bo'ladi, masalan, ReUz Hamyoningiz va kredit yoki debet karta. Yetishmayotgan mablag'lar ikkala joyda ham berilganligini tekshirish uchun ReUz Hamyoningizni va boshqa ishlatilgan to'lov usulini tekshirib ko'ring.`},{heading:null,body:`<strong>"Kutilayotgan to'lov uchun pul qaytariladimi?"</strong><br><br>Agar to'lovingiz muvaffaqiyatsiz bo'lsa, hisobingiz baribir yechilishi mumkin (yoki summa kutilayotgan to'lov sifatida ushlab turilishi mumkin). Agar bu sodir bo'lsa, sizga har doim to'liq pul qaytariladi. Hatto tasodifan ikki marta to'lasangiz ham, ikkinchi to'lovni qaytaramiz.`},{heading:null,body:`<strong>"Pul qaytarishni qanday so'rash mumkin?"</strong><br><br><a href="#/help/returning-an-item" class="help-link">Bu yerda pul qaytarib olish</a> haqida ko'proq bilib oling. Shuningdek, buyurtmaga xos ma'lumot olish uchun Yordam Markazi bosh sahifasiga o'tishingiz va sahifa yuqorisidagi so'nggi buyurtmani tanlashingiz mumkin.`},{heading:"Bilish foydali",body:`Qaytarishingiz xarajatlaringizni to'liq qoplaydi. Bu buyum narxi, jo'natish xarajati va <a href="#/help/buyer-protection-fee" class="help-link">Xaridor Himoyasi to'lovi</a>ni o'z ichiga oladi. Ish kunlari — dushanbadan jumaga, davlat bayramlari bundan mustasno.`}]}},{id:"refund-policy",slug:"refund-policy",icon:"",category:"buying",en:{title:"The ReUz Refund Policy",sections:[{heading:"Overview",body:'At ReUz, we want every transaction to be smooth and fair. Our refund policy is designed to protect both buyers and sellers. When you use the "Buy now" button, your purchase is covered by <a href="#/help/buyer-protection-fee" class="help-link">Buyer Protection</a>.'},{heading:"When can you get a refund?",body:"You may be eligible for a refund in the following situations:",bullets:['The item you received is <a href="#/help/significantly-not-as-described" class="help-link">significantly not as described</a> in the listing',"The item arrived damaged or defective","You never received your item and the tracking shows it was not delivered","The item is counterfeit or not authentic when it was listed as genuine","The seller cancels the order before shipping"]},{heading:"How the refund process works",body:"When you report an issue with your order, here is what happens:",bullets:["You open a dispute through the order detail page within the confirmation window","The seller's payout is placed on hold while the issue is reviewed",'The seller has a chance to respond — they can offer a partial refund, a full refund, or request a <a href="#/help/returning-an-item" class="help-link">return</a>',"If a return is agreed upon, you ship the item back to the seller","Once the return is confirmed, a full refund is issued to your original payment method"]},{heading:"When refunds are not available",body:"Please note that refunds are generally not available in these cases:",bullets:["You simply changed your mind about the purchase","The item matches the description but does not fit as expected","You confirmed the order and the funds have already been released to the seller","The confirmation window has expired without a dispute being opened","Minor differences that do not significantly affect the item's value or usability"]},{heading:"Refund timeline",body:`Once a refund is approved, the processing time depends on the payment method used. Learn more about <a href="#/help/receiving-a-refund" class="help-link">receiving a refund</a> and expected timelines. Your refund will fully cover your expenses — this includes the item's price, shipping cost, and the Buyer Protection fee.`},{heading:"Canceling an order",body:`If the item hasn't been shipped yet, both buyers and sellers can <a href="#/help/canceling-an-order" class="help-link">cancel the order</a>. A full refund is issued automatically when an order is cancelled.`}]},uz:{title:"ReUz Qaytarish Siyosati",sections:[{heading:"Umumiy ma'lumot",body:`ReUz'da biz har bir tranzaksiyaning silliq va adolatli bo'lishini xohlaymiz. Bizning qaytarish siyosatimiz xaridorlarni ham, sotuvchilarni ham himoya qilish uchun mo'ljallangan. "Sotib olish" tugmasidan foydalanganingizda, xaridingiz <a href="#/help/buyer-protection-fee" class="help-link">Xaridor Himoyasi</a> bilan himoyalangan.`},{heading:"Qachon pul qaytarib olish mumkin?",body:"Quyidagi hollarda pul qaytarib olish huquqiga ega bo'lishingiz mumkin:",bullets:[`Qabul qilgan buyumingiz e'londa <a href="#/help/significantly-not-as-described" class="help-link">tavsifga sezilarli mos kelmaydi</a>`,"Buyum shikastlangan yoki nuqsonli holda yetib keldi","Buyumingizni hech qachon olmadingiz va kuzatuv yetkazilmaganligini ko'rsatadi","Buyum haqiqiy deb ko'rsatilgan bo'lsa-da, soxta yoki asl emas","Sotuvchi jo'natishdan oldin buyurtmani bekor qiladi"]},{heading:"Qaytarish jarayoni qanday ishlaydi",body:"Buyurtmangiz bilan muammo haqida xabar berganingizda, quyidagilar sodir bo'ladi:",bullets:["Tasdiqlash oynasi ichida buyurtma tafsilotlari sahifasi orqali nizo ochasiz","Muammo ko'rib chiqilayotganda sotuvchining to'lovi to'xtatiladi",`Sotuvchi javob berishi mumkin — qisman qaytarish, to'liq qaytarish taklif qilishi yoki <a href="#/help/returning-an-item" class="help-link">qaytarish</a> so'rashi mumkin`,"Qaytarish kelishilsa, buyumni sotuvchiga qaytarib jo'natasiz","Qaytarish tasdiqlangach, asl to'lov usulingizga to'liq pul qaytariladi"]},{heading:"Qaytarish mumkin bo'lmagan holatlar",body:"Quyidagi hollarda qaytarish odatda mavjud emasligini yodda tuting:",bullets:["Xarid qilish haqidagi fikringizni o'zgartirdingiz","Buyum tavsifga mos keladi, lekin kutilganidek mos kelmaydi","Buyurtmani tasdiqladingiz va mablag'lar allaqachon sotuvchiga chiqarilgan","Tasdiqlash oynasi nizo ochilmasdan tugagan","Buyumning qiymatiga yoki foydalanilishiga sezilarli ta'sir qilmaydigan kichik farqlar"]},{heading:"Qaytarish muddati",body:`Qaytarish tasdiqlangandan so'ng, qayta ishlash vaqti foydalangan to'lov usuliga bog'liq. <a href="#/help/receiving-a-refund" class="help-link">Pul qaytarib olish</a> va kutilayotgan muddatlar haqida ko'proq bilib oling. Qaytarishingiz xarajatlaringizni to'liq qoplaydi — bu buyum narxi, jo'natish xarajati va Xaridor Himoyasi to'lovini o'z ichiga oladi.`},{heading:"Buyurtmani bekor qilish",body:`Agar buyum hali jo'natilmagan bo'lsa, xaridorlar ham, sotuvchilar ham <a href="#/help/canceling-an-order" class="help-link">buyurtmani bekor qilishi</a> mumkin. Buyurtma bekor qilinganda avtomatik ravishda to'liq pul qaytariladi.`}]}}];function pt(t){return Ee.find(e=>e.slug===t)}function Pa(){const t=m(),e=Ee,a=e.filter(c=>c.category==="buying"),i=e.filter(c=>c.category==="selling"),s=t==="uz"?"Yordam Markazi":"Help Center",n=t==="uz"?"ReUz haqida bilishingiz kerak bo'lgan hamma narsa":"Everything you need to know about ReUz",o=t==="uz"?"Maqolalarni qidirish...":"Search articles...",r=t==="uz"?"Sotib olish":"Buying",l=t==="uz"?"Sotish":"Selling";return`
    <div class="page">
      <div class="container">
        <!-- Hero -->
        <div class="help-hero animate-fadeIn">
          <div class="help-hero-icon">${q.help}</div>
          <h1 class="help-hero-title">${s}</h1>
          <p class="help-hero-subtitle">${n}</p>
          <div class="help-search-wrapper">
            ${q.search}
            <input 
              type="text" 
              id="help-search" 
              class="help-search-input" 
              placeholder="${o}" 
            />
          </div>
        </div>

        <!-- Buying Section -->
        <div class="help-section" id="help-buying-section">
          <h2 class="help-section-title">
            <span class="help-section-icon">${q.cart}</span>
            ${r}
          </h2>
          <div class="help-articles-grid" id="help-buying-grid">
            ${a.map(c=>Ne(c,t)).join("")}
          </div>
        </div>

        <!-- Selling Section -->
        <div class="help-section" id="help-selling-section">
          <h2 class="help-section-title">
            <span class="help-section-icon">${q.tag}</span>
            ${l}
          </h2>
          <div class="help-articles-grid" id="help-selling-grid">
            ${i.map(c=>Ne(c,t)).join("")}
          </div>
        </div>
      </div>
    </div>
  `}function Ne(t,e){const a=t[e]||t.en,i=a.sections.find(n=>n.body),s=i?i.body.replace(/<[^>]*>/g,"").substring(0,100):"";return`
    <div class="help-article-card" data-slug="${t.slug}">
      <div class="help-article-card-icon">${t.icon}</div>
      <div class="help-article-card-body">
        <h3 class="help-article-card-title">${a.title}</h3>
        <p class="help-article-card-preview">${s}...</p>
      </div>
      <div class="help-article-card-arrow">→</div>
    </div>
  `}function Ta(){document.querySelectorAll(".help-article-card").forEach(e=>{e.addEventListener("click",()=>{h(`/help/${e.dataset.slug}`)})});const t=document.getElementById("help-search");t&&t.addEventListener("input",()=>{const e=t.value.toLowerCase().trim(),a=m();document.querySelectorAll(".help-article-card").forEach(i=>{const s=i.dataset.slug,n=pt(s);if(!n)return;const o=n[a]||n.en,r=(o.title+" "+o.sections.map(l=>(l.heading||"")+" "+(l.body||"").replace(/<[^>]*>/g,"")+" "+(l.bullets||[]).join(" ")).join(" ")).toLowerCase();i.style.display=!e||r.includes(e)?"":"none"})})}function ja(t){const e=pt(t),a=m();if(!e)return`
      <div class="page">
        <div class="container">
          <div class="empty-state">
            <div class="empty-state-icon">${q.search}</div>
            <div class="empty-state-title">${a==="uz"?"Maqola topilmadi":"Article not found"}</div>
            <button class="btn btn-primary" onclick="location.hash='/help'">
              ${a==="uz"?"Yordam markaziga qaytish":"Back to Help Center"}
            </button>
          </div>
        </div>
      </div>
    `;const i=e[a]||e.en,s=a==="uz"?"Yordam Markazi":"Help Center",n=Ee.filter(r=>r.category===e.category&&r.id!==e.id).slice(0,3),o=a==="uz"?"Bog'liq maqolalar":"Related Articles";return`
    <div class="page">
      <div class="container-narrow">
        <!-- Breadcrumb -->
        <div class="help-breadcrumb animate-fadeIn">
          <a class="help-breadcrumb-link" id="help-back-link">
            ← ${s}
          </a>
        </div>

        <!-- Article Content -->
        <article class="help-article animate-fadeIn">
          <div class="help-article-header">
            <span class="help-article-icon">${e.icon}</span>
            <h1 class="help-article-title">${i.title}</h1>
          </div>

          <div class="help-article-content">
            ${i.sections.map(r=>`
              <div class="help-article-section">
                ${r.heading?`<h2 class="help-article-heading">${r.heading}</h2>`:""}
                ${r.body?`<p class="help-article-body">${r.body}</p>`:""}
                ${r.bullets?`
                  <ul class="help-article-bullets">
                    ${r.bullets.map(l=>`<li>${l}</li>`).join("")}
                  </ul>
                `:""}
              </div>
            `).join("")}
          </div>
        </article>

        <!-- Related Articles -->
        ${n.length>0?`
          <div class="help-related">
            <h3 class="help-related-title">${o}</h3>
            <div class="help-related-grid">
              ${n.map(r=>{const l=r[a]||r.en;return`
                  <div class="help-related-card" data-slug="${r.slug}">
                    <span class="help-related-icon">${r.icon}</span>
                    <span class="help-related-text">${l.title}</span>
                    <span class="help-related-arrow">→</span>
                  </div>
                `}).join("")}
            </div>
          </div>
        `:""}
      </div>
    </div>
  `}function Ra(){const t=document.getElementById("help-back-link");t&&t.addEventListener("click",e=>{e.preventDefault(),h("/help")}),document.querySelectorAll(".help-related-card").forEach(e=>{e.addEventListener("click",()=>{h(`/help/${e.dataset.slug}`)})})}const Da=document.getElementById("app");function R(t,e,...a){ma(),wa(),Ea(),Da.innerHTML=st()+t,nt(),e&&e(...a),window.scrollTo(0,0)}function U(t,e,...a){if(!d.isLoggedIn()){V.navigate("/login");return}R(t(...a),e,...a)}V.add("/",()=>{R(Yt(),Gt)}).add("/login",()=>{if(d.isLoggedIn()){V.navigate("/");return}R(Ft(),Kt)}).add("/register",()=>{if(d.isLoggedIn()){V.navigate("/");return}R(Qt(),Wt)}).add("/product/:id",t=>{R(Xt(t),ea,t)}).add("/sell",()=>{U(sa,na)}).add("/checkout/:id",t=>{U(ra,oa,t)}).add("/orders",()=>{U(la,da)}).add("/order/:id",t=>{U(dt,ct,t)}).add("/chat/:orderId",t=>{U(za,Ba,t)}).add("/dispute/:orderId",t=>{U(va,ka,t)}).add("/profile",()=>{U(Oe,Me)}).add("/profile/:userId",t=>{R(Oe(t),Me)}).add("/admin",()=>{U(Aa,Ca)}).add("/search/:query",t=>{R(Vt(t),Jt)}).add("/help",()=>{R(Pa(),Ta)}).add("/help/:slug",t=>{R(ja(t),Ra)});$t();Mt();V.start();
