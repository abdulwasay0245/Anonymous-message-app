import { sendVerificationEmail } from "@/helpers/verificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    // Check if username already exists (regardless of verification)
    const existingUserByUsername = await UserModel.findOne({ username });
    if (existingUserByUsername) {
      return Response.json(
        { success: false, message: "Username is already taken" },
        { status: 400 }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = password;

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          { success: false, message: "User already exists with this email" },
          { status: 400 }
        );
      } else {
        // Update unverified user
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      // Create new user
      const expiryDate = new Date(Date.now() + 3600000);
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        message: [],
      });
      await newUser.save();
    }

    // Send verification email
    const emailResponse = await sendVerificationEmail(email, username, verifyCode);
    if (!emailResponse.success) {
      return Response.json(
        { success: false, message: emailResponse.message },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify your email.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return Response.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

















// import { sendVerificationEmail } from "@/helpers/verificationEmail";
// import dbConnect from "@/lib/dbConnect";
// import UserModel, { Message } from "@/model/user";
// import bcrypt from "bcryptjs";
// import VerificationEmail from "../../../../emails/verificationEmailTemplate";

// export async function POST(request: Request) {
//     await dbConnect()

//     try {
//         const { username, email, password } = await request.json()
//         const existingUserVerifiedByUsername =await UserModel.findOne({
//             username,
//             isVerified: true
//         })
//         if (existingUserVerifiedByUsername) {
//             return Response.json({
//                 message: "Username is already taken",
//                 success: false
//             },
                
//                 {
//                 status:400
//             }
//             )

//         }
//         const existingUserByEmail = await UserModel.findOne({ email })
//         const verifyCode = Math.floor(100000 + Math.random()*900000).toString()
//         if (existingUserByEmail) {
//             if (existingUserByEmail.isVerified) {
//                 return Response.json({
//                     success: false,
//                     message: "User already exist with this email"
//                 },
//                     {
//                     status: 500,
//                     })
//             }
//             else {
//                 const hashedPassword = await bcrypt.hash(password, 10)
//                 existingUserByEmail.password = hashedPassword
//                 existingUserByEmail.verifyCode = verifyCode
//                 existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
//                 await existingUserByEmail.save()
//             }
//         }
//         else {
//             const hasedPassword = await bcrypt.hash(password, 10)
//             const expiryDate = new Date
//             expiryDate.setHours(expiryDate.getHours() + 1)
          
//             const newUser = new UserModel({
//                  username,
//                     email,
//                     password: hasedPassword,
//                     verifyCode,
//                     verifyCodeExpiry: expiryDate,
//                     isVerified: false,
//                     isAcceptingMessage: true,
//                     message: []
//             })
//             await newUser.save()
//             //Verification Email
//             const emailResponse =await sendVerificationEmail(
//                 email,
//                 username,
//                 verifyCode,
//             )
//             if (emailResponse.success) {
//                 return Response.json({
//                     success: false,
//                     message: emailResponse.message
//                 },
//                     {
//                     status: 500,
//                     })
                
//             }
//             return Response.json({
//                 success: true,
//                     message: "User registered successfully. Please verify your email",
//             },{status: 400})
//         }
//     } catch (error) {
//         console.error("Error registering user", error)
//         return Response.json(  {
//             success: false,
//             message: "Error registring user"
//         },
//         {
//             status: 500
//         })
      
//     }
// }