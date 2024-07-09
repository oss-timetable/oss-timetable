export type FeedItem = {
  title: string;
  link: string;
  description: string;
  dateString: string;
  date: number; // timestamp
  source: string,
};

const reformatDate = (dateString: string) => {
  // from isoDate to "YYYY-MM-DD HH:MM":
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  // pad to 2:
  const pad = (num: number) => num.toString().padStart(2, "0");
  return `${year}-${pad(month)}-${pad(day)} ${pad(hours)}:${pad(minutes)}`;
};

export const fetchFeeds = async () => {
  const req = await fetch(
    "https://oss-timetable.github.io/ustc/data/feed_source.json"
  );
  const data = await req.json();
  const feeds: FeedItem[] = [];
  const jobs = data.sources.map(async (source: any) => {
    try {
      const req = await fetch(source.jsonURL);
      const feed = await req.json();
      feeds.push(
        ...feed.map((item: any) => ({
          title: item.title,
          link: item.link,
          description: item.description,
          dateString: item.dateString,
          date: item.date,
          source: source.locales.zh,
        }))
      );
    } catch (e) {
      console.error(`Failed to fetch ${source}: ${e}`);
    }
  });
  await Promise.all(jobs);
  feeds.sort((a, b) => b.date - a.date);
  return feeds;
};
