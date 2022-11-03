// Ethereum address validation
export const eth_or_ens_address_regex = /(0x[a-z0-9]{40})|(.*\.eth)/i
export const eth_address_regex = /(0x[a-z0-9]{40})/i
export const ens_address_regex = /(.*\.eth)/i

// Sanitize inputs
export const sanitize_common = input => input.toLowerCase().trim()