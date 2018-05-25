const
  request = require('supertest'),
  db = require('../../app/models');

describe('admins', function () {
  beforeEach(global.setup);
  afterEach(global.teardown);

  let agent;

  beforeEach(function () {
    agent = request.agent(require('../../app'));
  });

  context('when super admin creates admin user,', function() {
    let contestInfo, contest;

    beforeEach(async function() {
      contestInfo = {
        name: 'newContest01',
        start: '2018-05-24T09:00:00+09:00',
        end: '2018-05-24T14:00:00+09:00'
      };

      const resp = await agent.post(global.urls.contest)
        .set('Authorization', `Bearer ${global.config.superAdminToken}`)
        .send(contestInfo)
        .expect(200);

      contest = resp.body.result.contest;
    });

    it('should return unauthorized error if valid token is not given.', async function () {
      const
        strId = 'admin01',
        password = 'q1w2e3r4!';

      await agent.post(global.urls.user(contestInfo.name)+'/admin')
        .send({strId, password})
        .expect(401);
    });


    it('should create admin user if valid params are given.', async function() {
      const
        strId = 'admin01',
        password = 'q1w2e3r4!';

      const resp = await agent.post(global.urls.user(contestInfo.name)+'/admin')
        .set('Authorization', `Bearer ${global.config.superAdminToken}`)
        .send({strId, password})
        .expect(200);

      const {body: {result: {user: adminUser}}} = resp;

      expect(adminUser).to.deep.match({
        strId, isAdmin: true
      });

      const findAdminuser = await db.User.findOne({where: {strId: strId, ContestId: contest.id}});
      expect(findAdminuser.validatePassword(password)).to.be.true;

      const adminContest = await findAdminuser.getContest();
      expect(adminContest.dataValues).to.deep.match({
        name: contestInfo.name
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
    });
  });
});

