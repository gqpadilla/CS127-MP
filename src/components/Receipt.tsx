import React from 'react';
import { Paper, Typography, Box, Divider } from '@mui/material';
import { OrderItem } from '../types/types';

interface ReceiptProps {
  items: OrderItem[];
  total: number;
  isMember: boolean;
  memberId?: string;
}

const Receipt: React.FC<ReceiptProps> = ({ items, total, isMember, memberId }) => {
  return (
    <Paper sx={{ 
      p: 3, 
      width: '100%', 
      fontFamily: '"Courier New", monospace',
      backgroundColor: 'white',
    }}>
      <Typography variant="h5" align="center" gutterBottom fontWeight="bold">
        HELL WEEK COFFEE
      </Typography>
      <Typography variant="body2" align="center" gutterBottom>
        123 Coffee Street, Manila
        <br />
        (123) 456-7890
      </Typography>
      
      <Box textAlign="center" my={2}>
        <Divider sx={{ borderStyle: 'dashed' }} />
      </Box>
      
      <Typography variant="body2" gutterBottom>
        Date: {new Date().toLocaleDateString()}
        <br />
        Time: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        <br />
        Transaction ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}
      </Typography>
      
      {isMember && (
        <Typography variant="body2" gutterBottom>
          Member ID: {memberId}
        </Typography>
      )}
      
      <Box my={2}>
        <Divider />
      </Box>
      
      {items.map((item, index) => {
        const sizePrice = item.selectedSize?.priceModifier || 0;
        const customizationsTotal = item.selectedCustomizations.reduce(
          (sum, opt) => sum + opt.price, 0
        );
        const itemPrice = (item.item.basePrice + sizePrice + customizationsTotal) * item.quantity;
        
        return (
          <Box key={index} mb={1.5}>
            <Box display="flex" justifyContent="space-between">
              <Typography fontWeight={500}>
                {item.quantity} x {item.item.name}
              </Typography>
              <Typography>₱{itemPrice.toFixed(2)}</Typography>
            </Box>
            
            {item.selectedSize && (
              <Typography variant="body2" pl={2} color="textSecondary">
                Size: {item.selectedSize.name} (+₱{item.selectedSize.priceModifier.toFixed(2)})
              </Typography>
            )}
            
            {item.selectedCustomizations.length > 0 && (
              <Box pl={2}>
                {item.selectedCustomizations.map((opt, idx) => (
                  <Typography key={idx} variant="body2" color="textSecondary">
                    + {opt.name} (+₱{opt.price.toFixed(2)})
                  </Typography>
                ))}
              </Box>
            )}
          </Box>
        );
      })}
      
      <Box my={2}>
        <Divider />
      </Box>
      
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h6">TOTAL:</Typography>
        <Typography variant="h6" fontWeight="bold">₱{total.toFixed(2)}</Typography>
      </Box>
      
      {isMember && (
        <Box mt={1} display="flex" justifyContent="space-between">
          <Typography variant="body2">Member Discount (10%):</Typography>
          <Typography variant="body2">-₱{(total * 0.1).toFixed(2)}</Typography>
        </Box>
      )}
      
      {isMember && (
        <Box display="flex" justifyContent="space-between" mt={0.5}>
          <Typography variant="body2" fontWeight="bold">AMOUNT DUE:</Typography>
          <Typography variant="body2" fontWeight="bold">
            ₱{(total * 0.9).toFixed(2)}
          </Typography>
        </Box>
      )}
      
      <Box my={2}>
        <Divider sx={{ borderStyle: 'dashed' }} />
      </Box>
      
      <Typography variant="body2" align="center" color="textSecondary">
        Thank you for your purchase!
        <br />
        Earn points with our rewards program
      </Typography>
    </Paper>
  );
};

export default Receipt;