import { Card, Table, Th, Td, Badge, Button } from '../../components/ui';
import { Heart, TrendingUp, ShoppingCart, Bell, Image } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

const mockWishlistItems = [
  { product: 'Seer Fish (Vanjaram)', image: null, wishlisted: 234, stock: 'In Stock', price: 1200, conversion: 45 },
  { product: 'Tiger Prawns', image: null, wishlisted: 189, stock: 'Low Stock', price: 650, conversion: 38 },
  { product: 'Pomfret (White)', image: null, wishlisted: 156, stock: 'Out of Stock', price: 450, conversion: 12 },
  { product: 'Lobster', image: null, wishlisted: 142, stock: 'In Stock', price: 1800, conversion: 28 },
  { product: 'Mud Crab', image: null, wishlisted: 98, stock: 'In Stock', price: 850, conversion: 52 },
];

export function WishlistPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Wishlist Analytics</h1>
        <p className="text-gray-600">Track wishlist trends and conversion</p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-4">
        <Card className="flex items-center gap-4">
          <div className="rounded-lg bg-pink-100 p-3"><Heart className="h-6 w-6 text-pink-600" /></div>
          <div>
            <p className="text-sm text-gray-600">Total Wishlist Items</p>
            <p className="text-2xl font-bold">8,456</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="rounded-lg bg-blue-100 p-3"><TrendingUp className="h-6 w-6 text-blue-600" /></div>
          <div>
            <p className="text-sm text-gray-600">Wishlist → Cart</p>
            <p className="text-2xl font-bold">32%</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="rounded-lg bg-green-100 p-3"><ShoppingCart className="h-6 w-6 text-green-600" /></div>
          <div>
            <p className="text-sm text-gray-600">Wishlist → Purchase</p>
            <p className="text-2xl font-bold">18%</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="rounded-lg bg-purple-100 p-3"><Heart className="h-6 w-6 text-purple-600" /></div>
          <div>
            <p className="text-sm text-gray-600">Avg Wishlist Size</p>
            <p className="text-2xl font-bold">4.2 items</p>
          </div>
        </Card>
      </div>

      {/* Most Wishlisted Products */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Most Wishlisted Products</h2>
          <Button variant="secondary" size="sm"><Bell className="h-4 w-4 mr-2" /> Send Price Drop Alerts</Button>
        </div>
        <Table>
          <thead>
            <tr><Th>Product</Th><Th>Times Wishlisted</Th><Th>Stock Status</Th><Th>Price</Th><Th>Conversion Rate</Th><Th>Actions</Th></tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mockWishlistItems.map((item, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <Td>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center">
                      <Image className="h-5 w-5 text-gray-400" />
                    </div>
                    <span className="font-medium">{item.product}</span>
                  </div>
                </Td>
                <Td>
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-pink-500" />
                    <span className="font-medium">{item.wishlisted}</span>
                  </div>
                </Td>
                <Td>
                  <Badge variant={item.stock === 'In Stock' ? 'bg-green-100 text-green-800' : item.stock === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}>
                    {item.stock}
                  </Badge>
                </Td>
                <Td>{formatCurrency(item.price)}</Td>
                <Td>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${item.conversion}%` }} />
                    </div>
                    <span className="text-sm">{item.conversion}%</span>
                  </div>
                </Td>
                <Td>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm"><Bell className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm">Create Offer</Button>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      {/* Insights */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold mb-4">Wishlist Insights</h2>
          <div className="space-y-4">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <p className="font-medium text-yellow-800">High Wishlist, Low Conversion</p>
              <p className="text-sm text-yellow-600">Pomfret (White) has 156 wishlists but only 12% conversion. Consider a price drop or promotion.</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <p className="font-medium text-red-800">Out of Stock Alert</p>
              <p className="text-sm text-red-600">3 highly wishlisted items are out of stock. Restock to capture demand.</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="font-medium text-green-800">Top Performer</p>
              <p className="text-sm text-green-600">Mud Crab has the highest conversion rate at 52%. Feature it prominently.</p>
            </div>
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold mb-4">Category Distribution</h2>
          <div className="space-y-3">
            {[
              { category: 'Fish', count: 3245, percent: 38 },
              { category: 'Prawns', count: 2156, percent: 26 },
              { category: 'Crab', count: 1423, percent: 17 },
              { category: 'Chicken', count: 987, percent: 12 },
              { category: 'Others', count: 645, percent: 7 },
            ].map(cat => (
              <div key={cat.category}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{cat.category}</span>
                  <span>{cat.count} items ({cat.percent}%)</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-500 rounded-full" style={{ width: `${cat.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
