import { GoogleGenerativeAI } from '@google/generative-ai';
import { ChatMessage } from '../types';

export interface AIResponse {
  content: string;
  followUps?: string[];
  isMock?: boolean;
}

// Enhanced AI Agent with better responses
const mockResponses: Record<string, AIResponse> = {
  'calculus': {
    content: `I'm here to help you master calculus! Let me break this down systematically:

## 🎯 Problem Analysis
First, let's identify what type of calculus problem you're working with:
- **Derivatives**: Finding rates of change
- **Integrals**: Finding areas or antiderivatives  
- **Limits**: Understanding behavior as values approach a point

## 📚 Key Concepts & Formulas

### Derivatives
- Power Rule: d/dx[xⁿ] = nxⁿ⁻¹
- Product Rule: d/dx[f(x)g(x)] = f'(x)g(x) + f(x)g'(x)
- Chain Rule: d/dx[f(g(x))] = f'(g(x)) · g'(x)

### Integrals
- Power Rule: ∫xⁿdx = xⁿ⁺¹/(n+1) + C
- Integration by Parts: ∫u dv = uv - ∫v du
- Substitution: Let u = g(x), then ∫f(g(x))g'(x)dx = ∫f(u)du

## 🔍 Step-by-Step Approach
1. **Identify the problem type and applicable rules**
2. **Set up the problem with proper notation**
3. **Apply the appropriate technique step by step**
4. **Simplify and check your work**
5. **Verify your answer makes sense**

**Quick Example**: ∫2x dx = 2∫x dx = 2(x²/2) + C = x² + C

What specific calculus concept would you like help with?`,
    followUps: [
      'Show me integration by parts with a complex example',
      'How do I solve limits with L\'Hôpital\'s rule?',
      'Can you explain the chain rule with multiple functions?',
      'Help me with trigonometric integrals'
    ],
    isMock: true
  },
  'physics': {
    content: `Let me help you with this physics problem:

## Step 1: Draw a Free Body Diagram
- Identify all forces acting on the object
- Label forces with their magnitudes and directions
- Choose a coordinate system

## Step 2: Apply Newton's Laws
- ΣF = ma (Newton's second law)
- Break forces into components if needed
- Solve for unknowns

## Step 3: Check Units and Reasonableness
- Ensure your answer has correct units
- Verify the magnitude makes sense

**Example**: For a block on an inclined plane, the forces are:
- Weight (mg) downward
- Normal force (N) perpendicular to surface
- Friction (f) parallel to surface

Would you like me to work through a specific scenario?`,
    followUps: [
      'How do I handle friction problems?',
      'What about circular motion?',
      'Can you explain energy conservation?'
    ],
    isMock: true
  },
  'coding': {
    content: `Here's how to approach this coding problem:

## Step 1: Understand the Problem
- Read the problem statement carefully
- Identify inputs, outputs, and constraints
- Consider edge cases

## Step 2: Plan Your Approach
- Choose appropriate data structures
- Think about time and space complexity
- Consider different algorithms

## Step 3: Write Pseudocode
- Break down the solution into steps
- Handle edge cases explicitly
- Test your logic mentally

## Step 4: Implement and Test
- Write clean, readable code
- Test with sample inputs
- Debug any issues

**Example**: For finding the maximum element in an array:
\`\`\`javascript
function findMax(arr) {
  if (arr.length === 0) return null;
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) max = arr[i];
  }
  return max;
}
\`\`\`

Need help with a specific algorithm or data structure?`,
    followUps: [
      'How do I optimize this solution?',
      'What about handling edge cases?',
      'Can you explain the time complexity?'
    ],
    isMock: true
  },
  'biology': {
    content: `🧬 Welcome to your Biology study session! Let me help you understand the concepts:

## 🔬 Key Biology Concepts

### Cell Biology
- **Cell Structure**: Organelles and their functions
- **Cell Division**: Mitosis and meiosis processes
- **Cellular Respiration**: ATP production pathways

### Genetics
- **DNA Structure**: Double helix and base pairing
- **Protein Synthesis**: Transcription and translation
- **Mendelian Genetics**: Dominant and recessive traits

### Evolution
- **Natural Selection**: Survival of the fittest
- **Adaptation**: How organisms change over time
- **Speciation**: Formation of new species

## 📋 Study Strategies
1. **Create concept maps** to visualize relationships
2. **Use mnemonics** for complex processes
3. **Draw diagrams** to understand structures
4. **Practice with flashcards** for terminology

**Example**: The central dogma of biology: DNA → RNA → Protein

What specific biology topic would you like to explore?`,
    followUps: [
      'Explain photosynthesis step by step',
      'How does DNA replication work?',
      'What are the stages of mitosis?',
      'Help me understand genetic inheritance'
    ],
    isMock: true
  },
  'chemistry': {
    content: `⚗️ Let's dive into Chemistry! I'll help you master these concepts:

## 🧪 Core Chemistry Topics

### Atomic Structure
- **Electron Configuration**: How electrons are arranged
- **Periodic Trends**: Properties across the periodic table
- **Chemical Bonding**: Ionic, covalent, and metallic bonds

### Organic Chemistry
- **Functional Groups**: Alcohols, aldehydes, ketones, etc.
- **Reaction Mechanisms**: How reactions occur step by step
- **Stereochemistry**: 3D arrangement of molecules

### Stoichiometry
- **Mole Calculations**: Converting between mass and moles
- **Balancing Equations**: Conservation of mass
- **Limiting Reactants**: Finding the limiting reagent

## 🔬 Problem-Solving Approach
1. **Identify the type of problem**
2. **Write down given information**
3. **Choose the appropriate formula/method**
4. **Show all calculations clearly**
5. **Check units and significant figures**

**Example**: For a simple stoichiometry problem:
Given: 2H₂ + O₂ → 2H₂O
If you have 4 moles of H₂, you need 2 moles of O₂ to react completely.

What chemistry concept would you like help with?`,
    followUps: [
      'Help me balance complex chemical equations',
      'Explain organic reaction mechanisms',
      'How do I calculate molarity and molality?',
      'What are the different types of chemical bonds?'
    ],
    isMock: true
  },
  'default': {
    content: `🎓 I'm your AI study companion! Here's how I can help you succeed:

## 🚀 My Capabilities
- **Step-by-step problem solving** with detailed explanations
- **Concept clarification** for complex topics
- **Study strategies** tailored to your subject
- **Practice problems** with guided solutions
- **Memory techniques** and learning tips

## 📚 Subjects I Can Help With
- **Mathematics**: Calculus, Algebra, Statistics
- **Sciences**: Physics, Chemistry, Biology
- **Computer Science**: Programming, Algorithms, Data Structures
- **Engineering**: Problem-solving approaches
- **General Study Skills**: Note-taking, exam prep

## 💡 How to Get the Best Help
1. **Be specific** about what you're struggling with
2. **Show your work** so I can see where you might be going wrong
3. **Ask follow-up questions** to deepen your understanding
4. **Use the course context** to get more relevant help

**Remember**: I'm here to guide your learning, not just give answers. Let's work together to build your understanding!

What would you like to work on today?`,
    followUps: [
      'Give me a study strategy for my upcoming exam',
      'Help me understand a concept I\'m struggling with',
      'Can you create practice problems for me?',
      'What are some effective note-taking techniques?'
    ],
    isMock: true
  }
};

export const askHomework = async ({
  courseId,
  question,
  context
}: {
  courseId?: string;
  question: string;
  context?: string;
}): Promise<AIResponse> => {
  const apiKey = (import.meta as any).env.VITE_GEMINI_KEY;

  // Force real AI - no mock responses
  if (!apiKey) {
    throw new Error('Google AI API key not found. Please add VITE_GEMINI_KEY to your .env.local file.');
  }

  try {
    // Initialize the Google Generative AI client
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });

    const courseContext = courseId ? `\n\nCourse Context: ${courseId}` : '';
    const additionalContext = context ? `\n\nAdditional Context: ${context}` : '';
    
    const systemPrompt = `You are CampusReels AI, a helpful homework assistant for college students. Your role is to provide educational guidance that helps students learn and understand concepts.

## Your Guidelines:
- **Educational Focus**: Provide step-by-step guidance, not complete answers
- **Encouraging Tone**: Be supportive and motivating
- **Mathematical Notation**: Use LaTeX for math (inline: $formula$, block: $$formula$$)
- **Code Examples**: Provide relevant code snippets when appropriate
- **Study Tips**: Include memory techniques and learning strategies
- **Follow-up Questions**: Always suggest 2-3 helpful follow-up questions
- **Academic Integrity**: Refuse to do graded work directly - offer guidance instead

## Response Format:
1. Brief acknowledgment of the question
2. Step-by-step approach or explanation
3. Key concepts to remember
4. Example or demonstration
5. Study tips or common pitfalls
6. Follow-up questions

${courseContext}${additionalContext}`;

    const result = await model.generateContent(`${systemPrompt}\n\nStudent Question: ${question}`);
    const response = await result.response;
    const content = response.text();

    // Generate contextual follow-up questions based on the response
    const followUps = generateFollowUpQuestions(question, courseId);

    return {
      content,
      followUps,
      isMock: false
    };

  } catch (error) {
    console.error('Gemini API error:', error);
    // Return error response instead of mock
    return {
      content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again or check your internet connection.`,
      followUps: [
        'Try asking your question again',
        'Check your internet connection',
        'Contact support if the problem persists'
      ],
      isMock: false
    };
  }
};

// Helper function to generate contextual follow-up questions
const generateFollowUpQuestions = (question: string, courseId?: string): string[] => {
  const lowerQuestion = question.toLowerCase();
  
  // Course-specific follow-ups
  if (courseId) {
    switch (courseId) {
      case 'CSE310':
      case 'CSE450':
        return [
          'Can you show me a code example for this?',
          'What\'s the time complexity of this approach?',
          'How would I test this solution?'
        ];
      case 'MAT265':
      case 'MAT266':
        return [
          'Can you show me a similar problem?',
          'What are common mistakes to avoid?',
          'How do I check if my answer is correct?'
        ];
      case 'BIO101':
        return [
          'Can you explain this with a diagram?',
          'What are the real-world applications?',
          'How does this relate to other biological processes?'
        ];
      case 'CHEM201':
        return [
          'Can you show me the molecular structure?',
          'What are the reaction mechanisms?',
          'How do I balance this equation?'
        ];
      case 'PHY121':
        return [
          'Can you draw a free body diagram?',
          'What formulas should I use?',
          'How do I set up this problem?'
        ];
    }
  }
  
  // Subject-based follow-ups
  if (lowerQuestion.includes('calculus') || lowerQuestion.includes('derivative') || lowerQuestion.includes('integral')) {
    return [
      'Can you show me a step-by-step example?',
      'What\'s the geometric interpretation?',
      'How do I verify my answer?'
    ];
  } else if (lowerQuestion.includes('physics') || lowerQuestion.includes('force') || lowerQuestion.includes('motion')) {
    return [
      'Can you draw a diagram for this?',
      'What are the key equations?',
      'How do I approach similar problems?'
    ];
  } else if (lowerQuestion.includes('biology') || lowerQuestion.includes('cell') || lowerQuestion.includes('dna')) {
    return [
      'Can you explain this process step by step?',
      'What are the key components involved?',
      'How does this relate to other biological concepts?'
    ];
  } else if (lowerQuestion.includes('chemistry') || lowerQuestion.includes('molecule') || lowerQuestion.includes('reaction')) {
    return [
      'Can you show me the chemical equation?',
      'What are the key principles here?',
      'How do I predict the products?'
    ];
  } else if (lowerQuestion.includes('code') || lowerQuestion.includes('algorithm') || lowerQuestion.includes('programming')) {
    return [
      'Can you show me the code implementation?',
      'What\'s the time and space complexity?',
      'How do I test this solution?'
    ];
  }
  
  // Default follow-ups
  return [
    'Can you explain this in simpler terms?',
    'What are some practical examples?',
    'How can I practice this concept?'
  ];
};

// Helper to detect if we're in mock mode
export const isMockMode = (): boolean => {
  return !(import.meta as any).env.VITE_GEMINI_KEY;
};
