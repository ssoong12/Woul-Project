import axios from "axios";
import djangoPath from "./path.js";

/**
 * 
 * @param {string} method ajax 사용 메소드 
 * @param {string} subPath 서버 하위 path (api path)
 * @param {File} selectedfile 전송할 file
 * @param {JSON} paramList 전송할 파라미터 리스트
 * @returns formdata 구조화 및 파일 업로드
 */
const registFile = async (method, subPath, selectedfile, paramList) => {
  const formData = new FormData();
  formData.append("file", selectedfile);

  paramList = Object.entries(paramList);

  for (let i = 0; i < paramList.length; i++) {
    formData.append(paramList[i][0], paramList[i][1]);
  }

  //   /* key 확인하기 */
  //   for (let key of formData.keys()) {
  //     console.log(key);
  //   }

  // /* value 확인하기 */
  // for (let value of formData.values()) {
  //     console.log(value);
  // }

  let result = null;

  await axios({
    method: method,
    url: djangoPath + subPath,
    headers: {
      Authorization: "jwt",
      "Content-Type": "multipart/form-data",
    },
    data: formData,
  }).then((res) => {
    result = res.data;
  });

  return result;
};

export default registFile;
