// Test script to verify menu filtering for procurement role
import { getFilteredMenuByUser } from './src/utils/menuConfig.js';

// Test procurement role menu filtering
const procurementMenu = getFilteredMenuByUser('hub', 'hub_procurement');
console.log('Procurement Menu Items:');
procurementMenu.forEach(item => {
  console.log(`- ${item.label} (${item.path})`);
  if (item.children) {
    item.children.forEach(child => {
      console.log(`  - ${child.label} (${child.path})`);
    });
  }
});

// Test main admin menu filtering
const adminMenu = getFilteredMenuByUser('hub', 'hub_main_admin');
console.log('\nMain Admin Menu Items:');
adminMenu.forEach(item => {
  console.log(`- ${item.label} (${item.path})`);
  if (item.children) {
    item.children.forEach(child => {
      console.log(`  - ${child.label} (${child.path})`);
    });
  }
});
