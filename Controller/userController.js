import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import TryCatch from "../utis/TryCatch.js";
import generateToken from "../utis/generateToken.js";

// export const registerUser = async(req,res)=>{
//     try{
//         const {name, email, password} = req.body;//agar req.body se value chhiye, then we need a middleware, so we're going to index.js now to use middleware

//         let user = await User.findOne({email})

//         if(user) return res.status(400).json({
//             messagae:"Already have an account with this email",
//         });

//         const hashPassword = await bcrypt.hash(password, 10);
//         user = await User.create({
//             name, email,password:hashPassword,
//         });

//         res.status(201).json({
//             user,
//             message:"User registered",
//         })
//         }
//      catch (error){
//         res.status(500).json({
//             message:error.messagae
//         })
//     }
// };

// export const loginUser = async(req,res)=>{
//     try {

//     } catch(error){

//     }
// }

//there's multiple time use of the try catch block. So we will create a new file as TryCatch.js just to reduce the redundancy of the block

export const registerUser = TryCatch(async (req, res) => {
  const { name, email, password } = req.body; //agar req.body se value chhiye, then we need a middleware, so we're going to index.js now to use middleware

  let user = await User.findOne({ email });

  if (user)
    return res.status(400).json({
      message: "Already have an account with this email",
    });

  const hashPassword = await bcrypt.hash(password, 10);
  user = await User.create({
    name,
    email,
    password: hashPassword,
  });

  generateToken(user._id,res);

  res.status(201).json({
    user,
    message: "User registered",
  });
});


export const loginUser = TryCatch(async(req, res) => {
    const {email, password}= req.body

    const user= await User.findOne({email});
    if (!user)
        return res.status(400).json({
    message: "No user with this mail"});

    const comparePassword = await bcrypt.compare(password,  user.password);

    if(!comparePassword)
        return res.status(400).json({
    message: "Wrong passowrd"});

    generateToken(user._id,res);

    res.json({
        user, message:"Logged in"
    })
});
/***** import notation--> req.user._id */

//user, admin profile fetching API below--->

export const myProfile = TryCatch(async(req,res)=>{
  const user = await User.findById(req.user._id)
  res.json(user);
});

export const userProfile = TryCatch(async(req,res)=>{
  const user = await User.findById(req.params.id).select("-password");
  res.json(user);
});

//follow unfollow API---> 

export const followAndunfollowUser = TryCatch(async(req,res)=>{
  const user= await User.findById(req.params.id);
  const loggedInUser = await User.findById(req.user._id)

  if(!user) return res.status(400).json({
    message: "No user with this id",
  });

  if(user._id.toString()==loggedInUser._id.toString())

    return res.status(400).json({
      message: "You can't follow yourself",
    });

    if (user.followers.includes(loggedInUser._id.toString())) 
      {
      const indexFollowing = loggedInUser.following.indexOf(user._id)

      const indexFollowers = user.followers.indexOf(loggedInUser._id);

      loggedInUser.following.splice(indexFollowing, 1);
      user.followers.splice(indexFollowers, 1);

      await loggedInUser.save()
      await user.save()

      res.json({
        message: "User Unfollowed",
      });
    }

    else{
      loggedInUser.following.push(user._id)
      user.followers.push(loggedInUser._id);

      await loggedInUser.save();
      await user.save();

      res.json({
        message: "User followed",
      });
    }
})


//logout api

export const logOutUser = TryCatch(async(req,res)=>{
  res.cookie("token", "", { maxAge: 0});

  res.json({
    message: " Logged out Successfully",
  });
})