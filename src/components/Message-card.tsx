'use client'
import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
  
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Button } from './ui/button'
import { X } from 'lucide-react'
import { Interface } from 'readline'
import axios from 'axios'
import { apiResponse } from '@/types/apiResponse'
import { toast } from 'sonner'

  
type MessageProps ={
 
    message: string,
    onMessageDelete: (messageId: string)=> void

}

const MessageCard = ({ message, onMessageDelete }: MessageProps) => {
    
    const handleMessageDelete = async () => {
        const response = await axios.delete<apiResponse>(`/api/delete-message/${message._id}`)
        toast(response.data.message)
        onMessageDelete(message._id)
    }

  return (
    <Card>
  <CardHeader>
  <CardTitle>Card Title</CardTitle>
              
  <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className='h-5 w-5'><X/></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleMessageDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
  </CardContent>
</Card>

  )
}

export default MessageCard