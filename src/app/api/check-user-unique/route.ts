import dbConnect from "@/lib/dbConnect";

import { z } from 'zod'
import { usernameValidation } from "@/schemas/signUpSchema";
import UserModel from "@/model/user";



const usernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {
    await dbConnect()


    try {
        const { searchParams } = new URL(request.url)
        const queryParams = {
            username : searchParams.get('username')
        }
        const result = usernameQuerySchema.safeParse(queryParams)
        console.log(result);
        
        if (!result.success) {
            // usernameError = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: "Invalid Username"
            },{status:400})
        }
        const { username } = result.data
        
        const existingUser = await UserModel.findOne({ username, isVerified: true })
        if (existingUser) {
            return Response.json({
                success: false,
                message: "User already exist"
            },{status: 400})
        }
        else {
            return Response.json({
                success: true,
                message: "Username avalilable"
            },{status: 200})
        }
    } catch (error) {
        console.error("Error checking username", error)
        return Response.json({
            success: false,
            message: "Error checking username"
        },{status:500})
    }
}