import 'next-auth'
import { DefaultSession } from 'next-auth'

declare module 'next-auth'{
    interface User {
        _id?: string
        isVerified?: boolean
        isAcceptingMessage?: boolean
        username?: string
    }
    interface Session {
        user: {
            _id?: string
        isVerified?: boolean
        isAcceptingMessage?: boolean
        username?: string
        }& DefaultSession ['user']
    }
    interface token{
         _id?: string
        isVerified?: boolean
        isAcceptingMessage?: boolean
        username?: string
    }
}
declare module 'next-auth' {
    interface JWT {
         _id?: string
        isVerified?: boolean
        isAcceptingMessage?: boolean
        username?: string
    }
}