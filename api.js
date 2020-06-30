var GtfsRealtimeBindings = require("gtfs-realtime-bindings");
var request = require("request");
const requestPromise = require("request-promise");
const { db, Route } = require("./db/db");
const Sequelize = require("sequelize");
const router = require("express").Router();
const Mta = require("mta-gtfs");
const mta = new Mta({
  key: "MAxPzQSbSOatYtDKcRUpS68yHqRS4GcY9JyhPcoK", // optional, default = 1
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
        if (trip && (trip.departure || trip.arrival)) {
          let actualTime;

          if (!trip.departure) {
            actualTime = parseInt(trip.arrival.time.low);
          } else {
            actualTime = parseInt(trip.departure.time.low);
          }

          accum.push(actualTime);
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

router.get('/display', async (req, res, next) => {
  try {
    const routes = await Routes.findAll();
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
      .filter((line) => !line.path.includes(null) && line.path.length);

    res.send(allLines);
  } catch (err) {
    next(err);
  }
});

router.get('/schedule/', async (req, res, next) => {
  // this endpoint gets all stops, then we get all lines and we combine them make our Route model
  try {
    let routes = [];
    let route;
    const stops = await mta.stop();

    const linesUrl = [
      "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace", //A C E
      "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-bdfm", // B D F M
      "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-g", // G
      "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-jz", // J Z
      "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-nqrw", // N Q R W
      "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-l", // L
      "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs", //  1 2 3 4 5 6
      "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-7", //7
    ];

    const linesRelationToUrlArr = [
      "a_c_e",
      "b_d_f_m",
      "g",
      "j_z",
      "n_q_r_w",
      "l",
      "1_2_3_4_5_6",
      "7",
    ];

    const allRequests = await new Promise((resolve, reject) => {
      linesUrl.forEach(async (routeUrl, index) => {
        let lineJson = {
          name: linesRelationToUrlArr[index],
          line: [],
        }; //here we initialize the lineJson to later write it to the database
        var requestSettings = {
          method: 'GET',
          url: routeUrl,
          encoding: null,
          headers: { "x-api-key": "MAxPzQSbSOatYtDKcRUpS68yHqRS4GcY9JyhPcoK" },
        };

        await requestPromise(requestSettings, async function (
          error,
          response,
          body
        ) {
          const waitForPromise = await new Promise(async (resolve, reject) => {
            if (!error && response.statusCode == 200) {
              let feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
                body
              );
              feed.entity.map((trip) => {
                //after we get the feed, we need to map over it, conditionally find entities that have the data that we want(stops and timestamps)
                if (trip.tripUpdate) {
                  if (trip.tripUpdate.stopTimeUpdate !== undefined) {
                    lineJson.line = [
                      ...lineJson.line,
                      formatForMap(trip, stops),
                    ];
                  }
                }
              });
              route = { ...lineJson };
            }
            if (route) {
              resolve();
            } else if (error) {
              console.log(error);
            }
          });
        });
        routes = [...routes, route];
        if (routes.length === 8) {
          resolve();
        }
      });
    });
    // console.log(routes);
    routes.forEach(async (route) => {
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
