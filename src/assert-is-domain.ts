// TODO: Add all the AllDomains extensions here
const extensions = [
  '.id',
  '.letsbonk',
  '.ser',
  '.sol',
  '.solana',
]

export function assertIsDomain(domain: string) {
  // Bail if there is no dot in the domain
  if (!domain.includes('.')) {
    throw new Error(`Domain must include a dot`)
  }
  // Bail if the domain has an invalid extension
  const extension = domain.split('.').pop()
  if (!extensions.includes(extension ?? '')) {
    throw new Error(`Domain must have a valid extension`)
  }

  return true
}