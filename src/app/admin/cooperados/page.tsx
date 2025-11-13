'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Menu from '../components/menu';

interface Cooperative {
  id: string;
  name: string;
  plate: string;
  price: number;
  isActive: boolean;
  user: {
    name: string;
    email: string;
    phone?: string;
  };
  createdAt: string;
}

export default function CooperadosPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [cooperatives, setCooperatives] = useState<Cooperative[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    plate: '',
    price: '40.00',
    userId: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCooperatives();
  }, []);

  const fetchCooperatives = async () => {
    try {
      const response = await fetch('/api/admin/cooperatives', {
        credentials: 'include'
      });

      if (response.status === 401) {
        router.push('/admin');
        return;
      }

      const data = await response.json();

      if (data.success) {
        setCooperatives(data.cooperatives);
      }
    } catch (err) {
      console.error('Erro ao carregar cooperados:', err);
      setError('Erro ao carregar cooperados');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const url = editingId 
        ? `/api/admin/cooperatives/${editingId}`
        : '/api/admin/cooperatives';
      
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price)
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage(editingId ? 'Cooperado atualizado!' : 'Cooperado cadastrado!');
        setShowModal(false);
        resetForm();
        fetchCooperatives();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setError(data.error || 'Erro ao salvar cooperado');
      }
    } catch (err) {
      console.error('Erro ao salvar:', err);
      setError('Erro ao salvar cooperado');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover este cooperado?')) return;

    try {
      const response = await fetch(`/api/admin/cooperatives/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Cooperado removido com sucesso!');
        fetchCooperatives();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setError(data.error || 'Erro ao remover cooperado');
      }
    } catch (err) {
      console.error('Erro ao remover:', err);
      setError('Erro ao remover cooperado');
    }
  };

  const handleEdit = (coop: Cooperative) => {
    setEditingId(coop.id);
    setFormData({
      name: coop.name,
      plate: coop.plate,
      price: coop.price.toFixed(2),
      userId: '' // Não alterável na edição
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      plate: '',
      price: '40.00',
      userId: ''
    });
    setEditingId(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
    setError('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Menu />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            🤝 Gerenciar Cooperados
          </h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            ➕ Novo Cooperado
          </button>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-300">
            {message}
          </div>
        )}

        {error && !showModal && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300">
            {error}
          </div>
        )}

        {/* Lista de Cooperados */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cooperatives.map((coop) => (
            <div
              key={coop.id}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-green-500/30 hover:border-green-500/60 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{coop.name}</h3>
                  <p className="text-green-400 font-mono text-lg">{coop.plate}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  coop.isActive 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {coop.isActive ? 'Ativo' : 'Inativo'}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Preço:</span>
                  <span className="text-white font-semibold">R$ {coop.price.toFixed(2)}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-400">Cliente:</span>
                  <p className="text-white">{coop.user.name}</p>
                  <p className="text-gray-400 text-xs">{coop.user.email}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(coop)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-semibold transition-colors"
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={() => handleDelete(coop.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm font-semibold transition-colors"
                >
                  🗑️ Remover
                </button>
              </div>
            </div>
          ))}
        </div>

        {cooperatives.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Nenhum cooperado cadastrado ainda.</p>
          </div>
        )}
      </div>

      {/* Modal de Cadastro/Edição */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingId ? '✏️ Editar Cooperado' : '➕ Novo Cooperado'}
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nome do Cooperado/Cooperativa
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                {!editingId && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Placa do Veículo
                      </label>
                      <input
                        type="text"
                        value={formData.plate}
                        onChange={(e) => setFormData({ ...formData, plate: e.target.value.toUpperCase() })}
                        placeholder="ABC1234"
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white font-mono focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        ID do Usuário
                      </label>
                      <input
                        type="text"
                        value={formData.userId}
                        onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                        placeholder="UUID do usuário"
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                      <p className="mt-1 text-xs text-gray-400">
                        Busque o ID na lista de usuários
                      </p>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Preço (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  {editingId ? 'Atualizar' : 'Cadastrar'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
