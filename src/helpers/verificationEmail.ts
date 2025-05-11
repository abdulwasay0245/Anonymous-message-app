import { resend } from "@/lib/resend"
import VerificationEmail from "../../emails/verificationEmailTemplate"
import { apiResponse } from "@/types/apiResponse"

export async function sendVerificationEmail(
 
    email: string,
    username: string,
    verifyCode: string,

): Promise<apiResponse> {
    
    try {
        await resend.emails.send({
        from: 'onboarding@resend.dev',
         to: email,
         subject: 'Verification Email',
            react: VerificationEmail({
            username: username,
             otp: verifyCode
         }),
    });
        return {
            success: true,
            message: "Your verification email is sent successfully"
        }
    } catch (emailError) {
        console.error("Could'nt send the email", emailError)
        return {
            success: false,
            message: "Failed to send email"
        }
    }
}