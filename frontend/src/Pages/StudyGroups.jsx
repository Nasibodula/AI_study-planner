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