// src/components/ViewDetailsProject/tabs/SelfFinancingTab.jsx

import React from 'react';
import { Typography, List, ListItem, ListItemText, Divider } from '@mui/material';

const SelfFinancingTab = ({ data }) => {
  if (!data) {
    return <Typography>Данные отсутствуют.</Typography>;
  }

  const { own_funds, partner_funds } = data;

  return (
    <div>

      {/* Раздел для собственных средств */}
      <Typography variant="subtitle1" gutterBottom>
        Собственные средства
      </Typography>
      <List>
        {own_funds.map((fund) => (
          <div key={fund.expense_own_id}>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary="Описание расходов"
                secondary={
                  <>
                    <Typography variant="body2">{fund.expenses_description}</Typography>
                  </>
                }
              />
            </ListItem>
            {/* Список расходов для собственных средств */}
            <List>
              {fund.expenses_list.map((expense) => (
                <ListItem key={expense.expense_own_id}>
                  <ListItemText
                    primary={`Расход ID: ${expense.expense_own_id}`}
                    secondary={
                      <>
                        <Typography variant="body2">Сумма: {expense.amount.toLocaleString()} руб.</Typography>
                        {expense.file_link && (
                        <Typography variant="body2">
                        {expense.file_link ? (
                        <a href={expense.file_link} target="_blank" rel="noopener noreferrer">
                            Ссылка на файл
                        </a>
                        ) : (
                        'Не указано | Требуется загрузить'
                        )}
                        </Typography>
                        )}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
            <Divider component="li" />
          </div>
        ))}
      </List>

      {/* Раздел для средств партнеров */}
      <Typography variant="subtitle1" gutterBottom>
        Средства партнеров
      </Typography>
      <List>
        {partner_funds.map((fund) => (
          <div key={fund.expense_partner_id}>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={`Партнер: ${fund.partner_name}`}
                secondary={
                  <>
                    <Typography variant="body2">
                      Тип поддержки: {fund.support_type}
                    </Typography>
                    <Typography variant="body2">
                     Перечень расходов: {fund.expense_description}
                        </Typography>
                    <Typography variant="body2" color="textPrimary">
                      Сумма: {fund.amount ? fund.amount.toLocaleString() : 0} руб.
                    </Typography>
                  </>
                }
              />
            </ListItem>
            <Divider component="li" />
          </div>
        ))}
      </List>
    </div>
  );
};

export default SelfFinancingTab;
