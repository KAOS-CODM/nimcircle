# NimCircle

> **Shared savings goals powered by NIM.**

NimCircle is a Nimiq Pay Mini App that lets people create shared savings goals, invite others to contribute NIM, and track progress toward a common target.

Instead of managing contributions manually across chats, spreadsheets, or separate wallets, NimCircle gives a group a single Circle with a defined goal, target amount, deadline, contributors, and verifiable on-chain contributions.

**Built for the Nimiq Mini Apps Competition · Cycle II**

---

## Table of Contents

* [What is NimCircle?](#what-is-nimcircle)
* [The Problem](#the-problem)
* [The Solution](#the-solution)
* [How It Works](#how-it-works)
* [Core Features](#core-features)
* [Nimiq Integration](#nimiq-integration)
* [Transaction Flow](#transaction-flow)
* [Circle Lifecycle](#circle-lifecycle)
* [Architecture](#architecture)
* [Data Model](#data-model)
* [Security and Reliability](#security-and-reliability)
* [Mobile-First Experience](#mobile-first-experience)
* [Technology Stack](#technology-stack)
* [Project Structure](#project-structure)
* [Getting Started](#getting-started)
* [Environment Variables](#environment-variables)
* [Testing with TestAlbatross](#testing-with-testalbatross)
* [Deployment](#deployment)
* [Pre-Ship Checklist](#pre-ship-checklist)
* [Competition Context](#competition-context)
* [Roadmap](#roadmap)
* [License](#license)

---

# What is NimCircle?

NimCircle is a shared savings and goal-tracking application built around NIM.

A Circle represents a shared financial goal. A creator defines the goal, sets a target amount and deadline, and specifies the wallet that should receive the contributions. Other participants can then contribute NIM toward that goal.

Every contribution is tied to a Circle and recorded with its transaction hash. NimCircle's backend verifies the transaction before treating the contribution as confirmed.

The result is a simple flow:

```text
Create a goal
      ↓
Share the Circle
      ↓
People contribute NIM
      ↓
Transactions are verified
      ↓
Circle progress updates
      ↓
Goal is completed
```

NimCircle is designed specifically for the Nimiq Pay Mini App environment, making NIM-based group saving accessible directly from a Nimiq wallet experience.

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
* No central record of who has contributed

These approaches work for very small groups, but they become increasingly difficult to manage as the number of contributors grows.

The core problem is not simply sending money.

It is **coordinating a shared financial goal and keeping everyone's contributions understandable and verifiable.**

---

# The Solution

NimCircle turns the shared goal into a structured Circle.

A Circle contains:

* A name
* A description
* A target amount
* A deadline
* A creator
* A goal owner
* A contribution history
* A current status
* A calculated progress amount
* A list of contributors

Contributors interact with Nimiq Pay to send NIM, while NimCircle's backend independently verifies the resulting transaction.

This gives participants a single place to answer:

> **What are we saving for, how much do we need, how much has been contributed, and how close are we?**

---

# How It Works

## 1. Connect a Nimiq wallet

NimCircle initializes the Nimiq Mini App SDK and connects to the Nimiq provider exposed by Nimiq Pay.

The application does not access private keys or wallet internals.

---

## 2. Create a Circle

The creator provides:

* Circle name
* Description
* Target amount
* Deadline
* Goal owner
* Creator commitment

The target amount is represented internally in **Luna**, Nimiq's smallest unit.

NimCircle validates the data before creating the Circle.

---

## 3. Share the Circle

Each Circle has a shareable deep link.

A shared link can open a specific Circle through Nimiq Pay:

```text
https://nimpay.app/miniapps/open/<nimcircle-app>/circle/<circleId>
```

This makes it possible to send a Circle directly to potential contributors.

---

## 4. Contributors send NIM

A contributor chooses how much NIM to contribute.

NimCircle creates a transaction using the Nimiq provider and presents the transaction through Nimiq Pay's native approval experience.

The transaction includes a Circle-specific memo:

```text
NC1:<circleId>
```

This links the on-chain transaction to the intended NimCircle Circle.

---

## 5. NimCircle verifies the transaction

Receiving a transaction hash is not treated as sufficient proof of a contribution.

The backend verifies the transaction and checks relevant details including:

* Transaction hash
* Transaction inclusion
* Confirmation/execution state
* Recipient
* Amount
* Circle memo
* Contributor identity

Only after successful verification is the contribution recorded as confirmed.

---

## 6. Circle progress updates

Confirmed contributions are aggregated for the Circle.

The application calculates:

* Total amount raised
* Remaining amount
* Percentage progress
* Contributor count

When the confirmed amount reaches the target, the Circle can transition to:

```text
COMPLETED
```

---

# Core Features

## Shared savings Circles

Create a structured goal that multiple people can contribute toward.

## NIM contributions

Contributors can send native NIM directly through Nimiq Pay.

## On-chain contribution verification

Contributions are independently checked by the backend instead of trusting the frontend transaction response.

## Goal ownership

A Circle can distinguish between its creator and the wallet designated as the goal owner.

## Contribution history

Confirmed contributions are associated with their contributor and transaction hash.

## Progress tracking

Each Circle displays its current raised amount, remaining amount, progress percentage, and contributor count.

## Circle status management

Circles can become:

* Active
* Completed
* Expired
* Cancelled

## Deadline extension

A creator can extend an active Circle's deadline when contributors need more time to reach the goal.

The new deadline must be later than the existing deadline.

Completed, cancelled, and expired Circles cannot be extended.

## Circle cancellation

Only the creator can cancel an active Circle.

Completed and already cancelled Circles cannot be changed back to another status.

## Deep-link sharing

A specific Circle can be shared using a Nimiq Pay Mini App deep link.

## User profiles

Users have wallet-associated profiles containing information such as:

* Username
* Display name
* Avatar
* Bio

## Personal Circle views

Users can see Circles they created and Circles they have joined.

---

# Nimiq Integration

Nimiq is not simply an external payment button in NimCircle.

The application's contribution system is built around NIM transactions and the Nimiq Pay provider.

NimCircle uses:

```text
@nimiq/mini-app-sdk
```

The application initializes the provider through:

```ts
init({ timeout: 10_000 })
```

The provider is then used for wallet access and NIM transaction requests.

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
```

NimCircle never requests private keys or attempts to reproduce the wallet's signing process.

The native Nimiq Pay approval experience remains responsible for transaction authorization.

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
     ├── hash
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
                     passed       cancels
          │             │             │
          ▼             ▼             ▼
     COMPLETED       EXPIRED       CANCELLED
```

## Active

The Circle is accepting contributions.

## Completed

The confirmed contribution total has reached or exceeded the target.

## Expired

The deadline has passed before the target was reached.

## Cancelled

The creator manually cancelled the Circle.

### Deadline extension

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
│          React + TypeScript           │
│                                      │
│  App                                  │
│  Circle views                         │
│  Profile                              │
│  Contribution flow                    │
│  Wallet state                         │
└──────────────────┬───────────────────┘
                   │ HTTPS API
                   ▼
┌──────────────────────────────────────┐
│         Express + Node.js API        │
│                                      │
│  Users                               │
│  Circles                             │
│  Contributions                       │
│  Transaction verification            │
│  Circle lifecycle                    │
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
goalOwnerWallet
goalOwnerUserId
creatorCommitment
status
completedAt
cancelledAt
```

Amounts are stored as Luna rather than floating-point NIM values.

---

## Contribution

A Contribution represents a transaction associated with a Circle.

Important fields include:

```text
circleId
contributorWallet
contributorUserId
recipientWallet
amount
transactionHash
memo
status
confirmedAt
```

Transaction hashes are uniquely indexed to prevent the same transaction from being recorded multiple times.

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

# Mobile-First Experience

NimCircle is intended to be used inside Nimiq Pay on mobile devices.

The interface is built around:

* Touch-friendly controls
* Compact cards
* Large primary actions
* Readable text
* Mobile-sized forms
* Responsive layouts
* Clear transaction states
* Minimal navigation overhead

The target environment is not a desktop browser pretending to be a wallet app.

The application is tested by opening the hosted Mini App through Nimiq Pay on a physical phone.

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
* TestAlbatross during development and testing

## Deployment

* Vercel for the frontend
* Render for the backend
* MongoDB for persistence

---

# Project Structure

The repository is organized around the frontend, backend, Nimiq integration, and development tooling.

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
│   │   └── index.js
│   │
│   ├── services/
│   │   ├── circleService.js
│   │   └── nimiqVerification.js
│   │
│   ├── db.js
│   ├── server.js
│   └── seed.js
│
├── src/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   │   ├── api.ts
│   │   ├── nimiq.ts
│   │   └── nimiqPayment.ts
│   │
│   ├── views/
│   │   ├── CircleView.tsx
│   │   ├── CirclesView.tsx
│   │   ├── CreateCircleView.tsx
│   │   └── ProfileView.tsx
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

```bash
npm install
```

The backend has its own package configuration under:

```text
server/package.json
```

Install backend dependencies according to that package configuration.

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

A healthy response is expected to contain:

```json
{
  "success": true,
  "service": "NimCircle API",
  "status": "healthy"
}
```

---

# Environment Variables

The frontend uses Vite environment variables.

Example:

```env
VITE_API_BASE_URL=https://nimcircle-api.onrender.com/api
VITE_NIMCIRCLE_URL=nimcircle.vercel.app
```

The backend uses environment variables for configuration such as:

```env
PORT=3000
MONGODB_URI=<your-mongodb-connection-string>
NIMIQ_NETWORK=TestAlbatross
```

Do not commit secrets or private credentials to the repository.

---

# Testing with TestAlbatross

NimCircle uses **TestAlbatross** during development and testing.

TestAlbatross allows the complete NIM transaction flow to be exercised without requiring real-value MainAlbatross funds.

This makes it possible to test:

* Wallet connection
* NIM transaction approval
* Transaction submission
* Transaction hashes
* Transaction verification
* Contribution recording
* Circle progress
* Circle completion
* Error handling

## Recommended test flow

1. Open NimCircle in Nimiq Pay.
2. Switch Nimiq Pay to the TestAlbatross network.
3. Obtain test NIM.
4. Connect the wallet.
5. Create a Circle.
6. Open the Circle.
7. Share the Circle link.
8. Use a contributor wallet to contribute NIM.
9. Approve the transaction in Nimiq Pay.
10. Wait for the transaction to be verified.
11. Confirm that the contribution appears in the Circle.
12. Confirm that the progress amount updates.
13. Test the relevant Circle lifecycle actions.

---

# Deployment

## Frontend

The NimCircle frontend is deployed through Vercel.

Production frontend:

```text
https://nimcircle.vercel.app
```

Vercel is configured to serve the React application correctly when a user opens a nested Circle route directly.

The project uses a rewrite so routes such as:

```text
/circle/<circleId>
```

can be loaded directly instead of returning a static-hosting 404.

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

Render provides the production port through its environment, so the application does not rely on a hardcoded production port.

---

# Pre-Ship Checklist

This checklist is based on the Nimiq Mini App development requirements used during the NimCircle build.

The status below reflects the current implementation and QA state.

---

## 1. Provider integration

### PASS: The app uses at least one provider method

NimCircle uses the Nimiq provider exposed through the Nimiq Mini App SDK.

The application uses provider functionality for:

* Account access
* Consensus checks
* NIM transactions

---

### PASS: `@nimiq/mini-app-sdk` is installed and `init()` is called

The project uses:

```ts
import { init } from '@nimiq/mini-app-sdk'
```

Provider initialization is centralized and uses a timeout:

```ts
init({ timeout: 10_000 })
```

---

### PASS: Provider initialization is wrapped in error handling

Wallet/provider initialization is handled through the application's wallet state and error handling.

Initialization failures are surfaced rather than silently leaving the application in an unusable state.

---

### PASS: The app shows a clear message when the provider is unavailable

NimCircle detects when the Nimiq provider is unavailable.

This is important because the Mini App is expected to run inside Nimiq Pay rather than as a normal standalone browser application.

---

## 2. Mobile-first UI

### PASS: The layout is responsive

The application uses responsive layouts and mobile-oriented components.

The primary target is the Nimiq Pay mobile environment.

---

### PASS: Touch targets are designed for mobile interaction

Primary controls and interactive elements use mobile-friendly sizing, including minimum-height button patterns around the 44px target.

---

### PASS: No known horizontal scrolling issue

The current layouts are designed around mobile-width containers and responsive content.

---

### PASS: No desktop-only components are required

The application does not depend on desktop-only navigation or interactions.

---

### PASS: Text is designed to remain readable on mobile

The interface uses readable mobile text sizes and avoids requiring users to zoom.

---

### FAIL: Final mobile QA is not yet considered complete

The implementation is mobile-first and has been tested inside Nimiq Pay on a physical phone, but the final visual QA pass across all views and the smallest target viewport has not yet been formally completed.

**How to fix:**

Perform a final pass at approximately:

```text
375px
360px
```

and inspect:

* Home/Circles view
* Create Circle
* Circle detail
* Contribution modal
* Profile
* Success/error states
* Deadline extension UI
* Deep-linked Circle view

This is a final polish task rather than an architectural issue.

---

## 3. Security

### PASS: No attempt to access private keys or wallet internal state

NimCircle does not request or access private keys, seed phrases, or Nimiq Pay wallet internals.

---

### PASS: Native approval dialogs are not bypassed

Transaction approval is handled by Nimiq Pay through the provider.

---

### PASS: No private keys, seed phrases, or sensitive wallet credentials are hardcoded

No private wallet credentials are required by the application.

---

### PASS: Sensitive actions go through the provider

Wallet access and transaction submission are performed through the Nimiq provider.

---

### SKIP: `eth_signTypedData_v4` / `personal_sign`

NimCircle does not use Ethereum EIP-712 signing or `personal_sign`.

The application uses native NIM transactions rather than EVM token signing.

---

## 4. Error handling

### PASS: User rejection is handled gracefully

Wallet and transaction rejection errors are converted into clear user-facing messages.

For example, provider rejection code `4001` is handled as a user cancellation rather than displayed as an alarming raw provider error.

---

### PASS: Network/API failures are caught

Wallet, API, and transaction operations include error handling.

The contribution flow also distinguishes between:

```text
Transaction was not sent
```

and:

```text
Transaction was sent, but confirmation could not yet be completed
```

This prevents a user from incorrectly assuming that a successful blockchain transaction disappeared merely because the API request failed afterward.

---

### SKIP: ERC-20 contract call failures

NimCircle currently uses native NIM and does not perform ERC-20 contract calls.

---

### FAIL: Final raw-error cleanup remains

The main wallet and contribution flows have cleaned-up errors, but a few broader application paths can still expose backend/API error messages directly.

**How to fix:**

Perform a final application-wide pass over:

* Profile loading
* Circle loading
* User/profile creation
* Circle creation
* Circle status operations
* Deadline extension

and replace overly technical backend messages where necessary with concise user-facing messages.

---

## 5. Approval dialog UX

### PASS: Confirmation-requiring provider calls require user intent

Transaction requests occur from explicit user actions such as contributing NIM.

---

### PASS: Confirmation dialogs are not fired in rapid sequence

The contribution flow does not automatically fire multiple transaction confirmations.

---

### PASS: Read-only operations do not trigger wallet approvals

Circle and profile data are retrieved through the API and do not require wallet approval.

---

### PASS: No approval dialog is triggered on page load

Opening NimCircle does not automatically request a transaction or other confirmation dialog.

---

## 6. Token handling

### SKIP: ERC-20 contract addresses

NimCircle does not currently use ERC-20 tokens.

---

### SKIP: ERC-20 token decimals

NimCircle uses native NIM.

Internally, NIM amounts are represented using Luna:

```text
1 NIM = 100,000 Luna
```

The application validates Luna values as safe integer amounts rather than relying on floating-point blockchain amounts.

---

### SKIP: EVM chain switching

NimCircle does not make ERC-20 contract calls and therefore does not need EVM chain switching.

---

### SKIP: ABI encoding

NimCircle does not encode ERC-20 contract calls.

---

## 7. Chain usage

### SKIP: Ethereum/EVM chain support

NimCircle is a Nimiq-native application and does not use the Ethereum provider.

---

### SKIP: `wallet_switchEthereumChain`

No EVM chain switching is required.

---

### SKIP: Error `4902`

The `4902` EVM chain configuration error does not apply to the Nimiq-native transaction flow.

---

## 8. Dev server and testing

### PASS: Dev server is accessible over the local network

The Vite development server is configured for network access so the application can be opened from a mobile device during development.

---

### PASS: The application has been tested inside Nimiq Pay on a physical phone

NimCircle has been opened inside Nimiq Pay on a Samsung Galaxy S10e.

Provider initialization has been successfully verified in the Mini App environment.

The application has also been tested using the hosted Vercel frontend and Render backend.

---

### PASS: TestAlbatross transaction flow has been exercised

The application has successfully completed a real TestAlbatross contribution flow.

A successful transaction was verified and recorded as a confirmed NimCircle contribution.

---

### SKIP: Secure-context-only fallback

NimCircle does not currently depend on a secure-context-only browser API that requires a custom LAN fallback such as a `crypto.randomUUID()` workaround.

---

## 9. Visual identity

### SKIP: Nimiq logo/brand asset requirement

NimCircle does not currently depend on copied Nimiq brand assets for its core visual identity.

Where official Nimiq brand assets are used, they should be sourced from the official Nimiq Design Kit.

---

### FAIL: Final NimCircle visual identity pass

The application still has final branding work to complete, including the custom NimCircle logo/app icon direction.

**How to fix:**

Finalize:

* NimCircle logo
* App icon/favicon
* Logo usage in the application
* Final spacing and visual consistency
* Any remaining typography/card/button polish

This does not affect the core application functionality.

---

# Pre-Ship Summary

| Category             | Result                             |
| -------------------- | ---------------------------------- |
| Provider integration | PASS                               |
| Mobile-first UI      | PASS with final QA remaining       |
| Security             | PASS                               |
| Error handling       | PASS with minor cleanup remaining  |
| Approval dialog UX   | PASS                               |
| Token handling       | SKIP                               |
| Chain usage          | SKIP                               |
| Dev server/testing   | PASS                               |
| Visual identity      | FAIL pending final branding polish |

The core application is **functionally complete and testable**.

The remaining pre-ship work is primarily:

1. Final mobile visual QA
2. Final raw-error cleanup
3. NimCircle logo/app icon
4. Final visual consistency pass

---

# Competition Context

NimCircle was built for the **Nimiq Mini Apps Competition, Cycle II**.

The project focuses on one of the most practical uses for a wallet-integrated Mini App: coordinating a shared financial goal.

Rather than building a demonstration that only shows a wallet connection, NimCircle uses the Nimiq provider as part of the application's actual product flow.

The blockchain transaction is directly connected to the application's data model:

```text
NIM transaction
      ↓
Circle memo
      ↓
transaction verification
      ↓
Contribution
      ↓
Circle progress
      ↓
Goal completion
```

This makes Nimiq part of the core application logic rather than an isolated feature.

---

# Development Philosophy

NimCircle follows a few important principles.

## The blockchain transaction is the source of truth for contributions

The frontend does not simply mark a contribution as successful because a button was clicked.

A contribution becomes confirmed after transaction verification.

## The backend owns business rules

Important authorization and Circle lifecycle rules are enforced server-side.

## The wallet owns signing

NimCircle never attempts to become the wallet.

Nimiq Pay handles the sensitive wallet interaction and transaction approval.

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

Potential future improvements include:

* More advanced Circle discovery
* Improved contributor notifications
* Additional sharing options
* Richer Circle activity history
* More detailed contribution analytics
* Additional Nimiq asset support where appropriate
* Improved social/group coordination features
* Production MainAlbatross rollout

The current competition build focuses on making the core NIM-powered shared-goal experience reliable before expanding the feature set.

---

# License

NimCircle is released under the **MIT License**.

See the `LICENSE` file in the repository for the complete license text.

---

# Built with Nimiq

NimCircle is built around the Nimiq ecosystem and Nimiq Pay Mini App platform.

The goal is simple:

> **Make saving together with NIM feel as natural as saving together with people.**

---
