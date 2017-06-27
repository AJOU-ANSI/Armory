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
  mkdirp = require('mkdirp');

const filePath = path.join(__dirname, '../../');
const upload = multer({dest: path.resolve(filePath, 'temp')});

mkdirp(path.resolve(filePath, 'temp');

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
      const unzippedPath = path.resolve(dataPath, getDirectories(dataPath)[0]);

      if (err) {
        throw err;
      }

      ncp(unzippedPath, dataPath, function (err) {
        if (err) {
          throw err;
        }

        rimraf.sync(unzippedPath);
        rimraf.sync(file.path);

        res.send({message: 'ok'});
      });
    });
  }
);

router.post('/',
  authMws.checkAdminMw,
  contestMws.selectContestByNameParamMw,
  problemMws.saveProblemFromBodyWithContestMw,
  problemMws.sendProblemMw
);
