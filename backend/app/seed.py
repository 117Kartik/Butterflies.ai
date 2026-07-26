import json
from .database import Base, SessionLocal, engine
from .models import ActionItem, Meeting, Participant, TranscriptSegment
def seed():
 Base.metadata.create_all(engine); db=SessionLocal()
 if db.query(Meeting).count(): return
 data=[('Product Strategy Sync','2026-07-24T09:00:00',48,['Maya Chen','Alex Morgan','Sam Lee'],'The team aligned on a focused onboarding milestone and customer validation plan.', ['Onboarding','Q3 priorities','Customer research']),('Q3 Marketing Planning','2026-07-23T10:30:00',36,['Jordan Kim','Avery Patel'],'Marketing agreed on campaign themes, owners, and launch milestones.', ['Campaign strategy','Content','Launch']),('Weekly Design Critique','2026-07-22T15:00:00',57,['Noah Davis','Maya Chen','Liam Scott'],'The design team reviewed current flows and captured improvements for the next sprint.', ['UX review','Design systems','Sprint planning'])]
 for title,date,duration,people,summary,topics in data:
  m=Meeting(title=title,date=date,duration=duration,summary=summary,key_topics=json.dumps(topics),chapters=json.dumps([{'title':'Introductions', 'timestamp':0},{'title':'Discussion','timestamp':120},{'title':'Next steps','timestamp':480}]));db.add(m);db.flush()
  for p in people:db.add(Participant(meeting_id=m.id,name=p))
  for i,text in enumerate(['Thanks for making time today. Let’s begin with the context and goals.','The main customer insight is that clarity and speed matter most.','I agree. We can make this change in the next focused release.','Let’s capture owners and confirm the next steps before we finish.']):db.add(TranscriptSegment(meeting_id=m.id,speaker=people[i%len(people)],text=text,start_time=i*45,end_time=i*45+38))
  db.add(ActionItem(meeting_id=m.id,text='Share the updated plan with the team',assignee=people[0],completed=False));db.add(ActionItem(meeting_id=m.id,text='Schedule the follow-up session',assignee=people[1],completed=True))
 db.commit();db.close()
if __name__=='__main__': seed()
