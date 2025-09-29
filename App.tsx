
import React, { useState, useCallback } from 'react';
import type { ImageFileState } from './types';
import { generateImageFromPhotos } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import Spinner from './components/Spinner';

const YOUTUBE_CHANNEL_URL = "https://youtube.com/@ai8tk?si=7_MJLfZVKaL-6hm7";


const App: React.FC = () => {
  const [childPhoto, setChildPhoto] = useState<ImageFileState>({ file: null, previewUrl: null });
  const [adultPhoto, setAdultPhoto] = useState<ImageFileState>({ file: null, previewUrl: null });
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showSubscriptionPrompt, setShowSubscriptionPrompt] = useState<boolean>(false);

  const handleFileChange = (setter: React.Dispatch<React.SetStateAction<ImageFileState>>) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setter({
        file,
        previewUrl: URL.createObjectURL(file),
      });
    }
  };

  const handleGenerateClick = useCallback(() => {
    if (!childPhoto.file || !adultPhoto.file) {
      setError("يرجى رفع كلتا الصورتين.");
      return;
    }
    setError(null);
    setShowSubscriptionPrompt(true);
  }, [childPhoto.file, adultPhoto.file]);

  const handleProceedWithGeneration = useCallback(async () => {
    if (!childPhoto.file || !adultPhoto.file) return;

    setShowSubscriptionPrompt(false);
    setIsLoading(true);
    setGeneratedImage(null);

    try {
      const imageBase64 = await generateImageFromPhotos(childPhoto.file, adultPhoto.file);
      setGeneratedImage(imageBase64);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "حدث خطأ غير متوقع أثناء توليد الصورة.");
    } finally {
      setIsLoading(false);
    }
  }, [childPhoto.file, adultPhoto.file]);

  const openYoutube = () => {
    window.open(YOUTUBE_CHANNEL_URL, "_blank");
  };

  const handleDownload = useCallback(() => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${generatedImage}`;
    link.download = 'amero-ai-moment.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [generatedImage]);

  return (
    <div className="bg-gray-900 min-h-screen text-white flex flex-col items-center justify-center p-4 sm:p-6 relative" style={{ background: 'linear-gradient(to bottom right, #1f1f1f, #121212)' }}>
      
      {showSubscriptionPrompt && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700 max-w-md w-full text-center animate-fade-in-up">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 mb-4">
              خطوة أخيرة قبل الإبداع
            </h2>
            <p className="text-gray-300 mb-6">
              نقدر دعمك! الاشتراك في قناتنا على يوتيوب يساعدنا على الاستمرار في تقديم أدوات مجانية ومبتكرة. يرجى الاشتراك قبل المتابعة.
            </p>
            <div className="flex flex-col gap-4">
              <button
                onClick={openYoutube}
                className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 me-2" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path></svg>
                افتح قناة اليوتيوب للاشتراك
              </button>
              <button
                onClick={handleProceedWithGeneration}
                className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                لقد اشتركت، تابع التوليد
              </button>
              <button
                onClick={() => setShowSubscriptionPrompt(false)}
                className="text-gray-400 hover:text-white transition-colors duration-200 mt-2"
              >
                إلغاء
              </button>
            </div>
          </div>
          <style>{`
            @keyframes fade-in-up {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
            
            @keyframes section-appear {
              from { opacity: 0; transform: translateY(20px) scale(0.98); }
              to { opacity: 1; transform: translateY(0) scale(1); }
            }
            .animate-section-appear { animation: section-appear 0.5s ease-out forwards; }
          `}</style>
        </div>
      )}

      <main className="w-full max-w-4xl mx-auto flex flex-col items-center">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
            AMERO AI
          </h1>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl">
            ارفع صورتك في الطفولة وصورتك الحالية لتوليد لحظة مؤثرة حيث تحتضن نفسك الصغيرة. الاشتراك في قناة اليوتيوب إلزامي.
          </p>
        </header>

        <div className="w-full bg-gray-800/50 p-6 sm:p-8 rounded-2xl shadow-2xl border border-gray-700 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <ImageUploader 
              id="childPhoto" 
              label="صورة الطفولة" 
              previewUrl={childPhoto.previewUrl} 
              onFileChange={handleFileChange(setChildPhoto)} 
            />
            <ImageUploader 
              id="adultPhoto" 
              label="صورتك الحالية" 
              previewUrl={adultPhoto.previewUrl} 
              onFileChange={handleFileChange(setAdultPhoto)} 
            />
          </div>

          <div className="text-center">
            <button 
              onClick={handleGenerateClick}
              disabled={isLoading || !childPhoto.file || !adultPhoto.file}
              className="w-full sm:w-auto px-12 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900/50 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 flex items-center justify-center mx-auto"
            >
              {isLoading ? (
                <>
                  <Spinner />
                  <span className="ms-2">جاري التوليد...</span>
                </>
              ) : (
                "ولّد صورتك المؤثرة"
              )}
            </button>
          </div>

          {error && <p className="mt-4 text-center text-red-400 bg-red-900/50 p-3 rounded-lg">{error}</p>}
        </div>

        {generatedImage && (
          <div className="mt-8 w-full max-w-2xl text-center animate-section-appear">
            <h2 className="text-2xl font-semibold mb-4">لحظتك المؤثرة</h2>
            <div className="bg-gray-800/50 p-4 rounded-2xl shadow-2xl border border-gray-700">
              <img 
                src={`data:image/png;base64,${generatedImage}`} 
                alt="Generated moment" 
                className="w-full h-auto rounded-xl"
              />
            </div>
            <button 
              onClick={handleDownload}
              className="mt-6 w-full sm:w-auto px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500/50 flex items-center justify-center mx-auto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 me-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>تحميل الصورة</span>
            </button>
          </div>
        )}
      </main>
      
      <footer className="text-center text-gray-500 mt-12 py-4">
        <p>© 2025 AMERO AI — جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
};

export default App;
