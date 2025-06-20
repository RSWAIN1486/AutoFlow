This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## AutoFlow - Vehicle Financing Application

A complete vehicle financing application workflow built with Next.js, featuring vehicle inventory, credit applications, document uploads, admin review, and delivery management.

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

## Key Features

- **Vehicle Inventory**: Browse available vehicles with detailed specs
- **Credit Application**: Complete financing application form
- **Document Upload**: Secure upload for required documents
- **Admin Dashboard**: Review and approve applications
- **Lender Simulation**: Generate realistic loan terms
- **E-Contracting**: Mock contract signing process
- **Delivery Options**: Choose pickup or home delivery

## Project Structure

```
src/
├── app/                    # Next.js App Router pages and API routes
│   ├── api/               # Backend API endpoints
│   ├── admin/             # Admin dashboard
│   ├── apply/             # Application flow
│   └── inventory/         # Vehicle browsing
├── lib/                   # Utilities and data management
└── components/            # Reusable UI components
```

## Deployment

For deployment options that work with persistent file storage (no code changes required), see **[DEPLOYMENT.md](./DEPLOYMENT.md)**.

**Quick Deploy Options:**
- **Railway** (Recommended): Zero-config deployment with persistent storage
- **Render**: Great alternative with persistent disks  
- **DigitalOcean**: Reliable with good documentation
- **VPS**: Full control with any provider

**Note**: This application uses file-based storage and requires platforms that support persistent file systems. Serverless platforms like Vercel require additional configuration.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
