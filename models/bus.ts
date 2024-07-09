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

export const nextSchedule = (routeSchedule: RouteSchedule) => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const curTime = hours * 60 + minutes;
  const times = routeSchedule.time.map((time) => {
    const [hour, minute] = time[0]!.split(":").map((n) => parseInt(n));
    return { time: hour * 60 + minute, schedule: time };
  }).filter((time) => time.time > curTime).sort((a, b) => a.time - b.time);
  if (times.length === 0) {
    return null;
  }
  return times[0].schedule;
};

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