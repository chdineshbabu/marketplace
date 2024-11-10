import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
const NFTMarketplace = () => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [nfts, setNfts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mintPrice, setMintPrice] = useState('1');
  const [tokenURL, setTokenURL] = useState('');
  const [sellTokenId, setSellTokenId] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [error, setError] = useState(null);
  const [mintNfts, setMintNfts] = useState([]);

  const contractAddress = '0x5f3f1dBD7B74C6B46e8c44f98792A1dAf8d69154';

  const NFTMarketplaceABI =  [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "ERC721IncorrectOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ERC721InsufficientApproval",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "approver",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidApprover",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidOperator",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "receiver",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidReceiver",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidSender",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ERC721NonexistentToken",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "approved",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "ApprovalForAll",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "buyNFT",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "getApproved",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "getNFTAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "getTokenURL",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "isApprovedForAll",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_owner",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_price",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_tokenURL",
          "type": "string"
        }
      ],
      "name": "mintNFT",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "nfts",
      "outputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "isForSale",
          "type": "bool"
        },
        {
          "internalType": "string",
          "name": "tokenURL",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ownerOf",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_price",
          "type": "uint256"
        }
      ],
      "name": "sellNFT",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "setApprovalForAll",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceId",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "tokenId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "tokenURI",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const newProvider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(newProvider);
        const newContract = new ethers.Contract(contractAddress, NFTMarketplaceABI, newProvider.getSigner());
        setContract(newContract);

        const [accounts] = await newProvider.send("eth_requestAccounts", []);
        setAccount(accounts);
      } else {
        alert("Please install MetaMask!");
      }
    };

    init();
  }, []);

  const fetchNFTs = async () => {
    setIsLoading(true);
    try {
      const totalSupply = await contract.tokenId();
      const nftsData = [];

      for (let i = 1; i <= totalSupply; i++) {
        const nft = await contract.nfts(i);
        if (nft.isForSale) {
          nftsData.push({ ...nft, tokenId: i });
        }
      }

      setNfts(nftsData);
    } catch (err) {
      setError("Error fetching NFTs. Please try again.");
    }
    setIsLoading(false);
  };
  const fetchMintNFTs = async () => {
    setIsLoading(true);
    try {
      const totalSupply = await contract.tokenId();
      const nftsData = [];

      for (let i = 1; i <= totalSupply; i++) {
        const nft = await contract.nfts(i);
        if (nft.isForSale ===false) {
          nftsData.push({ ...nft, tokenId: i });
        }
      }

      setMintNfts(nftsData);
    } catch (err) {
      setError("Error fetching NFTs. Please try again.");
    }
    setIsLoading(false);
  };

  const mintNFT = async () => {
    try {
      const tx = await contract.mintNFT(account, ethers.utils.parseEther(mintPrice), tokenURL);
      await tx.wait();
      alert("NFT Minted!");
      fetchNFTs();
      fetchMintNFTs();
    } catch (err) {
      setError("Error minting NFT. Please try again.");
      console.error("Error minting NFT:", err);
    }
  };

  const sellNFT = async () => {
    try {
      const tx = await contract.sellNFT(sellTokenId, ethers.utils.parseEther(sellPrice));
      await tx.wait();
      alert("NFT Listed for Sale!");
      fetchNFTs();
      fetchMintNFTs();
    } catch (err) {
      setError("Error listing NFT. Please try again.");
      console.error("Error listing NFT:", err);
    }
  };

  const buyNFT = async (tokenId, price) => {
    try {
      const tx = await contract.buyNFT(tokenId, { value: ethers.utils.parseEther(price) });
      await tx.wait();
      alert("NFT Bought!");
      fetchNFTs();
      fetchMintNFTs();
    } catch (err) {
      setError("Error buying NFT. Please try again.");
      console.error("Error buying NFT:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold text-center text-indigo-600 mb-10">NFT Marketplace</h1>
        <div className="text-center mb-5">
          <p className="text-lg text-gray-600">Account: {account}</p>
          <button 
            onClick={fetchNFTs} 
            className="mt-4 px-6 py-2 mx-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Fetch NFTs
          </button>
          <button 
            onClick={fetchMintNFTs} 
            className="mt-4 px-6 py-2 mx-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Fetch New Mint NFTs
          </button>
        </div>

        {isLoading && <p className="text-center text-gray-500">Loading NFTs...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Available NFTs for Sale</h2>
          {nfts.length === 0 && !isLoading && <p className="text-center text-gray-500">No NFTs available for sale</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nfts.map((nft) => (
              <div key={nft.tokenId} className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-all">
                <img src={nft.tokenURL} alt={`NFT ${nft.tokenId}`} className="w-full h-48 object-cover rounded-md mb-4" />
                <p className="text-xl font-semibold text-gray-700">Token ID: {nft.tokenId}</p>
                <p className="text-lg text-indigo-500">Price: {ethers.utils.formatEther(nft.price)} ETH</p>
                <button
                  onClick={() => buyNFT(nft.tokenId, ethers.utils.formatEther(nft.price))}
                  className="mt-4 w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Buy NFT
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Mint New NFT</h2>
          <div className="flex space-x-4">
            <input
              type="text"
              value={tokenURL}
              onChange={(e) => setTokenURL(e.target.value)}
              placeholder="Token URL (Image or Metadata)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={mintNFT}
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Mint NFT
            </button>
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Available NFTs for Sale</h2>
          {mintNfts.length === 1 && !isLoading && <p className="text-center text-gray-500">No NFTs available for sale</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mintNfts.map((mintNfts) => (
              <div key={1-mintNfts.tokenId} className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-all">
                <img src={mintNfts.tokenURL} alt={`NFT ${mintNfts.tokenId}`} className="w-full h-48 object-cover rounded-md mb-4" />
                <p className="text-xl font-semibold text-gray-700">Token ID: {mintNfts.tokenId}</p>
                {/* <button
                  onClick={() => buyNFT(mintNfts.tokenId, ethers.utils.formatEther(nft.price))}
                  className="mt-4 w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Buy NFT
                </button> */}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Sell Your NFT</h2>
          <div className="flex space-x-4">
            <input
              type="number"
              value={sellTokenId}
              onChange={(e) => setSellTokenId(e.target.value)}
              placeholder="Token ID"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="number"
              value={sellPrice}
              onChange={(e) => setSellPrice(e.target.value)}
              placeholder="Price in ETH"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={sellNFT}
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Sell NFT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTMarketplace;
