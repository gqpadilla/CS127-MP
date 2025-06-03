import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button } from '@mui/material';
import { Item } from '../types/types';

interface ItemCardProps {
  item: Item;
  onSelect: (item: Item) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onSelect }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="div"
        sx={{ 
          height: 140, 
          backgroundColor: '#D7CCC8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#5D4037',
          fontSize: '3rem',
        }}
      >
        {item.name.charAt(0)}
      </CardMedia>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div">
          {item.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {item.category}
        </Typography>
        <Typography variant="body1" fontWeight="bold">
          ₱{item.basePrice.toFixed(2)}
        </Typography>
      </CardContent>
      <Button 
        variant="contained" 
        color="primary"
        sx={{ m: 1, mt: 0 }}
        onClick={() => onSelect(item)}
      >
        Add to Order
      </Button>
    </Card>
  );
};

export default ItemCard;