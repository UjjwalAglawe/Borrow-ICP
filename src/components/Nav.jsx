import React from 'react';
import { Link } from "react-router-dom";

function Nav({ account, loadProvider, loading }) {

  return (
    // dark:border-gray-700
    <nav className="border-gray-500 bg-custom-nav dark:bg-custom-nav  transition ease-in-out hover:bg-slate-700 dark:lighterCustomColor nav-gradient-border">

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between p-4">
          <div className="flex cursor-pointer items-center space-x-3 rtl:space-x-reverse">
            <Link to='/' className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white no-underline">Ignitus Networks</Link>
          </div>

          <div className="flex justify-around w-full max-w-md">
            <Link to="/home" className="no-underline text-gray-200 text-lg font-semibold transition-colors duration-300 hover:text-white hover:font-bold">Home</Link>
            <Link to="/create" className="no-underline text-gray-200 text-lg font-semibold transition-colors duration-300 hover:text-white hover:font-bold">Create</Link>
            {/* <Link to="/my-listed-nfts" className="no-underline text-gray-200 text-lg font-semibold transition-colors duration-300 hover:text-white">My Listed Items</Link>
        <Link to="/my-purchases" className="no-underline text-gray-200 text-lg font-semibold transition-colors duration-300 hover:text-white">My Purchases</Link> */}
            {loading ? (<button onClick={loadProvider} type="button" class="border-[0.5px] p-1 w-22  h-9 text-white bg-gradient-to-r from-purple-700 to-pink-800 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Connect Wallet</button>) :
              (<button type="button" class="inline-flex items-center justify-center border-[0.5px] p-2 w-22  h-9 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-hamburger" aria-expanded="false">
                {account.slice(0, 5) + '...' + account.slice(38, 42)}
              </button>)
            }
          </div>
        </div>
      </div>
    </nav>



  )
}

export default Nav