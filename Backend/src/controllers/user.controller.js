import { ApiError } from "../utils/ApiError.js";
import { User } from "../model/user.model.js"
import { uploadoncloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asynchandler.js";


const generateAccessTokenandRefreshToken = async (userId) => {
        try {
                const user = await User.findById(userId)
                const AccessToken = user.generateAccessToken()
                const RefreshToken = user.generateRefreshToken()

                user.RefreshToken = RefreshToken    //to save ref token in db so no need of enter password every time
                await user.save({ validateBeforeSave: false })


                return { AccessToken, RefreshToken }


        } catch (error) {
                throw new ApiError(500, "Something wennt wrong while generating tokens")

        }
}



const registerUser = asyncHandler(async (req, res) => {

        //get detail from frontend
        const { username, email, password, fullname } = req.body || {};
        console.log("email :", email)

        //  Validation check wheather each field is fill or not
        if (
                !fullname?.trim() ||
                !email?.trim() ||
                !username?.trim() ||
                !password?.trim()
        ) {
                throw new ApiError(400, "all fields are required")

        }


        // check existed  user base on username and email
        const existeduser = await User.findOne({
                $or: [{ email }, { username }]

        }
        )

        if (existeduser) {
                throw new ApiError(200, "user with same username or email already exist")

        }

        // upload avatar and cover img to cloudinary
        // get local path of uploaded file
        const avtarlocalpath = req.files?.avatar[0]?.path;
        const coverImglocalpath = req.files?.coverImg[0]?.path;

        if (!avtarlocalpath) {
                throw new ApiError(409, "Avatar img required")
        }

        const avatar = await uploadoncloudinary(avtarlocalpath)
        const coverImg = await uploadoncloudinary(coverImglocalpath)
        if (!avatar) {
                throw new ApiError(300, "avatar file req")
        }

        const user = await User.create({
                fullname,
                avatar: avatar.url,
                coverImg: coverImg?.url || "",
                email,
                password,
                username: username.toLowerCase()
        })

        const createduser = await User.findById(user._id).select(
                "-password -refreshtoken"
        )


        if (!createduser) {
                throw new ApiError(504, "something went rong while regestring user")
        }


        return res.status(202).json(
                new ApiResponse(200, createduser, "User register successfully by Nikhil")
        )
})




const loginUser = asyncHandler(async (req, res) => {

        const { username, email, password } = req.body || {};
        console.log("username :", username);
        console.log("Login input =>", req.body);

        if (!username && !email) {
                throw new ApiError(400, "Username or email is required");
        }

        const user = await User.findOne({
                $or: [{ username }, { email }]
        }).select("+password");

        if (!user) {
                throw new ApiError(406, "User does not exist")
        }


        const ispasswordValid = await user.isCorrect(password)

        if (!ispasswordValid) {
                throw new ApiError(205, "Invalid user credintials")
        }

        const { AccessToken, RefreshToken } = await generateAccessTokenandRefreshToken(user._id)

        const loginuser = await User.findById(user._id).select("-password -refreshtoken")

        const options = {
                httpOnly: true,
                secure: false,
                sameSite: "lax",

        }

        return res
                .status(200)
                .cookie("AccessToken", AccessToken, options)
                .cookie("RefreshToken", RefreshToken, options)
                .json(
                        new ApiResponse(200, {
                                user: loginuser, AccessToken, RefreshToken,
                        }),

                        "User login Successfully"
                )

})




const logoutUser = asyncHandler(async (req, res) => {
        User.findByIdAndUpdate(
                req.user._id,
                {
                        $set: {
                                refreshtoken: undefined
                        },

                },
                {
                        new: true

                }

        )
        const options = {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
        }
        return res
                .status(200)
                .clearCookie("AccessToken", options)
                .clearCookie("RefreshToken", options)
                .json(new ApiResponse(200, {}, "User logged out successfully"))
})




const accesstokenandrefreshtoken = asyncHandler(async (req, res) => {

        const incomingacesstoken = req.cookie.refreshtoken || req.body.refreshtoken

        if (!incomingacesstoken) {
                throw new ApiError(400, "unauthorized request")
        }

        try {
                const decodedtoken = jwt.verify(incomingacesstoken, process.env.REFRESH_TOKEN_SECRET)

                const user = await User.findById(decodedtoken?._id)

                if (!user) {
                        throw new ApiError(403, "invalid refresh token")
                }

                if (incomingacesstoken !== user?.refreshtoken) {
                        throw new ApiError(406, "refresh token expire or used")
                }

                const options = {
                        httpOnly: true,
                        secure: false,
                        sameSite: "lax"
                }
                const { accestoken, newrefreshtoken } = await generateAccessTokenandRefreshToken(user._id)


                return res
                        .status(200)
                        .cookie("AccessToken", accestoken, options)
                        .cookie("RefreshToken", newrefreshtoken, options)
                        .json(
                                new ApiResponse(200, {
                                        accestoken, refreshtoken: newreftoken,
                                }),

                                "Access token refresh"
                        )
        }

        catch (error) {
                throw new ApiError(405, "invalid refresh token")
        }
})



const resetpassword = asyncHandler(async (req, res) => {
        const { email, oldpass, newpass } = req.body;

        const user = await User.findOne({ email }).select("+password");
        if (!user) {
                throw new ApiError(404, "User not found");
        }

        const isPasswordValid = await user.isCorrect(oldpass);
        if (!isPasswordValid) {
                throw new ApiError(400, "Old password does not match");
        }

        user.password = newpass;
        await user.save({ validateBeforeSave: false });

        return res.status(200).json(
                new ApiResponse(200, {}, "Password changed successfully")
        );
});



const getcurruser = asyncHandler(async (req, res) => {
        return res
                .status(200)
                .json(new ApiResponse(200, req.user, "current user fetch successfully"))
})



// controller to update account details
const updateaccountDetails = asyncHandler(async (req, res) => {
        const { fullname, email } = req.body

        if (!fullname || !email) {
                throw new ApiError(403, "all field required")
        }

        const user = await User.findByIdAndUpdate(
                req.user?._id,
                {
                        $set: {
                                fullname,
                                email: email
                        },
                }, {
                new: true
        }
        ).select("-password")

        return res.
                status(200)
                .json(new ApiResponse(200, user, "Account detail change successfuly"))
})



// controller to return channel profile by username
const getUserChannelProfile = asyncHandler(async (req, res) => {
        const { username } = req.params

        if (!username?.trim()) {
                throw new ApiError(400, "username missing")
        }

        const channel = await User.aggregate([
                {
                        $match: {
                                username: username.toLowerCase
                        }
                },
                {
                        $lookup: {
                                from: "subscriptions",
                                localField: "_id",
                                foreignField: "channel",
                                as: "subscriber"

                        }
                },
                {
                        $lookup: {
                                from: "subscription",
                                localField: "_id",
                                foreignField: "subscriber",
                                as: "subscribedTo"
                        }
                },
                {
                        $addFields: {
                                subscriberCount: {
                                        $size: "$subscriber"
                                },
                                channelSubscriberCount: {
                                        $size: "$subscribedTo"
                                },
                                isSubscribed: {
                                        $cond: {
                                                if: {
                                                        $in: [req.user._id, "subscriber".subscriber]
                                                },
                                                then: true,
                                                else: false
                                        }
                                }
                        }
                },
                {
                        $project: {
                                fullname: 1,
                                username: 1,
                                subscriberCount: 1,
                                channelSubscriberCount: 1,
                                avatar: 1,
                                coverImg: 1

                        }
                }
        ])

        if (!channel?.length) {
                throw new ApiError(405, "Channel does not exist")
        }
        return res.status(200)
                .json(ApiResponse(200, channel[0], "user chanel fetch successfully"))
})



// controller to update user avatar
const updateUserAvatar = asyncHandler(async (req, res) => {

        const avatarLocalPath = req.file?.path
        if (!avatarLocalPath) {
                throw new ApiError(400, "avatar file is missing")
        }

        const avatar = await uploadoncloudinary(avatarLocalPath)
        if (!avatar.url) {
                throw new ApiError(400, "avatar file uploading fail")

        }

        const avatarupdated = await User.findByIdAndUpdate(
                req.user?._id,
                {
                        $set: {
                                avatar: avatar.url
                        }
                },
                { new: true }
        ).select("-password")

        return res.status(200).json(new ApiResponse(200, avatarupdated, "avatar updated succesfully"))
})




// controller to update user cover img
const updateCoverImg = asyncHandler(async (req, res) => {

        const coverImgLocalPath = req.file?.path
        if (!coverImgLocalPath) {
                throw new ApiError(400, "cover img file is missing")
        }

        const coverImg = await uploadoncloudinary(coverImgLocalPath)
        if (!coverImg.url) {
                throw new ApiError(400, "cover img file uploading fail")

        }

        const coverImgupdated = await User.findByIdAndUpdate(
                req.user?._id,
                {
                        $set: {
                                coverImg: coverImg.url
                        }
                },
                { new: true }
        ).select("-password")

        return res.status(200).json(new ApiResponse(200, coverImgupdated, "coverImg updated succesfully"))
})



export { registerUser, loginUser, logoutUser, accesstokenandrefreshtoken, resetpassword, getcurruser, updateaccountDetails, getUserChannelProfile, updateUserAvatar, updateCoverImg };