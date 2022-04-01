using ABA_Therapy_Tracker.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ABA_Therapy_Tracker.Services
{
    public class MockDataStore : IDataStore<Item>
    {
        readonly List<Item> items;

        public MockDataStore()
        {
            items = new List<Item>()
            {
                new Item { Id = Guid.NewGuid().ToString(), Text = "Patient-1", Description="FirstName-1, LastName-1" },
                new Item { Id = Guid.NewGuid().ToString(), Text = "Patient-2", Description="FirstName-2, LastName-2" },
                new Item { Id = Guid.NewGuid().ToString(), Text = "Patient-3", Description="FirstName-3, LastName-3" },
                new Item { Id = Guid.NewGuid().ToString(), Text = "Patient-4", Description="FirstName-4, LastName-4" },
                new Item { Id = Guid.NewGuid().ToString(), Text = "Patient-5", Description="FirstName-5, LastName-5" },
                new Item { Id = Guid.NewGuid().ToString(), Text = "Patient-6", Description="FirstName-6, LastName-6" }
            };
        }

        public async Task<bool> AddItemAsync(Item item)
        {
            items.Add(item);

            return await Task.FromResult(true);
        }

        public async Task<bool> UpdateItemAsync(Item item)
        {
            var oldItem = items.Where((Item arg) => arg.Id == item.Id).FirstOrDefault();
            items.Remove(oldItem);
            items.Add(item);

            return await Task.FromResult(true);
        }

        public async Task<bool> DeleteItemAsync(string id)
        {
            var oldItem = items.Where((Item arg) => arg.Id == id).FirstOrDefault();
            items.Remove(oldItem);

            return await Task.FromResult(true);
        }

        public async Task<Item> GetItemAsync(string id)
        {
            return await Task.FromResult(items.FirstOrDefault(s => s.Id == id));
        }

        public async Task<IEnumerable<Item>> GetItemsAsync(bool forceRefresh = false)
        {
            return await Task.FromResult(items);
        }
    }
}