var fs     = require('fs'),
    prompt = require('prompt'),
    forge  = require('node-forge');

module.exports = function(){
  function createSsl (err, result) {
    if (err) {
      console.log(err);
      return err;
    }

    var pki   = forge.pki,
        keys  = pki.rsa.generateKeyPair(2048),
        cert  = pki.createCertificate(),
        attrs = [{
                  name: 'commonName',
                  value: result.commonName
                }, {
                  name: 'countryName',
                  value: result.countryName
                }, {
                  shortName: 'ST',
                  value: result.stateName
                }, {
                  name: 'localityName',
                  value: result.localityName
                }, {
                  name: 'organizationName',
                  value: result.organizationName
                }, {
                  shortName: 'OU',
                  value: result.organizationalUnit
                }];

    cert.publicKey = keys.publicKey;
    cert.serialNumber = '01';
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);

    cert.setSubject(attrs);
    cert.setIssuer(attrs);

    cert.setExtensions([{
      name: 'basicConstraints',
      cA: true
    }, {
      name: 'keyUsage',
      keyCertSign: true,
      digitalSignature: true,
      nonRepudiation: true,
      keyEncipherment: true,
      dataEncipherment: true
    }, {
      name: 'extKeyUsage',
      serverAuth: true,
      clientAuth: true,
      codeSigning: true,
      emailProtection: true,
      timeStamping: true
    }, {
      name: 'nsCertType',
      client: true,
      server: true,
      email: true,
      objsign: true,
      sslCA: true,
      emailCA: true,
      objCA: true
    }, {
      name: 'subjectAltName',
      altNames: [{
        type: 6,
        value: result.altUri
      }, {
        type: 7,
        ip: result.altIp
      }]
    }, {
      name: 'subjectKeyIdentifier'
    }]);

    cert.sign(keys.privateKey);

    var publicPem  = pki.publicKeyToPem(keys.publicKey),
        certPem    = pki.certificateToPem(cert),
        privatePem = pki.privateKeyToPem(keys.privateKey),
        fsCallback = function(err) { if (err) throw err; };

    fs.writeFileSync('private.pem', privatePem, 'utf8', fsCallback);
    fs.writeFileSync('cert.pem', certPem, 'utf8', fsCallback);
    fs.writeFileSync('public.pem', publicPem, 'utf8', fsCallback);

    console.log('');
    console.log('Complete!');
    console.log('');  
  };
  
  function genSsl() {
    var schema = {
          properties: {
            commonName: {
              description: 'Enter the public domain name of your website (e.g. www.google.com)',
              message: 'Required',
              required: true
            },
            countryName: {
              description: 'Enter the two-character denomination of your country (e.g. US, CA)',
              pattern: /^[A-Z]{2}$/,
              message: 'Two characters, capital letters only',
              required: true
            },
            stateName: {
              description: 'Enter the name of your state or province, if applicable',
              default: 'n/a',
              required: false
            },
            localityName: {
              description: 'Enter the name of your city',
              default: 'n/a',
              required: false
            },
            organizationName: {
              description: 'Enter the legal name of your organization, if applicable',
              default: 'n/a',
              required: false
            },
            organizationalUnit: {
              description: 'Enter the organizational unit represented by the site, if applicable (e.g. Internet Sales)',
              default: 'n/a',
              required: false
            },
            altUri: {
              description: 'Enter any alternative URI the certificate would be active for',
              default: 'http://localhost/',
              required: false
            },
            altIp: {
              description: 'Enter the IP address the certificate would be active for',
              default: '127.0.0.1',
              required: false
            }
          }
        };

    prompt.start();
    prompt.get(schema, createSsl);
  };
  
  return genSsl;
};