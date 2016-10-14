'use strict';

// tests for facebookBot
// Generated by serverless-mocha-plugin

const mod = require('../facebook-bot/handler.js');
const mochaPlugin = require('serverless-mocha-plugin');
const lambdaWrapper = mochaPlugin.lambdaWrapper;
const expect = mochaPlugin.chai.expect;

const liveFunction = {
  region: process.env.SERVERLESS_REGION,
  lambdaFunction: `${process.env.SERVERLESS_PROJECT}-facebookBot`
};

const wrapped = lambdaWrapper.wrap(mod, {handler: 'handler'});

describe('facebookBot', () => {
  before((done) => {
//  lambdaWrapper.init(liveFunction); // Run the deployed lambda

    done();
  });
  describe('Verify token', () => {
    it('Gives challenge given the right verify token', (done) => {
      const challenge = Date.now();
      wrapped.run({
        method: 'GET',
        query: {
          'hub.verify_token': process.env.FACEBOOK_BOT_VERIFY_TOKEN,
          'hub.challenge': challenge
        }
      }, (err, response) => {
        expect(challenge).to.be.equal(response.response || '');
        done();
      });
    });

    it('Gives an error given an invalid verify token', (done) => {
      let challenge = Date.now();
      wrapped.run({
        method: 'GET',
        query: {
          'hub.verify_token': 'invalid_token',
          'hub.challenge': challenge
        }
      }, (err, response) => {
        expect(err.toString().toLowerCase()).to.match(/400.*bad token/);
//        expect(challenge).to.be.equal(response.response || '');
        done();
      });
    });
  });

  describe('Messaging', () => {
    it('Tests current weather in London', (done) => {
      wrapped.run({
        method: 'POST',
        stage: 'dev',
        body: {
          entry: [
            {
              messaging: [{
                sender: {
                  id: process.env.FACEBOOK_ID_FOR_TESTS
                },
                message: {
                  text: 'How will be the weather in London?'
                }
              }]
            }
          ]
        }
      }, (err, response) => {
        console.log(err, response);
        done(err);
      });
    });

    it('Tests tomorrows forecast in London', (done) => {
      wrapped.run({
        method: 'POST',
        stage: 'dev',
        body: {
          entry: [
            {
              messaging: [{
                sender: {
                  id: process.env.FACEBOOK_ID_FOR_TESTS
                },
                message: {
                  text: 'How will be the weather in London tomorrow?'
                }
              }]
            }
          ]
        }
      }, (err, response) => {
        console.log(err, response);
        done(err);
      });
    });
  });
});