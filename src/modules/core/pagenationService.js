
const pagenation = (pageNum , limitNum , dataLength,sortItem)=>{


    const page = parseInt(pageNum) || 1;
    const limit = parseInt(limitNum) || 10;
    const skip = (page - 1) * limit;
    const totalPages = Math.ceil(dataLength/limit);
    const sort = sortItem || 'asc';
    return {
        page ,
        limit,
        skip,
        totalPages,
        sort
    }
}

module.exports = {pagenation}