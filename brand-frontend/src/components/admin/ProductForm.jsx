import { useState, useEffect } from "react";
import { API } from "../../api";
import ImageUpload from "./ImageUpload";

const STANDARD_SIZE_OPTIONS = [
  // Alpha sizes
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "XXXL",
  // Numeric (common Indian sizing)
  "28",
  "30",
  "32",
  "34",
  "36",
  "38",
  "40",
  "42",
  "44",
  "46",
  // Generic / one-size
  "Free Size",
];

export default function ProductForm({ product, categories, brands = [], onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    details: "",
    specifications: "",
    careInstructions: "",
    returnPolicy: "",
    badge: "",
    isNew: false,
    isTrending: false,
    categoryId: "",
    keywords: "",
  });
  const [selectedSizeLabels, setSelectedSizeLabels] = useState([]);
  const [priceInfo, setPriceInfo] = useState({ mrp: "", marketPrice: "", price: "" });
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        details: product.details || "",
        specifications: product.specifications || "",
        careInstructions: product.careInstructions || "",
        returnPolicy: product.returnPolicy || "",
        badge: product.badge || "",
        isNew: product.isNew || false,
        isTrending: product.isTrending || false,
        categoryId: product.categoryId || "",
        keywords: product.keywords ? (Array.isArray(product.keywords) ? product.keywords.join(", ") : product.keywords) : "",
      });
      const existingLabels = Array.isArray(product.sizes) ? product.sizes.map((s) => s.label).filter(Boolean) : [];
      setSelectedSizeLabels(existingLabels);
      const first = Array.isArray(product.sizes) && product.sizes.length > 0 ? product.sizes[0] : null;
      setPriceInfo({
        mrp: first?.mrp ?? "",
        marketPrice: first?.marketPrice ?? "",
        price: first?.price ?? "",
      });
      setExistingImages(product.images || []);
      setSelectedBrands(
        product.brands && product.brands.length > 0
          ? product.brands.map((b) => b.id)
          : []
      );
    } else {
      // Reset form
      setFormData({
        name: "",
        description: "",
        details: "",
        specifications: "",
        careInstructions: "",
        returnPolicy: "",
        badge: "",
        isNew: false,
        isTrending: false,
        categoryId: "",
        keywords: "",
      });
      setSelectedSizeLabels([]);
      setPriceInfo({ mrp: "", marketPrice: "", price: "" });
      setImages([]);
      setExistingImages([]);
      setSelectedBrands([]);
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!selectedSizeLabels.length) {
        alert("Please select at least one size.");
        return;
      }
      if (!priceInfo.price) {
        alert("Please enter Our Price.");
        return;
      }

      const token = localStorage.getItem("adminToken");
      const formDataToSend = new FormData();

      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("details", formData.details);
      formDataToSend.append("specifications", formData.specifications);
      formDataToSend.append("careInstructions", formData.careInstructions);
      formDataToSend.append("returnPolicy", formData.returnPolicy);
      formDataToSend.append("badge", formData.badge);
      formDataToSend.append("isNew", formData.isNew);
      formDataToSend.append("isTrending", formData.isTrending);
      formDataToSend.append("categoryId", formData.categoryId);
      formDataToSend.append("keywords", JSON.stringify(formData.keywords.split(",").map((k) => k.trim()).filter(k => k)));
      // Backend expects per-size pricing; since price is independent of size,
      // we duplicate the same pricing for each selected size.
      formDataToSend.append(
        "sizes",
        JSON.stringify(
          selectedSizeLabels.map((label) => ({
            label,
            price: priceInfo.price,
            marketPrice: priceInfo.marketPrice,
            mrp: priceInfo.mrp,
          }))
        )
      );
      formDataToSend.append("brandIds", JSON.stringify(selectedBrands));

      if (product && existingImages.length > 0) {
        formDataToSend.append("existingImages", JSON.stringify(existingImages));
      }

      images.forEach((file) => {
        formDataToSend.append("images", file);
      });

      const url = product ? `${API}/products/${product.id}` : `${API}/products`;
      const method = product ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const data = await res.json();

      if (res.ok) {
        alert(product ? "Product updated successfully!" : "Product created successfully!");
        onSave();
        // Reset form
        setFormData({
          name: "",
          description: "",
          details: "",
          specifications: "",
          careInstructions: "",
          returnPolicy: "",
          badge: "",
          isNew: false,
          isTrending: false,
          categoryId: "",
          keywords: "",
        });
        setSelectedSizeLabels([]);
        setPriceInfo({ mrp: "", marketPrice: "", price: "" });
        setImages([]);
        setExistingImages([]);
        setSelectedBrands([]);
      } else {
        alert("Error: " + (data.error || data.message || "Failed to save product"));
      }
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const allSizeOptions = (() => {
    const custom = selectedSizeLabels.filter((l) => l && !STANDARD_SIZE_OPTIONS.includes(l));
    // de-dupe while preserving order
    const uniq = [];
    [...custom, ...STANDARD_SIZE_OPTIONS].forEach((v) => {
      if (!uniq.some((x) => String(x).toLowerCase() === String(v).toLowerCase())) uniq.push(v);
    });
    return uniq;
  })();

  return (
    <div
      className="rounded-xl shadow-md p-6 mb-6 border"
      style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
    >
      <h2 className="text-xl font-bold mb-6" style={{ color: "var(--foreground)" }}>
        {product ? "✏️ Edit Product" : "➕ Add New Product"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: "var(--foreground)" }}>
              Product Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 border rounded-lg focus:outline-none transition"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
              onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: "var(--foreground)" }}>
              Category *
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-4 py-2.5 border rounded-lg focus:outline-none transition"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
              onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: "var(--foreground)" }}>
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2.5 border rounded-lg focus:outline-none transition"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
            onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            rows="4"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: "var(--foreground)" }}>
              Product Details (optional)
            </label>
            <textarea
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              className="w-full px-4 py-2.5 border rounded-lg focus:outline-none transition"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
              onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              rows="4"
              placeholder="Write extra product details. You can use new lines."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: "var(--foreground)" }}>
              Specifications (optional)
            </label>
            <textarea
              value={formData.specifications}
              onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
              className="w-full px-4 py-2.5 border rounded-lg focus:outline-none transition"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
              onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              rows="4"
              placeholder="Example:\nFabric: Cotton\nFit: Regular\nCountry: India"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: "var(--foreground)" }}>
              Care Instructions (optional)
            </label>
            <textarea
              value={formData.careInstructions}
              onChange={(e) => setFormData({ ...formData, careInstructions: e.target.value })}
              className="w-full px-4 py-2.5 border rounded-lg focus:outline-none transition"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
              onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              rows="4"
              placeholder="Example:\nMachine wash cold\nDo not bleach\nDry in shade"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: "var(--foreground)" }}>
              Return & Refund Policy (optional)
            </label>
            <textarea
              value={formData.returnPolicy}
              onChange={(e) => setFormData({ ...formData, returnPolicy: e.target.value })}
              className="w-full px-4 py-2.5 border rounded-lg focus:outline-none transition"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
              onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              rows="4"
              placeholder="Write your return/refund policy."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: "var(--foreground)" }}>
              Badge (e.g., 60 Min Delivery)
            </label>
            <input
              type="text"
              value={formData.badge}
              onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
              className="w-full px-4 py-2.5 border rounded-lg focus:outline-none transition"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
              onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              placeholder="Optional"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: "var(--foreground)" }}>
              Keywords (comma separated)
            </label>
            <input
              type="text"
              value={formData.keywords}
              onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
              className="w-full px-4 py-2.5 border rounded-lg focus:outline-none transition"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
              onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              placeholder="gift, present, paisa"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: "var(--foreground)" }}>
              Options
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isNew}
                  onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: "var(--primary)" }}
                />
                <span className="text-sm" style={{ color: "var(--foreground)", opacity: 0.85 }}>New Arrival</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isTrending}
                  onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: "var(--primary)" }}
                />
                <span className="text-sm" style={{ color: "var(--foreground)", opacity: 0.85 }}>Trending</span>
              </label>
            </div>
          </div>
        </div>

        {brands.length > 0 && (
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: "var(--foreground)" }}>
              Brands
            </label>
            <div
              className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border rounded-lg"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
            >
              {brands.filter(b => b.isActive).map((brand) => (
                <label
                  key={brand.id}
                  className="flex items-center gap-2 cursor-pointer p-2 rounded transition"
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--secondary)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedBrands([...selectedBrands, brand.id]);
                      } else {
                        setSelectedBrands(selectedBrands.filter(id => id !== brand.id));
                      }
                    }}
                    className="w-4 h-4 rounded"
                    style={{ accentColor: "var(--primary)" }}
                  />
                  <span className="text-sm" style={{ color: "var(--foreground)", opacity: 0.85 }}>{brand.name}</span>
                </label>
              ))}
            </div>
            {selectedBrands.length === 0 && (
              <p className="text-xs mt-2" style={{ color: "var(--foreground)", opacity: 0.6 }}>
                Select brands this product belongs to (optional)
              </p>
            )}
          </div>
        )}

        <ImageUpload
          images={images}
          existingImages={existingImages}
          onImagesChange={setImages}
          onExistingImagesChange={setExistingImages}
        />

        <div className="border-t pt-6" style={{ borderColor: "var(--border)" }}>
          <label className="block text-sm font-semibold mb-3" style={{ color: "var(--foreground)" }}>
            Sizes Available *
          </label>
          <div className="flex flex-wrap gap-2">
            {allSizeOptions.map((opt) => {
              const active = selectedSizeLabels.some((v) => String(v).toLowerCase() === String(opt).toLowerCase());
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setSelectedSizeLabels((prev) => {
                      const exists = prev.some((v) => String(v).toLowerCase() === String(opt).toLowerCase());
                      if (exists) return prev.filter((v) => String(v).toLowerCase() !== String(opt).toLowerCase());
                      return [...prev, opt];
                    });
                  }}
                  className="px-4 py-2 rounded-full border text-sm font-semibold transition-all"
                  style={{
                    borderColor: active ? "var(--primary)" : "var(--border)",
                    backgroundColor: active ? "var(--secondary)" : "var(--background)",
                    color: active ? "var(--primary)" : "var(--foreground)",
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          <p className="text-xs mt-2" style={{ color: "var(--foreground)", opacity: 0.65 }}>
            Click to select/unselect sizes. Pricing is set once for the product.
          </p>
        </div>

        <div className="border-t pt-6" style={{ borderColor: "var(--border)" }}>
          <label className="block text-sm font-semibold mb-4" style={{ color: "var(--foreground)" }}>
            Product Price *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: "var(--foreground)", opacity: 0.75 }}>
                MRP
              </label>
              <input
                type="number"
                placeholder="MRP (optional)"
                value={priceInfo.mrp}
                onChange={(e) => setPriceInfo({ ...priceInfo, mrp: e.target.value })}
                className="w-full px-4 py-2.5 border rounded-lg focus:outline-none transition"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--card)", color: "var(--foreground)" }}
                onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                step="0.01"
                min="0"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: "var(--foreground)", opacity: 0.75 }}>
                Market Price
              </label>
              <input
                type="number"
                placeholder="Market Price (optional)"
                value={priceInfo.marketPrice}
                onChange={(e) => setPriceInfo({ ...priceInfo, marketPrice: e.target.value })}
                className="w-full px-4 py-2.5 border rounded-lg focus:outline-none transition"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--card)", color: "var(--foreground)" }}
                onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                step="0.01"
                min="0"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: "var(--foreground)", opacity: 0.75 }}>
                Our Price *
              </label>
              <input
                type="number"
                placeholder="Our Price (Selling Price)"
                value={priceInfo.price}
                onChange={(e) => setPriceInfo({ ...priceInfo, price: e.target.value })}
                className="w-full px-4 py-2.5 border rounded-lg focus:outline-none transition"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--card)", color: "var(--foreground)" }}
                onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
            style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
          >
            {loading ? "Saving..." : product ? "Update Product" : "Create Product"}
          </button>
          {product && (
            <button
              type="button"
              onClick={() => {
                setEditingProduct(null);
                setFormData({
                  name: "",
                  description: "",
                  details: "",
                  specifications: "",
                  careInstructions: "",
                  returnPolicy: "",
                  badge: "",
                  isNew: false,
                  isTrending: false,
                  categoryId: "",
                  keywords: "",
                });
                setSelectedSizeLabels([]);
                setPriceInfo({ mrp: "", marketPrice: "", price: "" });
                setImages([]);
                setExistingImages([]);
              }}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
