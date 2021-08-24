const AmazonPayDonation = artifacts.require("AmazonPayDonation");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("AmazonPayDonation", function (/* accounts */) {

  it("should assert true", async function () {
    await AmazonPayDonation.deployed();
    return assert.isTrue(true);
  });

  it("check if the string pass correctly", async () => {
    const instance = await AmazonPayDonation.deployed();
    const tx = await instance.saveDonation(['test', 'oroId', 100, 0])

    assert.equal(tx.logs[0].args.userId, 'test');
    assert.equal(tx.logs[0].args.oroId, 'oroId');
    assert.equal(tx.logs[0].args.amount, 100);

  })

});
