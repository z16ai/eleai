export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const key = url.pathname.slice(1); // Remove leading slash

    if (!key) {
      return new Response('Missing key', { status: 400 });
    }

    try {
      const object = await env.ELEAI.get(key);

      if (!object) {
        return new Response('Object not found', { status: 404 });
      }

      const headers = new Headers();
      headers.set('Content-Type', object.httpMetadata?.contentType || 'application/octet-stream');
      headers.set('Cache-Control', 'public, max-age=31536000');
      headers.set('ETag', object.etag);

      return new Response(object.body, {
        headers,
      });
    } catch (err) {
      return new Response('Error fetching from R2', { status: 500 });
    }
  },
};
