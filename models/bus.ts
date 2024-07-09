export type Campus = {
  id: number,
  name: string,
  latitude: number,
  longitude: number,
}

export type Route = {
  id: number,
  campuses: Campus[],
}

export type RouteSchedule = {
  id: number,
  route: Route,
  time: (string | undefined)[][]
}

export type Message = {
  message: string,
  url: string
}

export type BusData = {
  campuses: Campus[]
  routes: Route[]
  weekday_routes: RouteSchedule[],
  weekend_routes: RouteSchedule[],
  message: Message,
}

export const calcIsWeekday = () => {
  const date = new Date();
  const day = date.getDay();
  return day >= 1 && day <= 5;
};

export const fetchBusData = async () => {
  const req = await fetch(
    "https://oss-timetable.github.io/ustc/data/bus_data_v3.json"
  );
  return await req.json();
};