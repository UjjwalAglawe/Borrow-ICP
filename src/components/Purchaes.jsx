import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export default function Purchaes({ marketplace, account }) {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'My Rentals';
    loadRentedItems();
  }, []);

  const loadRentedItems = async () => {
    const borrowCount = await marketplace.borrowCount();
    let rentedItems = [];

    // Loop through all borrow records to find those rented by current account
    for (let i = 1; i <= borrowCount; i++) {
      const borrowRecord = await marketplace.borrow(i);

      if (borrowRecord.borrower.toLowerCase() === account.toLowerCase()) {
        // Fetch metadata from tokenURI
        const uri = await marketplace.tokenURI(borrowRecord.tokenId);
        const response = await fetch(uri);
        const metadata = await response.json();

        rentedItems.push({
          itemId: borrowRecord.itemId,
          tokenId: borrowRecord.tokenId,
          price: borrowRecord.price,
          num: borrowRecord.num,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
        });
      }
    }

    setPurchases(rentedItems);
    setLoading(false);
  };

  if (loading) {
    return (
      <main style={{ padding: '1rem' }}>
        <h2>Loading your rentals...</h2>
      </main>
    );
  }

  if (purchases.length === 0) {
    return (
      <main style={{ padding: '1rem' }}>
        <h2>You have not rented any items yet.</h2>
      </main>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="px-5 container">
        <div className="flex flex-wrap gap-4 mt-4 justify-start items-center">
          {purchases.map((item, idx) => (
            <div
              key={idx}
              className="w-1/5 h-fit bg-red-200 border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
            >
              <img
                className="rounded-t-lg overflow-hidden object-cover justify-center w-full max-h-60"
                src={item.image}
                alt={item.name}
              />
              <div className="py-2 flex flex-col items-center">
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {item.name}
                </h5>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                  <strong>{ethers.utils.formatEther(item.price)} CELO</strong>
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Quantity rented: <strong>{item.num.toString()}</strong>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
