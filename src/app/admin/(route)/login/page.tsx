
import React from 'react'
import { useFormState } from 'react-hook-form'
import LoginForm from '../../ui/login/loginForm'

type Props = {}

const LoginPage = (props: Props) => {


  return (
    <div className='w-full h-screen flex justify-center items-center bg-gradient-to-r from-black to-primary'>
      <div className=' p-8 rounded-lg shadow-md w-96'>
        <h2 className='text-3xl font-bold mb-6 text-center text-text-light'>Login</h2>
      <LoginForm/>
      </div>
    </div>
  )
}

export default LoginPage