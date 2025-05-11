import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { verifySchema } from "@/schemas/verifySchema";
import z from 'zod'

const codeQuerySchema = z.object({
    code: verifySchema
})

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, code } = await request.json()
        const result = codeQuerySchema.safeParse(code)
        if (!result.success) {
             return Response.json({
                success: false,
                message: "Invalid code"
            },{status:400})
        }
        
        const decodedUser = decodeURIComponent(username)
        const user = await UserModel.findOne({ username: decodedUser })

        if (!user) {
            return Response.json({
                success: false,
                message: 'User not found'
            },{status:404})
        }

        const isCodeVerified = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
        
        if (isCodeVerified && isCodeNotExpired) {
            user.isVerified = true;
            await user.save();
            return Response.json({
                success: true,
                message: "User Verified"
            },{status:200})
        } else if (!isCodeNotExpired) {
             return Response.json({
                success: false,
                message: "Your code is expired.Please sign-up again to get a new code"
            },{status:400})
        } else {
             return Response.json({
                success: false,
                message: "You entered the wrong code"
            },{status:400})
        }


        

    } catch (error) {
        console.error("Error finding Code", error)
        return Response.json({
            success: false,
            message: "error finding user"
        }, { status: 500 })
    
    }
}