import { MercadoPagoConfig, Preference } from 'mercadopago';

// Configuração do cliente Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
  options: {
    timeout: 5000,
  }
});

export const preference = new Preference(client);

export default client;
