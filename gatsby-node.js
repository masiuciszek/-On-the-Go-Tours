/* eslint-disable no-shadow */
const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions
  const blogListTemplate = path.resolve(`src/templates/blog-list.tsx`)
  const blogPostTemplate = path.resolve(`src/templates/blog-post.tsx`)
  const singleTourTemplate = path.resolve(`src/templates/single-tour.tsx`)

  const result = await graphql(`
    query {
      allMarkdownRemark(
        sort: { fields: [frontmatter___date], order: DESC }
        limit: 1000
      ) {
        edges {
          node {
            frontmatter {
              title
              path
              date(formatString: "MMMM DD YYYY")
              spoiler
            }
            id
            html
            excerpt
          }
        }
      }
      allContentfulTrips {
        edges {
          node {
            id
            title
            desc
            slug
            price
          }
        }
      }
    }
  `)

  const posts = result.data.allMarkdownRemark.edges
  const trips = result.data.allContentfulTrips.edges

  const postsPerPage = 6
  const numPages = Math.ceil(posts.length / postsPerPage)
  Array.from({ length: numPages }).forEach((_, i) => {
    createPage({
      path: i === 0 ? 'blog-list' : `/blog-list/${i + 1}`,
      component: blogListTemplate,
      context: {
        limit: postsPerPage,
        skip: i * postsPerPage,
        numPages,
        currentPage: i + 1,
      },
    })
  })

  posts.forEach(({ node }, index) => {
    const { path } = node.frontmatter
    createPage({
      path: `/blog${node.frontmatter.path}`,
      component: blogPostTemplate,
      context: {
        pathSlug: path,
        prev: index === 0 ? null : posts[index - 1].node,
        next: index === posts.length - 1 ? null : posts[index + 1].node,
      },
    })
  })

  trips.forEach(({ node }, index) => {
    const { slug } = node
    createPage({
      path: `/tours${slug}`,
      component: singleTourTemplate,
      context: {
        pathSlug: slug,
      },
    })
  })
}

// exports.onCreateNode = ({ node, actions, getNode }) => {
//   const { createNodeField } = actions
//   if (node.internal.type === `MarkdownRemark`) {
//     const value = createFilePath({ node, getNode })
//     createNodeField({
//       name: `slug`,
//       node,
//       value,
//     })
//   }
// }
