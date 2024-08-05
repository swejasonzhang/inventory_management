'use client'
import { useState, useEffect } from "react";
import { firestore } from '@/firebase'
import { Box, Button, Modal, Stack, TextField, Typography } from '@mui/material'
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async(item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
  };
  
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1){
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const redirectHome = () => {
    window.location.href = '/';
  };

  return (
    <>
      <Box width="100vw" height="100vh" bgcolor="#1976d2" sx={{ overflowX: 'hidden'}}>
        <Box width="100%" height="5rem" justifyContent="space-between" alignItems="center" display="flex" color="#FFFFFF">
          <Typography height="5rem" fontSize="2rem" paddingLeft="2rem" fontFamily="cursive" sx={{ cursor: 'pointer'}} display= 'flex' alignItems='center' justifyContent='center' onClick={redirectHome}>Dev Dishes 🍽️</Typography>

          <Typography height="5rem" fontSize="2rem" paddingRight="2rem" fontFamily="cursive" sx={{ cursor: 'pointer'}} display= 'flex' alignItems='center' justifyContent='center'>Menu</Typography>
        </Box> 
      
        <Box width="100%" height="100%" display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={2} bgcolor="#ffffff">
          <Modal open={open} onClose={handleClose}>
            <Box position="absolute" top="50%" left="50%" width={400} bgcolor="#ffffff" border= "2px solid #1976d2" boxShadow={24} p={4} display="flex" flexDirection="column" gap={3} sx={{ transform: 'translate(-50%, -50%)' }}>
              <Typography variant="h6" fontFamily="cursive" color="#1976d2">Add Item</Typography>
              <Stack width="100%" direction="row" spacing={2}>
              <TextField variant="outlined" fullWidth value={itemName}
                sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#1976d2',
                      },
                      '&:hover fieldset': {
                        borderColor: '#1976d2',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#1976d2',
                      }
                    }
                  }}
                  onChange={(e) => setItemName(e.target.value)}
                />
                <Button variant="outlined" sx = {{ borderColor: "#1976d2" }}
                  onClick={() => {
                    addItem(itemName)
                    setItemName('')
                    handleClose()
                  }}>
                <Typography color="#1976d2" textTransform="none">Add</Typography>
                </Button>
              </Stack>
            </Box>
          </Modal>

          <Button variant="contained"
              sx={{
                backgroundColor: '#ffffff',
                '&:hover': {
                  backgroundColor: '#ffffff', 
                },
              }}
              onClick={() => { handleOpen() }}
            >
            <Typography fontFamily="cursive" textTransform="none" color="#1976d2">
              Add New Item
            </Typography>
          </Button>

          <Box border="2px solid #ffffff">
            <Box width="800px" height="100px" bgcolor="#1976d2" display="flex" alignItems="center" justifyContent="center" borderBottom="2px solid #ffffff">
            <Typography variant="h2" color="#ffffff" fontFamily="cursive">Inventory Items</Typography>
          </Box>
          <Stack width="800px" height="300px" spacing={2} overflow="auto">
            {
              inventory.map(({ name, quantity }) => (
                <Box key={name} width="100%" minHeight="150px" display="flex" alignItems="center" justifyContent="space-between" bgcolor="#1976d2" padding={5}>
                  <Typography variant="h3" color="#ffffff" textAlign="center" fontFamily="cursive">
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>

                  <Typography variant="h3" color="#ffff" textAlign="center" fontFamily="cursive">
                    {quantity}
                  </Typography>

                  <Stack direction="row"spacing={2}></Stack>
            
                  <Button variant="contained" 
                    sx={{
                      backgroundColor: '#ffffff',
                      '&:hover': {
                        backgroundColor: '#ffffff', 
                      },
                    }}
                    onClick={() => {
                      removeItem(name)
                    }}
                  >
                  <Typography color="#1976d2" textTransform="none" fontFamily="cursive">Remove</Typography>
                  </Button>

                  <Button variant="contained" 
                    sx={{
                      backgroundColor: '#ffffff',
                      '&:hover': {
                        backgroundColor: '#ffffff', 
                      },
                    }}
                    onClick={() => {
                      updateItem(name)
                    }}
                  >
                  <Typography color="#1976d2" textTransform="none" fontFamily="cursive">Update</Typography>
                  </Button>
                </Box>
              ))}
            </Stack>
          </Box> 
        </Box>
      </Box>
    </>
  );
}
