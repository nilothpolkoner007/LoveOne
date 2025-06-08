import { useState } from 'react';
import { DollarSign, ShoppingBag, Users, TrendingUp, Package, Heart } from 'lucide-react';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  activeUsers: number;
  conversionRate: number;
}

interface RecentOrder {
  id: string;
  customer: string;
  amount: number;
  status: string;
  date: Date;
}

function DashboardPage() {
  const [stats] = useState<DashboardStats>({
    totalRevenue: 15789.45,
    totalOrders: 156,
    activeUsers: 2453,
    conversionRate: 3.2
  });

  const [recentOrders] = useState<RecentOrder[]>([
    {
      id: "ORD-001",
      customer: "John Doe",
      amount: 79.99,
      status: "Processing",
      date: new Date(2024, 2, 15)
    },
    {
      id: "ORD-002",
      customer: "Jane Smith",
      amount: 150.00,
      status: "Shipped",
      date: new Date(2024, 2, 14)
    }
  ]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={<DollarSign className="h-6 w-6 text-green-500" />}
          trend="+12.5%"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders.toString()}
          icon={<ShoppingBag className="h-6 w-6 text-blue-500" />}
          trend="+8.2%"
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers.toString()}
          icon={<Users className="h-6 w-6 text-purple-500" />}
          trend="+15.7%"
        />
        <StatCard
          title="Conversion Rate"
          value={`${stats.conversionRate}%`}
          icon={<TrendingUp className="h-6 w-6 text-rose-500" />}
          trend="+2.1%"
        />
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
          <button className="text-rose-500 hover:text-rose-600 font-medium">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.date.toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickActionCard
          title="Add New Gift"
          description="Create and publish new gift items"
          icon={<Gift className="h-6 w-6 text-rose-500" />}
        />
        <QuickActionCard
          title="Process Orders"
          description="View and update order status"
          icon={<Package className="h-6 w-6 text-rose-500" />}
        />
        <QuickActionCard
          title="Customer Support"
          description="Respond to customer inquiries"
          icon={<Heart className="h-6 w-6 text-rose-500" />}
        />
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend }: { title: string; value: string; icon: React.ReactNode; trend: string }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-2">{value}</p>
        </div>
        {icon}
      </div>
      <div className="mt-4 flex items-center text-sm">
        <span className="text-green-500 font-medium">{trend}</span>
        <span className="text-gray-500 ml-2">vs last month</span>
      </div>
    </div>
  );
}

function QuickActionCard({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) {
  return (
    <button className="bg-white rounded-xl shadow-lg p-6 text-left hover:shadow-xl transition-shadow">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-rose-50 rounded-lg">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
      </div>
    </button>
  );
}

export default DashboardPage;