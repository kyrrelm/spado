import './main.css';
import { Elm } from './Main.elm';
import registerServiceWorker from './registerServiceWorker';
import aws4 from 'aws4';


var CREDS = {accessKeyId: 'AKIAJPTZSI6QMO4FJGWA', secretAccessKey: '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'};

var sigs = aws4.sign({
  service: 'execute-api',
  region: 'eu-west-1',
  //host: 'developer-api-sandbox.dnb.no',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'x-api-key': '215c74c0c2fa-11e8-843b-edcdcefa214f',
  },
}, CREDS);

console.log("SIGS", sigs);

var send = XMLHttpRequest.prototype.send;

XMLHttpRequest.prototype.send = function(data) {
  //this.setRequestHeader('AVGIVERID', 'dfewe');
  console.log("THIS", this.method);
  // for(const key in sigs.headers){
  //   if(sigs.headers.hasOwnProperty(key)) {
  //     this.setRequestHeader(key, sigs.headers[key]);
  //   }
  //}
  this.setRequestHeader('x-api-key', '215c74c0c2fa-11e8-843b-edcdcefa214f');
  this.setRequestHeader('Authorization', sigs.headers['Authorization']);
  this.setRequestHeader('X-Amz-Date', sigs.headers['X-Amz-Date']);

  return send.apply(this, arguments);
};


Elm.Main.init({
  node: document.getElementById('root')
});

registerServiceWorker();
