const router = require('express').Router();
const Mta = require('mta-gtfs');
const mta = new Mta({
  key: 'R3mKf9CSXg6LrjjJ79n4H57EjY1apVGl8MiyhRvY' // optional, default = 1
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

router.post('/schedule', async (req, res, next) => {
    try {
        console.log(req.body)
        const schedule = await mta.schedule(req.body.stops);
        console.log(schedule)
        res.send(schedule)
    } catch(err) {
        next(err)
    }
})


module.exports = router