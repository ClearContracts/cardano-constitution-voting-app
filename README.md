# cardano-constitution-voting-app

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Architecture](#architectures)
- [Running the app](#running-the-app)
- [Integrated Services](#integrated-services)
- [Putting Votes On-Chain](#putting-votes-on-chain)
- [Resources / Acknowledgements](#resources--acknowledgements)

## Introduction

This repo contains the code for the voting app to be used at the Cardano Constitutional Convention in Buenos Aires. The development of this app was conducted by the [Clear Contracts](https://www.clearcontracts.io/) team, which is the team behind [Clarity](https://www.clarity.vote/).

This project was organized and funded by [Intersect](https://www.intersectmbo.org/). End-to-end testing was conducted by [Dquadrant](https://dquadrant.com/).

The primary functionality of this app allows a convention organizer to create polls and the delegates/alternates to vote on the created polls. This process will happen iteratively until a constitution receives enough votes to pass the winning threshold.

Anybody will have the ability to visit the app and view the polls. When the polls conclude, everybody will be able to view the results. For these observers, no wallet is required. Only the convention organizers and delegates/alternates will be required to sign-in with a wallet.

This voting app will be hosted through the end of February, to provide ample time for viewing of the poll results. All vote records for the final constitution vote will be on-chain indefinitely.

## Features

- Convention Organizer can create polls, start voting on polls, end voting on polls, and delete polls
- Convention Organizer can select if the delegate or alternate from a given workshop is the active voter
- Convention Organizer can edit delegate and alternate information as needed
- Delegates/alternates can connect their wallet and vote on an active poll
- Everybody can see number of votes on a poll but cannot see vote results until poll is closed
- At conclusion of poll, Convention Organizer signs transactions to put vote data on-chain

## Architecture

- Developed using Next.js framework and Typescript
- Hosted on Vercel
- Styling done with MUI
- Data stored in PostgreSQL database hosted on GCP
- Prisma ORM used to interact with DB
- Sentry used for error tracking
- Logflare used for general logging
- Unit testing conducted with Vitest and React Testing Library
- E2E testing conducted with Playwright

## Running the app locally

1. Download or clone the repository
2. Get `.npmrc` file with your Auth Token, which can be requested via [CODEOWNERS](./CODEOWNERS).
3. `npm install`
4. Download [PostgreSQL](https://www.postgresql.org/) in your preferred method and initiate it (I personally use the [Postgress.app](https://postgresapp.com/downloads.html) method)
5. Create database in local PostgreSQL instance using [psql](https://www.postgresql.org/docs/current/app-psql.html), [pgAdmin](https://www.pgadmin.org/download/), or whatever your preferred method for interacting with a PostgreSQL database is
6. Adjust DATABASE_URL with your local PostgreSQL instance credentials. Additional info on Prisma connection URL can be [here](https://www.prisma.io/docs/orm/overview/databases/postgresql#connection-url)
7. Run `npx prisma migrate dev --skip-seed` to populate the database with the proper tables
8. Run `npx prisma generate` in root of repository to create TS client for Prisma
9. In the `prisma/seed.ts` file, adjust the seed data so that there is a user with the stake address that you will be connecting with
10. Run `npm run seed` to seed the database with testing data located in `prisma/seed.ts`
11. Run command `openssl rand -base64 32` in terminal and paste result to `NEXTAUTH_SECRET` environment variable
12. Set `NEXT_PUBLIC_NETWORK` to `testnet` or `mainnet` depending on the network of the wallet you are connecting
13. Run `npm run dev` in root of repository

## Integrated Services

This voting app relies on an additional server that is not open-source. This server is a part of the pre-existing Clarity infrastructure that was not included in the scope of this project.

This server is used to construct the transactions that the convention organizer will sign to post the vote data on-chain. The Voting App sends a request to this server, the server constructs the transactions, and the constructed transactions are sent to the convention organizer's wallet. Once the transactions are sent to the user's wallet, the involvement of this server is finished.

At this point, the convention organizer will verify the transactions and sign them to put the vote data on-chain.

## Putting Votes On-Chain

When a delegate or alternate votes on a poll, they will sign a message that contains the following information:

- Delegate's / alternate's stake address
- Hashed constitution text
- URL to constitution text
- Name of the poll
- How the delegate / alternate voted (yes, no, or abstain)
- Timestamp of when the vote was cast

This message and their signature will be saved to the voting app's database. At the conclusion of the final poll, the convention organizer will sign a number of transactions. Each transaction will contain the vote data for multiple delegate/alternate votes. Anybody will be able to refer to these on-chain transactions and verify the votes themselves.

These transactions will contain the information from the vote signatures plus the following information:

- Unique Challenge
- Delegate's / Alternate's Public Key
- Delegate's / Alternate's Vote Signature

Once all signature transactions are posted on-chain, a final transaction will be posted that includes the following information:

- Name of the Poll
- Constitution Text hash
- Approval Result %
- Yes vote count
- No vote count
- Abstain vote count
- Total eligible voter count
- List of Signature Transaction IDs

## Managing Database Migration

1. Ensure there are no pending migrations from open PRs to avoid potential conflicts
2. Make necessary changes to `schema.prisma` and necessary changes to the DB diagram
3. Run `npx prisma migrate dev`
4. Give the migration a name in the following format `remove_user_color_property`
5. Commit the new `schema.prisma` and generated `migration.sql` file
6. The migration will propogate through all environments as Vercel creates the preview and production builds

## License

This project is licensed under the **GNU Affero General Public License v3.0 or later (AGPL-3.0-or-later)**.

This means:

- You are free to view, use, modify, and distribute this software, but you must distribute your modifications under the same license.
- If you run this application as part of a networked service, you must provide the source code to users of that service.

For more details, see the [AGPL License](./AGPL_LICENSE.txt) file.

## Resources / Acknowledgements

- [Clear Contracts](https://www.clearcontracts.io/)
- [Clarity](https://www.clarity.vote/)
- [Intersect](https://www.intersectmbo.org/)
- [Dquandrant](https://dquadrant.com/)
