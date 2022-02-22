const Example = artifacts.require("Example");

/*
 * Learn more about testing in JS:
 * @see https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("Example", function (accounts) {
  let owner, instance;

  before(async function () {
    owner = accounts[0];

    await Example.deployed()
      .then(contract => { instance = contract });
  });

  it("Example was deployed", async function () {
    return expect(instance).to.be.a('object', 'Is there a migration file for this contract? (e.g. ./migrations/2_deploy_example.js)');
  });

  it("Example owner is correct", async function () {
    await instance.owner().then(address => {
      return assert.isTrue(address == owner, 'Owner and deployer address mismatch');
    });
  });

  it("Example secrect number is correct", async function () {
    await instance.guess(666).then(result => {
      return assert.isTrue(result, '666 is not the secret number');
    });
  });

  it("Example new secret number", async function () {
    const oldSecret = 666;
    const newSecret = 777;
    const { logs } = await instance.setNewSecretNumber(newSecret, { from: owner });
    const log = logs[0];
    assert.equal(log.event, "NewSecretNumber");
    assert.equal(log.args.old.toString(), oldSecret);

    await instance.guess(newSecret).then(result => {
      return assert.isTrue(result, '777 is not the secret number');
    });
  });
});
