export default {
  origin: [
    'https://xr-versatile.vercel.app/',
    'https://admin.xr-versatile.vercel.app/',
    /http:\/\/localhost:[1-9]+/,
    /http:\/\/127.0.0.1:[1-9]+/,
    /http(s)?:\/\/xr-versatile.vercel\.app/,
    /http(s)?:\/\/admin.xr-versatile.vercel\.app/,
  ],
  allowedHeaders:
    'Content-Type, Accept, Access-Control-Allow-Origin, Authorization',
};
