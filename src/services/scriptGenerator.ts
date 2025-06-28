export class ScriptGenerator {
  private static scripts: Record<string, string> = {
    'how to stay focused': 'Focus is the cornerstone of productivity in our distraction-filled world. Start by creating a dedicated workspace free from interruptions and practice the Pomodoro technique with 25-minute focused intervals.',
    
    'benefits of meditation': 'Meditation transforms both mind and body by reducing stress hormones while boosting feel-good neurotransmitters. Just 10-15 minutes of daily practice can revolutionize your mental clarity and overall well-being.',
    
    'time management tips': 'Effective time management is the key to achieving more while feeling less overwhelmed. Use the Eisenhower Matrix to prioritize tasks and time-block your calendar for maximum efficiency.',
    
    'productivity hacks': 'Productivity is about working smarter, not harder with proven strategies that transform your output. Begin each day by tackling your most important task first when your energy is highest.',
    
    'stress management': 'Managing stress effectively is crucial for both mental health and peak performance in all areas of life. Start by identifying your stress triggers and developing healthy coping mechanisms like deep breathing exercises.',
    
    'public speaking': 'Public speaking is a skill that can be mastered with the right techniques and consistent practice. Start by thoroughly knowing your material and use storytelling to connect with your audience emotionally.',
    
    'healthy habits': 'Building healthy habits is the foundation of a vibrant, fulfilling life that compounds over time. Start small with keystone habits and focus on consistency over perfection for remarkable long-term results.',
    
    'financial planning': 'Smart financial planning is essential for achieving long-term security and freedom in your personal life. Start by creating a detailed budget and building an emergency fund covering 3-6 months of expenses.'
  };

  static generateScript(topic: string): string {
    const normalizedTopic = topic.toLowerCase().trim();
    
    // Check for exact matches first
    if (this.scripts[normalizedTopic]) {
      return this.scripts[normalizedTopic];
    }
    
    // Check for partial matches
    for (const [key, script] of Object.entries(this.scripts)) {
      if (normalizedTopic.includes(key) || key.includes(normalizedTopic)) {
        return script;
      }
    }
    
    // Generate a very short generic script for unknown topics
    return `Understanding ${topic} is essential for personal and professional growth in today's world. Start with small, manageable steps and focus on consistent practice for remarkable results.`;
  }
}