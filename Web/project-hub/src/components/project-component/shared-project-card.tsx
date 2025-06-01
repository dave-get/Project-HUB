import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface SharedProjectCardProps {
  id: string
  title: string
  description: string
  imageUrl: string
  date: string
  viewMode: 'grid' | 'list'
  role: 'student' | 'teacher'
}

const SharedProjectCard: React.FC<SharedProjectCardProps> = ({
  id,
  title,
  description,
  imageUrl,
  date,
  viewMode,
  role,
}) => {
  const getFeedbackLink = () => {
    switch (role) {
      case 'student':
        return `/home/project-detail/${id}`
      case 'teacher':
        return `/project/submitfeedback/${id}`
    }
  }

  if (viewMode === 'list') {
    return (
      <div className="flex border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden bg-white dark:bg-gray-800">
        <div className="relative w-48 h-48 flex-shrink-0">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
        
        <div className="flex-1 p-6 flex flex-col">
          <div className="w-96">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3 truncate">{title}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm truncate">
              {description}
            </p>
          </div>
          
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(date).toLocaleDateString()}
            </span>
            
            <Link 
              href={getFeedbackLink()}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              {role === 'student' ? 'View Detail' : 'Give Feedback'}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Grid mode (default)
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden bg-white dark:bg-gray-800">
      <div className="relative h-48 w-full">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3 truncate">{title}</h3>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 min-h-[2.5rem] overflow-hidden">
          {description}
        </p>
        
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(date).toLocaleDateString()}
          </span>
          
          <Link 
            href={getFeedbackLink()}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            {role === 'student' ? 'View Detail' : 'Give Feedback'}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SharedProjectCard