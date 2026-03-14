<template>
  <div class="container">
    <div class="card">
      <h1>🌈 AI Mood Tracker</h1>
      <p>How's your day going?</p>
      
      <div class="input-group">
        <input 
          v-model="moodInput" 
          placeholder="e.g. Happy, stressed, excited..." 
          @keyup.enter="sendMood"
        />
        <button @click="sendMood" :disabled="loading">
          {{ loading ? 'Analyzing...' : 'Submit' }}
        </button>
      </div>

      <div v-if="aiResponse" class="response-box">
        <strong>AI Companion:</strong>
        <p>{{ aiResponse }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const moodInput = ref('')
const aiResponse = ref('')
const loading = ref(false)

const sendMood = async () => {
  if (!moodInput.value) return alert("Please enter your mood!")
  
  loading.value = true
  try {
    // Pointing to your specific Render URL from logs
    const response = await fetch('https://mood-tracker-api-80l1.onrender.com/mood', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mood: moodInput.value })
    })
    
    if (!response.ok) throw new Error("Backend connection failed")

    const data = await response.json()
    aiResponse.value = data.message
    moodInput.value = '' 
  } catch (error) {
    aiResponse.value = "Error: Check Aiven Firewall or Render logs."
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.container { display: flex; justify-content: center; align-items: center; min-height: 80vh; font-family: 'Segoe UI', sans-serif; }
.card { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); width: 100%; max-width: 400px; text-align: center; }
.input-group { margin: 20px 0; display: flex; flex-direction: column; gap: 10px; }
input { padding: 12px; border: 2px solid #eee; border-radius: 8px; font-size: 1rem; outline: none; }
input:focus { border-color: #646cff; }
button { padding: 12px; background: #646cff; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; transition: 0.3s; }
button:hover { background: #535bf2; }
button:disabled { background: #ccc; }
.response-box { margin-top: 20px; padding: 15px; background: #f9f9f9; border-left: 4px solid #646cff; border-radius: 4px; text-align: left; }
</style>