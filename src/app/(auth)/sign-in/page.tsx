'use client'

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDebounceCallback } from 'usehooks-ts'
import React from 'react'
import { useRouter } from "next/navigation"
import axios, {AxiosError} from 'axios'
import {zodResolver} from '@hookform/resolvers/zod'
import { signUpSchema } from "@/schemas/signUpSchema"
import { z } from "zod"
import { apiResponse } from "@/types/apiResponse"
import {toast} from 'sonner'
import { Form,FormField,FormItem, FormControl,  } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { Poppins } from "next/font/google"
import Link from "next/link"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"

const poppin = Poppins({
  subsets: ['latin'],
  weight:['500']
})


const Page = () => {
 
  const [issubmitting, setIsSubmitting] = useState(false)
  
  const router = useRouter()
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
    
      identifier: "",
      password: "",
    }
  })
  
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
      const result = await signIn('credentials', {
          redirect: false,
          identifier: data.identifier,
          password: data.password,
      })
      if (result?.error) {
        toast("Incorrect email or password")
      }
      if (result?.url) {
        router.replace('/dashboard')
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
    name= 'identifier'
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
  <Link href="/log-in">Already have an account?  <a className="" href="/log-in">Log-in</a></Link>
</form>
</Form>

    </div>
    </div>
  )
}

export default Page





