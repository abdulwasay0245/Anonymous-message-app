'use client'
import { Message } from '@/model/user'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import {useState} from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
const Dashboard = () => {
    const [message, setMessage] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSwitchLoading, setisSwitchLoading] = useState(false)
    
    const handleDeleteMessage = (messageId: string) => {
        setMessage(message.filter((message) => message._id !== messageId))
    }   
    const { data: session } = useSession()
    const form = useForm({
        resolver: zodResolver(acceptMessageSchema)
    })
 
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard