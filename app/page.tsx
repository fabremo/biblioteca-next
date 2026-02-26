'use client'

import Link from 'next/link'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
      {/* Hero Section */}
      <div className="max-w-2xl space-y-6">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
          Sua biblioteca pessoal, <span className="text-blue-500">organizada.</span>
        </h1>

        <p className="text-xl text-gray-400">
          Gerencie suas leituras, dê notas aos seus livros favoritos e mantenha o controle de tudo em um só lugar.
        </p>

        <div className="flex gap-4 justify-center pt-8">
          <Link
            href="/login"
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105"
          >
            Começar Agora
          </Link>

          <Link
            href="/livros"
            className="bg-gray-900 border border-gray-800 hover:bg-gray-800 text-white px-8 py-4 rounded-full font-bold text-lg transition-all"
          >
            Ver Meus Livros
          </Link>
        </div>
      </div>

      {/* Mini Feature List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-5xl">
        <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
          <div className="text-3xl mb-2">📖</div>
          <h3 className="font-bold text-xl mb-1">Organize</h3>
          <p className="text-gray-500 text-sm">Cadastre seus livros com autor e título em segundos.</p>
        </div>
        <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
          <div className="text-3xl mb-2">⭐</div>
          <h3 className="font-bold text-xl mb-1">Avalie</h3>
          <p className="text-gray-500 text-sm">Dê notas e acompanhe o que você achou de cada obra.</p>
        </div>
        <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
          <div className="text-3xl mb-2">🔒</div>
          <h3 className="font-bold text-xl mb-1">Seguro</h3>
          <p className="text-gray-500 text-sm">Seus dados protegidos e sincronizados com Supabase.</p>
        </div>
      </div>
    </main>
  )
}