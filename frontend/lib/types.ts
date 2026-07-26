export type Segment = { id:number; speaker:string; text:string; start_time:number; end_time:number };
export type Action = { id:number; text:string; assignee:string; completed:boolean };
export type Meeting = { id:number; title:string; date:string; duration:number; participants:string[]; summary:string; key_topics:string[]; chapters:{title:string; timestamp:number}[]; transcript:Segment[]; action_items:Action[]; color?:string };
