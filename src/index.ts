import { assertIsAddress } from "@solana/web3.js";
import { Hono } from 'hono'
import { assertIsDomain } from "./lib/assert-is-domain";
import { getApiEndpoint, getApiRpc } from "./lib/get-api-rpc";
import { resolveAddressForDomain } from "./lib/resolve-address-for-domain";
import { resolveDomainsForAddress } from "./lib/resolve-domains-for-address";

type Bindings = {
  SOLANA_ENDPOINT: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/', (c) => {
  return c.json({
    examples: [
      '# Connect to the RPC and get the version and genesis hash',
      '/connect',
      '# Resolve a domain and get the associated Solana address',
      '/domain/miester.abc',
      '/domain/w.sol',
      '# Resolve a wallet and get the associated Solana domains',
      '/wallet/2EGGxj2qbNAJNgLCPKca8sxZYetyTjnoRspTPjzN2D67',
      '/wallet/5F6gcdzpw7wUjNEugdsD4aLJdEQ4Wt8d6E85vaQXZQSJ',
    ]
  })
})

app.get('/connect', async (c) => {
  try {
    const endpoint = getApiEndpoint(c.env['SOLANA_ENDPOINT'])
    const rpc = getApiRpc(endpoint)

    const [version, genesisHash] = await Promise.all([
      rpc.getVersion().send(),
      rpc.getGenesisHash().send(),
    ])

    return c.json({
      // Show the endpoint but obfuscate any sensitive information
      endpoint: endpoint?.split('=')[0],
      version,
      genesisHash,
    })
  } catch (e) {
    c.status(400)
    return c.json({error: `Error connecting to RPC: ${e}`})
  }
})

app.get('/domain/:domain', async (c) => {
  // TODO: Add all the AllDomains extensions here. Ideally, we get these from chain and cache it to maintain performant.
  const extensions = ['id', 'letsbonk', 'ser', 'sol', 'solana',]
  const domain = c.req.param('domain')

  try {
    assertIsDomain(domain, extensions)

    const endpoint = getApiEndpoint(c.env['SOLANA_ENDPOINT'])
    const rpc = getApiRpc(endpoint)
    const address = await resolveAddressForDomain(rpc, domain)

    return c.json({domain, address,})
  } catch (e) {
    c.status(400)
    return c.json({error: `Invalid domain: ${domain}`})
  }

})

app.get('/wallet/:address', async (c) => {
  const address = c.req.param('address')
  try {
    assertIsAddress(address)

    const endpoint = getApiEndpoint(c.env['SOLANA_ENDPOINT'])
    const rpc = getApiRpc(endpoint)
    const domains = await resolveDomainsForAddress(rpc, address)

    return c.json({address, domains})
  } catch (e) {
    c.status(400)
    return c.json({error: `Invalid address: ${address}`})
  }
})

export default app
