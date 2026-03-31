import { useState } from 'react'
import clsx from 'clsx'
import ShowcasePage from './pages/ShowcasePage'
import { FornecedoresScreen } from './screens/Fornecedores/FornecedoresScreen'

type View = 'showcase' | 'fornecedores'

export default function App() {
  const [view, setView] = useState<View>('showcase')

  return (
    <>
      <nav className="flex gap-2 px-8 py-4 bg-primary sticky top-0 z-50">
        <button
          className={clsx(
            'px-6 py-2 border border-transparent rounded-sm font-sans text-sm font-regular text-text-on-primary cursor-pointer opacity-75 transition-[opacity,background] duration-150',
            'hover:opacity-100 hover:bg-white/10',
            view === 'showcase' && 'opacity-100 bg-white/20 font-semibold',
          )}
          onClick={() => setView('showcase')}
        >
          Component Showcase
        </button>
        <button
          className={clsx(
            'px-6 py-2 border border-transparent rounded-sm font-sans text-sm font-regular text-text-on-primary cursor-pointer opacity-75 transition-[opacity,background] duration-150',
            'hover:opacity-100 hover:bg-white/10',
            view === 'fornecedores' && 'opacity-100 bg-white/20 font-semibold',
          )}
          onClick={() => setView('fornecedores')}
        >
          Fornecedores (Screen)
        </button>
      </nav>

      {view === 'showcase' && <ShowcasePage />}
      {view === 'fornecedores' && <FornecedoresScreen />}
    </>
  )
}
