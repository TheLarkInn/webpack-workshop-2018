import logger from "./logger";
import { reverseString } from "./reverse";
import upcase from "./upcase";

const name = "Sean";

logger(reverseString(upcase(name)));
