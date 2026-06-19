
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createTransaction } from '../features/transactions/transactionsSlice';

export default function NewTransaction() {
  const [form, setForm] = useState({
    amount:'',
    category:'',
    date:new Date().toISOString().slice(0,10),
    description:'',
    tag:''
  });

  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const submit = async (e:any) => {
    e.preventDefault();

    if (!form.amount || !form.category || !form.date || !form.description) {
      return alert('Preencha os campos obrigatórios');
    }

    const payload = {
      ...form,
      type: Number(form.amount) >= 0 ? 'income' : 'expense'
    };

    await dispatch(createTransaction(payload as any));
    navigate('/transactions');
  };

  return (
    <form onSubmit={submit}>
      <input
        name="amount"
        value={form.amount}
        onChange={handleChange}
        placeholder="Valor"
      />
      <input
        name="category"
        value={form.category}
        onChange={handleChange}
        placeholder="Categoria"
      />
      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
      />
      <input
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Descrição"
      />
      <input
        name="tag"
        value={form.tag}
        onChange={handleChange}
        placeholder="Tag (opcional)"
      />
      <button type="submit">Salvar</button>
    </form>
  );
}
