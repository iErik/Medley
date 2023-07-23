type EnvironmentVars = {
  CLIENT_ID: string;
  CLIENT_SECRET: string;
  REDIRECT_URI: string;
  DISCORD_API: string;
  DISCORD_CDN: string;
  AUTHORIZE_URL: string;
  AUTH_API: string;
  DISCORD_WS: string;
}

declare const __APP_ENV__: EnvironmentVars
