"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";

export default function DeleteDocumentButton({ documentId }: { documentId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm("Are you sure you want to delete this document?")) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/documents/${documentId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete document.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting document.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      style={{
        background: "transparent",
        border: "none",
        cursor: isDeleting ? "not-allowed" : "pointer",
        padding: "4px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "4px",
        transition: "background 0.2s",
      }}
      className="delete-doc-btn"
      title="Delete Document"
    >
      {isDeleting ? (
        <Loader2 size={16} color="#D94F4F" className="animate-spin" />
      ) : (
        <Trash2 size={16} color="#7A7E96" />
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        .delete-doc-btn:hover {
          background: rgba(217, 79, 79, 0.1) !important;
        }
        .delete-doc-btn:hover svg {
          stroke: #D94F4F !important;
        }
      `}} />
    </button>
  );
}
