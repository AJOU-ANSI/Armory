const
  db = require('../../app/models'),
  request = require('supertest');

describe('With contest controller', function () {
  beforeEach(global.setup);
  afterEach(global.teardown);

  let agent, app;

  beforeEach(function () {
    app = require('../../app');
    agent = request.agent(app);
  });

  context('if contestList is given', function () {
    let contestListInfo, contestList;

    beforeEach(async function () {
      contestListInfo = [
        {name: 'shake17', start: getContestTime(-2, false), end: getContestTime(3, false)},
        {name: 'shake17prac', start: getContestTime(3, false), end: getContestTime(8, false)}
      ];

      contestList = await db.Contest.bulkCreate(contestListInfo);

      expect(contestList).to.have.length(contestListInfo.length);
    });

    context('when user requests contest list,', function () {
      it('should return contest list.', async function () {
        const resp = await agent
          .get(global.urls.contest)
          .expect(200);

        const {body: {result: {contest_list: newContestList}}} = resp;

        expect(newContestList.map(c => c.name)).to.be.containingAllOf(contestListInfo.map(c => c.name));
      });
    });

    context('when user requests contest with specific name,', function () {
      it('should return contest.', async function () {
        const contestName = contestListInfo[0].name;

        const resp = await agent
          .get(`${global.urls.contest}/byName/${contestName}`)
          .expect(200);

        const {body: {result: {contest}}} = resp;

        expect(contest).to.deep.match({name: contestName});
        expect(contest).not.to.have.property('password');
      });
    });

    context('when user requests contest with unregistered name,', function () {
      it('should return null.', async function () {
        const contestName = 'nosuchcontestname';

        const resp = await agent
          .get(`${global.urls.contest}/byName/${contestName}`)
          .expect(200);

        const {body: {result: {contest}}} = resp;

        expect(contest).to.be.null;
      });
    });

    context('when super admin user requests to create a contest with valid token', function () {
      it('should return 401 error if user does not add superAdminToken to header.', async function() {
        const contestName = 'newContestName';
        const start = '2018-05-23T09:00:00+09:00';
        const end ='2018-05-23T14:00:00+09:00';

        await agent
          .post(`${global.urls.contest}`)
          .send({
            name: contestName, start, end
          })
          .expect(401);
      });

      it('should return error if same name contest exists.', async function() {
        const contestName = 'newContestName';
        const start = '2018-05-23T09:00:00+09:00';
        const end ='2018-05-23T14:00:00+09:00';

        await agent
          .post(`${global.urls.contest}`)
          .set('Authorization', 'Bearer ' + global.config.superAdminToken)
          .send({
            name: contestName, start, end
          })
          .expect(200);

        await agent
          .post(`${global.urls.contest}`)
          .set('Authorization', 'Bearer ' + global.config.superAdminToken)
          .send({
            name: contestName, start, end
          })
          .expect(400);
      });

      it('should crete a contest and return it with 200 status.', async function() {
        const contestName = 'newContestName';
        const start = '2018-05-23T09:00:00+09:00';
        const end ='2018-05-23T14:00:00+09:00';

        const resp = await agent
          .post(`${global.urls.contest}`)
          .set('Authorization', 'Bearer ' + global.config.superAdminToken)
          .send({
            name: contestName, start, end
          })
          .expect(200);

        const {body: {result: {contest}}} = resp;
        expect(contest).to.deep.match({
          name: contestName,
          start: new Date(start).getTime(),
          end: new Date(end).getTime()});

        const findContest = await db.Contest.findOne({where: {name: contestName}});
        expect(findContest.dataValues).to.deep.match({
          name: contestName,
          start: new Date(start),
          end: new Date(end),
        })
      });
    })
  });
});
