import "reflect-metadata";
import { dataSource, User} from "../crud-api/src";
import {Request , Response} from 'express'


import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'



const app = express();
app.use(cors());
app.use(bodyParser.json());


dataSource.initialize()
    .then(() => console.log("Database connected"))
    .catch((error) => console.log("Error connecting to database:", error));


app.get("/newendpoint" , async(req:Request , res:Response):Promise<any> =>{

  try{

    const userRepository = dataSource.getRepository(User);
    const findUser = await userRepository.find()

    if(!findUser){
      console.log("Database is empty");
      return res.status(200).json({
        success:true,
        message:"Database is empty"
      })
    }
 return res.status(200).json(findUser)

  }catch(err){
    console.log(err);
    return res.status(500).json({
      success:true,
      message:"Internal Server Error"
    })
  }
})


app.post("/addoutuser" , async(req:Request , res:Response) : Promise<any> => {

  const {id , firstName , lastName ,isActive} = req.body;

try{
  const userRepository = dataSource.getRepository(User);

  const userCheck = await userRepository.findOne({where:{id}})
  if(!userCheck){
     const saveUser = userRepository.create(req.body);
     await userRepository.save(saveUser);

     return res.status(200).json({
      success:true,
      message:"User Added successfully"
     })
  }

  return res.status(404).json({
    success:true,
    message:"User already Exist"
  })

}catch(err){

  console.log(err);
  return res.status(500).json({
    success:true,
    message:"Internal Server Error"
  })

}

})


app.put("/updatefromout/:id" , async(req:Request , res:Response) : Promise<any> =>{

  const{id} = req.params;
const { firstName , lastName , isActive } = req.body;

try{
  const userRepository = dataSource.getRepository(User);
  const userCheck = await userRepository.findOne({where:{id:Number(id)}})


if(!userCheck){
  console.log("User not found")
  return res.status(404).json({
       success:true,
       message:"User not found"
  })
}

if(!id){
  console.log("Please provide valid id")
  return res.status(404).json({
       success:true,
       message:"Please provide a valid id"
  })
}

if(!firstName || !lastName){
  console.log("Please provide a first name or last name")
  return res.status(404).json({
       success:true,
       message:"Please provide a first name or last name"
  })
}


if(firstName){
  userCheck.firstName = firstName;
}
if(lastName){
  userCheck.lastName = lastName;
}
if(isActive){
  userCheck.isActive = isActive;
}

await userRepository.save(userCheck);

return res.status(200).json({
  success:true,
  message:"User updated successfully"
})

}catch(err){
  console.log(err);
  return res.status(500).json({
    success:true,
    message:"Internal Server Error"
  })
}

})


app.delete("/deletefromout/:id" , async(req:Request , res:Response) : Promise<any> => {
  const {id} = req.params;

  try{
    const userRepository = dataSource.getRepository(User)
    const userCheck = await userRepository.findOne({where:{id:Number(id)}})
  
    if(!id){
          console.log("Please provide id")
    }

    await userRepository.remove(userCheck!);

    return res.status(200).json({
      success:true,
      message:"User deleted successfully"
    })

  }catch(err){
    console.log(err);
    return res.status(500).json({
      success:true,
      message:"Internal Server Error"
    })
  }
})







app.listen(3000, () => console.log("Server running on port 3000"));






// ts-node main.ts (is used to run the server of this file Migration.ts)


