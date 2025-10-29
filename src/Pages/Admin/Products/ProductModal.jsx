import { useState, useEffect, useMemo } from "react";
import { X, Upload, Bold, Italic, Underline, List, ListOrdered } from "lucide-react";
import { toast } from "react-toastify";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const MAX_FILES = 4;
const MAX_MB_PER_FILE = 3;
const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const ProductModal = ({ isOpen, onClose, onSubmit, categories }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: 0,
    id_category: "",
    images: [],
    featured: false,
  });

  const editor = useEditor({
    extensions: [StarterKit],
    content: form.description,
    onUpdate: ({ editor }) => {
      setForm((prev) => ({ ...prev, description: editor.getHTML() }));
    },
  });

  const previewUrls = useMemo(
    () => form.images.map((f) => URL.createObjectURL(f)),
    [form.images]
  );

  useEffect(() => {
    return () => previewUrls.forEach((url) => URL.revokeObjectURL(url));
  }, [previewUrls]);

  useEffect(() => {
    if (isOpen) {
      setIsDragging(false);
      setForm({
        name: "",
        description: "",
        price: "",
        stock: 0,
        id_category: "",
        images: [],
        featured: false,
      });
    }
  }, [isOpen]);

  const notify = (msg, type = "error") => {
    if (toast) type === "error" ? toast.error(msg) : toast.success(msg);
    else alert(msg);
  };

  const validateFiles = (files) => {
    const errors = [];
    for (const f of files) {
      if (!ACCEPTED_TYPES.includes(f.type)) errors.push(`Tipo no permitido: ${f.name}`);
      if (f.size > MAX_MB_PER_FILE * 1024 * 1024)
        errors.push(`El archivo ${f.name} supera ${MAX_MB_PER_FILE}MB`);
    }
    return errors;
  };

  const addFiles = (incoming) => {
    const current = form.images;
    const spaceLeft = MAX_FILES - current.length;
    if (incoming.length > spaceLeft) notify(`Máximo ${MAX_FILES} imágenes. Solo se tomarán ${spaceLeft}.`);
    const toAdd = Array.from(incoming).slice(0, Math.max(0, spaceLeft));
    const errors = validateFiles(toAdd);
    if (errors.length) return notify(errors.join("\n"));
    setForm((prev) => ({ ...prev, images: [...prev.images, ...toAdd] }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (name === "images") return addFiles(files);
    if (type === "checkbox") return setForm((prev) => ({ ...prev, [name]: checked }));
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const removeImageAt = (idx) =>
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.images.length === 0) return notify("Subí al menos 1 imagen.");
    const fd = new FormData();
    fd.append("name", form.name.trim());
    fd.append("description", form.description.trim());
    fd.append("price", String(form.price));
    fd.append("stock", String(form.stock));
    fd.append("id_category", form.id_category);
    fd.append("featured", String(form.featured));
    form.images.forEach((img) => fd.append("images", img));
    onSubmit(fd);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#f0e7dd] bg-opacity-60 z-50">
      <div className="bg-[#e9cbb0] rounded-lg shadow-lg w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto">
        {/* Cerrar */}
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 cursor-pointer"
          onClick={onClose}
          type="button"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold text-center text-gray-700 mb-6">
          Agregar nuevo producto
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nombre del producto"
            className="w-full p-2 border rounded bg-[#F0EFEB] focus:outline-none"
            style={{ borderColor: "#B08968" }}
            required
          />

          {/* Editor con scroll interno */}
          <div>
            <div className="flex gap-4 mb-2">
              <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} title="Negrita">
                <Bold size={18} />
              </button>
              <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} title="Cursiva">
                <Italic size={18} />
              </button>
              <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} title="Subrayado">
                <Underline size={18} />
              </button>
              <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} title="Lista sin orden">
                <List size={18} />
              </button>
              <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Lista ordenada">
                <ListOrdered size={18} />
              </button>
            </div>
            <div className="w-full p-2 border rounded bg-[#F0EFEB] max-h-40 overflow-y-auto">
              <EditorContent editor={editor} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Precio"
              step="0.01"
              className="p-2 border rounded bg-[#F0EFEB] focus:outline-none"
              style={{ borderColor: "#B08968" }}
              required
            />
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              placeholder="Stock"
              className="p-2 border rounded bg-[#F0EFEB] focus:outline-none"
              style={{ borderColor: "#B08968" }}
              required
            />
            <select
              name="id_category"
              value={form.id_category}
              onChange={handleChange}
              className="p-2 border rounded bg-[#F0EFEB] focus:border-[#B08968] focus:ring-[#B08968] focus:outline-none"
              style={{ borderColor: "#B08968" }}
              required
            >
              <option value="">Categoría</option>
              {categories?.length > 0 ? (
                categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))
              ) : (
                <option disabled>Cargando...</option>
              )}
            </select>
          </div>

          {/* Dropzone */}
          <div
            className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
              isDragging ? "border-green-600 bg-green-50" : "border-[#B08968] bg-[#F0EFEB]"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById("product-file-input")?.click()}
          >
            <Upload size={24} className="mx-auto text-gray-500 mb-2" />
            <p className="text-gray-700">
              <span className="font-medium text-green-700">Subir</span> o arrastrar imágenes aquí
            </p>
            <p className="text-xs text-gray-500 mt-1">
              JPG/PNG/WEBP • máx {MAX_MB_PER_FILE}MB c/u • hasta {MAX_FILES} imágenes
            </p>
            <input
              id="product-file-input"
              type="file"
              name="images"
              accept={ACCEPTED_TYPES.join(",")}
              multiple
              className="hidden"
              onChange={handleChange}
            />
          </div>

          {/* Previews */}
          {form.images.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mt-2">
              {form.images.map((img, i) => (
                <div key={`${img.name}-${i}`} className="relative">
                  <img src={previewUrls[i]} alt={`preview-${i}`} className="w-full h-24 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => removeImageAt(i)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <label className="flex items-center gap-2 mt-2">
            <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="w-4 h-4" />
            <span className="text-gray-700 font-medium">Destacar</span>
          </label>

          <button type="submit" className="w-full bg-[#6A994E] text-white font-bold py-2 rounded-full cursor-pointer hover:bg-green-800">
            AÑADIR
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
