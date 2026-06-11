enum SessionType{
  SINGLE,
  BUNDLE,
  DEEP_DIVE,
}

//   const { limit = 5, offset = 0 } = req.query;
export interface GetSessionsQuery{
    limit?:string;
    offset?:string;
}

export interface GetSessionsResponse{
    idempotencyKey:string;
    userId:string;
    timeAvailable: number;
    sessionType:SessionType;
    takeaways?:JSON;
    talkingPoints?:JSON;
    engagementData?:JSON;
    createdAt:Date;
    completedAt?:Date;
    topic:string;
}

// const { time, topic, formats } = req.body;
export interface CreateSessionRequest{
    time?:string;
    topic?:string;
    formats?:string;
}

// const { id } = req.params;
export interface GetSessionByParams{
    id?:string;
}

// const { sessionId, itemId } = req.params;
export interface SessionItemCompleteParams{
    sessionId?:string;
    itemId?:string;
}

export interface SessionItemResponse{
    id: string;
    sessionId: string;
    contentId: string;
    orderIndex: number;
    completed: boolean;
    timeSpent?: number;
}

