import { Schema, model } from "mongoose";

import any from 'jsonwebtoken';
const { sign } = any;

import pkg from 'bcryptjs';
const { hash,compare } = pkg;


const UserSchema = new Schema(
  {
    avatar: { type: String, default: "" },
    name: { type: String, required: true },
    email: { type: String, required: true,lowercase:true },
    password: { type: String, required: true },
    tel:{type:String,required:true},
    verified: { type: Boolean, default: false },
    verificationCode: { type: String, required: false },
    partner:{type:Boolean,default:true,required:false},
    admin: { type: Boolean, required: false },
    description:{type:String,default:""},
    skills:{type:[String],required:false},
    certifications:{type:[String],required:false},
    basePrice:{type:Number,default:0,required:false},
    deliveryTime:{type:Number,default:0,required:false},
    revisions:{type:String,default:"",required:false},
    gigDescription:{type:String,default:"",required:false},
    ratings:{type:Number,default:0,required:false},
    gigType:{type:String,default:"",required:false,lowercase:true},
    servicesInProgress:{type:[String],required:false}
  },
  { timestamps: true }
);

UserSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password=await hash(this.password,10);
        return next()
    }
    return next()
})

UserSchema.methods.generateJWT=async function(){
    return await sign({id:this._id},process.env.JWT_SECRET,{expiresIn:"30d"})
}

UserSchema.methods.comparePassword= async function(enteredPassword){
  return await compare(enteredPassword,this.password);

}

const User=model("User",UserSchema);



export default User;