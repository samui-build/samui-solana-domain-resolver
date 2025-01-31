import { assertIsAddress } from "@solana/web3.js";
import { Hono } from 'hono'
import { assertIsDomain } from "./assert-is-domain";
import { resolveAddressForDomain } from "./resolve-address-for-domain";
import { resolveDomainsForAddress } from "./resolve-domains-for-address";

const app = new Hono()

app.get('/', (c) => {
  return c.json({
    examples: [
      '# Resolve a domain and get the associated Solana address',
      '/domain/miester.abc',
      '/domain/w.sol',
      '# Resolve a wallet and get the associated Solana domains',
      '/wallet/2EGGxj2qbNAJNgLCPKca8sxZYetyTjnoRspTPjzN2D67',
      '/wallet/5F6gcdzpw7wUjNEugdsD4aLJdEQ4Wt8d6E85vaQXZQSJ',
    ]
  })
})

app.get('/domain/:domain', async (c) => {
  const domain = c.req.param('domain')
  try {
    assertIsDomain(domain)

    const address = await resolveAddressForDomain(domain)

    return c.json({domain, address,})
  } catch (e) {
    c.status(400)
    return c.json({error: `Invalid address: ${domain}`})
  }

})

app.get('/wallet/:address', async (c) => {
  const address = c.req.param('address')
  try {
    assertIsAddress(address)
    const domains = await resolveDomainsForAddress(address)

    return c.json({address, domains})
  } catch (e) {
    c.status(400)
    return c.json({error: `Invalid address: ${address}`})
  }
})

export default app
