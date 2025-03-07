// import React, { useState } from 'react';
// import { 
//   Users, Search, Plus, MessageCircle, Calendar, 
//   BookOpen, Clock, ChevronRight, Settings, Star
// } from 'lucide-react';

// const StudyGroups = () => {
//   const [activeTab, setActiveTab] = useState('myGroups');
  
//   // Sample data
//   const myGroups = [
//     {
//       id: 1,
//       name: "Advanced Calculus Study Group",
//       members: 8,
//       nextSession: "Today, 3:00 PM",
//       subject: "Mathematics",
//       unreadMessages: 3
//     },
//     {
//       id: 2,
//       name: "Physics Lab Prep Team",
//       members: 5,
//       nextSession: "Tomorrow, 2:00 PM",
//       subject: "Physics",
//       unreadMessages: 0
//     }
//   ];

//   const recommendedGroups = [
//     {
//       id: 3,
//       name: "Data Structures & Algorithms",
//       members: 12,
//       subject: "Computer Science",
//       activityLevel: "Very Active"
//     },
//     {
//       id: 4,
//       name: "Organic Chemistry Study Circle",
//       members: 6,
//       subject: "Chemistry",
//       activityLevel: "Active"
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white border-b">
//         <div className="container mx-auto px-4 py-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-2xl font-bold">Study Groups</h1>
//               <p className="text-gray-600 mt-1">Collaborate and learn together</p>
//             </div>
//             <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
//               <Plus className="h-5 w-5 mr-2" />
//               Create New Group
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="container mx-auto px-4 py-8">
//         {/* Tabs */}
//         <div className="flex space-x-4 mb-6">
//           <button
//             onClick={() => setActiveTab('myGroups')}
//             className={`px-4 py-2 rounded-lg ${
//               activeTab === 'myGroups'
//                 ? 'bg-blue-600 text-white'
//                 : 'bg-white text-gray-600 hover:bg-gray-100'
//             }`}
//           >
//             My Groups
//           </button>
//           <button
//             onClick={() => setActiveTab('discover')}
//             className={`px-4 py-2 rounded-lg ${
//               activeTab === 'discover'
//                 ? 'bg-blue-600 text-white'
//                 : 'bg-white text-gray-600 hover:bg-gray-100'
//             }`}
//           >
//             Discover
//           </button>
//         </div>

//         {/* Search Bar */}
//         <div className="relative mb-6">
//           <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search groups..."
//             className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         {activeTab === 'myGroups' ? (
//           /* My Groups */
//           <div className="space-y-4">
//             {myGroups.map(group => (
//               <div key={group.id} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <h3 className="text-lg font-semibold">{group.name}</h3>
//                     <div className="flex items-center mt-2 text-gray-600">
//                       <Users className="h-4 w-4 mr-1" />
//                       <span className="mr-4">{group.members} members</span>
//                       <BookOpen className="h-4 w-4 mr-1" />
//                       <span>{group.subject}</span>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-3">
//                     {group.unreadMessages > 0 && (
//                       <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
//                         {group.unreadMessages} new
//                       </span>
//                     )}
//                     <button className="p-2 hover:bg-gray-100 rounded-full">
//                       <Settings className="h-5 w-5 text-gray-600" />
//                     </button>
//                   </div>
//                 </div>
                
//                 <div className="mt-4 flex items-center justify-between">
//                   <div className="flex items-center text-gray-600">
//                     <Clock className="h-4 w-4 mr-1" />
//                     <span>Next: {group.nextSession}</span>
//                   </div>
//                   <div className="flex space-x-2">
//                     <button className="flex items-center px-3 py-1 bg-gray-100 rounded hover:bg-gray-200">
//                       <Calendar className="h-4 w-4 mr-1" />
//                       Schedule
//                     </button>
//                     <button className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
//                       <MessageCircle className="h-4 w-4 mr-1" />
//                       Chat
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           /* Discover Groups */
//           <div className="grid md:grid-cols-2 gap-4">
//             {recommendedGroups.map(group => (
//               <div key={group.id} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
//                 <div className="flex justify-between items-start mb-4">
//                   <h3 className="text-lg font-semibold">{group.name}</h3>
//                   <Star className="h-5 w-5 text-yellow-400" />
//                 </div>
//                 <div className="flex items-center text-gray-600 mb-4">
//                   <Users className="h-4 w-4 mr-1" />
//                   <span className="mr-4">{group.members} members</span>
//                   <BookOpen className="h-4 w-4 mr-1" />
//                   <span>{group.subject}</span>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <span className="text-green-600 text-sm">{group.activityLevel}</span>
//                   <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
//                     Join Group
//                     <ChevronRight className="h-4 w-4 ml-1" />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default StudyGroups;

// Main App Component
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Header from '../components/StudyGroup/Header';
import TabNavigation from '../components/StudyGroup/TabNavigation';
import SearchBar from '../components/StudyGroup/SearchBar';
import MyGroupsList from '../components/StudyGroup/MyGroupsList';
import RecommendedGroupsList from '../components/StudyGroup/RecommendedGroupsList';
import CreateGroupModal from '../components/StudyGroup/CreateGroupModal';
import RecommendationsBanner from '../components/StudyGroup/RecommendationsBanner';

const SocialStudyGroups = () => {
  const [activeTab, setActiveTab] = useState('discover');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    subject: '',
    description: '',
    isPrivate: false,
    tags: []
  });

  // Sample data for user's study groups
  const myGroups = [
    {
      id: 1,
      name: "Advanced Calculus Study Group",
      members: 8,
      nextSession: "Today, 3:00 PM",
      subject: "Mathematics",
      unreadMessages: 3,
      tags: ["Calculus", "Advanced Mathematics", "Engineering"]
    },
    {
      id: 2,
      name: "Physics Lab Prep Team",
      members: 5,
      nextSession: "Tomorrow, 2:00 PM",
      subject: "Physics",
      unreadMessages: 0,
      tags: ["Physics", "Laboratory", "Quantum Mechanics"]
    }
  ];

  // Sample data for GraphRAG recommended groups
  const recommendedGroups = [
    {
      id: 3,
      name: "Data Structures & Algorithms",
      members: 12,
      subject: "Computer Science",
      activityLevel: "Very Active",
      matchScore: 95,
      matchReason: "Based on your recent study of programming fundamentals",
      tags: ["Algorithms", "Data Structures", "Python", "Competitive Programming"]
    },
    {
      id: 4,
      name: "Organic Chemistry Study Circle",
      members: 6,
      subject: "Chemistry",
      activityLevel: "Active",
      matchScore: 87,
      matchReason: "Compatible with your biochemistry focus and study patterns",
      tags: ["Organic Chemistry", "Biochemistry", "Pre-Med", "MCAT Prep"]
    },
    {
      id: 5,
      name: "Machine Learning Fundamentals",
      members: 15,
      subject: "Computer Science",
      activityLevel: "Very Active",
      matchScore: 82,
      matchReason: "Aligns with your interest in linear algebra and statistics",
      tags: ["Machine Learning", "AI", "Python", "Statistics"]
    }
  ];

  const handleCreateGroup = (groupData) => {
    // Here you would integrate with your backend to save the group
    console.log("Creating group:", groupData);
    setShowCreateModal(false);
    
    // Reset form
    setNewGroup({
      name: '',
      subject: '',
      description: '',
      isPrivate: false,
      tags: []
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onCreateGroupClick={() => setShowCreateModal(true)} 
      />

      <div className="container mx-auto px-4 py-8">
        <TabNavigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />

        {activeTab === 'discover' && <RecommendationsBanner />}

        <SearchBar />

        {activeTab === 'myGroups' ? (
          <MyGroupsList groups={myGroups} />
        ) : (
          <RecommendedGroupsList groups={recommendedGroups} />
        )}
      </div>

      {showCreateModal && (
        <CreateGroupModal
          newGroup={newGroup}
          setNewGroup={setNewGroup}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateGroup}
        />
      )}
    </div>
  );
};

export default SocialStudyGroups;