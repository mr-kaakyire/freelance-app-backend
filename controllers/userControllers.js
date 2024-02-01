import { uploadPicture } from "../middleware/uploadPictureMiddleware.js";
import User from "../models/User.js";
import { fileRemover } from "../utils/fileRemover.js";
import https from "https";

const registerUser = async (req, res, next) => {
  try {
    const { name, email, tel, password } = req.body;

    //check user exists
    let user = await User.findOne({ email });

    if (user) {
      //   return res.status(400).json({ message: "User already exists" });
      throw new Error("User already Exists");
    }

    //creating a new user
    user = await User.create({
      name,
      email,
      tel,
      password,
    });
    return res.status(200).json({
      _id: user._id,
      avatar: user.avatar,
      name: user.name,
      email: user.email,
      tel: user.tel,
      verified: user.verified,
      partner: user.partner,
      admin: user.admin,
      token: await user.generateJWT(),
      description: user.description,
      skills: user.skills,
      certifications: user.certifications,
      basePrice: user.basePrice,
      deliveryTime: user.deliveryTime,
      gigDescription: user.gigDescription,
      revisions: user.revisions,
      ratings: user.ratings,
      gigType: user.gigType,
      servicesInProgress: user.servicesInProgress,
    });
  } catch (error) {
    // return res.status(500).json({message:"Something went wrong"})
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      throw new Error("Email not found");
    }
    if (await user.comparePassword(password)) {
      res.status(200).json({
        _id: user._id,
        avatar: user.avatar,
        name: user.name,
        email: user.email,
        tel: user.tel,
        verified: user.verified,
        partner: user.partner,
        admin: user.admin,
        token: await user.generateJWT(),
        description: user.description,
        skills: user.skills,
        certifications: user.certifications,
        basePrice: user.basePrice,
        deliveryTime: user.deliveryTime,
        gigDescription: user.gigDescription,
        revisions: user.revisions,
        ratings: user.ratings,
        gigType: user.gigType,
        servicesInProgress: user.servicesInProgress,
      });
    } else {
      throw new Error("Invalid email or password");
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
        avatar: user.avatar,
        name: user.name,
        email: user.email,
        tel: user.tel,
        verified: user.verified,
        partner: user.partner,
        admin: user.admin,
        description: user.description,
        skills: user.skills,
        certifications: user.certifications,
        basePrice: user.basePrice,
        deliveryTime: user.deliveryTime,
        gigDescription: user.gigDescription,
        revisions: user.revisions,
        ratings: user.ratings,
        gigType: user.gigType,
        servicesInProgress: user.servicesInProgress,
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

const updateProfile = async (req, res, next) => {
  try {
    let user = await User.findById(req.user._id);

    if (req.body.description && req.body.description != user.description) {
      user.description = req.body.description;
      const updatedUserProfile = await user.save();
      res.json({
        _id: updatedUserProfile._id,
        avatar: updatedUserProfile.avatar,
        name: updatedUserProfile.name,
        email: updatedUserProfile.email,
        tel: updatedUserProfile.tel,
        verified: updatedUserProfile.verified,
        partner: updatedUserProfile.partner,
        admin: updatedUserProfile.admin,
        token: await updatedUserProfile.generateJWT(),
        description: updatedUserProfile.description,
        skills: updatedUserProfile.skills,
        certifications: updatedUserProfile.certifications,
        basePrice: updatedUserProfile.basePrice,
        deliveryTime: updatedUserProfile.deliveryTime,
        gigDescription: updatedUserProfile.gigDescription,
        revisions: updatedUserProfile.revisions,
        ratings: updatedUserProfile.ratings,
        gigType: updatedUserProfile.gigType,
        servicesInProgress: updatedUserProfile.servicesInProgress,
      });
    }
    if (req.body.skill && !user.skills.includes(req.body.skill)) {
      user.skills.push(req.body.skill);
      const updatedUserProfile = await user.save();
      res.json({
        _id: updatedUserProfile._id,
        avatar: updatedUserProfile.avatar,
        name: updatedUserProfile.name,
        email: updatedUserProfile.email,
        tel: updatedUserProfile.tel,
        verified: updatedUserProfile.verified,
        partner: updatedUserProfile.partner,

        admin: updatedUserProfile.admin,
        token: await updatedUserProfile.generateJWT(),
        description: updatedUserProfile.description,
        skills: updatedUserProfile.skills,
        certifications: updatedUserProfile.certifications,
        basePrice: updatedUserProfile.basePrice,
        deliveryTime: updatedUserProfile.deliveryTime,
        gigDescription: updatedUserProfile.gigDescription,
        revisions: updatedUserProfile.revisions,
        ratings: updatedUserProfile.ratings,
        gigType: updatedUserProfile.gigType,
        servicesInProgress: updatedUserProfile.servicesInProgress,
      });
    }

    if (
      req.body.certification &&
      !user.certifications.includes(req.body.certification)
    ) {
      user.certifications.push(req.body.certification);
      const updatedUserProfile = await user.save();
      res.json({
        _id: updatedUserProfile._id,
        avatar: updatedUserProfile.avatar,
        name: updatedUserProfile.name,
        email: updatedUserProfile.email,
        tel: updatedUserProfile.tel,
        verified: updatedUserProfile.verified,
        partner: updatedUserProfile.partner,
        admin: updatedUserProfile.admin,
        token: await updatedUserProfile.generateJWT(),
        description: updatedUserProfile.description,
        skills: updatedUserProfile.skills,
        certifications: updatedUserProfile.certifications,
        basePrice: updatedUserProfile.basePrice,
        deliveryTime: updatedUserProfile.deliveryTime,
        gigDescription: updatedUserProfile.gigDescription,
        revisions: updatedUserProfile.revisions,
        ratings: updatedUserProfile.ratings,
        gigType: updatedUserProfile.gigType,
        servicesInProgress: updatedUserProfile.servicesInProgress,
      });
    }

    if (req.body.name && req.body.name != user.name) {
      user.name = req.body.name;
      const updatedUserProfile = await user.save();
      res.json({
        _id: updatedUserProfile._id,
        avatar: updatedUserProfile.avatar,
        name: updatedUserProfile.name,
        email: updatedUserProfile.email,
        tel: updatedUserProfile.tel,
        verified: updatedUserProfile.verified,
        partner: updatedUserProfile.partner,

        admin: updatedUserProfile.admin,
        token: await updatedUserProfile.generateJWT(),
        description: updatedUserProfile.description,
        skills: updatedUserProfile.skills,
        certifications: updatedUserProfile.certifications,
        basePrice: updatedUserProfile.basePrice,
        deliveryTime: updatedUserProfile.deliveryTime,
        gigDescription: updatedUserProfile.gigDescription,
        revisions: updatedUserProfile.revisions,
        ratings: updatedUserProfile.ratings,
        gigType: updatedUserProfile.gigType,
        servicesInProgress: updatedUserProfile.servicesInProgress,
      });
    }

    if (req.body.basePrice && req.body.basePrice != user.basePrice) {
      user.basePrice = req.body.basePrice;
      const updatedUserProfile = await user.save();
      res.json({
        _id: updatedUserProfile._id,
        avatar: updatedUserProfile.avatar,
        name: updatedUserProfile.name,
        email: updatedUserProfile.email,
        tel: updatedUserProfile.tel,
        verified: updatedUserProfile.verified,
        partner: updatedUserProfile.partner,

        admin: updatedUserProfile.admin,
        token: await updatedUserProfile.generateJWT(),
        description: updatedUserProfile.description,
        skills: updatedUserProfile.skills,
        certifications: updatedUserProfile.certifications,
        basePrice: updatedUserProfile.basePrice,
        deliveryTime: updatedUserProfile.deliveryTime,
        gigDescription: updatedUserProfile.gigDescription,
        revisions: updatedUserProfile.revisions,
        ratings: updatedUserProfile.ratings,
        gigType: updatedUserProfile.gigType,
        servicesInProgress: updatedUserProfile.servicesInProgress,
      });
    }
    if (req.body.deliveryTime && req.body.deliveryTime != user.deliveryTime) {
      user.deliveryTime = req.body.deliveryTime;
      const updatedUserProfile = await user.save();
      res.json({
        _id: updatedUserProfile._id,
        avatar: updatedUserProfile.avatar,
        name: updatedUserProfile.name,
        email: updatedUserProfile.email,
        tel: updatedUserProfile.tel,
        verified: updatedUserProfile.verified,
        partner: updatedUserProfile.partner,

        admin: updatedUserProfile.admin,
        token: await updatedUserProfile.generateJWT(),
        description: updatedUserProfile.description,
        skills: updatedUserProfile.skills,
        certifications: updatedUserProfile.certifications,
        basePrice: updatedUserProfile.basePrice,
        deliveryTime: updatedUserProfile.deliveryTime,
        gigDescription: updatedUserProfile.gigDescription,
        revisions: updatedUserProfile.revisions,
        ratings: updatedUserProfile.ratings,
        gigType: updatedUserProfile.gigType,
        servicesInProgress: updatedUserProfile.servicesInProgress,
      });
    }

    if (
      req.body.gigDescription &&
      req.body.gigDescription != user.gigDescription
    ) {
      user.gigDescription = req.body.gigDescription;
      const updatedUserProfile = await user.save();
      res.json({
        _id: updatedUserProfile._id,
        avatar: updatedUserProfile.avatar,
        name: updatedUserProfile.name,
        email: updatedUserProfile.email,
        tel: updatedUserProfile.tel,
        verified: updatedUserProfile.verified,
        partner: updatedUserProfile.partner,

        admin: updatedUserProfile.admin,
        token: await updatedUserProfile.generateJWT(),
        description: updatedUserProfile.description,
        skills: updatedUserProfile.skills,
        certifications: updatedUserProfile.certifications,
        basePrice: updatedUserProfile.basePrice,
        deliveryTime: updatedUserProfile.deliveryTime,
        gigDescription: updatedUserProfile.gigDescription,
        revisions: updatedUserProfile.revisions,
        ratings: updatedUserProfile.ratings,
        gigType: updatedUserProfile.gigType,
        servicesInProgress: updatedUserProfile.servicesInProgress,
      });
    }
    if (req.body.revisions && req.body.revisions != user.revisions) {
      user.revisions = req.body.revisions;
      const updatedUserProfile = await user.save();
      res.json({
        _id: updatedUserProfile._id,
        avatar: updatedUserProfile.avatar,
        name: updatedUserProfile.name,
        email: updatedUserProfile.email,
        tel: updatedUserProfile.tel,
        verified: updatedUserProfile.verified,
        partner: updatedUserProfile.partner,

        admin: updatedUserProfile.admin,
        token: await updatedUserProfile.generateJWT(),
        description: updatedUserProfile.description,
        skills: updatedUserProfile.skills,
        certifications: updatedUserProfile.certifications,
        basePrice: updatedUserProfile.basePrice,
        deliveryTime: updatedUserProfile.deliveryTime,
        gigDescription: updatedUserProfile.gigDescription,
        revisions: updatedUserProfile.revisions,
        ratings: updatedUserProfile.ratings,
        gigType: updatedUserProfile.gigType,
        servicesInProgress: updatedUserProfile.servicesInProgress,
      });
    }
    if (req.body.gigType && req.body.gigType != user.gigType) {
      user.gigType = req.body.gigType;
      const updatedUserProfile = await user.save();
      res.json({
        _id: updatedUserProfile._id,
        avatar: updatedUserProfile.avatar,
        name: updatedUserProfile.name,
        email: updatedUserProfile.email,
        tel: updatedUserProfile.tel,
        verified: updatedUserProfile.verified,
        partner: updatedUserProfile.partner,

        admin: updatedUserProfile.admin,
        token: await updatedUserProfile.generateJWT(),
        description: updatedUserProfile.description,
        skills: updatedUserProfile.skills,
        certifications: updatedUserProfile.certifications,
        basePrice: updatedUserProfile.basePrice,
        deliveryTime: updatedUserProfile.deliveryTime,
        gigDescription: updatedUserProfile.gigDescription,
        revisions: updatedUserProfile.revisions,
        ratings: updatedUserProfile.ratings,
        gigType: updatedUserProfile.gigType,
        servicesInProgress: updatedUserProfile.servicesInProgress,
      });
    }
    if (req.body.ratings && req.body.ratings != user.ratings) {
      user.ratings = req.body.ratings;
      const updatedUserProfile = await user.save();
      res.json({
        _id: updatedUserProfile._id,
        avatar: updatedUserProfile.avatar,
        name: updatedUserProfile.name,
        email: updatedUserProfile.email,
        tel: updatedUserProfile.tel,
        verified: updatedUserProfile.verified,
        partner: updatedUserProfile.partner,

        admin: updatedUserProfile.admin,
        token: await updatedUserProfile.generateJWT(),
        description: updatedUserProfile.description,
        skills: updatedUserProfile.skills,
        certifications: updatedUserProfile.certifications,
        basePrice: updatedUserProfile.basePrice,
        deliveryTime: updatedUserProfile.deliveryTime,
        gigDescription: updatedUserProfile.gigDescription,
        revisions: updatedUserProfile.revisions,
        ratings: updatedUserProfile.ratings,
        gigType: updatedUserProfile.gigType,
        servicesInProgress: updatedUserProfile.servicesInProgress,
      });
    }

    // if (!user) {
    //   throw new Error("User not found");
    // }
    // user.name = req.body.name || user.name;
    // user.email = req.body.email || user.email;
    // if (req.body.password && req.body.password.length < 6) {
    //   throw new Error("Passowrd length must be atleast 6 characters");
    // } else if (
    //   req.body.password &&
    //   (await user.comparePassword(req.body.password))
    // ) {
    //   throw new Error("New password should not be the same as previous");
    // } else if (req.body.password) {
    //   user.password = req.body.password;
    // }

    // console.log( await user.comparePassword(req.body.password));
  } catch (error) {
    next(error);
  }
};

// Updating Description and others

const updateProfilePicture = async (req, res, next) => {
  try {
    const upload = uploadPicture.single("profilePicture");

    upload(req, res, async function (err) {
      if (err) {
        const error = new Error(
          `An unknow error occured when uploading: ${err.message}`
        );
        next(error);
      } else {
        //if everything went well

        if (req.file) {
          let filename;
          let updatedUser = await User.findById(
            req.user._id
            // { avatar: req.file.filename },
            // { new: true }
          );
          filename = updatedUser.avatar;
          if (filename) {
            fileRemover(filename);
          }
          updatedUser.avatar = req.file.filename;
          await updatedUser.save();
          res.json({
            _id: updatedUser._id,
            avatar: updatedUser.avatar,
            name: updatedUser.name,
            email: updatedUser.email,
            tel: updatedUser.tel,
            verified: updatedUser.verified,
            partner: updatedUser.partner,
            admin: updatedUser.admin,
            token: await updatedUser.generateJWT(),
            description: updatedUser.description,
            skills: updatedUser.skills,
            certifications: updatedUser.certifications,
            basePrice: updatedUser.basePrice,
            deliveryTime: updatedUser.deliveryTime,
            gigDescription: updatedUser.gigDescription,
            revisions: updatedUser.revisions,
            ratings: updatedUser.ratings,
            gigType: updatedUser.gigType,
            servicesInProgress: updatedUser.servicesInProgress,
          });
        } else {
          let filename;
          let updatedUser = await User.findById(req.user._id);
          filename = updatedUser.avatar;
          updatedUser.avatar = "";
          await updatedUser.save();
          fileRemover(filename);
          res.json({
            _id: updatedUser._id,
            avatar: updatedUser.avatar,
            name: updatedUser.name,
            email: updatedUser.email,
            tel: updatedUser.tel,
            verified: updatedUser.verified,
            partner: updatedUser.partner,
            admin: updatedUser.admin,
            token: await updatedUser.generateJWT(),
            description: updatedUser.description,
            skills: updatedUser.skills,
            certifications: updatedUser.certifications,
            basePrice: updatedUser.basePrice,
            deliveryTime: updatedUser.deliveryTime,
            gigDescription: updatedUser.gigDescription,
            revisions: updatedUser.revisions,
            ratings: updatedUser.ratings,
            gigType: updatedUser.gigType,
            servicesInProgress: updatedUser.servicesInProgress,
          });
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

//GETTING ALL THE USERS IN MY COLLECTION
const getAllPartners = async (req, res, next) => {
  try {
    const allPartners = await User.find({ partner: true }).select("-password");
    res.json(allPartners);
  } catch (error) {
    next(error);
  }
};

const getSeller = async (req, res, next) => {
  try {
    const seller = await User.find({ _id: req.query._id }).select("-password");
    res.json(seller);
  } catch (error) {
    next(error);
  }
};

const searchPartners = async (req, res, next) => {
  try {
    const regexGigType = new RegExp(req.query.gigType, "i");
    const regexSearchParam = new RegExp(req.query.name, "i");

    const partners = await User.find({
      $or: [
        { gigType: { $regex: regexGigType } },
        { gigType: { $regex: regexSearchParam } },
        { name: { $regex: regexSearchParam } },
      ],
    }).select("-password");
    res.json(partners);
  } catch (error) {
    next(error);
  }
};

const deleteSkill = async (req, res, next) => {
  try {
    await User.updateOne(
      { _id: req.user._id },
      { $pull: { skills: { $in: [req.body.skill] } } }
    );
    let updatedUser = await User.findById(req.user._id);

    res.json({
      _id: updatedUser._id,
      avatar: updatedUser.avatar,
      name: updatedUser.name,
      email: updatedUser.email,
      tel: updatedUser.tel,
      verified: updatedUser.verified,
      partner: updatedUser.partner,
      admin: updatedUser.admin,
      token: await updatedUser.generateJWT(),
      description: updatedUser.description,
      skills: updatedUser.skills,
      certifications: updatedUser.certifications,
      basePrice: updatedUser.basePrice,
      deliveryTime: updatedUser.deliveryTime,
      gigDescription: updatedUser.gigDescription,
      revisions: updatedUser.revisions,
      ratings: updatedUser.ratings,
      gigType: updatedUser.gigType,
      servicesInProgress: updatedUser.servicesInProgress,
    });
  } catch (error) {
    next(error);
  }
};

const payPartner = async (req, res, next) => {
  const seller = await User.find({ _id: req.body._id }).select("-password");

  const params = JSON.stringify({
    amount: seller[0].basePrice,
    email: req.user.email,
    currency: "GHS",
    mobile_money: {
      phone: req.body.tel,
      provider: req.body.provider,
    },
  });

  const options = {
    hostname: "api.paystack.co",
    port: 443,
    path: "/charge",
    method: "POST",
    headers: {
      Authorization: `Bearer sk_test_6be68d0f32a8cccddb79da25ee14eaca8bcbdf58`,
      "Content-Type": "application/json",
    },
  };

  const reqPayStack = https
    .request(options, (resPayStack) => {
      let data = "";

      resPayStack.on("data", (chunk) => {
        data += chunk;
      });

      resPayStack.on("end", () => {
        res.send(data);
        console.log(JSON.parse(data));
      });
    })
    .on("error", (error) => {
      next(error);
      console.error(error);
    });

  reqPayStack.write(params);
  reqPayStack.end();
};

export {
  registerUser,
  loginUser,
  userProfile,
  updateProfile,
  updateProfilePicture,
  getAllPartners,
  getSeller,
  searchPartners,
  payPartner,
  deleteSkill,
};
