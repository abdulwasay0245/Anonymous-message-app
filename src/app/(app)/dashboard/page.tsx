'use client'
import { Message } from '@/model/user'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema'
import { apiResponse } from '@/types/apiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useSession } from 'next-auth/react'
import {useCallback, useEffect, useState} from 'react'
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
    const acceptMessage = watch('acceptMessage')
    const fetchedAcceptMessage = useCallback(async () => {
        setisSwitchLoading(true)
        try {
            const response = await  axios.get('/api/accept-messages')
            setValue('acceptMessage', response.data.isAcceptingMessage)
        } catch (error) {
            const axiosError = error as AxiosError<apiResponse>
            toast(axiosError.response?.data.message || " Failed to fetch message settings")
        }
        finally {
            setisSwitchLoading(false)
        }
    }, [setValue])
    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setIsLoading(true)
        setisSwitchLoading(false)
        try {
            const response = await axios.get<apiResponse>('/api/get-messages')
            setMessage(response.data.messages || [])
            if (refresh) {
                toast('showing lates messages')
            }
            
        } catch (error) {
            const axiosError = error as AxiosError<apiResponse>
            toast(axiosError.response?.data.message || " Failed to fetch message settings")
        }
        finally {
            setIsLoading(false)
            setisSwitchLoading(false)
        }
    },[setIsLoading,setMessage])

    useEffect(() => {
        if (!session || !session.user) return
        fetchMessages();
        fetchedAcceptMessage();
    }, [session, setValue, fetchMessages, fetchedAcceptMessage])
    
    // handling switch change
    const handleSwitchChance = async () => {
        try {
            const response = await axios.post<apiResponse>('/api/accept-messages', {
                acceptMessage: !acceptMessage
            })
            setValue('acceptMessage', !acceptMessage)
            toast(response.data.message)
        } catch (error) {
            const axiosError = error as AxiosError<apiResponse>;
            toast(axiosError.response?.data.message || "failed to fetch")

        }
        if (!session || !session.user) {
            return <div>Please login</div>
        }
    }


  return (
    <div>Dashboard</div>
  )
}

export default Dashboard