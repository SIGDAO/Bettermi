export interface IAiCoachDetailListProps {
  coachName: string;
  coachID: string;
  coachImagePath: string;
  startingString: string;
  coachUserName: string;
}


export const coachList: IAiCoachDetailListProps[] = [
  {
    coachID: `1`,
    coachImagePath: `ai-chatbot-mimi-1@1x.png`,
    coachName: `Mimi`,
    coachUserName: `mental coach`,
    startingString: `Hi, I am your Mimi coach\nHow can I help? 😘`,
  },
  {
    coachID: `2`,
    coachImagePath: `ai-chatbot-io@1x.png`,
    coachName: `.io`,
    coachUserName: `fitness coach`,
    startingString: `Hi, I am your .io coach\nHow can I help? 😘`,
  },
];