const {prisma} = require('./prisma');
const bcrypt = require('bcrypt')
async function main (){
    try{
        const department  = await prisma.department.findFirst();
        const semester = await prisma.semester.findFirst();
        const role = await prisma.role.findFirst();
        const degreeType = await prisma.degreeType.findFirst();
        const bank = await prisma.bank.findFirst();

        let user = await prisma.user.findFirst();

        if(!bank){
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
        }

        if(!degreeType){
            await prisma.degreeType.createMany({
                data : [
                    {title : 'مجمل عربي' , price : 120000},
                    {title : 'مجمل إنجليزي' , price : 120000},
                    {title : 'تفاصيل عربي' , price : 200000},
                    {title : 'تفاصيل إنجليزي' , price : 200000}
                ]
            })
        }
       
        if(!department){
            await prisma.department.createMany({
                data : [
                    {title:"إدارة الأعمال"},
                    {title:"الإقتصاد"},
                    {title:"المحاسبة"},
                    {title:"البنوك والمصارف"}
                ]
            })
        }
        if(!semester){
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
        }
        if(!role){
            await prisma.role.createMany({
                data : [
                    {name:'مسؤول'},
                    {name:'دكتور'},
                    {name:'طالب'}
                ]
            })
        }

        if(!user){
            const role = await prisma.role.findUnique({
                                where : {name : 'مسؤول'}
                            });
            user = await prisma.user.create({
                data : {
                    email:"moatazazhary@outlook.sa",
                    fullname : "معتز بالله أزهري حسب الله مرسال",
                    address : "وادي حلفا",
                    password : await bcrypt.hash("moataz12@",10),
                }
            })
            if(user){
                await prisma.usersRole.create({
                    data: {
                        userId: user.id,
                        roleId: role.id
                    }
                });
            }
        }

    }catch(error){
        console.error("seed error :" ,error.message)
    }
}

module.exports = main