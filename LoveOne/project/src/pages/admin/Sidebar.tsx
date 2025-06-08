import React from 'react';
import { FaGift, FaClipboardList, FaCog } from 'react-icons/fa';

export default function Sidebar() {
  return (
    <div className='w-64 bg-gray-900 text-white h-screen fixed'>
      <div className='text-2xl font-bold p-4 border-b border-gray-700'>🎁 Admin Panel</div>
      <nav className='p-4 space-y-4'>
        <a href='#' className='block hover:bg-gray-700 p-2 rounded'>
          <FaGift className='inline mr-2' /> Add Product
        </a>
        <a href='/admin/eventplace' className='block hover:bg-gray-700 p-2 rounded'>
          <FaClipboardList className='inline mr-2' />eventplace
        </a>
        <a href='#' className='block hover:bg-gray-700 p-2 rounded'>
          <FaCog className='inline mr-2' /> Settings
        </a>
      </nav>
    </div>
  );
}
