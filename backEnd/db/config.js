import mongoose from "mongoose";
const connect=(Url)=>{
    return mongoose.connect(Url);
}
export default connect;