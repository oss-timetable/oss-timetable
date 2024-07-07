export type FeedItem = {
  title: string;
  link: string;
  description: string;
  dateString: string;
  date: number; // timestamp
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
  console.log(data.sources.map((source: any) => source.jsonURL));
  const feedSources = data.sources.map((source: any) => source.jsonURL);
  const feeds: FeedItem[] = [];
  const jobs = feedSources.map(async (source: string) => {
    const req = await fetch(source);
    const feed = await req.json();
    feeds.push(
      ...feed.items.map((item: any) => ({
        title: item.title,
        link: item.link,
        description: item.description,
        dateString: item.pubDate,
        date: new Date(item.pubDate).getTime()
      }))
    );
  });
  await Promise.all(jobs);
  feeds.sort((a, b) => b.date - a.date);
  return feeds;
};
