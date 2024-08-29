import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <nav className='p-2 flex items-center justify-between bg-gray-900'>
        <Link>
            <img className='h-12 rounded-sm' src='/logo.png' />
        </Link>
        <div className='hidden md:flex justify-between md:w-[500px] mr-auto ml-auto'>
            <div>
            <Link className='hover:text-slate-400'>
                Transcribe
            </Link>
            </div>
            <div>
            <Link className='hover:text-slate-400' to={'summarize'}>
                Summarize
            </Link>
            </div>
            {/* <div>
            <Link className='hover:text-slate-400'>
                Summarize
            </Link>
            </div> */}
        </div>
    </nav>
  )
}

export default Header