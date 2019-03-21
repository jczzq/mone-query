var Mock = require("mockjs");
import ConfigResult from "@/Config.json";
import DataResult from "@/Data.json";
/**
 * mone-query配置
 */
Mock.mock(/api\/config/, ConfigResult);
/**
 * mone-query配置
 */
Mock.mock(/api\/data/, DataResult);
