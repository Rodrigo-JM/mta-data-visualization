const router = require('express').Router();
const Mta = require('mta-gtfs');
const mta = new Mta({
  key: 'R3mKf9CSXg6LrjjJ79n4H57EjY1apVGl8MiyhRvY', // only needed for mta.schedule() method
  feed_id: 1                  // optional, default = 1
});

router.get('/status/:category', async (req, res, next) => {
    try {
        const result = await mta.status(req.params.category)
        res.send(result)
    } catch(err) {
        next(err)
    }
})

router.get('/stops', async (req, res, next) => {
    try {
        const stops = await mta.stop()
        res.send(stops)
    } catch(err) {
        next(err)
    }
})


module.exports = router