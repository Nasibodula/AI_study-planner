// services/FocusService.js
const { insertFocusData: saveToArango, getUserFocusData } = require('../arango');

class FocusService {
  static async processFocusData(userId, focusData) {
    try {
      // Ensure proper data format
      const processedData = {
        _key: `focus_${Date.now()}`,
        session_id: focusData.session_id,
        user_id: userId,
        timestamp: new Date().toISOString(),
        focus_score: parseInt(focusData.focus_score),
        distraction_count: focusData.distraction_count || 0,
        attention_span: focusData.attention_span || 0,
        is_final_record: focusData.is_final_record || false
      };
      
      // Store in ArangoDB
      return await saveToArango(processedData);
    } catch (error) {
      console.error('Error processing focus data:', error);
      throw error;
    }
  }

  static async getUserFocusData(userId) {
    return await getUserFocusData(userId);
  }
  
  static calculateFocusStats(focusData) {
    if (!focusData || focusData.length === 0) {
      return {
        averageFocusScore: 0,
        totalDistractions: 0,
        averageAttentionSpan: 0,
        totalSessions: 0
      };
    }
    
    // Get unique sessions
    const sessionIds = [...new Set(focusData.map(data => data.session_id))];
    
    // Calculate average focus score
    const totalScore = focusData.reduce((sum, data) => sum + data.focus_score, 0);
    const averageFocusScore = totalScore / focusData.length;
    
    // Calculate total distractions
    const totalDistractions = focusData.reduce((sum, data) => sum + data.distraction_count, 0);
    
    // Calculate average attention span
    const validSpans = focusData.filter(data => data.attention_span > 0);
    const totalSpan = validSpans.reduce((sum, data) => sum + data.attention_span, 0);
    const averageAttentionSpan = validSpans.length > 0 ? totalSpan / validSpans.length : 0;
    
    return {
      averageFocusScore,
      totalDistractions,
      averageAttentionSpan,
      totalSessions: sessionIds.length
    };
  }
}

module.exports = FocusService;