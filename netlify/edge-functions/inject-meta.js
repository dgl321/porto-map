export default async (request, context) => {
  // Get the response
  const response = await context.next();
  
  // Get the user agent
  const userAgent = request.headers.get('user-agent') || '';
  
  // Check if it's a social media crawler
  const isSocialCrawler = /facebookexternalhit|twitterbot|linkedinbot/i.test(userAgent);
  
  if (isSocialCrawler) {
    // Get the HTML content
    let html = await response.text();
    
    // Insert meta tags right after <head>
    const metaTags = `
      <meta property="og:type" content="website">
      <meta property="og:url" content="https://porto-map.netlify.app/">
      <meta property="og:title" content="Porto Map">
      <meta property="og:description" content="Interactive map of Porto">
      <meta property="og:image" content="https://porto-map.netlify.app/porto.webp">
      <meta property="og:image:type" content="image/webp">
      <meta property="og:image:width" content="1200">
      <meta property="og:image:height" content="630">
      <meta property="og:image:alt" content="Porto Map">
      <meta property="og:site_name" content="Porto Map">
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:url" content="https://porto-map.netlify.app/">
      <meta name="twitter:title" content="Porto Map">
      <meta name="twitter:description" content="Interactive map of Porto">
      <meta name="twitter:image" content="https://porto-map.netlify.app/porto.webp">
    `;
    
    html = html.replace('</head>', `${metaTags}</head>`);
    
    // Return modified response
    return new Response(html, {
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'no-cache'
      }
    });
  }
  
  return response;
}; 