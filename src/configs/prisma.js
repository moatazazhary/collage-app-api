
require('dotenv').config()
const {PrismaPg} = require('@prisma/adapter-pg')
const {PrismaClient} = require('../../generated/prisma/client')

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })


async function DbConnect(){
    try{
        console.log('🌱 Starting connect to the database seeding...\n')
        await prisma.$connect();
        console.log('✅ Connected to the database sucessfully! \n');

    }catch(error){
        console.error('❌ Failed to connect to the database : ',error);
    }finally{
        await prisma.$disconnect();
    }
}
module.exports = {prisma,DbConnect}