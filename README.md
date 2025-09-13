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
server you can run the following commands in sequence:

```bash
git submodule init
git submodule updatO
pnpm install
pnpm approve-builds # Allow electron to run post-install scripts
pnpm run dev-app
```

If you want to make modifications to the API package and
have those be hot-reloaded into the app, you should also run
in a separate terminal session:

```bash
pnpm run watch-api
```

### Building

The application does not possess a build process yet,
however that should be rather trivial to implement since
we're using Vite
