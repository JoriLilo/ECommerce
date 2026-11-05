import { useState } from "react";
import type { FormEvent } from "react";
import FormField from "../../components/common/FormField";
import SubmitButton from "../../components/ui/SubmitButton";
import { categories } from "./mockProducts";
import type { ProductInput } from "../../services/productService";

interface ProductFormProps {
  initial?: ProductInput;
  submitText: string;
  onSubmit: (data: ProductInput) => Promise<void>;
}

export default function ProductForm({
  initial,
  submitText,
  onSubmit,
}: ProductFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(String(initial?.price ?? ""));
  const [quantity, setQuantity] = useState(String(initial?.quantity ?? ""));
  const [categoryId, setCategoryId] = useState(
    initial?.categoryId ?? categories[0].id,
  );
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    await onSubmit({
      name,
      description,
      price: Number(price),
      quantity: Number(quantity),
      categoryId,
      imageUrl,
    });
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="checkout">
      <FormField label="Name" value={name} onChange={setName} />
      <FormField
        label="Description"
        value={description}
        onChange={setDescription}
      />
      <FormField
        label="Price"
        type="number"
        value={price}
        onChange={setPrice}
      />
      <FormField
        label="Quantity"
        type="number"
        value={quantity}
        onChange={setQuantity}
      />
      <div className="form-group">
        <label className="form-label">Category</label>
        <select
          className="form-input"
          value={categoryId}
          onChange={(e) => setCategoryId(Number(e.target.value))}
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <FormField label="Image URL" value={imageUrl} onChange={setImageUrl} />
      <SubmitButton
        loading={loading}
        text={submitText}
        loadingText="Saving..."
      />
    </form>
  );
}
