<template>
  <div class="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-sm">
    <div class="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
      <h2 class="text-2xl font-bold text-blue-900 mb-4">Redigera Bok</h2>

      <form @submit.prevent="saveChanges" class="flex flex-col gap-4">
        <div>
          <label class="block text-gray-700 font-bold">Titel</label>
          <input
            v-model="editedBook.title"
            type="text"
            data-testid="edit-title"
            class="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-blue-300"
            :class="{ 'border-red-500': errors.title }"
            @blur="validateField('title')"
          />
          <p v-if="errors.title" class="text-red-500 text-sm mt-1">{{ errors.title }}</p>
        </div>

        <div>
          <label class="block text-gray-700 font-bold">Författare</label>
          <input
            v-model="editedBook.author"
            type="text"
            data-testid="edit-author"
            class="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-blue-300"
            :class="{ 'border-red-500': errors.author }"
            @blur="validateField('author')"
          />
          <p v-if="errors.author" class="text-red-500 text-sm mt-1">{{ errors.author }}</p>
        </div>

        <div>
          <label class="block text-gray-700 font-bold">Publiceringsdatum</label>
          <input
            v-model="editedBook.publishedDate"
            type="date"
            data-testid="edit-published-date"
            :max="today"
            class="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-blue-300"
            :class="{ 'border-red-500': errors.publishedDate }"
            @blur="validateField('publishedDate')"
          />
          <p v-if="errors.publishedDate" class="text-red-500 text-sm mt-1">{{ errors.publishedDate }}</p>
        </div>

        <div class="flex justify-between gap-4 mt-4">
          <button type="button" @click="closeModal" class="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition">
            Avbryt
          </button>
          <button type="submit" :disabled="!isValidForm" data-testid="save-button" class="px-4 py-2 rounded transition duration-300"
                  :class="isValidForm ? 'bg-blue-900 text-white hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'">
            Spara ändringar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits, onMounted } from "vue";
import api from "@/services/api";

const props = defineProps({ book: Object });
const emit = defineEmits(["close", "update"]);
const editedBook = ref({});
const originalBook = ref({});
const today = ref(new Date().toISOString().split("T")[0]);
const errors = ref({});

const titleRegex = /^[a-zA-ZåäöÅÄÖ0-9 .,'-]+$/;
const authorRegex = /^[a-zA-ZåäöÅÄÖ .,'-]+$/;

const validateField = (field) => {
  if (field === "title") {
    if (!editedBook.value.title?.trim()) {
      errors.value.title = "Titel är obligatorisk.";
    } else if (!titleRegex.test(editedBook.value.title)) {
      errors.value.title = "Titel innehåller otillåtna tecken.";
    } else {
      delete errors.value.title;
    }
  }

  if (field === "author") {
    if (!editedBook.value.author?.trim()) {
      errors.value.author = "Författare är obligatorisk.";
    } else if (!authorRegex.test(editedBook.value.author)) {
      errors.value.author = "Författarnamn får endast innehålla bokstäver, mellanslag, punkt, apostrof och bindestreck.";
    } else {
      delete errors.value.author;
    }
  }

  if (field === "publishedDate") {
    if (!editedBook.value.publishedDate) {
      errors.value.publishedDate = "Publiceringsdatum måste anges.";
    } else {
      delete errors.value.publishedDate;
    }
  }
};

const isFormModified = computed(() => {
  return (
    editedBook.value.title !== originalBook.value.title ||
    editedBook.value.author !== originalBook.value.author ||
    editedBook.value.publishedDate !== originalBook.value.publishedDate
  );
});

const isValidForm = computed(() => {
  return (
    editedBook.value.title?.trim() !== "" &&
    editedBook.value.author?.trim() !== "" &&
    editedBook.value.publishedDate !== "" &&
    Object.keys(errors.value).length === 0 &&
    isFormModified.value
  );
});

const saveChanges = async () => {
  validateField("title");
  validateField("author");
  validateField("publishedDate");

  if (!isValidForm.value) return;

  try {
    await api.patch(`/books/${editedBook.value.id}`, editedBook.value);
    emit("update", { ...editedBook.value });
    closeModal();
  } catch (error) {
    console.error("Kunde inte spara ändringar:", error);
  }
};

const closeModal = () => {
  emit("close");
};

const formattedDate = (dateString) => {
  return dateString ? new Date(dateString).toISOString().split("T")[0] : "";
};

onMounted(() => {
  if (props.book) {
    editedBook.value = { ...props.book, publishedDate: formattedDate(props.book.publishedDate) };
    originalBook.value = { ...props.book, publishedDate: formattedDate(props.book.publishedDate) };
  }
});
</script>
