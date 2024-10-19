'use client';

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from 'react-markdown';

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
    changeLanguageWarning: 'भाषा बदलने से सारा इतिहास रीसेट हो जाएगा। क्या आप वाकई जारी रखना चाहते हैं?',
    cancel: 'रद्द करें',
    confirm: 'पुष्टि करें',
  },
};

interface Document {
  name: string;
  content: string;
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
  const [notesExpanded, setNotesExpanded] = useState(false);
  const [notes, setNotes] = useState<string[]>([]);
  const [tempDocument, setTempDocument] = useState<Document | null>(null);
  const [showLanguagePopup, setShowLanguagePopup] = useState(false);
  const [showWarningPopup, setShowWarningPopup] = useState(false);
  const [newLanguage, setNewLanguage] = useState(languages[0]);

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
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        index += 5; // Increase this value to make the AI speak faster
      } else {
        clearInterval(interval);
        setIsSpeaking(false);
      }
    }, 20); // Decrease this value to make the AI speak faster
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
    if (!userInput) return;

    setIsLoading(true);
    setShowTranscript(false);

    let documentContext = '';
    if (tempDocument) {
      documentContext = tempDocument.content;
      const updatedDocuments = [...documents, tempDocument];
      setDocuments(updatedDocuments);
      localStorage.setItem('uploadedDocuments', JSON.stringify(updatedDocuments));
      setTempDocument(null);
    }

    try {
      const response = await fetch(`${API_ENDPOINT}/api/llm_inference`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text: userInput, 
          document: documentContext 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get LLM response');
      }

      const data = await response.json();
      let translatedResponse = data.response;

      // Translate the response if the selected language is not English
      if (selectedLanguage.code !== 'en-US') {
        translatedResponse = await translateText(data.response, selectedLanguage.code.split('-')[0]);
      }

      setAiResponse(translatedResponse);
      simulateSpeaking(translatedResponse);
    } catch (error) {
      console.error('Error getting LLM response:', error);
      const errorMessage = 'Failed to get LLM response. Please try again.';
      const translatedError = await translateText(errorMessage, selectedLanguage.code.split('-')[0]);
      setAiResponse(translatedError);
      simulateSpeaking(translatedError);
    } finally {
      setIsLoading(false);
      setUserInput("");
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setTempDocument({ name: file.name, content });
      };
      reader.readAsText(file);
    }
  };

  const handleRemoveTempDocument = () => {
    setTempDocument(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const waveVariants = {
    initial: { opacity: 0, scale: 0 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.7,
        ease: "easeInOut",
        staggerChildren: 0.1,
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0,
      transition: {
        duration: 0.7,
        ease: "easeInOut",
      }
    }
  };

  const barVariants = {
    initial: { scaleY: 0 },
    animate: {
      scaleY: [1, 1.5, 1],
      transition: {
        duration: 1,
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

  return (
    <div className="flex h-screen bg-black text-white p-2">
      <div className="flex w-full h-full space-x-2">
        {/* Sidebar */}
        <div className="w-64 bg-gray-900 p-2 overflow-y-auto z-20 relative flex flex-col rounded-2xl text-sm">
          <h1 className="text-2xl font-bold mb-4 text-center">
            Legal<span className="text-blue-500">AI</span>
          </h1>
          
          {/* Uploaded Documents */}
          <div className="mb-4">
            <button 
              className="w-full flex justify-between items-center bg-gray-800 p-2 rounded"
              onClick={() => setDocumentsExpanded(!documentsExpanded)}
            >
              <span>{getTranslation('uploadedDocuments')}</span>
              <span>{documentsExpanded ? '▼' : '▶'}</span>
            </button>
            {documentsExpanded && (
              <div className="mt-2">
                {documents.length > 0 ? (
                  <ul className="ml-4">
                    {documents.map((doc, index) => (
                      <li key={index} className="mb-1 truncate hover:text-blue-300 cursor-pointer">
                        {doc.name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 ml-4">{getTranslation('noDocuments')}</p>
                )}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="mb-4">
            <button 
              className="w-full flex justify-between items-center bg-gray-800 p-2 rounded"
              onClick={() => setNotesExpanded(!notesExpanded)}
            >
              <span>{getTranslation('notes')}</span>
              <span>{notesExpanded ? '▼' : '▶'}</span>
            </button>
            {notesExpanded && (
              <div className="mt-2">
                {notes.length > 0 ? (
                  <ul className="ml-4">
                    {notes.map((note, index) => (
                      <li key={index} className="mb-1 truncate">{note}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 ml-4">{getTranslation('noNotes')}</p>
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
          <div className="flex-1 flex flex-col justify-center items-center relative">
            <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-blue-900 to-gray-900"></div>
            <div className="z-10 flex flex-col items-center justify-center w-full max-w-2xl px-3">
              <div className="w-44 h-44 rounded-full bg-white flex items-center justify-center overflow-hidden mb-6 relative">
                <AnimatePresence mode="wait">
                  <motion.img
                    key="avatar"
                    src="/default-avatar.png"
                    alt="AI Avatar"
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>
                {isLoading && (
                  <motion.div
                    className="absolute inset-0 border-4 border-blue-500 rounded-full"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    style={{ borderTopColor: 'transparent' }}
                  />
                )}
                {isSpeaking && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    variants={waveVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1 h-9 bg-blue-500 mx-0.5 rounded-full"
                        variants={barVariants}
                      />
                    ))}
                  </motion.div>
                )}
              </div>
              <div className="w-full text-center mb-6">
                {!isLoading && !isSpeaking && aiResponse && (
                  <button
                    onClick={() => setShowTranscript(true)}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    {getTranslation('fullAnalysis')}
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Chat input */}
          <div className="p-3 relative">
            <div className="max-w-2xl mx-auto relative">
              {tempDocument && (
                <div className="absolute bottom-full left-0 right-0 mb-2 p-2 bg-gray-800 rounded-lg text-sm flex justify-between items-center">
                  <span>{getTranslation('uploaded')} {tempDocument.name}</span>
                  <button
                    onClick={handleRemoveTempDocument}
                    className="text-gray-400 hover:text-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
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
                />
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full py-1.5 pr-24 pl-10 bg-gray-700 border border-gray-600 rounded-full text-white text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={tempDocument ? getTranslation('askAboutDocument') : getTranslation('askQuestion')}
                />
                <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center">
                  <button
                    onMouseDown={startListening}
                    onMouseUp={stopListening}
                    onTouchStart={startListening}
                    onTouchEnd={stopListening}
                    className={`p-1 rounded-full ${isListening ? 'text-red-500' : 'text-white'} hover:bg-gray-600`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="ml-1 bg-white text-gray-800 text-xs font-medium py-1 px-3 rounded-full hover:bg-gray-200"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-auto">
            <h2 className="text-xl font-bold mb-4">{getTranslation('fullAnalysis')}</h2>
            <ReactMarkdown className="text-gray-300 text-sm prose prose-invert max-w-none">
              {aiResponse}
            </ReactMarkdown>
            <button
              onClick={() => setShowTranscript(false)}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              {getTranslation('close')}
            </button>
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
    </div>
  );
}
