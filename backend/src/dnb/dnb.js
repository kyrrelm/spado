require('dotenv').config();

const https = require('https');
const querystring = require('querystring');
const asv4 = require('./asv4');

// Developer's credentials
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const apiKey = process.env.API_KEY;

// AWS signing v4 constants
const awsRegion = 'eu-west-1';
const awsService = 'execute-api';

const openbankingEndpoint = 'developer-api-sandbox.dnb.no';

exports.httpsRequest = (params) => {
  return new Promise((resolve, reject) => {
    const req = https.request(params, (res) => {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(new Error(`statusCode=${res.statusCode}`));
      }
      // cumulate data
      let body = [];
      res.on('data', (chunk) => { body.push(chunk); });
      // resolve on end
      res.on('end', () => {
        try {
          body = JSON.parse(Buffer.concat(body).toString());
        } catch (e) {
          reject(e);
        }
        resolve(body);
      });
      return res;
    });
    req.on('error', (err) => { reject(err); });
    req.end();
  });
};

function createAmzDate() {
  return new Date().toISOString().replace(/[:-]|\.\d{3}/g, '');
}

exports.createRequest = (path, queryString = '', jwtToken = '') => {
  const opts = {
    host: openbankingEndpoint,
    headers: {
      Host: openbankingEndpoint,
      Accept: 'application/json',
      'Content-type': 'application/json',
      'x-api-key': apiKey,
      'x-amz-date': createAmzDate(),
    },
    path,
    params: queryString,
    service: awsService,
    region: awsRegion,
  };
  if (queryString !== '') {
    opts.path += `?${queryString}`;
  }
  if (jwtToken !== '') {
    opts.headers['x-dnbapi-jwt'] = jwtToken;
  }
  opts.headers.Authorization = asv4.sign(opts, clientId, clientSecret);
  return opts;
}

