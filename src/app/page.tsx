
import React from 'react';
import Home from "../components/HomePage";
import ResolutionGuard from '@/components/ResolutionGraud';

export default function App() {
  return (
     <main className="h-screen w-screen bg-[#e9e2d1] flex items-center justify-center">
       <ResolutionGuard>
         <Home/>
       </ResolutionGuard>
     </main>
  );
}
