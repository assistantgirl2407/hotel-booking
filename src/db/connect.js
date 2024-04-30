const mongoose =require('mongoose');

mongoose.connect('mongodb+srv://sjuly430:uOL1w4VxCHDvKQZ4@cluster0.mziyjoy.mongodb.net/')

.then(()=>{
    console.log('connection is successful')
})
.catch((e)=>{
    console.log(e,'connection failed')
})

module.exports = mongoose ;