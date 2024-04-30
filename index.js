const ejs = require('ejs');
const express = require('express');
const app =express();
const path = require ('path');
const bcryptjs = require('bcryptjs')
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser");
const signUpRecord = require("./src/models/register")
const Host_Register = require("./src/models/hostadd")

const PORT =2400;
const mongo = require('./src/db/connect');

app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));
app.use('/css',express.static(path.join(__dirname,'public/css')));
app.use(express.urlencoded({extended:true}))

app.set('view engine' , 'ejs');
app.set('views',path.join(__dirname,'./templates/views'));
const templates_path = path.join(__dirname,"./templates/views")
app.set("views",templates_path);


const {MongoClient , ObjectId } =require('mongodb');


//function for password hasspass//

async function hashPass(password){
    const res = await bcryptjs.hash(password,10)
    return res
}

//mongodb uri connection///

async function FindData(){
  const uri = 'mongodb+srv://sjuly430:uOL1w4VxCHDvKQZ4@cluster0.mziyjoy.mongodb.net/'
const client = new MongoClient(uri);

await client.connect();

var result = await client.db("sample_airbnb").collection("listingsAndReviews").find().limit(50).toArray();

return result ;
};



//second function to search from id//

async function FindData1(id){
  //mongodb uri connction//
  const uri = 'mongodb+srv://sjuly430:uOL1w4VxCHDvKQZ4@cluster0.mziyjoy.mongodb.net/'
const client = new MongoClient(uri);

await client.connect();

var result = await client.db("sample_airbnb").collection("listingsAndReviews").findOne({_id: id })

return result
}


//======  home page ==========//
app.get('/',async (req,res)=>{
    res.render('welcome')
})

//=========== register page  ===========//
app.get ('/register',async(req,res)=>{
    try{
        res.render('register')
      }
      catch(error){
        res.render('error',{error:error.message})
      }
})

//=====handling user registeration ===//

app.post("/register",async (req,res)=>{
   try{
    const check = await signUpRecord.findOne({ email: req.body.email });

    if(check){
res.send("user already exists");
 } else {


  const hashedPassword = await hashPass(req.body.password);
      const token = jwt.sign({ email: req.body.email }, "sadasdsadsadsadsadsadsadsadasdasdsaadsadsadsadasefef");

      res.cookie("jwt",token,{
        maxAge:600000,
        httpOnly:true
      })
      const user = {
        email:req.body.email,
        username: req.body.username,
        password: hashedPassword,
        token: token,
      };

      await signUpRecord.insertMany(user);
      res.redirect('/index');
}
   } catch (error) {
    res.send("Error: " + error.message);
   }
})





//==============  login ==============//


app.get('/login', (req, res) => {
    res.render('login');
  });



  //handling user login

  app.post('/login',async(req,res)=>{
    try{
const {email,password} = req.body;
console.log('details',email,password);

const userDetails= await signUpRecord.findOne({email:email},{password:password});
const generateToken = (userData)=>{
  return jwt.sign(userData,"sadasdsadsadsadsadsadsadsadasdasdsaadsadsadsadasefef",{expiresIn:'1h'})

}

console.log('userdetails',userDetails);
          const token=generateToken({password:userDetails.password,email:email});
          console.log('token is ',token);
          res.cookie('email',userDetails.email);// Set cookies for email, password, and the generated JWT token.
          res.cookie('password',userDetails.password);

          res.cookie('jwt',token,{httponly:true});

      if(userDetails){
          
          res.redirect('/index');
      }
    }catch(e){
console.log(e);
    }
  })


  //====route to render  the index page ///

  app.get('/index' , async (req, res) => {
    let data = await FindData();
   let data1 = await FindData2();
  
    res.render('index', {
      data: data,
      data1:data1,
      
    });
  
  });

  // route for displaying details of a specific item//

  app.get ('/details/:id',async(req,res)=>{
    try {
      let data = await FindData1(req.params.id);
      res.render('details', {
        data: data,
      });
    } catch (error) {
      res.render('error', { error: error.message });
    }
  })

  //==== route to logout page ====//

  app.get("/logout", async (req, res) => {
    try {
   
      res.redirect("/");
    } catch (error) {
      res.status(500).send(error);
    }
  })
  
  ///===== route to help page ====////


  app.get('/help', (req, res) => {
    res.render('help');
});


async function FindData2(){
  const uri = 'mongodb+srv://sjuly430:uOL1w4VxCHDvKQZ4@cluster0.mziyjoy.mongodb.net/'
  const client = new MongoClient(uri);
  await client.connect()
  var result1 = await client.db("userdetail").collection("host_datas").find().toArray();
  return result1
}

// async function FindData3(HomeName){
//   const uri = 'mongodb+srv://sjuly430:uOL1w4VxCHDvKQZ4@cluster0.mziyjoy.mongodb.net/'
//   const client = new MongoClient(uri);
//   await client.connect()
//   var result2 = await client.db("userdetail").collection("host_datas").findOne({HomeName});
//   return result2
// }
async function FindData3(HomeName) {
  const uri = "mongodb+srv://atulnew:topology@cluster0.yylrcsq.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(uri);
  await client.connect();

  var result2 = await client.db("userdetail").collection("host_datas").findOne({HomeName});
  return result2
}
 

//rendering to hostpage ===///
//data by using curd operation ==///

app.get ('/host_page' , async (req,res) =>{
  let data2 = await FindData2();
  res.render('host_page',{
    data2  : data2,
  })
})

// =========================================GETTING ADD USER PAGE========================================

app.get('/adduser',(req,res)=>{
  res.render('adduser')
})


//  ======================================GETTING TO HOST INFORMATION=========================================

app.post('/hostinform', async (req, res) => {

  const HostSchema = new Host_Register({
    HomeName: req.body.hname,
    Location: req.body.location,
    PropertyType: req.body.ptype,
    Homeurl: req.body.Imageurl,
    minimum_nights: req.body.mnights,
    neighbourhood_overview: req.body.overview,
    cancellation_policy:req.body.policy,
    Price: req.body.price,
    
  });
  const registered = await HostSchema.save();
   if(registered){
    
  res.redirect('/host_page')
  }else{
    res.redirect('/');
  }
 
});



// ==========================EDITING USING MONGODB FUNCTION=============================================

app.get("/edit/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data2 = await Host_Register.findById(id);

   if(!data2){
return res.redirect("/host_page")
   }
    res.render("edituser", {
      title: 'Edit User',
      data2: data2,
    });
  } catch (error) {
    console.error(error);
  res.redirect("/host_page")
  }
});


// =================================================DELETING USING MONGODB FUNCTION=========================

app.get('/delete/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deletedItem = await Host_Register.findOneAndDelete({ _id: id });

    if (!deletedItem) {
      return res.status(404).send('Item not found');
    }

    res.redirect('/host_page');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});





// =============================================UPDATING TO HOST DATA-====================================================

app.post('/hostinform/:id',async(req,res) =>{
  let id = req.params.id;
 await Host_Register.findOneAndUpdate({_id:id},{
    HomeName: req.body.hname,
    Location: req.body.location,
    PropertyType: req.body.ptype,
    Homeurl: req.body.Imageurl,
    minimum_nights: req.body.mnights,
     cancellation_policy:req.body.policy,
    Price: req.body.price,
  })
  if (id != id) {
    console.log(err);
} else {
  
   res.redirect('/host_page')
}
       
  });







app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})

