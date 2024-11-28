import { config } from 'dotenv';
config();
const environments = {
  txTimeOut: 3 * 40 * 1000,
  baseUrl: process.env.HOST_URL || 'http://localhost:3000',
  kuber: {
    apiUrl:
      process.env.KUBER_API_URL || 'https://preview.kuber.cardanoapi.io',
    apiKey: process.env.KUBER_API_KEY || '',
  },
  networkId: process.env.NETWORK_ID || '0',
  ci: process.env.CI,
};

export default environments;
