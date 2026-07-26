from sqlalchemy import Boolean, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .database import Base
class Meeting(Base):
    __tablename__='meetings'
    id:Mapped[int]=mapped_column(primary_key=True); title:Mapped[str]=mapped_column(String(200)); date:Mapped[str]=mapped_column(String(40)); duration:Mapped[int]; summary:Mapped[str]=mapped_column(Text,default=''); key_topics:Mapped[str]=mapped_column(Text,default='[]'); chapters:Mapped[str]=mapped_column(Text,default='[]')
    participants:Mapped[list['Participant']]=relationship(cascade='all, delete-orphan'); transcript:Mapped[list['TranscriptSegment']]=relationship(cascade='all, delete-orphan'); action_items:Mapped[list['ActionItem']]=relationship(cascade='all, delete-orphan')
class Participant(Base):
    __tablename__='participants'; id:Mapped[int]=mapped_column(primary_key=True); meeting_id:Mapped[int]=mapped_column(ForeignKey('meetings.id')); name:Mapped[str]=mapped_column(String(100))
class TranscriptSegment(Base):
    __tablename__='transcript_segments'; id:Mapped[int]=mapped_column(primary_key=True); meeting_id:Mapped[int]=mapped_column(ForeignKey('meetings.id')); speaker:Mapped[str]=mapped_column(String(100)); text:Mapped[str]=mapped_column(Text); start_time:Mapped[int]; end_time:Mapped[int]
class ActionItem(Base):
    __tablename__='action_items'; id:Mapped[int]=mapped_column(primary_key=True); meeting_id:Mapped[int]=mapped_column(ForeignKey('meetings.id')); text:Mapped[str]=mapped_column(Text); assignee:Mapped[str]=mapped_column(String(100),default='Unassigned'); completed:Mapped[bool]=mapped_column(Boolean,default=False)
