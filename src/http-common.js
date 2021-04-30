import axios from "axios";

export default axios.create({
  baseURL: "https://iotaut2020.blob.core.windows.net/referencedata/",
  headers: {
    "Content-type": "application/json"
  }
});