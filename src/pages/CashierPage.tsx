import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Button, Paper, Box, Stepper, Step, StepLabel, IconButton } from '@mui/material';
import { ItemCard, SizeSelector, CustomizationDialog, Receipt } from '../components';
import { fetchItems, createTransaction } from '../services/api';
import { Item, OrderItem, Transaction } from '../types/types';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const CashierPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [items, setItems] = useState<Item[]>([]);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [currentItem, setCurrentItem] = useState<Item | null>(null);
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isMember, setIsMember] = useState(false);
  const [memberId, setMemberId] = useState('');

  useEffect(() => {
    const loadItems = async () => {
      const data = await fetchItems();
      setItems(data);
    };
    loadItems();
  }, []);

  const handleItemSelect = (item: Item) => {
    setCurrentItem(item);
    if (item.customizations && item.customizations.length > 0) {
      setIsCustomizationOpen(true);
    } else {
      addToCart(item, []);
    }
  };

  const addToCart = (item: Item, customizations: any[], size?: SizeOption) => {
    const existingItemIndex = cart.findIndex(ci => 
      ci.item.id === item.id && 
      JSON.stringify(ci.selectedCustomizations) === JSON.stringify(customizations) &&
      ci.selectedSize?.name === size?.name
    );

    if (existingItemIndex >= 0) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      setCart([
        ...cart,
        {
          item,
          quantity: 1,
          selectedSize: size,
          selectedCustomizations: customizations,
        }
      ]);
    }
    setCurrentItem(null);
  };

  const handleCompleteTransaction = async () => {
    const newTransaction: Omit<Transaction, 'id'> = {
      date: new Date().toISOString(),
      items: cart,
      isMember,
      memberId: isMember ? memberId : undefined,
      total: calculateTotal(),
    };
    
    const createdTransaction = await createTransaction(newTransaction);
    setTransaction(createdTransaction);
    setActiveStep(3);
  };

  const calculateTotal = (): number => {
    return cart.reduce((sum, item) => {
      const sizePrice = item.selectedSize ? item.selectedSize.priceModifier : 0;
      const customizationsPrice = item.selectedCustomizations.reduce(
        (acc, curr) => acc + curr.price, 0
      );
      return sum + (item.item.basePrice + sizePrice + customizationsPrice) * item.quantity;
    }, 0);
  };

  const steps = ['Select Customer Type', 'Order Items', 'Review Order', 'Complete Transaction'];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          <Box component="span" sx={{ color: 'primary.main' }}>Hell Week Coffee</Box> POS
        </Typography>
        <Box display="flex" alignItems="center">
          <Typography variant="h6" sx={{ mr: 2 }}>
            Cashier: Jane Doe
          </Typography>
          <IconButton color="primary">
            <ShoppingCartIcon fontSize="large" />
            {cart.length > 0 && (
              <Box 
                sx={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  backgroundColor: 'secondary.main',
                  color: 'white',
                  borderRadius: '50%',
                  width: 24,
                  height: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                }}
              >
                {cart.reduce((acc, item) => acc + item.quantity, 0)}
              </Box>
            )}
          </IconButton>
        </Box>
      </Box>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Customer Type
          </Typography>
          <Box mt={4} display="flex" justifyContent="center" gap={4}>
            <Button 
              variant={!isMember ? 'contained' : 'outlined'} 
              onClick={() => setIsMember(false)}
              sx={{ width: 200, py: 3 }}
            >
              Guest
            </Button>
            <Button 
              variant={isMember ? 'contained' : 'outlined'} 
              onClick={() => setIsMember(true)}
              sx={{ width: 200, py: 3 }}
            >
              Member
            </Button>
          </Box>
          
          {isMember && (
            <Box mt={4} maxWidth={400} mx="auto">
              <Typography variant="body1" gutterBottom>
                Enter Membership ID
              </Typography>
              <input
                type="text"
                value={memberId}
                onChange={(e) => setMemberId(e.target.value.toUpperCase())}
                pattern="[A-Z0-9]{5}"
                maxLength={5}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '1.2rem',
                  textAlign: 'center',
                  letterSpacing: '0.1em',
                  border: '2px solid #D7CCC8',
                  borderRadius: '8px',
                }}
                placeholder="e.g. AB12E"
              />
            </Box>
          )}
          
          <Box mt={6}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={() => setActiveStep(1)}
              disabled={isMember && !/^[A-Z0-9]{5}$/.test(memberId)}
            >
              Continue to Order
            </Button>
          </Box>
        </Paper>
      )}

      {activeStep === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h5" gutterBottom sx={{ pb: 1, borderBottom: '2px solid #D7CCC8' }}>
                Categories
              </Typography>
              {['Drinks', 'Food', 'Merchandise'].map(category => (
                <Button 
                  key={category} 
                  fullWidth 
                  sx={{ 
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    py: 1.5,
                    my: 0.5,
                    borderRadius: '4px',
                  }}
                >
                  {category}
                </Button>
              ))}
            </Paper>
            
            <Paper sx={{ p: 2 }}>
              <Typography variant="h5" gutterBottom sx={{ pb: 1, borderBottom: '2px solid #D7CCC8' }}>
                Cart Summary
              </Typography>
              {cart.map((item, index) => (
                <Box key={index} sx={{ py: 1, borderBottom: '1px solid #eee' }}>
                  <Typography variant="body1">
                    {item.quantity} × {item.item.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    ₱{(item.item.basePrice * item.quantity).toFixed(2)}
                  </Typography>
                </Box>
              ))}
              {cart.length > 0 && (
                <Box mt={2}>
                  <Typography variant="h6">
                    Total: ₱{calculateTotal().toFixed(2)}
                  </Typography>
                  <Button 
                    variant="contained" 
                    fullWidth 
                    sx={{ mt: 2 }}
                    onClick={() => setActiveStep(2)}
                  >
                    Review Order
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={9}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5">Menu Items</Typography>
              <Box>
                <Button 
                  startIcon={<ArrowBackIcon />} 
                  sx={{ mr: 1 }}
                  onClick={() => setActiveStep(0)}
                >
                  Back
                </Button>
                <Button variant="outlined">Filter</Button>
              </Box>
            </Box>
            
            <Grid container spacing={3}>
              {items.map(item => (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <ItemCard item={item} onSelect={handleItemSelect} />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      )}

      {activeStep === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Button 
              startIcon={<ArrowBackIcon />} 
              onClick={() => setActiveStep(1)}
              sx={{ mb: 2 }}
            >
              Back to Menu
            </Button>
            <Receipt 
              items={cart} 
              isMember={isMember} 
              memberId={memberId} 
              total={calculateTotal()} 
            />
            <Box mt={4} display="flex" justifyContent="flex-end">
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                onClick={handleCompleteTransaction}
              >
                Complete Transaction
              </Button>
            </Box>
          </Grid>
        </Grid>
      )}

      {activeStep === 3 && transaction && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom color="primary">
            Transaction Complete!
          </Typography>
          <Typography variant="h6" gutterBottom>
            Transaction ID: {transaction.id}
          </Typography>
          <Box maxWidth={500} mx="auto" mt={4}>
            <Receipt 
              items={transaction.items} 
              isMember={transaction.isMember} 
              memberId={transaction.memberId} 
              total={transaction.total} 
            />
          </Box>
          <Box mt={4}>
            <Button 
              variant="contained" 
              color="primary"
              size="large"
              onClick={() => {
                setCart([]);
                setActiveStep(0);
                setTransaction(null);
              }}
            >
              Start New Transaction
            </Button>
          </Box>
        </Paper>
      )}

      {currentItem && isCustomizationOpen && (
        <CustomizationDialog
          item={currentItem}
          open={isCustomizationOpen}
          onClose={() => setIsCustomizationOpen(false)}
          onAddToCart={(customizations, size) => {
            addToCart(currentItem, customizations, size);
            setIsCustomizationOpen(false);
          }}
        />
      )}
    </Container>
  );
};

export default CashierPage;