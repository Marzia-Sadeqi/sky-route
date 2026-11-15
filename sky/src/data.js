export const PLACES=[
{id:'paris',city:'Paris',country:'France',cat:'Europe',price:690,time:'7h 40m',img:'photo-1502602898657-3e91760cbb34',info:'The city of love, art and the Eiffel Tower.',best:'April to June, September to October',hi:['Eiffel Tower at sunset','The Louvre Museum','A cruise on the Seine river']},
{id:'istanbul',city:'Istanbul',country:'Turkey',cat:'Europe',price:320,time:'4h 30m',img:'photo-1524231757912-21f4fe3a7200',info:'Mosques, markets and the Bosphorus.',best:'April to May, September to November',hi:['Hagia Sophia and Blue Mosque','Grand Bazaar shopping','Bosphorus boat trip']},
{id:'dubai',city:'Dubai',country:'UAE',cat:'Asia',price:210,time:'3h 15m',img:'photo-1512453979798-5ea266f8880c',info:'Tall towers, desert safaris and shopping.',best:'November to March',hi:['Burj Khalifa view','Desert safari at sunset','Dubai Mall and fountain show']},
{id:'tokyo',city:'Tokyo',country:'Japan',cat:'Asia',price:780,time:'11h 00m',img:'photo-1540959733332-eab4deabeeaf',info:'Neon lights, temples and great food.',best:'March to May (cherry blossom), October to November',hi:['Senso-ji Temple','Shibuya Crossing','Fresh sushi at Tsukiji']},
{id:'bali',city:'Bali',country:'Indonesia',cat:'Islands',price:640,time:'9h 20m',img:'photo-1537996194471-e657df975ab4',info:'Green rice fields and calm beaches.',best:'April to October (dry season)',hi:['Tegallalang rice terraces','Uluwatu cliff temple','Beach sunsets in Seminyak']},
{id:'maldives',city:'Maldives',country:'Maldives',cat:'Islands',price:560,time:'6h 10m',img:'photo-1514282401047-d79a71a590e8',info:'Clear blue water and white sand.',best:'November to April',hi:['Snorkeling with colorful fish','Overwater villas','Island sandbank picnic']},
{id:'santorini',city:'Santorini',country:'Greece',cat:'Islands',price:720,time:'8h 50m',img:'photo-1570077188670-e3a8d69ac5ff',info:'White houses and sunsets over the sea.',best:'May to October',hi:['Oia sunset','Black sand beaches','Local wine tasting']},
{id:'newyork',city:'New York',country:'USA',cat:'Americas',price:950,time:'15h 30m',img:'photo-1496442226666-8d4d0e62e6e9',info:'Times Square, Central Park and the skyline.',best:'April to June, September to November',hi:['Statue of Liberty','Central Park walk','Times Square at night']}];
export const photo=(id,w=900)=>`https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;
export const money=n=>'$'+Math.round(n).toLocaleString();
export const CLASS_MULT={Economy:1,Business:2.2,First:3.5};
const mins=t=>{const m=t.match(/(\d+)h\s*(\d+)m/);return +m[1]*60+ +m[2]};
export const fmtDur=m=>`${Math.floor(m/60)}h ${String(m%60).padStart(2,'0')}m`;
const clock=m=>{m=((m%1440)+1440)%1440;return String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0')};
const AIR=[['Ariana Afghan Airlines','06:30',0,1,0.98],['Kam Air','10:15',0,1.08,1],['Turkish Airlines','14:40',1,0.95,1],['Emirates','21:05',0,1.2,1]];
export function makeFlights(p,cls='Economy',trip='One way'){
  const base=mins(p.time);
  return AIR.map(([air,dep,stops,pm],i)=>{const dur=base+stops*130+i*10;const [h,m]=dep.split(':').map(Number);
    return{id:p.id+'-'+i,air,dep,arr:clock(h*60+m+dur),dur,stops,price:Math.round(p.price*pm*CLASS_MULT[cls]*(trip==='Round trip'?1.9:1))}});
}
export const KEY='skyroute_trips';
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return[]}};
export const getTrips=email=>read().filter(t=>t.owner===email);
export const addTrip=t=>localStorage.setItem(KEY,JSON.stringify([...read(),t]));
export const removeTrip=ref=>localStorage.setItem(KEY,JSON.stringify(read().filter(t=>t.ref!==ref)));
export const getTrip=(ref,email)=>read().find(t=>t.ref===ref&&t.owner===email);
export const emailRe=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
