<template>
  <div class="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
    <h1 class="text-3xl font-bold text-blue-900 pb-4 mb-4">Lägg till en ny bok</h1>

    <form @submit.prevent="addBook" class="flex flex-col gap-4">
      <div>
        <label for="title" class="block text-gray-700 font-bold">Titel</label>
        <input
          v-model="title"
          type="text"
          placeholder="Ange boktitel"
          class="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-blue-300"
          :class="{'border-red-500': errors.title}"
          @blur="validateField('title')"
        />
        <p v-if="errors.title" class="text-red-500 text-sm mt-1">{{ errors.title }}</p>
      </div>

      <div>
        <label for="author" class="block text-gray-700 font-bold">Författare</label>
        <input
          v-model="author"
          type="text"
          placeholder="Ange författare"
          class="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-blue-300"
          :class="{'border-red-500': errors.author}"
          @blur="validateField('author')"
        />
        <p v-if="errors.author" class="text-red-500 text-sm mt-1">{{ errors.author }}</p>
      </div>

      <div>
        <label for="publishedDate" class="block text-gray-700 font-bold">Publiceringsdatum</label>
        <input
          v-model="publishedDate"
          type="date"
          data-testid="published-date"
          :max="today"
          class="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-blue-300"
          :class="{'border-red-500': errors.publishedDate}"
          @blur="validateField('publishedDate')"
        />
        <p v-if="errors.publishedDate" class="text-red-500 text-sm mt-1">{{ errors.publishedDate }}</p>
      </div>

      <button
        type="submit"
        :disabled="!isValidForm"
        class="w-full px-4 py-2 rounded transition duration-300"
        :class="isValidForm ? 'bg-blue-900 text-white hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'"
      >
        Lägg till bok
      </button>
    </form>

    <p v-if="successMessage" class="text-green-600 pt-4">{{ successMessage }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import api from "@/services/api";

const title = ref("");
const author = ref("");
const publishedDate = ref("");
const successMessage = ref("");
const today = ref(new Date().toISOString().split("T")[0]);
const errors = ref({});

const titleRegex = /^[a-zA-ZåäöÅÄÖ0-9 .,'-]+$/;
const authorRegex = /^[a-zA-ZåäöÅÄÖ .,'-]+$/;

const validateField = (field) => {
  if (field === "title") {
    if (!title.value.trim()) {
      errors.value.title = "Titel är obligatorisk.";
    } else if (!titleRegex.test(title.value)) {
      errors.value.title = "Titel innehåller otillåtna tecken.";
    } else {
      delete errors.value.title;
    }
  }

  if (field === "author") {
    if (!author.value.trim()) {
      errors.value.author = "Författare är obligatorisk.";
    } else if (!authorRegex.test(author.value)) {
      errors.value.author = "Författarnamn får endast innehålla bokstäver, mellanslag, punkt, apostrof och bindestreck.";
    } else {
      delete errors.value.author;
    }
  }

  if (field === "publishedDate") {
    if (!publishedDate.value) {
      errors.value.publishedDate = "Publiceringsdatum måste anges.";
    } else {
      delete errors.value.publishedDate;
    }
  }
};

const isValidForm = computed(() => {
  return title.value.trim() !== "" &&
    author.value.trim() !== "" &&
    publishedDate.value !== "" &&
    Object.keys(errors.value).length === 0;
});

const addBook = async () => {
  validateField("title");
  validateField("author");
  validateField("publishedDate");

  if (Object.keys(errors.value).length > 0) return;

  try {
    await api.post("/books", {
      title: title.value,
      author: author.value,
      publishedDate: publishedDate.value,
    });

    successMessage.value = "Boken har lagts till! ✅";
    title.value = "";
    author.value = "";
    publishedDate.value = "";
    errors.value = {};

    setTimeout(() => (successMessage.value = ""), 4000);
  } catch (error) {
    console.error("Kunde inte lägga till bok:", error);
  }
};
</script>
