type Props = {
  title: string;
  price: number;
};

export function ProductCard({ title, price }: Props) {
  return (
    <div>
      <h2>{title}</h2>
      <p>{price}</p>

      <button>Add To Cart</button>
    </div>
  );
}
