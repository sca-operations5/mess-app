import { supabase } from './supabase'

// Meal Log Operations
export const mealLogService = {
  async addMealLog(mealData) {
    const { data, error } = await supabase
      .from('meal_logs')
      .insert([mealData])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async getMealLogs() {
    const { data, error } = await supabase
      .from('meal_logs')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async updateMealLog(id, updates) {
    const { data, error } = await supabase
      .from('meal_logs')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  async deleteMealLog(id) {
    const { error } = await supabase
      .from('meal_logs')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Inventory Operations
export const inventoryService = {
  async addItem(itemData) {
    const { data, error } = await supabase
      .from('inventory')
      .insert([itemData])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async getInventory() {
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .order('name', { ascending: true })
    
    if (error) throw error
    return data
  },

  async updateItem(id, updates) {
    const { data, error } = await supabase
      .from('inventory')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  async deleteItem(id) {
    const { error } = await supabase
      .from('inventory')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Purchase Operations
export const purchaseService = {
  async addPurchase(purchaseData) {
    const { data, error } = await supabase
      .from('purchases')
      .insert([purchaseData])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async getPurchases() {
    const { data, error } = await supabase
      .from('purchases')
      .select('*')
      .order('purchase_date', { ascending: false })
    
    if (error) throw error
    return data
  },

  async updatePurchase(id, updates) {
    const { data, error } = await supabase
      .from('purchases')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  async deletePurchase(id) {
    const { error } = await supabase
      .from('purchases')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
} 