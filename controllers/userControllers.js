import User from "../models/User.js";

const registerUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    //check user exists
    let user = await User.findOne({ username });

    if (user) {
      //   return res.status(400).json({ message: "User already exists" });
      throw new Error("User already Exists");
    }
    // gameHistory:[{
    //   gameId:{type:mongoose.Schema.Types.ObjectId, default:mongoose.Types.ObjectId},
    //   wordCount:{type:Number},
    //   score:{type:Number},
    //   wordPerMinute:{type:Number},
    //   accuracy:{type:Number}
    // }],
    //creating a new user
    user = await User.create({
      username,
      password,
    });
    return res.status(200).json({
      _id: user._id,
      avatar:user.avatar,
      username: user.username,
      password: user.password,
      admin: user.admin,
      gameHistory: user.gameHistory,
      numberOfRestarts: user.numberOfRestarts,
      highestScore: user.highestScore,
      highestWordCount: user.highestWordCount,
      totalNumberOfWordsAtHighest: user.totalNumberOfWordsAtHighest,
      highestTimestamp: user.highestTimestamp,
      gameTimeAtHighest: user.gameTimeAtHighest,
      ratings: user.ratings,
      token: await user.generateJWT(),
      createdAt:user.createdAt
    });
  } catch (error) {
    // return res.status(500).json({message:"Something went wrong"})
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    let user = await User.findOne({ username });

    if (!user) {
      throw new Error("User Not Found");
    }
    if (await user.comparePassword(password)) {
      res.status(200).json({
        _id: user._id,
        avatar:user.avatar,
        username: user.username,
        password: user.password,
        admin: user.admin,
        gameHistory: user.gameHistory,
        numberOfRestarts: user.numberOfRestarts,
        highestWordCount: user.highestWordCount,
        highestScore: user.highestScore,
        totalNumberOfWordsAtHighest: user.totalNumberOfWordsAtHighest,
        highestTimestamp: user.highestTimestamp,
        gameTimeAtHighest: user.gameTimeAtHighest,
        ratings: user.ratings,
        token: await user.generateJWT(),
        createdAt:user.createdAt
      });
    } else {
      throw new Error("Invalid username or password");
    }
  } catch (error) {
    next(error);
  }
};

const userProfile = async (req, res, next) => {
  try {
    let user = await User.findById(req.user._id);
    if (user) {
      return res.status(201).json({
        _id: user._id,
        avatar:user.avatar,
        username: user.username,
        password: user.password,
        admin: user.admin,
        gameHistory: user.gameHistory,
        numberOfRestarts: user.numberOfRestarts,
        highestScore: user.highestScore,
        highestWordCount: user.highestWordCount,
        totalNumberOfWordsAtHighest: user.totalNumberOfWordsAtHighest,
        highestTimestamp: user.highestTimestamp,
        gameTimeAtHighest: user.gameTimeAtHighest,
        ratings: user.ratings,
        token: await user.generateJWT(),
        createdAt:user.createdAt
      });
    } else {
      let error = new Error("User not found");
      error.statusCode = 404;
      next(error);
    }
  } catch (error) {
    next(err);
  }
};

const updateGameHistory = async (req, res, next) => {
  try {
    const {
      wordCount,
      score,
      wordsPerMinute,
      accuracy,
      highestScore,
      gameTime,
      timeStamp,
      isHighestScore,
      highestWordCount,
      highestTimestamp,
      totalNumberOfWordsAtHighest,
      gameTimeAtHighest,
      numberOfRestarts,
      totalNumberOfWords
    } = req.body;

    let user = await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        $push: {
          gameHistory: {
            wordCount,
            score,
            wordsPerMinute,
            wordCount,
            accuracy,
            gameTime,
            timeStamp,
            isHighestScore,
            totalNumberOfWords

          
          },
        },
        $set: {
          numberOfRestarts:numberOfRestarts,
          highestScore: highestScore,
          highestWordCount: highestWordCount,
          highestTimestamp: highestTimestamp,
          totalNumberOfWordsAtHighest: totalNumberOfWordsAtHighest,
          gameTimeAtHighest: gameTimeAtHighest,
        },
      },
      { new: true }
    );
    res.json({
      _id: user._id,
      avatar:user.avatar,
      username: user.username,
      admin: user.admin,
      ratings: user.ratings,
      gameHistory: user.gameHistory,
      numberOfRestarts: user.numberOfRestarts,
      highestScore: user.highestScore,
      highestWordCount: user.highestWordCount,
      highestTimestamp: user.highestTimestamp,
      gameTimeAtHighest: user.gameTimeAtHighest,
      totalNumberOfWordsAtHighest: user.totalNumberOfWordsAtHighest,
      token: await user.generateJWT(),
      createdAt:user.createdAt
    });
  } catch (error) {
    next(error);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    let user = await User.findById(req.user._id);

    console.log(req.body.avatar)
      user.avatar = req.body.avatar;
      const updatedUserProfile = await user.save();
      res.json({
        _id: updatedUserProfile._id,
        avatar: updatedUserProfile.avatar,
        username: updatedUserProfile.username,
        password: updatedUserProfile.password,
        admin: updatedUserProfile.admin,
        gameHistory: updatedUserProfile.gameHistory,
        highestScore: updatedUserProfile.highestScore,
        numberOfRestarts: updatedUserProfile.numberOfRestarts,
        highestTimestamp: updatedUserProfile.highestTimestamp,
        highestWordCount: updatedUserProfile.highestWordCount,
        gameTimeAtHighest: updatedUserProfile.gameTimeAtHighest,
        totalNumberOfWordsAtHighest:
          updatedUserProfile.totalNumberOfWordsAtHighest,
        ratings: updatedUserProfile.ratings,
        token: await updatedUserProfile.generateJWT(),
        createdAt:updatedUserProfile.createdAt
      });
    

   
  } catch (error) {
    next(error);
  }
};

// Updating Description and others

//GETTING ALL THE USERS IN MY COLLECTION
const getLeaderBoard = async (req, res, next) => {
  try {
    const allUsers = await User.find()
      .sort({ highestScore: -1 })
      .select("-password");
    res.json(allUsers);
  } catch (error) {
    next(error);
  }
};

const searchUsers = async (req, res, next) => {
  try {
    const regexSearchParam = new RegExp(req.query.name, "i");

    const players = await User.find({
      name: { $regex: regexSearchParam },
    }).select("-password");
    res.json(players);
  } catch (error) {
    next(error);
  }
};

export {
  registerUser,
  loginUser,
  userProfile,
  updateAvatar,
  getLeaderBoard,
  searchUsers,
  updateGameHistory,
};
