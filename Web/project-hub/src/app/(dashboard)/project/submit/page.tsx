// import React from 'react';
// import { FiUploadCloud } from 'react-icons/fi';

// const page = () => {
//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       {/* <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Proposal &gt; Submit</h1>
//       </div> */}
      
//       <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//         <div className="flex justify-between items-baseline mb-5">
//           <div>
//             <h2 className="text-xl font-bold text-gray-700">Submit Project Proposal</h2>
//         <p className="text-gray-600 mt-1">Share your project idea with our team for review</p>
//           </div>
//           <div className="flex items-center gap-2">
//             <label htmlFor="advisor-select" className="text-sm font-medium text-gray-700">Submit to:</label>
//             <select 
//               id="advisor-select"
//               className="w-48 pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
//               aria-label="Select advisor"
//             >
//               <option value="">Advisor</option>
//               <option value="advisor1">Advisor 1</option>
//               <option value="advisor2">Advisor 2</option>
//               <option value="advisor3">Advisor 3</option>
//             </select>
//           </div>
//         </div>
        
//         {/* Project Title */}
//         <div className="mb-6">
//           <h3 className="font-medium text-gray-700 mb-2">Project Title</h3>
//           <input 
//             type="text" 
//             placeholder="Enter project title" 
//             className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
        
//         {/* Document Upload */}
//         <div className="mb-8">
//           <h3 className="font-medium text-gray-700 mb-2">Project Proposal Document</h3>
//           <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
//             <div className="flex justify-center mb-2">
//               <FiUploadCloud className="h-8 w-8 text-gray-400" />
//             </div>
//             <p className="text-gray-500">Drop your file here, or <span className="text-blue-600 cursor-pointer">click to browse</span></p>
//             <p className="text-sm text-gray-400 mt-1">PDF, DOC up to 10MB</p>
//           </div>
//         </div>
        
//         {/* Divider */}
//         <div className="border-t border-gray-200 my-6"></div>
        
//         {/* Submit Button */}
//         <button className="w-full bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700 transition font-medium">
//           Submit Proposal
//         </button>
//       </section>
//     </div>
//   );
// };

// export default page;// app/dashboard/project/submit/page.tsx
import ProjectSubmissionPage from "@/components/project/project_submit"

export default function ProjectSubmitPage() {
  return <ProjectSubmissionPage />
}