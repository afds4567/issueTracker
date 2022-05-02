import { atom } from 'recoil';

export const isLoggedInRecoil = atom({
    key: "isLoggedIn",
    default: false,
})
export const _user = atom({
  key: '_user',
  default: {
    user_id: '',
    email: '',
    name:'',
    dept_name: '',
    responsible_issue_name:'',
    firstName: 'JIWON',
    lastName: 'HA',
    age: 30
  }
});


