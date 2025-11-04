
import { useEffect, useState, useMemo } from "react";
import { X, Upload, Bold, Italic, Underline, List, ListOrdered } from "lucide-react";
import ConfirmModal from "../../../Components/ConfirmModal.jsx";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const EditProductModal = ({ isOpen, onClose, onSubmit, product = {}, categories = [] }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: 0,
    featured: false,
    id_category: "",
    images: [],        // nuevas imágenes { file, preview }
    removeImages: [],  // ids de imágenes a eliminar
  });
  const [imageLimitModal, setImageLimitModal] = useState(false);
  const [selectedMainImageId, setSelectedMainImageId] = useState(null); // puede ser uuid o "new-0"/"new-1"
  const [isDragging, setIsDragging] = useState(false);

  // Inicializar formulario cuando se abre
  useEffect(() => {
    if (isOpen && product) {
      setForm({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        stock: product.stock ?? 0,
        featured: product.featured || false,
        id_category: product.id_category || "",
        images: [],
        removeImages: [],
      });

      // marcar la principal existente (si existe)
      const main = product.images?.find(img => img.is_main || img.es_principal || img.isMain);
      setSelectedMainImageId(main?.id ?? null);
      editor.commands.setContent(product.description || "");
    }
  }, [isOpen, product]);

  const editor = useEditor({
    extensions: [StarterKit],
    content: form.description,
    onUpdate: ({ editor }) => setForm(prev => ({ ...prev, description: editor.getHTML() })),
  });

  const previewUrls = useMemo(
    () => form.images.map((f) => URL.createObjectURL(f.file || f)),
    [form.images]
  );

  useEffect(() => {
    return () => previewUrls.forEach((url) => URL.revokeObjectURL(url));
  }, [previewUrls]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === "images") return handleImageSelect({ target: { files } });
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const existing = (product.images || []).filter(img => !form.removeImages.includes(img.id)).length;
    const total = form.images.length + existing + files.length;
    if (total > 5) { setImageLimitModal(true); return; }

    const newImages = files.map(file => ({ file, preview: URL.createObjectURL(file) }));
    setForm(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
  };

  const handleRemoveNewImage = (index) => {
    setForm(prev => {
      const copy = [...prev.images];
      URL.revokeObjectURL(copy[index].preview);
      copy.splice(index, 1);
      return { ...prev, images: copy };
    });
    if (selectedMainImageId === `new-${index}`) setSelectedMainImageId(null);
  };

  const handleRemoveImage = (imgId) => {
    setForm(prev => ({ ...prev, removeImages: [...prev.removeImages, imgId] }));
    if (selectedMainImageId === imgId) setSelectedMainImageId(null);
  };

  const handleSelectMainImage = (id) => setSelectedMainImageId(id);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"));
    handleImageSelect({ target: { files } });
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("stock", form.stock);
    formData.append("id_category", form.id_category);
    formData.append("featured", form.featured);
    formData.append("removeImages", JSON.stringify(form.removeImages));
    form.images.forEach(img => formData.append("images", img.file));
    if (selectedMainImageId != null) {
      if (typeof selectedMainImageId === "string" && selectedMainImageId.startsWith("new-")) {
        formData.append("mainNewIndex", parseInt(selectedMainImageId.replace("new-", ""), 10));
      } else {
        formData.append("mainImageId", selectedMainImageId);
      }
    }
    onSubmit(product.id, formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#f0e7dd] bg-opacity-40 p-4">
        <div className="bg-[#e9cbb0] rounded-lg shadow-lg w-full max-w-4xl flex flex-col overflow-hidden max-h-[90vh]">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Editar Producto</h2>
            <button onClick={onClose} aria-label="Cerrar"><X size={20} /></button>
          </div>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 overflow-y-auto">
            {/* Formulario */}
            <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-gray-700 font-medium">Nombre</span>
                  <input type="text" name="name" value={form.name} onChange={handleChange}
                         className="w-full p-2 border rounded bg-[#F0EFEB]" required />
                </label>

                <label className="block">
                  <span className="text-gray-700 font-medium">Precio</span>
                  <input type="number" name="price" value={form.price} onChange={handleChange} step="0.01"
                         className="w-full p-2 border rounded bg-[#F0EFEB]" required />
                </label>
              </div>

              {/* Editor TipTap */}
              <label className="block">
                <span className="text-gray-700 font-medium">Descripción</span>
                <div className="flex gap-2 my-2">
                  <button type="button" onClick={() => editor.chain().focus().toggleBold().run()}
                          className={`p-1 rounded cursor-pointer ${editor?.isActive("bold") ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"}`} title="Negrita">
                    <Bold size={18} />
                  </button>
                  <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()}
                          className={`p-1 rounded cursor-pointer ${editor?.isActive("italic") ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"}`} title="Cursiva">
                    <Italic size={18} />
                  </button>
                  <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()}
                          className={`p-1 rounded cursor-pointer ${editor?.isActive("underline") ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"}`} title="Subrayado">
                    <Underline size={18} />
                  </button>
                  <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()}
                          className={`p-1 rounded cursor-pointer ${editor?.isActive("bulletList") ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"}`} title="Lista sin orden">
                    <List size={18} />
                  </button>
                  <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()}
                          className={`p-1 rounded cursor-pointer ${editor?.isActive("orderedList") ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"}`} title="Lista ordenada">
                    <ListOrdered size={18} />
                  </button>
                </div>
                <div className="w-full p-2 border rounded bg-[#F0EFEB] max-h-40 overflow-y-auto">
                  <EditorContent editor={editor} />
                </div>
              </label>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <label className="block">
                  <span className="text-gray-700 font-medium">Stock</span>
                  <input type="number" name="stock" value={form.stock} onChange={handleChange} className="w-full p-2 border rounded bg-[#F0EFEB]" required />
                </label>

                <label className="block">
                  <span className="text-gray-700 font-medium">Categoría</span>
                  <select name="id_category" value={form.id_category} onChange={handleChange} className="w-full p-2 border cursor-pointer rounded bg-[#F0EFEB]" required>
                    <option  value="">Selecciona</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </label>

                <label className="flex items-center gap-2">
                  <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
                  <span className="text-gray-700 font-medium">Destacado</span>
                </label>
              </div>

              {/* Drag & Drop */}
              <label
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`flex items-center gap-2 p-2 border rounded cursor-pointer bg-[#F0EFEB] hover:bg-gray-50 ${isDragging ? "border-green-600 bg-green-50" : ""}`}
              >
                <Upload size={18} className="text-gray-500" />
                <span className="text-gray-600">{form.images.length > 0 ? `${form.images.length} archivo(s) seleccionados` : "Agregar imágenes (máx. 5)"}</span>
                <input type="file" accept="image/*" multiple onChange={handleImageSelect} className="hidden" />
              </label>

              {/* Botones */}
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 cursor-pointer rounded hover:bg-gray-400">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white cursor-pointer rounded hover:bg-green-700">Guardar</button>
              </div>
            </form>

            {/* Galería de imágenes */}
            <div className="lg:col-span-1 bg-white rounded p-3 overflow-auto">
              <h3 className="font-medium text-gray-700 mb-2">Imágenes (clic para marcar principal)</h3>

              <div className="flex flex-col gap-3">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Actual</div>
                  <div className="flex flex-wrap gap-2">
                    {(product.images || []).filter(img => !form.removeImages.includes(img.id)).map(img => (
                      <div key={img.id} className="relative">
                        <img
                          src={img.url}
                          alt="img"
                          className={`w-24 h-24 object-cover rounded cursor-pointer border-2 ${selectedMainImageId === img.id ? "border-yellow-400" : "border-transparent"}`}
                          onClick={() => handleSelectMainImage(img.id)}
                        />
                        <button type="button" className="absolute cursor-pointer top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                onClick={() => handleRemoveImage(img.id)}>X</button>
                      </div>
                    ))}
                    {((product.images || []).filter(img => !form.removeImages.includes(img.id)).length === 0) && (
                      <div className="text-sm text-gray-500">No hay imágenes guardadas</div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-1">Nuevas</div>
                  <div className="flex flex-wrap gap-2">
                    {form.images.map((img, i) => (
                      <div key={i} className="relative">
                        <img
                          src={img.preview}
                          alt="preview"
                          className={`w-24 h-24 object-cover rounded cursor-pointer border-2 ${selectedMainImageId === `new-${i}` ? "border-yellow-400" : "border-transparent"}`}
                          onClick={() => handleSelectMainImage(`new-${i}`)}
                        />
                        <button type="button" className="absolute top-0 right-0 bg-red-500 cursor-pointer text-white rounded-full p-1"
                                onClick={() => handleRemoveNewImage(i)}>X</button>
                      </div>
                    ))}
                    {form.images.length === 0 && <div className="text-sm text-gray-500">No hay imágenes nuevas</div>}
                  </div>
                </div>

                <div className="text-xs text-gray-500">La imagen marcada se usará como portada en la card.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {imageLimitModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div className="bg-white p-4 rounded shadow">
            <p>No puedes subir más de 5 imágenes por producto.</p>
            <div className="mt-2 text-right">
              <button onClick={() => setImageLimitModal(false)} className="px-4 py-2 bg-blue-500 cursor-pointer text-white rounded">Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProductModal;
