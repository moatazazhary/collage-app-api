const { DashboardServices } = require("./dashboard.service");

const overView = async (req,res)=>{
    try{

        const kpis = await DashboardServices.getOverView();
        res.status(200).json({
            success : true,
            message : "تم جلب البيانات بنجاح",
            kpis
        });
    }catch(error){
        res.status(500).json({
            success : false,
            message : "some thing went wrong!",
            error : error.message
        });
    }
}


const FilesStatusSummary = async (req,res)=>{
    try{

        const summary = await DashboardServices.getfilesStatusSummary();
        res.status(200).json({
            success : true,
            message : "تم جلب البيانات بنجاح",
            summary
        });
    }catch(error){
        res.status(500).json({
            success : false,
            message : "some thing went wrong!",
            error : error.message
        });
    }
}

const DegreesStatusSummary = async (req,res)=>{
    try{

        const summary = await DashboardServices.getDegreesStatusSummary();
        res.status(200).json({
            success : true,
            message : "تم جلب البيانات بنجاح",
            summary
        });
    }catch(error){
        res.status(500).json({
            success : false,
            message : "some thing went wrong!",
            error : error.message
        });
    }
}

const FileActivity = async (req,res)=>{
    try{

        const summary = await DashboardServices.getFileActivitySummary();
        res.status(200).json({
            success : true,
            message : "تم جلب البيانات بنجاح",
            summary
        });
    }catch(error){
        res.status(500).json({
            success : false,
            message : "some thing went wrong!",
            error : error.message
        });
    }
}

module.exports = {overView,FilesStatusSummary,DegreesStatusSummary,FileActivity}