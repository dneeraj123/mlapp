import Header from '@/components/functional/Header';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <>
          <section className='grid-background'></section>
          <Header />
          <main className='container min-h-screen flex justify-center items-center'>
            <Outlet />            
          </main>
          <footer className='flex items-center justify-center bg-gray-800 h-20 p-5'>
                Made by NeerajAI <span className='flex text-xl pb-1 ml-4'>💻</span>
          </footer>
        </>
      )
}

export default Layout