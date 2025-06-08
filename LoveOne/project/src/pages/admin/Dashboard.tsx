import React from 'react';
import Sidebar from './Sidebar';
import AdminAddGiftPage from './Adminproduct';



export default function Dashboard() {
  return (
    <div className='flex'>
      <Sidebar />
      <div className='flex-1 ml-64 min-h-screen bg-gray-100'>

        <main className='p-6'>
          < AdminAddGiftPage/>
          
        </main>
      </div>
    </div>
  );
}
