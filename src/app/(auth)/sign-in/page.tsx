'use client'

import { useEffect, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { useDebounceCallback } from 'usehooks-ts'
import React from 'react'
import { useRouter } from "next/navigation"
import axios, {AxiosError} from 'axios'
import {zodResolver} from '@hookform/resolvers/zod'
import { signUpSchema } from "@/schemas/signUpSchema"
import { z } from "zod"
import { apiResponse } from "@/types/apiResponse"
import {toast} from 'sonner'
import { Form,FormField,FormLabel,FormItem, FormControl, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { Poppins } from "next/font/google"

const poppin = Poppins({
  subsets: ['latin'],
  weight:['500']
})

const Page = () => {
  const [username, setusername] = useState("");
  const [usernameMessage, setusernameMessage] = useState("");
  const [isCheckingUsername, setisCheckingUsername] = useState(false);
  const [issubmitting, setIsSubmitting] = useState(false)
  const debounced = useDebounceCallback(setusername, 500)
  
  const router = useRouter()
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    }
  })
  useEffect(() => {
    const checkUsernameUnique = async ()=>{
      if (username) {
        setisCheckingUsername(true);
        setusernameMessage("");
      }
      try {
        const response = await axios.get(`/api/check-user-unique?username=${username}`)
        console.log(response);
        setusernameMessage(response.data.message)
      } catch (error) {
        const axiosError = error as AxiosError<apiResponse>
        setusernameMessage(
          axiosError.response?.data.message ?? "Error checking username"
        )
      }
      finally {
        setisCheckingUsername(false)
      }

    }
    checkUsernameUnique();
    
  }, [username])
  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true)
    try {
      const response = axios.post<apiResponse>('/api/sign-up', data);
      toast('Form is submitted')
      router.replace(`/verify/${username}`)
    } catch (error) {
      console.error("Error occured while submitting form", error);
      toast("Error occured while submitting form")
    }
    finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 text-[#9747FF]">
            Signup
          </h1>
        </div>

        <Form {...form}>
<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5 flex flex-col">
  <FormField
    name= 'username'
    control={form.control}
    render={({field }) => (
      
      <FormItem>
    
        <FormControl>
          <Input className="rounded-[8px]" placeholder="Enter the username"{...field}
            onChange={(e) => {
              field.onChange(e)
              debounced(e.target.value)
            }}
          />
        </FormControl>
        {isCheckingUsername && <Loader2/>}
   
    </FormItem>

    )}
  
  />

  <FormField
    name= 'email'
    control={form.control}
    render={({field }) => (
      
      <FormItem>
        
        <FormControl>
          <Input placeholder="Enter your Email"{...field}
           
          />
        </FormControl>
       
      </FormItem>

    )}
  
  />

  <FormField
    name= 'password'
    control={form.control}
    render={({field }) => (
      
      <FormItem>

        <FormControl>
          <Input type="password" placeholder="Enter you Password"{...field}
           
          />
        </FormControl>
        
    </FormItem>

    )}
  
  />
  <Button className = { `${poppin.className}  justify-self-center text-xl   bg-[#9747FF] px-[119px] pb-2.5 pt-2.5`}type="submit" disabled= {issubmitting}>
    {
      issubmitting ? (
        <>
          <Loader2/>Please wait
        </>
      ): ("Signup")
    }
  </Button>
  
</form>
</Form>

    </div>
    </div>
  )
}

export default Page





