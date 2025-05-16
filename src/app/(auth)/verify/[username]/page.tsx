'use client'
import { useParams, useRouter } from 'next/navigation'
// import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import {  useForm } from 'react-hook-form'
import {z} from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { verifySchema } from '@/schemas/verifySchema'
import { apiResponse } from '@/types/apiResponse'
import {toast} from 'sonner'
import axios, { AxiosError } from 'axios'
import { Form, FormControl, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'


const VerifyAccount = () => {
    const router = useRouter()
    const params = useParams<{ username: string }>()
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        
    })
  const onSubmit = async (data : z.infer<typeof verifySchema>) => {
   try {
     const response = await axios.post<apiResponse>("api/verify-code", {
       username: params.username,
       code : data.code
     })
     toast(response.data.message)
     router.replace('log-in')
     
   } catch (error) {
     console.error("Error verifying user", error);
     const axiosError = error as AxiosError<apiResponse>
     const errorMessage = axiosError.response?.data.message
     toast(errorMessage)
   }

  }
  return (
    <div className='h-screen justify-center flex items-center'>
      <div className='w-full max-w-md bg-white shadow-md space-y-8 p-8 rounded-lg  text-[#9747FF]'>
      <div>{params.username}</div>

      <Form {...form}>
        <form action="submit" className='space-y-4' onSubmit={form.handleSubmit(onSubmit)} >

          <FormItem>
            <FormLabel>Enter your Verification code</FormLabel>
            <FormControl>
              <Input placeholder='Enter the Otp code '  />
            </FormControl>
          </FormItem>

          <Button type='submit' className='bg-[#9747FF]' >Submit</Button>
        </form>

      </Form>
      </div>
    </div>
  )
}

export default VerifyAccount