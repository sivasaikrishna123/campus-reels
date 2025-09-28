import { Pointer } from '../types';

export const demoPointers: Pointer[] = [
  {
    id: 'pointer1',
    courseId: 'CSE310',
    title: 'Binary Search Implementation Tips',
    body: 'Always check for edge cases: empty array, single element, target not found. Use left + (right - left) / 2 to avoid integer overflow. Remember to update bounds correctly!',
    tags: ['binarysearch', 'algorithms', 'tips'],
    upvotes: 45,
    createdAt: Date.now() - 3600000
  },
  {
    id: 'pointer2',
    courseId: 'MAT265',
    title: 'L\'Hôpital\'s Rule Quick Check',
    body: 'Only use L\'Hôpital\'s rule for 0/0 or ∞/∞ forms. If you get the same form after applying it, try again. If it keeps cycling, use a different method!',
    tags: ['calculus', 'limits', 'lhopital'],
    upvotes: 38,
    createdAt: Date.now() - 7200000
  },
  {
    id: 'pointer3',
    courseId: 'PHY121',
    title: 'Free Body Diagrams',
    body: 'Always draw FBDs for each object separately. Include ALL forces acting on the object. Don\'t forget normal forces, friction, and tension!',
    tags: ['physics', 'forces', 'diagrams'],
    upvotes: 52,
    createdAt: Date.now() - 10800000
  },
  {
    id: 'pointer4',
    courseId: 'ENG108',
    title: 'APA Citation Format',
    body: 'In-text: (Author, Year). Reference list: Author, A. A. (Year). Title. Publisher. For websites, include Retrieved from URL and access date.',
    tags: ['writing', 'citation', 'apa'],
    upvotes: 29,
    createdAt: Date.now() - 14400000
  },
  {
    id: 'pointer5',
    courseId: 'CSE310',
    title: 'Hash Table Collision Handling',
    body: 'Chaining: Store multiple values in same bucket. Open addressing: Find next available slot. Load factor should stay below 0.75 for good performance.',
    tags: ['hashtable', 'collision', 'datastructures'],
    upvotes: 41,
    createdAt: Date.now() - 18000000
  },
  {
    id: 'pointer6',
    courseId: 'MAT265',
    title: 'Integration by Parts LIATE',
    body: 'Choose u using LIATE order: Logarithmic, Inverse trig, Algebraic, Trigonometric, Exponential. The rest becomes dv.',
    tags: ['calculus', 'integration', 'parts'],
    upvotes: 67,
    createdAt: Date.now() - 21600000
  },
  {
    id: 'pointer7',
    courseId: 'PHY121',
    title: 'Unit Conversion Shortcuts',
    body: '1 m = 100 cm = 1000 mm. 1 kg = 1000 g. 1 N = 1 kg⋅m/s². Always check units in your final answer!',
    tags: ['physics', 'units', 'conversion'],
    upvotes: 33,
    createdAt: Date.now() - 25200000
  },
  {
    id: 'pointer8',
    courseId: 'HST100',
    title: 'Primary vs Secondary Sources',
    body: 'Primary: Created at the time (letters, diaries, photos). Secondary: Created later (textbooks, articles). Use both for balanced research!',
    tags: ['history', 'sources', 'research'],
    upvotes: 24,
    createdAt: Date.now() - 28800000
  },
  {
    id: 'pointer9',
    courseId: 'CSE310',
    title: 'Recursion Base Cases',
    body: 'Always define base cases first! They should be simple and not require recursion. Test with smallest possible inputs.',
    tags: ['recursion', 'basecase', 'algorithms'],
    upvotes: 56,
    createdAt: Date.now() - 32400000
  },
  {
    id: 'pointer10',
    courseId: 'MAT265',
    title: 'Chain Rule Memory Trick',
    body: 'Think of it as "outside derivative times inside derivative". For f(g(x)), take derivative of f, keep g(x) inside, then multiply by g\'(x).',
    tags: ['calculus', 'chainrule', 'derivatives'],
    upvotes: 49,
    createdAt: Date.now() - 36000000
  }
];
