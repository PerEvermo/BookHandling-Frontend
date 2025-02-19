import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/vue";
import EditBookModal from "@/components/EditBookModal.vue";
import api from "@/services/api";

vi.mock("@/services/api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("EditBookModal.vue", () => {
  it("tillåter redigering av en bok och skickar uppdateringen", async () => {
    const mockBook = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      title: "Gammal Titel",
      author: "Gammal Författare",
      publishedDate: "2023-06-15",
    };

    api.patch.mockResolvedValueOnce({ status: 200 });

    render(EditBookModal, { props: { book: mockBook } });

    await fireEvent.update(screen.getByTestId("edit-title"), "Uppdaterad Titel");
    await fireEvent.update(screen.getByTestId("edit-author"), "Uppdaterad Författare");
    await fireEvent.update(screen.getByTestId("edit-published-date"), "2024-01-01");

    await fireEvent.click(screen.getByTestId("save-button"));

    await waitFor(() => {
      expect(api.patch).toHaveBeenCalledWith(`/books/${mockBook.id}`, {
        id: mockBook.id,
        title: "Uppdaterad Titel",
        author: "Uppdaterad Författare",
        publishedDate: "2024-01-01",
      });
    });
  });
});
