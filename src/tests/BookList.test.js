import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/vue";
import BookList from "@/views/BookList.vue";
import api from "@/services/api";

vi.mock("@/services/api", () => ({
    default: {
        get: vi.fn(),
    },
}));

describe("BookList.vue", () => {
    it("renderar en lista med böcker", async () => {
        const mockBooks = [
            { id: "550e8400-e29b-41d4-a716-446655440000", title: "Bok 1", author: "Författare 1", publishedDate: "2024-01-01" },
            { id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8", title: "Bok 2", author: "Författare 2", publishedDate: "2023-06-15" }
        ];

        api.get.mockResolvedValueOnce({ data: mockBooks });

        render(BookList);

        await waitFor(() => {
            for (const book of mockBooks) {
                expect(screen.getByText(book.title)).toBeInTheDocument();
                expect(screen.getByText(book.author)).toBeInTheDocument();
            }
        });
    });

    it("visar ett meddelande om inga böcker finns", async () => {
        api.get.mockResolvedValueOnce({ data: [] });

        render(BookList);

        await waitFor(() => {
            expect(screen.getByTestId("no-books-message")).toBeInTheDocument();
        });
    });
});
