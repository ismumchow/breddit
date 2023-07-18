import axios from "axios";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const href = url.searchParams.get("url");

  if (!href) {
    return new Response("Invalid HREF", { status: 400 });
  }
  const res = await axios.get(href);

  const titleMatch = res.data.match(/<title>(.*?)<\/title>/);
  const title = titleMatch ? titleMatch[1] : "No title found";

  const descriptionMatch = res.data.match(
    /<meta name="description" content="(.*?)">/
  );
  const description = descriptionMatch
    ? descriptionMatch[1]
    : "No description found";

  const imageMatch = res.data.match(
    /<meta property="og:image" content="(.*?)">/
  );
  const image = imageMatch ? imageMatch[1] : "No image found";

  return new Response(
    JSON.stringify({
      success: true,
      meta: {
        title,
        description,
        image: {
            url: image, 
        }
      },
    }),
    {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
    }
  );
}
