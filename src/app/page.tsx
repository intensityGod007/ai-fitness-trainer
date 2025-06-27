import { SignedIn, SignedOut, SignInButton, SignOutButton } from '@clerk/nextjs'
import React from 'react'

const HomePage = () => {
  return (
    <div>
      Homepage
      <SignedIn>
        <SignOutButton/>
      </SignedIn>
      <SignedOut>
        <SignInButton/>
      </SignedOut>
    </div>
  )
}

export default HomePage