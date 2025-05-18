'use client'
import { Message } from '@/model/user'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema'
import { apiResponse } from '@/types/apiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useSession } from 'next-auth/react'
import {useCallback, useState} from 'react'
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
    const { register, watch, setValue } = form;
    const acceptMessage = watch('acceptMessages')
    const fetchedAcceptMessage = useCallback(async () => {
        setisSwitchLoading(true)
        try {
            const response = await  axios.get('/api/accept-messages')
            setValue('acceptMessage', response.data.isAcceptingMessage)
        } catch (error) {
            const axiosError = error as AxiosError<apiResponse>
            toast(axiosError.response?.data.message || " Failed to fetch message settings")
        }
    },[setValue])

 
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard