import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESSES } from "./config";
import MyERC20 from "./abis/MyERC20.json";
import NFTMinter from "./abis/NFTMinter.json";

const MintNFT = () => {
  const [loading, setLoading] = useState(false);
  const [nftBalance, setNftBalance] = useState(0);
  const [tokenIds, setTokenIds] = useState([]);
  const [nftLoading, setNftLoading] = useState(true);

  const connectWallet = useCallback(async () => {
    try {
      let provider;
      if (window.ethereum) {
        provider = new ethers.BrowserProvider(window.ethereum);
      } else {
        provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
      }
      return await provider.getSigner();
    } catch (error) {
      console.error("Connection Error:", error);
      alert(`Wallet connection failed: ${error.message}`);
      return null;
    }
  }, []);

  const fetchNFTs = useCallback(async () => {
    setNftLoading(true);
    try {
      const signer = await connectWallet();
      if (!signer) return;

      const nftContract = new ethers.Contract(
        CONTRACT_ADDRESSES.nftMinter,
        NFTMinter.abi,
        signer
      );

      const userAddress = await signer.getAddress();
      const balance = await nftContract.balanceOf(userAddress);
      const balanceBN = BigInt(balance.toString());

      if (balanceBN === 0n) {
        console.warn("No NFTs found for this address.");
        setNftBalance(0);
        setTokenIds([]);
        return;
      }

      setNftBalance(balanceBN.toString());

      const ids = [];
      for (let i = 0; i < Number(balanceBN); i++) {
        const tokenId = await nftContract.tokenOfOwnerByIndex(userAddress, i);
        ids.push(tokenId.toString());
      }
      setTokenIds(ids);
    } catch (error) {
      console.error("NFT Fetch Error:", error);
    } finally {
      setNftLoading(false);
    }
  }, [connectWallet]);

  useEffect(() => {
    fetchNFTs();
  }, [fetchNFTs]);

  const handleMint = async () => {
    setLoading(true);
    try {
      const signer = await connectWallet();
      if (!signer) return;
  
      const erc20 = new ethers.Contract(CONTRACT_ADDRESSES.erc20, MyERC20.abi, signer);
      const nftContract = new ethers.Contract(CONTRACT_ADDRESSES.nftMinter, NFTMinter.abi, signer);
  
      const price = ethers.parseUnits("100", 18); // Ensure this matches the contract
      const nftContractAddress = await nftContract.getAddress();
  
      // Approve tokens for minting
      const approveTx = await erc20.approve(nftContractAddress, price);
      await approveTx.wait();
  
      // Check allowance
      const allowance = await erc20.allowance(await signer.getAddress(), nftContractAddress);
      const allowanceBN = BigInt(allowance.toString());
      const priceBN = BigInt(price.toString());
  
      console.log("Allowance:", allowanceBN, "Price:", priceBN);
  
      if (allowanceBN < priceBN) {
        throw new Error("Approval failed. Insufficient allowance.");
      }
  
      // Proceed with minting
      const mintTx = await nftContract.mintNFT();
      await mintTx.wait();
  
      alert("NFT Minted Successfully!");
      await fetchNFTs();
    } catch (error) {
      console.error("Minting Error:", error);
      alert(`Minting Failed: ${error.reason || error.message}`);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div>
      <div className="nft-info">
        {nftLoading ? (
          <p>Loading NFT data...</p>
        ) : (
          <>
            <h3>Your NFT Balance: {nftBalance}</h3>
            {tokenIds.length > 0 && (
              <div>
                <h4>Token IDs:</h4>
                <ul>
                  {tokenIds.map((id) => (
                    <li key={id}>Token #{id}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>

      <button onClick={handleMint} disabled={loading}>
        {loading ? "Minting..." : "Mint NFT"}
      </button>
    </div>
  );
};

export default MintNFT;
