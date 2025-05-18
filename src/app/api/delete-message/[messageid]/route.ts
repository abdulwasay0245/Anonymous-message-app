import dbConnect from "@/lib/dbConnect"
import { getServerSession, User } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/option" 
import UserModel from "@/model/user"
import mongoose from "mongoose"



export async function DELETE({params}:{params: {messageid : string}}) {
    const messageId = params.messageid
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 })
    }
   try {
      const updatedResult =  await UserModel.updateOne(
           { id: user.id },
          { $pull: { message: { _id: messageId } } }
        )
        
     if (updatedResult.modifiedCount == 0) {
        return Response.json({
             success: false,
             message: "Message not found or already deleted"
         },{status: 404})
       }
       return Response.json({
           success: true,
           message:"Message deleted"
    },{status:200})
   } catch (error) {
       console.log(error)
    return Response.json({
        success: false,
        message:"Error deleting messages"
 },{status:500})
   }
}