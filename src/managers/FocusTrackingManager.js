class FocusTrackingManager {
    constructor() {
      this.sessions = new Map();
    }
  
    createSession(sessionId) {
      const session = {
        startTime: Date.now(),
        duration: '00:00',
        distractions: 0,
        peakFocus: 0,
        currentFocus: 100,
        alerts: []
      };
      this.sessions.set(sessionId, session);
      return session;
    }
  
    updateSession(sessionId, updates) {
      const session = this.sessions.get(sessionId);
      if (!session) return null;
  
      const updatedSession = {
        ...session,
        ...updates
      };
      this.sessions.set(sessionId, updatedSession);
      return updatedSession;
    }
  
    addAlert(sessionId, message) {
      const session = this.sessions.get(sessionId);
      if (!session) return null;
  
      const alert = {
        id: Date.now(),
        message,
        timestamp: new Date().toLocaleTimeString()
      };
  
      session.alerts = [alert, ...session.alerts].slice(0, 5);
      return alert;
    }
  
    updateFocusScore(sessionId, newScore, isLookingAway) {
      const session = this.sessions.get(sessionId);
      if (!session) return null;
  
      const smoothedScore = Math.round(session.currentFocus * 0.7 + newScore * 0.3);
      const finalScore = Math.max(0, Math.min(100, smoothedScore));
  
      session.currentFocus = finalScore;
      session.peakFocus = Math.max(session.peakFocus, finalScore);
  
      if (isLookingAway) {
        session.distractions += 1;
      }
  
      return session;
    }
  
    formatDuration(milliseconds) {
      const seconds = Math.floor(milliseconds / 1000);
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }
  
    getSessionStats(sessionId) {
      const session = this.sessions.get(sessionId);
      if (!session) return null;
  
      const duration = this.formatDuration(Date.now() - session.startTime);
      return {
        duration,
        distractions: session.distractions,
        peakFocus: session.peakFocus,
        currentFocus: session.currentFocus,
        alerts: session.alerts
      };
    }
  
    endSession(sessionId) {
      const session = this.sessions.get(sessionId);
      this.sessions.delete(sessionId);
      return session;
    }
  }
  
  export default new FocusTrackingManager();