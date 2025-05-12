'use client'

import { useEffect, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { useDebounceValue } from 'usehooks-ts'
import React from 'react'
import { useRouter } from "next/navigation"
import axios, {AxiosError} from 'axios'
import {zodResolver} from '@hookform/resolvers/zod'
import { signUpSchema } from "@/schemas/signUpSchema"
import { z } from "zod"
import { apiResponse } from "@/types/apiResponse"
import {toast} from 'sonner'
import { Form } from "@/components/ui/form"


const Page = () => {
  const [username, setusername] = useState("");
  const [usernameMessage, setusernameMessage] = useState("");
  const [isCheckingUsername, setisCheckingUsername] = useState(false);
  const [issubmitting, setIsSubmitting] = useState(false)
  const debouncedUsername = useDebounceValue(username, 500)
  
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
      if (debouncedUsername) {
        setisCheckingUsername(true);
        setusernameMessage("");
      }
      try {
        const response = await axios.get(`/api/check-user-unique?username=${debouncedUsername}`)
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
    
  }, [debouncedUsername])
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
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}></form>
      </Form>
    </div>
  )
}

export default Page