import * as React from "react";
import "./titleBar.css";
import { BackButton } from "./button";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";

import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import AlarmIcon from '@mui/icons-material/Alarm';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

//for dialog test
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import { blue } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
// radio button
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
// select
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
//Chip-select 
import { Theme, useTheme } from '@mui/material/styles';
// import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
//Login 
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import { useDispatch, useSelector } from "react-redux";
import { SendEmailLinkContent, useGetLoginLinkMutation, useAccessMutation, useLogoutMutation, useUserStatusMutation } from "../redux/couponUserAPI";
import { couponUserSlice, selectCouponUserEmail} from "../redux/couponUser";
import { useGetCouponDetailMutation,useGetUserMutation,useGetCouponsByUserMutation, useRefreshCouponCodeMutation } from "../redux/couponAPI";
import { useGetFilterOptionMutation } from "../redux/filterAPI";
import { FilterOption, filterSlice, selectCurrentFilterOption } from "../redux/filter";
import { useUser } from '../providers/userProvider';
//for alert message
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import Alert, { AlertColor } from '@mui/material/Alert';
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kell',
  'Kelly',
  'Kelly Sn',
  'Kelly Sny',
  'Kelly Snyd',
  'Kelly Snyde',
];

const merchants = [
  "Best Deals Inc.",
  "Super Savings Mart",
  "Discount Emporium",
];

const industries = [
  "Retail",
  "Education",
  "Food & Beverage",
];


function Copyright(props: any) {
  return (
    <Typography variant="body2" color="white" align="center" {...props}>
      {'By the subscription, you agree our terms, private policy and Cookie use.'}
      {/* <Link color="primary" to="https://mui.com/">
        terms
      </Link>{' '}
      <Link color="primary" to="/aiCoachSelect">
        private policy
      </Link>{' '}
      {`, and `}
      <Link color="white" to="/aiCoachSelect">
        Cookie use
      </Link>{' '}

      {new Date().getFullYear()} */}
     
    </Typography>
  );
}
const defaultTheme = createTheme();


function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const emails = ['username@gmail.com', 'user02@gmail.com'];

//radio button - 

export interface SimpleDialogProps {
  //chip-select
  


  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
}
const ResponsiveDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    margin: '0px',
    width: '95%',
    height: '95%',
    backgroundColor: 'black',
    color: "white",
    border: "#4136F1 solid",
    borderRadius: "15px",
    [theme.breakpoints.up('sm')]: {
      width: '390px',
      height: '90%',
      backgroundColor: 'black',
      color: "white",
      border: "#4136F1 solid",
      borderRadius: "15px",
    },
  },
}));
export interface LoginDialogProps {
  //chip-select
  


  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
}
const LoginDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    margin: '0px',
    width: '95%',
    height: '95%',
    backgroundColor: 'black',
    color: "white",
    border: "#4136F1 solid",
    borderRadius: "15px",
    [theme.breakpoints.up('sm')]: {
      width: '390px',
      height: '90%',
      backgroundColor: 'black',
      color: "white",
      border: "#4136F1 solid",
      borderRadius: "15px",
    },
  },
}));


function SimpleDialog(props: SimpleDialogProps) {
  //chip-select
  const dispatch = useDispatch();
  const theme = useTheme();
  const [merchantList , setMerchantList] = React.useState<object[]>([]);
  const [industryList , setIndustryList] = React.useState<object[]>([]);
  const [filteredMerchant , setFilteredMerchant] = React.useState<string[]>([]);
  const [filteredIndustry , setFilteredIndustry] = React.useState<string[]>([]);
  const [personName, setPersonName] = React.useState<string[]>([]);
  const filterOption: FilterOption = useSelector(selectCurrentFilterOption);
  const [getFilterOption, { isSuccess: isGetFilterOptionSuccess, error: getFilterOptionError }] = useGetFilterOptionMutation();
  // useContext userProvider
  const { isLoggedIn, email, token,  logoutCouponUser, loginCouponUser } = useUser();
  const filterIndustry = (event: SelectChangeEvent<typeof filteredIndustry>) => {
    const {
      target: { value },
    } = event;
    setFilteredIndustry(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };
  const filterMerchant = (event: SelectChangeEvent<typeof filteredMerchant>) => {
    const {
      target: { value},
    } = event;
    setFilteredMerchant(
      typeof value === 'string' ? value.split(',') : value,
    )
  }
  const getFilter = async () => {
    getFilterOption().then((res) => {
      console.log(res);
      if ("data" in res) {
        dispatch(filterSlice.actions.setFilterOption(res.data));
      } else {
        console.error("Failed to fetch filter options:", res.error);
      }
    });
  };
  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value: string) => {
    onClose(value);
  };

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOrder((event.target as HTMLInputElement).value);
    console.log("change order")
  };
  const navigate = useNavigate();
  const [order, setOrder] = React.useState("newFirst");
  const [merchant, setMerchant] = React.useState<string[]>([]);
  const [merchantType, setMerchantType] = React.useState<string[]>([]);
  // useEffect(() => {
  //   console.log("loading the filter option")
  //   getFilterOption().then((res) => {
  //     console.log(res);
  //     if ("data" in res) {

  //       dispatch(filterSlice.actions.setFilterOption(res.data));
  //       setMerchantList(res.data.merchant)
  //       setIndustryList(res.data.industry)
  //     } else {
  //       console.error("Failed to fetch filter options:", res.error);
  //     }
  //   });
  // }, []);
  return (
    <ResponsiveDialog open={open} onClose={onClose}  >
    <DialogTitle><div className="title-bar-title inter-semi-bold-white-18px">篩選及排序</div></DialogTitle>
    <DialogContent   sx={{color: "white"}}>
    
      {/* radio button */}
    
      <FormControl sx={{color: "white"}}>
      <FormLabel id="demo-row-radio-buttons-group-label"  ><div className="title-bar-title inter-semi-bold-white-18px ">排序</div>
      </FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        sx={{
          '&, &.Mui-checked': {
            color: 'white',
          },
        }}
        value={order} 
        onChange={handleRadioChange}
      >

        <FormControlLabel value="newFirst" control={<Radio  sx={{
          '&, &.Mui-checked': {
            color: '#4136F1',
          },
        }}/>} label="近期最新" />
        <FormControlLabel value="expiredFirst" control={<Radio sx={{
          '&, &.Mui-checked': {
            color: '#4136F1',
          },
        }}/>} label="接近過期" />
        {/* <FormControlLabel value="other" control={<Radio sx={{
          '&, &.Mui-checked': {
            color: '#4136F1',
          },
        }}/>} label="最符合結果" />
        <FormControlLabel value="aaa" control={<Radio sx={{
          '&, &.Mui-checked': {
            color: '#4136F1',
          },
        }}/>} label="接近過期" /> */}

 </RadioGroup>
 </FormControl>
 <FormLabel id="demo-multiple-chip-label"><div className="title-bar-title inter-semi-bold-white-18px">公司
 </div></FormLabel>
 {/* <InputLabel id="demo-multiple-chip-label">Chip</InputLabel> */}
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={filteredMerchant}
          onChange={filterMerchant}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value}  color="primary" sx={{
            "&":{
              background: "4136F1",
              color: "white",
            },
          }}/>
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
          fullWidth={true}
          sx={{
            "&, & [aria-expanded=true]":{
              border: "2px solid #4136F1",
            },
          }}
        >
          {/* //if fetch options */}
          {/* {merchantList.map((merchant) => (
            <MenuItem
              key={merchant["merchant_name"]}
              value={merchant["merchant_name"]}
              style={getStyles(merchant["merchant_name"], personName, theme)}
            >
              {merchant["merchant_name"]}
            </MenuItem>
          ))} */}
          {merchants.map((merchant) => (
            <MenuItem
              key={merchant}
              value={merchant}
              style={getStyles(merchant, personName, theme)}
            >
              {merchant}
            </MenuItem>
          ))}
        </Select>
       
  {/* <InputLabel id="demo-simple-select-label">公司類型</InputLabel>
  <Select
    labelId="demo-simple-select-label"
    id="demo-simple-select"
    value={age}
    label="Age"
    onChange={handleChange}
  >
    <MenuItem value={10}>Ten</MenuItem>
    <MenuItem value={20}>Twenty</MenuItem>
    <MenuItem value={30}>Thirty</MenuItem>
  </Select> */}
 <FormLabel id="demo-multiple-chip-label"><div className="title-bar-title inter-semi-bold-white-18px">公司業務
  </div></FormLabel>
  {/* <InputLabel id="demo-multiple-chip-label">Chip</InputLabel> */}
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={filteredIndustry}
          onChange={filterIndustry}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} color="primary" />
              ))}
            </Box>
          )}
          sx={{
            "&, & [aria-expanded=true]":{
              border: "2px solid #4136F1",
            },
          }}
          MenuProps={MenuProps}
          fullWidth={true}
        >
          {industries.map((industry) => (
            <MenuItem
              key={industry}
              value={industry}
              style={getStyles(industry, personName, theme)}
            >
              {industry}
            </MenuItem>
          ))}
        </Select>
  
     
   
   
    </DialogContent>
    <Button variant="outlined" fullWidth={true} onClick={
    () => {
      setOrder("newFirst");
      setFilteredIndustry([]);
      setFilteredMerchant([]);
      console.log("order:",order)
      console.log("merchant:",filteredMerchant.join("^^^"))
      console.log("merchant Type:" ,filteredIndustry.join("^^^"))
    }
  }>Reset</Button>
    <Button variant="contained" fullWidth={true} onClick={
    () => {
      let urlParams = `?order=${order}`;
      console.log("order:",order)
      console.log("merchant:",filteredMerchant.join("^^^"))
      console.log("merchant Type:" ,filteredIndustry.join("^^^"))
      if (filteredIndustry.join("^^^") === ""){
        console.log("null industry");
      }else{
        urlParams = urlParams +"&industry="+ filteredIndustry.join("^^^")
      }
      if (filteredMerchant.join("^^^") === ""){
        console.log("null merchant");
      }else{
        urlParams = urlParams +"&merchant="+ filteredMerchant.join("^^^")
      }
      console.log("/coupons" + urlParams);
      navigate(`/coupons${urlParams}`)
    }
    }>套用</Button>
  </ResponsiveDialog>
  );

  
}

//login-dialog 
function LogDialog(props: LoginDialogProps) {
  //chip-select
  const dispatch = useDispatch();
  const [getLoginLink, { isSuccess: isSendLoginLinkSuccess, data, error }] = useGetLoginLinkMutation();
  const [email, setEmail] = React.useState<string>("");
  //for message-box
  const [openSuccessMessage, setOpenSuccessMessage] = React.useState(false);
  const [message, setMessage] = React.useState("error");
  const [messageSeverity, setMessageSeverity] = React.useState<AlertColor>("error")

  //useContext userProvider
  // const { isLoggedIn, email, token,  logoutCouponUser, loginCouponUser } = useUser();
  const handleCloseSuccessMessage = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSuccessMessage(false);
  };
  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
    });

    const email = data.get('email')?.toString();
    if (email && !validateEmail(email)) {
      setMessage("Invalid Email");
      setMessageSeverity("error");
      setOpenSuccessMessage(true);
      return;
    }
    if (email !== null && email !== undefined){
    const sendEmail: SendEmailLinkContent = {
      email: email,
      href: window.location.href,
    };
    const res = await getLoginLink(sendEmail);
    if (res){
      const result = res;
      console.log(result);
      localStorage.setItem("email", email);
      setMessage("Sent the email link");
      setMessageSeverity("success");
      setOpenSuccessMessage(true);
    }
    
  
    console.log(data);
  }
  };
  const emailLogin = async () => {
    const sendEmail: SendEmailLinkContent = {
      email,
      href: window.location.href,
    };

    await getLoginLink(sendEmail);
    localStorage.setItem("email", email);
    console.log(data);
  };
  const theme = useTheme();
  const [personName, setPersonName] = React.useState<string[]>([]);

  const handleChange02 = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value: string) => {
    onClose(value);
  };
  const [age, setAge] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  return (
    <LoginDialog open={open} onClose={onClose}  >
    <DialogTitle><div className="title-bar-title inter-semi-bold-white-18px">Email Suscription </div></DialogTitle>
    <DialogContent>
    <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Welcome to Coupons system
          </Typography>
          <Box sx={{ mt: 1 ,marginTop: 25}}></Box>
          
          <Typography component="p" >
          Please provide the email to enter the system
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              variant="filled" 
              color="secondary"
              sx={{
                "&, & [aria-expanded=true]":{
                  border: "3px solid #4136F1",
                },
                input: { color: '#fafafa',  opacity: 1}, 
                "label": {color: '#fafafa', opacity: 1,} 
              }}
            />
            {/* <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              variant="filled" 
              color="white"
              sx={{
                "&, & [aria-expanded=true]":{
                  border: "3px solid #4136F1",
                  
                },
                 input: { color: '#fafafa',  opacity: 1}, 
                 "label": {color: '#fafafa', opacity: 1,} // if you also want to change the color of the input, this is the prop you'd use
    
              }}
            /> */}
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}

            >
              create the email link
            </Button>
            {/* for success message
            {isSendLoginLinkSuccess && <p style={{ color: "white" }}>sent the email link</p>} */}
              <Snackbar open={openSuccessMessage} autoHideDuration={1000} onClose={handleCloseSuccessMessage}  anchorOrigin={{ horizontal: "center", vertical: "bottom" }}>
        <Alert
          onClose={handleCloseSuccessMessage}
          severity={messageSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
        {message}
        </Alert>
      </Snackbar>
          </Box>
        </Box>
        <Box ></Box>
        {/* <Copyright sx={{ mt: 8, mb: 4 }} /> */}
    </DialogContent>
    {/* <Button variant="outlined" fullWidth={true}>Reset</Button>
    <Button variant="contained" fullWidth={true}>套用</Button> */}
  </LoginDialog>
  );

  
}



interface IShortTitleBarProps {
  title: string | undefined;
  aiCoach?: boolean;
  help?: boolean;
  transparent?: boolean | undefined;
  filter?: boolean;
  addSign?: boolean;
  setting?: boolean;
  backButton?: boolean;
  importButton?: boolean;
  setIsOpenImport?: (isOpenImport: boolean) => void;
  isOpenImport?: boolean;
  customiseBackButton?: boolean;
  customiseBackButtonLink?: string;
  isCouponSystem?: boolean ;
  // isPositionNotFixed?: boolean;
  //for coupons system
  isFilteringButton? : boolean;
  isLoginButton? : boolean; 

}

export const ShortTitleBar: React.FunctionComponent<IShortTitleBarProps> = (props) => {
  // back button default to true
  
  const location = useLocation();
  const { isLoggedIn, email, token,  logoutCouponUser, loginCouponUser } = useUser();
  const { title, aiCoach, help, transparent, filter, addSign, setting, backButton = true, importButton, setIsOpenImport, isOpenImport, customiseBackButton, customiseBackButtonLink, isCouponSystem, isFilteringButton = false , isLoginButton = false} = props;
  //for filtering and login popup
  const [open, setOpen] = React.useState(false);
  const [open02, setOpen02] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(emails[1]);
  const [selectedValue02, setSelectedValue02] = React.useState(emails[1]);
  // const couponUser = useSelector(selectCouponUser);
 
  const [getUser, { isSuccess: isGetUser, error: getError }] = useGetUserMutation();
  //checking user
  const dispatch = useDispatch();
  const [login, { isSuccess: isLoginSuccess, isLoading: isLoginLoading, data: loginData, error: loginError }] = useAccessMutation();
  const [userStatus, { isSuccess: isGetUserStauts, error: getUserStatusError  }] = useUserStatusMutation();
  const [logout, { isSuccess: isLogoutSuccess, error: logoutError }] = useLogoutMutation();
  const [couponUser, setCouponUser] = React.useState(useSelector(selectCouponUserEmail));
  const hasLogged = React.useRef(false);
  //alert message
  const handleClickOpen = () => {
    setOpen(true);
  };
  const userLogout = async () => {
    logout("testing")
      .then((res) => {
        console.log(res);
        dispatch(couponUserSlice.actions.logout());
        logoutCouponUser();
        setCouponUser(null);
        hasLogged.current = false;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleClose = (value: string) => {
    setOpen(false);
    setSelectedValue(value);
  };
  // right first button:
  // ai coach
  // import (not implemented)
  const handleClickOpen02 = () => {
    setOpen02(true);
  };

  const handleClose02 = (value: string) => {
    setOpen02(false);
  };


  const rightFirstButton: JSX.Element = (
    <>
      <Link to="/aiCoachSelect">
        {aiCoach && (
          <div className="title-bar-ai-coach-icon-container">
            <img src={process.env.PUBLIC_URL + "/img/ai_coach.svg"} alt="" className="title-bar-ai-coach-icon" />
          </div>
        )}
      </Link>
      {/* {importButton && <img src="" alt="" className="title-bar-right-first-button-image" />} */}
    </>
  );
  // right second button:
  // setting
  // store (not implemented)
  const rightSecondButton: JSX.Element = (
    <>
      <Link to="/setting">{setting && <img src={process.env.PUBLIC_URL + "/img/ic-settings-24px-1@1x.png"} alt="" className="title-bar-setting-button-image" />}</Link>
      {/* {store && <img src="" alt="" className="title-bar-right-second-button-image" />} */}
    </>
  );
  const rightFilterButton: JSX.Element = (
    <>
      {/* <Link to="/setting">{setting && <img src={process.env.PUBLIC_URL + "/img/ic_filter.png"} alt="" className="title-bar-setting-button-image" />}</Link> */}
      <IconButton color="secondary" aria-label="add to shopping cart" onClick={handleClickOpen} sx={{padding: "0"}}>
        <FilterAltIcon />
      </IconButton>
      {/* {store && <img src="" alt="" className="title-bar-right-second-button-image" />} */}
    </>
  );

  const rightLoginButton: JSX.Element = (
    <>
      {/* <Link to="/setting">{setting && <img src={process.env.PUBLIC_URL + "/img/ic_filter.png"} alt="" className="title-bar-setting-button-image" />}</Link> */}
      <IconButton color="secondary" aria-label="add to shopping cart" onClick={handleClickOpen02} sx={{padding: "0"}}>
        <LoginIcon />
      </IconButton>
      {/* {store && <img src="" alt="" className="title-bar-right-second-button-image" />} */}
    </>
  );
  const rightLogoutButton: JSX.Element = (
    <>
      {/* <Link to="/setting">{setting && <img src={process.env.PUBLIC_URL + "/img/ic_filter.png"} alt="" className="title-bar-setting-button-image" />}</Link> */}
      <IconButton color="secondary" aria-label="add to shopping cart" onClick={userLogout} sx={{padding: "0"}}>
        <LogoutIcon />
      </IconButton>
      {/* {store && <img src="" alt="" className="title-bar-right-second-button-image" />} */}
    </>
  );


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await userStatus("")
        if ("data" in response){
          const userEmail = response.data.user.email;
          const userToken = response.data.token;
          loginCouponUser(userEmail,userToken);
        }
        
        console.log(response);
        console.log("email:", email, " token:", token)
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
 
    // console.log("Redux login:", login)
    // console.log("Redux login success:", isLoginSuccess)
    // console.log("Redux data:", loginData)
    // console.log("logined email", loginedEmail)
    // old and useless method for login
    // getUser(loginedEmail)
    //   .then((res) => {
    //     console.log(res);
    //     if ("data" in res) {
    //       // const couponList = res.data;
    //       dispatch(couponUserSlice.actions.setCredentials({ email: res.data.email || "", token: res.data.accessToken || "" }));
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    // console.log("couponUser: ", couponUser);
    console.log("UseContext-user data in TitleBAr:", email, token)
    // if (!couponUser ||!isLoggedIn){
    //     userStatus("")
    //        .then((res) => {
    //     console.log(res);
    //     if ("data" in res) {
    //       // const couponList = res.data;
    //       dispatch(couponUserSlice.actions.setCredentials({ email: res.data.user.email || "", token: res.data.token || "" }));
    //       const email = res.data.user.email;
    //       const token = res.data.token;
    //       console.log("email", email , " token: ", token);
    //       loginCouponUser(res.data.email,res.data.accessToken);
    //       setCouponUser(res.data.user.email );
    //       console.log("UseContext-user data in TitleBAr:", email, token)
    //     }
    //   })
    //   .catch((err) => {
    //      console.log("Auto login failed")
    //     console.log(err);
    //   });
    // }
  }, []);


  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const paramValue = searchParams.get("apiKey");
    console.log(paramValue);
    const fetchUserData = async () => {
      try {
        hasLogged.current = true;
        const response = await login({ email: localStorage.getItem("email") || "", href: window.location.href })
        console.log(response)
        if ("data" in response){
          const userEmail = response.data.email;
          const userToken = response.data.accessToken;
          console.log("userEmail", userEmail , "userToken", userToken)
          dispatch(couponUserSlice.actions.setCredentials({email: userEmail || "", token: userToken || "" }));
          loginCouponUser(userEmail,userToken);
          const newUrl = `${location.pathname}`;
          window.history.replaceState({}, "", newUrl);
          setCouponUser(localStorage.getItem("email"))
        }
        console.log(response);
        console.log("email:", email, " token:", token)
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    if (searchParams.size > 0 && !isLoginLoading && paramValue !==null && (hasLogged.current === false)) {
    fetchUserData();
    }
    // if (searchParams.size > 0 && !isLoginLoading && paramValue !==null) {
    //   login({ email: localStorage.getItem("email") || "", href: window.location.href })
    //     .then((res) => {
    //       if ("data" in res) {
    //         dispatch(couponUserSlice.actions.setCredentials({ email: res.data.user.email || "", token: res.data.token || "" }));
    //         loginCouponUser(res.data.email,res.data.accessToken);
    //       }
    //       const newUrl = `${location.pathname}`;
    //       window.history.replaceState({}, "", newUrl);
         
    //     })
    //     .catch((err) => {
         
    //       console.log(err);
    //     });
    //  }
    // getUser(loginedEmail)
    // .then((res) => {
    //   console.log(res);
    //   if ("data" in res) {
    //     // const couponList = res.data;
    //     dispatch(couponUserSlice.actions.setCredentials({ email: res.data.email || "", token: res.data.accessToken || "" }));
    //   }
    // })
    // .catch((err) => {
    //   console.log(err);
    // });
  }, [location.search]);
  

  return (
    // <div className="title-bar-layout">
      <div
        className={transparent ? "transparent-title-bar-container" : "title-bar-container"}
        // style={isPositionNotFixed ? {position: "relative"} : {}}
        // style={
        //   {
        //     // background: `url($q{process.env.PUBLIC_URL}/img/bg-11@1x.png)`,
        //     // backgroundPosition: 'center',
        //     // backgroundSize: 'cover',
        //   }
        // }
      >
        <div className="title-bar-content">
          <div className="title-bar-left-container">
            {backButton && <BackButton customiseBackButtonLink={customiseBackButtonLink} className={"title-bar-back-button-container"} />}
            <div className="title-bar-title inter-semi-bold-white-18px">{title}</div>
          </div>
          <div className="title-bar-right-container">
            {rightFirstButton}
            {rightSecondButton}
            {isFilteringButton && rightFilterButton}
            {isLoginButton && (isLoggedIn ? rightLogoutButton : rightLoginButton)}
          </div>
        </div>
        {/* {keepAsReference &Dialog} */}
        <SimpleDialog
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
      />
        <LogDialog
        selectedValue={selectedValue02}
        open={open02}
        onClose={handleClose02}
      />


        

      </div>
    // </div>
  );
};


// const keepAsReference = (
//   <>
//     <div className="title-bar-title inter-semi-bold-white-18px">{title}</div>
//     {/* <img className="title-bar-seperat-line seperat-line" src={process.env.PUBLIC_URL + "/img/seperat-line-11@1x.png"} alt="Seperat line" /> */}
//     {/* first button */}
//     {addSign === true ? (
//       <Link to="/allNftList">
//         <div className="titleBarAddSign">
//           <img className="titleBarAddSignImg" src={process.env.PUBLIC_URL + "/img/NftList/ic-add@1x.png"} />
//         </div>
//       </Link>
//     ) : setting === false ? null : (
//       <Link to="/setting">
//         <div className="title-bar-ic_help_24px ic_help_24px">
//           <img className="title-bar-ic_help_24px-img ic_help_24px" src={process.env.PUBLIC_URL + "/img/ic-settings-24px-1@1x.png"} alt="ic_help_24px" />
//         </div>
//       </Link>
//     )}
//     {/*the filter and the plus sign change this div*/}
//     {backButton === false ? null : (
//       <div
//         onClick={() => {
//           if (customiseBackButtonLink) {
//             navigate(customiseBackButtonLink);
//             return;
//           }
//           navigate(-1);
//         }}
//       >
//         <div className="icon-arrow-left-container icon-arrow-left">
//           <img className="icon-arrow-left-img icon-arrow-left" src={process.env.PUBLIC_URL + "/img/icon-arrow-left-12@1x.png"} alt="icon-arrow-left" />
//         </div>
//       </div>
//     )}
//     {/* {customiseBackButton === false && customiseBackButtonLink == null ? null :
//     <Link to={customiseBackButtonLink!}>
//           <div className="icon-arrow-left-container icon-arrow-left">
//               <img
//                 className="icon-arrow-left-img icon-arrow-left"
//                 src={process.env.PUBLIC_URL + "/img/icon-arrow-left-12@1x.png"}
//                 alt="icon-arrow-left"
//                 />
//           </div>
//         </Link>
//         } */}

//     {
//       aiCoach === false ? null : (
//         <Link to="/aiCoachSelect">
//           <div className="ic_settings_24px-container ic_settings_24px">
//             <img className="ic_settings_24px-img ic_settings_24px" src={process.env.PUBLIC_URL + "/img/ai_coach.svg"} alt="ic_settings_24px" />
//           </div>
//         </Link>
//       )
//       //   :
//       //   (
//       //   <div className="title-bar-ic_help_24px ic_help_24px">
//       //     <img className="title-bar-ic_help_24px-img ic_help_24px" src={process.env.PUBLIC_URL + "/img/ic-help-24px-1@1x.png"} alt="ic_help_24px" />
//       // </div>
//       //  )
//     }
//     {filter != true ? null : (
//       // <div className = "titleBarDropDown">
//       //   <button className = "titleBarFilter">
//       //     <div className = "titleBarFilterName">Free</div>
//       //     <img className = "titleBarFilterArrow" src = {process.env.PUBLIC_URL + "img/NftList/ic-arrow-drop-down@1x.png"}></img>
//       //     <div className="titleBarDropdown-content">
//       //       <a href="#">Link 1</a>
//       //       <a href="#">Link 2</a>
//       //       <a href="#">Link 3</a>
//       //     </div>
//       //   </button>
//       // </div>
//       <div className="dropdown">
//         <button className="dropbtn">
//           <div className="dropbtnDescription">Free</div>

//           <img className="dropbtnArrow" src={process.env.PUBLIC_URL + "img/NftList/ic-arrow-drop-down@1x.png"} />
//         </button>
//         <div className="dropdown-content">
//           <a href="#">Lowest Price</a>
//           <a href="#">Highest Price</a>
//           <a href="#">All</a>
//         </div>
//       </div>
//     )}
//     {importButton === false ? null : setIsOpenImport === undefined ? null : (
//       <Button className="importButton inter-semi-bold-white-15px" onClick={() => setIsOpenImport(!isOpenImport)}>
//         Import NFT
//       </Button>
//     )}

//     {/* <img className="bg-MY4xZJ" src={process.env.PUBLIC_URL + "/img/bg-11@1x.png"} alt="BG" /> */}
//   </>
// );
