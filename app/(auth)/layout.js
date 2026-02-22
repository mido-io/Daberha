import React from 'react'
import { checkUser } from '@/lib/checkUser';

const AuthLayout = async ({children}) => {
  await checkUser();
  return (
    <div className='flex justify-center'>
      {children}
    </div>
  )
}

export default AuthLayout
