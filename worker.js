// v2.1
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const CORS = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': '*' } });
    }

    try {
      // GAS
      if (url.pathname === '/etherscan/gas') {
        const r = await fetch(`https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${env.ETHERSCAN_KEY}`);
        const d = await r.json();
        return new Response(JSON.stringify(d), { headers: CORS });
      }

      // NFTs by wallet
      if (url.pathname === '/alchemy/nfts') {
        const address = url.searchParams.get('address');
        if (!address) return new Response(JSON.stringify({ error: 'address required' }), { headers: CORS });
        const r = await fetch(`https://eth-mainnet.g.alchemy.com/nft/v3/${env.ALCHEMY_KEY}/getNFTsForOwner?owner=${address}&withMetadata=true&pageSize=100`);
        const d = await r.json();
        return new Response(JSON.stringify(d), { headers: CORS });
      }

      // Single NFT detail
      if (url.pathname === '/alchemy/nft') {
        const contract = url.searchParams.get('contract');
        const id = url.searchParams.get('id');
        const r = await fetch(`https://eth-mainnet.g.alchemy.com/nft/v3/${env.ALCHEMY_KEY}/getNFTMetadata?contractAddress=${contract}&tokenId=${id}&refreshCache=false`);
        const d = await r.json();
        return new Response(JSON.stringify(d), { headers: CORS });
      }

      // Floor price
      if (url.pathname === '/alchemy/floor') {
        const contract = url.searchParams.get('contract');
        const r = await fetch(`https://eth-mainnet.g.alchemy.com/nft/v3/${env.ALCHEMY_KEY}/getFloorPrice?contractAddress=${contract}`);
        const d = await r.json();
        return new Response(JSON.stringify(d), { headers: CORS });
      }

      // OpenSea NFT (rarity + last sale)
      if (url.pathname === '/opensea/nft') {
        const contract = url.searchParams.get('contract');
        const id = url.searchParams.get('id');
        const r = await fetch(
          `https://api.opensea.io/api/v2/chain/ethereum/contract/${contract}/nfts/${id}`,
          { headers: { 'x-api-key': env.OPENSEA_KEY, 'accept': 'application/json' } }
        );
        const d = await r.json();
        return new Response(JSON.stringify(d), { headers: CORS });
      }

      return new Response(JSON.stringify({ error: 'not found' }), { status: 404, headers: CORS });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: CORS });
    }
  }
};
