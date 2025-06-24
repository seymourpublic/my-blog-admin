// graphql/queries.js
import { gql } from '@apollo/client';

export const GET_SUMMARY = gql`
  query GetSummary {
    postsSummary {
      totalPosts
      drafts
      published
      pending
    }
    recentPosts {
      id
      title
      publishedAt
      updatedAt
      status
      category {
        id
        name
      }
      author {
        id
        name
      }
    }
  }
`;

export const GET_POSTS_PAGINATED = gql`
  query GetPostsPaginated(
    $first: Int
    $after: String
    $filter: PostFilter
    $search: String
  ) {
    posts(first: $first, after: $after, filter: $filter, search: $search) {
      edges {
        node {
          id
          title
          excerpt
          status
          publishedAt
          updatedAt
          featuredImage {
            url
            alt
            width
            height
          }
          category {
            id
            name
            slug
          }
          tags {
            id
            name
            slug
          }
          author {
            id
            name
            avatar
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

export const GET_CATEGORIES_WITH_POSTS = gql`
  query GetCategoriesWithPosts {
    categories {
      id
      name
      slug
      description
      parentId
      postCount
      children {
        id
        name
        slug
        postCount
      }
    }
  }
`;

export const GET_TAGS = gql`
  query GetTags($search: String) {
    tags(search: $search) {
      id
      name
      slug
      postCount
      description
    }
  }
`;

export const GET_POST_BY_ID = gql`
  query GetPostById($id: ID!) {
    post(id: $id) {
      id
      title
      content
      excerpt
      status
      publishedAt
      updatedAt
      createdAt
      slug
      featuredImage {
        url
        alt
        width
        height
      }
      category {
        id
        name
        slug
      }
      tags {
        id
        name
        slug
      }
      author {
        id
        name
        email
        avatar
      }
      seo {
        title
        description
        keywords
      }
    }
  }
`;

// Mutations
export const CREATE_POST = gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      id
      title
      slug
      status
      createdAt
    }
  }
`;

export const UPDATE_POST = gql`
  mutation UpdatePost($id: ID!, $input: UpdatePostInput!) {
    updatePost(id: $id, input: $input) {
      id
      title
      slug
      status
      updatedAt
    }
  }
`;

export const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id) {
      success
      message
    }
  }
`;

export const CREATE_CATEGORY = gql`
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      id
      name
      slug
      parentId
    }
  }
`;

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($id: ID!, $input: UpdateCategoryInput!) {
    updateCategory(id: $id, input: $input) {
      id
      name
      slug
      parentId
    }
  }
`;

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id) {
      success
      message
    }
  }
`;

export const CREATE_TAG = gql`
  mutation CreateTag($input: CreateTagInput!) {
    createTag(input: $input) {
      id
      name
      slug
    }
  }
`;

export const UPDATE_TAG = gql`
  mutation UpdateTag($id: ID!, $input: UpdateTagInput!) {
    updateTag(id: $id, input: $input) {
      id
      name
      slug
    }
  }
`;

export const DELETE_TAG = gql`
  mutation DeleteTag($id: ID!) {
    deleteTag(id: $id) {
      success
      message
    }
  }
`;

export const UPLOAD_IMAGE = gql`
  mutation UploadImage($file: Upload!) {
    uploadImage(file: $file) {
      url
      alt
      width
      height
      filename
      size
    }
  }
`;