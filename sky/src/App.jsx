import {useState,useEffect} from 'react';
import {Routes,Route,Link,NavLink,Navigate,useLocation} from 'react-router-dom';
import {AnimatePresence,motion} from 'framer-motion';
import {useAuth} from './auth.jsx';
import {Home,Destinations,Detail,About,Contact} from './pages.jsx';
import {Flights,Checkout,Ticket,Trips,Profile,AuthPage} from './account.jsx';
const links=[['/','Home'],['/destinations','Destinations'],['/flights','Flights'],['/my-trips','My Trips'],['/about','About'],['/contact','Contact']];
const Guard=({children})=>{const {user}=useAuth();const loc=useLocation();return user?children:<Navigate to="/login" state={{from:loc}} replace/>};
export default function App(){
  const loc=useLocation();const {user,logout}=useAuth();const [open,setOpen]=useState(false);
  useEffect(()=>{setOpen(false);window.scrollTo(0,0)},[loc.pathname]);
  return(<>
    <motion.header className="hdr" initial={{y:-60,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:.6}}>
      <div className="bar"><Link className="logo" to="/">Sky<i>Route</i></Link>
        <ul className={open?'open':''}>{links.map(([to,t])=><li key={to}><NavLink to={to} end className={({isActive})=>isActive?'on':''}>{t}</NavLink></li>)}
          <li className="mob">{user?<><Link to="/profile">Profile</Link><a href="#out" onClick={e=>{e.preventDefault();logout()}}>Log out</a></>:<Link to="/login">Log in</Link>}</li></ul>
        <div className="acct">{user?<><Link to="/profile" className="av" title="Profile">{user.name[0].toUpperCase()}</Link><button className="lk" onClick={logout}>Log out</button></>:<Link className="btn sm" to="/login">Log in</Link>}</div>
        <button className="burger" aria-label="Menu" onClick={()=>setOpen(!open)}>{open?'✕':'☰'}</button></div>
    </motion.header>
    <AnimatePresence mode="wait"><motion.main key={loc.pathname} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:.35}}>
      <Routes location={loc}><Route path="/" element={<Home/>}/><Route path="/destinations" element={<Destinations/>}/><Route path="/destination/:id" element={<Detail/>}/>
        <Route path="/flights" element={<Flights/>}/><Route path="/checkout" element={<Guard><Checkout/></Guard>}/><Route path="/ticket/:ref" element={<Guard><Ticket/></Guard>}/>
        <Route path="/my-trips" element={<Guard><Trips/></Guard>}/><Route path="/profile" element={<Guard><Profile/></Guard>}/><Route path="/login" element={<AuthPage/>}/>
        <Route path="/about" element={<About/>}/><Route path="/contact" element={<Contact/>}/><Route path="*" element={<Navigate to="/" replace/>}/></Routes>
    </motion.main></AnimatePresence>
    <footer><div className="wrap"><div className="fg"><div><h4>SkyRoute</h4><p>Book flights from Kabul to the world's most beautiful places.</p></div>
      <div><h4>Explore</h4><ul>{links.slice(0,4).map(([to,t])=><li key={to}><Link to={to}>{t}</Link></li>)}</ul></div>
      <div><h4>Company</h4><ul><li><Link to="/about">About</Link></li><li><Link to="/contact">Contact</Link></li><li><a href="/docs/index.html">Project documents</a></li></ul></div>
      <div><h4>Contact</h4><p>Kabul, Afghanistan<br/>marziasadeqi332@gmail.com</p></div></div>
      <p>© 2026 SkyRoute · Student project (demo). Flights, prices and tickets are examples only. Always check entry rules before you travel.</p></div></footer></>);
}
