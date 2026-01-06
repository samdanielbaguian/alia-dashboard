/**
 * Data Table Component
 * Reusable table with sorting and styling
 */

'use client';

import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Chip
} from '@mui/material';
import { formatCurrency } from '@/utils/helpers';

export default function DataTable({ title, columns, data, renderCell }) {
  const getStatusColor = (status) => {
    const colors = {
      completed: 'success',
      processing: 'info',
      shipped: 'warning',
      pending: 'default',
      cancelled: 'error',
      active: 'success',
      inactive: 'default',
      low_stock: 'warning',
      vip: 'secondary',
      regular: 'default'
    };
    return colors[status] || 'default';
  };

  const defaultRenderCell = (row, column) => {
    const value = row[column.field];
    
    if (column.type === 'status') {
      return (
        <Chip
          label={value}
          color={getStatusColor(value)}
          size="small"
          sx={{ textTransform: 'capitalize' }}
        />
      );
    }
    
    if (column.type === 'currency') {
      return formatCurrency(typeof value === 'number' ? value : parseFloat(value) || 0);
    }
    
    if (column.type === 'number') {
      return typeof value === 'number' ? value.toLocaleString() : value;
    }
    
    return value;
  };

  return (
    <Card>
      <CardContent>
        {title && (
          <Typography variant="h6" sx={{ mb: 2 }}>
            {title}
          </Typography>
        )}
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.field}
                    sx={{
                      fontWeight: 600,
                      backgroundColor: '#f5f5f5',
                      color: '#000000',
                    }}
                  >
                    {column.headerName}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow
                  key={row.id || index}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.04)',
                    },
                  }}
                >
                  {columns.map((column) => (
                    <TableCell key={column.field}>
                      {renderCell
                        ? renderCell(row, column)
                        : defaultRenderCell(row, column)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                      No data available
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
