import { useState, useEffect, useRef } from "react";

const C = { d1:"#022023", d2:"#184647", g:"#2BAC22", gl:"#90DF3E", gr:"#2BAC22", w:"#f5f5f0", ch:"#0a1a1b", tl:"rgba(245,245,240,0.85)", td:"rgba(245,245,240,0.5)" };
const F = "'Montserrat', sans-serif";

const sectorData = {
  "Water Treatment & Desalination": { market:"$14.9B+", countries:["Saudi Arabia","UAE","Egypt","Jordan","Oman","Algeria"], growth:"9.1%", detail:"MEA water treatment reaching $6.2B by 2030. Desalination equipment $8.7B by 2032. Egypt needs to scale from 1.4M to 10M cubic meters/day by 2030." },
  "Renewable Energy & Storage": { market:"$59.9B", countries:["Egypt","Morocco","Saudi Arabia","UAE","Jordan","Mauritania","Oman"], growth:"14.4%", detail:"MENA renewable energy projected at $59.9B by 2030. Egypt leads at $19.8B. $351B cumulative FDI across the Arab region." },
  "Waste Management & Circular Economy": { market:"Growing Fast", countries:["Saudi Arabia","UAE","Egypt","Bahrain","Qatar"], growth:"High", detail:"GCC waste-to-energy protocol signed 2025. Egypt generates 100M+ tons of solid waste annually. 40% landfill diversion target by 2030." },
  "AgTech & Smart Farming": { market:"$1.45B+", countries:["Saudi Arabia","UAE","Egypt","Qatar","Morocco","Jordan"], growth:"17.6%", detail:"Fastest growing AgTech market globally at 17.6% CAGR. 85% of GCC food imported. 1,301 food & ag startups in GCC. $3.8B invested." },
  "Environmental IoT & Monitoring": { market:"$74.6B global", countries:["Saudi Arabia","UAE","Egypt","Jordan","Oman","Qatar"], growth:"7%", detail:"Digital water tech reaching $74.6B globally by 2030. Smart meters, leak detection, SCADA systems in high demand across 22 Arab countries." },
  "Green Hydrogen": { market:"$130B/yr by 2050", countries:["Egypt","Morocco","Oman","Saudi Arabia","Mauritania","UAE"], growth:"Exponential", detail:"MENA forecast to earn $130B annually from clean hydrogen exports by 2050. Egypt targeting 5-8% of global hydrogen trade." },
};

const Flag = ({code,size=20}) => <img src={`https://flagcdn.com/w40/${code}.png`} alt="" style={{width:size,height:Math.round(size*0.75),borderRadius:2,objectFit:"cover"}} />;

const countries = [
  { n:"Egypt",cc:"eg",h:true,gw:"Gateway to North Africa & the Nile Basin",s:"Renewable market $19.8B by 2030. $17.7B water infrastructure plan. $14.7B NWFE climate projects. 42% renewables target. 100M+ tons solid waste annually.",t:["Water","Energy","Waste","AgTech","H₂"] },
  { n:"Jordan",cc:"jo",h:true,gw:"Gateway to the Levant & Eastern Mediterranean",s:"World's 5th most water-scarce country. $3B+ Aqaba-Amman desalination mega-project. 50% renewables target by 2030. $60B Economic Modernization Vision.",t:["Water","Energy","IoT","AgTech"] },
  { n:"Saudi Arabia",cc:"sa",h:true,gw:"Gateway to the GCC & Arabian Peninsula",s:"Green tech market $5.3B→$12.8B by 2030. 50% renewables target. 130 GW renewable capacity planned. NEOM smart city. Vision 2030.",t:["Water","Energy","Waste","AgTech","H₂"] },
  { n:"Morocco",cc:"ma",h:true,gw:"Gateway to the Maghreb & Africa",s:"52% renewables by 2030. $5.6B solar/wind underway. 90% energy imported. Green hydrogen CAPEX $120B+ by 2050. Xlinks UK interconnector.",t:["Energy","H₂","AgTech","Water"] },
  { n:"UAE",cc:"ae",h:false,s:"Net Zero 2050. $40B+ cumulative clean energy. $36B NDC needs. ALTÉRRA $30B climate fund.",t:["Water","Energy","AgTech","IoT","H₂"] },
  { n:"Qatar",cc:"qa",h:false,s:"20% renewables target. 800MW Al Kharsaah solar. Heavy AgTech & alternative protein investment.",t:["Energy","AgTech","Water","IoT"] },
  { n:"Oman",cc:"om",h:false,s:"Net Zero 2050. Green hydrogen hub Duqm & Salalah.",t:["H₂","Energy","Water"] },
  { n:"Bahrain",cc:"bh",h:false,s:"$30B Strategic Projects Plan. Waste-to-energy protocol.",t:["Waste","Energy"] },
  { n:"Kuwait",cc:"kw",h:false,s:"Net Zero 2060. KIA climate integration. RE expansion.",t:["Energy","Water"] },
  { n:"Iraq",cc:"iq",h:false,s:"Top 5 Arab electricity producer. Massive infra gap.",t:["Water","Energy","Waste"] },
  { n:"Algeria",cc:"dz",h:false,s:"Needs 2,700% RE capacity increase. Blue hydrogen pivot.",t:["Energy","H₂","Water"] },
  { n:"Tunisia",cc:"tn",h:false,s:"Growing RE. Water stress. EU green transition programs.",t:["Energy","Water"] },
  { n:"Libya",cc:"ly",h:false,s:"Post-conflict rebuilding. 2,000 MW Egypt interconnection.",t:["Energy","Water"] },
  { n:"Sudan",cc:"sd",h:false,s:"RE resources like Morocco/Egypt but almost entirely undeveloped.",t:["Energy","Water"] },
  { n:"Mauritania",cc:"mr",h:false,s:"Top 5 Arab RE FDI. Green hydrogen & wind frontier.",t:["Energy","H₂"] },
  { n:"Lebanon",cc:"lb",h:false,s:"Acute energy crisis. Decentralized solar growing.",t:["Energy","Water"] },
  { n:"Palestine",cc:"ps",h:false,s:"Top MENA water importer. Solar growing. Water critical.",t:["Water","Energy"] },
  { n:"Yemen",cc:"ye",h:false,s:"Severe water & energy crisis. Off-grid solar opportunity.",t:["Water","Energy"] },
  { n:"Somalia",cc:"so",h:false,s:"Off-grid RE demand. Water purification critical.",t:["Water","Energy"] },
  { n:"Djibouti",cc:"dj",h:false,s:"Red Sea location. Geothermal & solar. Desal needs.",t:["Energy","Water"] },
  { n:"Comoros",cc:"km",h:false,s:"Island nation. Solar & waste needs.",t:["Energy","Waste"] },
  { n:"Syria",cc:"sy",h:false,s:"Post-conflict. Water & energy infrastructure devastated.",t:["Water","Energy"] },
];

const scroll = id => { document.getElementById(id)?.scrollIntoView({ behavior:"smooth" }); };
const Grad = ({children,style={}}) => <span style={{background:`linear-gradient(90deg,${C.gl},${C.gr})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",...style}}>{children}</span>;

function useCountUp(end, duration=2000, startOnView=true) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!startOnView) { setStarted(true); return; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) { setStarted(true); observer.disconnect(); }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started, startOnView]);
  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [started, end, duration]);
  return { count, ref };
}

function AnimNum({value, prefix="", suffix="", duration=2000, style={}}) {
  const num = parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
  const {count, ref} = useCountUp(num, duration);
  const hasDecimal = value.includes('.');
  const display = hasDecimal ? count.toFixed(1) : (num >= 1000 ? count.toLocaleString() : count);
  return <span ref={ref} style={style}>{prefix}{display}{suffix}</span>;
}

/* ========== EDIT 1: HAMBURGER MOBILE MENU ========== */
function Nav({active}) {
  const [sc,setSc]=useState(false);
  const [menuOpen,setMenuOpen]=useState(false);
  useEffect(()=>{const h=()=>setSc(window.scrollY>50);window.addEventListener("scroll",h);return()=>window.removeEventListener("scroll",h)},[]);
  const items=[{id:"hero",l:"Home"},{id:"problem",l:"Problem"},{id:"services",l:"Services"},{id:"tool",l:"Market Fit"},{id:"markets",l:"Markets"},{id:"about",l:"About"},{id:"contact",l:"Contact"}];
  return <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:1000,background:sc||menuOpen?"rgba(2,32,35,0.97)":"transparent",backdropFilter:sc?"blur(20px)":"none",borderBottom:sc?`1px solid rgba(43,172,34,0.1)`:"none",transition:"all .4s",padding:"0 24px"}}>
    <div style={{maxWidth:1200,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",height:68}}>
      <div onClick={()=>scroll("hero")} style={{cursor:"pointer",display:"flex",alignItems:"center"}}>
        <img src="/logo-horizontal.png" alt="GreenTech Bridge Ventures" style={{height:34}} />
      </div>
      {/* Desktop menu */}
      <div className="desktop-nav" style={{display:"flex",gap:2}}>
        {items.map(i=><button key={i.id} onClick={()=>scroll(i.id)} style={{background:active===i.id?"rgba(43,172,34,0.1)":"none",border:"none",color:active===i.id?C.g:C.tl,fontFamily:F,fontSize:11,fontWeight:700,cursor:"pointer",padding:"7px 12px",borderRadius:6,transition:"all .2s",letterSpacing:"0.04em",textTransform:"uppercase"}}>{i.l}</button>)}
      </div>
      {/* Mobile hamburger */}
      <button className="mobile-hamburger" onClick={()=>setMenuOpen(!menuOpen)} style={{display:"none",background:"none",border:"none",cursor:"pointer",padding:8,flexDirection:"column",gap:5,justifyContent:"center"}}>
        <span style={{display:"block",width:24,height:2,background:C.w,borderRadius:2,transition:"all .3s",transform:menuOpen?"rotate(45deg) translate(5px,5px)":"none"}}/>
        <span style={{display:"block",width:24,height:2,background:C.w,borderRadius:2,transition:"all .3s",opacity:menuOpen?0:1}}/>
        <span style={{display:"block",width:24,height:2,background:C.w,borderRadius:2,transition:"all .3s",transform:menuOpen?"rotate(-45deg) translate(5px,-5px)":"none"}}/>
      </button>
    </div>
    {/* Mobile dropdown */}
    {menuOpen && <div className="mobile-menu" style={{display:"none",flexDirection:"column",padding:"8px 0 20px",borderTop:"1px solid rgba(43,172,34,0.1)"}}>
      {items.map(i=><button key={i.id} onClick={()=>{scroll(i.id);setMenuOpen(false);}} style={{background:active===i.id?"rgba(43,172,34,0.08)":"none",border:"none",color:active===i.id?C.g:C.tl,fontFamily:F,fontSize:14,fontWeight:600,cursor:"pointer",padding:"12px 16px",textAlign:"left",borderRadius:6,letterSpacing:"0.02em"}}>{i.l}</button>)}
    </div>}
  </nav>;
}

function Hero() {
  const stats=[{v:250,p:"$",s:"B+",l:"Green infrastructure investment"},{v:351,p:"$",s:"B",l:"Cumulative RE FDI"},{v:85,p:"",s:"%",l:"GCC food imported"},{v:22,p:"",s:"",l:"Arab countries"},{v:31.5,p:"$",s:"B",l:"Annual equipment imports"}];
  return <section id="hero" style={{minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",background:`linear-gradient(165deg,${C.d1} 0%,#011518 40%,${C.d2} 100%)`,position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",top:"-20%",right:"-5%",width:"50vw",height:"50vw",borderRadius:"50%",background:"radial-gradient(circle,rgba(43,172,34,0.05) 0%,transparent 70%)"}}/>
    <div style={{maxWidth:1200,margin:"0 auto",padding:"120px 24px 40px",position:"relative",zIndex:1}}>
      <div style={{display:"inline-block",padding:"6px 18px",borderRadius:20,background:"rgba(43,172,34,0.08)",border:"1px solid rgba(43,172,34,0.2)",fontFamily:F,fontSize:11,fontWeight:700,letterSpacing:"0.1em",marginBottom:28,textTransform:"uppercase"}}><Grad>European CleanTech → Arab Markets</Grad></div>
      <h1 style={{fontFamily:F,fontSize:"clamp(32px,5vw,58px)",fontWeight:800,color:C.w,lineHeight:1.08,marginBottom:24,maxWidth:760,letterSpacing:"-0.03em"}}>The Arab Market Gateway for <Grad>European Green Innovation</Grad></h1>
      <p style={{fontFamily:F,fontSize:15,color:C.tl,lineHeight:1.8,maxWidth:560,marginBottom:40,fontWeight:400}}>Over $250 billion in cumulative green infrastructure investment is flowing into 22 Arab countries. The vast majority of environmental technologies deployed in the region are imported. We are the operational bridge that gets your technology there.</p>
      <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
        <button onClick={()=>scroll("tool")} style={{padding:"15px 32px",background:`linear-gradient(90deg,${C.gl},${C.gr})`,color:C.d1,border:"none",borderRadius:8,fontFamily:F,fontSize:13,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 24px rgba(43,172,34,0.25)"}}>Check Your Market Fit — Free</button>
        <button onClick={()=>scroll("contact")} style={{padding:"15px 32px",background:"transparent",color:C.g,border:`2px solid ${C.g}`,borderRadius:8,fontFamily:F,fontSize:13,fontWeight:700,cursor:"pointer"}}>Book a Strategy Call</button>
      </div>
    </div>
    <div style={{display:"flex",flexWrap:"wrap"}}>
      {stats.map((s,i)=><div key={i} style={{flex:"1 1 180px",padding:"26px 18px",background:i%2===0?C.d2:"rgba(24,70,71,0.5)",textAlign:"center",borderRight:i<4?"1px solid rgba(255,255,255,0.04)":"none"}}>
        <div style={{fontFamily:F,fontSize:24,fontWeight:800,marginBottom:5}}><Grad><AnimNum value={String(s.v)} prefix={s.p} suffix={s.s} duration={2000}/></Grad></div>
        <div style={{fontFamily:F,fontSize:10,color:C.tl,lineHeight:1.5,fontWeight:400}}>{s.l}</div>
      </div>)}
    </div>
  </section>;
}

function Problem() {
  const g=[{t:"The Regulatory Maze",d:"European founders lack local networks and operational partners to navigate procurement and regulation across diverse Arab markets.",i:"🏛️"},{t:"The Climate Mismatch",d:"TRL 9 technology proven in European weather often fails in Arab heat, humidity, and salinity. Without climate adaptation, sales stall.",i:"🌡️"},{t:"The Expansion Dead-End",d:"Without a local operating partner, market entry costs are prohibitive. Most European companies give up within 12 months.",i:"🚧"},{t:"The Operational Vacuum",d:"No local specialized support infrastructure exists to install, maintain, and service European environmental technology on the ground.",i:"⚙️"}];
  return <section id="problem" style={{background:C.ch,padding:"100px 24px"}}>
    <div style={{maxWidth:1200,margin:"0 auto"}}>
      <div style={{fontFamily:F,fontSize:11,fontWeight:700,letterSpacing:"0.12em",marginBottom:12,textTransform:"uppercase"}}><Grad>The Innovation Gap</Grad></div>
      <h2 style={{fontFamily:F,fontSize:"clamp(24px,3.5vw,40px)",fontWeight:800,color:C.w,marginBottom:14,letterSpacing:"-0.02em"}}>Why European Green Tech Stalls at the Border</h2>
      <p style={{fontFamily:F,fontSize:14,color:C.tl,maxWidth:660,lineHeight:1.8,marginBottom:48,fontWeight:400}}>European cleantech companies are ready to export, but the destination isn't ready to receive them. Four structural gaps block the path.</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(255px,1fr))",gap:14}}>
        {g.map((x,i)=><div key={i} style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:12,padding:"28px 22px",borderTop:`3px solid ${C.g}`}}>
          <div style={{fontSize:28,marginBottom:14}}>{x.i}</div>
          <h3 style={{fontFamily:F,fontSize:17,fontWeight:700,color:C.w,marginBottom:8}}>{x.t}</h3>
          <p style={{fontFamily:F,fontSize:12.5,color:C.tl,lineHeight:1.7,fontWeight:400}}>{x.d}</p>
        </div>)}
      </div>
    </div>
  </section>;
}

function Services() {
  const t=[
    {n:"Explorer",tg:"Know your market",tm:"4 weeks",ft:["Market entry brief with target countries","Competitive landscape analysis","Regulatory requirements mapping","Procurement channel identification","1 strategy call with MENA team"],b:"Companies exploring MENA for the first time",p:"Fixed retainer (one-time)"},
    {n:"Accelerator",tg:"Meet your buyers",tm:"8–12 weeks",featured:true,ft:["Everything in Explorer","5–10 curated buyer introductions","Government procurement connections","Local distributor matching","2 facilitated decision-maker meetings"],b:"Companies ready to start buyer conversations",p:"Retainer + success fee"},
    {n:"Full Bridge",tg:"We become your MENA arm",tm:"6–12 months",ft:["Everything in Accelerator","First MENA contract or pilot","On-ground ops (KSA, Jordan, Egypt)","Compliance, logistics & management","Exclusive or semi-exclusive representation"],b:"Companies ready to deploy with a local partner",p:"Retainer + commission + margin"},
  ];
  return <section id="services" style={{background:C.d1,padding:"100px 24px"}}>
    <div style={{maxWidth:1200,margin:"0 auto"}}>
      <div style={{textAlign:"center",marginBottom:48}}>
        <div style={{fontFamily:F,fontSize:11,fontWeight:700,letterSpacing:"0.12em",marginBottom:12,textTransform:"uppercase"}}><Grad>Services</Grad></div>
        <h2 style={{fontFamily:F,fontSize:"clamp(24px,3.5vw,40px)",fontWeight:800,color:C.w,marginBottom:10}}>Three Ways to Cross the Bridge</h2>
        <p style={{fontFamily:F,fontSize:14,color:C.tl,maxWidth:520,margin:"0 auto",lineHeight:1.7,fontWeight:400}}>Whether you're exploring or ready to deploy, we have a path for you.</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(290px,1fr))",gap:14,alignItems:"stretch"}}>
        {t.map((x,i)=><div key={i} style={{background:x.featured?"rgba(43,172,34,0.06)":"rgba(255,255,255,0.02)",border:x.featured?`2px solid ${C.g}`:"1px solid rgba(255,255,255,0.05)",borderRadius:14,padding:"34px 24px",display:"flex",flexDirection:"column",position:"relative"}}>
          {x.featured&&<div style={{position:"absolute",top:-13,left:"50%",transform:"translateX(-50%)",background:`linear-gradient(90deg,${C.gl},${C.gr})`,color:C.d1,padding:"5px 16px",borderRadius:12,fontFamily:F,fontSize:9,fontWeight:800,letterSpacing:"0.08em",textTransform:"uppercase"}}>Most Popular</div>}
          <h3 style={{fontFamily:F,fontSize:22,fontWeight:800,color:C.w,marginBottom:2}}>{x.n}</h3>
          <div style={{fontFamily:F,fontSize:12,color:C.g,fontWeight:600,marginBottom:4}}>{x.tg}</div>
          <div style={{fontFamily:F,fontSize:10,color:C.td,marginBottom:22,fontWeight:500}}>Timeline: {x.tm}</div>
          <div style={{flex:1}}>{x.ft.map((f,j)=><div key={j} style={{display:"flex",gap:7,marginBottom:8}}><span style={{color:C.g,fontSize:12,fontWeight:700,marginTop:2}}>✓</span><span style={{fontFamily:F,fontSize:12.5,color:C.tl,lineHeight:1.5,fontWeight:400}}>{f}</span></div>)}</div>
          <div style={{marginTop:16,padding:"10px 0",borderTop:"1px solid rgba(255,255,255,0.05)"}}>
            <div style={{fontFamily:F,fontSize:10,color:C.td,marginBottom:3,fontWeight:500}}>Best for</div>
            <div style={{fontFamily:F,fontSize:11,color:C.tl,fontWeight:400}}>{x.b}</div>
          </div>
          <div style={{fontFamily:F,fontSize:11,color:C.g,fontWeight:700,marginTop:10}}>{x.p}</div>
          <button onClick={()=>scroll("contact")} style={{marginTop:14,padding:"12px 0",width:"100%",borderRadius:8,background:x.featured?`linear-gradient(90deg,${C.gl},${C.gr})`:"transparent",color:x.featured?C.d1:C.g,border:x.featured?"none":`2px solid ${C.g}`,fontFamily:F,fontSize:12,fontWeight:700,cursor:"pointer"}}>Contact Us for Pricing</button>
        </div>)}
      </div>
    </div>
  </section>;
}

function Tool() {
  const [step,setStep]=useState(0);const [ans,setAns]=useState({});const [res,setRes]=useState(null);
  const qs=[
    {k:"sector",l:"What sector is your technology in?",o:Object.keys(sectorData)},
    {k:"trl",l:"Technology Readiness Level?",o:["TRL 6–7 (Prototype/Demo)","TRL 8 (System complete)","TRL 9 (Proven in operation)","Already commercialized"]},
    {k:"revenue",l:"Annual revenue range?",o:["Pre-revenue","Under €1M","€1M – €5M","€5M – €20M","€20M+"]},
    {k:"mena",l:"Existing MENA presence?",o:["None at all","Some conversations","Active distributor/partner","Operational presence"]},
    {k:"heat",l:"Tested in high-heat (40°C+)?",o:["Yes, fully validated","Partially tested","No, European conditions only"]},
    {k:"water",l:"Requires significant water input?",o:["No water needed","Minimal water","Yes, significant water"]},
    {k:"maint",l:"Requires specialized local maintenance?",o:["Fully remote capable","Some local support","Specialized on-site teams"]},
    {k:"goal",l:"Primary goal for MENA?",o:["Market intelligence only","Finding buyers & partners","First pilot project","Full market entry & distribution"]},
    {k:"time",l:"Timeline for MENA entry?",o:["Exploring (12+ months)","Planning (6–12 months)","Ready now (< 6 months)","Already started"]},
  ];
  function calc(a){let sc=0;const sd=sectorData[a.sector]||{};sc+=({"Water Treatment & Desalination":28,"Renewable Energy & Storage":30,"Waste Management & Circular Economy":22,"AgTech & Smart Farming":26,"Environmental IoT & Monitoring":20,"Green Hydrogen":25})[a.sector]||20;sc+=({"TRL 6–7 (Prototype/Demo)":8,"TRL 8 (System complete)":14,"TRL 9 (Proven in operation)":18,"Already commercialized":20})[a.trl]||10;let cl=0;if(a.heat==="Yes, fully validated")cl+=10;else if(a.heat==="Partially tested")cl+=5;if(a.water==="No water needed")cl+=6;else if(a.water==="Minimal water")cl+=3;if(a.maint==="Fully remote capable")cl+=4;else if(a.maint==="Some local support")cl+=2;sc+=cl;sc+=({"Pre-revenue":3,"Under €1M":6,"€1M – €5M":10,"€5M – €20M":13,"€20M+":15})[a.revenue]||5;const ps=({"None at all":3,"Some conversations":7,"Active distributor/partner":11,"Operational presence":15})[a.mena]||3;const ts=({"Exploring (12+ months)":1,"Planning (6–12 months)":4,"Ready now (< 6 months)":6,"Already started":7})[a.time]||2;const gs=({"Market intelligence only":1,"Finding buyers & partners":3,"First pilot project":5,"Full market entry & distribution":6})[a.goal]||2;sc+=Math.round((ps+ts+gs)/2);sc=Math.min(Math.max(sc,15),97);const tc=(sd.countries||["Saudi Arabia","UAE","Egypt"]).slice(0,3);const ri=[];if(a.heat==="No, European conditions only")ri.push("Climate adaptation required before deployment");if(a.water==="Yes, significant water")ri.push("Water-intensive tech faces constraints in water-scarce markets");if(a.maint==="Specialized on-site teams")ri.push("Local O&M capability will need to be built");if(a.trl?.includes("6–7"))ri.push("Further validation needed before commercial pilots");if(!ri.length)ri.push("Strong profile — focus on speed of market entry");let tier="Explorer";if(a.goal==="Full market entry & distribution"||a.time==="Already started")tier="Full Bridge";else if(a.goal==="Finding buyers & partners"||a.goal==="First pilot project")tier="Accelerator";setRes({sc,tc,m:sd.market||"Growing",g:sd.growth||"High",d:sd.detail||"",ri,tier});}

  if(res){const lev=res.sc>=75?"High Potential":res.sc>=50?"Good Potential":"Early Stage";const lc=res.sc>=75?C.gl:res.sc>=50?C.g:"#fbbf24";
    return <section id="tool" style={{background:`linear-gradient(170deg,${C.d2} 0%,${C.d1} 100%)`,padding:"100px 24px"}}><div style={{maxWidth:720,margin:"0 auto"}}>
      <div style={{textAlign:"center",marginBottom:36}}><div style={{fontFamily:F,fontSize:11,fontWeight:700,letterSpacing:"0.12em",marginBottom:10,textTransform:"uppercase"}}><Grad>Your Results</Grad></div><h2 style={{fontFamily:F,fontSize:34,fontWeight:800,color:C.w}}>MENA Market Fit Score</h2></div>
      <div style={{textAlign:"center",marginBottom:32}}><div style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:150,height:150,borderRadius:"50%",background:`conic-gradient(${lc} ${res.sc*3.6}deg,rgba(255,255,255,0.04) 0deg)`,transition:"background 2s ease",position:"relative"}}><div style={{width:120,height:120,borderRadius:"50%",background:C.d1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"absolute"}}><span style={{fontFamily:F,fontSize:42,fontWeight:800,color:C.w}}><AnimNum value={String(res.sc)} duration={1500}/></span><span style={{fontFamily:F,fontSize:9,fontWeight:700,color:lc,letterSpacing:"0.05em"}}>{lev}</span></div></div></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
        <div style={{background:"rgba(255,255,255,0.02)",borderRadius:10,padding:20,border:"1px solid rgba(255,255,255,0.05)"}}><div style={{fontFamily:F,fontSize:9,color:C.td,letterSpacing:"0.08em",marginBottom:8,fontWeight:700,textTransform:"uppercase"}}>Top Markets</div>{res.tc.map((c,i)=>{const cd=countries.find(x=>x.n===c);return<div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>{cd&&<Flag code={cd.cc} size={20}/>}<span style={{fontFamily:F,fontSize:13,color:C.w,fontWeight:600}}>{c}</span></div>;})}</div>
        <div style={{background:"rgba(255,255,255,0.02)",borderRadius:10,padding:20,border:"1px solid rgba(255,255,255,0.05)"}}><div style={{fontFamily:F,fontSize:9,color:C.td,letterSpacing:"0.08em",marginBottom:8,fontWeight:700,textTransform:"uppercase"}}>Market Size</div><div style={{fontFamily:F,fontSize:26,fontWeight:800,marginBottom:3}}><Grad>{res.m}</Grad></div><div style={{fontFamily:F,fontSize:11,color:C.tl,fontWeight:400}}>Growth: {res.g} CAGR</div></div>
      </div>
      <div style={{background:"rgba(255,255,255,0.02)",borderRadius:10,padding:20,border:"1px solid rgba(255,255,255,0.05)",marginBottom:10}}><div style={{fontFamily:F,fontSize:9,color:C.td,letterSpacing:"0.08em",marginBottom:6,fontWeight:700,textTransform:"uppercase"}}>Market Insight</div><p style={{fontFamily:F,fontSize:12,color:C.tl,lineHeight:1.7,fontWeight:400}}>{res.d}</p></div>
      <div style={{background:"rgba(255,255,255,0.02)",borderRadius:10,padding:20,border:"1px solid rgba(255,255,255,0.05)",marginBottom:10}}><div style={{fontFamily:F,fontSize:9,color:C.td,letterSpacing:"0.08em",marginBottom:6,fontWeight:700,textTransform:"uppercase"}}>Key Risks</div>{res.ri.map((r,i)=><div key={i} style={{display:"flex",gap:6,marginBottom:4}}><span style={{color:"#fbbf24",fontSize:10,marginTop:2}}>⚠</span><span style={{fontFamily:F,fontSize:11,color:C.tl,fontWeight:400}}>{r}</span></div>)}</div>
      <div style={{background:"rgba(43,172,34,0.06)",borderRadius:10,padding:20,border:`1px solid rgba(43,172,34,0.15)`,marginBottom:24,textAlign:"center"}}><div style={{fontFamily:F,fontSize:9,color:C.td,letterSpacing:"0.08em",marginBottom:5,fontWeight:700,textTransform:"uppercase"}}>Recommended Service</div><div style={{fontFamily:F,fontSize:22,fontWeight:800}}><Grad>{res.tier}</Grad></div></div>
      <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}><button onClick={()=>scroll("contact")} style={{padding:"13px 28px",background:`linear-gradient(90deg,${C.gl},${C.gr})`,color:C.d1,border:"none",borderRadius:8,fontFamily:F,fontSize:13,fontWeight:700,cursor:"pointer"}}>Book a Free Strategy Call</button><button onClick={()=>{setRes(null);setStep(0);setAns({})}} style={{padding:"13px 28px",background:"transparent",color:C.g,border:`2px solid ${C.g}`,borderRadius:8,fontFamily:F,fontSize:13,fontWeight:700,cursor:"pointer"}}>Retake</button></div>
    </div></section>;}

  const q=qs[step];
  return <section id="tool" style={{background:`linear-gradient(170deg,${C.d2} 0%,${C.d1} 100%)`,padding:"100px 24px"}}><div style={{maxWidth:620,margin:"0 auto"}}>
    <div style={{textAlign:"center",marginBottom:40}}><div style={{fontFamily:F,fontSize:11,fontWeight:700,letterSpacing:"0.12em",marginBottom:10,textTransform:"uppercase"}}><Grad>Free Assessment</Grad></div><h2 style={{fontFamily:F,fontSize:"clamp(24px,3.5vw,36px)",fontWeight:800,color:C.w,marginBottom:6}}>MENA Market Fit Score</h2><p style={{fontFamily:F,fontSize:13,color:C.tl,fontWeight:400}}>Answer {qs.length} questions to discover your potential in the Arab market</p></div>
    <div style={{display:"flex",gap:3,marginBottom:24}}>{qs.map((_,i)=><div key={i} style={{flex:1,height:4,borderRadius:2,background:i<=step?`linear-gradient(90deg,${C.gl},${C.gr})`:"rgba(255,255,255,0.07)",transition:"all .3s"}}/>)}</div>
    <div style={{fontFamily:F,fontSize:10,color:C.td,marginBottom:6,fontWeight:600}}>Question {step+1} of {qs.length}</div>
    <h3 style={{fontFamily:F,fontSize:18,fontWeight:700,color:C.w,marginBottom:18}}>{q.l}</h3>
    <div style={{display:"flex",flexDirection:"column",gap:7}}>{q.o.map((opt,i)=><button key={i} onClick={()=>{const na={...ans,[q.k]:opt};setAns(na);if(step<qs.length-1)setStep(step+1);else setTimeout(()=>calc(na),50);}} style={{padding:"14px 16px",background:ans[q.k]===opt?"rgba(43,172,34,0.1)":"rgba(255,255,255,0.02)",border:ans[q.k]===opt?`1px solid ${C.g}`:"1px solid rgba(255,255,255,0.06)",borderRadius:9,cursor:"pointer",textAlign:"left",fontFamily:F,fontSize:13,color:C.w,fontWeight:500,transition:"all .2s"}}>{opt}</button>)}</div>
    {step>0&&<button onClick={()=>setStep(step-1)} style={{marginTop:14,padding:"6px 14px",background:"none",border:"none",color:C.td,fontFamily:F,fontSize:11,cursor:"pointer",fontWeight:600}}>← Back</button>}
  </div></section>;
}

function Markets() {
  const [sel,setSel]=useState(null);
  const selected = sel ? countries.find(c=>c.n===sel) : null;

  const arabMapPaths = {
  "Algeria": {d:"M0,600L124.2,153.7L124.3,138.5L142.0,130.7L153.0,129.1L162.0,126.3L166.2,121.0L179.0,116.9L179.5,109.1L185.8,108.2L190.8,104.3L205.1,102.5L207.2,98.4L204.3,96.2L200.5,85.1L199.8,78.7L195.7,71.9L206.3,66.2L218.1,64.3L225.0,60.0L235.6,56.8L254.2,54.9L272.4,54.1L277.9,55.6L288.2,51.5L300.0,51.4L304.4,53.8L312.0,53.2L0,600L312.0,53.2L327.1,132.4L327.7,137.3L325.8,145.8L326.6,150.7L325.2,156.4L326.1,163.0L321.8,167.4L328.3,175.1L328.7,179.6L332.6,185.5L337.8,183.5L346.4,188.4L351.2,195.0L0,600L351.2,195.0L0,600L266.4,240.5L165.5,179.2Z",cx:173.4,cy:128.1},
  "Djibouti": {d:"M0,600L684.4,310.1L694.9,311.7L694.6,316.0L688.3,318.6L693.1,321.4L689.0,327.1L0,600L689.0,327.1Z",cx:537.0,cy:381.3},
  "Egypt": {d:"M0,600L624.1,210.5L493.9,171.8L493.9,134.3L490.6,125.9L493.4,119.4L491.7,114.8L495.7,109.8L510.3,109.6L520.9,112.4L531.8,115.5L536.9,117.2L545.3,113.8L549.8,110.8L559.5,109.9L567.3,111.3L570.3,116.5L572.9,113.0L581.6,115.5L590.2,116.1L595.6,113.5L0,600L595.6,113.5L599.7,135.8L597.4,143.7L594.4,149.2L591.8,151.1L588.1,147.7L583.2,143.0L575.4,127.9L574.2,128.8L578.8,140.0L585.5,150.5L593.8,166.9L597.9,172.6L601.4,178.6L611.3,190.2L609.1,192.1L609.4,198.9L622.2,208.4L624.1,210.5Z",cx:511.0,cy:147.4},
  "Iraq": {d:"M0,600L649.7,103.6L669.6,79.8L673.7,67.1L672.7,59.4L678.7,56.8L684.3,50.2L689.0,48.6L701.8,49.9L705.7,52.6L710.9,50.8L718.0,63.4L725.2,66.5L726.0,72.7L720.6,76.3L718.0,84.5L725.6,94.6L739.0,100.3L744.7,108.3L742.9,116.0L746.4,116.0L746.5,121.5L752.6,127.1L746.1,126.6L0,600L746.1,126.6L710.2,135.0L679.3,113.8L662.9,106.4L649.7,103.6Z",cx:669.8,cy:100.1},
  "Jordan": {d:"M0,600L609.6,101.1L623.8,102.0L645.3,90.7L649.7,103.6L647.6,105.2L625.6,110.4L636.6,121.0L633.0,122.8L631.1,126.3L622.8,127.7L620.2,131.5L615.4,134.8L603.2,133.1L602.8,131.6L0,600L602.8,131.6L0,600L608.0,110.6Z",cx:525.1,cy:193.9},
  "Kuwait": {d:"M746.1,126.6L748.4,131.2L747.4,133.6L750.9,141.6L743.2,141.8L740.4,136.8L730.6,135.8L738.7,125.7L746.1,126.6Z",cx:743.5,cy:133.3},
  "Lebanon": {d:"M0,600L612.7,91.8L609.0,85.2L614.4,77.8L614.6,77.4L619.6,78.0L621.3,82.1L615.4,86.1L612.7,91.8Z",cx:546.6,cy:141.1},
  "Libya": {d:"M0,600L493.9,210.5L0,600L481.1,236.0L0,600L382.5,201.4L0,600L351.2,195.0L0,600L323.6,123.1L358.5,96.9L363.1,96.0L372.3,97.8L386.8,102.5L392.0,111.8L401.8,113.9L417.3,118.3L429.0,123.5L434.4,120.8L439.6,115.9L437.0,107.9L440.5,102.8L448.4,97.8L456.0,96.4L470.8,98.5L474.5,103.2L478.7,103.3L482.1,105.1L493.0,106.3L495.7,109.8L0,600L495.7,109.8Z",cx:301.4,cy:253.2},
  "Mauritania": {d:"M0,600L32.2,221.1L165.5,179.2L0,600L165.5,179.2L0,600L85.9,288.2L37.9,266.6L40.9,261.4L42.3,251.5L41.1,241.1L39.7,235.9L40.9,230.6L38.0,225.6L32.2,221.1Z",cx:50.8,cy:306.8},
  "Morocco": {d:"M0,600L195.7,71.9L0,600L124.4,151.0L33.2,211.7L37.4,208.9L41.0,203.4L40.3,199.8L44.1,192.4L50.2,185.7L53.9,184.0L56.8,177.9L57.1,172.3L61.0,165.7L68.3,161.9L75.3,151.2L81.0,147.0L91.2,145.8L99.8,138.6L105.4,135.8L114.5,127.0L111.8,113.9L116.0,104.9L117.4,99.3L124.5,92.2L135.5,87.4L143.6,83.0L151.0,72.1L154.4,65.7L162.5,65.7L169.1,70.2L179.5,69.5L190.9,71.8L195.7,71.9Z",cx:65.8,cy:210.2},
  "Oman": {d:"M0,600L825.5,203.1L843.4,186.9L849.6,190.7L857.6,192.1L864.1,194.0L869.0,200.1L872.0,203.6L876.0,204.9L875.9,207.3L871.9,213.5L870.2,216.5L865.6,219.9L861.5,227.1L856.5,226.5L854.2,229.0L852.4,234.4L853.8,241.4L852.8,242.7L847.7,242.6L840.8,246.6L839.8,251.7L837.3,253.9L830.4,253.9L826.1,256.5L826.2,260.7L820.9,263.7L814.8,262.7L807.5,266.2L802.4,266.8L798.8,259.5L790.3,242.1L823.2,231.6L830.5,210.5L825.5,203.1Z M0,600L837.0,171.4L838.1,164.3L839.5,165.2L838.5,169.5L837.0,171.4Z",cx:816.0,cy:233.8},
  "Palestine": {d:"M0,600L608.0,110.6L609.6,107.6L608.0,110.6Z",cx:456.4,cy:232.2},
  "Qatar": {d:"M777.2,181.5L776.5,173.9L779.4,168.4L782.4,167.2L785.7,170.5L785.9,176.7L783.5,182.9L780.5,183.6L777.2,181.5Z",cx:780.9,cy:176.2},
  "Saudi Arabia": {d:"M0,600L603.2,133.1L0,600L649.7,103.6L0,600L730.6,135.8L755.2,150.6L760.6,153.0L762.5,156.7L770.0,161.2L770.6,165.5L769.5,169.0L770.9,172.6L774.1,175.5L775.6,179.0L777.2,181.5L0,600L777.2,181.5L785.6,186.9L0,600L785.6,186.9L0,600L825.5,203.1L0,600L790.3,242.1L687.6,265.5L684.3,262.4L683.4,258.2L677.8,254.4L672.0,245.6L668.8,237.0L661.2,229.7L656.3,228.0L649.1,218.0L647.8,210.7L648.3,204.4L642.0,192.8L636.9,188.6L630.9,186.5L627.3,180.4L627.9,178.1L624.9,172.6L621.7,170.3L617.4,162.4L610.7,153.9L605.1,146.7L599.6,146.8L601.3,141.0L601.8,137.3L603.2,133.1Z",cx:561.6,cy:270.3},
  "Somalia": {d:"M675.9,459.8L669.4,451.1L669.3,412.8L678.9,400.9L681.9,397.5L688.9,397.3L698.7,389.9L713.0,389.5L744.0,357.9L751.7,349.1L756.6,342.6L756.6,337.1L756.6,326.5L756.7,322.2L760.3,321.8L765.3,320.2L771.1,319.2L776.3,315.6L780.5,315.5L780.7,318.4L779.7,324.6L779.8,330.1L777.4,333.9L774.4,345.3L769.1,357.0L762.3,370.5L752.9,385.9L743.5,397.7L730.6,412.0L719.6,420.6L703.2,431.0L693.0,439.0L681.0,451.8L678.4,457.3L675.9,459.8Z",cx:731.6,cy:362.2},
  "Sudan": {d:"M489.2,355.5L480.8,350.9L477.0,347.9L476.3,344.6L478.1,340.2L478.0,335.9L471.7,329.3L470.5,324.8L470.6,322.3L466.6,319.2L466.4,313.1L464.2,309.0L460.3,309.6L461.4,305.7L464.2,301.3L463.0,297.0L466.6,293.8L464.3,291.3L467.2,284.8L472.2,277.0L481.7,277.8L481.1,236.0L481.3,231.6L493.9,231.5L493.9,210.5L538.0,210.5L580.6,210.5L624.1,210.5L627.7,220.9L625.3,222.8L626.9,233.6L630.9,246.2L635.1,248.8L641.1,252.7L635.5,258.7L627.5,260.4L624.0,263.6L622.9,270.6L618.2,286.1L619.4,290.3L617.6,299.3L613.2,309.7L606.5,314.9L601.8,323.0L600.7,327.3L595.5,330.2L592.3,341.2L592.4,350.7L592.3,342.5L590.8,342.3L591.0,337.0L589.6,333.4L584.0,329.3L582.7,321.7L584.0,313.9L578.9,313.2L578.1,315.5L571.5,316.1L574.2,319.1L575.1,325.5L569.1,331.2L563.6,338.8L558.0,339.9L548.8,333.8L544.6,335.9L543.5,339.0L537.8,341.0L537.5,343.2L526.5,343.2L525.0,341.0L517.1,340.7L513.2,342.5L510.1,341.5L504.5,335.4L502.6,332.5L494.7,334.0L491.7,338.8L488.8,348.2L485.1,350.2L481.7,351.4L489.2,355.5Z",cx:470.4,cy:317.7},
  "Syria": {d:"M0,600L611.6,97.8L0,600L612.7,91.8L613.6,69.4L616.3,65.0L619.2,62.7L622.2,60.4L622.8,54.6L626.4,56.6L638.4,53.7L644.3,55.7L653.3,55.6L665.9,51.7L671.8,51.8L684.3,50.2L0,600L684.3,50.2L0,600L645.3,90.7Z",cx:511.6,cy:170.9},
  "Tunisia": {d:"M323.6,123.1L318.9,104.2L312.1,99.9L312.0,97.4L303.1,91.1L302.1,83.2L308.9,77.3L311.4,68.6L309.7,58.6L312.0,53.2L323.9,48.9L331.6,50.2L331.2,55.5L340.6,51.7L341.3,53.7L335.9,58.9L335.8,63.7L339.6,66.3L338.1,75.4L330.9,80.7L333.0,86.5L338.7,86.6L341.4,91.7L345.6,93.3L345.0,101.4L339.7,104.4L336.3,107.8L328.7,111.8L329.9,116.2L328.9,120.6L323.6,123.1Z",cx:323.1,cy:73.1},
  "UAE": {d:"M785.6,186.9L787.6,186.4L788.0,189.3L796.6,187.6L805.7,187.9L812.3,188.2L819.8,181.1L828.0,174.3L834.9,167.8L837.0,171.4L838.5,179.7L832.9,179.8L832.0,186.6L834.0,188.1L829.0,190.2L828.9,194.5L825.7,198.8L825.5,203.1L823.2,205.3L790.3,200.0L786.1,189.3L785.6,186.9Z",cx:817.8,cy:187.3},
  "Yemen": {d:"M0,600L790.3,242.1L794.5,269.7L792.3,274.3L792.1,277.9L781.2,282.4L763.6,287.3L753.8,294.7L749.0,295.3L745.7,294.7L739.2,299.0L732.2,301.1L723.0,301.6L720.3,302.2L717.9,305.0L715.0,305.8L713.3,308.4L707.9,308.2L704.4,309.6L696.8,309.1L693.9,302.9L694.2,297.2L692.4,294.1L690.3,286.3L687.1,282.0L689.3,281.4L688.2,276.6L689.5,274.6L689.1,270.0L693.8,266.7L692.7,262.2L695.7,257.1L700.2,259.8L703.1,258.8L715.8,258.6L717.8,259.6L728.4,260.7L732.6,260.2L735.4,263.7L740.5,261.9L748.4,250.9L758.6,246.1L790.3,242.1Z",cx:706.6,cy:308.4},
  "Bahrain": {d:"M771.8,164.4L775.8,164.4L775.8,170.4L771.8,170.4Z",cx:773.8,cy:167.4},
  "Comoros": {d:"M702.7,568.5L708.7,568.5L708.7,572.5L702.7,572.5Z",cx:705.7,cy:570.5},
};

const neighborPaths = [
  "M249.0,376.2L240.0,377.4L237.3,370.2L237.8,346.0L235.6,343.8L235.1,338.7L231.3,335.0L228.0,331.9L229.4,326.3L233.2,325.2L235.4,320.6L240.8,319.6L243.2,316.4L246.8,313.3L250.8,313.3L259.2,319.4L258.7,322.9L261.2,329.1L259.0,333.3L260.2,336.2L254.9,342.7L251.5,345.9L249.4,352.6L249.7,359.3L249.0,376.2Z",
  "M0,600L160.2,332.9L0,600L223.6,285.0L0,600L243.2,316.4L229.4,326.3L0,600L219.8,326.1L0,600L188.5,340.6Z",
  "M0,600L378.6,306.7L381.7,374.6L379.0,376.6L378.2,384.7L379.3,389.1L378.4,392.3L383.6,397.8L384.5,401.6L388.6,407.0L393.6,410.4L394.1,415.2L395.2,418.2L394.5,423.9L385.8,421.4L376.9,418.7L363.0,418.2L361.7,417.7L355.2,419.0L348.5,417.6L343.3,418.3L325.4,418.1L327.0,409.8L322.7,402.8L317.7,401.0L315.5,396.3L312.7,394.8L312.8,391.9L0,600L312.8,391.9L0,600L375.2,310.7Z",
  "M0,600L519.9,387.0L415.0,404.6L407.6,402.9L401.0,408.4L395.2,418.2L0,600L395.2,418.2L0,600L387.2,364.0L0,600L470.5,324.8L495.2,359.7L495.3,363.2L502.6,368.6L507.2,373.2L510.0,379.5L518.2,383.7L519.9,387.0Z",
  "M0,600L481.1,236.0L463.5,326.6L458.0,330.9L450.0,342.4L439.7,347.2L429.1,346.6L426.0,347.5L427.1,351.3L421.4,354.9L416.7,359.0L402.9,363.1L400.1,360.7L398.3,360.5L396.3,363.2L387.2,364.0L388.9,361.1L385.5,353.9L383.9,349.5L379.2,347.7L372.7,341.6L375.1,336.6L380.1,337.7L383.2,336.9L389.3,337.0L383.3,327.5L383.7,320.5L383.0,313.5L378.6,306.7L379.7,301.8L372.7,301.5L372.7,294.8L368.1,290.9L372.9,277.0L386.9,267.1L387.5,253.4L391.7,232.0L394.1,227.5L389.5,223.9L389.3,220.5L385.2,217.8L382.5,201.4L393.6,195.7L437.4,215.8L481.1,236.0Z",
  "M0,600L578.8,72.2L592.7,73.9L581.5,78.2L576.1,76.8L573.6,72.6L578.8,72.2Z",
  "M0,600L541.5,489.5L552.6,528.8L537.8,530.6L534.9,531.9L531.8,538.6L534.2,543.2L532.3,555.7L530.9,566.2L533.9,568.1L541.6,572.2L544.6,570.3L545.5,581.7L537.1,581.6L532.6,575.8L528.5,571.3L520.1,569.8L517.7,564.3L510.9,567.6L502.2,566.2L498.5,561.4L491.5,560.4L486.4,560.7L485.8,557.4L482.0,557.1L477.0,556.5L470.2,558.1L465.4,557.8L462.7,558.8L463.3,546.3L459.6,542.4L458.8,535.9L460.4,529.5L458.2,525.5L458.0,518.9L444.7,518.9L445.6,515.1L440.0,515.2L439.4,517.0L432.6,517.4L429.9,523.6L428.2,526.2L422.2,524.7L418.6,526.2L411.3,527.0L407.1,521.5L404.6,518.1L401.4,511.8L398.7,504.0L366.3,503.8L362.4,505.1L359.3,504.9L354.7,506.3L353.2,503.0L356.0,501.9L356.4,497.3L358.1,494.6L362.1,492.4L365.0,493.5L368.8,489.5L374.8,489.6L375.4,492.6L379.6,494.4L386.0,487.8L392.4,482.7L395.2,479.3L394.8,470.7L399.6,460.4L404.6,455.0L411.8,449.9L413.1,446.6L413.4,442.7L415.2,439.1L414.6,433.1L415.9,423.8L418.1,417.2L421.4,411.6L422.0,405.2L423.0,397.9L427.3,392.5L433.2,389.1L442.2,392.7L449.2,396.6L457.2,397.6L465.4,399.7L468.7,393.3L470.2,392.5L475.2,393.6L487.4,388.3L491.8,390.6L495.3,390.2L496.9,387.7L501.1,386.8L509.3,387.9L516.4,388.1L519.9,387.0L526.6,395.7L531.5,397.0L534.5,395.2L539.5,395.9L545.7,393.7L548.3,398.2L557.9,405.2L557.3,417.5L561.7,418.9L558.2,422.6L553.9,425.4L549.7,430.9L547.4,435.8L546.8,444.3L544.2,448.3L544.2,456.2L541.0,459.2L540.6,465.4L539.1,466.2L538.1,472.0L540.8,476.8L541.5,489.5Z",
  "M0,600L619.4,290.3L647.5,264.8L650.5,274.5L656.5,279.6L671.5,289.6L677.6,295.6L683.5,301.6L687.0,305.3L692.3,308.4L689.1,311.0L684.4,310.1L680.6,306.7L676.1,300.5L671.2,297.1L668.4,293.5L658.8,289.3L651.3,289.1L648.6,286.9L642.2,289.4L635.6,284.6L632.1,292.5L619.4,290.3Z",
  "M0,600L744.0,357.9L0,600L678.9,400.9L600.4,372.7L595.4,370.2L593.5,366.0L587.9,360.9L581.2,360.2L584.9,354.2L590.8,353.9L592.4,350.7L0,600L592.4,350.7L0,600L619.4,290.3L680.5,314.7L676.8,319.7L677.6,322.6L677.8,325.8L683.9,326.0L686.6,325.2L689.0,327.1L686.6,330.8L690.7,336.6L694.7,341.7L698.9,345.4L734.8,357.9L744.0,357.9Z",
  "M0,600L0,398.4L0,600L0,417.8L0,382.7L0,385.2L0,394.0L0,398.4Z M287.4,0L292.6,0L308.4,0L302.9,0L301.5,0L298.4,0L293.5,0L293.8,0L285.8,0L290.9,0L294.6,0L294.2,0L297.4,0L293.6,0L296.4,0L302.4,0L301.1,0L291.2,0L269.5,0L253.6,0L252.3,0L239.6,0L227.2,0L223.2,0L203.0,0L198.6,0L204.3,0L206.4,0L195.1,0L187.0,0L170.2,0L169.1,0L183.3,0L201.8,0L198.3,0L208.7,0L234.2,0L237.5,0L247.1,0L248.7,0L253.8,0L258.9,0L266.6,0L272.2,0L281.8,0L284.3,0L287.4,0Z M315.5,0L322.6,0L324.4,0L320.8,6.5L315.8,4.4L313.3,0L315.5,0Z",
  "M508.1,70.5L506.7,73.6L490.9,74.5L491.0,72.8L477.6,70.7L479.6,66.3L485.6,69.8L494.2,69.2L502.4,70.0L502.1,71.8L508.1,70.5Z M0,600L471.4,7.0L511.5,4.6L508.1,11.2L505.5,12.4L498.8,12.1L493.1,11.1L479.8,13.8L487.4,19.7L481.8,21.5L475.7,21.5L469.9,16.0L467.9,18.4L470.3,24.6L475.8,29.6L471.7,31.9L477.8,36.7L483.2,39.8L483.4,45.7L473.2,42.9L476.4,48.3L469.5,49.4L473.6,58.7L466.4,58.9L457.4,54.3L453.2,45.8L451.3,38.8L447.0,34.0L441.4,28.0L440.7,25.0L445.8,19.9L446.4,16.5L450.0,15.0L450.2,12.2L457.4,11.2L461.6,8.9L467.5,9.2L469.3,7.3L471.4,7.0Z",
  "M0,600L752.6,127.1L704.9,42.4L707.1,39.1L703.6,27.1L711.1,24.1L712.9,28.0L718.5,32.9L726.0,34.3L730.0,34.0L742.9,26.2L747.0,25.4L750.2,28.5L746.5,33.7L753.3,39.3L756.0,38.7L759.5,46.5L769.9,48.7L777.5,54.0L793.1,55.8L810.3,53.0L811.4,50.5L0,600L811.4,50.5L0,600L891.3,66.9L0,600L887.7,128.1L873.8,174.9L861.8,172.5L849.5,171.2L844.8,158.2L839.6,156.4L831.1,158.3L820.0,163.4L806.6,159.9L795.5,151.8L785.0,148.8L777.6,138.8L769.5,124.8L763.7,126.5L756.7,123.0L752.6,127.1Z",
  "M611.6,97.8L609.6,101.1L605.7,99.7L603.4,106.7L606.1,107.8L603.3,109.3L602.8,112.1L608.0,110.6L608.3,114.7L602.8,131.6L601.7,128.8L595.6,113.5L598.8,110.0L598.0,109.4L600.9,104.5L603.2,96.5L604.7,93.9L605.1,93.8L608.7,93.8L609.7,92.0L612.7,91.8L612.8,96.1L611.3,97.7L611.6,97.8Z",
  "M0,600L334.1,0L369.8,0L372.5,0L363.8,0L354.8,0L355.4,0L354.1,0L357.7,0L368.0,0L373.5,0L385.7,0.5L394.3,0.4L397.0,2.7L393.9,4.8L403.7,8.6L411.8,11.8L421.2,17.3L422.4,19.3L420.3,23.0L414.2,18.1L404.6,16.4L400.1,23.2L408.0,27.1L406.7,32.6L402.1,33.2L396.2,42.2L391.6,43.1L391.7,39.8L393.9,34.2L396.3,31.9L392.0,25.9L388.7,20.5L384.1,19.2L380.9,14.7L373.8,12.8L369.1,8.5L360.9,7.9L352.4,3.1L342.3,0L334.9,0L331.5,0L326.0,0L317.1,0L312.0,0L305.7,0L301.1,0L0,600L301.1,0L0,600L294.6,0Z M381.5,40.6L389.9,39.7L385.9,48.0L387.5,51.2L385.2,56.6L376.8,52.7L371.3,51.5L356.0,46.2L357.5,40.8L370.3,41.7L381.5,40.6Z M315.1,11.6L320.6,8.3L327.2,15.8L325.6,29.7L320.6,29.0L316.2,32.6L312.0,29.8L311.6,17.1L309.1,11.0L315.1,11.6Z",
  "M0,600L649.8,491.3L591.5,440.9L594.7,436.7L600.1,429.7L604.1,422.0L599.2,410.0L597.9,404.7L592.7,397.4L599.5,391.1L606.9,384.1L612.6,385.9L612.6,391.8L616.4,395.3L624.0,395.3L637.9,404.2L641.4,404.3L643.9,404.0L646.4,405.3L653.7,406.1L656.9,401.7L667.0,397.3L671.4,400.9L678.9,400.9L0,600L678.9,400.9L668.2,464.0L665.6,468.4L661.4,469.2L659.9,476.6L656.3,480.8L654.2,487.9L649.8,491.3Z",
  "M0,600L93.1,311.1L89.6,286.3L91.5,280.1L94.9,279.9L102.6,282.8L108.8,280.7L113.0,281.4L114.7,279.1L158.7,278.9L161.2,271.6L159.3,270.3L154.0,224.8L148.7,179.4L165.5,179.2L202.5,202.2L239.5,225.1L242.1,230.1L249.0,233.1L254.1,234.8L254.2,241.5L266.4,240.5L266.4,264.7L260.4,271.7L259.4,278.2L249.7,279.9L234.7,280.8L230.7,284.5L223.6,285.0L216.6,285.0L213.8,283.0L207.8,284.5L197.6,288.9L195.5,292.1L186.9,296.9L185.4,299.6L180.8,301.7L175.6,300.3L172.6,302.9L170.9,310.1L162.2,318.8L162.5,322.4L159.5,326.8L160.2,332.9L155.7,334.5L153.1,335.8L151.4,331.3L148.3,332.5L146.4,332.3L144.3,335.4L135.8,335.3L132.8,333.7L131.4,334.7L128.0,331.6L128.6,328.5L127.2,327.3L124.9,328.3L125.3,324.9L127.6,322.2L123.1,317.8L121.8,314.9L119.3,312.5L117.2,312.3L114.5,313.7L111.0,315.2L107.9,317.4L103.2,316.6L100.2,313.9L98.4,313.6L95.5,315.0L93.8,315.0L93.1,311.1Z",
  "M0,600L382.5,201.4L375.5,307.4L375.2,310.7L373.1,310.9L365.7,299.4L363.1,299.0L354.5,304.9L346.1,301.8L340.1,301.2L337.0,302.7L330.5,302.3L324.0,306.8L318.5,307.1L305.2,301.7L300.0,304.2L294.4,304.1L290.3,300.1L279.2,296.1L267.5,297.4L264.6,299.7L263.1,305.7L259.9,310.0L259.2,319.4L0,600L259.2,319.4L243.4,309.2L230.8,306.8L230.4,301.7L224.2,294.8L222.8,290.1L223.6,285.0L0,600L223.6,285.0L281.8,235.8L313.6,215.1L351.2,195.0L368.6,199.6L374.7,205.4L382.5,201.4Z",
  "M0,600L249.0,376.2L0,600L259.2,319.4L379.5,314.9L378.3,316.8L377.7,320.3L368.5,328.4L365.6,335.1L364.0,340.6L361.7,343.0L359.5,350.3L353.6,354.7L351.9,360.0L349.4,364.2L348.4,368.6L340.9,372.2L334.7,367.8L330.6,368.0L324.0,374.2L320.8,374.3L315.6,384.4L312.8,391.9L301.4,395.7L297.3,395.1L293.0,397.5L284.3,397.2L278.4,390.6L274.8,383.0L267.0,376.1L258.7,376.2L249.0,376.2Z",
  "M120.4,1.3L124.3,0L128.8,0L131.6,2.2L138.1,2.2L139.9,0.9L146.3,1.2L149.4,6.5L144.3,9.4L144.2,17.6L142.4,19.1L142.0,24.1L137.2,24.9L141.6,31.3L138.6,38.2L142.4,41.3L140.9,44.2L136.8,48.1L137.7,51.6L133.3,54.3L127.5,52.8L121.9,54.0L123.5,45.8L122.5,39.3L117.6,38.3L114.9,34.3L115.8,27.5L120.2,23.6L121.0,19.4L123.3,13.0L123.0,8.6L120.8,4.8L120.4,1.3Z",
  "M36.1,299.0L31.5,290.8L26.1,287.1L30.9,285.1L36.2,277.7L38.8,272.3L42.6,268.9L48.0,269.8L53.4,267.5L59.5,267.4L64.8,270.5L72.0,273.3L78.7,281.0L85.9,288.2L86.5,294.8L88.6,300.8L92.7,303.8L93.6,307.9L93.1,311.1L91.6,311.7L85.6,310.9L84.8,312.1L82.3,312.3L74.4,309.7L69.1,309.6L48.9,309.2L45.9,310.4L42.3,310.0L36.5,311.7L34.7,303.7L44.6,303.9L47.3,302.4L49.3,302.3L53.3,299.9L58.0,302.1L62.8,302.3L67.6,299.9L65.4,296.9L61.7,298.7L58.3,298.6L54.0,296.0L50.5,296.2L48.0,298.7L36.1,299.0Z",
  "M0,600L137.7,51.6L120.9,0L116.4,0L131.9,0L145.4,0L160.1,0L171.8,0L180.9,0L198.6,0L0,600L198.6,0L252.9,1.1L242.5,8.1L228.4,10.4L227.4,13.9L220.7,19.7L216.4,28.3L220.7,34.3L214.4,39.0L212.0,45.9L203.7,48.0L195.9,56.1L182.0,56.2L171.6,56.0L164.7,59.7L160.5,63.7L155.1,62.8L151.1,59.3L147.9,53.2L137.7,51.6Z",
  "M0,600L229.4,326.3L231.1,379.7L228.7,376.0L225.8,369.3L224.9,364.1L227.3,354.6L224.6,350.8L223.5,342.5L223.6,334.8L219.0,329.4L219.8,326.1L229.4,326.3Z",
  "M0,600L710.9,50.8L0,600L684.3,50.2L612.2,60.3L616.4,56.3L609.7,57.2L600.5,54.8L593.0,60.8L576.3,62.0L567.4,56.4L555.6,56.0L553.1,60.4L545.5,61.6L534.9,56.0L522.9,56.2L516.4,45.8L508.4,39.9L513.7,31.7L506.7,26.7L518.9,16.6L535.8,16.2L540.5,8.2L561.4,9.6L574.6,2.8L587.4,0L605.5,0L624.7,7.0L640.4,11.1L653.2,9.4L662.6,10.4L675.6,4.9L687.3,4.4L697.9,9.6L0,600L697.9,9.6L0,600L711.1,24.1Z M0,600L506.2,1.8L528.1,4.0L537.7,7.4L535.7,9.9L522.6,10.5L518.0,13.8L508.8,19.5L505.4,14.5L505.5,12.4L0,600L505.5,12.4Z",
  "M0,600L591.6,452.1L546.8,457.3L544.2,456.2L0,600L544.2,456.2L562.5,402.3L569.4,404.6L578.3,402.2L586.0,402.2L592.7,397.4L0,600L592.7,397.4Z",
];


  const countryDetails = {
    "Egypt":{pop:"106M",gdp:"$347B",gdppc:"$3,270",green:"$19.8B",opp:["$17.7B water infrastructure plan","42% renewables target by 2030","$14.7B NWFE climate projects","100M+ tons solid waste — waste-to-energy opportunity","Scaling desalination 7x by 2030"]},
    "Jordan":{pop:"11.5M",gdp:"$50B",gdppc:"$4,350",green:"$3B+",opp:["$3B+ Aqaba-Amman desalination mega-project","50% renewable energy target by 2030","World's 5th most water-scarce country","$60B Economic Modernization Vision","45% non-revenue water loss — smart water opportunity"]},
    "Saudi Arabia":{pop:"36M",gdp:"$1,084B",gdppc:"$30,099",green:"$12.8B",opp:["Green tech market growing to $12.8B by 2030","130 GW renewable capacity planned","Vision 2030 + NEOM smart city","50% energy from renewables by 2030","$8.3B in 7 new renewable projects (15 GW)"]},
    "Morocco":{pop:"37M",gdp:"$154B",gdppc:"$4,162",green:"$5.6B",opp:["$5.6B solar/wind construction underway","52% renewables target by 2030","90% energy currently imported","Green hydrogen CAPEX $120B+ by 2050","Xlinks $20B UK interconnector project"]},
    "UAE":{pop:"10M",gdp:"$549B",gdppc:"$49,498",green:"$40B+",opp:["$40B+ cumulative clean energy investment","Net Zero 2050 target","ALTÉRRA $30B climate fund from COP28","$36B NDC investment needs 2023-2030","Mohammed bin Rashid Solar Park 5 GW by 2030"]},
    "Qatar":{pop:"3M",gdp:"$220B",gdppc:"$71,653",green:"Growing",opp:["800 MW Al Kharsaah solar plant","20% renewable energy target","Heavy AgTech & alternative protein investment","$200M vertical farming commitment","Food security diversification programs"]},
    "Oman":{pop:"5M",gdp:"$105B",gdppc:"$21,000",green:"Growing",opp:["Net Zero 2050 target","Green hydrogen hub in Duqm & Salalah","Solar-powered desalination projects","Strategic Red Sea port access","Energy diversification from oil & gas"]},
    "Bahrain":{pop:"1.5M",gdp:"$44B",gdppc:"$29,333",green:"$30B plan",opp:["$30B Strategic Projects Plan","Waste-to-energy protocol signed 2025","Food Sustainability Initiative","Net Zero 2060 target","Gateway country for Saudi Arabia business"]},
    "Kuwait":{pop:"4.5M",gdp:"$160B",gdppc:"$35,556",green:"Growing",opp:["Net Zero 2060 target","Kuwait Investment Authority climate integration","Renewable energy expansion program","Al Shagaya renewable complex","Water desalination modernization"]},
    "Iraq":{pop:"44M",gdp:"$264B",gdppc:"$6,000",green:"Massive gap",opp:["Top 5 Arab electricity producer","Massive infrastructure gap — rebuilding needed","Water treatment urgently needed","Electricity demand exceeding supply","Oil-to-gas conversion opportunity"]},
    "Algeria":{pop:"45M",gdp:"$238B",gdppc:"$5,289",green:"Huge potential",opp:["Needs 2,700% increase in renewable capacity","Africa's largest gas producer pivoting to blue hydrogen","22 GW renewable target by 2030","Vast solar potential in Sahara","Desalination expansion needed"]},
    "Tunisia":{pop:"12M",gdp:"$46B",gdppc:"$3,833",green:"Growing",opp:["Growing renewable energy sector","EU-linked green transition programs","Increasing water stress","Solar energy potential","Waste management modernization needed"]},
    "Libya":{pop:"7M",gdp:"$41B",gdppc:"$5,857",green:"Rebuilding",opp:["Post-conflict infrastructure rebuilding","2,000 MW interconnection with Egypt planned","Oil revenue available for green transition","Vast solar potential","Water infrastructure reconstruction"]},
    "Sudan":{pop:"48M",gdp:"$30B",gdppc:"$625",green:"Untapped",opp:["Renewable resources similar to Morocco & Egypt","Almost entirely undeveloped RE potential","Red Sea ports for hydrogen export","Agricultural modernization needed","Water treatment critical"]},
    "Mauritania":{pop:"5M",gdp:"$10B",gdppc:"$2,000",green:"Frontier",opp:["Top 5 for renewable FDI in Arab region","Green hydrogen & wind energy frontier","AMAN green hydrogen mega-project","30 GW wind & solar potential","Strategic Atlantic coast location"]},
    "Lebanon":{pop:"5.5M",gdp:"$20B",gdppc:"$3,636",green:"Crisis-driven",opp:["Acute energy crisis driving solar adoption","Decentralized solar growing rapidly","Water infrastructure needs","Waste management crisis","Rebuilding opportunity"]},
    "Palestine":{pop:"5.5M",gdp:"$18B",gdppc:"$3,273",green:"Critical need",opp:["Top water importer in MENA","Solar energy adoption growing","Water treatment critical need","Limited energy infrastructure","Agricultural water efficiency needed"]},
    "Yemen":{pop:"34M",gdp:"$20B",gdppc:"$588",green:"Humanitarian",opp:["Severe water & energy crisis","Off-grid solar opportunity","Water purification critical need","Humanitarian-linked green tech","Decentralized energy solutions needed"]},
    "Somalia":{pop:"18M",gdp:"$8B",gdppc:"$444",green:"Early stage",opp:["Off-grid renewable energy demand","Water purification critical","Early-stage market with high need","Solar potential for rural electrification","Climate adaptation urgently needed"]},
    "Djibouti":{pop:"1M",gdp:"$4B",gdppc:"$4,000",green:"Strategic",opp:["Strategic Red Sea location","Geothermal & solar potential","Desalination needs for water security","Logistics hub for East Africa","Climate resilience infrastructure"]},
    "Comoros":{pop:"0.9M",gdp:"$1.3B",gdppc:"$1,444",green:"Small scale",opp:["Island nation with solar potential","Waste management critical need","Water security challenges","Small-scale renewable energy","Climate vulnerability — adaptation needed"]},
    "Syria":{pop:"23M",gdp:"$12B",gdppc:"$522",green:"Future market",opp:["Post-conflict reconstruction ahead","Water & energy infrastructure devastated","Massive rebuilding market (future)","Agricultural restoration needed","All environmental infrastructure to rebuild"]},
  };

  const gateways = ["Egypt","Jordan","Saudi Arabia","Morocco"];

  return <section id="markets" style={{background:C.ch,padding:"100px 24px"}}><div style={{maxWidth:1200,margin:"0 auto"}}>
    <div style={{fontFamily:F,fontSize:11,fontWeight:700,letterSpacing:"0.12em",marginBottom:12,textTransform:"uppercase"}}><Grad>22 Arab Countries</Grad></div>
    <h2 style={{fontFamily:F,fontSize:"clamp(24px,3.5vw,40px)",fontWeight:800,color:C.w,marginBottom:14}}>Market Opportunities Across the Arab Region</h2>
    <p style={{fontFamily:F,fontSize:14,color:C.tl,maxWidth:660,lineHeight:1.8,marginBottom:24,fontWeight:400}}>Click on any country to explore population, economy, and green technology opportunities.</p>

    {/* Gateway badges */}
    <div style={{display:"flex",gap:8,marginBottom:24,flexWrap:"wrap"}}>
      {countries.filter(c=>c.h).map((c,i)=><button key={i} onClick={()=>setSel(c.n)} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",borderRadius:8,background:sel===c.n?"rgba(43,172,34,0.15)":"rgba(43,172,34,0.05)",border:sel===c.n?`1px solid ${C.g}`:"1px solid rgba(43,172,34,0.15)",cursor:"pointer",transition:"all .2s"}}>
        <Flag code={c.cc} size={18}/>
        <span style={{fontFamily:F,fontSize:11,fontWeight:700,color:sel===c.n?C.w:C.g}}>{c.n}</span>
        <span style={{fontFamily:F,fontSize:8,color:C.td,fontWeight:400,fontStyle:"italic"}}>{c.gw?.replace("Gateway to ","")}</span>
      </button>)}
    </div>

    <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
      {/* SVG Map */}
      <div style={{flex:"1 1 520px",position:"relative",background:"rgba(255,255,255,0.015)",borderRadius:14,border:"1px solid rgba(255,255,255,0.05)",padding:"16px 8px",overflow:"hidden"}}>
        <svg viewBox="-10 20 920 580" style={{width:"100%",height:"auto"}}>
          {/* Ocean/background subtle pattern */}
          <rect x="-10" y="20" width="920" height="580" fill="transparent"/>
          
          {/* Neighbor countries in subtle gray */}
          {neighborPaths.map((d,i)=><path key={`n${i}`} d={d} fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.3"/>)}
          
          {/* Arab countries */}
          {Object.entries(arabMapPaths).map(([name,{d,cx,cy}],i)=>{
            const isGateway=gateways.includes(name);
            const isSel=sel===name;
            return <g key={i} onClick={()=>setSel(sel===name?null:name)} style={{cursor:"pointer"}}>
              <path d={d}
                fill={isSel?"rgba(144,223,62,0.55)":isGateway?"rgba(43,172,34,0.5)":"rgba(43,172,34,0.3)"}
                stroke={isSel?"#90DF3E":isGateway?"rgba(144,223,62,0.7)":"rgba(43,172,34,0.5)"}
                strokeWidth={isSel?1.5:isGateway?0.8:0.4}
                strokeLinejoin="round"
                style={{transition:"all 0.3s"}}
              />
              <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central"
                style={{fontFamily:F,fontSize:name==="Saudi Arabia"||name==="Algeria"||name==="Libya"||name==="Egypt"||name==="Sudan"||name==="Morocco"?8:name==="Somalia"?7:6,
                fontWeight:isGateway?700:400,
                fill:isSel?"#fff":isGateway?"rgba(255,255,255,0.95)":"rgba(255,255,255,0.55)",
                pointerEvents:"none",transition:"all 0.3s",
                textShadow:"0 1px 3px rgba(0,0,0,0.5)"}}>
                {name==="Saudi Arabia"?"KSA":name}
              </text>
            </g>;
          })}
        </svg>
        {/* Legend */}
        <div style={{display:"flex",gap:16,justifyContent:"center",marginTop:4}}>
          <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:12,height:12,borderRadius:2,background:"rgba(43,172,34,0.5)",border:"1px solid rgba(144,223,62,0.7)"}}/><span style={{fontFamily:F,fontSize:9,color:C.tl}}>Regional Gateway</span></div>
          <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:12,height:12,borderRadius:2,background:"rgba(43,172,34,0.3)"}}/><span style={{fontFamily:F,fontSize:9,color:C.td}}>Arab Market</span></div>
          <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:12,height:12,borderRadius:2,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)"}}/><span style={{fontFamily:F,fontSize:9,color:C.td}}>Non-Arab</span></div>
        </div>
      </div>

      {/* Detail Panel */}
      <div style={{flex:"1 1 320px",minWidth:280}}>
        {selected ? (()=>{
          const det = countryDetails[selected.n] || {};
          const cd = selected;
          return <div style={{background:"rgba(255,255,255,0.02)",borderRadius:14,border:`1px solid ${C.g}`,padding:24,transition:"all 0.3s"}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
              <Flag code={cd.cc} size={32}/>
              <div>
                <div style={{fontFamily:F,fontSize:20,fontWeight:800,color:C.w}}>{cd.n}</div>
                {cd.gw&&<div style={{fontFamily:F,fontSize:10,color:C.g,fontWeight:500,fontStyle:"italic"}}>{cd.gw}</div>}
              </div>
              <button onClick={()=>setSel(null)} style={{marginLeft:"auto",background:"none",border:"none",color:C.td,fontSize:18,cursor:"pointer",padding:4}}>✕</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
              {[{l:"Population",v:det.pop},{l:"GDP",v:det.gdp},{l:"GDP per Capita",v:det.gdppc},{l:"Green Sector",v:det.green}].map((s,i)=>(
                <div key={i} style={{background:"rgba(255,255,255,0.03)",borderRadius:8,padding:"10px 12px"}}>
                  <div style={{fontFamily:F,fontSize:8,color:C.td,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:3}}>{s.l}</div>
                  <div style={{fontFamily:F,fontSize:16,fontWeight:800}}><Grad>{s.v||"N/A"}</Grad></div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:16}}>
              {cd.t.map((s,j)=><span key={j} style={{padding:"3px 10px",borderRadius:8,background:"rgba(43,172,34,0.1)",fontFamily:F,fontSize:9,color:C.g,fontWeight:600}}>{s}</span>)}
            </div>
            <div style={{fontFamily:F,fontSize:9,color:C.td,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:8}}>Green Sector Opportunities</div>
            {(det.opp||[]).map((o,i)=>(
              <div key={i} style={{display:"flex",gap:6,alignItems:"flex-start",marginBottom:6}}>
                <span style={{color:C.g,fontSize:10,marginTop:2,fontWeight:700}}>→</span>
                <span style={{fontFamily:F,fontSize:11,color:C.tl,lineHeight:1.5,fontWeight:400}}>{o}</span>
              </div>
            ))}
            <button onClick={()=>scroll("contact")} style={{marginTop:16,width:"100%",padding:"12px 0",background:`linear-gradient(90deg,${C.gl},${C.gr})`,color:C.d1,border:"none",borderRadius:8,fontFamily:F,fontSize:12,fontWeight:700,cursor:"pointer"}}>Explore This Market</button>
          </div>;
        })() : (
          <div style={{background:"rgba(255,255,255,0.02)",borderRadius:14,border:"1px solid rgba(255,255,255,0.05)",padding:24,textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:300}}>
            <div style={{fontSize:40,marginBottom:16,opacity:0.3}}>🌍</div>
            <div style={{fontFamily:F,fontSize:16,fontWeight:700,color:C.w,marginBottom:8}}>Select a Country</div>
            <div style={{fontFamily:F,fontSize:12,color:C.td,lineHeight:1.6,maxWidth:240}}>Click any country on the map or the gateway badges above to explore opportunities.</div>
            <div style={{marginTop:20,fontFamily:F,fontSize:10,color:C.g,fontWeight:600}}>4 Regional Gateways · 22 Arab Markets</div>
          </div>
        )}
      </div>
    </div>

    {/* Quick access list */}
    <div style={{marginTop:24}}>
      <div style={{fontFamily:F,fontSize:10,color:C.td,fontWeight:700,letterSpacing:"0.08em",marginBottom:10,textTransform:"uppercase"}}>All 22 Arab Markets</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
        {countries.map((c,i)=><button key={i} onClick={()=>setSel(sel===c.n?null:c.n)} style={{
          background:sel===c.n?"rgba(43,172,34,0.1)":"rgba(255,255,255,0.015)",
          border:sel===c.n?`1px solid ${C.g}`:"1px solid rgba(255,255,255,0.04)",
          borderRadius:7,padding:"6px 10px",cursor:"pointer",transition:"all .2s",
          display:"flex",alignItems:"center",gap:5,
        }}>
          <Flag code={c.cc} size={14}/>
          <span style={{fontFamily:F,fontSize:10,color:sel===c.n?C.g:C.tl,fontWeight:sel===c.n?700:500}}>{c.n}</span>
        </button>)}
      </div>
    </div>
  </div></section>;
}

/* ========== EDIT 3: NEW ABOUT HEADING + EDIT 4: VISUAL TIMELINE + EDIT 5: SECTORS WE SERVE ========== */
function About() {
  const cr=[{v:16,p:"",s:"+",l:"Years building environmental tech ecosystems across the Arab region"},{v:22,p:"",s:"",l:"Countries of direct operational experience and government relationships"},{v:630,p:"$",s:"M+",l:"Programme portfolio managed through regional technology centres"},{v:1500,p:"",s:"+",l:"Startups accelerated through regional innovation programmes"},{v:2000,p:"",s:"+",l:"Green SMEs supported through sustainability training programmes"},{v:15000,p:"",s:"+",l:"Stakeholders engaged across 80+ countries via annual summits"}];

  const timeline=[
    {step:"01",title:"Assess",time:"4 weeks",color:C.g,desc:"We evaluate your technology's fit for MENA markets, identify target countries, and map the competitive landscape.",deliverable:"Written market entry brief with target countries, regulatory map, competitive analysis, and procurement channels"},
    {step:"02",title:"Connect",time:"8–12 weeks",color:"#90DF3E",desc:"We introduce you to pre-qualified buyers, government procurement officers, and local distribution partners.",deliverable:"5–10 curated introductions and 2 facilitated meetings with decision-makers"},
    {step:"03",title:"Deploy",time:"6–12 months",color:"#2BAC22",desc:"We facilitate your first MENA contract or pilot project through our local operations in KSA, Jordan, and Egypt.",deliverable:"Signed contract or active pilot — compliance, logistics, and client management handled"},
  ];

  const sectors=[
    {icon:"💧",name:"Water Treatment & Desalination",desc:"Purification, recycling, desalination, smart water networks, leak detection"},
    {icon:"⚡",name:"Renewable Energy & Storage",desc:"Solar, wind, grid optimization, battery storage, sustainable cooling"},
    {icon:"♻️",name:"Waste & Circular Economy",desc:"Waste-to-energy, recycling systems, industrial waste management"},
    {icon:"🌱",name:"AgTech & Smart Farming",desc:"Vertical farming, precision agriculture, post-harvest technology, smart greenhouses"},
    {icon:"📡",name:"Environmental IoT",desc:"Remote monitoring, environmental sensors, SCADA, data analytics platforms"},
    {icon:"🔬",name:"Green Hydrogen",desc:"Electrolyzers, hydrogen storage, green ammonia, fuel cell systems"},
  ];

  return <section id="about" style={{background:C.d1,padding:"100px 24px"}}><div style={{maxWidth:1200,margin:"0 auto"}}>
    {/* EDIT 3: New heading */}
    <div style={{fontFamily:F,fontSize:11,fontWeight:700,letterSpacing:"0.12em",marginBottom:12,textTransform:"uppercase"}}><Grad>About Us</Grad></div>
    <h2 style={{fontFamily:F,fontSize:"clamp(24px,3.5vw,40px)",fontWeight:800,color:C.w,marginBottom:14}}>Your <Grad>Operating Partner</Grad> in the Arab Market</h2>
    <p style={{fontFamily:F,fontSize:14,color:C.tl,maxWidth:660,lineHeight:1.8,marginBottom:48,fontWeight:400}}>GreenTech Bridge is a market access platform built by a team that has spent over a decade and a half on the ground across the Arab region — building technology ecosystems, managing large-scale programmes, forging government partnerships, and accelerating thousands of startups and green SMEs. We don't advise from the outside. We operate from within.</p>

    {/* Credential cards */}
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(165px,1fr))",gap:10,marginBottom:56}}>
      {cr.map((c,i)=><div key={i} style={{padding:"20px 16px",background:"rgba(255,255,255,0.02)",borderRadius:9,borderLeft:`3px solid ${C.g}`}}>
        <div style={{fontFamily:F,fontSize:26,fontWeight:800,marginBottom:4}}><Grad><AnimNum value={String(c.v)} prefix={c.p} suffix={c.s} duration={2500}/></Grad></div>
        <div style={{fontFamily:F,fontSize:10,color:C.tl,lineHeight:1.5,fontWeight:400}}>{c.l}</div>
      </div>)}
    </div>

    {/* EDIT 4: Visual timeline */}
    <div style={{fontFamily:F,fontSize:10,fontWeight:700,letterSpacing:"0.08em",marginBottom:20,textTransform:"uppercase"}}><Grad>How We Work With You</Grad></div>
    <div style={{position:"relative",marginBottom:56,paddingLeft:40}}>
      {/* Vertical line */}
      <div style={{position:"absolute",left:15,top:0,bottom:0,width:2,background:"rgba(43,172,34,0.15)",borderRadius:1}}/>
      {timeline.map((t,i)=><div key={i} style={{position:"relative",marginBottom:i<2?32:0}}>
        {/* Circle on timeline */}
        <div style={{position:"absolute",left:-33,top:0,width:30,height:30,borderRadius:"50%",background:`linear-gradient(135deg,${C.gl},${C.gr})`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:F,fontSize:11,fontWeight:800,color:C.d1}}>{t.step}</div>
        {/* Content card */}
        <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:12,padding:"24px 24px 20px",borderLeft:`3px solid ${t.color}`}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8,flexWrap:"wrap"}}>
            <span style={{fontFamily:F,fontSize:20,fontWeight:800,color:C.w}}>{t.title}</span>
            <span style={{fontFamily:F,fontSize:11,fontWeight:600,color:C.d1,background:`linear-gradient(90deg,${C.gl},${C.gr})`,padding:"3px 12px",borderRadius:10}}>{t.time}</span>
          </div>
          <p style={{fontFamily:F,fontSize:13,color:C.tl,lineHeight:1.7,fontWeight:400,marginBottom:12}}>{t.desc}</p>
          <div style={{background:"rgba(43,172,34,0.06)",borderRadius:8,padding:"10px 14px",border:"1px solid rgba(43,172,34,0.1)"}}>
            <div style={{fontFamily:F,fontSize:9,color:C.g,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:3}}>Deliverable</div>
            <div style={{fontFamily:F,fontSize:12,color:C.tl,lineHeight:1.5,fontWeight:400}}>{t.deliverable}</div>
          </div>
        </div>
      </div>)}
    </div>

    {/* EDIT 5: Sectors We Serve */}
    <div style={{fontFamily:F,fontSize:10,fontWeight:700,letterSpacing:"0.08em",marginBottom:16,textTransform:"uppercase"}}><Grad>Sectors We Serve</Grad></div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:10}}>
      {sectors.map((s,i)=><div key={i} style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:10,padding:"20px 16px",textAlign:"center"}}>
        <div style={{fontSize:32,marginBottom:10}}>{s.icon}</div>
        <div style={{fontFamily:F,fontSize:13,fontWeight:700,color:C.w,marginBottom:6}}>{s.name}</div>
        <div style={{fontFamily:F,fontSize:11,color:C.tl,lineHeight:1.5,fontWeight:400}}>{s.desc}</div>
      </div>)}
    </div>
  </div></section>;
}

/* ========== EDIT 6: FORMSUBMIT.CO + THANK YOU MESSAGE ========== */
function Contact() {
  const [submitted,setSubmitted]=useState(false);

  if(submitted){
    return <section id="contact" style={{background:C.ch,padding:"100px 24px"}}><div style={{maxWidth:620,margin:"0 auto",textAlign:"center"}}>
      <div style={{fontSize:48,marginBottom:20}}>✅</div>
      <h2 style={{fontFamily:F,fontSize:28,fontWeight:800,color:C.w,marginBottom:12}}>Thank You for Reaching Out!</h2>
      <p style={{fontFamily:F,fontSize:15,color:C.tl,lineHeight:1.8,fontWeight:400,marginBottom:32}}>Your message has been received. We will contact you via email soon to discuss how we can help your technology reach the Arab market.</p>
      <button onClick={()=>setSubmitted(false)} style={{padding:"13px 28px",background:`linear-gradient(90deg,${C.gl},${C.gr})`,color:C.d1,border:"none",borderRadius:8,fontFamily:F,fontSize:13,fontWeight:700,cursor:"pointer"}}>Send Another Message</button>
    </div></section>;
  }

  const handleSubmit=(e)=>{
    e.preventDefault();
    const form=e.target;
    const data=new FormData(form);
    fetch("https://formsubmit.co/ajax/info@greentech-bridge.com",{
      method:"POST",
      headers:{"Content-Type":"application/json","Accept":"application/json"},
      body:JSON.stringify(Object.fromEntries(data))
    }).then(r=>{if(r.ok)setSubmitted(true);}).catch(()=>setSubmitted(true));
  };

  return <section id="contact" style={{background:C.ch,padding:"100px 24px"}}><div style={{maxWidth:620,margin:"0 auto",textAlign:"center"}}>
    <div style={{fontFamily:F,fontSize:11,fontWeight:700,letterSpacing:"0.12em",marginBottom:12,textTransform:"uppercase"}}><Grad>Get Started</Grad></div>
    <h2 style={{fontFamily:F,fontSize:"clamp(24px,3.5vw,40px)",fontWeight:800,color:C.w,marginBottom:10}}>Ready to Cross the Bridge?</h2>
    <p style={{fontFamily:F,fontSize:14,color:C.tl,lineHeight:1.8,marginBottom:32,fontWeight:400}}>Book a free 30-minute strategy call. We'll assess your technology, identify the right Arab markets, and outline a path to your first MENA contract.</p>
    <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:14,padding:32,maxWidth:460,margin:"0 auto",textAlign:"left"}}>
      <div onSubmit={handleSubmit} style={{display:"flex",flexDirection:"column",gap:10}} ref={el=>{if(el)el.closest=el.closest||function(){};}} >
        <input name="name" required placeholder="Your full name *" style={{width:"100%",padding:"13px 14px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:7,color:C.w,fontFamily:F,fontSize:12,outline:"none",fontWeight:400}}/>
        <input name="company" required placeholder="Company name *" style={{width:"100%",padding:"13px 14px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:7,color:C.w,fontFamily:F,fontSize:12,outline:"none",fontWeight:400}}/>
        <input name="website" required type="url" placeholder="Company website URL *" style={{width:"100%",padding:"13px 14px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:7,color:C.w,fontFamily:F,fontSize:12,outline:"none",fontWeight:400}}/>
        <input name="email" required type="email" pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$" placeholder="Business email address *" style={{width:"100%",padding:"13px 14px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:7,color:C.w,fontFamily:F,fontSize:12,outline:"none",fontWeight:400}}/>
        <input name="phone" required type="tel" placeholder="Phone number (WhatsApp) *" style={{width:"100%",padding:"13px 14px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:7,color:C.w,fontFamily:F,fontSize:12,outline:"none",fontWeight:400}}/>
        <select name="interest" required style={{width:"100%",padding:"13px 14px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:7,color:C.tl,fontFamily:F,fontSize:12,outline:"none",fontWeight:400}}>
          <option value="">What are you interested in? *</option><option>Explorer — Market Intelligence</option><option>Accelerator — Buyer Introductions</option><option>Full Bridge — Market Entry Partner</option><option>Free Strategy Call</option>
        </select>
        <textarea name="message" required placeholder="Tell us about your technology *" rows={3} style={{width:"100%",padding:"13px 14px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:7,color:C.w,fontFamily:F,fontSize:12,outline:"none",resize:"vertical",fontWeight:400}}/>
        <input type="hidden" name="_subject" value="New GreenTech Bridge Inquiry"/>
        <input type="hidden" name="_captcha" value="false"/>
        <button type="submit" onClick={(e)=>{const form=e.target.closest('div');const inputs=form.querySelectorAll('input[required],select[required],textarea[required]');let valid=true;const emailInput=form.querySelector('input[type=email]');if(emailInput&&emailInput.value&&!/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(emailInput.value)){emailInput.style.borderColor='#E24B4A';valid=false;}const urlInput=form.querySelector('input[type=url]');if(urlInput&&urlInput.value&&!/^https?:\/\/.+/.test(urlInput.value)){urlInput.style.borderColor='#E24B4A';valid=false;}inputs.forEach(inp=>{if(!inp.value||(inp.tagName==='SELECT'&&!inp.value)){inp.style.borderColor='#E24B4A';valid=false;}else if(inp.style.borderColor!=='#E24B4A'){inp.style.borderColor='rgba(255,255,255,0.07)';}});if(valid){const data={};form.querySelectorAll('input[name],select[name],textarea[name]').forEach(el=>{if(el.name&&!el.name.startsWith('_'))data[el.name]=el.value;});data._subject="New GreenTech Bridge Inquiry";fetch("https://formsubmit.co/ajax/info@greentech-bridge.com",{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify(data)}).then(r=>{if(r.ok)setSubmitted(true);}).catch(()=>setSubmitted(true));}}} style={{width:"100%",padding:"15px 0",background:`linear-gradient(90deg,${C.gl},${C.gr})`,color:C.d1,border:"none",borderRadius:8,fontFamily:F,fontSize:14,fontWeight:800,cursor:"pointer",boxShadow:"0 4px 24px rgba(43,172,34,0.2)"}}>Book Your Free Strategy Call</button>
      </div>
    </div>
    <div style={{marginTop:24,fontFamily:F,fontSize:11,color:C.td,fontWeight:400}}>EU-registered (Estonia) · Operating across KSA, Jordan & Egypt · EU invoicing & funding eligibility</div>
  </div></section>;
}

export default function App() {
  const [active,setActive]=useState("hero");
  useEffect(()=>{
    const l=document.createElement("link");l.href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap";l.rel="stylesheet";document.head.appendChild(l);
    const tw=document.createElement("script");tw.src="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/twemoji.min.js";tw.crossOrigin="anonymous";tw.onload=()=>{if(window.twemoji)window.twemoji.parse(document.body,{folder:"svg",ext:".svg"})};document.head.appendChild(tw);
    const s=document.createElement("style");
    s.textContent=`
      *{margin:0;padding:0;box-sizing:border-box}
      body{background:${C.d1}}
      ::selection{background:rgba(43,172,34,0.3);color:white}
      input::placeholder,textarea::placeholder{color:rgba(245,245,240,0.25)}
      button:hover{opacity:0.92}
      select{color-scheme:dark}
      select option{background:#022023;color:#f5f5f0}
      img.emoji{height:1em;width:1em;margin:0 .05em 0 .1em;vertical-align:-0.1em}
      html{scroll-behavior:smooth}
      @media(max-width:768px){
        .desktop-nav{display:none !important}
        .mobile-hamburger{display:flex !important}
        .mobile-menu{display:flex !important}
      }
    `;
    document.head.appendChild(s);
    const observer=new MutationObserver(()=>{if(window.twemoji)window.twemoji.parse(document.body,{folder:"svg",ext:".svg"})});observer.observe(document.body,{childList:true,subtree:true});
    const h=()=>{for(const id of["contact","about","markets","tool","services","problem","hero"]){const el=document.getElementById(id);if(el&&el.getBoundingClientRect().top<=200){setActive(id);break;}}};
    window.addEventListener("scroll",h);return()=>window.removeEventListener("scroll",h);
  },[]);
  return <div>
    <Nav active={active}/>
    <Hero/><Problem/><Services/><Tool/><Markets/><About/><Contact/>
    <footer style={{background:C.d1,padding:"32px 24px",borderTop:`1px solid rgba(43,172,34,0.08)`}}>
      <div style={{maxWidth:1200,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
        <img src="/logo-horizontal.png" alt="GreenTech Bridge Ventures" style={{height:26,opacity:0.8}} />
        <div style={{fontFamily:F,fontSize:10,color:C.td,fontWeight:400}}>European CleanTech → Arab Markets · Proven Globally, Scaled in the Arab Region</div>
        <div style={{fontFamily:F,fontSize:9,color:C.td}}>© {new Date().getFullYear()} GreenTech Bridge Ventures OÜ</div>
      </div>
    </footer>
  </div>;
}
