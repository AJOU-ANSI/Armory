const
  path = require('path'),
  fs = require('fs'),
  express = require('express'),
  router = express.Router({mergeParams: true}),
  authMws = require('../middlewares/auth'),
  problemMws = require('../middlewares/problem'),
  contestMws = require('../middlewares/contest'),
  multer = require('multer'),
  unzip = require('extract-zip'),
  rimraf = require('rimraf'),
  ncp = require('ncp').ncp,
  glob = require('glob'),
  mkdirp = require('mkdirp'),
  request = require('request-promise-native');



const filePath = path.join(__dirname, '../../');
mkdirp(path.resolve(filePath, 'temp'));

const upload = multer({dest: path.resolve(filePath, 'temp')});

module.exports = (app) => {
  app.use('/api/:contestName/problems', router);
};

router.get('/',
  authMws.checkLoggedInMw,
  contestMws.selectContestByNameParamMw,
  contestMws.checkContestOpenedOrAdminMw,
  problemMws.selectProblemListByContestMw,
  problemMws.sendProblemListMw
);

let rankServer = 'http://localhost:8080';
if (process.env.NODE_ENV === 'production') {
  rankServer = 'http://rank1:8080';
}

const statusUrl = '/api/problemStatuses';

router.get('/myStatus',
  authMws.checkLoggedInMw,
  async function (req, res) {
    const {user} = req;

    if (process.env.NODE_ENV === 'development') {
      return res.send({
        result:
          {"problemStatuses":
            [
              {"problemId":3,"accepted":false,"wrong":true},
              {"problemId":4,"accepted":false,"wrong":false},
              {"problemId":5,"accepted":false,"wrong":false},
              {"problemId":6,"accepted":false,"wrong":false},
              {"problemId":1,"accepted":true,"wrong":false},
              {"problemId":2,"accepted":false,"wrong":false},
            ]
          }
      })
    }

    try {
      const ret = await request({
        uri: `${rankServer}${statusUrl}/${user.id}`,
        json: true,
      });

      return res.send({
        result: {problemStatuses: ret}
      });
    }
    catch (err) {
      console.log(err);
      return res.status(400).send({});
    }
  }
);

router.get('/:problemCode',
  authMws.checkLoggedInMw,
  contestMws.selectContestByNameParamMw,
  contestMws.checkContestOpenedOrAdminMw,
  problemMws.selectProblemByContestAndProblemCodeParamMw,
  problemMws.sendProblemMw
);

router.get('/:problemCode/data',
  authMws.checkAdminMw,
  contestMws.selectContestByNameParamMw,
  problemMws.selectProblemByContestAndProblemCodeParamMw,
  (req, res, next) => {
    const {problem} = req;
    const dataPath = path.resolve(filePath, 'data', problem.id+'');
    let problemData = null;

    if (fs.existsSync(dataPath)) {
      const dataFiles = glob.sync(path.resolve(dataPath, '*'));

      problemData = dataFiles.map(dataFile => path.basename(dataFile));
    }

    req.problem_data = problemData;

    next();
  },
  problemMws.sendProblemDataMw
);

router.post('/:problemCode/data',
  authMws.checkAdminMw,
  contestMws.selectContestByNameParamMw,
  problemMws.selectProblemByContestAndProblemCodeParamMw,
  upload.single('data'),
  (req, res) => {
    const {file, problem} = req;

    const dataPath = path.resolve(filePath, 'data', problem.id+'');

    rimraf.sync(dataPath);
    mkdirp.sync(dataPath);

    function getDirectories (srcpath) {
      return fs.readdirSync(srcpath)
        .filter(file => fs.lstatSync(path.join(srcpath, file)).isDirectory())
    }

    unzip(file.path, {dir: dataPath}, function (err) {
      if (err) {
        throw err;
      }

      const unzippedDir = getDirectories(dataPath)[0];

      if (unzippedDir) {
        const unzippedPath = path.resolve(dataPath, getDirectories(dataPath)[0]);

        ncp(unzippedPath, dataPath, function (err) {
          if (err) {
            throw err;
          }

          rimraf.sync(unzippedPath);
          rimraf.sync(file.path);

          res.send({message: 'ok'});
        });
      }
      else {
        rimraf.sync(file.path);

        res.send({message: 'ok'});
      }

    });
  }
);

router.post('/',
  authMws.checkAdminMw,
  contestMws.selectContestByNameParamMw,
  problemMws.saveProblemFromBodyWithContestMw,
  problemMws.sendProblemMw
);

router.put('/:problemId',
  authMws.checkAdminMw,
  contestMws.selectContestByNameParamMw,
  problemMws.updateProblemFromBodyWithContestMw,
  problemMws.sendProblemMw
);
