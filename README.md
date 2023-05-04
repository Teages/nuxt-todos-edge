# Todo list demo using Nuxt & CloudFlare

Live demo: https://nuxt-todos.pages.dev

- Frontend:
  - [Nuxt](https://nuxt.com/) - The Vue Framework for Web Architects
  - [TailwindCSS](https://tailwindcss.com/) for styling and layout.
- Backend:
  - Sqlite in development and [CloudFlare D1](https://developers.cloudflare.com/d1/) in production

## Setup

Make sure to install the dependencies

```bash
pnpm i
```

Create a GitHub Oauth Application on https://github.com/settings/applications/new

With homepage url and callback url being http://localhost:3000/api/auth/github

Then, add fill the `NUXT_GITHUB_CLIENT_ID` and `NUXT_GITHUB_CLIENT_SECRET` in the `.env` file:

```bash
NUXT_GITHUB_CLIENT_ID="my-github-oauth-app-id"
NUXT_GITHUB_CLIENT_SECRET="my-github-oauth-app-secret"
```

To create sealed session, you also need to add `NUXT_SESSION_SECRET` in the `.env` file with at least 32 characters:

```bash
NUXT_SESSION_SECRET=your-super-long-secret-for-session-encryption
```

## Development

Start the development server on http://localhost:3000

```bash
npm run dev
```

## Deploying on CloudFlare Pages

### Create your D1 database

- Create a D1 database on your CF account
- Create a CF pages deployment linked to your GitHub repository
- Add the environment variables and the ones to setup Node 18 and pnpm

```bash
NODE_VERSION=18
NPM_FLAGS=--version
NUXT_GITHUB_CLIENT_ID=...
NUXT_GITHUB_CLIENT_SECRET=...
NUXT_SESSION_PASSWORD=...
```

Set the build command to:

```bash
npx pnpm i --store=node_modules/.pnpm-store && npm run build
```

And the output directory to `dist/`

Lastly, in the project settings -> Functions, add the binding between your D1 database and the `DB` variable:

![d1-binding](https://user-images.githubusercontent.com/904724/236021974-d77dfda6-4eb7-4094-ae36-479be73ec35f.png)

That's it :fire: