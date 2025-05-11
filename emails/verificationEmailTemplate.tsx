

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
  return (
     <div className="bg-gray-100 p-8 font-sans">
      <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Hello {username},</h2>
        <p className="text-gray-700 mb-2">Your One-Time Password {otp} is:</p>
        <div className="text-2xl font-bold bg-gray-200 px-6 py-3 rounded-md tracking-widest my-4 inline-block">
          {otp}
        </div>
        <p className="text-gray-700 mb-6">Use this OTP to complete your verification. It expires in 10 minutes.</p>
        <p className="text-sm text-gray-500">If you didn’t request this, you can safely ignore this email.</p>
      </div>
    </div>
  );
}