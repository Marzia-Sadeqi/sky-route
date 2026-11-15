import {useState,useRef} from 'react';
import {Link,useNavigate,useParams,Navigate} from 'react-router-dom';
import {motion,AnimatePresence,useScroll,useTransform} from 'framer-motion';
import {PLACES,photo,money,emailRe} from './data.js';
import {up,Reveal,Stagger,Head,VBg,Clip,PageHead,Statement,Tile} from './ui.jsx';
const today=()=>new Date().toISOString().split('T')[0];

export function Home(){
  const nav=useNavigate();const [f,setF]=useState({to:'paris',d:'',r:'',pax:1});const [em,setEm]=useState('');const [nm,setNm]=useState('');
  const set=k=>e=>setF({...f,[k]:e.target.value});
  const hr=useRef(null);const {scrollYProgress:hp}=useScroll({target:hr,offset:['start start','end start']});
  const hy=useTransform(hp,[0,1],[0,120]),ho=useTransform(hp,[0,.8],[1,0]),hs=useTransform(hp,[0,1],[1,.92]);
  const deals=[...PLACES].sort((a,b)=>a.price-b.price).slice(0,3);
  return(<>
    <div className="vsec hero" ref={hr}><VBg name="hero"/>
      <motion.div className="wrap" style={{y:hy,opacity:ho,scale:hs}}>
        <motion.div className="eyebrow" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.1}}>Flights from Kabul</motion.div>
        <motion.h1 initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{delay:.2,duration:.9,ease:[.22,1,.36,1]}}>The world,<br/>within reach.</motion.h1>
        <motion.p initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:.45,duration:.8}}>Discover the most beautiful places on Earth and book your ticket from Kabul in minutes.</motion.p>
        <motion.form className="glass search" initial={{opacity:0,y:50}} animate={{opacity:1,y:0}} transition={{delay:.7,duration:.8}} onSubmit={e=>{e.preventDefault();nav(`/flights?to=${f.to}&date=${f.d}&ret=${f.r}&pax=${f.pax}`)}}>
          <div><label htmlFor="f">From</label><input id="f" value="Kabul (KBL)" disabled/></div>
          <div><label htmlFor="t">To</label><select id="t" value={f.to} onChange={set('to')}>{PLACES.map(p=><option key={p.id} value={p.id}>{p.city}</option>)}</select></div>
          <div><label htmlFor="d">Depart</label><input id="d" type="date" min={today()} value={f.d} onChange={set('d')} required/></div>
          <div><label htmlFor="r">Return (optional)</label><input id="r" type="date" min={f.d||today()} value={f.r} onChange={set('r')}/></div>
          <div><label htmlFor="p">Travellers</label><input id="p" type="number" min="1" max="9" value={f.pax} onChange={set('pax')}/></div>
          <button className="btn" type="submit">Search flights</button></motion.form></motion.div></div>
    <section style={{paddingBottom:40}}><div className="wrap"><Head title="Best deals from Kabul." text="Lowest sample fares right now."/>
      <Stagger className="cards">{deals.map(p=><motion.div key={p.id} variants={up} whileHover={{y:-8}}><Link to={`/flights?to=${p.id}`} className="box deal"><small>Kabul → {p.city}</small><div className="n">{money(p.price)}</div><p>{p.time} · one way · economy</p><span className="btn line">See flights</span></Link></motion.div>)}</Stagger></div></section>
    <section><div className="wrap"><Statement text="Every great journey starts with one ticket. We make it simple, clear and beautiful, from Kabul to the best places in the world."/></div></section>
    <section className="gray"><div className="wrap"><Head title="Beautiful places." text="Eight destinations our travellers love most."/>
      <div className="tiles">{PLACES.slice(0,4).map((p,i)=><Tile key={p.id} p={p} big={i===0}/>)}</div>
      <Reveal style={{textAlign:'center',marginTop:44}}><Link className="btn line" to="/destinations">See all places</Link></Reveal></div></section>
    <section><div className="wrap vfeat"><Reveal className="vtxt"><div className="eyebrow">Fly over paradise</div><h2>See it from above.</h2><p>Islands, rivers and coastlines look different from 35,000 feet. Pick your destination, choose a window seat and watch the world open up.</p>
      <ul className="vlist"><li>Direct and one-stop flights</li><li>Full price shown before you confirm</li><li>E-ticket with a booking reference</li></ul><Link className="btn" to="/destinations">Choose your destination</Link></Reveal>
      <Reveal className="vcard"><Clip n={4} label="An aircraft flying over turquoise islands"/></Reveal></div></section>
    <section className="vsec"><VBg n={2} v="soft"/><div className="wrap"><Head title="Why SkyRoute." text="Everything you need, nothing you don't."/>
      <Stagger className="cards">{[['Simple','One clear flow from search to e-ticket.'],['Clear','See the full price before you confirm.'],['Yours','Create an account, save places and manage trips.'],['Everywhere','Beautiful on phone, tablet and desktop.']].map(([t,x])=>
        <motion.div key={t} variants={up} whileHover={{y:-8}} className="glass box"><h3>{t}</h3><p>{x}</p></motion.div>)}</Stagger></div></section>
    <section><div className="wrap"><Head title="Book in four steps." text="From dream to ticket in about three minutes."/>
      <Stagger className="cards">{[['Search','Choose a place and your dates.'],['Compare','Pick the flight that fits you best.'],['Confirm','Log in and enter traveller details.'],['Fly','Get your e-ticket with a booking reference.']].map(([t,x],i)=>
        <motion.div key={t} variants={up} className="box gbox"><div className="n">{i+1}</div><h3>{t}</h3><p>{x}</p></motion.div>)}</Stagger></div></section>
    <section className="gray"><div className="wrap"><Head title="Travel smart." text="Simple tips before you fly."/>
      <Stagger className="cards">{[['Documents','Check your passport validity and the visa rules of your destination on the official embassy website.'],['Packing','Pack light, keep medicines and documents in your hand luggage, and check the baggage limit.'],['Arrive early','Be at Kabul airport about three hours before an international flight.'],['Stay safe','Keep digital and paper copies of your ticket, passport and insurance.']].map(([t,x])=>
        <motion.div key={t} variants={up} className="box"><h3>{t}</h3><p>{x}</p></motion.div>)}</Stagger></div></section>
    <section><div className="wrap"><Stagger className="stats">{[['8+','Destinations'],['4','Sample airlines'],['3 min','Average booking'],['24/7','Online access']].map(([b,t])=><motion.div key={t} variants={up}><b>{b}</b><span>{t}</span></motion.div>)}</Stagger></div></section>
    <section className="gray"><div className="wrap"><Head title="Loved by travellers." text="Example reviews for this student project."/>
      <Stagger className="cards">{[['"I booked Istanbul in two minutes. Very easy!"','Ahmad R.'],['"Clear prices and beautiful photos."','Sara M.'],['"Perfect for planning a family holiday to Dubai."','Hamid K.']].map(([q,n])=>
        <motion.div key={n} variants={up} className="box"><p style={{fontSize:'1.15rem',color:'var(--ink)',fontWeight:500}}>{q}</p><h3 style={{fontSize:'1rem',marginTop:16}}>{n}</h3></motion.div>)}</Stagger></div></section>
    <section><div className="wrap" style={{maxWidth:640}}><Head title="Get travel ideas." text="One short email with new places and deals."/>
      <Reveal><form className="news" onSubmit={e=>{e.preventDefault();setNm(emailRe.test(em)?'ok':'bad');if(emailRe.test(em))setEm('')}} noValidate><input aria-label="Email" placeholder="Your email" value={em} onChange={e=>setEm(e.target.value)}/><button className="btn" type="submit">Subscribe</button></form>
        {nm&&<div className={'msg '+nm} role="alert">{nm==='ok'?'Thank you for subscribing!':'Please enter a valid email.'}</div>}</Reveal></div></section>
    <section className="gray"><div className="wrap" style={{maxWidth:800}}><Head title="Questions?" text="Quick answers before you fly."/>
      {[['Do I need an account?','You can search and explore freely. You need a free account to book, save places and see your trips.'],['Do I need a passport?','Yes. You must enter a valid passport number when booking.'],['Can I cancel a booking?','Yes. Open My Trips and press Cancel.'],['Are prices and flights real?','No. This is a student demo, so flights and prices are examples.']].map(([q,a])=>
        <Reveal key={q}><details><summary>{q}</summary><p>{a}</p></details></Reveal>)}</div></section>
    <div className="vsec cta"><VBg n={3} v="fade"/><div className="wrap"><Reveal><h2>Your seat is waiting.</h2><p>Book your flight from Kabul today.</p><Link className="btn" to="/flights">Find flights</Link></Reveal></div></div></>);
}

export function Destinations(){
  const [cat,setCat]=useState('All');const [q,setQ]=useState('');const [sort,setSort]=useState('pop');
  let list=PLACES.filter(p=>(cat==='All'||p.cat===cat)&&(p.city+p.country).toLowerCase().includes(q.toLowerCase()));
  if(sort==='low')list=[...list].sort((a,b)=>a.price-b.price);
  return(<><PageHead n={4} title="Beautiful places." text="Search, filter and save the places you love."/>
    <section style={{paddingTop:60}}><div className="wrap"><div className="chips">{['All','Europe','Asia','Islands','Americas'].map(c=><button key={c} className={'chip'+(cat===c?' on':'')} onClick={()=>setCat(c)}>{c}</button>)}</div>
      <div className="filters"><div><label htmlFor="q">Search a city or country</label><input id="q" placeholder="e.g. Paris" value={q} onChange={e=>setQ(e.target.value)}/></div>
        <div><label htmlFor="s">Sort by</label><select id="s" value={sort} onChange={e=>setSort(e.target.value)}><option value="pop">Popular</option><option value="low">Lowest price</option></select></div></div>
      <motion.div layout className="tiles"><AnimatePresence mode="popLayout">{list.map(p=><motion.div layout key={p.id} initial={{opacity:0,scale:.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:.9}}><Tile p={p}/></motion.div>)}</AnimatePresence>
        {!list.length&&<p className="empty">No places found. Try another search.</p>}</motion.div></div></section></>);
}

export function Detail(){
  const {id}=useParams();const p=PLACES.find(x=>x.id===id);if(!p)return <Navigate to="/destinations" replace/>;
  const more=PLACES.filter(x=>x.id!==id&&x.cat===p.cat).concat(PLACES.filter(x=>x.cat!==p.cat)).slice(0,2);
  return(<><div className="vsec ph dh"><img className="vbg" src={photo(p.img,1800)} alt={`${p.city}, ${p.country}`} onError={e=>e.target.style.visibility='hidden'}/><div className="vov"/>
    <motion.h1 initial={{opacity:0,y:30}} animate={{opacity:1,y:0}}>{p.city}</motion.h1><motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.3}}>{p.country} · {p.info}</motion.p>
    <motion.div className="btns" style={{marginTop:24}} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.5}}><Link className="btn" to={`/flights?to=${p.id}`}>Find flights from {money(p.price)}</Link></motion.div></div>
    <section style={{paddingTop:70}}><div className="wrap"><Stagger className="cards">{[['Flight time',`${p.time} from Kabul`],['Best time to visit',p.best],['Region',p.cat],['Sample fare',`From ${money(p.price)} one way`]].map(([t,x])=><motion.div key={t} variants={up} className="box gbox"><small>{t}</small><h3 style={{fontSize:'1.2rem',marginTop:8}}>{x}</h3></motion.div>)}</Stagger></div></section>
    <section className="gray"><div className="wrap"><Head title={`Top things to do in ${p.city}.`} text="Three moments you should not miss."/>
      <Stagger className="cards">{p.hi.map((h,i)=><motion.div key={h} variants={up} className="box"><div className="n">{i+1}</div><h3>{h}</h3></motion.div>)}</Stagger>
      <Reveal className="note">Entry rules and visas change often. Please check the official embassy website of {p.country} before you book.</Reveal></div></section>
    <section><div className="wrap"><Head title="You may also like." text="More beautiful places."/><div className="tiles">{more.map(m=><Tile key={m.id} p={m}/>)}</div></div></section></>);
}

export function About(){return(<><PageHead n={2} title="About SkyRoute." text="A simple way to book flights from Kabul."/>
  <section style={{paddingTop:60}}><div className="wrap"><Head title="The problem we solve." text="Many people in Kabul find it hard to compare places and book a flight in one place. SkyRoute shows beautiful destinations, clear prices and a simple booking flow."/>
    <Stagger className="cards">{[['Project Manager','Plans tasks and deadlines.'],['Business Analyst','Collects user needs.'],['UI/UX Designer','Designs wireframes and screens.'],['Frontend Developer','Builds the website.'],['QA & Documentation','Tests and writes documents.']].map(([t,x])=><motion.div key={t} variants={up} whileHover={{y:-6}} className="box gbox"><h3>{t}</h3><p>{x}</p></motion.div>)}</Stagger>
    <Reveal style={{textAlign:'center',marginTop:50}}><a className="btn line" href="/docs/index.html">Read the project documents</a></Reveal></div></section></>);}

export function Contact(){
  const [f,setF]=useState({n:'',e:'',m:''});const [er,setEr]=useState({});const [ok,setOk]=useState(false);
  const submit=e=>{e.preventDefault();const x={};if(!f.n.trim())x.n='Please enter your name.';if(!emailRe.test(f.e))x.e='Please enter a valid email.';if(f.m.trim().length<10)x.m='Message must be at least 10 characters.';
    setEr(x);setOk(false);if(!Object.keys(x).length){setOk(true);setF({n:'',e:'',m:''})}};
  return(<><PageHead n={3} title="Contact us." text="Questions? We would love to hear from you."/>
    <section style={{paddingTop:60}}><div className="wrap" style={{maxWidth:760}}><Reveal><form className="box form white" onSubmit={submit} noValidate>
      <div><label htmlFor="cn">Name</label><input id="cn" value={f.n} onChange={e=>setF({...f,n:e.target.value})}/><div className="err">{er.n}</div></div>
      <div><label htmlFor="ce">Email</label><input id="ce" type="email" value={f.e} onChange={e=>setF({...f,e:e.target.value})}/><div className="err">{er.e}</div></div>
      <div className="full"><label htmlFor="cm">Message</label><textarea id="cm" rows="5" value={f.m} onChange={e=>setF({...f,m:e.target.value})}/><div className="err">{er.m}</div></div>
      <div className="full"><button className="btn" type="submit">Send message</button>{ok&&<div className="msg ok" role="alert">Thank you! We received your message and will reply soon.</div>}</div></form></Reveal>
      <p style={{textAlign:'center',marginTop:26,color:'var(--muted)'}}>Office: Kabul, Afghanistan · marziasadeqi332@gmail.com</p></div></section></>);}
