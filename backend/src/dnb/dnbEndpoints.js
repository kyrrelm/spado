const dnb = require('./dnb');
const querystring = require('querystring');

const createApiTokenRequest = (fnr) => {
  const apiTokenParams = {
    customerId: `{"type":"SSN", "value":${fnr}}`,
  };
  const apiTokenPath = '/api/token';
  const apiTokenQueryString = querystring.stringify(apiTokenParams);
  return dnb.createRequest(apiTokenPath, apiTokenQueryString);
};

const createCustomerInfoRequest = (jwtToken) => {
  return dnb.createRequest('/customers/current', '', jwtToken);
};


exports.getCustomerInfoByFnr = async (fnr) => {
  // Get API token
  const apiTokenOpts = createApiTokenRequest(fnr);
  const apiTokenBody = await dnb.httpsRequest(apiTokenOpts);

  const jwtToken = apiTokenBody.tokenInfo[0].jwtToken;
  const customersOpts = createCustomerInfoRequest(jwtToken);

  return dnb.httpsRequest(customersOpts);

};