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

  const arabMap = [
    {id:"Morocco",d:"M35,69 L95,69 L115,81 L115,92 L103,104 L115,115 L103,127 L80,138 L46,150 L23,173 L12,173 L12,161 L23,138 L35,127 L46,115 L35,104 Z",cx:65,cy:115},
    {id:"Mauritania",d:"M12,173 L23,173 L46,150 L80,138 L80,196 L80,242 L58,242 L12,242 L12,196 Z",cx:46,cy:207},
    {id:"Algeria",d:"M115,81 L138,69 L184,58 L218,69 L241,69 L264,81 L310,81 L310,92 L322,104 L310,127 L310,173 L264,230 L218,242 L172,242 L126,242 L80,242 L80,196 L80,138 L103,127 L115,115 L103,104 L115,92 Z",cx:195,cy:155},
    {id:"Tunisia",d:"M310,58 L333,46 L345,58 L345,69 L333,81 L310,81 L310,69 Z",cx:328,cy:69},
    {id:"Libya",d:"M310,81 L333,81 L345,69 L368,69 L425,69 L460,58 L483,69 L483,81 L471,92 L471,115 L460,127 L460,173 L414,219 L368,219 L322,219 L310,173 L310,127 L322,104 L310,92 Z",cx:395,cy:140},
    {id:"Egypt",d:"M483,81 L518,69 L541,81 L564,92 L576,92 L576,104 L576,138 L564,150 L553,173 L529,196 L506,196 L506,173 L518,150 L506,138 L483,150 L460,173 L460,127 L471,115 L471,92 L483,81 Z",cx:525,cy:130},
    {id:"Sudan",d:"M460,173 L483,150 L506,138 L518,150 L506,173 L506,196 L529,196 L553,196 L576,196 L599,219 L599,253 L599,299 L576,310 L553,322 L518,322 L483,334 L460,322 L437,310 L437,276 L437,242 L414,219 L460,219 Z",cx:518,cy:265},
    {id:"Palestine",d:"M564,90 L572,90 L572,100 L564,104 Z",cx:568,cy:96},
    {id:"Lebanon",d:"M568,73 L576,73 L576,84 L568,84 Z",cx:572,cy:78},
    {id:"Syria",d:"M576,46 L622,35 L645,35 L668,46 L668,69 L645,75 L622,81 L599,81 L576,81 L576,73 L568,73 L568,66 L576,58 Z",cx:622,cy:58},
    {id:"Jordan",d:"M576,81 L599,81 L610,92 L610,104 L599,115 L587,115 L576,104 L576,92 Z",cx:593,cy:97},
    {id:"Iraq",d:"M645,35 L668,35 L691,35 L714,46 L737,58 L737,81 L725,92 L714,104 L691,104 L668,92 L656,92 L645,81 L645,75 L668,69 L668,46 Z",cx:691,cy:69},
    {id:"Saudi Arabia",d:"M599,115 L610,104 L610,92 L622,81 L645,81 L656,92 L668,92 L691,104 L714,104 L737,115 L760,127 L783,138 L806,138 L806,161 L795,184 L772,196 L749,207 L714,219 L691,230 L668,230 L645,230 L622,219 L599,196 L587,173 L576,150 L564,138 L576,127 L587,115 Z",cx:685,cy:162},
    {id:"Kuwait",d:"M737,78 L749,72 L760,78 L760,90 L749,90 L737,90 Z",cx:749,cy:83},
    {id:"Bahrain",d:"M789,114 L796,114 L796,122 L789,122 Z",cx:792,cy:118},
    {id:"Qatar",d:"M796,103 L808,103 L808,120 L802,128 L796,120 Z",cx:802,cy:114},
    {id:"UAE",d:"M806,138 L829,127 L852,127 L864,138 L852,150 L829,150 L806,150 Z",cx:835,cy:138},
    {id:"Oman",d:"M852,127 L876,115 L899,127 L899,150 L899,184 L876,196 L852,196 L829,196 L829,173 L829,150 L852,150 L864,138 Z",cx:870,cy:158},
    {id:"Yemen",d:"M622,219 L645,230 L668,230 L691,230 L714,219 L726,230 L726,265 L703,276 L668,287 L645,287 L622,276 L599,265 L587,253 L599,242 L599,230 Z",cx:660,cy:255},
    {id:"Djibouti",d:"M599,274 L612,268 L622,276 L612,288 L599,288 Z",cx:610,cy:280},
    {id:"Somalia",d:"M622,276 L645,287 L668,287 L680,299 L691,322 L703,356 L714,391 L703,414 L680,437 L657,437 L634,414 L622,391 L610,356 L610,322 L610,299 L610,288 L612,288 L622,276 Z",cx:660,cy:360},
    {id:"Comoros",d:"M608,488 L620,484 L626,492 L614,496 Z",cx:617,cy:490},
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
      <div style={{flex:"1 1 520px",position:"relative",background:"rgba(255,255,255,0.015)",borderRadius:14,border:"1px solid rgba(255,255,255,0.05)",padding:"20px 10px",overflow:"hidden"}}>
        <svg viewBox="0 0 920 520" style={{width:"100%",height:"auto"}}>
          {/* Subtle grid */}
          {[0,1,2,3,4].map(i=><line key={`h${i}`} x1="0" y1={i*130} x2="920" y2={i*130} stroke="rgba(255,255,255,0.02)" strokeWidth="0.5"/>)}
          {[0,1,2,3,4,5,6].map(i=><line key={`v${i}`} x1={i*153} y1="0" x2={i*153} y2="520" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5"/>)}

          {/* Country shapes */}
          {arabMap.map((m,i)=>{
            const cd=countries.find(c=>c.n===m.id);
            const isGateway=gateways.includes(m.id);
            const isSel=sel===m.id;
            return <g key={i} onClick={()=>setSel(sel===m.id?null:m.id)} style={{cursor:"pointer"}}>
              <path d={m.d}
                fill={isSel?"rgba(144,223,62,0.6)":isGateway?"rgba(43,172,34,0.45)":"rgba(43,172,34,0.25)"}
                stroke={isSel?C.gl:isGateway?"rgba(144,223,62,0.6)":"rgba(43,172,34,0.3)"}
                strokeWidth={isSel?2:isGateway?1.2:0.5}
                style={{transition:"all 0.3s"}}
              />
              {/* Country label */}
              <text x={m.cx} y={m.cy} textAnchor="middle" dominantBaseline="central"
                style={{fontFamily:F,fontSize:isGateway?9:7,fontWeight:isGateway?700:400,
                fill:isSel?"#fff":isGateway?"rgba(255,255,255,0.9)":"rgba(255,255,255,0.5)",
                pointerEvents:"none",transition:"all 0.3s"}}>
                {m.id==="Saudi Arabia"?"KSA":m.id==="United Arab Emirates"?"UAE":m.id}
              </text>
              {/* Gateway indicator */}
              {isGateway&&!isSel&&<circle cx={m.cx} cy={m.cy-14} r={3} fill={C.gl} opacity={0.7}>
                <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2s" repeatCount="indefinite"/>
              </circle>}
            </g>;
          })}
        </svg>
        {/* Legend */}
        <div style={{display:"flex",gap:16,justifyContent:"center",marginTop:8}}>
          <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:12,height:12,borderRadius:2,background:"rgba(43,172,34,0.45)",border:"1px solid rgba(144,223,62,0.6)"}}/><span style={{fontFamily:F,fontSize:9,color:C.tl}}>Regional Gateway</span></div>
          <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:12,height:12,borderRadius:2,background:"rgba(43,172,34,0.25)"}}/><span style={{fontFamily:F,fontSize:9,color:C.td}}>Arab Market</span></div>
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
