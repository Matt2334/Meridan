const { PrismaClient } = require('../generated/client');
const {PrismaPg} = require('@prisma/adapter-pg');
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const Prisma = new PrismaClient({ adapter });



// router.post('/signout', signOut);
const signOut = async (req,res)=>{
    const userId = req?.user.id;
    try{
        await Prisma.sessions.deleteMany({where: {userId}});
        res.json({message: 'Signed out successfully'});
    }catch(err){
        console.log(err)
        res.status(500).json({ error: err.message });
    }
}

// router.post('/signup', signUp);
const signUp = async (req,res)=>{
    const {email, password, preferences} = req.body;
    // should we store name and reading speed?
    try{
        const p = await bcrypt.hash(password, 10);
        const user = await Prisma.user.create({
            data: {email:email,password:p, preferences:preferences}
        });
        res.status(201).json({message: 'User created successfully'});
    }catch(err){
        console.log(err)
        res.status(500).json({ error: err.message });
    }
}
// router.get('/signIn', signIn);
const signIn = async (req,res)=>{
    const {email, password} = req.query;
    try{
        const user = await Prisma.user.findFirst({where: {email}});
        if (!user) return res.status(404).json({error:'User not found'});
        const pMatch = await bcrypt.compare(password, user.password);
        if (!pMatch) return res.status(401).json({error: 'Invalid password'});
    }catch(err){
        console.log(err)
        res.status(500).json({ error: err.message });
    }
}


// router.delete('/delete', deleteUser);
const deleteUser = async (req,res)=>{
    const userId = req?.user.id;
    try{
        const user = await Prisma.user.findUnique({where: {id: userId}});
        if (!user) return res.status(404).json({error: 'User not found'});
        await Prisma.sessions.deleteMany({where: {userId}});
        await Prisma.user.delete({where: {id: userId}});

        res.json({message: 'User deleted successfully'});

    }catch(err){
        console.log(err)
        res.status(500).json({ error: err.message });
    }
}


// router.get('/me', userInfo);
const userInfo = async (req,res)=>{
    const userId = req.user.id;
    try{
        const user = await Prisma.user.findUnique({where: {id: userId}});
        if (!user) return res.status(404).json({error: 'User not found'});
        res.json(user);

    }catch(err){
        console.log(err)
        res.status(500).json({ error: err.message });

    }

}

// router.put('/update', updateUser);
const updateUser = async (req,res)=>{
    const {name, email, preferences} = req.body;
    const userId = req?.user.id;
    try {
        const user = await Prisma.user.update({
            where: {id: userId},
            data: {name, email, preferences}
        });
        if (!user) return res.status(404).json({error: 'User not found'});
        res.json(user);
    }catch(err) {
        console.log(err)
        res.status(500).json({ error: err.message });
    }
}


module.exports = {signOut, signIn, signUp, deleteUser, userInfo, updateUser };
