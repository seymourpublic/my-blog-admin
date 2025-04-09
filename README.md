# VersaBlog Admin Dashboard

The VersaBlog Admin Dashboard is a modern, responsive, and feature-rich management interface for the VersaBlog platform. Administrators can manage posts, categories, tags, and view helpful analytics via a GraphQL-powered Next.js application.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Components](#components)
- [GraphQL API](#graphql-api)
- [Contributing](#contributing)
- [License](#license)

## Overview

This admin dashboard is built using **Next.js** and **Apollo Client** for seamless integration with your VersaBlog GraphQL backend API. The interface is designed using a modern, card-based layout with clean typography and intuitive interactions. It includes pages to manage posts, categories, and tags, along with filtering and search capabilities.

## Features

- **Dashboard Overview:**  
  - Display summary statistics and recent activity for posts.
- **Posts Management:**  
  - Create, view, edit, and delete posts.  
  - Auto-generate URL-friendly slugs from post titles.  
  - Filter and search posts by keywords, status, date ranges, and category.
- **Categories & Tags Management:**  
  - Create, update, and delete categories (with support for hierarchical structures).
  - Create and manage tags.
  - Auto-generate slugs for categories.
- **Responsive Design:**  
  - Modern, responsive layouts designed with card-based UI and soft shadows.
- **GraphQL Integration:**  
  - Powered by Apollo Client for efficient queries and mutations.

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/your-username/versa-blog-admin.git
   cd versa-blog-admin
Install Dependencies:

npm install

(Optional) Install Additional Dependencies:

If you need React Icons (used in the navigation):

    npm install react-icons

## Configuration

    Create a .env.local file in the project root to configure your environment variables. For example:

    NEXT_PUBLIC_API_URL=http://localhost:4000/graphql/v1

        Set NEXT_PUBLIC_API_URL to point to your VersaBlog GraphQL backend endpoint.

## Usage

    Start the Development Server:

    npm run dev

    Open in Your Browser:

    Open http://localhost:3000 in your web browser to view the dashboard.

    Navigation:

        Use the sidebar to navigate between Dashboard, Posts, and Categories & Tags.

        Create new posts, new categories, or new tags via the provided quick actions.

    GraphQL Integration:

        The front-end uses Apollo Client for queries and mutations. Make sure your backend is running at the endpoint specified in your .env.local.

## Project Structure

versa-blog-admin/
├── components/
│   ├── Layout.js             // Application layout and navigation
│   ├── DashboardOverview.js  // Dashboard summary statistics and recent activity
│   ├── FilterBar.js          // Search and filtering controls for posts
│   ├── PostsTable.js         // Posts table with inline actions
│   ├── CategoryTree.js       // Hierarchical display of categories
│   └── TagList.js            // List view of tags
├── pages/
│   ├── _app.js               // Custom App component with ApolloProvider
│   ├── index.js              // Dashboard home page
│   ├── posts.js              // Posts management page
│   ├── posts/new.js          // Create new post form
│   ├── posts/[id].js         // View post details (dynamic route)
│   ├── posts/[id]/edit.js    // Edit post page (dynamic route)
│   ├── categories.js         // Categories & tags management page
│   ├── categories/new.js     // Create new category form
│   └── tags/new.js           // Create new tag form
├── apollo-client.js          // Apollo Client configuration
├── package.json              // Project configuration and scripts
└── styles/
    └── globals.css           // Global CSS styles

## Components

    Layout.js:
    Provides navigation and a consistent layout across all pages. The design includes a vertical sidebar styled with React Icons.

    DashboardOverview.js:
    Displays key statistics (total posts, drafts, published, pending reviews) and a recent activity feed.

    PostsTable.js:
    Shows a styled table for managing posts with inline actions (view, edit, delete) and editable category dropdowns.

    FilterBar.js:
    Provides controls for filtering and searching posts by keyword, status, date range, and category.

    CategoryTree.js & TagList.js:
    Render category hierarchies and tag lists with modern UI components.

## GraphQL API

The dashboard interacts with a GraphQL backend via the following key queries and mutations:

    Queries:

        GetPosts: Returns filtered posts.

        GetCategories: Returns a list of categories.

        GetTags: Returns a list of tags.

        GetSummary: Returns summary statistics and recent posts (used on DashboardOverview).

    Mutations:

        CreatePost: To create a new post (with auto-generated slug and optional category assignment).

        CreateCategory: To create a new category (with auto-generated slug).

        CreateTag: To create a new tag.

        DeletePost, UpdatePostCategory, and others for post management.

Ensure your backend is fully configured and running so that these operations function properly.
Contributing

Contributions are welcome! Please follow these steps for contributions:

    Fork the repository.

    Create a feature branch: git checkout -b feature/your-feature-name

    Commit your changes: git commit -am 'Add new feature'

    Push to the branch: git push origin feature/your-feature-name

    Create a new Pull Request.

License

This project is licensed under the MIT License.