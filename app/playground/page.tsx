'use client';

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import ReactMarkdown from 'react-markdown';
import { FaFileAlt, FaTimes, FaTrash } from 'react-icons/fa'; // Add this import at the top of the file
import { Tooltip } from 'react-tooltip';

const API_ENDPOINT = 'http://127.0.0.1:5000';

const languages = [
  { code: 'en-US', name: 'English', nativeName: 'English' },
  { code: 'es-ES', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr-FR', name: 'French', nativeName: 'Français' },
  { code: 'de-DE', name: 'German', nativeName: 'Deutsch' },
  { code: 'it-IT', name: 'Italian', nativeName: 'Italiano' },
  { code: 'ja-JP', name: 'Japanese', nativeName: '日本語' },
  { code: 'zh-CN', name: 'Chinese', nativeName: '中文' },
  { code: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी' },
];

const translations = {
  'en-US': {
    uploadedDocuments: 'Documents',
    noDocuments: 'No documents uploaded yet.',
    notes: 'Notes',
    noNotes: 'No notes yet.',
    selectLanguage: 'Select Language',
    fullAnalysis: 'Full Analysis',
    askQuestion: 'Ask a question...',
    askAboutDocument: 'Ask about the uploaded document...',
    send: 'Send',
    uploaded: 'Uploaded:',
    close: 'Close',
    warning: 'Warning',
    changeLanguageWarning: 'Changing the language will reset all history. Are you sure you want to continue?',
    cancel: 'Cancel',
    confirm: 'Confirm',
    noAnalysisTitle: 'No Analysis Available',
    noAnalysisMessage: "You have not asked a question. Please ask a question so the AI can provide a legal analysis.",
  },
  'es-ES': {
    uploadedDocuments: 'Documentos',
    noDocuments: 'Aún no se han subido documentos.',
    notes: 'Notas',
    noNotes: 'Aún no hay notas.',
    selectLanguage: 'Seleccionar Idioma',
    fullAnalysis: 'Análisis Completo',
    askQuestion: 'Haz una pregunta...',
    askAboutDocument: 'Pregunta sobre el documento subido...',
    send: 'Enviar',
    uploaded: 'Subido:',
    close: 'Cerrar',
    warning: 'Advertencia',
    changeLanguageWarning: 'Cambiar el idioma restablecerá todo el historial. ¿Estás seguro de que quieres continuar?',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    clickForAnalysis: 'Clic para Análisis',
    noAnalysisTitle: 'No hay análisis disponible',
    noAnalysisMessage: "No has hecho ninguna pregunta. Por favor, haz una pregunta para que la IA pueda proporcionar un análisis legal.",
  },
  'fr-FR': {
    uploadedDocuments: 'Documents',
    noDocuments: 'Aucun document téléchargé pour le moment.',
    notes: 'Notes',
    noNotes: 'Pas encore de notes.',
    selectLanguage: 'Sélectionner la Langue',
    fullAnalysis: 'Analyse Complète',
    askQuestion: 'Posez une question...',
    askAboutDocument: 'Posez une question sur le document téléchargé...',
    send: 'Envoyer',
    uploaded: 'Téléchargé :',
    close: 'Fermer',
    warning: 'Avertissement',
    changeLanguageWarning: 'Changer la langue réinitialisera tout l\'historique. Êtes-vous sûr de vouloir continuer ?',
    cancel: 'Annuler',
    confirm: 'Confirmer',
    clickForAnalysis: 'Cliquez pour Analyser',
    noAnalysisTitle: 'Pas d\'analyse disponible',
    noAnalysisMessage: "Vous n'avez pas posé de question. Veuillez poser une question pour que l'IA puisse fournir une analyse juridique.",
  },
  'de-DE': {
    uploadedDocuments: 'Dokumente',
    noDocuments: 'Noch keine Dokumente hochgeladen.',
    notes: 'Notizen',
    noNotes: 'Noch keine Notizen.',
    selectLanguage: 'Sprache auswählen',
    fullAnalysis: 'Vollständige Analyse',
    askQuestion: 'Stellen Sie eine Frage...',
    askAboutDocument: 'Fragen Sie zum hochgeladenen Dokument...',
    send: 'Senden',
    uploaded: 'Hochgeladen:',
    close: 'Schließen',
    warning: 'Warnung',
    changeLanguageWarning: 'Wenn Sie die Sprache ändern, wird der gesamte Verlauf zurückgesetzt. Sind Sie sicher, dass Sie fortfahren möchten?',
    cancel: 'Abbrechen',
    confirm: 'Bestätigen',
    clickForAnalysis: 'Klicken Sie für Analysen',
    noAnalysisTitle: 'Keine Analyse verfügbar',
    noAnalysisMessage: "Sie haben keine Frage gestellt. Bitte stellen Sie eine Frage, damit die KI eine rechtliche Analyse durchführen kann.",
  },
  'it-IT': {
    uploadedDocuments: 'Documenti',
    noDocuments: 'Nessun documento caricato ancora.',
    notes: 'Note',
    noNotes: 'Nessuna nota ancora.',
    selectLanguage: 'Seleziona Lingua',
    fullAnalysis: 'Analisi Completa',
    askQuestion: 'Fai una domanda...',
    askAboutDocument: 'Chiedi informazioni sul documento caricato...',
    send: 'Invia',
    uploaded: 'Caricato:',
    close: 'Chiudi',
    warning: 'Avviso',
    changeLanguageWarning: 'Cambiare la lingua resetterà tutta la cronologia. Sei sicuro di voler continuare?',
    cancel: 'Annulla',
    confirm: 'Conferma',
    clickForAnalysis: 'Clicca per Analizzare',
    noAnalysisTitle: 'Nessuna analisi disponibile',
    noAnalysisMessage: "Non hai fatto una domanda. Per favore, fai una domanda in modo che l'IA possa fornire un'analisi legale.",
  },
  'ja-JP': {
    uploadedDocuments: '文書',
    noDocuments: 'まだ文書がアップロードされていません。',
    notes: 'メモ',
    noNotes: 'まだメモがありません。',
    selectLanguage: '言語を選択',
    fullAnalysis: '完全な分析',
    askQuestion: '質問してください...',
    askAboutDocument: 'アップロードされた文書について質問してください...',
    send: '送信',
    uploaded: 'アップロード済み:',
    close: '閉じる',
    warning: '警告',
    changeLanguageWarning: '言語を変更すると、すべての履歴がリセットされます。続行してもよろしいですか？',
    cancel: 'キャンセル',
    confirm: '確認',
    clickForAnalysis: '分析するためにクリックしてください',
    noAnalysisTitle: '分析不可用',
    noAnalysisMessage: "質問がありません。AIが法的分析を提供できるよう、質問をしてください。",
  },
  'zh-CN': {
    uploadedDocuments: '文件',
    noDocuments: '尚未上传任何文件。',
    notes: '笔记',
    noNotes: '暂无笔记。',
    selectLanguage: '选择语言',
    fullAnalysis: '完整分析',
    askQuestion: '提出问题...',
    askAboutDocument: '询问已上传的文件...',
    send: '发送',
    uploaded: '已上传：',
    close: '关闭',
    warning: '警告',
    changeLanguageWarning: '更改语言将重置所有历史记录。您确定要继续吗？',
    cancel: '取消',
    confirm: '确认',
    clickForAnalysis: '点击分析',
    noAnalysisTitle: '不可用分析',
    noAnalysisMessage: "您还没有提出问题。请提出一个问题，以便AI可以提供法律分析。",
  },
  'hi-IN': {
    uploadedDocuments: 'दस्तावेज़',
    noDocuments: 'अभी तक कोई दस्तावेज़ अपलोड नहीं किया गया है।',
    notes: 'नोट्स',
    noNotes: 'अभी तक कोई नोट नहीं है।',
    selectLanguage: 'भाषा चुनें',
    fullAnalysis: 'पूर्ण विश्लेषण',
    askQuestion: 'एक प्रश्न पूछें...',
    askAboutDocument: 'अपलोड किए गए दस्तावेज़ के बारे में पूछें...',
    send: 'भेजें',
    uploaded: 'अपलोड किया गया:',
    close: 'बंद करें',
    warning: 'चेतावनी',
    changeLanguageWarning: 'भाषा बदलने से सारा इतिहास रीसेट हो जाएगा  ��� च ह?',
    cancel: 'द्द करें',
    confirm: 'पुष्टि करें',
    clickForAnalysis: 'विश्लेषण के लिए क्लिक करें',
    noAnalysisTitle: 'विशेण उलब्ध नहीं',
    noAnalysisMessage: "आने कोई प्रश्न नहीं पूछा है। कृपया एक प्रश्न पूछें ताक AI कानूनी विश्लेषण प्रदान कर सके।",
  },
};

interface Document {
  name: string;
  content: string;
  chunks: string[];
}

interface Toast {
  message: string;
  type: 'success' | 'error';
}

interface RelevantChunk {
  text: string;
  metadata: {
    source: string;
    chunk_id: number;
  };
  score: number;
}

interface SentenceWithChunks {
  text: string;
  chunks: RelevantChunk[];
}

interface Citation {
  docName: string;
  chunkId: number;
  text: string;
}

interface Note {
  id: string;
  summary: string;
  fullContent: string;
}

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const recognitionRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [documentsExpanded, setDocumentsExpanded] = useState(true);
  const [notesExpanded, setNotesExpanded] = useState(true);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [tempDocument, setTempDocument] = useState<Document | null>(null);
  const [showLanguagePopup, setShowLanguagePopup] = useState(false);
  const [showWarningPopup, setShowWarningPopup] = useState(false);
  const [newLanguage, setNewLanguage] = useState(languages[0]);
  const [toast, setToast] = useState<Toast | null>(null);
  const [showAnalysisIndicator, setShowAnalysisIndicator] = useState(false);
  const [inputLocked, setInputLocked] = useState(false);
  const [showNoAnalysisPopup, setShowNoAnalysisPopup] = useState(false);
  const waveControls = useAnimationControls();
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [tempUploadedFile, setTempUploadedFile] = useState<File | null>(null);
  const [relevantChunks, setRelevantChunks] = useState<RelevantChunk[]>([]);
  const [sentencesWithChunks, setSentencesWithChunks] = useState<SentenceWithChunks[]>([]);
  const [citations, setCitations] = useState<Citation[]>([]);

  useEffect(() => {
    const storedLanguage = localStorage.getItem('selectedLanguage');
    if (storedLanguage) {
      setSelectedLanguage(languages.find(lang => lang.code === storedLanguage) || languages[0]);
    } else {
      setShowLanguagePopup(true);
    }

    const storedDocuments = localStorage.getItem('uploadedDocuments');
    if (storedDocuments) {
      setDocuments(JSON.parse(storedDocuments));
    }
  }, []);

  const startListening = () => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = selectedLanguage.code;

      recognitionRef.current.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setUserInput(transcript);
      };

      recognitionRef.current.start();
      setIsListening(true);
    } else {
      alert("Your browser doesn't support speech recognition. Please try a different browser.");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const simulateSpeaking = (text: string) => {
    setIsSpeaking(true);
    waveControls.start({
      pathLength: [0, 1],
      pathOffset: [0, 1],
      transition: {
        duration: 2,
        ease: "linear",
        repeat: Infinity,
      },
    });
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        index += 5;
      } else {
        clearInterval(interval);
        setIsSpeaking(false);
        waveControls.stop();
      }
    }, 20);
  };

  const translateText = async (text: string, targetLanguage: string) => {
    try {
      const response = await fetch(`${API_ENDPOINT}/api/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text, 
          target_language: targetLanguage,
          source_language: 'en' // Assuming the AI response is always in English
        }),
      });

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const data = await response.json();
      return data.translated_text;
    } catch (error) {
      console.error('Error translating text:', error);
      return text; // Return original text if translation fails
    }
  };

  const handleSubmit = async () => {
    if (!userInput || inputLocked) return;

    setInputLocked(true);
    setIsLoading(true);
    setShowTranscript(false);

    let documentContext = '';
    if (tempUploadedFile) {
      try {
        const content = await tempUploadedFile.text();
        const chunkResponse = await fetch(`${API_ENDPOINT}/api/chunk_document`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: content, name: tempUploadedFile.name }),
        });

        if (!chunkResponse.ok) {
          throw new Error('Failed to chunk document');
        }

        const chunkData = await chunkResponse.json();
        const newDocument: Document = { 
          name: tempUploadedFile.name, 
          content, 
          chunks: chunkData.chunks 
        };
        setDocuments(prev => [...prev, newDocument]);
        localStorage.setItem('uploadedDocuments', JSON.stringify([...documents, newDocument]));
        documentContext = content;
        setTempUploadedFile(null);
        setToast({ message: "Document processed and saved successfully.", type: 'success' });
      } catch (error) {
        console.error('Error processing document:', error);
        setToast({ message: "Failed to process the document. Please try again.", type: 'error' });
        setInputLocked(false);
        setIsLoading(false);
        return;
      }
    }

    try {
      const response = await fetch(`${API_ENDPOINT}/api/llm_inference`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text: userInput, 
          doc_name: tempUploadedFile?.name || ''
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get LLM response');
      }

      const data = await response.json();
      let translatedResponse = data.response;
      setCitations(data.citations);

      // Translate the response if the selected language is not English
      if (selectedLanguage.code !== 'en-US') {
        translatedResponse = await translateText(data.response, selectedLanguage.code.split('-')[0]);
      }

      setAiResponse(translatedResponse);
      simulateSpeaking(translatedResponse);
      setShowAnalysisIndicator(true);

      // Update notes based on the AI's response
      updateNotes(translatedResponse);
    } catch (error) {
      console.error('Error getting LLM response:', error);
      const errorMessage = 'Failed to get LLM response. Please try again.';
      const translatedError = await translateText(errorMessage, selectedLanguage.code.split('-')[0]);
      setAiResponse(translatedError);
      simulateSpeaking(translatedError);
    } finally {
      setIsLoading(false);
      setUserInput("");
      setInputLocked(false);
    }
  };

  const updateNotes = async (response: string) => {
    const keyPoints = extractKeyPoints(response);
    
    if (keyPoints.length > 0) {
      const fullContent = keyPoints.join('\n\n');
      try {
        const summaryResponse = await fetch(`${API_ENDPOINT}/api/summarize_note`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ note_content: fullContent }),
        });

        if (!summaryResponse.ok) {
          throw new Error('Failed to summarize note');
        }

        const summaryData = await summaryResponse.json();
        const newNote: Note = {
          id: Date.now().toString(),
          summary: summaryData.summary,
          fullContent: fullContent
        };
        setNotes(prevNotes => [...prevNotes, newNote]);
      } catch (error) {
        console.error('Error summarizing note:', error);
        // Fallback to using the first few words of the first key point as a summary if summarization fails
        const fallbackSummary = keyPoints[0].split(' ').slice(0, 3).join(' ');
        const newNote: Note = {
          id: Date.now().toString(),
          summary: fallbackSummary,
          fullContent: fullContent
        };
        setNotes(prevNotes => [...prevNotes, newNote]);
      }
    }
  };

  const extractKeyPoints = (response: string): string[] => {
    const keyPoints: string[] = [];
    const sections = response.split('\n');
    
    let currentSection = '';
    for (const section of sections) {
      if (section.startsWith('1. ') || section.startsWith('2. ') || section.startsWith('3. ') || 
          section.startsWith('4. ') || section.startsWith('5. ')) {
        if (currentSection) {
          keyPoints.push(currentSection.trim());
        }
        currentSection = section;
      } else {
        currentSection += ' ' + section.trim();
      }
    }
    
    if (currentSection) {
      keyPoints.push(currentSection.trim());
    }
    
    return keyPoints;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (documents.some(doc => doc.name === file.name) || (tempUploadedFile && tempUploadedFile.name === file.name)) {
        setToast({ message: "A file with this name has already been uploaded.", type: 'error' });
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setToast({ message: "File size exceeds 5MB limit.", type: 'error' });
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        setTempUploadedFile(file);
        setToast({ message: "File selected. Send a message to process and save the document.", type: 'success' });
      }
    } else {
      setToast({ message: "No file selected.", type: 'error' });
    }
  };

  const handleRemoveTempDocument = () => {
    setTempUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const barVariants = {
    initial: { scaleY: 0 },
    animate: {
      scaleY: [1, 1.5, 1],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  const getTranslation = (key: string) => {
    const langCode = selectedLanguage.code;
    return translations[langCode as keyof typeof translations]?.[key as keyof typeof translations['en-US']] || translations['en-US'][key as keyof typeof translations['en-US']];
  };

  const handleLanguageChange = (language: typeof languages[0]) => {
    if (language.code !== selectedLanguage.code) {
      setNewLanguage(language);
      setShowWarningPopup(true);
    }
  };

  const confirmLanguageChange = () => {
    localStorage.setItem('selectedLanguage', newLanguage.code);
    setSelectedLanguage(newLanguage);
    setShowWarningPopup(false);
    // Clear history and reload the page
    localStorage.removeItem('uploadedDocuments');
    window.location.reload();
  };

  const handleAvatarClick = () => {
    if (aiResponse) {
      setShowTranscript(true);
    } else {
      setShowNoAnalysisPopup(true);
    }
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const waveVariants = {
    animate: {
      rotate: [0, 360],
      transition: {
        duration: 10,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  const speakingVariants = {
    speaking: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
    silent: {
      scale: 1,
    },
  };

  const handleDocumentClick = (doc: Document) => {
    setSelectedDocument(doc);
  };

  const renderResponseWithCitations = (response: string) => {
    return (
      <div>
        <ReactMarkdown className="text-gray-300 text-base prose prose-invert prose-headings:text-blue-400 prose-a:text-blue-400 prose-strong:text-blue-400">
          {response}
        </ReactMarkdown>
        {citations.length > 0 && (
          <div className="mt-8 border-t border-gray-700 pt-4">
            <h3 className="text-xl font-bold mb-4">Citations</h3>
            {citations.map((citation, index) => (
              <div key={index} className="mb-4 p-4 bg-gray-700 rounded-lg">
                <h4 className="text-lg font-semibold mb-2">
                  {citation.docName} - Chunk {citation.chunkId}
                </h4>
                <p className="text-sm text-gray-300">{citation.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const handleClearChat = async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}/api/clear_data`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to clear data');
      }

      // Clear local state
      setDocuments([]);
      setAiResponse("");
      setUserInput("");
      setRelevantChunks([]);
      setTempUploadedFile(null);
      setShowAnalysisIndicator(false);
      setNotes([]); // Clear notes
      setCitations([]); // Clear citations

      // Clear localStorage
      localStorage.removeItem('uploadedDocuments');

      setToast({ message: "Chat cleared and all data reset successfully.", type: 'success' });
    } catch (error) {
      console.error('Error clearing data:', error);
      setToast({ message: "Failed to clear data. Please try again.", type: 'error' });
    }
  };

  return (
    <div className="flex h-screen bg-black text-white p-2 relative no-select">
      <div className="flex w-full h-full space-x-2">
        {/* Sidebar */}
        <div className="w-64 bg-gray-900 p-2 overflow-y-auto z-20 relative flex flex-col rounded-2xl text-sm">
          <h1 className="text-2xl font-bold mb-4 text-center">
            Legal<span className="text-blue-500">AI</span>
          </h1>
          
          {/* Uploaded Documents */}
          <div className="mb-4 bg-gray-800 rounded-lg overflow-hidden">
            <button 
              className="w-full flex justify-between items-center p-2"
              onClick={() => setDocumentsExpanded(!documentsExpanded)}
            >
              <span>{getTranslation('uploadedDocuments')}</span>
              <span>{documentsExpanded ? '▼' : '▶'}</span>
            </button>
            {documentsExpanded && (
              <div className="p-2">
                {documents.length > 0 ? (
                  <ul className="space-y-1">
                    {documents.map((doc, index) => (
                      <li key={index} className="flex items-center justify-between text-xs py-1">
                        <div 
                          className="flex items-center space-x-2 cursor-pointer hover:text-blue-300"
                          onClick={() => handleDocumentClick(doc)}
                        >
                          <FaFileAlt className="text-gray-400" />
                          <span className="truncate">{doc.name}</span>
                        </div>
                        <button
                          onClick={() => {
                            const newDocuments = documents.filter((_, i) => i !== index);
                            setDocuments(newDocuments);
                            localStorage.setItem('uploadedDocuments', JSON.stringify(newDocuments));
                          }}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <FaTimes />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 text-xs">{getTranslation('noDocuments')}</p>
                )}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="mb-4 bg-gray-800 rounded-lg overflow-hidden">
            <button 
              className="w-full flex justify-between items-center p-2"
              onClick={() => setNotesExpanded(!notesExpanded)}
            >
              <span>{getTranslation('notes')}</span>
              <span>{notesExpanded ? '▼' : '▶'}</span>
            </button>
            {notesExpanded && (
              <div className="p-2 max-h-64 overflow-y-auto">
                {notes.length > 0 ? (
                  <ul className="space-y-2">
                    {notes.map((note) => (
                      <li 
                        key={note.id} 
                        className="text-xs cursor-pointer hover:bg-gray-700 p-1 rounded"
                        onClick={() => setSelectedNote(note)}
                      >
                        {note.summary}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 text-xs">{getTranslation('noNotes')}</p>
                )}
              </div>
            )}
          </div>
          
          {/* Language selection */}
          <div className="mt-auto">
            <label htmlFor="language-select" className="block text-xs font-medium text-gray-400 mb-1">
              {getTranslation('selectLanguage')}
            </label>
            <select
              id="language-select"
              className="w-full p-1 bg-gray-800 border border-gray-700 rounded text-white text-xs"
              value={selectedLanguage.code}
              onChange={(e) => handleLanguageChange(languages.find(lang => lang.code === e.target.value) || languages[0])}
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.nativeName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col bg-gray-900 rounded-2xl overflow-hidden">
          {/* Clear Chat Button */}
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={handleClearChat}
              className="text-gray-400 hover:text-red-500 transition-colors duration-200"
              title="Clear Chat"
            >
              <FaTrash size={20} />
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center relative">
            <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-blue-900 to-gray-900"></div>
            <div className="z-10 flex flex-col items-center justify-center w-full max-w-2xl px-3">
              <div 
                className="w-44 h-44 relative cursor-pointer group hover:scale-105 transition-transform duration-300"
                onClick={handleAvatarClick}
              >
                <motion.div
                  className="absolute inset-0"
                  variants={waveVariants}
                  animate="animate"
                >
                  <svg width="100%" height="100%" viewBox="0 0 100 100">
                    <path
                      d="M50 10 C60 10 70 15 75 25 C80 35 80 45 75 55 C70 65 60 70 50 70 C40 70 30 65 25 55 C20 45 20 35 25 25 C30 15 40 10 50 10"
                      fill="none"
                      stroke="#FF69B4"
                      strokeWidth="2"
                    />
                  </svg>
                </motion.div>
                <motion.div 
                  className="absolute inset-2 rounded-full overflow-hidden"
                  variants={speakingVariants}
                  animate={isSpeaking ? "speaking" : "silent"}
                >
                  <img
                    src="/default-avatar.png"
                    alt="AI Avatar"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                {isSpeaking && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      {[...Array(3)].map((_, index) => (
                        <motion.circle
                          key={index}
                          cx="50"
                          cy="50"
                          r={15 + index * 10}
                          fill="none"
                          stroke="#3B82F6"
                          strokeWidth="2"
                          initial={{ scale: 0, opacity: 0.7 }}
                          animate={{
                            scale: [0, 1, 0],
                            opacity: [0.7, 0, 0.7],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: index * 0.5,
                          }}
                        />
                      ))}
                    </svg>
                  </div>
                )}
                {showAnalysisIndicator && !isLoading && !isSpeaking && (
                  <div className="absolute top-0 right-0 w-4 h-4 bg-blue-500 rounded-full animate-pulse" />
                )}
              </div>
            </div>
          </div>
          
          {/* Chat input */}
          <div className="p-3 relative">
            <div className="max-w-xl mx-auto relative">
              {tempUploadedFile && (
                <div className="absolute bottom-full left-0 right-0 mb-2">
                  <div className="bg-gray-800 rounded-full py-1 px-3 text-xs flex items-center justify-between">
                    <div className="flex items-center space-x-2 truncate">
                      <FaFileAlt className="text-blue-400" />
                      <span className="truncate">{tempUploadedFile.name}</span>
                    </div>
                    <button
                      onClick={handleRemoveTempDocument}
                      className="text-gray-400 hover:text-white ml-2"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
              )}
              <div className="relative flex items-center">
                <label htmlFor="file-upload" className="absolute left-3 cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white hover:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".txt,.pdf,.doc,.docx"
                  disabled={inputLocked}
                />
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !inputLocked) {
                      handleSubmit();
                    }
                  }}
                  className={`w-full py-2.5 pr-24 pl-10 bg-gray-700 border border-gray-600 rounded-full text-white text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputLocked ? 'opacity-50 cursor-not-allowed' : ''} select-text`}
                  placeholder={tempUploadedFile ? getTranslation('askAboutDocument') : getTranslation('askQuestion')}
                  disabled={inputLocked}
                />
                <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center">
                  <button
                    onMouseDown={startListening}
                    onMouseUp={stopListening}
                    onTouchStart={startListening}
                    onTouchEnd={stopListening}
                    className={`p-1 rounded-full ${isListening ? 'text-red-500' : 'text-white'} hover:bg-gray-600 ${inputLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={inputLocked}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </button>
                  <button
                    onClick={handleSubmit}
                    className={`ml-1 bg-blue-500 text-white text-xs font-medium py-1 px-3 rounded-full hover:bg-blue-600 ${inputLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={inputLocked}
                  >
                    {getTranslation('send')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transcript Dialog */}
      {showTranscript && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white">{getTranslation('fullAnalysis')}</h2>
            </div>
            <div className="flex-grow overflow-y-auto p-6">
              {renderResponseWithCitations(aiResponse)}
            </div>
            <div className="p-6 border-t border-gray-700">
              <button
                onClick={() => setShowTranscript(false)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                {getTranslation('close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Language Selection Popup */}
      {showLanguagePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Select Your Language</h2>
            <select
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white mb-4"
              value={selectedLanguage.code}
              onChange={(e) => setSelectedLanguage(languages.find(lang => lang.code === e.target.value) || languages[0])}
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.nativeName} ({lang.name})
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                localStorage.setItem('selectedLanguage', selectedLanguage.code);
                setShowLanguagePopup(false);
              }}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      {/* Language Change Warning Popup */}
      {showWarningPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">{getTranslation('warning')}</h2>
            <p className="mb-4">{getTranslation('changeLanguageWarning')}</p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowWarningPopup(false)}
                className="mr-2 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
              >
                {getTranslation('cancel')}
              </button>
              <button
                onClick={confirmLanguageChange}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                {getTranslation('confirm')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 p-4 rounded-md shadow-md z-[100] ${
              toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* No Analysis Popup */}
      {showNoAnalysisPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">{getTranslation('noAnalysisTitle')}</h2>
            <p className="mb-4 font-light">{getTranslation('noAnalysisMessage')}</p>
            <button
              onClick={() => setShowNoAnalysisPopup(false)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              {getTranslation('close')}
            </button>
          </div>
        </div>
      )}

      {/* Document Display Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white">{selectedDocument.name}</h2>
            </div>
            <div className="flex-grow overflow-y-auto p-6">
              {selectedDocument.chunks.map((chunk, index) => (
                <div key={index} className="mb-4 p-2 border border-gray-600 rounded">
                  <p className="text-sm text-gray-300">{chunk}</p>
                </div>
              ))}
            </div>
            <div className="p-6 border-t border-gray-700">
              <button
                onClick={() => setSelectedDocument(null)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                {getTranslation('close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Note Display Modal */}
      {selectedNote && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">{selectedNote.summary}</h2>
            </div>
            <div className="flex-grow overflow-y-auto p-6">
              <ReactMarkdown className="text-gray-300 text-sm prose prose-invert">
                {selectedNote.fullContent}
              </ReactMarkdown>
            </div>
            <div className="p-6 border-t border-gray-700">
              <button
                onClick={() => setSelectedNote(null)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                {getTranslation('close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
