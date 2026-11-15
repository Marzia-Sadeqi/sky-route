import {useRef,useEffect,useState} from 'react';
import {Link,useNavigate,useLocation} from 'react-router-dom';
import {motion,useScroll,useTransform} from 'framer-motion';
import {photo,money} from './data.js';
import {useAuth} from './auth.jsx';
export const up={hidden:{opacity:0,y:50},show:{opacity:1,y:0,transition:{duration:.8,ease:[.22,1,.36,1]}}};
export const stag={hidden:{},show:{transition:{staggerChildren:.14}}};
const vp={once:true,margin:'-80px'};
export const Reveal=({children,className,style})=><motion.div className={className} style={style} variants={up} initial="hidden" whileInView="show" viewport={vp}>{children}</motion.div>;
export const Stagger=({children,className})=><motion.div className={className} variants={stag} initial="hidden" whileInView="show" viewport={vp}>{children}</motion.div>;
export const Head=({title,text})=><Reveal className="hd"><h2>{title}</h2><p>{text}</p></Reveal>;
const Q='(min-width:900px) and (min-aspect-ratio:1/1)';
function useLand(){const [m,setM]=useState(()=>matchMedia(Q).matches);useEffect(()=>{const l=matchMedia(Q);const f=()=>setM(l.matches);l.addEventListener('change',f);return()=>l.removeEventListener('change',f)},[]);return m}
function useAuto(r,dep){useEffect(()=>{const el=r.current;if(!el)return;if(matchMedia('(prefers-reduced-motion:reduce)').matches){el.pause();return}
  const io=new IntersectionObserver(([e])=>{e.isIntersecting?el.play().catch(()=>{}):el.pause()});io.observe(el);return()=>io.disconnect()},[dep])}
export function VBg({n=1,v='',name}){const land=useLand();const r=useRef(null);const b=`/videos/${name||'sky'+n}-${land?'l':'p'}`;useAuto(r,b);
  return <><video ref={r} key={b} className="vbg" src={b+'.mp4'} poster={b+'.jpg'} autoPlay muted loop playsInline preload="auto" aria-hidden="true"/><div className={'vov '+v}/></>}
export function Clip({n,label}){const r=useRef(null);useAuto(r,n);const b=`/videos/sky${n}-p`;return <video ref={r} className="clip" src={b+'.mp4'} poster={b+'.jpg'} autoPlay muted loop playsInline preload="metadata" aria-label={label}/>}
export const PageHead=({title,text,n})=><div className="vsec ph"><VBg n={n}/><motion.h1 initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:.8}}>{title}</motion.h1><motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.3}}>{text}</motion.p></div>;
function Word({w,i,n,p}){const o=useTransform(p,[i/n,(i+1)/n],[.15,1]);return <motion.span style={{opacity:o}}>{w} </motion.span>}
export function Statement({text}){const ref=useRef(null);const {scrollYProgress:p}=useScroll({target:ref,offset:['start 0.85','start 0.35']});const ws=text.split(' ');
  return <p ref={ref} className="statement">{ws.map((w,i)=><Word key={i} w={w} i={i} n={ws.length} p={p}/>)}</p>}
export function Fav({id}){const {user,toggleFav}=useAuth();const nav=useNavigate();const loc=useLocation();const on=user?.favs.includes(id);
  return <button className={'fav'+(on?' on':'')} aria-label={on?'Remove from saved places':'Save place'} onClick={e=>{e.preventDefault();e.stopPropagation();user?toggleFav(id):nav('/login',{state:{from:loc}})}}>{on?'♥':'♡'}</button>}
export function Tile({p,big}){return(
  <Reveal style={big?{gridColumn:'1/-1'}:null}><Link to={`/destination/${p.id}`} className="tile">
    <img loading="lazy" src={photo(p.img,1200)} alt={`${p.city}, ${p.country}`} onError={e=>e.target.style.visibility='hidden'}/><Fav id={p.id}/>
    <div className="t"><small>{p.cat} · {p.time} from Kabul</small><h3>{p.city}</h3><p>{p.info}</p><div className="r"><b>From {money(p.price)}</b><span className="btn soft">Explore</span></div></div></Link></Reveal>)}
