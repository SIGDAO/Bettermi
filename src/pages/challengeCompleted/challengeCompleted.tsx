import * as React from 'react';
import './challengeCompleted.css'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { CenterLayout } from '../../components/layout';
import { ShortTitleBar } from '../../components/titleBar';
import { missionList } from '../../data/featureMissionList';
import { TransferToken } from '../../components/transferToken';
import { useSelector } from 'react-redux';
import { selectWalletNodeHost } from '../../redux/useLedger';
import { accountId } from '../../redux/account';
import { TransferTokenWithMessage } from '../../NftSystem/TokenTransfers';
import { useRef,useEffect } from 'react';
import { CountChallenges } from '../../NftSystem/Token/countChallenges';
import { LedgerClientFactory } from '@signumjs/core';
import { GetRewardPercentage } from '../../NftSystem/Reward/getRewardPercentage';

interface IChallengeCompletedProps {
  NFT?: boolean;
}

const displayReawrd = ( pathname: string ): string | undefined => {
  if (pathname) {
    const pathList = pathname.split('/');
    console.log("pathList", pathList);
    const reward = pathList[pathList.length - 1];
    
    return missionList.find((mission, index) => index === parseInt(reward) - 1)?.sigdao || undefined
  }

  return ""
}


const ChallengeCompleted: React.FunctionComponent<IChallengeCompletedProps> = (props) => {
  const { NFT } = props;
  const location = useLocation();
  const navigate = useNavigate();
  const [pathname, setPathname] = React.useState<string>('');
  const [loading,setLoading] = React.useState<Boolean>(true);
  const [userReward,setReward] = React.useState<string>("");
  const nodeHost = useSelector(selectWalletNodeHost);
  const userAccountId = useSelector(accountId);
  const distributed = useRef(false);
  const ledger2 = LedgerClientFactory.createClient({ nodeHost });
  ///Anderson's code starts here

  useEffect(() => {
    const handleBeforeUnload = () => {
      distributed.current = false; // Reset the value before navigating away
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

//Anderson's code ends here

//Anderson's code starts here

  const TransferTokenToUser = async (nodeHost: string, userAccountId: string, reward: string,ledger2:any) => {
    var rewardString:string|undefined = displayReawrd(location.state?.reward);
    const challengeNumber:string[]|null = location.state?.reward.split('/');
    console.log(challengeNumber);
    console.log();
    if(rewardString == undefined || !challengeNumber) { return; }
    else{
      const index:number = Number(challengeNumber[2]);
      const numChallengesPlayed = await CountChallenges(userAccountId, ledger2);
      console.log("number of challenges played", numChallengesPlayed);
      console.log("reward string is",rewardString)
      console.log("index is ", index);
      //await TransferToken(nodeHost, userAccountId, rewardString);
      const rewardPercentage = await GetRewardPercentage(ledger2,userAccountId);
      console.log("rewardPercentage is",rewardPercentage);
      var reward:string;
      if(rewardPercentage!=null){
       reward = String(parseFloat(rewardString!)*(100+parseInt(rewardPercentage))/100);
      }
      else{
        reward = String(parseFloat(rewardString!))
      }
      console.log(reward);      
      setReward(reward);
      if(numChallengesPlayed[index-1] < 3 && rewardPercentage!= null){
        console.log("called this argument")
        console.log(numChallengesPlayed[index])

      await TransferTokenWithMessage(nodeHost, userAccountId, reward, parseInt(challengeNumber![challengeNumber!.length-1]));
      }
      else{
        alert("you have already played three times")
        navigate("/missionChallenge");
      }
      setLoading(false);
      return;
    }
  };

//Anderson's code ends here

  React.useEffect(() => {


    if (!NFT && distributed.current === false) {
      TransferTokenToUser(nodeHost, userAccountId, location.state?.reward,ledger2); //Anderson's code
      distributed.current = true;//Anderson's code
    }
  });
  React.useEffect(() => {
    setPathname(() => {
      if (location.pathname === '/NFTTransferCompleted') {
        // return '/NftList';
        return '/missionChallenge';
      } else {
        return '/missionChallenge';
      }
    });
  }, [location]);

  const SmallTitle = NFT ? 'Your NFT has been transferred.' : 'You have earned:';


  const content: JSX.Element = (
    <div className="screen">
      <div className="bettermidapp-challenge-finished-1">
        {/* <ShortTitleBar title='' setting={false} aiCoach={false} transparent={true} /> */}
        <div className="x16219-iwUDzs">
          <div className="you-have-earned-75VOY2">{SmallTitle}</div>
          <h1 className="title-75VOY2">Congratulations !</h1>
          <div className="finished-75VOY2">
            <img src="img/challengeCompleted/completed-mimi.png" alt="" className="mimi-heart-challenge-completed" />
            {/* <div className="button3-copy-3oZEl3">
              <div className="button1-vX3ONf button1"></div>
            </div>
            <img className="icon-awesome-check-3oZEl3" src={`${process.env.PUBLIC_URL}/img/challengeSuccess/icon-awesome-check@1x.png`} alt="Icon awesome-check" /> */}
          </div>
          {NFT ? null :
          loading?
          <div className="sigdao-score-75VOY2">
          <div className="x10-VOfFBB inter-semi-bold-keppel-14px">+ loading...</div>
          <div className="signdao_tokengradient-VOfFBB">
            <div className="x441-gxWo6F"></div>
            <div className="x442-gxWo6F"></div>
            <img className="x880-gxWo6F" src={`${process.env.PUBLIC_URL}/img/challengeSuccess/file---880-1x-png-10@1x.png`} alt="880" />
          </div>
        </div>
          :
          (
            <div className="sigdao-score-75VOY2">
              <div className="x10-VOfFBB inter-semi-bold-keppel-14px">+ { userReward}</div>
              <div className="signdao_tokengradient-VOfFBB">
                <div className="x441-gxWo6F"></div>
                <div className="x442-gxWo6F"></div>
                <img className="x880-gxWo6F" src={`${process.env.PUBLIC_URL}/img/challengeSuccess/file---880-1x-png-10@1x.png`} alt="880" />
              </div>
            </div>
          )
          }
        </div>
        <Link to={pathname} >
          <div className="button_-done-iwUDzs">
            <div className="button1-UidXYK button1"></div>
            <div className="continue-UidXYK inter-semi-bold-white-15px">Done</div>
          </div>
        </Link>
      </div>
    </div>
  )

  return (
    <CenterLayout content={content} bgImg={false} />
  );
}

export default ChallengeCompleted;
