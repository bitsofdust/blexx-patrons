const HOUSES={
  Chance:{bg:'#ed2024',ink:'#ebe71e',frame:'#ebe71e',shape:'triangle',wing:'pointed',topper:'nubs'},
  Manifestation:{bg:'#405eab',ink:'#71ccd4',frame:'#71ccd4',shape:'circle',wing:'round',topper:'spark'},
  Devotion:{bg:'#882782',ink:'#ee1f42',frame:'#ee1f42',shape:'square',wing:'square',topper:'halo'}
};
const FLUX=[{bg:'#16150F',ink:'#B7FF00'},{bg:'#16150F',ink:'#FF1FA0'},{bg:'#1A0D2E',ink:'#B7FF00'},{bg:'#16150F',ink:'#FF5E00'}];
const HK=['Chance','Manifestation','Devotion'];
function mb32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}

const ROOTS=['Hex','Vex','Grim','Gloam','Sig','Rune','Omen','Wisp','Mote','Nox','Murk','Ember','Cinder','Soot','Veil','Bane','Onyx','Char','Gloom','Knell','Pyre','Bram','Tarn','Mire','Hush','Dusk','Sable',
 'Bael','Vassa','Marb','Amo','Paimo','Belz','Andra','Furf','Stol','Vep','Zep','Gusi','Orob','Phen','Sabno','Croci','Gremo','Zaga','Vala','Dant','Buni','Naba','Rono','Ipo'];
const SUF={
  Chance:['zu','zo','po','zip','ko','bo','zee','zib','zy','pop','zok'],
  Manifestation:['mo','bo','go','lo','dle','bun','do','boo','mox','gor'],
  Devotion:['ie','y','el','na','sy','ee','lie','bel','la','mie','en']
};
const COMMON=['ie','o','oo','boo','kin','let','ling','by','pip','mu','na','lo'];
const RANKS={
  Chance:['Quirk','Charm','Imp','Oracle','Fortune'],
  Manifestation:['Spark','Cog','Gizmo','Engine','Dynamo'],
  Devotion:['Wisp','Halo','Cherub','Idol','Seraph']
};
const LEGN=[6,9,12,18,20,22,26,30,36,40,45,50,60,66];
function pickRank(list,rng){let w=[],tot=0;for(let i=0;i<list.length;i++){const x=Math.pow(0.6,i);w.push(x);tot+=x;}let t=rng()*tot;for(let i=0;i<list.length;i++){if((t-=w[i])<=0)return list[i];}return list[list.length-1];}
function nameFor(seed,house){
  const r=mb32((seed^0x5f3759df)>>>0);
  const root=ROOTS[Math.floor(r()*ROOTS.length)];
  let pool=SUF[house].concat(COMMON);
  if(/[aeiou]$/i.test(root))pool=pool.filter(x=>!/^[aeiou]/i.test(x));
  const last=root[root.length-1].toLowerCase();pool=pool.filter(x=>x[0].toLowerCase()!==last);
  if(!pool.length)pool=['o','mo','by'];
  let suf=pool[Math.floor(r()*pool.length)];let nm=root+suf;
  if(nm.length>10){const sh=pool.filter(x=>x.length<=2);suf=sh.length?sh[Math.floor(r()*sh.length)]:'o';nm=root+suf;}
  return{name:nm,rank:pickRank(RANKS[house],r),legions:LEGN[Math.floor(r()*LEGN.length)]};
}

const TEX=['straight','web','dotted','solid'];
const SIZES=[['none',0,0],['tiny',28,40],['small',48,62],['large',74,88]];
function pickSize(rng){const w=[8,20,40,32];let t=rng()*100;for(let i=0;i<4;i++){if((t-=w[i])<=0)return SIZES[i];}return SIZES[3];}
function derive(seed,forced){
  const r=mb32(seed);let house=(forced&&forced!=='All')?forced:HK[Math.floor(r()*3)];const flux=r()<0.14;
  const sz=pickSize(r);const wingR=sz[1]===0?0:Math.round(sz[1]+r()*(sz[2]-sz[1]));
  const nr=nameFor(seed,house);
  return{seed,house,flux,wingSize:sz[0],wingR,wingTex:TEX[Math.floor(r()*TEX.length)],ribCount:8+Math.floor(r()*6),
    fluxPick:FLUX[Math.floor(r()*FLUX.length)],name:nr.name,rank:nr.rank,legions:nr.legions,
    code:'A-'+((seed>>>0).toString(36).toUpperCase()),ed:(1+(seed%900))+'/900'};
}
function colorsFor(p,finish){
  if(finish==='relic')return{bg:'#E9E6DC',ink:'__SILVER__',groove:'#3b382f',frame:HOUSES[p.house].bg,rarity:'RELIC'};
  if(p.flux)return{bg:p.fluxPick.bg,ink:p.fluxPick.ink,groove:p.fluxPick.bg,frame:p.fluxPick.ink,rarity:'FLUX'};
  const h=HOUSES[p.house];return{bg:h.bg,ink:h.ink,groove:h.bg,frame:h.frame,rarity:'STANDARD'};
}
function logo(name,cx,cy,w,color,op){
  const vb=LOGO_VB[name].split(' ').map(Number);const k=w/vb[2];const h=vb[3]*k;
  const tx=(cx-w/2).toFixed(2),ty=(cy-h/2).toFixed(2);
  const p=LOGO_D[name].map(d=>'<path d="'+d+'"/>').join('');
  return `<g transform="translate(${tx},${ty}) scale(${k.toFixed(4)})" fill="${color}"${op?` opacity="${op}"`:''}>${p}</g>`;
}
function logoH(name,cx,cy,color,op){
  const b=LOGO_BB[name],h=b[3]-b[1],k=LOGO_TARGET_H/h;
  const ccx=(b[0]+b[2])/2,ccy=(b[1]+b[3])/2,tx=cx-k*ccx,ty=cy-k*ccy;
  const p=LOGO_D[name].map(d=>'<path d="'+d+'"/>').join('');
  return `<g transform="translate(${tx.toFixed(2)},${ty.toFixed(2)}) scale(${k.toFixed(4)})" fill="${color}"${op?` opacity="${op}"`:''}>${p}</g>`;
}
const RAD=Math.PI/180;
function PT(cx,cy,r,d){return [cx+r*Math.cos(d*RAD),cy+r*Math.sin(d*RAD)];}
function poly(pts,fill,stroke,sw){return `<polygon points="${pts.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ')}" fill="${fill||'none'}"${stroke?` stroke="${stroke}" stroke-width="${sw||3}" stroke-linejoin="round"`:''}/>`;}
function shp(cx,cy,r,shape,fill,stroke,sw){
  const st=stroke?` stroke="${stroke}" stroke-width="${sw||4}" paint-order="stroke" stroke-linejoin="round"`:'';
  if(shape==='triangle')return `<polygon points="${cx},${(cy-r).toFixed(1)} ${(cx+r).toFixed(1)},${(cy+r).toFixed(1)} ${(cx-r).toFixed(1)},${(cy+r).toFixed(1)}" fill="${fill}"${st}/>`;
  if(shape==='square')return `<rect x="${(cx-r).toFixed(1)}" y="${(cy-r).toFixed(1)}" width="${(r*2).toFixed(1)}" height="${(r*2).toFixed(1)}" rx="2" fill="${fill}"${st}/>`;
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"${st}/>`;
}
function ribsTo(fx,fy,pts,style,col){
  let s='';
  if(style==='web'){
    for(const p of pts){s+=`<line x1="${fx}" y1="${fy}" x2="${p[0].toFixed(1)}" y2="${p[1].toFixed(1)}" stroke="${col}" stroke-width="1.4" stroke-linecap="round"/>`;}
    [0.4,0.66,0.88].forEach(t=>{for(let i=0;i<pts.length-1;i++){const a=[fx+(pts[i][0]-fx)*t,fy+(pts[i][1]-fy)*t],b=[fx+(pts[i+1][0]-fx)*t,fy+(pts[i+1][1]-fy)*t];s+=`<line x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}" stroke="${col}" stroke-width="1.1" stroke-linecap="round"/>`;}});
    return s;
  }
  for(const p of pts){
    if(style==='dotted'){[0.42,0.66,0.88].forEach(t=>{const x=fx+(p[0]-fx)*t,y=fy+(p[1]-fy)*t;s+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.1" fill="${col}"/>`;});}
    else if(style==='solid'){}
    else{s+=`<line x1="${fx}" y1="${fy}" x2="${p[0].toFixed(1)}" y2="${p[1].toFixed(1)}" stroke="${col}" stroke-width="2" stroke-linecap="round"/>`;}
  }
  return s;
}
function roundWingL(fx,fy,R,n,style,ink,gr){
  const a0=120,a1=248,pts=[];for(let i=0;i<=n;i++)pts.push(PT(fx,fy,R,a0+(a1-a0)*i/n));
  let d=`M${fx},${fy}`;pts.forEach(p=>d+=`L${p[0].toFixed(1)},${p[1].toFixed(1)}`);d+='Z';
  let s=`<path d="${d}" fill="${ink}"/>`+ribsTo(fx,fy,pts,style,gr);
  let od=`M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;pts.forEach(p=>od+=`L${p[0].toFixed(1)},${p[1].toFixed(1)}`);
  s+=`<path d="${od}" fill="none" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/>`;return s;
}
function pointWingL(fx,fy,R,style,ink,gr){
  const upper=PT(fx,fy,R*0.58,240),tip=PT(fx,fy,R,184),lower=PT(fx,fy,R*0.64,124);
  let s=poly([[fx,fy],upper,tip,lower],ink);
  s+=ribsTo(fx,fy,[upper,PT(fx,fy,R*0.84,210),tip,PT(fx,fy,R*0.82,158),lower],style,gr);
  s+=poly([[fx,fy],upper,tip,lower],null,ink,3);return s;
}
function squareWingL(fx,fy,R,style,ink,gr){
  const topR=[fx,fy-R],corner=[fx-R,fy-R],left=[fx-R,fy-R*0.12];
  let s=poly([[fx,fy],topR,corner,left],ink);
  let edge=[topR];const n1=5;for(let i=1;i<=n1;i++)edge.push([fx-R*i/n1,fy-R]);
  const n2=4;for(let i=1;i<=n2;i++)edge.push([fx-R,(fy-R)+(R*0.88)*i/n2]);
  s+=ribsTo(fx,fy,edge,style,gr);
  s+=poly([[fx,fy],topR,corner,left],null,ink,3);return s;
}
function wingLeft(shape,fx,fy,R,n,style,ink,gr){
  if(shape==='pointed')return pointWingL(fx,fy,R,style,ink,gr);
  if(shape==='square')return squareWingL(fx,fy,R,style,ink,gr);
  return roundWingL(fx,fy,R,n,style,ink,gr);
}
function face(cx,hy,hr,shape,ink,bg){
  const eyY=hy+(shape==='triangle'?hr*0.24:0),ex=hr*0.4,erx=Math.max(2.8,hr*0.2),ery=Math.max(3.6,hr*0.26);
  let s='';
  s+=`<ellipse cx="${(cx-ex).toFixed(1)}" cy="${eyY.toFixed(1)}" rx="${erx.toFixed(1)}" ry="${ery.toFixed(1)}" fill="${bg}"/>`;
  s+=`<ellipse cx="${(cx+ex).toFixed(1)}" cy="${eyY.toFixed(1)}" rx="${erx.toFixed(1)}" ry="${ery.toFixed(1)}" fill="${bg}"/>`;
  s+=`<circle cx="${(cx-ex).toFixed(1)}" cy="${(eyY+ery*0.25).toFixed(1)}" r="${(erx*0.55).toFixed(1)}" fill="${ink}"/>`;
  s+=`<circle cx="${(cx+ex).toFixed(1)}" cy="${(eyY+ery*0.25).toFixed(1)}" r="${(erx*0.55).toFixed(1)}" fill="${ink}"/>`;
  const my=eyY+ery+3;s+=`<path d="M${(cx-6)},${my.toFixed(1)} Q${cx},${(my+5).toFixed(1)} ${(cx+6)},${my.toFixed(1)}" fill="none" stroke="${ink}" stroke-width="2" stroke-linecap="round"/>`;
  return s;
}
function topper(cx,hy,hr,kind,ink){
  if(kind==='halo')return `<ellipse cx="${cx}" cy="${(hy-hr*1.2).toFixed(1)}" rx="${(hr*1.05).toFixed(1)}" ry="${(hr*0.34).toFixed(1)}" fill="none" stroke="${ink}" stroke-width="2.6"/>`;
  if(kind==='spark'){const y=hy-hr*1.15,a=hr*0.52;return `<path d="M${cx},${(y-a).toFixed(1)} L${(cx+a*0.3).toFixed(1)},${(y-a*0.3).toFixed(1)} L${(cx+a).toFixed(1)},${y.toFixed(1)} L${(cx+a*0.3).toFixed(1)},${(y+a*0.3).toFixed(1)} L${cx},${(y+a).toFixed(1)} L${(cx-a*0.3).toFixed(1)},${(y+a*0.3).toFixed(1)} L${(cx-a).toFixed(1)},${y.toFixed(1)} L${(cx-a*0.3).toFixed(1)},${(y-a*0.3).toFixed(1)} Z" fill="${ink}"/>`;}
  if(kind==='nubs')return `<circle cx="${(cx-hr*0.35).toFixed(1)}" cy="${(hy-hr*1.2).toFixed(1)}" r="4" fill="${ink}"/><circle cx="${(cx+hr*0.35).toFixed(1)}" cy="${(hy-hr*1.2).toFixed(1)}" r="4" fill="${ink}"/>`;
  return '';
}
function drawFigure(p,cc,cfg){
  const cx=120,ink=cc.ink,bg=cc.bg,gr=cc.groove;
  const hy=104,hr=18,by=178,br=30,plY=268;
  let s='';
  if(p.wingR>0){
    const sx=cx-br*0.45,sy=by-br*0.5;
    const wl=wingLeft(cfg.wing,sx,sy,p.wingR,p.ribCount,p.wingTex,ink,gr);
    s+=wl+`<g transform="translate(240,0) scale(-1,1)">${wl}</g>`;
  }
  const lyTop=by+br*0.4,lw=6,lx=br*0.42,lst=` stroke="${bg}" stroke-width="3" paint-order="stroke"`;
  s+=`<rect x="${(cx-lx-lw/2).toFixed(1)}" y="${lyTop.toFixed(1)}" width="${lw}" height="${(plY-lyTop).toFixed(1)}" fill="${ink}"${lst}/>`;
  s+=`<rect x="${(cx+lx-lw/2).toFixed(1)}" y="${lyTop.toFixed(1)}" width="${lw}" height="${(plY-lyTop).toFixed(1)}" fill="${ink}"${lst}/>`;
  s+=`<rect x="${cx-3.5}" y="${(hy+hr*0.4).toFixed(1)}" width="7" height="${(by-br*0.6-(hy+hr*0.4)).toFixed(1)}" fill="${ink}"${lst}/>`;
  s+=shp(cx,by,br,cfg.shape,ink,bg,4);
  s+=shp(cx,hy,hr,cfg.shape,ink,bg,4);
  s+=topper(cx,hy,hr,cfg.topper,ink);
  s+=face(cx,hy,hr,cfg.shape,ink,bg);
  s+=`<rect x="74" y="${plY}" width="92" height="12" rx="2" fill="${ink}"/>`;
  return s;
}
const ROUND="'Quicksand','Varela Round',system-ui,sans-serif";
function card(p,finish,px,uid){
  const c=colorsFor(p,finish);let defs='',ink=c.ink;
  if(c.ink==='__SILVER__'){ink='url(#sv'+uid+')';
    defs=`<defs><linearGradient id="sv${uid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#eceadf"/><stop offset="0.4" stop-color="#bdb8a8"/><stop offset="0.58" stop-color="#79766a"/><stop offset="0.78" stop-color="#d2cdbe"/><stop offset="1" stop-color="#8c8879"/></linearGradient></defs>`;}
  const cc={bg:c.bg,ink:ink,groove:c.groove};const labelCol=(c.ink==='__SILVER__')?c.frame:c.ink;const hn=p.house.toLowerCase();const cfg=HOUSES[p.house];
  let s=`<svg viewBox="0 0 240 360" width="${px}" xmlns="http://www.w3.org/2000/svg" role="img"><title>${p.name}, ${p.rank} of ${p.house}</title><desc>BLEXX ${p.code}: ${p.house} creature, ${p.wingSize} ${p.wingTex} wings.</desc>${defs}`;
  s+=`<rect x="0" y="0" width="240" height="360" rx="10" fill="${c.bg}"/>`;
  s+=`<rect x="14" y="14" width="212" height="332" rx="6" fill="none" stroke="${c.frame}" stroke-width="2" opacity="0.55"/>`;
  s+=logo('blexx',120,31,87,labelCol,0.92);
  s+=drawFigure(p,cc,cfg);
  s+=`<text x="120" y="300" text-anchor="middle" font-family="${ROUND}" font-size="17" font-weight="600" letter-spacing="0.3" fill="${labelCol}">${p.name}</text>`;
  s+=`<text x="120" y="313" text-anchor="middle" font-family="${ROUND}" font-size="8" font-weight="600" letter-spacing="2.5" fill="${labelCol}" opacity="0.75">${p.rank.toUpperCase()}</text>`;
  s+=logoH(hn,120,333,labelCol);
  s+=`</svg>`;return{svg:s,c:c};
}
// ------------------------------------------------------------------
// FIREBASE (optional) — the Patron Registry. Configured via
// firebase-config.js. When absent, minted Patrons live in this
// browser's localStorage instead of the shared Registry.
// ------------------------------------------------------------------
const fb={enabled:false,db:null};
function initFirebase(){
  try{
    if(window.BLEXX_FIREBASE_CONFIG&&window.firebase){
      firebase.initializeApp(window.BLEXX_FIREBASE_CONFIG);
      fb.db=firebase.firestore();fb.enabled=true;
      console.info('[BLEXX] Registry enabled:',window.BLEXX_FIREBASE_CONFIG.projectId);
    }else{
      console.info('[BLEXX] Firebase not configured — Registry running in local-only mode.');
    }
  }catch(err){
    console.error('[BLEXX] Firebase init failed — falling back to local mode.',err);
    fb.enabled=false;
  }
}
initFirebase();
const LOCAL_KEY='blexx_patrons_local';
function localFeedRead(){try{return JSON.parse(localStorage.getItem(LOCAL_KEY)||'[]');}catch(e){return[];}}
function localFeedWrite(list){try{localStorage.setItem(LOCAL_KEY,JSON.stringify(list.slice(0,12)));}catch(e){}}

let state={house:'All',finish:'sigil',seed:Math.floor(Math.random()*1e7),minted:false,interacted:false};
const stage=document.getElementById('stage'),meta=document.getElementById('meta');
const seedfield=document.getElementById('seedfield'),goBtn=document.getElementById('go'),seedhint=document.getElementById('seedhint');
const showcase=document.getElementById('showcase'),stageFlash=document.getElementById('stageFlash');
const statusDot=document.getElementById('statusDot'),statusText=document.getElementById('statusText');
const mintBtn=document.getElementById('mintBtn'),mintHint=document.getElementById('mintHint');
const feedEl=document.getElementById('feed'),registryCount=document.getElementById('registryCount');
const stageMascot=document.getElementById('stageMascot');

function flashStage(kind){
  stageFlash.classList.remove('roll','seal');void stageFlash.offsetWidth;
  stageFlash.classList.add(kind);
  if(kind==='seal'){showcase.classList.add('sealing');setTimeout(()=>showcase.classList.remove('sealing'),900);}
  const target=stage.firstElementChild;
  if(target){target.classList.remove('pop');void target.offsetWidth;target.classList.add('pop');}
}
function setStatus(minted){
  state.minted=minted;
  statusDot.classList.toggle('sealed',minted);
  statusText.textContent=minted?'SEALED':'UNSEALED';
  mintBtn.disabled=minted;
  mintBtn.hidden=!state.interacted;
}
function syncPills(containerId,value){
  document.querySelectorAll('#'+containerId+' button').forEach(b=>{
    const on=b.dataset.v===value;
    b.classList.toggle('active',on);b.setAttribute('aria-pressed',on);
  });
}

function render(flash){
  seedfield.value=state.seed;
  const p=derive(state.seed,state.house);
  document.body.className='house-'+p.house.toLowerCase();
  stageMascot.src='assets/mascots/'+p.house.toLowerCase()+'_mascot.svg';
  const out=card(p,state.finish,300,'h'+state.seed);
  stage.innerHTML=`<div style="display:block;background:transparent;padding:0">${out.svg}</div>`;
  seedhint.textContent=`= ${p.code}`;
  meta.textContent=`${p.name} · ${p.rank} of ${p.house} · ${p.wingSize}/${p.wingTex} wings · ${out.c.rarity} · ${p.code}`;
  setStatus(false);
  mintHint.textContent='';
  if(flash)flashStage('roll');
}

function applySeed(){let v=parseInt(seedfield.value,10);if(!isNaN(v)){state.seed=Math.max(0,v);state.interacted=true;render(true);}}
goBtn.onclick=applySeed;
seedfield.addEventListener('keydown',e=>{if(e.key==='Enter')applySeed();});
document.getElementById('reroll').onclick=()=>{state.seed=Math.floor(Math.random()*1e7);state.interacted=true;render(true);};
document.querySelectorAll('#house button').forEach(b=>b.onclick=()=>{state.house=b.dataset.v;syncPills('house',state.house);render(true);});
document.querySelectorAll('#finish button').forEach(b=>b.onclick=()=>{state.finish=b.dataset.v;syncPills('finish',state.finish);render(true);});

const detailsToggle=document.getElementById('detailsToggle'),detailsPanel=document.getElementById('detailsPanel');
detailsToggle.onclick=()=>{
  const open=detailsPanel.hidden;
  detailsPanel.hidden=!open;
  detailsToggle.innerHTML=open?'Hide details &#8963;':'Show details &#8964;';
};

// ------------------------------------------------------------------
// BIND — summon, then bind the currently displayed Patron into the Registry.
// ------------------------------------------------------------------
async function bindCurrent(){
  if(state.minted)return;
  const p=derive(state.seed,state.house);
  mintBtn.disabled=true;mintHint.textContent='Binding…';
  const doc={seed:p.seed,forcedHouse:state.house,finish:state.finish,house:p.house,name:p.name,rank:p.rank,code:p.code};
  try{
    if(fb.enabled){
      await fb.db.collection('patrons').add(Object.assign({},doc,{boundAt:firebase.firestore.FieldValue.serverTimestamp()}));
      await loadFeed();
    }else{
      const list=localFeedRead();list.unshift(Object.assign({},doc,{boundAt:Date.now()}));localFeedWrite(list);renderFeed(list);
    }
    setStatus(true);flashStage('seal');
    mintHint.textContent=`Bound as ${p.code} — added to the Registry.`;
  }catch(err){
    console.error('[BLEXX] Bind failed, saving locally instead.',err);
    const list=localFeedRead();list.unshift(Object.assign({},doc,{boundAt:Date.now()}));localFeedWrite(list);renderFeed(list);
    setStatus(true);flashStage('seal');
    mintHint.textContent=`Bound as ${p.code} (saved locally — Registry unreachable).`;
  }
}
mintBtn.onclick=bindCurrent;

// ------------------------------------------------------------------
// THE PATRON REGISTRY — recent mints feed
// ------------------------------------------------------------------
function loadIntoStage(d){
  state.seed=d.seed;state.house=d.forcedHouse||'All';state.finish=d.finish||'sigil';state.interacted=true;
  syncPills('house',state.house);syncPills('finish',state.finish);
  render(false);setStatus(true);
}
function houseShapeSVG(house,color){
  const shape=HOUSES[house]?HOUSES[house].shape:'circle';
  const inner=shape==='triangle'?'<path d="M7 1 L13 12 L1 12 Z"/>':shape==='square'?'<rect x="1" y="1" width="12" height="12"/>':'<circle cx="7" cy="7" r="6"/>';
  return `<svg class="feed-house-icon" width="9" height="9" viewBox="0 0 14 14" fill="${color}">${inner}</svg>`;
}
function feedCardHTML(d,id){
  const p=derive(d.seed,d.forcedHouse);const out=card(p,d.finish,100,'f'+id);
  const accent=HOUSES[d.house]?HOUSES[d.house].bg:'#948f87';
  return `<div class="feed-card" style="--fc-accent:${accent};--fc-glow:${accent}66" data-seed="${d.seed}" data-house="${d.forcedHouse}" data-finish="${d.finish}">`
    +`<div class="feed-thumb">${out.svg}</div>`
    +`<div class="feed-name">${p.name}</div>`
    +`<div class="feed-house">${houseShapeSVG(p.house,accent)}${p.house}</div>`
    +`</div>`;
}
function renderFeed(docs){
  if(!docs.length){feedEl.innerHTML='<div class="feed-placeholder">No Patrons bound yet — be the first.</div>';registryCount.textContent='';return;}
  feedEl.innerHTML=docs.map((d,i)=>feedCardHTML(d,i)).join('');
  registryCount.textContent=docs.length+' shown';
  feedEl.querySelectorAll('.feed-card').forEach((el,i)=>{
    el.onclick=()=>loadIntoStage(docs[i]);
  });
}
async function loadFeed(){
  if(!fb.enabled){renderFeed(localFeedRead());return;}
  try{
    const snap=await fb.db.collection('patrons').orderBy('boundAt','desc').limit(12).get();
    renderFeed(snap.docs.map(d=>d.data()));
  }catch(err){
    console.error('[BLEXX] Registry feed failed, falling back to local.',err);
    renderFeed(localFeedRead());
  }
}
loadFeed();

render(false);
