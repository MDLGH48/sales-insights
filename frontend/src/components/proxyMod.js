import axios from "axios";

const axRequest = async (url, payload, method) => {
  try {
    const response = await axios({
      method: method,
      url: `http://dtapi.francecentral.azurecontainer.io/api/${url}`,
      data: payload,
    });

    const responseData = response.data;

    return responseData;
  } catch (e) {
    console.error(e);
  }
};

export default axRequest;
