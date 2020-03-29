var GtfsRealtimeBindings = require('gtfs-realtime-bindings');
var request = require('request');

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

router.post('/schedule/', async (req, res, next) => {
    try {
        
        let feedFiltered;
        var requestSettings = {
                method: 'GET',
                url: req.body.url,
                encoding: null,
                headers: {'x-api-key': 'R3mKf9CSXg6LrjjJ79n4H57EjY1apVGl8MiyhRvY'}
            }
          
        feedFiltered = request(requestSettings, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            let feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(body)
            console.log(feed)
            res.send(feed)
        }})
    } catch(err) {
        next(err)
    }
})


module.exports = router