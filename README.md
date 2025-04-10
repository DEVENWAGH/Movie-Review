# Movie Review App

<img src="./public/WatchWise.svg" alt="WatchWise Logo" width="200" />

This is a movie review application built with **Vite**, **React**, and **TypeScript**, styled using **TailwindCSS**.

## Live Demo

Check out the live version of the app here: [Movie Review App](https://movie-review-ty.vercel.app/)

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

This template includes three Dockerfiles optimized for different package managers:

- `Dockerfile` - for npm
- `Dockerfile.pnpm` - for pnpm
- `Dockerfile.bun` - for bun

To build and run using Docker:

```bash
# For npm
docker build -t my-app .

# For pnpm
docker build -f Dockerfile.pnpm -t my-app .

# For bun
docker build -f Dockerfile.bun -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

### Deployment to Vercel

#### Prerequisites

1. Create a Vercel account if you don't have one: https://vercel.com/signup
2. Install the Vercel CLI: `npm i -g vercel`

#### Environment Variables

Before deploying, make sure to set the following environment variables in your Vercel project:

- `VITE_TMDB_API_KEY`: Your TMDB API key
- `VITE_TMDB_ACCESS_TOKEN`: Your TMDB access token
- `VITE_TMDB_ACCOUNT_ID`: Your TMDB account ID

#### Deployment Steps

1. Login to Vercel CLI: `vercel login`
2. Deploy the application: `vercel`
3. Follow the CLI instructions to complete the deployment

Alternatively, you can deploy directly from GitHub by connecting your repository to Vercel.

### Additional Notes for Vercel Deployment

When deploying to Vercel, make sure to:

1. Add all required environment variables in the Vercel dashboard:

   - `VITE_TMDB_API_KEY`: Your TMDB API key

2. The `vercel.json` file is configured to handle client-side routing properly, preventing 404 errors on routes like `/details/movie/1195506`.

3. If you encounter API authentication issues:
   - Check that your API key is correctly set in Vercel environment variables
   - You may need to log in to TMDB to reactivate your API key if it has expired
   - The application includes automatic re-authentication attempts for common API errors

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
