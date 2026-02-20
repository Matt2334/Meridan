const { PrismaClient } = require('@prisma/client');
const Prisma = new PrismaClient();


// router.get('/session/:user_id', authJWT, getPastSessions);
const getPastSessions = async (req,res)=>{
    const userId = req?.user.id;
    const {uid} = req.params;
    try{
        if (parseInt(uid) !== userId) return res.status(403).json({error: 'Unauthorized'});
        const user = await Prisma.user.findUnique({where: {id: userId}});
        
        if (!user) return res.status(404).json({error: 'User not found'});
        const sessions = await Prisma.sessions.findMany({where: {userId}});
        
        if (!sessions.length) return res.status(404).json({error: 'No sessions found for this user'});
        res.json(sessions);
    }catch(err){
        console.log(err)
        res.status(500).json({ error: err.message });
    }
}

// router.post('/sessions', authJWT, generateSession);
const generateSession = async (req,res)=>{
    const userId = req?.user.id;
    const {time_available, topics, formats} = req.body;
    try{
        const user = await Prisma.user.findUnique({where: {id: userId}});
        if (!user) return res.status(404).json({error: 'User not found'});
        
        const session = await Prisma.sessions.create({
            data: {
                userId,
                timeAvailable: time_available,
                topics: topics.join(','),
                formats: formats.join(','),
            }
        });
        res.json(session);
    }catch(err){
        console.log(err)
        res.status(500).json({ error: err.message });
    }
}

// router.get('/sessions/:id', authJWT, getSession);
const getSession = async (req,res)=>{
    const userId = req?.user.id;
    const {id} = req.params;
    try{
        const session = await Prisma.sessions.findUnique({where: {id: parseInt(id)}});
        if (!session) return res.status(404).json({error: 'Session not found'});
        if (session.userId !== userId) return res.status(403).json({error: 'Unauthorized'});
        res.json(session);
    }catch(err){
        console.log(err)
        res.status(500).json({ error: err.message });
    }
}


// router.put('/sessions/:id/complete', authJWT, sessionComplete);
const sessionComplete = async (req,res)=>{
    const userId = req?.user.id;
    const {id} = req.params;
    try{
        const session = await Prisma.sessions.findUnique({where: {id: parseInt(id)}});
        if (!session) return res.status(404).json({error: 'Session not found'});
        if (session.userId !== userId) return res.status(403).json({error: 'Unauthorized'});
        const updatedSession = await Prisma.sessions.update({
            where: {id: parseInt(id)},
            data: {completed: true}
        });
        res.json(updatedSession);
    }catch(err){
        console.log(err)
        res.status(500).json({ error: err.message });
    }
}




module.exports = {generateSession, getPastSessions, getSession, sessionComplete };