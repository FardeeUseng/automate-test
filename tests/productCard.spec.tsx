import { ProductCard } from "@/components/ProductCard";
import { render, screen } from "@testing-library/react";

describe("ProductCard", () => {
  it("renders product info", () => {
    render(<ProductCard title="Macbook" price={50000} />);

    expect(screen.getByText("Macbook")).toBeInTheDocument();

    expect(screen.getByText("50000")).toBeInTheDocument();
  });

  it("renders add to cart button", () => {
    render(<ProductCard title="Macbook" price={50000} />);

    expect(
      screen.getByRole("button", {
        name: /add to cart/i,
      }),
    ).toBeInTheDocument();
  });
});
