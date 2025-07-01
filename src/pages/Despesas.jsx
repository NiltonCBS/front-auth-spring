import React, { useEffect, useState } from 'react';
import { Edit, Trash2, Plus, DollarSign, Calendar, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';

const Despesas = () => {
  const [despesas, setDespesas] = useState([]);
  const [form, setForm] = useState({ 
    id: null,
    descricao: '', 
    formaPagamento: 'PIX', 
    valor: '',
    data: new Date().toISOString().split('T')[0]
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = localStorage.getItem('token');
  const API_BASE = 'http://localhost:8080';

  useEffect(() => {
    if (!token) {
      alert('Token não encontrado. Faça login novamente.');
      return;
    }
    carregarDespesas();
  }, [token]);

  const carregarDespesas = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_BASE}/despesas/listar`, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar despesas');
      }

      const data = await response.json();
      setDespesas(data);
      
    } catch (err) {
      console.error('Erro ao carregar despesas:', err);
      setError('Erro ao carregar despesas. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.descricao.trim() || !form.valor || Number(form.valor) <= 0) {
      setError('Preencha todos os campos corretamente');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const despesaData = {
        descricao: form.descricao.trim(),
        formaPagamento: form.formaPagamento,
        valor: Number(form.valor),
        data: form.data
      };

      if (isEditing) {
        // Atualizar despesa existente
        const response = await fetch(`${API_BASE}/despesas/alterar/${form.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(despesaData)
        });

        if (!response.ok) {
          throw new Error('Erro ao atualizar despesa');
        }

        const updatedDespesa = await response.json();
        const updatedDespesas = despesas.map(d => 
          d.id === form.id ? updatedDespesa : d
        );
        setDespesas(updatedDespesas);
        setSuccess('Despesa atualizada com sucesso!');
        
      } else {
        // Criar nova despesa
        const response = await fetch(`${API_BASE}/despesas/cadastrar`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(despesaData)
        });

        if (!response.ok) {
          throw new Error('Erro ao cadastrar despesa');
        }

        const novaDespesa = await response.json();
        setDespesas([...despesas, novaDespesa]);
        setSuccess('Despesa cadastrada com sucesso!');
      }

      resetForm();
      
    } catch (err) {
      console.error('Erro ao salvar despesa:', err);
      setError(isEditing ? 'Erro ao atualizar despesa.' : 'Erro ao cadastrar despesa.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (despesa) => {
    setForm({
      id: despesa.id,
      descricao: despesa.descricao,
      formaPagamento: despesa.formaPagamento,
      valor: despesa.valor.toString(),
      data: despesa.data
    });
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta despesa?')) {
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_BASE}/despesas/deletar/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir despesa');
      }
      
      const updatedDespesas = despesas.filter(d => d.id !== id);
      setDespesas(updatedDespesas);
      setSuccess('Despesa excluída com sucesso!');
      
    } catch (err) {
      console.error('Erro ao excluir despesa:', err);
      setError('Erro ao excluir despesa.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      id: null,
      descricao: '',
      formaPagamento: 'PIX',
      valor: '',
      data: new Date().toISOString().split('T')[0]
    });
    setIsEditing(false);
  };

  const getPaymentIcon = (formaPagamento) => {
    switch (formaPagamento) {
      case 'PIX': return '📱';
      case 'CARTAO': return '💳';
      case 'DINHEIRO': return '💵';
      default: return '💰';
    }
  };

  const getPaymentColor = (formaPagamento) => {
    switch (formaPagamento) {
      case 'PIX': return 'bg-blue-100 text-blue-800';
      case 'CARTAO': return 'bg-purple-100 text-purple-800';
      case 'DINHEIRO': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR');
  };

  const totalDespesas = despesas.reduce((acc, d) => acc + d.valor, 0);

  // Auto-hide messages after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Acesso Negado</h2>
          <p className="text-gray-600">Você precisa estar logado para acessar esta página.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Controle de Despesas</h1>
                <p className="text-gray-600">Gerencie suas despesas de forma eficiente</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total de Despesas</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(totalDespesas)}</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-green-800">{success}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulário */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {isEditing ? 'Editar Despesa' : 'Nova Despesa'}
                </h2>
                {isEditing && (
                  <button
                    onClick={resetForm}
                    className="text-gray-500 hover:text-gray-700"
                    title="Cancelar edição"
                  >
                    ✕
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição *
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Almoço, Gasolina, Supermercado..."
                    value={form.descricao}
                    onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Forma de Pagamento
                  </label>
                  <select
                    value={form.formaPagamento}
                    onChange={(e) => setForm({ ...form, formaPagamento: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="PIX">📱 PIX</option>
                    <option value="CARTAO">💳 Cartão</option>
                    <option value="DINHEIRO">💵 Dinheiro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    value={form.valor}
                    onChange={(e) => setForm({ ...form, valor: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data
                  </label>
                  <input
                    type="date"
                    value={form.data}
                    onChange={(e) => setForm({ ...form, data: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white p-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  ) : (
                    <>
                      <Plus className="h-5 w-5" />
                      <span>{isEditing ? 'Atualizar' : 'Adicionar'} Despesa</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Lista de Despesas */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Despesas Registradas</h2>
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                    {despesas.length} {despesas.length === 1 ? 'despesa' : 'despesas'}
                  </span>
                </div>
              </div>

              <div className="p-6">
                {loading && despesas.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando despesas...</p>
                  </div>
                ) : despesas.length === 0 ? (
                  <div className="text-center py-8">
                    <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Nenhuma despesa cadastrada ainda.</p>
                    <p className="text-sm text-gray-500">Adicione sua primeira despesa usando o formulário ao lado.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {despesas.map((despesa) => (
                      <div
                        key={despesa.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className="text-lg">{getPaymentIcon(despesa.formaPagamento)}</span>
                              <h3 className="font-medium text-gray-900">{despesa.descricao}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentColor(despesa.formaPagamento)}`}>
                                {despesa.formaPagamento}
                              </span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(despesa.data)}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <DollarSign className="h-4 w-4" />
                                <span className="font-medium text-gray-900">{formatCurrency(despesa.valor)}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEdit(despesa)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Editar despesa"
                              disabled={loading}
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(despesa.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Excluir despesa"
                              disabled={loading}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Despesas;