const {roles} = require('../../../utils/roles')
const checkPermission = (roles,fileType)=>{
    if(roles.includes(roles.STDUENT)){
        if(fileType !== 'ملخص'){
            throw new Error('الطلاب يمكنهم رفع ملخصات فقط')
        }
    }
}

module.exports = {checkPermission}