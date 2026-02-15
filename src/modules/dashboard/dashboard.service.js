const {prisma} = require('../../configs/prisma')

class DashboardServices{
    static async getOverView(){
        const [
            students,
            pendingFiles,
            pendingDegrees,
            lectures
        ] = await Promise.all([
            prisma.student.count(),
            prisma.file.count({
                where:{
                    OR:[
                        {
                            material:{
                                status : 'قيد الإنتظار'
                            }
                        },
                        {
                            exams:{
                                status : 'قيد الإنتظار'
                            }
                        },
                        {
                            research:{
                                status : 'قيد الإنتظار'
                            }
                        }
                    ]
                }
            
            }),
            prisma.degreeRequest.count({
                where:{
                    OR:[
                        {
                            status:'قيد الإنتظار'
                        },
                        {
                            status:'قيد المراجعة'
                        }
                    ]
                }
            }),
            prisma.lecture.count()
        ])

        return {
            students,pendingFiles,pendingDegrees,lectures
        }
    }

    static async getfilesStatusSummary(){
        const lectures = await prisma.courseMaterial.groupBy({
            by:['status'],
            _count:{
                status:true
            }
        });

        const exams = await prisma.exam.groupBy({
            by:['status'],
            _count:{
                status:true
            }
        });

        const researchs = await prisma.research.groupBy({
            by:['status'],
            _count:{
                status:true
            }
        });

        const ALL_STATUS = ['قيد الإنتظار','تم التأكيد','مرفوض']
        return this.normalizeData(ALL_STATUS,...researchs,...exams,...lectures);
    }

    static async getDegreesStatusSummary(){
        const degrees = await prisma.degreeRequest.groupBy({
            by:['status'],
            _count:{
                status:true
            }
        });

        const ALL_STATUS = ['قيد المراجعة','قيد الإنتظار','مكتمل','مرفوض']
    
        return this.normalizeData(ALL_STATUS,...degrees);
    }

    static async getFileActivitySummary(){
        const filesActivity = await prisma.$queryRaw`
        SELECT DATE("createdAt") AS day, COUNT(*)::int AS count
        FROM "File"
        WHERE "createdAt" >= CURRENT_DATE - INTERVAL '29 days'
        GROUP BY day
        ORDER BY day desc
        `;


        const result = {};
        filesActivity.flat().forEach(item =>{
            const day = item.day.toISOString().slice(0,10);
            const count = item.count;
            result[day] = (result[day] || 0) + count
        })
        return result;
    }

    static mergeStatus(...arrays){
        const result = {};
        arrays.flat().forEach(item =>{
            const status = item.status;
            const count = item._count.status;

            result[status] = (result[status] || 0) + count
        })
        return result;
    }

    static normalizeData(allStatus,...data){
        const statusSummary = this.mergeStatus(data);
        const normalized = Object.fromEntries(
            allStatus.map(s=> [s,statusSummary[s]||0])
        )
        return normalized;
    }
}

module.exports = {DashboardServices}