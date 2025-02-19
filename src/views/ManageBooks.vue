<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <h1 class="text-3xl font-bold text-blue-900 pb-4 mb-4">Hantera Böcker</h1>

    <table class="w-full border-collapse border border-gray-300 shadow-sm">
      <thead class="bg-blue-900 text-white">
      <tr>
        <th class="border border-gray-300 px-4 py-2 text-left">Titel</th>
        <th class="border border-gray-300 px-4 py-2 text-left">Författare</th>
        <th class="border border-gray-300 px-4 py-2 text-left">Utgiven</th>
        <th class="border border-gray-300 px-4 py-2 text-left">Tillagd</th>
        <th class="border border-gray-300 px-4 py-2 text-center">Åtgärder</th>
      </tr>
      </thead>
      <tbody>
      <tr v-if="books.length === 0">
        <td colspan="5" class="text-center py-4 text-gray-500">Inga böcker hittade</td>
      </tr>
      <tr v-for="book in books" :key="book.id" class="hover:bg-gray-100">
        <td class="border border-gray-300 px-4 py-2">{{ book.title }}</td>
        <td class="border border-gray-300 px-4 py-2">{{ book.author }}</td>
        <td class="border border-gray-300 px-4 py-2">{{ formatDate(book.publishedDate) }}</td>
        <td class="border border-gray-300 px-4 py-2">{{ formatDate(book.addedDate) }}</td>
        <td class="border border-gray-300 px-4 py-2 text-center">
          <button @click="editBook(book)" class="text-blue-600 hover:text-blue-800 mr-4">✏️</button>
          <button @click="confirmDelete(book.id)" data-testid="delete-button" class="text-red-600 hover:text-red-800 ml-4">🗑️</button>
        </td>
      </tr>
      </tbody>
    </table>

    <EditBookModal v-if="editingBook" :book="editingBook" @close="editingBook = null" @update="updateBook" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "@/services/api";
import EditBookModal from "@/components/EditBookModal.vue";

const books = ref([]);
const editingBook = ref(null);

const fetchBooks = async () => {
  try {
    const response = await api.get("/books");
    books.value = response.data;
  } catch (error) {
    console.error("Kunde inte hämta böcker:", error);
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("sv-SE");
};

const editBook = (book) => {
  editingBook.value = { ...book };
};

const updateBook = (updatedBook) => {
  const index = books.value.findIndex((b) => b.id === updatedBook.id);
  if (index !== -1) books.value[index] = updatedBook;
};

const confirmDelete = async (bookId) => {
  if (!confirm("Är du säker på att du vill ta bort denna bok?")) return;

  try {
    await api.delete(`/books/${bookId}`);
    books.value = books.value.filter((b) => b.id !== bookId);
  } catch (error) {
    console.error("Kunde inte ta bort boken:", error);
  }
};

onMounted(fetchBooks);
</script>
