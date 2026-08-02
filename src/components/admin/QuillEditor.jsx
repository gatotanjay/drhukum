import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

/**
 * Wrapper Quill rich text editor untuk React.
 * Dipakai untuk mengedit konten lengkap artikel (bukan cuma excerpt).
 *
 * Props:
 * - value: string (HTML)
 * - onChange: (html: string) => void
 */
const QuillEditor = ({ value, onChange, placeholder }) => {
  const containerRef = useRef(null);
  const quillRef = useRef(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!containerRef.current || quillRef.current) return;

    const quill = new Quill(containerRef.current, {
      theme: 'snow',
      placeholder: placeholder || 'Tulis isi artikel di sini...',
      modules: {
        toolbar: [
          [{ header: [2, 3, false] }],
          ['bold', 'italic', 'underline'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'image'],
          ['clean'],
        ],
      },
    });

    if (value) {
      quill.clipboard.dangerouslyPasteHTML(value);
    }

    quill.on('text-change', () => {
      const html = quill.root.innerHTML === '<p><br></p>' ? '' : quill.root.innerHTML;
      onChangeRef.current?.(html);
    });

    quillRef.current = quill;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sinkron kalau value berubah dari luar (misal saat load data edit post),
  // tanpa bikin infinite loop dengan cara cek dulu isinya beda.
  useEffect(() => {
    const quill = quillRef.current;
    if (quill && value !== undefined && quill.root.innerHTML !== value) {
      const currentSelection = quill.getSelection();
      quill.clipboard.dangerouslyPasteHTML(value || '');
      if (currentSelection) quill.setSelection(currentSelection);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <div ref={containerRef} className="bg-white rounded-b-lg" style={{ minHeight: '200px' }} />;
};

export default QuillEditor;
