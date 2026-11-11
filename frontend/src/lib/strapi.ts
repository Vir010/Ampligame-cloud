const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://127.0.0.1:1337";

export async function fetchFromStrapi(endpoint: string) {
  const url = `${STRAPI_URL}/api/${endpoint}?populate=*`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Ошибка Strapi: ${res.status}`);
  const json = await res.json();
  return json.data;
}

export async function fetchGames() {
  const result = await fetchFromStrapi("games");
  return Array.isArray(result) ? result : [];
}

export async function fetchGameById(id: string) {
  return await fetchFromStrapi(`games/${id}`);
}

export async function fetchForumCategories() {
  const result = await fetchFromStrapi("forum-categories");
  return Array.isArray(result) ? result : [];
}

export async function fetchPopularTopics() {
  const result = await fetchFromStrapi("popular-topics");
  return Array.isArray(result) ? result : [];
}

export async function fetchEvents() {
  const result = await fetchFromStrapi("events");
  return Array.isArray(result) ? result : [];
}

export async function fetchFaqs() {
  const result = await fetchFromStrapi("faqs");
  return Array.isArray(result) ? result : [];
}

export async function fetchContacts() {
  const result = await fetchFromStrapi("contacts");
  return Array.isArray(result) ? result : [];
}

export async function fetchUsefulLinks() {
  const result = await fetchFromStrapi("useful-links");
  return Array.isArray(result) ? result : [];
}

export async function fetchTariffs() {
  const result = await fetchFromStrapi("tariffs");
  return Array.isArray(result) ? result : [];
}

export async function fetchStreams() {
  const result = await fetchFromStrapi("streams");
  return Array.isArray(result) ? result : [];
}

export async function fetchCybersportNews() {
  const result = await fetchFromStrapi("cybersport-news-items");
  return Array.isArray(result) ? result : [];
}

// Группы теперь берутся из отдельной коллекции groups
export async function fetchGroups() {
  const result = await fetchFromStrapi("groups");
  return Array.isArray(result) ? result : [];
}

// Системные требования для страницы поддержки
export async function fetchRequirements() {
  const result = await fetchFromStrapi("requirements");
  return Array.isArray(result) ? result : [];
}

// Баннеры для карусели на главной
export async function fetchBanners() {
  const result = await fetchFromStrapi("banners");
  return Array.isArray(result) ? result : [];
}
