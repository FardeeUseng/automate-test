import ProductCard from "@/components/ProductCard";
import { render, screen } from "@testing-library/react";
import type { Product } from "@/types";

const mockProduct: Product = {
  id: 1,
  name: "Macbook",
  description: "A laptop",
  price: 50000,
  image: "/test.jpg",
  stock: 10,
  category: "electronics",
};

describe("ProductCard", () => {
  it("renders product info", () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByTestId("product-name")).toHaveTextContent("Macbook");
    expect(screen.getByTestId("product-price")).toHaveTextContent("฿50,000");
  });

  it("renders add to cart button", () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByTestId("add-to-cart-btn")).toBeInTheDocument();
  });
});
