


import { useState, useEffect } from 'react';
import { ethers } from "ethers";
import Info from './Info';
import { toast } from 'react-toastify';

const Home = ({ marketplace, account }) => {
  useEffect(() => {
    document.title = "Home";
  }, []);

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [toggle, setToggle] = useState(false); // State for toggling Info component
  const [nftitem, setNftitem] = useState(null); // State to store NFT item
  const [selectedNumbers, setSelectedNumbers] = useState({});

  const loadMarketplaceItems = async () => {
    console.log("Inside loadMarketplace");
    const itemCount = await marketplace.itemCount();
    console.log("Item count is ", itemCount);
    let items = [];
    for (let i = 1; i <= itemCount; i++) {
      const item = await marketplace.items(i);
      console.log("Inside For first item", item);
      if (!item.sold) {
        console.log("Calling tokenURI");
        const uri = await marketplace.tokenURI(item.tokenId);
        const response = await fetch(uri);
        const metadata = await response.json();
        const totalPrice = await marketplace.getTotalPrice(item.itemId);
        let tracknum = Number(item.num);
        console.log("This is remaining through for item", tracknum);
        items.push({
          totalPrice,
          itemId: item.itemId,
          seller: item.seller,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
          num: metadata.num,
          remaining: tracknum,
        });
      }
    }
    setLoading(false);
    setItems(items);
  };

  const Changestate = async () => {
    setToggle(!toggle);
  };

  const viewMarketItem = async (item) => {
    const response = await marketplace.seeNFT(item.itemId);
    await response.wait(); // Wait for the transaction to complete

    const links = await marketplace.tokenURI(item.itemId);
    console.log("Links", links);
    const responses = await fetch(links);
    const result = await responses.json();
    console.log("Result", result);
    setToggle(true); // Set toggle to true to show Info component
    setNftitem(result);
  };

  const handleChange = (idx, event) => {
    const { value } = event.target;
    setSelectedNumbers((prevSelectedNumbers) => ({
      ...prevSelectedNumbers,
      [idx]: value,
    }));
  };

  const RentItems = async (item, idx) => {
  const num = Number(selectedNumbers[idx]);
  console.log("The selected value is ", num);

  if (account === item.seller) {
    toast.error("Owner cannot rent");
    return;
  }

  if (num > item.remaining || num <= 0) {
    toast.error("Invalid number selected");
    return;
  }

  const priceOfSingle = ethers.BigNumber.from(item.totalPrice).div(item.num);
  const priceToPay = priceOfSingle.mul(num);
  console.log("Single price in Wei: ", priceOfSingle.toString());
  console.log("Value to be paid in Wei: ", priceToPay.toString());

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const balances = await provider.getBalance(account);

  if (priceToPay.gt(balances)) {
    toast.error("Insufficient balance");
    return;
  }

  try {
    const transaction = await marketplace.rentItem(item.itemId, num, { value: priceToPay });
    await transaction.wait();
    toast.success(`Successfully borrowed ${num} NFT(s)`);
    loadMarketplaceItems();
  } catch (error) {
    console.error("Transaction failed:", error);
    toast.error("Transaction failed");
  }
};


  useEffect(() => {
    loadMarketplaceItems();
  }, []);

  return (
    <>
      {toggle ? (
        <Info Changestate={() => setToggle(false)} nftitem={nftitem} />
      ) : (
        <div className="flex justify-center min-h-screen">
          {items.length > 0 ? (
            <div className="container mx-auto mt-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {items.map((item, idx) => (
                  <div key={idx} className="bg-gray-100 rounded-lg shadow-md dark:bg-gray-800 hover:transform hover:scale-105 transition-transform duration-300">
                    <img
                      className="rounded-t-lg object-cover w-full h-56"
                      src={item.image}
                      alt="flower"
                    />
                    <div className="p-2">
                      <h5 className="text-xl font-semibold text-blue-600 dark:text-blue-400">{item.name}</h5>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <strong>{ethers.utils.formatUnits(item.totalPrice, "ether")} BIT</strong><br />
                        <strong>Total Minted: {item.num}</strong><br />
                        <strong>Remaining: {item.remaining}</strong>
                      </p>
                      <select
                        onChange={(event) => handleChange(idx, event)}
                        value={selectedNumbers[idx] || ""}
                        id="underline_select"
                        className="block py-1 px-0 w-full text-sm text-gray-200 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer font-bold bg-dark-grey transition-all duration-300 ease-in-out"
                      >
                        <option value="" className="bg-dark-grey">Choose number</option>
                        <option value="1" className="bg-dark-grey text-black">1</option>
                        <option value="2" className="bg-dark-grey text-black">2</option>
                        <option value="3" className="bg-dark-grey text-black">3</option>
                        <option value="4" className="bg-dark-grey text-black">4</option>
                        <option value="5" className="bg-dark-grey text-black">5</option>
                        <option value="6" className="bg-dark-grey text-black">6</option>
                        <option value="7" className="bg-dark-grey text-black">7</option>
                        <option value="8" className="bg-dark-grey text-black">8</option>
                      </select>
                      <button
                        onClick={() => RentItems(item, idx)}
                        className="mt-4 w-full px-4 py-2 text-sm font-medium leading-5 text-white transition-transform transform duration-300 bg-gradient-to-r from-blue-500 to-purple-600 border border-transparent rounded-lg shadow-lg hover:scale-105 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
                      >
                        Rent
                        <svg
                          className="rtl:rotate-180 w-4 h-4 inline-block ml-2 -mt-px"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 14 10"
                          fill="none"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M1 5h12m0 0L9 1m4 4L9 9"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <main className="container mx-auto mt-8">
              <h2 className="text-center text-xl font-semibold text-gray-800 dark:text-white">Loading</h2>
            </main>
          )}
        </div>
      )}
    </>
  );
};

export default Home;


// const RentItem = async (item) => {
//   console.log("The selected value is ",num);
//   const priceofSingle=Number(item.totalPrice)/item.num;
//   const priceToPay=priceofSingle*num;
//   console.log("sINGLE pRICE ",priceofSingle);
//   console.log("Value to be paid ",priceToPay);
//   // await (await marketplace.purchaseItem(item.itemId, { value: item.totalPrice })).wait()
//   await(await marketplace.rentItem(item.itemId,num, {value: priceToPay+0.1})).wait();

//   // loadMarketplaceItems();
// }

//   const RentItems = async (item) => {
//     console.log("The selected value is ", num);

//     // single price
//     const priceOfSingle = Number(item.totalPrice)/item.num;
//     console.log("This is single price",priceOfSingle);

//     const priceToPay = priceOfSingle*num;
//     console.log("The price to be paid is ",priceToPay);


//     const totalValue = priceToPay+0.1 //totl price will be
//     console.log("The total value is ",totalValue);


//     // // Sending the transaction
//     const transaction = await marketplace.rentItem(item.itemId, num, { value: 1 });
//     await transaction.wait();

//     toast.success("Successfully borrowed ",num,"NFT", {position:"top-center"});

//     loadMarketplaceItems();
// }
