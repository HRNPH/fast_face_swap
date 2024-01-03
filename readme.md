# SwapGals

Face Swap AI Gallery, Made Easy

## Overview

SwapGals is a user-friendly AI application that simplifies the process of creating and customizing face swap images. The app features a clean and simple interface, making it easy for users to generate, modify, and explore unique face swap creations.

## Folder Structure

- `/backend`: Node.js Express backend.
- `/frontend`: Next.js frontend.

## Getting Started

### Prerequisites
asumme you have the following installed
- nodejs 20.x.x or higher
- pnpm and or npm or yarn
- docker
- docker-compose
- git
- Access To Replicate API

### Installation

1. Clone the repo
```sh
git clone https://github.com/HRNPH/fast_face_swap
cd fast_face_swap
```
2. Install dependencies
```sh
cd backend && pnpm install
cd ../frontend && pnpm install
```
3. Start the backend
- Create a `.env` file in the backend directory
- install dependencies and start the backend
```sh
# take a look at the .env.example file for reference
cd backend && touch .env
# spin up the database using docker-compose
docker-compose up -d
pnpm install # install dependencies
pnpm run dev
```
4. Start the frontend
- Create a `.env` file in the backend directory
- install dependencies and start the frontend
```sh
# take a look at the .env.example file for reference
cd frontend && touch .env
pnpm install # install dependencies
pnpm run dev
```