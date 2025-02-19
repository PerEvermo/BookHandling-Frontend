import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/vue";
import ManageBooks from "@/views/ManageBooks.vue";
import api from "@/services/api";

vi.mock("@/services/api", () => ({
  default: {
    get: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("ManageBooks.vue", () => {
  beforeAll(() => {
    global.confirm = vi.fn(() => true);
  });

  it("renderar listan av böcker och hanterar borttagning", async () => {
    const mockBooks = [
      { id: "550e8400-e29b-41d4-a716-446655440000", title: "Testbok", author: "Författare", publishedDate: "2024-01-01" }
    ];

    api.get.mockResolvedValueOnce({ data: mockBooks });
    api.delete.mockResolvedValueOnce({ status: 204 });

    render(ManageBooks);

    await waitFor(() => {
      expect(screen.getByText("Testbok")).toBeInTheDocument();
    });

    const deleteButton = screen.getByTestId("delete-button");
    await fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledTimes(1);
      expect(api.delete).toHaveBeenCalledWith(`/books/${mockBooks[0].id}`);
    });
  });
});
