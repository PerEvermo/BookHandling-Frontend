import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/vue";
import CreateBook from "@/views/CreateBook.vue";
import api from "@/services/api";

vi.mock("@/services/api", () => ({
  default: {
    post: vi.fn(),
  },
}));

describe("CreateBook.vue", () => {
  it("validerar formuläret och skickar en ny bok", async () => {
    api.post.mockResolvedValueOnce({ status: 201 });

    render(CreateBook);

    await fireEvent.update(screen.getByPlaceholderText("Ange boktitel"), "Ny Bok");
    await fireEvent.update(screen.getByPlaceholderText("Ange författare"), "Författare Test");
    await fireEvent.update(screen.getByTestId("published-date"), "2024-01-01");

    await fireEvent.click(screen.getByRole("button", { name: "Lägg till bok" }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/books", {
        title: "Ny Bok",
        author: "Författare Test",
        publishedDate: "2024-01-01",
      });
    });

    expect(screen.getByText("Boken har lagts till! ✅")).toBeInTheDocument();
  });
});
