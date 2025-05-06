import type { VercelRequest, VercelResponse } from "@vercel/node";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

// CORS middleware function
const allowCors =
  (fn: any) => async (req: VercelRequest, res: VercelResponse) => {
    // Set CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS",
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With",
    );

    // Handle preflight requests
    if (req.method === "OPTIONS") {
      res.status(200).end();
      return;
    }

    // Call the actual handler function
    return await fn(req, res);
  };

// Main handler function
async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== "PUT") {
      return res.status(405).json({ message: "Method Not Allowed" });
    }

    const { playlistId, base64Image, accessToken } = req.body;

    if (!playlistId || !base64Image || !accessToken) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/images`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "image/jpeg",
        },
        body: Buffer.from(base64Image.split(",")[1] || base64Image, "base64"),
      },
    );

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: text });
    }

    return res.status(200).json({ message: "Image uploaded successfully" });
  } catch (err: any) {
    console.error("API handler error:", err);
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message || "Unknown error",
    });
  }
}

// Export the wrapped handler
export default allowCors(handler);
