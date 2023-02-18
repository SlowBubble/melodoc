import { main } from "./main";
import { getUrlParamsMap } from "./url";

const urlParams = getUrlParamsMap();
const data = urlParams.has('data') ? urlParams.get('data') : '';
main(data);
