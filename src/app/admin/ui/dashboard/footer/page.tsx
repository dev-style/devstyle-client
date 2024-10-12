import React from 'react'

type Props = {}

const Footer = (props: Props) => {
  return (
    <div  className='flex items-center justify-between mt-5 text-textSoft'>
        <div className='font-semibold text-text-light'>
            Dev.Style
        </div>
        <div className='text-sm text-text-light'>
        © All rights reserved.
        </div>
    </div>
  )
}

export default Footer