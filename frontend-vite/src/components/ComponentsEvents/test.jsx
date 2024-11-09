import React from 'react'; import { AppBar, Toolbar, Typography, Breadcrumbs, Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Menu, MenuItem, } from '@mui/material'; import { Link } from 'react-router-dom'; import SearchIcon from '@mui/icons-material/Search'; import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; import { useState } from 'react';
const ProductPage = () => {
const [anchorEl, setAnchorEl] = useState(null);

const handleMenuOpen = (event) => {
setAnchorEl(event.currentTarget);
};

const handleMenuClose = () => {
setAnchorEl(null);
};

const products = [
{
name: 'Fitbit Sense Advanced Smartwatch',
price: '39', category: 'Plants', tags: ['Health', 'Exercise', 'Discipline', 'Lifestyle', 'Fitness'], vendor: 'Blue Olive Plant sellers. Inc', publishedOn: 'Nov 12, 10:45 PM', }, { name: 'iPhone 13 pro max', price: '87',
category: 'Furniture',
tags: ['Class', 'Camera', 'Discipline', 'invincible', 'Pro', 'Swag'],
vendor: 'Beatrice Furnitures',
publishedOn: 'Nov 11, 7:36 PM',
},
// Добавьте дополнительные продукты по аналогии
];

return (
<div>
<AppBar position="static">
<Toolbar>
<Typography variant="h6">Products</Typography>
</Toolbar>
</AppBar>
<div className="content">
<nav aria-label="breadcrumb">
<Breadcrumbs>
<Link color="inherit" to="/">Page 1</Link>
<Link color="inherit" to="/">Page 2</Link>
<Typography color="textPrimary">Default</Typography>
</Breadcrumbs>
</nav>
<Grid container spacing={3} className="mb-3">
<Grid item>
<Typography variant="h2">Products</Typography>
</Grid>
</Grid>
<div className="mb-3">
<Grid container spacing={2}>
<Grid item>
<Button variant="contained" color="primary" startIcon={<SearchIcon />}>
Search
</Button>
</Grid>
<Grid item>
<Button
variant="contained"
color="secondary"
onClick={handleMenuOpen}
endIcon={<ExpandMoreIcon />}
>
Category
</Button>
<Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} >
<MenuItem onClick={handleMenuClose}>Action</MenuItem>
<MenuItem onClick={handleMenuClose}>Another action</MenuItem>
<MenuItem onClick={handleMenuClose}>Something else here</MenuItem>
</Menu>
</Grid>
<Grid item>
<Button variant="contained" color="secondary" onClick={handleMenuOpen}>
Vendor
</Button>
</Grid>
<Grid item>
<Button variant="contained" color="secondary">More filters</Button>
</Grid>
<Grid item>
<Button variant="contained" color="primary">Add product</Button>
</Grid>
</Grid>
</div>
<TableContainer component={Paper}>
<Table>
<TableHead>
<TableRow>
<TableCell>Select</TableCell>
<TableCell>Product Name</TableCell>
<TableCell align="right">Price</TableCell>
<TableCell align="right">Category</TableCell>
<TableCell align="right">Tags</TableCell>
<TableCell align="right">Vendor</TableCell>
<TableCell align="right">Published On</TableCell>
</TableRow>
</TableHead>
<TableBody>
{products.map((product, index) => (
<TableRow key={index}>
<TableCell>
<input type="checkbox" />
</TableCell>
<TableCell>{product.name}</TableCell>
<TableCell align="right">{product.price}</TableCell>
<TableCell align="right">{product.category}</TableCell>
<TableCell align="right">{product.tags.join(', ')}</TableCell>
<TableCell align="right">{product.vendor}</TableCell>
<TableCell align="right">{product.publishedOn}</TableCell>
</TableRow>
))}
</TableBody>
</Table>
</TableContainer>
</div>
</div>
);
};

export default ProductPage;