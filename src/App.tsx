import { RouterProvider } from 'react-router'
import { router } from './router'
import './App.css'
// import Sidebar from './components/sidebar'
// import Header from './components/header'

function App() {

  return (
    <div className='flex  w-screen h-screen'>
      {/* <Sidebar /> */}
      <div className='w-full h-full flex-1 flex flex-col'>
        {/* <div className='sticky top-0 z-10 border-b border-[var(--border-color)]'> */}

        {/* <Header /> */}
        {/* </div> */}
        <RouterProvider router={router} />
      </div>
    </div>
  )
}

export default App
