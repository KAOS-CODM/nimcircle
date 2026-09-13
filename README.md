# NimCircle

> **Shared savings goals powered by NIM.**

NimCircle is a Nimiq Pay Mini App for creating and managing shared savings goals with NIM.

A creator sets a goal, target amount, deadline, and recipient wallet. The Circle can then be shared with other people, who contribute NIM through Nimiq Pay. NimCircle verifies the resulting blockchain transactions before counting them toward the Circle's progress.

Instead of coordinating shared savings through group chats, spreadsheets, screenshots, or manual calculations, NimCircle gives everyone a single Circle with a clear target, contribution history, deadline, status, and verifiable on-chain activity.

**Built for the Nimiq Mini Apps Competition · Cycle II**

---

## Table of Contents

* [What is NimCircle?](#what-is-nimcircle)
* [The Problem](#the-problem)
* [The Solution](#the-solution)
* [How It Works](#how-it-works)
* [Core Features](#core-features)
* [Localization](#localization)
* [Nimiq Integration](#nimiq-integration)
* [Transaction Flow](#transaction-flow)
* [Circle Lifecycle](#circle-lifecycle)
* [Network Configuration](#network-configuration)
* [Architecture](#architecture)
* [Data Model](#data-model)
* [Security and Reliability](#security-and-reliability)
* [Mobile-First Experience](#mobile-first-experience)
* [Technology Stack](#technology-stack)
* [Project Structure](#project-structure)
* [Getting Started](#getting-started)
* [Environment Variables](#environment-variables)
* [Testing with Nimiq Testnet](#testing-with-nimiq-testnet)
* [Deployment](#deployment)
* [Development Status](#development-status)
* [Competition Context](#competition-context)
* [Roadmap](#roadmap)
* [License](#license)

---

# What is NimCircle?

NimCircle is a shared savings and goal-tracking application built around NIM.

A **Circle** represents a shared financial goal. A creator defines what the group is saving for, sets a target amount and deadline, and specifies the wallet that should receive the contributions.

Other participants can then find the Circle, open it, and contribute NIM.

Every contribution is associated with a Circle and a blockchain transaction hash. NimCircle's backend independently verifies the transaction before treating the contribution as confirmed.

The core flow is:

```text
Create a Circle
      ↓
Share the Circle ID
      ↓
Participants find the Circle
      ↓
Contribute NIM
      ↓
Transaction is verified
      ↓
Circle progress updates
      ↓
Goal is completed
```

NimCircle is designed specifically for the Nimiq Pay Mini App environment, allowing NIM-based group saving to happen directly inside a wallet experience.

---

# The Problem

Shared savings are often managed through informal systems:

* Group chats
* Spreadsheets
* Manual payment confirmations
* Screenshots of transactions
* Separate wallet addresses
* Manually calculated progress
* Unclear deadlines
* No central contribution history

These approaches can work for small groups, but they become increasingly difficult to manage as the number of contributors grows.

The real problem is not simply sending money.

It is:

> **Coordinating a shared financial goal while keeping everyone's contributions understandable and verifiable.**

---

# The Solution

NimCircle turns a shared financial goal into a structured Circle.

A Circle contains:

* Name
* Description
* Target amount
* Deadline
* Creator
* Goal owner
* Contribution history
* Contributor information
* Current status
* Calculated progress
* Remaining amount
* Contributor count

Participants interact with Nimiq Pay to send NIM, while the NimCircle backend independently verifies the resulting blockchain transaction.

This gives participants one place to answer:

> **What are we saving for, how much do we need, how much has been contributed, and how close are we?**

---

# How It Works

## 1. Connect a Nimiq wallet

NimCircle initializes the Nimiq Mini App SDK and connects to the Nimiq provider exposed by Nimiq Pay.

The application does not request or access private keys, seed phrases, or wallet secrets.

---

## 2. Create a Circle

The creator provides information such as:

* Circle name
* Description
* Target amount
* Deadline
* Goal owner
* Creator commitment

Amounts are represented internally in **Luna**, Nimiq's smallest unit.

NimCircle validates the Circle data before sending it to the backend.

---

## 3. Share the Circle

Every Circle has a unique Circle ID.

The creator can copy the Circle ID and share it with other participants.

A participant can enter the ID through NimCircle's **Find a Circle** flow to retrieve the Circle from the backend.

This avoids requiring contributors to manually search through existing Circles or know the creator's wallet address.

---

## 4. Contributors send NIM

A contributor chooses how much NIM to contribute.

NimCircle creates a transaction using the Nimiq provider and passes the request to Nimiq Pay's native transaction approval experience.

Each contribution includes a Circle-specific memo:

```text
NC1:<circleId>
```

This connects the blockchain transaction to the intended Circle.

---

## 5. NimCircle verifies the transaction

Receiving a transaction hash is not treated as sufficient proof of a contribution.

The backend verifies relevant transaction details including:

* Transaction hash
* Transaction inclusion
* Confirmation and execution state
* Recipient
* Amount
* Circle memo
* Contributor identity

Only after successful verification is the contribution marked as confirmed.

---

## 6. Circle progress updates

Confirmed contributions are aggregated for the Circle.

NimCircle calculates:

* Total amount raised
* Remaining amount
* Percentage progress
* Contributor count

When the confirmed contribution total reaches the target, the Circle can transition to:

```text
COMPLETED
```

---

# Core Features

## Shared savings Circles

Create a structured savings goal that multiple people can contribute toward.

## NIM contributions

Send native NIM directly through Nimiq Pay.

## On-chain contribution verification

The backend independently verifies blockchain transactions instead of trusting the frontend transaction response.

## Circle ID discovery

Creators can copy a Circle ID and share it with potential contributors.

Contributors can use the **Find a Circle** flow to open a specific Circle.

## Goal ownership

A Circle distinguishes between its creator and the wallet designated to receive the goal's contributions.

## Contribution history

Confirmed contributions are associated with their contributor, amount, Circle, and transaction hash.

## Progress tracking

Each Circle displays its current raised amount, remaining amount, progress percentage, and contributor count.

## Circle status management

Circles can be:

* Active
* Completed
* Expired
* Cancelled

## Deadline extension

Creators can extend the deadline of an active Circle when more time is needed to reach the target.

The backend ensures the new deadline is valid and later than the existing deadline.

Completed, cancelled, and expired Circles cannot be extended.

## Circle cancellation

Only the creator can cancel an active Circle.

Completed and already cancelled Circles cannot be changed back to another status.

## User profiles

Users have wallet-associated profiles containing:

* Username
* Display name
* Avatar
* Bio

## Personal Circle views

Users can view:

* Circles they created
* Circles they have joined

## Multi-language interface

NimCircle currently supports:

* English
* Spanish
* German
* French
* Portuguese

The interface uses a centralized translation system so user-facing UI strings can be localized consistently across screens, dialogs, forms, errors, and network guidance.

---

# Localization

NimCircle uses a centralized TypeScript localization system.

Translations are organized under:

```text
src/i18n/
├── languages/
│   ├── en.ts
│   ├── es.ts
│   ├── de.ts
│   ├── fr.ts
│   └── pt.ts
├── translationTypes.ts
├── translations.ts
├── LanguageContext.ts
├── LanguageProvider.tsx
└── useLanguage.ts
```

The English translation file acts as the translation schema, while the other languages are checked against that structure using TypeScript.

The application currently supports:

```text
English
Spanish
German
French
Portuguese
```

Localization covers the main application experience, including:

* Navigation
* Circle creation
* Circle views
* Profile screens
* Contribution flows
* Wallet states
* Errors
* Search and Circle ID discovery
* Network guidance
* Loading and success states

This allows the same application flow to remain consistent while presenting user-facing content in the selected language.

---

# Nimiq Integration

Nimiq is not simply an external payment button in NimCircle.

The application's contribution system is built around NIM transactions and the Nimiq Pay provider.

NimCircle uses:

```text
@nimiq/mini-app-sdk
```

Provider initialization is centralized through:

```ts
import { init } from '@nimiq/mini-app-sdk'

init({ timeout: 10_000 })
```

The provider is used for wallet access, consensus checks, and NIM transaction requests.

### Provider flow

```text
NimCircle
    ↓
Nimiq Mini App SDK
    ↓
Nimiq Pay Provider
    ↓
User approval
    ↓
NIM transaction
    ↓
Nimiq network
```

NimCircle never requests private keys or attempts to reproduce the wallet's signing process.

Nimiq Pay remains responsible for the sensitive wallet interaction and native transaction approval experience.

---

# Transaction Flow

The contribution lifecycle is intentionally separated into two stages:

1. **Transaction submission**
2. **Transaction verification**

```text
Contributor
     │
     │ selects amount
     ▼
NimCircle
     │
     │ sendBasicTransactionWithData()
     ▼
Nimiq Pay
     │
     │ native approval
     ▼
Nimiq Network
     │
     │ transaction hash
     ▼
NimCircle API
     │
     │ verify transaction
     ▼
Nimiq verification service
     │
     ├── transaction hash
     ├── inclusion
     ├── execution result
     ├── recipient
     ├── amount
     ├── memo
     └── contributor
     │
     ▼
Contribution confirmed
     │
     ▼
Circle progress updated
```

## Contribution memo

NimCircle uses the following memo format:

```text
NC1:<circleId>
```

For example:

```text
NC1:circle_1789120892693_hoemkemj
```

The memo provides a deterministic connection between the on-chain transaction and the Circle receiving the contribution.

---

# Circle Lifecycle

A Circle begins in the `active` state.

```text
                 ┌──────────────┐
                 │    ACTIVE    │
                 └──────┬───────┘
                        │
          ┌─────────────┼─────────────┐
          │             │             │
          ▼             ▼             ▼
      target met     deadline      creator
                     passed        cancels
          │             │             │
          ▼             ▼             ▼
      COMPLETED      EXPIRED      CANCELLED
```

## Active

The Circle is accepting contributions.

## Completed

The confirmed contribution total has reached the target.

## Expired

The deadline has passed before the target was reached.

## Cancelled

The creator manually cancelled the Circle.

## Deadline extension

An active Circle can have its deadline extended by its creator.

The backend enforces that:

* The Circle exists
* The requester is the creator
* The Circle is still active
* The new deadline is valid
* The new deadline is in the future
* The new deadline is later than the existing deadline

The server remains the authority for these checks.

---

# Network Configuration

NimCircle's backend determines which Nimiq network the application is configured to use.

The backend currently supports:

```text
TestAlbatross
MainAlbatross
```

The frontend receives the public network configuration through:

```text
GET /api/config
```

which returns:

```json
{
  "success": true,
  "network": "testnet"
}
```

or:

```json
{
  "success": true,
  "network": "mainnet"
}
```

The application does not pretend that the Mini App SDK can directly identify the user's Testnet/Mainnet selection. Instead, NimCircle communicates which network the application is currently configured for.

## Testnet user testing

During the current user-testing phase, NimCircle is configured for **Nimiq Testnet**.

Users who need to switch Nimiq Pay to Testnet can:

1. Open the Nimiq Pay menu.
2. Long-press **Settings** for about 10 seconds.
3. Open **Provider Settings**.
4. Change the network from **Default** to **Testnet**.
5. Leave the other provider settings unchanged.
6. Nimiq Pay reloads the Mini App automatically.

Free test NIM can be obtained through the Nimiq Testnet environment for testing purposes.

When NimCircle is configured for Mainnet, the same process can be used to change the network from **Default** to **Mainnet**.

The application displays contextual network guidance so users know which network NimCircle currently expects.

---

# Architecture

NimCircle uses a React frontend, an Express API, MongoDB, and Nimiq's transaction infrastructure.

```text
┌──────────────────────────────────────┐
│              Nimiq Pay               │
│                                      │
│  Wallet + Native transaction approval│
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│         React + TypeScript            │
│                                      │
│  App                                 │
│  Circle views                        │
│  Profile                             │
│  Contribution flow                   │
│  Wallet state                        │
│  Localization                        │
│  Network guidance                    │
└──────────────────┬───────────────────┘
                   │ HTTPS API
                   ▼
┌──────────────────────────────────────┐
│          Express + Node.js API       │
│                                      │
│  Users                               │
│  Circles                             │
│  Contributions                       │
│  Transaction verification            │
│  Circle lifecycle                    │
│  Network configuration                │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│          MongoDB + Mongoose          │
│                                      │
│  Users                               │
│  Circles                             │
│  Contributions                       │
└──────────────────────────────────────┘
```

The frontend does not determine whether a blockchain transaction should be considered valid.

The backend remains responsible for important business rules and contribution verification.

---

# Data Model

NimCircle currently uses three primary MongoDB models.

## User

A User represents a wallet-associated NimCircle profile.

Important fields include:

```text
walletAddress
username
displayName
avatar
bio
```

Wallet addresses and usernames are normalized and indexed for uniqueness.

---

## Circle

A Circle represents a shared savings goal.

Important fields include:

```text
circleId
name
description
targetAmount
deadline
creatorWallet
creatorUserId
recipientWallet
status
completedAt
cancelledAt
```

Amounts are stored as Luna rather than floating-point NIM values.

---

## Contribution

A Contribution represents a blockchain transaction associated with a Circle.

Important fields include:

```text
circleId
contributorWallet
contributorUserId
amount
transactionHash
status
confirmedAt
```

Transaction hashes are uniquely indexed to prevent the same blockchain transaction from being recorded multiple times.

---

# Security and Reliability

NimCircle follows a provider-first wallet model.

## No private key access

NimCircle never requests, stores, or attempts to access:

* Private keys
* Seed phrases
* Wallet secrets
* Nimiq Pay internal wallet state

---

## Native transaction approval

Transactions are requested through the Nimiq provider.

The application does not attempt to bypass or replace Nimiq Pay's native approval experience.

---

## Backend validation

Important Circle operations are validated server-side.

Examples include:

* Creator authorization
* Wallet ownership
* Target amount validation
* Deadline validation
* Circle status
* Duplicate transaction protection
* Contribution amount validation
* Recipient validation
* Transaction verification

---

## Transaction verification

A transaction hash returned by the provider is not automatically considered a confirmed contribution.

The verification layer checks the transaction against the expected Circle data before confirming the contribution.

---

## Duplicate transaction protection

Contribution transaction hashes are uniquely indexed.

This prevents the same blockchain transaction from being recorded as multiple contributions.

---

## Wallet normalization

Wallet addresses are normalized before comparison and storage to avoid inconsistencies caused by casing or formatting differences.

---

## Transaction failure handling

The contribution flow distinguishes between a transaction that was never submitted and a transaction that was submitted but could not yet be confirmed by the backend.

This prevents a user from being told that their payment failed simply because verification needs to be retried.

---

# Mobile-First Experience

NimCircle is designed primarily for use inside Nimiq Pay on mobile devices.

The interface uses:

* Touch-friendly controls
* Compact cards
* Large primary actions
* Readable text
* Mobile-sized forms
* Responsive layouts
* Clear transaction states
* Minimal navigation overhead

The application has been tested inside Nimiq Pay on a physical Android device.

The intended experience is not a desktop website pretending to be a wallet application. The primary interaction happens inside the Nimiq Pay Mini App environment.

---

# Technology Stack

## Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* `@nimiq/mini-app-sdk`

## Backend

* Node.js
* Express
* MongoDB
* Mongoose

## Blockchain / Wallet

* Nimiq
* Nimiq Pay
* Nimiq TestAlbatross for current testing

## Deployment

* Vercel for the frontend
* Render for the backend
* MongoDB for persistence

---

# Project Structure

The repository is organized around the frontend, backend, Nimiq integration, localization, and development tooling.

```text
nimcircle/
│
├── .agents/
│   └── skills/
│       └── mini-apps/
│
├── public/
│
├── server/
│   ├── models/
│   │   ├── User.js
│   │   ├── Circle.js
│   │   └── Contribution.js
│   │
│   ├── routes/
│   │   ├── circles.js
│   │   ├── users.js
│   │   ├── contributions.js
│   │   └── config.js
│   │
│   ├── services/
│   │   ├── circleService.js
│   │   ├── contributionService.js
│   │   └── nimiqVerification.js
│   │
│   ├── db.js
│   └── server.js
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── hooks/
│   │   └── useWallet.ts
│   │
│   ├── i18n/
│   │   ├── languages/
│   │   │   ├── en.ts
│   │   │   ├── es.ts
│   │   │   ├── de.ts
│   │   │   ├── fr.ts
│   │   │   └── pt.ts
│   │   ├── translationTypes.ts
│   │   ├── translations.ts
│   │   ├── LanguageContext.ts
│   │   ├── LanguageProvider.tsx
│   │   └── useLanguage.ts
│   │
│   ├── lib/
│   │   ├── api.ts
│   │   ├── nimiq.ts
│   │   ├── nimiqPayment.ts
│   │   └── apiErrors.ts
│   │
│   ├── views/
│   │   ├── CircleView.tsx
│   │   ├── CirclesView.tsx
│   │   ├── ConnectWalletView.tsx
│   │   ├── CreateCircleView.tsx
│   │   ├── ProfileView.tsx
│   │   └── WalletRestoringView.tsx
│   │
│   └── App.tsx
│
├── tailwind-workspace/
├── package.json
├── vite.config.ts
└── README.md
```

---

# Getting Started

## Requirements

Before running NimCircle locally, install:

* Node.js 20+
* npm
* MongoDB or a MongoDB connection string
* Nimiq Pay for mobile testing

The project was developed using Node.js `20.20.2`.

---

## Clone the repository

```bash
git clone https://github.com/KAOS-CODM/nimcircle.git

cd nimcircle
```

---

## Install dependencies

Install the frontend dependencies:

```bash
npm install
```

The backend has its own package configuration under:

```text
server/package.json
```

Install the backend dependencies according to that package configuration.

---

## Start the frontend

```bash
npm run dev
```

The Vite development server is configured for local-network access so the application can be opened from another device on the same network.

---

## Start the backend

From the server environment:

```bash
node server/server.js
```

The API exposes a health endpoint:

```text
/api/health
```

A healthy response contains:

```json
{
  "success": true,
  "service": "NimCircle API",
  "status": "healthy"
}
```

---

# Environment Variables

## Frontend

The frontend supports Vite environment variables.

Example:

```env
VITE_API_BASE_URL=https://nimcircle-api.onrender.com/api
VITE_NIMCIRCLE_URL=nimcircle.vercel.app
```

## Backend

The backend uses environment variables for configuration such as:

```env
PORT=3000
MONGODB_URI=<your-mongodb-connection-string>
NIMIQ_NETWORK=TestAlbatross
```

Supported network values include:

```text
TestAlbatross
MainAlbatross
```

Do not commit secrets, database credentials, private keys, or other sensitive configuration to the repository.

---

# Testing with Nimiq Testnet

NimCircle currently uses **Nimiq Testnet / TestAlbatross** for development and user testing.

Testnet allows the complete contribution flow to be exercised without requiring real-value Mainnet funds.

The following flow can be tested:

* Wallet connection
* Profile creation
* Circle creation
* Circle ID sharing
* Circle discovery
* NIM transaction approval
* Transaction submission
* Transaction verification
* Contribution recording
* Circle progress
* Circle completion
* Deadline management
* Circle cancellation
* Error handling

## Recommended test flow

1. Open NimCircle through Nimiq Pay.
2. Switch Nimiq Pay from **Default** to **Testnet** if necessary.
3. Obtain free test NIM.
4. Connect the wallet.
5. Create a profile.
6. Create a Circle.
7. Copy the Circle ID.
8. Open the Circle from another user or wallet.
9. Contribute NIM.
10. Approve the transaction in Nimiq Pay.
11. Wait for blockchain verification.
12. Confirm that the contribution appears in the Circle.
13. Confirm that the progress updates.
14. Test relevant Circle lifecycle actions.

---

# Deployment

## Frontend

The NimCircle frontend is deployed through Vercel.

Production frontend:

```text
https://nimcircle.vercel.app
```

The frontend is configured to work as a hosted Mini App and to support Circle-related navigation without relying on a traditional multi-page server.

When the connected GitHub repository receives a new deployment-triggering push, Vercel can build and deploy the updated frontend to the production URL.

---

## Backend

The API is deployed through Render.

Production API:

```text
https://nimcircle-api.onrender.com
```

The Render service runs:

```bash
node server/server.js
```

The production port is provided through the Render environment rather than relying on a hardcoded production port.

---

# Development Status

NimCircle's core application flow is implemented and has been exercised in the Nimiq Pay environment.

### Current core flow

```text
Connect wallet
      ↓
Create profile
      ↓
Create Circle
      ↓
Share Circle ID
      ↓
Find Circle
      ↓
Contribute NIM
      ↓
Verify blockchain transaction
      ↓
Update Circle progress
      ↓
Complete goal
```

### Current implementation areas

| Area                             | Status   |
| -------------------------------- | -------- |
| Nimiq Pay provider integration   | Complete |
| Wallet connection                | Complete |
| Wallet restoration/loading state | Complete |
| User profiles                    | Complete |
| Circle creation                  | Complete |
| Circle discovery by ID           | Complete |
| Circle progress tracking         | Complete |
| NIM contribution flow            | Complete |
| Transaction verification         | Complete |
| Duplicate transaction protection | Complete |
| Circle completion                | Complete |
| Circle expiration                | Complete |
| Circle cancellation              | Complete |
| Deadline extension               | Complete |
| Multi-language localization      | Complete |
| Testnet network configuration    | Complete |
| Network switching guidance       | Complete |
| NimCircle branding/app icon      | Complete |
| Vercel frontend deployment       | Complete |
| Render backend deployment        | Complete |

The remaining work is primarily **final QA, production verification, documentation, and competition submission preparation**.

---

# Competition Context

NimCircle was built for the:

**Nimiq Mini Apps Competition · Cycle II**

The project focuses on a practical use of a wallet-integrated Mini App: coordinating a shared financial goal.

Rather than using the Nimiq provider only as a demonstration, NimCircle makes NIM transactions part of the application's core business logic.

The blockchain transaction is connected directly to the Circle data model:

```text
NIM transaction
      ↓
Circle memo
      ↓
Transaction verification
      ↓
Contribution
      ↓
Circle progress
      ↓
Goal completion
```

This means Nimiq is part of the actual product workflow rather than an isolated wallet-connect feature.

---

# Development Philosophy

NimCircle follows several core principles.

## The blockchain transaction is the source of truth for contributions

The frontend does not simply mark a contribution as successful because a button was clicked.

A contribution becomes confirmed only after transaction verification.

---

## The backend owns business rules

Important authorization, validation, contribution, and Circle lifecycle rules are enforced server-side.

---

## The wallet owns signing

NimCircle never attempts to become the wallet.

Nimiq Pay handles sensitive wallet interaction and transaction approval.

---

## Keep the user flow simple

The user should not need to understand the underlying verification machinery.

From the user's perspective:

```text
Choose Circle
      ↓
Choose amount
      ↓
Approve NIM transaction
      ↓
Contribution confirmed
```

The complexity stays underneath the hood.

---

# Roadmap

The current competition build focuses on making the core NIM-powered shared-goal experience reliable and easy to use.

Potential future improvements include:

* Richer Circle activity history
* Contributor notifications
* Additional sharing options
* More advanced Circle discovery
* More detailed contribution analytics
* Additional Nimiq asset support where appropriate
* Expanded social/group coordination features
* Production MainAlbatross rollout

These are intentionally secondary to the core Circle experience.

---

# License

NimCircle is released under the **MIT License**.

See the `LICENSE` file in the repository for the complete license text.

---

# Built with Nimiq

NimCircle is built around the Nimiq ecosystem and Nimiq Pay Mini App platform.

The goal is simple:

> **Make saving together with NIM feel as natural as saving together with people.**
