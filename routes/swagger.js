var express = require('express');
var router = express.Router();
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('../docs/swagger.json');

/* GET home page. */
router.use('/', swaggerUI.serve);
router.get('/', swaggerUI.setup(swaggerDocument, {
    swaggerOptions: {defaultModelsExpandDepth: -1}, // Hide schema section
}));

module.exports = router;
