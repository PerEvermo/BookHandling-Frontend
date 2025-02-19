import { createRouter, createWebHistory } from 'vue-router'
import BookList from "@/views/BookList.vue";
import CreateBook from "@/views/CreateBook.vue";
import ManageBooks from "@/views/ManageBooks.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'BookList',
      component: BookList,
    },
    {
      path: '/create',
      name: 'CreateBook',
      component: CreateBook,
    },
    {
      path: '/manage',
      name: 'ManageBooks',
      component: ManageBooks,
    },
  ],
})

export default router
