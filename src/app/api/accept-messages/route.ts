import dbConnect from "@/lib/dbConnect"
import { getServerSession, User } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/option"
import UserModel from "@/model/user"



export  async function POST(request: Request) {
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
            },{status:401})
    }
    const userId = user._id;
    const { acceptMessages } = await request.json()
    
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptMessages },
            {new: true}
        )
        
        if (!updatedUser) {
              return Response.json({
            success: false,
            message: "failed to update user status to accept messages"
            },{status:401})
        }
          return Response.json({
            success: true,
            message: "Message accepting status updated succesfully"
            },{status:200})
    } catch (error) {
        console.error("failed to update user status to accept messages", error)
            return Response.json({
            success: false,
            message: "failed to update user status to accept messages"
            },{status:500})
    }
    
}

export async function GET() {
     await dbConnect()
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
            },{status:401})
    }
    const userId = user._id;
    try {
        const foundUser = await UserModel.findById(userId);
    
        
        if (!foundUser) {
            return Response.json({
                success: false,
                message: "Failed to find user"
                },{status:404})
        }
        return Response.json({
                success: true,
                isAcceptingMessage: foundUser.isAcceptingMessage
                },{status:200})
    } catch (error) {
        console.log("Something Went Wrong", error);
        
         return Response.json({
                success: true,
                message: "internal server error"
                },{status:500})
    }
}