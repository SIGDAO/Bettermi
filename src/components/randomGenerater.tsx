const firstNames = ["Joey", "Maggie", "David", "Emily", "Kevin", "Sophia", "Daniel", "Olivia", "Michael", "Ava", "William", "Isabella", "Alexander", "Grace", "Benjamin", "Charlotte", "Lucas", "Amelia", "Matthew", "Ella", "Henry", "Lily", "Jacob", "Emma", "James", "Madison", "Ethan", "Chloe", "Samuel", "Avery", "Christopher", "Abigail"];
const lastNames = ["Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson", "Clark", "Rodriguez", "Lewis", "Lee", "Walker", "Hall", "Allen", "Young", "King", "Wright", "Scott", "Green", "Baker", 
                   "Adams", "Nelson", "Carter", "Mitchell", "Perez", "Roberts", "Turner", "Phillips", "Campbell", "Parker", "Evans", "Edwards", "Collins", "Stewart", "Sanchez", "Morris", "Rogers", "Reed", "Cook", "Morgan", "Bell", "Murphy", "Bailey", "Cooper", "Richardson", "Cox", "Howard", "Ward", "Torres", "Peterson", "Gray", "Ramirez", "James", "Watson", "Brooks"];

const mimiRandomMessage = ["I need help in improving communication with my partner",
                           "I need help in rebuilding trust in my relationship after a betrayal",
                           "I need help in knowing if I'm in a healthy and fulfilling relationship",
                           "I need help in navigating conflicts and disagreements in a productive way",
                           "I need help in keeping the spark alive in a long-term relationship",
                           "I need help in improving my sexual and intimacy relationship",
                           "I need help when I'm unsure about the future of my relationship",
                           "I need help in balancing personal goals with my relationship",
                           "I need help setting healthy boundaries in my relationship",
                           "I need help knowing harmful patterns to relationships and how to avoid them"]

const dotIoRandomMessage = ["I need help in designing an exercise program to lose weight",
                            "I need help in designing an exercise program to tone up the body",
                            "I need help in designing an exercise program to gain weight",
                            "I need help in designing an exercise program to ",
                            "I need help in designing an diet program to "]

export function generateName(): string {

  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

  return `${firstName}_${lastName}`;
}

export function generateMimiMessage(): string {
  return mimiRandomMessage[Math.floor(Math.random() * mimiRandomMessage.length)];
}

export function generateDotIoMessage(): string {
  return dotIoRandomMessage[Math.floor(Math.random() * dotIoRandomMessage.length)];
}

