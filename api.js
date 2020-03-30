var GtfsRealtimeBindings = require('gtfs-realtime-bindings');
const requestPromise = require('request-promise');
const { Route } = require('./db/db');
const router = require('express').Router();
const Mta = require('mta-gtfs');
const mta = new Mta({
  key: 'R3mKf9CSXg6LrjjJ79n4H57EjY1apVGl8MiyhRvY', // optional, default = 1
});

const formatForMap = (trip, stops) => {
  // this function takes our trip object extracted from the feed entity and turns it into a line object;
  return {
    vendor: trip.tripUpdate.trip.routeId,
    path: trip.tripUpdate.stopTimeUpdate.reduce((accum, trip) => {
      if (stops[trip.stopId] !== undefined) {
        const stopCoordinates = [
          parseFloat(stops[trip.stopId].stop_lon),
          parseFloat(stops[trip.stopId].stop_lat),
        ];
        accum.push(stopCoordinates);
      }

      return accum;
    }, []),
    timestamps: trip.tripUpdate.stopTimeUpdate.reduce(
      (accum, trip, index, arr) => {
        if (index + 1 < arr.length) {
          const actualTime = parseInt(trip.departure.time);
          const futureTime = parseInt(arr[index + 1].arrival.time);
          const difference =
            futureTime - actualTime > 0 ? futureTime - actualTime : 0;
          accum.push(difference * 10);
        }

        return accum;
      },
      []
    ),
  };
};

router.get('/status/:category', async (req, res, next) => {
  try {
    const result = await mta.status(req.params.category);
    res.send(result);
  } catch (err) {
    next(err);
  }
});

router.get('/stops', async (req, res, next) => {
  try {
    const stops = await mta.stop();
    res.send(stops);
  } catch (err) {
    next(err);
  }
});

router.get('/routes', async (req, res, next) => {
  try {
    const routes = await Route.findAll();
    const allLines = routes
      .reduce((accum, singleRoute) => {
        accum = [...accum, ...singleRoute.line];
        return accum;
      }, [])
      .filter(line => !line.path.includes(null) && line.path.length);

    res.send(allLines);
  } catch (err) {
    next(err);
  }
});

router.get('/schedule/', async (req, res, next) => {
  // this endpoint gets all stops, then we get all lines and we combine them make our Route model
  try {
    let routes = [];

    routes.forEach(async route => {
      try {
        const data = await Route.findAll();
        if (!data.length) {
          await Route.create(route);
        } else {
          await Route.update(route, {
            where: {
              name: route.name,
            },
          });
        }
      } catch (error) {
        console.log(error);
      }
    });
    res.send(routes);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
