# Pact Crowdfunding App Demo

Demo crowd funding project using smart contract language Pact

## Scripts

`npm run start:pact`: Start the Pact Server

`npm run pact:seed`: Seed the blockchain

`npm start`: Start the Web Application

## Starting the Project

1.  In one terminal, start the pact dev blockchain: `npm run start:pact`
2.  In another terminal, load the demo contracts to the pact dev blockchain: `npm run pact:seed`
3.  Then host the frontend: `<insert instructions>`
4.  `http://localhost:3000`

## Working with the Pact Dev Blockchain

When running pact-serve with persistence enabled the development server will automatically replay from disk when it starts.
In this demo, we are persisting to `log/` which causes pact-serve to create or use `log/commands.sqlite` to store Commands and CommandResults.

The first time you run pact-serve the SQLite DBs will be created empty (as no commands have been run yet).

The important thing to note is that until you delete `log/commands.sqlite` (or run pact-serve in memory) pact-serve will replay every command on start up.

If you think of it like a blockchain, deleting the `commands.sqlite` file or running in memory gives Pact a "fresh" chain to work with.
