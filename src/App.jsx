import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import './App.css'
import Layout from './layout/Layout'
import Transcribe from './components/functional/Transcribe'
import { ThemeProvider } from './components/theme-provider'
import Summarize from './components/functional/Summarize'

function App() {

    const router = createBrowserRouter([
        {
            element: <Layout />,
            children: [
                {
                    path: '/',
                    element: <Transcribe />
                },
                {
                    path: '/summarize',
                    element: <Summarize />
                }
            ]
        }
    ])

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <RouterProvider router={router} />
        </ThemeProvider>
    )
}

export default App
