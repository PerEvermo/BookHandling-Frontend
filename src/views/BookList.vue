<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-3xl font-bold text-blue-900">Boklista</h1>
      <RouterLink to="/create" class="px-4 py-2 rounded transition duration-300 bg-blue-900 text-white hover:bg-blue-700">Lägg till bok</RouterLink>
    </div>
    <table id="desktop" class="hidden lg:table w-full border-collapse border border-gray-300 shadow-sm">
      <thead class="bg-blue-900 text-white">
      <tr>
        <th @click="sortBy('title')"
            class="border border-gray-300 px-4 py-2 text-left cursor-pointer">
          Titel
          <span v-if="sortColumn === 'title'">{{ sortDirection === 'asc' ? ' 🔼' : ' 🔽' }}</span>
        </th>
        <th @click="sortBy('author')"
            class="border border-gray-300 px-4 py-2 text-left cursor-pointer">
          Författare
          <span v-if="sortColumn === 'author'">{{ sortDirection === 'asc' ? ' 🔼' : ' 🔽' }}</span>
        </th>
        <th @click="sortBy('publishedDate')"
            class="border border-gray-300 px-4 py-2 text-left cursor-pointer">
          Utgiven
          <span v-if="sortColumn === 'publishedDate'">{{ sortDirection === 'asc' ? ' 🔼' : ' 🔽' }}</span>
        </th>
        <th @click="sortBy('addedDate')"
            class="border border-gray-300 px-4 py-2 text-left cursor-pointer">
          Tillagd
          <span v-if="sortColumn === 'addedDate'">{{ sortDirection === 'asc' ? ' 🔼' : ' 🔽' }}</span>
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-if="sortedBooks.length === 0">
        <td colspan="4" class="text-center py-4 text-gray-500" data-testid="no-books-message">
          Inga böcker hittade
        </td>
      </tr>
      <tr v-for="book in sortedBooks" :key="book.id" class="hover:bg-gray-100">
        <td class="border border-gray-300 px-4 py-2">{{ book.title }}</td>
        <td class="border border-gray-300 px-4 py-2">{{ book.author }}</td>
        <td class="border border-gray-300 px-4 py-2">{{ formatDate(book.publishedDate) }}</td>
        <td class="border border-gray-300 px-4 py-2">{{ formatDate(book.addedDate) }}</td>
      </tr>
      </tbody>
    </table>
    <div id="mobile" class="mt-6 space-y-4 lg:hidden">
      <template v-if="sortedBooks.length > 0">
        <div v-for="book in sortedBooks" :key="book.id" class="rounded-lg bg-white p-4 shadow-md border border-gray-300">
          <p class="text-sm font-medium text-gray-900">
            <strong>Titel:</strong> {{ book.title }}
          </p>
          <p class="mt-1 text-sm text-gray-700">
            <strong>Författare:</strong> {{ book.author }}
          </p>
          <p class="mt-1 text-sm text-gray-700">
            <strong>Utgiven:</strong> {{ formatDate(book.publishedDate) }}
          </p>
          <p class="mt-1 text-sm text-gray-700">
            <strong>Tillagd:</strong> {{ formatDate(book.addedDate) }}
          </p>
        </div>
      </template>
      <div v-else class="text-center text-gray-500">
        Inga böcker hittade
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from "vue";
import api from "@/services/api";

const books = ref([]);
const sortColumn = ref("");
const sortDirection = ref("asc");

const fetchBooks = async () => {
  try {
    const response = await api.get("/books");
    books.value = response.data;
  } catch (error) {
    console.error("Kunde inte hämta böcker:", error);
  }
};

const sortBy = (column) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortColumn.value = column;
    sortDirection.value = "asc";
  }
};

const sortedBooks = computed(() => {
  if (!sortColumn.value) return books.value;

  return [...books.value].sort((a, b) => {
    const aValue = a[sortColumn.value];
    const bValue = b[sortColumn.value];

    if (aValue < bValue) return sortDirection.value === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection.value === "asc" ? 1 : -1;
    return 0;
  });
});

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("sv-SE");
};

onMounted(fetchBooks);
</script>
