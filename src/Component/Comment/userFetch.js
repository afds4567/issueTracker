
import axios from "axios";
async function getUserInfo() {
  const response = await axios.get(
    `https://6007-221-148-180-175.ngrok.io/user/`
  );
  var users = [];
  response.data.map(i => { i.display = "testdisplay";
          i.id=i.username;})
  users.push(response.data);
  
  console.log(users);
  return users;
}
export default getUserInfo;

export async function getResponsibility() {
  const response = await axios.get(
    `https://6007-221-148-180-175.ngrok.io/responsibility`
  );
  var CategoryData = [];
  var OwnerData = Object.create(null);
  await response.data.map(i => {
    console.log("repeat",i.responsibleIssue_name);
    if (!CategoryData.includes(i.responsibleIssue_name)) {
      console.log(typeof(i.responsibleIssue_name))
      CategoryData.push(i.responsibleIssue_name);
      const tmp =i.responsibleIssue_name;
      console.log(i.name);
      OwnerData[tmp] = [[i.name, i.user_id ]];
      console.log('2');
    }
    else
    {
      const tmp =i.responsibleIssue_name;
      OwnerData[tmp].push([i.name,i.user_id]);
      console.log('3');
    }
     console.log('4',OwnerData);
  })
  console.log('5');
  console.log(CategoryData,OwnerData);
 return [CategoryData,OwnerData];
}
