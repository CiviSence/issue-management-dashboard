import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Reusable SEO component for dynamic route metadata, Open Graph tags, canonical links, and JSON-LD schema.
 * @param {Object} props
 * @param {string} props.title - Page title (will be appended with " | CiviSence" if not already included)
 * @param {string} props.description - Compelling meta description summarizing page content
 * @param {string} [props.keywords] - Comma-separated SEO keywords
 * @param {string} [props.ogType] - Open Graph type (default: "website")
 * @param {string} [props.ogImage] - Preview image URL
 * @param {Object|Array} [props.schema] - Optional JSON-LD structured data object or array for rich snippets
 */
const SEO = ({
  title,
  description,
  keywords = "campus issue management, civic tech, facility reporting, university maintenance tracker, CiviSence",
  ogType = "website",
  ogImage = "https://civisence.app/pwa-512x512.png",
  schema = null,
}) => {
  const location = useLocation();

  useEffect(() => {
    // Format full title
    const fullTitle = title.includes("CiviSence")
      ? title
      : `${title} | CiviSence`;
    const canonicalUrl = `https://civisence.app${location.pathname}`;

    // 1. Update Document Title
    document.title = fullTitle;

    // 2. Helper function to update or create meta tags
    const setMetaTag = (selector, attribute, value) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement("meta");
        const [attrName, attrVal] = selector
          .replace("meta[", "")
          .replace("]", "")
          .split("=");
        element.setAttribute(attrName, attrVal.replace(/['"]/g, ""));
        document.head.appendChild(element);
      }
      element.setAttribute(attribute, value);
    };

    // 3. Update Standard Meta Tags
    setMetaTag('meta[name="title"]', "content", fullTitle);
    if (description) {
      setMetaTag('meta[name="description"]', "content", description);
      setMetaTag('meta[property="og:description"]', "content", description);
      setMetaTag('meta[property="twitter:description"]', "content", description);
    }
    if (keywords) {
      setMetaTag('meta[name="keywords"]', "content", keywords);
    }

    // 4. Update Open Graph & Twitter Card Tags
    setMetaTag('meta[property="og:title"]', "content", fullTitle);
    setMetaTag('meta[property="og:type"]', "content", ogType);
    setMetaTag('meta[property="og:url"]', "content", canonicalUrl);
    setMetaTag('meta[property="og:image"]', "content", ogImage);

    setMetaTag('meta[property="twitter:title"]', "content", fullTitle);
    setMetaTag('meta[property="twitter:url"]', "content", canonicalUrl);
    setMetaTag('meta[property="twitter:image"]', "content", ogImage);

    // 5. Update Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", canonicalUrl);

    // 6. Inject Page-Specific JSON-LD Structured Data Schema if provided
    let scriptEl = null;
    if (schema) {
      const scriptId = `seo-schema-${location.pathname.replace(/\//g, "-")}`;
      scriptEl = document.getElementById(scriptId);
      if (!scriptEl) {
        scriptEl = document.createElement("script");
        scriptEl.id = scriptId;
        scriptEl.type = "application/ld+json";
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify({
        "@context": "https://schema.org",
        ...(Array.isArray(schema) ? { "@graph": schema } : schema),
      });
    }

    return () => {
      // Cleanup page-specific schema script on unmount
      if (scriptEl && scriptEl.parentNode) {
        scriptEl.parentNode.removeChild(scriptEl);
      }
    };
  }, [title, description, keywords, ogType, ogImage, schema, location.pathname]);

  return null;
};

export default SEO;
