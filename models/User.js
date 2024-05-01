import mongoose, { Schema, model } from "mongoose";

import any from "jsonwebtoken";
const { sign } = any;

import pkg from "bcryptjs";
const { hash, compare } = pkg;

const UserSchema = new Schema(
  { avatar:{type:String,required:false, default:''},
    username: { type: String, required: true },
    password: { type: String, required: true },
    admin: { type: Boolean, required: false },
    gameHistory:[{
      gameId:{type:mongoose.Schema.Types.ObjectId, default:mongoose.Types.ObjectId},
      wordCount:{type:Number},
      score:{type:Number},
      wordPerMinute:{type:Number},
      accuracy:{type:Number},
      gameTime:{type:Number,default:0},
      totalNumberOfWords:{type:Number,default:0},
      isHighestScore:{type:Boolean,default:true},
      timestamp:{type:Date, default:Date.now}
    }],
    numberOfRestarts:{type:Number,default:0},
    highestScore:{type:Number, default:0},
    highestWordCount:{type:Number,default:0},
    highestTimestamp:{type:String,default:''},
    totalNumberOfWordsAtHighest:{type:Number,default:0},
    gameTimeAtHighest:{type:Number,default:0},
    ratings: { type: Number, default: 0, required: false },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hash(this.password, 10);
    return next();
  }
  return next();
});

UserSchema.methods.generateJWT = async function () {
  return await sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await compare(enteredPassword, this.password);
};

const  User = model("User", UserSchema);

export default  User;
