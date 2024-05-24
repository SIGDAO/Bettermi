export interface challengeList {
  title: string;
  pageTitle: string;
  description: string;
  duration: string;
  bodyPart: string;
  sigdao: string;
  nftLevel: string;
  missionImgPath: string;
  timeslot: { startingTime: string; endTime: string; }[];
  missionDescription?: string;
}

export const challengeList: challengeList[] = [
  {
    title: `1. Hello Bae !`,
    pageTitle: `Hello Bae`,
    description: `Straighten your arms & Shake them outwardly`,
    duration: `1 mins`,
    bodyPart: `Arms`,
    sigdao: `+0.875`,
    nftLevel: `1`,
    missionImgPath: process.env.PUBLIC_URL + "/img/missionChallenge/1HelloBae-BetterMiWithUniform.gif",
    timeslot: [
      {
        startingTime: "00:00",
        endTime: "00:06",
      },
    ],
    missionDescription: `Straighten your arms and shake them outwardly 
                         Swiping Left and Right (Hip Elbow 18:02 @video)
                         Sway your hips left and right to your elbow with bending arms pointing to the sky `,
    //Changed by Anderson 2023/11/12
    //   timeslot: [{
    //     startingTime: '9:00',
    //     endTime: '9:06',
    //   },
    //   {
    //     startingTime: '10:00',
    //     endTime: '10:06',
    //   },
    // ],
  },
  {
    title: "2. Swiping Left & Right",
    pageTitle: `Swiping Left & Right`,
    description: `Sway your hips left and right to your elbow with bending arms pointing to the sky`,
    duration: `1 mins`,
    bodyPart: `Hips`,
    sigdao: `+0.875`,
    nftLevel: `1`,
    missionImgPath: process.env.PUBLIC_URL + "/img/missionChallenge/2SwipingLeftandRight-BetterMiWithUniform.gif",
    timeslot: [
      {
        startingTime: "00:00",
        endTime: "00:06",
      },
    ],
    missionDescription: `As if you are on a skate and skipping side to side
                         Getting butterflies (chicken wings)
                         Bend your arms towards the body and flap them like a butterfly`,

    //Changed by Anderson 2023/11/12
    // timeslot: [{
    //   startingTime: '9:00',
    //   endTime: '9:06',
    // },
    // {
    //   startingTime: '10:00',
    //   endTime: '10:06',
    // }],
  },
  {
    title: "3. Into Your Dm",
    pageTitle: `Into Your Dm`,
    description: `As if you are on a skate and skipping side to side`,
    duration: `1 mins`,
    bodyPart: `Legs`,
    sigdao: `+0.875`,
    nftLevel: `1`,
    missionImgPath: process.env.PUBLIC_URL + "/img/missionChallenge/3IntoYourDM-BetterMiWithUniform.gif",
    timeslot: [
      {
        startingTime: "00:00",
        endTime: "00:06",
      },
    ],
    //Changed by Anderson 2023/11/12
    // timeslot: [{
    //   startingTime: '9:00',
    //   endTime: '9:06',
    // },
    // {
    //   startingTime: '10:00',
    //   endTime: '10:06',
    // }],
  },
  {
    title: "4. Getting Butterflies",
    pageTitle: `Getting Butterflies`,
    description: `Bend your arms towards the body and flap them like a butterfly`,
    duration: `2 mins`,
    bodyPart: `Arms`,
    sigdao: `+1.75`,
    nftLevel: `2`,
    missionImgPath: process.env.PUBLIC_URL + "/img/missionChallenge/4GettingButterflies-BetterMiWithUniform.gif",
    timeslot: [
      {
        startingTime: "00:00",
        endTime: "00:06",
      },
    ],
    //Changed by Anderson 2023/11/12
    // timeslot: [{
    //   startingTime: '14:00',
    //   endTime: '14:06',
    // },
    // {
    //   startingTime: '15:00',
    //   endTime: '15:06',
    // }],
  },
  {
    title: "5. Let's Cuddle",
    pageTitle: `Let\'s Cuddle`,
    description: `Stretch like a star and jump while crossing the straightened arms and legs`,
    duration: `2 mins`,
    bodyPart: `Overall`,
    sigdao: `+1.75`,
    nftLevel: `2`,
    missionImgPath: process.env.PUBLIC_URL + "/img/missionChallenge/5LetsCuddle-BetterMiWithUniform.gif",
    timeslot: [
      {
        startingTime: "00:00",
        endTime: "00:06",
      },
    ],
    //Changed by Anderson 2023/11/12
    // timeslot: [{
    //   startingTime: '14:00',
    //   endTime: '14:06',
    // },
    // {
    //   startingTime: '15:00',
    //   endTime: '15:06',
    // }],
  },
  {
    title: "6. Glow Up",
    pageTitle: `Glow Up`,
    description: `Stand upright with your arms extended straight above your head with crossing wrists, palms facing the sky`,
    duration: `2 mins`,
    bodyPart: `Overall`,
    sigdao: `+1.75`,
    nftLevel: `2`,
    missionImgPath: process.env.PUBLIC_URL + "/img/missionChallenge/6GlowUp-BetterMiWithUniform.gif",
    timeslot: [
      {
        startingTime: "00:00",
        endTime: "00:06",
      },
    ],
    //Changed by Anderson 2023/11/12
    // timeslot: [{
    //   startingTime: '14:00',
    //   endTime: '14:06',
    // },
    // {
    //   startingTime: '15:00',
    //   endTime: '15:06',
    // }],
  },
  {
    title: "7. Glow Up Together",
    pageTitle: `Glow Up Together`,
    description: `Glow up, but with only one leg standing`,
    duration: `3 mins`,
    bodyPart: `Overall`,
    sigdao: `+2.635`,
    nftLevel: `3`,
    missionImgPath: process.env.PUBLIC_URL + "/img/missionChallenge/7GlowUpTogether-BetterMiWithUniform.gif",
    timeslot: [
      {
        startingTime: "00:00",
        endTime: "00:06",
      },
    ],
    //Changed by Anderson 2023/11/12
    // timeslot: [{
    //   startingTime: '20:00',
    //   endTime: '20:06',
    // },
    // {
    //   startingTime: '21:00',
    //   endTime: '21:06',
    // }],
  },
  {
    title: "8. Love Bird",
    pageTitle: `Love Bird`,
    description: `Stretch both arms horizontally and make a minimum flap like a little bird`,
    duration: `3 mins`,
    bodyPart: `Arms`,
    sigdao: `+2.625`,
    nftLevel: `3`,
    missionImgPath: process.env.PUBLIC_URL + "/img/missionChallenge/8LoveBird-BetterMiWithUniform.gif",
    timeslot: [
      {
        startingTime: "00:00",
        endTime: "00:06",
      },
    ],
    //Changed by Anderson 2023/11/12
    // timeslot: [{
    //   startingTime: '20:00',
    //   endTime: '20:06',
    // },
    // {
    //   startingTime: '21:00',
    //   endTime: '21:06',
    // }],
  },
  {
    title: "9. Hold Onto You",
    pageTitle: `Hold Onto You`,
    description: `Hold your core and do a plank`,
    duration: `3 mins`,
    bodyPart: `Overall`,
    sigdao: `+2.625`,
    nftLevel: `3`,
    missionImgPath: process.env.PUBLIC_URL + "/img/missionChallenge/9HoldOntoYou-BetterMiWithUniform.gif",
    timeslot: [
      {
        startingTime: "00:00",
        endTime: "00:06",
      },
    ],
    //Changed by Anderson 2023/11/12
    // timeslot: [{
    //   startingTime: '20:00',
    //   endTime: '20:06',
    // },
    // {
    //   startingTime: '21:00',
    //   endTime: '21:06',
    // }],
  },
];
