# Strapi Content Management Guide

This guide explains how to manage content in Strapi CMS for the Statehouse School website.

## Accessing Strapi Admin

1. Navigate to `http://localhost:1337/admin` (or your Strapi URL)
2. Log in with your admin credentials

## Content Types

### About the School (Single Type)

**Location**: Content Manager → Single Types → About the School

**Fields**:
- **School Name** (required): The official name of the school
- **History**: School history and background
- **Mission**: School mission statement
- **Vision**: School vision statement
- **Core Values**: School core values
- **Established Year**: Year the school was established
- **Logo**: School logo image
- **Profile Image**: Main school image for hero sections
- **Location**: School location (e.g., "Nairobi, Kenya")
- **Address**: Full physical address
- **Phone**: Contact phone number
- **Email**: Contact email address
- **Google Maps Embed URL**: Google Maps iframe embed URL
- **Social Media Links**: Facebook, Twitter, Instagram, LinkedIn, YouTube URLs

**How to Edit**:
1. Go to Content Manager → Single Types → About the School
2. Click "Edit" or create if it doesn't exist
3. Fill in the fields
4. Click "Save" then "Publish"

### Announcements (Collection Type)

**Location**: Content Manager → Collection Types → Announcement

**Fields**:
- **Title** (required): Announcement title
- **Slug** (auto-generated): URL-friendly identifier
- **Content**: Rich text content (blocks)
- **Date**: Publication date
- **Category**: News, Notice, or Event
- **Image**: Featured image
- **Published**: Toggle to publish/unpublish

**How to Create**:
1. Go to Content Manager → Collection Types → Announcement
2. Click "Create new entry"
3. Fill in the fields
4. Click "Save" then "Publish"

**Tips**:
- Use descriptive titles
- Add images for better engagement
- Set appropriate categories
- Always publish when ready

### Staff Members (Collection Type)

**Location**: Content Manager → Collection Types → Staff Member

**Fields**:
- **Full Name** (required): Staff member's full name
- **Job Title** (required): Position/title
- **Category**: Staff category (e.g., "Teaching Staff", "Administration")
- **Photo**: Staff photo (can upload multiple)
- **Biography**: Rich text biography
- **Email**: Contact email (optional)
- **Phone**: Contact phone (optional)
- **Order**: Display order (for sorting)

**How to Create**:
1. Go to Content Manager → Collection Types → Staff Member
2. Click "Create new entry"
3. Fill in the fields
4. Select a category
5. Upload photo(s)
6. Click "Save" then "Publish"

### Staff Categories (Collection Type)

**Location**: Content Manager → Collection Types → Staff Category

**Fields**:
- **Name** (required): Category name (e.g., "Teaching Staff")
- **Description**: Category description
- **Order**: Display order

**How to Create**:
1. Create categories first before adding staff members
2. Common categories: "Teaching Staff", "Administration", "Support Staff"

### Academic Departments (Collection Type)

**Location**: Content Manager → Collection Types → Academic Department

**Fields**:
- **Name** (required): Department name
- **Description**: Department description
- **Head of Department**: Relation to Staff Member
- **Order**: Display order

**How to Create**:
1. Go to Content Manager → Collection Types → Academic Department
2. Click "Create new entry"
3. Fill in name and description
4. Link to a staff member as Head of Department
5. Set order for sorting
6. Click "Save" then "Publish"

### Gallery Albums (Collection Type)

**Location**: Content Manager → Collection Types → Gallery Album

**Fields**:
- **Title** (required): Album title
- **Description**: Album description (rich text)
- **Cover Image**: Album cover/thumbnail
- **Event Date**: Date of the event (optional)
- **Gallery Items**: Related gallery items

**How to Create**:
1. Go to Content Manager → Collection Types → Gallery Album
2. Click "Create new entry"
3. Add title and description
4. Upload cover image
5. Add gallery items (see below)
6. Click "Save" then "Publish"

### Gallery Items (Collection Type)

**Location**: Content Manager → Collection Types → Gallery Item

**Fields**:
- **Title**: Image title (optional)
- **Caption**: Image caption
- **Image** (required): The image file
- **Album**: Relation to Gallery Album
- **Order**: Display order within album

**How to Create**:
1. Go to Content Manager → Collection Types → Gallery Item
2. Click "Create new entry"
3. Upload image
4. Add title and caption if desired
5. Link to a Gallery Album
6. Set order
7. Click "Save" then "Publish"

### Admissions Page (Single Type)

**Location**: Content Manager → Single Types → Admissions Page

**Fields**:
- **Title** (required): Page title
- **Introduction**: Introduction content (rich text)
- **Process**: Admission process steps (rich text)
- **Contact Info**: Contact information (rich text)

**How to Edit**:
1. Go to Content Manager → Single Types → Admissions Page
2. Click "Edit"
3. Update content
4. Click "Save" then "Publish"

### Admission Requirements (Collection Type)

**Location**: Content Manager → Collection Types → Admission Requirement

**Fields**:
- **Title** (required): Requirement title
- **Description**: Requirement description
- **Order**: Display order

**How to Create**:
1. Go to Content Manager → Collection Types → Admission Requirement
2. Click "Create new entry"
3. Add title and description
4. Set order
5. Click "Save" then "Publish"

## Media Library

**Location**: Media Library

**How to Upload**:
1. Go to Media Library
2. Click "Upload" or drag and drop files
3. Supported formats: Images (JPG, PNG, GIF, WebP), Videos, PDFs

**Best Practices**:
- Use descriptive filenames
- Optimize images before uploading (recommended: max 1920px width)
- Use WebP format when possible for better performance

## API Tokens

**Location**: Settings → API Tokens

**How to Create**:
1. Go to Settings → API Tokens
2. Click "Create new API Token"
3. Name: "Frontend Token"
4. Token type: "Read-only"
5. Token duration: "Unlimited" (or set expiration)
6. Click "Save"
7. **Copy the token immediately** - it won't be shown again!

## Permissions

**Location**: Settings → Users & Permissions Plugin → Roles → Public

**Important**: Ensure the "Public" role has read permissions for:
- About the School
- Announcements
- Staff Members
- Staff Categories
- Academic Departments
- Gallery Albums
- Gallery Items
- Admissions Page
- Admission Requirements
- Learning Areas/Subjects
- CBC Pathways

## Publishing Workflow

1. **Draft**: Content is saved but not visible on the website
2. **Publish**: Content becomes visible on the website
3. **Unpublish**: Content is hidden but not deleted

**Tip**: Always click "Publish" after making changes, or use "Save as draft" to work on content before publishing.

## Common Tasks

### Updating School Information
1. Go to About the School
2. Edit fields
3. Save and Publish

### Adding a New Announcement
1. Go to Announcements
2. Create new entry
3. Fill in title, content, date, category
4. Add image
5. Save and Publish

### Adding a Staff Member
1. Ensure staff category exists
2. Go to Staff Members
3. Create new entry
4. Fill in details
5. Link to category
6. Upload photo
7. Save and Publish

### Creating a Gallery Album
1. Create Gallery Album
2. Add title and cover image
3. Create Gallery Items and link to album
4. Save and Publish

## Troubleshooting

### Content Not Appearing on Website
- Check if content is published (not just saved as draft)
- Verify API token is set correctly
- Check browser console for errors
- Ensure Strapi server is running

### Images Not Loading
- Check image URLs in Media Library
- Verify image permissions
- Check CORS settings in Strapi config

### API Errors
- Verify API token is valid
- Check token permissions
- Ensure Strapi URL is correct in frontend `.env.local`

## Need Help?

For additional support, refer to:
- [Strapi Documentation](https://docs.strapi.io)
- [Strapi Community](https://forum.strapi.io)
