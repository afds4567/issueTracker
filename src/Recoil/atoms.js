import { atom } from 'recoil';

export const isLoggedInRecoil = atom({
  key: "isLoggedIn",
  default: false,
})
export const aprojectid = atom({
  key: "aprojectid",
  default: 0,
})
export const _user = atom({
  key: '_user',
  default: {
    //ATDVEH42Hf
    user_id: '',
    email: '',
    //하지원
    name:'',
    dept_name: '',
    responsible_issue_name:'',
    firstName: 'JIWON',
    lastName: 'HA',
    age: 30
  }
});


