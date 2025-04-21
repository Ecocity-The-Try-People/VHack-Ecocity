import React from 'react';
import { Award, Trophy, Star, Users } from 'lucide-react';
import useDarkMode from '../../hooks/DarkMode';

const CitizenRewards = () => {
  const isDarkMode = useDarkMode();
  const leaderboard = [
    { id: 1, name: "Green Warrior", points: 1250, level: "Gold" },
    { id: 2, name: "Eco Champion", points: 980, level: "Silver" },
    { id: 3, name: "Recycle Master", points: 760, level: "Bronze" }
  ];

  const getLevelColor = (level) => {
    switch (level) {
      case "Gold": return "text-yellow-500";
      case "Silver": return "text-gray-300";
      case "Bronze": return "text-amber-700";
      default: return "text-blue-500";
    }
  };

  return (
    <div className="space-y-4">
      {/* Leaderboard Card */}
      <div className={`p-4 rounded-lg transition-colors duration-200 ${
        isDarkMode ? 'bg-gray-700' : 'bg-white'
      }`}>
        <h3 className={`flex items-center font-semibold mb-3 ${
          isDarkMode ? 'text-gray-100' : 'text-gray-800'
        }`}>
          <Award className={`mr-2 ${
            isDarkMode ? 'text-purple-400' : 'text-purple-500'
          }`} size={20} />
          Community Leaderboard
        </h3>
        
        <div className="space-y-3">
          {leaderboard.map((user, index) => (
            <div key={user.id} className={`flex items-center justify-between p-3 rounded-lg transition-colors duration-200 ${
              isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-50 hover:bg-gray-100'
            }`}>
              <div className="flex items-center">
                <span className={`font-bold mr-3 ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>#{index + 1}</span>
                <div>
                  <p className={`font-medium ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-800'
                  }`}>{user.name}</p>
                  <p className={`text-sm flex items-center ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    <Users className={`mr-1 ${getLevelColor(user.level)}`} size={14} />
                    {user.level} Tier
                  </p>
                </div>
              </div>
              <div className={`flex items-center px-3 py-1 rounded-full ${
                isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'
              }`}>
                <Star className="mr-1 text-yellow-500" size={14} />
                <span className={`font-bold ${
                  isDarkMode ? 'text-blue-300' : 'text-blue-700'
                }`}>{user.points} pts</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Reward Card */}
      <div className={`bg-gradient-to-r p-4 rounded-lg text-white ${
        isDarkMode 
          ? 'from-green-600 to-teal-600' 
          : 'from-green-500 to-teal-500'
      }`}>
        <h3 className="flex items-center font-semibold mb-2">
          <Trophy className="mr-2 text-yellow-300" size={20} />
          Current Reward
        </h3>
        <p className="text-sm text-white/90">
          Recycle 5 times this week to earn 50 bonus points and a chance to win eco-friendly products!
        </p>
      </div>
    </div>
  );
};

export default CitizenRewards;