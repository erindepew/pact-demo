import Pact from 'pact-lang-api';

const KP = Pact.crypto.genKeyPair();
const API_HOST = "http://localhost:9001";

export const fundProject = (account, amount) => {
    //check that user already has an account
    // if they don't, create one
    // check that the date hasn't passed yet 
    // pay from user account to crowdfunding wallet
    const cmdObj = {
        pactCode: `(crowdfund-payments.pay ${JSON.stringify(account)} ${JSON.stringify(amount)})`,
        keyPairs: KP
      };
    Pact.send(cmdObj, API_HOST);
  }

export const refundProject = () => {
    // check that date has passed and amount hasn't been reached yet 
    // loop through all the accounts and refund them paid amount 
    const cmdObj = {
        pactCode: `(crowdfund-payments.pay)`,
        keyPairs: KP
      };
    Pact.send(cmdObj, API_HOST);  
}

export const payoutProject = () => {
    // check that amount has been reached and date for project has passed 
    // pay to project creator's account from crowdfund wallet 
    const cmdObj = {
        pactCode: `(crowdfund-payments.pay)`,
        keyPairs: KP
      };
    Pact.send(cmdObj, API_HOST);    
}