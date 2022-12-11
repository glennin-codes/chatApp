const errorHandler = (err,req,res,next)=>{
    const errStatus=err.status || 500;
    const errMessage=err.message || "something went wrong engineers are working on it"
   return  res.status(errStatus).json({
        succes:false,
        status:errStatus,
        message:errMessage,
        stack:err.stack

    })
}
export default errorHandler;