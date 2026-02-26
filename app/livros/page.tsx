'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Livro {
    id: string;
    titulo: string;
    autor: string;
    status: string;
    nota?: number;
}

export default function HomePage() {

    const [idEditando, setIdEditando] = useState<string | null>(null);
    // Estados temporários para os campos que estão sendo editados
    const [tituloEditando, setTituloEditando] = useState('');
    const [autorEditando, setAutorEditando] = useState('');

    const [livros, setLivros] = useState<Livro[]>([])
    const [loading, setLoading] = useState(true)
    const [mensagemSucesso, setMensagemSucesso] = useState(false);
    const [emailUsuario, setEmailUsuario] = useState<string | null>(null);

    const [novoTitulo, setNovoTitulo] = useState('')
    const [novoAutor, setNovoAutor] = useState('')
    const [novoStatus, setNovoStatus] = useState('')
    const [novaNota, setNovaNota] = useState(0)

    // Mapeamento de cores para os Status
    const coresStatus: Record<string, string> = {
        lido: 'bg-emerald-900/40 text-emerald-400 border-emerald-800',
        lendo: 'bg-blue-900/40 text-blue-400 border-blue-800',
        quero_ler: 'bg-amber-900/40 text-amber-400 border-amber-800'
    }

    async function carregarLivros() {
        setLoading(true)
        const { data, error } = await supabase
            .from('livros')
            .select('*')
            .order('titulo', { ascending: true })

        if (!error) setLivros(data || [])
        setLoading(false)
    }

    useEffect(() => {
        async function inicializarDados() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) setEmailUsuario(user.email ?? null);
            carregarLivros();
        }
        inicializarDados();
    }, []);

    async function handleLogout() {
        const { error } = await supabase.auth.signOut()
        if (!error) window.location.href = '/livros'
    }

    async function adicionarLivro(e: React.FormEvent) {
        e.preventDefault()
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            const { error } = await supabase.from('livros').insert([
                {
                    titulo: novoTitulo,
                    autor: novoAutor,
                    user_id: user.id,
                    status: novoStatus,
                    nota: novaNota === 0 ? undefined : novaNota
                }
            ])

            if (!error) {
                setNovoTitulo(''); setNovoAutor(''); setNovoStatus(''); setNovaNota(0);
                setMensagemSucesso(true);
                setTimeout(() => setMensagemSucesso(false), 3000);
                carregarLivros()
            }
        }
    }

    async function excluirLivro(id: string) {
        const { error } = await supabase
            .from('livros')
            .delete()
            .eq('id', id) // "Onde o id da tabela for igual ao id que recebi"

        if (!error) {
            carregarLivros() // Recarrega a lista sem o livro apagado
        }
    }

    async function editarLivro(id: string, novoTitulo: string, novoAutor: string) {
        const { error } = await supabase
            .from('livros')
            .update({
                titulo: novoTitulo,
                autor: novoAutor
            })
            .eq('id', id) // "Onde o id da tabela for igual ao id que recebi"

        if (!error) {
            carregarLivros() // Recarrega a lista sem o livro apagado
        }
    }


    if (loading) return <div className="p-10 text-white text-center font-mono">Carregando biblioteca...</div>

    return (
        <main className="p-6 md:p-10 max-w-6xl mx-auto">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                        <span className="text-4xl">📚</span> Minha Biblioteca
                    </h1>
                    {emailUsuario && (
                        <p className="text-sm text-gray-500 mt-1">
                            Conectado como <span className="text-blue-400 font-medium">{emailUsuario}</span>
                        </p>
                    )}
                </div>
                <button
                    onClick={handleLogout}
                    className="text-xs uppercase tracking-widest bg-red-950/30 hover:bg-red-900/50 text-red-400 border border-red-900/50 px-5 py-2 rounded-full transition-all"
                >
                    Sair da conta
                </button>
            </div>

            {mensagemSucesso && (
                <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 p-3 rounded-lg mb-6 text-center text-sm font-medium animate-in fade-in slide-in-from-top-2">
                    ✨ Livro adicionado com sucesso!
                </div>
            )}

            {/* FORMULÁRIO COM GRID PARA NÃO SAIR DA ÁREA */}
            <form onSubmit={adicionarLivro} className="mb-12 bg-[#0f172a] p-5 rounded-2xl border border-gray-800 shadow-2xl grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-3">
                    <label className="text-[10px] uppercase tracking-wider text-gray-500 ml-1 mb-1 block">Título</label>
                    <input
                        type="text"
                        placeholder="Ex: O Hobbit"
                        value={novoTitulo}
                        onChange={(e) => setNovoTitulo(e.target.value)}
                        className="w-full bg-gray-900/50 border border-gray-700 p-2.5 rounded-lg text-white focus:border-blue-500 outline-none transition"
                        required
                    />
                </div>

                <div className="md:col-span-3">
                    <label className="text-[10px] uppercase tracking-wider text-gray-500 ml-1 mb-1 block">Autor</label>
                    <input
                        type="text"
                        placeholder="J.R.R. Tolkien"
                        value={novoAutor}
                        onChange={(e) => setNovoAutor(e.target.value)}
                        className="w-full bg-gray-900/50 border border-gray-700 p-2.5 rounded-lg text-white focus:border-blue-500 outline-none transition"
                        required
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="text-[10px] uppercase tracking-wider text-gray-500 ml-1 mb-1 block">Status</label>
                    <select
                        className="w-full bg-gray-900/50 border border-gray-700 p-2.5 rounded-lg text-white focus:border-blue-500 outline-none transition appearance-none"
                        onChange={(e) => setNovoStatus(e.target.value)}
                        value={novoStatus}
                        required
                    >
                        <option value="" disabled hidden>Status...</option>
                        <option value="lido">Lido</option>
                        <option value="lendo">Lendo</option>
                        <option value="quero_ler">Quero ler</option>
                    </select>
                </div>

                <div className="md:col-span-2">
                    <label className="text-[10px] uppercase tracking-wider text-gray-500 ml-1 mb-1 block text-center">Nota</label>
                    <div className="flex items-center justify-around bg-gray-900/50 border border-gray-700 p-1.5 rounded-lg h-[46px]">
                        {[1, 2, 3, 4, 5].map((num) => (
                            <button
                                key={num}
                                type="button"
                                onClick={() => setNovaNota(num)}
                                className={`text-xl transition-all ${num <= novaNota ? "text-yellow-400 scale-110" : "text-gray-700 hover:text-gray-500"}`}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                </div>

                <button type="submit" className="md:col-span-2 bg-blue-600 hover:bg-blue-500 text-white h-[46px] rounded-lg font-bold transition-all active:scale-95 shadow-lg shadow-blue-900/20">
                    Adicionar
                </button>
            </form>

            {/* LISTAGEM */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {livros.map((livro) => (
                    <div key={livro.id} className="relative group bg-[#0f172a] rounded-2xl border border-gray-800 p-6 flex flex-col h-full">

                        {/* ÁREA QUE ALTERNA: TÍTULO E AUTOR */}
                        <div className="flex-grow">
                            {idEditando === livro.id ? (
                                // MODO EDIÇÃO
                                <div className="space-y-3 mb-4">
                                    <input
                                        value={tituloEditando}
                                        onChange={(e) => setTituloEditando(e.target.value)}
                                        className="w-full bg-gray-900 border border-blue-500 p-2 rounded text-white text-lg font-bold"
                                    />
                                    <input
                                        value={autorEditando}
                                        onChange={(e) => setAutorEditando(e.target.value)}
                                        className="w-full bg-gray-900 border border-blue-500 p-2 rounded text-gray-400 text-sm italic"
                                    />
                                    <div className="flex gap-2 pt-2">
                                        <button onClick={() => { editarLivro(livro.id, tituloEditando, autorEditando); setIdEditando(null); }} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer">Salvar</button>
                                        <button onClick={() => setIdEditando(null)} className="bg-gray-700 hover:bg-gray-600 text-white text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer">Cancelar</button>
                                    </div>
                                </div>
                            ) : (
                                // MODO LEITURA
                                <div className="mb-6">
                                    {/* BOTÕES DE AÇÃO (Lápis e Lixeira) */}
                                    <div className="absolute top-4 right-4 flex gap-3 opacity-0 group-hover:opacity-100 transition-all">
                                        <button
                                            onClick={() => { setIdEditando(livro.id); setTituloEditando(livro.titulo); setAutorEditando(livro.autor); }}
                                            className="text-gray-400 hover:text-blue-400 cursor-pointer transition-colors"
                                        >
                                            ✏️
                                        </button>
                                        <button onClick={() => excluirLivro(livro.id)} className="text-gray-400 hover:text-red-500 cursor-pointer transition-colors">
                                            🗑️
                                        </button>
                                    </div>

                                    <h2 className="text-xl font-bold mb-1 text-[#f2c3a1] group-hover:text-white transition-colors">
                                        {livro.titulo}
                                    </h2>
                                    <p className="text-gray-500 italic text-sm">por {livro.autor}</p>
                                </div>
                            )}
                        </div>

                        {/* ÁREA FIXA: NOTA E STATUS (Sempre visíveis) */}
                        <div className="flex justify-between items-center border-t border-gray-800/50 pt-4 mt-auto">
                            <span className="flex items-center gap-1 text-yellow-500 font-bold">
                                {livro.nota ? (
                                    <><span className="text-xs">⭐</span> {livro.nota}</>
                                ) : (
                                    <span className="text-gray-600 text-xs font-normal italic">Sem nota</span>
                                )}
                            </span>

                            <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full border ${coresStatus[livro.status] || 'border-gray-700 text-gray-500'}`}>
                                {livro.status.replace('_', ' ')}
                            </span>
                        </div>

                    </div>
                ))}
            </div>
        </main>
    )
}