export interface rewardDetailListProps {
  id: number;
  title: string;
  reward: string | number;
  shortDescription: string;
  description: string;
  bgImagePath: string;
  previewImagePath: string;
  previewImagePathBig: string;
  requireTimes: number;
  active: boolean;
}

export const rewardDetailList: rewardDetailListProps[] = [
  {
    id: 1,
    title: "Master Collector",
    reward: 20,
    shortDescription: "Acquire 3 NFTs from our collection.",
    description: `Unlocked by users who acquire 3 NFTs from our collection. As a reward, users are granted 20 SIGDAO, empowering them with valuable resources to enhance their overall experience.`,
    bgImagePath: "photo-1@1x.png",
    previewImagePath: "img/marketplace/nft-avatar-4@1x.png",
    previewImagePathBig: "img/reward/nft-avatar-4@1x.png",
    requireTimes: 3,
    active: true,
  },
  {
    id: 2,
    title: "Selfie Champion",
    reward: "An extra Level 1 NFT.",
    shortDescription: "Selfies for 60 consecutive days",
    description: `Earned by users who maintain a consistent practice of capturing their progress through selfies for 60 consecutive days. This remarkable commitment is acknowledged with the unlocking of a rare and coveted NFT, symbolizing their dedication and perseverance.`,
    bgImagePath: "photo-3@1x.png",
    previewImagePath: "img/marketplace/nft-avatar-5@1x.png",
    previewImagePathBig: "img/reward/nft-avatar-5@1x.png",
    // sigdao: 20,
    requireTimes: 60,
    active: true,
  },
  {
    id: 3,
    title: "Super Connector",
    reward: 15,
    shortDescription: "Refer 5 new users to Bettermi.io",
    description: `Refer 5 new users to our platform, and you'll unlock “Super Connector” status. This elite tier grants you 15 fat stacks of SIGDAO as a reward for your evangelism.`,
    bgImagePath: "Super_Connector_Banner.png",
    previewImagePath: "img/reward/super_connector_square.png",
    previewImagePathBig: "img/reward/super_connector_square.png",
    requireTimes: 5,
    active: true,
  },
  {
    id: 4,
    title: "Elite Challenger",
    reward: "A Free healthy product",
    shortDescription: "Complete 50 challenges",
    description: `Users who complete 50 challenges, whether accumulated over time or in one continuous effort, unlock this achievement. As a result, users receive a complimentary healthy product to our exclusive partner lifestyle service, celebrating your progress and elevating your fitness journey even further. `,
    bgImagePath: "photo-1-1x-png@1x.png",
    previewImagePath: "img/marketplace/nft-avatar-7@1x.png",
    previewImagePathBig: "img/reward/nft-avatar-7@1x.png",
    requireTimes: 50,
    active: false,
  },
  {
    id: 5,
    title: "Wellness Milestone",
    reward: "A Free healthy product",
    shortDescription: "Hit the first healthy BMI range",
    description: `As users hit the first healthy BMI range, they achieve a significant accomplishment. This achievement marks the commitment to wellness and is celebrated with a special reward`,
    bgImagePath: "Wellness-Milestone-Cover.png",
    previewImagePath: "img/reward/Wellness_Milestone_Square.png",
    previewImagePathBig: "img/reward/Wellness_Milestone_Square.png",
    requireTimes: 1,
    active: false,
  },

];
