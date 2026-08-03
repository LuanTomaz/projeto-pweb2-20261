
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions } from '../features/transactions/transactionsSlice';

export default function TransactionsList() {
  const dispatch = useDispatch<any>();
  const { transactions } = useSelector((s:any) => s.transactions);

  useEffect(() => {
    dispatch(fetchTransactions());
  }, []);

  return (
    <div>
      <h1>Transações</h1>
      <table>
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Valor</th>
            <th>Categoria</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t:any) => (
            <tr key={t.id}>
              <td>{t.type}</td>
              <td>{t.amount}</td>
              <td>{t.category}</td>
              <td>{t.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
