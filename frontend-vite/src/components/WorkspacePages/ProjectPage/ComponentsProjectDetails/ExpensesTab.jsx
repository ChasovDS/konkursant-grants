import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Box,
} from '@mui/material';

// Вспомогательный компонент для отображения таблицы расходов
const ExpensesTable = ({ records }) => {
  const formatCurrency = (value) => {
    if (typeof value === 'number') {
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 2,
      }).format(value);
    }
    return value || '-';
  };

  return (
    <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
      <Table aria-label="expenses table" tableLayout="auto">
        <TableHead>
          <TableRow>
            <TableCell>Название</TableCell>
            <TableCell>Описание</TableCell>
            <TableCell>Тип</TableCell>
            <TableCell align="right">Количество</TableCell>
            <TableCell align="right" sx={{ minWidth: 150 }}>
              Цена за единицу
            </TableCell>
            <TableCell align="right" sx={{ minWidth: 150 }}>
              Итого
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records && records.length > 0 ? (
            records
              .filter((record) => record.title)
              .map((record) => (
                <TableRow key={record.expense_record_id}>
                  <TableCell>{record.title || '-'}</TableCell>
                  <TableCell>{record.description || '-'}</TableCell>
                  <TableCell>{record.type || '-'}</TableCell>
                  <TableCell align="right">{record.quantity ?? '-'}</TableCell>
                  <TableCell align="right">{formatCurrency(record.price)}</TableCell>
                  <TableCell align="right">{formatCurrency(record.total)}</TableCell>
                </TableRow>
              ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">
                Нет данных для отображения.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

ExpensesTable.propTypes = {
  records: PropTypes.arrayOf(
    PropTypes.shape({
      expense_record_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string,
      description: PropTypes.string,
      type: PropTypes.string,
      quantity: PropTypes.number,
      price: PropTypes.number,
      total: PropTypes.number,
    })
  ),
};

// Основной компонент ExpensesTab с Toggle Buttons
const ExpensesTab = ({ data }) => {
  const [selectedCategory, setSelectedCategory] = useState('');

  if (!data) {
    return (
      <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
        Данные отсутствуют.
      </Typography>
    );
  }

  const { total_expense, categories } = data;

  const expenseCategories = [
    'Сайт / приложение',
    'Расходы на связь',
    'Канцелярия и расходные материалы',
    'Полиграфическая продукция',
    'Подарки, сувенирная продукция',
    'Проживание и питание',
    'Транспортные расходы',
    'Аренда помещений',
    'Аренда оборудования',
    'Информационные услуги',
    'Закупка оборудования',
    'Дополнительные услуги и товары для проекта',
    'Расходы на ПО',
  ];

  const handleCategoryChange = (event, newCategory) => {
    if (newCategory !== null) {
      setSelectedCategory(newCategory);
    }
  };

  const getCategoryData = (categoryName) => {
    return categories.find((cat) => cat.name.toLowerCase() === categoryName.toLowerCase());
  };

  const formatTotalExpense = (value) => {
    if (typeof value === 'number') {
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 2,
      }).format(value);
    }
    return value || '-';
  };

  // Устанавливаем первую категорию по умолчанию
  React.useEffect(() => {
    if (expenseCategories.length > 0 && !selectedCategory) {
      setSelectedCategory(expenseCategories[0]);
    }
  }, [expenseCategories, selectedCategory]);

  const currentCategoryData = getCategoryData(selectedCategory);

  return (
    <Box sx={{ width: '100%', padding: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        <strong>Общая сумма расходов:</strong> {formatTotalExpense(total_expense)}
      </Typography>
      <Divider sx={{ marginY: 2 }} />
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          marginBottom: 2,
        }}
      >
        <ToggleButtonGroup
          value={selectedCategory}
          exclusive
          size="small"
          onChange={handleCategoryChange}
          aria-label="Категории расходов"
          sx={{ flexWrap: 'wrap' }}
        >
          {expenseCategories.map((categoryName) => (
            <ToggleButton key={categoryName} value={categoryName} aria-label={categoryName}>
              {categoryName}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>
      {selectedCategory && currentCategoryData ? (
        <>
          <Typography variant="h6" gutterBottom>
            Категория: {currentCategoryData.name}
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
            Общая сумма: {formatTotalExpense(currentCategoryData.total)}
          </Typography>
          <ExpensesTable records={currentCategoryData.records} />
        </>
      ) : (
        <Typography variant="body2" color="text.secondary">
          Нет данных для отображения.
        </Typography>
      )}
    </Box>
  );
};

ExpensesTab.propTypes = {
  data: PropTypes.shape({
    total_expense: PropTypes.number,
    categories: PropTypes.arrayOf(
      PropTypes.shape({
        expense_category_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string.isRequired,
        total: PropTypes.number,
        records: PropTypes.arrayOf(
          PropTypes.shape({
            expense_record_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            title: PropTypes.string,
            description: PropTypes.string,
            type: PropTypes.string,
            quantity: PropTypes.number,
            price: PropTypes.number,
            total: PropTypes.number,
          })
        ),
      })
    ),
  }).isRequired,
};

export default ExpensesTab;
