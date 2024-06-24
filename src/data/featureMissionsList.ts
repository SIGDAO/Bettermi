export interface missionList {
  title: string;
  isActive: boolean;
  duration: string;
  sigdao: string;
  missionImgPath: string;
  missionNavPath: string;
}

export const missionList: missionList[] = [
  {
    title: `Challenges\nx 9 hacks`,
    isActive: true,
    duration: `1-3mins/ each`,
    sigdao: `+5.25 ~ 15.75`,
    missionImgPath: process.env.PUBLIC_URL + "/img/home/challengex9-banner@1x.png",
    missionNavPath: `/missionChallenge`,
  },
  {
    title: `Weekly Meditation`,
    isActive: false,
    duration: `Saturday Only`,
    sigdao: `+5.25 ~ 5.00`,
    missionImgPath: process.env.PUBLIC_URL + "/img/home/meditation-banner@1x.png",
    missionNavPath: ``,
  },
  {
    title: `Secret Coach - Talk To mi`,
    isActive: false,
    duration: `Step Count`,
    sigdao: `+5.25 ~ 15.75`,
    missionImgPath: process.env.PUBLIC_URL + "/img/allMission/Talk-to-mi-Square-Cover.png",
    missionNavPath: ``,
  },
]
