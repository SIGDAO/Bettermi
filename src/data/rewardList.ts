interface rewardDetailListProps {
  id: number,
  title: string,
  reward?: string | number,
  description: string,
  bgImagePath?: string,
  requireTimes?: number,
}

export const rewardDetailList: rewardDetailListProps[] = [
  {
    id: 1,
    title: 'Master Collector',
    reward: 20,
    description: `Unlocked by users who acquire 3 NFTs from our collection. As a reward, users are granted 20 SIGDAO, empowering them with valuable resources to enhance their overall experience.`,
    bgImagePath: 'photo-1@1x.png',
    requireTimes: 3,
  },{
    id: 2,
    title: 'Selfie Champion',
    reward: 'Get a Random NFT.',
    description: `Earned by users who maintain a consistent practice of capturing their progress through selfies for 60 consecutive days. This remarkable commitment is acknowledged with the unlocking of a rare and coveted NFT, symbolizing their dedication and perseverance.`,
    bgImagePath: 'photo-3@1x.png',
    // sigdao: 20,
    requireTimes: 60,
  },{
    id: 3,
    title: 'Wellness Milestone',
    description: `As users hit the first healthy BMI range, they achieve a significant accomplishment. This achievement marks the commitment to wellness and is celebrated with a special reward`,
    bgImagePath: 'Wellness-Milestone-Cover.png',
    reward: 'Get a Free Health related Product',
    requireTimes: 1,
  },
  {
    id: 4,
    title: 'Elite Challenger',
    reward: 'Receive our exclusive healthy product',
    description: `Users who complete 50 challenges, whether accumulated over time or in one continuous effort, unlock this achievement. As a result, users receive a complimentary healthy product to our exclusive partner lifestyle service, celebrating your progress and elevating your fitness journey even further. `,
    bgImagePath: 'photo-1-1x-png@1x.png',
    requireTimes: 50,
  }
]
