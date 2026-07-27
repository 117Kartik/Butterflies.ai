'use client';
import Link from 'next/link';
import { Bot, CalendarDays, ChevronDown, FileText, Home, Inbox, LayoutGrid, LogOut, Settings, Sparkles, Users, UserRound } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const nav=[['Home',Home,'/'],['Meetings',FileText,'/meetings'],['My Feed',LayoutGrid,'/feed'],['Notebook',Inbox,'/notebook'],['Soundbites',Sparkles,'/soundbites']];
const workspace=[['Team meetings',Users,'/team'],['Calendar',CalendarDays,'/calendar']];
type User={full_name:string};

export default function Sidebar(){
  const path=usePathname(),router=useRouter(),[user,setUser]=useState<User|null>(null),[open,setOpen]=useState(false);
  useEffect(()=>{try{setUser(JSON.parse(localStorage.getItem('butterflies-user')||'null'))}catch{setUser(null)}},[]);
  const item=(label:string,Icon:any,href:string)=><Link key={label} href={href} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${path===href?'bg-[#f0edff] text-[#6245e8]':'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'}`}><Icon size={18}/>{label}</Link>;
  const switchUser=()=>{localStorage.removeItem('butterflies-user');setUser(null);router.push('/login')};
  const logout=()=>{localStorage.removeItem('butterflies-user');setUser(null);setOpen(false);router.push('/')};
  const name=user?.full_name||''; const initials=name.split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase();
  return <aside className="hidden lg:flex w-[250px] shrink-0 flex-col border-r border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
    <Link href="/" className="mb-9 flex items-center gap-2 px-2"><span className="grid h-8 w-8 place-items-center rounded-lg bg-lilac text-lg font-bold text-white">b</span><span className="text-[21px] font-bold tracking-tight dark:text-white">Butterflies <b className="font-medium text-lilac">ai</b></span></Link>
    <nav className="space-y-1">{nav.map(([label,Icon,href])=>item(label as string,Icon,href as string))}</nav>
    <div className="mt-7"><p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">Workspace</p>{workspace.map(([label,Icon,href])=>item(label as string,Icon,href as string))}</div>
    <div className="mt-auto space-y-1">
      {item('Integrations',Bot,'/integrations')}
      {item('Settings',Settings,'/settings')}
      {!user ? <Link href="/login" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-lilac hover:bg-violet-50"><UserRound size={18}/>Sign in</Link> : <div className="relative mt-3 border-t pt-3 dark:border-slate-800">
        {open&&<div className="absolute bottom-14 left-0 z-20 w-full rounded-xl border border-slate-200 bg-white p-1 shadow-card dark:border-slate-700 dark:bg-slate-900"><button onClick={switchUser} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"><UserRound size={16}/>Log in with another ID</button><button onClick={logout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"><LogOut size={16}/>Log out</button></div>}
        <button onClick={()=>setOpen(!open)} className="flex w-full items-center gap-2 text-left"><span className="grid h-8 w-8 place-items-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">{initials}</span><span className="flex-1 truncate text-sm font-medium dark:text-white">{name}</span><ChevronDown size={15} className={`text-slate-500 transition ${open?'rotate-180':''}`}/></button>
      </div>}
    </div>
  </aside>
}
