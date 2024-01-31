const firstNames = ["Joey", "Maggie", "David", "Emily", "Kevin", "Sophia", "Daniel", "Olivia", "Michael", "Ava", "William", "Isabella", "Alexander", "Grace", "Benjamin", "Charlotte", "Lucas", "Amelia", "Matthew", "Ella", "Henry", "Lily", "Jacob", "Emma", "James", "Madison", "Ethan", "Chloe", "Samuel", "Avery", "Christopher", "Abigail"];
const lastNames = ["Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson", "Clark", "Rodriguez", "Lewis", "Lee", "Walker", "Hall", "Allen", "Young", "King", "Wright", "Scott", "Green", "Baker", 
                   "Adams", "Nelson", "Carter", "Mitchell", "Perez", "Roberts", "Turner", "Phillips", "Campbell", "Parker", "Evans", "Edwards", "Collins", "Stewart", "Sanchez", "Morris", "Rogers", "Reed", "Cook", "Morgan", "Bell", "Murphy", "Bailey", "Cooper", "Richardson", "Cox", "Howard", "Ward", "Torres", "Peterson", "Gray", "Ramirez", "James", "Watson", "Brooks"];


function generateName(): string {

  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

  return `${firstName}_${lastName}`;
}

export default generateName