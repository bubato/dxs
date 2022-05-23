import { Auth } from 'aws-amplify'
const config = {
  // To get the AWS Credentials, you need to configure
  // the Auth module with your Cognito Federated Identity Pool
  Auth: {
    region: 'ap-northeast-1',
    userPoolId: getUserPoolId(),
    userPoolWebClientId: getUserPoolWebClientId(),
    mandatorySignIn: false,
    clientMetadata: { app: 'cognito-vue-bootstrap' },
    storage: window.localStorage,
  },
  API: {
    endpoints: [
      {
        name: 'tenant',
        endpoint: process.env.TENANT_API_URL,
        custom_header: async () => {
          return {
            Authorization: `Bearer ${(await Auth.currentSession())
              .getAccessToken()
              .getJwtToken()}`,
          }
        },
      },
      {
        name: 'backoffice',
        endpoint: process.env.BO_API_URL,
        custom_header: async () => {
          return {
            Authorization: `Bearer ${(await Auth.currentSession())
              .getAccessToken()
              .getJwtToken()}`,
          }
        },
      },
    ],
  },
  Analytics: {
    disabled: false,
    autoSessionRecord: true,
    AWSPinpoint: {
      appId: process.env.PINPOINT_APP_ID,
      region: process.env.AWS_REGION,
    },
  },
}

function getUserPoolId() {
  let userPoolId = ''

  switch (process.env.environment) {
    case 'development':
    case 'staging':
      userPoolId = 'ap-northeast-1_cmP1mlL0s'
      break
    case 'stagingPro':
      userPoolId = 'ap-northeast-1_ataQPgD6t'
      break
    case 'production':
      userPoolId = 'ap-northeast-1_sqe2peSfC'
      break
  }

  return userPoolId
}

function getUserPoolWebClientId() {
  let userPoolWebClientId = ''

  switch (process.env.environment) {
    case 'development':
    case 'staging':
      userPoolWebClientId = '669kd5iugcq9u06i21a89npual'
      break
    case 'stagingPro':
      userPoolWebClientId = '1rva7kpq0j2stt4vf6j5kic9rt'
      break
    case 'production':
      userPoolWebClientId = '13k9d15ejckp3qlfom5avd40d5'
      break
  }

  return userPoolWebClientId
}

export default config
