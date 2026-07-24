const HOUSES={
  Chance:{bg:'#ed2024',ink:'#ebe71e',frame:'#ebe71e',shade:'#7c0d10',shape:'triangle',wing:'pointed',topper:'nubs'},
  Manifestation:{bg:'#405eab',ink:'#71ccd4',frame:'#71ccd4',shade:'#1c2c5e',shape:'circle',wing:'round',topper:'spark'},
  Devotion:{bg:'#882782',ink:'#ee1f42',frame:'#ee1f42',shade:'#440f3f',shape:'square',wing:'square',topper:'halo'}
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
    fluxPick:FLUX[Math.floor(r()*FLUX.length)],mood:Math.floor(r()*6),blush:r()<0.55,
    headTilt:r()*16-8,lean:r()*6-3,headScale:0.92+r()*0.2,
    eyeL:0.85+r()*0.35,eyeR:0.85+r()*0.35,gaze:r()*0.8-0.4,
    brow:r()<0.4,browSide:r()<0.5?1:-1,
    rays:9+Math.floor(r()*5),rayRot:Math.floor(r()*360),
    name:nr.name,rank:nr.rank,legions:nr.legions,
    code:'A-'+((seed>>>0).toString(36).toUpperCase()),ed:(1+(seed%900))+'/900'};
}
function colorsFor(p,finish){
  if(finish==='relic')return{bg:'#E9E6DC',ink:'__SILVER__',groove:'#3b382f',shade:'#3b382f',frame:HOUSES[p.house].bg,rarity:'RELIC'};
  if(p.flux)return{bg:p.fluxPick.bg,ink:p.fluxPick.ink,groove:p.fluxPick.bg,shade:p.fluxPick.bg,frame:p.fluxPick.ink,rarity:'FLUX'};
  const h=HOUSES[p.house];return{bg:h.bg,ink:h.ink,groove:h.bg,shade:h.shade,frame:h.frame,rarity:'STANDARD'};
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
// Rounded-corner polygon with slightly bowed-out sides — the "bubbly" primitive.
// cr = corner radius, bow = outward bulge of each edge midpoint.
function blobPath(pts,cr,bow){
  const n=pts.length;
  const cx0=pts.reduce((a,p)=>a+p[0],0)/n,cy0=pts.reduce((a,p)=>a+p[1],0)/n;
  const seg=(A,B)=>{const dx=B[0]-A[0],dy=B[1]-A[1],L=Math.hypot(dx,dy),t=Math.min(cr/L,0.42);
    return [[A[0]+dx*t,A[1]+dy*t],[B[0]-dx*t,B[1]-dy*t]];};
  let d='';
  for(let i=0;i<n;i++){
    const A=pts[i],B=pts[(i+1)%n],C=pts[(i+2)%n];
    const e=seg(A,B),A2=e[0],B2=e[1];
    const mx=(A2[0]+B2[0])/2,my=(A2[1]+B2[1])/2;
    let nx=mx-cx0,ny=my-cy0;const L=Math.hypot(nx,ny)||1;nx/=L;ny/=L;
    if(i===0)d+=`M${A2[0].toFixed(1)},${A2[1].toFixed(1)}`;
    d+=`Q${(mx+nx*bow).toFixed(1)},${(my+ny*bow).toFixed(1)} ${B2[0].toFixed(1)},${B2[1].toFixed(1)}`;
    const B3=seg(B,C)[0];
    d+=`Q${B[0].toFixed(1)},${B[1].toFixed(1)} ${B3[0].toFixed(1)},${B3[1].toFixed(1)}`;
  }
  return d+'Z';
}
function shpEl(cx,cy,r,shape,attrs){
  if(shape==='triangle')return `<path d="${blobPath([[cx,cy-r],[cx+r,cy+r],[cx-r,cy+r]],r*0.38,r*0.09)}" ${attrs}/>`;
  if(shape==='square')return `<path d="${blobPath([[cx-r,cy-r],[cx+r,cy-r],[cx+r,cy+r],[cx-r,cy+r]],r*0.32,r*0.06)}" ${attrs}/>`;
  return `<circle cx="${cx}" cy="${cy}" r="${r}" ${attrs}/>`;
}
function shp(cx,cy,r,shape,fill,stroke,sw){
  const st=stroke?` stroke="${stroke}" stroke-width="${sw||4}" paint-order="stroke" stroke-linejoin="round" stroke-linecap="round"`:'';
  return shpEl(cx,cy,r,shape,`fill="${fill}"${st}`);
}
// "3D" pass for a chassis shape: clip to the shape, lay a shade crescent on
// the lower-right and a gloss spot on the upper-left. ink repaints everything
// but the crescent, so it works over any fill (incl. the Relic gradient).
function dim(cx,cy,r,shape,ink,sh,uid,tag){
  const id='k'+tag+uid;
  let s=`<clipPath id="${id}">`+shpEl(cx,cy,r,shape,'')+`</clipPath><g clip-path="url(#${id})">`;
  s+=`<rect x="${(cx-r-6).toFixed(1)}" y="${(cy-r-6).toFixed(1)}" width="${(2*r+12).toFixed(1)}" height="${(2*r+12).toFixed(1)}" fill="${sh}" opacity="0.28"/>`;
  s+=shpEl(cx-r*0.14,cy-r*0.16,r,shape,`fill="${ink}"`);
  s+=`<ellipse cx="${(cx-r*0.38).toFixed(1)}" cy="${(cy-r*0.42).toFixed(1)}" rx="${(r*0.34).toFixed(1)}" ry="${(r*0.17).toFixed(1)}" transform="rotate(-20 ${(cx-r*0.38).toFixed(1)} ${(cy-r*0.42).toFixed(1)})" fill="#ffffff" opacity="0.16"/>`;
  return s+`</g>`;
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
// Scalloped edge along a chain of points, bulging away from the focus (fx,fy).
function scallopEdge(fx,fy,pts,k){
  let d='';
  for(let i=0;i<pts.length-1;i++){
    const a=pts[i],b=pts[i+1],mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2;
    const dx=mx-fx,dy=my-fy,L=Math.hypot(dx,dy)||1;
    d+=`Q${(mx+dx/L*k).toFixed(1)},${(my+dy/L*k).toFixed(1)} ${b[0].toFixed(1)},${b[1].toFixed(1)}`;
  }
  return d;
}
// Manifestation wing: cherub cloud — three stacked lobes sweeping up-and-out
// (circles, honoring the House shape echo). Interior detail is the "ripple"
// language: concentric manifestation rings clipped to the wing, not quills.
// Stroke-then-refill trick: outline every lobe, then repaint fills so the
// stroke survives only on the outer silhouette.
// Manifestation wing: crescent sweep — one solid quarter-moon arcing up and
// out from the shoulder, tip rising past the head at full size. Outer edge is
// a smooth bow; inner edge returns with feather scallops. Interior detail is
// the "ripple" language: concentric manifestation rings from the shoulder,
// clipped to the crescent — not quills.
function roundWingL(fx,fy,R,n,style,ink,gr){
  const cid='cw'+Math.round(R*10);
  const T=[fx-R*0.55,fy-R*1.20];
  const outer=[T,[fx-R*0.80,fy-R*0.62],[fx-R*0.72,fy-R*0.24],[fx,fy]];
  let d=`M${fx},${fy} C${(fx-R*0.18).toFixed(1)},${(fy-R*0.25).toFixed(1)} ${(fx-R*0.22).toFixed(1)},${(fy-R*0.70).toFixed(1)} ${T[0].toFixed(1)},${T[1].toFixed(1)}`;
  const k=R*0.09;
  for(let i=0;i<outer.length-1;i++){
    const a=outer[i],b=outer[i+1],mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2;
    let nx=-(b[1]-a[1]),ny=b[0]-a[0];const L=Math.hypot(nx,ny)||1;
    d+=`Q${(mx+nx/L*k).toFixed(1)},${(my+ny/L*k).toFixed(1)} ${b[0].toFixed(1)},${b[1].toFixed(1)}`;
  }
  d+='Z';
  let s=`<path d="${d}" fill="${ink}" stroke="${gr}" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/>`;
  // same faux-3D treatment as the chassis: shade rim toward root/feather edges,
  // gloss streak along the leading edge, then the ripple detail on top
  s+=`<clipPath id="${cid}"><path d="${d}"/></clipPath><g clip-path="url(#${cid})">`;
  s+=`<rect x="${(fx-R*1.15).toFixed(1)}" y="${(fy-R*1.45).toFixed(1)}" width="${(R*1.3).toFixed(1)}" height="${(R*1.6).toFixed(1)}" fill="${gr}" opacity="0.28"/>`;
  s+=`<path d="${d}" transform="translate(${(-R*0.07).toFixed(1)},${(-R*0.08).toFixed(1)})" fill="${ink}"/>`;
  s+=`<ellipse cx="${(fx-R*0.30).toFixed(1)}" cy="${(fy-R*0.72).toFixed(1)}" rx="${(R*0.22).toFixed(1)}" ry="${(R*0.08).toFixed(1)}" transform="rotate(-62 ${(fx-R*0.30).toFixed(1)} ${(fy-R*0.72).toFixed(1)})" fill="#ffffff" opacity="0.16"/>`;
  let det='';
  if(style==='straight'||style==='web'){
    for(const rr of [0.5,0.82,1.12])det+=`<circle cx="${fx}" cy="${fy}" r="${(R*rr).toFixed(1)}" fill="none" stroke="${gr}" stroke-width="1.8"/>`;
  }
  if(style==='web'){
    for(const a of [205,230,252,272]){const p=PT(fx,fy,R*1.45,a);det+=`<line x1="${fx}" y1="${fy}" x2="${p[0].toFixed(1)}" y2="${p[1].toFixed(1)}" stroke="${gr}" stroke-width="1.3"/>`;}
  }
  if(style==='dotted'){
    for(const rr of [0.45,0.8])for(const a of [200,228,254,276]){const p=PT(fx,fy,R*rr,a);det+=`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="2.1" fill="${gr}"/>`;}
  }
  s+=det+`</g>`;
  return s;
}
function pointWingL(fx,fy,R,style,ink,gr){
  const cid='pw'+Math.round(R*10);
  const upper=PT(fx,fy,R*0.58,240),tip=PT(fx,fy,R,184),lower=PT(fx,fy,R*0.64,124);
  const d=blobPath([[fx,fy],upper,tip,lower],R*0.12,R*0.05);
  let s=`<path d="${d}" fill="${ink}" stroke="${gr}" stroke-width="3.5" stroke-linejoin="round"/>`;
  s+=`<clipPath id="${cid}"><path d="${d}"/></clipPath><g clip-path="url(#${cid})">`;
  s+=`<rect x="${(fx-R*1.15).toFixed(1)}" y="${(fy-R*0.78).toFixed(1)}" width="${(R*1.3).toFixed(1)}" height="${(R*1.6).toFixed(1)}" fill="${gr}" opacity="0.28"/>`;
  s+=`<path d="${d}" transform="translate(${(-R*0.07).toFixed(1)},${(-R*0.05).toFixed(1)})" fill="${ink}"/>`;
  s+=`<ellipse cx="${(fx-R*0.48).toFixed(1)}" cy="${(fy-R*0.30).toFixed(1)}" rx="${(R*0.22).toFixed(1)}" ry="${(R*0.075).toFixed(1)}" transform="rotate(-32 ${(fx-R*0.48).toFixed(1)} ${(fy-R*0.30).toFixed(1)})" fill="#ffffff" opacity="0.16"/>`;
  s+=ribsTo(fx,fy,[upper,PT(fx,fy,R*0.84,210),tip,PT(fx,fy,R*0.82,158),lower],style,gr);
  s+=`</g><path d="${d}" fill="none" stroke="${gr}" stroke-width="3.5" stroke-linejoin="round"/>`;return s;
}
function squareWingL(fx,fy,R,style,ink,gr){
  const cid='sw'+Math.round(R*10);
  const topR=[fx,fy-R],corner=[fx-R,fy-R],left=[fx-R,fy-R*0.12];
  const d=blobPath([[fx,fy],topR,corner,left],R*0.16,R*0.03);
  let s=`<path d="${d}" fill="${ink}" stroke="${gr}" stroke-width="3.5" stroke-linejoin="round"/>`;
  s+=`<clipPath id="${cid}"><path d="${d}"/></clipPath><g clip-path="url(#${cid})">`;
  s+=`<rect x="${(fx-R*1.15).toFixed(1)}" y="${(fy-R*1.18).toFixed(1)}" width="${(R*1.3).toFixed(1)}" height="${(R*1.4).toFixed(1)}" fill="${gr}" opacity="0.28"/>`;
  s+=`<path d="${d}" transform="translate(${(-R*0.06).toFixed(1)},${(-R*0.07).toFixed(1)})" fill="${ink}"/>`;
  s+=`<ellipse cx="${(fx-R*0.45).toFixed(1)}" cy="${(fy-R*0.80).toFixed(1)}" rx="${(R*0.24).toFixed(1)}" ry="${(R*0.08).toFixed(1)}" fill="#ffffff" opacity="0.16"/>`;
  let edge=[topR];const n1=5;for(let i=1;i<=n1;i++)edge.push([fx-R*i/n1,fy-R]);
  const n2=4;for(let i=1;i<=n2;i++)edge.push([fx-R,(fy-R)+(R*0.88)*i/n2]);
  s+=ribsTo(fx,fy,edge,style,gr);
  s+=`</g><path d="${d}" fill="none" stroke="${gr}" stroke-width="3.5" stroke-linejoin="round"/>`;return s;
}
function wingLeft(shape,fx,fy,R,n,style,ink,gr){
  if(shape==='pointed')return pointWingL(fx,fy,R,style,ink,gr);
  if(shape==='square')return squareWingL(fx,fy,R,style,ink,gr);
  return roundWingL(fx,fy,R,n,style,ink,gr);
}
function face(cx,hy,hr,shape,ink,bg,sh,p){
  const eyY=hy+(shape==='triangle'?hr*0.24:0),ex=hr*0.4;
  const bex=Math.max(3,hr*0.23),bey=Math.max(4,hr*0.29);
  let s='';
  if(p.blush){
    const bly=eyY+bey*0.85,blx=ex+bex+2;
    s+=`<ellipse cx="${(cx-blx).toFixed(1)}" cy="${bly.toFixed(1)}" rx="3.6" ry="2.1" fill="${bg}" opacity="0.5"/>`;
    s+=`<ellipse cx="${(cx+blx).toFixed(1)}" cy="${bly.toFixed(1)}" rx="3.6" ry="2.1" fill="${bg}" opacity="0.5"/>`;
  }
  s+=`<g class="eyes">`;
  for(const pair of [[-1,p.eyeL],[1,p.eyeR]]){
    const sgn=pair[0],f=pair[1],erx=bex*f,ery=bey*f;
    const px=cx+sgn*ex,pcx=px+p.gaze*erx*0.5,py=eyY+ery*0.22;
    s+=`<ellipse cx="${px.toFixed(1)}" cy="${eyY.toFixed(1)}" rx="${erx.toFixed(1)}" ry="${ery.toFixed(1)}" fill="${bg}" stroke="${sh}" stroke-width="1.4"/>`;
    s+=`<circle cx="${pcx.toFixed(1)}" cy="${py.toFixed(1)}" r="${(erx*0.55).toFixed(1)}" fill="${sh}"/>`;
    s+=`<circle cx="${(pcx-erx*0.2).toFixed(1)}" cy="${(py-erx*0.25).toFixed(1)}" r="${(erx*0.22).toFixed(1)}" fill="${bg}"/>`;
  }
  s+=`</g>`;
  if(p.brow){
    const bs=p.browSide,f=bs===1?p.eyeR:p.eyeL,bx=cx+bs*ex,w=bex*f*1.6;
    const y0=eyY-bey*f-4,drop=2.6;
    s+=`<path d="M${(bx-w/2).toFixed(1)},${(y0+(bs===1?0:drop)).toFixed(1)} L${(bx+w/2).toFixed(1)},${(y0+(bs===1?drop:0)).toFixed(1)}" stroke="${sh}" stroke-width="2.6" stroke-linecap="round"/>`;
  }
  const my=eyY+bey+4,mood=p.mood;
  if(mood===1){
    s+=`<path d="M${(cx-7).toFixed(1)},${my.toFixed(1)} A7 6 0 0 0 ${(cx+7).toFixed(1)},${my.toFixed(1)}Z" fill="${sh}"/>`;
    s+=`<ellipse cx="${cx}" cy="${(my+3.4).toFixed(1)}" rx="3.2" ry="1.7" fill="${bg}" opacity="0.85"/>`;
  }else if(mood===2){
    s+=`<circle cx="${cx}" cy="${(my+2).toFixed(1)}" r="2.8" fill="${sh}"/>`;
  }else if(mood===3){
    s+=`<path d="M${cx-8},${my.toFixed(1)} Q${cx-4},${(my+4.5).toFixed(1)} ${cx},${my.toFixed(1)} Q${cx+4},${(my+4.5).toFixed(1)} ${cx+8},${my.toFixed(1)}" fill="none" stroke="${sh}" stroke-width="2.2" stroke-linecap="round"/>`;
  }else if(mood===4){
    s+=`<path d="M${(cx-7).toFixed(1)},${my.toFixed(1)} A7 6 0 0 0 ${(cx+7).toFixed(1)},${my.toFixed(1)}Z" fill="${sh}"/>`;
    s+=`<path d="M${(cx+1.2).toFixed(1)},${my.toFixed(1)} L${(cx+5).toFixed(1)},${my.toFixed(1)} L${(cx+3.1).toFixed(1)},${(my+3.8).toFixed(1)}Z" fill="${ink}"/>`;
  }else if(mood===5){
    s+=`<rect x="${(cx-8).toFixed(1)}" y="${(my-1.5).toFixed(1)}" width="16" height="6" rx="2.5" fill="${bg}" stroke="${sh}" stroke-width="1.4"/>`;
    s+=`<line x1="${(cx-2.7).toFixed(1)}" y1="${(my-1.5).toFixed(1)}" x2="${(cx-2.7).toFixed(1)}" y2="${(my+4.5).toFixed(1)}" stroke="${sh}" stroke-width="1.1"/>`;
    s+=`<line x1="${(cx+2.7).toFixed(1)}" y1="${(my-1.5).toFixed(1)}" x2="${(cx+2.7).toFixed(1)}" y2="${(my+4.5).toFixed(1)}" stroke="${sh}" stroke-width="1.1"/>`;
  }else{
    s+=`<path d="M${cx-7},${my.toFixed(1)} Q${cx},${(my+6).toFixed(1)} ${cx+7},${my.toFixed(1)}" fill="none" stroke="${sh}" stroke-width="2.5" stroke-linecap="round"/>`;
  }
  return s;
}
function topper(cx,hy,hr,kind,ink,sh){
  const st=` stroke="${sh}" stroke-width="2" paint-order="stroke" stroke-linejoin="round"`;
  if(kind==='halo')return `<ellipse cx="${cx}" cy="${(hy-hr*1.2).toFixed(1)}" rx="${(hr*1.05).toFixed(1)}" ry="${(hr*0.34).toFixed(1)}" fill="none" stroke="${ink}" stroke-width="2.8"/>`;
  if(kind==='spark'){const y=hy-hr*1.15,a=hr*0.52;return `<path d="M${cx},${(y-a).toFixed(1)} L${(cx+a*0.3).toFixed(1)},${(y-a*0.3).toFixed(1)} L${(cx+a).toFixed(1)},${y.toFixed(1)} L${(cx+a*0.3).toFixed(1)},${(y+a*0.3).toFixed(1)} L${cx},${(y+a).toFixed(1)} L${(cx-a*0.3).toFixed(1)},${(y+a*0.3).toFixed(1)} L${(cx-a).toFixed(1)},${y.toFixed(1)} L${(cx-a*0.3).toFixed(1)},${(y-a*0.3).toFixed(1)} Z" fill="${ink}"${st}/>`;}
  if(kind==='nubs')return `<circle cx="${(cx-hr*0.35).toFixed(1)}" cy="${(hy-hr*1.2).toFixed(1)}" r="4" fill="${ink}"${st}/><circle cx="${(cx+hr*0.35).toFixed(1)}" cy="${(hy-hr*1.2).toFixed(1)}" r="4" fill="${ink}"${st}/>`;
  return '';
}
function drawFigure(p,cc,cfg,uid){
  const cx=120,ink=cc.ink,bg=cc.bg,sh=cc.shade;
  const hy=97,hr=24,by=181,br=32,mndY=258;
  let wings='';
  if(p.wingR>0){
    const sx=cx-br*0.45,sy=by-br*0.5;
    const wl=wingLeft(cfg.wing,sx,sy,p.wingR,p.ribCount,p.wingTex,ink,sh);
    wings=`<g class="wing">${wl}</g><g transform="translate(240,0) scale(-1,1)"><g class="wing">${wl}</g></g>`;
  }
  const lyTop=by+br*0.3,lw=10,lx=br*0.4,lst=` stroke="${sh}" stroke-width="3" paint-order="stroke"`;
  let body='';
  body+=`<rect x="${(cx-lx-lw/2).toFixed(1)}" y="${lyTop.toFixed(1)}" width="${lw}" height="${(mndY-2-lyTop).toFixed(1)}" rx="${lw/2}" fill="${ink}"${lst}/>`;
  body+=`<rect x="${(cx+lx-lw/2).toFixed(1)}" y="${lyTop.toFixed(1)}" width="${lw}" height="${(mndY-2-lyTop).toFixed(1)}" rx="${lw/2}" fill="${ink}"${lst}/>`;
  body+=`<rect x="${(cx+lx-lw/2).toFixed(1)}" y="${lyTop.toFixed(1)}" width="${lw}" height="${(mndY-2-lyTop).toFixed(1)}" rx="${lw/2}" fill="${sh}" opacity="0.3"/>`;
  body+=`<rect x="${cx-5.5}" y="${(hy+hr*0.35).toFixed(1)}" width="11" height="${(by-br*0.55-(hy+hr*0.35)).toFixed(1)}" rx="5" fill="${ink}"${lst}/>`;
  body+=shp(cx,by,br,cfg.shape,ink,sh,4);
  body+=dim(cx,by,br,cfg.shape,ink,sh,uid,'b');
  const head=`<g transform="translate(${cx},${hy}) rotate(${p.headTilt.toFixed(1)}) scale(${p.headScale.toFixed(3)}) translate(${-cx},${-hy})">`
    +shp(cx,hy,hr,cfg.shape,ink,sh,4)
    +dim(cx,hy,hr,cfg.shape,ink,sh,uid,'h')
    +topper(cx,hy,hr,cfg.topper,ink,sh)
    +face(cx,hy,hr,cfg.shape,ink,bg,sh,p)
    +`</g>`;
  let s=`<ellipse cx="${cx}" cy="${mndY}" rx="46" ry="8.5" fill="${sh}" opacity="0.55"/>`;
  s+=`<g class="patron-idle"><g transform="rotate(${p.lean.toFixed(1)} ${cx} ${mndY})">${wings}${body}${head}</g></g>`;
  return s;
}
const ROUND="'Quicksand','Varela Round',system-ui,sans-serif";
function card(p,finish,px,uid){
  const c=colorsFor(p,finish);let defs='',ink=c.ink;
  if(c.ink==='__SILVER__'){ink='url(#sv'+uid+')';
    defs=`<defs><linearGradient id="sv${uid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#eceadf"/><stop offset="0.4" stop-color="#bdb8a8"/><stop offset="0.58" stop-color="#79766a"/><stop offset="0.78" stop-color="#d2cdbe"/><stop offset="1" stop-color="#8c8879"/></linearGradient></defs>`;}
  const cc={bg:c.bg,ink:ink,groove:c.groove,shade:c.shade};const labelCol=(c.ink==='__SILVER__')?c.frame:c.ink;const hn=p.house.toLowerCase();const cfg=HOUSES[p.house];
  let s=`<svg viewBox="0 0 240 360" width="${px}" xmlns="http://www.w3.org/2000/svg" role="img"><title>${p.name}, ${p.rank} of ${p.house}</title><desc>BLEXX ${p.code}: ${p.house} creature, ${p.wingSize} ${p.wingTex} wings.</desc>${defs}`;
  s+=`<rect x="0" y="0" width="240" height="360" rx="10" fill="${c.bg}"/>`;
  // seeded sunburst behind the figure
  let rays=`<clipPath id="rc${uid}"><rect x="10" y="10" width="220" height="340" rx="7"/></clipPath>`;
  rays+=`<g clip-path="url(#rc${uid})" fill="${c.shade}" opacity="0.09" transform="rotate(${p.rayRot} 120 158)">`;
  for(let i=0;i<p.rays;i++){
    const a=i*360/p.rays,a1=(a-3.4)*RAD,a2=(a+3.4)*RAD;
    rays+=`<path d="M120,158 L${(120+Math.cos(a1)*250).toFixed(1)},${(158+Math.sin(a1)*250).toFixed(1)} L${(120+Math.cos(a2)*250).toFixed(1)},${(158+Math.sin(a2)*250).toFixed(1)}Z"/>`;
  }
  rays+=`</g>`;
  s+=rays;
  s+=`<rect x="7" y="7" width="226" height="346" rx="9" fill="none" stroke="${c.shade}" stroke-width="4"/>`;
  s+=`<rect x="14" y="14" width="212" height="332" rx="6" fill="none" stroke="${c.frame}" stroke-width="1.6" opacity="0.55"/>`;
  s+=logo('blexx',120,31,87,labelCol,0.92);
  s+=drawFigure(p,cc,cfg,uid);
  s+=`<text x="120" y="301" text-anchor="middle" font-family="${ROUND}" font-size="19" font-weight="700" letter-spacing="0.3" fill="${labelCol}" stroke="${c.shade}" stroke-width="1.8" stroke-linejoin="round" paint-order="stroke">${p.name}</text>`;
  s+=`<text x="120" y="314" text-anchor="middle" font-family="${ROUND}" font-size="8" font-weight="600" letter-spacing="2.5" fill="${labelCol}" opacity="0.8">${p.rank.toUpperCase()}</text>`;
  s+=logoH(hn,120,333,labelCol);
  s+=`</svg>`;return{svg:s,c:c};
}
function cardBackSVG(house){
  const h=HOUSES[house],hn=house.toLowerCase(),pid='cbp-'+hn;
  let s=`<defs><pattern id="${pid}" width="46" height="46" patternUnits="userSpaceOnUse" patternTransform="rotate(18)">`
    +logo('blexx',23,23,26,h.ink,0.14)+`</pattern></defs>`;
  s+=`<rect x="0" y="0" width="240" height="360" rx="10" fill="${h.bg}"/>`;
  s+=`<rect x="0" y="0" width="240" height="360" rx="10" fill="url(#${pid})"/>`;
  s+=`<rect x="14" y="14" width="212" height="332" rx="6" fill="none" stroke="${h.frame}" stroke-width="2" opacity="0.55"/>`;
  s+=logo('blexx',120,31,87,h.ink,0.92);
  s+=logoH(hn,120,333,h.ink);
  return s;
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
const stageMascot=document.getElementById('stageMascot'),cardBackSvg=document.getElementById('cardBackSvg');

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
  const hn=p.house.toLowerCase(),h=HOUSES[p.house];
  cardBackSvg.innerHTML=cardBackSVG(p.house);
  stageMascot.style.setProperty('--mascot-src',`url('assets/mascots/${hn}_mascot.svg')`);
  stageMascot.style.setProperty('--mascot-color',h.ink);
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

const optionsToggle=document.getElementById('optionsToggle'),optionsPanel=document.getElementById('optionsPanel');
optionsToggle.onclick=()=>{
  const open=optionsPanel.hidden;
  optionsPanel.hidden=!open;
  optionsToggle.innerHTML=open?'Customize &#8963;':'Customize &#8964;';
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
