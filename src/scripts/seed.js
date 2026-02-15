const {prisma,DbConnect} = require('../configs/prisma');
const bcrypt = require('bcrypt')
require('dotenv').config()

async function seed (){

    await DbConnect();
    console.log('🌱 Starting database seeding...\n')
    try{
        const department  = await prisma.department.findFirst();
        const semester = await prisma.semester.findFirst();
        const role = await prisma.role.findFirst();
        const degreeType = await prisma.degreeType.findFirst();
        const bank = await prisma.bank.findFirst();

        let user = await prisma.user.findFirst();

        if(!bank){
            console.log('Creating bank data ...')
            await prisma.bank.createMany({
                data : [
                    {
                        bankName : 'بنك الخرطوم',
                        accountNumber : 12345,
                        accountName : 'جامعة شندي'
                    },
                    {
                        bankName : 'بنك فيصل الإسلامي',
                        accountNumber : 12345,
                        accountName : 'جامعة شندي'
                    },
                    {
                        bankName : 'بنك امدرمان',
                        accountNumber : 12345,
                        accountName : 'جامعة شندي'
                    }
                ]
            })

            console.log('✔️ Bank data created successfully \n')
        }

        if(!degreeType){
            console.log('Creating degree types data ...')
            await prisma.degreeType.createMany({
                data : [
                    {title : 'مجمل عربي' , price : 120000},
                    {title : 'مجمل إنجليزي' , price : 120000},
                    {title : 'تفاصيل عربي' , price : 200000},
                    {title : 'تفاصيل إنجليزي' , price : 200000}
                ]
            })

            console.log('✔️ Degree types data created successfully \n')
        }
        if(!department){
            console.log('Creating department data ...')
            await prisma.department.createMany({
                data : [
                    {title:"إدارة الأعمال"},
                    {title:"الإقتصاد"},
                    {title:"المحاسبة"},
                    {title:"البنوك والمصارف"}
                ]
            })

            console.log('✔️ Department data created successfully \n')
        }
        if(!semester){
            console.log('Creating semester data ...')
            await prisma.semester.createMany({
                data : [
                    {title:"الفصل الدراسي الأول",semesterNum : 1},
                    {title:"الفصل الدراسي الثاني",semesterNum : 2},
                    {title:"الفصل الدراسي الثالث",semesterNum : 3},
                    {title:"الفصل الدراسي الرابع",semesterNum : 4},
                    {title:"الفصل الدراسي الخامس",semesterNum : 5},
                    {title:"الفصل الدراسي السادس",semesterNum : 6},
                    {title:"الفصل الدراسي السابع",semesterNum : 7},
                    {title:"الفصل الدراسي الثامن",semesterNum : 8}
                ]
            })

            console.log('✔️ Semester data created successfully ')
        }
        if(!role){
            console.log('Creating roles data ...')
            await prisma.role.createMany({
                data : [
                    {name:'مسؤول'},
                    {name:'دكتور'},
                    {name:'طالب'}
                ]
            })
            console.log('✔️ Roles data created successfully \n')
        }

        if(!user){
            console.log('Creating Admin user ...')
            const role = await prisma.role.findUnique({
                                where : {name : 'مسؤول'}
                            });
            user = await prisma.user.create({
                data : {
                    email:"admin@gmail.sa",
                    fullname : "المدير العام",
                    address : "وادي حلفا",
                    password : await bcrypt.hash("Admi@n123",10),
                    isChangePassword:true
                }
            })
            console.log('Set User to Role Admin ...')
            if(user){
                await prisma.usersRole.create({
                    data: {
                        userId: user.id,
                        roleId: role.id
                    }
                });

                console.log('✔️ Admin user created successfully \n')
                console.log('   Email: admin@gmail.sa');
                console.log('   Password: Admi@n123 \n');
            }

            console.log('\n🎉 Database seeding completed successfully!');
            console.log('\n📋 Summary:');
            console.log('   - 3 Banks data');
            console.log('   - 4 Departments');
            console.log('   - 8 Semesters');
            console.log('   - 3 Roles');
            console.log('   - 1 Admin user');
            console.log('\n💡 You can now start the server with: npm run dev');
        }else{
            console.log('💡 Seeding is allready done!');
            console.log('\n💡 You can now start the server with: npm run dev');
        }

    }catch(error){
        console.error('❌ Error during seeding:', error);
        process.exit(1);
    }
}
seed();