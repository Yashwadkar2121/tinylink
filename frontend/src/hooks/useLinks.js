import { useState, useEffect } from "react";
import { linksAPI } from "../utils/api";

export const useLinks = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all links
  const fetchLinks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await linksAPI.getAllLinks();
      // Ensure data is always an array
      setLinks(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch links");
      setLinks([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Create a new link
  const createLink = async (linkData) => {
    setLoading(true);
    setError(null);
    try {
      const newLink = await linksAPI.createLink(linkData);
      // Safely update links state
      setLinks((prev) => {
        const previousLinks = Array.isArray(prev) ? prev : [];
        return [newLink, ...previousLinks];
      });
      return newLink;
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to create link";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Delete a link
  const deleteLink = async (code) => {
    setLoading(true);
    setError(null);
    try {
      await linksAPI.deleteLink(code);
      // Safely update links state
      setLinks((prev) => {
        const previousLinks = Array.isArray(prev) ? prev : [];
        return previousLinks.filter((link) => link.shortCode !== code);
      });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete link");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  return {
    links: Array.isArray(links) ? links : [], // Ensure links is always an array
    loading,
    error,
    fetchLinks,
    createLink,
    deleteLink,
  };
};
