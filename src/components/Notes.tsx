"use client";

import { useState } from "react";
import { Note } from "@/lib/types";
import { Plus, Trash2, StickyNote, Lightbulb, ShoppingBag, Train, Wallet } from "lucide-react";
import AddItemModal, {
  FormField,
  inputClass,
  selectClass,
  btnPrimary,
} from "./AddItemModal";

interface NotesProps {
  notes: Note[];
  onAdd: (note: Omit<Note, "id" | "created_at">) => void;
  onUpdate: (id: string, updates: Partial<Note>) => void;
  onRemove: (id: string) => void;
}

const categoryConfig: Record<
  Note["category"],
  { label: string; icon: React.ElementType; color: string; bg: string }
> = {
  idea: { label: "Ideas", icon: Lightbulb, color: "text-gold-dark", bg: "bg-gold/10" },
  packing: { label: "Packing", icon: ShoppingBag, color: "text-olive", bg: "bg-olive/10" },
  transport: { label: "Transport", icon: Train, color: "text-navy", bg: "bg-navy/10" },
  budget: { label: "Budget", icon: Wallet, color: "text-terracotta", bg: "bg-terracotta/10" },
  general: { label: "General", icon: StickyNote, color: "text-gray-600", bg: "bg-gray-100" },
};

export default function Notes({ notes, onAdd, onRemove }: NotesProps) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    category: "idea" as Note["category"],
    title: "",
    content: "",
    author: "Alicia",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(form);
    setShowModal(false);
    setForm({ category: "idea", title: "", content: "", author: "Alicia" });
  };

  const categories = Object.keys(categoryConfig) as Note["category"][];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl font-semibold text-navy">
          Ideas & Notes
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-terracotta text-white rounded-lg text-sm font-medium hover:bg-terracotta-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Note
        </button>
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-12 bg-cream rounded-2xl">
          <Lightbulb className="w-8 h-8 text-gold/40 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">
            Jot down ideas, packing reminders, transport notes...
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {categories.map((cat) => {
            const catNotes = notes.filter((n) => n.category === cat);
            if (catNotes.length === 0) return null;
            const config = categoryConfig[cat];
            const Icon = config.icon;
            return (
              <div key={cat}>
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-6 h-6 rounded-md ${config.bg} flex items-center justify-center`}>
                    <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                  </div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    {config.label}
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {catNotes.map((note) => (
                    <div
                      key={note.id}
                      className="bg-white rounded-xl border border-gray-100 p-4 card-hover"
                    >
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-medium text-gray-800 text-sm">
                          {note.title || "Untitled"}
                        </h4>
                        <button
                          onClick={() => onRemove(note.id)}
                          className="p-1 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-red-500" />
                        </button>
                      </div>
                      {note.content && (
                        <p className="text-sm text-gray-500 whitespace-pre-wrap">
                          {note.content}
                        </p>
                      )}
                      {note.author && (
                        <div className="text-[11px] text-gray-400 mt-2">
                          — {note.author}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AddItemModal
        title="Add Note"
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Category">
              <select
                className={selectClass}
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value as Note["category"] })
                }
              >
                <option value="idea">Idea</option>
                <option value="packing">Packing</option>
                <option value="transport">Transport</option>
                <option value="budget">Budget</option>
                <option value="general">General</option>
              </select>
            </FormField>
            <FormField label="Author">
              <select
                className={selectClass}
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
              >
                <option value="Alicia">Alicia</option>
                <option value="Jamie">Jamie</option>
              </select>
            </FormField>
          </div>
          <FormField label="Title">
            <input
              className={inputClass}
              placeholder="Quick title for the note"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </FormField>
          <FormField label="Content">
            <textarea
              className={inputClass}
              rows={4}
              placeholder="Write your note here..."
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              required
            />
          </FormField>
          <button type="submit" className={btnPrimary}>
            Add Note
          </button>
        </form>
      </AddItemModal>
    </div>
  );
}
