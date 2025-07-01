const express = require('express');
const shipping = require('./shipping');
const inventory = require('./inventory');
const cors = require('cors');

const app = express();
app.use(cors());

/**
 * Retorna a lista de produtos da loja via InventoryService
 */
app.get('/products', (req, res, next) => {
    inventory.SearchAllProducts(null, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send({ error: 'something failed :(' });
        } else {
            res.json(data.products);
        }
    });
});

/**
 * Consulta o frete de envio no ShippingService
 */
app.get('/shipping/:cep', (req, res, next) => {
    shipping.GetShippingRate(
        {
            cep: req.params.cep,
        },
        (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).send({ error: 'something failed :(' });
            } else {
                res.json({
                    cep: req.params.cep,
                    value: data.value,
                });
            }
        }
    );
});
/**
 * Retorna os dados de um único produto pelo ID
 */
app.get('/product/:id', (req, res) => {
    const productId = parseInt(req.params.id);

    inventory.SearchAllProducts(null, (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ error: 'Erro ao buscar produtos.' });
        }

        const product = data.products.find(p => p.id === productId);
        if (!product) {
            return res.status(404).send({ error: 'Produto não encontrado.' });
        }

        res.json(product);
    });
});

/**
 * Inicia o router
 */
app.listen(3000, () => {
    console.log('Controller Service running on http://127.0.0.1:3000');
});
