import {useState} from 'react';
import {Link,Navigate,useNavigate,useLocation,useParams,useSearchParams} from 'react-router-dom';
import {motion,AnimatePresence} from 'framer-motion';
import {PLACES,money,makeFlights,fmtDur,addTrip,getTrips,getTrip,removeTrip,emailRe} from './data.js';
import {useAuth} from './auth.jsx';
import {Reveal,PageHead,VBg,up,Tile,Stagger} from './ui.jsx';
const today=()=>new Date().toISOString().split('T')[0];

export function Flights(){
  const [sp,setSp]=useSearchParams();const nav=useNavigate();
  const to=sp.get('to')||'paris',date=sp.get('date')||'',ret=sp.get('ret')||'',pax=Math.min(9,Math.max(1,+sp.get('pax')||1));
  const [cls,setCls]=useState('Economy');const [sort,setSort]=useState('price');const [direct,setDirect]=useState(false);
  const p=PLACES.find(x=>x.id===to)||PLACES[0];const trip=ret?'Round trip':'One way';
  const set=(k,v)=>{const n=new URLSearchParams(sp);v?n.set(k,v):n.delete(k);setSp(n,{replace:true})};
  let list=makeFlights(p,cls,trip).filter(f=>!direct||f.stops===0).sort((a,b)=>sort==='price'?a.price-b.price:a.dur-b.dur);
  const bad=ret&&date&&ret<date;
  return(<><PageHead n={1} title="Find your flight." text={`Kabul (KBL) → ${p.city}. Sample flights, sample prices.`}/>
    <section style={{paddingTop:50}}><div className="wrap">
      <div className="box white filters2"><div><label htmlFor="to">To</label><select id="to" value={to} onChange={e=>set('to',e.target.value)}>{PLACES.map(x=><option key={x.id} value={x.id}>{x.city}</option>)}</select></div>
        <div><label htmlFor="dt">Depart</label><input id="dt" type="date" min={today()} value={date} onChange={e=>set('date',e.target.value)}/></div>
        <div><label htmlFor="rt">Return</label><input id="rt" type="date" min={date||today()} value={ret} onChange={e=>set('ret',e.target.value)}/></div>
        <div><label htmlFor="px">Travellers</label><input id="px" type="number" min="1" max="9" value={pax} onChange={e=>set('pax',e.target.value)}/></div>
        <div><label htmlFor="cl">Class</label><select id="cl" value={cls} onChange={e=>setCls(e.target.value)}><option>Economy</option><option>Business</option><option>First</option></select></div>
        <div><label htmlFor="so">Sort by</label><select id="so" value={sort} onChange={e=>setSort(e.target.value)}><option value="price">Lowest price</option><option value="dur">Shortest</option></select></div></div>
      <label className="chk"><input type="checkbox" checked={direct} onChange={e=>setDirect(e.target.checked)}/> Direct flights only</label>
      {!date&&<div className="msg bad">Please choose a departure date to continue.</div>}{bad&&<div className="msg bad">Return date must be after the departure date.</div>}
      <motion.div layout className="flist"><AnimatePresence mode="popLayout">{list.map(f=>
        <motion.div layout key={f.id} className="flight" initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} exit={{opacity:0}} whileHover={{scale:1.01}}>
          <div><b>{f.air}</b><small>{trip}</small></div>
          <div className="tm"><b>{f.dep}</b><small>KBL</small></div><div className="ln"><small>{fmtDur(f.dur)}</small><i/><small>{f.stops?'1 stop':'Direct'}</small></div><div className="tm"><b>{f.arr}</b><small>{p.city.slice(0,3).toUpperCase()}</small></div>
          <div className="pr"><span className="price">{money(f.price)}</span><small>per traveller</small>
            <button className="btn sm" disabled={!date||bad} onClick={()=>nav('/checkout',{state:{flight:f,to:p.id,date,ret,pax,cls,trip}})}>Select</button></div></motion.div>)}
        {!list.length&&<p className="empty">No flights match your filters.</p>}</AnimatePresence></motion.div></div></section></>);
}

export function Checkout(){
  const {state:s}=useLocation();const {user}=useAuth();const nav=useNavigate();
  const [f,setF]=useState({nm:user.name,em:user.email,ph:user.phone||'',pp:'',pay:'Pay at our Kabul office',ok:false});const [er,setEr]=useState({});
  if(!s)return <Navigate to="/flights" replace/>;
  const p=PLACES.find(x=>x.id===s.to);const fare=s.flight.price*s.pax,tax=Math.round(fare*.12),total=fare+tax;
  const set=k=>e=>setF({...f,[k]:e.target.value});
  const submit=e=>{e.preventDefault();const x={};
    if(f.nm.trim().length<3)x.nm='Enter your full name as in your passport.';if(!emailRe.test(f.em))x.em='Enter a valid email.';
    if(!/^[+\d][\d\s-]{7,}$/.test(f.ph))x.ph='Enter a valid phone number.';if(!/^[A-Za-z0-9]{6,9}$/.test(f.pp))x.pp='Passport: 6-9 letters or numbers.';
    if(!f.ok)x.ok='Please accept the booking terms.';setEr(x);if(Object.keys(x).length)return;
    const ref='SR'+Math.floor(100000+Math.random()*900000);
    addTrip({ref,owner:user.email,city:p.city,air:s.flight.air,dep:s.flight.dep,arr:s.flight.arr,dur:s.flight.dur,date:s.date,ret:s.ret,cls:s.cls,pax:s.pax,name:f.nm,pp:f.pp,pay:f.pay,total,seat:Math.ceil(Math.random()*30)+['A','B','C','D','E','F'][Math.floor(Math.random()*6)]});
    nav(`/ticket/${ref}`);};
  const Fld=({k,l,ph,type='text'})=><div><label htmlFor={k}>{l}</label><input id={k} type={type} placeholder={ph} value={f[k]} onChange={set(k)}/><div className="err">{er[k]}</div></div>;
  return(<><PageHead n={2} title="Confirm your trip." text="Check the details and enter traveller information."/>
    <section style={{paddingTop:50}}><div className="wrap book"><Reveal><form className="box form white" onSubmit={submit} noValidate>
      <Fld k="nm" l="Lead traveller full name" ph="As in passport"/><Fld k="pp" l="Passport number"/><Fld k="em" l="Email" type="email"/><Fld k="ph" l="Phone" ph="+93 700 000 000"/>
      <div className="full"><label htmlFor="pay">Payment method</label><select id="pay" value={f.pay} onChange={set('pay')}><option>Pay at our Kabul office</option><option>Bank transfer</option><option>Mobile wallet</option></select></div>
      <div className="full"><label className="chk"><input type="checkbox" checked={f.ok} onChange={e=>setF({...f,ok:e.target.checked})}/> I confirm the details are correct and accept the booking terms.</label><div className="err">{er.ok}</div>
        <small className="muted">Demo project: no real payment is taken. Please do not enter card numbers anywhere.</small></div>
      <div className="full"><button className="btn" type="submit">Confirm booking</button></div></form></Reveal>
      <Reveal><aside className="box sum gbox"><h3 style={{margin:'0 0 8px'}}>Kabul → {p.city}</h3><p>{s.flight.air}<br/>{s.date}{s.ret&&` · return ${s.ret}`}<br/>{s.flight.dep} → {s.flight.arr} · {fmtDur(s.flight.dur)}<br/>{s.pax} traveller(s) · {s.cls}</p>
        <div className="sl"><span>Fare</span><span>{money(fare)}</span></div><div className="sl"><span>Taxes and fees</span><span>{money(tax)}</span></div>
        <div className="price" style={{fontSize:'2.3rem',marginTop:10,letterSpacing:'-.03em'}}>{money(total)}</div></aside></Reveal></div></section></>);
}

export function Ticket(){
  const {ref}=useParams();const {user}=useAuth();const t=getTrip(ref,user.email);
  if(!t)return <Navigate to="/my-trips" replace/>;
  return(<section style={{paddingTop:120}}><div className="wrap" style={{maxWidth:820}}>
    <Reveal><div className="msg ok noprint">Booking confirmed! Keep your reference: <b>{t.ref}</b></div>
      <div className="pass"><div className="pm"><small>SKYROUTE · E-TICKET</small><div className="rt"><div><b>KBL</b><small>Kabul</small></div><span>✈</span><div><b>{t.city.slice(0,3).toUpperCase()}</b><small>{t.city}</small></div></div>
        <div className="pg"><div><small>Passenger</small><b>{t.name}</b></div><div><small>Flight</small><b>{t.air}</b></div><div><small>Date</small><b>{t.date}</b></div><div><small>Departs</small><b>{t.dep}</b></div><div><small>Arrives</small><b>{t.arr}</b></div><div><small>Class</small><b>{t.cls}</b></div><div><small>Seat</small><b>{t.seat}</b></div><div><small>Travellers</small><b>{t.pax}</b></div><div><small>Total</small><b>{money(t.total)}</b></div></div></div>
        <div className="ps"><small>Reference</small><b>{t.ref}</b><div className="bar2"/><small>Demo ticket</small></div></div>
      <div className="btns noprint" style={{marginTop:28}}><button className="btn" onClick={()=>window.print()}>Print ticket</button><Link className="btn line" to="/my-trips">My trips</Link></div></Reveal></div></section>);
}

export function Trips(){
  const {user}=useAuth();const [t,setT]=useState(getTrips(user.email));
  const cancel=r=>{if(window.confirm('Cancel this booking?')){removeTrip(r);setT(getTrips(user.email))}};
  return(<><PageHead n={4} title="My trips." text={`Welcome, ${user.name.split(' ')[0]}. Your bookings are here.`}/>
    <section style={{paddingTop:60}}><div className="wrap"><motion.div layout className="pcards"><AnimatePresence>
      {t.map(x=><motion.article layout key={x.ref} className="trip" initial={{opacity:0,scale:.92}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:.85}}><span className="tag">{x.ref}</span><h3>Kabul → {x.city}</h3>
        <p className="muted">{x.air}<br/>{x.date}{x.ret&&` · return ${x.ret}`} · {x.dep}<br/>{x.name} · {x.pax} traveller(s) · {x.cls}</p>
        <div className="row2"><span className="price" style={{fontSize:'1.5rem'}}>{money(x.total)}</span><span><Link className="btn sm" to={`/ticket/${x.ref}`}>Ticket</Link> <button className="btn line sm" onClick={()=>cancel(x.ref)}>Cancel</button></span></div></motion.article>)}</AnimatePresence>
      {!t.length&&<p className="empty">You have no trips yet. <Link to="/flights" style={{color:'var(--blue)'}}>Find your first flight</Link>.</p>}</motion.div></div></section></>);
}

export function Profile(){
  const {user,update,logout}=useAuth();const [n,setN]=useState(user.name);const [ph,setPh]=useState(user.phone||'');const [m,setM]=useState('');
  const saved=PLACES.filter(p=>user.favs.includes(p.id));
  return(<><PageHead n={2} title="My profile." text={user.email}/>
    <section style={{paddingTop:60}}><div className="wrap" style={{maxWidth:900}}><Reveal><form className="box form white" onSubmit={e=>{e.preventDefault();if(n.trim().length<3){setM('bad');return}update({name:n.trim(),phone:ph});setM('ok')}}>
      <div><label htmlFor="pn">Full name</label><input id="pn" value={n} onChange={e=>setN(e.target.value)}/></div><div><label htmlFor="pp2">Phone</label><input id="pp2" value={ph} onChange={e=>setPh(e.target.value)}/></div>
      <div className="full"><button className="btn" type="submit">Save changes</button> <button type="button" className="btn line" onClick={logout}>Log out</button>
        {m&&<div className={'msg '+m} role="alert">{m==='ok'?'Your profile was updated.':'Name must have at least 3 letters.'}</div>}</div></form></Reveal>
      <h2 style={{margin:'60px 0 24px',fontSize:'2rem'}}>Saved places</h2>
      <div className="tiles">{saved.map(p=><Tile key={p.id} p={p}/>)}{!saved.length&&<p className="empty">No saved places yet. Tap the heart on any place. <Link to="/destinations" style={{color:'var(--blue)'}}>Explore</Link></p>}</div></div></section></>);
}

export function AuthPage(){
  const {user,login,register}=useAuth();const nav=useNavigate();const loc=useLocation();const from=loc.state?.from;
  const [tab,setTab]=useState('login');const [f,setF]=useState({name:'',email:'',phone:'',pw:'',pw2:''});const [er,setEr]=useState({});const [show,setShow]=useState(false);const [busy,setBusy]=useState(false);
  if(user)return <Navigate to={from?from.pathname+(from.search||''):'/my-trips'} state={from?.state} replace/>;
  const set=k=>e=>setF({...f,[k]:e.target.value});
  const submit=async e=>{e.preventDefault();const x={};const reg=tab==='register';
    if(reg&&f.name.trim().length<3)x.name='Enter your full name.';if(!emailRe.test(f.email))x.email='Enter a valid email.';
    if(reg&&!/^[+\d][\d\s-]{7,}$/.test(f.phone))x.phone='Enter a valid phone number.';
    if(f.pw.length<8)x.pw='Password must have at least 8 characters.';if(reg&&f.pw2!==f.pw)x.pw2='Passwords do not match.';
    setEr(x);if(Object.keys(x).length)return;setBusy(true);
    const msg=reg?await register({name:f.name,email:f.email,phone:f.phone,password:f.pw}):await login(f.email,f.pw);
    setBusy(false);if(msg)setEr({form:msg});};
  const Fld=({k,l,type='text',ph})=><div><label htmlFor={k}>{l}</label><input id={k} type={type} placeholder={ph} value={f[k]} onChange={set(k)} autoComplete={k==='pw'?(tab==='login'?'current-password':'new-password'):undefined}/><div className="err">{er[k]}</div></div>;
  return(<div className="vsec authp"><VBg n={1}/>
    <motion.div className="glass authc" initial={{opacity:0,y:50,scale:.96}} animate={{opacity:1,y:0,scale:1}} transition={{duration:.7,ease:[.22,1,.36,1]}}>
      <Link className="logo" to="/">Sky<i>Route</i></Link><h1>{tab==='login'?'Welcome back.':'Create your account.'}</h1>
      <p className="muted">{from?'Please log in to continue your booking.':'Book flights, save places and manage your trips.'}</p>
      <div className="chips" style={{margin:'18px 0'}}>{[['login','Log in'],['register','Register']].map(([k,t])=><button type="button" key={k} className={'chip'+(tab===k?' on':'')} onClick={()=>{setTab(k);setEr({})}}>{t}</button>)}</div>
      <form onSubmit={submit} noValidate className="afm">
        {tab==='register'&&<><Fld k="name" l="Full name"/><Fld k="phone" l="Phone" ph="+93 700 000 000"/></>}
        <Fld k="email" l="Email" type="email"/>
        <div><label htmlFor="pw">Password</label><div className="pwr"><input id="pw" type={show?'text':'password'} value={f.pw} onChange={set('pw')} autoComplete={tab==='login'?'current-password':'new-password'}/><button type="button" className="lk" onClick={()=>setShow(!show)}>{show?'Hide':'Show'}</button></div><div className="err">{er.pw}</div></div>
        {tab==='register'&&<Fld k="pw2" l="Confirm password" type="password"/>}
        {er.form&&<div className="msg bad" role="alert">{er.form}</div>}
        <button className="btn" type="submit" disabled={busy} style={{width:'100%',marginTop:8}}>{busy?'Please wait...':tab==='login'?'Log in':'Create account'}</button></form>
      <small className="muted">Demo project: accounts are saved only in this browser.</small></motion.div></div>);
}
