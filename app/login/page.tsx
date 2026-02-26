'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault() // Impede o recarregamento da página
        setLoading(true)

        console.log("Tentando logar...") // Se isso não aparecer no F12, o botão está quebrado

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            console.error("Erro Supabase:", error.message)
            alert('Erro: ' + error.message)
            setLoading(false)
        } else {
            console.log("Sucesso! Movendo para a home...")
            // Usamos window.location para garantir que o Middleware perceba a mudança
            window.location.href = '/livros' //é aqui que eu redireciono para página que eu quero
        }
    }

    return (
        // suppressHydrationWarning evita que extensões como LastPass travem o React
        <main suppressHydrationWarning className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-4">
            <div className="w-full max-w-md bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-xl">
                <h1 className="text-2xl font-bold mb-6 text-center">Entrar na Biblioteca 📚</h1>

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <input
                        name="email" // Importante para o navegador
                        type="email"
                        placeholder="Seu e-mail"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-gray-800 border border-gray-700 p-3 rounded-lg text-white"
                        required
                    />
                    <input
                        name="password" // Importante para o navegador
                        type="password"
                        placeholder="Sua senha"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-gray-800 border border-gray-700 p-3 rounded-lg text-white"
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 text-white font-bold py-3 rounded-lg transition"
                    >
                        {loading ? 'Processando...' : 'Entrar'}
                    </button>
                </form>
            </div>
        </main>
    )
}