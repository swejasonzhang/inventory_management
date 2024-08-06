'use client'
import { useState, useEffect } from "react";
import { firestore } from '@/firebase'
import { Box, Button, Modal, Stack, TextField, Typography } from '@mui/material'
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemToUpdate, setItemToUpdate] = useState('');
  const [quantityToUpdate, setQuantityToUpdate] = useState('');
  const [addItemQuantity, setAddItemQuantity] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

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

  const addItem = async(item, quantity) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity: currentQuantity } = docSnap.data();
      await setDoc(docRef, { quantity: currentQuantity + parseInt(quantity, 10) });
    } else {
      await setDoc(docRef, { quantity: parseInt(quantity, 10) });
    }

    await updateInventory();
  };
  
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity > 1) {
        await setDoc(docRef, { quantity: quantity - 1 });
      } else {
        await deleteDoc(docRef);
      }
    }
  
    await updateInventory();
  };  

  const openUpdateModal = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      setItemToUpdate(item);
      setQuantityToUpdate(quantity);
      setOpenUpdate(true);
    }
  };

  const updateItem = async () => {
    try {
      const docRef = doc(collection(firestore, 'inventory'), itemToUpdate);
      const parsedQuantity = parseInt(quantityToUpdate, 10);
      
      if (isNaN(parsedQuantity) || parsedQuantity < 0) {
        alert("Please enter a valid quantity.");
        return;
      }
  
      if (parsedQuantity === 0) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: parsedQuantity });
      }
      
      setOpenUpdate(false);
      setQuantityToUpdate('');
      await updateInventory();
      
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => {
    setOpenAdd(false);
    setItemName('');
    setAddItemQuantity('');
  };
  const handleCloseUpdate = () => setOpenUpdate(false);

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Box
        width="100vw"
        height="100vh"
        sx={{
          backgroundImage: 'url(/Background.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          overflow: 'hidden',
          zIndex: 1,
          position: 'absolute',
        }}
      >
        <Box
          width="100%"
          height="5rem"
          justifyContent="space-between"
          alignItems="center"
          display="flex"
          color="#FFFFFF"
          sx={{ zIndex: 1000, position: 'relative' }} 
        >
          <Typography
            height="5rem"
            fontSize="2.5rem"
            paddingLeft="2rem"
            fontFamily="cursive"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            Dev Dishes 🍽️
          </Typography>

          <Typography
            height="5rem"
            fontSize="2rem"
            paddingRight="2rem"
            fontFamily="cursive"
            display="flex"
            alignItems="center"
            justifyContent="center"
          ></Typography>
        </Box> 

        <Box
          width="100%"
          height="100%"
          display="flex"
          flexDirection="column"
          justifyContent="space-evenly"
          alignItems="center"
          gap={2}
        >
          <Modal open={openAdd} onClose={handleCloseAdd}>
            <Box
              position="absolute"
              top="50%"
              left="50%"
              width={400}
              bgcolor="#ffffff"
              boxShadow={24}
              p={4}
              display="flex"
              flexDirection="column"
              gap={3}
              sx={{ transform: 'translate(-50%, -50%)', zIndex: 2000 }}
            >
              <Typography variant="h6" fontFamily="cursive" color="#000">
                Add Item
              </Typography>
              <Stack width="100%" direction="row" spacing={2}>
                <TextField
                  variant="outlined"
                  fullWidth
                  value={itemName}
                  placeholder="Item Name"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: "#000",
                      },
                      '&:hover fieldset': {
                        borderColor: "#000",
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: "#000",
                      },
                    },
                  }}
                  onChange={(e) => setItemName(e.target.value)}
                />
                <TextField
                  variant="outlined"
                  fullWidth
                  value={addItemQuantity}
                  type="number"
                  placeholder="Quantity"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#000',
                      },
                      '&:hover fieldset': {
                        borderColor: '#000',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#000',
                      },
                    },
                  }}
                  onChange={(e) => setAddItemQuantity(e.target.value)}
                />
                <Button
                  variant="outlined"
                  sx={{ borderColor: "#000" }}
                  onClick={() => {
                    if (itemName && addItemQuantity) {
                      addItem(itemName, addItemQuantity);
                      handleCloseAdd();
                    } else {
                      alert("Please enter both item name and quantity.");
                    }
                  }}
                >
                  <Typography color="#000" textTransform="none">Add</Typography>
                </Button>
              </Stack>
            </Box>
          </Modal>

          <Modal open={openUpdate} onClose={handleCloseUpdate}>
            <Box
              position="absolute"
              top="50%"
              left="50%"
              width={400}
              bgcolor="#ffffff"
              boxShadow={24}
              p={4}
              display="flex"
              flexDirection="column"
              gap={3}
              sx={{ transform: 'translate(-50%, -50%)', zIndex: 2000 }}
            >
              <Typography variant="h6" fontFamily="cursive" color="#000">
                Update Item Quantity
              </Typography>
              <Stack width="100%" direction="row" spacing={2}>
                <TextField
                  variant="outlined"
                  fullWidth
                  value={quantityToUpdate}
                  type="number"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#000',
                      },
                      '&:hover fieldset': {
                        borderColor: '#000',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#000',
                      },
                    },
                  }}
                  onChange={(e) => setQuantityToUpdate(e.target.value)}
                />
                <Button
                  variant="outlined"
                  sx={{ borderColor: "#000" }}
                  onClick={updateItem}
                >
                  <Typography color="#000" textTransform="none">Update</Typography>
                </Button>
              </Stack>
            </Box>
          </Modal>

          <Typography fontSize="5rem" fontFamily="cursive" color="#ffffff">Lets Learn How To Cook!</Typography>

          <Box width="80rem" display="flex" flexDirection="row" alignItems="center" justifyContent="space-evenly" padding="2rem">
            <TextField
              id="outlined-basic"
              label="Search For Ingredients"
              variant="filled"
              placeholder="Let's Cook!"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                width: '300px', 
                '& .MuiInputBase-root': { 
                  backgroundColor: '#fff', 
                  fontFamily: 'cursive',
                  width: '30rem',
                  '&:hover': {
                    backgroundColor: '#fff', 
                  },
                },
                '& .MuiOutlinedInput-root': { 
                  '& fieldset': {
                    borderColor: 'transparent', 
                  },
                  '&:hover fieldset': {
                    borderColor: 'transparent', 
                  },
                },
              }}
            />

            <Button
              variant="contained"
              sx={{
                backgroundColor: '#ffffff',
                '&:hover': {
                  backgroundColor: '#ffffff', 
                },
              }}
              onClick={handleOpenAdd}
            >
              <Typography fontFamily="cursive" textTransform="none" color="#000">
                Add New Item
              </Typography>
            </Button>
          </Box>

          <Box>
            <Stack
              width="800px"
              height="300px"
              spacing={2}
              overflow="auto"
              border="2px solid #fff"
              borderRadius="10px"
              sx={{
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {filteredInventory.map(({ name, quantity }) => (
                <Box
                  key={name}
                  width="100%"
                  minHeight="150px"
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  bgcolor="transparent"
                  padding={5}
                  sx={{ zIndex: 1000, position: 'relative' }} 
                >
                  <Typography variant="h3" color="#ffffff" textAlign="center" fontFamily="cursive">
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>

                  <Typography variant="h3" color="#ffffff" textAlign="center" fontFamily="cursive">
                    Qty: {quantity}
                  </Typography>

                  <Stack direction="row" spacing={2}></Stack>

                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: '#ffffff',
                      '&:hover': {
                        backgroundColor: '#ffffff', 
                      },
                    }}
                    onClick={() => {
                      removeItem(name);
                    }}
                  >
                    <Typography color="#000" textTransform="none" fontFamily="cursive">Remove</Typography>
                  </Button>

                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: '#ffffff',
                      '&:hover': {
                        backgroundColor: '#ffffff', 
                      },
                    }}
                    onClick={() => {
                      openUpdateModal(name);
                    }}
                  >
                    <Typography color="#000" textTransform="none" fontFamily="cursive">Update</Typography>
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
