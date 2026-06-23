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
  { n:"Egypt",cc:"eg",h:true,s:"$19.8B renewables. 42% RE target by 2030.",t:["Water","Energy"],gw:"Gateway to North Africa",r:"Arab States" },
  { n:"Jordan",cc:"jo",h:true,s:"$3B+ desal mega-project. 50% RE target.",t:["Water","Energy"],gw:"Gateway to Levant",r:"Arab States" },
  { n:"Saudi Arabia",cc:"sa",h:true,s:"$12.8B green tech by 2030. Vision 2030.",t:["Water","Energy","AgTech"],gw:"Gateway to GCC",r:"Arab States" },
  { n:"Morocco",cc:"ma",h:true,s:"$5.6B solar/wind. 52% RE target.",t:["Energy","Water"],gw:"Gateway to Maghreb",r:"Arab States" },
  { n:"Iraq",cc:"iq",h:false,s:"Massive infrastructure rebuilding.",t:["Water","Energy"],r:"Arab States" },
  { n:"Lebanon",cc:"lb",h:false,s:"Energy crisis driving solar adoption.",t:["Energy"],r:"Arab States" },
  { n:"Palestine",cc:"ps",h:false,s:"Top water importer. Solar growing.",t:["Water","Energy"],r:"Arab States" },
  { n:"Qatar",cc:"qa",h:false,s:"800MW solar. AgTech investment.",t:["Energy","AgTech"],r:"Arab States" },
  { n:"Kuwait",cc:"kw",h:false,s:"Net Zero 2060. Desal modernization.",t:["Water","Energy"],r:"Arab States" },
  { n:"Tunisia",cc:"tn",h:false,s:"EU green transition link.",t:["Energy"],r:"Arab States" },
  { n:"Somalia",cc:"so",h:false,s:"Off-grid RE. Water critical.",t:["Water","Energy"],r:"East Africa" },
  { n:"Turkey",cc:"tr",h:false,s:"Major cleantech market. EU bridge.",t:["Energy","Water"],r:"Arab States" },
  { n:"Pakistan",cc:"pk",h:false,s:"220M+ population. Water & energy crisis.",t:["Water","Energy"],r:"South Asia" },
  { n:"Kenya",cc:"ke",h:true,s:"Africa's cleantech leader. Geothermal hub.",t:["Energy","Water"],gw:"Gateway to East Africa",r:"East Africa" },
  { n:"Tanzania",cc:"tz",h:false,s:"Solar & water treatment growth.",t:["Energy","Water"],r:"East Africa" },
  { n:"Ethiopia",cc:"et",h:false,s:"Grand RE ambitions. AgTech potential.",t:["Energy","AgTech"],r:"East Africa" },
  { n:"Mozambique",cc:"mz",h:false,s:"Renewable energy frontier.",t:["Energy"],r:"East Africa" },
  { n:"Burundi",cc:"bi",h:false,s:"Off-grid solar. Water security.",t:["Energy","Water"],r:"East Africa" },
  { n:"Burkina Faso",cc:"bf",h:false,s:"Solar potential. Food security.",t:["Energy","AgTech"],r:"West Africa" },
  { n:"Cameroon",cc:"cm",h:false,s:"Diverse energy mix potential.",t:["Energy","Water"],r:"West Africa" },
  { n:"Senegal",cc:"sn",h:false,s:"West Africa RE leader.",t:["Energy"],r:"West Africa" },
  { n:"Georgia",cc:"ge",h:false,s:"Hydro & green energy hub.",t:["Energy"],r:"Caucasus" },
  { n:"Azerbaijan",cc:"az",h:false,s:"Energy transition from oil & gas.",t:["Energy"],r:"Caucasus" },
  { n:"Armenia",cc:"am",h:false,s:"Solar potential. Water management.",t:["Energy","Water"],r:"Caucasus" },
  { n:"India",cc:"in",h:true,s:"World's largest RE expansion.",t:["Energy","Water","AgTech"],gw:"Gateway to South Asia",r:"South Asia" },
  { n:"Nepal",cc:"np",h:false,s:"Hydro & mountain RE potential.",t:["Energy"],r:"South Asia" },
  { n:"Indonesia",cc:"id",h:true,s:"Largest SE Asian economy. Green transition.",t:["Energy","Water"],gw:"Gateway to Southeast Asia",r:"Southeast Asia" },
  { n:"Kyrgyzstan",cc:"kg",h:false,s:"Hydro & clean energy potential.",t:["Energy"],r:"Central Asia" },
  { n:"China",cc:"cn",h:false,s:"Global cleantech manufacturing hub.",t:["Energy","Water","AgTech"],r:"East Asia" },
  { n:"Vietnam",cc:"vn",h:false,s:"Fast-growing RE market.",t:["Energy"],r:"East Asia" },
  { n:"South Korea",cc:"kr",h:false,s:"Green New Deal. H2 economy leader.",t:["Energy"],r:"East Asia" },
  { n:"Switzerland",cc:"ch",h:true,s:"GIWEH HQ. Global coordination hub.",t:["Water","Energy","AgTech"],gw:"Global HQ",r:"Europe" },
  { n:"North Macedonia",cc:"mk",h:false,s:"EU accession green transition.",t:["Energy"],r:"Europe" },
  { n:"Hungary",cc:"hu",h:false,s:"EU green policy implementation.",t:["Energy"],r:"Europe" },
  { n:"Brazil",cc:"br",h:false,s:"Latin America's green giant.",t:["Energy","Water","AgTech"],r:"Latin America" },
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
  const stats=[{v:35,p:"",s:"+",l:"Country network"},{v:115,p:"$",s:"B",l:"Market by 2030"},{v:630,p:"$",s:"M+",l:"Programmes managed"},{v:1500,p:"",s:"+",l:"Startups accelerated"},{v:20,p:"",s:"+",l:"Years experience"}];
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
  const g=[{t:"The Regulatory Maze",d:"European founders lack local networks and operational partners to navigate procurement and regulation across diverse Arab markets.",i:"https://api.iconify.design/lucide/landmark.svg?color=%232BAC22&width=48"},{t:"The Climate Mismatch",d:"TRL 9 technology proven in European weather often fails in Arab heat, humidity, and salinity. Without climate adaptation, sales stall.",i:"https://api.iconify.design/lucide/thermometer-sun.svg?color=%232BAC22&width=48"},{t:"The Expansion Dead-End",d:"Without a local operating partner, market entry costs are prohibitive. Most European companies give up within 12 months.",i:"https://api.iconify.design/lucide/shield-x.svg?color=%232BAC22&width=48"},{t:"The Operational Vacuum",d:"No local specialized support infrastructure exists to install, maintain, and service European environmental technology on the ground.",i:"https://api.iconify.design/lucide/wrench.svg?color=%232BAC22&width=48"}];
  return <section id="problem" style={{background:C.ch,padding:"100px 24px"}}>
    <div style={{maxWidth:1200,margin:"0 auto"}}>
      <div style={{fontFamily:F,fontSize:11,fontWeight:700,letterSpacing:"0.12em",marginBottom:12,textTransform:"uppercase"}}><Grad>The Innovation Gap</Grad></div>
      <h2 style={{fontFamily:F,fontSize:"clamp(24px,3.5vw,40px)",fontWeight:800,color:C.w,marginBottom:14,letterSpacing:"-0.02em"}}>Why European Green Tech Stalls at the Border</h2>
      <p style={{fontFamily:F,fontSize:14,color:C.tl,maxWidth:660,lineHeight:1.8,marginBottom:48,fontWeight:400}}>European cleantech companies are ready to export, but the destination isn't ready to receive them. Four structural gaps block the path.</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(255px,1fr))",gap:14}}>
        {g.map((x,i)=><div key={i} style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:12,padding:"28px 22px",borderTop:`3px solid ${C.g}`}}>
          <div style={{marginBottom:14,display:"flex",justifyContent:"center"}}><img src={x.i} alt="" style={{width:44,height:44}}/></div>
          <h3 style={{fontFamily:F,fontSize:17,fontWeight:700,color:C.w,marginBottom:8}}>{x.t}</h3>
          <p style={{fontFamily:F,fontSize:12.5,color:C.tl,lineHeight:1.7,fontWeight:400}}>{x.d}</p>
        </div>)}
      </div>
    </div>
  </section>;
}

function Services() {
  const t=[
    {n:"Scout & De-risk",tg:"Know your market",tm:"4 weeks",ft:["Market entry brief with target countries","Competitive landscape analysis","Regulatory requirements mapping","Procurement channel identification","1 strategy call with MENA team"],b:"Companies exploring MENA for the first time",p:"Fixed retainer (one-time)"},
    {n:"Deploy",tg:"Meet your buyers",tm:"8–12 weeks",featured:true,ft:["Everything in Explorer","5–10 curated buyer introductions","Government procurement connections","Local distributor matching","2 facilitated decision-maker meetings"],b:"Companies ready to start buyer conversations",p:"Retainer + success fee"},
    {n:"Scale",tg:"We become your MENA arm",tm:"6–12 months",ft:["Everything in Accelerator","First MENA contract or pilot","On-ground ops (KSA, Jordan, Egypt)","Compliance, logistics & management","Exclusive or semi-exclusive representation"],b:"Companies ready to deploy with a local partner",p:"Retainer + commission + margin"},
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
  function calc(a){let sc=0;const sd=sectorData[a.sector]||{};sc+=({"Water Treatment & Desalination":28,"Renewable Energy & Storage":30,"Waste Management & Circular Economy":22,"AgTech & Smart Farming":26,"Environmental IoT & Monitoring":20,"Green Hydrogen":25})[a.sector]||20;sc+=({"TRL 6–7 (Prototype/Demo)":8,"TRL 8 (System complete)":14,"TRL 9 (Proven in operation)":18,"Already commercialized":20})[a.trl]||10;let cl=0;if(a.heat==="Yes, fully validated")cl+=10;else if(a.heat==="Partially tested")cl+=5;if(a.water==="No water needed")cl+=6;else if(a.water==="Minimal water")cl+=3;if(a.maint==="Fully remote capable")cl+=4;else if(a.maint==="Some local support")cl+=2;sc+=cl;sc+=({"Pre-revenue":3,"Under €1M":6,"€1M – €5M":10,"€5M – €20M":13,"€20M+":15})[a.revenue]||5;const ps=({"None at all":3,"Some conversations":7,"Active distributor/partner":11,"Operational presence":15})[a.mena]||3;const ts=({"Exploring (12+ months)":1,"Planning (6–12 months)":4,"Ready now (< 6 months)":6,"Already started":7})[a.time]||2;const gs=({"Market intelligence only":1,"Finding buyers & partners":3,"First pilot project":5,"Full market entry & distribution":6})[a.goal]||2;sc+=Math.round((ps+ts+gs)/2);sc=Math.min(Math.max(sc,15),97);const tc=(sd.countries||["Saudi Arabia","UAE","Egypt"]).slice(0,3);const ri=[];if(a.heat==="No, European conditions only")ri.push("Climate adaptation required before deployment");if(a.water==="Yes, significant water")ri.push("Water-intensive tech faces constraints in water-scarce markets");if(a.maint==="Specialized on-site teams")ri.push("Local O&M capability will need to be built");if(a.trl?.includes("6–7"))ri.push("Further validation needed before commercial pilots");if(!ri.length)ri.push("Strong profile — focus on speed of market entry");let tier="Scout & De-risk";if(a.goal==="Full market entry & distribution"||a.time==="Already started")tier="Scale";else if(a.goal==="Finding buyers & partners"||a.goal==="First pilot project")tier="Deploy";setRes({sc,tc,m:sd.market||"Growing",g:sd.growth||"High",d:sd.detail||"",ri,tier});}

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

  // Country clickable areas: x,y = center%, w,h = width/height% of map, gw = gateway
  const areas = [
    // Arab States
    {n:"Egypt",x:52,y:38,w:5,h:6,gw:1},{n:"Jordan",x:54,y:34,w:3,h:3,gw:1},
    {n:"Saudi Arabia",x:56,y:42,w:8,h:8,gw:1},{n:"Morocco",x:42,y:34,w:5,h:5,gw:1},
    {n:"Iraq",x:56,y:34,w:4,h:4,gw:0},{n:"Lebanon",x:54,y:32,w:2,h:2,gw:0},
    {n:"Palestine",x:53,y:33,w:2,h:2,gw:0},{n:"Qatar",x:59,y:40,w:2,h:2,gw:0},
    {n:"Kuwait",x:58,y:36,w:2,h:2,gw:0},{n:"Tunisia",x:47,y:33,w:3,h:3,gw:0},
    {n:"Turkey",x:53,y:30,w:5,h:3,gw:0},{n:"Somalia",x:56,y:54,w:4,h:5,gw:0},
    // East & West Africa
    {n:"Kenya",x:55,y:52,w:4,h:4,gw:1},{n:"Tanzania",x:55,y:56,w:4,h:4,gw:0},
    {n:"Ethiopia",x:56,y:49,w:4,h:4,gw:0},{n:"Mozambique",x:55,y:62,w:3,h:5,gw:0},
    {n:"Burundi",x:53,y:56,w:2,h:2,gw:0},{n:"Burkina Faso",x:41,y:44,w:3,h:3,gw:0},
    {n:"Cameroon",x:47,y:48,w:3,h:3,gw:0},{n:"Senegal",x:38,y:44,w:3,h:3,gw:0},
    // South/SE Asia
    {n:"Pakistan",x:62,y:36,w:4,h:4,gw:0},{n:"India",x:66,y:42,w:6,h:7,gw:1},
    {n:"Nepal",x:67,y:36,w:3,h:2,gw:0},{n:"Indonesia",x:75,y:54,w:6,h:4,gw:1},
    {n:"Kyrgyzstan",x:65,y:30,w:3,h:2,gw:0},
    // East Asia
    {n:"China",x:72,y:32,w:8,h:8,gw:0},{n:"Vietnam",x:74,y:44,w:3,h:4,gw:0},
    {n:"South Korea",x:78,y:32,w:3,h:3,gw:0},
    // Caucasus
    {n:"Georgia",x:56,y:28,w:2,h:2,gw:0},{n:"Azerbaijan",x:57,y:29,w:2,h:2,gw:0},
    {n:"Armenia",x:56,y:29,w:2,h:2,gw:0},
    // Europe
    {n:"Switzerland",x:47,y:26,w:2,h:2,gw:1},{n:"North Macedonia",x:50,y:28,w:2,h:2,gw:0},
    {n:"Hungary",x:49,y:26,w:3,h:2,gw:0},
    // Latin America
    {n:"Brazil",x:30,y:58,w:7,h:8,gw:0},
  ]

  const countryDetails = {
    "Egypt":{pop:"106M",gdp:"$347B",gdppc:"$3,270",green:"$19.8B",opp:["$17.7B water infrastructure plan","42% renewables target by 2030","$14.7B NWFE climate projects","100M+ tons solid waste — waste-to-energy","Scaling desalination 7x by 2030"]},
    "Jordan":{pop:"11.5M",gdp:"$50B",gdppc:"$4,350",green:"$3B+",opp:["$3B+ Aqaba-Amman desalination mega-project","50% renewable energy target by 2030","World's 5th most water-scarce country","$60B Economic Modernization Vision","45% non-revenue water loss — smart water"]},
    "Saudi Arabia":{pop:"36M",gdp:"$1,084B",gdppc:"$30,099",green:"$12.8B",opp:["Green tech market to $12.8B by 2030","130 GW renewable capacity planned","Vision 2030 + NEOM smart city","50% energy from renewables by 2030","$8.3B in 7 new renewable projects"]},
    "Morocco":{pop:"37M",gdp:"$154B",gdppc:"$4,162",green:"$5.6B",opp:["$5.6B solar/wind underway","52% renewables target by 2030","90% energy currently imported","Green hydrogen $120B+ by 2050","Xlinks $20B UK interconnector"]},
    "UAE":{pop:"10M",gdp:"$549B",gdppc:"$49,498",green:"$40B+",opp:["$40B+ clean energy investment","Net Zero 2050 target","ALTERRA $30B climate fund","$36B NDC investment 2023-2030","Solar Park 5 GW by 2030"]},
    "Qatar":{pop:"3M",gdp:"$220B",gdppc:"$71,653",green:"Growing",opp:["800 MW Al Kharsaah solar","20% renewable target","AgTech & alt protein","$200M vertical farming","Food security programs"]},
    "Oman":{pop:"5M",gdp:"$105B",gdppc:"$21,000",green:"Growing",opp:["Net Zero 2050 target","Green H2 hub Duqm & Salalah","Solar desalination","Strategic port access","Energy diversification"]},
    "Bahrain":{pop:"1.5M",gdp:"$44B",gdppc:"$29,333",green:"$30B plan",opp:["$30B Strategic Projects","Waste-to-energy 2025","Food Sustainability","Net Zero 2060","Saudi gateway"]},
    "Kuwait":{pop:"4.5M",gdp:"$160B",gdppc:"$35,556",green:"Growing",opp:["Net Zero 2060","KIA climate integration","RE expansion program","Al Shagaya complex","Desal modernization"]},
    "Iraq":{pop:"44M",gdp:"$264B",gdppc:"$6,000",green:"Massive gap",opp:["Top 5 Arab electricity","Massive infra rebuilding","Water treatment urgent","Demand exceeding supply","Oil-to-gas conversion"]},
    "Algeria":{pop:"45M",gdp:"$238B",gdppc:"$5,289",green:"Huge potential",opp:["2,700% RE increase needed","Blue hydrogen pivot","22 GW RE by 2030","Vast Sahara solar","Desal expansion"]},
    "Tunisia":{pop:"12M",gdp:"$46B",gdppc:"$3,833",green:"Growing",opp:["Growing RE sector","EU green transition","Water stress increasing","Solar potential","Waste modernization"]},
    "Libya":{pop:"7M",gdp:"$41B",gdppc:"$5,857",green:"Rebuilding",opp:["Post-conflict rebuild","2,000 MW Egypt link","Oil revenue for green","Vast solar potential","Water infra rebuild"]},
    "Sudan":{pop:"48M",gdp:"$30B",gdppc:"$625",green:"Untapped",opp:["RE like Morocco & Egypt","Undeveloped potential","Red Sea H2 export","Agri modernization","Water treatment"]},
    "Mauritania":{pop:"5M",gdp:"$10B",gdppc:"$2,000",green:"Frontier",opp:["Top 5 RE FDI Arab","H2 & wind frontier","AMAN H2 mega-project","30 GW wind & solar","Atlantic coast"]},
    "Lebanon":{pop:"5.5M",gdp:"$20B",gdppc:"$3,636",green:"Crisis-driven",opp:["Energy crisis = solar","Decentral solar growing","Water infra needs","Waste crisis","Rebuilding opportunity"]},
    "Palestine":{pop:"5.5M",gdp:"$18B",gdppc:"$3,273",green:"Critical need",opp:["Top water importer","Solar growing","Water treatment critical","Limited energy infra","Agri water efficiency"]},
    "Yemen":{pop:"34M",gdp:"$20B",gdppc:"$588",green:"Humanitarian",opp:["Water & energy crisis","Off-grid solar","Water purification","Humanitarian green tech","Decentralized energy"]},
    "Somalia":{pop:"18M",gdp:"$8B",gdppc:"$444",green:"Early stage",opp:["Off-grid RE demand","Water purification","High-need market","Solar electrification","Climate adaptation"]},
    "Djibouti":{pop:"1M",gdp:"$4B",gdppc:"$4,000",green:"Strategic",opp:["Red Sea location","Geothermal & solar","Desal for water","E. Africa logistics hub","Climate resilience"]},
    "Comoros":{pop:"0.9M",gdp:"$1.3B",gdppc:"$1,444",green:"Small scale",opp:["Island solar","Waste management","Water security","Small-scale RE","Climate adaptation"]},
    "Turkey":{pop:"85M",gdp:"$1,108B",gdppc:"$13,035",green:"$15B+",opp:["EU Green Deal alignment","Massive RE expansion underway","Water management modernization","Cleantech manufacturing hub","Bridge between EU and MENA"]},
    "Pakistan":{pop:"230M",gdp:"$350B",gdppc:"$1,522",green:"Growing",opp:["Severe water & energy crisis","100GW+ RE potential","Largest irrigation system globally","$100B climate vulnerability","Off-grid solar demand"]},
    "Kenya":{pop:"56M",gdp:"$113B",gdppc:"$2,017",green:"$5B+",opp:["Africa's geothermal leader","90%+ RE electricity grid","Climate-smart agriculture demand","Water purification needs","Innovation hub for East Africa"]},
    "Tanzania":{pop:"65M",gdp:"$77B",gdppc:"$1,185",green:"Growing",opp:["Solar & wind expansion","Rural electrification demand","Water treatment critical","Agricultural modernization","Mining sector green transition"]},
    "Ethiopia":{pop:"126M",gdp:"$156B",gdppc:"$1,238",green:"Growing",opp:["Grand Ethiopian RE ambitions","Africa's 2nd largest population","Hydro & geothermal potential","AgTech for food security","Green industrialization"]},
    "Mozambique":{pop:"33M",gdp:"$19B",gdppc:"$576",green:"Frontier",opp:["Vast RE potential","LNG-to-green transition","Rural electrification","Water security challenges","Climate adaptation urgent"]},
    "Burundi":{pop:"13M",gdp:"$3.6B",gdppc:"$277",green:"Early stage",opp:["Off-grid solar demand","Water security critical","Agricultural modernization","Climate vulnerability","Small-scale RE solutions"]},
    "Burkina Faso":{pop:"23M",gdp:"$19B",gdppc:"$826",green:"Growing",opp:["Sahel solar potential","Food security critical","Water management needs","Climate adaptation","Off-grid energy demand"]},
    "Cameroon":{pop:"28M",gdp:"$45B",gdppc:"$1,607",green:"Growing",opp:["Diverse energy mix","Hydro expansion","Agricultural modernization","Water treatment needs","Waste management"]},
    "Senegal":{pop:"18M",gdp:"$28B",gdppc:"$1,556",green:"Growing",opp:["West Africa RE leader","Gas-to-green transition","Water desalination growing","Smart agriculture","Climate resilience"]},
    "Georgia":{pop:"3.7M",gdp:"$25B",gdppc:"$6,757",green:"Growing",opp:["Hydro & green energy hub","EU association green targets","Water management","Sustainable tourism","Energy efficiency"]},
    "Azerbaijan":{pop:"10M",gdp:"$72B",gdppc:"$7,200",green:"Transitioning",opp:["COP29 host — green commitment","Oil-to-RE transition","Wind & solar Caspian","Water management","Green hydrogen"]},
    "Armenia":{pop:"3M",gdp:"$20B",gdppc:"$6,667",green:"Growing",opp:["Solar potential","Water management","Nuclear-to-RE transition","AgTech mountain farming","Energy efficiency"]},
    "India":{pop:"1.4B",gdp:"$3,940B",gdppc:"$2,814",green:"$50B+",opp:["World's largest RE expansion","500 GW RE target by 2030","$100B+ green hydrogen plan","Water crisis affecting 600M","Smart agriculture revolution"]},
    "Nepal":{pop:"30M",gdp:"$42B",gdppc:"$1,400",green:"Growing",opp:["Massive hydro potential","Mountain RE solutions","Water management","Climate-smart agriculture","Off-grid energy"]},
    "Indonesia":{pop:"275M",gdp:"$1,319B",gdppc:"$4,796",green:"$20B+",opp:["World's largest archipelago","Coal-to-RE transition","$20B Just Energy Transition","Water & waste management","Sustainable agriculture"]},
    "Kyrgyzstan":{pop:"7M",gdp:"$11B",gdppc:"$1,571",green:"Growing",opp:["Hydro & clean energy","Water management Central Asia","Agricultural modernization","Climate adaptation mountain","Green mining"]},
    "China":{pop:"1.4B",gdp:"$18,530B",gdppc:"$13,236",green:"$500B+",opp:["Global cleantech manufacturing","World's largest RE installer","Green hydrogen leader","Water treatment innovation","AgTech & smart farming at scale"]},
    "Vietnam":{pop:"100M",gdp:"$430B",gdppc:"$4,300",green:"$15B+",opp:["Fastest growing RE in SE Asia","Solar boom underway","Water treatment demand","Green manufacturing","Climate adaptation coastal"]},
    "South Korea":{pop:"52M",gdp:"$1,721B",gdppc:"$33,096",green:"$40B+",opp:["Green New Deal $62B plan","Hydrogen economy leader","Smart water infrastructure","Green tech export hub","Climate tech innovation"]},
    "Switzerland":{pop:"8.8M",gdp:"$870B",gdppc:"$98,864",green:"HQ",opp:["GIWEH headquarters","Global cleantech hub","Innovation & IP center","International coordination","Climate finance center"]},
    "North Macedonia":{pop:"2M",gdp:"$14B",gdppc:"$7,000",green:"Growing",opp:["EU accession green targets","RE expansion needed","Water management","Energy efficiency","Green transition support"]},
    "Hungary":{pop:"10M",gdp:"$184B",gdppc:"$18,400",green:"Growing",opp:["EU Green Deal alignment","Solar expansion","Water management Danube","Energy efficiency buildings","Green industry transition"]},
    "Brazil":{pop:"215M",gdp:"$2,127B",gdppc:"$9,893",green:"$30B+",opp:["Latin America's green giant","World leader in bioenergy","Amazon water & climate","Green hydrogen ambitions","AgTech & sustainable farming"]},
    "Syria":{pop:"23M",gdp:"$12B",gdppc:"$522",green:"Future market",opp:["Post-conflict rebuild","Water & energy devastated","Massive future market","Agri restoration","All infra to rebuild"]},
  };

  return <section id="markets" style={{background:C.ch,padding:"100px 24px"}}><div style={{maxWidth:1200,margin:"0 auto"}}>
    <div style={{fontFamily:F,fontSize:11,fontWeight:700,letterSpacing:"0.12em",marginBottom:12,textTransform:"uppercase"}}><Grad>35+ Countries</Grad></div>
    <h2 style={{fontFamily:F,fontSize:"clamp(24px,3.5vw,40px)",fontWeight:800,color:C.w,marginBottom:14}}>Global Network, Local Deployment</h2>
    <p style={{fontFamily:F,fontSize:14,color:C.tl,maxWidth:660,lineHeight:1.8,marginBottom:24,fontWeight:400}}>Click on any country to explore its population, economy, and green technology opportunities across our 35+ country network.</p>

    {/* Gateway badges */}
    <div style={{display:"flex",gap:8,marginBottom:28,flexWrap:"wrap"}}>
      {countries.filter(c=>c.h).map((c,i)=><button key={i} onClick={()=>setSel(c.n)} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",borderRadius:8,background:sel===c.n?"rgba(43,172,34,0.15)":"rgba(43,172,34,0.05)",border:sel===c.n?`1px solid ${C.g}`:"1px solid rgba(43,172,34,0.15)",cursor:"pointer",transition:"all .2s"}}>
        <Flag code={c.cc} size={18}/>
        <span style={{fontFamily:F,fontSize:11,fontWeight:700,color:sel===c.n?C.w:C.g}}>{c.n}</span>
      </button>)}
    </div>

    <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
      {/* Map with clickable country areas */}
      <div style={{flex:"1 1 520px",position:"relative",borderRadius:14,border:"1px solid rgba(255,255,255,0.05)",overflow:"hidden"}}>
        <img src="/arab-map.png" alt="Arab World" style={{width:"100%",display:"block",borderRadius:14}}/>
        
        {/* Clickable transparent areas for each country */}
        {areas.map((a,i)=>{
          const isSel=sel===a.n;
          const isGw=a.gw===1;
          return <div key={i} onClick={()=>setSel(sel===a.n?null:a.n)} 
            title={a.n}
            style={{
              position:"absolute",
              left:`${a.x-a.w/2}%`,top:`${a.y-a.h/2}%`,
              width:`${a.w}%`,height:`${a.h}%`,
              cursor:"pointer",zIndex:isSel?20:10,
              background:isSel?"rgba(43,172,34,0.15)":"transparent",
              border:isSel?`1.5px solid rgba(43,172,34,0.4)`:"1.5px solid transparent",
              borderRadius:6,
              transition:"all 0.25s",
              display:"flex",alignItems:"center",justifyContent:"center",
            }}>
            {/* Dot marker */}
            <div style={{
              width:isGw?12:8,height:isGw?12:8,borderRadius:"50%",
              background:isGw?`linear-gradient(135deg,${C.gl},${C.gr})`:"rgba(144,223,62,0.7)",
              border:isSel?`2px solid ${C.w}`:"1.5px solid rgba(0,0,0,0.3)",
              boxShadow:isGw?"0 0 10px rgba(43,172,34,0.5)":"0 0 4px rgba(43,172,34,0.3)",
              transition:"all 0.3s",flexShrink:0,
            }}/>
          </div>;
        })}

        {/* Country name labels */}
        {areas.map((a,i)=>{
          const lbl = {
            "Morocco":{dx:0,dy:-3},"Tunisia":{dx:0,dy:-2.5},"Djibouti":{dx:0,dy:-2.5},
            "Palestine":{dx:-2,dy:-2.5},"Lebanon":{dx:-2,dy:-2.5},
            "Bahrain":{dx:2,dy:-2.5},"Qatar":{dx:2,dy:-1.5},"Kuwait":{dx:2,dy:-1.5},
            "Syria":{dx:0,dy:-3},
          }[a.n] || {dx:0,dy:1.5};
          return <div key={"lbl"+i} style={{
            position:"absolute",left:`${a.x+lbl.dx}%`,top:`${a.y+lbl.dy}%`,transform:lbl.dx!==0?"none":"translateX(-50%)",
            fontFamily:F,fontSize:a.gw?7:5,fontWeight:a.gw?600:400,
            color:sel===a.n?"rgba(255,255,255,0.9)":a.gw?"rgba(144,223,62,0.7)":"rgba(255,255,255,0.4)",
            textShadow:"0 1px 3px rgba(0,0,0,0.9),0 0 6px rgba(0,0,0,0.7)",pointerEvents:"none",
            whiteSpace:"nowrap",letterSpacing:"0.03em",
            transition:"all 0.3s",zIndex:2,
          }}>{a.n==="Saudi Arabia"?"KSA":a.n}</div>;
        })}
        {/* Legend */}
        <div style={{position:"absolute",bottom:10,left:"50%",transform:"translateX(-50%)",display:"flex",gap:16,background:"rgba(2,32,35,0.85)",padding:"6px 16px",borderRadius:8}}>
          <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:10,height:10,borderRadius:"50%",background:`linear-gradient(135deg,${C.gl},${C.gr})`}}/><span style={{fontFamily:F,fontSize:9,color:C.tl}}>Regional Gateway</span></div>
          <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:7,height:7,borderRadius:"50%",background:"rgba(144,223,62,0.7)"}}/><span style={{fontFamily:F,fontSize:9,color:C.td}}>Arab Market</span></div>
        </div>
      </div>

      {/* Detail Panel */}
      <div style={{flex:"1 1 320px",minWidth:280,position:"sticky",top:100,alignSelf:"flex-start"}}>
        {selected ? (()=>{
          const det = countryDetails[selected.n] || {};
          const cd = selected;
          return <div style={{background:"rgba(255,255,255,0.02)",borderRadius:14,border:`1px solid ${C.g}`,padding:24}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
              <Flag code={cd.cc} size={36}/>
              <div>
                <div style={{fontFamily:F,fontSize:22,fontWeight:800,color:C.w}}>{cd.n}</div>
                {cd.gw&&<div style={{fontFamily:F,fontSize:10,color:C.g,fontWeight:500,fontStyle:"italic"}}>{cd.gw}</div>}
              </div>
              <button onClick={()=>setSel(null)} style={{marginLeft:"auto",background:"none",border:"none",color:C.td,fontSize:18,cursor:"pointer",padding:4}}>x</button>
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
                <span style={{color:C.g,fontSize:12,marginTop:1,fontWeight:700}}>{">"}</span>
                <span style={{fontFamily:F,fontSize:11,color:C.tl,lineHeight:1.5,fontWeight:400}}>{o}</span>
              </div>
            ))}
            <button onClick={()=>scroll("contact")} style={{marginTop:16,width:"100%",padding:"12px 0",background:`linear-gradient(90deg,${C.gl},${C.gr})`,color:C.d1,border:"none",borderRadius:8,fontFamily:F,fontSize:12,fontWeight:700,cursor:"pointer"}}>Explore This Market</button>
          </div>;
        })() : (
          <div style={{background:"rgba(255,255,255,0.02)",borderRadius:14,border:"1px solid rgba(255,255,255,0.05)",padding:24,textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:300}}>
            <div style={{fontFamily:F,fontSize:16,fontWeight:700,color:C.w,marginBottom:8}}>Select a Country</div>
            <div style={{fontFamily:F,fontSize:12,color:C.td,lineHeight:1.6,maxWidth:240}}>Click anywhere on a country to explore its population, economy, and green technology opportunities.</div>
            <div style={{marginTop:20,fontFamily:F,fontSize:10,color:C.g,fontWeight:600}}>7 Regional Gateways | 35+ Countries</div>
          </div>
        )}
      </div>
    </div>

    {/* Quick access */}
    <div style={{marginTop:24}}>
      <div style={{fontFamily:F,fontSize:10,color:C.td,fontWeight:700,letterSpacing:"0.08em",marginBottom:10,textTransform:"uppercase"}}>All 35+ GIWEH Markets</div>
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
  const cr=[{v:20,p:"",s:"+",l:"Years of technical and commercial depth in green technology transfer"},{v:35,p:"",s:"+",l:"Countries with direct operational presence and government relationships"},{v:630,p:"$",s:"M+",l:"Programme portfolio managed across the GIWEH network"},{v:1500,p:"",s:"+",l:"Startups accelerated through global innovation programmes"},{v:3,p:"",s:"",l:"Domains: Water Security, Energy Resilience, Food Sovereignty"},{v:5,p:"",s:"",l:"Revenue lines built to recur across every deployment"}];

  const timeline=[
    {step:"01",title:"Assess",time:"4 weeks",color:C.g,desc:"We evaluate your technology's fit for MENA markets, identify target countries, and map the competitive landscape.",deliverable:"Written market entry brief with target countries, regulatory map, competitive analysis, and procurement channels"},
    {step:"02",title:"Connect",time:"8–12 weeks",color:"#90DF3E",desc:"We introduce you to pre-qualified buyers, government procurement officers, and local distribution partners.",deliverable:"5–10 curated introductions and 2 facilitated meetings with decision-makers"},
    {step:"03",title:"Deploy",time:"6–12 months",color:"#2BAC22",desc:"We facilitate your first MENA contract or pilot project through our local operations in KSA, Jordan, and Egypt.",deliverable:"Signed contract or active pilot — compliance, logistics, and client management handled"},
  ];

  const sectors=[
    {icon:"https://api.iconify.design/lucide/droplets.svg?color=%232BAC22&width=48",title:"Water Security",desc:"Desalination, solar-thermal purification, water reuse, atmospheric generation, and smart leak detection."},
    {icon:"https://api.iconify.design/lucide/sun.svg?color=%232BAC22&width=48",title:"Energy Resilience",desc:"Off-grid solutions, grid optimization, sustainable cooling, thermal batteries, and heat-rejecting passive materials."},
    {icon:"https://api.iconify.design/lucide/sprout.svg?color=%232BAC22&width=48",title:"Food Sovereignty",desc:"Controlled-environment agriculture, smart greenhouses, arid-climate farming, and soil regeneration."},
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
        <div style={{marginBottom:10,display:"flex",justifyContent:"center"}}><img src={s.icon} alt="" style={{width:44,height:44}}/></div>
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
    <div style={{marginTop:24,fontFamily:F,fontSize:11,color:C.td,fontWeight:400}}>Anchored by GIWEH, Geneva · EU invoicing & funding eligibility</div>
  </div></section>;
}

export default function App() {
  const [active,setActive]=useState("hero");
  useEffect(()=>{
    const l=document.createElement("link");l.href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap";l.rel="stylesheet";document.head.appendChild(l);
    const s=document.createElement("style");
    s.textContent=`
      *{margin:0;padding:0;box-sizing:border-box}
      body{background:${C.d1}}
      ::selection{background:rgba(43,172,34,0.3);color:white}
      input::placeholder,textarea::placeholder{color:rgba(245,245,240,0.25)}
      button:hover{opacity:0.92}
      select{color-scheme:dark}
      select option{background:#022023;color:#f5f5f0}
      html{scroll-behavior:smooth}
      @media(max-width:768px){
        .desktop-nav{display:none !important}
        .mobile-hamburger{display:flex !important}
        .mobile-menu{display:flex !important}
      }
    `;
    document.head.appendChild(s);
    const h=()=>{for(const id of["contact","about","markets","tool","services","problem","hero"]){const el=document.getElementById(id);if(el&&el.getBoundingClientRect().top<=200){setActive(id);break;}}};
    window.addEventListener("scroll",h);return()=>window.removeEventListener("scroll",h);
  },[]);
  return <div>
    <Nav active={active}/>
    <Hero/><Problem/><Services/><Tool/><Markets/><About/><Contact/>
    <footer style={{background:C.d1,padding:"32px 24px",borderTop:`1px solid rgba(43,172,34,0.08)`}}>
      <div style={{maxWidth:1200,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
        <img src="/logo-horizontal.png" alt="GreenTech Bridge Ventures" style={{height:26,opacity:0.8}} />
        <div style={{fontFamily:F,fontSize:10,color:C.td,fontWeight:400}}>Proven Green Technology → Markets That Need It Most · Anchored by GIWEH, Geneva</div>
        <div style={{fontFamily:F,fontSize:9,color:C.td}}>© {new Date().getFullYear()} GreenTech Bridge Ventures</div>
      </div>
    </footer>
  </div>;
}
