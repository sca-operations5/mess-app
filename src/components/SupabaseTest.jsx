import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function SupabaseTest() {
  const [configStatus, setConfigStatus] = useState({
    url: false,
    key: false,
    connection: false,
    error: null
  })

  useEffect(() => {
    const checkConfig = async () => {
      // Check if environment variables are loaded
      const url = import.meta.env.VITE_SUPABASE_URL
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY

      setConfigStatus(prev => ({
        ...prev,
        url: !!url,
        key: !!key
      }))

      // Test connection
      try {
        const { data, error } = await supabase.from('meal_logs').select('count').limit(1)
        if (error) throw error
        setConfigStatus(prev => ({
          ...prev,
          connection: true,
          error: null
        }))
      } catch (error) {
        setConfigStatus(prev => ({
          ...prev,
          connection: false,
          error: error.message
        }))
      }
    }

    checkConfig()
  }, [])

  return (
    <div className="p-4 space-y-2">
      <h2 className="text-lg font-bold">Supabase Configuration Status</h2>
      <div className="space-y-1">
        <p>URL Configured: {configStatus.url ? '✅' : '❌'}</p>
        <p>Key Configured: {configStatus.key ? '✅' : '❌'}</p>
        <p>Connection Test: {configStatus.connection ? '✅' : '❌'}</p>
        {configStatus.error && (
          <p className="text-red-500">Error: {configStatus.error}</p>
        )}
      </div>
    </div>
  )
} 