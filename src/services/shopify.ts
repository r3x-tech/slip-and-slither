import axios from "axios";

// Function to retrieve a product from your Shopify store using the GraphQL API
export async function getProductFromShopify(
  productId: string,
  accessToken: string
): Promise<any | null> {
  const endpoint =
    "https://yhttps://c77256-c7.myshopify.com/admin/api/2023-04/graphql.json";

  const query = `
    query {
      product(id: "gid://shopify/Product/${productId}") {
        id
        title
        description
        variants(first: 1) {
          edges {
            node {
              id
              price
              image {
                originalSrc
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await axios.post(
      endpoint,
      { query },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": accessToken,
        },
      }
    );

    const responseData = response.data;
    if (responseData && responseData.data && responseData.data.product) {
      console.log("response:", response);
      console.log("responseData.data.product:", responseData.data.product);
      return responseData.data.product;
    } else {
      throw new Error("No product found");
    }
  } catch (error) {
    console.error("Error retrieving product:", error);
    return null;
  }
}
