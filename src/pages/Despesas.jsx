import React, { useEffect, useState } from 'react';
import { Edit, Trash2, Plus, DollarSign, Calendar, CreditCard, AlertCircle, CheckCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import PageHeader from '../components/layout/PageHeader';
import FormContainer from '../components/forms/FormContainer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Alert from '../components/ui/Alert';
import LoadingSpinner from '../components/ui/LoadingSpinner';

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
  const navigate = useNavigate();

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

  const handleSubmit = async () => {
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

  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      localStorage.removeItem('token');
      navigate('/');
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
        <Card className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Acesso Negado</h2>
          <p className="text-gray-600">Você precisa estar logado para acessar esta página.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header usando PageHeader component */}
        <PageHeader 
          title="Controle de Despesas"
          subtitle="Gerencie suas despesas de forma eficiente"
          icon={<DollarSign className="h-6 w-6" />}
          rightContent={
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total de Despesas</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(totalDespesas)}</p>
              </div>
              <Button
                onClick={handleLogout}
                variant="danger"
                size="sm"
                className="flex items-center space-x-2"
                title="Sair do sistema"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          }
        />

        {/* Messages usando Alert component */}
        {success && (
          <Alert type="success" className="mb-6">
            {success}
          </Alert>
        )}

        {error && (
          <Alert type="error" className="mb-6">
            {error}
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulário usando FormContainer */}
          <div className="lg:col-span-1">
            <FormContainer
              title={isEditing ? 'Editar Despesa' : 'Nova Despesa'}
              onCancel={isEditing ? resetForm : null}
            >
              <div className="space-y-4">
                <Input
                  label="Descrição *"
                  type="text"
                  placeholder="Ex: Almoço, Gasolina, Supermercado..."
                  value={form.descricao}
                  onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                  required
                />

                <Select
                  label="Forma de Pagamento"
                  value={form.formaPagamento}
                  onChange={(e) => setForm({ ...form, formaPagamento: e.target.value })}
                  options={[
                    { value: 'PIX', label: '📱 PIX' },
                    { value: 'CARTAO', label: '💳 Cartão' },
                    { value: 'DINHEIRO', label: '💵 Dinheiro' }
                  ]}
                />

                <Input
                  label="Valor *"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                  value={form.valor}
                  onChange={(e) => setForm({ ...form, valor: e.target.value })}
                  required
                />

                <Input
                  label="Data"
                  type="date"
                  value={form.data}
                  onChange={(e) => setForm({ ...form, data: e.target.value })}
                />

                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  variant="primary"
                  size="lg"
                  className="w-full flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <Plus className="h-5 w-5" />
                      <span>{isEditing ? 'Atualizar' : 'Adicionar'} Despesa</span>
                    </>
                  )}
                </Button>
              </div>
            </FormContainer>
          </div>

          {/* Lista de Despesas usando Card */}
          <div className="lg:col-span-2">
            <Card>
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
                    <LoadingSpinner className="mx-auto mb-4" />
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
                      <Card key={despesa.id} className="p-4 hover:shadow-md transition-shadow">
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
                            <Button
                              onClick={() => handleEdit(despesa)}
                              variant="ghost"
                              size="sm"
                              className="text-blue-600 hover:bg-blue-50"
                              title="Editar despesa"
                              disabled={loading}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => handleDelete(despesa.id)}
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:bg-red-50"
                              title="Excluir despesa"
                              disabled={loading}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Despesas;