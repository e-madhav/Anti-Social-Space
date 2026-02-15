import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ArrowLeft, Save, Loader, PenTool, Sparkles } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css'; 

export default function PlanEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const quillRef = useRef(null);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': ['#475569', '#F472B6', '#60A5FA', '#34D399'] }],
      ['clean']
    ],
  };

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const docRef = doc(db, 'plans', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTitle(docSnap.data().title);
          setContent(docSnap.data().content || ''); 
        } else {
          navigate('/planning');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [id, navigate]);

  const saveDoc = async (newContent) => {
    if (!id) return;
    setStatus('Saving...');
    try {
      await updateDoc(doc(db, 'plans', id), {
        content: newContent,
        updatedAt: new Date().toISOString()
      });
      setStatus('All Synced ✨');
      setTimeout(() => setStatus(''), 2000);
    } catch (err) {
      setStatus('Try again?');
    }
  };

  if (loading) return (
    <div className="h-full w-full flex items-center justify-center bg-[#FFFBF0]">
      <div className="flex flex-col items-center gap-4">
        <div className="bg-pink-100 p-4 rounded-3xl animate-bounce">
          <Loader className="animate-spin text-pink-500" size={40} />
        </div>
        <p className="text-pink-400 font-black text-xl">Opening your masterpiece...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-6rem)] flex flex-col pb-4">
      {/* PERFECTED STYLES */}
      <style>{`
        .quill { display: flex; flex-direction: column; height: 100%; }
        
        .ql-toolbar { 
          background: rgba(255, 255, 255, 0.8) !important;
          backdrop-filter: blur(8px);
          border-radius: 2rem 2rem 0 0 !important;
          border: 4px solid #FCE7F3 !important;
          border-bottom: 2px solid #FCE7F3 !important;
          padding: 12px 20px !important;
          z-index: 10;
        }

        .ql-container { 
          flex: 1; 
          background: white !important; 
          border-radius: 0 0 2rem 2rem !important;
          border: 4px solid #FCE7F3 !important;
          border-top: none !important;
          font-family: 'Nunito', sans-serif !important;
          overflow: hidden;
          box-shadow: 0 10px 30px -10px rgba(244, 114, 182, 0.1);
        }

        .ql-editor { 
          min-height: 100%; 
          color: #475569; 
          padding: 2.5rem !important; 
          line-height: 1.8 !important;
          font-size: 1.15rem !important;
        }

        .ql-editor h1 { font-weight: 800 !important; color: #1e293b !important; }
        
        /* Toolbar Button Aesthetics */
        .ql-snow.ql-toolbar button:hover, .ql-snow .ql-toolbar button:hover {
          color: #F472B6 !important;
        }
        .ql-snow.ql-toolbar button.ql-active, .ql-snow .ql-toolbar button.ql-active {
          color: #F472B6 !important;
        }
      `}</style>

      {/* HEADER SECTION */}
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-5">
          <button 
            onClick={() => navigate('/planning')} 
            className="group bg-white p-4 rounded-[1.5rem] border-2 border-pink-100 text-pink-400 hover:bg-pink-400 hover:text-white transition-all shadow-sm"
          >
            <ArrowLeft size={24} strokeWidth={3} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          
          <div>
            <div className="flex items-center gap-2 text-pink-400/60 mb-0.5">
              <Sparkles size={14} fill="currentColor" />
              <span className="text-xs font-black uppercase tracking-widest">Editing Draft</span>
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">{title}</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <span className="text-pink-400 font-black text-sm">{status}</span>
          <button 
            onClick={() => saveDoc(content)} 
            className="group flex items-center gap-3 bg-pink-400 hover:bg-pink-500 text-white px-8 py-4 rounded-[1.5rem] font-black shadow-lg shadow-pink-200 transition-all active:scale-95"
          >
            <Save size={20} strokeWidth={3} />
            <span>Save Plan</span>
          </button>
        </div>
      </div>

      {/* THE EDITOR */}
      <div className="flex-1 overflow-hidden relative group">
        <ReactQuill 
          ref={quillRef}
          theme="snow"
          value={content}
          onChange={setContent}
          modules={modules}
          placeholder="What's the big plan for today? ✨"
        />
        
        {/* Subtle Bottom Detail */}
        <div className="absolute bottom-6 right-8 bg-pink-50 text-pink-300 px-4 py-1 rounded-full text-xs font-black pointer-events-none border border-pink-100 opacity-0 group-hover:opacity-100 transition-opacity">
          Ready to write
        </div>
      </div>
    </div>
  );
}