import UserModel from "../Models/userModel.js";

import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import createError from "../Errors/createError.js";
// Get a User
export const getUser = async (req, res,next) => {
  const id = req.params.id;

  try {
    const user = await UserModel.findById(id);
    if (user) {
      const { password, ...otherDetails}=user._doc
      res.status(200).json(otherDetails);
    } else {
      next(createError(404,"no search user"))
    }
  } catch (error) {
   next(error)
  }
};

// Get all users
export const getAllUsers = async (req, res,next) => {

  try {
    let users = await UserModel.find();
    users = users.map((user)=>{
      const {password, ...otherDetails} = user._doc
      return otherDetails
    })
    res.status(200).json(users);
  } catch (error) {
    next(error)
  }
};

// udpate a user

export const updateUser = async (req, res,next) => {
  const id = req.params.id;
  // console.log("Data Received", req.body)
  const { _id, currentUserAdmin, password } = req.body;
  
  if (id === _id) {
    try {
      // if we also have to update password then password will be bcrypted again
      if (password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);
      }
      // have to change this
      const user = await UserModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      const token = jwt.sign(
        { username: user.username, id: user._id },
        process.env.JWT,
        { expiresIn: "1h" }
      );
      console.log({user, token})
      res.status(200).json({user, token});
    } catch (error) {
      console.log("Error agya hy")
      next(error)
    }
  } else {
   next(createError(403,"Access Denied! You can update only your own Account."))
  }
};

// Delete a user
export const deleteUser = async (req, res,next) => {
  const id = req.params.id;

  const { currentUserId, currentUserAdmin } = req.body;

  if (currentUserId == id || currentUserAdmin) {
    try {
      await UserModel.findByIdAndDelete(id);
      res.status(200).json("User Deleted Successfully!");
    } catch (error) {
      next(error)
    }
  } else {
  next(createError(403,"Access Denied!"))
  }
};

// Follow a User
// changed
export const followUser = async (req, res,next) => {
  const id = req.params.id;
  const { _id } = req.body;
  console.log(id, _id)
  if (_id == id) {
    next(createError(403,"Action Forbidden"))
  } else {
    try {
      const followUser = await UserModel.findById(id);
      const followingUser = await UserModel.findById(_id);

      if (!followUser.followers.includes(_id)) {
        await followUser.updateOne({ $push: { followers: _id } });
        await followingUser.updateOne({ $push: { following: id } });
        res.status(200).json("User followed!");
      } else {
       next(createError(403,"you are already following this id"))
      }
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
};

// Unfollow a User
// changed
export const unfollowUser = async (req, res) => {
  const id = req.params.id;
  const { _id } = req.body;

  if(_id === id)
  {
    res.status(403).json("Action Forbidden")
  }
  else{
    try {
      const unFollowUser = await UserModel.findById(id)
      const unFollowingUser = await UserModel.findById(_id)


      if (unFollowUser.followers.includes(_id))
      {
        await unFollowUser.updateOne({$pull : {followers: _id}})
        await unFollowingUser.updateOne({$pull : {following: id}})
        res.status(200).json("Unfollowed Successfully!")
      }
      else{
        res.status(403).json("You are not following this User")
      }
    } catch (error) {
      res.status(500).json(error)
    }
  }
};
