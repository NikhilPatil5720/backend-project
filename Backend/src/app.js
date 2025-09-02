import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    // origin: process.env.CORS_ORIGIN,
      origin: process.env.CORS_ORIGIN?.split(","),

    credentials: true
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())





//routes

import userRouter from './routes/user.route.js'

import tweetRouter from './routes/tweet.route.js'

import commentRouter from './routes/comment.route.js'

import likeRouter from './routes/like.route.js'

import subscriptionRouter from './routes/subscription.route.js'

import healthcheckRoute from './routes/healthcheck.route.js'

import dashboardRoute from './routes/dashboard.route.js'

import playlistRoute from './routes/playlist.route.js'

import videoRoute from './routes/video.route.js'


// route diclarations

app.use("/api/v1/users", userRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/healthcheck", healthcheckRoute)
app.use("/api/v1/dashboard", dashboardRoute)
app.use("/api/v1/playlists", playlistRoute)
app.use("/api/v1/videos", videoRoute)




export { app }