import { Transforms, Editor, Text } from "slate";

// Función para aplicar negrita
export const toggleBold = (editor) => {
  const isActive = isMarkActive(editor, "bold");
  Transforms.setNodes(
    editor,
    { bold: isActive ? null : true },
    { match: (n) => Text.isText(n), split: true }
  );
};

// Función para aplicar cursiva
export const toggleItalic = (editor) => {
  const isActive = isMarkActive(editor, "italic");
  Transforms.setNodes(
    editor,
    { italic: isActive ? null : true },
    { match: (n) => Text.isText(n), split: true }
  );
};

// Función para aplicar subrayado
export const toggleUnderline = (editor) => {
  const isActive = isMarkActive(editor, "underline");
  Transforms.setNodes(
    editor,
    { underline: isActive ? null : true },
    { match: (n) => Text.isText(n), split: true }
  );
};

// Función auxiliar para verificar si un estilo está activo en el texto seleccionado
export const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};
