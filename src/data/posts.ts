import { Post } from '../types';

export const demoPosts: Post[] = [
  {
    id: 'post1',
    userId: 'user1',
    courseId: 'CSE310',
    title: 'Big O Notation Cheat Sheet',
    body: `# Big O Notation Cheat Sheet

Understanding time complexity is crucial for coding interviews and efficient programming.

## Common Time Complexities

- **O(1)** - Constant time (array access, hash table lookup)
- **O(log n)** - Logarithmic (binary search, balanced trees)
- **O(n)** - Linear (single loop, linear search)
- **O(n log n)** - Linearithmic (merge sort, heap sort)
- **O(n²)** - Quadratic (nested loops, bubble sort)
- **O(2ⁿ)** - Exponential (recursive Fibonacci)

## Space Complexity

Remember to consider both time AND space complexity when analyzing algorithms!`,
    tags: ['algorithms', 'complexity', 'cheatsheet'],
    likes: 124,
    comments: 23,
    createdAt: Date.now() - 3600000,
    isPointer: true
  },
  {
    id: 'post2',
    userId: 'user2',
    courseId: 'PHY121',
    title: 'Physics Formula Sheet',
    body: `# Essential Physics Formulas

## Kinematics
- v = v₀ + at
- x = x₀ + v₀t + ½at²
- v² = v₀² + 2a(x - x₀)

## Dynamics
- F = ma
- F = mg (weight)
- f = μN (friction)

## Energy
- KE = ½mv²
- PE = mgh
- W = Fd cos θ

Save this for your next exam! 📚`,
    tags: ['physics', 'formulas', 'kinematics'],
    likes: 89,
    comments: 15,
    createdAt: Date.now() - 7200000
  },
  {
    id: 'post3',
    userId: 'user3',
    courseId: 'MAT265',
    title: 'Calculus Integration Techniques',
    body: `# Integration Techniques Summary

## Basic Rules
- ∫ k dx = kx + C
- ∫ xⁿ dx = xⁿ⁺¹/(n+1) + C
- ∫ eˣ dx = eˣ + C

## Advanced Techniques
1. **Integration by Parts**: ∫ u dv = uv - ∫ v du
2. **Substitution**: Let u = g(x), then ∫ f(g(x))g'(x) dx = ∫ f(u) du
3. **Partial Fractions**: Break down rational functions

## Common Integrals
- ∫ sin(x) dx = -cos(x) + C
- ∫ cos(x) dx = sin(x) + C
- ∫ 1/x dx = ln|x| + C`,
    tags: ['calculus', 'integration', 'techniques'],
    likes: 156,
    comments: 28,
    createdAt: Date.now() - 10800000,
    isPointer: true
  },
  {
    id: 'post4',
    userId: 'user1',
    courseId: 'ENG108',
    title: 'Technical Writing Best Practices',
    body: `# Technical Writing Guidelines

## Structure
1. **Clear Introduction** - State the purpose
2. **Logical Flow** - Organize information logically
3. **Concise Language** - Be direct and precise
4. **Visual Aids** - Use diagrams, tables, and lists

## Style Tips
- Use active voice when possible
- Write in present tense for procedures
- Define technical terms on first use
- Use consistent terminology throughout

## Common Mistakes to Avoid
- Jargon without explanation
- Passive voice overuse
- Inconsistent formatting
- Missing context`,
    tags: ['writing', 'technical', 'guidelines'],
    likes: 67,
    comments: 12,
    createdAt: Date.now() - 14400000
  },
  {
    id: 'post5',
    userId: 'user2',
    courseId: 'CSE310',
    title: 'Data Structure Comparison',
    body: `# When to Use Which Data Structure?

## Arrays
- **Use for**: Random access, simple storage
- **Pros**: O(1) access, cache-friendly
- **Cons**: Fixed size, expensive insertions

## Linked Lists
- **Use for**: Dynamic size, frequent insertions/deletions
- **Pros**: Dynamic size, O(1) insertion at head
- **Cons**: No random access, extra memory for pointers

## Hash Tables
- **Use for**: Fast lookups, key-value pairs
- **Pros**: O(1) average lookup
- **Cons**: No ordering, hash collisions

## Trees
- **Use for**: Hierarchical data, searching
- **Pros**: Ordered, efficient search
- **Cons**: Complex implementation, balancing issues`,
    tags: ['datastructures', 'comparison', 'algorithms'],
    likes: 98,
    comments: 19,
    createdAt: Date.now() - 18000000,
    isPointer: true
  },
  {
    id: 'post6',
    userId: 'user3',
    courseId: 'HST100',
    title: 'Historical Timeline: Ancient Civilizations',
    body: `# Ancient Civilizations Timeline

## Mesopotamia (3500-500 BCE)
- First cities and writing systems
- Code of Hammurabi
- Ziggurats and irrigation

## Ancient Egypt (3100-30 BCE)
- Pyramids and pharaohs
- Hieroglyphic writing
- Advanced mathematics and medicine

## Ancient Greece (800-146 BCE)
- Democracy in Athens
- Philosophy (Socrates, Plato, Aristotle)
- Olympic Games

## Ancient Rome (753 BCE-476 CE)
- Republic and Empire
- Roman law and engineering
- Spread of Christianity

## Key Connections
These civilizations influenced each other through trade, conquest, and cultural exchange.`,
    tags: ['history', 'ancient', 'timeline'],
    likes: 73,
    comments: 14,
    createdAt: Date.now() - 21600000
  },
  {
    id: 'post7',
    userId: 'user1',
    courseId: 'MAT265',
    title: 'Derivative Rules Quick Reference',
    body: `# Derivative Rules Cheat Sheet

## Basic Rules
- d/dx[c] = 0 (constant rule)
- d/dx[xⁿ] = nxⁿ⁻¹ (power rule)
- d/dx[cf(x)] = cf'(x) (constant multiple)

## Product & Quotient Rules
- d/dx[f(x)g(x)] = f'(x)g(x) + f(x)g'(x)
- d/dx[f(x)/g(x)] = [f'(x)g(x) - f(x)g'(x)]/[g(x)]²

## Chain Rule
- d/dx[f(g(x))] = f'(g(x)) · g'(x)

## Common Derivatives
- d/dx[sin(x)] = cos(x)
- d/dx[cos(x)] = -sin(x)
- d/dx[eˣ] = eˣ
- d/dx[ln(x)] = 1/x`,
    tags: ['calculus', 'derivatives', 'rules'],
    likes: 112,
    comments: 21,
    createdAt: Date.now() - 25200000
  },
  {
    id: 'post8',
    userId: 'user2',
    courseId: 'PHY121',
    title: 'Lab Report Template',
    body: `# Physics Lab Report Template

## Title Page
- Experiment title
- Your name and date
- Course and section

## Abstract (100-150 words)
- Brief summary of experiment
- Key findings
- Conclusion

## Introduction
- Background theory
- Hypothesis
- Objectives

## Methods
- Equipment used
- Step-by-step procedure
- Safety considerations

## Results
- Data tables and graphs
- Sample calculations
- Error analysis

## Discussion
- Analysis of results
- Comparison to expected values
- Sources of error

## Conclusion
- Summary of findings
- Whether hypothesis was supported
- Suggestions for improvement`,
    tags: ['physics', 'lab', 'template'],
    likes: 45,
    comments: 8,
    createdAt: Date.now() - 28800000,
    isPointer: true
  }
];
