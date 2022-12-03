import { useWeb3Modal } from "../hooks/useWeb3Modal";
import { useMockLoader } from "../hooks/useMockLoader";
import { usePricesFromContract } from "../hooks/usePricesFromContract";
import { GetPriceLoader } from "../components/GetPriceLoader";
import { GetPriceButton } from "../components/GetPriceButton";
import Modal from "../components/Modal";
import { ChainButton } from "../components/ChainButton";
import { ChainDataTable } from "../components/ChainDataTable";
import { PricesTable } from "../components/PricesTable";
import { ChainDetails, chains } from "../config/chains";


const evmosChain = chains[9001];
const otherChains = [chains[5], chains[137], chains[43114], chains[56], chains[280]];

export const Showroom = () => {
  const { text, isMockLoading, setIsMockLoading, startMockLoader } =
    useMockLoader();
  const {
    prices,
    setPrices,
    network,
    setNetwork,
    signer,
    connectWallet,
    walletAddress,
    isChangingNetwork,
    isConnecting,
  } = useWeb3Modal();
  const {
    blockNumber,
    timestamp,
    isLoading,
    errorMessage,
    setErrorMessage,
    getPricesFromContract,
  } = usePricesFromContract(
    network,
    signer,
    startMockLoader,
    setPrices,
    setIsMockLoading
  );

  const onChainClick = async (chain: ChainDetails) => {
    setNetwork(chain);
    if (!signer) {
      await connectWallet();
    }
  };

  const arePrices = Object.values(prices).every((price) => !!price);

  return (
    <div className="flex justify-center items-center flex-col">
      {!network && (
        <p className="mt-10 mb-0 text-lg font-bold">
          Please select a chain to see sample of Redstone Oracle data
        </p>
      )}
      <div className="w-3/4 flex flex-wrap justify-center gap-3 px-10 mt-10 bigger-button">
        
        <ChainButton
          key={evmosChain.chainId}
          chain={evmosChain}
          network={network}
          onChainClick={onChainClick}
          disabled={isConnecting}
        />
      </div>
      <div className="w-3/4 flex flex-wrap justify-center gap-3 px-10 mt-10">
        {otherChains.map((chain) => (
          <ChainButton
            key={chain.chainId}
            chain={chain}
            network={network}
            onChainClick={onChainClick}
            disabled={isConnecting}
          />
        ))}
      </div>
      {isChangingNetwork && signer && (
        <p className="mt-10 mb-0 text-lg font-bold">
          Please change network in MetaMask
        </p>
      )}
      {isConnecting && (
        <p className="mt-10 mb-0 text-lg font-bold">Please login to MetaMask</p>
      )}
      {signer && !isChangingNetwork && (
        <div className="flex w-full justify-center items-center mt-8 flex-col">
          {network && (
            <ChainDataTable walletAddress={walletAddress} network={network} />
          )}
          {isMockLoading || isLoading ? (
            <GetPriceLoader text={isMockLoading ? text : ""} />
          ) : arePrices ? (
            <PricesTable
              blockNumber={blockNumber}
              timestamp={timestamp}
              prices={prices}
            />
          ) : (
            network && (
              <GetPriceButton getPriceFromContract={getPricesFromContract} />
            )
          )}
        </div>
      )}
      {!!errorMessage && (
        <Modal
          closeModal={() => setErrorMessage("")}
          title="Problem with contract interaction"
          text={errorMessage}
        />
      )}
    </div>
  );
};
