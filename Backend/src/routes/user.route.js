import { Router } from "express";
import { accesstokenandrefreshtoken, getcurruser, loginUser, logoutUser, registerUser, resetpassword } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { incrementViews } from "../controllers/video.controller.js";
const router = Router();


// User registration route
router.route("/register").post(
    upload.fields([{
        name: "avatar",
        maxCount:1,

    },{
        name:"coverImg",
        maxCount:1,
    }
])
    
    ,registerUser)


    // secure routes 

router.route("/login").post(loginUser)

router.route("/logout").post(verifyJWT, logoutUser)

router.route("/refresh-token").post(accesstokenandrefreshtoken)

router.route("/reset-password").post( resetpassword)

router.route("/getcurrentuser").get(verifyJWT,getcurruser)

router.patch("/views/:videoId", incrementViews);


export default router;
