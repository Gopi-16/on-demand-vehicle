import jwt from "jsonwebtoken";
export const signAccessToken=(payload)=>
    jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET,{expiresIn:process.env.ACCESS_TOKEN_TTL});

export const signRefreshToken=(payload)=>
    jwt.sign(payload,process.env.REFRESH_TOKEN_SECRET,{expiresIn:process.env.REFRESH_TOKEN_TTL});

export const verifyAccesToken=(token)=>
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);

export const verifyRefreshToken=(payload)=>
    jwt.verify(token,process.env.REFRESH_TOKEN_SECRET);