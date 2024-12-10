const libcardano = require('libcardano');
const fs = require('fs');
function createRange(start, end) {
  return Array.from({ length: end - start }, (_, i) => start + i);
}
NETWORK_ID=1

async function genWallet() {
  // create workshops first

  const wallet = await libcardano.HdWallet.fromMnemonicString(
    'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon art'
  );
  const getAccount = async (index) => {
    const nthWallet = await wallet.getAccount(index);
    let singleAddress = await nthWallet.singleAddressWallet();
    walletJson = singleAddress.toJSON();
    walletJson.address = singleAddress.addressBech32(NETWORK_ID);
    walletJson.stakeAddress = singleAddress.rewardAddressBech32(NETWORK_ID);
    return walletJson;
  };
  // make first 3 wallets for manual testing
  const organizerWallet = await Promise.all([0].map(getAccount));
  const delegateWAllet = await Promise.all([1].map(getAccount));
  const alternateWallet = await Promise.all([2].map(getAccount));

  // other walelts for automated testing
  // 10 organizers
  const automatedOrganizers = await Promise.all(
    createRange(3, 13).map(getAccount)
  );
  // 63 delegates
  const automatedDelegates = await Promise.all(
    createRange(13, 13 + 63).map(getAccount)
  );
  // 63 alternates
  const automatedAlternates = await Promise.all(
    createRange(13 + 63, 13 + 63 + 63).map(getAccount)
  );
  const mockData = {
    organizers: automatedOrganizers,
    delegates: automatedDelegates,
    alternates: automatedAlternates,
  };
  fs.writeFileSync('mockData.json', JSON.stringify(mockData, undefined, 2));
  console.log(mockData);
}
genWallet();
