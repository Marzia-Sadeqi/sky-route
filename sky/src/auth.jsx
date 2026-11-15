import {createContext,useContext,useState} from 'react';
const Ctx=createContext(null);export const useAuth=()=>useContext(Ctx);
const U='skyroute_users',S='skyroute_session';
const read=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v??d}catch{return d}};
async function hash(s){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
export function AuthProvider({children}){
  const [email,setEmail]=useState(read(S,null));const [,force]=useState(0);
  const users=read(U,[]);const user=users.find(u=>u.email===email)||null;
  const save=list=>{localStorage.setItem(U,JSON.stringify(list));force(n=>n+1)};
  const start=e=>{localStorage.setItem(S,JSON.stringify(e));setEmail(e)};
  const register=async({name,email:e,phone,password})=>{e=e.trim().toLowerCase();
    if(users.some(u=>u.email===e))return 'This email is already registered. Please log in.';
    save([...users,{name:name.trim(),email:e,phone,hash:await hash(password),favs:[]}]);start(e)};
  const login=async(e,password)=>{e=e.trim().toLowerCase();const u=users.find(x=>x.email===e);
    if(!u||u.hash!==await hash(password))return 'Email or password is not correct.';start(e)};
  const logout=()=>{localStorage.removeItem(S);setEmail(null)};
  const update=patch=>save(users.map(u=>u.email===email?{...u,...patch}:u));
  const toggleFav=id=>update({favs:user.favs.includes(id)?user.favs.filter(x=>x!==id):[...user.favs,id]});
  return <Ctx.Provider value={{user,register,login,logout,update,toggleFav}}>{children}</Ctx.Provider>;
}
