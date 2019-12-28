const Slim = require('../../dist/slim.class');

const router = Slim.createRouter();

router
    .get('/', async (_req, res) => {

        try {
            res.cookie('token', '123456')
            res.json([
                { name: 'User 1' },
                { name: 'User 2' },
                { name: 'User 3' },
            ]);
        } catch (e) {
            console.error(e)
        }
        
    });

module.exports = router;
