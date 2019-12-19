const Slim = require('../../dist/slim.class');

const router = Slim.createRouter();

router
    .addRoutes('/user', require('./user'));

module.exports = router;
