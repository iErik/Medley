# Medley

This is the monorepo for the Medley app, a work-in-progress,
desktop client for the [Revolt platform](https://revolt.chat/).

This app is made with:
 - TypeScript
 - Electron 37
 - React.js v18
 - React Router 7
 - Redux/Redux Toolkit + Redux Saga
 - Slate
 - OverlayScrollbars
 - Stitches + SCSS

Currently, the app provides basic funcionality for browsing
user login with MFA support, browsing the user's servers,
server channels and direct messages, there is an ongoing
effort to bring complete funcionality to the application.

## Running Localy

### Requirements
 - Node.js 14.18.x or later
 - pnpm 9.15.2


### Development server

To run the application's electron app with the develeopment
server, there are a few steps you need to take:


##### Step 1 - Initialize Submodules

```bash
git submodule init
git submodule update
```

##### Step 2 - Install dependencies

```bash
pnpm install
pnpm approve-builds # Allow electron to run post-install scripts
```

##### Step 3 - Add .env file to the API package

You can just copy the contents of the existing `.env.default`
to `.env` in the root of the API package:

```bash
cp packages/api/.env.default packages/api/.env
```

##### Step 4 - Build package dependencies

You're gonna need to build 2 packages required to run the
main app: ts-utils and api, both of these packages are
located in this monorepo. To build each of them, you'll need
to  run the build command for each:

```bash
# Runs the build command in the ts-utils and api packages
pnpm build-deps
```

##### Step 5 - Run development server

```bash
pnpm dev-app
```

### Building

The application does not possess a build process yet,
however that should be rather trivial to implement since
we're using Vite
