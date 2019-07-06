import Pact from 'pact-lang-api';

const KP = Pact.crypto.genKeyPair();
const API_HOST = "http://localhost:9001";

export const fundProject = (account, amount) => {
    const cmdObj = {
        pactCode: `(crowdfund-payments.new-payment ${JSON.stringify(account)} ${JSON.stringify(amount)})`,
        keyPairs: KP
      };
    Pact.send(cmdObj, API_HOST);
  }

export const refundProject = () => {
    const cmdObj = {
        pactCode: `(crowdfund-payments.refund)`,
        keyPairs: KP
      };
    Pact.send(cmdObj, API_HOST);  
}

export const payoutProject = () => {
    const cmdObj = {
        pactCode: `(crowdfund-payments.payout)`,
        keyPairs: KP
      };
    Pact.send(cmdObj, API_HOST);    
}