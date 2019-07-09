import Pact from 'pact-lang-api';

const KP = Pact.crypto.genKeyPair();
const API_HOST = "http://localhost:9001";

export const fund = (account, amount) => {
    const cmdObj = {
        pactCode: `(crowdfund-payments.fund ${JSON.stringify(account)} ${JSON.stringify(amount)})`,
        keyPairs: KP
      };
    Pact.send(cmdObj, API_HOST);
  }

export const refund = (keyset, account) => {
    const cmdObj = {
        pactCode: `(crowdfund-payments.refund ${JSON.stringify(keyset)} ${JSON.stringify(account)}`,
        keyPairs: KP
      };
    Pact.send(cmdObj, API_HOST);
}

export const payoutProject = (keyset) => {
    const cmdObj = {
        pactCode: `(crowdfund-payments.finalize-fund ${JSON.stringify(keyset)})`,
        keyPairs: KP
      };
    Pact.send(cmdObj, API_HOST);
}
