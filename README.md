
# Weather you like it or not (WYLION)

JVT - December 2025

A web app for fetching misc weather data and doing misc things with it.

Stack:

- typescript/react: duh
- framework, routing, built-in backend: next.js
- weather API: meteomatics/open-meteo
- ORM: prisma
- database: postgres (via neon)
- emails: nodemailer
- auth: better auth
- deployment: AWS
- others:
  - component libary?: shad-cd
  - toast: sonner
  - hash: argon
  - 

Notes to self:

- db regions may mismatch. if having issues, check that. i chose sydney for neon in the browser, but sydney wasn't available for... prisma? when i was setting up prisma in the terminal

```sh
# things i had to do (in probably the wrong order)

somehow installed shadcn
somehow installed input button label sonner
somehow installed prisma
somehow installed better-auth

npx prisma db push
npx prisma generate
npm i --save-dev @types/pg
npm i @prisma/adapter-pg
npm i openmeteo
npm i @node-rs/argon2
npm i nodemailer
npm i --save-dev @types/nodemailer
npm i @prisma/client
```

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
