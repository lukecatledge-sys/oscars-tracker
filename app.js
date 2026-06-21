/* ============================================================
   LEAD ROLE — Application logic
   ============================================================ */
const {FIG, EX, ARCHETYPES, PROGRAM, STANDARDS, BODYFAT, LEARN, MOBILITY} = window.DATA;

/* ---------------- State ---------------- */
const LS_KEY = "leadrole.v2";
let state = load();
function load(){ try{ return Object.assign(fresh(), JSON.parse(localStorage.getItem(LS_KEY))||{}); }catch(e){ return fresh(); } }
function fresh(){ return {
  onboarded:false, archetype:"leadingman", program:"foundation", experience:"beginner",
  bw:175, unit:"lb", goal:"lean", customWeek:null,
  logs:{}, done:{}, history:[], measures:[]
}; }
function save(){ localStorage.setItem(LS_KEY, JSON.stringify(state)); }
const todayKey = () => { const d=new Date(); return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate(); };
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

/* ---------------- Router ---------------- */
const views = {today:render_today, train:render_train, aesthetic:render_aesthetic, mobility:render_mobility, fuel:render_fuel};
const titles = {today:"Today", train:"Train", aesthetic:"The Blueprint", mobility:"Mobility", fuel:"Fuel"};
function go(v){
  document.querySelectorAll("nav button").forEach(b=>b.classList.toggle("on", b.dataset.v===v));
  document.querySelectorAll(".view").forEach(s=>s.classList.remove("on"));
  $("v-"+v).classList.add("on");
  $("htitle").textContent = titles[v];
  views[v]();
  window.scrollTo({top:0,behavior:"instant"});
}
document.querySelectorAll("nav button").forEach(b=> b.onclick=()=>go(b.dataset.v));

/* ---------------- Helpers ---------------- */
function currentProgram(){ return PROGRAM[state.program] || PROGRAM.foundation; }
function weekMap(){ return state.customWeek || currentProgram().defaultWeek; }
function getTodaysSession(){
  const wd = new Date().getDay();
  const map = weekMap();
  if(map[wd]===undefined) return null;
  return {program:state.program, day:map[wd]};
}
function schemeSets(s){
  if(s.includes("×")){ const m=s.match(/(\d+)\s*×/); return m?+m[1]:3; }
  const seg=s.split("·").pop();
  return (seg.match(/\//g)||[]).length+1;
}
function fmtDate(d=new Date()){ return d.toLocaleDateString(undefined,{month:'short',day:'numeric'}); }
function dayLabel(n){ return ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][n]; }

/* ============================================================
   ONBOARDING
   ============================================================ */
let ob = {step:0, experience:null, archetype:null, days:null};
function startOnboarding(){
  ob = {step:0, experience:state.experience, archetype:state.archetype, days:null};
  renderOnboarding();
  $("modal").classList.add("on");
}
function renderOnboarding(){
  const steps = [
    {key:"welcome"},
    {key:"experience"},
    {key:"archetype"},
    {key:"days"},
    {key:"stats"}
  ];
  const total = steps.length;
  let body="";

  if(ob.step===0){
    body = `<div class="ob-step on" style="text-align:center">
      <div style="font-size:40px;margin:6px 0 10px">★</div>
      <h2 class="serif" style="font-size:26px">Welcome to Lead Role</h2>
      <p class="lead mt12">Let's build your plan for the leading-man physique — broad shoulders, a lean waist, mobile and athletic. Three quick questions.</p>
      <button class="btn gold full mt16" onclick="obNext()">Get started</button>
      <button class="btn ghost full" style="margin-top:8px" onclick="skipOnboarding()">Skip for now</button>
    </div>`;
  }
  if(ob.step===1){
    const opts=[
      {k:"beginner",t:"New to lifting",d:"Less than ~6 months of consistent training"},
      {k:"intermediate",t:"Some experience",d:"You train regularly and know the basics"},
      {k:"advanced",t:"Experienced",d:"Years of consistent, progressive training"}
    ];
    body = obStep("How much training experience do you have?","We'll match you to the right program.",
      opts.map(o=>obOpt("experience",o.k,o.t,o.d,o.k[0].toUpperCase())).join(""));
  }
  if(ob.step===2){
    body = obStep("What look are you going for?","All four build the V-taper — they differ in size and leanness. You can change this anytime.",
      Object.entries(ARCHETYPES).map(([k,a])=>obOpt("archetype",k,a.name,a.tag,"")).join(""));
  }
  if(ob.step===3){
    const opts=[
      {k:3,t:"3 days / week",d:"Foundation full-body — great for everyone, especially starting out"},
      {k:4,t:"4 days / week",d:"Greek God split — more volume for shoulders, chest and back"},
      {k:5,t:"5 days / week",d:"Specialization — maximum focus, for dedicated lifters"}
    ];
    body = obStep("How many days a week can you train?","Honest answer — consistency beats ambition.",
      opts.map(o=>obOpt("days",o.k,o.t,o.d,o.k)).join(""));
  }
  if(ob.step===4){
    body = `<div class="ob-step on">
      <h2 class="serif" style="font-size:23px">A couple of numbers</h2>
      <p class="lead mt8" style="font-size:14px">For your nutrition targets and progress tracking. Estimates are fine.</p>
      <div class="row gap10 mt16">
        <label class="field" style="flex:1"><span class="lab">Body weight</span>
          <input class="inp" id="ob-bw" inputmode="decimal" value="${state.bw}"></label>
        <label class="field" style="flex:1"><span class="lab">Unit</span>
          <div class="seg" style="margin:0">
            <button id="ob-lb" class="${state.unit==='lb'?'on':''}" onclick="obUnit('lb')">lb</button>
            <button id="ob-kg" class="${state.unit==='kg'?'on':''}" onclick="obUnit('kg')">kg</button>
          </div></label>
      </div>
      <button class="btn gold full mt16" onclick="finishOnboarding()">Build my plan</button>
    </div>`;
  }

  $("modal-body").innerHTML = body + (ob.step>0 ? dotsHTML(total, ob.step) : "");
}
function obStep(title, sub, opts){
  return `<div class="ob-step on">
    <h2 class="serif" style="font-size:23px">${title}</h2>
    <p class="lead mt8" style="font-size:14px">${sub}</p>
    <div class="mt16">${opts}</div>
    <div class="row gap10 mt12">
      <button class="btn ghost" onclick="obBack()" style="flex:0 0 90px">Back</button>
      <button class="btn gold" style="flex:1" onclick="obNext()">Continue</button>
    </div>
  </div>`;
}
function obOpt(field,val,t,d,icon){
  const on = ob[field]==val;
  const ic = icon!=="" ? `<div class="obi">${icon}</div>` : "";
  return `<button class="ob-opt ${on?'on':''}" onclick="obPick('${field}','${val}')">
    ${ic}<div style="flex:1"><div class="obt">${t}</div><div class="obd">${d}</div></div></button>`;
}
function dotsHTML(total,active){
  let d=""; for(let i=1;i<total;i++) d+=`<div class="dt ${i===active?'on':''}"></div>`;
  return `<div class="dots">${d}</div>`;
}
function obPick(field,val){ ob[field]= (field==="days") ? +val : val; renderOnboarding(); }
function obUnit(u){ state.unit=u; $("ob-lb").classList.toggle("on",u==="lb"); $("ob-kg").classList.toggle("on",u==="kg"); }
function obNext(){
  if(ob.step===1 && !ob.experience) return toast("Pick one to continue");
  if(ob.step===2 && !ob.archetype) return toast("Pick a look to continue");
  if(ob.step===3 && !ob.days) return toast("Pick your days to continue");
  ob.step++; renderOnboarding();
}
function obBack(){ ob.step=Math.max(0,ob.step-1); renderOnboarding(); }
function skipOnboarding(){ state.onboarded=true; save(); $("modal").classList.remove("on"); go("today"); }
function finishOnboarding(){
  state.experience = ob.experience || "beginner";
  state.archetype = ob.archetype || "leadingman";
  state.program = ob.days===5 ? "specialization" : ob.days===4 ? "greekgod" : "foundation";
  state.customWeek = null; // use program default
  state.bw = parseFloat($("ob-bw").value)||state.bw;
  state.onboarded = true;
  save();
  $("modal").classList.remove("on");
  go("today");
  toast("Your plan is ready 🎬");
}

/* ============================================================
   TODAY
   ============================================================ */
function render_today(){
  const el = $("v-today");
  const sess = getTodaysSession();
  const wd = new Date().getDay();
  const dayName = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][wd];
  const arch = ARCHETYPES[state.archetype];

  let html = `<div class="hero">
    <div class="eyebrow">${dayName} · ${fmtDate()}</div>
    <h1>Build the <span class="g">${arch.name.replace(/^The /,'').toLowerCase()}</span> frame.</h1>
    <p>${esc(arch.look)}</p>
    <div class="streak">${last7Dots()}</div>
    <div class="streak"><div style="width:100%;display:flex;justify-content:space-between">${
      Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()-(6-i));return `<span class="lbl">${dayLabel(d.getDay())}</span>`;}).join("")
    }</div></div>
  </div>`;

  if(!sess){
    html += `<div class="card glass">
      <div class="row between"><h3>Recovery Day</h3><span class="tag gold">Rest</span></div>
      <p class="muted small mt8">No lifting scheduled today. Do the <b style="color:var(--txt)">Daily Mobility Flow</b>, walk 8–10k steps, and let this week's training turn into muscle. Recovery is where the physique is actually built.</p>
      <div class="row gap10 mt16">
        <button class="btn gold" style="flex:1" onclick="go('mobility')">Mobility Flow</button>
        <button class="btn" style="flex:1" onclick="go('train')">View Program</button>
      </div>
    </div>`;
    el.innerHTML = html + quickStats() + footer();
    return;
  }

  const prog = PROGRAM[sess.program];
  const day = prog.schedule[sess.day];
  const dk = todayKey();
  const doneMap = state.done[dk]||{};
  const total = day.ex.length;
  const completed = day.ex.filter((_,i)=>doneMap[i]).length;
  const pct = Math.round(completed/total*100);

  html += `<div class="card">
    <div class="row between">
      <div><div class="daypill">${prog.name} · ${day.d}</div></div>
      ${ringSVG(pct)}
    </div>
    <p class="muted small mt12">${completed} of ${total} done. Reverse-pyramid the lifts marked <b style="color:var(--gold)">RPT</b>: heaviest set first, then drop ~10% and add reps.</p>
    <button class="btn sm full mt12" onclick="go('mobility')">
      <svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="2"/><path d="M12 8v6m0 0l-4 6m4-6l4 6M7 11h10"/></svg> 5-min warm-up first</button>
  </div>`;

  day.ex.forEach((item,i)=>{
    const e = EX[item.ex];
    const done = !!doneMap[i];
    const logKey = `${dk}.${sess.program}.${sess.day}.${i}`;
    const log = state.logs[logKey]||{};
    const last = lastLog(item.ex);
    const nSets = schemeSets(item.scheme);
    let setsHTML="";
    for(let s=0;s<nSets;s++){
      const sl = log[s]||{};
      setsHTML += `<div class="setrow">
        <span class="lbl">Set ${s+1}</span>
        <input class="inp" inputmode="decimal" placeholder="${last&&last[s]?last[s].w||'wt':'wt'}" value="${sl.w||''}" onchange="logSet('${logKey}',${s},'w',this.value)">
        <input class="inp" inputmode="numeric" placeholder="${last&&last[s]?last[s].r||'reps':'reps'}" value="${sl.r||''}" onchange="logSet('${logKey}',${s},'r',this.value)">
        <button class="setdone ${sl.done?'on':''}" onclick="toggleSet('${logKey}',${s},this)"><svg viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"/></svg></button>
      </div>`;
    }
    html += `<div class="ex ${done?'done':''}" id="ex-${i}">
      <div class="ex-h">
        <button class="chk ${done?'done':''}" onclick="toggleDone(${i})"><svg viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"/></svg></button>
        <div style="flex:1" onclick="toggleExpand(${i})">
          <div class="ex-n">${e.name}</div>
          <div class="ex-meta"><span class="scheme">${item.scheme}</span> · rest ${item.rest}${last?` · last: ${lastSummary(last)}`:''}</div>
        </div>
        <button class="infobtn" onclick="openEx('${item.ex}')"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg></button>
      </div>
      <div class="ex-body">
        ${item.note?`<div class="note" style="margin-bottom:12px">${item.note}</div>`:''}
        <div class="sets">${setsHTML}</div>
        <button class="btn sm full mt12" onclick="startRest('${item.rest}','${esc(e.name)}')">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M9 2h6"/></svg> Rest timer · ${item.rest}</button>
      </div>
    </div>`;
  });

  html += `<button class="btn ${completed===total?'gold':''} full mt8" onclick="finishWorkout()">
    ${completed===total?'✓ Finish & log workout':'Mark workout complete'}</button>`;

  el.innerHTML = html + footer();
}

function quickStats(){
  const trained = state.history.length;
  const week = state.history.filter(k=>{
    const d=new Date(k); const now=new Date(); const diff=(now-d)/864e5; return diff<7;
  }).length;
  return `<div class="statgrid" style="margin-top:4px">
    <div class="stat"><b>${trained}</b><span>WORKOUTS</span></div>
    <div class="stat"><b>${week}</b><span>THIS WEEK</span></div>
    <div class="stat"><b>${streakCount()}</b><span>WEEK STREAK</span></div>
  </div>`;
}
function streakCount(){
  // consecutive weeks with >=1 workout
  let weeks=0;
  for(let w=0;w<52;w++){
    const start=new Date(); start.setDate(start.getDate()-(w*7)-6);
    const end=new Date(); end.setDate(end.getDate()-(w*7));
    const hit=state.history.some(k=>{const d=new Date(k);return d>=stripTime(start)&&d<=end;});
    if(hit) weeks++; else if(w>0) break; else break;
  }
  return weeks;
}
function stripTime(d){d.setHours(0,0,0,0);return d;}
function lastLog(exId){
  // most recent completed-session snapshot for this exercise
  return state.lastByEx ? state.lastByEx[exId] : null;
}
function lastSummary(last){
  const s=last[0]; if(!s) return "";
  return `${s.w||'–'}×${s.r||'–'}`;
}
function ringSVG(pct){
  const r=16,c=2*Math.PI*r,off=c-(pct/100)*c;
  return `<svg width="46" height="46" class="progress-ring" viewBox="0 0 46 46">
    <circle cx="23" cy="23" r="${r}" stroke="#2a2a32" stroke-width="4.5" fill="none"/>
    <circle cx="23" cy="23" r="${r}" stroke="#d8b46a" stroke-width="4.5" fill="none" stroke-linecap="round"
      stroke-dasharray="${c}" stroke-dashoffset="${off}" style="transition:stroke-dashoffset .5s"/>
    <text x="23" y="27.5" text-anchor="middle" transform="rotate(90 23 23)" fill="#d8b46a" font-size="12" font-weight="800">${pct}%</text>
  </svg>`;
}
function last7Dots(){
  let out="";
  for(let i=6;i>=0;i--){ const d=new Date();d.setDate(d.getDate()-i);
    const k=d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
    out+=`<div class="d ${state.history.includes(k)?'on':''}"></div>`; }
  return out;
}
function toggleExpand(i){ $("ex-"+i).classList.toggle("open"); }
function toggleDone(i){ const dk=todayKey(); state.done[dk]=state.done[dk]||{}; state.done[dk][i]=!state.done[dk][i]; save(); render_today(); }
function logSet(key,s,field,val){
  state.logs[key]=state.logs[key]||{}; state.logs[key][s]=state.logs[key][s]||{}; state.logs[key][s][field]=val;
  save();
}
function exFromKey(key){
  const parts=key.split("."); // date(y-m-d had no dots? date uses '-'), so parts: [date, program, day, idx]
  const program=parts[parts.length-3], day=+parts[parts.length-2], idx=+parts[parts.length-1];
  try{ return PROGRAM[program].schedule[day].ex[idx].ex; }catch(e){ return null; }
}
function toggleSet(key,s,btn){
  state.logs[key]=state.logs[key]||{}; state.logs[key][s]=state.logs[key][s]||{};
  state.logs[key][s].done=!state.logs[key][s].done;
  save(); btn.classList.toggle("on");
}
function finishWorkout(){
  const k=todayKey();
  if(!state.history.includes(k)) state.history.push(k);
  // snapshot today's logged sets as "last time" for each exercise
  const sess=getTodaysSession();
  if(sess){
    state.lastByEx=state.lastByEx||{};
    PROGRAM[sess.program].schedule[sess.day].ex.forEach((item,i)=>{
      const lk=`${k}.${sess.program}.${sess.day}.${i}`;
      if(state.logs[lk]) state.lastByEx[item.ex]=JSON.parse(JSON.stringify(state.logs[lk]));
    });
  }
  save(); toast("Workout logged — recover hard 💪"); render_today();
}

/* ============================================================
   TRAIN (Programs + Moves)
   ============================================================ */
let trainTab="programs", progView=null, progDay=0, libFilter="all", libSearch="";
function render_train(){
  const el=$("v-train");
  let html=`<div class="seg">
    <button class="${trainTab==='programs'?'on':''}" onclick="trainTab='programs';render_train()">Programs</button>
    <button class="${trainTab==='moves'?'on':''}" onclick="trainTab='moves';render_train()">Exercise Library</button>
  </div>`;
  if(trainTab==='programs') html += programsHTML();
  else html += movesHTML();
  el.innerHTML = html;
  if(trainTab==='moves'){ renderLibList(); }
  el.insertAdjacentHTML("beforeend", footer());
}

function programsHTML(){
  const pv = progView || state.program;
  let html=`<div class="chips noscroll">${
    Object.entries(PROGRAM).map(([k,p])=>`<button class="chip ${pv===k?'on':''}" onclick="progView='${k}';progDay=0;render_train()">${p.name}</button>`).join("")
  }</div>`;
  const p=PROGRAM[pv];
  const isMine = state.program===pv;
  html+=`<div class="card glass">
    <div class="row between">
      <div class="eyebrow">${p.weeks} · ${p.level}</div>
      ${isMine?'<span class="tag ok">Your plan</span>':''}
    </div>
    <h2 class="serif mt8" style="font-size:23px">${p.name}</h2>
    <p class="lead small mt8">${p.blurb}</p>
    <div class="pill-list">${p.days.map(d=>`<span class="tag gold">${d}</span>`).join("")}</div>
    ${!isMine?`<button class="btn gold full mt16" onclick="setProgram('${pv}')">Use this program</button>`:''}
  </div>`;
  html+=`<div class="daynav noscroll">`;
  p.schedule.forEach((d,i)=>{ html+=`<button class="daybtn ${i===progDay?'on':''}" onclick="progDay=${i};render_train()">
    <div class="dn">DAY ${i+1}</div><div class="dl">${d.d.split('(')[0].trim()}</div></button>`; });
  html+=`</div>`;
  const day=p.schedule[progDay];
  html+=`<div class="card"><h3 style="font-size:16px">${day.d}</h3><div class="mt12">`;
  day.ex.forEach(item=>{ const e=EX[item.ex];
    html+=`<div class="ex tap" onclick="openEx('${item.ex}')"><div class="ex-h">
      <div class="thumb"><svg viewBox="0 0 24 24">${FIG[e.icon]}</svg></div>
      <div style="flex:1"><div class="ex-n" style="font-size:15px">${e.name}</div>
      <div class="ex-meta"><span class="scheme">${item.scheme}</span> · rest ${item.rest}</div></div>
      <svg class="chev" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></div></div>`; });
  html+=`</div></div>`;
  html+=`<div class="card"><h3 style="font-size:16px">How to run it</h3>
    <ul class="cuelist mt8">
      <li><b>Reverse Pyramid (RPT):</b> warm up, then do your heaviest set first. Drop ~10% and add 1–2 reps each following set.</li>
      <li><b>Double progression:</b> hit the top of a rep range on your first set → add the smallest weight next time.</li>
      <li><b>Leave 1–2 reps in the tank</b> on heavy sets. Quality and longevity beat grinding to failure.</li>
      <li><b>Isolation moves</b> (raises, curls, pushdowns): chase reps and the squeeze, not max weight.</li>
      <li><b>Warm up the joints</b> (Mobility tab) before the first heavy lift, every session.</li>
    </ul></div>`;
  return html;
}
function setProgram(k){ state.program=k; state.customWeek=null; save(); progView=k; toast(PROGRAM[k].name+" is now your plan"); render_train(); }

const GROUPS={all:"All",shoulder:"Shoulders & Chest",pull:"Back & Arms",legs:"Legs",core:"Core & Waist"};
function movesHTML(){
  return `<div class="searchwrap">
    <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>
    <input class="search" id="libsearch" placeholder="Search exercises or muscles…" value="${esc(libSearch)}" oninput="libSearch=this.value;renderLibList()">
  </div>
  <div class="chips noscroll">${Object.entries(GROUPS).map(([k,v])=>
    `<button class="chip ${libFilter===k?'on':''}" onclick="libFilter='${k}';renderChips();renderLibList()">${v}</button>`).join("")}</div>
  <div id="libList"></div>`;
}
function renderChips(){
  document.querySelectorAll("#v-train .chips .chip").forEach((c,i)=>{
    c.classList.toggle("on", Object.keys(GROUPS)[i]===libFilter);
  });
}
function renderLibList(){
  const list=$("libList"); if(!list) return;
  const q=libSearch.toLowerCase();
  const items=Object.entries(EX).filter(([id,e])=>{
    const okG=libFilter==="all"||e.group===libFilter;
    const okS=!q||e.name.toLowerCase().includes(q)||e.muscles.join(" ").toLowerCase().includes(q);
    return okG&&okS;
  });
  if(!items.length){ list.innerHTML=`<div class="empty">No exercises match.</div>`; return; }
  // sort key tier first
  const order={key:0,core:1,accessory:2};
  items.sort((a,b)=>(order[a[1].tier]??3)-(order[b[1].tier]??3));
  list.innerHTML=items.map(([id,e])=>`
    <div class="item tap" onclick="openEx('${id}')">
      <div class="thumb"><svg viewBox="0 0 24 24">${FIG[e.icon]}</svg></div>
      <div style="flex:1"><div class="ex-n" style="font-size:15px">${e.name}${e.tier==='key'?' <span class="tag gold" style="font-size:9px;padding:2px 7px;vertical-align:middle">KEY</span>':''}</div>
      <div class="ex-meta">${e.equip} · ${e.muscles[0]}</div></div>
      <svg class="chev" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></div>`).join("");
}

/* ============================================================
   EXERCISE DETAIL SHEET
   ============================================================ */
function openSheet(html){ $("sheetCard").innerHTML=`<div class="grab"></div>`+html; $("sheet").classList.add("on"); $("sheetCard").scrollTop=0; }
function closeSheet(){ $("sheet").classList.remove("on"); }
function openEx(id){
  const e=EX[id];
  const yt="https://www.youtube.com/results?search_query="+encodeURIComponent("how to "+e.name+" proper form technique");
  openSheet(`
    <div class="sheet-hero"><svg class="fig" viewBox="0 0 24 24">${FIG[e.icon]}</svg></div>
    <div class="row between"><div class="eyebrow">${e.equip}</div>${e.tier==='key'?'<span class="tag gold">Key for the look</span>':''}</div>
    <h2 class="serif mt8" style="font-size:24px">${e.name}</h2>
    <div class="musclebar">${e.muscles.map(m=>`<span class="mb">${m}</span>`).join("")}</div>
    <p class="lead small mt8">${e.why}</p>
    <a class="btn gold full mt16" href="${yt}" target="_blank" rel="noopener">
      <svg viewBox="0 0 24 24"><path d="M5 4l14 8-14 8z"/></svg> Watch demo videos</a>
    <div class="sec-h">Tempo</div><p class="small muted">${e.tempo}</p>
    <div class="sec-h">How to perform</div><ol class="steps">${e.steps.map(s=>`<li>${s}</li>`).join("")}</ol>
    <div class="sec-h">Coaching cues</div><ul class="cuelist ok">${e.cues.map(c=>`<li>${c}</li>`).join("")}</ul>
    <div class="sec-h">Common mistakes</div><ul class="cuelist bad">${e.faults.map(f=>`<li>${f}</li>`).join("")}</ul>
    <div class="sec-h">Swap for (medium gym)</div><div class="pill-list" style="margin-top:0">${e.sub.map(s=>`<span class="tag">${s}</span>`).join("")}</div>
    <button class="btn full mt16" onclick="closeSheet()">Close</button>`);
}

/* ============================================================
   AESTHETIC — Blueprint / Measure / Learn
   ============================================================ */
let aestTab="blueprint";
function render_aesthetic(){
  const el=$("v-aesthetic");
  let html=`<div class="seg">
    <button class="${aestTab==='blueprint'?'on':''}" onclick="aestTab='blueprint';render_aesthetic()">Blueprint</button>
    <button class="${aestTab==='measure'?'on':''}" onclick="aestTab='measure';render_aesthetic()">Measure</button>
    <button class="${aestTab==='learn'?'on':''}" onclick="aestTab='learn';render_aesthetic()">Academy</button>
  </div>`;
  if(aestTab==='blueprint') html+=blueprintHTML();
  else if(aestTab==='measure') html+=measureHTML();
  else html+=learnHTML();
  el.innerHTML=html+footer();
  if(aestTab==='measure') drawChart();
}

/* ----- Blueprint: archetypes + body fat + standards ----- */
function blueprintHTML(){
  let html=`<div class="card glass">
    <div class="eyebrow">The science</div>
    <h2 class="serif mt8" style="font-size:22px">What makes a "movie-star" body</h2>
    <p class="lead small mt8">It isn't size — it's <b style="color:var(--txt)">proportion and leanness</b>. The eye reads a high shoulder-to-waist ratio (the V-taper) as a great male physique. The golden-ratio target is shoulders ≈ <b style="color:var(--gold)">1.618×</b> your waist. Build the shoulders and back wider, keep the waist lean and tight — that's the whole game.</p>
  </div>`;

  html+=`<div class="shead"><h2>Pick your look</h2></div>`;
  html+=Object.entries(ARCHETYPES).map(([k,a])=>{
    const mine=state.archetype===k;
    return `<div class="arch">
      <div class="arch-top">
        <div class="row between"><div class="arch-name serif">${a.name}</div>${mine?'<span class="tag ok">Selected</span>':''}</div>
        <div class="arch-tag">${a.tag}</div>
        <div class="arch-metrics">
          <div class="arch-metric"><b>${a.metrics.shoulderWaist}</b><span>SHOULDER:WAIST</span></div>
          <div class="arch-metric"><b>${a.bodyfat}</b><span>BODY FAT</span></div>
        </div>
      </div>
      <div style="padding:16px">
        <p class="small muted">${a.ref}</p>
        <div class="sec-h" style="margin-top:14px">Emphasis</div>
        <div class="pill-list" style="margin-top:0">${a.emphasis.map(e=>`<span class="tag gold">${e}</span>`).join("")}</div>
        <p class="tiny mut2" style="margin-top:12px"><b style="color:var(--mut)">Timeline:</b> ${a.horizon}</p>
        ${mine?'':`<button class="btn full sm mt12" onclick="setArchetype('${k}')">Choose this look</button>`}
      </div>
    </div>`;
  }).join("");

  html+=`<div class="shead"><h2>Body fat, decoded</h2></div>
    <p class="small muted" style="margin:-4px 2px 12px">The same muscle looks completely different at different body-fat levels. The leading-man look lives at <b style="color:var(--gold)">10–12%</b>.</p>
    <div class="card">${BODYFAT.map(b=>`
      <div class="bfrow"><div class="bfbadge">${b.range}</div>
      <div class="bftext"><b>${b.label}</b><p>${b.desc}</p></div></div>`).join("")}</div>`;

  html+=`<div class="shead"><h2>Strength milestones</h2></div>
    <p class="small muted" style="margin:-4px 2px 12px">Hit these (as a multiple of bodyweight) and the look tends to follow. Milestones, not requirements — progress is the point.</p>
    <div class="card">
      <div class="std">
        <div class="h">Lift</div><div class="h" style="text-align:center">Start</div><div class="h" style="text-align:center">Inter.</div><div class="h" style="text-align:center">Adv.</div>
        ${STANDARDS.map(s=>`<div class="c lift">${s.lift}</div><div class="c val">${s.beginner}</div><div class="c val">${s.intermediate}</div><div class="c val">${s.advanced}</div>`).join("")}
      </div>
      <p class="tiny mut2 mt12">Top reverse-pyramid set for ~5 reps unless noted. "×" = multiple of bodyweight.</p>
    </div>`;
  return html;
}
function setArchetype(k){ state.archetype=k; save(); toast(ARCHETYPES[k].name+" selected"); render_aesthetic(); }

/* ----- Measure: golden ratio + measurement log + chart ----- */
function measureHTML(){
  const m=lastMeasure();
  const u=state.unit;
  let html=`<div class="card glass">
    <div class="eyebrow">Golden ratio analyzer</div>
    <h2 class="serif mt8" style="font-size:21px">Where you stand</h2>
    <p class="small muted mt8">Enter your measurements (a soft tape, relaxed). We'll show your shoulder-to-waist ratio against the 1.618 ideal and your targets.</p>
    <div class="row gap10 mt16">
      <label class="field" style="flex:1"><span class="lab">Shoulders (girth, ${u})</span>
        <input class="inp" id="m-sh" inputmode="decimal" placeholder="e.g. 50" value="${m.shoulders||''}"></label>
      <label class="field" style="flex:1"><span class="lab">Waist (${u})</span>
        <input class="inp" id="m-wa" inputmode="decimal" placeholder="e.g. 32" value="${m.waist||''}"></label>
    </div>
    <div class="row gap10">
      <label class="field" style="flex:1"><span class="lab">Height (${u})</span>
        <input class="inp" id="m-ht" inputmode="decimal" placeholder="optional" value="${m.height||''}"></label>
      <label class="field" style="flex:1"><span class="lab">Wrist (${u})</span>
        <input class="inp" id="m-wr" inputmode="decimal" placeholder="optional" value="${m.wrist||''}"></label>
    </div>
    <button class="btn gold full" onclick="calcRatio()">Analyze</button>
    <div id="ratioOut" class="mt16">${ratioOutHTML(m)}</div>
  </div>`;

  html+=`<div class="shead"><h2>Track your progress</h2><button class="link" onclick="openLogMeasure()">+ Log</button></div>`;
  if(!state.measures.length){
    html+=`<div class="card"><div class="empty">No measurements yet.<br><button class="btn gold sm mt12" onclick="openLogMeasure()">Log your first entry</button></div></div>`;
  } else {
    html+=`<div class="card chartcard">
      <div class="seg" id="chartSeg" style="margin-bottom:14px">
        <button class="on" onclick="chartMetric('bw',this)">Weight</button>
        <button onclick="chartMetric('waist',this)">Waist</button>
        <button onclick="chartMetric('shoulders',this)">Shoulders</button>
      </div>
      <div id="chartHost"></div>
    </div>`;
    html+=`<div class="card"><div class="sec-h" style="margin-top:0">History</div>`;
    [...state.measures].reverse().forEach((e,idx)=>{
      html+=`<div class="row between" style="padding:11px 0;border-bottom:1px solid var(--line)">
        <div><b style="font-size:14px">${new Date(e.date).toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'})}</b>
        <div class="tiny mut2 mt8" style="margin-top:3px">${[e.bw&&`${e.bw} ${u}`,e.waist&&`waist ${e.waist}`,e.shoulders&&`sh ${e.shoulders}`,e.chest&&`ch ${e.chest}`,e.arms&&`arm ${e.arms}`].filter(Boolean).join(" · ")}</div></div>
        <button class="iconbtn" onclick="delMeasure(${state.measures.length-1-idx})"><svg viewBox="0 0 24 24"><path d="M5 7h14M9 7V5h6v2M7 7l1 13h8l1-13"/></svg></button>
      </div>`;
    });
    html+=`</div>`;
  }
  return html;
}
function lastMeasure(){ return state.measures.length ? state.measures[state.measures.length-1] : {}; }
function ratioOutHTML(m){
  if(!m.shoulders||!m.waist) return `<p class="tiny mut2">Enter shoulders and waist, then tap Analyze.</p>`;
  const sw=m.shoulders/m.waist;
  const swPct=Math.min(100, (sw/1.618)*100);
  let rating = sw>=1.6?"Golden ✦":sw>=1.5?"Strong V-taper":sw>=1.4?"Good base":"Building";
  let out=`<div class="gauge">
    <div class="gt"><b>Shoulder : Waist</b><span class="gv">${sw.toFixed(2)} · ${rating}</span></div>
    <div class="gtrack"><div class="gfill" style="width:${swPct}%"></div><div class="gmark" style="left:100%"></div></div>
    <div class="gnote">Ideal: 1.618 (golden ratio). The mark on the right is the target.</div>
  </div>`;
  // ideal shoulders for current waist
  const idealSh=(m.waist*1.618).toFixed(1);
  out+=`<div class="note">To hit the golden ratio at your current waist, aim for shoulders of about <b>${idealSh} ${state.unit}</b>${sw<1.618?` — that's <b>${(m.waist*1.618-m.shoulders).toFixed(1)} ${state.unit}</b> more.`:` — you're there. ✦`}</div>`;
  if(m.height){
    const wh=m.waist/m.height; const whPct=Math.min(100,(0.46/wh)*100);
    out+=`<div class="gauge"><div class="gt"><b>Waist : Height</b><span class="gv">${wh.toFixed(2)}</span></div>
      <div class="gtrack"><div class="gfill" style="width:${Math.min(100,(wh/0.46)*100>100?100:(wh<=0.46?100:0.46/wh*100))}%"></div></div>
      <div class="gnote">Aesthetic target ≈ 0.45–0.47. Yours: ${wh.toFixed(2)} ${wh<=0.47?'✓ in range':'— leaning out lowers this'}.</div></div>`;
  }
  if(m.wrist){
    out+=`<div class="sec-h">Wrist-based targets (classic proportions)</div>
    <ul class="cuelist"><li><b>Flexed arm:</b> ~${(m.wrist*2.5).toFixed(1)} ${state.unit} (2.5× wrist)</li>
    <li><b>Waist:</b> a lean waist is roughly the ideal — keep it tight</li></ul>`;
  }
  return out;
}
function calcRatio(){
  const m={shoulders:pf("m-sh"),waist:pf("m-wa"),height:pf("m-ht"),wrist:pf("m-wr")};
  // stash into a transient last for display (not the log)
  state._ratio=m; $("ratioOut").innerHTML=ratioOutHTML(m);
}
function pf(id){ const v=parseFloat(($(id)||{}).value); return isNaN(v)?null:v; }

function openLogMeasure(){
  const u=state.unit;
  openSheet(`<h2 class="serif" style="font-size:22px">Log measurements</h2>
    <p class="small muted mt8">Fill in what you can — even just weight is useful for the chart.</p>
    <div class="row gap10 mt16">
      <label class="field" style="flex:1"><span class="lab">Weight (${u})</span><input class="inp" id="lg-bw" inputmode="decimal" value="${state.bw||''}"></label>
      <label class="field" style="flex:1"><span class="lab">Waist (${u})</span><input class="inp" id="lg-wa" inputmode="decimal"></label>
    </div>
    <div class="row gap10">
      <label class="field" style="flex:1"><span class="lab">Shoulders (${u})</span><input class="inp" id="lg-sh" inputmode="decimal"></label>
      <label class="field" style="flex:1"><span class="lab">Chest (${u})</span><input class="inp" id="lg-ch" inputmode="decimal"></label>
    </div>
    <label class="field"><span class="lab">Arm (flexed, ${u})</span><input class="inp" id="lg-ar" inputmode="decimal"></label>
    <button class="btn gold full mt8" onclick="saveMeasure()">Save entry</button>
    <button class="btn full" style="margin-top:8px" onclick="closeSheet()">Cancel</button>`);
}
function saveMeasure(){
  const e={date:Date.now(), bw:pf("lg-bw"), waist:pf("lg-wa"), shoulders:pf("lg-sh"), chest:pf("lg-ch"), arms:pf("lg-ar")};
  if(!e.bw&&!e.waist&&!e.shoulders&&!e.chest&&!e.arms){ return toast("Enter at least one value"); }
  if(e.bw) state.bw=e.bw;
  state.measures.push(e); save(); closeSheet(); toast("Measurement saved ✓"); render_aesthetic();
}
function delMeasure(i){ state.measures.splice(i,1); save(); render_aesthetic(); }

let chartKey="bw";
function chartMetric(k,btn){ chartKey=k; document.querySelectorAll("#chartSeg button").forEach(b=>b.classList.remove("on")); btn.classList.add("on"); drawChart(); }
function drawChart(){
  const host=$("chartHost"); if(!host) return;
  const pts=state.measures.map(m=>({x:m.date,y:m[chartKey]})).filter(p=>p.y!=null);
  if(pts.length<1){ host.innerHTML=`<div class="empty">No data for this metric yet.</div>`; return; }
  if(pts.length===1){ host.innerHTML=`<div class="empty">${pts[0].y} ${state.unit}<br><span class="tiny mut2">Log another entry to see the trend line.</span></div>`; return; }
  const W=320,H=150,pad=24;
  const xs=pts.map(p=>p.x), ys=pts.map(p=>p.y);
  const minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);
  const rangeY=(maxY-minY)||1;
  const X=x=>pad+((x-minX)/((maxX-minX)||1))*(W-pad*2);
  const Y=y=>H-pad-((y-minY)/rangeY)*(H-pad*2);
  const line=pts.map((p,i)=>`${i?'L':'M'}${X(p.x).toFixed(1)} ${Y(p.y).toFixed(1)}`).join(" ");
  const area=`M${X(pts[0].x).toFixed(1)} ${H-pad} `+pts.map(p=>`L${X(p.x).toFixed(1)} ${Y(p.y).toFixed(1)}`).join(" ")+` L${X(pts[pts.length-1].x).toFixed(1)} ${H-pad} Z`;
  const dots=pts.map(p=>`<circle class="dot" cx="${X(p.x).toFixed(1)}" cy="${Y(p.y).toFixed(1)}" r="3.5"/>`).join("");
  const first=pts[0].y, last=pts[pts.length-1].y, delta=(last-first).toFixed(1);
  host.innerHTML=`
    <div class="row between" style="margin-bottom:8px"><span class="tiny mut2">${pts.length} entries</span>
      <span class="tag ${delta<=0&&chartKey!=='shoulders'&&chartKey!=='chest'?'ok':'gold'}">${delta>0?'+':''}${delta} ${state.unit}</span></div>
    <svg class="chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
      <defs><linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#d8b46a55"/><stop offset="1" stop-color="#d8b46a00"/></linearGradient></defs>
      <path class="area" d="${area}"/><path class="line" d="${line}"/>${dots}
      <text class="lbl" x="${pad}" y="${H-6}">${new Date(minX).toLocaleDateString(undefined,{month:'short',day:'numeric'})}</text>
      <text class="lbl" x="${W-pad}" y="${H-6}" text-anchor="end">${new Date(maxX).toLocaleDateString(undefined,{month:'short',day:'numeric'})}</text>
      <text class="lbl" x="${pad}" y="14">${maxY}</text><text class="lbl" x="${pad}" y="${H-pad+2}">${minY}</text>
    </svg>`;
}

/* ----- Academy ----- */
function learnHTML(){
  let html=`<div class="card glass"><div class="eyebrow">Academy</div>
    <h2 class="serif mt8" style="font-size:21px">Know the why</h2>
    <p class="small muted mt8">Short, accurate reads on the principles behind the look. Understand these and you'll never need to buy another program.</p></div>`;
  html+=LEARN.map(a=>`<div class="item tap" onclick="openArticle('${a.id}')">
    <div class="thumb"><svg viewBox="0 0 24 24"><path d="M6 4h9l4 4v12H6z"/><path d="M15 4v4h4M9 13h6M9 16h6"/></svg></div>
    <div style="flex:1"><div class="ex-n" style="font-size:14.5px">${a.title}</div>
    <div class="ex-meta">${a.tag} · ${a.read}</div></div>
    <svg class="chev" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></div>`).join("");
  return html;
}
function openArticle(id){
  const a=LEARN.find(x=>x.id===id);
  openSheet(`<div class="article">
    <div class="eyebrow">${a.tag} · ${a.read}</div>
    <h2 class="serif mt8" style="font-size:26px;line-height:1.1">${a.title}</h2>
    <p class="article-intro mt12">${a.intro}</p>
    ${a.body.map(s=>`<h3>${s.h}</h3><p>${s.p}</p>`).join("")}
    <button class="btn full mt16" onclick="closeSheet()">Done</button>
  </div>`);
}

/* ============================================================
   MOBILITY
   ============================================================ */
function render_mobility(){
  const el=$("v-mobility");
  let html=`<div class="card glass"><div class="eyebrow">Move like an athlete</div>
    <h2 class="serif mt8" style="font-size:21px">Mobile · Flexible · Pliable</h2>
    <p class="small muted mt8">Strength without mobility ages badly. These routines keep your hips, shoulders and spine supple so you stay pain-free, move well, and look relaxed and athletic — not stiff. Breathe slowly into each stretch.</p></div>`;
  [MOBILITY.daily,MOBILITY.warmup,MOBILITY.cooldown].forEach(r=>{
    html+=`<div class="card"><h3 style="font-size:16px">${r.name}</h3>
      <p class="small muted" style="margin:6px 0 14px">${r.blurb}</p>`;
    r.moves.forEach(m=>{ html+=`<div class="ex"><div class="ex-h">
      <div class="thumb"><svg viewBox="0 0 24 24">${FIG.mobility}</svg></div>
      <div style="flex:1"><div class="ex-n" style="font-size:14.5px">${m.n}</div>
      <div class="ex-meta">${m.d}</div></div>
      <span class="tag gold">${m.t}</span></div></div>`; });
    html+=`</div>`;
  });
  el.innerHTML=html+footer();
}

/* ============================================================
   FUEL
   ============================================================ */
function render_fuel(){
  const el=$("v-fuel");
  const bw=state.bw||175, unit=state.unit||"lb", goal=state.goal||"lean";
  const bwLb=unit==="lb"?bw:Math.round(bw*2.205);
  const protein=Math.round(bwLb*0.9);
  const cals=goal==="lean"?Math.round(bwLb*13):goal==="recomp"?Math.round(bwLb*15):Math.round(bwLb*17);
  const fat=Math.round(bwLb*0.4);
  const carbs=Math.max(0,Math.round((cals-(protein*4)-(fat*9))/4));
  const goalText={lean:"a fat-loss cut (~15–20% below maintenance)",recomp:"maintenance — recomposition / lean hold",gain:"a lean gain (~200–300 cal surplus)"}[goal];

  let html=`<div class="card glass"><div class="eyebrow">Get lean, stay lean</div>
    <h2 class="serif mt8" style="font-size:21px">Fuel the look</h2>
    <p class="small muted mt8">The leading-man physique is mostly about being <b style="color:var(--txt)">lean</b> — abs and sharp lines show up around 10–12% body fat. Eat high protein, control total calories, keep food mostly whole. An 8-hour eating window (e.g. noon–8pm) makes calorie control effortless.</p></div>`;

  html+=`<div class="card"><h3 style="font-size:16px;margin-bottom:14px">Your daily targets</h3>
    <div class="row gap10">
      <label class="field" style="flex:1"><span class="lab">Body weight</span>
        <input class="inp" inputmode="decimal" value="${bw}" onchange="setBW(this.value)"></label>
      <label class="field" style="flex:1"><span class="lab">Unit</span>
        <div class="seg" style="margin:0"><button class="${unit==='lb'?'on':''}" onclick="setUnit('lb')">lb</button>
        <button class="${unit==='kg'?'on':''}" onclick="setUnit('kg')">kg</button></div></label>
    </div>
    <span class="lab" style="font-size:12px;color:var(--mut);font-weight:700">Goal</span>
    <div class="seg" style="margin-top:6px">
      <button class="${goal==='lean'?'on':''}" onclick="setGoal('lean')">Cut</button>
      <button class="${goal==='recomp'?'on':''}" onclick="setGoal('recomp')">Maintain</button>
      <button class="${goal==='gain'?'on':''}" onclick="setGoal('gain')">Lean Gain</button>
    </div>
    <div class="statgrid">
      <div class="stat"><b>${cals}</b><span>CALORIES</span></div>
      <div class="stat"><b>${protein}g</b><span>PROTEIN</span></div>
      <div class="stat"><b>${carbs}g</b><span>CARBS</span></div>
    </div>
    <div class="stat mt12"><b>${fat}g</b><span>FATS PER DAY</span></div>
    <p class="tiny mut2 mt12">Set for ${goalText}. Estimates only — adjust by results. If the scale and mirror aren't moving over 2–3 weeks, nudge calories ±10%.</p>
  </div>`;

  html+=`<div class="card"><h3 style="font-size:16px">The 6 rules</h3>
    <ul class="cuelist mt8">
      <li><b>Protein first.</b> ~0.9–1g per lb of bodyweight daily. Builds muscle, kills hunger.</li>
      <li><b>Pick an eating window.</b> An ~8-hour window trims mindless calories. Black coffee, water, tea during the fast.</li>
      <li><b>Mostly whole foods.</b> Meat, eggs, fish, fruit, veg, potatoes, rice, oats, dairy. Leave ~15% room for things you enjoy.</li>
      <li><b>Keep lifting heavy</b> so the weight you lose is fat, not the muscle that creates the shape.</li>
      <li><b>Walk daily.</b> 8–10k steps burns real calories without hurting recovery.</li>
      <li><b>Sleep 7–9 hours.</b> The most underrated fat-loss and muscle tool there is.</li>
    </ul></div>`;

  html+=`<div class="card"><h3 style="font-size:16px">A simple day (≈${cals} cal)</h3>
    <ul class="cuelist mt8">
      <li><b>Break the fast (noon):</b> Greek yogurt, berries, whey — or eggs and fruit. ~40g protein.</li>
      <li><b>Main meal (4pm):</b> Lean meat or fish, rice or potatoes, plenty of veg. ~50g protein.</li>
      <li><b>Dinner (7:30pm):</b> Steak or chicken, big salad, olive oil, a carb if it fits. ~50g protein.</li>
      <li><b>Around training:</b> Most carbs near your workout for energy and recovery.</li>
    </ul>
    <p class="tiny mut2 mt12">Hit your protein and calorie targets and the meal timing barely matters — do what's sustainable for you.</p></div>`;
  return el.innerHTML=html+footer();
}
function setBW(v){ state.bw=parseFloat(v)||0; save(); render_fuel(); }
function setUnit(u){ state.unit=u; save(); render_fuel(); }
function setGoal(g){ state.goal=g; save(); render_fuel(); }

/* ============================================================
   REST TIMER
   ============================================================ */
let restInt=null, restSec=0;
function startRest(str,name){
  const p=str.split(":"); restSec=(+p[0])*60+(+p[1]);
  $("restSub").textContent=name+" — recover, then go again";
  $("rest").classList.add("up"); paintRest(); clearInterval(restInt);
  restInt=setInterval(()=>{ restSec--; paintRest();
    if(restSec<=0){ clearInterval(restInt); buzz(); $("restSub").textContent="Time! Next set 💥";
      setTimeout(()=>$("rest").classList.remove("up"),2800); } },1000);
}
function paintRest(){ const m=Math.floor(Math.max(restSec,0)/60),s=Math.max(restSec,0)%60; $("restTime").textContent=m+":"+String(s).padStart(2,"0"); }
function buzz(){ if(navigator.vibrate) navigator.vibrate([200,100,200]); }

/* ============================================================
   TOAST + FOOTER + INIT
   ============================================================ */
let toastT=null;
function toast(msg){ const t=$("toast"); t.textContent=msg; t.classList.add("on"); clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove("on"),2200); }
function footer(){ return `<div class="foot">LEAD ROLE · an original program built on standard strength-training principles.<br>
  Educational use only — not medical advice. See a doctor before starting any new program.<br>
  <button class="link" style="color:var(--mut2);text-decoration:underline;margin-top:8px" onclick="startOnboarding()">Reset my plan</button></div>`; }

function init(){
  // wire static buttons
  $("restPlus").onclick=()=>{restSec+=15;paintRest();};
  $("restMinus").onclick=()=>{restSec=Math.max(0,restSec-15);paintRest();};
  $("restStop").onclick=()=>{clearInterval(restInt);$("rest").classList.remove("up");};
  $("sheetBg").onclick=closeSheet;
  $("modalBg").onclick=()=>{ if(state.onboarded) $("modal").classList.remove("on"); };
  $("settingsBtn").onclick=startOnboarding;

  go("today");
  if(!state.onboarded) startOnboarding();
  if("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(()=>{});
}
init();
