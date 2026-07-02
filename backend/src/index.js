import express from "express";
import cors from "cors";

import "dotenv/config";

import fs from "fs";
import path from "path";

import { connectDB } from "./lib/db.js";

import { clerkMiddleware } from '@clerk/express';

const app = express();

const PORT = process.env.PORT;
const FRONTEND_URL = process.env.FRONTEND_URL;

const publicDir = path.join(process.cwd(), "public");

app.use(express.json());
app.use(cors({origin: FRONTEND_URL, credentials: true}));
app.use(clerkMiddleware());

app.get("/health", (req,res) => {
    res.status(200).json({ok : true});
});

if(fs.existsSync(publicDir)){           /* does the "public" folder exists? (only true in production) */
    app.use(express.static(publicDir))   /*serve the built react files */

    app.get("/{*any}", (req,res,next) => {             /* any other URL -> sends back index.html */
        res.sendFile(path.join(publicDir, "index.html"), (err) => next(err));
    });
}

app.listen(PORT, () => {    
    connectDB();
    console.log("Server is listening at the PORT:",PORT);
});