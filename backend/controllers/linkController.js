const Link = require("../models/Link.js");
const { nanoid } = require("nanoid");
const { validateUrl, validateShortCode } = require("../utils/validation.js");

// Create Short Link
const createLink = async (req, res) => {
  try {
    const { originalUrl, shortCode } = req.body;

    // Validate URL
    if (!validateUrl(originalUrl)) {
      return res.status(400).json({ error: "Invalid URL provided" });
    }

    let finalShortCode = shortCode;
    if (!finalShortCode) {
      finalShortCode = nanoid(6);
    } else {
      if (!validateShortCode(finalShortCode)) {
        return res.status(400).json({
          error:
            "Short code must be 1-8 characters and contain only letters, numbers, hyphens, and underscores",
        });
      }

      const existingLink = await Link.findOne({
        where: { shortCode: finalShortCode },
      });
      if (existingLink) {
        return res.status(409).json({ error: "Short code already exists" });
      }
    }

    const link = await Link.create({
      shortCode: finalShortCode,
      originalUrl,
    });

    res.status(201).json({
      id: link.id,
      shortCode: link.shortCode,
      originalUrl: link.originalUrl,
      totalClicks: link.totalClicks, // 0 initially
      lastClicked: link.lastClicked, // null initially
      createdAt: link.createdAt,
      updatedAt: link.updatedAt,
    });
  } catch (error) {
    console.error("Create link error:", error);
    res.status(500).json({ error: "Failed to create link" });
  }
};

// Get All Links
const getAllLinks = async (req, res) => {
  try {
    const links = await Link.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(links);
  } catch (error) {
    console.error("Get all links error:", error);
    res.status(500).json({ error: "Failed to fetch links" });
  }
};

// Get Link Stats
const getLinkStats = async (req, res) => {
  try {
    const { code } = req.params;
    const link = await Link.findOne({ where: { shortCode: code } });

    if (!link) {
      return res.status(404).json({ error: "Link not found" });
    }

    res.status(200).json(link);
  } catch (error) {
    console.error("Get link stats error:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};

// Delete Link
const deleteLink = async (req, res) => {
  try {
    const { code } = req.params;
    const result = await Link.destroy({ where: { shortCode: code } });

    if (result === 0) {
      return res.status(404).json({ error: "Link not found" });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Delete link error:", error);
    res.status(500).json({ error: "Failed to delete link" });
  }
};

// ✅ REDIRECT LINK WITH CLICK TRACKING
const redirectLink = async (req, res) => {
  try {
    const { code } = req.params;
    const link = await Link.findOne({ where: { shortCode: code } });

    if (!link) {
      return res.status(404).json({ error: "Link not found" });
    }

    // 🔥 UPDATE CLICK STATISTICS
    link.totalClicks += 1;
    link.lastClicked = new Date();
    await link.save();

    console.log(`🔗 Redirect: ${code} -> ${link.originalUrl}`);
    console.log(
      `📊 Click count: ${link.totalClicks}, Last clicked: ${link.lastClicked}`
    );

    // Redirect to original URL
    res.redirect(302, link.originalUrl);
  } catch (error) {
    console.error("Redirect error:", error);
    res.status(500).json({ error: "Failed to redirect" });
  }
};

module.exports = {
  createLink,
  getAllLinks,
  getLinkStats,
  deleteLink,
  redirectLink,
};
