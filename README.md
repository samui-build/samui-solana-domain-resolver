# samui-solana-domain-resolver

> Lightweight API to resolve Solana domains from AllDomains and SNS.

The purpose of this project is to provide a simple API to resolve Solana domains from AllDomains and SNS and run it on
Cloudflare Workers.

It's built using `@solana/web3.js` v2 and Hono.

## Installation

```
pnpm install
pnpm run dev
```

```
pnpm run deploy
```

## API

### GET /domain/:domain

Resolves a domain to an address.

#### Parameters

- `domain`: The domain to resolve.

#### Response

- `domain`: The domain that was resolved.
- `address`: The address that was resolved.

#### Example

```json
{
  "domain": "miester.abc",
  "address": "2EGGxj2qbNAJNgLCPKca8sxZYetyTjnoRspTPjzN2D67"
}
```

### GET /wallet/:address

Resolves an address to a list of domains.

#### Parameters

- `address`: The address to resolve.

#### Response

- `address`: The address that was resolved.
- `domains`: An array of domains that were resolved.

#### Example

```json
{
  "address": "2EGGxj2qbNAJNgLCPKca8sxZYetyTjnoRspTPjzN2D67",
  "domains": [
    "w.sol",
    "# more domains for this address..."
  ]
}
```