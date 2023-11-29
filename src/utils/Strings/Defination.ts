import { DataPlaceDetailResultCurrentOpeningHoursPeriods } from "../../screens/types/place/details";

export const CurrentOpeningHours = (openNow: boolean | undefined) => {
  let result = "";
  if (openNow) {
    result = "เปิดอยู่";
  } else {
    result = "ปิดแล้ว";
  }

  return result;
};
