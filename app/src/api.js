import Pact from 'pact-lang-api';

const AliceKeyPair =
  { publicKey: "ad1681e88ea4792e84458973e3dd4206da2b2a35e534b628c576d92735a7addc"
  , secretKey: "3e34c1116de97145503e7278308388807085a1027398c8efcc700f3649ee67b0" };
const GrumpyCatKeyPair =
  { publicKey: "ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d"
  , secretKey: "8693e641ae2bbe9ea802c736f42027b03f86afe63cae315e7169c9c496c17332" };

const MODULE_NAME = 'uber-4-cats-crowdfund'
const API_HOST = "http://localhost:9001";

export const fund = (account, amount) => {
    const cmdObj = {
        pactCode: `(${MODULE_NAME}.fund ${JSON.stringify(account)} ${amount})`,
        keyPairs: AliceKeyPair
      };
    return Pact.fetch.send(cmdObj, API_HOST);
  }

export const refund = (keyset, account) => {
    const cmdObj = {
        pactCode: `(${MODULE_NAME}.refund ${JSON.stringify(keyset)} ${JSON.stringify(account)}`,
        keyPairs: AliceKeyPair
      };
    Pact.fetch.send(cmdObj, API_HOST);
}

export const payoutProject = (keyset) => {
    const cmdObj = {
        pactCode: `(${MODULE_NAME}.finalize-fund ${JSON.stringify(keyset)})`,
        keyPairs: GrumpyCatKeyPair
      };
    Pact.fetch.send(cmdObj, API_HOST);
}

export const listen = (requestKey) => Pact.fetch.listen({ listen: requestKey}, API_HOST);
