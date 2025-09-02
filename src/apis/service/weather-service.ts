import { apiList } from "../api-list";
import { requestClient } from "@/utils";

// Open-Meteo 逐小时天气接口的完整响应
export interface HourlyWeatherResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  hourly_units: {
    time: string;          // 固定值 "iso8601"
    temperature_2m: string; // 固定值 "°C"
    relativehumidity_2m: string; // 固定值 "%"
    windspeed_10m: string;      // 固定值 "km/h"
  };
  hourly: {
    time: string[];                 // 24/48/72... 个 ISO8601 字符串
    temperature_2m: number[];       // 与 time 一一对应的温度值（°C）
    relativehumidity_2m: number[];  // 相对湿度（%）
    windspeed_10m: number[];        // 10 m 高度风速（km/h）
  };
}
export type Today24hWeather = Pick<HourlyWeatherResponse, 'hourly'>;


const getTodayWeather = async () => {
  try {
    const response = await requestClient.get<HourlyWeatherResponse>({
      url: `${apiList.weather.getTodayWeather}`,
    });
    return response;
  } catch (error) {
    console.error("Product API error:", error);
    throw error;
  }
};

export {
  getTodayWeather
}