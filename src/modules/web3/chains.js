/* ///////////////////////////////
// Chain management
// /////////////////////////////*/
export const chain_ids = {
	ethereum: 1,
	goerli: 5,
	arbitrum_one: 42161,
	polygon: 137
}

export const chain_id_to_chain_name = id_humber => {
	if( id_humber == chain_ids.ethereum ) return `Ethereum Mainnet`
	if( id_humber == chain_ids.goerli ) return `Ethereum Göerli`
	if( id_humber == chain_ids.arbitrum_one ) return `Arbitrum One`
	if( id_humber == chain_ids.polygon ) return `Polygon`
	return 'Unknown network'
}
