<template>
  <div class="container">
    <h1>AI Mood Tracker</h1>
    <p>How are you feeling today?</p>
    
    <div class="input-group">
      <input v-model="moodInput" placeholder="Enter your mood..." @keyup.enter="sendMood" />
      <button @click="sendMood" :disabled="loading">
        {{ loading ? 'Asking AI...' : 'Submit' }}
      </button>
    </div>

    <div v-if="aiResponse" class="response-box">
      <strong>AI Response:</strong>
      <p>{{ aiResponse }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const moodInput = ref('')
const aiResponse = ref('')
const loading = ref(false)

const sendMood = async () => {
  if (!moodInput.value) return alert("Please type something!")
  
  loading.value = true
  try {
    // Note: Change this URL to your Render URL after you deploy the backend!
    const response = await fetch('http://localhost:3000/mood', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mood: moodInput.value })
    })
    
    const data = await response.json()
    aiResponse.value = data.message
    moodInput.value = '' // Clear input
  } catch (error) {
    aiResponse.value = "Error: Is your backend running?"
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.container { max-width: 500px; margin: 50px auto; text-align: center; font-family: sans-serif; }
.input-group { margin-bottom: 20px; }
input { padding: 10px; width: 60%; border: 1px solid #ccc; border-radius: 4px; }
button { padding: 10px 20px; background-color: #42b883; color: white; border: none; border-radius: 4px; cursor: pointer; }
button:disabled { background-color: #999; }
.response-box { padding: 20px; background: #f0fdf4; border: 1px solid #42b883; border-radius: 8px; }
</style>