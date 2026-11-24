import I from '../data/journey.json';
const svg=document.getElementById('map'),card=document.getElementById('card'),wrap=document.getElementById('wrap'),chips=document.getElementById('chips');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function blob(cx,cy,r,seed,squash){let p=[];const n=10;for(let i=0;i<n;i++){const a=i/n*Math.PI*2,k=0.82+0.22*Math.sin(seed*3.1+i*2.3);p.push([cx+Math.cos(a)*r*k,cy+Math.sin(a)*r*k*squash])}
 let d=`M${((p[0][0]+p[n-1][0])/2).toFixed(1)} ${((p[0][1]+p[n-1][1])/2).toFixed(1)}`;for(let i=0;i<n;i++){const q=p[i],nx=p[(i+1)%n];d+=` Q${q[0].toFixed(1)} ${q[1].toFixed(1)} ${((q[0]+nx[0])/2).toFixed(1)} ${((q[1]+nx[1])/2).toFixed(1)}`}return d+'Z'}
const route=I.filter(o=>!o.group).map(o=>[o.x,o.y]);let rd=`M${route[0][0]} ${route[0][1]}`;for(let i=1;i<route.length;i++){const a=route[i-1],b=route[i],mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2+(i%2?60:-60);rd+=` Q${mx} ${my} ${b[0]} ${b[1]}`}
let waves='';for(let i=0;i<26;i++){const x=(i*173)%1180+10,y=(i*97)%600+20;waves+=`<path d="M${x} ${y} q8 -6 16 0 t16 0" stroke="var(--sea2)" stroke-width="3" fill="none" stroke-linecap="round"/>`}
let isl='';I.forEach((o,k)=>{const seed=k+1.7;
 const trees=Array.from({length:o.trees},(_,t)=>{const a=t/o.trees*Math.PI*2+seed,rr=o.r*0.45;return`<use href="#tree" x="${(o.x+Math.cos(a)*rr).toFixed(0)}" y="${(o.y-12+Math.sin(a)*rr*0.5).toFixed(0)}"/>`}).join('');
 const deco=`<path d="${blob(o.x-o.r*.1,o.y-o.r*.08,o.r*0.82,seed+.2,0.52)}" fill="none" stroke="var(--forest)" stroke-opacity=".22" stroke-width="1"/>`;
 const fog=o.kind==='fog'?`<ellipse cx="${o.x}" cy="${o.y-6}" rx="${o.r*1.25}" ry="${o.r*0.55}" fill="var(--bg)" opacity=".55"/>`:'';
 isl+=`<a class="isl" href="#${o.id}" data-id="${o.id}" aria-label="${esc(o.name)}, ${esc(o.years)}">
 <ellipse cx="${o.x}" cy="${o.y+o.r*0.5}" rx="${o.r*1.05}" ry="${o.r*0.28}" fill="var(--deep)" opacity=".14"/>
 <path class="ring" d="${blob(o.x,o.y+10,o.r*1.08,seed,0.62)}" fill="var(--sand)" stroke="none"/>
 <path class="top" d="${blob(o.x,o.y,o.r*0.92,seed+.4,0.56)}" fill="var(--moss)"/>
 <path d="${blob(o.x-o.r*.12,o.y-o.r*.08,o.r*0.62,seed+.9,0.5)}" fill="none" stroke="var(--forest)" stroke-opacity=".35" stroke-width="1.2"/>
 <path d="${blob(o.x-o.r*.16,o.y-o.r*.1,o.r*0.36,seed+1.3,0.5)}" fill="var(--forest)" opacity=".22" stroke="var(--forest)" stroke-opacity=".4" stroke-width="1.2"/>
 ${trees}${deco}${fog}
 <text class="label" x="${o.x+(o.group?22:0)}" y="${o.group?o.y-40:o.y+o.r*0.62+28}" text-anchor="middle"${o.group?' style="font-size:14px"':''}>${esc(o.name)}</text>
 ${o.group?'':`<text class="sub" x="${o.x}" y="${o.y+o.r*0.62+47}" text-anchor="middle">${esc(o.years)}</text>`}</a>`});
svg.innerHTML=`<defs>
<g id="tree"><ellipse cx="1" cy="6" rx="7" ry="2.2" fill="var(--deep)" opacity=".18"/><circle cx="-3" cy="-1" r="5.5" fill="var(--forest)"/><circle cx="3" cy="-3" r="6" fill="var(--forest)"/><circle cx="1.5" cy="-5" r="2.6" fill="#fff" opacity=".12"/></g>
<g id="house"><ellipse cx="1" cy="5" rx="9" ry="2" fill="var(--deep)" opacity=".15"/><path d="M-6 4 V-2 L0 -6 L6 -2 V4Z" fill="var(--sand)" stroke="var(--deep)" stroke-opacity=".35" stroke-width=".8"/><path d="M0 -6 L6 -2 V4 H0Z" fill="var(--deep)" opacity=".12"/></g>
<g id="light"><ellipse cx="1" cy="1" rx="8" ry="2" fill="var(--deep)" opacity=".18"/><path d="M-3 0 L-2 -24 H2 L3 0Z" fill="var(--sand)" stroke="var(--deep)" stroke-opacity=".4" stroke-width=".8"/><path d="M0 -24 H2 L3 0 H0Z" fill="var(--deep)" opacity=".12"/><rect x="-2.6" y="-14" width="5.2" height="2.4" fill="var(--forest)" opacity=".7"/><circle cx="0" cy="-26.5" r="2.2" fill="var(--accent)" opacity=".85"/></g>
</defs>${waves}<path d="${rd}" fill="none" stroke="var(--forest)" stroke-width="3" stroke-dasharray="2 12" stroke-linecap="round" opacity=".55"/>${isl}`;
chips.innerHTML=I.map(o=>`<button class="chip" type="button" data-id="${o.id}" aria-pressed="false">${esc(o.name)}</button>`).join('');
const full=[0,0,1200,640];let cur=full.slice(),anim=0;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
function setVB(v){svg.setAttribute('viewBox',v.map(n=>n.toFixed(1)).join(' '))}
function fly(to){cancelAnimationFrame(anim);const from=cur.slice(),t0=performance.now(),dur=reduce?0:750;
 const step=t=>{const k=dur?Math.min(1,(t-t0)/dur):1,e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;cur=from.map((f,i)=>f+(to[i]-f)*e);setVB(cur);if(k<1)anim=requestAnimationFrame(step)};anim=requestAnimationFrame(step)}
function overview(){card.innerHTML=`<h2>Five islands, one route</h2><p class="meta"><span>From the lecture hall to today</span></p><ul><li>First met Business Central in an Information Systems class, and didn't like it</li><li>Started in Čačak as a student, learning AL on POS projects for a Danish ISV</li><li>Worked on Bcility's Mandatory Fields app, published on Microsoft Marketplace</li><li>Grew into industry solutions for a German ISV</li><li>Now on regional BC projects with AI-assisted development</li></ul><div class="tags"><span class="tag">AL</span><span class="tag">Business Central</span><span class="tag">NAV</span><span class="tag c">AI Agents</span></div>`}
function show(id){const o=I.find(x=>x.id===id);
 document.querySelectorAll('.chip').forEach(c=>c.setAttribute('aria-pressed',String(c.dataset.id===id)));
 if(!o){wrap.classList.remove('zoomed');fly(full);overview();return}
 wrap.classList.add('zoomed');const w=o.r*(o.group?6.5:4.2),h=w*640/1200;fly([o.x-w/2,o.y-h/2+12,w,h]);
 card.innerHTML=`<h2>${esc(o.title)}</h2><div class="meta"><span>${esc(o.role)}</span><span>${esc(o.place)}</span><span>${esc(o.dates)}</span></div>
 <p style="margin:0 0 10px">${esc(o.client)}</p><ul>${o.points.map(p=>`<li>${esc(p)}</li>`).join('')}</ul>
 ${o.project?`<div class="proj"><strong>${esc(o.project.title)}</strong><p style="margin:4px 0 8px">${esc(o.project.text)}</p><ul style="margin:0 0 10px;padding-left:18px">${o.project.points.map(p=>`<li>${esc(p)}</li>`).join('')}</ul><div class="tags">${o.project.tags.map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div></div>`:''}
 ${o.fun?(Array.isArray(o.fun)?`<div class="fun"><strong>Fun facts</strong><ul style="margin:0;padding-left:18px">${o.fun.map(f=>`<li>${esc(f)}</li>`).join('')}</ul></div>`:`<p class="fun"><strong>Fun fact</strong>${esc(o.fun)}</p>`):''}
 <div class="tags">${o.countries.map(c=>`<span class="tag c">${esc(c)}</span>`).join('')}${o.tags.map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div>
 ${o.link?`<p style="margin:14px 0 0"><a href="${esc(o.link)}">${o.id==='next'?'Open LinkedIn profile':'View on Microsoft Marketplace'}</a></p>`:''}`}
function route2(){show(location.hash.slice(1))}
svg.addEventListener('click',e=>{const a=e.target.closest('.isl');if(!a)return;e.preventDefault();const id=a.dataset.id;if(location.hash==='#'+id)show(id);else location.hash=id});
chips.addEventListener('click',e=>{const b=e.target.closest('.chip');if(b)location.hash=b.dataset.id});
document.getElementById('back').addEventListener('click',()=>{location.hash='journey';show('')});
addEventListener('hashchange',route2);route2();
