import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Check, Trash2, Plus, X, CheckSquare, Sparkles } from 'lucide-react';

export default function Todo() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [task, setTask] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'todos'), (snapshot) => {
      setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    if (!task.trim()) return;
    setIsModalOpen(false); const t = task; setTask('');
    await addDoc(collection(db, 'todos'), { text: t, completed: false });
  };

  const toggleComplete = async (todo) => await updateDoc(doc(db, 'todos', todo.id), { completed: !todo.completed });
  const confirmDelete = async () => { if (deleteId) { const id = deleteId; setDeleteId(null); await deleteDoc(doc(db, 'todos', id)); } };

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-3">
          <div className="bg-green-300 p-3 rounded-2xl text-green-800 shadow-md transform rotate-3"><CheckSquare size={28} strokeWidth={2.5}/></div>
          <div>
            <h2 className="text-3xl font-black text-slate-800">Let's Do This!</h2>
            <p className="text-slate-500 font-bold">Crush your goals today.</p>
          </div>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-green-400 hover:bg-green-500 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-lg shadow-green-200 transition-all transform hover:-translate-y-1 active:scale-95">
          <Plus size={24} strokeWidth={3} /> Add Task
        </button>
      </div>

      <div className="space-y-4">
        {tasks.map(t => (
          <div key={t.id} className={`group flex items-center justify-between p-4 rounded-3xl border-4 transition-all duration-300 ${t.completed ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-green-100 shadow-sm hover:shadow-md hover:scale-[1.01]'}`}>
            <div className="flex items-center gap-4 flex-1 cursor-pointer" onClick={() => toggleComplete(t)}>
              <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${t.completed ? 'bg-green-400 border-green-400 scale-110' : 'bg-white border-slate-200 group-hover:border-green-300'}`}>
                {t.completed && <Check size={20} className="text-white" strokeWidth={4} />}
              </div>
              <span className={`text-xl font-bold ${t.completed ? 'line-through text-slate-300' : 'text-slate-700'}`}>{t.text}</span>
            </div>
            <button onClick={() => setDeleteId(t.id)} className="text-slate-300 hover:text-red-400 p-2 hover:bg-red-50 rounded-xl transition-colors"><Trash2 size={20} strokeWidth={2.5}/></button>
          </div>
        ))}
      </div>

      {/* --- TASK MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-green-50/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white border-4 border-green-100 rounded-[2.5rem] p-8 w-full max-w-lg shadow-[0_20px_60px_-15px_rgba(74,222,128,0.3)] transform transition-all scale-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-slate-800 flex items-center gap-2">New Mission <Sparkles className="text-green-400"/></h3>
              <button onClick={() => setIsModalOpen(false)} className="bg-slate-100 p-2 rounded-full hover:bg-slate-200"><X size={24} strokeWidth={3}/></button>
            </div>
            <form onSubmit={addTask}>
              <input autoFocus type="text" value={task} onChange={(e) => setTask(e.target.value)} className="w-full bg-green-50/50 border-2 border-green-100 rounded-2xl p-5 text-slate-700 placeholder-slate-400 focus:ring-4 focus:ring-green-100 focus:border-green-300 outline-none font-bold text-xl mb-8" placeholder="e.g., Conquer the world..." />
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-slate-400 font-black hover:bg-slate-50 rounded-2xl transition-colors">Cancel</button>
                <button type="submit" disabled={!task.trim()} className="bg-green-400 hover:bg-green-500 text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-green-200 transition-all transform hover:-translate-y-1">Let's Go!</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* DELETE MODAL (Same style as Notes, just Green themed if you want, or generic) */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-sm" onClick={() => setDeleteId(null)}></div>
          <div className="relative bg-white border-4 border-red-50 rounded-[2rem] p-8 w-full max-w-sm shadow-2xl text-center">
             <h3 className="text-xl font-black text-slate-800 mb-6">Remove this task?</h3>
            <div className="flex justify-center gap-3">
              <button onClick={() => setDeleteId(null)} className="px-6 py-3 text-slate-500 font-bold bg-slate-100 hover:bg-slate-200 rounded-xl">Cancel</button>
              <button onClick={confirmDelete} className="px-6 py-3 bg-red-400 hover:bg-red-500 text-white rounded-xl font-black">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}