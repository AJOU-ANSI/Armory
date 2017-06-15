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

        expect(contest).not.to.be.null;

        expect(contest).to.have.property('name', contestName);
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
  });
});
