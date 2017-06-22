const
  path = require('path'),
  request = require('supertest'),
  fs = require('fs'),
  db = require('../../app/models');

describe.only('User controller', function () {
  beforeEach(global.setup);
  afterEach(global.teardown);

  let agent;

  beforeEach(function () {
    agent = request.agent(require('../../app'));
  });

  context('when admin sends csv file for updating users,', function () {
    let adminInfo, contestInfo;

    beforeEach(async function () {
      adminInfo = Object.assign({}, global.defaultAdminInfo);
      contestInfo = Object.assign({}, global.defaultContestInfo);

      await global.prepareUserAndContest(agent, contestInfo, adminInfo);
      await global.loginHelper(agent, {
        userId: adminInfo.strId,
        userPwd: adminInfo.password,
        contestName: contestInfo.name
      });
    });

    it('should save users in db in csv file.', async function () {
      const filePath = path.join(__dirname, './users.csv');

      const resp = await agent.post(global.urls.user(contestInfo.name))
        .attach('user_file', filePath)
        .expect(200);

      const {result: {user_list: userList}} = resp.body;

      const fileContent = fs.readFileSync(filePath).toString().split(/\r/);

      expect(userList).to.have.length(fileContent.length-1);

      for (let i = 0; i < userList.length ;i++) {
        const user = userList[i];

        const properties = fileContent[i+1].split(',');

        expect(user).to.deep.match({
          strId: properties[0],
          groupName: properties[2],
          name: properties[3]
        })
      }
    });

    context('if admin upload csv file to update users twice,', function () {
      let filePath, filePath2;

      beforeEach(async function() {
        filePath = path.join(__dirname, './users.csv');
        filePath2 = path.join(__dirname, './users2.csv');

        await agent.post(global.urls.user(contestInfo.name))
          .attach('user_file', filePath)
          .expect(200);

        await agent.post(global.urls.user(contestInfo.name))
          .attach('user_file', filePath2)
          .expect(200);
      });

      it('should return user list if admin requests them.', async function () {
        const fileContent = fs.readFileSync(filePath).toString().split(/\r|\n/).filter(a => a !== '');
        const fileContent2 = fs.readFileSync(filePath2).toString().split(/\r|\n/).filter(a => a !== '');

        const resp = await agent.get(global.urls.user(contestInfo.name))
          .expect(200);

        const {result: {user_list: userList}} = resp.body;
        expect(userList).to.have.length(fileContent.length + fileContent2.length -2);

      });
    })

    context('if admin upload csv file to update users twice with overlapped user test05, test04,', function () {
      let filePath, filePath2;

      beforeEach(async function() {
        filePath = path.join(__dirname, './users.csv');
        filePath2 = path.join(__dirname, './users3.csv');

        await agent.post(global.urls.user(contestInfo.name))
          .attach('user_file', filePath)
          .expect(200);

        await agent.post(global.urls.user(contestInfo.name))
          .attach('user_file', filePath2)
          .expect(500);
      });

      it('should return user list if admin requests them.', async function () {
        const fileContent = fs.readFileSync(filePath).toString().split(/\r|\n/).filter(a => a !== '');
        const fileContent2 = fs.readFileSync(filePath2).toString().split(/\r|\n/).filter(a => a !== '');

        const resp = await agent.get(global.urls.user(contestInfo.name))
          .expect(200);

        const {result: {user_list: userList}} = resp.body;
        expect(userList).to.have.length(fileContent.length + fileContent2.length - 4);

      });
    })
  });
});
