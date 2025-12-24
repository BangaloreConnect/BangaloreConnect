// _sdk/data_sdk.js

// 1. Paste your Supabase details here
const SUPABASE_URL = 'YOUR_SUPABASE_PROJECT_URL';
const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY';

window.dataSdk = {
    handlers: [],
    
    async init(handler) {
        this.handlers.push(handler);
        await this.fetchData();
    },

    async fetchData() {
        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/jobs?select=*&order=posted_date.desc`, {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
            });
            const data = await response.json();
            this.handlers.forEach(h => h.onDataChanged(data));
            return { isOk: true };
        } catch (error) {
            console.error("Fetch error:", error);
            return { isOk: false };
        }
    },

    async create(jobData) {
        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/jobs`, {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify(jobData)
            });
            
            if (response.ok) {
                await this.fetchData(); // Refresh the list
                return { isOk: true };
            }
            return { isOk: false };
        } catch (error) {
            console.error("Create error:", error);
            return { isOk: false };
        }
    }
};