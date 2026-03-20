var express = require('express');
var router = express.Router();
let inventoryController = require('../controllers/inventories');

// GET all inventories
router.get('/', async function (req, res, next) {
    try {
        let result = await inventoryController.GetAllInventories();
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
});

// GET inventory by ID
router.get('/:id', async function (req, res, next) {
    try {
        let result = await inventoryController.GetInventoryById(req.params.id);
        if (result) {
            res.status(200).send(result);
        } else {
            res.status(404).send({
                message: "Inventory not found"
            });
        }
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
});

// Add stock
router.post('/add-stock', async function (req, res, next) {
    try {
        let { product, quantity } = req.body;
        
        if (!product || !quantity) {
            return res.status(400).send({
                message: "Product ID and quantity are required"
            });
        }

        if (quantity <= 0) {
            return res.status(400).send({
                message: "Quantity must be greater than 0"
            });
        }

        let result = await inventoryController.AddStock(product, quantity);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
});

// Remove stock
router.post('/remove-stock', async function (req, res, next) {
    try {
        let { product, quantity } = req.body;
        
        if (!product || !quantity) {
            return res.status(400).send({
                message: "Product ID and quantity are required"
            });
        }

        if (quantity <= 0) {
            return res.status(400).send({
                message: "Quantity must be greater than 0"
            });
        }

        let result = await inventoryController.RemoveStock(product, quantity);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
});

// Reserve stock
router.post('/reservation', async function (req, res, next) {
    try {
        let { product, quantity } = req.body;
        
        if (!product || !quantity) {
            return res.status(400).send({
                message: "Product ID and quantity are required"
            });
        }

        if (quantity <= 0) {
            return res.status(400).send({
                message: "Quantity must be greater than 0"
            });
        }

        let result = await inventoryController.ReserveStock(product, quantity);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
});

// Sold stock
router.post('/sold', async function (req, res, next) {
    try {
        let { product, quantity } = req.body;
        
        if (!product || !quantity) {
            return res.status(400).send({
                message: "Product ID and quantity are required"
            });
        }

        if (quantity <= 0) {
            return res.status(400).send({
                message: "Quantity must be greater than 0"
            });
        }

        let result = await inventoryController.SoldStock(product, quantity);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
});

module.exports = router;
