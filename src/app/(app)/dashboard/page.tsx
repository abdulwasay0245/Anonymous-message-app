'use client'
import MessageCard from '@/components/Message-card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Message, User } from '@/model/user'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema'
import { apiResponse } from '@/types/apiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2, RefreshCcw } from 'lucide-react'
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
    const handleSwitchChange = async () => {
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
    }
    const username = session?.user.username 
    const baseUrl = `${window.location.protocol}//${window.location.host}`
    const profileUrl = `${baseUrl}/u/${username}`
    
    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl)
        toast("Url copied")
    }
    
    if (!session || !session.user) {
        return <div className='w-full h-screen bg-brand  flex items-center justify-center'>
            <h1 className='text-4xl font-bold'>
                You are not Logged in 
            </h1>
        </div>
    }


  return (
      <div className='my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl'>
          <h1 className='text-4xl font-bold mb-4'>User Dashboard</h1>
          <div className='mb-4'>
              <h2 className='text-lg font-semibold mb-2'>
                  Copy Your Unique Link
              </h2>{' '}
              <div className='flex items-center'>
                  <input
                      type="text"
                      disabled
                      value={profileUrl}
                      className='input input-bordered w-full p-2 mr-2'
                  />
                  <Button onClick={copyToClipboard}></Button>
              </div>
          </div>

          <div className='mb-4'>
              <Switch
                  {...register('acceptMessage')}
                  checked={acceptMessage}
                  onCheckedChange={handleSwitchChange}
                  disabled={isSwitchLoading}
              />
              <span className='ml-2'>
                  Accept Message: {acceptMessage ? 'On' : 'Off'}
              </span>
          </div>
          
          <Separator />
          <Button
              className='mt-4'
              variant="outline"
              onClick={(e) => {
                  e.preventDefault();
                  fetchMessages(true)
              }} >
          {isLoading ? (
              <Loader2 className='h-4 w-4 animate-spin'/>
          ) : (
                <RefreshCcw className='h-4 w-4'/> 
          )}
          </Button>
          <div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-6'>
              {message.length > 0 ? (
                  message.map((message, index) => (
                      
                      <MessageCard
                          key={message._id}
                          message={message}
                          onMessageDelete={handleDeleteMessage}/>
                  ))
              ) : (
                      <p>No messages to Display</p>
              )}
          </div>

    </div>
  )
}

export default Dashboard