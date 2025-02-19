<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-screen bg-gray-100 text-gray-900">
    <header class="bg-blue-900 text-white py-4 shadow-md">
      <div class="flex justify-between items-center px-6">
        <h1 class="text-2xl font-bold">📚 Bokhantering</h1>
        <nav>
          <RouterLink to="/" class="px-4 py-2 hover:underline">Boklista</RouterLink>
          <RouterLink to="/create" class="px-4 py-2 hover:underline">Lägg till bok</RouterLink>
          <RouterLink to="/manage" class="px-4 py-2 hover:underline">Hantera böcker</RouterLink>
        </nav>
      </div>
    </header>

    <main class="container mx-auto p-6">
      <RouterView />
    </main>
  </div>
</template>
