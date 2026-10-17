"use client";

import { useState } from "react";
import { db } from "@/lib/firebaseClient";
import { collection, addDoc, serverTimestamp, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { Trash2, Edit2, Plus, Loader2, X } from "lucide-react";

export default function SubjectClient({ initialSubjects }: { initialSubjects: any[] }) {
  const [subjects, setSubjects] = useState(initialSubjects);
  const [isSaving, setIsSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [price, setPrice] = useState(0);
  const [syllabusFile, setSyllabusFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const [editId, setEditId] = useState<string | null>(null);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImageUrl("");
    setPrice(0);
    setSyllabusFile(null);
    setPdfFile(null);
    setEditId(null);
    setShowModal(false);
  };

  const uploadPdf = async (file: File, category: "syllabus" | "paid") => {
    const formData = new FormData();
    formData.set("file", file);
    formData.set("category", category);

    const response = await fetch("/api/admin-upload", {
      method: "POST",
      body: formData,
    });
    const result = await response.json();

    if (!response.ok) throw new Error(result.error || "PDF upload failed");
    return result.publicUrl as string;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return alert("Title is required.");
    
    setIsSaving(true);

    try {
      let finalSyllabusUrl = subjects.find(s => s.id === editId)?.syllabus || "";
      let finalPdfUrl = subjects.find(s => s.id === editId)?.pdfUrl || "";

      // Upload syllabus if selected
      if (syllabusFile) {
        finalSyllabusUrl = await uploadPdf(syllabusFile, "syllabus");
      }

      // Upload paid PDF if selected
      if (pdfFile) {
        finalPdfUrl = await uploadPdf(pdfFile, "paid");
      }

      // Process description into array (since frontend expects array)
      const descArray = description.split('\n').filter(line => line.trim() !== '');

      const subjectData: any = {
        name: title,
        description: descArray,
        imageUrl,
        price: Number(price),
        syllabus: finalSyllabusUrl,
        pdfUrl: finalPdfUrl,
      };

      if (editId) {
        const docRef = doc(db, "subjects", editId);
        await updateDoc(docRef, subjectData);
        setSubjects(subjects.map(s => s.id === editId ? { ...s, ...subjectData } : s));
        alert("Subject Updated Successfully");
      } else {
        const docRef = await addDoc(collection(db, "subjects"), {
          ...subjectData,
          createdAt: serverTimestamp(),
        });
        setSubjects([{ id: docRef.id, ...subjectData }, ...subjects]);
        alert("Subject Created Successfully");
      }

      resetForm();
    } catch (error: any) {
      console.error(error);
      alert(error.message || "An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subject/course?")) return;
    try {
      await deleteDoc(doc(db, "subjects", id));
      setSubjects(subjects.filter(s => s.id !== id));
    } catch (error) {
      console.error(error);
      alert("Failed to delete subject");
    }
  };

  const openEdit = (subject: any) => {
    setEditId(subject.id);
    setTitle(subject.name || subject.title || "");
    
    // Description could be an array or string
    const desc = Array.isArray(subject.description) 
      ? subject.description.join('\n') 
      : (subject.description || "");
      
    setDescription(desc);
    setImageUrl(subject.imageUrl || "");
    setPrice(subject.price || 0);
    setSyllabusFile(null);
    setPdfFile(null);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Manage Courses & Notes</h2>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-[#2A9D8F] text-white rounded-md hover:bg-[#21867a] transition-colors"
        >
          <Plus size={18} />
          Add Course
        </button>
      </div>

      {/* Subjects List */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 font-semibold text-gray-600">Title</th>
              <th className="p-4 font-semibold text-gray-600">Price</th>
              <th className="p-4 font-semibold text-gray-600">Syllabus (Free)</th>
              <th className="p-4 font-semibold text-gray-600">Note (Paid)</th>
              <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subjects.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-500">No courses found</td></tr>
            ) : (
              subjects.map((sub) => (
                <tr key={sub.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-800">{sub.name || sub.title}</td>
                  <td className="p-4 text-gray-600">₹{sub.price || 0}</td>
                  <td className="p-4">
                    {sub.syllabus ? <a href={sub.syllabus} target="_blank" className="text-blue-500 hover:underline">View</a> : <span className="text-gray-400">None</span>}
                  </td>
                  <td className="p-4">
                    {sub.pdfUrl ? <a href={sub.pdfUrl} target="_blank" className="text-blue-500 hover:underline">View</a> : <span className="text-gray-400">None</span>}
                  </td>
                  <td className="p-4 flex justify-end gap-3 mt-2">
                    <button onClick={() => openEdit(sub)} className="text-gray-500 hover:text-blue-600 transition-colors p-1">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(sub.id)} className="text-gray-500 hover:text-red-600 transition-colors p-1">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-bold">{editId ? "Edit Course" : "Add Course"}</h3>
              <button onClick={resetForm} className="text-gray-500 hover:bg-gray-100 p-1 rounded-full"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleSave} className="p-4 overflow-y-auto space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input 
                  type="text" required value={title} onChange={e => setTitle(e.target.value)}
                  className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#2A9D8F]" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Line separated)</label>
                <textarea 
                  rows={3} value={description} onChange={e => setDescription(e.target.value)}
                  className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#2A9D8F]" 
                  placeholder="Line 1&#10;Line 2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                <input 
                  type="number" min="0" required value={price} onChange={e => setPrice(Number(e.target.value))}
                  className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#2A9D8F]" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Free Syllabus (PDF) {editId && "(Optional to change)"}</label>
                <input 
                  type="file" accept="application/pdf" onChange={e => setSyllabusFile(e.target.files?.[0] || null)}
                  className="w-full border rounded-md p-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-[#2A9D8F] hover:file:bg-teal-100" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Paid Notes (PDF) {editId && "(Optional to change)"}</label>
                <input 
                  type="file" accept="application/pdf" onChange={e => setPdfFile(e.target.files?.[0] || null)}
                  className="w-full border rounded-md p-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-[#2A9D8F] hover:file:bg-teal-100" 
                />
              </div>

              <div className="pt-4 border-t flex justify-end gap-3">
                <button type="button" onClick={resetForm} className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={isSaving} className="flex items-center gap-2 px-4 py-2 bg-[#2A9D8F] text-white rounded-md hover:bg-[#21867a] disabled:opacity-70">
                  {isSaving && <Loader2 size={16} className="animate-spin" />}
                  {editId ? "Save Changes" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
