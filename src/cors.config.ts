export default {
  origin: [
    'https://www.xrversatilehealthcare.com',
    'https://admin.xrversatilehealthcare.com/',
    /http:\/\/localhost:[1-9]+/,
    /http:\/\/127.0.0.1:[1-9]+/,
    /http(s)?:\/\/xrversatilehealthcare\.com/,
    /http(s)?:\/\/admin.xrversatilehealthcare\.com/,
  ],
  allowedHeaders:
    'Content-Type, Accept, Access-Control-Allow-Origin, Authorization',
};
