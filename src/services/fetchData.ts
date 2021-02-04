export async function fetchData(endpoint: string, option?: RequestInit) {
  const defaultOption: RequestInit = {
    headers: {
      Authorization: "ApiKey Bbk6fUp5oE6oWT",
    },
    ...option,
  };
  const response = await fetch(
    "https://api.gridly.com/v1/views/medej8v1n0qyl8" + endpoint,
    defaultOption
  );
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
}
