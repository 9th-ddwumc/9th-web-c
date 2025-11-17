import './App.css'
import { HamburgerButton } from './components/HamburgerButton'
import { Sidebar } from './components/sidebar';
import { useSiderbar } from './hooks/useSidebar'

function App() {
  const {isOpen, toggle, close} = useSiderbar();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 w-full">
      <header className="fixed top-0 left-0 bg-white shadow-sm z-50 w-full">
        <div className="mix-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            <HamburgerButton isOpen={isOpen} onClick={toggle}/> 
            <h1 className="text-xl font-cold text-gray-900">돌려돌려lp판</h1>
          </div>
        </div>
      </header>
      <Sidebar isOpen={isOpen} onClose={close}/>
    </div>
  )
}

export default App
