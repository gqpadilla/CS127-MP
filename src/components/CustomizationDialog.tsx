import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  FormControl, 
  RadioGroup, 
  FormControlLabel, 
  Radio,
  Box,
  Chip,
  Grid
} from '@mui/material';
import { Item, SizeOption, CustomizationOption } from '../types/types';
import SizeSelector from './SizeSelector';

interface CustomizationDialogProps {
  item: Item;
  open: boolean;
  onClose: () => void;
  onAddToCart: (customizations: CustomizationOption[], size?: SizeOption) => void;
}

const CustomizationDialog: React.FC<CustomizationDialogProps> = ({ 
  item, 
  open, 
  onClose, 
  onAddToCart 
}) => {
  const [selectedSize, setSelectedSize] = useState<SizeOption | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<{[key: string]: string}>({});

  const handleOptionSelect = (customizationId: string, optionId: string) => {
    setSelectedOptions(prev => ({ ...prev, [customizationId]: optionId }));
  };

  const handleAddToCart = () => {
    const optionsArray: CustomizationOption[] = [];
    
    Object.entries(selectedOptions).forEach(([customizationId, optionId]) => {
      const customization = item.customizations?.find(c => c.id === customizationId);
      if (customization) {
        const option = customization.options.find(o => o.id === optionId);
        if (option) optionsArray.push(option);
      }
    });
    
    onAddToCart(optionsArray, selectedSize || undefined);
    onClose();
    // Reset selections
    setSelectedSize(null);
    setSelectedOptions({});
  };

  const calculateTotal = (): number => {
    let total = item.basePrice;
    
    if (selectedSize) {
      total += selectedSize.priceModifier;
    }
    
    Object.values(selectedOptions).forEach(optionId => {
      item.customizations?.forEach(customization => {
        const option = customization.options.find(o => o.id === optionId);
        if (option) total += option.price;
      });
    });
    
    return total;
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Typography variant="h5">{item.name}</Typography>
        <Typography variant="body2" color="textSecondary">{item.category}</Typography>
      </DialogTitle>
      
      <DialogContent dividers>
        <Grid container spacing={3}>
          {item.sizes && item.sizes.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Select Size</Typography>
              <SizeSelector 
                sizes={item.sizes} 
                selectedSize={selectedSize} 
                onSelectSize={setSelectedSize} 
              />
            </Grid>
          )}
          
          {item.customizations?.map(customization => (
            <Grid item xs={12} key={customization.id}>
              <Typography variant="h6" gutterBottom>
                {customization.name}
              </Typography>
              <FormControl component="fieldset" fullWidth>
                <RadioGroup
                  value={selectedOptions[customization.id] || ''}
                  onChange={(e) => handleOptionSelect(customization.id, e.target.value)}
                >
                  {customization.options.map(option => (
                    <FormControlLabel
                      key={option.id}
                      value={option.id}
                      control={<Radio />}
                      label={
                        <Box display="flex" justifyContent="space-between" width="100%">
                          <span>{option.name}</span>
                          <span>+₱{option.price.toFixed(2)}</span>
                        </Box>
                      }
                      sx={{ 
                        border: '1px solid #D7CCC8', 
                        borderRadius: '4px', 
                        mb: 1,
                        px: 2,
                        '&.Mui-checked': {
                          backgroundColor: '#FFF8F0',
                          borderColor: '#4E342E',
                        }
                      }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ justifyContent: 'space-between', p: 3 }}>
        <Typography variant="h6">
          Total: <Box component="span" fontWeight="bold">₱{calculateTotal().toFixed(2)}</Box>
        </Typography>
        <Box>
          <Button onClick={onClose} sx={{ mr: 2 }}>Cancel</Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleAddToCart}
          >
            Add to Order
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default CustomizationDialog;