<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-screen bg-gray-100 text-gray-900">
    <header class="bg-blue-900 text-white py-4 shadow-md">
      <div class="px-6 flex flex-col md:flex-row md:justify-between md:items-center">
        <h1 class="text-2xl font-bold text-center md:text-left">📚 Bokhantering</h1>
        <nav class="flex flex-col md:flex-row gap-2 md:gap-4 mt-2 md:mt-0">
          <RouterLink to="/" class="px-4 py-2 hover:underline">Boklista</RouterLink>
          <RouterLink to="/manage" class="px-4 py-2 hover:underline">Hantera böcker</RouterLink>
        </nav>
      </div>
    </header>


    <main class="container mx-auto p-6">
      <RouterView />
    </main>
  </div>
</template>
