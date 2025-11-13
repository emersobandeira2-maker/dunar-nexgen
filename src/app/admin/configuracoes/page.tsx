'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Menu from '../components/menu';

export default function ConfiguracoesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [normalAccessPrice, setNormalAccessPrice] = useState('50.00');
  const [coopAccessPrice, setCoopAccessPrice] = useState('40.00');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/admin/config', {
        credentials: 'include'
      });

      if (response.status === 401) {
        router.push('/admin');
        return;
      }

      const data = await response.json();

      if (data.success && data.config) {
        setNormalAccessPrice(data.config.normalAccessPrice.toFixed(2));
        setCoopAccessPrice(data.config.coopAccessPrice.toFixed(2));
      }
    } catch (err) {
      console.error('Erro ao carregar configurações:', err);
      setError('Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/admin/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          normalAccessPrice: parseFloat(normalAccessPrice),
          coopAccessPrice: parseFloat(coopAccessPrice)
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Configurações salvas com sucesso!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setError(data.error || 'Erro ao salvar configurações');
      }
    } catch (err) {
      console.error('Erro ao salvar:', err);
      setError('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
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
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">
            ⚙️ Configurações de Preços
          </h1>

          {message && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-300">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300">
              {error}
            </div>
          )}

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
            <form onSubmit={handleSave}>
              <div className="space-y-6">
                {/* Preço Acesso Normal */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    💵 Preço do Acesso Avulso (Normal)
                  </label>
                  <div className="flex items-center">
                    <span className="text-white mr-2">R$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="1000"
                      value={normalAccessPrice}
                      onChange={(e) => setNormalAccessPrice(e.target.value)}
                      className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-400">
                    Preço padrão para clientes normais (acesso avulso)
                  </p>
                </div>

                {/* Preço Cooperado */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    🤝 Preço do Cooperado
                  </label>
                  <div className="flex items-center">
                    <span className="text-white mr-2">R$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="1000"
                      value={coopAccessPrice}
                      onChange={(e) => setCoopAccessPrice(e.target.value)}
                      className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-400">
                    Preço padrão para cooperados/cooperativas
                  </p>
                </div>

                {/* Botões */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Salvando...' : '💾 Salvar Configurações'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => router.push('/admin')}
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
                  >
                    Voltar
                  </button>
                </div>
              </div>
            </form>

            {/* Informações Adicionais */}
            <div className="mt-8 pt-6 border-t border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-3">
                ℹ️ Informações Importantes
              </h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Apenas super administradores podem alterar estas configurações</li>
                <li>• Os preços definidos aqui são os valores padrão do sistema</li>
                <li>• Cooperados e eventos podem ter preços personalizados individuais</li>
                <li>• As alterações afetam apenas novos acessos</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
