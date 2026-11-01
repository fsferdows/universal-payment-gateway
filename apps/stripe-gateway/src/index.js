import { StripeGatewayServer } from './server.js';

const port = Number(process.env.STRIPE_GATEWAY_PORT || 4242);
const server = new StripeGatewayServer({ port });

server.listen(port);

// Graceful termination handling
process.on('SIGINT', () => {
  server.close(() => process.exit(0));
});

process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});
