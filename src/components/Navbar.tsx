'use client'
import React from 'react'
import { signOut, useSession } from 'next-auth/react'
import {User} from 'next-auth'
import { Button } from './ui/button'
import Link from 'next/link'

const Navbar = () => {
    const { data : session } = useSession()
    const user: User = session?.user
  return (
      <nav className='p-4 md:p-6 shadow-md'>
          <div>
              <a href="#">Mystry Message</a>
              {
                  session ? (
                      <>
                          <span>{user.username || user.email}</span>
                          <Button onClick={()=> signOut()}>Logout</Button>
                      </>
                  ) : (
                          <Link href="sign-in">
                              <Button>Login</Button>
                          </Link>
                  )
              }
          </div>
   </nav>
  )
}

export default Navbar