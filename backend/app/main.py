import json, re
from fastapi import Depends, FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.orm import Session
from .database import Base, engine, get_db
from .models import ActionItem, Meeting, Participant, TranscriptSegment
from .seed import seed
app=FastAPI(title='Butterflies.ai API'); app.add_middleware(
    CORSMiddleware,
    # Supports localhost plus LAN/preview addresses used by the development server.
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+)(:\d+)?$",
    allow_methods=['*'],
    allow_headers=['*'],
)
Base.metadata.create_all(engine)
@app.on_event('startup')
def bootstrap(): seed()
def serialize(m): return {'id':m.id,'title':m.title,'date':m.date,'duration':m.duration,'participants':[p.name for p in m.participants],'summary':m.summary,'key_topics':json.loads(m.key_topics),'chapters':json.loads(m.chapters),'transcript':[{'id':s.id,'speaker':s.speaker,'text':s.text,'start_time':s.start_time,'end_time':s.end_time} for s in m.transcript],'action_items':[{'id':a.id,'text':a.text,'assignee':a.assignee,'completed':a.completed} for a in m.action_items]}
@app.get('/health')
def health(): return {'status':'ok'}
@app.get('/meetings')
def meetings(search:str='',db:Session=Depends(get_db)):
    rows=db.scalars(select(Meeting).where(Meeting.title.ilike(f'%{search}%')).order_by(Meeting.date.desc())).all(); return [serialize(x) for x in rows]
@app.get('/meetings/{meeting_id}')
def meeting(meeting_id:int,db:Session=Depends(get_db)):
    x=db.get(Meeting,meeting_id)
    if not x: raise HTTPException(404,'Meeting not found')
    return serialize(x)
@app.get('/transcripts/{meeting_id}')
def transcript(meeting_id:int,db:Session=Depends(get_db)):
    x=db.get(Meeting,meeting_id)
    if not x: raise HTTPException(404,'Meeting not found')
    return serialize(x)['transcript']
@app.post('/meetings',status_code=201)
def create(body:dict,db:Session=Depends(get_db)):
    x=Meeting(title=body['title'],date=body.get('date','2026-07-26T09:00:00'),duration=body.get('duration',30),summary=body.get('summary',''),key_topics=json.dumps(body.get('key_topics',[])),chapters=json.dumps(body.get('chapters',[]))); db.add(x); db.flush(); [db.add(Participant(meeting_id=x.id,name=n)) for n in body.get('participants',[])]; db.commit(); db.refresh(x); return serialize(x)
@app.put('/meetings/{meeting_id}')
def update(meeting_id:int,body:dict,db:Session=Depends(get_db)):
    x=db.get(Meeting,meeting_id)
    if not x: raise HTTPException(404,'Meeting not found')
    for k in ['title','date','duration','summary']:
        if k in body:setattr(x,k,body[k])
    db.commit();db.refresh(x);return serialize(x)
@app.delete('/meetings/{meeting_id}',status_code=204)
def delete(meeting_id:int,db:Session=Depends(get_db)):
    x=db.get(Meeting,meeting_id)
    if not x: raise HTTPException(404,'Meeting not found')
    db.delete(x);db.commit()
@app.post('/meetings/{meeting_id}/actions',status_code=201)
def add_action(meeting_id:int,body:dict,db:Session=Depends(get_db)):
    a=ActionItem(meeting_id=meeting_id,text=body['text'],assignee=body.get('assignee','Unassigned'));db.add(a);db.commit();db.refresh(a);return {'id':a.id,'text':a.text,'assignee':a.assignee,'completed':a.completed}
@app.patch('/actions/{action_id}')
def edit_action(action_id:int,body:dict,db:Session=Depends(get_db)):
    a=db.get(ActionItem,action_id)
    if not a: raise HTTPException(404,'Action not found')
    for k in ['text','assignee','completed']:
        if k in body:setattr(a,k,body[k])
    db.commit();return {'id':a.id,'text':a.text,'assignee':a.assignee,'completed':a.completed}
@app.delete('/actions/{action_id}',status_code=204)
def delete_action(action_id:int,db:Session=Depends(get_db)):
    a=db.get(ActionItem,action_id)
    if not a: raise HTTPException(404,'Action not found')
    db.delete(a);db.commit()
@app.post('/upload/{meeting_id}')
async def upload(meeting_id:int,file:UploadFile=File(...),db:Session=Depends(get_db)):
    if file.filename is None or not file.filename.lower().endswith(('.txt','.json','.vtt')):raise HTTPException(400,'Use TXT, JSON, or VTT')
    raw=(await file.read()).decode('utf-8'); segments=[]
    if file.filename.endswith('.json'):
        segments=json.loads(raw)
    elif file.filename.endswith('.vtt'):
        for i,block in enumerate(re.split(r'\n\s*\n',raw)[1:]):
            parts=block.splitlines()
            if len(parts)>=2: segments.append({'speaker':'Speaker','start_time':i*30,'end_time':i*30+25,'text':' '.join(parts[1:])})
    else: segments=[{'speaker':'Speaker','start_time':i*30,'end_time':i*30+25,'text':line} for i,line in enumerate(raw.splitlines()) if line.strip()]
    db.query(TranscriptSegment).filter_by(meeting_id=meeting_id).delete();[db.add(TranscriptSegment(meeting_id=meeting_id,speaker=s.get('speaker','Speaker'),text=s['text'],start_time=s.get('start_time',0),end_time=s.get('end_time',30))) for s in segments];db.commit();return {'segments_imported':len(segments)}
