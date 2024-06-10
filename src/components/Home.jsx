// import { useState, useEffect } from 'react'
// import { ethers } from "ethers"
// import { click } from '@testing-library/user-event/dist/click';

// const Home = ({ marketplace , account }) => {

//   useEffect(()=>{
//     document.title = "Home"
// }, []);

//   const [loading, setLoading] = useState(true)
//   const [items, setItems] = useState([])
//   const loadMarketplaceItems = async () => {

//     const itemCount = await marketplace.itemCount()
//     let items = []
//     for (let i = 1; i <= itemCount; i++) {
//       const item = await marketplace.items(i)
//       if (!item.sold) {

//         const uri = await marketplace.tokenURI(item.tokenId)

//         const response = await fetch(uri)
//         const metadata = await response.json()

//         const totalPrice = await marketplace.getTotalPrice(item.itemId)

//         items.push({
//           totalPrice,
//           itemId: item.itemId,
//           seller: item.seller,
//           name: metadata.name,
//           description: metadata.description,
//           image: metadata.image
//         })
//       }
//     }
//     setLoading(false)
//     setItems(items)

//   }

//   const viewMarketItem = async (item) => {
//     // await (await marketplace.purchaseItem(item.itemId, { value: item.totalPrice })).wait()
//     // await marketplace.item.seller=account;
//     await (await marketplace.seeNFT(item.itemId)).wait();
//     loadMarketplaceItems()
//   }

//   useEffect(() => {
//     loadMarketplaceItems()
//   }, [])
//   if (loading) return (
//     <main style={{ padding: "1rem 0" }}>
//       <h2>Loading...</h2>
//     </main>
//   )
//   const homeClick=()=>{
//     console.log("click");
//   }
//   return (
//     <>
//     <div className="flex justify-center">
//       {items.length > 0 ?
//       <div className="px-5 py-3 container">
//         <div className='flex flex-wrap  gap-4 mt-4 justify-start items-center'>
//             {items.map((item, idx) => (


//         <div className="w-1/5 h-fit bg-red-200 border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 ">

//                 <img
//                     className="rounded-t-lg overflow-hidden object-cover justify-center w-full max-h-60"
//                     src={item.image}
//                     alt="flower"
//                 />

//             <div className="py-2 flex flex-col items-center flex-center">

//                     <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
//                         {item.name}
//                     </h5>

//                 <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
//                    <strong>{ethers.utils.formatEther(item.totalPrice)} BIT</strong>
//                 </p>
//                 <a onClick={() => viewMarketItem(item)} className="inline-flex no-underline w-20 items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
//                    Buy
//                     <svg
//                         className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
//                         aria-hidden="true"
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 14 10"
//                     >
//                         <path
//                             stroke="currentColor"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth="2"
//                             d="M1 5h12m0 0L9 1m4 4L9 9"
//                         />
//                     </svg>
//                 </a>
//             </div>
//         </div>

//             ))}
//          </div>
//         </div>
//         : (
//           <main style={{ padding: "1rem 0" }}>
//             <h2>No listed assets</h2>
//           </main>
//         )}
//         </div>
//     </>
//   );
// }
// export default Home


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
    const num = selectedNumbers[idx];
    console.log("The selected value is ", num);

    if (num <= items.remaining) {
      console.log("Value of NUM=",num,"Total Rmaining ",item.num);
      toast.error("Select proper value acc. to Remaining");
      console.log("Exiting function");
      return false
    }

    

      // single price
      const priceOfSingle = ethers.utils.parseUnits((item.totalPrice / item.num).toString(), "wei");
      const priceToPay = priceOfSingle.mul(num);

      console.log("Single price in Wei: ", priceOfSingle.toString());
      console.log("Value to be paid in Wei: ", priceToPay.toString());

      const extraEther = ethers.utils.parseUnits("0.5", "ether");
      const totalValue = priceToPay.add(extraEther); // Total price will be

      console.log("Total value to be paid in Wei: ", totalValue.toString());

      // getting user balance
      const getBalance = async (address) => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(address);
        // const balanceInEth = ethers.utils.formatEther(balance);
        if(balance<totalValue){
          toast.error("Insufficient Balence")
          console.log(balance)
          return false
        }
        console.log(balance);
    }
      // // Sending the transaction
      // const transaction = await marketplace.rentItem(item.itemId, num, { value: totalValue });
      // await transaction.wait();

      // toast.success(`Successfully borrowed ${num} NFT(s)`, { position: "top-center" });
      // // Optionally reload marketplace items
      // loadMarketplaceItems();

      try {
        // Sending the transaction
        const transaction = await marketplace.rentItem(item.itemId, num, { value: totalValue });
        await transaction.wait();

        toast.success(`Successfully borrowed ${num} NFT(s)`, { position: "top-center" });
        // Optionally reload marketplace items
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
